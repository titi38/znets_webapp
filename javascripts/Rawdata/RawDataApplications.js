/**
 * Created by smile on 17/06/16.
 */




/**
 * RawData Formular - Application Field Initialization Function
 * Call Ajax to retrieve known applications list
 * Triggers Applications Setting Function "setApplicationsId"
 */
function initializeApplicationsId(){

    callAJAX("getAppList.json", '', "json", setApplicationsId, null);

}





/**
 * Applications Setting Function
 * Initialize RawData Formular - Applications ComboBox (special select field)
 * @param jsonResponse
 */
function setApplicationsId(jsonResponse) {

    var appIdIndex = jsonResponse.content.indexOf("id");
    var appNameIndex = jsonResponse.content.indexOf("n");

    var data = jsonResponse.data.sort(function(a, b){
        if(a[appNameIndex] < b[appNameIndex]) return -1;
        if(a[appNameIndex] > b[appNameIndex]) return 1;
        return 0;
    });

    for (var i = 0; i < data.length; i++) {
        $("#appId").append('<option value="' + data[i][appIdIndex] + '">' + ( (data[i][appNameIndex].indexOf('z') == 0) ? data[i][appNameIndex].substr(1) : data[i][appNameIndex] ) + '</option>')
    }

    // Process JQuery-UI combobox drawing
    $( "#appId" ).combobox();

}

