// Dados
import stone from "../../../data/taxas/stone.json";

// Utils
import { CalculateAverageDeadLine } from "../../CalculateAverageDeadLine";
import { CalculateCreditRate } from "../../calculateCreditRate";

// Tipagem
type FeesCredits = {
  [key: string]: number | undefined;
};

interface FeesStone {
  [bandeira: string]: {
    debito: number;
    credito: number;
    "1_ate_6": number;
    "7_ate_18": number;
  };
}

interface TableMDR {
  Bandeira: string;
  "Taxa Débito": number;
  [key: string]: number | string | undefined;
}

const feesStone: FeesStone = stone;

const installments = Array.from({ length: 18 }, (_, i) => i + 1);
const durations = installments.map((parcela) => 30 * parcela);
const mediumTerm = CalculateAverageDeadLine(durations);

const debitRate = Object.entries(feesStone).map(([bandeira, dados]) => ({
  bandeira,
  debito: dados.debito,
}));

const creditRates = {
  "1x": Object.entries(feesStone).map(([bandeira, dados]) => ({
    bandeira,
    taxa: dados.credito,
  })),
  "2x_6x": Object.entries(feesStone).map(([bandeira, dados]) => ({
    bandeira,
    taxa: dados["1_ate_6"],
  })),
  "7x_18x": Object.entries(feesStone).map(([bandeira, dados]) => ({
    bandeira,
    taxa: dados["7_ate_18"],
  })),
};

const tableStoneMDR: TableMDR[] = debitRate.map(({ bandeira, debito }) => {
  const taxasCredito: FeesCredits = {};

  for (let parcela = 1; parcela <= 18; parcela++) {
    if (parcela === 1) {
      taxasCredito[`Taxa Crédito (${parcela}x)`] = creditRates["1x"].find(
        (item) => item.bandeira === bandeira
      )?.taxa;
    } else if (parcela <= 6) {
      taxasCredito[`Taxa Crédito (${parcela}x)`] = creditRates["2x_6x"].find(
        (item) => item.bandeira === bandeira
      )?.taxa;
    } else {
      taxasCredito[`Taxa Crédito (${parcela}x)`] = creditRates["7x_18x"].find(
        (item) => item.bandeira === bandeira
      )?.taxa;
    }
  }

  return {
    Bandeira: bandeira,
    "Taxa Débito": debito,
    ...taxasCredito,
  };
});

tableStoneMDR.forEach((linha) => {
  mediumTerm.forEach((prazo, index) => {
    const coluna = `Taxa Crédito (${index + 1}x)`;
    if (linha[coluna] !== undefined) {
      linha[coluna] = CalculateCreditRate(linha[coluna] as number, 1.35, prazo);
    }
  });
});

tableStoneMDR.forEach((linha) => {
  Object.keys(linha).forEach((coluna) => {
    if (coluna.startsWith("Taxa Crédito")) {
      linha[coluna] = parseFloat((linha[coluna] as number).toFixed(2));
    }
  });
});

function formatTableAsList(table: TableMDR[]): string {
  let formattedList = "";

  table.forEach((row) => {
    formattedList += `🌟 *${row.Bandeira}*\n`;
    formattedList += `➖ *Taxa Débito:* ${row["Taxa Débito"]}%\n`;
    formattedList += `➖ *Taxas Crédito:*\n`;

    // Agrupa as taxas de crédito
    const creditRates = Object.keys(row)
      .filter((coluna) => coluna.startsWith("Taxa Crédito"))
      .map((coluna) => ({
        parcela: coluna.match(/\((\d+)x\)/)?.[1], // Extrai a parcela (número)
        taxa: row[coluna],
      }));

    creditRates.forEach(({ parcela, taxa }) => {
      formattedList += `    🔹 *${parcela}x:* ${taxa}%\n`;
    });

    formattedList += "\n"; // Linha em branco entre as bandeiras
  });

  return formattedList;
}

const stoneMDR = formatTableAsList(tableStoneMDR);
export { stoneMDR, tableStoneMDR };
