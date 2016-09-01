/**
 * Created by smile on 01/07/16.
 */


/**
 * Updates Charts Formular/Bar Visible Values on Timeslice value change
 * @param element : Visible Timeslice Value
 */
function updateChartsTimeslice( element ){

    var timesliceValue = $(element).val();

    switch (timesliceValue) {
        case "lastHour" :
        case "lastDay" :
        case "lastWeek" :
        case "lastMonth" :
            $("#toDate_ChartsForm").data("DateTimePicker").date(moment('1900-01-01 00:01'));
            $("#toDate_ChartsForm").data("DateTimePicker").date(moment(serverDate).add(parseInt(moment().format("Z")), "hours").format('YYYY-MM-DD HH:mm'));
            $("#fromDate_ChartsForm").data("DateTimePicker").disable();
            $("#toDate_ChartsForm").data("DateTimePicker").disable();
            break;
        case "custom" :
            $("#fromDate_ChartsForm").data("DateTimePicker").enable();
            $("#toDate_ChartsForm").data("DateTimePicker").enable();
            break;
        default :
            console.error("UNEXPECTED ChartsTimeslice select value (ChartsFormular.js), %i ", 101);
            console.error(timesliceValue);
            break;
    }

}





/**
 * Enable Charts Formular/Bar Buttons
 * Triggered once a Formular/Bar Visible Value is changed/set
 */
function onChangeChartsForm() {

    $("#applyBtn_charts_form").prop("disabled", false);
    $("#resetBtn_charts_form").prop("disabled", false);

}





/**
 * Applies Formular/Bar Visible Fields Values to Hidden Fields Values (these ones are those actually used as "presets" for charts server's requests)
 * Copies Visible Fields Values to each equivalent Hidden Fields Values
 */
function applyChartsForm(){

    $("#timeslice_ChartsForm").val($("#timesliceCharts").val());

    $("#preset_ChartsForm").val($("#timestepCharts").val());

    $("#timestepCharts").val() === "MINUTE" ? $(".exceptFor_minute").addClass("hidden") : $(".minute_only").removeClass("hidden") ;
    $("#timestepCharts").val() === "MINUTE" ? $(".minute_only").removeClass("hidden") : $(".minute_only").addClass("hidden") ;
    $("#timestepCharts").val() === "HOURLY" ? $(".hourly_only").removeClass("hidden") : $(".hourly_only").addClass("hidden") ;


    $("#dateDebCharts").val($("#fromDate_ChartsForm").data("DateTimePicker").date().format('YYYY-MM-DD HH:mm'));
    $("#dateFinCharts").val($("#toDate_ChartsForm").data("DateTimePicker").date().format('YYYY-MM-DD HH:mm'));

    $("#applyBtn_charts_form").prop("disabled", true);
    $("#resetBtn_charts_form").prop("disabled", true);

    // Redraw all active charts
    $("li.active > a.subnavtab").click();

    // Set charts preset view
    $(".chartTimePreset").each(function() {
        $(this).html("Timeslice: "+$("#timeslice_ChartsForm").val().replace(/last/g, 'Last ').replace(/custom/g, 'Custom') + " | Timestep: " + $("#preset_ChartsForm").val().replace(/HOURLY/g, 'Hourly ').replace(/MINUTE/g, 'Minute').replace(/DAILY/g, 'Daily') + ( ($("#timeslice_ChartsForm").val().indexOf("last") > -1) ? ("") : (" | From: " + $("#dateDebCharts").val() + " | To: " + $("#dateFinCharts").val()) ) );
    });

}





/**
 * Resets Formular/Bar Visible Fields Values to Hidden Fields Values
 * Copies Hidden Fields Values to each equivalent Visible Fields Values
 */
function resetChartsForm(){

    $("#timestepCharts").val($("#preset_ChartsForm").val());

    $("#timesliceCharts").val($("#timeslice_ChartsForm").val());

    $("#fromDate_ChartsForm").data("DateTimePicker").date($("#dateDebCharts").val());
    $("#toDate_ChartsForm").data("DateTimePicker").date($("#dateFinCharts").val());

    $("#applyBtn_charts_form").prop("disabled", true);
    $("#resetBtn_charts_form").prop("disabled", true);

}







/**
 * Formular/Bar Visible and Hidden Fields initialization
 * Initialize visible fields using DateTimePicker library
 * Initialize fields interactions
 */
function initializeChartsTimestepForm() {

    $('#fromDate_ChartsForm').datetimepicker({
        format: 'YYYY-MM-DD HH:mm',
        useCurrent: false,


    });
    $('#toDate_ChartsForm').datetimepicker({
        format: 'YYYY-MM-DD HH:mm',
        useCurrent: false,


    });


    /*$("#fromDate_ChartsForm").on("dp.show", function (e) {
        if($('#toDate_ChartsForm').data("DateTimePicker").maxDate())
            $('#fromDate_ChartsForm').data("DateTimePicker").maxDate($('#toDate_ChartsForm').data("DateTimePicker").maxDate());
        else
            $('#fromDate_ChartsForm').data("DateTimePicker").maxDate(moment());

    });*/

    $("#fromDate_ChartsForm").on("dp.change", function (e) {
        $(this).find("input").trigger("change");
    });

    $("#toDate_ChartsForm").on("dp.change", function (e) {

        $(this).find("input").trigger("change");

        if(e.date)
        {

            $('#fromDate_ChartsForm').data("DateTimePicker").maxDate(e.date);

            switch ($("#timesliceCharts").val()) {
                case "lastHour" :
                    $('#fromDate_ChartsForm').data("DateTimePicker").date(moment(e.date).subtract(1, 'hours').format('YYYY-MM-DD HH:mm'));
                    break;
                case "lastDay" :
                    $('#fromDate_ChartsForm').data("DateTimePicker").date(moment(e.date).subtract(1, 'days').format('YYYY-MM-DD HH:mm'));
                    break;
                case "lastWeek" :
                    $('#fromDate_ChartsForm').data("DateTimePicker").date(moment(e.date).subtract(1, 'weeks').format('YYYY-MM-DD HH:mm'));
                    break;
                case "lastMonth" :
                    $('#fromDate_ChartsForm').data("DateTimePicker").date(moment(e.date).subtract(1, 'months').format('YYYY-MM-DD HH:mm'));
                    break;
                case "custom" :
                    // DO NOTHING
                    break;
                default :
                    console.error("UNEXPECTED ChartsTimestep select value in Initialisation.js : "+$("#timestepCharts").val()+" (103) ");
                    break;
            }

        }
        else
        {
            $('#fromDate_ChartsForm').data("DateTimePicker").maxDate(moment(serverDate).add(parseInt(moment().format("Z")), "hours"));
            $(this).data("DateTimePicker").date(moment(serverDate).add(parseInt(moment().format("Z")), "hours").format('YYYY-MM-DD HH:mm'));
        }
    });

}
