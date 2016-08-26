/**
 * Created by smile on 29/07/16.
 */



/**
 * RawData Formular - Localhost's Names Setting Function
 * Initialize RawData Formular - Localhost's Names ComboBox (special select field), using localhosts array "localhosts_Ip_Name_Array"
 */
function initializeRawDataLocalhostsIp() {

    var data = localhosts_Ip_Name_Array.sort(function(a, b){
        if(a.name < b.name) return -1;
        if(a.name > b.name) return 1;
        return 0;
    });

    for (var i = 0; i < data.length; i++) {
        $("#nameloc").append('<option value="' + data[i].ip + '">' + ( (data[i].name) ? data[i].name : "No name" ) + '(' + data[i].ip + ' )</option>')
    }


    // Process JQuery-UI combobox drawing
    $( "#nameloc" ).combobox();

}

