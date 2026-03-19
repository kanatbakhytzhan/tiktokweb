export function normalizePhone(input: string): string {
  return input.replace(/\D/g, "");
}

export function formatKazakhstanPhone(value: string): string {
  const digits = normalizePhone(value).replace(/^8/, "7").slice(0, 11);
  const source = digits.startsWith("7") ? digits : `7${digits}`;
  const padded = source.slice(0, 11);

  let result = "+7";
  if (padded.length > 1) result += ` (${padded.slice(1, 4)}`;
  if (padded.length >= 4) result += ")";
  if (padded.length > 4) result += ` ${padded.slice(4, 7)}`;
  if (padded.length > 7) result += `-${padded.slice(7, 9)}`;
  if (padded.length > 9) result += `-${padded.slice(9, 11)}`;

  return result;
}

export function isValidKazakhstanPhone(value: string): boolean {
  const digits = normalizePhone(value).replace(/^8/, "7");
  return /^7\d{10}$/.test(digits);
}
