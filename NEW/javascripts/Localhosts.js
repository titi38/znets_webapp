/**
 * Created by smile on 30/06/16.
 */



function addLocalhostTab(localhostName){

    var ai = (localhostName === 'Global') ? 'active in' : '';
    var a = (localhostName === 'Global') ? 'active' : '';

    //var element_tab = $('<li class="tab'+localhostName+' tab"><a data-toggle="tab" href="#divLocalhost'+localhostName+'">'+localhostName+' <span class="closeTab close-icon" title="Remove this page">&#x2715</span></a></li>');
    var element_tab = $('<li class="tab'+localhostName+' tab '+a+'"><a data-toggle="tab" href="#divLocalhost'+localhostName+'">'+localhostName+'</a></li>');
    var element_div = $('<div class="tab-pane fade localhost '+ai+'" data-localhost="'+localhostName+'" id="divLocalhost'+localhostName+'">'+localhostName+'  Localhost Content</div>');

    /*var element_tab = $('<li class="tab'+localhostName+' tab"><a data-toggle="tab" href="#divLocalhost'+localhostName+'">'+localhostName+'</a></li>');
    var element_div = $('<div class="tab-pane fade localhost" data-localhost="'+localhostName+'" id="divLocalhost'+localhostName+'">'+localhostName+'  Localhost Content</div>');
    */


    //element_tab.click(adjustOnTabClick);


    element_div.html(JST["localhostsTabsContent"]);

    $(".list.localhost-tab-list").append(element_tab);
    $(".tab-content.localhost-tab-content").append(element_div);


    $( document ).ready(function() {
        rivets.bind(
            $(element_div),
            {localhost: localhostName}
        );
    });


    //reAdjust();

    element_tab.find("a").click(function (e) {
        e.preventDefault();
        $(this).tab('show');

        //adjustTableColumns(localhostName);
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


// WARNING : "rivets.formatters.prepend" is already defined in Networks.js
/*
rivets.formatters.prepend = function(value, prepend) {
    return prepend + value
}*/