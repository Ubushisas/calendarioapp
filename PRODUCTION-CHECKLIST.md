# Checklist para Producción en Vercel

## 🔐 Google OAuth Configuration

Cuando subas a Vercel, necesitas actualizar Google Cloud Console:

1. Ve a https://console.cloud.google.com/apis/credentials
2. Edita tu OAuth 2.0 Client ID: `1015858088191-sqigfia8tdb947rn75nan41bthh4lpqj`
3. Agrega estas URIs autorizadas:
   - `https://tu-dominio.vercel.app/api/auth/callback/google`
   - `https://tu-dominio-personalizado.com/api/auth/callback/google` (si tienes dominio custom)

## 🔑 Environment Variables en Vercel

Asegúrate de configurar en Vercel Dashboard:
- `NEXTAUTH_SECRET` (genera uno nuevo con: `openssl rand -base64 32`)
- `NEXTAUTH_URL` (tu URL de producción)
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `ALLOWED_ADMIN_EMAILS=myosotisbymo@gmail.com,hello@ubushi.com`
- `CRON_API_KEY` (genera uno nuevo para producción)
- Todas las demás variables del `.env.local`

## 🤖 WhatsApp Bot en DigitalOcean

El bot de WhatsApp necesitará el nuevo CRON_API_KEY y la URL de producción.
