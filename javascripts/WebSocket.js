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

        webSocket = new WebSocket((use_ssl?'wss://':'ws://') + location.host + (use_ssl?':443':'') + path + "/" + proxyPass + webSocketName);

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
            console.log("Socket closed");
        };

        webSocket.onerror = function()
        {
            console.warn("Socket error in Websocket.js");
            alert("Web Socket Error. Page reload !");
            
            /**
             * Reload current page
             */
            //(TODO: uncomment this) location.reload();
        };

    }
    else
    {
        alert("WebSockets are not supported by your browser!");
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



