

function createChildSvg(div, svg, svgChild, numSvg, divLegend, mydiv){

  var maxHeight = svg.margin.top/2 + svg.margin.zero/4 + svg.heightGraph;

  svgChild.divtable = divLegend.append("div").classed("borderTable diagram",true).style("top", svg.margin.zero/2 +  "px")
    .style("position","relative");
  svgChild.table = svgChild.divtable.append("table").classed("diagram font2 tableLegend", true).style("width", svg.tableWidth + "px")
    .style("max-height", maxHeight + "px");
  

  svgChild.values.forEach(xValues(svg));
  svgChild.values.sort(sortValues);

  var totalSumValues = [];

  var x = svgChild.values[0].x;
  var sum = 0;
  var i = 0;

  while (x < svg.xMax) {

    while (i < svgChild.values.length && svgChild.values[i].x == x) {
      sum += svgChild.values[i].height;
      svgChild.values[i].y = sum;
      i++;
    }
    totalSumValues.push(sum);
    sum = 0;
    x++;
  }


  var total = d3.max(totalSumValues);

  svgChild.x = d3.scaleLinear().range([0,svg.width]).domain([-0.625, svg.xMax - 0.375]);
  svgChild.y = d3.scaleLinear().range([svg.heightGraph,0]).domain([0,total * 1.1]);


  svgChild.chartBackground = svgChild.append("g");
  svgChild.backgroundRect = svgChild.chartBackground.append("rect").attr("y",0).attr("x",0).attr("height",svg.heightGraph)
    .attr("width",svg.width).attr("fill",numSvg === 0?"#fff":"#e6e6e6");

  svgChild.text = svgChild.chartBackground.append("text").classed("bckgr-txt", true)
    .style("fill",numSvg === 0?"#e6e6e6":"#fff")
    .text(numSvg === 0?"Outgoing":"Ingoing");

  svgChild.text.attr("transform", "translate(" + (svg.width / 2) + "," + (svg.heightGraph/8 +
    parseFloat(getComputedStyle(svgChild.text.node()).fontSize)) + ")");


  //Here, the grid, after the text
  svgChild.grid = svgChild.chartBackground.append("g").classed("grid", true);

  svgChild.newX = d3.scaleLinear().range(svgChild.x.range()).domain(svgChild.x.domain());
  svgChild.newY = d3.scaleLinear().range(svgChild.y.range()).domain(svgChild.y.domain());

  svgChild.chart = svgChild.append("g");
  svgChild.selec = svgChild.append("g").append("rect").attr("class", "rectSelec");

  var dataWidth = 0.75*(svgChild.newX(svgChild.newX.domain()[0] + 1) - svgChild.newX.range()[0]);


  var selection = svgChild.chart.selectAll(".data")
    .data(svgChild.values)
    .enter().append("rect")
    .classed("data", true)
    .attr("fill", function (d) {
      return svg.colorMap.get(d.item);
    })
    .attr("stroke", "#000000")
    .attr("x",function(d){return svgChild.newX(d.x - 0.375);})
    .attr("y", function(d){return svgChild.newY(d.y);})
    .attr("height", function(d){return svg.heightGraph - svgChild.newY(d.height);})
    .attr("width", dataWidth);

  var trSelec = svgChild.table.selectAll("tr").data(svgChild.sumArray).enter().append("tr");

  var blink = blinkCreate(svg.colorMap);

  svgChild.activeItem = null;

  function activationElems(d) {
    desactivationElems();

    if (svgChild.popup.pieChart !== null) {
      return;
    }

    svgChild.activeItem = d.item;

    function testitem(data) {
      return d.item == data.item;

    }

    trSelec.filter(testitem).classed("outlined", true);

    selection.filter(testitem).each(blink);

  }

  function activationElemsAutoScroll(d) {
    desactivationElems();

    if (svgChild.popup.pieChart !== null) {
      return;
    }
    svgChild.activeItem = d.item;


    function testitem(data) {
      return d.item == data.item;

    }

    var elem = trSelec.filter(testitem).classed("outlined", true);

    scrollToElementTableTransition(elem,svgChild.table);

    selection.filter(testitem).each(blink);

  }

  function activationElemsAutoScrollPopup(d) {

    desactivationElems();
    svgChild.activeItem = d.item;


    function testitem(data) {
      return d.item == data.item;

    }

    var elem = trSelec.filter(testitem).classed("outlined", true);
    scrollToElementTableTransition(elem,svgChild.table);


  }

  function desactivationElems() {

    if (svgChild.activeItem == null || svgChild.popup.pieChart !== null) {
      return;
    }


    function testitem(data) {
      return data.item == svgChild.activeItem;
    }

    trSelec.filter(testitem).classed("outlined", false);

    selection.filter(testitem).transition().duration(0).attr("stroke", "#000000").attr("fill", svg.colorMap.get(svgChild.activeItem));

    svgChild.activeItem = null;

  }

  selection.on("mouseover", activationElemsAutoScroll).on("mouseout", desactivationElems);

  svgChild.axisx = svg.append("g")
    .attr("class", "axisGraph")
    .attr('transform', 'translate(' + [svg.margin.left, svg.margin.top + svg.heightGraph + numSvg * (svg.heightGraph + svg.margin.zero) - 0.5] + ")");

  svgChild.axisx.call(d3.axisBottom(svgChild.x));

  legendAxisX2Histo(svg, svgChild);

  yAxe2HistoCreation(svg, svgChild, numSvg);

  optionalAxes2HistoCreation(svg,svgChild,numSvg);

  gridHisto2Graph(svg, svgChild);
/*
  addPopup2Histo(selection,div,svg, svgChild, numSvg, function(data){
      desactivationElems();
      activationElemsAutoScrollPopup(data);},
    desactivationElems);
*/


  //Legend creation
  //(not svgChild, ok)

  tableLegendTitle(svg,trSelec);

  trSelec.append("td").append("div").classed("lgd", true).style("background-color", function (d) {
    return svg.colorMap.get(d.item);
  });
  trSelec.append("td").text(function (d) {
    return d.display;
  });
  trSelec.on("mouseover", activationElems).on("mouseout", desactivationElems);

  svgChild.divtable.style("margin-bottom",maxHeight - parseInt(svgChild.table.style("height"),10) + "px");
  

  addZoom2Histo(svg, svgChild, update2HistoStack);

  hideShowValues2Histo(svg,svgChild,trSelec,selection,svg.xMax);

  addPopup2Histo(selection, div, svg , svgChild, numSvg, function(data){
      desactivationElems();
      activationElemsAutoScrollPopup(data);},
    desactivationElems)
  

}




/************************************************************************************************************/



function xValues(svg) {
  return function (elem) {
    elem.x = (elem.x - svg.timeMin) / svg.step
  }
}



/************************************************************************************************************/


function legendAxisX2Histo(svg, svgChild){

  var date,dround;
  //if graph hourly
  if(svg.step === 3600000){

    svgChild.axisx.selectAll(".tick").select("text").text(function (d) {

      dround = Math.round(d);

      //if the ticks isn't at "x" o'clock
      if(Math.abs(dround - d) >= 1e-7){
        this.parentNode.remove();
        return;
      }

      date = getDateFromAbscissa(svg, dround);

      return (date.getMonth() + 1) + "/" + date.getDate() + " " + date.getHours() + "h";

    });

  }else if(svg.step === 60000){
    //graph minute
    var mn;
    svgChild.axisx.selectAll(".tick").select("text").text(function (d) {

      dround = Math.round(d);

      //if the ticks isn't at "x" o'clock
      if(Math.abs(dround - d) >= 1e-7){
        this.parentNode.remove();
        return;
      }

      date = getDateFromAbscissa(svg, dround);
      mn = date.getMinutes();
      mn = (mn < 10)?("0" + mn):mn;

      return (date.getMonth() + 1) + "/" + date.getDate() + " " + date.getHours() + "h" + mn;

    });

  } else {
    //graph daily
    svgChild.axisx.selectAll(".tick").select("text").text(function (d) {

      dround = Math.round(d);

      //if the ticks isn't at "x" o'clock (some javascript weirdness here...)
      if(Math.abs(dround - d) >= 1e-7){
        this.parentNode.remove();
        return;
      }

      date = getDateFromAbscissa(svg, dround);

      return (date.getMonth() + 1) + "/" + date.getDate();

    });

  }

  axisXNiceLegend(svgChild);
}

/************************************************************************************************************/


function yAxe2HistoCreation(svg, svgChild, numSvg){

  var isBytes = svg.units === "Bytes";

  var domain = svgChild.newY.domain();

  var convert = quantityConvertUnit(domain[1] - domain[0], isBytes);


  svgChild.yDisplay = d3.scaleLinear().range(svgChild.newY.range())
    .domain([domain[0]*convert[1],domain[1]*convert[1]]);

  svgChild.axisy = svg.append("g").attr('transform', 'translate('
    + [svg.margin.left, svg.margin.top + numSvg * (svg.heightGraph + svg.margin.zero) - 0.5 ] + ')')
    .attr("class", "axisGraph");

  svgChild.axisy.call(d3.axisLeft(svgChild.yDisplay));

  niceTicks(svgChild.axisy);

  //Label of the y axis
  svgChild.ylabel = svg.append("text")
    .attr("class", "labelGraph")
    .attr("dy", "0.8em")
    .attr('y', 0)
    .attr("x", -svg.margin.top -(svg.heightGraph) / 2 - numSvg  * (svg.margin.zero + svg.heightGraph))
    .attr("transform", "rotate(-90)")
    .text(convert[0] + svg.units);

}

/************************************************************************************************************/


function yAxe2HistoUpdate(svg, svgChild){

  var isBytes = svg.units === "Bytes";

  var domain = svgChild.newY.domain();

  var convert = quantityConvertUnit(domain[1] - domain[0], isBytes);


  svgChild.yDisplay.range(svgChild.newY.range())
    .domain([domain[0]*convert[1],domain[1]*convert[1]]);

  svgChild.axisy.call(d3.axisLeft(svgChild.yDisplay));

  niceTicks(svgChild.axisy);

  //Label of the y axis
  svgChild.ylabel.text(convert[0] + svg.units);

}




/************************************************************************************************************/

function optionalAxes2HistoCreation(svg, svgChild, numSvg){

  var isBytes = svg.units === "Bytes";


  if(isBytes){



    var coef = 8000/svg.step;

    var domain = svgChild.newY.domain();

    domain.forEach(function(elem,i){ domain[i] *= coef;});

    var convert = quantityConvertUnit(Math.max(domain[1] - domain[0]), false);


    svgChild.yRightDisplay = d3.scaleLinear().range(svgChild.newY.range())
      .domain([domain[0]*convert[1],domain[1]*convert[1]]);


    svgChild.axisyRight = svg.append("g")
      .attr('transform', 'translate(' + [svg.margin.left + svg.width, svg.margin.top + numSvg * (svg.margin.zero + svg.heightGraph) - 0.5 ] + ')')
      .attr("class", "axisGraph");

    svgChild.axisyRight.call(d3.axisRight(svgChild.yRightDisplay));

    niceTicks(svgChild.axisyRight);

    svgChild.ylabelRight = svg.append("text")
      .attr("class", "labelGraph")
      .attr("dy", "-0.3em")
      .attr('y', svg.margin.left + svg.width + svg.margin.right)
      .attr("x", - svg.margin.top - svg.heightGraph/2 - numSvg * (svg.margin.zero + svg.heightGraph))
      .attr("transform", "rotate(-90)")
      .text(convert[0] + "bits/s");

  }
}



/************************************************************************************************************/

function optionalAxes2HistoUpdate(svg, svgChild){

  var isBytes = svg.units === "Bytes";


  if(isBytes){

    var coef = 8000/svg.step;

    var domain = svgChild.newY.domain();

    domain.forEach(function(elem,i){ domain[i] *= coef;});

    var convert = quantityConvertUnit(Math.max(domain[1] - domain[0]), false);


    svgChild.yRightDisplay.range(svgChild.newY.range())
      .domain([domain[0]*convert[1],domain[1]*convert[1]]);

    svgChild.axisyRight.call(d3.axisRight(svgChild.yRightDisplay));

    niceTicks(svgChild.axisyRight);

    svgChild.ylabelRight.text(convert[0] + "bits/s");

  }
}


/***********************************************************************************************************/

function gridHisto2Graph(svg,svgChild){


  svgChild.grid.selectAll("line").remove();


  svgChild.axisy.selectAll(".tick").each(function(){
    var transform = this.getAttribute("transform");
    svgChild.grid.append("line")
      .attr("y2",0)
      .attr("y1",0)
      .attr("x2",svg.width)
      .attr("transform",transform);
  });




}

/***********************************************************************************************************/

function addPopup2Histo(selection, div, svg , svgChild, numSvg, onCreationFunct, onSupprFunct) {
//TODO commencer et finir

  svg.pieside = 0.75 * Math.min(svg.heightGraph, svg.width);
  svgChild.overlay = div.append("div")
    .classed("overlay2Histo", true)
    .style("display", "none")
    .style("width", (svg.width + svg.margin.left + svg.margin.right) + "px")
    .style("top",(numSvg ===0?0:svg.margin.top + svg.height/2) + "px");

  svgChild.popup = div.append("div").classed("popup2Histo", true).style("display", "none");


  svgChild.popup.title = svgChild.popup.append("h3").classed("popupTitle",true);


  svgChild.popup.pieChart = null;
  svgChild.timer = null;


  selection
    .on("click", function (d) {

      //console.log(getPieJsonQuery(svg, d));

      clearTimeout(svgChild.timer);
      svgChild.timer = setTimeout(function () {
        svgChild.overlay.style("display", null);
        onCreationFunct(d);
        svgChild.popup.pieChart = svgChild.popup.append("svg").attr("width", svg.pieside).attr("height", svg.pieside).classed("pieSvg", true);
        //drawComplData("/dynamic/netExtHostsTopHostsTraffic.json?dd=2016-07-18%2020:00&df=2016-07-18%2021:00&pset=HOURLY&type=out&ip=193.48.83.251", svg, svg.pieside, d,div.overlay);
        //drawComplData(getPieJsonQuery(svg, d), svg, svg.pieside, d,svgChild.overlay);
      }, 500);

    });

  svgChild.overlay.on("click", function () {
    svgChild.overlay.style("display", "none");
    svgChild.popup.style("display", "none");
    if(svgChild.popup.pieChart.divTable) {
      svgChild.popup.pieChart.divTable.remove();
    }
    svgChild.popup.pieChart.remove();
    svgChild.popup.pieChart = null;

    onSupprFunct();
  });


}




/***********************************************************************************************************/



function update2HistoStack(svg, svgChild){

  /*
   svg.chartOutput.attr("transform","matrix(" + (svg.scalex*svg.scale) + ", 0, 0, " + (svg.scaley*svg.scale) + ", " + svg.translate[0] + "," + svg.translate[1] + ")" );

   svg.chartInput.attr("transform","matrix(" + (svg.scalex*svg.scale) + ", 0, 0, " + (svg.scaley*svg.scale) + ", " + svg.translate[0] + "," + (svg.translate[1] - (svg.scaley*svg.scale-1)*svg.margin.zero) + ")" );
   */


  var newydom0 = svgChild.newY(svgChild.y.domain()[0]);
  var dataWidth = 0.75*(svgChild.newX(svgChild.newX.domain()[0] + 1) - svgChild.newX.range()[0]);


  svgChild.chart.selectAll(".data")
    .attr("x",function(d){return svgChild.newX(d.x - 0.375);})
    .attr("y", function(d){return svgChild.newY(d.y);})
    .attr("height", function(d){return newydom0 - svgChild.newY(d.height);})
    .attr("width", dataWidth);


  svgChild.axisx.call(d3.axisBottom(svgChild.newX));

  legendAxisX2Histo(svg,svgChild);

  yAxe2HistoUpdate(svg,svgChild);
  optionalAxes2HistoUpdate(svg,svgChild);

  gridHisto2Graph(svg, svgChild);

}

/***********************************************************************************************************/

function addZoom2Histo(svg, svgChild, updateFunction){

  if(svgChild.frame == undefined){
    svgChild.frame=svgChild.append("g");
  }



  //to stop triggering animations during rectselec
  var rectOverlay = svgChild.frame.append("rect").attr("x",0).attr("y",0)
    .attr("height",svg.heightGraph).attr("width",0).attr("fill-opacity",0).classed("rectOverlay",true);


  var startCoord = [NaN,NaN];
  var mouseCoord = [NaN,NaN];


  svgChild.scalex = 1;
  svgChild.scaley = 1;




  //coordinates within the x&y ranges frames, points towards the top left corner of the actual view
  //workaround for the zoom.translate([0,0]) which doesn't work as intended.
  svgChild.transform = {k:1,x:0,y:0};



  //Vector pointing towards the top left corner of the current view in the x&y ranges frame
  //Calculated from svg.translate
  var actTranslate = [0,0];

  var event = {k:1,x:0,y:0};
  var calcCoord =[];

  svgChild.zoom = d3.zoom().scaleExtent([1, Infinity]).on("zoom", function () {

      rectOverlay.attr("width",svg.width);

      if(isNaN(startCoord[0])){

        var lastEvent = {k:event.k,x:event.x,y:event.y};
        event = d3.event.transform;

        if(event.k == lastEvent.k){
          //case: translation

          //Avoid some "false" executions
          if(event.k != 1){
            svgChild.style("cursor", "move");

          }

          //actualization of the translation vector (translate) within the x&y ranges frames
          svgChild.transform.x = Math.min(0, Math.max(event.x,svg.width - event.k*svgChild.scalex*svg.width ));
          svgChild.transform.y = Math.min(0, Math.max(event.y,svg.heightGraph - event.k*svgChild.scaley*svg.heightGraph ));


        }else{

          //case: zoom
          var coefScale = event.k/lastEvent.k;
          //Retrieve the cursor coordinates. Quick dirty fix to accept double click while trying to minimize side effects.
          calcCoord[0] = -(event.x -lastEvent.x*coefScale)/(coefScale -1);
          calcCoord[1] = -(event.y -lastEvent.y*coefScale)/(coefScale -1);

          var mouse = d3.mouse(svgChild.node());
          //console.log("x: " + (calcCoord[0] - mouse[0]).toFixed(5) + " y: " + (calcCoord[1] - mouse[1]).toFixed(5));

          var lastScalex = svgChild.scalex;
          var lastScaley = svgChild.scaley;


          //Actualization of the local scales
          svgChild.scalex = Math.max(1/event.k, svgChild.scalex);
          svgChild.scaley = Math.max(1/event.k, svgChild.scaley);

          //Evaluation of the scale changes by axis
          var xrel = coefScale*svgChild.scalex/lastScalex;
          var yrel = coefScale*svgChild.scaley/lastScaley;



          //actualization of the translation vector with the scale change
          svgChild.transform.x*= xrel;
          svgChild.transform.y*= yrel;

          //actualization of the translation vector (translate) to the top left corner of our view within the standard x&y.range() frame
          //If possible, the absolute location pointed by the cursor stay the same
          //Since zoom.translate(translate) doesn't work immediately but at the end of all consecutive zoom actions,
          //we can't rely on d3.event.translate for smooth zooming and have to separate zoom & translation
          svgChild.transform.x = Math.min(0, Math.max(svgChild.transform.x - calcCoord[0]*(xrel - 1),svg.width - event.k*svgChild.scalex*svg.width ));
          svgChild.transform.y = Math.min(0, Math.max(svgChild.transform.y - calcCoord[1]*(yrel - 1),svg.heightGraph- event.k*svgChild.scaley*svg.heightGraph ));
          svgChild.transform.k = event.k;

        }

        actTranslate[0] = -svgChild.transform.x/(svgChild.scalex*event.k);
        actTranslate[1] = -svgChild.transform.y/(svgChild.scaley*event.k);



        //actualization of the current (newX&Y) scales domains
        svgChild.newX.domain([ svgChild.x.invert(actTranslate[0]), svgChild.x.invert(actTranslate[0] + svg.width/(svgChild.transform.k*svgChild.scalex)) ]);
        svgChild.newY.domain([ svgChild.y.invert(actTranslate[1] + svg.heightGraph/(svgChild.transform.k*svgChild.scaley)), svgChild.y.invert(actTranslate[1]) ]);

        updateFunction(svg,svgChild);



      } else {

        mouseCoord = d3.mouse(svgChild.frame.node());

        //Drawing of the selection rect
        console.log("carré mousecoord " + mouseCoord + " start " + startCoord );

        mouseCoord[0] = Math.min(Math.max(mouseCoord[0],svgChild.x.range()[0]),svgChild.x.range()[1]);
        mouseCoord[1] = Math.min(Math.max(mouseCoord[1],svgChild.y.range()[1]),svgChild.y.range()[0]);

        svgChild.selec.attr("x", Math.min(mouseCoord[0],startCoord[0]))
          .attr("y", Math.min(mouseCoord[1],startCoord[1]))
          .attr("width",  Math.abs(mouseCoord[0] - startCoord[0]))
          .attr("height", Math.abs(mouseCoord[1] - startCoord[1]));



      }


    })

    .on("start",function () {

      svgChild.on("contextmenu.zoomReset",null);

      clearTimeout(svgChild.timer);
      event = {k:svgChild.transform.k,x:svgChild.transform.x,y:svgChild.transform.y};

      console.log("zoomstart");
      if(null !== d3.event.sourceEvent && d3.event.sourceEvent.shiftKey){
        console.log("key is down start");
        startCoord = d3.mouse(svgChild.frame.node());
        startCoord[0] = Math.min(Math.max(startCoord[0],svgChild.x.range()[0]),svgChild.x.range()[1]);
        startCoord[1] = Math.min(Math.max(startCoord[1],svgChild.y.range()[1]),svgChild.y.range()[0]);

        svgChild.style("cursor","crosshair");
      }

    })
    .on("end", function () {
      console.log("zoomend");
      rectOverlay.attr("width",0);

      if(!isNaN(startCoord[0]) && !isNaN(mouseCoord[0])){



        svgChild.selec.attr("width",  0)
          .attr("height", 0);


        var sqwidth = Math.abs(mouseCoord[0] - startCoord[0]);
        var sqheight = Math.abs(mouseCoord[1] - startCoord[1]);

        if(sqwidth != 0 && sqheight != 0){

          var lastScale = svgChild.transform.k;
          var lastScalex = svgChild.scalex;
          var lastScaley = svgChild.scaley;

          //Top left corner coordinates of the selection rectangle
          var xmin = Math.min(mouseCoord[0],startCoord[0]);
          var ymin = Math.min(mouseCoord[1],startCoord[1]);

          //Repercussion on the translate vector
          svgChild.transform.x -= xmin;
          svgChild.transform.y -= ymin;

          //Evaluation of the total scale change from the beginning, by axis.
          svgChild.scalex = svg.width*svgChild.transform.k*svgChild.scalex/sqwidth;
          svgChild.scaley = svg.heightGraph*svgChild.transform.k*svgChild.scaley/sqheight;

          //Evaluation of the global scale
          svgChild.transform.k = Math.max(svgChild.scalex,svgChild.scaley);

          //Evaluation of the local scale change (with 0<svg.scalen<=1 &&
          // total scale change for n axis == svg.scalen*svg.scale >=1)
          svgChild.scalex = svgChild.scalex/svgChild.transform.k;
          svgChild.scaley = svgChild.scaley/svgChild.transform.k;

          //Evaluation of the ratio by axis between the new & old scales
          var xrel = (svgChild.scalex * svgChild.transform.k)/(lastScale * lastScalex);
          var yrel = (svgChild.scaley * svgChild.transform.k)/(lastScale * lastScaley);

          //Actualization of the translate vector
          svgChild.transform.x*= xrel;
          svgChild.transform.y*= yrel;

          //actualization of the current (newX&Y) scales domains
          svgChild.newX.domain([ svgChild.newX.invert(xmin), svgChild.newX.invert(xmin + sqwidth)]);
          svgChild.newY.domain([ svgChild.newY.invert(ymin + sqheight),svgChild.newY.invert(ymin) ]);

          updateFunction(svg, svgChild);
        }

      }

      //update of the zoom behavior
      svgChild._groups[0][0].__zoom.k =svgChild.transform.k;
      svgChild._groups[0][0].__zoom.x =svgChild.transform.x;
      svgChild._groups[0][0].__zoom.y =svgChild.transform.y;

      startCoord = [NaN,NaN];
      mouseCoord = [NaN,NaN];
      svgChild.style("cursor","auto");

      svgChild.on("contextmenu.zoomReset",graph2histoZoomReset(svg, svgChild,updateFunction));


    });

  svgChild.call(svgChild.zoom);

  //A fresh start...
  svgChild._groups[0][0].__zoom.k = svgChild.transform.k;
  svgChild._groups[0][0].__zoom.x = svgChild.transform.x;
  svgChild._groups[0][0].__zoom.y = svgChild.transform.y;



}

/***********************************************************************************************************/


function hideShowValues2Histo(svg, svgChild,trSelec,selection,xlength){
  var duration = 800;

  var trSelecSize = trSelec.size();

  var hiddenValues = [];
  var stringified = JSON.stringify(svgChild.values);
  var newValues = JSON.parse(stringified);
  var valuesTrans = JSON.parse(stringified);
  selection.data(valuesTrans);

  console.log(newValues);


  trSelec.on("click",function(d){

    var clickedRow = d3.select(this);
    svgChild.transition("hideshow").duration(duration).tween("",function(){

      var totalSum = [];

      var x = svgChild.values[0].x;
      var sum;
      var i = 0;

      if(svgChild.popup.pieChart !==null){
        return;
      }

      var index = hiddenValues.indexOf(d.item);

      if( index === -1){
        //Hide the data
        hiddenValues.push(d.item);
        clickedRow.classed("strikedRow",true);




        while(x < xlength){
          sum=0;
          while(i <  newValues.length && newValues[i].x == x){
            if(newValues[i].item === d.item){
              newValues[i].height = 0;
            }
            sum += newValues[i].height;
            newValues[i].y = sum;
            i++;
          }
          totalSum.push(sum);
          x++;
        }


      }else{
        //Show the data
        hiddenValues.splice(index,1);
        clickedRow.classed("strikedRow",false);


        while(x < xlength){
          sum=0;
          while(i <  newValues.length && newValues[i].x == x){
            if(newValues[i].item === d.item){
              newValues[i].height = svgChild.values[i].height;
            }
            sum += newValues[i].height;
            newValues[i].y = sum;
            i++;
          }
          totalSum.push(sum);
          x++;
        }


      }

      var valuesStart = JSON.parse(JSON.stringify(valuesTrans));
      var newTotal;
      if(hiddenValues.length === trSelecSize){
        newTotal=1;
      }else {
        newTotal = d3.max(totalSum);
      }
      var oldTotal = svgChild.y.domain()[1]/1.05;

      var t0,totalTrans;

      return function(t){
        t0 = (1-t);
        valuesTrans.forEach(function(elem,i){
          elem.y = t0*valuesStart[i].y + t*newValues[i].y;
          elem.height = t0*valuesStart[i].height + t*newValues[i].height;
        });

        totalTrans = oldTotal* t0 + newTotal*t;
        var actTranslate1 = -svgChild.transform.y/(svgChild.scaley*svgChild.transform.k);
        svgChild.y.domain([0,totalTrans*1.05]);
        svgChild.newY.domain([svgChild.y.invert(actTranslate1 + svg.heightGraph/(svgChild.transform.k*svgChild.scaley)), svgChild.y.invert(actTranslate1)]);
        update2HistoStack(svg,svgChild);

      }
    });

  });

  trSelec.on("contextmenu",function(d) {

    d3.event.preventDefault();
    var clickedRow = d3.select(this);

    svgChild.transition("hideshow").duration(duration).tween("",function(){


      var totalSum = [];

      var x = svgChild.values[0].x;
      var sum;
      var i=0;

      if(svgChild.popup.pieChart !==null){
        return;
      }

      var index = hiddenValues.indexOf(d.item);


      if((index !== -1) || (trSelecSize - 1 !== hiddenValues.length )){
        //Hide all data except this one
        hiddenValues = trSelec.data().map(function(elem){return elem.item;});
        hiddenValues.splice(hiddenValues.indexOf(d.item),1);

        trSelec.classed("strikedRow",true);
        clickedRow.classed("strikedRow",false);

        while(x < xlength){
          sum=0;
          while(i <  newValues.length && newValues[i].x == x){
            if(newValues[i].item !== d.item){
              newValues[i].height = 0;
            }else{
              newValues[i].height = svgChild.values[i].height;
            }
            sum += newValues[i].height;
            newValues[i].y = sum;
            i++;
          }
          totalSum.push(sum);
          x++;
        }

      }else{
        //index === -1 && hiddenValues.length == trSelec.size() -1
        // ->show all data.
        hiddenValues = [];
        trSelec.classed("strikedRow",false);

        while(x < xlength){
          sum=0;
          while(i <  newValues.length && newValues[i].x == x){
            newValues[i].height = svgChild.values[i].height;
            sum += newValues[i].height;
            newValues[i].y = sum;
            i++;
          }
          totalSum.push(sum);
          x++;
        }

      }


      var valuesStart = JSON.parse(JSON.stringify(valuesTrans));
      var newTotal = Math.max(0.000000001,d3.max(totalSum));

      var oldTotal = svgChild.y.domain()[1]/1.05;

      var t0,totalTrans;

      return function(t){

        t=Math.min(1,Math.max(0,t));
        t0 = (1-t);

        valuesTrans.forEach(function(elem,i){
          elem.y = t0*valuesStart[i].y + t*newValues[i].y;
          elem.height = t0*valuesStart[i].height + t*newValues[i].height;
        });

        totalTrans = oldTotal* t0 + newTotal*t;
        var actTranslate1 = -svgChild.transform.y/(svgChild.scaley*svgChild.transform.k);
        svgChild.y.domain([0,totalTrans*1.05]);
        svgChild.newY.domain([svgChild.y.invert(actTranslate1 + svg.heightGraph/(svgChild.transform.k*svgChild.scaley)), svgChild.y.invert(actTranslate1) ]);
        update2HistoStack(svg,svgChild);

      }
    });

  });

}


/************************************************************************************************************/

function graph2histoZoomReset(svg,svgChild, updateFunction){

  return function(){

    svgChild._groups[0][0].__zoom.k = 1;
    svgChild._groups[0][0].__zoom.x = 0;
    svgChild._groups[0][0].__zoom.y = 0;

    svgChild.transform.k = 1;
    svgChild.transform.x = 0;
    svgChild.transform.y = 0;

    svgChild.scalex = 1;
    svgChild.scaley = 1;

    svgChild.newX.domain(svgChild.x.domain());
    svgChild.newY.domain(svgChild.y.domain());

    updateFunction(svg, svgChild);
  };

}