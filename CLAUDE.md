# CLAUDE.md

This repo is built spec-first. `spec.md` is the contract.

## Rules

- Read `spec.md` before doing anything. Implement exactly what its acceptance criteria say, nothing more.
- **Never modify a committed file under `tests/`.** Tests are accepted by a human before implementation starts. If a test looks wrong, stop and say why. Do not change it to make it pass.
- New test files may be proposed only when asked to write tests.
- Keep `src/mask.js` dependency-free. No new packages.
- Run `npm test` after every change and report the result.
- Do not commit. A human reviews and commits each stage.
