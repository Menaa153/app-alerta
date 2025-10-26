import express from "express";
import dotenv from "dotenv";
import Brevo from "@getbrevo/brevo";

dotenv.config();
const app = express();
app.use(express.json());

// Configurar la API de Brevo
const brevoClient = new Brevo.TransactionalEmailsApi();
brevoClient.authentications["apiKey"].apiKey = process.env.BREVO_API_KEY;

// Endpoint raíz para probar Render
app.get("/", (req, res) => {
  res.send("Servidor funcionando correctamente 🚀");
});

// Ejemplo para enviar correo
app.post("/send-email", async (req, res) => {
  try {
    const { to, subject, message } = req.body;

    const emailData = {
      sender: { email: "tu_correo@tudominio.com", name: "Alerta" },
      to: [{ email: to }],
      subject,
      htmlContent: `<html><body><p>${message}</p></body></html>`,
    };

    await brevoClient.sendTransacEmail(emailData);

    res.status(200).json({ success: true, message: "Correo enviado exitosamente" });
  } catch (error) {
    console.error("Error al enviar el correo:", error);
    res.status(500).json({ success: false, error: "Fallo al enviar el correo" });
  }
});

// Puerto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
