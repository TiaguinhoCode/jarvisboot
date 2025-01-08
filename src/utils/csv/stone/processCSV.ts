// Biblioteca
import * as fs from "fs";
import csvParser from "csv-parser";

// Dados
import { tableStoneMDR } from "../../data/mdr/stone";

// Tipagem
type Flag = "Visa" | "MasterCard" | "Elo" | "Hiper" | "AmericanExpress";

export function processCSV(filePath: string, callback: (data: any[]) => void) {
  const results: any[] = [];

  const pickUpFeesByFlag = (flag: Flag) => {
    const flagData = tableStoneMDR.find(
      (item) => item.Bandeira.toLowerCase() === flag.toLocaleLowerCase()
    );

    if (flagData) {
      return {
        Débito: flagData["Taxa Débito"],
        "Débito Pré-pago": flagData["Taxa Débito"],
        Crédito: flagData["Taxa Crédito (1x)"],
        "Crédito (2x)": flagData["Taxa Crédito (2x)"],
        "Crédito (3x)": flagData["Taxa Crédito (3x)"],
        "Crédito (4x)": flagData["Taxa Crédito (4x)"],
        "Crédito (5x)": flagData["Taxa Crédito (5x)"],
        "Crédito (6x)": flagData["Taxa Crédito (6x)"],
        "Crédito (7x)": flagData["Taxa Crédito (7x)"],
        "Crédito (8x)": flagData["Taxa Crédito (8x)"],
        "Crédito (9x)": flagData["Taxa Crédito (9x)"],
        "Crédito (10x)": flagData["Taxa Crédito (10x)"],
        "Crédito (11x)": flagData["Taxa Crédito (11x)"],
        "Crédito (12x)": flagData["Taxa Crédito (12x)"],
        "Crédito (13x)": flagData["Taxa Crédito (13x)"],
        "Crédito (14x)": flagData["Taxa Crédito (14x)"],
        "Crédito (15x)": flagData["Taxa Crédito (15x)"],
        "Crédito (16x)": flagData["Taxa Crédito (16x)"],
        "Crédito (17x)": flagData["Taxa Crédito (17x)"],
        "Crédito (18x)": flagData["Taxa Crédito (18x)"],
      };
    }

    return null;
  };

  fs.createReadStream(filePath)
    .pipe(csvParser({ separator: ";" }))
    .on("data", (data: Record<string, string>) => {
      const {
        STONECODE,
        "STONE ID": stoneId,
        "VALOR LÍQUIDO": liquid,
        PRODUTO,
        BANDEIRA,
        "QTD DE PARCELAS": qtddeparcelas,
        "DESCONTO DE MDR": descontodemdr,
        "DESCONTO DE ANTECIPAÇÃO": descontodeantecipacao,
        "N° CARTÃO": ncartao,
        "MEIO DE CAPTURA": meiodecaptura,
        "NÚMERO DE SÉRIE": nseries,
        "DATA DO ÚLTIMO STATUS": ultimostatus,
        ...filteredData
      } = data;

      const installments = parseInt(qtddeparcelas.trim(), 10);
      let fees = 0;

      const flagFees = pickUpFeesByFlag(BANDEIRA as Flag);

      if (flagFees) {
        if (PRODUTO === "Crédito") {
          if (installments === 1) {
            fees = flagFees.Crédito as number;
          } else if (installments === 2) {
            fees = flagFees["Crédito (2x)"] as number;
          } else if (installments === 3) {
            fees = flagFees["Crédito (3x)"] as number;
          } else if (installments === 4) {
            fees = flagFees["Crédito (4x)"] as number;
          } else if (installments === 5) {
            fees = flagFees["Crédito (5x)"] as number;
          } else if (installments === 6) {
            fees = flagFees["Crédito (6x)"] as number;
          } else if (installments === 7) {
            fees = flagFees["Crédito (7x)"] as number;
          } else if (installments === 8) {
            fees = flagFees["Crédito (8x)"] as number;
          } else if (installments === 9) {
            fees = flagFees["Crédito (9x)"] as number;
          } else if (installments === 10) {
            fees = flagFees["Crédito (10x)"] as number;
          } else if (installments === 11) {
            fees = flagFees["Crédito (11x)"] as number;
          } else if (installments === 12) {
            fees = flagFees["Crédito (12x)"] as number;
          } else if (installments === 13) {
            fees = flagFees["Crédito (13x)"] as number;
          } else if (installments === 14) {
            fees = flagFees["Crédito (14x)"] as number;
          } else if (installments === 15) {
            fees = flagFees["Crédito (15x)"] as number;
          } else if (installments === 16) {
            fees = flagFees["Crédito (16x)"] as number;
          } else if (installments === 17) {
            fees = flagFees["Crédito (17x)"] as number;
          } else if (installments === 18) {
            fees = flagFees["Crédito (18x)"] as number;
          } else {
            fees = 0;
          }
        } else {
          fees = flagFees.Débito as number;
        }
      }

      results.push({
        ...filteredData,
        PRODUTO,
        BANDEIRA,
        "QUANTIDADE DE PARCELAS": qtddeparcelas,
        TAXA: fees,
        "VALOR LÍQUIDO": (
          parseFloat(filteredData["VALOR BRUTO"]) *
          (1 - fees / 100)
        ).toFixed(2),
      });
    })
    .on("end", () => {
      callback(results);
    })
    .on("error", (error) => {
      console.error("Erro ao processar o arquivo CSV:", error);
    });
}
