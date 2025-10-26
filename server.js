import express from "express";
import dotenv from "dotenv";
import * as brevo from "@getbrevo/brevo";

dotenv.config();
const app = express();

app.use(express.json());

// Configurar Brevo
const defaultClient = brevo.ApiClient.instance;
const apiKey = defaultClient.authentications["api-key"];
apiKey.apiKey = process.env.BREVO_API_KEY;

// Endpoint de prueba
app.get("/", (req, res) => {
  res.send("Servidor funcionando correctamente 🚀");
});

// Ejemplo de envío de correo
app.post("/send-email", async (req, res) => {
  try {
    const { to, subject, message } = req.body;
    const email = new brevo.SendSmtpEmail();

    email.to = [{ email: to }];
    email.sender = { email: "tu_correo@tudominio.com", name: "Alerta" };
    email.subject = subject;
    email.htmlContent = `<html><body><p>${message}</p></body></html>`;

    const apiInstance = new brevo.TransactionalEmailsApi();
    await apiInstance.sendTransacEmail(email);

    res.status(200).json({ success: true, message: "Correo enviado" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Error al enviar el correo" });
  }
});

// Puerto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor escuchando en puerto ${PORT}`));
