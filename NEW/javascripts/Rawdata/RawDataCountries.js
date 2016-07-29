/**
 * Created by smile on 29/07/16.
 */



function initializeCountriesId(){

    callAJAX("getCountryList.json", '', "json", setCountriesId, null);

}

function setCountriesId(jsonResponse) {

    var countryIdIndex = jsonResponse.content.indexOf("c");
    var countryNameIndex = jsonResponse.content.indexOf("n");

    for (var i = 0; i < jsonResponse.data.length; i++) {
        $("#countryId").append('<option value="' + jsonResponse.data[i][countryIdIndex] + '">' + jsonResponse.data[i][countryNameIndex] + '</option>')
    }

    // Process JQuery-UI combobox drawing
    $( "#countryId" ).combobox();

}

