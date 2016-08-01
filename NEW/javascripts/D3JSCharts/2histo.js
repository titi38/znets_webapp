function createHisto2DStackDouble(div,svg,mydiv,urlJson){

  d3.json(urlJson, function (error, json) {

    svg.margin.left = 50;
    svg.margin.right = 50;


    console.log(json);

    //test json conformity
    if (testJson(json) || error) {
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

    svg.heightGraph = (svg.height - svg.margin.zero)/2;

    svg.svgOutput = svg.append("svg").attr("x", svg.margin.left).attr("y", svg.margin.top).attr("width", svg.width).attr("height", svg.heightGraph).classed("crisp",true);
    svg.svgInput = svg.append("svg").attr("x", svg.margin.left).attr("y", svg.margin.top + svg.heightGraph + svg.margin.zero).attr("width", svg.width).attr("height", svg.heightGraph).classed("crisp",true);


    json = json.response;
    var jsonData = json.data;
    var jsonContent = json.content;


    var contentItemValue = searchItemValue(jsonContent);
    var contentDateValue = searchDateValue(jsonContent);
    var contentAmountValue = searchAmountValue(jsonContent);
    var contentDirectionValue = searchDirectionValue(jsonContent);

    //optional display value for legend, no guaranty on uniqueness/existence.
    var contentDisplayValue = searchDisplayValue(jsonContent);

    //if no display value, then the display value is the item value.
    if (contentDisplayValue === false){
      contentDisplayValue = contentItemValue;
    }

    //if no item/date/amount/direction value found, the graph can't be done.
    if(contentItemValue === false || contentDateValue === false || contentAmountValue === false || contentDirectionValue === false ){
      noData(div,svg,mydiv);
      return;
    }

    //Now, no more nodata can happen,so we create the table
    var divtable = div.append("div").classed("diagram divtable", true);
    divtable.append("h4").classed("tableTitle", true).text("Legend");
    var table = divtable.append("table").classed("diagram font2 tableLegend", true).style("width", svg.tableWidth + "px").style("max-height",
      (divHeight - 2 * parseInt(div.style("font-size"),10) - 60) + "px");

    svg.units = unitsStringProcessing(json.units);



    console.log(json);



    svg.valuesIn = [];
    svg.valuesOut = [];

    var dataLength = jsonData.length;

    var colorMap = new Map();
    var sumMap = new Map();
    var sumInMap = new Map();
    var sumOutMap = new Map();
    var i, elemJson, elemToPush, elemSumMap;
    svg.timeMin = Infinity;
    var timeMax = 0;


    var hourShift = getTimeShift(urlJson)  * 3600000;

    // Data are processed and sorted according to their direction.
    for(i = 0; i < dataLength; i++){
      elemJson = jsonData[i];

      if(+elemJson[contentAmountValue] === 0){
        continue;
      }

      elemToPush = {
        x: (new Date(elemJson[contentDateValue])).getTime() + hourShift,
        height: +elemJson[contentAmountValue],
        item: (elemJson[contentItemValue] === "")?" Remainder ":elemJson[contentItemValue],
        direction: elemJson[contentDirectionValue].toLowerCase()
      };

      if (!sumMap.has(elemToPush.item)) {
        sumMap.set(elemToPush.item, {sum: elemToPush.height,display: (elemToPush.item === " Remainder ")?" Remainder ":(elemJson[contentDisplayValue] === "")?elemToPush.item:elemJson[contentDisplayValue]});
      } else {
        elemSumMap = sumMap.get(elemToPush.item);
        elemSumMap.sum += elemToPush.height;
      }

      svg.timeMin = Math.min(svg.timeMin,elemToPush.x);
      timeMax = Math.max(timeMax,elemToPush.x);

      if(elemJson[contentDirectionValue] === "IN"){

        if (!sumInMap.has(elemToPush.item)) {
          sumInMap.set(elemToPush.item, {sum: elemToPush.height,display: (elemToPush.item === " Remainder ")?" Remainder ":(elemJson[contentDisplayValue] === "")?elemToPush.item:elemJson[contentDisplayValue]});
        } else {
          elemSumMap = sumInMap.get(elemToPush.item);
          elemSumMap.sum += elemToPush.height;
        }


        elemToPush.direction = "inc";
        svg.valuesIn.push(elemToPush);

      }else{

        if (!sumOutMap.has(elemToPush.item)) {
          sumOutMap.set(elemToPush.item, {sum: elemToPush.height,display: (elemToPush.item === " Remainder ")?" Remainder ":(elemJson[contentDisplayValue] === "")?elemToPush.item:elemJson[contentDisplayValue]});
        } else {
          elemSumMap = sumOutMap.get(elemToPush.item);
          elemSumMap.sum += elemToPush.height;
        }

        svg.valuesOut.push(elemToPush);

      }


    }





    var sumArray = [];

    var f = colorEval();


    sumMap.forEach(function (value, key) {
      sumArray.push({item: key, sum: value.sum, display: value.display});
    });

    sumArray.sort(function (a, b) {

      if (a.item == " Remainder " || a.item == "OTHERS") {
        return -1;
      }
      if (b.item == " Remainder " || b.item == "OTHERS") {
        return 1;
      }
      return b.sum - a.sum;
    });


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

    //step = 1 hour by default
    svg.step = (urlJson.indexOf("pset=DAILY") === -1)?3600000:86400000;

    svg.valuesIn.forEach(function(elem){
      elem.x = (elem.x - svg.timeMin)/svg.step
    });

    svg.valuesOut.forEach(function(elem){
      elem.x = (elem.x - svg.timeMin)/svg.step
    });


    function sortValues(a, b) {

      if (a.x - b.x != 0) {
        return a.x - b.x;
      }
      if (a.item == " Remainder " || a.item == "OTHERS") {
        return -1;
      }
      if (b.item == " Remainder " || b.item == "OTHERS") {
        return 1;
      }
      return b.height - a.height;
    }

    svg.valuesIn.sort(sortValues);
    svg.valuesOut.sort(sortValues);

    var xMax = (timeMax - svg.timeMin)/svg.step + 1;


    //Evaluation of the abscissa domain
    svg.x.domain([-0.625, xMax - 0.375]);

    var totalSumIn = [];
    var totalSumOut = [];

    var x = svg.valuesIn[0].x;
    var sum = 0;
    i = 0;

    while (x < xMax) {

      while (i < svg.valuesIn.length && svg.valuesIn[i].x == x) {
        sum += svg.valuesIn[i].height;
        svg.valuesIn[i].y = sum;
        i++;
      }
      totalSumIn.push(sum);
      sum = 0;
      x++;
    }

    x = svg.valuesOut[0].x;
    i = 0;

    while (x < xMax) {

      while (i < svg.valuesOut.length && svg.valuesOut[i].x == x) {
        sum += svg.valuesOut[i].height;
        svg.valuesOut[i].y = sum;
        i++;
      }
      totalSumOut.push(sum);
      sum = 0;
      x++;
    }


    var totalIn = d3.max(totalSumIn);
    var totalOut = d3.max(totalSumOut);


    svg.yInput.range([svg.heightGraph, 0]);
    svg.yOutput.range([svg.heightGraph, 0]);


    //the *1.1 operation allow a little margin
    svg.yInput.domain([0, totalIn * 1.1]);
    svg.yOutput.domain([0, totalOut * 1.1]);

    //Text background


    svg.rectInput = svg.svgInput.chartBackground.append("rect").attr("x", 0).attr("y", 0)
      .attr("width", svg.width)
      .attr("height", svg.heightGraph)
      .style("fill", "#e6e6e6");


    svg.textOutput = svg.svgOutput.chartBackground.append("text").classed("bckgr-txt", true)
      .style("fill", "#e6e6e6")
      .text("Outgoing");

    svg.textOutput.attr("transform", "translate(" + (svg.width / 2) + "," + (svg.heightGraph/8 +
      parseFloat(getComputedStyle(svg.textOutput.node()).fontSize)) + ")");


    svg.textInput = svg.svgInput.chartBackground.append("text").attr("transform", "translate(" + (svg.width / 2) + "," +
        (svg.heightGraph/8) + ")")
      .classed("bckgr-txt", true)
      .text("Ingoing")
      .style("fill", "#fff");


    //Here, the grid, after the text
    svg.svgOutput.grid = svg.svgOutput.chartBackground.append("g").classed("grid", true);
    svg.svgInput.grid = svg.svgInput.chartBackground.append("g").classed("grid", true);

    svg.newX = d3.scaleLinear().range(svg.x.range()).domain(svg.x.domain());
    svg.newYOutput = d3.scaleLinear().range(svg.yOutput.range()).domain(svg.yOutput.domain());
    svg.newYInput = d3.scaleLinear().range(svg.yInput.range()).domain(svg.yInput.domain());

    var selectionIn = svg.svgInput.chart.selectAll(".data")
      .data(svg.valuesIn)
      .enter().append("rect")
      .classed("data", true)
      .attr("fill", function (d) {
        return colorMap.get(d.item);
      })
      .attr("stroke", "#000000");

    var selectionOut = svg.svgOutput.chart.selectAll(".data")
      .data(svg.valuesOut)
      .enter().append("rect")
      .classed("data", true)
      .attr("fill", function (d) {
        return colorMap.get(d.item);
      })
      .attr("stroke", "#000000");


    drawCharts2Histo(svg);

    var selection = svg.selectAll(".data");

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
      .attr('transform', 'translate(' + [svg.margin.left, svg.heightOutput + svg.margin.top] + ")");

    svg.axisx.rect = svg.axisx.append("rect").classed("rectAxis", true).attr("height", svg.margin.zero - 1 ).attr("y",0.5);
    svg.axisx.path = svg.axisx.append("path");
    svg.axisx.call(d3.axisBottom(svg.x));
    svg.heightTick = svg.axisx.select(".tick").select("line").attr("y2");

    axisXDoubleDraw(svg);

    ticksSecondAxisXDouble(svg);

    legendAxisX(svg);


    axesDoubleCreation(svg);
    optionalAxesDoubleCreation(svg);



    gridDoubleGraph(svg);


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



    addZoomDouble(svg, updateHisto2DStackDouble);
    d3.select(window).on("resize." + mydiv, function () {
      console.log("resize");
      redrawHisto2DStackDouble(div, svg);
    });

    hideShowValuesDouble(svg, trSelec, selectionIn, selectionOut, xMax);

  });


}
