// Recibe las solicitudes del sitio web y las guarda en la hoja "Solicitudes".
// También envía un aviso por correo a NOTIFY_EMAIL.
const SHEET_NAME = 'Solicitudes';
const NOTIFY_EMAIL = 'direccion@chpray.com';
const COLUMNS = ['fecha', 'origen', 'servicio', 'volumen', 'modalidad', 'nombre', 'empresa',
                 'correo', 'telefono', 'mensaje', 'pagina', 'estado', 'proxima_accion'];

function doPost(e) {
  const p = e.parameter;
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) sheet.appendRow(COLUMNS);

  const row = COLUMNS.map(c => c === 'fecha' ? new Date() : c === 'estado' ? 'Nuevo' : (p[c] || ''));
  sheet.appendRow(row);

  MailApp.sendEmail(NOTIFY_EMAIL,
    `Nueva solicitud web: ${p.empresa || ''} (${p.servicio || ''})`,
    COLUMNS.map((c, i) => `${c}: ${row[i]}`).join('\n'));

  return ContentService.createTextOutput('ok');
}
