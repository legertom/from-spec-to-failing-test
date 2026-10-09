// Acceptance tests generated from spec.md. One test per criterion.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { maskSSN } from '../src/mask.js';

test('AC1: masks every formatted SSN, keeping the last four digits', () => {
  assert.equal(
    maskSSN('applicant 123-45-6789 matched co-signer 987-65-4321'),
    'applicant ***-**-6789 matched co-signer ***-**-4321'
  );
});

test('AC2: masks an unformatted nine-digit SSN', () => {
  assert.equal(maskSSN('ssn=123456789 verified'), 'ssn=*****6789 verified');
});

test('AC3: leaves text without an SSN unchanged', () => {
  assert.equal(maskSSN('order 1234567890 shipped'), 'order 1234567890 shipped');
  assert.equal(maskSSN('callback 212-555-0142'), 'callback 212-555-0142');
  assert.equal(maskSSN('no identifiers here'), 'no identifiers here');
});
