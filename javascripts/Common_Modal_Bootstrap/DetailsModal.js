/**
 * Created by smile on 11/08/16.
 */


/**
 * Ajax Alert's Details Retrieval Function
 * @param alertData : alert's data containing alert's Id
 */
function getAlertDetail(alertData) {

    var alertId = alertData[0];

    callAJAX("getAlertDetail.json", "id="+alertId, "json", showAlertDetailsModal, alertData)

}


/**
 * Setting and Showing Modal Function - Alert's Details
 * This function is triggered once the user's Ajax request receive a "response"
 * @param response
 * @param alertData : data of checked alert's details
 */
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






/**
 * Setting and Showing Modal Function - Log's Details
 * This function is triggered once the user selects a log in Logs Datatable
 * @param logData : data of checked log's details
 */
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


/**
 * Setting Modal Function - Title and Content Message
 * @param titleText : modal's title text
 * @param contentText : modal's content text
 */
function setModal(titleText, contentText) {
    $("#information_Details_Modal .modal-title").html(titleText);
    $("#information_Details_Modal .modal-body").html(contentText);
}
