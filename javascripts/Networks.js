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

    addNewTabsContainer();

    if( !networksNamesArray.includes("Global") )
        networksNamesArray.unshift("Global");

    for(var i=0 ; i<networksNamesArray.length; i++){
        if(networksNamesArray[i] !== null && typeof networksNamesArray[i] === 'object')
        {
          addNewTabsContainer(networksNamesArray[i].n);
          for(var j=0 ; j<networksNamesArray[i].o.length; j++){
              addNetworkTab(networksNamesArray[i].o[j], getIdTabsContainer(networksNamesArray[i].n));
          }
          addNetworkGroupTab(networksNamesArray[i].n)
        }
        else
          addNetworkTab(networksNamesArray[i]);
    }


    initNetworksChartsNavTabs();

    myLocalhosts.updateNetworkList(networksNamesArray);
}


function getIdTabsContainer(groupNetworksName) {

    if (groupNetworksName == "")
        return "networkTabsContainer";
    else
        return "groupTabs" + groupNetworksName.replace(/\s+/g, '');

}

function addNewTabsContainer(groupNetworksName){

    var classProp='';
    if (groupNetworksName == null) {
        groupNetworksName = "";
        classProp = " active";
    }

    var tabContainer_div =  $('<div  class="tab-content">' +
        '<div id="div'+getIdTabsContainer(groupNetworksName)+'" class="tab-pane'+classProp+'" >' +
        '<button class="btn scroller scroller-left"><i class="glyphicon glyphicon-chevron-left"></i></button>' +
        '<button class="btn scroller scroller-right"><i class="glyphicon glyphicon-chevron-right"></i></button>' +
        '<div class="wrapper" style="height: 45px;">' +
        '<ul class="nav nav-tabs list network-tab-list" id="'+getIdTabsContainer(groupNetworksName)+'">' +
        '</ul>' +
        '</div>' +
        '</div></div>');

    $("#MultiNetworksTabs").append (tabContainer_div);
}

/**
 * Specific Network (sub)Tab Creation Function.
 * Triggers the creation of one network tab defined in the software configuration (server side)
 * @param networkName
 */
function addNetworkTab(networkName, idContainer){

    if (idContainer == null)
        idContainer=getIdTabsContainer("");

    var networkNameWoSpace = networkName.replace(/\s+/g, '');
    var element_tab = $('<li class="tab'+networkNameWoSpace+' tab"><a data-toggle="tab" href="#divNetwork'+networkNameWoSpace+'">'+networkName+'</a></li>');
    var element_div = $('<div class="tab-pane fade network" data-network="'+networkNameWoSpace+'" id="divNetwork'+networkNameWoSpace+'">'+networkName+'  Network Content</div>');

    element_tab.click(adjustOnTabClick);

    element_div.html(JST["networksTabsContent"]);

    $("#"+idContainer+".list.network-tab-list").append(element_tab);
    $(".tab-content.network-tab-content").append(element_div);

    $( document ).ready(function() {
        rivets.bind(
            $(element_div),
            {network: networkNameWoSpace}
        );
    });

    element_tab.find("a").click(function (e) {
        e.preventDefault();
        // remove subgroup tabs if they exist
        if (idContainer == getIdTabsContainer(""))
          $("#MultiNetworksTabs").find(".active").slice(1).removeClass("active");
        $(this).tab('show');
    });


    element_tab.find("a").on('shown.bs.tab', function (e) {
        if($(element_div).find(".graph.tab-pane.fade.active").length === 0)
        {
            $(element_div).find("a[href*='#trafficByProtocols']").click();
        }
    });


    element_div.find(".chartNavDropdownButton").on("click", function() {
        if($(this).hasClass("fa-plus-square"))
            $(this).switchClass('fa-plus-square', 'fa-minus-square');
        else
            $(this).switchClass('fa-minus-square', 'fa-plus-square');
    });



    element_div.find(".chartNavDropdownContainer").on('hide.bs.dropdown', function (e) {

        $(this).find(".chartNavDropdownButton").each( function() { $(this).switchClass('fa-minus-square', 'fa-plus-square'); } );

    });

    element_div.find(".chartNavContainer").find("li a.navtab").on("click", function() {
        if($(this).find("i").hasClass("fa-plus-square"))
            $(this).find("i").switchClass('fa-plus-square', 'fa-minus-square');
        else
            $(this).find("i").switchClass('fa-minus-square', 'fa-plus-square');
    });

}


function addNetworkGroupTab(networkName) {

    var networkNameWoSpace = networkName.replace(/\s+/g, '');
    var element_tab = $('<li class="tab' + networkNameWoSpace + ' tab"><a data-toggle="tab" href="#div' + getIdTabsContainer(networkName) + '"><i class="fa fa-users" aria-hidden="true"></i> ' + networkName + '</a></li>');

    element_tab.click(adjustOnTabClick);
    $("#"+ getIdTabsContainer("") +".list.network-tab-list").append(element_tab);


    element_tab.find("a").click(function (e) {
        e.preventDefault();
        // remove subgroup tabs
        $("#MultiNetworksTabs").find(".active").slice(1).removeClass("active");

        // active the first tab of the container
        if ($('#'+ getIdTabsContainer(networkName) + ' Li.tab.active').length == 0)
          $('#'+ getIdTabsContainer(networkName) + ' Li.tab a')[0].click();
    });

}


    /**
 * Network's Charts Navigation Interactions Function.
 * Initialize all Network's Charts Interactions and Selection Formular
 */

// Patch pourri pour éviter génération de 2 graph au 1er clic sur Network
var firstClickTab = true;

function initNetworksChartsNavTabs() {

    $('ul.nav-nest a[data-toggle="tab"]').on('click', function (e) {
        $($(e.target).parents("ul")[$(e.target).parents("ul").length-1]).find("li").removeClass("active");
    }).on('shown.bs.tab', function (e) {
        if (!firstClickTab)
            loadChartJsonToDiv(e.target, true);
        else
            firstClickTab=false;
    });

    initChartsTabsNavAnimation("#network");

    /*********************************************************************************************************
     Initialize Charts Formular
     ********************************************************************************************************/
    applyChartsForm();

}





