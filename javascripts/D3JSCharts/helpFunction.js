/**
 * Created by elie.
 */

/**
 * Remove some ticks to avoid text superimposition, for the D3 vertical axis in parameter.
 * @param axis {Object} D3 vertical axis.
 */


function niceTicks(axis) {
  var selectick = axis.selectAll(".tick");
  var selecsize = selectick.size();

  if(selecsize >1){
    var distTick = Math.abs(selectick._groups[0][0].getAttribute("transform").split(/[,)(]+/)[2]
      - selectick._groups[0][1].getAttribute("transform").split(/[,)(]+/)[2]);
    var fontsize = parseFloat(getComputedStyle(selectick._groups[0][0]).fontSize);
    var nb = Math.ceil(fontsize/distTick);
    if (nb>1){
      var dec = Math.floor(nb/2);
      for (var i=0; i<selecsize;i++){
        if((i + dec)%nb !==0){
          selectick._groups[0][i].remove();
        }
      }
    }

  }
}


/**
 * Scrolls a table element until it displays a given tr element with a D3 transition.
 * @param elem {Object} D3 selection of the tr element to be displayed.
 * @param table {Object} D3 selection of the table to be displayed.
 */

function scrollToElementTableTransition(elem, table){

  var tableViewHeight = table.property("clientHeight");
  //var tableScrollHeight = table.property("scrollHeight"); //not used anymore
  var tableScrollTop = table.property("scrollTop");
  var elemOffsetHeight = elem.property("offsetHeight");
  var elemOffsetTop = elem.property("offsetTop");
  var scrollEnd = (elemOffsetTop <= tableScrollTop) ? elemOffsetTop : Math.max(elemOffsetTop - tableViewHeight + elemOffsetHeight + 1, tableScrollTop);


  table.transition().tween("scrolltoptween", function () {
    var tab = this;
    return function (t) {
      tab.scrollTop = tableScrollTop * (1 - t) + t * scrollEnd;
    };
  });

}


/**
 * Test the validity of a json object sent by the server according several criterions.
 * Returns true if invalid, false if correct.
 * @param json {Object} The json object sent by the server.
 * @returns {boolean} True if the json has failed the test, false it has succeded.
 */

function testJson(json){
  return typeof json === "undefined" || json.result != "true" || typeof json.response.data === "undefined" || json.response.data.length === 0;
}

/**
 * Search inside a content array for the "item" value, used as id.
 * @param jsonContent {Object} Content array of the json sent by a server (json.content).
 * @returns {*} If a corresponding name has been found, returns its position in the jsonContent array, false otherwise.
 */

function searchItemValue(jsonContent){

  var length = jsonContent.length;

  var itemArray = ["code","host","localhostip","appid","portproto","asnum","ip", "appName", "item", "?column?"];

  for(var i = 0;i < length; i++ ){

    if(itemArray.indexOf(jsonContent[i]) !== -1){

      return i;

    }
  }

  console.error("no item value found");
  return false;

}


/**
 * Search inside a content array for the date value, used for abscissas.
 * @param jsonContent {Object} Content array of the json sent by a server (json.content).
 * @returns {*} If a corresponding name has been found, returns its position in the jsonContent array, false otherwise.
 */

function searchDateValue(jsonContent){

  var length = jsonContent.length;

  var dateArray = ["date"];

  for(var i = 0;i < length; i++ ){

    if(dateArray.indexOf(jsonContent[i]) !== -1){

      return i;

    }
  }

  console.error("no date value found");
  return false;

}


/**
 * Search inside a content array for the amount value, used for ordinates.
 * @param jsonContent {Object} Content array of the json sent by a server (json.content).
 * @returns {*} If a corresponding name has been found, returns its position in the jsonContent array, false otherwise.
 */

function searchAmountValue(jsonContent){

  var length = jsonContent.length;

  var amountArray = ["amount","nbhosts", "nblocalhosts","nbexternhosts","y"];
  for(var i = 0;i < length; i++ ){

    if(amountArray.indexOf(jsonContent[i]) !== -1){

      return i;

    }
  }

  console.error("no amount value found");
  return false;

}


/**
 * Search inside a content array for the direction value.
 * @param jsonContent {Object} Content array of the json sent by a server (json.content).
 * @returns {*} If a corresponding name has been found, returns its position in the jsonContent array, false otherwise.
 */

function searchDirectionValue(jsonContent){

  var length = jsonContent.length;

  var directionArray = ["direction"];

  for(var i = 0;i < length; i++ ){

    if(directionArray.indexOf(jsonContent[i]) !== -1){

      return i;

    }
  }

  console.error("no direction value found");
  return false;

}


/**
 * Search inside a content array for a possible, non mandatory display value (replaced by item value later
 * if no display value found).
 * @param jsonContent {Object} Content array of the json sent by a server (json.content).
 * @returns {*} If a corresponding name has been found, returns its position in the jsonContent array, false otherwise.
 */

function searchDisplayValue(jsonContent){

  var length = jsonContent.length;

  var displayArray = ["hostname", "name","descr","fullname", "display"];

  for(var i = 0;i < length; i++ ){

    if(displayArray.indexOf(jsonContent[i]) !== -1){

      return i;

    }
  }

  console.log("no display value found");
  return false;

}


/**
 * Search inside a content array for other values of interest.
 * @param jsonContent {Object} Content array of the json sent by a server (json.content).
 * @returns {Array} An array containing all the names' positions found.
 */

function searchAdditionalValues(jsonContent){

  var length = jsonContent.length;

  var addArray = ["c"];

  var resultArray = [];

  for(var i = 0;i < length; i++ ){

    if(addArray.indexOf(jsonContent[i]) !== -1){

      resultArray.push(i);

    }
  }

  return resultArray;

}


/**
 * Returns the corresponding javascript date object for a given graph from the x parameter of a data element.
 * @param svg {Object} A D3 selected element having the svg.step and svg.timeMin values.
 * @param x {Number} The abscissa of a given data.
 * @returns {Date} The javascript date created from the x value.
 */

function getDateFromAbscissa(svg,x){

  return new Date(x*svg.step + svg.timeMin);

}

/**
 * Converts the qty value to its SI notation.
 * Returns an array with the metric unit infMetric and the pow coefficient which has to be multiplied with qty to obtain
 *                                                                                                  the converted value.
 * @param qty {Number} The reference quantity for the conversion.
 * @param unitIsByte {Boolean} True if the qty parameter's unit is byte, false otherwise.
 * @returns {*[]} An array containing two elements, the metric unit infMetric {String} and the pow coefficient {Number}
 * which has to be multiplied with qty to obtain the converted value.
 */


function quantityConvertUnit(qty, unitIsByte){

  if(qty === 0){
    return ["",1];
  }
  var base;
  var infMetric;
  if(unitIsByte === true) {

    base = 1024;

  }else {

    base = 1000;
  }

  var rawExp = Math.log(qty)/Math.log(base);
  var absExp = Math.abs(Math.floor(rawExp));
  var exp = Math.min(8,Math.max(0,absExp));

  if(rawExp < 0){
    exp = -exp;
  }

  var pow = Math.pow(base,-exp);

  if(unitIsByte === true) {

    switch (exp) {

      case -8:
        infMetric = "y";
        break;

      case -7:
        infMetric = "z";
        break;

      case -6:
        infMetric = "a";
        break;

      case -5:
        infMetric = "f";
        break;

      case -4:
        infMetric = "p";
        break;

      case -3:
        infMetric = "n";
        break;

      case -2:
        infMetric = "µ";
        break;

      case -1:
        infMetric = "m";
        break;

      default:
      case 0:
        infMetric = "";
        break;

      case 1 :
        infMetric = "K";
        break;

      case 2 :
        infMetric = "M";
        break;

      case 3 :
        infMetric = "G";
        break;

      case 4 :
        infMetric = "T";
        break;

      case 5 :
        infMetric = "P";
        break;

      case 6 :
        infMetric = "E";
        break;

      case 7 :
        infMetric = "Z";
        break;

      case 8 :
        infMetric = "Y";
        break;

    }

  }else{

    if(exp === 0){
      infMetric = "";
    }else{
      infMetric = "10^" + (exp*3) + " ";
    }

  }

  return [infMetric, pow];

}



/**
 * Utility function which removes a the "nb" string in front of the units' name.
 * @param unitsString {String} The units' name.
 * @returns {String} The processed units' name.
 */

function unitsStringProcessing(unitsString){

  return unitsString.indexOf("nb") === 0 ? unitsString.slice(2) : unitsString;

}


/**
 * Utility function which returns the hour shift from a graph's url.
 * @param url {String} Url used to request data from the server.
 * @returns {Number} The corresponding hour shift.
 */

function getTimeShift(url){
  url = url.split(/[?&=]+/);
  var index = url.indexOf("dh");
  if(index === -1){
    return 0;
  }
  return +(url[index + 1]);

}


/**
 * Utility function used to append svg:title element to each data from a stacked histogram displaying quantity, date,
 * display name and item name.
 * @param svg {Object} D3 encapsulated svg element having the svg.units, svg.timeMin and svg.step properties.
 * @param selection {Object} A D3 selection of rect html elements bound to their datum.
 * @param sumMap {Object} A Javascript Map used to retrieve the display value of requested elements from their item
 *                                                                                                                value.
 */

function createTooltipHisto(svg, selection, sumMap){

  var isBytes = svg.units === "Bytes",coef = 8000/svg.step;

  var convertArray, valDisplay;

  if(isBytes){

    var heightPerSec, cAOptionel;

    selection.append("svg:title")
      .text(function (d) {
        heightPerSec = d.height * coef;
        convertArray = quantityConvertUnit(d.height,isBytes);
        cAOptionel = quantityConvertUnit(heightPerSec,true);
        valDisplay = sumMap.get(d.item).display;
        return ((d.item === valDisplay)?"":(valDisplay + "\n"))
          + d.item + "\n"
          + getDateFromAbscissa(svg,d.x).toString() + "\n"
          + ((Math.round(100 * heightPerSec * cAOptionel[1])/100) + " " + cAOptionel[0] + "bits/s") + "\n"
          + ((Math.round(100 * d.height * convertArray[1])/100) + " " + convertArray[0] + svg.units) + "\n"
          + "(" +  d.height + " " + svg.units + ")";
      });

  }else{

    selection.append("svg:title")
      .text(function (d) {
        convertArray = quantityConvertUnit(d.height,isBytes);
        valDisplay = sumMap.get(d.item).display;
        return ((d.item === valDisplay)?"":(valDisplay + "\n"))
          + d.item + "\n"
          + getDateFromAbscissa(svg,d.x).toString() + "\n"
          + ((Math.round(100 * d.height * convertArray[1])/100) + " " + convertArray[0] + svg.units) + "\n"
          + "(" +  d.height + " " + svg.units + ")";
      });

  }



}

/**
 * Utility function which generates the title attribute of a table rows D3 selection,
 * displaying the name and overall volume of these corresponding items.
 * @param svg {Object} The D3 selection of the svg containing the units' name (svg.units).
 * @param trSelec {Object} D3 selection of the tr elements.
 */

function tableLegendTitle(svg,trSelec){

  var cA, isBytes = svg.units === "Bytes";

  trSelec.attr("title", function (d) {

    cA = quantityConvertUnit(d.sum,isBytes);
    return ((d.item === d.display)?"":(d.display + "\n")) + d.item + "\n"
      + "Overall volume: " + ((Math.round(100 * d.sum * cA[1])/100) + " " + cA[0] + svg.units) + "\n"
      + "(" +  d.sum + " " + svg.units + ")";
  });

}

/**
 * The default Javascript's modulo function (%) isn't mathematically correct. This function is.
 * @param n {Number} Dividend.
 * @param d {Number} Divisor.
 * @returns {Number} Remainder.
 */

function trueModulo(n,d){
  return ((n%d) +d)%d;
}

/**
 * Returns a function which generates a chained transition making data's rect element blink.
 * @param colorMap {Object} A Javascript's Map linking the item's names with their color.
 * @returns {Function} The function used to make data's rect blinking.
 */


function blinkCreate(colorMap) {

  var duration = 500;

  return function(){

    this.parentNode.appendChild(this);
    var rect = d3.select(this);

    var col1 = colorMap.get(rect.datum().item), col2 = "#ffffff", col3 = col1, col4 = "#000000";
    rect.attr("stroke", col3).attr("fill", col2);
    (function doitagain() {
      rect.transition().duration(duration)
        .attr("stroke", col4).attr("fill", col1)
        .transition().duration(duration)
        .attr("stroke", col3).attr("fill", col2)
        .on("end", doitagain);
    })()

  }


}

/**
 * Returns a function which returns a color different from the formers at each call.
 * If my maths are correct, the colors' hue will be nicely spread across a HSL circle at any function call to avoid an
 * overrepresentation of similar colors.
 * @param firstValue {Number} optional, 0 if not defined, is the angle of the first color hue on the HSL circle.
 * @returns {Function} A function which returns a color different from the formers at each call.
 */

function colorEval(firstValue){



  var calcexpmin;
  var added;
  var idecal;
  var val = typeof firstValue !== "undefined" ? trueModulo(firstValue,360) : 0;
  var exp;
  var i = 0;


  var color;


  //non homogeneous repartition circle hsl. (not essential maybe but it has to be done to know that and shouldn't harm)
  //specify the repartition. should be comprised between 0 & 60/Math.PI (env. 19.09), function non injective if greater.
  var coef = 15;

  //specify the period, do not tweak
  var theta = Math.PI/60;

  function display(x){
    return x + coef*Math.sin(theta*x);
    //return x;
  }

  //y: saturation
  //z: lightness
  var y = 5;
  var z = 5;

  var starty = 0.45;
  var startz = 0.45;
  var segmy = (1 - starty)/6;
  var segmz = (0.80 - startz)/10;

  var s = starty + segmy*y;
  var l = startz + segmz*z;


  return function(){
    i++;
    color = d3.hsl(display(val),s,l);
    exp = Math.floor(Math.log(i)/Math.log(2));
    idecal = i - Math.pow(2,exp);
    calcexpmin =  1;
    do{
      idecal = idecal / 2;
      calcexpmin --;
    }
    while(idecal == Math.floor(idecal) && calcexpmin > -exp);

    added = (Math.pow(2,calcexpmin) + Math.floor(((i-1)%4)/3)*0.5)*180;
    val =(val + added)%360;
    //console.log("val " + val);


    y = (y+3)%7;
    z = (z+4)%11;
    s = y*segmy +starty;
    l= z*segmz +startz;

    //console.log(color.h);

    return color;
  }
}


/**
 * Returns an In-Out polynomial function with the exp parameter value as degree used by D3 for easing.
 * @param exp {Number} Degree of the function.
 * @returns {Function} The easing function for D3.
 */

function easeFct(exp){
  var a = Math.pow(2,exp-1);

  return function(t){

    return (t<.5)?a*Math.pow(t,exp):Math.min(1,1-a*Math.pow(1-t,exp));

  }

}

/**
 * Updates the internal variables of a D3 zoom contained in a D3 selection of an html element.
 * @param selection {Object} D3 selection containing the D3 zoom's internal variables.
 * @param transform {Object} Javascript object, has three properties. k, the scale; x, the first coordinate of the
 * translation vector; y, the second coordinate of the translation vector.
 */

function updateTransform(selection,transform){

  var zoom = selection._groups[0][0].__zoom;
  zoom.k = transform.k;
  zoom.x = transform.x;
  zoom.y = transform.y;

}


/**
 * Calculates the display text value and sum of the javascript object elemToPush's height according to elemToPush.item
 * and stores them into the sumMap parameter.
 * @param sumMap {Object} Javascript Map, stores height's sums and display text by item.
 * @param elemToPush {Object} The object corresponding to the data that will be used to create a stacked histogram.
 * @param elemJson {Array} The array returned by the server used to represent a given datum.
 * @param contentDisplayValue {Number} The position of the display text inside the elemJson parameter.
 * @param itemType {String} The reference name for item values by the json returned by the server into
 * json.response.content, used to detect non-generic cases.
 */

function mapElemToSum(sumMap, elemToPush, elemJson, contentDisplayValue,itemType){

  if (!sumMap.has(elemToPush.item)) {
    sumMap.set(elemToPush.item, {sum: elemToPush.height,display:
      (elemToPush.item === " Remainder ")?" Remainder ":
        (elemJson[contentDisplayValue] === "")?elemToPush.item:
          (itemType === "portproto")?elemToPush.item + " (" +  elemJson[contentDisplayValue] + ")":
            elemJson[contentDisplayValue]});
  } else {
    sumMap.get(elemToPush.item).sum += elemToPush.height;
  }

}

/**
 * Utility function for sorting elements in an array according their display value (string).
 * @param a {Object} Javascript object with item and display properties set as strings.
 * @param b {Object} Javascript object with item and display properties set as strings
 * @returns {Number} If less than 0, a will have a lower index than b in the sorting array, if greater,
 * b will have a lower index than a in the sorting array.
 */

function sortAlphabet(a,b){

  if (a.item == " Remainder " || a.item == "OTHERS") {
    return -1;
  }
  if (b.item == " Remainder " || b.item == "OTHERS") {
    return 1;
  }

  if(a.item === a.display && b.item !== b.display){
    return 1;
  }


  if(b.item === b.display && a.item !== a.display){
    return -1;
  }

  return a.display.localeCompare(b.display,"en");

}


/**
 * Utility function for sorting elements in an array according their item value (strings).
 * @param a {Object} Javascript object with item property set as string.
 * @param b {Object} Javascript object with item property set as string.
 * @returns {Number} If less than 0, a will have a lower index than b in the sorting array, if greater,
 * b will have a lower index than a in the sorting array.
 */

function sortAlphabetItemOnly(a,b){

  if (a.item == " Remainder " || a.item == "OTHERS") {
    return -1;
  }
  if (b.item == " Remainder " || b.item == "OTHERS") {
    return 1;
  }

  return a.item.localeCompare(b.item,"en");

}


/**
 * Utility function for mapping Javascript data object into the array parameter inside a Javascript Map forEach
 * function.
 * @param array {Array} The array where the data will be stored.
 * @returns {Function} The function used by the forEach function.
 */

function mapToArray(array){
  return function (value, key) {
    array.push({item: key, sum: value.sum, display: value.display});
  }

}


/**
 * Utility function for sorting elements in an array according their height and abscissa (numbers), before being processed to be
 * displayed.
 * @param a {Object} Javascript object with item property set as string, x and height properties set as numbers.
 * @param b {Object} Javascript object with item property set as string, x and height properties set as numbers.
 * @returns {Number} If less than 0, a will have a lower index than b in the sorting array, if greater,
 * b will have a lower index than a in the sorting array.
 */


function sortValues(a, b) {

  if (a.x - b.x != 0) {
    return a.x - b.x;
  }
  if (a.item == " Remainder " || a.item == "OTHERS") {
    return 1;
  }
  if (b.item == " Remainder " || b.item == "OTHERS") {
    return -1;
  }
  return a.height - b.height;
}

/**
 * Utility function for sorting elements in an array according their item name (string) and sum (number).
 * @param a {Object} Javascript object with item property set as string, sum property set as number.
 * @param b {Object} Javascript object with item property set as string, sum property set as number.
 * @returns {Number} If less than 0, a will have a lower index than b in the sorting array, if greater,
 * b will have a lower index than a in the sorting array.
 */


function sortArrayVolume(a, b) {

  if (a.item == " Remainder " || a.item == "OTHERS") {
    return -1;
  }
  if (b.item == " Remainder " || b.item == "OTHERS") {
    return 1;
  }
  return b.sum - a.sum;
}


/**
 * Workaround function that gives the returns the Javascript Date corresponding to the df parameter of the urlJson
 *                                                                                                           url string.
 * @param urlJson {String} The url used to resquest the data from the server.
 * @returns {Date} the Javascript Date corresponding to the df parameter of the urlJson url string.
 */

function getDateCurrent(urlJson){

  var urlArray = urlJson.split(/[\?&=]+/);
  var indexdf = urlArray.indexOf("df");
  var dateEndStr = urlArray[indexdf + 1];
  var dEArray = dateEndStr.split(/[-+%:]+/);
  return new Date(+dEArray[0],+dEArray[1] - 1,+dEArray[2],+dEArray[3]);

}

/**
 * Utility function which returns the value of the service parameter inside the urlJson url string.
 * @param urlJson {String} The url used to resquest the data from the server.
 * @returns {String} The value of the service parameter.
 */

function getServiceUrlJson(urlJson){

  var urlArray = urlJson.split(/[\?&=]+/);
  var indexserv = urlArray.indexOf("service");
  var service = urlArray[indexserv + 1];
  return service;

}

/**
 * Utility function which returns the value of the param parameter (string) inside the urlJson url string.
 * @param urlJson {String} The url used to resquest the data from the server.
 * @param param {String} The parameter's name to retrieve its value.
 * @returns {*} If found, a {String} being the value of the param parameter, null if not.
 */

function getParamUrlJson(urlJson,param){

  var urlArray = urlJson.split(/[\?&=]+/);
  var index = urlArray.indexOf(param);
  return index !== -1?urlArray[index + 1]:null;

}

/**
 * Utility function to retrieve the number associated conventionally to each Internet protocol.
 * Generated from the csv file available at http://www.iana.org/assignments/protocol-numbers/protocol-numbers.xhtml
 * @param protocol {String} The protocol field.
 * @returns {Number} The associated number.
 */

function protocolToId(protocol){
  switch(protocol){

    case "HOPOPT" :
      return 0;

    case "ICMP" :
      return 1;

    case "IGMP" :
      return 2;

    case "GGP" :
      return 3;

    case "IPv4" :
      return 4;

    case "ST" :
      return 5;

    case "TCP" :
      return 6;

    case "CBT" :
      return 7;

    case "EGP" :
      return 8;

    case "IGP" :
      return 9;

    case "BBN-RCC-MON" :
      return 10;

    case "NVP-II" :
      return 11;

    case "PUP" :
      return 12;

    case "ARGUS" :
      return 13;

    case "EMCON" :
      return 14;

    case "XNET" :
      return 15;

    case "CHAOS" :
      return 16;

    case "UDP" :
      return 17;

    case "MUX" :
      return 18;

    case "DCN-MEAS" :
      return 19;

    case "HMP" :
      return 20;

    case "PRM" :
      return 21;

    case "XNS-IDP" :
      return 22;

    case "TRUNK-1" :
      return 23;

    case "TRUNK-2" :
      return 24;

    case "LEAF-1" :
      return 25;

    case "LEAF-2" :
      return 26;

    case "RDP" :
      return 27;

    case "IRTP" :
      return 28;

    case "ISO-TP4" :
      return 29;

    case "NETBLT" :
      return 30;

    case "MFE-NSP" :
      return 31;

    case "MERIT-INP" :
      return 32;

    case "DCCP" :
      return 33;

    case "3PC" :
      return 34;

    case "IDPR" :
      return 35;

    case "XTP" :
      return 36;

    case "DDP" :
      return 37;

    case "IDPR-CMTP" :
      return 38;

    case "TP++" :
      return 39;

    case "IL" :
      return 40;

    case "IPv6" :
      return 41;

    case "SDRP" :
      return 42;

    case "IPv6-Route" :
      return 43;

    case "IPv6-Frag" :
      return 44;

    case "IDRP" :
      return 45;

    case "RSVP" :
      return 46;

    case "GRE" :
      return 47;

    case "DSR" :
      return 48;

    case "BNA" :
      return 49;

    case "ESP" :
      return 50;

    case "AH" :
      return 51;

    case "I-NLSP" :
      return 52;

    case "SWIPE" :
      return 53;

    case "NARP" :
      return 54;

    case "MOBILE" :
      return 55;

    case "TLSP" :
      return 56;

    case "SKIP" :
      return 57;

    case "IPv6-ICMP" :
      return 58;

    case "IPv6-NoNxt" :
      return 59;

    case "IPv6-Opts" :
      return 60;

    case "CFTP" :
      return 62;

    case "SAT-EXPAK" :
      return 64;

    case "KRYPTOLAN" :
      return 65;

    case "RVD" :
      return 66;

    case "IPPC" :
      return 67;

    case "SAT-MON" :
      return 69;

    case "VISA" :
      return 70;

    case "IPCV" :
      return 71;

    case "CPNX" :
      return 72;

    case "CPHB" :
      return 73;

    case "WSN" :
      return 74;

    case "PVP" :
      return 75;

    case "BR-SAT-MON" :
      return 76;

    case "SUN-ND" :
      return 77;

    case "WB-MON" :
      return 78;

    case "WB-EXPAK" :
      return 79;

    case "ISO-IP" :
      return 80;

    case "VMTP" :
      return 81;

    case "SECURE-VMTP" :
      return 82;

    case "VINES" :
      return 83;

    case "TTP" :
      return 84;

    case "IPTM" :
      return 84;

    case "NSFNET-IGP" :
      return 85;

    case "DGP" :
      return 86;

    case "TCF" :
      return 87;

    case "EIGRP" :
      return 88;

    case "OSPFIGP" :
      return 89;

    case "Sprite-RPC" :
      return 90;

    case "LARP" :
      return 91;

    case "MTP" :
      return 92;

    case "AX.25" :
      return 93;

    case "IPIP" :
      return 94;

    case "MICP" :
      return 95;

    case "SCC-SP" :
      return 96;

    case "ETHERIP" :
      return 97;

    case "ENCAP" :
      return 98;

    case "GMTP" :
      return 100;

    case "IFMP" :
      return 101;

    case "PNNI" :
      return 102;

    case "PIM" :
      return 103;

    case "ARIS" :
      return 104;

    case "SCPS" :
      return 105;

    case "QNX" :
      return 106;

    case "A/N" :
      return 107;

    case "IPComp" :
      return 108;

    case "SNP" :
      return 109;

    case "Compaq-Peer" :
      return 110;

    case "IPX-in-IP" :
      return 111;

    case "VRRP" :
      return 112;

    case "PGM" :
      return 113;

    case "L2TP" :
      return 115;

    case "DDX" :
      return 116;

    case "IATP" :
      return 117;

    case "STP" :
      return 118;

    case "SRP" :
      return 119;

    case "UTI" :
      return 120;

    case "SMP" :
      return 121;

    case "SM" :
      return 122;

    case "PTP" :
      return 123;

    case "ISIS " :
      return 124;

    case "FIRE" :
      return 125;

    case "CRTP" :
      return 126;

    case "CRUDP" :
      return 127;

    case "SSCOPMCE" :
      return 128;

    case "IPLT" :
      return 129;

    case "SPS" :
      return 130;

    case "PIPE" :
      return 131;

    case "SCTP" :
      return 132;

    case "FC" :
      return 133;

    case "RSVP-E2E-IGNORE" :
      return 134;

    case "Mobility Header" :
      return 135;

    case "UDPLite" :
      return 136;

    case "MPLS-in-IP" :
      return 137;

    case "manet" :
      return 138;

    case "HIP" :
      return 139;

    case "Shim6" :
      return 140;

    case "WESP" :
      return 141;

    case "ROHC" :
      return 142;

    case "Reserved" :
      return 255;

  }
}


/**

 * Utility function to retrieve the Internet protocol associated conventionally to a specific id.
 * Generated from the csv file available at http://www.iana.org/assignments/protocol-numbers/protocol-numbers.xhtml
 * @param id {Number} The protocol id.
 * @returns {String} The corresponding protocol.
 */
function idToProtocol(id){
  switch(id) {
    case 0 :
      return "HOPOPT";

    case 1 :
      return "ICMP";

    case 2 :
      return "IGMP";

    case 3 :
      return "GGP";

    case 4 :
      return "IPv4";

    case 5 :
      return "ST";

    case 6 :
      return "TCP";

    case 7 :
      return "CBT";

    case 8 :
      return "EGP";

    case 9 :
      return "IGP";

    case 10 :
      return "BBN-RCC-MON";

    case 11 :
      return "NVP-II";

    case 12 :
      return "PUP";

    case 13 :
      return "ARGUS";

    case 14 :
      return "EMCON";

    case 15 :
      return "XNET";

    case 16 :
      return "CHAOS";

    case 17 :
      return "UDP";

    case 18 :
      return "MUX";

    case 19 :
      return "DCN-MEAS";

    case 20 :
      return "HMP";

    case 21 :
      return "PRM";

    case 22 :
      return "XNS-IDP";

    case 23 :
      return "TRUNK-1";

    case 24 :
      return "TRUNK-2";

    case 25 :
      return "LEAF-1";

    case 26 :
      return "LEAF-2";

    case 27 :
      return "RDP";

    case 28 :
      return "IRTP";

    case 29 :
      return "ISO-TP4";

    case 30 :
      return "NETBLT";

    case 31 :
      return "MFE-NSP";

    case 32 :
      return "MERIT-INP";

    case 33 :
      return "DCCP";

    case 34 :
      return "3PC";

    case 35 :
      return "IDPR";

    case 36 :
      return "XTP";

    case 37 :
      return "DDP";

    case 38 :
      return "IDPR-CMTP";

    case 39 :
      return "TP++";

    case 40 :
      return "IL";

    case 41 :
      return "IPv6";

    case 42 :
      return "SDRP";

    case 43 :
      return "IPv6-Route";

    case 44 :
      return "IPv6-Frag";

    case 45 :
      return "IDRP";

    case 46 :
      return "RSVP";

    case 47 :
      return "GRE";

    case 48 :
      return "DSR";

    case 49 :
      return "BNA";

    case 50 :
      return "ESP";

    case 51 :
      return "AH";

    case 52 :
      return "I-NLSP";

    case 53 :
      return "SWIPE";

    case 54 :
      return "NARP";

    case 55 :
      return "MOBILE";

    case 56 :
      return "TLSP";

    case 57 :
      return "SKIP";

    case 58 :
      return "IPv6-ICMP";

    case 59 :
      return "IPv6-NoNxt";

    case 60 :
      return "IPv6-Opts";
    
    case 62 :
      return "CFTP";

    case 64 :
      return "SAT-EXPAK";

    case 65 :
      return "KRYPTOLAN";

    case 66 :
      return "RVD";

    case 67 :
      return "IPPC";


    case 69 :
      return "SAT-MON";

    case 70 :
      return "VISA";

    case 71 :
      return "IPCV";

    case 72 :
      return "CPNX";

    case 73 :
      return "CPHB";

    case 74 :
      return "WSN";

    case 75 :
      return "PVP";

    case 76 :
      return "BR-SAT-MON";

    case 77 :
      return "SUN-ND";

    case 78 :
      return "WB-MON";

    case 79 :
      return "WB-EXPAK";

    case 80 :
      return "ISO-IP";

    case 81 :
      return "VMTP";

    case 82 :
      return "SECURE-VMTP";

    case 83 :
      return "VINES";

    case 84 :
      return "TTP/IPTM";

    case 85 :
      return "NSFNET-IGP";

    case 86 :
      return "DGP";

    case 87 :
      return "TCF";

    case 88 :
      return "EIGRP";

    case 89 :
      return "OSPFIGP";

    case 90 :
      return "Sprite-RPC";

    case 91 :
      return "LARP";

    case 92 :
      return "MTP";

    case 93 :
      return "AX.25";

    case 94 :
      return "IPIP";

    case 95 :
      return "MICP (deprecated)";

    case 96 :
      return "SCC-SP";

    case 97 :
      return "ETHERIP";

    case 98 :
      return "ENCAP";

    case 100 :
      return "GMTP";

    case 101 :
      return "IFMP";

    case 102 :
      return "PNNI";

    case 103 :
      return "PIM";

    case 104 :
      return "ARIS";

    case 105 :
      return "SCPS";

    case 106 :
      return "QNX";

    case 107 :
      return "A/N";

    case 108 :
      return "IPComp";

    case 109 :
      return "SNP";

    case 110 :
      return "Compaq-Peer";

    case 111 :
      return "IPX-in-IP";

    case 112 :
      return "VRRP";

    case 113 :
      return "PGM";

    case 114 :
      return "";

    case 115 :
      return "L2TP";

    case 116 :
      return "DDX";

    case 117 :
      return "IATP";

    case 118 :
      return "STP";

    case 119 :
      return "SRP";

    case 120 :
      return "UTI";

    case 121 :
      return "SMP";

    case 122 :
      return "SM (deprecated)";

    case 123 :
      return "PTP";

    case 124 :
      return "ISIS over IPv4";

    case 125 :
      return "FIRE";

    case 126 :
      return "CRTP";

    case 127 :
      return "CRUDP";

    case 128 :
      return "SSCOPMCE";

    case 129 :
      return "IPLT";

    case 130 :
      return "SPS";

    case 131 :
      return "PIPE";

    case 132 :
      return "SCTP";

    case 133 :
      return "FC";

    case 134 :
      return "RSVP-E2E-IGNORE";

    case 135 :
      return "Mobility Header";

    case 136 :
      return "UDPLite";

    case 137 :
      return "MPLS-in-IP";

    case 138 :
      return "manet";

    case 139 :
      return "HIP";

    case 140 :
      return "Shim6";

    case 141 :
      return "WESP";

    case 142 :
      return "ROHC";

    case 255 :
      return "Reserved";

    default:
      return "";

  }
}

/**
 * Ready the div before graph creation
 * @param div {Object} D3 selection of the div.
 * @param svg {Object} D3 selection of the parent svg.
 */

function cleanDiv(div, svg){

  var svgNode = svg.node();


  if(div.size() === 0){
    return;
  }
  var divNode = div.node();
  var divChild = divNode.firstChild;

  while(divChild){

    divNode.removeChild(divChild);
    divChild = divNode.firstChild;

  }
  divNode.appendChild(svgNode);

  var svgChild = svgNode.firstChild;

  while(svgChild){

    svgNode.removeChild(svgChild);
    svgChild = svgNode.firstChild;

  }

}