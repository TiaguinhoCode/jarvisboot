// Biblioteca
import { Message } from "whatsapp-web.js";

// Service
import client from "../client";

// Utils
import {
  getUserState,
  setUserState,
  canSendMessage,
} from "../../../utils/stateManager";
import handleDefaultState from "../../../utils/handlers/defaultState";
import handleAwaitingOption from "../../../utils/handlers/awaitingOption";
import handleAwaitingFile from "../../../utils/handlers/awaitingFile";

export async function handleMessage(message: Message) {
  const userId = message.from;
  const userState = getUserState(userId);

  if (!canSendMessage(userState.lastMessageTime)) {
    return;
  }

  setUserState(userId, { lastMessageTime: Date.now() });

  switch (userState.state) {
    case "default":
      await handleDefaultState(message, userId);
      break;
    case "awaiting_option":
      await handleAwaitingOption(message, userId);
      break;
    case "awaiting_file":
      await handleAwaitingFile(message, userId);
    default:
      client.sendMessage(
        userId,
        "Algo deu errado. Por favor, envie *relatório* para começar novamente."
      );
      setUserState(userId, { state: "default" });
      break;
  }
}
  