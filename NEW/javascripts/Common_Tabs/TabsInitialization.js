/**
 * Created by smile on 23/08/16.
 */





/*********************************************************************************************************
 Activate a specified navigation tab
 ********************************************************************************************************/
/**
 *  Specific navigation tab Activation Function
 * @param tabClass
 */
function activateTabOfClass(tabClass)
{
    $('#tabs').find("li."+tabClass).removeClass("disabled");

    $("ul.navbar-nav li."+tabClass+" a").click(function (e) {
        e.preventDefault();
        $(this).tab('show');
    });
}






/**
 * Charts Navigation (sidebar) Tabs - Interactions Initialization
 * @param tabIDQuery : jQuery Selector of the parent element, containing Charts Navigation (sidebar) Tabs
 */
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