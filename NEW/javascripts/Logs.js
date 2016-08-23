/**
 * Created by smile on 18/02/16.
 */


/*********************************************************************************************************
 Logs Constructor
 ********************************************************************************************************/

/**
 * Logs Object (Constructor)
 * Involves a WebSocket Event Notifier in order to update automatically Logs for user's interface
 * Displays Logs in a table (DataTable)
 * @param theWSEventNotifier
 * @constructor
 */
function Logs(theWSEventNotifier) {

  var logEntries = new Array();
  var loadingAJAX = true;
  //var bufferSize = 0;
  var nextLogId = 0;
  var firstSignificativeLogReached = false;
  //var logId = -1;

  /*
  Display a new log entry into the logs datatable
  Parameter : logEntry
  return : nothing
   */
  
  
  this.insertLogDisplay = function(logEntry)
  {
    // TODO write D3JS update table function
    console.log("NEW LOG ENTRY :");
    console.log(logEntry);

    var t = $('#tableLogs').DataTable();

    t.row.add( [
      logEntry.severity,
      logEntry.date,
      logEntry.message,
      logEntry.detail
    ] ).draw( false );


  }


  this.addLogEntry = function (id, severity, date, message, detail)
  {
    logEntries.push({"id": id, "severity" : severity, "date" : date, "message" : message, "detail" : detail});
    if (!loadingAJAX)
      this.unstackFIFO();
  }


  this.onWSConnect = function(){
    var _this = this;
    theWSEventNotifier.addCallback("notify", "logs", function (param_json) {
      _this.addLogEntry(param_json.id, param_json.severity, param_json.date, param_json.message, param_json.detail);
    });
    // TODO CallAJAX to get Logs (getLog.json)
    callAJAX('getLogs.json', '', 'json', _this.displayLogs, _this);

  };


  this.unstackFIFO = function (){
    while (logEntries.length != 0)
    {
      var i = logEntries.shift();

      if(!firstSignificativeLogReached && i.id == nextLogId)
        firstSignificativeLogReached = true;

      if(firstSignificativeLogReached){
        this.insertLogDisplay(i);
      }
    }
  };



  this.displayLogs = function(jsonContent, _this)
  {

    //bufferSize = jsonContent.bufSize;
    nextLogId = jsonContent.nextId;

    /*var tableColumns = [];
    for (var i = 0; i < jsonContent.content.length; i++)
      tableColumns.push({'title':jsonContent.content[i]});*/

    $('#divLogs').append('<table id="tableLogs" class="display table table-striped table-bordered dataTable no-footer"></table>');
    $('#tableLogs').DataTable( {
      data: jsonContent.data,
      //columns: tableColumns,
      scrollY: 1,
      paging: false,
      pageLength: -1,
      responsive: true,
      scrollCollapse: true,
      language: {
        "sInfo": 'Showing _END_ Entries.',
        "sInfoEmpty": 'No entries to show',
      },
      fnInitComplete: function() { $( document ).trigger("dataTable_Loaded"); this.fnPageChange( 'last' ) },
      columnDefs: [
        {
          // The `data` parameter refers to the data for the cell (defined by the
          // `data` option, which defaults to the column being worked with, in
          // this case `data: 0`.
          "render": function ( data, type, row ) {
            switch (data){
              case "WARNING":
                return "<div class='logWarningIcon' title='Warning'/>";
                break;
              case "ALERT":
                return "<div class='logAlertIcon' title='Alert'/>";
                break;
              case "INFO":
                return "<div class='logInfoIcon' title='Info'/>";
                break;
              case "ERROR":
                return "<div class='logErrorIcon' title='Error'/>";
                break;
              case "FATAL":
                return "<div class='logFatalIcon' title='Fatal'/>";
                break;
              default:
                alert("ChargerLogs : new severity :"+ data);
                break;
            }
          },
          "targets": 0, "title": "Severity"
        },
        {
          "targets": 1, "title": "Date"
        },
        {
          "render": function ( data, type, row ) {
            if(row[3] == "")
              return "";
            else
              return "<div class='logDetailIcon' onclick='displayPopUp(\""+row[3]+"\")'  title='More info'></div>";
          },
          "targets": 2, "title": "Details"
        },
        {
          "render": function ( data, type, row ) {
              return row[2];
          },
          "targets": 3, "title": "Message"
        },
      ],
      "rowCallback": function( row, data ) {
        $(row).attr("role", "button");

        // Set cursor behavior (pointer if details, default if not)
        $(row).css('cursor',data[3] ? 'pointer' : 'default')

        // Set click on row function
        $(row).off("click");
        $(row).on("click", function () {
          // TODO : click on logs (show log details)
          if(data[3]) {
            showLogDetailsModal(data);
          }
          else
              console.log("No details for this log");
        });
      }
      
    } );

    _this.unstackFIFO();
    loadingAJAX = false;

  };



  this.init = function()
  {
    var _this = this;
    theWSEventNotifier.waitForSocketConnection(
        _this.onWSConnect()
    );
  };

}





