export function parseDDMMYYYY(value) {
  if (!value) return null;
  const [day, month, year] = value.split('/').map(Number);
  return new Date(year, month - 1, day);
}
