// Cat Reviews Its Human — v1-local entrypoint.
//
// The review itself lives in entry.txt next to this file. This script
// only carries it, untouched, to wherever the grader wants it: the
// folder named by MAKEFUN_OUTPUT_DIR, or a local out/ folder when the
// variable is absent. Nothing is trimmed, reworded or re-wrapped, so
// two runs of this program always produce the same bytes.

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const MAX_CHARS = 200;

async function main(): Promise<void> {
  const here = dirname(fileURLToPath(import.meta.url));
  const source = join(here, 'entry.txt');
  const targetDir = process.env.MAKEFUN_OUTPUT_DIR
    ? resolve(process.env.MAKEFUN_OUTPUT_DIR)
    : join(here, 'out');

  const review = await readFile(source, 'utf8');

  // The gate only accepts 1-200 characters of real text, on one line.
  // Refuse early and loudly rather than handing the scorer something
  // it must reject.
  if (
    review.length < 1 ||
    review.length > MAX_CHARS ||
    review.trim() === '' ||
    review.includes('\n')
  ) {
    throw new Error(
      `entry.txt must be a single line of 1-${MAX_CHARS} characters, found ${review.length}`,
    );
  }

  await mkdir(targetDir, { recursive: true });
  await writeFile(join(targetDir, 'entry.txt'), review, 'utf8');
}

await main();
