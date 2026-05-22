const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Ruta para el formulario de contacto
app.post('/api/contact', async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Faltan campos requeridos.' });
  }

  try {
    // Configura el transporter con las credenciales de tu correo (ej. Gmail, SMTP, etc.)
    // Debes añadir EMAIL_USER y EMAIL_PASS a tu archivo .env
    const transporter = nodemailer.createTransport({
      service: 'gmail', // O el servicio que uses
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: email,
      to: process.env.EMAIL_USER, // O el correo al que quieres que lleguen los mensajes
      subject: `Nuevo mensaje de Contacto: ${subject || 'Sin asunto'}`,
      text: `Has recibido un nuevo mensaje de contacto:\n\nNombre: ${name}\nEmail: ${email}\nMensaje:\n${message}`,
      html: `<p>Has recibido un nuevo mensaje de contacto:</p>
             <ul>
               <li><strong>Nombre:</strong> ${name}</li>
               <li><strong>Email:</strong> ${email}</li>
             </ul>
             <p><strong>Mensaje:</strong></p>
             <p>${message}</p>`,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Mensaje enviado correctamente.' });
  } catch (error) {
    console.error('Error al enviar el correo:', error);
    res.status(500).json({ error: 'Hubo un error al enviar el mensaje. Por favor intenta más tarde.' });
  }
});

app.listen(port, () => console.log(`Backend corriendo en puerto ${port}`));