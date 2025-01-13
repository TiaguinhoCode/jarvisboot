// Biblioteca
import { Message } from "whatsapp-web.js";

// Service
import client from "../../service/whatsApp/client";

// Utils
import { setUserState } from "../stateManager";
import { getGreeting } from "../constants/greetings";

export default async function handleDefaultState(
  message: Message,
  userId: string
) {
  const greeting = getGreeting();

  if (
    message.body.toLocaleLowerCase() === "relatorio" ||
    message.body.toLocaleLowerCase() === "relatório"
  ) {
    client.sendMessage(
      userId,
      `${greeting}, me chamo *JARVIS*, seu assistente gerador de relatórios! 😊\n\n` +
        "1️⃣ Relatório Stone? \n" +
        "2️⃣ Visualizar Taxas MDR Stone? \n" +
        "3️⃣ Sair \n\n" +
        "Digite o número da opção desejada."
    );
    setUserState(userId, { state: "awaiting_option" });
  }
}
