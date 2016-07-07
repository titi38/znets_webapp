/**
 * Created by smile on 01/07/16.
 */


function updateChartsTimeslice( timesliceValue ){

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
            break;
    }

}