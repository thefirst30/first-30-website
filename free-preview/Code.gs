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
  const incomplete = response === 'incomplete';
  if (!tokenPattern.test(id) || (referredBy && !tokenPattern.test(referredBy)) ||
      !['attend', 'january', 'updates', 'other-times', 'no-follow-up', 'incomplete'].includes(response) ||
      name.length > 120 || email.length > 254 || phone.length > 40 ||
      (contactRequired && ((!incomplete && !name) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) ||
      (['attend', 'january'].includes(response) && !phone)) {
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
    // Match incomplete leads by email, without changing existing completed bookings.
    const matching = contactRequired && lastRow > 1
      ? sheet.getRange(2, 3, lastRow - 1, 3).getValues().map((row, i) => ({email: String(row[0]).trim().toLowerCase(), status: row[2], row: i + 2})).filter(row => row.email === email.toLowerCase())
      : [];
    const pending = matching.find(row => row.status === 'incomplete');
    if (incomplete && matching.some(row => ['attend', 'january', 'incomplete'].includes(row.status))) {
      return result({ok: true});
    }
    const referrer = referredBy && find(7, referredBy) ? referredBy : '';
    const shareCode = contactRequired && !incomplete ? Utilities.getUuid() : '';
    const optIn = ['updates', 'other-times'].includes(response) ||
      (['attend', 'january'].includes(response) && input.updates === 'on');
    const safe = (value) => /^[=+@-]/.test(value) ? "'" + value : value;
    const values = [
      new Date().toISOString(), safe(name), contactRequired ? safe(email) : '',
      contactRequired && phone ? "'" + phone : '', response, optIn, shareCode, referrer,
      response === 'attend' ? 'To book' : response === 'january' ? 'January pass — to arrange' : incomplete ? 'Not booked' : '', id
    ];
    if (pending && ['attend', 'january'].includes(response)) {
      values[0] = sheet.getRange(pending.row, 1).getValue();
      sheet.getRange(pending.row, 1, 1, values.length).setValues([values]);
    } else {
      sheet.appendRow(values);
    }
    SpreadsheetApp.flush();
    return result({ok: true, referralCode: shareCode});
  } finally {
    lock.releaseLock();
  }
}
