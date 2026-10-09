/**
 * Mask Social Security numbers in a line of log text.
 * Contract: see spec.md (AC1–AC3).
 *
 * @param {string} text  raw log text that may contain PII
 * @returns {string}     the same text with every SSN masked to its last four digits
 */

// AC1: ddd-dd-dddd, not embedded in a longer run of digits
const FORMATTED_SSN = /(?<!\d)\d{3}-\d{2}-(\d{4})(?!\d)/g;

// AC2: exactly nine consecutive digits. The lookarounds keep a
// ten-digit order number from matching (AC3: do not over-mask).
const UNFORMATTED_SSN = /(?<![\d-])\d{5}(\d{4})(?![\d-])/g;

export function maskSSN(text) {
  return text
    .replace(FORMATTED_SSN, '***-**-$1')
    .replace(UNFORMATTED_SSN, '*****$1');
}
