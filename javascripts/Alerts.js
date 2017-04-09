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
 * @param theWSEventNotifier {WSEventNotifier} WSEventNotifier object name
 * @constructor
 */
function Alerts(theWSEventNotifier) {

  /**
   *
   * @type {Array}
     */
  var datatable = null;
  var alertEntries = new Array();
  var loadingAJAX = true;
  var currentPresetFilter = 1;
  var currentIpFilter = "";
  //var alertId = -1;

  /**
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

    console.info(t);

        t.row.add( [
            -1,
          moment(alertEntry.date).add(parseInt(moment().format("Z")), "hours").format('YYYY-MM-DD HH:mm'),
          alertEntry.ip,
          alertEntry.hostname,
          alertEntry.title,
          alertEntry.detail
        ] )
        .draw( false )
  //      .addClass( 'new-alert' );


  }

  /**
   * Deals with received Alerts on WebSocket
   *  - If Alerts are still initiating, then stacks received Alert temporary
   *  - If not, triggers temporary stacked Alerts unstack
   * @param date  {number} Alert's date
   * @param title {string} Alert's title
   * @param ip {string} Alert's ip
   * @param hostname {string} Alert's hostname
   * @param detail {string} Alert's detail
   */
  this.addAlertEntry = function (date, title, ip, hostname, detail)
  {
    if (currentIpFilter == "" || currentIpFilter == ip) {
        alertEntries.push({"date": date, "title": title, "ip": ip, "hostname": hostname, "detail": detail});
        if (!loadingAJAX)
            this.unstackFIFO();
    }
  }

  /**
   * Triggered on WebSocket Connection
   */
  this.onWSConnect = function(){
    var _this = this;
    theWSEventNotifier.addCallback("notify", "alert", function (param_json) {
      _this.addAlertEntry(param_json.date, param_json.title, param_json.ip, param_json.hostname, param_json.detail);
    });
    // TODO CallAJAX to get Alerts (getAlert.json)
    this.loadAlerts();
  };

  this.updateAlertFilterButtons = function() {
        res = currentPresetFilter === $("#filterPresetsAlerts").val() &&  currentIpFilter === $("#filterIpAlerts").val();
        $("#btn-alertFilterApply").prop('disabled', res);
    }

  this.loadAlerts = function ()
  {
      currentPresetFilter = $("#filterPresetsAlerts").val();
      var params =  "duree=" + currentPresetFilter;

      currentIpFilter = $("#filterIpAlerts").val();

      if (currentIpFilter !== "")
          params += "&ip="+currentIpFilter;

      callAJAX('getAlertList.json', params, 'json', this.displayAlerts, this);
      this.updateAlertFilterButtons();
  }

   this.resetFilter = function ()
   {
       $("#filterPresetsAlerts").val(1);
       $("#filterIpAlerts").val("");

       this.loadAlerts();
   }

    /**
   * Unstack alerts received on WebSocket while initialing Alerts object
   */
  this.unstackFIFO = function (){
    while (alertEntries.length != 0)
    {
      var i = alertEntries.shift();
      this.insertAlertDisplay(i);
    }
  };

  /**
   * Displays (in a DataTable) alerts list received from server after ajac query
   * @param jsonContent {JSON} Request's Response JSON
   * @param _this {Alerts} Self
   */
  this.displayAlerts = function(jsonContent, _this)
  {
    if (datatable !== null) {
        datatable.destroy();
    }
    else
      $('#divAlerts').append('<table id="tableAlerts" class="display table table-striped table-bordered dataTable no-footer"></table>');

    datatable = $('#tableAlerts').DataTable( {

      data: jsonContent.data,
      scrollY: 1,
      paging: true,
      pageLength: 100 /* -1 */,
/*      pageLength: -1,
      paging: false,*/
      responsive: true,
      scrollCollapse: true,
      language: {
        "sInfo": 'Showing _END_ Entries.',
        "sInfoEmpty": 'No entries to show',
      },
      //fnInitComplete: function() { $( document ).trigger("dataTable_Loaded"); this.fnPageChange( 'last' ) },
   //   fnInitComplete: function() { $( document ).trigger("dataTable_Loaded");},
      columnDefs: [
        { "targets": 0, "visible": false, "searchable": false },
        { "targets": 1, "className": "dt-head-center dt-body-center", "title": "Date"},
        { "targets": 2, "type": 'ip-address', "className": "dt-head-center dt-body-center", "title": "Ip"},
        { "targets": 3, "className": "dt-head-center dt-body-center", "title": "Host Name"},
        { "targets": 4, "className": "dt-head-center dt-body-center", "title": "Message"},
        { "targets": 5, "visible": false, "searchable": false }
      ],
      order: [[ 1, "desc" ]],
      "createdRow": function ( row, data, index ) {
        console.info(data[data.length -1]);
        if(data[data.length -1] != "")
          $(row).addClass("new-alert");
      },
      "rowCallback": function( row, data ) {
        $(row).attr("role", "button");
        $(row).off("click");
        $(row).on("click", function() {
            $(row).addClass('alert-selected');
            getAlertDetail(data);
            setTimeout( function() {
              $(row).removeClass('new-alert'); }, 750);
        });


      /*  if ( $.inArray(data.DT_RowId, selected) !== -1 ) {
          $(row).addClass('selected');
        }*/
      }
    } );

    _this.unstackFIFO();
    loadingAJAX = false;
  };

  /**
   * Initialisation function
   */
  this.init = function()
  {
    var _this = this;
    theWSEventNotifier.waitForSocketConnection(
        _this.onWSConnect()
    );
  };
}






