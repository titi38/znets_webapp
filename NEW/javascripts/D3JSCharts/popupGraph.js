





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

  switch(svg.typeGraph){

    case "netProtocoleTraffic":

      var endStr = "HostsProtoTraffic.json" + "?"
        + ( ( moment(getDateFromAbscissa(svg, clickData.x)).format("YYYY-MM-DD+HH:mm") ) ? "&dd="+moment(getDateFromAbscissa(svg, clickData.x - 1)).format("YYYY-MM-DD+HH:mm") : "" )
        + ( ( moment(getDateFromAbscissa(svg, clickData.x + 1)).format("YYYY-MM-DD+HH:mm") ) ? "&df="+moment(getDateFromAbscissa(svg, clickData.x)).format("YYYY-MM-DD+HH:mm") : "" )
        + ( ( $("#preset_ChartsForm").val() ) ? "&pset="+$("#preset_ChartsForm").val() : "" )
        + ( ( svg.attr("data-network") && svg.attr("data-network") != "Global" ) ? "&net="+svg.attr("data-network") : "" )
        + ( ( clickData.item ) ? "&proto="+ clickData.item.toLowerCase() : "" )
        + ( ( clickData.direction.toLowerCase() ) ? "&type="+clickData.direction.toLowerCase() : "" )
        + "&dh=" + svg.hourShift/3600000;

      return [proxyPass + "netLoc"  + endStr,
        proxyPass + "netExt"  + endStr ];



  }


}


/***********************************************************************************************************/

function addPopup(selection, div, svg , onCreationFunct, onSupprFunct) {


  svg.pieside = 0.75 * Math.min(svg.height, svg.width);
  div.overlay = div.append("div").classed("overlay", true).style("display", "none").style("width", (svg.width + svg.margin.left + svg.margin.right) + "px");
  svg.popup = div.append("div").classed("popup", true).style("display", "none");

  svg.popup.title = svg.popup.append("h3").classed("popupTitle",true);
  svg.popup.button = svg.popup.append("button").classed("buttonPopup", true);


  svg.popup.pieChart = null;
  svg.timer = null;


  selection
    .on("click", function (d) {

      clearTimeout(svg.timer);
      svg.timer = setTimeout(function () {
        div.overlay.style("display", null);
        onCreationFunct(d);
        svg.popup.pieChart = svg.popup.append("svg").attr("width", svg.pieside).attr("height", svg.pieside).classed("pieSvg", true);

        var arrayUrl = getPieJsonQuery(svg,d);
        console.log(arrayUrl);

        createPopup(arrayUrl[0],arrayUrl[1], svg, svg.pieside, d,div.overlay);

        //createPopup("/dynamic/netLocHostsTopCountryTraffic.json?dd=2016-08-04+15:00&df=2016-08-04+16:00&pset=HOURLY&type=out&c=FR&dh=2",
        //  "/dynamic/netExtHostsTopCountryTraffic.json?dd=2016-08-04+15:00&df=2016-08-04+16:00&pset=HOURLY&type=out&c=FR&dh=2", svg, svg.pieside, d,div.overlay);
        //drawComplData(getPieJsonQuery(svg, d), svg, svg.pieside, d,div.overlay);

      }, 500);

    });

  div.overlay.on("click", function () {

    //popup suppression
    svg.popup.on("mouseover", null);
    div.overlay.on("mouseover", null);
    svg.d3queue.abort();

    div.overlay.style("display", "none");
    svg.popup.style("display", "none");

    if(svg.popup.pieChart.divTable) {
      svg.popup.pieChart.divTable.remove();
    }

    svg.popup.pieChart.remove();
    svg.popup.pieChart = null;
    svg.popup.extPieChart = null;
    svg.popup.locPieChart = null;

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


function redrawPopup(overlay, svg){

  overlay.style("width",(svg.width+svg.margin.left + svg.margin.right) + "px");
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

function createPopup(urlJsonLoc,urlJsonExt,svg,pieside,dataInit,overlay){

  svg.d3queue = d3.queue();
  svg.d3queue
    .defer(d3.json,urlJsonLoc)
    .defer(d3.json,urlJsonExt)
    .await(function(error, jsonLoc, jsonExt){

      if(error && error.message === "abort"){
        return;
      }
      drawComplData(error, jsonLoc,jsonExt,svg,pieside,dataInit,overlay);
    });

}

/************************************************************************************************************/


function drawComplData(error, jsonLoc, jsonExt, svg, pieside, dataInit, overlay){

  var chartside = 0.75*pieside;
  var f = colorEval(170);

  //Title
  svg.popup.title.text(popupTitleH(dataInit,svg));

  //Some values relative to the popup dimensions
  svg.popup.innerRad = 0;
  svg.popup.outerRad = chartside/2;
  svg.popup.dist = svg.popup.outerRad * 0.8;
  svg.popup.distTranslTemp = svg.popup.outerRad/4;
  svg.popup.distTransl = svg.popup.outerRad/10;


  var total = dataInit.height;

  if(error){
    console.warn(error);
    return;
  }

  drawPopupGraph(jsonLoc, svg, total, pieside, f);

  svg.popup.pieChart.divTable.remove();
  svg.popup.locPieChart = svg.popup.pieChart.remove();

  svg.popup.pieChart = svg.popup.append("svg").attr("width", svg.pieside).attr("height", svg.pieside).classed("pieSvg", true);
  f = colorEval(70);

  drawPopupGraph(jsonExt, svg, total, pieside, f);

  svg.popup.button.text("ext");

  svg.popup.extPieChart = svg.popup.pieChart;

  var statesArray = ["ext","loc"];

  var actualStateIndex = 0;
  var currentState;
  var popupNode = svg.popup.node();

  svg.popup.button.on("click", function(){

    actualStateIndex = (actualStateIndex + 1)%2;
    currentState = statesArray[actualStateIndex];
    svg.popup.button.text(currentState);


    svg.popup.pieChart.divTable.remove();
    svg.popup.pieChart.remove();

    svg.popup.pieChart = svg.popup[currentState + "PieChart"];

    popupNode.appendChild(svg.popup.pieChart.node());
    popupNode.appendChild(svg.popup.pieChart.divTable.node());

    redrawPopup(overlay, svg);
    positionPopup(svg);

  });



  //Hover listener on the pie chart svg.
  svg.popup
    .on("mouseover", mouseoverFunction);

  //Hover listener on the table.
  overlay
    .on("mouseover", mouseoverFunction);


  function mouseoverFunction(){

    var target = d3.event.target;
    var path;
    var text;
    var d;
    var onTable = false;

    //item of the element being hovered currently
    var item;
    //detection of the element being hovered
    switch (target.tagName){
      //if path or text, variables are being instantiated accordingly.
      case "path":
        path = d3.select(target);
        d = path.datum();
        item = d.item;
        text = svg.popup.pieChart.textSelec.filter(function(data){return data.item === item;});
        break;

      case "text":
        text = d3.select(target);
        d = text.datum();
        item = d.item;
        path = svg.popup.pieChart.pathSelec.filter(function(data){return data.item === item;});
        break;

      case "TD":
      case "DIV":
        d = d3.select(target).datum();
        if(!d){
          item = null;
          break;
        }
        onTable = true;
        item = d.item;
        text = svg.popup.pieChart.textSelec.filter(function(data){return data.item === item;});
        path = svg.popup.pieChart.pathSelec.filter(function(data){return data.item === item;});
        break;

      //if anything else, no pie element is hovered.
      default:
        item = null;
        break;
    }

    //activeItem records the last element hovered (before this one)

    //if the cursor is hovering between text and path of the same data (or comes and goes on the svg), nothing
    //should be done.
    if(svg.popup.pieChart.activeItem === item){
      return;
    }

    //From here, the last hovered element and the current have different items (one of them can be null)

    //if the last hovered element wasn't the svg (the "background"), the corresponding path and text should
    //be translated to their initial position.
    if(svg.popup.pieChart.activeItem !== null){
      var textOut, pathOut;
      textOut = svg.popup.pieChart.textSelec.filter(function(data){return data.item === svg.popup.pieChart.activeItem;});
      pathOut = svg.popup.pieChart.pathSelec.filter(function(data){return data.item === svg.popup.pieChart.activeItem;});

      var dOut = textOut.datum();
      var midAngleOut = (dOut.endAngle + dOut.startAngle)/2;

      var transitionOut = pathOut.transition().attr("transform", "translate(0,0)");
      textOut.transition(transitionOut).attr("transform", "translate(" + (Math.sin(midAngleOut)*svg.popup.dist) + "," +(-Math.cos(midAngleOut)*svg.popup.dist) +")");

      svg.popup.pieChart.trSelec.filter(function(d){return d.item === svg.popup.pieChart.activeItem}).classed("outlined",false);
    }

    //the activeItem variable has no further use here, it can be updated with the current item.
    svg.popup.pieChart.activeItem = item;

    //if the current hovered element is the svg, end of the event.
    if(item === null){
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
    var elem = svg.popup.pieChart.trSelec.filter(function(d){return d.item === svg.popup.pieChart.activeItem;}).classed("outlined",true);

    //no transition if the cursor is on the table
    if(onTable){
      return;
    }


    scrollToElementTableTransition(elem,svg.popup.pieChart.table)

  }


  //display and positioning
  svg.popup.style("display", null);

  positionPopup(svg);

}


/*********************************************************************************************************************************************/

function drawPopupGraph(json, svg, total, pieside,f){

  if(testJson(json)){
    console.warn("no data");
  }

  json = json.response;

  var jsonData = json.data;
  var jsonContent = json.content;

  var jsonAmountValue = searchAmountValue(jsonContent);
  var jsonItemValue = searchItemValue(jsonContent);
  var jsonDisplayValue = searchDisplayValue(jsonContent);
  var jsonAddArrayValues = searchAdditionalValues(jsonContent);

  if(jsonAmountValue === false){
    console.warn("no amount value");
  }

  if(jsonItemValue === false){
    console.warn("no item value");
  }

  if(jsonDisplayValue === false){
    console.log("no display value");
    jsonDisplayValue = jsonItemValue;
  }

  var values = [];

  jsonData.forEach(function(elem){

    values.push({
      item: elem[jsonItemValue],
      y: elem[jsonAmountValue],
      display:elem[jsonDisplayValue],
      amount: bytesConvert(elem[jsonAmountValue]),
      add: jsonAddArrayValues.map(function(indexAdd){return elem[indexAdd];})
    });

  });


  console.log(values);

  //data are prepared

  var sum = d3.sum(values,function(e){
    return e.y;
  });


  //We attribute a color to each
  var mapColors = new Map();
  var length = values.length;


  for(var w = 0; w < length; w++){

    mapColors.set(values[w].item,f());

  }

  values.sort(function(a,b){
    return b.y - a.y;
  });

  values.unshift({y: total -sum, item:" Remainder ",amount:bytesConvert(total-sum), display:" Remainder ", add: []});

  /*total = d3.sum(values,function(e){return e.y});
  console.log(total);
*/
  mapColors.set(" Remainder ","#f2f2f2");


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
  svg.popup.pieChart.pathSelec = svg.popup.pieChart.g.selectAll("path").data(values).enter().append("path")
    .attr("d","")
    .style("fill",function(d){ return mapColors.get(d.item); });
  svg.popup.pieChart.pathSelec.append("svg:title").text(titleElemPopup);

  //text elements, the arcs' legends
  svg.popup.pieChart.textSelec = svg.popup.pieChart.g.selectAll("text").data(values).enter().append("text")
    .attr("transform",function(d){
      var midAngle = (d.endAngle + d.startAngle)/2;
      return "translate(" + (Math.sin(midAngle)*svg.popup.dist) + "," +(-Math.cos(midAngle)*svg.popup.dist) +")";})
    .text(function(d){ return d.amount;});


  //transition on paths for fanciness
  svg.popup.pieChart.pathSelec.transition("creation").ease(easeFct(3)).duration(800).attrTween("d",interpolateArc);


  //Table
  svg.popup.pieChart.divTable = svg.popup.append("div").classed("popupTableDiv", true);
  svg.popup.pieChart.table = svg.popup.pieChart.divTable.append("table").classed("popupTableLegend",true)
    .style("max-height",svg.pieside + "px");


  values.sort(sortAlphabet);

  svg.popup.pieChart.trSelec = svg.popup.pieChart.table.selectAll("tr").data(values)
    .enter().append("tr").attr("title",titleTablePopup);

  svg.popup.pieChart.trSelec.append("td").append("div").classed("lgd", true).style("background-color", function (d) {
    return mapColors.get(d.item);
  });
  svg.popup.pieChart.trSelec.append("td").text(function(d){return d.display;});




  //name of the current element being hovered, at first none then null.
  svg.popup.pieChart.activeItem = null;

  console.log(sum + " " + total);

  return total;

}

/*********************************************************************************************************************************************/


function titleElemPopup(d){

  var str = d.display + "\n" + (d.display !== d.item? d.item + "\n":"");

  d.add.forEach(function(val){
    str = str + val + "\n";
  });

  return str +  d.amount;

}

/**********************************************************************************************************************/

function titleTablePopup(d){

  var str = d.display + "\n" + (d.display !== d.item? d.item + "\n":"");

  d.add.forEach(function(val){
    str = str + val + "\n";
  });

  str = str + "Volume: " + d.amount;

  return str;


}

/**********************************************************************************************************************/

function popupTitleH(d, svg){

  var dateBegin = getDateFromAbscissa(svg, d.x - 1);
  var dateEnd = getDateFromAbscissa(svg,d.x);

  return (d.display?d.display:d.item) + ": the " + (dateBegin.getMonth() + 1) + "/" + dateBegin.getDate() +  " from "
    + dateBegin.getHours() + "h to " + dateEnd.getHours() + "h";
}












































