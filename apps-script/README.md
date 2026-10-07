# Formulario → Google Sheets

Las solicitudes del sitio quedan en una hoja de Google (sirve como CRM: columnas `estado` y `proxima_accion`) y llega un aviso a direccion@chpray.com.

1. Crear una hoja de Google (ej. "CH Pray – Solicitudes web") con la cuenta de la empresa: https://sheets.new
2. Menú **Extensiones → Apps Script**. Borrar el contenido y pegar `Code.gs`. Guardar (ícono de disco).
3. En la barra superior del editor, elegir la función **setup** y pulsar **▶ Ejecutar**.
   Google pedirá permisos: **Revisar permisos → elegir la cuenta → Avanzado → Ir a (proyecto) → Permitir**.
   Al terminar, la hoja tendrá una pestaña "Solicitudes" con los encabezados.
4. **Implementar → Nueva implementación** → ícono de engranaje → **Aplicación web**.
   - Ejecutar como: **Yo**
   - Quién tiene acceso: **Cualquier usuario**
5. Pulsar **Implementar** y copiar la **URL de la aplicación web** (termina en `/exec`).
6. Pegarla en `index.html`:
   `const SHEETS_URL = 'https://script.google.com/macros/s/.../exec';`
7. Publicar y enviar una solicitud de prueba desde el sitio.

Si se modifica `Code.gs`, hay que crear una **nueva versión** de la implementación (Implementar → Gestionar implementaciones → Editar → Nueva versión); la URL no cambia.
