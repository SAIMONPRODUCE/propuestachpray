# Formulario → Google Sheets

Las solicitudes del sitio quedan en una hoja de Google (sirve como CRM: columnas `estado` y `proxima_accion`) y llega un aviso a direccion@chpray.com.

1. Crear una hoja de Google (ej. "CH Pray – Solicitudes web") con la cuenta de la empresa.
2. Menú **Extensiones → Apps Script**. Borrar el contenido y pegar `Code.gs`. Guardar.
3. **Implementar → Nueva implementación** → tipo **Aplicación web**.
   - Ejecutar como: **Yo**
   - Quién tiene acceso: **Cualquier usuario**
4. Autorizar los permisos que pide Google (hoja y correo).
5. Copiar la URL que termina en `/exec` y pegarla en `index.html`:
   `const SHEETS_URL = 'https://script.google.com/macros/s/.../exec';`
6. Publicar y enviar una solicitud de prueba desde el sitio.

Si se modifica `Code.gs`, hay que crear una **nueva versión** de la implementación (Implementar → Gestionar implementaciones → Editar → Nueva versión); la URL no cambia.
