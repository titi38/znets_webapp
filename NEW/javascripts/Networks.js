/**
 * Created by smile on 30/06/16.
 */



function addNetworkTab(networkName){

    var ai = (networkName === 'Global') ? 'active in' : '';
    var a = (networkName === 'Global') ? 'active' : '';

    //var element_tab = $('<li class="tab'+networkName+' tab"><a data-toggle="tab" href="#divNetwork'+networkName+'">'+networkName+' <span class="closeTab close-icon" title="Remove this page">&#x2715</span></a></li>');
    var element_tab = $('<li class="tab'+networkName+' tab '+a+'"><a data-toggle="tab" href="#divNetwork'+networkName+'">'+networkName+'</a></li>');
    var element_div = $('<div class="tab-pane fade network '+ai+'" data-network="'+networkName+'" id="divNetwork'+networkName+'">'+networkName+'  Network Content</div>');

    /*var element_tab = $('<li class="tab'+networkName+' tab"><a data-toggle="tab" href="#divNetwork'+networkName+'">'+networkName+'</a></li>');
    var element_div = $('<div class="tab-pane fade network" data-network="'+networkName+'" id="divNetwork'+networkName+'">'+networkName+'  Network Content</div>');
    */


    //element_tab.click(adjustOnTabClick);

    $(".list.network-tab-list").append(element_tab);
    $(".tab-content.network-tab-content").append(element_div);


    $( document ).ready(function() {
        rivets.bind(
            $(element_div),
            {network: networkName}
        )
    });


    //reAdjust();

    element_tab.find("a").click(function (e) {
        e.preventDefault();
        $(this).tab('show');

        //adjustTableColumns(networkName);
    });

    //element_tab.find("a").click();



    /*element_tab.find(".closeTab").on('click', function(event){

        var tab2Switch = null;
        if($(this).parents('li').hasClass("active")) {
            if ($(this).parents('li').prev().length > 0) {
                tab2Switch = $(this).parents('li').prev().find("a");
            }else {
                tab2Switch = $(this).parents('li').next().find("a");
            }
        }

        var tabID = $(this).parents('a').attr('href');

        $(this).parents('li').remove();
        $(tabID).remove();

        if(tab2Switch)
            tab2Switch.click();

        event.stopPropagation();

    });*/

}

rivets.formatters.prepend = function(value, prepend) {
    return prepend + value
}