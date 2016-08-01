

/*********************************************************************************************************
 update Constructor
 ********************************************************************************************************/

function LastHourHistory(theWSEventNotifier) {

  var idGenerator = 0;
  var currentTime = new Date(0);

  var mapRequestsOnNewMinute = new Map();
  var mapResultLastMinute = new Map();

  this.onWSConnect = function(){
    var _this = this;
    theWSEventNotifier.addCallback("notify", "date_processing", function (param) {onNotification(param)});

  };

  this.init = function()
  {
    var _this = this;
    theWSEventNotifier.waitForSocketConnection(
      _this.onWSConnect()
    );
  };

  this.getCurrentMinute = function(){
    return currentTime;
  };




  function onNotification(param){

    var notificationDate = new Date(param.date);

    mapRequestsOnNewMinute.forEach(function(callbacks, urlRequest){

      var lastResult = mapResultLastMinute.get(urlRequest);

      var minuteParam;

      //More than 15mn since the last result=> possible trouble, one hour is requested.
      if(!lastResult || notificationDate.getTime() - lastResult.date.getTime() > 900000){

        minuteParam = 60;

      }else{

        minuteParam = lastResult.result.data[0][0];

      }

      console.log(minuteParam);

      var urlRequestParam = addStringUrl(urlRequest,"minute=" + minuteParam);


      d3.json(urlRequestParam,function(error,json){

        if(error || testJson(json)){
          console.warn("error request notification " + urlRequestParam);
          return;
        }

        json = json.response;
        var jsonData = json.data;
        var jsonCurrentMinute = jsonData[0][0];

        var newResult;

        if((minuteParam !== 60) && (jsonCurrentMinute !== minuteParam) /*must be checked,server has a slightly incoherent
                                                                             behavior if current minute is requested*/)
        {

          var lastResultData = lastResult.result.data;
          var durationResult = trueModulo(jsonCurrentMinute - minuteParam, 60);
          var lastResultDataLength = lastResultData.length;


          //an 1 hour window is kept
          for(var i = lastResultDataLength - 1; i >=0 ; i --){

            if(trueModulo(minuteParam - lastResultData[i][0], 60) + 1 + durationResult <= 60){
              break;
            }

          }

          i++;

          lastResultData.splice(i,lastResultDataLength - i);


          //new data is stored
          for(i = jsonData.length - 1; i >= 0; i--){
            lastResultData.unshift(jsonData[i]);
          }

          newResult = lastResult.result;

        }else if(jsonCurrentMinute === minuteParam){

          newResult = lastResult.result;

        }else{
          //minuteParam === 60
          newResult = json;
        }

        mapResultLastMinute.set(urlRequest,{result:newResult,date:notificationDate});

        //now, the data (newResult) is ready to be sent through the callbacks
        callbacks.sort(function(a,b){

          if(a.lastMinute === -1 && b.lastMinute === -1){

            return 0;

          }

          if(a.lastMinute === -1){
            return trueModulo(jsonCurrentMinute - b.lastMinute,60) - 1;
          }

          if(b.lastMinute === -1){
            return 1 - trueModulo(jsonCurrentMinute - a.lastMinute,60);
          }

          return trueModulo(jsonCurrentMinute - b.lastMinute,60) - trueModulo(jsonCurrentMinute - a.lastMinute,60);

        });


        var response = newResult;
        var processedLastMinute=60;
        callbacks.forEach(function(callbackObj){

          response = JSON.parse(JSON.stringify(response));

          var lastMinute = callbackObj.lastMinute;


          if(lastMinute !== processedLastMinute){

            var responseData = response.data;
            var responseDataLength = responseData.length;
            var durationResponse;
            if(lastMinute=== -1){
              durationResponse = 1;
            }else{
              durationResponse = trueModulo(jsonCurrentMinute - lastMinute,60);
            }

            for(var i = 0; i < responseDataLength ; i ++){

              if(trueModulo(jsonCurrentMinute - responseData[i][0],60) >= durationResponse){
                responseData.splice(i,responseDataLength - i);
                break;
              }
            }
            processedLastMinute = lastMinute;
          }

          callbackObj.lastMinute = (lastMinute === -1)?-1:jsonCurrentMinute;

          try {
            callbackObj.callback(response);
          }catch(e){
            console.warn("callback error: " + e);
          }

        });

      });

    });

    currentTime = notificationDate;

  }


  this.addMinuteRequest = function(urlRequest, callback, lastMinute){

    var id = generateId();

    if(mapRequestsOnNewMinute.has(urlRequest)){

      var requests = mapRequestsOnNewMinute.get(urlRequest);
      requests.push({callback:callback, lastMinute: lastMinute, id:id});

    }else{
      mapRequestsOnNewMinute.set(urlRequest,[{callback: callback, lastMinute:lastMinute, id:id}]);
    }

    return id;

  };

  this.unsubscribe = function(urlRequest, id){
    var r = mapRequestsOnNewMinute.get(urlRequest);
    if(r){
      r.some(function(elem,i){
        if(elem.id === id){
          r.splice(i,1);
          return true;
        }
        return false;
      });
    }
  }



  this.getLastHour = function(urlRequest, callback){

    var resultLastMinute = mapResultLastMinute.get(urlRequest);
    if(resultLastMinute && resultLastMinute.date.getTime() === currentTime.getTime()){

      callback(resultLastMinute.result);

    }else{

      d3.json(addStringUrl(urlRequest,"minute=60"),function (error,result) {

        if(!error && !testJson(result)){
          result = result.response;
          mapResultLastMinute.set(urlRequest,{date: currentTime, result:result});
          callback(result);
        }else{
          callback(false);
        }

      });
    }
  };


  function oldestMinute(a,b){

    if(trueModulo(currentTime - a, 60) >= trueModulo(currentTime - b, 60)){
      return a;
    }

    return b;

  }

  function addStringUrl(url, prmt){

    return(url.indexOf("?") === -1)?url + "?" + prmt:url+ "&" + prmt;

  }

  function generateId(){
    return idGenerator ++;
  }
}



















/*
function webSocketHistoryCreation()
{
  
  
  var webSocket = null;

  var mapRequestsOnNewMinute = new Map();
  var mapResultLastMinute = new Map();

  if ("WebSocket" in window && webSocket == null)
  {

    var path = location.pathname.slice(0);
    var idx = path.lastIndexOf('/');
    if (idx > 0)
      path = path.substr(0,idx);
    else
      path = '';

    var use_ssl = window.location.protocol.indexOf('https')>-1;

    path = "";

    var strConnection = use_ssl?'wss://' + location.host + ':443' + path + '/dynamic/EventNotifier'
      :'ws://' + location.host + path + '/dynamic/EventNotifier';

    console.log(strConnection);

    webSocket = new WebSocket(strConnection);

    webSocket.onopen = function()
    {
      //webSocket.send("The client message");
      console.log("Socket history opened");
    };

    webSocket.onclose = function()
    {
      console.log("Socket closed");
    };

    webSocket.onerror = function()
    {
      console.warn("Socket error in lastHourHistory.js");
      alert("Web Socket Error. Page reload !");

    };

    webSocket.onmessage = function (evt)
    {
      console.log(evt);
      var json = JSON.parse(evt.data);
      var key = json.type + ":" + json.name;

      if(key === 'notify:date_Processing'){

        console.log("date ok");

        //Each notification, recorded request are sent and according callback are called.
        mapRequestsOnNewMinute.forEach(function(arrayCallbacks, urlRequest){


          httpRequestJson(urlRequest, function(result){

            try {
              var json = JSON.parse(result);
            }
            catch(error){
              console.warn(error);
              return;
            }

            var lastResult = mapResultLastMinute.get(urlRequest);


            if(testJson(json) || (!testJson(lastResult) && +lastResult.response.minute >= +json.response.minute)){
              console.log("oups");
              return;
            }

            mapResultLastMinute.set(urlRequest,json);

            console.log(arrayCallbacks);

            arrayCallbacks.forEach(function(callback){
              callback(json);
            });

          });

        })

      }
    };






    function httpRequestJson(urlRequest, callback){
      var request = new XMLHttpRequest();
      request.onreadystatechange = function() {
        if (request.readyState === XMLHttpRequest.DONE && request.status === 200){

          callback(request.responseText);

        }
      };

      request.open("GET", urlRequest, true); // true for asynchronous
      request.send(null);
    }



    return webSocket;
  }


  alert("WebSockets are not supported by your browser!");


  return null;
}




function webSocketHistoryCreation()
{


  var webSocket = null;

  var mapRequestsOnNewMinute = new Map();
  var mapResultLastHour = new Map();

  if ("WebSocket" in window && webSocket == null)
  {

    var path = location.pathname.slice(0);
    var idx = path.lastIndexOf('/');
    if (idx > 0)
      path = path.substr(0,idx);
    else
      path = '';

    var use_ssl = window.location.protocol.indexOf('https')>-1;

    path = "";

    var strConnection = use_ssl?'wss://' + location.host + ':443' + path + '/dynamic/EventNotifier'
      :'ws://' + location.host + path + '/dynamic/EventNotifier';

    console.log(strConnection);

    webSocket = new WebSocket(strConnection);

    webSocket.onopen = function()
    {
      //webSocket.send("The client message");
      console.log("Socket history opened");
    };

    webSocket.onclose = function()
    {
      console.log("Socket closed");
    };

    webSocket.onerror = function()
    {
      console.warn("Socket error in lastHourHistory.js");
      alert("Web Socket Error. Page reload !");

    };



    webSocket.addMinuteRequest = function(urlRequest, callback){

      if(mapRequestsOnNewMinute.has(urlRequest)){
        mapRequestsOnNewMinute.get(urlRequest).push(callback);
      }else{
        mapRequestsOnNewMinute.set(urlRequest,[callback]);
      }
      return true;
    };

    webSocket.makeHourRequest = function(urlRequest){

      urlRequest += "&minute=60";
      httpRequestJson(urlRequest,function(result){

        try {
          var json = JSON.parse(result);
        }
        catch(error){
          console.warn(error);
          return;
        }

        processJsonResult(json);

        mapResultLastHour.set(urlRequest,{result:json, date:"not set yet"});

      })

    };

    webSocket.getLastHourResult = function(urlRequest){

      var result = mapResultLastHour.get(urlRequest);

      if(result){
        return result.result;
      }

      return false;

    };



    webSocket.onmessage = function (evt)
    {
      console.log(evt);
      var eventData = JSON.parse(evt.data);
      var key = eventData.type + ":" + eventData.name;

      if(key === 'notify:date_processing'){

        console.log("date ok");

        //Each notification, recorded request are sent and according callback are called.
        mapRequestsOnNewMinute.forEach(function(arrayCallbacks, urlRequest){

          var lastResult = mapResultLastHour.get(urlRequest);

          var dateEvent = new Date(eventData.date);

          if(lastResult.date === "not set yet"){
            lastResult.date = (dateEvent.getTime() - 60000)
          }

          if(lastResult && (dateEvent.getTime() - lastResult.date.getTime() >= 3600000)){
            console.log("more than one hour before last update: " + urlRequest);
            return;
          }



          httpRequestJson(urlRequest, function(result){

            try {
              var json = JSON.parse(result);
            }
            catch(error){
              console.warn(error);
              return;
            }

            processJsonResult(json);

            mapResultLastHour.set(urlRequest,{result:json, date:dateEvent});

            console.log(arrayCallbacks);

            arrayCallbacks.forEach(function(callback){
              callback(json);
            });

          });

        });

      }
    };



    return webSocket;




    function httpRequestJson(urlRequest, callback){
      var request = new XMLHttpRequest();
      request.onreadystatechange = function() {
        if (request.readyState === XMLHttpRequest.DONE && request.status === 200){

          callback(request.responseText);

        }
      };

      request.open("GET", urlRequest, true); // true for asynchronous
      request.send(null);
    }

  }


  alert("WebSockets are not supported by your browser!");


  return null;
}


*/