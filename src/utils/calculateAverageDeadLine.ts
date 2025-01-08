export function CalculateAverageDeadLine(durations: number[]) {
  const termMedium = [];
  let sumDuration = 0;

  for (let i = 0; i < durations.length; i++) {
    sumDuration += durations[i];
    termMedium.push(sumDuration / (i + 1));
  }

  return termMedium;
}
