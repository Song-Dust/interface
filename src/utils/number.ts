export function toCompactFormat(num: number | undefined, maximumSignificantDigits = 18) {
  if (num === undefined) return undefined;
  if (num > 0 && num < 0.001) return '<0.001';
  return num.toLocaleString(undefined, {
    maximumSignificantDigits: num < 0.01 ? 2 : num < 10 ? 3 : 4,
  });
}
