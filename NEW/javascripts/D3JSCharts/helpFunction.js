

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
      for (var i=1; i<selecsize;i++){
        if(i%nb !=0){
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

    var itemArray = ["code","host","localhostip","appid","portproto","asnum"];

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

  var amountArray = ["amount","nbhosts", "nblocalhosts","nbexternhosts"];
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
    infMetric = "i";

  }else {

    base = 1000;
    infMetric = "";

  }

  var rawExp = Math.log(qty)/Math.log(base);
  var absExp = Math.abs(Math.floor(rawExp));
  var exp = Math.min(8,Math.max(0,absExp));

  if(rawExp < 0){
    exp = -exp;
  }

  var pow = Math.pow(base,-exp);

  switch (exp){

    case -8:
      return ["y" + infMetric,pow];
    case -7:
      return ["z" + infMetric,pow];
    case -6:
      return ["a" + infMetric,pow];
    case -5:
      return ["f" + infMetric,pow];
    case -4:
      return ["p" + infMetric,pow];
    case -3:
      return ["n" + infMetric,pow];
    case -2:
      return ["µ" + infMetric,pow];
    case -1:
      return ["m" + infMetric,pow];
    default:
    case 0:
      return ["",pow];
    case 1 :
      return ["K" + infMetric,pow];
    case 2 :
      return ["M" + infMetric,pow];
    case 3 :
      return ["G" + infMetric,pow];
    case 4 :
      return ["T" + infMetric,pow];
    case 5 :
      return ["P" + infMetric,pow];
    case 6 :
      return ["E" + infMetric,pow];
    case 7 :
      return ["Z" + infMetric,pow];
    case 8 :
      return ["Y" + infMetric,pow];
  }

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
        cAOptionel = quantityConvertUnit(heightPerSec,isBytes);
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






