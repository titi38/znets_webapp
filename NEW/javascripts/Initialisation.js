/**
 * Created by smile on 11/03/16.
 */

function initialisation(){

    /*********************************************************************************************************
     Load all templates inside the JST global variable
     ********************************************************************************************************/
    JST["networksTabsContent"] = doT.template(getTemplate("NEW/templates/networksTabsContent.html"));
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
     New Localhosts Object
     ********************************************************************************************************/
    var myLocalhosts = new Localhosts(myWSEventNotifier);
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


    /*********************************************************************************************************
     Activate localhosts tab
     ********************************************************************************************************/
    activateTabOfClass("localhosts");


    /**
     * Adjust alert's dataTable column's widths
     */
    $('a.localhostTab').on('shown.bs.tab', function (e) {
        $('#tableLocalhosts').DataTable().columns.adjust();
    });







    /*********************************************************************************************************
     Activate network tab
     ********************************************************************************************************/
    activateTabOfClass("network");




    /*********************************************************************************************************
     Activate rawdata tab
     ********************************************************************************************************/
    activateTabOfClass("rawdata");


    /********************************************************************************************************
     Initialize RawData Form (selects and others)
     ********************************************************************************************************/
    initializeRawDataForm();


    $( document ).ready(function() {

        /*********************************************************************************************************
         Initialize NetworkTab
         ********************************************************************************************************/
        initializeNetwork();

    });


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






function addNetworksTabs(networksNamesArrayObject) {

    var networksNamesArray = networksNamesArrayObject.data;

     if( !networksNamesArray.includes("Global") )
     networksNamesArray.unshift("Global");

    for(var i=0 ; i<networksNamesArray.length; i++){
        addNetworkTab(networksNamesArray[i]);
    }


    initNetworksChartsNavTabs();

}

function initNetworksChartsNavTabs() {

    $('ul.nav-nest a[data-toggle="tab"]').on('click', function (e) {
        $($(e.target).parents("ul")[$(e.target).parents("ul").length-1]).find("li").removeClass("active");
    });

    $('ul.nav-nest a[data-toggle="tab"]').on('shown.bs.tab', function (e) {

        loadChartJsonToDiv(e.target);

    });


    /*********************************************************************************************************
     Initialize Chart Formular
     ********************************************************************************************************/
    applyChartsForm();

}

function loadChartJsonToDiv(selectedNavChart) {

    var jsonData = selectedNavChart.dataset.chartJson;
    var ajaxParams = selectedNavChart.dataset.ajaxParams;
    var subNetwork = (selectedNavChart.dataset.network === "Global") ? "" : selectedNavChart.dataset.network;
    var jqueryTarget = selectedNavChart.hash;

    emptyChartContainer(jqueryTarget);

    drawChartFromInterface(setChartJsonFUllURL(jsonData, ajaxParams, subNetwork), jqueryTarget);

}

function initializeNetworkCallback() {

    initializeChartsTimestepForm();

    callAJAX("getNetworkList.json", "", "json", addNetworksTabs, null);

}


function initializeNetwork() {

// TODO START : embed this
    getHtmlTemplate("#network", "NEW/templates/networkContent.html", initializeNetworkCallback);
//getHtmlTemplate("#network", "NEW/templates/networksTabsContent.html", initializeNetwork);

// TODO END

}






/*********************************************************************************************************
 Try to connect on page loading (connection made if a valid session still exist. Example: on page refresh)
 ********************************************************************************************************/
$( document ).ready(function() {

    getHtmlTemplate("#home", "NEW/templates/home.html", setHomePage);

    activateTabOfClass("home");

    getHtmlTemplate("#rawdata", "NEW/templates/rawData.html", null);

    tryRestaureConnectSession();

})



