# Guía de Configuración de Mailgun

## Error 401 Unauthorized - Solución

El error que estás experimentando indica un problema de autenticación con Mailgun. Aquí está cómo solucionarlo:

### 1. Verificar tu API Key

1. Ve a [Mailgun Dashboard](https://app.mailgun.com)
2. Click en **Settings** → **API Keys**
3. Copia tu **Private API key** (NO la pública)
4. Pégala en el archivo `.env` en la variable `MAILGUN_API_KEY`

### 2. Verificar tu Dominio

**Opción A: Usar Sandbox Domain (Para pruebas)**
- En el dashboard de Mailgun, ve a **Sending** → **Domains**
- Verás un dominio sandbox como: `sandbox123.mailgun.org`
- Usa este dominio en `MAILGUN_DOMAIN` para pruebas
- **IMPORTANTE**: Con sandbox solo puedes enviar a emails autorizados

Para autorizar emails en sandbox:
1. Ve a **Sending** → **Domains** → Tu dominio sandbox
2. Click en **Authorized Recipients**
3. Agrega los emails a los que quieres enviar

**Opción B: Usar tu Dominio Personalizado (Producción)**
1. Ve a **Sending** → **Domains** → **Add New Domain**
2. Agrega `appdhara.com`
3. **Verifica los registros DNS** que Mailgun te proporciona:
   - Registros TXT (SPF)
   - Registros MX
   - Registro CNAME (tracking)
4. Espera a que se verifiquen (puede tomar hasta 48 horas)

### 3. Verificar la Región

Mailgun tiene dos regiones: **US** y **EU**

**¿Cómo saber cuál usar?**
- Si creaste tu cuenta en `app.mailgun.com` → Usa `us`
- Si creaste tu cuenta en `app.eu.mailgun.com` → Usa `eu`

Actualiza en `.env`:
```
MAILGUN_REGION=us   # o 'eu'
```

### 4. Ejemplo de Configuración .env

```env
# Para DESARROLLO (usando sandbox)
MAILGUN_API_KEY=key-tu-api-key-aqui
MAILGUN_DOMAIN=sandbox123abc.mailgun.org
MAILGUN_REGION=us
ADMIN_EMAIL=info@dharadimensionhumana.es
FRONTEND_URL=http://localhost:5173
```

```env
# Para PRODUCCIÓN (usando dominio verificado)
MAILGUN_API_KEY=key-tu-api-key-aqui
MAILGUN_DOMAIN=appdhara.com
MAILGUN_REGION=us
ADMIN_EMAIL=info@dharadimensionhumana.es
FRONTEND_URL=https://dharadimension.vercel.app
```

### 5. Pasos para Verificar

1. **Verifica la API Key:**
   ```bash
   curl -s --user 'api:TU_API_KEY' \
     https://api.mailgun.net/v3/domains
   ```
   Esto debería listar tus dominios. Si da error 401, la API key es incorrecta.

2. **Reinicia el servidor:**
   ```bash
   cd backend
   npm run dev
   ```

3. **Prueba enviando un email:**
   - Si usas sandbox, asegúrate de que el email destino está autorizado
   - Revisa los logs del servidor

### 6. Checklist de Verificación

- [ ] API Key es la **Private API Key** de Mailgun
- [ ] El dominio existe en tu cuenta de Mailgun
- [ ] Si es un dominio personalizado, está **verificado** (icono verde)
- [ ] La región (`us` o `eu`) es la correcta
- [ ] Si usas sandbox, el email destino está en **Authorized Recipients**
- [ ] Reiniciaste el servidor después de cambiar `.env`

### 7. Mensajes de Error Comunes

| Error | Causa | Solución |
|-------|-------|----------|
| 401 Unauthorized | API Key incorrecta | Verifica que sea la Private API Key |
| 401 Forbidden | Dominio no verificado | Verifica los registros DNS |
| 401 Forbidden | Región incorrecta | Cambia `MAILGUN_REGION` a 'eu' o 'us' |
| 400 Bad Request | Email no autorizado en sandbox | Agrega el email a Authorized Recipients |

### 8. Modo de Prueba (Sin Mailgun)

Si quieres probar sin Mailgun configurado, simplemente deja las variables vacías:

```env
MAILGUN_API_KEY=
MAILGUN_DOMAIN=
```

El servidor funcionará en modo simulación y mostrará los emails en la consola.

---

## Soporte

Si sigues teniendo problemas:
1. Verifica los logs del servidor
2. Comprueba que los registros DNS están correctos en Mailgun
3. Contacta al soporte de Mailgun si el dominio no se verifica
