5/**
 * Created by smile on 17/06/16.
 */


function initializeApplicationsId(){

    callAJAX("getAppList.json", '', "json", setApplicationsId, null);

}

function setApplicationsId(jsonResponse) {

    $("#appId").append('<option value="">All</option>')

    for (var i = 0; i < jsonResponse.data.length; i++) {
        $("#appId").append('<option value="' + jsonResponse.data[i][1] + '">' + jsonResponse.data[i][0] + '</option>')
    }

}

