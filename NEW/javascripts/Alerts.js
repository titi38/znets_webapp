/**
 * Created by smile on 18/02/16.
 */


/*********************************************************************************************************
 Alerts Constructor
 ********************************************************************************************************/

/**
 * Alerts Object Constructor. 
 * Involves a WebSocket Event Notifier in order to update automatically Alerts for user's interface
 * Displays Alerts in a table (DataTable)
 * @param theWSEventNotifier
 * @constructor
 */
function Alerts(theWSEventNotifier) {

  var alertEntries = new Array();
  var loadingAJAX = true;
  var bufferSize = 0;
  var nextAlertId = 0;
  var firstSignificativeAlertReached = false;
  //var alertId = -1;

  /*
  Display a new alert entry into the Alerts datatable
  Parameter : alertEntry
  return : nothing
   */
  this.insertAlertDisplay = function(alertEntry)
  {
    // TODO write D3JS update table function
    console.log("NEW ALERT ENTRY :");
    console.log(alertEntry);

      var t = $('#tableAlerts').DataTable();

        t.row.add( [
          alertEntry.severity,
          alertEntry.date,
          alertEntry.message,
          alertEntry.detail
        ] ).draw( false );


  }


  this.addAlertEntry = function (id, severity, date, message, detail)
  {
    alertEntries.push({"id": id, "severity" : severity, "date" : date, "message" : message, "detail" : detail});
    if (!loadingAJAX)
      this.unstackFIFO();
  }


  this.onWSConnect = function(){
    var _this = this;
    theWSEventNotifier.addCallback("notify", "alerts", function (param_json) {
      _this.addAlertEntry(param_json.id, param_json.severity, param_json.date, param_json.message, param_json.detail);
    });
    // TODO CallAJAX to get Alerts (getAlert.json)
    callAJAX('getAlertList.json', '', 'json', _this.displayAlerts, _this);

  };


  this.unstackFIFO = function (){
    while (alertEntries.length != 0)
    {
      var i = alertEntries.shift();

      if(!firstSignificativeAlertReached && i.id == nextAlertId)
        firstSignificativeAlertReached = true;

      if(firstSignificativeAlertReached){
        this.insertAlertDisplay(i);
      }
    }
  };



  this.displayAlerts = function(jsonContent, _this)
  {

    bufferSize = jsonContent.bufSize;
    nextAlertId = jsonContent.nextId;


    $('#divAlerts').append('<table id="tableAlerts" class="display table table-striped table-bordered dataTable no-footer"></table>');

    table = $('#tableAlerts').DataTable( {

      data: jsonContent.data,
      scrollY: 1,
      //lengthMenu: [[ 10, 25, 50, 100, -1 ],[ 10, 25, 50, 100, "All" ]],
      pageLength: -1,
      paging: false,
      responsive: true,
      scrollCollapse: true,
      language: {
        "sInfo": 'Showing _END_ Entries.',
        "sInfoEmpty": 'No entries to show',
      },
      //fnInitComplete: function() { $( document ).trigger("dataTable_Loaded"); this.fnPageChange( 'last' ) },
      fnInitComplete: function() { $( document ).trigger("dataTable_Loaded");},
      columnDefs: [
        { "targets": 0, "visible": false, "searchable": false },
        { "targets": 1, "className": "dt-head-center dt-body-center", "title": "Date"},
        { "targets": 2, "type": 'ip-address', "className": "dt-head-center dt-body-center", "title": "Ip"},
        { "targets": 3, "className": "dt-head-center dt-body-center", "title": "Host Name"},
        { "targets": 4, "className": "dt-head-center dt-body-center", "title": "Message"},
        { "targets": 5, "visible": false, "searchable": false }
      ],
      "rowCallback": function( row, data ) {
        $(row).attr("role", "button");
        $(row).off("click");
        $(row).on("click", function(){
          // TODO : click on alert (show alert details)
          console.warn( 'TODO: click on alert (show alert details)' );
          getAlertDetail(data);
        });

        /*if ( $.inArray(data.DT_RowId, selected) !== -1 ) {
          $(row).addClass('selected');
        }*/

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






