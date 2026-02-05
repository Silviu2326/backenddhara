const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');

// Inicializar Supabase (opcional, ya que el frontend también guarda)
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

const emailService = require('../services/emailService');

// Validación de email
const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(email);
};

// Ruta POST para crear un lead
router.post('/', async (req, res) => {
    try {
        const { name, email, user_type } = req.body;

        // Validación básica
        if (!email || !user_type) {
            return res.status(400).json({
                error: 'Email y tipo de usuario son requeridos',
                camposFaltantes: !email ? 'email' : 'user_type'
            });
        }

        // Validación de nombre (requerido para todos)
        if (!name || !name.trim()) {
            return res.status(400).json({ error: 'El nombre es requerido' });
        }

        // Validación de email
        if (!validateEmail(email)) {
            return res.status(400).json({ error: 'Email inválido' });
        }

        // Guardar en Supabase (si está configurado)
        if (supabase) {
            const { error: supabaseError } = await supabase
                .from('leads')
                .insert([{
                    email,
                    user_type,
                    name: name.trim(),
                    created_at: new Date().toISOString()
                }]);

            if (supabaseError) {
                console.error('Error guardando en Supabase:', supabaseError);
                // No fallamos por esto, continuamos con el email
            }
        } else {
            console.log('📝 [SIMULACIÓN] Guardando en Supabase:', { name, email, user_type });
        }

        // Enviar email de bienvenida
        const emailResult = await emailService.sendWelcomeEmail(
            name || 'Usuario',
            email,
            user_type
        );

        // Notificar al admin
        if (name) {
            await emailService.sendNotificationToAdmin(name, email, user_type);
        }

        res.status(201).json({
            mensaje: 'Lead creado correctamente',
            datos: {
                email,
                user_type,
                name: name,
                fecha: new Date().toISOString()
            },
            email: emailResult
        });

    } catch (error) {
        console.error('Error al procesar lead:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Ruta GET para listar leads (protegida en producción)
router.get('/', (req, res) => {
    res.json({ mensaje: 'Lista de leads - Endpoint para admin' });
});

module.exports = router;
