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

    getHtmlTemplate("#home", "templates/home.html", null, null);

    activateTabOfClass("home");

    getHtmlTemplate("#alerts", "templates/alerts.html", null, null);

    getHtmlTemplate("#charts_form_container", "templates/chartsFormular.html", null, null);

    getHtmlTemplate("#rawdata", "templates/rawData.html", null, null);

    getHtmlTemplate("#ipQueryTools_container", "templates/ipQueryTools.html", null, null);

    getHtmlTemplate("#showConf_container", "templates/showConfiguration.html", null, null);

    getHtmlTemplate("#alertBS_container", "templates/alertBS.html", null, null);

    tryRestoreConnectSession();

});




/**
 * Interface initialisation function. Launched once user is successful logged in.
 *  - Retrieve useful templates (network and localhost views)
 *  - Creating and initializing interface objects
 *  - Initialize and activates interaction items (tabs)
 */
function initialisation(){

    if(! BrowserDetection.match([
            {
                name: "Chrome",
                version: 58
            },{
                name: "Opera",
                version: 47
            },{
                name: "Firefox",
                version: 53
            },{
                name: "Internet Explorer",
                version: 12
            },{
                name: "Safari",
                version: 12
            } ]) )

        alertBS("Unsupported browser", "Your browser is unsupported or out-of-date. ZNETS may not work properly", "Continue anyway", null );


    /*********************************************************************************************************
     Load all templates inside the JST global variable
     ********************************************************************************************************/
    JST["networksTabsContent"] = doT.template(getTemplate("templates/networksTabsContent.html"));
//    JST["groupNetworksTabsContent"] = doT.template(getTemplate("templates/groupNetworksTabsContent.html"));
    JST["localhostsTabsContent"] = doT.template(getTemplate("templates/localhostsTabsContent.html"));
    //JST["rawDataDropdownMenu"] = doT.template(getTemplate("templates/rawDataDropdownMenu.html"));
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
    /*var */myServerDate = new ServerDate(myWSEventNotifier);
    myServerDate.init();

    var myClockWidget = new ClockWidget(myServerDate, $('#clock_container'));


    $("#showConf_button").show();

    /*********************************************************************************************************
     New LastHourHistory Object
     ********************************************************************************************************/
    myLastHourHistory = new LastHourHistory(myServerDate);
//    myLastHourHistory.init();


    /*********************************************************************************************************
     New Logs Object
     ********************************************************************************************************/
    var myLogs = new Logs(myWSEventNotifier);
    myLogs.init();

    /*********************************************************************************************************
     New Alerts Object
     ********************************************************************************************************/
    /*var */myAlerts = new Alerts(myWSEventNotifier);
    myAlerts.init();

    /*********************************************************************************************************
     New Localhosts Object - without websocket
     ********************************************************************************************************/
    /*var */myLocalhosts = new Localhosts(myServerDate);
    //var myLocalhosts = new Localhosts();
    myLocalhosts.init();


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


    $('a.networkTab').on('click', function (e) {

            reAdjustAll();
            if($("#network.tab-pane.fade.tab-network").find("div.tab-pane.network.active").length == 0)
                $("li.tabGlobal.tab").find("a").click();
            else
                $("div.tab-pane.tab-network ul.network-tab-list").find("li.active").click();

    });




    $('a#localhostTab').on('click', function (e) {

            reAdjustAll();
            if ($("#localhosts.tab-pane.fade.tab-localhosts").find("div.tab-pane.localhost.active").length == 0)
                $("li a#localhostsInventory").click();
            else
                $("div.tab-pane.tab-localhosts ul.localhost-tab-list").find("li.active").click();

    });




    /*********************************************************************************************************
     Activate rawdata tab
     ********************************************************************************************************/
    activateTabOfClass("rawdata");


    /********************************************************************************************************
     Initialize RawData Form (selects and data-delay='{ "hide": 5000 }' others)
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



    /*********************************************************************************************************
     Initialize flows pre-fill pop-up
     ********************************************************************************************************/
    $('a#flowstab[data-toggle="tooltip"]').tooltip("hide");


    $('#ipQueryToolsDiv').removeClass('hidden');
}





