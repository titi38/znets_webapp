/**
 * Created by smile on 18/05/16.
 */

//Real Width of Element even if element/parents are hidden
$.fn.elementRealWidth = function () {
    $clone = this.clone()
        .css("visibility","hidden")
        .appendTo($('body'));
    var $width = $clone.outerWidth();
    $clone.remove();
    return $width;
};


//Real Width of Element even if element/parents are hidden
$.fn.elementRealHeight = function () {
    $clone = this.clone()
        .css("visibility","hidden")
        .appendTo($('body'));
    var $height = $clone.outerHeight();
    $clone.remove();
    return $height;
};