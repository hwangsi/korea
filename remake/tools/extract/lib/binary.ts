// Small helpers for reading DOS-era binary data (little endian, Turbo Pascal strings)

/** Turbo Pascal string[N]: 1 length byte followed by N bytes of storage. */
export function pstr(buf: Uint8Array, off: number, maxLen: number): string {
  const n = Math.min(buf[off] ?? 0, maxLen);
  let s = '';
  for (let i = 0; i < n; i++) s += String.fromCharCode(buf[off + 1 + i]);
  return s;
}

export function i16(buf: Buffer, off: number): number {
  return buf.readInt16LE(off);
}

export function u16(buf: Buffer, off: number): number {
  return buf.readUInt16LE(off);
}

/** Reads a zero-terminated latin1 string. Returns the string and the offset after the terminator. */
export function cstr(buf: Buffer, off: number): [string, number] {
  let end = off;
  while (end < buf.length && buf[end] !== 0) end++;
  return [buf.toString('latin1', off, end), end + 1];
}
