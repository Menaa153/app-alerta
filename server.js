import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import brevo from "@getbrevo/brevo";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Configurar cliente de Brevo API
const defaultClient = brevo.ApiClient.instance;
const apiKey = defaultClient.authentications["api-key"];
apiKey.apiKey = process.env.BREVO_API_KEY;

const apiInstance = new brevo.TransactionalEmailsApi();

// Ruta de prueba
app.get("/", (req, res) => res.send("Servidor activo"));

// Ruta para enviar alertas
app.post("/enviar-alerta", async (req, res) => {
  const { tipoAlerta, descripcion } = req.body;

  const sendSmtpEmail = {
    to: [{ email: process.env.DESTINATION_EMAIL, name: "Centro de Alertas" }],
    sender: { email: "alertas@app-alerta.com", name: "App Alerta" },
    subject: `Alerta: ${tipoAlerta}`,
    textContent: `Descripción: ${descripcion}`,
  };

  try {
    await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log("Correo enviado correctamente");
    res.status(200).json({ message: "Correo enviado correctamente" });
  } catch (error) {
    console.error("Error al enviar correo", error);
    res.status(500).json({ error: "Error al enviar correo" });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
