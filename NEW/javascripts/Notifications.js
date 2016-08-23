/**
 * Created by smile on 26/05/16.
 */



// TODO : function adaptation to ZNeTS's interface (current version is still for MIMAC)


/**
 * Notification Display Function.
 * Display a notification message in the user's interface
 * @param message
 * @param alertType
 * @param callBack : function triggered once message disappears
 */
function addNotification(message, alertType, callBack) {

    var alert = jQuery('<div/>', {
        class: 'alert notification ' + alertType,
        html: '<a class="close" data-dismiss="alert">&times;</a><span class="clampTo1Line">'+message+'</span>'
    });

    $('#notificationsContainer').append(alert);

    // Fade in  newly created/appended alert
    alert.hide().fadeIn(500);

    var timer = null;

    if(alert.hasClass("alert-log") && alert.hasClass("alert-info"))
        timer = 2000;
    else if(!alert.hasClass("alert-log") && alert.hasClass("alert-info"))
        timer = 3000;
    else if(alert.hasClass("alert-success"))
        timer = 4000;
    else if(alert.hasClass("alert-warning"))
        timer = 5000;
    else if(alert.hasClass("alert-danger"))
        timer = 6000;
    else
        console.warn("addNotification in Notifications.js : UNEXPECTED alertType : %s %i", alertType, 104);

    if(timer)
        setTimeout(function() { // this will automatically close the alert and remove this if the users doesnt close it in 5 secs

            alert.slideUp(500, function() {
                $(this).remove();

                if(callBack)
                    callBack();
            });

        }, timer);

}

/**
 * Websocket Event Notification Display Function.
 * @param mesgType
 * @param mesgName
 * @param mesgParams
 * @param callBack
 */
function addWebsocketNotification(mesgType, mesgName, mesgParams, callBack) {

    if(mesgType === "notify")
    {
        if (mesgName === "acquisitionMonitor")
            return; // DO NOT SHOW NOTIFICATION

        else if (mesgName === "debugMonitoring")
            return; // DO NOT SHOW NOTIFICATION

        else if (mesgName === "logs")
            addNotification("NEW LOG "+mesgParams.severity+ " : " + mesgParams.message, "alert-log alert-info", callBack);

        else if (mesgName === "planStatus")
            //addNotification("Module status has changed", "alert-info", callBack);
            return; // PLANS NOTIFICATIONS ARE TRIGGERED IN plan.js

        else if (mesgName === "sensorStatus")
            //addNotification("Chamber status has changed", "alert-info", callBack);
            return; // SENSORS NOTIFICATIONS ARE TRIGGERED IN sensor.js

        else if (mesgName === "debugAcquisition") {
            if (( mesgParams.finished && mesgParams.finished != "false" ) || mesgParams.finished === true || mesgParams.finished === "true")
                addNotification("Chamber successfully debug !", "alert-info", callBack);
        }
        else if (mesgName === "globalAcquisitionStatus") {
            if (( mesgParams.running && mesgParams.running != "false" ) || mesgParams.running === true || mesgParams.running === "true")
                addNotification("Acquisition started !", "alert-info", callBack);

            else if (( mesgParams.running && mesgParams.running != "true" ) || mesgParams.running === false || mesgParams.running === "false")
                addNotification("Acquisition stopped !", "alert-info", callBack);

            else
                console.error("addWebsocketNotification error (%i)", 100);
        }
        else
            console.error(mesgType + ":" + mesgName + ":" + JSON.stringify(mesgParams))
        //console.error("addWebsocketNotification error (%i)", 101);
    }
    else
        console.error(mesgType+":"+mesgName+":"+JSON.stringify(mesgParams))
        //console.error("addWebsocketNotification error (%i)", 102);

    //if(message)
    //addNotification(mesgType+":"+mesgName+":"+JSON.stringify(mesgParams), "alert-info", callBack);

}

/**
 * Ajax Request Status Notification Display Function.
 * @param mesg
 * @param callBack
 */
function addAjaxNotification(mesg, callBack) {

    var alertType;
    var success = false;

    if (( mesg.result && mesg.result != "false" ) || mesg.result === true || mesg.result === "true") {
        alertType = "alert-success";
        success = true;
    } else
        alertType = "alert-danger";


    if (success)
    {

        if (mesg.request === "Connect")
            addNotification("Successfully logged in!", alertType, callBack);

        else if (mesg.request === "DoCommandGlobal")

            if (mesg.command === "getStatus")
                return; // DO NOT SHOW NOTIFICATION
            else if (mesg.command === "getLogs")
                return; // DO NOT SHOW NOTIFICATION
            else if (mesg.command === "getAcquisitionMonitor")
                return; // DO NOT SHOW NOTIFICATION
            else if (mesg.command === "startAcquisition")
                addNotification("Acquisition started !", alertType, callBack);
            else if (mesg.command === "stopAcquisition")
                addNotification("Acquisition stopped !", alertType, callBack);
            else
                console.error(JSON.stringify(mesg));
        //console.error("addAjaxNotification error (%i)", 103);

        else if (mesg.request === "DoCommandPlan")
        {
            if (mesg.command === "activate")
                addNotification("Module activation succeeded !", alertType, callBack);
            else if (mesg.command === "disactivate")
                addNotification("Module disactivation succeeded !", alertType, callBack);
            else
                console.error(JSON.stringify(mesg));
        }
        else if (mesg.request === "DoCommandSensor")

            if (mesg.command === "getConfig" || mesg.command === "getAcqConfig")
                addNotification("Chamber configuration retrieval succeeded !", alertType, callBack);
            else if (mesg.command === "setConfig")
                addNotification("Chamber configuration edition succeeded !", alertType, callBack);
            else if (mesg.command === "activate")
                addNotification("Chamber activation succeeded !", alertType, callBack);
            else if (mesg.command === "disactivate")
                addNotification("Chamber disactivation succeeded !", alertType, callBack);
            else if (mesg.command === "startCalibration")
                addNotification("Chamber calibration started !", alertType, callBack);
            else if (mesg.command === "startDebug")
                addNotification("Chamber debugging started !", alertType, callBack);
            else if (mesg.command === "quitDebug")
                addNotification("Chamber debugging stopped !", alertType, callBack);
            else if (mesg.command === "getDebugAdc")
                return; // DO NOT SHOW NOTIFICATION
            else if (mesg.command === "abortDebug")
                addNotification("Chamber debugging aborted !", alertType, callBack);
            else if (mesg.command === "getAcquisitionNrjSpectrum")
                return; // DO NOT SHOW NOTIFICATION
            else
                console.error(JSON.stringify(mesg));

        else
            if(mesg.request != null)
                console.error(mesg.request);
    //console.error("addAjaxNotification error (%i)", 104);

    }
    else{

        var errorMessage = "";

        if(mesg.error)
            errorMessage = " (ERROR : "+mesg.error+")";
        else if(mesg.exception)
            errorMessage = " (EXCEPTION : "+mesg.exception+")";


        if (mesg.request === "Connect")
            addNotification("Wrong login/password!", alertType, callBack);

        else if (mesg.request === "DoCommandGlobal")

            if (mesg.command === "getStatus")
                return; // DO NOT SHOW NOTIFICATION
            else if (mesg.command === "getLogs")
                return; // DO NOT SHOW NOTIFICATION
            else if (mesg.command === "getAcquisitionMonitor")
                return; // DO NOT SHOW NOTIFICATION
            else if (mesg.command === "startAcquisition")
                addNotification("Could not start acquiring !"+errorMessage, alertType, callBack);
            else if (mesg.command === "stopAcquisition")
                addNotification("Could not stop acquiring !"+errorMessage, alertType, callBack);
            else
                console.error(JSON.stringify(mesg));
        //console.error("addAjaxNotification error (%i)", 103);

        else if (mesg.request === "DoCommandPlan")
        {
            if (mesg.command === "activate")
                addNotification("Module activation failed !"+errorMessage, alertType, callBack);
            else if (mesg.command === "disactivate")
                addNotification("Module disactivation failed !"+errorMessage, alertType, callBack);
            else
                console.error(JSON.stringify(mesg));
        }
        else if (mesg.request === "DoCommandSensor")

            if (mesg.command === "getConfig" || mesg.command === "getAcqConfig")
                addNotification("Chamber configuration retrieval failed !"+errorMessage, alertType, callBack);
            else if (mesg.command === "setConfig")
                addNotification("Chamber configuration edition failed !"+errorMessage, alertType, callBack);
            else if (mesg.command === "activate")
                addNotification("Chamber activation failed !"+errorMessage, alertType, callBack);
            else if (mesg.command === "disactivate")
                addNotification("Chamber disactivation failed !"+errorMessage, alertType, callBack);
            else if (mesg.command === "startCalibration")
                addNotification("Chamber calibration failed !"+errorMessage, alertType, callBack);
            else if (mesg.command === "startDebug")
                addNotification("Chamber debugging failed to start !"+errorMessage, alertType, callBack);
            else if (mesg.command === "quitDebug")
                addNotification("Chamber debugging failed to stop !"+errorMessage, alertType, callBack);
            else if (mesg.command === "abortDebug")
                addNotification("Chamber debugging failed to abort !"+errorMessage, alertType, callBack);
            else if (mesg.command === "getDebugAdc")
                addNotification("Chamber debugging failed to retrieve data !"+errorMessage, alertType, callBack);
            else if (mesg.command === "getAcquisitionNrjSpectrum")
                addNotification("Chamber energy spectrum retrieval failed !"+errorMessage, alertType, callBack);
            else
                console.error(JSON.stringify(mesg));

        else
            if(mesg.request != null)
                console.error(mesg.request);
        //console.error("addAjaxNotification error (%i)", 104);

    }

}

