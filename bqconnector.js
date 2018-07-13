var doc = SpreadsheetApp.getActiveSpreadsheet();
var sheet = doc.getSheetByName('Queries');
var params = sheet.getSheetValues(1, 1, sheet.getLastRow(), sheet.getLastColumn());
var week = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY']

function schedule() {
  var triggers = ScriptApp.getProjectTriggers();
  for (var i = 0; i < triggers.length; i++) {
    ScriptApp.deleteTrigger(triggers[i]);
  }
  
  for(i = 1; i < sheet.getLastColumn(); i++) {
    if('yes' == params[0][i]) {
      var f = parseInt(params[2][i]);
      if(f) {
        ScriptApp.newTrigger("run")
          .timeBased()
          .onMonthDay(f)
          .create();
      } else {
        ScriptApp.newTrigger("run")
          .timeBased()
          .onWeekDay(ScriptApp.WeekDay[params[2][i]])
          .create();
      }
    }
  }
}

function runTest() {
  for(i = 1; i < sheet.getLastColumn(); i++) {
    if('yes' == params[0][i]) {
      runQuery(i);
    }
  }
}

function run() {
  for(i = 1; i < sheet.getLastColumn(); i++) {
    if('yes' == params[0][i]) {
      var f = parseInt(params[2][i]);
      var date = new Date();
      if(date.getUTCDate() == f) {
        runQuery(i);
      } else if(week[date.getUTCDay()] == params[2][i] ) {
        runQuery(i);
      }
    }
  }
}

function runQuery(i) {
 
  var request = {
    query: params[4][i],
    useLegacySql: false
  };
    
  var queryResults = BigQuery.Jobs.query(request, params[1][i]);
  var jobId = queryResults.jobReference.jobId;

  // Check on status of the Query Job.
  var sleepTimeMs = 500;
  while (!queryResults.jobComplete) {
    Utilities.sleep(sleepTimeMs);
    sleepTimeMs *= 2;
    queryResults = BigQuery.Jobs.getQueryResults(projectId, jobId);
  }

  // Get all the rows of results.
  var rows = queryResults.rows;
  while (queryResults.pageToken) {
    queryResults = BigQuery.Jobs.getQueryResults(projectId, jobId, {
      pageToken: queryResults.pageToken
    });
    rows = rows.concat(queryResults.rows);
  }

  if (rows) {
    var rs = doc.getSheetByName(params[3][i]);
    var headers = queryResults.schema.fields.map(function(field) {
        return field.name;
      });
    
    // Append the headers.    
    if(1 == sheet.getLastRow()) {
      rs.appendRow(headers);
    }

    // Append the results.
    var data = new Array(rows.length);
    for (var i = 0; i < rows.length; i++) {
      var cols = rows[i].f;
      data[i] = new Array(cols.length);
      for (var j = 0; j < cols.length; j++) {
        data[i][j] = cols[j].v;
      }
    }
    rs.getRange(rs.getLastRow() + 1, 1, rows.length, headers.length).setValues(data);

    Logger.log('Results spreadsheet created: %s',
        doc.getUrl());
  } else {
    Logger.log('No rows returned.');
  }
}