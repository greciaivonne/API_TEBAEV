const express = require('express');
const passwordController = require('../controllers/passwordController');
const router = express.Router();

router.post('/solicitar-reset', passwordController.solicitarReset);
router.post('/restablecer', passwordController.restablecerPassword);

module.exports = router;
