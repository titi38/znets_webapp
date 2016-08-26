/**
 * Created by smile on 30/06/16.
 */


/**
 * Networks Tab Initialisation Function
 */
function initializeNetwork() {

    callAJAX("getNetworkList.json", "", "json", addNetworksTabs, null);

}


/**
 * All Networks (sub)Tabs Creation Function.
 * Triggers the creation of all available networks defined in the software configuration (server side)
 * @param networksNamesArrayObject
 */
function addNetworksTabs(networksNamesArrayObject) {

    var networksNamesArray = networksNamesArrayObject.data;

    if( !networksNamesArray.includes("Global") )
        networksNamesArray.unshift("Global");

    for(var i=0 ; i<networksNamesArray.length; i++){
        addNetworkTab(networksNamesArray[i]);
    }


    initNetworksChartsNavTabs();

}




/**
 * Specific Network (sub)Tab Creation Function.
 * Triggers the creation of one network tab defined in the software configuration (server side)
 * @param networkName
 */
function addNetworkTab(networkName){

    var ai = (networkName === 'Global') ? 'active in' : '';
    var a = (networkName === 'Global') ? 'active' : '';

    var element_tab = $('<li class="tab'+networkName+' tab '+a+'"><a data-toggle="tab" href="#divNetwork'+networkName+'">'+networkName+'</a></li>');
    var element_div = $('<div class="tab-pane fade network '+ai+'" data-network="'+networkName+'" id="divNetwork'+networkName+'">'+networkName+'  Network Content</div>');

    element_tab.click(adjustOnTabClick);

    element_div.html(JST["networksTabsContent"]);

    $(".list.network-tab-list").append(element_tab);
    $(".tab-content.network-tab-content").append(element_div);


    $( document ).ready(function() {
        rivets.bind(
            $(element_div),
            {network: networkName}
        );
    });

    element_tab.find("a").click(function (e) {
        e.preventDefault();
        $(this).tab('show');
    });


}



/**
 * Network's Charts Navigation Interactions Function.
 * Initialize all Network's Charts Interactions and Selection Formular
 */
function initNetworksChartsNavTabs() {

    $('ul.nav-nest a[data-toggle="tab"]').on('click', function (e) {
        $($(e.target).parents("ul")[$(e.target).parents("ul").length-1]).find("li").removeClass("active");
    });

    $('ul.nav-nest a[data-toggle="tab"]').on('shown.bs.tab', function (e) {

        loadChartJsonToDiv(e.target, true);

    });



    initChartsTabsNavAnimation("#network");


    /*********************************************************************************************************
     Initialize Charts Formular
     ********************************************************************************************************/
    applyChartsForm();

}





