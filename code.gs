function doGet() {
  return HtmlService.createTemplateFromFile('Index')
      .evaluate()
      .setTitle('Konferensiya Qatnashchilari va Ro\'yxatdan O\'tish')
      .addMetaTag('viewport', 'width=device-width, initial-scale=1')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

// Qatnashchini Google Sheets'ga qo'shish
function addParticipant(formData) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName("Qatnashchilar");
    
    // Agar "Qatnashchilar" varag'i topilmasa, uni avtomatik yaratib sarlavha qo'yamiz
    if (!sheet) {
      sheet = ss.insertSheet("Qatnashchilar");
      sheet.appendRow(["Vaqt", "F.I.Sh.", "O'quv kursi / Guruh", "Ma'ruza mavzusi", "Yo'nalishi", "E-pochta", "Telefon raqami"]);
    }
    
    var timestamp = new Date();
    sheet.appendRow([
      timestamp,
      sanitizeInput(formData.fullname),
      sanitizeInput(formData.group),
      sanitizeInput(formData.topic),
      sanitizeInput(formData.direction),
      sanitizeInput(formData.email),
      sanitizeInput(formData.phone)
    ]);
    
    return { success: true, message: "Muvaffaqiyatli ro'yxatdan o'tdingiz!" };
  } catch (error) {
    return { success: false, message: "Xatolik yuz berdi: " + error.message };
  }
}

// Google Sheets'dan ro'yxatni o'qib kelish
function getParticipants() {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName("Qatnashchilar");
    
    if (!sheet) return [];
    
    var data = sheet.getDataRange().getValues();
    if (data.length <= 1) return [];
    
    var participants = [];
    for (var i = 1; i < data.length; i++) {
      var row = data[i];
      if (row[1]) {
        participants.push({
          time: row[0] ? new Date(row[0]).toLocaleDateString() : "",
          fullname: sanitizeInput(row[1]),
          group: sanitizeInput(row[2]),
          topic: sanitizeInput(row[3]),
          direction: sanitizeInput(row[4]),
          email: sanitizeInput(row[5]),
          phone: sanitizeInput(row[6])
        });
      }
    }
    return participants.reverse();
  } catch (error) {
    return [];
  }
}

function sanitizeInput(str) {
  if (!str) return "";
  return String(str).replace(/`/g, "'").replace(/‘/g, "'").replace(/’/g, "'").trim();
}
