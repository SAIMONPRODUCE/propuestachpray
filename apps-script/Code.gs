/**
 * @OnlyCurrentDoc
 * Solo pide acceso a esta hoja (no a todas las hojas de la cuenta ni al correo),
 * para que Google no bloquee el script por pedir permisos sensibles.
 */

// Recibe las solicitudes del sitio web y las guarda en la hoja "Solicitudes".
// Los avisos por correo se configuran en la hoja: Herramientas → Reglas de notificación.
const SHEET_NAME = 'Solicitudes';
const COLUMNS = ['fecha', 'origen', 'servicio', 'volumen', 'modalidad', 'nombre', 'empresa',
                 'correo', 'telefono', 'mensaje', 'pagina', 'estado', 'proxima_accion'];
const MAX_LEN = 1000;

// Ejecutar una vez desde el editor (botón ▶ con "setup" seleccionado) para preparar la hoja.
function setup() {
  const sheet = getSheet_();
  sheet.getRange(1, 1, 1, COLUMNS.length).setFontWeight('bold').setBackground('#EEF5F1');
  sheet.setFrozenRows(1);
  sheet.autoResizeColumns(1, COLUMNS.length);
}

function doPost(e) {
  const p = (e && e.parameter) || {};
  if (!p.nombre || !p.correo) return ContentService.createTextOutput('faltan datos');

  const row = COLUMNS.map(c => {
    if (c === 'fecha') return new Date();
    if (c === 'estado') return 'Nuevo';
    return clean_(p[c]);
  });
  getSheet_().appendRow(row);

  return ContentService.createTextOutput('ok');
}

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) sheet.appendRow(COLUMNS);
  return sheet;
}

// Recorta el texto y evita que Sheets lo interprete como fórmula (=, +, -, @).
function clean_(value) {
  const text = String(value || '').slice(0, MAX_LEN);
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}
