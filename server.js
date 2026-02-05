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

// Configuración de CORS desde variable de entorno
const allowedOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(',').map(origin => origin.trim())
  : [
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:5175',
      'https://dharadimension.vercel.app',
      'https://www.dharadimension.vercel.app'
    ];

const corsOptions = {
  origin: function (origin, callback) {
    // Permitir peticiones sin origen (como Postman, curl, etc)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log(`❌ CORS blocked origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Log de orígenes permitidos
console.log('✅ CORS configurado para:', allowedOrigins);
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

// Health check simple para Railway
app.get('/healthz', (req, res) => {
  res.status(200).send('OK');
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
const HOST = process.env.HOST || '0.0.0.0';
const server = app.listen(PORT, HOST, () => {
  console.log(`🚀 Servidor ejecutándose en http://${HOST}:${PORT}`);
  console.log(`📝 Entorno: ${process.env.NODE_ENV || 'development'}`);
});

// Manejo de señales para cierre graceful
const gracefulShutdown = (signal) => {
  console.log(`\n${signal} recibido. Cerrando servidor...`);
  server.close(() => {
    console.log('✅ Servidor cerrado correctamente');
    process.exit(0);
  });

  // Forzar cierre después de 10 segundos
  setTimeout(() => {
    console.error('⚠️ Forzando cierre del servidor');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

module.exports = app;
