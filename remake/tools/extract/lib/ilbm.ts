// IFF ILBM (Deluxe Paint) decoder: BMHD + CMAP + BODY with ByteRun1 compression.

export interface IndexedImage {
  width: number;
  height: number;
  palette: [number, number, number][];
  pixels: Uint8Array; // palette indices, row major
}

export function decodeIlbm(buf: Buffer): IndexedImage {
  if (buf.toString('latin1', 0, 4) !== 'FORM' || buf.toString('latin1', 8, 12) !== 'ILBM') throw new Error('not an ILBM file');
  const chunks = new Map<string, { off: number; len: number }>();
  let p = 12;
  while (p + 8 <= buf.length) {
    const id = buf.toString('latin1', p, p + 4);
    const len = buf.readUInt32BE(p + 4);
    if (!chunks.has(id)) chunks.set(id, { off: p + 8, len });
    p += 8 + len + (len & 1);
  }
  const bmhd = chunks.get('BMHD');
  const cmap = chunks.get('CMAP');
  const body = chunks.get('BODY');
  if (!bmhd || !cmap || !body) throw new Error('missing ILBM chunks');
  const width = buf.readUInt16BE(bmhd.off);
  const height = buf.readUInt16BE(bmhd.off + 2);
  const planes = buf[bmhd.off + 8];
  const compression = buf[bmhd.off + 10];

  const palette: [number, number, number][] = [];
  for (let i = 0; i + 2 < cmap.len; i += 3) palette.push([buf[cmap.off + i], buf[cmap.off + i + 1], buf[cmap.off + i + 2]]);

  const rowBytes = ((width + 15) >> 4) << 1;
  const pixels = new Uint8Array(width * height);
  const line = new Uint8Array(rowBytes);
  let q = body.off;
  const end = body.off + body.len;
  for (let y = 0; y < height; y++) {
    for (let plane = 0; plane < planes; plane++) {
      if (compression === 1) {
        let n = 0;
        while (n < rowBytes && q < end) {
          const c = buf.readInt8(q++);
          if (c >= 0) { for (let k = 0; k <= c; k++) line[n++] = buf[q++]; }
          else if (c !== -128) { const v = buf[q++]; for (let k = 0; k < 1 - c; k++) line[n++] = v; }
        }
      } else {
        for (let n = 0; n < rowBytes; n++) line[n] = buf[q++];
      }
      const bit = 1 << plane;
      for (let x = 0; x < width; x++) if (line[x >> 3] & (0x80 >> (x & 7))) pixels[y * width + x] |= bit;
    }
  }
  return { width, height, palette, pixels };
}
