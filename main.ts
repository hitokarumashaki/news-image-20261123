import * as f from 'node:fs';
import * as p from 'node:path';
import { fileURLToPath } from 'node:url';

// News image entry: copies the pre-rendered 23 Nov 2026 world news
// summary image from the repository to the harness output directory.
// The image is a fixed asset (deterministic, no network): the same
// bytes are written on every run.
const HERE = p.dirname(fileURLToPath(import.meta.url));
const SRC = p.join(HERE, 'entry.png');
const OUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
const DEST = p.join(OUT_DIR, 'entry.png');

f.mkdirSync(OUT_DIR, { recursive: true });
f.copyFileSync(SRC, DEST);

// Verify the copy: the output must be a PNG of at most 1 MiB.
const buf = f.readFileSync(DEST);
const PNG_MAGIC = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
if (!buf.subarray(0, 8).equals(PNG_MAGIC)) throw new Error('output is not a PNG');
if (buf.length > 1024 * 1024) throw new Error('output exceeds 1 MiB');
console.log(`wrote ${DEST} (${buf.length} bytes)`);
