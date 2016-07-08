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

function serializeChartsTimesliceForm(){

    var returnParamsJSON = "";

    var returnConfigParamJSON = {};

    console.warn($("form[id='charts_form'] input"));

    var serializedInputs = $("form[id='charts_form'] input").serializeArray();
    console.warn("hey");
    $.each(serializedInputs, function(i, field){
        console.warn(field);
        if(field.value !== "") {
            //if(field.name === "cyclesLength" || field.name === "eventsLength" )
                returnParamsJSON = field.name+"="+parseInt(field.value)+"&";
            /*else if (field.name === "daqThreshold" || field.name === "postMax" || field.name === "electronicsSerial")
                returnConfigParamJSON[field.name] = parseInt(field.value);
            else if (field.name === "selectionMode")
                returnConfigParamJSON[field.name] = (field.value === "on") ? true : false;
            /*else if (field.value !== "on") // WARNING ! Do not serialize un-wanted radio buttons or check boxes ! This line avoid it ;)
             returnConfigParamJSON[field.name] = field.value || '';*/
        }
    });

    console.warn(returnParamsJSON+"config="+JSON.stringify(returnConfigParamJSON));

    return returnParamsJSON+"config="+JSON.stringify(returnConfigParamJSON);

}