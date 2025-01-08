// Biblioteca
import { Client, LocalAuth } from "whatsapp-web.js";
import * as qrCode from "qrcode-terminal";

const client = new Client({
  authStrategy: new LocalAuth(),
});

client.on("ready", () => {
  console.log("JARVIS Online!");
});

client.on("qr", (qr: string) => {
  qrCode.generate(qr, { small: true });
});

export default client;
