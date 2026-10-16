// Borland Turbo Debugger symbol information (TDInfo) parser.
// Struct layout follows ramikg/tdinfo-parser (tdinfo_structs.py).
// KOREA.EXE (Turbo Pascal 6.0) has a version 2.8 TDInfo block appended after the load image.

import { cstr } from './binary.ts';

export const TYPE_KIND: Record<number, string> = {
  0: 'void', 1: 'lstr', 2: 'dstr', 3: 'pstr', 4: 'schar', 5: 'sint', 6: 'slong', 8: 'uchar', 9: 'uint',
  10: 'ulong', 12: 'pchar', 13: 'float', 14: 'real48', 15: 'double', 16: 'ldouble', 21: 'near', 22: 'far',
  23: 'seg', 26: 'array', 28: 'parray', 30: 'struct', 31: 'union', 34: 'enum', 35: 'func', 36: 'label',
  37: 'set', 38: 'tfile', 39: 'bfile', 40: 'bool', 41: 'penum', 44: 'funcproto', 45: 'specialfunc',
  46: 'object', 52: 'nref', 53: 'fref', 54: 'wordbool', 55: 'longbool',
};

export const SYMBOL_CLASS = ['static', 'absolute', 'auto', 'pascal_var', 'register', 'constant', 'typedef', 'struct_union_enum'];

export interface TdHeader {
  minorVersion: number;
  majorVersion: number;
  namesPoolSize: number;
  counts: Record<string, number>;
}
export interface TdSymbol { nameIndex: number; typeIndex: number; offset: number; segment: number; symbolClass: number; }
export interface TdModule { nameIndex: number; }
export interface TdScope { symbolIndex: number; symbolCount: number; parent: number; func: number; offset: number; length: number; }
export interface TdSegment { module: number; codeSegment: number; codeOffset: number; codeLength: number; scopeIndex: number; scopeCount: number; }
export interface TdType { id: number; nameIndex: number; size: number; classType: number; memberType: number; }
export interface TdMember { info: number; nameIndex: number; typeIndex: number; }

export interface TdInfo {
  header: TdHeader;
  symbols: TdSymbol[];
  modules: TdModule[];
  scopes: TdScope[];
  segments: TdSegment[];
  types: TdType[];
  members: TdMember[];
  names: string[]; // 1-based (names[0] is '')
}

export function parseTdInfo(exe: Buffer, base: number): TdInfo {
  let p = base;
  const u8 = () => exe[p++];
  const u16 = () => { const v = exe.readUInt16LE(p); p += 2; return v; };
  if (u16() !== 0x52fb) throw new Error('TDInfo magic 0x52FB not found');
  const minorVersion = u8();
  const majorVersion = u8();
  const namesPoolSize = exe.readUInt32LE(p); p += 4;
  const keys = ['names', 'types', 'members', 'symbols', 'globals', 'modules', 'locals', 'scopes', 'lineNumbers', 'sourceFiles', 'segments', 'correlations'];
  const counts: Record<string, number> = {};
  for (const k of keys) counts[k] = u16();
  p += 14;
  const extensionSize = u16();
  p += extensionSize;

  const symbols: TdSymbol[] = [];
  for (let i = 0; i < counts.symbols; i++) {
    symbols.push({ nameIndex: u16(), typeIndex: u16(), offset: u16(), segment: u16(), symbolClass: u8() & 7 });
  }
  const modules: TdModule[] = [];
  for (let i = 0; i < counts.modules; i++) { modules.push({ nameIndex: u16() }); p += 14; }
  p += counts.sourceFiles * 6 + counts.lineNumbers * 4;
  const scopes: TdScope[] = [];
  for (let i = 0; i < counts.scopes; i++) {
    scopes.push({ symbolIndex: u16(), symbolCount: u16(), parent: u16(), func: u16(), offset: u16(), length: u16() });
  }
  const segments: TdSegment[] = [];
  for (let i = 0; i < counts.segments; i++) {
    segments.push({ module: u16(), codeSegment: u16(), codeOffset: u16(), codeLength: u16(), scopeIndex: u16(), scopeCount: u16() });
    p += 4;
  }
  p += counts.correlations * 8;
  const types: TdType[] = [];
  for (let i = 0; i < counts.types; i++) types.push({ id: u8(), nameIndex: u16(), size: u16(), classType: u8(), memberType: u16() });
  const members: TdMember[] = [];
  for (let i = 0; i < counts.members; i++) members.push({ info: u8(), nameIndex: u16(), typeIndex: u16() });

  const names = [''];
  let q = exe.length - namesPoolSize;
  for (let i = 0; i < counts.names; i++) { const [s, next] = cstr(exe, q); names.push(s); q = next; }

  return { header: { minorVersion, majorVersion, namesPoolSize, counts }, symbols, modules, scopes, segments, types, members, names };
}

// ---------- Higher level views ----------

export interface TypeDesc {
  kind: string;
  name?: string;
  size: number;
  element?: TypeDesc;
  count?: number;
  fields?: { name: string; offset: number; type: TypeDesc }[];
  values?: { name: string; value: number }[];
  maxLength?: number;
}

export function typeName(td: TdInfo, typeIndex: number): string {
  const t = td.types[typeIndex - 1];
  return t && t.nameIndex ? td.names[t.nameIndex] : '';
}

function membersOf(td: TdInfo, first: number): TdMember[] {
  const out: TdMember[] = [];
  for (let i = first - 1; i >= 0 && i < td.members.length; i++) {
    out.push(td.members[i]);
    if (td.members[i].info & 0x80) break; // high bit marks the last member
  }
  return out;
}

export function describeType(td: TdInfo, typeIndex: number, depth = 0): TypeDesc {
  const t = td.types[typeIndex - 1];
  if (!t) return { kind: 'void', size: 0 };
  const kind = TYPE_KIND[t.id] ?? `id${t.id}`;
  const name = t.nameIndex ? td.names[t.nameIndex] : undefined;
  const d: TypeDesc = { kind, size: t.size };
  if (name) d.name = name;
  if (depth > 6) return d;
  if (kind === 'array' || kind === 'parray') {
    const el = describeType(td, t.memberType, depth + 1);
    d.element = el;
    d.count = el.size ? t.size / el.size : 0;
  } else if (kind === 'struct') {
    let off = 0;
    d.fields = membersOf(td, t.memberType).map((m) => {
      const ft = describeType(td, m.typeIndex, depth + 1);
      const f = { name: td.names[m.nameIndex], offset: off, type: ft };
      off += ft.size; // Turbo Pascal records are byte packed
      return f;
    });
  } else if (kind === 'enum') {
    d.values = membersOf(td, t.memberType).map((m) => ({ name: td.names[m.nameIndex], value: m.typeIndex }));
  } else if (kind === 'pstr') {
    d.maxLength = t.size - 1;
  }
  return d;
}

export function typeToString(d: TypeDesc): string {
  if (d.kind === 'pstr') return `string[${d.maxLength}]`;
  if ((d.kind === 'array' || d.kind === 'parray') && d.element) return `${d.name ? d.name + ' = ' : ''}array[${d.count}] of ${d.element.name ?? typeToString(d.element)}`;
  if (d.kind === 'struct') return `${d.name ?? 'record'}{${(d.fields ?? []).map((f) => `${f.name}@${f.offset}:${f.type.name ?? typeToString(f.type)}`).join(', ')}}`;
  return d.name ?? `${d.kind}(${d.size})`;
}

export interface ModuleInfo { index: number; name: string; codeSegment: number; codeLength: number; scope?: TdScope; }

export function moduleList(td: TdInfo): ModuleInfo[] {
  return td.modules.map((m, i) => {
    const seg = td.segments.find((s) => s.module === i + 1);
    return {
      index: i,
      name: td.names[m.nameIndex],
      codeSegment: seg?.codeSegment ?? -1,
      codeLength: seg?.codeLength ?? 0,
      scope: seg ? td.scopes[seg.scopeIndex - 1] : undefined,
    };
  });
}

function symbolModule(td: TdInfo, mods: ModuleInfo[]): (symIdx: number) => string {
  const ranges = mods.filter((m) => m.scope).map((m) => ({ name: m.name, from: m.scope!.symbolIndex - 1, to: m.scope!.symbolIndex - 1 + m.scope!.symbolCount }));
  return (i) => ranges.find((r) => i >= r.from && i < r.to)?.name ?? '';
}

export interface ProcInfo { module: string; name: string; segment: number; offset: number; length: number; }

/** All procedures/functions with entry points; length is the distance to the next entry point in the same segment. */
export function procedures(td: TdInfo): ProcInfo[] {
  const mods = moduleList(td);
  const modOf = symbolModule(td, mods);
  const list: ProcInfo[] = [];
  const seen = new Set<string>();
  td.symbols.forEach((s, i) => {
    const t = td.types[s.typeIndex - 1];
    if (!t || TYPE_KIND[t.id] !== 'func') return;
    const name = td.names[s.nameIndex];
    const key = `${s.segment}:${s.offset}:${name}`;
    if (seen.has(key)) return;
    seen.add(key);
    list.push({ module: modOf(i) || '(nested)', name, segment: s.segment, offset: s.offset, length: 0 });
  });
  list.sort((a, b) => a.segment - b.segment || a.offset - b.offset);
  const segLen = new Map(mods.map((m) => [m.codeSegment, m.codeLength]));
  list.forEach((p, i) => {
    const next = list[i + 1];
    const end = next && next.segment === p.segment ? next.offset : (segLen.get(p.segment) ?? p.offset);
    p.length = end - p.offset;
  });
  return list;
}

export interface GlobalInfo { module: string; name: string; offset: number; size: number; type: string; desc: TypeDesc; }

/** Static variables that live in the given data segment. */
export function globals(td: TdInfo, dataSegment: number): GlobalInfo[] {
  const mods = moduleList(td);
  const modOf = symbolModule(td, mods);
  const out: GlobalInfo[] = [];
  td.symbols.forEach((s, i) => {
    if (s.segment !== dataSegment || s.symbolClass !== 0) return;
    const desc = describeType(td, s.typeIndex);
    out.push({ module: modOf(i), name: td.names[s.nameIndex], offset: s.offset, size: desc.size, type: typeToString(desc), desc });
  });
  return out.sort((a, b) => a.offset - b.offset);
}

export interface ConstInfo { module: string; name: string; value: number; }

export function constants(td: TdInfo): ConstInfo[] {
  const mods = moduleList(td);
  const modOf = symbolModule(td, mods);
  const out: ConstInfo[] = [];
  td.symbols.forEach((s, i) => {
    if (s.symbolClass === 5) out.push({ module: modOf(i), name: td.names[s.nameIndex], value: s.offset });
  });
  return out;
}

/** Finds the data segment as the segment of a well known global. */
export function findDataSegment(td: TdInfo, globalName = 'UNITS'): number {
  const s = td.symbols.find((x) => td.names[x.nameIndex] === globalName && x.symbolClass === 0);
  if (!s) throw new Error(`global ${globalName} not found`);
  return s.segment;
}
