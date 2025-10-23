import express from "express";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false, // Debe ser false para el puerto 587
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Ruta para enviar alerta
app.post("/enviar-alerta", async (req, res) => {
  const { tipoAlerta, descripcion } = req.body;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.DESTINATION_EMAIL,
    subject: `🚨 Alerta: ${tipoAlerta}`,
    text: `Descripción: ${descripcion}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Correo enviado correctamente");
    res.status(200).json({ message: "Correo enviado correctamente" });
  } catch (error) {
    console.error("Error al enviar correo:", error);
    res.status(500).json({ error: "Error al enviar correo" });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
