/**
 * Created by smile on 01/07/16.
 */


function updateChartsTimeslice(element ){

    console.warn(element);

    var timesliceValue = $(element).val();

    console.log(timesliceValue);

    switch (timesliceValue) {
        case "lastHour" :
        case "lastDay" :
        case "lastWeek" :
        case "lastMonth" :
            $("#toDate_ChartsForm").data("DateTimePicker").date(moment('1900-01-01 00:01'));
            $("#toDate_ChartsForm").data("DateTimePicker").date(moment().format('YYYY-MM-DD HH:mm'));
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



function onChangeChartsForm() {

    $("#applyBtn_charts_form").prop("disabled", false);
    $("#resetBtn_charts_form").prop("disabled", false);

}



function applyChartsForm(){

    $("#preset_ChartsForm").val($("#timestepCharts").val());

    $("#dateDebCharts").val($("#fromDate_ChartsForm").data("DateTimePicker").date().format('YYYY-MM-DD HH:mm'));
    $("#dateFinCharts").val($("#toDate_ChartsForm").data("DateTimePicker").date().format('YYYY-MM-DD HH:mm'));

    $("#applyBtn_charts_form").prop("disabled", true);
    $("#resetBtn_charts_form").prop("disabled", true);

}


function resetChartsForm(){

    $("#timestepCharts").val($("#preset_ChartsForm").val());

    $("#fromDate_ChartsForm").data("DateTimePicker").date($("#dateDebCharts").val());
    $("#toDate_ChartsForm").data("DateTimePicker").date($("#dateFinCharts").val());

    $("#applyBtn_charts_form").prop("disabled", true);
    $("#resetBtn_charts_form").prop("disabled", true);

}







function initializeChartsTimestepForm() {

    $('#fromDate_ChartsForm').datetimepicker({
        format: 'YYYY-MM-DD HH:mm',
        defaultDate: moment().subtract(1, 'days').format('YYYY-MM-DD HH:mm'),


    });
    $('#toDate_ChartsForm').datetimepicker({
        format: 'YYYY-MM-DD HH:mm',
        defaultDate: moment(),


    });


    $("#fromDate_ChartsForm").on("dp.show", function (e) {
        if($('#toDate_ChartsForm').data("DateTimePicker").maxDate())
            $('#fromDate_ChartsForm').data("DateTimePicker").maxDate($('#toDate_ChartsForm').data("DateTimePicker").maxDate());
        else
            $('#fromDate_ChartsForm').data("DateTimePicker").maxDate(moment());

    });

    $("#fromDate_ChartsForm").on("dp.change", function (e) {
        if(!e.date)
            $(this).data("DateTimePicker").date(moment().format('YYYY-MM-DD HH:mm'));

    });

    $("#toDate_ChartsForm").on("dp.change", function (e) {
        $(this).data("DateTimePicker").maxDate(moment());

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
            $('#fromDate_ChartsForm').data("DateTimePicker").maxDate(moment());
            $(this).data("DateTimePicker").date(moment().format('YYYY-MM-DD HH:mm'));
        }
    });

    $("#toDate_ChartsForm").on("dp.show", function (e) {
        $(this).data("DateTimePicker").maxDate(moment());
    });

}

