const formData = require('form-data');
const Mailgun = require('mailgun.js');
const mailgun = new Mailgun(formData);

class EmailService {
    constructor() {
        this.client = null;
        this.domain = null;
        this.isConfigured = false;
        this.frontendUrl = null;
    }

    initialize() {
        const apiKey = process.env.MAILGUN_API_KEY;
        this.domain = process.env.MAILGUN_DOMAIN;
        this.frontendUrl = process.env.FRONTEND_URL || 'https://dharadimension.vercel.app';
        const region = process.env.MAILGUN_REGION || 'us'; // 'us' o 'eu'

        if (apiKey && this.domain) {
            const clientConfig = {
                username: 'api',
                key: apiKey
            };

            // Si la región es EU, agregar la URL específica
            if (region === 'eu') {
                clientConfig.url = 'https://api.eu.mailgun.net';
            }

            this.client = mailgun.client(clientConfig);
            this.isConfigured = true;
            console.log('✅ Servicio de email inicializado');
            console.log(`📍 Región de Mailgun: ${region.toUpperCase()}`);
            console.log(`📧 Dominio configurado: ${this.domain}`);
        } else {
            console.log('⚠️ Mailgun no configurado. Los emails no se enviarán.');
            if (!apiKey) console.log('   - Falta MAILGUN_API_KEY');
            if (!this.domain) console.log('   - Falta MAILGUN_DOMAIN');
        }
    }

    async sendWelcomeEmail(name, email, userType) {
        if (!this.isConfigured) {
            console.log('📧 [SIMULACIÓN] Email de bienvenida:', { name, email, userType });
            return { success: true, simulated: true };
        }

        try {
            let subject, htmlContent;

            if (userType === 'professional') {
                // Email para profesionales
                subject = 'Te guardamos un asiento en primera fila (y 3 meses de regalo)';
                
                htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f5f5f5; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #ffffff; padding: 0; text-align: center; border-radius: 10px 10px 0 0; overflow: hidden; }
        .header img { width: 100%; height: auto; display: block; border-radius: 10px 10px 0 0; }
        .content { background: #ffffff; padding: 40px 30px; border-radius: 0; }
        .content p { margin-bottom: 20px; font-size: 16px; }
        .content strong { color: #8CA48F; }
        .footer { background: #f9f9f9; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; font-size: 10px; color: #666; line-height: 1.4; }
        .footer h4 { margin: 0 0 10px 0; color: #333; font-size: 11px; }
        .footer ul { text-align: left; padding-left: 15px; margin: 8px 0; }
        .footer li { margin-bottom: 5px; }
        .unsubscribe { margin-top: 15px; padding-top: 15px; border-top: 1px solid #ddd; font-size: 9px; }
        .instagram { display: inline-block; background: #8CA48F; color: white; padding: 12px 25px; text-decoration: none; border-radius: 25px; margin-top: 20px; font-weight: bold; }
        .instagram:hover { background: #6b856e; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <img src="https://jeqqvtliltdtbxsgdedo.supabase.co/storage/v1/object/public/email-images/email-images.png" alt="Dhara Dimension" />
        </div>
        <div class="content">
            <p>Hola ${name}:</p>
            <p>Hoy no recibes un correo más de una plataforma tecnológica. Hoy recibes un agradecimiento sincero por formar parte del momento fundador de Dhara.</p>
            <p>Sabemos que dedicarse a las terapias naturales es, en esencia, un acto de valentía. Queremos darte las gracias por haber perseguido esa voz interior, por honrar tus dones y por poner tu sabiduría al servicio de los demás. En un mundo que a menudo olvida lo esencial, tú has decidido cuidar, sanar y acompañar. Eso no es solo un trabajo; es un acto de amor a tu propósito y al mundo.</p>
            <p>Dhara nace para cambiar las reglas del juego. Venimos a darte la voz y el lugar que el sector merece. Como persona fundadora, ya tienes asegurados tus 3 meses gratis del plan avanzado en cuanto abramos puertas.</p>
            <p>Mientras terminamos de pulir cada detalle, te invitamos a que te unas a nuestra comunidad en Instagram, donde estamos compartiendo los avances de esta revolución:</p>
            <p style="text-align: center;">
                <a href="https://www.instagram.com/dhara_dimensionhumana?igsh=MTYyc2hsMHZ5eTA5Zw==" class="instagram">Instagram</a>
            </p>
            <p>Gracias por confiar en nosotras desde el inicio. Gracias por sentarte en primera fila.</p>
            <p>¡Vamos a elevar el bienestar holístico!</p>
            <p>Te damos la bienvenida a casa. La bienvenida a Dhara.</p>
            <p><strong>Isabel Miralles y Raquel García</strong><br>Fundadoras de Dhara</p>
        </div>
        <div class="footer">
            <h4>Información básica sobre Protección de Datos (RGPD y LOPDGDD):</h4>
            <ul>
                <li><strong>Responsable:</strong> Isabel Miralles Rubert (DNI: 24399337V) - App Dhara.</li>
                <li><strong>Finalidad:</strong> Gestión de la relación con el usuario/profesional, envío de comunicaciones sobre el estado de la plataforma y novedades de la comunidad.</li>
                <li><strong>Legitimación:</strong> Ejecución de contrato y consentimiento del interesado.</li>
                <li><strong>Destinatarios:</strong> No se cederán datos a terceros salvo obligación legal o proveedores técnicos necesarios para la prestación del servicio (Stripe, Supabase).</li>
                <li><strong>Derechos:</strong> Tienes derecho a acceder, rectificar y suprimir tus datos, así como otros derechos detallados en nuestra Política de Privacidad, enviando un correo a info@dharadimensionhumana.es.</li>
            </ul>
            <div class="unsubscribe">
                <p>Si no deseas recibir más comunicaciones, puedes darte de baja haciendo clic en este enlace: <a href="${this.frontendUrl}/unsubscribe?email=${encodeURIComponent(email)}">Enlace de desuscripción</a>.</p>
                <p>"En Dhara respetamos tu espacio. Si sientes que este ya no es tu lugar, puedes <a href="${this.frontendUrl}/unsubscribe?email=${encodeURIComponent(email)}">darte de baja aquí</a> o responder a este correo con la palabra 'Baja'."</p>
            </div>
        </div>
    </div>
</body>
</html>
                `;
            } else {
                // Email para clientes
                subject = 'Tu "yo" del futuro te está dando las gracias ahora mismo';
                
                htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f5f5f5; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #ffffff; padding: 0; text-align: center; border-radius: 10px 10px 0 0; overflow: hidden; }
        .header img { width: 100%; height: auto; display: block; border-radius: 10px 10px 0 0; }
        .content { background: #ffffff; padding: 40px 30px; border-radius: 0; }
        .content p { margin-bottom: 20px; font-size: 16px; }
        .content strong { color: #A2B2C2; }
        .footer { background: #f9f9f9; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; font-size: 10px; color: #666; line-height: 1.4; }
        .footer h4 { margin: 0 0 10px 0; color: #333; font-size: 11px; }
        .footer ul { text-align: left; padding-left: 15px; margin: 8px 0; }
        .footer li { margin-bottom: 5px; }
        .instagram { display: inline-block; background: #A2B2C2; color: white; padding: 12px 25px; text-decoration: none; border-radius: 25px; margin-top: 20px; font-weight: bold; }
        .instagram:hover { background: #8a9aa8; }
        .unsubscribe { margin-top: 15px; padding-top: 15px; border-top: 1px solid #ddd; font-size: 9px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <img src="https://jeqqvtliltdtbxsgdedo.supabase.co/storage/v1/object/public/email-images/email-images.png" alt="Dhara Dimension" />
        </div>
        <div class="content">
            <p>Hola, buscador/a de bienestar:</p>
            <p>Y no es broma ${name}, que tu "yo" del futuro te lo va a agradecer. A veces el ritmo del mundo nos hace olvidar que el mejor lugar donde podemos invertir tiempo es en nosotros mismos. Por eso, antes de que Dhara empieze a caminar, quería darte la enhorabuena por esto:</p>
            <p>El simple hecho de estar leyendo esto significa que ya has activado algo poderoso en ti: el deseo de ocuparte de tu cuerpo, de tus emociones y de tu paz.</p>
            <p>Estamos creando una herramienta para que cuidarte sea, por fin, rápido, sencillo y muy cómodo. Queremos que la tecnología trabaje para ti, no en tu contra. Muy pronto, la app Dhara estará en tu móvil compartiendo espacio con esas apps de distracción y divertimento, pero con una misión distinta: ser ese pequeño aviso que te recuerda que lo primero es pararte, desconectar y dedicarte una sesión a ti.</p>
            <p>Dhara no será un lugar comercial más. Es un refugio diseñado para que, con un par de toques, encuentres el acompañamiento que necesitas para cambiar esta vida loca que llevamos.</p>
            <p>Puedes empezar a conectar con nosotras y ver cómo avanza el proyecto aquí:</p>
            <p style="text-align: center;">
                <a href="https://www.instagram.com/dhara_dimensionhumana?igsh=MTYyc2hsMHZ5eTA5Zw==" class="instagram">Instagram</a>
            </p>
            <p>Gracias por estar aquí desde el principio. Gracias por elegirte.</p>
            <p>Con cariño,<br>El equipo de Dhara</p>
        </div>
        <div class="footer">
            <h4>Información básica sobre Protección de Datos (RGPD y LOPDGDD):</h4>
            <ul>
                <li><strong>Responsable:</strong> Isabel Miralles Rubert (DNI: 24399337V) - App Dhara.</li>
                <li><strong>Finalidad:</strong> Gestión de la relación con el usuario/profesional, envío de comunicaciones sobre el estado de la plataforma y novedades de la comunidad.</li>
                <li><strong>Legitimación:</strong> Ejecución de contrato y consentimiento del interesado.</li>
                <li><strong>Destinatarios:</strong> No se cederán datos a terceros salvo obligación legal o proveedores técnicos necesarios para la prestación del servicio (Stripe, Supabase).</li>
                <li><strong>Derechos:</strong> Tienes derecho a acceder, rectificar y suprimir tus datos, así como otros derechos detallados en nuestra Política de Privacidad, enviando un correo a info@dharadimensionhumana.es.</li>
            </ul>
            <div class="unsubscribe">
                <p>Si no deseas recibir más comunicaciones, puedes darte de baja haciendo clic en este enlace: <a href="${this.frontendUrl}/unsubscribe?email=${encodeURIComponent(email)}">Enlace de desuscripción</a>.</p>
                <p>"En Dhara respetamos tu espacio. Si sientes que este ya no es tu lugar, puedes <a href="${this.frontendUrl}/unsubscribe?email=${encodeURIComponent(email)}">darte de baja aquí</a> o responder a este correo con la palabra 'Baja'."</p>
            </div>
        </div>
    </div>
</body>
</html>
                `;
            }

            const textContent = userType === 'professional' 
                ? `Hola, profesional del bienestar:\n\nHoy no recibes un correo más de una plataforma tecnológica. Hoy recibes un agradecimiento sincero por formar parte del momento fundador de Dhara.\n\nGracias por confiar en nosotras desde el inicio. Gracias por sentarte en primera fila.\n\n¡Vamos a elevar el bienestar holístico!\n\nTe damos la bienvenida a casa. La bienvenida a Dhara.\n\nIsabel Miralles y Raquel García\nFundadoras de Dhara`
                : `Hola, buscador/a de bienestar:\n\nGracias por estar aquí desde el principio. Gracias por elegirte.\n\nCon cariño,\nEl equipo de Dhara`;

            const result = await this.client.messages.create(this.domain, {
                from: `Dhara Dimension <noreply@${this.domain}>`,
                to: email,
                subject: subject,
                text: textContent,
                html: htmlContent
            });

            console.log('✅ Email enviado:', result.id);
            return { success: true, id: result.id };
        } catch (error) {
            console.error('❌ Error enviando email:', error);
            return { success: false, error: error.message };
        }
    }

    async sendNotificationToAdmin(name, email, userType) {
        if (!this.isConfigured) {
            console.log('📧 [SIMULACIÓN] Notificación a admin:', { name, email, userType });
            return { success: true, simulated: true };
        }

        try {
            const adminEmail = process.env.ADMIN_EMAIL || 'admin@dharadimension.com';

            const text = `
Nuevo registro en Dhara Dimension:

Nombre: ${name}
Email: ${email}
Tipo: ${userType === 'professional' ? 'Profesional' : 'Cliente'}
Fecha: ${new Date().toISOString()}
            `;

            const result = await this.client.messages.create(this.domain, {
                from: `Dhara Dimension <noreply@${this.domain}>`,
                to: adminEmail,
                subject: `🎉 Nuevo ${userType === 'professional' ? 'profesional' : 'cliente'}: ${name}`,
                text: text
            });

            console.log('✅ Notificación enviada a admin');
            return { success: true, id: result.id };
        } catch (error) {
            console.error('❌ Error enviando notificación:', error);
            return { success: false, error: error.message };
        }
    }
}

module.exports = new EmailService();
