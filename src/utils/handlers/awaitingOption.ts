// Biblioteca
import { Message } from "whatsapp-web.js";

// Seriveces
import client from "../../service/whatsApp/client";
import { setUserState } from "../stateManager";

// Dados
import { stoneMDR } from "../data/mdr/stone";

export default async function handleAwaitingOption(
  message: Message,
  userId: string
) {
  if (message.body === "1") {
    client.sendMessage(
      userId,
      "Por gentileza, envie o arquivo necessário para que eu possa gerar o PDF."
    );
    setUserState(userId, { state: "awaiting_file" });
  } else if (message.body === "2") {
    client.sendMessage(
      userId,
      `Aqui está sua tabela de taxas MDR Stone:\n\n ${stoneMDR}`
    );
    client.sendMessage(
      userId,
      "Por favor, digite *Relatório* para voltar ao menu."
    );
    setUserState(userId, { state: "default" });
  } else if (message.body === "3") {
    client.sendMessage(
      userId,
      "JARVIS foi desativado. Envie *relatório* para me chamar novamente."
    );
    setUserState(userId, { state: "default" });
  } else {
    client.sendMessage(userId, "Opção inválida. Por favor, tente novamente.");
  }
}
