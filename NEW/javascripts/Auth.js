/**
 * Created by smile on 10/05/16.
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
    $("#localhostTab").click();
}

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

function connect()
{
    callAJAX("connect.json", "login="+$("#login-username").val()+"&pass="+$("#login-password").val(), "json", connectCallback, '');
}


function tryRestaureConnectSession()
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
 * Function called on connection callAJAX true response of Daq App (successfully logged in Daq App)
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



function disconnect()
{
    callAJAX("disconnect.json", '', "json", disconnectCallback, '');
}




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



function reloadPage() {
    /**
     * Reload current page
     */
    location.reload();
}


