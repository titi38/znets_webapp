

/***********************************************************************************************************/
//remove some ticks to avoid superimposition, for vertical axis

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


/************************************************************************************************************/

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


/************************************************************************************************************/

function testJson(json){
  return typeof json === "undefined" || json.result != "true" || typeof json.response.data === "undefined" || json.response.data.length === 0;
}

/************************************************************************************************************
 *
 *  Search inside a content array for the "item" value, used as id.
 *
 ***********************************************************************************************************/

function searchItemValue(jsonContent){
  
    var length = jsonContent.length;

    var itemArray = ["code","host","localhostip","appid","portproto","asnum","ip", "?column?"];

    for(var i = 0;i < length; i++ ){

        if(itemArray.indexOf(jsonContent[i]) !== -1){

                  return i;

        }
    }

    console.error("no item value found");
    return false;

}

/************************************************************************************************************
 *
 *  Search inside a content array for the date value, used for abscissas
 *
 ***********************************************************************************************************/

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


/************************************************************************************************************
 *
 *  Search inside a content array for the amount value, used for ordinates
 *
 ***********************************************************************************************************/

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

/************************************************************************************************************
 *
 *  Search inside a content array for the direction value
 *
 ***********************************************************************************************************/

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

/************************************************************************************************************
 *
 *  Search inside a content array for a
 *  possible, non mandatory display value (replaced by item value later if no display value found)
 *
 ***********************************************************************************************************/

function searchDisplayValue(jsonContent){

  var length = jsonContent.length;

  var displayArray = ["hostname", "name","descr","fullname"];

  for(var i = 0;i < length; i++ ){

    if(displayArray.indexOf(jsonContent[i]) !== -1){

      return i;

    }
  }

  console.log("no display value found");
  return false;

}


/************************************************************************************************************
 *
 *  Search inside a content array for other values of interest. 
 *
 ***********************************************************************************************************/

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


/************************************************************************************************************
 *
 *  return a date javascript object from "x" abscissa value
 *
 ***********************************************************************************************************/

function getDateFromAbscissa(svg,x){

  return new Date(x*svg.step + svg.timeMin);

}


/************************************************************************************************************

 convert quantity unit to nicer quantity unit for a specific quantity.

 return the computed metric prefix and according factor in a array.

 ************************************************************************************************************/

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


/************************************************************************************************************/

function unitsStringProcessing(unitsString){
  
  return unitsString.indexOf("nb") === 0 ? unitsString.slice(2) : unitsString;
  
}



/************************************************************************************************************/

function getTimeShift(url){
  url = url.split(/[?&=]+/);
  var index = url.indexOf("dh");
  if(index === -1){
    return 0;
  }
  return +(url[index + 1]);

}


/************************************************************************************************************/

function createTooltipHisto(svg, selection, sumMap){

  var isBytes = svg.units === "Bytes",coef = 8000/svg.step;

  var convertArray, valDisplay;

  if(isBytes){

    var heightPerSec, cAOptionel;

    selection.append("svg:title")
      .text(function (d) {
        heightPerSec = d.height * coef;
        convertArray = quantityConvertUnit(d.height,isBytes);
        cAOptionel = quantityConvertUnit(heightPerSec,false);
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


/************************************************************************************************************/

function tableLegendTitle(svg,trSelec){

  var cA, isBytes = svg.units === "Bytes";

  trSelec.attr("title", function (d) {

    cA = quantityConvertUnit(d.sum,isBytes);
    return ((d.item === d.display)?"":(d.display + "\n")) + d.item + "\n"
      + "Overall volume: " + ((Math.round(100 * d.sum * cA[1])/100) + " " + cA[0] + svg.units) + "\n"
      + "(" +  d.sum + " " + svg.units + ")";
  });

}

/************************************************************************************************************/

function trueModulo(n,d){
  return ((n%d) +d)%d;
}

/************************************************************************************************************/



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




/************************************************************************************************************

 convert bytes to NiB string

 ************************************************************************************************************/

function bytesConvert(nbBytes){

  var exp = Math.min(8,Math.max(0,Math.floor(Math.log(nbBytes)/Math.log(1024))));

  var value = Math.round(nbBytes*Math.pow(1024,-exp) * 100)/100;


  switch (exp){

    default:
    case 0:
      return value + " B";
    case 1 :
      return value + " KiB";
    case 2 :
      return value + " MiB";
    case 3 :
      return value + " GiB";
    case 4 :
      return value + " TiB";
    case 5 :
      return value + " PiB";
    case 6 :
      return value + " EiB";
    case 7 :
      return value + " ZiB";
    case 8 :
      return value + " YiB";
  }

}


/************************************************************************************************************

 Return a function that should give a new color each, two successive colors should be different enough.


 ************************************************************************************************************/

/*

 function colorEval(){

 var lim = 5;
 var threshold = 360/Math.pow(2,lim);

 var val = 0;
 var extent = 360;
 var color;

 var j = -1;
 var ylim = 5;
 var ystart = ylim, zstart = 3;
 var ythresh = ystart;
 var y = ystart;
 var z = zstart;

 var start = 0.4;
 var segm = (0.8 - start)/6;


 var s = start + segm*y;
 var l = start + segm*z;


 return function(){

 color = d3.hsl(val,s,l);
 val = val + j*180 + extent * (1+j)/2;
 j = -1 * j;


 y = (y+4)%7;
 if(y==ythresh){
 y++;
 ythresh++;
 }
 z = (z+4)%7;
 s = y*segm +start;
 l= z*segm+start;


 if(val >= 360){

 extent = extent/2;

 if(extent <= threshold){
 val = 0;
 extent = 360;
 ystart = (ystart+4)%7;
 if(ystart==ylim){
 ylim++;
 ystart++;
 }
 zstart = (zstart+4)%7;
 y=ystart;
 z=zstart;
 ythresh = ystart;
 s = start + segm*y;
 l = start + segm*z;
 }else{
 val = extent/2 + 180;
 }
 }

 return color;
 }
 }

 */
/************************************************************************************************************/




function colorEval(firstValue){



  var calcexpmin;
  var added;
  var idecal;
  var val = typeof firstValue !== "undefined" ? firstValue%360 : 0;
  var exp;
  var i = 0;


  var color;


  //non homogeneous repartition circle hsl. (optional: to test usefulness maybe sometimes)

  //specify the repartition. should be comprised between 0 & 60/Math.PI (env. 19.09), function not injective if greater.
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

    //console.log("i " + i + "  exp " + exp + " idecal "+ idecal + " calcexpmin " + calcexpmin + " 1/4 " + Math.floor(((i-1)%4)/3));
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


/************************************************************************************************************/

function easeFct(exp){
  var a = Math.pow(2,exp-1);

  return function(t){

    return (t<.5)?a*Math.pow(t,exp):Math.min(1,1-a*Math.pow(1-t,exp));

  }

}





/************************************************************************************************************
 *
 ***********************************************************************************************************/

function updateTransform(selection,transform){

  var zoom = selection._groups[0][0].__zoom;
  zoom.k = transform.k;
  zoom.x = transform.x;
  zoom.y = transform.y;

}


/************************************************************************************************************/

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

/************************************************************************************************************/

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

/************************************************************************************************************/

function mapToArray(array){
  return function (value, key) {
    array.push({item: key, sum: value.sum, display: value.display});
  }

}





/************************************************************************************************************/


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


/************************************************************************************************************/

function getDateCurrent(urlJson){

  var urlArray = urlJson.split(/[\?&=]+/);
  var indexdf = urlArray.indexOf("df");
  var dateEndStr = urlArray[indexdf + 1];
  var dEArray = dateEndStr.split(/[-+%:]+/);
  return new Date(+dEArray[0],+dEArray[1] - 1,+dEArray[2],+dEArray[3]);
  
}

/************************************************************************************************************/

function getServiceUrlJson(urlJson){

  var urlArray = urlJson.split(/[\?&=]+/);
  var indexserv = urlArray.indexOf("service");
  var service = urlArray[indexserv + 1];
  return service;

}

/************************************************************************************************************/

function getParamUrlJson(urlJson,param){

  var urlArray = urlJson.split(/[\?&=]+/);
  var index = urlArray.indexOf(param);
  return index !== -1?urlArray[index + 1]:null;

}

/************************************************************************************************************/

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