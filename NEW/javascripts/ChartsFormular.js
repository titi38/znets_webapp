/**
 * Created by smile on 01/07/16.
 */


function updateChartsTimeslice( element ){

    console.warn(element);

    var timesliceValue = $(element).val();

    console.log(timesliceValue);

    switch (timesliceValue) {
        case "hourly" :
            $("#fromDate_ChartsForm").data("DateTimePicker").enable();
            $("#toDate_ChartsForm").data("DateTimePicker").enable();
            break;
        case "daily" :
            $("#fromDate_ChartsForm").data("DateTimePicker").enable();
            $("#toDate_ChartsForm").data("DateTimePicker").enable();
            break;
        case "lastMonth" :
            $("#toDate_ChartsForm").data("DateTimePicker").date(moment('1900-01-01 00:01'));
            $("#toDate_ChartsForm").data("DateTimePicker").date(moment().format('YYYY-MM-DD HH:mm'));
            $("#fromDate_ChartsForm").data("DateTimePicker").disable();
            $("#toDate_ChartsForm").data("DateTimePicker").disable();
        case "lastDay" :
            $("#toDate_ChartsForm").data("DateTimePicker").date(moment('1900-01-01 00:01'));
            $("#toDate_ChartsForm").data("DateTimePicker").date(moment().format('YYYY-MM-DD HH:mm'));
            $("#fromDate_ChartsForm").data("DateTimePicker").disable();
            $("#toDate_ChartsForm").data("DateTimePicker").disable();
            break;
        default :
            console.error("UNEXPECTED ChartsTimeslice select value (ChartsFormular.js), %i ", 101);
            console.error(timesliceValue);
            break;
    }

}


function onChangeChartsTimeslice() {

    $("#applyBtn_charts_form").prop("disabled", false);
    $("#resetBtn_charts_form").prop("disabled", false);

}



function applyChartsTimeslice(){

    var timesliceValue = $("#timesliceCharts").val();

    console.warn(timesliceValue);

    switch (timesliceValue) {
        case "lastDay" :
        case "hourly" :
            $("#preset_ChartsForm").val("hourly");
            break;
        case "lastMonth" :
        case "daily" :
            $("#preset_ChartsForm").val("daily");
            break;
        default :
            console.error("UNEXPECTED ChartsTimeslice select value (ChartsFormular.js), %i ", 102);
            break;
    }


    $("#dateDebCharts").val($("#fromDate_ChartsForm").data("DateTimePicker").date().format('YYYY-MM-DD HH:mm'));
    $("#dateFinCharts").val($("#toDate_ChartsForm").data("DateTimePicker").date().format('YYYY-MM-DD HH:mm'));

    $("#applyBtn_charts_form").prop("disabled", true);
    $("#resetBtn_charts_form").prop("disabled", true);

}


function resetChartsTimeslice(){

    $("#timesliceCharts").val($("#preset_ChartsForm").val());
    updateChartsTimeslice($("#timesliceCharts"));

    $("#fromDate_ChartsForm").data("DateTimePicker").date($("#dateDebCharts").val());
    $("#toDate_ChartsForm").data("DateTimePicker").date($("#dateFinCharts").val());

    $("#applyBtn_charts_form").prop("disabled", true);
    $("#resetBtn_charts_form").prop("disabled", true);

}
