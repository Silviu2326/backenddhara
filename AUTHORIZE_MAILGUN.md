# Cómo autorizar tu email en Mailgun Sandbox

## Pasos para autorizar info@dharadimensionhumana.es

### Opción 1: Desde el Dashboard de Mailgun

1. **Inicia sesión** en https://app.mailgun.com

2. **Ve a la sección de Sandbox:**
   - En el menú izquierdo, expande "Sending"
   - Clic en "Domain verification & DNS"
   - O ve directamente a: https://app.mailgun.com/app/sandbox-domains

3. **Selecciona tu sandbox domain:**
   - Verás: `sandbox2ccff00dd6aa47e8bafe6f54e015b3c3.mailgun.org`

4. **Autoriza destinatarios:**
   - Busca la sección "Authorized Recipients" o "Destinatarios Autorizados"
   - Clic en "Add Authorized Recipient" o "Agregar destinatario"
   - Ingresa: `info@dharadimensionhumana.es`
   - Clic en "Send Confirmation" o "Enviar confirmación"

5. **Confirma el email:**
   - Revisa tu correo `info@dharadimensionhumana.es`
   - Clic en el enlace de confirmación de Mailgun

### Opción 2: Verificación directa

1. Ve a: https://app.mailgun.com/app/sandbox-domains

2. Busca la lista de "Authorized Recipients"

3. Ingresa `info@dharadimensionhumana.es` y clic en el botón de agregar

4. Revisa tu correo y confirma

### Después de autorizar

✅ Podrás enviar emails de prueba a `info@dharadimensionhumana.es`

⚠️ **Limitación del Sandbox:**
- Solo puedes enviar a emails que hayas autorizado
- Para enviar a cualquier email, necesitas verificar tu propio dominio

---

## Cómo verificar tu propio dominio (opcional)

Para no tener que autorizar cada email:

1. **En Mailgun, ve a:** Sending > Domains

2. **Clic en "Add New Domain"**

3. **Ingresa tu dominio:**
   - Ejemplo: `mail.dharadimensionhumana.es` o `dharadimensionhumana.es`

4. **Agrega los registros DNS que Mailgun te indique:**
   - Esto lo haces en tu proveedor de dominio (GoDaddy, Cloudflare, etc.)

5. **Espera la verificación (puede tomar hasta 48 horas)**

6. **Una vez verificado:**
   - Podrás enviar emails a cualquier dirección
   - Los emails tendrán mayor tasa de entrega
