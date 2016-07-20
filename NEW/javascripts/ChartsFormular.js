/**
 * Created by smile on 01/07/16.
 */


function updateChartsTimestep(element ){

    console.warn(element);

    var timestepValue = $(element).val();

    console.log(timestepValue);

    switch (timestepValue) {
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
            console.error("UNEXPECTED ChartsTimestep select value (ChartsFormular.js), %i ", 101);
            console.error(timestepValue);
            break;
    }

}


function onChangeChartsTimestep() {

    $("#applyBtn_charts_form").prop("disabled", false);
    $("#resetBtn_charts_form").prop("disabled", false);

}



function applyChartsTimestep(){

    var timestepValue = $("#timestepCharts").val();

    console.warn(timestepValue);

    switch (timestepValue) {
        case "lastDay" :
        case "hourly" :
            $("#preset_ChartsForm").val("HOURLY");
            break;
        case "lastMonth" :
        case "daily" :
            $("#preset_ChartsForm").val("DAILY");
            break;
        default :
            console.error("UNEXPECTED ChartsTimestep select value (ChartsFormular.js), %i ", 102);
            break;
    }


    $("#dateDebCharts").val($("#fromDate_ChartsForm").data("DateTimePicker").date().format('YYYY-MM-DD HH:mm'));
    $("#dateFinCharts").val($("#toDate_ChartsForm").data("DateTimePicker").date().format('YYYY-MM-DD HH:mm'));

    $("#applyBtn_charts_form").prop("disabled", true);
    $("#resetBtn_charts_form").prop("disabled", true);

}


function resetChartsTimestep(){

    $("#timestepCharts").val($("#preset_ChartsForm").val());
    updateChartsTimestep($("#timestepCharts"));

    $("#fromDate_ChartsForm").data("DateTimePicker").date($("#dateDebCharts").val());
    $("#toDate_ChartsForm").data("DateTimePicker").date($("#dateFinCharts").val());

    $("#applyBtn_charts_form").prop("disabled", true);
    $("#resetBtn_charts_form").prop("disabled", true);

}

