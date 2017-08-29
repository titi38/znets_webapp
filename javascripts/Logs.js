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
    var t = $('#tableLogs').DataTable();

    t.row.add( [
      logEntry.severity,
      moment(logEntry.date).add(parseInt(moment().format("Z")), "hours").format('YYYY-MM-DD HH:mm'), // log Entry Date is at server time => conversion to client time
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

//      if(firstSignificativeLogReached)
        this.insertLogDisplay(i);
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
        "order": [[ 1, "desc" ]],
//      fnInitComplete: function() { $( document ).trigger("dataTable_Loaded"); this.fnPageChange( 'last' ) },
      columnDefs: [
          {  "width": "20rem", "targets": 1, "title": "Date" },
          {
              // The `data` parameter refers to the data for the cell (defined by the
              // `data` option, which defaults to the column being worked with, in
              // this case `data: 0`.

                "render": function ( data, type, row ) {
                    var result = "";
                    switch (row[0]) {
                        case "WARNING":
                            result += "<i class='logWarningIcon' title='Warning'></i>";
                            break;
                        case "ALERT":
                            result += "<i class='logAlertIcon' title='Alert'></i>";
                            break;
                        case "INFO":
                            result += "<i class='logInfoIcon' title='Info'></i>";
                            break;
                        case "ERROR":
                            result += "<i class='logErrorIcon' title='Error'></i>";
                            break;
                        case "FATAL":
                            result += "<i class='logFatalIcon' title='Fatal'></i>";
                            break;
                        default:
                            console.error ("ChargerLogs - unknown severity :" + row[0]);
                            break;
                    }

                    result += "&nbsp; "+data+ " &nbsp;&nbsp;";

                    if(row[3] != "")
                      result += "<i class='glyphicon glyphicon-search'  title='More info'></i>";
                      //result += "<i class='glyphicon glyphicon-search' onclick='displayPopUp(\""+row[3]+"\")'  title='More info'></i>";

                    return result;
            },
            "targets": 2, "title": "Message"
          },

          { "visible": false,  "targets": [ 0 ] },
          { "visible": false,  "targets": [ 3 ] }
      ],
      "rowCallback": function( row, data ) {
        $(row).attr("role", "button");

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

  this.init = function() {
    var _this = this;
    theWSEventNotifier.waitForSocketConnection(
        _this.onWSConnect()
    );
  };

}





