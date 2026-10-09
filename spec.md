# spec.md — Mask SSNs before they reach the logs

| Field | Value |
|---|---|
| Author | Tom Léger |
| Status | Accepted |
| Reviewer of record | Data Protection Officer (policy) · Tech Lead (code) |

---

## 1. Intent

No full Social Security number is ever written to an application log. Every SSN is masked to its last four digits before the line is emitted.

## 2. Constraints

- **Scope:** one pure function, `maskSSN(text)` in `src/mask.js`. No I/O, no network, no new dependencies.
- **Data boundary:** the function receives raw log text that may contain PII. It must never store, print, or transmit its input.
- **Regulatory limit:** masked output may retain at most the last four digits of an SSN (data-minimization policy).
- **Do not over-mask:** order IDs, phone numbers, and other numbers that are not SSNs must pass through unchanged, or support loses the ability to trace incidents.

## 3. Acceptance Criteria

Written before any code was generated. A change is done when all three hold.

- **AC1** — A formatted SSN (`123-45-6789`) becomes `***-**-6789`. Every occurrence in the string is masked, not just the first.
- **AC2** — An unformatted nine-digit SSN (`123456789`) becomes `*****6789`.
- **AC3** — Text without an SSN is returned unchanged, including a ten-digit order number (`1234567890`) and a phone number (`212-555-0142`).

## 4. Verification

```
npm test
```

Runs one test per acceptance criterion and exits non-zero if any fails.

## 5. Human Gates

| Gate | Who | What they decide |
|---|---|---|
| Spec accepted | Tech Lead + Data Protection Officer | This spec is the contract. Signed off before any test or code exists. |
| Tests accepted | Tech Lead | Tests generated from this spec are reviewed and committed **before** implementation. After that, the agent may not modify them. |
| Merge | A reviewer other than the implementer | Approves the PR. The agent never promotes its own work. |

## 6. Evidence

- **Git history:** spec, then tests, then implementation, each in its own commit with an author and a timestamp.
- **Test output:** `npm test` output attached to the PR.
- **Tests untouched:** `git diff --stat <tests-commit> -- tests/` is empty for the implementation commit.
- **Gate log:** every allow/block decision on a protected file is appended to `.claude/gate-log.jsonl`.
