/**
 * Created by smile on 14/06/16.
 */

function addRawDataTab(rawdataTabID){

    var element_tab = $('<li class="tab'+rawdataTabID+' tab"><a data-toggle="tab" href="#divRawdata'+rawdataTabID+'">Flow Data <span class="closeTab close-icon" title="Remove this page">&#x2715</span></a></li>');
    var element_div = $('<div class="tab-pane fade" id="divRawdata'+rawdataTabID+'"></div>');

    element_tab.click(adjustOnTabClick);

    $(".list.rawdata-tab-list").append(element_tab);
    $(".tab-content.rawdata-tab-content").append(element_div);

    reAdjust(element_tab);

    element_tab.find("a").click(function (e) {
        e.preventDefault();
        $(this).tab('show');

        adjustTableColumns(rawdataTabID);
    });

    element_tab.find("a").click();



    element_tab.find(".closeTab").on('click', function(event){

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

    });

}


function adjustTableColumns(rawdataTabID) {
    // Cheat : trigger draw to call drawCallback function in order to adjust column's width
    $('#tableRawdata' + rawdataTabID).DataTable().draw();
}

