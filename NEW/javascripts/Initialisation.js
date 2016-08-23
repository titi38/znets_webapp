/**
 * Created by smile on 11/03/16.
 */





/*********************************************************************************************************
 Try to connect on page loading (connection made if a valid session still exist. Example: on page refresh)
 ********************************************************************************************************/
/**
 * First templates loading and first attempt of connexion (in case there is already a valid session)
 * Executed on page load/refresh
 */
$( document ).ready(function() {


    $("ul.navbar-nav > li > a").click(function (e) {
        e.preventDefault();
    });

    getHtmlTemplate("#home", "NEW/templates/home.html", null, null);

    activateTabOfClass("home");

    getHtmlTemplate("#charts_form_container", "NEW/templates/chartsFormular.html", null, null);

    getHtmlTemplate("#rawdata", "NEW/templates/rawData.html", null, null);

    tryRestaureConnectSession();

});




/**
 * Interface initialisation function. Launched once user is successful logged in.
 *  - Retrieve useful templates (network and localhost views)
 *  - Creating and initializing interface objects
 *  - Initialize and activates interaction items (tabs)
 */
function initialisation(){

    /*********************************************************************************************************
     Load all templates inside the JST global variable
     ********************************************************************************************************/
    JST["networksTabsContent"] = doT.template(getTemplate("NEW/templates/networksTabsContent.html"));
    JST["localhostsTabsContent"] = doT.template(getTemplate("NEW/templates/localhostsTabsContent.html"));
    //JST["rawDataDropdownMenu"] = doT.template(getTemplate("NEW/templates/rawDataDropdownMenu.html"));
    /*JST["planView"] = doT.template(getTemplate("Templates/Views/planView.html"));
     JST["configPopup"] = doT.template(getTemplate("Templates/config_sensor-popup_content.html"));
     JST["debugPopup"] = doT.template(getTemplate("Templates/debug_sensor-popup_content.html"));
     JST["nrjSpectrumPopup"] = doT.template(getTemplate("Templates/nrjSpectrum_sensor-popup_content.html"));*/


    /*********************************************************************************************************
     New WSEventNotifier Object
     ********************************************************************************************************/
    var myWSEventNotifier = new WSEventNotifier('EventNotifier');

    /*********************************************************************************************************
     New ServerDate Object
     ********************************************************************************************************/
    var myServerDate = new ServerDate(myWSEventNotifier);
    myServerDate.init();

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
     New Localhosts Object - without websocket
     ********************************************************************************************************/
    var myLocalhosts = new Localhosts(myWSEventNotifier);
    //var myLocalhosts = new Localhosts();
    myLocalhosts.init();



    /*********************************************************************************************************
     New LastHourHistory Object
     ********************************************************************************************************/
    myLastHourHistory = new LastHourHistory(myWSEventNotifier);
    myLastHourHistory.init();

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


    /**
     * Adjust alert's dataTable column's widths
     */
    $('a.localhostTab, a.localhostsInventory').on('shown.bs.tab', function (e) {
        $('#tableLocalhosts').DataTable().columns.adjust();
    });







    /*********************************************************************************************************
     Activate network tab
     ********************************************************************************************************/
    activateTabOfClass("network");


    $('a.networkTab').on('shown.bs.tab', function (e) {
        reAdjustAll();
    });




    /*********************************************************************************************************
     Activate rawdata tab
     ********************************************************************************************************/
    activateTabOfClass("rawdata");


    /********************************************************************************************************
     Initialize RawData Form (selects and others)
     ********************************************************************************************************/
    initializeRawDataForm_OtherFields();


    /*********************************************************************************************************
     Initialize NetworkTab
     ********************************************************************************************************/
    initializeNetwork();


    /*********************************************************************************************************
     Initialize LocalhostsTab
     ********************************************************************************************************/
    initializeLocalhosts();



    /*********************************************************************************************************
     Initialize Scroll interaction for horizontal tabs
     ********************************************************************************************************/
    initializeHorizontalTabsScroll();





}



function loadChartJsonToDiv(selectedNavChart, forNetworks) {

    var jsonData = selectedNavChart.dataset.chartJson;
    var ajaxParams = selectedNavChart.dataset.ajaxParams;
    var jqueryTarget = selectedNavChart.hash;

    emptyChartContainer(jqueryTarget);

    var subNet_or_lhIp = (forNetworks) ? ( (selectedNavChart.dataset.network === "Global") ? "" : selectedNavChart.dataset.network ) : ( selectedNavChart.dataset.localhostIp );
    drawChartFromInterface(setChartJsonFUllURL(jsonData, ajaxParams, subNet_or_lhIp, forNetworks), jqueryTarget);

}





