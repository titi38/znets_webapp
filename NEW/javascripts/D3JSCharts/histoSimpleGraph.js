
function createHisto2DStackSimple(div,svg,mydiv, urlJson){


  d3.json(urlJson, function (error, json) {

    svg.margin.left = 50;
    svg.margin.right = 50;


    console.log(json);

    //test json conformity
    if (testJson(json) || error) {
      console.log("incorrect url/data");
      noData(div, svg,mydiv);
      return false;
    }

    //json ok, graph creation


    //table for legend
    svg.tableWidth = 200;

    var clientRect = div.node().getBoundingClientRect();
    var divWidth = Math.max(1.15 * svg.tableWidth + svg.margin.left + svg.margin.right + 1, clientRect.width),
      divHeight = Math.max(svg.margin.bottom + svg.margin.top + svg.margin.zero + 1, clientRect.height);



    svg.attr("width", divWidth - 1.15 * svg.tableWidth).attr("height", divHeight);


    svg.width = divWidth - 1.15 * svg.tableWidth - svg.margin.left - svg.margin.right;
    svg.height = divHeight - svg.margin.bottom - svg.margin.top;


    svg.x = d3.scaleLinear()
      .range([0, svg.width]);

    svg.y = d3.scaleLinear().clamp(true);

    svg.svg = svg.append("svg").attr("x", svg.margin.left).attr("y", svg.margin.top).attr("width", svg.width).attr("height", svg.height).classed("crisp",true);

    svg.grid = svg.svg.append("g").classed("grid", true);

    //Will contain the chart itself, without the axis
    svg.chart = svg.svg.append("g");


    //Will contain the axis and the rectselec, for a better display of scaling
    svg.frame = svg.svg.append("g");

    svg.selec = svg.frame.append("rect").attr("class", "rectSelec");




    json = json.response;
    var jsonData = json.data;
    var jsonContent = json.content;
    console.log(json);



    var contentItemValue = searchItemValue(jsonContent);
    var contentDateValue = searchDateValue(jsonContent);
    var contentAmountValue = searchAmountValue(jsonContent);


    //optional display value for legend, no guaranty on uniqueness/existence.
    var contentDisplayValue = searchDisplayValue(jsonContent);

    //if no display value, then the display value is the item value.
    if (contentDisplayValue === false){
      contentDisplayValue = contentItemValue;
    }


    //if no item/date/amount value found, the graph can't be done.
    if(contentItemValue === false || contentDateValue === false || contentAmountValue === false){
      noData(div,svg,mydiv);
      return;
    }


    //Now, no more nodata can happen,so we create the table
    var divtable = div.append("div").classed("diagram divtable", true);
    divtable.append("h4").classed("tableTitle", true).text("Legend");
    var table = divtable.append("table").classed("diagram font2 tableLegend", true).style("width", svg.tableWidth + "px").style("max-height",
      (divHeight - 2 * parseInt(div.style("font-size"),10) - 60) + "px");

    svg.units = unitsStringProcessing(json.units);

    svg.values = [];

    var dataLength = jsonData.length;

    var colorMap = new Map();
    var sumMap = new Map();
    var sumMapByX = new Map();

    var i, elemJson, elemToPush, elemSumMap;
    svg.timeMin = Infinity;
    var timeMax = 0;



    var hourShift = getTimeShift(urlJson)  * 3600000;

    var itemType = jsonContent[contentItemValue];

    // Data are processed and sorted.
    for(i = 0; i < dataLength; i++){
      elemJson = jsonData[i];

      if(+elemJson[contentAmountValue] === 0){
        continue;
      }

      elemToPush = {
        x: (new Date(elemJson[contentDateValue])).getTime() + hourShift,
        height: +elemJson[contentAmountValue],
        item: (elemJson[contentItemValue] === "")?" Remainder ":elemJson[contentItemValue]
      };

      elemToPush.display = (elemToPush.item === " Remainder ")?" Remainder ":(elemJson[contentDisplayValue] === "")?elemToPush.item:
        (itemType === "portproto")?elemToPush.item + " (" +  elemJson[contentDisplayValue] + ")": elemJson[contentDisplayValue];

      if(!sumMapByX.has(elemToPush.x)){
        sumMapByX.set(elemToPush.x,elemToPush.height);
      }{
        sumMapByX.set(elemToPush.x,sumMapByX.get(elemToPush.x) + elemToPush.height);
      }



      svg.timeMin = Math.min(svg.timeMin,elemToPush.x);
      timeMax = Math.max(timeMax,elemToPush.x);


      svg.values.push(elemToPush);


    }









    //Compute 1% of total amount by date.
    sumMapByX.forEach(function(value, key){
      sumMapByX.set(key,value/100)
    });

    var elemValue, valuesLength = svg.values.length;
    i = 0;
    while(i < valuesLength){

      elemValue = svg.values[i];

      if(elemValue.height < sumMapByX.get(elemValue.x)){
        svg.values.splice(i,1);
        valuesLength --;
      }else{
        i++;
      }

    }




    //values are sorted according primarily x (date) then height.

    svg.values.sort(sortValues);

    console.log(sumMapByX);


    //step = 1 hour by default
    svg.step = (urlJson.indexOf("pset=DAILY") === -1)?3600000:86400000;



    svg.values.forEach(function(elem,i){
      elem.x = (elem.x - svg.timeMin)/svg.step;

      if (!sumMap.has(elem.item)) {
        sumMap.set(elem.item, {sum: elem.height,display: elem.display});
      } else {
        elemSumMap = sumMap.get(elem.item);
        elemSumMap.sum += elem.height;
      }

      svg.values[i] = {x:elem.x,height:elem.height,item:elem.item};

    });


    var xMax = (timeMax - svg.timeMin)/svg.step + 1;


    var sumArray = [];

    var f = colorEval();


    sumMap.forEach(function (value, key) {
      sumArray.push({item: key, sum: value.sum, display: value.display});
    });

    sumArray.sort(sortAlphabet);

    console.log(sumArray);
    //The most importants elements should have distinct colors.
    i = 0;
    if (sumArray[0].item == " Remainder " || sumArray[0].item == "OTHERS") {
      colorMap.set(sumArray[0].item, "#f2f2f2");
      i = 1;
    }

    while (i < sumArray.length) {
      colorMap.set(sumArray[i].item, f());
      i++;
    }

    console.log(colorMap);





    //Evaluation of the abscissa domain
    svg.x.domain([-0.625, xMax - 0.375]);

    var totalSum = [];

    var x = svg.values[0].x;
    var sum;
    i = 0;

    while (x < xMax) {
      sum = 0;
      while (i < svg.values.length && svg.values[i].x == x) {
        sum += svg.values[i].height;
        svg.values[i].y = sum;
        i++;
      }
      totalSum.push(sum);
      x++;
    }


    var total = d3.max(totalSum);

    svg.y.range([svg.height, 0]);


    //the *1.05 operation allow a little margin
    svg.y.domain([0, total * 1.05]);


    svg.newX = d3.scaleLinear().range(svg.x.range()).domain(svg.x.domain());
    svg.newY = d3.scaleLinear().range(svg.y.range()).domain(svg.y.domain());

    var dataWidth = 0.75 * (svg.x(svg.x.domain()[0] + 1) - svg.x.range()[0]);

    var selection = svg.chart.selectAll(".data")
      .data(svg.values)
      .enter().append("rect")
      .classed("data", true)
      .attr("x", function (d) {
        return svg.x(d.x - 0.375);
      })
      .attr("y", function (d) {
        return svg.y(d.y);
      })
      .attr("height", function (d) {
        return svg.y.range()[0] - svg.y(d.height);
      })
      .attr("width", dataWidth)
      .attr("fill", function (d) {
        return colorMap.get(d.item);
      })
      .attr("stroke", "#000000");


    //Tooltip creation
    createTooltipHisto(svg,selection,sumMap);

    var blink = blinkCreate(colorMap);

    svg.activeItem = null;

    function activationElems(d) {

      if (svg.popup.pieChart !== null) {
        return;
      }

      svg.activeItem = d.item;

      function testitem(data) {
        return d.item == data.item;

      }

      trSelec.filter(testitem).classed("outlined", true);

      selection.filter(testitem).each(blink);

    }

    function activationElemsAutoScroll(d) {

      if (svg.popup.pieChart !== null) {
        return;
      }
      svg.activeItem = d.item;


      function testitem(data) {
        return d.item == data.item;

      }

      var elem = trSelec.filter(testitem).classed("outlined", true);
      scrollToElementTableTransition(elem,table);


      selection.filter(testitem).each(blink);

    }

    function activationElemsAutoScrollPopup(d) {

      desactivationElems();
      svg.activeItem = d.item;


      function testitem(data) {
        return d.item == data.item;

      }

      var elem = trSelec.filter(testitem).classed("outlined", true);
      scrollToElementTableTransition(elem,table);


    }

    function desactivationElems() {

      if (svg.activeItem == null || svg.popup.pieChart !== null) {
        return;
      }


      function testitem(data) {
        return data.item == svg.activeItem;
      }

      trSelec.filter(testitem).classed("outlined", false);

      selection.filter(testitem).transition().duration(0).attr("stroke", "#000000").attr("fill", colorMap.get(svg.activeItem));

      svg.activeItem = null;

    }

    selection.on("mouseover", activationElemsAutoScroll).on("mouseout", desactivationElems);


    svg.axisx = svg.append("g")
      .attr("class", "axisGraph")
      .attr('transform', 'translate(' + [svg.margin.left, svg.height + svg.margin.top] + ")");

    svg.axisx.call(d3.axisBottom(svg.x));

    legendAxisX(svg);
    
    yAxeSimpleCreation(svg);
    optionalYAxeSimpleCreation(svg);

    gridSimpleGraph(svg);

    addPopup(selection,div,svg,function(data){
        desactivationElems();
        activationElemsAutoScrollPopup(data);},
      desactivationElems);

    //Legend creation
    var trSelec = table.selectAll("tr").data(sumArray).enter().append("tr");

    tableLegendTitle(svg,trSelec);

    trSelec.append("td").append("div").classed("lgd", true).style("background-color", function (d) {
      return colorMap.get(d.item);
    });
    trSelec.append("td").text(function (d) {
      return d.display;
    });
    trSelec.on("mouseover", activationElems).on("mouseout", desactivationElems);


    //zoom




    addZoomSimple(svg, updateHisto2DStackSimple);

    d3.select(window).on("resize." + mydiv, function () {
      console.log("resize");
      redrawHisto2DStackSimple(div, svg);
    });

    hideShowValuesSimple(svg, trSelec, selection, xMax);

  });





}




/***********************************************************************************************************/



function updateHisto2DStackSimple(svg){

  /*
   svg.chartOutput.attr("transform","matrix(" + (svg.scalex*svg.scale) + ", 0, 0, " + (svg.scaley*svg.scale) + ", " + svg.translate[0] + "," + svg.translate[1] + ")" );

   svg.chartInput.attr("transform","matrix(" + (svg.scalex*svg.scale) + ", 0, 0, " + (svg.scaley*svg.scale) + ", " + svg.translate[0] + "," + (svg.translate[1] - (svg.scaley*svg.scale-1)*svg.margin.zero) + ")" );
   */


  var newydom0 = svg.newY(svg.y.domain()[0]);
  var dataWidth = 0.75*(svg.newX(svg.newX.domain()[0] + 1) - svg.newX.range()[0]);


  svg.chart.selectAll(".data")
    .attr("x",function(d){return svg.newX(d.x - 0.375);})
    .attr("y", function(d){return svg.newY(d.y);})
    .attr("height", function(d){return newydom0 - svg.newY(d.height);})
    .attr("width", dataWidth);


  svg.axisx.call(d3.axisBottom(svg.newX));

  legendAxisX(svg);

  yAxeSimpleUpdate(svg);
  optionalYAxeSimpleUpdate(svg);

  gridSimpleGraph(svg);

}



/************************************************************************************************************/

function redrawHisto2DStackSimple(div,svg){
  var clientRect = div.node().getBoundingClientRect();
  var divWidth = Math.max(1.15*svg.tableWidth + svg.margin.left + svg.margin.right + 1, clientRect.width),
    divHeight = Math.max(svg.margin.bottom + svg.margin.top + svg.margin.zero + 1, clientRect.height);
  //console.log("width " + divWidth );

  var oldsvgheight = svg.height;
  var oldsvgwidth = svg.width;

  svg.attr("width",divWidth-1.15*svg.tableWidth).attr("height",divHeight);

  svg.width = divWidth-1.15*svg.tableWidth - svg.margin.left - svg.margin.right;
  svg.height = divHeight - svg.margin.bottom - svg.margin.top;
  div.select("table").style("max-height",
    (divHeight - 2*parseInt(div.style("font-size"),10) -60)  + "px");


  var ratiox = svg.width/oldsvgwidth;
  var ratioy = svg.height/oldsvgheight;

  svg.x.range([0, svg.width]);

  svg.y.range([svg.height,0]);

  svg.svg.attr("width",svg.width).attr("height",svg.height);

  svg.frame.select(".rectOverlay").attr("height",svg.height);


  svg.transform.x = svg.transform.x*ratiox;
  svg.transform.y = svg.transform.y*ratioy;

  var scaleytot = svg.transform.k*svg.scaley;
  var scalextot = svg.transform.k*svg.scalex;

  svg.transform.k = Math.max(scalextot,scaleytot);
  svg.scalex = scalextot/svg.transform.k;
  svg.scaley = scaleytot/svg.transform.k;

  svg.newX.range([0,svg.width]);
  svg.newY.range([svg.height,0]);

  svg.axisx.attr('transform', 'translate(' + [svg.margin.left, svg.height+svg.margin.top] +  ")");

  svg._groups[0][0].__zoom.k =svg.transform.k;
  svg._groups[0][0].__zoom.x =svg.transform.x;
  svg._groups[0][0].__zoom.y =svg.transform.y;

  updateHisto2DStackSimple(svg);

  redrawPopup(div, svg);


}





/*****************************************************************************

 To be functional, the method addZoom has several requirements:

 -svg.svg refers to an svg element that contains all the chart elements (and possibly more),
 addZoom will listen to it.

 -svg.frame is used to capture the position of the mouse in the chart
 viewport without offset, if the transform translate/scale way is implemented,
 svg.frame should refers to a g element superposed on the g containing the chart
 itself.

 -svg.y & svg.x, the initial scales used for drawing the chart.

 Some other elements will be implemented with standard parameters unless
 they already exist.

 svg.newX and svg.newY, the scales about to define the current altered
 view, implemented by default with clamping behavior enabled.

 svg.selec, the selection rectangle. It may be interesting
 to decide where it should be placed priorily, if you use the css transform
 function for example.


 Should work whichever the way scaling and translating are handled.

 *****************************************************************************/



function addZoomSimple(svg,updateFunction){

  if(svg.frame == undefined){
    svg.frame=svg.chart;
  }

  if(svg.svg == undefined){
    svg.svg=svg;
  }

  //Scales to update the current view (if not already implemented for specific reasons)
  if(svg.newX == undefined){
    svg.newX = d3.scale.linear().range(svg.x.range()).clamp(true).domain(svg.x.domain());
  }
  if(svg.newY == undefined) {
    svg.newY = d3.scale.linear().range(svg.y.range()).clamp(true).domain(svg.y.domain());
  }

  //Selection rectangle for zooming (if not already implemented for better display control)
  if(svg.selec == undefined){
    svg.selec = svg.chart.append("rect").attr("class", "rectSelec");
  }



  //to stop triggering animations during rectselec
  var rectOverlay = svg.frame.append("rect").attr("x",0).attr("y",0)
    .attr("height",svg.height).attr("width",0).attr("fill-opacity",0).classed("rectOverlay",true);


  var startCoord = [NaN,NaN];
  var mouseCoord = [NaN,NaN];


  svg.scalex = 1;
  svg.scaley = 1;




  //coordinates within the x&y ranges frames, points towards the top left corner of the actual view
  //workaround for the zoom.translate([0,0]) which doesn't work as intended.
  svg.transform = {k:1,x:0,y:0};



  //Vector pointing towards the top left corner of the current view in the x&y ranges frame
  //Calculated from svg.translate
  var actTranslate = [0,0];

  var event = {k:1,x:0,y:0};
  var calcCoord =[];

  svg.zoom = d3.zoom().scaleExtent([1, Infinity]).on("zoom", function () {

      rectOverlay.attr("width",svg.width);

      if(isNaN(startCoord[0])){

        var lastEvent = {k:event.k,x:event.x,y:event.y};
        event = d3.event.transform;

        if(event.k == lastEvent.k){
          //case: translation

          //Avoid some "false" executions
          if(event.k != 1){
            svg.style("cursor", "move");

          }

          //actualization of the translation vector (translate) within the x&y ranges frames
          svg.transform.x = Math.min(0, Math.max(event.x,svg.width - event.k*svg.scalex*svg.width ));
          svg.transform.y = Math.min(0, Math.max(event.y,svg.height - event.k*svg.scaley*svg.height ));


        }else{

          //case: zoom
          var coefScale = event.k/lastEvent.k;
          //Retrieve the cursor coordinates. Quick dirty fix to accept double click while trying to minimize side effects.
          calcCoord[0] = -svg.margin.left-(event.x -lastEvent.x*coefScale)/(coefScale -1);
          calcCoord[1] = -svg.margin.top-(event.y -lastEvent.y*coefScale)/(coefScale -1);

          var mouse = d3.mouse(svg.svg.node());
          //console.log("x: " + (calcCoord[0] - mouse[0]).toFixed(5) + " y: " + (calcCoord[1] - mouse[1]).toFixed(5));

          var lastScalex = svg.scalex;
          var lastScaley = svg.scaley;


          //Actualization of the local scales
          svg.scalex = Math.max(1/event.k, svg.scalex);
          svg.scaley = Math.max(1/event.k, svg.scaley);

          //Evaluation of the scale changes by axis
          var xrel = coefScale*svg.scalex/lastScalex;
          var yrel = coefScale*svg.scaley/lastScaley;



          //actualization of the translation vector with the scale change
          svg.transform.x*= xrel;
          svg.transform.y*= yrel;

          //actualization of the translation vector (translate) to the top left corner of our view within the standard x&y.range() frame
          //If possible, the absolute location pointed by the cursor stay the same
          //Since zoom.translate(translate) doesn't work immediately but at the end of all consecutive zoom actions,
          //we can't rely on d3.event.translate for smooth zooming and have to separate zoom & translation
          svg.transform.x = Math.min(0, Math.max(svg.transform.x - calcCoord[0]*(xrel - 1),svg.width - event.k*svg.scalex*svg.width ));
          svg.transform.y = Math.min(0, Math.max(svg.transform.y - calcCoord[1]*(yrel - 1),svg.height- event.k*svg.scaley*svg.height ));
          svg.transform.k = event.k;

        }

        actTranslate[0] = -svg.transform.x/(svg.scalex*event.k);
        actTranslate[1] = -svg.transform.y/(svg.scaley*event.k);



        //actualization of the current (newX&Y) scales domains
        svg.newX.domain([ svg.x.invert(actTranslate[0]), svg.x.invert(actTranslate[0] + svg.width/(svg.transform.k*svg.scalex)) ]);
        svg.newY.domain([ svg.y.invert(actTranslate[1] + svg.height/(svg.transform.k*svg.scaley)), svg.y.invert(actTranslate[1]) ]);

        updateFunction(svg);



      } else {

        mouseCoord = d3.mouse(svg.frame.node());

        //Drawing of the selection rect
        console.log("carré mousecoord " + mouseCoord + " start " + startCoord );

        mouseCoord[0] = Math.min(Math.max(mouseCoord[0],svg.x.range()[0]),svg.x.range()[1]);
        mouseCoord[1] = Math.min(Math.max(mouseCoord[1],svg.y.range()[1]),svg.y.range()[0]);

        svg.selec.attr("x", Math.min(mouseCoord[0],startCoord[0]))
          .attr("y", Math.min(mouseCoord[1],startCoord[1]))
          .attr("width",  Math.abs(mouseCoord[0] - startCoord[0]))
          .attr("height", Math.abs(mouseCoord[1] - startCoord[1]));



      }


    })

    .on("start",function () {
      svg.on("contextmenu.zoomReset",null);
      clearTimeout(svg.timer);
      event = {k:svg.transform.k,x:svg.transform.x,y:svg.transform.y};

      console.log("zoomstart");
      if(null !== d3.event.sourceEvent && d3.event.sourceEvent.shiftKey){
        console.log("key is down start");
        startCoord = d3.mouse(svg.frame.node());
        startCoord[0] = Math.min(Math.max(startCoord[0],svg.x.range()[0]),svg.x.range()[1]);
        startCoord[1] = Math.min(Math.max(startCoord[1],svg.y.range()[1]),svg.y.range()[0]);

        svg.style("cursor","crosshair");
      }

    })
    .on("end", function () {
      console.log("zoomend");
      rectOverlay.attr("width",0);

      if(!isNaN(startCoord[0]) && !isNaN(mouseCoord[0])){



        svg.selec.attr("width",  0)
          .attr("height", 0);


        var sqwidth = Math.abs(mouseCoord[0] - startCoord[0]);
        var sqheight = Math.abs(mouseCoord[1] - startCoord[1]);

        if(sqwidth != 0 && sqheight != 0){

          var lastScale = svg.transform.k;
          var lastScalex = svg.scalex;
          var lastScaley = svg.scaley;

          //Top left corner coordinates of the selection rectangle
          var xmin = Math.min(mouseCoord[0],startCoord[0]);
          var ymin = Math.min(mouseCoord[1],startCoord[1]);

          //Repercussion on the translate vector
          svg.transform.x -= xmin;
          svg.transform.y -= ymin;

          //Evaluation of the total scale change from the beginning, by axis.
          svg.scalex = svg.width*svg.transform.k*svg.scalex/sqwidth;
          svg.scaley = svg.height*svg.transform.k*svg.scaley/sqheight;

          //Evaluation of the global scale
          svg.transform.k = Math.max(svg.scalex,svg.scaley);

          //Evaluation of the local scale change (with 0<svg.scalen<=1 &&
          // total scale change for n axis == svg.scalen*svg.scale >=1)
          svg.scalex = svg.scalex/svg.transform.k;
          svg.scaley = svg.scaley/svg.transform.k;

          //Evaluation of the ratio by axis between the new & old scales
          var xrel = (svg.scalex * svg.transform.k)/(lastScale * lastScalex);
          var yrel = (svg.scaley * svg.transform.k)/(lastScale * lastScaley);

          //Actualization of the translate vector
          svg.transform.x*= xrel;
          svg.transform.y*= yrel;

          //actualization of the current (newX&Y) scales domains
          svg.newX.domain([ svg.newX.invert(xmin), svg.newX.invert(xmin + sqwidth)]);
          svg.newY.domain([ svg.newY.invert(ymin + sqheight),svg.newY.invert(ymin) ]);

          updateFunction(svg);
        }

      }

      //update of the zoom behavior
      svg._groups[0][0].__zoom.k =svg.transform.k;
      svg._groups[0][0].__zoom.x =svg.transform.x;
      svg._groups[0][0].__zoom.y =svg.transform.y;

      startCoord = [NaN,NaN];
      mouseCoord = [NaN,NaN];
      svg.style("cursor","auto");


      svg.on("contextmenu.zoomReset",simpleZoomReset(svg, updateFunction));
      
    });

  svg.call(svg.zoom);

  //A fresh start...
  svg._groups[0][0].__zoom.k =svg.transform.k;
  svg._groups[0][0].__zoom.x =svg.transform.x;
  svg._groups[0][0].__zoom.y =svg.transform.y;

}


/***********************************************************************************************************/


function hideShowValuesSimple(svg,trSelec,selection,xlength){
  var duration = 800;

  var trSelecSize = trSelec.size();

  var hiddenValues = [];
  var stringified = JSON.stringify(svg.values);
  var newValues = JSON.parse(stringified);
  var valuesTrans = JSON.parse(stringified);
  selection.data(valuesTrans);

  console.log(newValues);


  trSelec.on("click",function(d){

    var clickedRow = d3.select(this);
    svg.transition("hideshow").duration(duration).tween("",function(){

      var totalSum = [];

      var x = svg.values[0].x;
      var sum;
      var i = 0;

      if(svg.popup.pieChart !==null){
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
              newValues[i].height = svg.values[i].height;
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
      var oldTotal = svg.y.domain()[1]/1.05;

      var t0,totalTrans;

      return function(t){
        t0 = (1-t);
        valuesTrans.forEach(function(elem,i){
          elem.y = t0*valuesStart[i].y + t*newValues[i].y;
          elem.height = t0*valuesStart[i].height + t*newValues[i].height;
        });

        totalTrans = oldTotal* t0 + newTotal*t;
        var actTranslate1 = -svg.transform.y/(svg.scaley*svg.transform.k);
        svg.y.domain([0,totalTrans*1.05]);
        svg.newY.domain([svg.y.invert(actTranslate1 + svg.height/(svg.transform.k*svg.scaley)), svg.y.invert(actTranslate1)]);
        updateHisto2DStackSimple(svg);

      }
    });

  });

  trSelec.on("contextmenu",function(d) {

    d3.event.preventDefault();
    var clickedRow = d3.select(this);

    svg.transition("hideshow").duration(duration).tween("",function(){


      var totalSum = [];

      var x = svg.values[0].x;
      var sum;
      var i=0;

      if(svg.popup.pieChart !==null){
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
              newValues[i].height = svg.values[i].height;
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
            newValues[i].height = svg.values[i].height;
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

      var oldTotal = svg.y.domain()[1]/1.05;

      var t0,totalTrans;

      return function(t){

        t=Math.min(1,Math.max(0,t));
        t0 = (1-t);

        valuesTrans.forEach(function(elem,i){
          elem.y = t0*valuesStart[i].y + t*newValues[i].y;
          elem.height = t0*valuesStart[i].height + t*newValues[i].height;
        });

        totalTrans = oldTotal* t0 + newTotal*t;
        var actTranslate1 = -svg.transform.y/(svg.scaley*svg.transform.k);
        svg.y.domain([0,totalTrans*1.05]);
        svg.newY.domain([svg.y.invert(actTranslate1 + svg.height/(svg.transform.k*svg.scaley)), svg.y.invert(actTranslate1) ]);
        updateHisto2DStackSimple(svg);

      }
    });

  });

}
