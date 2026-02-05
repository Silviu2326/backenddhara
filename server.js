const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

// Importar servicio de email
const emailService = require('./services/emailService');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/api/health', require('./routes/health'));
app.use('/api/contacto', require('./routes/contacto'));
app.use('/api/leads', require('./routes/leads'));
app.use('/unsubscribe', require('./routes/unsubscribe'));
app.use('/api/unsubscribe', require('./routes/unsubscribe'));

// Ruta raíz
app.get('/', (req, res) => {
  res.json({ 
    mensaje: 'Bienvenido a Dhara Dimension API',
    version: '1.0.0',
    estado: 'En funcionamiento'
  });
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Algo salió mal!',
    mensaje: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Ruta 404
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Inicializar servicio de email
emailService.initialize();

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
  console.log(`📝 Entorno: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;
