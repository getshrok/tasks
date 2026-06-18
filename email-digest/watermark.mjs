#!/usr/bin/env node
// Self-contained high-water-mark helper for shrok feed tasks.
// Each task keeps its OWN copy of this file; state lives in `watermark.json`
// next to it (JSON, like the creds helpers — NOT MEMORY.md). Needs no task name,
// env var, or shared module.
//
//   node watermark.mjs now          -> canonical local-offset timestamp (one format for every task)
//   node watermark.mjs get          -> stored last_checked, or "never" on first run
//   node watermark.mjs set <ts>     -> validate + write watermark.json
//   node watermark.mjs commit <ts>  -> alias for set (semantic: advance only after a successful run)
//
// Baked-in rules so TASK.md needn't restate them: timestamps are local time WITH
// offset (never UTC "Z"); write the watermark only after a run succeeds; on any
// failure leave it so the next run re-covers the window — always prefer a
// duplicate over a miss.
import { readFileSync, writeFileSync, renameSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const FILE = join(dirname(fileURLToPath(import.meta.url)), 'watermark.json');
const SHAPE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?([+-]\d{2}:\d{2}|Z)$/;

function nowLocalOffset() {
  const d = new Date();
  const p = (n) => String(n).padStart(2, '0');
  const off = -d.getTimezoneOffset();             // minutes east of UTC (EDT -> -240 -> "-04:00")
  const sign = off >= 0 ? '+' : '-';
  const a = Math.abs(off);
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T` +
         `${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}` +
         `${sign}${p(Math.floor(a / 60))}:${p(a % 60)}`;
}

function read() {
  if (!existsSync(FILE)) return {};
  try { return JSON.parse(readFileSync(FILE, 'utf8') || '{}'); } catch { return {}; }
}
function write(obj) {
  const tmp = `${FILE}.tmp.${process.pid}`;
  writeFileSync(tmp, JSON.stringify(obj, null, 2) + '\n');
  renameSync(tmp, FILE);                            // atomic
}

function get() {
  const v = read().last_checked;
  return (typeof v === 'string' && v) ? v : 'never';
}

function set(ts) {
  if (!ts || !SHAPE.test(ts)) {
    console.error(`watermark: invalid timestamp "${ts ?? ''}" — use the output of: watermark.mjs now`);
    process.exit(1);
  }
  if (!/[+-]\d{2}:\d{2}$/.test(ts)) {              // rejects "Z"
    console.error(`watermark: refusing UTC/"Z" timestamp "${ts}" — use local time with offset (watermark.mjs now)`);
    process.exit(1);
  }
  const obj = read();                              // preserve any other keys
  obj.last_checked = ts;
  write(obj);
  console.log(ts);
}

const [cmd, arg] = process.argv.slice(2);
switch (cmd) {
  case 'now': console.log(nowLocalOffset()); break;
  case 'get': console.log(get()); break;
  case 'set':
  case 'commit': set(arg); break;
  default:
    console.error('usage: watermark.mjs now | get | set <ts> | commit <ts>');
    process.exit(1);
}
