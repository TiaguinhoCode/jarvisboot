// Biblioteca
import { Message, MessageMedia } from "whatsapp-web.js";
import path from "path";
import * as fs from "fs";

// Service
import client from "../../service/whatsApp/client";

// Utils
import { setUserState } from "../stateManager";
import { processCSV } from "../csv/stone/processCSV";
import { generatePDF } from "../relatory/stone/generatePDF";

export default async function handleAwaitingFile(
  message: Message,
  userId: string
) {
  if (message.hasMedia) {
    const media = await message.downloadMedia();
    if (media) {
      const directoryPath = path.join(__dirname, "../../data/whatsApp/files");
      const filePath = path.join(directoryPath, media.filename || "vendas.csv");

      //   Existe diretorio?
      if (!fs.existsSync(directoryPath)) {
        fs.mkdirSync(directoryPath);
      }

      fs.writeFileSync(filePath, media.data, "base64");
      processCSV(filePath, async (data) => {
        try {
          const directoryPath = path.join(
            __dirname,
            "../../data/whatsApp/relatoryStone"
          );
          if (!fs.existsSync(directoryPath)) {
            fs.mkdirSync(directoryPath);
          }
          console.log("Dados: ", data)
          const pdfPath = await generatePDF(
            data,
            path.join(directoryPath, `relatorio_${Date.now()}.pdf`)
          );

          const pdfBuffer = fs.readFileSync(pdfPath);
          const base64Pdf = pdfBuffer.toString("base64");

          const media = new MessageMedia(
            "application/pdf",
            base64Pdf,
            "relatorio.pdf"
          );

          await client.sendMessage(userId, media, {
            caption: "Aqui está o relatório gerado em PDF. 😊",
          });
        } catch (err) {
          console.error("Erro ao gerar ou enviar o PDF:", err);
          client.sendMessage(
            userId,
            "Ocorreu um erro ao processar o relatório. Por favor, tente novamente."
          );
        }
      });

      setUserState(userId, { state: "default" });
    }
  }
}
