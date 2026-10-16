// Collects every Pascal string literal referenced by the game code (UI text, messages, names),
// grouped by procedure. Output: data/extracted/ui_strings.json (base material for Korean localization).

const fs = require('fs');
const path = require('path');
const { Decoder, DecoderOptions, OpKind, Register } = require('../vendor/iced-x86/iced_x86.js');

const ROOT = path.resolve(__dirname, '..', '..');
const sym = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'extracted', 'symbols.json'), 'utf8'));
const EXE = process.env.KOREA_EXE || path.join(ROOT, '..', 'Conflict-Korea-The-First-Year-1950-51_DOS_EN', 'confkorea', 'KOREA.EXE');
const exe = fs.readFileSync(EXE);
const IMG = sym.mz.imageStart;
const RUNTIME = new Set(['GRAPH', 'DOS', 'CRT', 'SYSTEM']);

const out = [];
const seen = new Set();
for (const p of sym.procedures) {
  if (RUNTIME.has(p.module)) continue;
  const start = IMG + p.segment * 16 + p.offset;
  const dec = new Decoder(16, exe.subarray(start, start + p.length), DecoderOptions.None);
  dec.ip = BigInt(p.offset);
  while (dec.canDecode) {
    const ins = dec.decode();
    // Turbo Pascal loads string literal addresses as `mov di,offset` followed by `push cs; push di`
    for (let i = 1; i < ins.opCount; i++) {
      if (ins.opKind(i) !== OpKind.Immediate16 || ins.op0Kind !== OpKind.Register || ins.op0Register !== Register.DI) continue;
      const imm = ins.immediate16;
      if (imm < 0x10) continue;
      const so = IMG + p.segment * 16 + imm;
      const len = exe[so];
      if (!(len > 0 && len < 200 && so + len < exe.length)) continue;
      const text = exe.toString('latin1', so + 1, so + 1 + len);
      if (!/^[\x20-\x7e]+$/.test(text) || (len < 2 && !/[A-Za-z]/.test(text))) continue;
      const key = `${p.segment}:${imm}`;
      if (seen.has(key)) continue;
      seen.add(key);
      out.push({ module: p.module, proc: p.name, addr: `${p.segment.toString(16)}:${imm.toString(16)}`, text });
    }
  }
}
const file = path.join(ROOT, 'data', 'extracted', 'ui_strings.json');
fs.writeFileSync(file, JSON.stringify(out, null, 1));
console.log(`${out.length} strings -> ${file}`);
