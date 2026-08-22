/**
 * Date Formatting Utility for GlobeTrotter (DD/MM/YYYY format)
 * Prevents timezone shifting between PostgreSQL DATE type and API JSON responses.
 */

/**
 * Format a Date object or ISO string to DD/MM/YYYY
 * Examples:
 *   '2026-09-01' -> '01/09/2026'
 *   '2026-09-01T00:00:00.000Z' -> '01/09/2026'
 *   Date Object -> '01/09/2026'
 */
function formatToDDMMYYYY(dateInput) {
  if (!dateInput) return null;

  // Handle Date object
  if (dateInput instanceof Date) {
    if (isNaN(dateInput.getTime())) return null;
    const day = String(dateInput.getUTCDate()).padStart(2, '0');
    const month = String(dateInput.getUTCMonth() + 1).padStart(2, '0');
    const year = dateInput.getUTCFullYear();
    return `${day}/${month}/${year}`;
  }

  // Handle string input
  if (typeof dateInput === 'string') {
    // If already in DD/MM/YYYY format
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateInput.trim())) {
      return dateInput.trim();
    }

    // Extract YYYY-MM-DD portion
    const isoMatch = dateInput.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (isoMatch) {
      const [, year, month, day] = isoMatch;
      return `${day}/${month}/${year}`;
    }
  }

  // Fallback to UTC Date parsing
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return String(dateInput);

  const day = String(d.getUTCDate()).padStart(2, '0');
  const month = String(d.getUTCMonth() + 1).padStart(2, '0');
  const year = d.getUTCFullYear();

  return `${day}/${month}/${year}`;
}

/**
 * Parse DD/MM/YYYY string to ISO YYYY-MM-DD for PostgreSQL DATE type
 * Example: '01/09/2026' -> '2026-09-01'
 */
function parseDDMMYYYYToISO(dateStr) {
  if (!dateStr || typeof dateStr !== 'string') return dateStr;

  const trimmed = dateStr.trim();

  // Match DD/MM/YYYY format
  const ddmmyyyyMatch = trimmed.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (ddmmyyyyMatch) {
    const [, day, month, year] = ddmmyyyyMatch;
    return `${year}-${month}-${day}`;
  }

  return trimmed; // Return as-is if already YYYY-MM-DD
}

module.exports = {
  formatToDDMMYYYY,
  parseDDMMYYYYToISO
};
