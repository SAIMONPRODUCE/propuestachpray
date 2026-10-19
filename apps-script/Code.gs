/**
 * @OnlyCurrentDoc
 * Solo pide acceso a esta hoja (no a todas las hojas de la cuenta ni al correo),
 * para que Google no bloquee el script por pedir permisos sensibles.
 */

// Recibe las solicitudes del sitio web y las guarda en la hoja "Solicitudes".
// Cada solicitud nueva manda un aviso por correo a NOTIFY_EMAIL (ver notify_).
const SHEET_NAME = 'Solicitudes';
const COLUMNS = ['fecha', 'origen', 'servicio', 'volumen', 'modalidad', 'nombre', 'empresa',
                 'correo', 'telefono', 'mensaje', 'pagina', 'estado', 'proxima_accion'];
const MAX_LEN = 1000;
const MAX_PER_WINDOW = 30;   // solicitudes aceptadas por ventana, entre todos los visitantes
const WINDOW_SECONDS = 600;  // ventana de 10 minutos (la cuenta se renueva con cada solicitud nueva)
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const NOTIFY_EMAIL = 'saimontovar2@gmail.com'; // destinatario del aviso por cada solicitud nueva

// Ejecutar una vez desde el editor (botón ▶ con "setup" seleccionado) para preparar la hoja.
function setup() {
  const sheet = getSheet_();
  sheet.getRange(1, 1, 1, COLUMNS.length).setFontWeight('bold').setBackground('#EEF5F1');
  sheet.setFrozenRows(1);
  sheet.autoResizeColumns(1, COLUMNS.length);
}

function doPost(e) {
  const p = (e && e.parameter) || {};
  // Campo trampa: un bot lo llena, una persona no. Se responde "ok" sin guardar para no darle pistas.
  if (p.hp_control) return ContentService.createTextOutput('ok');
  if (!p.nombre || !EMAIL_RE.test(String(p.correo || '').trim())) return ContentService.createTextOutput('faltan datos');

  // La URL del script es pública: se limita cuántas solicitudes entran por ventana de tiempo
  // y se ignoran los envíos repetidos (mismo correo y mensaje), para que nadie llene la hoja
  // ni dispare cientos de avisos por correo.
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const cache = CacheService.getScriptCache();
    const count = Number(cache.get('count') || 0);
    if (count >= MAX_PER_WINDOW) return ContentService.createTextOutput('limite');

    const digest = Utilities.computeDigest(Utilities.DigestAlgorithm.MD5, String(p.correo).trim().toLowerCase() + '|' + (p.mensaje || ''));
    const dupKey = 'dup_' + Utilities.base64EncodeWebSafe(digest);
    if (cache.get(dupKey)) return ContentService.createTextOutput('ok'); // ya estaba guardada
    cache.put(dupKey, '1', WINDOW_SECONDS);
    cache.put('count', String(count + 1), WINDOW_SECONDS);

    const row = COLUMNS.map(c => {
      if (c === 'fecha') return new Date();
      if (c === 'estado') return 'Nuevo';
      return clean_(p[c]);
    });
    getSheet_().appendRow(row);
    notify_(row);
  } finally {
    lock.releaseLock();
  }

  return ContentService.createTextOutput('ok');
}

// Prueba del aviso por correo: ejecutar desde el editor (▶ con "probarAviso" seleccionado) y aceptar los permisos.
function probarAviso() {
  MailApp.sendEmail(NOTIFY_EMAIL, 'Prueba de aviso: C.H. Pray', 'Si lees esto, el aviso por correo de la web funciona.');
}

// Aviso por correo. Si falla (cuota de Gmail, permisos), la solicitud ya quedó en la hoja: no se pierde.
function notify_(row) {
  try {
    const datos = COLUMNS.map((c, i) => c + ': ' + (row[i] instanceof Date ? row[i].toLocaleString('es-CO') : row[i])).join('\n');
    MailApp.sendEmail(NOTIFY_EMAIL, 'Nueva solicitud web: ' + row[2] + ' (' + row[5] + ')', datos);
  } catch (err) {
    console.error('No se pudo enviar el aviso: ' + err);
  }
}

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) sheet.appendRow(COLUMNS);
  return sheet;
}

// Recorta el texto y evita que Sheets (o un CSV exportado) lo interprete como fórmula:
// =, +, -, @ y también tabulación o salto de línea al inicio.
function clean_(value) {
  const text = String(value || '').slice(0, MAX_LEN);
  return /^[=+\-@\t\r\n]/.test(text) ? "'" + text : text;
}
