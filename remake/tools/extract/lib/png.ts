// Minimal PNG encoder for indexed (palette) images, using node:zlib.

import { deflateSync } from 'node:zlib';
import type { IndexedImage } from './ilbm.ts';

const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();

function crc32(buf: Uint8Array): number {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type: string, data: Buffer): Buffer {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const td = Buffer.concat([Buffer.from(type, 'latin1'), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(td));
  return Buffer.concat([len, td, crc]);
}

/** Encodes an indexed image. `scaleY` repeats rows (EGA 640x200 pixels are ~2.4x taller than wide). */
export function encodeIndexedPng(img: IndexedImage, scaleY = 1): Buffer {
  const { width, height, palette, pixels } = img;
  const outH = height * scaleY;
  const raw = Buffer.alloc((width + 1) * outH);
  for (let y = 0; y < outH; y++) {
    const src = Math.floor(y / scaleY) * width;
    raw[y * (width + 1)] = 0;
    for (let x = 0; x < width; x++) raw[y * (width + 1) + 1 + x] = pixels[src + x];
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(outH, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 3; // indexed color
  const plte = Buffer.alloc(palette.length * 3);
  palette.forEach((c, i) => { plte[i * 3] = c[0]; plte[i * 3 + 1] = c[1]; plte[i * 3 + 2] = c[2]; });
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('PLTE', plte),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}
