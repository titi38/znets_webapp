/**
 * Created by smile on 23/08/16.
 */



/*********************************************************************************************************
 Logs dataTable "Size Adjustement" functions
 ********************************************************************************************************/


$( document ).on("dataTable_Loaded", function() {
    var classe = "dataTables_scrollBody";
    var adjustment = -55;
    refreshElementDimensions(classe, adjustment);
});





$(window).bind('resize', function() {
    var classe = "dataTables_scrollBody";
    var adjustment = -55;
    refreshElementDimensions(classe, adjustment);
});





function refreshElementDimensions(classe, adjustment) {
    $('.'+classe).css("maxHeight", function() {
        return window.innerHeight - $(this).offset().top + adjustment;
    });
}

