/**
 * Created by smile on 18/02/16.
 */


/*********************************************************************************************************
 callAjax Function
 ********************************************************************************************************/

/**
 * Executes Ajax request (to "url" with paramaters "params") and Executes "callback" function with parameters "callbackParams"
 * @param url
 * @param params
 * @param outputType
 * @param callback
 * @param callbackParams
 * @returns {False} to avoid default page behavior (redirection or reload)
 */
function callAJAX(url, params, outputType, callback, callbackParams)
{

    var sensorCommandType = null;
    if(arguments.length > 5)
        sensorCommandType = arguments[arguments.length-1];

    if(arguments.length > 6)
        console.warn("WARNING : more than expected arguments in callAJAX function %i", 107);

    var callURL = (url.indexOf("display/") > -1) ? (url) : (proxyPass + url);

    // Lock screen
    lockScreen(true);

    var request = $.ajax(
        {
            url: callURL,
            type: "POST",
            dataType : "json",
            //data:  params+"&dh="+parseInt(moment(moment.now()).tz(moment.tz.guess()).format("Z")),
            data:  params+"&dh="+parseInt(moment().format("Z"))
        });

    request.done(function(msg)
    {
        if( ( msg.result && msg.result != "false" ) || msg.result === true || msg.result === "true")
        {
            if(callback)
                if(msg.response)
                    if(!msg.response.errMsg)
                        if(callbackParams)
                            if(sensorCommandType)
                                callback(msg.response, callbackParams, sensorCommandType);
                            else
                                callback(msg.response, callbackParams);
                        else
                            callback(msg.response);
                    else {
                        console.warn("TODO in CallAjax.js : Implement interface alerts on callAjax response contains errMsg (%i)", 107);
                        //addAjaxNotification(msg, null);
                        addNotification("Query error : \""+msg.response.errMsg+"\"", "alert-danger", null);
                    }
                else{
                    if(callback.length === 0)
                        callback();
                    else
                    {
                        console.warn("WARNING ! BE CAREFUL ! In CallAjax : No response.response attribute in callAjax request response, but callback function awaits argument (%i)", 138);
                        callback(callbackParams);
                    }
                }
            else
                console.log("In CallAjax : No callback function specified on CallAjax");



            addAjaxNotification(msg, null);

        }
        else if( ( msg.result && msg.result != "true" ) || msg.result === false || msg.result === "false")
        {
            console.warn("TODO in CallAjax.js : Implement interface alerts on callAjax response.result == FALSE (%i)", 103);
            addAjaxNotification(msg, null);
        }
        else
        {
            console.warn("TODO in CallAjax.js : UNEXPECTED value on callAjax response.result nor true neither false (%i)", 777);
            addNotification("Server error. Unexpected result answered ! (777)", "alert-danger", null);
        }

        // Unlock screen
        lockScreen(false);

    });

    request.fail(function(jqXHR, textStatus)
    {
        //alert( "Request failed: " + textStatus + "\nConnection lost or server down" );
        console.warn("TODO in CallAjax.js : Request failed (%i)", 555);
        console.warn(jqXHR);
        console.warn(textStatus);

        switch ( textStatus ){

            case "parseError" :
                addNotification("parseError : error while parsing received Json. Check it in the console (network tab)! (401)", "alert-danger", null);
                break;
            default :
                console.error("Connection lost. Server is down ! (555)");
          //      console.error(jqXHR);
          //      console.error(textStatus);
                //addNotification("Connection lost. Server is down ! (555) Page will reload shortly ...", "alert-danger", reloadPage);
                addNotification("Connection lost. Server is down ! (555) Page will reload shortly ...", "alert-danger", null);
                break;

        }
        // TODO : uncomment ? (adding a page reload on request fail) addNotification("Connection lost. Server is down ! (555) Page will reload shortly ...", "alert-danger", reloadPage);
        addNotification("Connection lost. Server is down ! (666) Page will reload shortly ...", "alert-danger", null);


        // Unlock screen
        lockScreen(false);

    });

    /**
       Returning false to prevent from page reloading on http request
     Use "return callAJAX(...)" in HTML to return false to HTML
     */
    return false;
}





function lockScreen(lock)
{

    if(lock)
    {
        $("body").prepend("<div id=\"overlay\" class=\"overlay\"></div>");
        $("body").addClass("wait");
    }
    else
    {
        $("#overlay.overlay").remove();
        $("body").removeClass("wait");
    }

}