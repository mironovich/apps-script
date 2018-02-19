var SHEET_KEY = "13HONJjvisEKn4N2ef-qOcl2W872vN5CbvsEwtz7pngQ"; // идентификатор таблицы, берется из url
var SHEET_NAME = "Заявки";
var idGA = "UA-100949809-1";

function doGet(e){
  var lock = LockService.getPublicLock();
  
  try {
    var doc = SpreadsheetApp.openById(SHEET_KEY);
    var sheet = doc.getSheetByName(SHEET_NAME);
    var data = [];
    
    var a = new Date(parseInt(e.parameter['time']));
    var date = a.getFullYear() + '.' + a.getMonth() + '.' + a.getDate() + '.' + a.getHours() + ':' + a.getMinutes() + ':' + a.getSeconds();
        
    data = [ date,
            e.parameter['time'],
            e.parameter['form'],
            e.parameter['clientId'],
            e.parameter['name'],
            e.parameter['phone']];
    
    sheet.getRange(sheet.getLastRow() + 1, 1, 1, data.length).setValues([data]);
    
    return ContentService
    .createTextOutput(JSON.stringify({"result":"success"}))
      .setMimeType(ContentService.MimeType.JSON);

  } catch(e){
    return ContentService
          .createTextOutput(JSON.stringify({"result":"error", "error": e}))
          .setMimeType(ContentService.MimeType.JSON);
  } finally { //release lock
    lock.releaseLock();
  }
}

function myOnEdit(e){
 
  if(e.range.getColumn() == 8 && e.value == "ДА") {
    
    e.range.setNote(e.range.getRow() + ' ' + e.range.getColumn());
    
    var sheet = SpreadsheetApp.getActiveSheet();
    var range = sheet.getRange(2, 1, 1, 8);
    var data = sheet.getRange(e.range.getRow(), 1, 1, e.range.getColumn()).getValues();
    var row = data[0];
    
    e.range.setNote(idGA + ' ' + row[3] + ' ' + row[6] + ' ' + row[1]);
    
    var url = "http://www.google-analytics.com/collect?v=1&tid=" + idGA + "&cid=" + row[3] + "&t=event&ec=Заявка&ea=" + row[6] + "&z=" + row[1];
        
    //var res = UrlFetchApp.fetch(url);
    //e.range.setNote('Событие отправлено ' + new Date() + " url: " + url + 'res: ' + res);
    
    try {
      var res = UrlFetchApp.fetch(url);
      e.range.setNote('Событие отправлено ' + new Date() + " url: " + url);      
    } catch (c) {
      e.range.setNote(c + ' res: ' + res);
    }
    
  }
}


function test() {
    
  var doc = SpreadsheetApp.openById(SHEET_KEY);
  var sheet = doc.getSheetByName(SHEET_NAME);
  var range = sheet.getRange(2, 1, 1, 8);
  var data = sheet.getRange(2, 1, 1, 8).getValues();
  var row = data[0];
    
    range.setNote(idGA + ' ' + row[3] + ' ' + row[6] + ' ' + row[1]);
    
    var url = "http://www.google-analytics.com/collect?v=1&tid=" + idGA + "&cid=" + row[3] + "&t=event&ec=Заявка&ea=" + row[6] + "&z=" + row[1];
    
    UrlFetchApp.fetch(url);
  
    range.setNote('Событие отправлено ' + new Date() + " url: " + url)
    

}