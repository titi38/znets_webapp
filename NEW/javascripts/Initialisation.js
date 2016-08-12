/**
 * Created by smile on 11/03/16.
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
     New Localhosts Object
     Will used on localhost Tab initialisation. Check further
     ********************************************************************************************************/
    var myLocalhosts = new Localhosts(myWSEventNotifier);

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
    initializeLocalhosts(myLocalhosts);



    /*********************************************************************************************************
     Initialize Scroll interaction for horizontal tabs
     ********************************************************************************************************/
    initializeHorizontalTabsScroll();





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


function getHtmlTemplate( elementJQuery, url, callBack, callBackParams)
{
    $(elementJQuery).html(getTemplate(url)).promise().done(function(){
        if(callBack)
            if(callBackParams)
                callBack(callBackParams);
            else
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

        loadChartJsonToDiv(e.target, true);

    });



    initChartsTabsNavAnimation("#network");


    /*********************************************************************************************************
     Initialize Chart Formular
     ********************************************************************************************************/
    applyChartsForm();

}



function initChartsTabsNavAnimation(tabIDQuery){

    $( document ).ready(function() {


        // This initialization could used several times when opening localhosts (only once for networks, when all networks tabs are opened)
        // First, drop all animation if they exist
        $(document).off('click', tabIDQuery+' a.navtab');
        $(document).off('click', tabIDQuery+' a.subnavtab[data-toggle="tab"]');
        $(document).off('mouseenter', tabIDQuery+' button.chartNavDropdownButton');
        $(document).off('mouseleave', tabIDQuery+' button.chartNavDropdownButton');

        // (Re)Write animations
        // ===================>

        // Block default behavior : avoid click event propagation on chart navigation nodes which are not leaves
        $(document).on('click', tabIDQuery+' a.navtab', function (e) {
            e.stopPropagation();
        });

        // Set selected chart title next to "+" dropdown of chart selection
        $(document).on('click', tabIDQuery+' a.subnavtab[data-toggle="tab"]', function (e) {
            $(this).parents(".chartNavDropdownContainer").find("p.chartTitle").html($(this).data("chartTitle"));
        });

        // Set animation : show selected chart title on mouse enter "+" dropdown
        $(document).on('mouseenter', tabIDQuery+' button.chartNavDropdownButton', function (e) {
            $(this).find("p").removeClass("hidden");
        });

        // Set animation : hide selected chart title on mouse leave "+" dropdown
        $(document).on('mouseleave', tabIDQuery+' button.chartNavDropdownButton', function (e) {
            $(this).find("p").addClass("hidden");
        });



    });

}



function loadChartJsonToDiv(selectedNavChart, forNetworks) {

    var jsonData = selectedNavChart.dataset.chartJson;
    var ajaxParams = selectedNavChart.dataset.ajaxParams;
    var jqueryTarget = selectedNavChart.hash;

    emptyChartContainer(jqueryTarget);

    var subNet_or_lhIp = (forNetworks) ? ( (selectedNavChart.dataset.network === "Global") ? "" : selectedNavChart.dataset.network ) : ( selectedNavChart.dataset.localhostIp );
    drawChartFromInterface(setChartJsonFUllURL(jsonData, ajaxParams, subNet_or_lhIp, forNetworks), jqueryTarget);

}

function initializeNetworkCallback() {

    callAJAX("getNetworkList.json", "", "json", addNetworksTabs, null);

}


function initializeNetwork() {

// TODO START : embed this
    //getHtmlTemplate("#network", "NEW/templates/networkContent.html", initializeNetworkCallback, null);
    initializeNetworkCallback();

// TODO END

}

function initializeLocalhostCallback(myLocalhosts) {

    myLocalhosts.init();


    //$( "#charts_form" ).clone(true, true).appendTo( "#charts_form_container" );

    // Initialize localhosts "Inventory" tab
    $('.localhost-tab-list').find("a[href='#localhostsInventory']").click(function (e) {
        $(this).tab('show');

        // Hide formular on localhost machine tab click
        $(this).parents(".wrapper.localhosts").siblings("#charts_form_container").hide();
    });


    /*********************************************************************************************************
     Activate localhosts tab
     ********************************************************************************************************/
    activateTabOfClass("localhosts");

}


function initializeLocalhosts(myLocalhosts) {

// TODO START : embed this
    //getHtmlTemplate("#localhosts", "NEW/templates/localhostContent.html", initializeLocalhostCallback, myLocalhosts);
    initializeLocalhostCallback(myLocalhosts);

// TODO END

}






/*********************************************************************************************************
 Try to connect on page loading (connection made if a valid session still exist. Example: on page refresh)
 ********************************************************************************************************/
$( document ).ready(function() {


    $("ul.navbar-nav > li > a").click(function (e) {
        e.preventDefault();
    });

    getHtmlTemplate("#home", "NEW/templates/home.html", null, null);

    activateTabOfClass("home");

    getHtmlTemplate("#charts_form_container", "NEW/templates/chartsFormular.html", null, null);

    getHtmlTemplate("#rawdata", "NEW/templates/rawData.html", null, null);

    tryRestaureConnectSession();

})



