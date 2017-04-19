/**
 * Created by smile on 18/02/16.
 */


/*********************************************************************************************************
 WSEventNotifier Constructor
 ********************************************************************************************************/

/**
 * WebSocket Event Notifier Object (Constructor)
 * @param webSocketName
 * @constructor
 */
function WSEventNotifier(webSocketName)
{

    var webSocket = null;
    var eventSuscribers = new Array();

    if ("WebSocket" in window && webSocket == null)
    {
        var path = new String (location.pathname);
        var idx = path.lastIndexOf('/');
        if (idx > 0)
            path = path.substr(0,idx);
        else
            path = '';

        var use_ssl = window.location.protocol.indexOf('https')>-1;
        var wsUrl=(use_ssl?'wss://':'ws://') + location.host;
        if ( use_ssl && location.host.indexOf(':') === -1 ) 
          wsUrl +=':443';
        wsUrl += path + "/" + proxyPass + webSocketName; 


        webSocket = new WebSocket( wsUrl );

        webSocket.onopen = function()
        {
            //webSocket.send("The client message");
            console.log("Socket opened");
        };

        webSocket.onmessage = function (evt)
        {
            //var received_msg = evt.data;
            console.log("WEBSOCKET MESSAGE: ");
            console.log(evt);

            var json = JSON.parse(evt.data);
            //alert("Json type : " + json.type + "   |||   Json name : " + json.name+ "   |||   Json param p1: " + json.param.p1);
            var key = json.type + ":" + json.name;

            addWebsocketNotification(json.type, json.name, json.param, null);
            
            if(key in eventSuscribers){
                for (var i = 0; i < eventSuscribers[key].length; i++) {
                    console.log(eventSuscribers[key][i]);
                    eventSuscribers[key][i](json.param);
                }
            }
            else
                console.error("TODO webSocket.onmessage : no eventSuscribers for key '%s' | %i", key, 101);
        };

        webSocket.onclose = function()
        {
            console.log("WebSocket closed");

            alertBS("Disconnection", "You have been disconnected. Click to reload the application...", "Reload", function() { location.reload(); } );
        };

        webSocket.onerror = function()
        {
            console.warn("WebSocket error");

            alertBS("Disconnection", "You have been disconnected. Click to reload the application...", "Reload", function() { location.reload(); } );
        };

    }
    else
    {
        alertBS("Critical Issue", "WebSocket are not supported by your browser... The application can't be launched !", "Reload", function() { location.reload(); } );
    }

    this.addCallback = function(type, nom, func)
    {
        if(!eventSuscribers[type+':'+nom])
            eventSuscribers[type+':'+nom] = [];
        eventSuscribers[type+':'+nom].push(func);
    };



    // Make the function wait until the connection is made...
    this.waitForSocketConnection = function(callback){

        console.log("wait for connection...");


        function testConnection() {
            setTimeout(function(){

                if (webSocket.readyState === WebSocket.OPEN) {
                    console.log("Connection is made");
                    if (callback != null) {
                        callback();
                    }
                    return;
                }

                testConnection();


            }, 5); // wait 5 milisecond for the connection...
        }

        testConnection();


    }

}



