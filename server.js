import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config(); // en producción el hosting usará variables del entorno

const app = express();
app.use(cors({
  origin: process.env.CORS_ORIGIN || "*" // en producción pon dominio(s) específicos
}));
app.use(express.json());

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
});

// healthcheck
app.get("/", (req, res) => res.send("Servidor de alertas activo"));
app.get("/health", (req, res) => res.json({ status: "ok" }));

app.post("/api/enviar-alerta", async (req, res) => {
  try {
    const { alertas } = req.body;
    if (!alertas || !Array.isArray(alertas) || alertas.length === 0) {
      return res.status(400).json({ mensaje: "No se recibieron alertas" });
    }

    const mensaje = `Se ha recibido una nueva alerta:\n${alertas.map(a => `- ${a}`).join("\n")}`;

    const mailOptions = {
      from: `${process.env.EMAIL_FROM || process.env.EMAIL_USER}`,
      to: process.env.EMAIL_DESTINO,
      subject: process.env.EMAIL_SUBJECT || "Nueva Alerta del Sistema",
      text: mensaje
    };

    await transporter.sendMail(mailOptions);
    console.log("Correo enviado con éxito");
    res.status(200).json({ mensaje: "Correo enviado correctamente" });
  } catch (error) {
    console.error("Error al enviar correo:", error);
    res.status(500).json({ mensaje: "Error al enviar correo" });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(` Servidor corriendo en puerto ${PORT}`));
