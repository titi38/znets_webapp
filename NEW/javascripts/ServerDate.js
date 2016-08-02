/**
 * Created by smile on 01/08/16.
 */



/*********************************************************************************************************
 ServerDate Constructor
 ********************************************************************************************************/

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
        console.warn("TODO ???");
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

        initializeRawDataForm_TimeFields();
        _this.serverDateChanges(new Date(jsonContent.yr+"-"+jsonContent.m+"-"+jsonContent.d+" "+jsonContent.h+":"+jsonContent.mn));

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
        $("#serverDate").html(": "+moment(dateString).format('YYYY-MM-DD HH:mm')+ " (GMT)");


        // change calendar max date
        $('#fromDate_RawDataForm').data("DateTimePicker").maxDate(moment(dateString).add(parseInt(moment().format("Z")), "hours"));
        $('#toDate_RawDataForm').data("DateTimePicker").maxDate(moment(dateString).add(parseInt(moment().format("Z")), "hours"));
        $('#fromDate_RawDataForm').data("DateTimePicker").defaultDate(moment(dateString).add(parseInt(moment().format("Z")), "hours"));
        $('#toDate_RawDataForm').data("DateTimePicker").defaultDate(moment(dateString).add(parseInt(moment().format("Z")), "hours"));

    }

}


