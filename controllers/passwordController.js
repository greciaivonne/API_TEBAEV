const crypto = require('crypto');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');

// Guarda tokens y expiraciones (en memoria, para producción usa DB)
const resetTokens = new Map();

// Configura nodemailer (asegúrate de poner variables de entorno o datos correctos)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,      // tu correo
    pass: process.env.EMAIL_PASS       // contraseña de aplicación
  }
});

// Genera token aleatorio
function generarToken() {
  return crypto.randomBytes(32).toString('hex');
}

// Solicitar restablecer - enviar token por correo
exports.solicitarReset = async (req, res) => {
  try {
    const { correo } = req.body;
    if (!correo) return res.status(400).json({ message: 'Correo es obligatorio' });

    const usuario = await User.findOne({ email: correo });
    if (!usuario) return res.status(404).json({ message: 'Usuario no encontrado' });

    const token = generarToken();
    const expiracion = Date.now() + 3600000; // 1 hora

    resetTokens.set(token, { userId: usuario._id.toString(), expiracion });

    // Construir link con token apuntando al frontend (ajusta localhost:4200 si es necesario)
    const enlace = `http://localhost:4200/restablecer?token=${token}`;

    // Enviar correo con el enlace
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: correo,
      subject: 'Restablece tu contraseña',
      html: `<p>Haz clic <a href="${enlace}">aquí</a> para restablecer tu contraseña.</p>
             <p>El enlace expira en 1 hora.</p>`
    });

    res.status(200).json({ message: 'Correo enviado con el enlace para restablecer contraseña' });
  } catch (err) {
    console.error('Error en solicitarReset:', err);
    res.status(500).json({ message: 'Error interno' });
  }
};

// Restablecer contraseña con token
exports.restablecerPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    if (!token || !password) return res.status(400).json({ message: 'Token y contraseña son obligatorios' });

    const data = resetTokens.get(token);
    if (!data) return res.status(400).json({ message: 'Token inválido' });

    if (data.expiracion < Date.now()) {
      resetTokens.delete(token);
      return res.status(400).json({ message: 'Token expirado' });
    }

    const usuario = await User.findById(data.userId);
    if (!usuario) return res.status(404).json({ message: 'Usuario no encontrado' });

    usuario.password = await bcrypt.hash(password, 12);
    await usuario.save();

    resetTokens.delete(token); // Borra el token usado

    res.status(200).json({ message: 'Contraseña restablecida correctamente' });
  } catch (err) {
    console.error('Error en restablecerPassword:', err);
    res.status(500).json({ message: 'Error interno' });
  }
};
