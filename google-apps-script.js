// Google Apps Script - Deploy this as a Web App
// 1. Open Google Sheets
// 2. Extensions -> Apps Script
// 3. Paste this code
// 4. Deploy -> New Deployment -> Web App
// 5. Set "Execute as: Me" and "Who has access: Anyone"
// 6. Copy the Web App URL

function doPost(e) {
  try {
    // Get the active spreadsheet
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Parse the incoming data
    const data = JSON.parse(e.postData.contents);
    
    // Check if this is a duplicate check request
    if (data.checkDuplicate) {
      const email = data.email.toLowerCase();
      const emailColumn = 4; // Email is in column D (4th column)
      const dataRange = sheet.getDataRange();
      const values = dataRange.getValues();
      
      // Check if email already exists (skip header row)
      for (let i = 1; i < values.length; i++) {
        if (values[i][emailColumn - 1] && values[i][emailColumn - 1].toString().toLowerCase() === email) {
          return ContentService
            .createTextOutput(JSON.stringify({ exists: true }))
            .setMimeType(ContentService.MimeType.JSON);
        }
      }
      
      return ContentService
        .createTextOutput(JSON.stringify({ exists: false }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // Regular submission
    const row = data.row;
    
    // Append the row to the sheet
    sheet.appendRow(row);
    
    // Return success
    return ContentService
      .createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    // Return error
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Add headers to your sheet (run this once)
function setupHeaders() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const headers = [
    'Timestamp',
    'Name',
    'Phone',
    'Email',
    'How did you hear about us?',
    'Overall Rating',
    'Overall Comments',
    'Food Rating',
    'Food Comments',
    'Decor Rating',
    'Decor Comments',
    'Entertainment Rating',
    'Entertainment Comments',
    'Suggestions'
  ];
  
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
}