const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);

// 🚨 NUEVA RUTA
router.post('/recuperar', authController.recuperarPassword);

module.exports = router;
