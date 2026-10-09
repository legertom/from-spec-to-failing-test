# DEMO-OUTPUT — backup if the live run misbehaves

Real output captured from this repo. Share this file if Claude Code or the terminal won't cooperate.

## Beat 2 — red, for the right reason

```

> from-spec-to-failing-test@1.0.0 test
> node --test --test-reporter=spec

✖ AC1: masks every formatted SSN, keeping the last four digits (1.652779ms)
✖ AC2: masks an unformatted nine-digit SSN (0.249786ms)
✔ AC3: leaves text without an SSN unchanged (0.21717ms)
ℹ tests 3
ℹ suites 0
ℹ pass 1
ℹ fail 2
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0

test at tests/mask.test.js:6:1
✖ AC1: masks every formatted SSN, keeping the last four digits
  AssertionError [ERR_ASSERTION]: Expected values to be strictly equal:
  + 'applicant 123-45-6789 matched co-signer 987-65-4321'
  - 'applicant ***-**-6789 matched co-signer ***-**-4321'

test at tests/mask.test.js:13:1
✖ AC2: masks an unformatted nine-digit SSN
  AssertionError [ERR_ASSERTION]: Expected values to be strictly equal:
  + 'ssn=123456789 verified'
  - 'ssn=*****6789 verified'
```

## Beat 3 — green

```

> from-spec-to-failing-test@1.0.0 test
> node --test --test-reporter=spec

✔ AC1: masks every formatted SSN, keeping the last four digits (0.854484ms)
✔ AC2: masks an unformatted nine-digit SSN (0.169022ms)
✔ AC3: leaves text without an SSN unchanged (0.140116ms)
ℹ tests 3
ℹ suites 0
ℹ pass 3
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 81.125628
```

## The gate, when the agent tries to edit a committed test

```
BLOCKED by gate "protect-tests": tests/mask.test.js is a committed test.
Committed tests are the accepted contract from spec.md and cannot be changed by the agent.
If you believe the test is wrong, stop and explain why. Route: the Tech Lead updates spec.md, then a human edits and re-commits the test.
```

## Beat 4 — evidence

```
$ git diff --stat -- tests/
(no output: tests untouched since acceptance)

$ git log --oneline
<hash> feat: implement maskSSN to pass AC1-AC3 (tests unchanged)
<hash> test: acceptance tests AC1-AC3 generated from spec.md (red)
<hash> spec: accept SSN-masking spec and stub (no tests yet)

$ cat .claude/gate-log.jsonl
{"ts":"2026-10-09T01:39:34.381Z","gate":"protect-tests","tool":"Edit","file":"tests/mask.test.js","decision":"block","reason":"committed test file: accepted contract"}
{"ts":"2026-10-09T01:39:34.481Z","gate":"protect-tests","tool":"Edit","file":"src/mask.js","decision":"allow","reason":"not a protected path"}
```
