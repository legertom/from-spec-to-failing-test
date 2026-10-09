#!/usr/bin/env node
// PreToolUse gate: once a test file is committed, it is the accepted contract.
// The agent may create NEW test files, but may not edit a committed one.
// Every decision (allow or block) is appended to .claude/gate-log.jsonl.

import { readFileSync, appendFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import path from 'node:path';

const input = JSON.parse(readFileSync(0, 'utf8') || '{}');
const projectDir = process.env.CLAUDE_PROJECT_DIR || input.cwd || process.cwd();
const filePath = input.tool_input?.file_path || input.tool_input?.notebook_path || '';
const rel = path.relative(projectDir, path.resolve(projectDir, filePath)).split(path.sep).join('/');

function isCommitted(relPath) {
  try {
    execFileSync('git', ['cat-file', '-e', `HEAD:${relPath}`], { cwd: projectDir, stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

const protectedPath = rel.startsWith('tests/');
const blocked = protectedPath && isCommitted(rel);

const entry = {
  ts: new Date().toISOString(),
  gate: 'protect-tests',
  tool: input.tool_name,
  file: rel,
  decision: blocked ? 'block' : 'allow',
  reason: blocked
    ? 'committed test file: accepted contract'
    : protectedPath ? 'new test file, not yet accepted' : 'not a protected path',
};
try {
  appendFileSync(path.join(projectDir, '.claude', 'gate-log.jsonl'), JSON.stringify(entry) + '\n');
} catch { /* logging must never break the gate */ }

if (blocked) {
  process.stderr.write(
    `BLOCKED by gate "protect-tests": ${rel} is a committed test.\n` +
    `Committed tests are the accepted contract from spec.md and cannot be changed by the agent.\n` +
    `If you believe the test is wrong, stop and explain why. Route: the Tech Lead updates spec.md, ` +
    `then a human edits and re-commits the test.\n`
  );
  process.exit(2); // exit 2 = block the tool call and show this message to the agent
}
process.exit(0);
