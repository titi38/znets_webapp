/**
 * Created by smile on 14/06/16.
 */

function addRawDataTab(rawdataTabID){

    var element_tab = $('<li class="tab'+rawdataTabID+' tab"><a data-toggle="tab" href="#divRawdata'+rawdataTabID+'">Flow Data <span class="closeTab close-icon" title="Remove this page">&#x2715</span></a></li>');
    var element_div = $('<div class="tab-pane fade" id="divRawdata'+rawdataTabID+'"></div>');

    element_tab.click(adjustOnTabClick);

    $(".list.rawdata-tab-list").append(element_tab);
    $(".tab-content.rawdata-tab-content").append(element_div);

    reAdjust();

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


function adjustOnTabClick(event) {

    var tabElement = $(this);
    var tabList = $(this).parent();
    var tabListWrapper = $(this).parent().parent();

    // if tab element is cut on the right side
    if( ( tabElement.position().left + tabElement.outerWidth() ) > ( Math.abs(tabList.position().left) + tabListWrapper.outerWidth() ) )
    {
        $('.list.rawdata-tab-list').animate({left: "-="+ ( ( tabElement.position().left + tabElement.outerWidth() + parseInt(tabList.css("margin-left")) ) - ( Math.abs(tabList.position().left) + tabListWrapper.outerWidth() ) ) +"px"},'slow', function(){
            reAdjust();
        });
    }

    // if tab element is cut to the right side
    if( tabElement.position().left < Math.abs(tabList.position().left) )
    {
        $('.list.rawdata-tab-list').animate({left: "+="+ ( Math.abs(tabList.position().left)  - tabElement.position().left - parseInt(tabList.css("margin-left")) ) +"px"},'slow', function(){
            reAdjust();
        });
    }
}



var reAdjust = function(){

    if ( Math.abs(widthOfHidden()) > 1 && widthOfList() > $('.wrapper').outerWidth() )  {
        $('.scroller-right').show();
    }
    else {
        $('.scroller-right').hide();
    }

    if ( Math.abs(getLeftPosi()) > 1  && widthOfList() > $('.wrapper').outerWidth() ) {
        $('.scroller-left').show();
    }
    else {
        $('.scroller-left').hide();
    }

    $('.scroller-left').prop("disabled", false);
    $('.scroller-right').prop("disabled", false);

}

var widthOfList = function(){
    var itemsWidth = 0;
    $('.list.rawdata-tab-list li').each(function(){
        var itemWidth = $(this).outerWidth();
        itemsWidth+=itemWidth;
    });
    return itemsWidth;
};

var widthOfHidden = function(){
    return ($('.wrapper').outerWidth()-widthOfList()-getLeftPosi()-scrollBarWidths);
};

var getLeftPosi = function(){
    return $('.list.rawdata-tab-list').position().left;
};



var hidWidth;
var scrollBarWidths = 40;




function initializeRawData() {

    //$("button.addRawDataTab").on("click", addRawDataTab);

    reAdjust();

    $(window).on('resize',function(e){
        reAdjust();
    });

    $('.scroller-right').click(function() {

        $(this).prop("disabled", true);

        if (Math.abs(widthOfHidden()) < $('.wrapper').outerWidth()) {
            $('.list.rawdata-tab-list').animate({left: "+=" + widthOfHidden() + "px"}, 'slow', function () {
                reAdjust();
            });
        }
        else {
            $('.list.rawdata-tab-list').animate({left: "+=" + ($('.wrapper').outerWidth() * -1) + "px"}, 'slow', function () {
                reAdjust();
            });
        }

    });

    $('.scroller-left').click(function() {

        $(this).prop("disabled", true);

        if(Math.abs(getLeftPosi()) < $('.wrapper').outerWidth()){
            $('.list.rawdata-tab-list').animate({left: "-="+getLeftPosi()+"px"}, 'slow', function() {
                reAdjust();
            });
        }
        else
        {
            $('.list.rawdata-tab-list').animate({left: "-="+($('.wrapper').outerWidth() *-1 ) +"px"},'slow', function(){
                reAdjust();
            });
        }

    });



}



$( document ).ready(function() {
    initializeRawData();
})