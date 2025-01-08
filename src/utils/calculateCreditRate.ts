export function CalculateCreditRate(
  rate: number,
  anticipation: number,
  termMedium: number
): number {
  return (
    (1 - (1 - rate / 100) * (1 - (anticipation / 100) * (termMedium / 30))) *
    100
  );
}
