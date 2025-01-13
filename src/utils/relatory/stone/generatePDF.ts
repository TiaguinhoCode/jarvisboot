import * as fs from "fs";
import PDFDocument from "pdfkit";

type generatePDF = {
  "DATA DA VENDA": string;
  "VALOR BRUTO": string;
  "ÚLTIMO STATUS": string;
  PRODUTO: string;
  BANDEIRA: string;
  "QUANTIDADE DE PARCELAS": string;
  "VALOR LÍQUIDO": number;
  TAXA: string;
};

export function generatePDF(
  data: generatePDF[],
  outputPath: string
): Promise<string> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 40, size: "A4" });
    const writeStream = fs.createWriteStream(outputPath);

    doc.pipe(writeStream);

    // Título
    doc
      .fontSize(18)
      .font("Helvetica-Bold")
      .text("Tabela de Dados", { align: "center" });
    doc.moveDown(1);

    // Configurações de estilo da tabela
    const tableTop = 120;
    const rowHeight = 25;
    const startX = 50; // Margem esquerda
    const pageWidth = 500; // Largura total da tabela

    // Largura das colunas (dinâmica para se ajustar ao tamanho da página)
    const columnWidths = [80, 70, 80, 50, 50, 70, 70];

    // Desenhar o cabeçalho
    doc
      .fontSize(10)
      .font("Helvetica-Bold")
      .fillColor("#ffffff")
      .rect(startX, tableTop, pageWidth, rowHeight)
      .fill("#444444");
    const headers = [
      "DATA DA VENDA",
      "PRODUTO",
      "BANDEIRA",
      "QTDE",
      "TAXA",
      "VR. BRUTO",
      "VR. LIQ.",
    ];

    headers.forEach((header, i) => {
      const x =
        startX + columnWidths.slice(0, i).reduce((acc, val) => acc + val, 0);
      doc.fillColor("#ffffff").text(header, x + 5, tableTop + 7, {
        width: columnWidths[i],
        align: "left",
      });
    });

    // Adicionar as linhas da tabela
    let currentY = tableTop + rowHeight; // Próxima linha
    data.forEach((item, rowIndex) => {
      const isEvenRow = rowIndex % 2 === 0;
      doc
        .rect(startX, currentY, pageWidth, rowHeight)
        .fill(isEvenRow ? "#f2f2f2" : "#ffffff");

      // Preencher dados
      const rowData = [
        item["DATA DA VENDA"],
        item.PRODUTO,
        item.BANDEIRA,
        item["QUANTIDADE DE PARCELAS"],
        item.TAXA,
        formatCurrency(item["VALOR BRUTO"]),
        item["VALOR LÍQUIDO"].toString(),
      ];

      rowData.forEach((text, colIndex) => {
        const x =
          startX +
          columnWidths.slice(0, colIndex).reduce((acc, val) => acc + val, 0);
        doc
          .fillColor("#000000")
          .font("Helvetica")
          .fontSize(9)
          .text(text, x + 5, currentY + 7, {
            width: columnWidths[colIndex],
            align: "left",
          });
      });

      currentY += rowHeight; // Avançar para a próxima linha

      // Adicionar nova página, se necessário
      if (currentY > 750) {
        doc.addPage();
        currentY = tableTop;
        // Reimprimir cabeçalho
        doc
          .rect(startX, currentY, pageWidth, rowHeight)
          .fill("#444444")
          .font("Helvetica-Bold")
          .fontSize(10)
          .fillColor("#ffffff");
        headers.forEach((header, i) => {
          const x =
            startX +
            columnWidths.slice(0, i).reduce((acc, val) => acc + val, 0);
          doc.text(header, x + 5, currentY + 7, {
            width: columnWidths[i],
            align: "left",
          });
        });
        currentY += rowHeight;
      }
    });

    doc.end();

    writeStream.on("finish", () => {
      resolve(outputPath);
    });

    writeStream.on("error", (err) => {
      reject(err);
    });
  });
}

function formatCurrency(value: string): string {
  const formattedValue = parseFloat(value.replace(",", ".")).toLocaleString(
    "pt-BR",
    {
      style: "currency",
      currency: "BRL",
    }
  );
  return formattedValue;
}
