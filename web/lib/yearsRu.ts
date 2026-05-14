/** Число + правильное «год» / «года» / «лет» для натуральных n (возраст, стаж и т.д.). */
export function yearsRu(n: number): string {
  const k = Math.abs(Math.trunc(n)) % 100;
  const m = k % 10;
  if (k > 10 && k < 20) return `${n} лет`;
  if (m === 1) return `${n} год`;
  if (m >= 2 && m <= 4) return `${n} года`;
  return `${n} лет`;
}
