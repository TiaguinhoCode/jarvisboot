export function formatCurrency(value: string): string {
  const formattedValue = parseFloat(value.replace(",", ".")).toLocaleString(
    "pt-BR",
    {
      style: "currency",
      currency: "BRL",
    }
  );
  return formattedValue;
}
