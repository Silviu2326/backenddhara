# Dhara Backend API

Backend del proyecto Dhara - Plataforma de gestión para profesionales de terapias naturales.

## Tecnologías

- Node.js + Express
- Supabase (Base de datos)
- Mailgun (Envío de emails)
- CORS, Helmet, Morgan

## Instalación

```bash
# Instalar dependencias
npm install

# Copiar archivo de ejemplo de variables de entorno
cp .env.example .env

# Configurar variables de entorno en .env
# (Ver sección de Configuración)

# Iniciar servidor de desarrollo
npm run dev
```

## Configuración

Edita el archivo `.env` con tus credenciales:

```env
# Servidor
PORT=3000
NODE_ENV=development

# Frontend URL
FRONTEND_URL=https://tu-frontend.vercel.app

# Mailgun (para envío de emails)
MAILGUN_API_KEY=tu-api-key
MAILGUN_DOMAIN=tu-dominio.com
MAILGUN_REGION=us
ADMIN_EMAIL=tu-email@ejemplo.com

# Supabase (base de datos)
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_ANON_KEY=tu-anon-key
```

### Obtener credenciales de Mailgun

1. Ve a [app.mailgun.com](https://app.mailgun.com)
2. Crea una cuenta o inicia sesión
3. Settings → API Keys → Copia tu Private API Key
4. Sending → Domains → Usa el sandbox o configura tu dominio

Ver `MAILGUN_SETUP.md` para más detalles.

### Obtener credenciales de Supabase

1. Ve a [supabase.com](https://supabase.com)
2. Crea un proyecto
3. Settings → API → Copia la URL y anon/public key

## Scripts

```bash
# Desarrollo (con nodemon)
npm run dev

# Producción
npm start
```

## Endpoints

### Health Check
```
GET /api/health
```

### Leads (Registro de usuarios)
```
POST /api/leads
Body: {
  name: string,
  email: string,
  user_type: 'professional' | 'client',
  main_problem?: string
}
```

### Contacto
```
POST /api/contacto
Body: {
  name: string,
  email: string,
  message: string
}
```

### Desuscripción
```
GET /unsubscribe?email=usuario@email.com
POST /api/unsubscribe
Body: {
  email: string,
  reason?: string
}
```

## Estructura

```
backend/
├── routes/           # Rutas de la API
│   ├── health.js
│   ├── leads.js
│   ├── contacto.js
│   └── unsubscribe.js
├── services/         # Servicios (emails, etc)
│   └── emailService.js
├── server.js         # Punto de entrada
├── .env              # Variables de entorno (no incluido en git)
├── .env.example      # Ejemplo de variables de entorno
└── package.json
```

## Despliegue

### Railway

```bash
# Instalar Railway CLI
npm i -g @railway/cli

# Login
railway login

# Inicializar proyecto
railway init

# Agregar variables de entorno
railway variables set MAILGUN_API_KEY=xxx
railway variables set SUPABASE_URL=xxx
# ... etc

# Desplegar
railway up
```

### Render

1. Conecta tu repositorio en [render.com](https://render.com)
2. Crea un nuevo "Web Service"
3. Build Command: `npm install`
4. Start Command: `npm start`
5. Agrega las variables de entorno en el dashboard

### Heroku

```bash
# Login
heroku login

# Crear app
heroku create dhara-backend

# Agregar variables de entorno
heroku config:set MAILGUN_API_KEY=xxx
heroku config:set SUPABASE_URL=xxx
# ... etc

# Desplegar
git push heroku main
```

## CORS

El backend acepta peticiones desde:
- `http://localhost:5173` (desarrollo)
- Cualquier origen (configurar en producción)

Para producción, actualiza `server.js`:

```javascript
app.use(cors({
  origin: ['https://tu-dominio.com', 'https://tu-proyecto.vercel.app']
}));
```

## Licencia

Privado - Dhara Dimension
