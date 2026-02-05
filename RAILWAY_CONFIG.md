# Configuración de Railway para Dhara Dimension Backend

## Variables de Entorno Requeridas

Configura las siguientes variables de entorno en Railway (Settings → Variables):

### 1. CORS_ORIGINS
```
https://www.appdhara.com
```

**IMPORTANTE:**
- ❌ NO uses comillas: `"https://www.appdhara.com"`
- ✅ USA sin comillas: `https://www.appdhara.com`
- El sistema automáticamente añade variantes con y sin `www`
- Si tienes múltiples dominios, sepáralos por comas sin espacios: `https://dominio1.com,https://dominio2.com`

### 2. NODE_ENV
```
production
```

### 3. PORT
Railway lo configura automáticamente, pero si lo necesitas:
```
3000
```

### 4. FRONTEND_URL
```
https://www.appdhara.com
```

### 5. Mailgun Configuration
```
MAILGUN_API_KEY=tu-api-key-de-mailgun
MAILGUN_DOMAIN=appdhara.com
MAILGUN_REGION=eu
ADMIN_EMAIL=info@dharadimensionhumana.es
```

**Nota:** Verifica tu región de Mailgun:
- `us` para servidores en Estados Unidos
- `eu` para servidores en Europa

### 6. Supabase Configuration
```
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_ANON_KEY=tu-anon-key
```

## Verificación

Después de desplegar, verifica los logs en Railway. Deberías ver:

```
🔍 CORS_ORIGINS env variable: https://www.appdhara.com
✅ CORS configurado para: [ 'https://www.appdhara.com', 'https://appdhara.com' ]
```

Si ves `❌ CORS bloqueado:`, los logs mostrarán qué origen está siendo rechazado y la lista de orígenes permitidos para ayudarte a debuggear.

## Solución de Problemas Comunes

### Error: "Not allowed by CORS"

1. **Verifica la variable de entorno en Railway:**
   - Ve a tu proyecto → Settings → Variables
   - Asegúrate de que `CORS_ORIGINS` NO tenga comillas
   - El valor debe ser: `https://www.appdhara.com` (sin comillas)

2. **Verifica el dominio exacto:**
   - Abre tu sitio web
   - Abre las Developer Tools (F12)
   - Ve a la pestaña Network
   - Haz una petición al backend
   - Verifica el header `Origin` en la petición
   - Ese valor exacto debe estar en `CORS_ORIGINS`

3. **Revisa los logs de Railway:**
   - Los logs mostrarán el origen exacto que está siendo bloqueado
   - Compara con tu configuración de `CORS_ORIGINS`

4. **Redeploy después de cambiar variables:**
   - Railway requiere un redeploy después de cambiar variables de entorno
   - Click en "Redeploy" o haz un nuevo commit

### Variantes automáticas con/sin www

El código automáticamente permite tanto `https://appdhara.com` como `https://www.appdhara.com` si configuras cualquiera de los dos. No necesitas poner ambos manualmente.

## Health Check

Railway puede usar cualquiera de estos endpoints:

- `GET /` - Responde con información de la API
- `GET /healthz` - Responde con "OK"
- `GET /api/health` - Health check completo

Configura en Railway → Settings → Health Check Path: `/healthz`
