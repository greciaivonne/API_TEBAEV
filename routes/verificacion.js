const express = require('express');
const router = express.Router();

function validarCorreo(correo) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(correo);
}

function validarCURP(curp) {
  const regex = /^[A-Z]{4}\d{6}[HM][A-Z]{5}[0-9A-Z]{2}$/i;
  return regex.test(curp);
}

router.post('/', (req, res) => {
  const { correo, curp } = req.body;

  console.log('Datos recibidos:', correo, curp);

  if (validarCorreo(correo) && validarCURP(curp)) {
    return res.status(200).json({ autorizado: true });
  } else {
    return res.status(400).json({ autorizado: false });
  }
});

module.exports = router;
