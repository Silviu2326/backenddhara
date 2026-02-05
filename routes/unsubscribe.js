const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

// Página de unsubscribe
router.get('/', (req, res) => {
    const email = req.query.email || '';
    
    res.send(`
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Darse de baja - Dhara Dimension</title>
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #8CA48F 0%, #6b856e 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        .container {
            background: white;
            border-radius: 20px;
            padding: 40px;
            max-width: 450px;
            width: 100%;
            box-shadow: 0 20px 60px rgba(0,0,0,0.2);
        }
        h1 { color: #333; margin-bottom: 10px; font-size: 24px; }
        p { color: #666; margin-bottom: 25px; line-height: 1.6; }
        .form-group { margin-bottom: 20px; }
        label { display: block; margin-bottom: 8px; color: #555; font-weight: 500; }
        input, textarea {
            width: 100%;
            padding: 14px;
            border: 2px solid #e0e0e0;
            border-radius: 10px;
            font-size: 16px;
            transition: border-color 0.3s;
        }
        input:focus, textarea:focus {
            outline: none;
            border-color: #8CA48F;
        }
        textarea { resize: vertical; min-height: 100px; }
        button {
            width: 100%;
            padding: 16px;
            background: linear-gradient(135deg, #8CA48F 0%, #6b856e 100%);
            color: white;
            border: none;
            border-radius: 10px;
            font-size: 16px;
            font-weight: bold;
            cursor: pointer;
            transition: transform 0.2s, box-shadow 0.2s;
        }
        button:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 30px rgba(140, 164, 143, 0.4);
        }
        .success {
            background: #dcfce7;
            color: #166534;
            padding: 20px;
            border-radius: 10px;
            text-align: center;
            display: none;
        }
        .error {
            background: #fee2e2;
            color: #dc2626;
            padding: 15px;
            border-radius: 10px;
            margin-bottom: 20px;
            display: none;
        }
        .logo { text-align: center; margin-bottom: 20px; }
        .logo h2 { color: #8CA48F; }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">
            <h2>🌿 Dhara Dimension</h2>
        </div>
        
        <div id="error" class="error"></div>
        <div id="success" class="success">
            <h3>¡Lamentamos que te vayas!</h3>
            <p style="margin-bottom: 0; margin-top: 10px;">Tu baja ha sido procesada correctamente.</p>
        </div>

        <div id="formContainer">
            <h1>Darse de baja</h1>
            <p>Lamentamos que dejes de formar parte de nuestra comunidad. Introduce tu correo para procesar tu baja.</p>
            
            <form id="unsubscribeForm">
                <div class="form-group">
                    <label for="email">Correo electrónico *</label>
                    <input type="email" id="email" name="email" value="${email}" required placeholder="tu@email.com">
                </div>
                
                <div class="form-group">
                    <label for="reason">Motivo de la baja (opcional)</label>
                    <textarea id="reason" name="reason" placeholder="Cuéntanos por qué te das de baja..."></textarea>
                </div>
                
                <button type="submit">Confirmar baja</button>
            </form>
        </div>
    </div>

    <script>
        const form = document.getElementById('unsubscribeForm');
        const errorDiv = document.getElementById('error');
        const successDiv = document.getElementById('success');
        const formContainer = document.getElementById('formContainer');

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const reason = document.getElementById('reason').value;

            try {
                const response = await fetch('/api/unsubscribe', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, reason })
                });

                const data = await response.json();

                if (response.ok) {
                    formContainer.style.display = 'none';
                    successDiv.style.display = 'block';
                } else {
                    errorDiv.textContent = data.error || 'Error al procesar la baja';
                    errorDiv.style.display = 'block';
                }
            } catch (err) {
                errorDiv.textContent = 'Error de conexión. Inténtalo de nuevo.';
                errorDiv.style.display = 'block';
            }
        });
    </script>
</body>
</html>
    `);
});

// Procesar unsubscribe
router.post('/', async (req, res) => {
    try {
        const { email, reason } = req.body;

        if (!email) {
            return res.status(400).json({ error: 'El correo electrónico es requerido' });
        }

        // Validar email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: 'Correo electrónico inválido' });
        }

        // Actualizar el registro en Supabase
        if (supabase) {
            // Opción 1: Marcar como inactivo
            const { error: updateError } = await supabase
                .from('leads')
                .update({ 
                    active: false,
                    unsubscribe_reason: reason || null,
                    unsubscribed_at: new Date().toISOString()
                })
                .eq('email', email.toLowerCase());

            if (updateError) {
                console.error('Error actualizando lead:', updateError);
                return res.status(500).json({ error: 'Error al procesar la baja' });
            }
            
            console.log(`✅ Baja procesada para: ${email}`);
        } else {
            console.log('📝 [SIMULACIÓN] Baja procesada:', { email, reason });
        }

        res.json({ 
            success: true, 
            message: 'Baja procesada correctamente' 
        });

    } catch (error) {
        console.error('Error en unsubscribe:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

module.exports = router;
