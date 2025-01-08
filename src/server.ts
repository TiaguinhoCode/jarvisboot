// Service
import client from "./service/whatsApp/client";
import { handleMessage } from "./service/whatsApp/messagemHandle";

client.on("message_create", handleMessage);

client.initialize();
