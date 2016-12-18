/**
 * Created by smile on 01/08/16.
 */



/*********************************************************************************************************
 ServerDate Constructor
 ********************************************************************************************************/


/**
 * Server Date Object (Constructor)
 * Involves a WebSocket Event Notifier in order to update automatically server's date for user's interface
 * @param theWSEventNotifier
 * @constructor
 */
function ServerDate(theWSEventNotifier) {

    var serverDateEntries = new Array();
    var loadingAJAX = true;


    this.setServerDateDisplay = function(serverDateEntry)
    {
        this.serverDateChanges(serverDateEntry.date);
    };


    this.addServerDateEntry = function (date)
    {
        serverDateEntries.push({"date": date});
        if (!loadingAJAX)
            this.unstackFIFO();
    };


    this.onWSConnect = function(){
        var _this = this;
        theWSEventNotifier.addCallback("notify", "date_processing", function (param_json) {
            _this.addServerDateEntry(param_json.date);
        });
        // TODO CallAJAX to get ServerDate (getServerDate.json)
        callAJAX('getGMTdate.json', '', 'json', _this.displayServerDate, _this);

    };


    this.unstackFIFO = function (){
        while (serverDateEntries.length != 0)
        {
            this.setServerDateDisplay(serverDateEntries.shift() );
        }
    };



    this.displayServerDate = function(jsonContent, _this)
    {
        serverDate = new Date(jsonContent.yr+"-"+jsonContent.m+"-"+jsonContent.d+" "+jsonContent.h+":"+jsonContent.mn);

        initializeRawDataForm_TimeFields();
        initializeChartsTimestepForm();

        _this.serverDateChanges(serverDate);

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

    this.serverDateChanges = function(dateString){

        // change server date display
        //$("#serverDate").html(": "+moment(dateString).format('YYYY-MM-DD HH:mm')+ " (GMT)");

        console.info("THERRRRRE");

        serverDate = dateString;

        $("#serverDate").html(" "+moment(dateString).add(parseInt(moment().format("Z")), "hours").format('HH:mm'));


        // change rawData calendar max date
        $('#fromDate_RawDataForm').data("DateTimePicker").maxDate(moment(dateString).add(parseInt(moment().format("Z")), "hours"));
        $('#toDate_RawDataForm').data("DateTimePicker").maxDate(moment(dateString).add(parseInt(moment().format("Z")), "hours"));
        $('#fromDate_RawDataForm').data("DateTimePicker").defaultDate(moment(dateString).add(parseInt(moment().format("Z")), "hours"));
        $('#toDate_RawDataForm').data("DateTimePicker").defaultDate(moment(dateString).add(parseInt(moment().format("Z")), "hours"));
        /*$('#fromDate_RawDataForm').data("DateTimePicker").date(moment(dateString).add(parseInt(moment().format("Z")), "hours"));
        $('#toDate_RawDataForm').data("DateTimePicker").date(moment(dateString).add(parseInt(moment().format("Z")), "hours"));*/

        // change Charts Form calendar max date
        $('#fromDate_ChartsForm').data("DateTimePicker").maxDate(moment(dateString).add(parseInt(moment().format("Z")), "hours"));
        $('#toDate_ChartsForm').data("DateTimePicker").maxDate(moment(dateString).add(parseInt(moment().format("Z")), "hours"));
        $('#fromDate_ChartsForm').data("DateTimePicker").defaultDate(moment(dateString).add(parseInt(moment().format("Z")), "hours"));
        $('#toDate_ChartsForm').data("DateTimePicker").defaultDate(moment(dateString).add(parseInt(moment().format("Z")), "hours"));

        /*if($("#timesliceCharts").val() != "custom") {
            $('#fromDate_ChartsForm').data("DateTimePicker").date(moment(dateString).add(parseInt(moment().format("Z")), "hours"));
            $('#toDate_ChartsForm').data("DateTimePicker").date(moment(dateString).add(parseInt(moment().format("Z")), "hours"));
        }*/

    }

}



