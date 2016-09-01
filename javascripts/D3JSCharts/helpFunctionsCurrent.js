/**
 * Utility function to get the current date.
 * @param svg {Object} D3 selection of the parent svg element.
 */

function setStartDate(svg){

  svg.startDate = (typeof serverDate === "string"?new Date(serverDate):serverDate);
  svg.startDate = new Date(svg.startDate.getTime() - (svg.startDate.getTimezoneOffset() + 59 )*60000);
  console.log(svg.startDate);
  
}

/**
 * Process the specific case of netTopServices for real time.
 * @param jsonData {Object} Json object containing the data.
 * @param jsonContent {Array} Content array of jsonData.
 * @param svg {Object} D3 selection of the parent svg element.
 */

function processServices(jsonData, jsonContent, svg){

  if(svg.typeGraph !== "netTopServicesTraffic" && svg.typeGraph !== "netTopServicesNbFlow"){
    return;
  }

  var indexitem = jsonContent.indexOf("port");
  var indexdisplay = jsonContent.indexOf("proto");

  jsonContent[indexitem] = "item";
  jsonContent[indexdisplay] = "display";
  var array, elem, port, proto,protoName;
  for(var i = jsonData.length - 1; i >= 0; i --){

    array = jsonData[i][1];

    for(var j = array.length - 1; j >= 0; j--){
      elem = array[j];
      port = elem[indexitem];
      proto = elem[indexdisplay];
      protoName = idToProtocol(proto);

      if(port === "" && proto === ""){
       continue;
      }

      elem[indexitem] = proto + "/" + port;
      elem[indexdisplay] = (protoName=== ""?elem[indexitem]:protoName + "/" + port);

    }

  }
}


