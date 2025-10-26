import express from "express";
import dotenv from "dotenv";
import Brevo from "@getbrevo/brevo";
import cors from "cors";

dotenv.config();

const app = express();

// ✅ Middleware necesarios
app.use(express.json());

// 🔹 Habilitar CORS para permitir peticiones desde el frontend
app.use(
  cors({
    origin: "*", // durante pruebas permite todo; luego puedes restringir
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);

// 🔹 Configurar la API de Brevo
const brevoClient = new Brevo.TransactionalEmailsApi();
brevoClient.authentications["apiKey"].apiKey = process.env.BREVO_API_KEY;

// 🔹 Endpoint raíz (Render lo usa como health check)
app.get("/", (req, res) => {
  res.send("Servidor funcionando correctamente 🚀");
});

// 🔹 Endpoint para enviar correo
app.post("/send-email", async (req, res) => {
  try {
    const { to, subject, message } = req.body;

    // Validaciones simples
    if (!to || !subject || !message) {
      return res
        .status(400)
        .json({ success: false, error: "Faltan campos requeridos" });
    }

    const emailData = {
      sender: { email: "cristianimbacuan311@gmail.com", name: "Alerta" }, // 👈 este debe ser tu remitente verificado en Brevo
      to: [{ email: to }],
      subject,
      htmlContent: `<html><body><p>${message}</p></body></html>`,
    };

    const response = await brevoClient.sendTransacEmail(emailData);

    console.log("Correo enviado ✅ ID:", response.messageId);
    res
      .status(200)
      .json({ success: true, message: "Correo enviado exitosamente" });
  } catch (error) {
    console.error("Error al enviar el correo ❌:", error.response?.text || error);
    res.status(500).json({
      success: false,
      error: "Fallo al enviar el correo",
      details: error.message,
    });
  }
});

// 🔹 Iniciar servidor
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
