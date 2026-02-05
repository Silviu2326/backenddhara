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
const corsOriginsEnv = process.env.CORS_ORIGINS || '';
console.log('🔍 CORS_ORIGINS env variable:', corsOriginsEnv);

const allowedOrigins = corsOriginsEnv
  ? corsOriginsEnv.split(',').map(origin => origin.trim())
  : [
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:5175',
      'https://dharadimension.vercel.app',
      'https://www.dharadimension.vercel.app'
    ];

// Añadir automáticamente variantes con y sin www para cada dominio
const expandedOrigins = [...allowedOrigins];
allowedOrigins.forEach(origin => {
  try {
    const url = new URL(origin);
    if (url.hostname.startsWith('www.')) {
      // Si tiene www, añadir versión sin www
      const withoutWww = `${url.protocol}//${url.hostname.replace('www.', '')}${url.port ? ':' + url.port : ''}`;
      if (!expandedOrigins.includes(withoutWww)) {
        expandedOrigins.push(withoutWww);
      }
    } else if (!url.hostname.includes('localhost')) {
      // Si no tiene www y no es localhost, añadir versión con www
      const withWww = `${url.protocol}//www.${url.hostname}${url.port ? ':' + url.port : ''}`;
      if (!expandedOrigins.includes(withWww)) {
        expandedOrigins.push(withWww);
      }
    }
  } catch (e) {
    console.warn(`⚠️ Error procesando origen: ${origin}`, e.message);
  }
});

const corsOptions = {
  origin: function (origin, callback) {
    // Permitir peticiones sin origen (como Postman, curl, etc)
    if (!origin) {
      console.log('✅ CORS permitido: petición sin origen (server-to-server)');
      return callback(null, true);
    }

    // Normalizar el origen para la comparación
    const normalizedOrigin = origin.trim().toLowerCase();
    const normalizedAllowedOrigins = expandedOrigins.map(o => o.trim().toLowerCase());

    if (normalizedAllowedOrigins.includes(normalizedOrigin)) {
      console.log(`✅ CORS permitido: ${origin}`);
      callback(null, true);
    } else {
      console.log(`❌ CORS bloqueado: ${origin}`);
      console.log(`   Orígenes permitidos:`, expandedOrigins);
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
console.log('✅ CORS configurado para:', expandedOrigins);
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
