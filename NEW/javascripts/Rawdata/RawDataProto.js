/**
 * Created by smile on 29/07/16.
 */



function initializeProtosId(){

    callAJAX("getProtoList.json", '', "json", setProtosId, null);

}

function setProtosId(jsonResponse) {

    var protoIdIndex = jsonResponse.content.indexOf("ipnum");
    var protoNameIndex = jsonResponse.content.indexOf("keyword");
    
    var data = jsonResponse.data.sort(function(a, b){
                                            if(a[protoNameIndex] < b[protoNameIndex]) return -1;
                                            if(a[protoNameIndex] > b[protoNameIndex]) return 1;
                                            return 0;
                                        });

    for (var i = 0; i < data.length; i++) {
        if( data[i][protoIdIndex] != 1 && data[i][protoIdIndex] != 6 && data[i][protoIdIndex] != 17  && data[i][protoNameIndex] != "" )
            $("#proto").append('<option value="' + data[i][protoIdIndex] + '">' + data[i][protoNameIndex] + '</option>')
            protocoleTable[jsonResponse.data[i][protoIdIndex]] = jsonResponse.data[i][protoNameIndex];
    }


    // Process JQuery-UI combobox drawing
    $( "#proto" ).combobox();

}

