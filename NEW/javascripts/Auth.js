/**
 * Created by smile on 10/05/16.
 *
 */


/**
 * Executes interface modification once user is successful connected (login box modifications)
 *  - Sets User's Name
 *  - Show/Hide and Enable/Disable corresponding buttons
 *  - Set "view on connexion" to Localhost Table
 * @param response : connexion request response
 */
function userLoggedIn(response)
{
    // Set login input value to response.username value
    if(response)
    {
        $("#shown-login-username").val(response.username)

        if (response.auth && response.auth !== "HTML")
        {
            $("#btn-disconnect").hide();
        }
    }

    $("#shown-login-username").prop("disabled", true);


    // Show login inside upper navbar
    $("#loginform").removeClass("hidden");
    $("#localhostTab").click()
}




/**
 * Executes interface modification once user is successful disconnected (login box modifications)
 *  - Resets User's Name
 *  - Show/Hide and Enable/Disable corresponding buttons
 */
function userDisconnect()
{
    //console.warn("TODO : Auth.js : userDisconnect function (what happend on user disconnection)");
    $("#passwordArea").show();
    $("#btn-login").show();
    $("#btn-login").attr("type", "submit");
    $("#btn-disconnect").hide();
    $("#btn-disconnect").attr("type", "button");
    $("#login-username").prop("disabled", false);

    // Hide login inside upper navbar
    $("#loginform").addClass("hidden");
}





/**
 * User's Connection Function
 * Ajax request to server with filled "login" and "password" fields
 * Execute "connectCallback" function on response
 */
function connect()
{
    callAJAX("connect.json", "login="+$("#login-username").val()+"&pass="+$("#login-password").val(), "json", connectCallback, '');
}





/**
 * Executes a connection attempt without "login/password"
 * If there is a session (valid cookie id), server will respond successfully. If not, nothing to do and wait for user's connection attempt
 * @returns {false} - in order to avoid default page behaviour (redirection or reload)
 */
function tryRestoreConnectSession()
{
    // Try to log with current session (success if valid session)
    // Try login
    $.ajax({
        url: proxyPass + "connect.json",
        type: "POST",
        dataType : "json"
    })
    .done(function(msg){
        if( ( msg.result && msg.result != "false" ) || msg.result === true || msg.result === "true")
        {
            connectCallback(msg.response);
        }
        else if( ( msg.result && msg.result != "true" ) || msg.result === false || msg.result === "false")
        {
            //DO NOTHING
        }
        else
        {
            console.warn("TODO in CallAjax.js : UNEXPECTED value on callAjax response.result nor true neither false (%i)", 777);
            addNotification("Server error. Unexpected result answered ! (777)", "alert-danger", null);
        }
        return false;
    })
    .fail(function(jqXHR, textStatus){
        console.warn("TODO in Auth.js : Request failed (%i)", 550);
        addNotification("Server is down ! (550)", "alert-danger", null);
    });

    return false;

}


/**
 * Function called on connection callAJAX true response (successfully logged in)
 * Trigger interface initialization
 * Trigger interface modification (user successful connected)
 * @param response : returned by callAjax
 */
function connectCallback(response)
{
    /**
     * Initialize application
     */
    initialisation();

    /**
     * Update loggin box view
     */
    userLoggedIn(response);
}





/**
 * User's Disconnection Function
 * Ajax request to server on user's disconnection
 * Execute "disconnectCallback" function on response
 */
function disconnect()
{
    callAJAX("disconnect.json", '', "json", disconnectCallback, '');
}







/**
 * Function called on disconnection callAJAX true response (successfully logged out)
 * Trigger interface modification (user successfully disconnected)
 * Reloads page
 */
function disconnectCallback() {
    /**
     * Update loggin box view
     */
    userDisconnect();

    /**
     * Reload current page
     */
    reloadPage();
}



/**
 * Reload current page
 */
function reloadPage() {
    location.reload();
}


