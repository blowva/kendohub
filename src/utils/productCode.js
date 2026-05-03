// src/utils/productCode.js
//
// Generates unique product codes in the format SHO-XXXXXX
// where X is a digit (0-9). Range: SHO-000000 to SHO-999999.
//
// Collision-safe: pass in an array of existing codes (or products with .code)
// and the generator will keep trying until it finds an unused one.

const PREFIX = 'SHO';
const CODE_LENGTH = 6;
const MAX_VALUE = 999999;

/**
 * Generate a single random code (no uniqueness check)
 * @returns {string} e.g. "SHO-483921"
 */
export function randomProductCode() {
  const num = Math.floor(Math.random() * (MAX_VALUE + 1));
  const padded = String(num).padStart(CODE_LENGTH, '0');
  return `${PREFIX}-${padded}`;
}

/**
 * Generate a unique product code, checking against existing codes.
 *
 * @param {string[]} existingCodes - Array of codes already in use
 * @param {number} maxAttempts - Safety limit to avoid infinite loops (default 100)
 * @returns {string} A unique code in the format SHO-XXXXXX
 */
export function generateUniqueProductCode(existingCodes = [], maxAttempts = 100) {
  const taken = new Set(
    existingCodes
      .filter(Boolean)
      .map((c) => String(c).toUpperCase().trim())
  );

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const code = randomProductCode();
    if (!taken.has(code)) return code;
  }

  throw new Error(
    `Could not generate a unique product code after ${maxAttempts} attempts. ` +
    `You may have exhausted the namespace.`
  );
}

/**
 * Helper: extract codes from a product list
 * @param {Array} products - Array of product objects with .code field
 * @returns {string[]}
 */
export function extractCodes(products = []) {
  return products
    .map((p) => p?.code)
    .filter(Boolean);
}

/**
 * Validate that a string matches the SHO-XXXXXX format (digits only)
 * @param {string} code
 * @returns {boolean}
 */
export function isValidProductCode(code) {
  if (!code || typeof code !== 'string') return false;
  const pattern = new RegExp(`^${PREFIX}-[0-9]{${CODE_LENGTH}}$`);
  return pattern.test(code.toUpperCase().trim());
}

/**
 * Format a raw input into proper SHO-XXXXXX form
 * Accepts: "123456", "SHO-123456", "sho 12345", etc.
 *
 * @param {string} input
 * @returns {string|null} - Formatted code or null if invalid
 */
export function formatProductCode(input) {
  if (!input) return null;
  const cleaned = String(input).toUpperCase().replace(/[^A-Z0-9]/g, '');

  let digits = cleaned.startsWith(PREFIX)
    ? cleaned.slice(PREFIX.length)
    : cleaned;

  if (!/^[0-9]+$/.test(digits)) return null;
  if (digits.length > CODE_LENGTH) return null;
  digits = digits.padStart(CODE_LENGTH, '0');

  return `${PREFIX}-${digits}`;
}
