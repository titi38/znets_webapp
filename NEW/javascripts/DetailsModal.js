/**
 * Created by smile on 11/08/16.
 */



function getAlertDetail(alertData) {

    var alertId = alertData[0];

    callAJAX("getAlertDetail.json", "id="+alertId, "json", showAlertDetailsModal, alertData)

}




function showAlertDetailsModal(response, alertData) {

    var alert_Date = alertData[1];
    var alert_Localhost_Ip = alertData[2];
    var alert_Localhost_Name = alertData[3];
    var alert_Type_Title = alertData[4];

    var titleText = alert_Type_Title + "<br>" + "Alert date : " + alert_Date + "<br>" + "Localhost : " + alert_Localhost_Name + "("+alert_Localhost_Ip+")";

    if(response)
        if(response.details)
            setModal(titleText, response.details);
        else
            setModal(titleText, "No details for the selected alert !");
    else
        setModal(titleText, "Something went wrong : no 'response' field in server's json ! Please check the console.");

    $("#information_Details_Modal").modal('show');

}




function showLogDetailsModal(logData) {

    var log_Type_Title = logData[0];
    var log_Date = logData[1];
    var log_Shown_Msg = logData[2];
    var log_Details = logData[3];

    var titleText = log_Type_Title + " log entry<br>" + "Log date : " + log_Date;
    var contentText = "Log Message : " + log_Shown_Msg + "<br>---------------------------------------------------------------<br>" + "Details : " + log_Details;

    setModal(titleText, contentText);

    $("#information_Details_Modal").modal('show');

}



function setModal(titleText, contentText) {
    setModalTitle(titleText);
    setModalContent(contentText);
}



function setModalTitle(titleText) {
    $("#information_Details_Modal .modal-title").html(titleText);
}



function setModalContent(contentText) {
    $("#information_Details_Modal .modal-body").html(contentText);
}