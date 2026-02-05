const express = require('express');
const router = express.Router();

// Ruta para enviar mensajes de contacto
router.post('/', async (req, res) => {
  try {
    const { nombre, email, mensaje } = req.body;

    // Validación básica
    if (!nombre || !email || !mensaje) {
      return res.status(400).json({
        error: 'Todos los campos son requeridos',
        camposFaltantes: !nombre ? 'nombre' : !email ? 'email' : 'mensaje'
      });
    }

    // Validación de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Email inválido' });
    }

    // Aquí puedes agregar la lógica para enviar email o guardar en base de datos
    // Por ejemplo, con nodemailer o Supabase
    
    console.log('Mensaje recibido:', { nombre, email, mensaje });

    res.status(201).json({
      mensaje: 'Mensaje enviado correctamente',
      datos: {
        nombre,
        email,
        fecha: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error al procesar mensaje:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Obtener todos los mensajes (protegido en producción)
router.get('/', (req, res) => {
  res.json({ mensaje: 'Lista de mensajes - Endpoint para admin' });
});

module.exports = router;
