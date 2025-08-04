require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const errorHandler = require('./middleware/errorMiddleware');
const verificacionRoutes = require('./routes/verificacion');

const passwordRoutes = require('./routes/passwordRoutes');

const app = express();

// Middleware

app.use(cors({
  origin: 'http://localhost:4200', // O el puerto donde corre Angular
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json());

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Conectado a MongoDB'))
  .catch(err => console.error('Error de conexión a MongoDB:', err));

// Rutas
app.use('/api/verificar', verificacionRoutes);

app.use('/api/auth', authRoutes);
app.use('/api/auth', passwordRoutes);

// Middleware de error
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));