const SHEET_ID = '1XLMiZXrad67zy_Qf_CtoaEoY4XJmCBxNxuezVKErQ78';

function doPost(event) {
  const result = (data) => ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
  const input = event.parameter;
  const id = input.submissionId || '';
  const response = input.response || '';
  const name = (input.name || '').trim();
  const email = (input.email || '').trim();
  const phone = (input.phone || '').trim();
  const referredBy = input.referredBy || '';
  const tokenPattern = /^[a-f0-9-]{36}$/i;
  const contactRequired = response !== 'no-follow-up';
  if (!tokenPattern.test(id) || (referredBy && !tokenPattern.test(referredBy)) ||
      !['attend', 'january', 'updates', 'other-times', 'no-follow-up'].includes(response) ||
      name.length > 120 || email.length > 254 || phone.length > 40 ||
      (contactRequired && (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) ||
      (response === 'attend' && !phone)) {
    return result({ok: false});
  }

  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName('RSVPs');
    const lastRow = sheet.getLastRow();
    const find = (column, value) => lastRow > 1 && sheet.getRange(2, column, lastRow - 1, 1)
      .createTextFinder(value).matchEntireCell(true).findNext();
    const existing = find(10, id);
    if (existing) {
      return result({ok: true, referralCode: sheet.getRange(existing.getRow(), 7).getValue()});
    }
    const referrer = referredBy && find(7, referredBy) ? referredBy : '';
    const shareCode = contactRequired ? Utilities.getUuid() : '';
    const optIn = ['updates', 'other-times'].includes(response) ||
      (['attend', 'january'].includes(response) && input.updates === 'on');
    const safe = (value) => /^[=+@-]/.test(value) ? "'" + value : value;
    sheet.appendRow([
      new Date().toISOString(), safe(name), contactRequired ? safe(email) : '',
      contactRequired && phone ? "'" + phone : '', response, optIn, shareCode, referrer,
      response === 'attend' ? 'To book' : response === 'january' ? 'January pass — to arrange' : '', id
    ]);
    SpreadsheetApp.flush();
    return result({ok: true, referralCode: shareCode});
  } finally {
    lock.releaseLock();
  }
}
