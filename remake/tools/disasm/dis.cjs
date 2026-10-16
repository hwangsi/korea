// Symbol-annotated 16-bit disassembler for KOREA.EXE (uses vendored iced-x86, MIT license).
// Requires data/extracted/symbols.json (run tools/extract/extract.ts first).
//
//   node tools/disasm/dis.cjs GET_TERRAIN          -> print one procedure
//   node tools/disasm/dis.cjs --module GRCMBT      -> print every procedure of a module
//   node tools/disasm/dis.cjs --all out/asm        -> write one .asm file per module
//
// Annotations: far/near call targets (procedure names), DS:xxxx globals, Pascal string literals in CS.

const fs = require('fs');
const path = require('path');
const { Decoder, DecoderOptions, Formatter, FormatterSyntax, OpKind, Register } = require('../vendor/iced-x86/iced_x86.js');

const ROOT = path.resolve(__dirname, '..', '..');
const SYM = path.join(ROOT, 'data', 'extracted', 'symbols.json');
const EXE = process.env.KOREA_EXE || path.join(ROOT, '..', 'Conflict-Korea-The-First-Year-1950-51_DOS_EN', 'confkorea', 'KOREA.EXE');

const exe = fs.readFileSync(EXE);
const sym = JSON.parse(fs.readFileSync(SYM, 'utf8'));
const IMG = sym.mz.imageStart;
const RUNTIME = new Set(['GRAPH', 'DOS', 'CRT', 'SYSTEM']);

const procByAddr = new Map(sym.procedures.map((p) => [`${p.segment}:${p.offset}`, p]));
const globalsSorted = [...sym.globals].sort((a, b) => a.offset - b.offset);

function globalName(off) {
  let best = null;
  for (const g of globalsSorted) { if (g.offset <= off) best = g; else break; }
  if (best && off < best.offset + Math.max(best.size, 1)) return off === best.offset ? best.name : `${best.name}+${(off - best.offset).toString(16)}h`;
  return null;
}

function pascalStringAt(seg, off) {
  const so = IMG + seg * 16 + off;
  const len = exe[so];
  if (!(len > 0 && len < 200 && so + len < exe.length)) return null;
  const s = exe.toString('latin1', so + 1, so + 1 + len);
  return /^[\x20-\x7e]+$/.test(s) ? s : null;
}

function disasmProc(p) {
  const start = IMG + p.segment * 16 + p.offset;
  const dec = new Decoder(16, exe.subarray(start, start + p.length), DecoderOptions.None);
  dec.ip = BigInt(p.offset);
  const fmt = new Formatter(FormatterSyntax.Masm);
  const lines = [`; ---- ${p.module}.${p.name}  ${p.segment.toString(16)}:${p.offset.toString(16)}  (${p.length} bytes)`];
  while (dec.canDecode) {
    const ins = dec.decode();
    const text = fmt.format(ins);
    const notes = [];
    if (ins.op0Kind === OpKind.FarBranch16) {
      const t = procByAddr.get(`${ins.farBranchSelector}:${ins.farBranch16}`);
      notes.push(t ? `${t.module}.${t.name}` : `far ${ins.farBranchSelector.toString(16)}:${ins.farBranch16.toString(16)}`);
    } else if (ins.op0Kind === OpKind.NearBranch16 && text.startsWith('call')) {
      const t = procByAddr.get(`${p.segment}:${Number(ins.nearBranch16)}`);
      if (t) notes.push(`${t.module}.${t.name}`);
    }
    for (let i = 0; i < ins.opCount; i++) {
      const k = ins.opKind(i);
      if (k === OpKind.Memory && ins.memoryBase !== Register.BP && ins.memoryBase !== Register.SP && ins.memorySegment !== Register.SS) {
        const disp = Number(ins.memoryDisplacement) & 0xffff;
        const g = disp >= 0x200 ? globalName(disp) : null;
        if (g) notes.push(ins.memoryBase === Register.None && ins.memoryIndex === Register.None ? `[${g}]` : `[${g} + reg]`);
      }
      // Turbo Pascal loads string literal addresses as `mov di,offset` followed by `push cs; push di`
      if (k === OpKind.Immediate16 && i === 1 && ins.op0Kind === OpKind.Register && ins.op0Register === Register.DI && ins.immediate16 >= 0x10) {
        const s = pascalStringAt(p.segment, ins.immediate16);
        if (s && (s.length > 1 || /[A-Za-z]/.test(s))) notes.push(JSON.stringify(s));
      }
    }
    lines.push(`${Number(ins.ip).toString(16).padStart(4, '0')}  ${text.padEnd(46)}${notes.length ? '; ' + notes.join(' ') : ''}`);
  }
  return lines.join('\n');
}

const args = process.argv.slice(2);
if (!args.length) {
  console.log('usage: node tools/disasm/dis.cjs <PROC> [PROC...] | --module <NAME> | --all <outDir>');
  process.exit(0);
}
if (args[0] === '--all') {
  const dir = path.resolve(args[1] || path.join(ROOT, 'data', 'extracted', 'asm'));
  fs.mkdirSync(dir, { recursive: true });
  const byModule = new Map();
  for (const p of sym.procedures) if (!RUNTIME.has(p.module)) (byModule.get(p.module) || byModule.set(p.module, []).get(p.module)).push(p);
  for (const [m, ps] of byModule) fs.writeFileSync(path.join(dir, `${m}.asm`), ps.map(disasmProc).join('\n\n') + '\n');
  console.log(`wrote ${byModule.size} module listings to ${dir}`);
} else if (args[0] === '--module') {
  for (const p of sym.procedures.filter((x) => x.module === args[1])) console.log(disasmProc(p) + '\n');
} else {
  for (const n of args) {
    const p = sym.procedures.find((x) => x.name === n.toUpperCase());
    if (!p) { console.error(`unknown procedure ${n}`); continue; }
    console.log(disasmProc(p) + '\n');
  }
}
