/**
 * Created by smile on 29/07/16.
 */


/**
 * RawData Formular - Country Field Initialization Function
 * Call Ajax to retrieve known countries list
 * Triggers Country Setting Function "setCountriesId"
 */
function initializeCountriesId(){

    callAJAX("getCountryList.json", '', "json", setCountriesId, null);

}





/**
 * Countries Setting Function
 * Initialize Countries array "countryTable"
 * Initialize RawData Formular - Countries ComboBox (special select field)
 * @param jsonResponse
 */
function setCountriesId(jsonResponse) {

    var countryIdIndex = jsonResponse.content.indexOf("c");
    var countryNameIndex = jsonResponse.content.indexOf("n");

    for (var i = 0; i < jsonResponse.data.length; i++) {
        $("#countryId").append('<option value="' + jsonResponse.data[i][countryIdIndex] + '">' + jsonResponse.data[i][countryNameIndex] + '</option>');
        countryTable[jsonResponse.data[i][countryIdIndex]] = jsonResponse.data[i][countryNameIndex];
    }

    // Process JQuery-UI combobox drawing
    $( "#countryId" ).combobox().data()._renderItem = function( ul, item ) {
        return $( "<li></li>" )
            .data( "item.autocomplete", item )
            .append( "<a>" + item.label + "<br>" + item.desc + "</a>" )
            .appendTo( ul );
    };;

}

