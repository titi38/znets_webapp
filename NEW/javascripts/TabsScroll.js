/**
 * Created by smile on 08/08/16.
 */




function adjustOnTabClick(event) {

    var tabElement = $(this);
    var tabList = $(this).parent();
    var tabListWrapper = $(this).parent().parent();

    // if tab element is cut on the right side
    if( ( tabElement.position().left + tabElement.outerWidth() ) > ( Math.abs(tabList.position().left) + tabListWrapper.outerWidth() ) )
    {
        tabList.animate({left: "-="+ ( ( tabElement.position().left + scrollBarWidths + tabElement.outerWidth() + parseInt(tabList.css("margin-left")) ) - ( Math.abs(tabList.position().left) + tabListWrapper.outerWidth() ) ) +"px"},'slow', function(){
            reAdjust(tabElement);
        });
    }

    // if tab element is cut to the right side
    if( tabElement.position().left < Math.abs(tabList.position().left) )
    {
        tabList.animate({left: "+="+ ( Math.abs(tabList.position().left) - tabElement.position().left - parseInt(tabList.css("margin-left")) ) +"px"},'slow', function(){
            reAdjust(tabElement);
        });
    }
}



var reAdjust = function(li_clickedElement){

    if(li_clickedElement){

        var wrapper = li_clickedElement.parents('.wrapper');
        var outerWidth = wrapper.outerWidth();


        if ( Math.abs(widthOfHidden(li_clickedElement)) > 1 && widthOfList(li_clickedElement) > outerWidth )  {
            if(wrapper.siblings('.scroller-right').is)
                wrapper.siblings('.scroller-right').show();
        }
        else {
            wrapper.siblings('.scroller-right').hide();
        }

        if ( Math.abs(getLeftPosi(li_clickedElement)) > 1  && widthOfList(li_clickedElement) > outerWidth ) {
            wrapper.siblings('.scroller-left').show();
        }
        else {
            wrapper.siblings('.scroller-left').hide();
        }

        wrapper.siblings('.scroller-left').prop("disabled", false);
        wrapper.siblings('.scroller-right').prop("disabled", false);

    }

};



var reAdjustAll = function(){

    $('.scroller-right').each(function () {

        var wrapper = $('.wrapper');
        var outerWidth = wrapper.outerWidth();

        if ( Math.abs(widthOfHidden($(this))) > 1 && widthOfList($(this)) > outerWidth )  {
            $(this).show();
        }
        else {
            $(this).hide();
        }
    });

    $('.scroller-left').each(function () {

        var wrapper = $('.wrapper');
        var outerWidth = wrapper.outerWidth();

        if ( Math.abs(getLeftPosi($(this))) > 1  && widthOfList($(this)) > outerWidth ) {
            $(this).show();
        }
        else {
            $(this).hide();
        }
    });

     $('.scroller-left').each(function () { $(this).prop("disabled", false); });
     $('.scroller-right').each(function () { $(this).prop("disabled", false); });

};



var widthOfList = function(li_clickedElement){


    if(li_clickedElement && li_clickedElement.is("li")){

        var itemsWidth = 0;
        li_clickedElement.parents('.list').find('li').each(function () {
            var iw = $(this).outerWidth();
            itemsWidth += iw;
        });

    }
    else if(li_clickedElement && li_clickedElement.is("button.scroller")){
        var itemsWidth = 0;
        li_clickedElement.siblings(".wrapper").find('.list li').each(function () {
            var itemWidth = $(this).outerWidth();
            itemsWidth += itemWidth;
        });
    }
    else{
        console.error("TODO !!!!!!!!!!!!!!!!!")
        console.error(li_clickedElement)
    }

    return itemsWidth;
};



var widthOfHidden = function(li_clickedElement){

    if(li_clickedElement && li_clickedElement.is("li")){

        return (li_clickedElement.parents('.wrapper').outerWidth()-widthOfList(li_clickedElement)-getLeftPosi(li_clickedElement)-scrollBarWidths);
    }
    else if(li_clickedElement && li_clickedElement.is("button.scroller")){
        return (li_clickedElement.siblings(".wrapper").outerWidth()-widthOfList(li_clickedElement)-getLeftPosi(li_clickedElement)-scrollBarWidths);
    }
    else{
        console.error("TODO !!!!!!!!!!!!!!!!!")
        console.error(li_clickedElement)
    }
};



var getLeftPosi = function(li_clickedElement){

    if(li_clickedElement && li_clickedElement.is("li")){

        return li_clickedElement.parents('.list').position().left;
    }
    else if(li_clickedElement && li_clickedElement.is("button.scroller")){

        return li_clickedElement.siblings(".wrapper").find('.list').position().left;
    }
    else{
        console.error("TODO !!!!!!!!!!!!!!!!!")
        console.error(li_clickedElement)
    }
};



var scrollBarWidths = 40;



function initializeHorizontalTabsScroll() {

    $(window).on('resize',function(e){
        reAdjustAll();
    });

    $('.scroller-right').each(function(index) {

        $(this).click(function () {

            var activeLi = $(this).siblings(".wrapper").find(".list > li.active");

            $(this).prop("disabled", true);

            if (Math.abs(widthOfHidden($(this).siblings(".wrapper").find(".list > li.active"))) < $(this).siblings(".wrapper").outerWidth()) {
                $(this).siblings(".wrapper").find(".list").animate({left: "+=" + widthOfHidden($(this).siblings(".wrapper").find(".list > li.active")) + "px"}, 'slow', function () {
                    reAdjust(activeLi);
                });
            }
            else {
                $(this).siblings(".wrapper").find(".list").animate({left: "+=" + ($(this).siblings(".wrapper").outerWidth() * -1) + "px"}, 'slow', function () {
                    reAdjust(activeLi);
                });
            }

        });

    });

    $('.scroller-left').each(function(index) {

        $(this).click(function () {

            var activeLi = $(this).siblings(".wrapper").find(".list > li.active");

            $(this).prop("disabled", true);

            if (Math.abs(getLeftPosi($(this).siblings(".wrapper").find(".list > li.active"))) < $(this).siblings(".wrapper").outerWidth()) {
                $(this).siblings(".wrapper").find(".list").animate({left: "-=" + getLeftPosi($(this).siblings(".wrapper").find(".list > li.active")) + "px"}, 'slow', function () {
                    reAdjust(activeLi);
                });
            }
            else {
                $(this).siblings(".wrapper").find(".list").animate({left: "-=" + ($(this).siblings(".wrapper").outerWidth() * -1 ) + "px"}, 'slow', function () {
                    reAdjust(activeLi);
                });
            }

        });

    });



}