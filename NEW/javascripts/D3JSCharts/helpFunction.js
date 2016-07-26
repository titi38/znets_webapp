function axisXDoubleDraw(svg){
  svg.axisx.rect.attr("width", svg.width);
  svg.axisx.path.attr("d", "M0.5," + (svg.margin.zero - svg.heightTick) + "V" + (svg.margin.zero - 0.5) + "H" + (svg.width + 0.5)+ "V" + (svg.margin.zero - svg.heightTick));
}

/***********************************************************************************************************/


function drawChartDouble(svg,newHeightOutput,newHOmarg){



  var dataWidth = 0.75*(svg.newX(svg.newX.domain()[0] + 1) - svg.newX.range()[0]);



  var adjust;

  svg.chartInput.selectAll(".data").each(function(d){
    adjust = (d.y===0&&d.height !==0)?0.5:0;

    this.setAttribute("x",svg.newX(d.x - 0.375));
    this.setAttribute("y", svg.newYInput(d.y) - adjust);
    this.setAttribute("height",svg.newYInput(d.height) - newHOmarg + adjust);
    this.setAttribute("width",dataWidth);

  });



  svg.chartOutput.selectAll(".data")
    .attr("x",function(d){return svg.newX(d.x - 0.375);})
    .attr("y", function(d){return svg.newYOutput(d.y);})
    .attr("height", function(d){return newHeightOutput - svg.newYOutput(d.height) + ((d.y===d.height&&d.height !==0)?0.5:0);})
    .attr("width", dataWidth);
  
}

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


/***********************************************************************************************************/

function ticksSecondAxisXDouble(svg){

  svg.axisx.selectAll(".tick").filter(function(){return !d3.select(this).classed("addedLine");}).classed("addedLine",true).append("line")
    .attr("x1",0.5)
    .attr("y1",svg.margin.zero - svg.heightTick)
    .attr("x2",0.5)
    .attr("y2",svg.margin.zero);

}


/***********************************************************************************************************/



function getPieJsonQuery(svg, clickData) {

  /*
  console.error(moment(getDateFromAbscissa(svg, clickData.x)).format("YYYY-MM-DD HH:mm"));// &dd=
  console.error(moment(getDateFromAbscissa(svg, clickData.x+1)).format("YYYY-MM-DD HH:mm"));// &df=
  console.error($("#preset_ChartsForm").val());// &pset=
  console.error(svg.attr("data-network")); // &net=
  console.error(clickData.item);//&ip=
  console.error(clickData.direction.toLowerCase());//&type=
   */

  //?

  return proxyPass + ( ( svg.attr("data-pie-json") ) ? svg.attr("data-pie-json")+"?" : "" )
      +( ( moment(getDateFromAbscissa(svg, clickData.x)).format("YYYY-MM-DD+HH:mm") ) ? "&dd="+moment(getDateFromAbscissa(svg, clickData.x - 1)).format("YYYY-MM-DD+HH:mm") : "" )
      + ( ( moment(getDateFromAbscissa(svg, clickData.x + 1)).format("YYYY-MM-DD+HH:mm") ) ? "&df="+moment(getDateFromAbscissa(svg, clickData.x)).format("YYYY-MM-DD+HH:mm") : "" )
      + ( ( $("#preset_ChartsForm").val() ) ? "&pset="+$("#preset_ChartsForm").val() : "" )
      + ( ( svg.attr("data-network") && svg.attr("data-network") != "Global" ) ? "&net="+svg.attr("data-network") : "" )
      + ( ( clickData.item ) ? "&ip="+clickData.item : "" )
      + ( ( clickData.direction.toLowerCase() ) ? "&type="+clickData.direction.toLowerCase() : "" ) ;
}


/***********************************************************************************************************/

function addPopup(selection, div, svg , onCreationFunct, onSupprFunct) {


  svg.pieside = 0.75 * Math.min(svg.height, svg.width);
  div.overlay = div.append("div").classed("overlay", true).style("display", "none").style("width", (svg.width + svg.margin.left + svg.margin.right) + "px");
  svg.popup = div.append("div").classed("popup", true).style("display", "none");

  svg.popup.title = svg.popup.append("h3").classed("popupTitle",true);


  svg.popup.pieChart = null;
  svg.timer = null;


  selection
    .on("click", function (d) {

      console.log(getPieJsonQuery(svg, d));

      clearTimeout(svg.timer);
      svg.timer = setTimeout(function () {
        div.overlay.style("display", null);
        onCreationFunct(d);
        svg.popup.pieChart = svg.popup.append("svg").attr("width", svg.pieside).attr("height", svg.pieside).classed("pieSvg", true);
        //drawComplData("/dynamic/netExtHostsTopHostsTraffic.json?dd=2016-07-18%2020:00&df=2016-07-18%2021:00&pset=HOURLY&type=out&ip=193.48.83.251", svg, svg.pieside, d,div.overlay);
        drawComplData(getPieJsonQuery(svg, d), svg, svg.pieside, d,div.overlay);
      }, 500);

    });

  div.overlay.on("click", function () {
    div.overlay.style("display", "none");
    svg.popup.style("display", "none");
    if(svg.popup.pieChart.divTable) {
      svg.popup.pieChart.divTable.remove();
    }
    svg.popup.pieChart.remove();
    svg.popup.pieChart = null;

    onSupprFunct();
  });


}
/***********************************************************************************************************/

function positionPopup(svg){


  svg.popup.style("left", ((svg.width - parseInt(svg.popup.style("width"),10)) / 2 + svg.margin.left) + "px")
    .style("bottom", ((svg.height - parseInt(svg.popup.style("height"),10)) / 2 + svg.margin.bottom) + "px");

  svg.popup.pieChart.divTable.style("margin-top",(svg.pieside - svg.popup.pieChart.divTable.node().offsetHeight)/2 + "px");


}

/***********************************************************************************************************/


function redrawPopup(div, svg){

  div.overlay.style("width",(svg.width+svg.margin.left + svg.margin.right) + "px");
  svg.pieside = 0.75*Math.min(svg.height,svg.width);


  if(svg.popup.pieChart != null){
    svg.popup.pieChart.attr("width", svg.pieside).attr("height", svg.pieside);
    var chartside = 0.75*svg.pieside;
    svg.popup.innerRad = 0;
    svg.popup.outerRad = chartside/2;
    svg.popup.pieChart.g.attr("transform","translate(" + (svg.pieside/2) + "," + (svg.pieside/2) + ")");


    var arc = d3.arc()
      .innerRadius(svg.popup.innerRad)
      .outerRadius(svg.popup.outerRad)
      .startAngle(function(d){return d.startAngle})
      .endAngle(function(d){return d.endAngle});


    svg.popup.pieChart.g.selectAll("path").attr("d",arc);
    svg.popup.pieChart.g.selectAll("text").attr("transform",function(d){
      var midAngle = (d.endAngle + d.startAngle)/2;
      var dist = svg.popup.outerRad * 0.8;
      return "translate(" + (Math.sin(midAngle)*dist) + "," +(-Math.cos(midAngle)*dist) +")";});



    svg.popup.pieChart.table.style("max-height",svg.pieside + "px");


    positionPopup(svg);

    svg.popup.dist = svg.popup.outerRad * 0.8;
    svg.popup.distTranslTemp = svg.popup.outerRad/4;
    svg.popup.distTransl = svg.popup.outerRad/10;



  }
  
}

/************************************************************************************************************/


function drawComplData(urlJson,svg,pieside,dataInit,overlay){

  var chartside = 0.75*pieside;


  //TODO TEMPORAIRE: test, à supprimer lors de l'utilisation avec de véritables valeurs.
  console.log(dataInit);
  total=6000000000;
  //TEMPORAIRE

  //Title
  svg.popup.title.text(dataInit.item);


  //Some values relative to the popup dimensions
  svg.popup.innerRad = 0;
  svg.popup.outerRad = chartside/2;
  svg.popup.dist = svg.popup.outerRad * 0.8;
  svg.popup.distTranslTemp = svg.popup.outerRad/4;
  svg.popup.distTransl = svg.popup.outerRad/10;


  d3.json(urlJson,function(error, json){

    var values = json.data;

    //data are prepared

    var sum = d3.sum(values,function(e){
      return e.y;
    });

    //sorted
    values.sort(function(a,b){
      return a.y -b.y;
    });

    //We attribute a color to each
    var f = colorEval(170);
    var listColors = [];
    var length = values.length;


    for(var w = 0; w < length; w++){

      listColors.push(f())

    }

    values.unshift({y: total -sum, hostname:" Remainder ",amount:bytesConvert(total-sum)});

    listColors.unshift("#f2f2f2");


    //The angles of the pie arcs are evaluated

    function anglesCalc(){
      var posAngle = 0;
      return function(value){
        value.startAngle = posAngle;
        posAngle += 2*Math.PI * value.y / total;
        value.endAngle = posAngle;
      }
    }

    var functAngles = anglesCalc();

    values.forEach(functAngles);

    var arc = d3.arc()
      .innerRadius(svg.popup.innerRad)
      .outerRadius(svg.popup.outerRad);

    //The arc template is readied
    function interpolateArc(d){

      //.toFixed(5) avoid having complete circles at the beginning of the transition,
      //if start and end angles are too close, the precision isn't good enough to order them
      //correctly and d3 can creates a 2PI angle.

      return function(t){
        return (arc
          .innerRadius(svg.popup.innerRad)
          .outerRadius(svg.popup.outerRad)
          .startAngle(d.startAngle)
          .endAngle((d.startAngle + t * (d.endAngle - d.startAngle)).toFixed(5)))();
      }

    }

    //g element parent of path and text components of the pie chart
    svg.popup.pieChart.g = svg.popup.pieChart.append("g")
      .attr("transform","translate(" + (pieside/2) + "," + (pieside/2) + ")")
      .classed("part",true).classed("elemtext",true);

    //path elements, the arcs themselves
    var pathSelec = svg.popup.pieChart.g.selectAll("path").data(values).enter().append("path")
      .attr("d","")
      .style("fill",function(d,i){ return listColors[i]; });
    pathSelec.append("svg:title").text(function(d){
      return  d.hostname + "\n" + d.amount});

    //text elements, the arcs' legends
    var textSelec = svg.popup.pieChart.g.selectAll("text").data(values).enter().append("text")
      .attr("transform",function(d){
        var midAngle = (d.endAngle + d.startAngle)/2;
        return "translate(" + (Math.sin(midAngle)*svg.popup.dist) + "," +(-Math.cos(midAngle)*svg.popup.dist) +")";})
      .text(function(d){ return d.amount;});


    //transition on paths for fanciness
    pathSelec.transition("creation").ease(easeFct(3)).duration(800).attrTween("d",interpolateArc);


    //Table
    svg.popup.pieChart.divTable = svg.popup.append("div").classed("popupTableDiv", true);
    svg.popup.pieChart.table = svg.popup.pieChart.divTable.append("table").classed("popupTableLegend",true)
      .style("max-height",svg.pieside + "px");

    var trSelec = svg.popup.pieChart.table.selectAll("tr").data(values)
      .enter().append("tr").attr("title",function(d){
        return d.hostname + "\nVolume: " + d.amount;
      });

    trSelec.append("td").append("div").classed("lgd", true).style("background-color", function (d,i) {
      return listColors[i];
    });
    trSelec.append("td").text(function(d){return d.hostname;});




    //name of the current element being hovered, at first none then null.
    var activeHostname = null;

    //Hover listener on the pie chart svg.
    svg.popup
      .on("mouseover", mouseoverFunction);

    //Hover listener on the table.
    overlay
      .on("mouseover",mouseoverFunction);


    function mouseoverFunction(){

      var target = d3.event.target;
      var path;
      var text;
      var d;
      var onTable = false;

      //hostname of the element being hovered currently
      var hostname;
      console.log(target.tagName);
      //detection of the element being hovered
      switch (target.tagName){
        //if path or text, variables are being instantiated accordingly.
        case "path":
          path = d3.select(target);
          d = path.datum();
          hostname = d.hostname;
          text = textSelec.filter(function(data){return data.hostname === hostname;});
          break;

        case "text":
          text = d3.select(target);
          d = text.datum();
          hostname = d.hostname;
          path = pathSelec.filter(function(data){return data.hostname === hostname;});
          break;

        case "TD":
        case "DIV":
          d = d3.select(target).datum();
          if(!d){
            hostname = null;
            break;
          }
          onTable = true;
          hostname = d.hostname;
          text = textSelec.filter(function(data){return data.hostname === hostname;});
          path = pathSelec.filter(function(data){return data.hostname === hostname;});
          break;

        //if anything else, no pie element is hovered.
        default:
          hostname = null;
          break;
      }

      //activeHostname records the last element hovered (before this one)

      //if the cursor is hovering between text and path of the same data (or comes and goes on the svg), nothing
      //should be done.
      if(activeHostname === hostname){
        return;
      }

      //From here, the last hovered element and the current have different hostnames (one of them can be null)

      //if the last hovered element wasn't the svg (the "background"), the corresponding path and text should
      //be translated to their initial position.
      if(activeHostname !== null){
        var textOut, pathOut;
        textOut = textSelec.filter(function(data){return data.hostname === activeHostname;});
        pathOut = pathSelec.filter(function(data){return data.hostname === activeHostname;});

        var dOut = textOut.datum();
        var midAngleOut = (dOut.endAngle + dOut.startAngle)/2;

        var transitionOut = pathOut.transition().attr("transform", "translate(0,0)");
        textOut.transition(transitionOut).attr("transform", "translate(" + (Math.sin(midAngleOut)*svg.popup.dist) + "," +(-Math.cos(midAngleOut)*svg.popup.dist) +")");

        trSelec.filter(function(d){return d.hostname === activeHostname}).classed("outlined",false);
      }

      //the activeHostname variable has no further use here, it can be updated with the current hostname.
      activeHostname = hostname;

      //if the current hovered element is the svg, end of the event.
      if(hostname === null){
        return;
      }


      //Finally, the current element hovered and associated path/text can be translated.


      var midAngle = (d.endAngle + d.startAngle)/2;
      var transition = path.transition()
        .attr("transform","translate(" + (Math.sin(midAngle)*svg.popup.distTranslTemp) + "," +(-Math.cos(midAngle)*svg.popup.distTranslTemp) +")" )
        .transition()
        .attr("transform","translate(" + (Math.sin(midAngle)*svg.popup.distTransl) + "," +(-Math.cos(midAngle)*svg.popup.distTransl) +")" );

      text.transition(transition)
        .attr("transform","translate(" + (Math.sin(midAngle)*(svg.popup.distTranslTemp + svg.popup.dist)) + "," +(-Math.cos(midAngle)*(svg.popup.distTranslTemp+svg.popup.dist)) +")" )
        .transition()
        .attr("transform","translate(" + (Math.sin(midAngle)*(svg.popup.distTransl+svg.popup.dist)) + "," +(-Math.cos(midAngle)*(svg.popup.distTransl+svg.popup.dist)) +")" );



      //the corresponding row is outlined
      var elem = trSelec.filter(function(d){return d.hostname === activeHostname;}).classed("outlined",true);

      //no transition if the cursor is on the table
      if(onTable){
        return;
      }

      scrollToElementTableTransition(elem,svg.popup.pieChart.table)

    }


    //display and positioning
    svg.popup.style("display", null);

    positionPopup(svg);

  }); //end json
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

    //TODO demander changer nom ?column? en truc correct, ça va causer des soucis si c'est pas déjà le cas.
    var itemArray = ["code","host","localhostip","appid","portproto","asnum","?column?"];

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
  var absRawExp = Math.abs(rawExp);
  var exp = Math.min(8,Math.max(0,Math.floor(absRawExp)));

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


/************************************************************************************************************



 ************************************************************************************************************/

//after niceticks is better
function axisYLegendDouble(svg){

  var convert = quantityConvertUnit(Math.max(svg.newYInput.domain()[1] - svg.newYInput.domain()[0],
    svg.newYOutput.domain()[1] - svg.newYOutput.domain()[0]));
  var value,text, maxWidth = 0;

  svg.ylabel.text(convert[0] + svg.units);

  function textValue(d){

    value = d*convert[1];
    value = Math.round(value*10000)/10000;
    /*text =*/ d3.select(this).select("text").text(value);
    //console.log(text.style("width"));

    //maxWidth = Math.max(maxWidth,parseInt(text.style("width"),10));
  }

  svg.axisyInput.selectAll(".tick").each(textValue);

  svg.axisyOutput.selectAll(".tick").each(textValue);

  //console.log(maxWidth);
}

/************************************************************************************************************



 ************************************************************************************************************/

//after niceticks is better
function axisYLegendSimple(svg){

  var convert = quantityConvertUnit(svg.newY.domain()[1] - svg.newY.domain()[0]);
  var value,text, maxWidth = 0;

  svg.ylabel.text(convert[0] + svg.units);

  function textValue(d){

    value = d*convert[1];
    value = Math.round(value*10000)/10000;
    /*text =*/ d3.select(this).select("text").text(value);
    //console.log(text.style("width"));

    //maxWidth = Math.max(maxWidth,parseInt(text.style("width"),10));
  }

  svg.axisy.selectAll(".tick").each(textValue);

  //console.log(maxWidth);
}


/************************************************************************************************************/

function unitsStringProcessing(unitsString){
  
  return unitsString.indexOf("nb") === 0 ? unitsString.slice(2) : unitsString;
  
}


/************************************************************************************************************/

function firstLetterUppercase(string){

  return string.charAt(0).toUpperCase() + string.slice(1);

}


/************************************************************************************************************/

function addCirclePosition(svg){




  svg.circlePosition = svg.append("circle").classed("circlePosition",true).remove().attr("r",4);
  svg.hiddenCircle = svg.append("circle").classed("hiddenCircle",true).remove().attr("r",svg.height/2);
  var nodeReference = svg.svg.node();
  svg.hiddenCircle.tooltip = svg.hiddenCircle.append("svg:title");


  svg
    .on("mouseover.circlePosition",function(){

      updateCirclePosition(svg,d3.mouse(nodeReference)[0]);
      svg.chart.node().appendChild(svg.circlePosition.node());
      svg.chart.node().appendChild(svg.hiddenCircle.node());


      svg
        .on("mousemove.circlePosition",function(){
        updateCirclePosition(svg,d3.mouse(nodeReference)[0]);
      })
        .on("mouseover.circlePosition",null);

    });
}

/************************************************************************************************************/

function updateCirclePosition(svg,x){
  if(!x){

    //Various reason. for cosmetic reasons, the circles disappear until they are called again by a mousemove event.
    svg.circlePosition.remove();
    svg.hiddenCircle.remove();
    svg.on("mousemove.append",function(){
      svg.chart.node().appendChild(svg.circlePosition.node());
      svg.chart.node().appendChild(svg.hiddenCircle.node());
      svg.on("mousemove.append",null);
    });

    return;
  }
  var newXDomain;
  var xPosRound;
  newXDomain = svg.newX.domain();
  xPosRound = Math.round(Math.min(newXDomain[1],Math.max(newXDomain[0],svg.newX.invert(x))));

  var cx =  svg.newX(xPosRound);
  var amount = svg.data[xPosRound];
  var cy = svg.newY(amount);

  svg.circlePosition.attr("cx", cx).attr("cy", cy);
  svg.hiddenCircle.attr("cx", cx).attr("cy", cy);
  var date, mn;
  date = getDateFromAbscissa(svg, xPosRound);

  switch(svg.step){
    //minute
    //hourly
    default:
    case 60000:
    case 3600000:
      mn = date.getMinutes();
      mn = (mn < 10)?("0" + mn):mn;
      svg.hiddenCircle.tooltip.text(amount + " " + svg.units + "\n" + (date.getMonth() + 1) + "/" + date.getDate() + ", " + date.getHours() + "h" + mn);
      break;

    //daily
    case 86400000:
      svg.hiddenCircle.tooltip.text(amount + " " + svg.units + "\n" +(date.getMonth() + 1) + "/" + date.getDate());
      break;
  }

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