// DOS MZ executable header

export interface MzHeader {
  lastPageBytes: number;
  pages: number;
  relocations: number;
  headerParagraphs: number;
  ss: number;
  sp: number;
  ip: number;
  cs: number;
  relocTableOffset: number;
}

export function readMzHeader(exe: Buffer): MzHeader {
  if (exe.toString('latin1', 0, 2) !== 'MZ') throw new Error('not an MZ executable');
  return {
    lastPageBytes: exe.readUInt16LE(2),
    pages: exe.readUInt16LE(4),
    relocations: exe.readUInt16LE(6),
    headerParagraphs: exe.readUInt16LE(8),
    ss: exe.readUInt16LE(14),
    sp: exe.readUInt16LE(16),
    ip: exe.readUInt16LE(20),
    cs: exe.readUInt16LE(22),
    relocTableOffset: exe.readUInt16LE(24),
  };
}

/** File offset of the load image (segment 0 of the program). */
export function imageStart(h: MzHeader): number {
  return h.headerParagraphs * 16;
}

/** File offset just after the load image. Anything after it is appended data (here: Turbo Debugger info). */
export function imageEnd(h: MzHeader): number {
  return (h.pages - 1) * 512 + (h.lastPageBytes || 512);
}
