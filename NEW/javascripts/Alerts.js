/**
 * Created by smile on 18/02/16.
 */


/*********************************************************************************************************
 Alerts Constructor
 ********************************************************************************************************/

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

    var tableColumns = [];
    for (var i = 0; i < jsonContent.content.length; i++)
      tableColumns.push({'title':jsonContent.content[i]});

    $('#divAlerts').append('<table id="tableAlerts" class="display"></table>');

    $('#tableAlerts').DataTable( {

      data: jsonContent.data,
      columns: tableColumns,
      scrollY: 1,
      lengthMenu: [[ 10, 25, 50, 100, -1 ],[ 10, 25, 50, 100, "All" ]],
      pageLength: 50,
      responsive: true,
      scrollCollapse: true,
      sDom: '<"dataTable_Header"lf><"dataTable_Content"rt><"dataTable_Footer"ip><"clear">',
      fnInitComplete: function() { $( document ).trigger("dataTable_Loaded"); this.fnPageChange( 'last' ) },
      columnDefs: [

        // The `data` parameter refers to the data for the cell (defined by the
        // `data` option, which defaults to the column being worked with, in
        // this case `data: 0`.
        /*{"render": function ( data, type, row ) {
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
                alert("ChargerAlerts : new severity :"+ data);
                break;
            }
          },
          "targets": 0
        },*/
        /*{
          "render": function ( data, type, row ) {
            if(row[3] == "")
              return data;
            else
              return data+ "<div class='alertDetailIcon' onclick='displayPopUp(\""+row[3]+"\")'  title='More info'></div>";
          },
          "targets": 2
        },*/
        //{ "targets": 3, "visible": false, "searchable": false }
        { "targets": 0, "visible": false, "searchable": false },
        { "targets": 5, "visible": false, "searchable": false }
      ],
      "rowCallback": function( row, data ) {
        $(row).attr("role", "button");
        $(row).off("click");
        $(row).on("click", function(){
          // TODO : click on alert (show alert details)
          console.warn( 'TODO: click on alert (show alert details)' );
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






