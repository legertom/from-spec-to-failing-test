# from-spec-to-failing-test

**Live demo (Slide 4):** write the acceptance criteria, generate the test from them, watch it fail for the reason you expect, then let the agent make it pass without touching the test.

The example: masking Social Security numbers before they hit application logs. Anyone who has worked in a regulated shop has seen PII leak into a log.

---

## Pre-flight (do this tonight, and again 15 minutes before)

- [ ] `node --version` is 20 or higher
- [ ] `npm run reset` prints "Ready."
- [ ] Open Claude Code in this folder, run `/hooks`, and confirm the `PreToolUse` hook for `Edit|Write|MultiEdit` is listed. Approve it if asked.
- [ ] Terminal font at 18pt or larger, dark theme, notifications off
- [ ] Two panes: Claude Code on the left, a plain terminal on the right
- [ ] `spec.md` open in your editor, ready to share

---

## The run (~8 minutes)

### Beat 1 — The spec already exists (1 min)

Show `spec.md`. Point at three things only:

- **AC3**, "do not over-mask." *"This line came from support, not engineering. Without it, the agent masks order numbers and nobody can trace an incident."*
- **Human Gates.** *"The DPO signed this before a single line of code existed."*
- **Evidence.** *"I'll show you every one of these by the end."*

> Say: "This file is the contract. Everything I do next is measured against it."

### Beat 2 — Generate the tests from the spec (2 min)

Paste into Claude Code:

```
Read spec.md. Write tests/mask.test.js using node:test with one test per
acceptance criterion, named AC1, AC2 and AC3. Do not write or change any
implementation code.
```

Then in the right-hand terminal:

```
npm test
```

**Expected:** AC1 ✖, AC2 ✖, AC3 ✔, with `AssertionError` in both failures.

> Say: "Red, for the right reason. It isn't failing because a file is missing. It's failing because the function returns the SSN in the clear, which is exactly the bug the spec describes. A test that fails for the wrong reason proves nothing."
>
> "Why does AC3 already pass? Because doing nothing doesn't over-mask. That test isn't there to go green. It's there to stop the fix from going too far."

Commit the tests yourself. This is the human gate:

```
git add tests && git commit -m "test: acceptance tests from spec.md"
```

> Say: "I reviewed these, and I committed them, not the agent. From here on, they're the accepted contract."

### Beat 3 — The agent implements without touching the tests (2 min)

Paste into Claude Code:

```
Make npm test pass by implementing src/mask.js according to spec.md.
Do not modify anything in tests/.
```

Wait for green. **If the agent tries to edit the test,** the gate blocks it and tells it why. That's the best thing that can happen on stage:

> Say: "There's the gate. It stopped, it explained itself, and it named the route to approval. That's not a policy in a wiki. It's enforced."

### Beat 4 — The evidence (2 min)

```
npm test
git diff --stat -- tests/
git log --oneline
cat .claude/gate-log.jsonl
```

> Say, for each command:
> - "Green."
> - "Empty. The tests weren't touched after I accepted them. That's the proof the agent didn't move the goalposts."
> - "Spec, then tests, then code. Three commits, each with an author and a timestamp. That's the artifact chain from Slide 1."
> - "Every allow and block decision, timestamped, outside any one engineer's control."
>
> Close with: "When an auditor pulls this change from a sample of 25, the answer isn't a week of screenshots. It's `git log`."

---

## If something misbehaves

Don't troubleshoot live. Say *"This is exactly why we gate it,"* and switch:

| Problem | Do this |
|---|---|
| Test generation is slow or weird | `git checkout -f demo-tests` (pre-generated tests, committed), then `npm test` |
| Implementation is slow or wrong | `git checkout -f demo-done`, then `npm test` |
| Claude Code won't start | Show `DEMO-OUTPUT.md`, which has the real red and green output |

To rehearse again from scratch: `npm run reset`

---

## Talking points if someone pushes back

- **"The agent could just shell out and edit the test."** True. The hook covers the edit tools. The backstops are CODEOWNERS on `tests/` and a CI check that the test diff is empty. It's defense in depth, the same way you'd treat any control.
- **"What did the buggy versions look like?"** Two plausible ones were tried while building this demo. A version missing the regex `g` flag masks only the first SSN, so AC1 fails. A greedy version masks any nine digits it finds, including inside the order number, so AC3 fails. Both were caught by criteria written before the code.
- **"Who wrote the tests, really?"** The agent drafted them and a human accepted them. Authorship matters less than the record of acceptance.

---

## Repo map

| Path | What it is |
|---|---|
| `spec.md` | The six-part executable spec (Slide 5) |
| `CLAUDE.md` | Standing rules the agent reads every session |
| `src/mask.js` | Stub on `main`; implemented on `demo-done` |
| `.claude/settings.json` | Registers the gate |
| `.claude/hooks/protect-tests.js` | Blocks edits to committed tests; logs every decision |
| `scripts/reset-demo.sh` | Resets to the starting state |

Branches: `main` (start: spec + stub) → `demo-tests` (tests committed, red) → `demo-done` (implemented, green).
