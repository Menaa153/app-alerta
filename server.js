import express from "express";
import dotenv from "dotenv";
import Brevo from "@getbrevo/brevo";

dotenv.config();
const app = express();
app.use(express.json());

// Configurar la API de Brevo
const brevoClient = new Brevo.TransactionalEmailsApi();
brevoClient.authentications["apiKey"].apiKey = process.env.BREVO_API_KEY;

// Endpoint raíz
app.get("/", (req, res) => {
  res.send("Servidor funcionando correctamente 🚀");
});

// Endpoint para enviar correo
app.post("/send-email", async (req, res) => {
  try {
    const { to, subject, message } = req.body;

    const emailData = {
      sender: { email: "cristianimbacuan311@gmail.com", name: "Alerta" }, // 👈 usa tu correo verificado
      to: [{ email: to }],
      subject,
      htmlContent: `<html><body><p>${message}</p></body></html>`,
    };

    const response = await brevoClient.sendTransacEmail(emailData);

    console.log("Correo enviado ✅ ID:", response.messageId);
    res.status(200).json({ success: true, message: "Correo enviado exitosamente" });
  } catch (error) {
    console.error("Error al enviar el correo ❌:", error);
    res.status(500).json({ success: false, error: "Fallo al enviar el correo" });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
