const express = require('express');
const router = express.Router();

// Ruta de verificación de salud del servidor
router.get('/', (req, res) => {
  res.json({
    estado: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memoria: process.memoryUsage()
  });
});

module.exports = router;
