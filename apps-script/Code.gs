// Recibe las solicitudes del sitio web y las guarda en la hoja "Solicitudes".
// También envía un aviso por correo a NOTIFY_EMAIL.
const SHEET_NAME = 'Solicitudes';
const NOTIFY_EMAIL = 'direccion@chpray.com';
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

  const sheet = getSheet_();
  const row = COLUMNS.map(c => {
    if (c === 'fecha') return new Date();
    if (c === 'estado') return 'Nuevo';
    return clean_(p[c]);
  });
  sheet.appendRow(row);

  MailApp.sendEmail(NOTIFY_EMAIL,
    `Nueva solicitud web: ${clean_(p.empresa)} (${clean_(p.servicio)})`,
    COLUMNS.map((c, i) => `${c}: ${row[i]}`).join('\n'));

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
