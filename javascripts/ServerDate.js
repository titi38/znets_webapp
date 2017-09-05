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

    var minuteChange_Subscribers = {};


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

        serverDate = dateString;
/*
        $("#serverDate").html(" "+moment(dateString).add(parseInt(moment().format("Z")), "hours").format('HH:mm'));

 */

        // change rawData calendar max date
        $('#fromDate_RawDataForm').data("DateTimePicker").maxDate(moment(dateString).add(parseInt(moment().format("Z")), "hours"));
        $('#toDate_RawDataForm').data("DateTimePicker").maxDate(moment(dateString).add(parseInt(moment().format("Z")), "hours"));
       // $('#fromDate_RawDataForm').data("DateTimePicker").defaultDate(moment(dateString).add(parseInt(moment().format("Z")), "hours"));
       // $('#toDate_RawDataForm').data("DateTimePicker").defaultDate(moment(dateString).add(parseInt(moment().format("Z")), "hours"));

        // change rawData calendar max date
        $('#fromDate_ChartsForm').data("DateTimePicker").maxDate(moment(dateString).add(parseInt(moment().format("Z")), "hours"));
        $('#toDate_ChartsForm').data("DateTimePicker").maxDate(moment(dateString).add(parseInt(moment().format("Z")), "hours"));
        $('#fromDate_ChartsForm').data("DateTimePicker").defaultDate(moment(dateString).add(parseInt(moment().format("Z")), "hours"));
        $('#toDate_ChartsForm').data("DateTimePicker").defaultDate(moment(dateString).add(parseInt(moment().format("Z")), "hours"));

        if ( $("#timesliceCharts").val().indexOf('last') == 0 )
        {
            $('#toDate_ChartsForm').data("DateTimePicker").date(moment(dateString).add(parseInt(moment().format("Z")), "hours"));
            updateChartsTimestepForm($('#toDate_ChartsForm').data().date);

            if ( moment(dateString).minute() == 0 || $("#timestepCharts").val() == "MINUTE") {
                $("#applyBtn_charts_form").prop("disabled", false);
                $("#resetBtn_charts_form").prop("disabled", false);
            }
        }

        //charts_form


        for (var key in minuteChange_Subscribers) {
            //console.log("serverDateChanges key="+key)

            //console.log(Math.random() * minuteChange_Subscribers[key].dT + 1)
            setTimeout( function(_key) {
                minuteChange_Subscribers[_key].callback(dateString, minuteChange_Subscribers[_key].callbackParams);
            }, Math.random() * minuteChange_Subscribers[key].dT + 1, key);

        }

    }


    this.addCallback = function(name, callback, callbackParams, dT){
        if(minuteChange_Subscribers[name])
            delete minuteChange_Subscribers[name];
        minuteChange_Subscribers[name] =  { callback: callback, callbackParams: callbackParams, dT: dT };

    }

    this.removeCallback = function(name){
        if(minuteChange_Subscribers[name])
            delete minuteChange_Subscribers[name];
    }


    this.resetGraphRefresh = function(){
        //console.error(minuteChange_Subscribers["theGraph"]);
        if(minuteChange_Subscribers["theGraph"])
            delete minuteChange_Subscribers["theGraph"];
        //console.error(minuteChange_Subscribers["theGraph"]);
    }


}



