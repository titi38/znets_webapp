/**
 * Created by smile on 11/03/16.
 */

function initialisation(){

    /*********************************************************************************************************
     Load all templates inside the JST global variable
     ********************************************************************************************************/
    /*JST["sensorView"] = doT.template(getTemplate("Templates/Views/sensorView.html"));
    JST["planView"] = doT.template(getTemplate("Templates/Views/planView.html"));
    JST["configPopup"] = doT.template(getTemplate("Templates/config_sensor-popup_content.html"));
    JST["debugPopup"] = doT.template(getTemplate("Templates/debug_sensor-popup_content.html"));
    JST["nrjSpectrumPopup"] = doT.template(getTemplate("Templates/nrjSpectrum_sensor-popup_content.html"));*/


    /*********************************************************************************************************
     New WSEventNotifier Object
     ********************************************************************************************************/
    var myWSEventNotifier = new WSEventNotifier('EventNotifier');

    /*********************************************************************************************************
     New Logs Object
     ********************************************************************************************************/
    var myLogs = new Logs(myWSEventNotifier);
    myLogs.init();

    /*********************************************************************************************************
     New Alerts Object
     ********************************************************************************************************/
    var myAlerts = new Alerts(myWSEventNotifier);
    myAlerts.init();


    /*********************************************************************************************************
     Activate logs tab
     ********************************************************************************************************/
    activateTabOfClass("logs");


    /**
     * Adjust log's dataTable column's widths
     */
    $('a.logTab').on('shown.bs.tab', function (e) {
        $('#tableLogs').DataTable().columns.adjust();
    });


    /*********************************************************************************************************
     Activate alerts tab
     ********************************************************************************************************/
    activateTabOfClass("alerts");


    /**
     * Adjust alert's dataTable column's widths
     */
    $('a.alertTab').on('shown.bs.tab', function (e) {
        $('#tableAlerts').DataTable().columns.adjust();
    });





    /*********************************************************************************************************
     Activate rawdata tab
     ********************************************************************************************************/
    activateTabOfClass("rawdata");




    /*********************************************************************************************************
     Activate rawdata tab
     ********************************************************************************************************/
    activateTabOfClass("network");


    /*********************************************************************************************************
     Initialize RawData known Application's Ids
     ********************************************************************************************************/
    initializeApplicationsId()

}


function getTemplate(templateUrl) {
    return $.ajax({
        type: "GET",
        url: templateUrl,
        async: false
    }).responseText;
}




/*********************************************************************************************************
 Activate a specified navigation tab
 ********************************************************************************************************/

function activateTabOfClass(tabClass)
{
    $('#tabs').find("li."+tabClass).removeClass("disabled");

    $("ul.navbar-nav li."+tabClass+" a").click(function (e) {
        e.preventDefault();
        $(this).tab('show');
    });
}




/*********************************************************************************************************
 Set home page content with acquisition status
 ********************************************************************************************************/

function setHomePage()
{
    //callAJAX('info.json', '', 'json', setHP, '');
    /**
    callAJAX('info.json', '', 'json', '', '');
     */

}

/**function setHP(json){
    $("#home_daqVersion").html("<b>Daq Version : </b>"+json.daqVersion);
    $("#home_acqStatus").html("<b>Acquisition Status : </b>" + ((json.status.acqRunning) ? "<b class='text-success faa-flash animated'> RUNNING </b>" : "<b class='text-danger'> STOPPED </b>") + ((json.status.acqDate) ? ("(since " + json.status.acqDate +")") : "(never runned before !)"));

    if(json.status.acqComment)
        $("#home_acqComment").html("<b>Comment : </b>"+json.status.acqComment);


    /*********************************************************************************************************
     Activate "home" navigation tab
     *********************************************************************************************************
    activateTabOfClass("home");

}*/


function getHtmlTemplate( elementJQuery, url, callBack)
{
    $(elementJQuery).html(getTemplate(url)).promise().done(function(){
        if(callBack)
            callBack();
    });
}





function initializeRawDataForm() {

    $('#fromDate_RawDataForm').datetimepicker({
        format: 'YYYY-MM-DD HH:mm',
        //defaultDate: moment(),


    });
    $('#toDate_RawDataForm').datetimepicker({
        format: 'YYYY-MM-DD HH:mm',
        //defaultDate: moment(),


    });


    $("#fromDate_RawDataForm").on("dp.show", function (e) {
        if($('#toDate_RawDataForm').data("DateTimePicker").maxDate())
            $('#fromDate_RawDataForm').data("DateTimePicker").maxDate($('#toDate_RawDataForm').data("DateTimePicker").maxDate());
        else
            $('#fromDate_RawDataForm').data("DateTimePicker").maxDate(moment());

    });

    $("#fromDate_RawDataForm").on("dp.change", function (e) {
        if(!e.date)
            $(this).data("DateTimePicker").date(moment().format('YYYY-MM-DD HH:mm'));

    });

    $("#toDate_RawDataForm").on("dp.change", function (e) {
        $(this).data("DateTimePicker").maxDate(moment());

        if(e.date)
            $('#fromDate_RawDataForm').data("DateTimePicker").maxDate(e.date);
        else {
            $('#fromDate_RawDataForm').data("DateTimePicker").maxDate(moment());
            $(this).data("DateTimePicker").date(moment().format('YYYY-MM-DD HH:mm'));
        }
    });

    $("#toDate_RawDataForm").on("dp.show", function (e) {
        $(this).data("DateTimePicker").maxDate(moment());
    });

}







function initializeChartsTimesliceForm() {

    $('#fromDate_ChartsForm').datetimepicker({
        format: 'YYYY-MM-DD HH:mm',
        defaultDate: moment().subtract(1, 'days').format('YYYY-MM-DD HH:mm'),


    });
    $('#toDate_ChartsForm').datetimepicker({
        format: 'YYYY-MM-DD HH:mm',
        defaultDate: moment(),


    });


    $("#fromDate_ChartsForm").on("dp.show", function (e) {
        if($('#toDate_ChartsForm').data("DateTimePicker").maxDate())
            $('#fromDate_ChartsForm').data("DateTimePicker").maxDate($('#toDate_ChartsForm').data("DateTimePicker").maxDate());
        else
            $('#fromDate_ChartsForm').data("DateTimePicker").maxDate(moment());

    });

    $("#fromDate_ChartsForm").on("dp.change", function (e) {
        if(!e.date)
            $(this).data("DateTimePicker").date(moment().format('YYYY-MM-DD HH:mm'));

    });

    $("#toDate_ChartsForm").on("dp.change", function (e) {
        $(this).data("DateTimePicker").maxDate(moment());

        if(e.date)
        {

            $('#fromDate_ChartsForm').data("DateTimePicker").maxDate(e.date);

            switch ($("#timesliceCharts").val()) {
                case "lastDay" :
                    $('#fromDate_ChartsForm').data("DateTimePicker").date(moment(e.date).subtract(1, 'days').format('YYYY-MM-DD HH:mm'));
                    break;
                case "lastMonth" :
                    $('#fromDate_ChartsForm').data("DateTimePicker").date(moment(e.date).subtract(1, 'months').format('YYYY-MM-DD HH:mm'));
                    break;
                case "hourly" :
                case "daily" :
                    // DO NOTHING
                    break;
                default :
                    console.error("UNEXPECTED ChartsTimeslice select value (Initialisation.js), %i ", 103);
                    break;
            }

        }
        else
        {
            $('#fromDate_ChartsForm').data("DateTimePicker").maxDate(moment());
            $(this).data("DateTimePicker").date(moment().format('YYYY-MM-DD HH:mm'));
        }
    });

    $("#toDate_ChartsForm").on("dp.show", function (e) {
        $(this).data("DateTimePicker").maxDate(moment());
    });

}

function addNetworksTabs(networksNamesTable) {

    for(var i=0 ; i<networksNamesTable.length; i++){
        addNetworkTab(networksNamesTable[i]);
        getHtmlTemplate("#divNetwork"+networksNamesTable[i], "NEW/templates/networksTabsContent.html", "");
    }

}

function initNetworksChartsNavTabs() {

    $('ul.nav-nest a[data-toggle="tab"]').on('click', function (e) {
        $($(e.target).parents("ul")[$(e.target).parents("ul").length-1]).find("li").removeClass("active");
    });

    $('ul.nav-nest a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
        // TODO : Load chart and remove temporary text
        console.warn('TODO : Load chart and remove temporary text');
        console.warn(e);
        console.warn("json file : "+e.target.dataset.chartJson);
        console.warn("target div (jquery selector) : "+e.target.hash);
    });
}

function initializeNetwork() {

    initializeChartsTimesliceForm();

    var testTabs=["Global", "Networkworkworkworkworkworkworkworkworkworkworkworkworkworkwork1", "Networkworkworkworkworkworkworkworkworkworkworkworkworkworkwork2",
        "Networkworkworkworkworkworkworkworkworkworkworkworkworkworkwork3", "Networkworkworkworkworkworkworkworkworkworkworkworkworkworkwork4"];


    addNetworksTabs(testTabs);

    initNetworksChartsNavTabs();

}









/*********************************************************************************************************
 Try to connect on page loading (connection made if a valid session still exist. Example: on page refresh)
 ********************************************************************************************************/
$( document ).ready(function() {

    getHtmlTemplate("#home", "NEW/templates/home.html", setHomePage);

    activateTabOfClass("home");

    getHtmlTemplate("#rawdata", "NEW/templates/rawData.html", initializeRawDataForm);

    // TODO START : embed this
    getHtmlTemplate("#network", "NEW/templates/networkContent.html", initializeNetwork);
    //getHtmlTemplate("#network", "NEW/templates/networksTabsContent.html", initializeNetwork);

    // TODO END

    tryRestaureConnectSession();

})



