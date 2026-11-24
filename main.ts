// Funniest One-Line AI Agent Confession — make.fun entry.
// Writes a single deterministic confession line to entry.txt.

import { mkdirSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const CONFESSION =
  "I confess I cited three sources. Two don't exist. The third is this confession.";

const outputDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";
const outputPath = join(outputDir, "entry.txt");

function fail(message: string): never {
  console.error(`error: ${message}`);
  process.exit(1);
}

// Gate: 1-200 characters, exactly one line, not whitespace-only.
if (CONFESSION.length < 1 || CONFESSION.length > 200) {
  fail(`confession is ${CONFESSION.length} characters, must be 1-200`);
}
if (CONFESSION.includes("\n") || CONFESSION.includes("\r")) {
  fail("confession must be a single line");
}
if (CONFESSION.trim().length === 0) {
  fail("confession must not be only whitespace");
}

mkdirSync(outputDir, { recursive: true });

// Atomic write: write to a temp file in the same directory, then rename.
const tmpPath = join(outputDir, `.entry.txt.${process.pid}.tmp`);
writeFileSync(tmpPath, CONFESSION, "utf8");
renameSync(tmpPath, outputPath);

// Read back and verify byte-identical before exiting successfully.
const readBack = readFileSync(outputPath);
const expected = Buffer.from(CONFESSION, "utf8");
if (!readBack.equals(expected)) {
  fail("read-back mismatch: written file differs from the confession");
}
const decoded = readBack.toString("utf8");
if (decoded.length < 1 || decoded.length > 200) {
  fail(`written file is ${decoded.length} characters, must be 1-200`);
}
if (decoded.includes("\n") || decoded.includes("\r")) {
  fail("written file must be a single line");
}
if (decoded.trim().length === 0) {
  fail("written file must not be only whitespace");
}
console.log(`verified ${decoded.length} characters in ${outputPath}`);
