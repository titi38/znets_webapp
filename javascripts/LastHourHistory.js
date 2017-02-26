/**
 * Created by elie.
 */



/*********************************************************************************************************
 LastHourHistory Constructor
 ********************************************************************************************************/

/**
 * LastHourHistory Constructor. Keep automatically an one hour window of data from subscribed url to minimize traffic,
 * then call designated function when new data from the server is available
 * @param theWSEventNotifier
 * @constructor
 */

function LastHourHistory(ServerDate) {
//function LastHourHistory(theWSEventNotifier) {

  var idGenerator = 0;
  var currentTime = new Date(0);

  var mapRequestsOnNewMinute = new Map();
  var mapResultLastMinute = new Map();

/*
  this.onWSConnect = function(){
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

    this.init = function()
    {

    };

 */

  function onNotification(dateString, noParam){

    var notificationDate = new Date(dateString);

    mapRequestsOnNewMinute.forEach(function(callbacks, urlRequest){
      var lastResult = mapResultLastMinute.get(urlRequest);
      var minuteParam;

      switch ($("#timesliceCharts").val()) {
          case "lastHour" :
          case "lastDay" :
          case "lastWeek" :
          case "lastMonth" :
              if(lastResult) {
                  minuteParam = lastResult.result.data[0][0];
                  break;
              }
          default :
              minuteParam = 60;
              break;
      }
/*
      //More than 15mn since the last result=> possible trouble, one hour is requested.
      if(!lastResult || notificationDate.getTime() - lastResult.date.getTime() > 900000){
        minuteParam = 60;
      }else{
        minuteParam = lastResult.result.data[0][0];
      }
*/
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
        var callbacksShallowCopy = callbacks.concat();
        callbacksShallowCopy.forEach(function(callbackObj){

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
            callbackObj.callback(response, new Date(dateString));
          }catch(e){
            console.warn("callback error");
            console.warn(e);
          }

        });

      });

    });

    currentTime = notificationDate;

  }

  /**
   * Subscribes to the websocket notifier to receive actualized data.
   * @param urlRequest {String} The url string without the minute parameter.
   * @param callback {Function} The function to call with new data. Should allow two parameters, the first one
   * being the Json object wich contains the data, the second the Javascript Date being the date of the notification.
   * @param lastMinute {Number} From 0 to 59, it's the minute of the last obtained data. -1 to request only the last
   *                                                                        minute even if there is a gap between data.
   * @returns {Number} The id of the subscription.
   */

  this.addMinuteRequest = function(urlRequest, callback, lastMinute){

    ServerDate.addCallback("theGraph", onNotification, null, 300);

    var id = generateId();

    if(mapRequestsOnNewMinute.has(urlRequest)){

      var requests = mapRequestsOnNewMinute.get(urlRequest);
      requests.push({callback:callback, lastMinute: lastMinute, id:id});

    }else{
      mapRequestsOnNewMinute.set(urlRequest,[{callback: callback, lastMinute:lastMinute, id:id}]);
    }

    return id;

  };

  /**
   * Function to unsubscribe from a request.
   * @param urlRequest {String} The subscribed request.
   * @param id {Number} The id of the subscription.
   * @returns {Boolean} True if it has the requested subscription, false otherwise.
   */

  this.unsubscribe = function(urlRequest, id){

    var r = mapRequestsOnNewMinute.get(urlRequest);
    if(r){

      for(var i = r.length - 1; i >=0; i--){

        if(r[i].id === id){
          r.splice(i,1);
          console.log(mapRequestsOnNewMinute.get(urlRequest));
          return true;
        }
      }
    }
    return false;

  };


  /**
   * To request the recorded last hour from the websocket.
   * @param urlRequest {String} The url of the request.
   * @param callback {Function} a function which is called with the result if the data has been received from the server,
   * and with false otherwise if any error occurred.
   */
/*
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
*/
  function addStringUrl(url, prmt){

    return(url.indexOf("?") === -1)?url + "?" + prmt:url+ "&" + prmt;

  }

  function generateId(){
    return idGenerator ++;
  }

}











