export function toCompactFormat(num: number | undefined, maximumSignificantDigits = 18) {
  if (num === undefined) return undefined;
  if (num < 0.001) return '<0.001';
  return num.toLocaleString(undefined, {
    maximumSignificantDigits: 18,
  });
}
