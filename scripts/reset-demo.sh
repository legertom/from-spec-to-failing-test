#!/usr/bin/env bash
# Put the repo back to the starting state (spec + stub, no tests) for another rehearsal.
set -euo pipefail
cd "$(git rev-parse --show-toplevel)"
git checkout -q -f main
git reset -q --hard start
git clean -fdq tests src
rm -f .claude/gate-log.jsonl
echo "Reset to 'start': spec.md and a stub src/mask.js, no tests. Ready."
