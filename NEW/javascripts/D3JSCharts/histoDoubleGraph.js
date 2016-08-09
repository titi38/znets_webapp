
function createHisto2DStackDouble(div,svg,mydiv,urlJson){

  d3.json(urlJson, function (error, json) {

    svg.margin.left = 50;
    svg.margin.right = 50;
    svg.margin.top = 20;
    svg.margin.bottom = 20;
    svg.margin.zero = 28;


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


    svg.x = d3.scaleLinear()
      .range([0, svg.width]);

    svg.yInput = d3.scaleLinear().clamp(true);

    svg.yOutput = d3.scaleLinear().clamp(true);

    svg.svg = svg.append("svg").attr("x", svg.margin.left).attr("y", svg.margin.top).attr("width", svg.width).attr("height", svg.height).classed("crisp",true);


    //Will contain the chart itself, without the axis
    svg.chartBackground = svg.svg.append("g");


    svg.chartInput = svg.svg.append('g');
    svg.chartOutput = svg.svg.append('g');


    //Will contain the axis and the rectselec, for a better display of scaling
    svg.frame = svg.svg.append("g");

    svg.selec = svg.frame.append("rect").attr("class", "rectSelec");






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



    svg.units = unitsStringProcessing(json.units);



    console.log(json);



    svg.valuesIn = [];
    svg.valuesOut = [];

    var dataLength = jsonData.length;

    var colorMap = new Map();
    var sumMap = new Map();
    var sumMapIn = new Map();
    var sumMapOut = new Map();

    var i, elemJson, elemToPush, elemSumMap;
    svg.timeMin = Infinity;
    var timeMax = 0;


    svg.hourShift = getTimeShift(urlJson)  * 3600000;

    var itemType = jsonContent[contentItemValue];

    // Data are processed and sorted according to their direction.
    for(i = 0; i < dataLength; i++){
      elemJson = jsonData[i];

      if(+elemJson[contentAmountValue] === 0){
        continue;
      }

      elemToPush = {
        x: (new Date(elemJson[contentDateValue])).getTime() + svg.hourShift,
        height: +elemJson[contentAmountValue],
        item: (elemJson[contentItemValue] === "")?" Remainder ":elemJson[contentItemValue],
        direction: elemJson[contentDirectionValue].toLowerCase()
      };


      mapElemToSum(sumMap, elemToPush, elemJson, contentDisplayValue,itemType);

      svg.timeMin = Math.min(svg.timeMin,elemToPush.x);
      timeMax = Math.max(timeMax,elemToPush.x);

      if(elemJson[contentDirectionValue] === "IN"){
        elemToPush.direction = "inc";

        mapElemToSum(sumMapIn, elemToPush, elemJson, contentDisplayValue,itemType);
        svg.valuesIn.push(elemToPush);

      }else{


        mapElemToSum(sumMapOut, elemToPush, elemJson, contentDisplayValue,itemType);
        svg.valuesOut.push(elemToPush)

      }


    }


    //


    var sumArray = [];
    var sumArrayIn = [];
    var sumArrayOut = [];

    

    var f = colorEval();


    sumMap.forEach(mapToArray(sumArray));
    sumMapIn.forEach(mapToArray(sumArrayIn));
    sumMapOut.forEach(mapToArray(sumArrayOut));



    //sort alphabetically
    sumArray.sort(sortAlphabet);
    sumArrayIn.sort(sortAlphabet);
    sumArrayOut.sort(sortAlphabet);



    i = 0;
    if (sumArray[0].item == " Remainder " || sumArray[0].item == "OTHERS") {
      colorMap.set(sumArray[0].item, "#f2f2f2");
      i = 1;
    }

    while (i < sumArray.length) {
      colorMap.set(sumArray[i].item, f());
      i++;
    }




    //step = 1 hour by default
    svg.step = (urlJson.indexOf("pset=DAILY") === -1)?3600000:86400000;

    svg.valuesIn.forEach(function(elem){
      elem.x = (elem.x - svg.timeMin)/svg.step
    });

    svg.valuesOut.forEach(function(elem){
      elem.x = (elem.x - svg.timeMin)/svg.step
    });


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
        svg.valuesIn[i].y = sum;
        sum += svg.valuesIn[i].height;
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


    svg.totalIn = d3.max(totalSumIn);
    svg.totalOut = d3.max(totalSumOut);

    svg.heightOutput = (svg.height - svg.margin.zero) * svg.totalOut / (svg.totalIn + svg.totalOut);

    svg.yInput.range([svg.heightOutput + svg.margin.zero, svg.height]);
    svg.yOutput.range([svg.heightOutput, 0]);


    //the *1.1 operation allow a little margin
    svg.yInput.domain([0, svg.totalIn * 1.1]);
    svg.yOutput.domain([0, svg.totalOut * 1.1]);

    //Text background


    svg.rectInput = svg.chartBackground.append("rect").attr("x", 0).attr("y", svg.heightOutput + svg.margin.zero)
      .attr("width", svg.width)
      .attr("height", svg.height - svg.heightOutput - svg.margin.zero)
      .style("fill", "#e6e6e6");


    svg.textOutput = svg.chartBackground.append("text").classed("bckgr-txt", true)
      .style("fill", "#e6e6e6")
      .text("Outgoing");

    svg.textOutput.attr("transform", "translate(" + (svg.width / 2) + "," + (svg.heightOutput / 8 +
      parseFloat(getComputedStyle(svg.textOutput.node()).fontSize)) + ")");


    svg.textInput = svg.chartBackground.append("text").attr("transform", "translate(" + (svg.width / 2) + "," +
        ((svg.height + (svg.heightOutput + svg.margin.zero) / 3) * 0.75) + ")")
      .classed("bckgr-txt", true)
      .text("Ingoing")
      .style("fill", "#fff");


    //Here, the grid, after the rectInput & the text
    svg.grid = svg.chartBackground.append("g").classed("grid", true);



    svg.newX = d3.scaleLinear().range(svg.x.range()).domain(svg.x.domain());
    svg.newYOutput = d3.scaleLinear().range(svg.yOutput.range()).domain(svg.yOutput.domain());
    svg.newYInput = d3.scaleLinear().range(svg.yInput.range()).domain(svg.yInput.domain());

    var selectionIn = svg.chartInput.selectAll(".data")
      .data(svg.valuesIn)
      .enter().append("rect")
      .classed("data", true)
      .attr("fill", function (d) {
        return colorMap.get(d.item);
      })
      .attr("stroke", "#000000");

    var selectionOut = svg.chartOutput.selectAll(".data")
      .data(svg.valuesOut)
      .enter().append("rect")
      .classed("data", true)
      .attr("fill", function (d) {
        return colorMap.get(d.item);
      })
      .attr("stroke", "#000000");


    drawChartDouble(svg,svg.yOutput.range()[0],svg.yInput.range()[0]);

    var selection = svg.selectAll(".data");

    //Tooltip creation

    createTooltipHisto(svg,selection,sumMap);


    var blink = blinkCreate(colorMap);

    svg.activeItem = null;

    function activationElemsFromTable(direction){
      if(direction === "Out"){

        return function(d){
          if (svg.popup.pieChart !== null) {
            return;
          }

          svg.activeItem = {item: d.item, direction: "out"};

          function testitem(data) {
            return d.item === data.item;
          }

          trSelecOut.filter(testitem).classed("outlined", true);
          selectionOut.filter(testitem).each(blink);

        };

      }

      return function(d){
        if (svg.popup.pieChart !== null) {
          return;
        }

        svg.activeItem = {item: d.item, direction: "inc"};

        function testitem(data) {
          return d.item === data.item;

        }

        trSelecIn.filter(testitem).classed("outlined", true);
        selectionIn.filter(testitem).each(blink);

      };

    }

    function activationElemsAutoScroll(d) {

      if (svg.popup.pieChart !== null) {
        return;
      }
      
      svg.activeItem = {item: d.item, direction: d.direction};


      function testitem(data) {
        return d.item == data.item;

      }

      var elem;

      if(d.direction === "out"){

        elem = trSelecOut.filter(testitem).classed("outlined", true);

        scrollToElementTableTransition(elem,svg.divLegend.divtableOut.table);

        selectionOut.filter(testitem).each(blink);
        
      }else{

        elem = trSelecIn.filter(testitem).classed("outlined", true);

        scrollToElementTableTransition(elem,svg.divLegend.divtableIn.table);

        selectionIn.filter(testitem).each(blink);
        
      }

    }
    
    function activationElemsAutoScrollPopup(d) {

      svg.activeItem = {item: d.item, direction: d.direction};


      function testitem(data) {

        return d.item == data.item;

      }

      var elem;

      if(d.direction === "out"){

        elem = trSelecOut.filter(testitem).classed("outlined", true);
        scrollToElementTableTransition(elem,svg.divLegend.divtableOut.table);

      }else{

        elem = trSelecIn.filter(testitem).classed("outlined", true);
        scrollToElementTableTransition(elem,svg.divLegend.divtableIn.table);

      }

    }

    function desactivationElems() {

      if (svg.activeItem === null || svg.popup.pieChart !== null) {
        return;
      }

      var activeItem = svg.activeItem.item;

      function testitem(data) {
        return data.item == activeItem;
      }


      if(svg.activeItem.direction === "out"){


        trSelecOut.filter(testitem).classed("outlined", false);

        selectionOut.filter(testitem).interrupt().attr("stroke", "#000000").attr("fill", colorMap.get(activeItem));


      }else{

        trSelecIn.filter(testitem).classed("outlined", false);

        selectionIn.filter(testitem).interrupt().attr("stroke", "#000000").attr("fill", colorMap.get(activeItem));


      }


      svg.activeItem = null;

    }



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



    selection.on("mouseover", activationElemsAutoScroll).on("mouseout", desactivationElems);


    //Now, no more nodata can happen,so we create the table
    svg.divLegend = div.append("div").classed("diagram", true).style("vertical-align", "top").style("width", svg.tableWidth + "px");

    var trSelecOut = createTableLegendDouble(svg,"Out",sumArrayOut,colorMap, activationElemsFromTable,desactivationElems);
    var trSelecIn = createTableLegendDouble(svg,"In",sumArrayIn,colorMap, activationElemsFromTable,desactivationElems);

    //zoom

    


    addZoomDouble(svg, updateHisto2DStackDouble);
    d3.select(window).on("resize." + mydiv, function () {
      console.log("resize");
      redrawHisto2DStackDouble(div, svg);
    });

  });


}


/***********************************************************************************************************/


function createHisto2DStackDoubleFormatVariation(div, svg, mydiv, urlJson){

  d3.json(urlJson, function (error, json) {

    svg.margin.left = 50;
    svg.margin.right = 50;
    svg.margin.top = 20;
    svg.margin.bottom = 20;
    svg.margin.zero = 28;

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


    svg.x = d3.scaleLinear()
      .range([0, svg.width]);

    svg.yInput = d3.scaleLinear().clamp(true);

    svg.yOutput = d3.scaleLinear().clamp(true);

    svg.svg = svg.append("svg").attr("x", svg.margin.left).attr("y", svg.margin.top).attr("width", svg.width).attr("height", svg.height).classed("crisp",true);


    //Will contain the chart itself, without the axis
    svg.chartBackground = svg.svg.append("g");


    svg.chartInput = svg.svg.append('g');
    svg.chartOutput = svg.svg.append('g');


    //Will contain the axis and the rectselec, for a better display of scaling
    svg.frame = svg.svg.append("g");

    svg.selec = svg.frame.append("rect").attr("class", "rectSelec");



    json = json.response;
    var jsonData = json.data;
    var jsonContent = json.content;


    //step = 1 hour by default
    svg.step = (urlJson.indexOf("pset=MINUTE") === -1)?((urlJson.indexOf("pset=DAILY") === - 1)?3600000:86400000):60000;

    var contentDateValue = searchDateValue(jsonContent);

    //if no date value found, the graph can't be done.
    if(contentDateValue === false){
      noData(div,svg,mydiv);
      return;
    }
    

    svg.units = unitsStringProcessing(json.units);

    console.log(json);



    svg.valuesIn = [];
    svg.valuesOut = [];

    var dataLength = jsonData.length;
    var contentLength = jsonContent.length;

    
    
    
    //More useful jsonContent. 0: item / 1: direction
    for(i = 0; i < contentLength; i++){

      if(i === contentDateValue){
        continue;
      }

      var tempArrayName = jsonContent[i].split("_");
      var strName = tempArrayName[0];

      for(var w = 1; w < tempArrayName.length - 2; w++){
      
          strName = strName + " " + tempArrayName[w];

      }

      jsonContent[i] = [strName, tempArrayName[tempArrayName.length-2]];

      if(svg.units !== "hosts"){

        jsonContent[i][0] = jsonContent[i][0].toUpperCase();

      }

      console.log(jsonContent[i]);

    }
    
    

    var colorMap = new Map();
    var sumMap = new Map();
    var sumMapIn = new Map();
    var sumMapOut = new Map();
    
    var i,j,k, elemJson, elemToPush, elemSumMap;
    svg.timeMin = Infinity;
    var timeMax = 0;


    svg.hourShift = getTimeShift(urlJson)  * 3600000;


    // Data are processed and sorted according to their direction.

    if(svg.step === 60000){

      var elemAmountMinuteArray;

      for(i = 0; i < dataLength; i++){
        elemJson = jsonData[i];

        for(j = 0; j < contentLength; j++){

          if(j === contentDateValue){
            continue;
          }

          elemAmountMinuteArray = elemJson[j];

          for(k = 0; k < 60; k++) {


            if(+elemAmountMinuteArray[k] === 0 || !elemAmountMinuteArray[k]){
              continue;
            }

            elemToPush = {
              //The given time is the corresping, we add the correct minutes according to the position k
              //of the element in the array
              x: (new Date(elemJson[contentDateValue])).getTime() + k*svg.step + svg.hourShift - 3600000,
              height: +elemAmountMinuteArray[k],
              item: jsonContent[j][0],
              direction: jsonContent[j][1]
            };

            // .display kept, can have an use someday
            if (!sumMap.has(elemToPush.item)) {
              sumMap.set(elemToPush.item, {sum: elemToPush.height, display: elemToPush.item});
            } else {
              elemSumMap = sumMap.get(elemToPush.item);
              elemSumMap.sum += elemToPush.height;
            }

            svg.timeMin = Math.min(svg.timeMin, elemToPush.x);
            timeMax = Math.max(timeMax, elemToPush.x);

            if (elemToPush.direction === "in") {
              elemToPush.direction = "inc";

              if (!sumMapIn.has(elemToPush.item)) {
                sumMapIn.set(elemToPush.item, {sum: elemToPush.height, display: elemToPush.item});
              } else {
                elemSumMap = sumMapIn.get(elemToPush.item);
                elemSumMap.sum += elemToPush.height;
              }

              svg.valuesIn.push(elemToPush);

            } else {

              if (!sumMapOut.has(elemToPush.item)) {
                sumMapOut.set(elemToPush.item, {sum: elemToPush.height, display: elemToPush.item});
              } else {
                elemSumMap = sumMapOut.get(elemToPush.item);
                elemSumMap.sum += elemToPush.height;
              }

              svg.valuesOut.push(elemToPush)

            }

          }


        }


      }




    }else{


      for(i = 0; i < dataLength; i++){
        elemJson = jsonData[i];

        for(j = 0; j < contentLength; j++){

          if(j === contentDateValue || +elemJson[j] === 0){
            continue;
          }

          elemToPush = {
            x: (new Date(elemJson[contentDateValue])).getTime() + svg.hourShift,
            height: +elemJson[j],
            item: jsonContent[j][0],
            direction: jsonContent[j][1]
          };

          // .display kept, can have an use someday
          if (!sumMap.has(elemToPush.item)) {
            sumMap.set(elemToPush.item, {sum: elemToPush.height,display: elemToPush.item});
          } else {
            elemSumMap = sumMap.get(elemToPush.item);
            elemSumMap.sum += elemToPush.height;
          }

          svg.timeMin = Math.min(svg.timeMin,elemToPush.x);
          timeMax = Math.max(timeMax,elemToPush.x);

          if(elemToPush.direction === "in"){
            elemToPush.direction = "inc";

            if (!sumMapIn.has(elemToPush.item)) {
              sumMapIn.set(elemToPush.item, {sum: elemToPush.height, display: elemToPush.item});
            } else {
              elemSumMap = sumMapIn.get(elemToPush.item);
              elemSumMap.sum += elemToPush.height;
            }

            svg.valuesIn.push(elemToPush);

          }else{

            if (!sumMapOut.has(elemToPush.item)) {
              sumMapOut.set(elemToPush.item, {sum: elemToPush.height, display: elemToPush.item});
            } else {
              elemSumMap = sumMapOut.get(elemToPush.item);
              elemSumMap.sum += elemToPush.height;
            }

            svg.valuesOut.push(elemToPush)

          }


        }


      }

    }

    //



    var sumArray = [];
    var sumArrayIn = [];
    var sumArrayOut = [];



    var f = colorEval();


    sumMap.forEach(mapToArray(sumArray));
    sumMapIn.forEach(mapToArray(sumArrayIn));
    sumMapOut.forEach(mapToArray(sumArrayOut));



    //sort alphabetically

    sumArray.sort(sortAlphabet);
    sumArrayIn.sort(sortAlphabet);
    sumArrayOut.sort(sortAlphabet);


    i = 0;
    if (sumArray[0].item == " Remainder " || sumArray[0].item == "OTHERS") {
      colorMap.set(sumArray[0].item, "#f2f2f2");
      i = 1;
    }

    while (i < sumArray.length) {
      colorMap.set(sumArray[i].item, f());
      i++;
    }

    

    svg.valuesIn.forEach(function(elem){
      elem.x = (elem.x - svg.timeMin)/svg.step
    });

    svg.valuesOut.forEach(function(elem){
      elem.x = (elem.x - svg.timeMin)/svg.step
    });



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
        svg.valuesIn[i].y = sum;
        sum += svg.valuesIn[i].height;
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


    svg.totalIn = d3.max(totalSumIn);
    svg.totalOut = d3.max(totalSumOut);

    svg.heightOutput = (svg.height - svg.margin.zero) * svg.totalOut / (svg.totalIn + svg.totalOut);

    svg.yInput.range([svg.heightOutput + svg.margin.zero, svg.height]);
    svg.yOutput.range([svg.heightOutput, 0]);


    //the *1.1 operation allow a little margin
    svg.yInput.domain([0, svg.totalIn * 1.1]);
    svg.yOutput.domain([0, svg.totalOut * 1.1]);

    //Text background


    svg.rectInput = svg.chartBackground.append("rect").attr("x", 0).attr("y", svg.heightOutput + svg.margin.zero)
      .attr("width", svg.width)
      .attr("height", svg.height - svg.heightOutput - svg.margin.zero)
      .style("fill", "#e6e6e6");


    svg.textOutput = svg.chartBackground.append("text").classed("bckgr-txt", true)
      .style("fill", "#e6e6e6")
      .text("Outgoing");

    svg.textOutput.attr("transform", "translate(" + (svg.width / 2) + "," + (svg.heightOutput / 8 +
      parseFloat(getComputedStyle(svg.textOutput.node()).fontSize)) + ")");


    svg.textInput = svg.chartBackground.append("text").attr("transform", "translate(" + (svg.width / 2) + "," +
        ((svg.height + (svg.heightOutput + svg.margin.zero) / 3) * 0.75) + ")")
      .classed("bckgr-txt", true)
      .text("Ingoing")
      .style("fill", "#fff");


    //Here, the grid, after the rectInput & the text
    svg.grid = svg.chartBackground.append("g").classed("grid", true);



    svg.newX = d3.scaleLinear().range(svg.x.range()).domain(svg.x.domain());
    svg.newYOutput = d3.scaleLinear().range(svg.yOutput.range()).domain(svg.yOutput.domain());
    svg.newYInput = d3.scaleLinear().range(svg.yInput.range()).domain(svg.yInput.domain());

    var selectionIn = svg.chartInput.selectAll(".data")
      .data(svg.valuesIn)
      .enter().append("rect")
      .classed("data", true)
      .attr("fill", function (d) {
        return colorMap.get(d.item);
      })
      .attr("stroke", "#000000");

    var selectionOut = svg.chartOutput.selectAll(".data")
      .data(svg.valuesOut)
      .enter().append("rect")
      .classed("data", true)
      .attr("fill", function (d) {
        return colorMap.get(d.item);
      })
      .attr("stroke", "#000000");


    drawChartDouble(svg,svg.yOutput.range()[0],svg.yInput.range()[0]);

    var selection = svg.selectAll(".data");

    //Tooltip creation

    createTooltipHisto(svg,selection,sumMap);


    var blink = blinkCreate(colorMap);

    svg.activeItem = null;

    function activationElemsFromTable(direction){
      if(direction === "Out"){

        return function(d){
          if (svg.popup.pieChart !== null) {
            return;
          }

          svg.activeItem = {item: d.item, direction: "out"};

          function testitem(data) {
            return d.item === data.item;

          }

          trSelecOut.filter(testitem).classed("outlined", true);
          selectionOut.filter(testitem).each(blink);

        };

      }

      return function(d){
        if (svg.popup.pieChart !== null) {
          return;
        }

        svg.activeItem = {item: d.item, direction: "inc"};

        function testitem(data) {
          return d.item === data.item;

        }

        trSelecIn.filter(testitem).classed("outlined", true);
        selectionIn.filter(testitem).each(blink);

      };

    }

    function activationElemsAutoScroll(d) {

      if (svg.popup.pieChart !== null) {
        return;
      }

      svg.activeItem = {item: d.item, direction: d.direction};


      function testitem(data) {
        return d.item == data.item;

      }

      var elem;

      if(d.direction === "out"){

        elem = trSelecOut.filter(testitem).classed("outlined", true);

        scrollToElementTableTransition(elem,svg.divLegend.divtableOut.table);

        selectionOut.filter(testitem).each(blink);

      }else{

        elem = trSelecIn.filter(testitem).classed("outlined", true);

        scrollToElementTableTransition(elem,svg.divLegend.divtableIn.table);

        selectionIn.filter(testitem).each(blink);

      }

    }

    function activationElemsAutoScrollPopup(d) {


      svg.activeItem = {item: d.item, direction: d.direction};


      function testitem(data) {
        return d.item == data.item;

      }

      var elem;

      if(d.direction === "out"){

        elem = trSelecOut.filter(testitem).classed("outlined", true);

        scrollToElementTableTransition(elem,svg.divLegend.divtableOut.table);

      }else{

        elem = trSelecIn.filter(testitem).classed("outlined", true);

        scrollToElementTableTransition(elem,svg.divLegend.divtableIn.table);

      }

    }

    function desactivationElems() {

      if (svg.activeItem == null || svg.popup.pieChart !== null) {
        return;
      }

      var activeItem = svg.activeItem.item;

      function testitem(data) {
        return data.item == activeItem;
      }

      if(svg.activeItem.direction === "out"){

        trSelecOut.filter(testitem).classed("outlined", false);

        selectionOut.filter(testitem).interrupt().attr("stroke", "#000000").attr("fill", colorMap.get(activeItem));


      }else{

        trSelecIn.filter(testitem).classed("outlined", false);

        selectionIn.filter(testitem).interrupt().attr("stroke", "#000000").attr("fill", colorMap.get(activeItem));

      }


      svg.activeItem = null;

    }



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

    selection.on("mouseover", activationElemsAutoScroll).on("mouseout", desactivationElems);

    //Now, no more nodata can happen,so we create the table
    svg.divLegend = div.append("div").classed("diagram", true).style("vertical-align", "top").style("width", svg.tableWidth + "px");

    var trSelecOut = createTableLegendDouble(svg,"Out",sumArrayOut,colorMap, activationElemsFromTable,desactivationElems);
    var trSelecIn = createTableLegendDouble(svg,"In",sumArrayIn,colorMap, activationElemsFromTable,desactivationElems);

    //zoom
    addZoomDouble(svg, updateHisto2DStackDouble);
    d3.select(window).on("resize." + mydiv, function () {
      console.log("resize");
      redrawHisto2DStackDouble(div, svg);
    });

  });

}

/***********************************************************************************************************/



function updateHisto2DStackDouble(svg){

  /*
   svg.chartOutput.attr("transform","matrix(" + (svg.scalex*svg.scale) + ", 0, 0, " + (svg.scaley*svg.scale) + ", " + svg.translate[0] + "," + svg.translate[1] + ")" );
   svg.chartInput.attr("transform","matrix(" + (svg.scalex*svg.scale) + ", 0, 0, " + (svg.scaley*svg.scale) + ", " + svg.translate[0] + "," + (svg.translate[1] - (svg.scaley*svg.scale-1)*svg.margin.zero) + ")" );
   */


  var newHeightOutput = svg.newYOutput(svg.yOutput.domain()[0]);
  var newHOmarg = svg.newYInput(svg.yInput.domain()[0]);

  var effectiveNewHeightOutput = Math.min(newHeightOutput, svg.height);
  svg.rectInput.attr("y", newHOmarg).attr("height",Math.max(0,svg.height-newHOmarg));
  svg.textOutput.attr("transform", "translate(" + (svg.width/2) + "," +(effectiveNewHeightOutput/8 +
    parseFloat(getComputedStyle(svg.textOutput.node()).fontSize)) + ")");



  svg.textInput.attr("transform", "translate(" + (svg.width/2) + "," +
    ((svg.height + Math.max(0,newHOmarg)/3) *0.75) + ")");


  drawChartDouble(svg,newHeightOutput,newHOmarg);

  svg.axisx.call(d3.axisBottom(svg.newX));

  ticksSecondAxisXDouble(svg);

  legendAxisX(svg);

  svg.axisx.attr("transform","matrix(1, 0, 0, 1," + svg.margin.left+ "," + Math.min(svg.margin.top + svg.height,Math.max(svg.margin.top - svg.margin.zero,(svg.heightOutput)*svg.transform.k*svg.scaley +svg.margin.top + svg.transform.y)) + ")" );


  axesDoubleUpdate(svg);
  optionalAxesDoubleUpdate(svg);

  gridDoubleGraph(svg);

}



/************************************************************************************************************/

function redrawHisto2DStackDouble(div,svg){

  var clientRect = div.node().getBoundingClientRect();
  var divWidth = Math.max(1.15*svg.tableWidth + svg.margin.left + svg.margin.right + 1, clientRect.width),
    divHeight = Math.max(svg.margin.bottom + svg.margin.top + svg.margin.zero + 1, clientRect.height);
  //console.log("width " + divWidth );

  var oldsvgheight = svg.height;
  var oldsvgwidth = svg.width;

  svg.attr("width",divWidth-1.15*svg.tableWidth).attr("height",divHeight);

  svg.width = divWidth-1.15*svg.tableWidth - svg.margin.left - svg.margin.right;
  svg.height = divHeight - svg.margin.bottom - svg.margin.top;

  var maxHeight = svg.height/2, table;
  table = svg.divLegend.divtableOut.table.style("max-height",maxHeight + "px");
  svg.divLegend.divtableOut.style("margin-bottom",maxHeight - parseInt(table.style("height"),10) + "px");
  table = svg.divLegend.divtableIn.table.style("max-height",maxHeight + "px");
  svg.divLegend.divtableIn.style("margin-bottom",maxHeight - parseInt(table.style("height"),10) + "px");

  var oldheightoutput = svg.heightOutput;


  var margIncTransl = Math.max(-svg.margin.zero,Math.min(svg.transform.y + (svg.transform.k*svg.scaley)*oldheightoutput,0));
  var margInView = Math.max(-svg.margin.zero,Math.min((svg.transform.y-oldsvgheight) + (svg.transform.k*svg.scaley)*oldheightoutput,0)) - margIncTransl;

  var oldheightData = svg.heightData;
  svg.heightData = svg.height - svg.margin.zero;
  svg.heightOutput = svg.heightOutput*svg.heightData/oldheightData;


  //console.log("marginview " + margInView);


  var ratiox = svg.width/oldsvgwidth;

  svg.x.range([0, svg.width]);

  svg.yInput.range([svg.heightOutput+svg.margin.zero,svg.height]);
  svg.yOutput.range([svg.heightOutput,0]);

  svg.svg.attr("width",svg.width).attr("height",svg.height);



  svg.rectInput.attr("width",svg.width);

  axisXDoubleDraw(svg);

  svg.frame.select(".rectOverlay").attr("height",svg.height);



  //console.log("marincltransl " + margIncTransl);
  svg.transform.y = (svg.transform.y - margIncTransl) * (svg.height + margInView)/(oldsvgheight + margInView) + margIncTransl;
  svg.transform.x *= ratiox;

  var oldscaleytot = svg.transform.k*svg.scaley;

  var scaleytot = oldscaleytot * (svg.height + margInView) * oldheightData / (svg.heightData * (oldsvgheight + margInView)) ;

  var scalextot = svg.transform.k*svg.scalex;

  svg.transform.k = Math.max(scalextot,scaleytot);
  svg.scalex = scalextot/svg.transform.k;
  svg.scaley = scaleytot/svg.transform.k;

  svg.newX.range([0,svg.width]);

  var marginViewTop = Math.min(svg.height,Math.max(-svg.margin.zero,
    svg.heightOutput*scaleytot+svg.transform.y));

  var marginViewBottom = marginViewTop + svg.margin.zero;

  svg.newYOutput.range([marginViewTop,Math.min(marginViewTop,0)]);
  svg.newYInput.range([marginViewBottom, Math.max(marginViewBottom,svg.height)]);


  svg._groups[0][0].__zoom.k =svg.transform.k;
  svg._groups[0][0].__zoom.x =svg.transform.x;
  svg._groups[0][0].__zoom.y =svg.transform.y;

  updateHisto2DStackDouble(svg);

  redrawPopup(div.overlay, svg);


}


/***********************************************************************************************************/


function addZoomDouble(svg,updateFunction){

  if(svg.svg == undefined){
    svg.svg=svg;
  }

  //Scales to update the current view (if not already implemented for specific reasons)
  if(svg.newX == undefined){
    svg.newX = d3.scaleLinear().range(svg.x.range()).domain(svg.x.domain());
  }
  if(svg.newYOutput == undefined) {
    svg.newYOutput = d3.scaleLinear().range(svg.yOutput.range()).domain(svg.yOutput.domain());
  }

  if(svg.newYInput == undefined) {
    svg.newYInput = d3.scaleLinear().range(svg.yInput.range()).domain(svg.yInput.domain());
  }

  //Selection rectangle for zooming (if not already implemented for better display control)
  if(svg.selec == undefined){
    svg.selec = svg.frame.append("rect").attr("class", "rectSelec");
  }



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

  //to stop triggering animations during rectselec
  var rectOverlay = svg.frame.append("rect").attr("x",0).attr("y",0)
    .attr("height",svg.height).attr("width",0).attr("fill-opacity",0).classed("rectOverlay",true);

  var event = {k:1,x:0,y:0};

  var marginViewTop, marginViewBottom;
  var calcCoord = [];


  svg.heightData = svg.height - svg.margin.zero;



  svg.zoom = d3.zoom().scaleExtent([1, Infinity]).on("zoom", function () {

      rectOverlay.attr("width",svg.width);

      if(isNaN(startCoord[0])){

        var lastEvent = {k:event.k,x:event.x,y:event.y};
        event = d3.event.transform;

        if(event.k == lastEvent.k){
          //case: translation

          //Avoid some "false" executions
          if(event.k  != 1){
            svg.style("cursor", "move");

          }

          //actualization of the translation vector (translate) within the x&y ranges frames
          svg.transform.x = Math.min(0, Math.max(event.x,svg.width - event.k*svg.scalex*svg.width));
          svg.transform.y = Math.min(0, Math.max(event.y,svg.height - event.k*svg.scaley*svg.heightData - svg.margin.zero));

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

          //console.log("zoom " + svg.translate + " e.t " + e.translate);


          //actualization of the translation vector with the scale change
          svg.transform.x*= xrel;

          //actualization of the translation vector (translate) to the top left corner of our view within the standard x&y.range() frame
          //If possible, the absolute location pointed by the cursor stay the same
          //Since zoom.translate(translate) doesn't work immediately but at the end of all consecutive zoom actions,
          //we can't rely on d3.event.translate for smooth zooming and have to separate zoom & translation
          svg.transform.x = Math.min(0, Math.max(svg.transform.x - calcCoord[0]*(xrel - 1),svg.width - event.k*svg.scalex*svg.width ));

          var oldMouse = calcCoord[1] - svg.transform.y;

          var newMouse = oldMouse* yrel + Math.min(svg.margin.zero, Math.max(0,oldMouse - svg.heightOutput*svg.transform.k*lastScaley))*(1 - yrel);
          svg.transform.y = oldMouse - newMouse + svg.transform.y;
          svg.transform.y = Math.min(0, Math.max(svg.transform.y,svg.height - event.k*svg.scaley*svg.heightData - svg.margin.zero));

          //console.log("newmouse :" + newMouse + " oldMouse :" + oldMouse);

          svg.transform.k = event.k;

          //console.log(" lastScalex " + lastScalex + " scalex " + svg.scalex + " lastScaley " + lastScaley + " scaley " + svg.scaley + " xrel " + xrel + " yrel " + yrel);
        }



        actTranslate[0] = -svg.transform.x/(svg.scalex*event.k);
        actTranslate[1] = -svg.transform.y/(svg.scaley*event.k);

        marginViewTop = Math.min(svg.height,Math.max(-svg.margin.zero,
          svg.heightOutput*svg.transform.k*svg.scaley+svg.transform.y));

        marginViewBottom = marginViewTop + svg.margin.zero;

        //actualization of the current (newX&Y) scales domains
        svg.newX.domain([ svg.x.invert(actTranslate[0]), svg.x.invert(actTranslate[0] + svg.width/(svg.transform.k*svg.scalex)) ]);

        svg.newYOutput.range([marginViewTop,Math.min(marginViewTop,0)]);
        svg.newYInput.range([marginViewBottom, Math.max(marginViewBottom,svg.height)]);

        svg.newYOutput.domain([svg.yOutput.invert(svg.height/(svg.transform.k*svg.scaley) + actTranslate[1]),
          svg.yOutput.invert(actTranslate[1])]);

        svg.newYInput.domain([svg.yInput.invert(actTranslate[1]  + (1-1/(svg.transform.k*svg.scaley))*svg.margin.zero),
          svg.yInput.invert(actTranslate[1] + (1-1/(svg.transform.k*svg.scaley))*svg.margin.zero + svg.height/(svg.transform.k*svg.scaley))]);



        updateFunction(svg);



      } else {

        mouseCoord = d3.mouse(svg.frame.node());

        //Drawing of the selection rect
        //console.log("carré mousecoord " + mouseCoord + " start " + startCoord );

        mouseCoord[0] = Math.min(Math.max(mouseCoord[0],svg.x.range()[0]),svg.x.range()[1]);
        mouseCoord[1] = Math.min(Math.max(mouseCoord[1],0),svg.height);

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

      if(null !== d3.event.sourceEvent && d3.event.sourceEvent.shiftKey){
        console.log("key is down start");
        startCoord = d3.mouse(svg.frame.node());
        startCoord[0] = Math.min(Math.max(startCoord[0],svg.x.range()[0]),svg.x.range()[1]);
        startCoord[1] = Math.min(Math.max(startCoord[1],0),svg.height);

        svg.style("cursor","crosshair");
      }

    })
    .on("end", function () {

      rectOverlay.attr("width",0);

      if(!isNaN(startCoord[0]) && !isNaN(mouseCoord[0])){


        svg.selec.attr("width",  0)
          .attr("height", 0);

        //Top left corner coordinates of the selection rectangle
        var xmin = Math.min(mouseCoord[0],startCoord[0]);
        var ymin = Math.min(mouseCoord[1],startCoord[1]);
        var ymax = ymin + Math.abs(mouseCoord[1] - startCoord[1]);


        var marginIncl = Math.max(0,ymax - ymin + svg.margin.zero -
          Math.max(svg.heightOutput*svg.transform.k*svg.scaley + svg.transform.y + svg.margin.zero,ymax)
          + Math.min(ymin,svg.heightOutput*svg.transform.k*svg.scaley + svg.transform.y));

        var sqheight = ymax - ymin - marginIncl;


        var sqwidth = Math.abs(mouseCoord[0] - startCoord[0]);


        if(sqwidth != 0 && sqheight != 0){

          var lastScale = svg.transform.k;
          var lastScalex = svg.scalex;
          var lastScaley = svg.scaley;



          //Repercussion on the translate vector
          svg.transform.x -= xmin;
          svg.transform.y -= ymin;

          //Evaluation of the total scale change from the beginning, by axis.
          svg.scalex = svg.width*svg.transform.k*svg.scalex/sqwidth;

          svg.scaley = (svg.height-marginIncl)*svg.transform.k*svg.scaley/sqheight;

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
          svg.transform.y = svg.transform.y*yrel + Math.max(-svg.margin.zero,Math.min(svg.transform.y + lastScaley*lastScale*svg.heightOutput,0))*(1-yrel);


          actTranslate[1] = -svg.transform.y/(svg.scaley*svg.transform.k);
          marginViewTop = Math.min(svg.height,Math.max(-svg.margin.zero,
            svg.heightOutput*svg.transform.k*svg.scaley+svg.transform.y));
          marginViewBottom = marginViewTop + svg.margin.zero;


          //actualization of the current (newX&Y) scales domains
          svg.newX.domain([ svg.newX.invert(xmin), svg.newX.invert(xmin + sqwidth)]);

          svg.newYOutput.range([marginViewTop,Math.min(marginViewTop,0)]);
          svg.newYInput.range([marginViewBottom, Math.max(marginViewBottom,svg.height)]);

          svg.newYOutput.domain([svg.yOutput.invert(svg.height/(svg.transform.k*svg.scaley) + actTranslate[1]),
            svg.yOutput.invert(actTranslate[1])]);

          svg.newYInput.domain([svg.yInput.invert(actTranslate[1]  + (1-1/(svg.transform.k*svg.scaley))*svg.margin.zero),
            svg.yInput.invert(actTranslate[1] + (1-1/(svg.transform.k*svg.scaley))*svg.margin.zero + svg.height/(svg.transform.k*svg.scaley))]);


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

      svg.on("contextmenu.zoomReset",doubleZoomReset(svg,updateFunction));

    });

  svg.call(svg.zoom);

  //A fresh start...
  svg._groups[0][0].__zoom.k =svg.transform.k;
  svg._groups[0][0].__zoom.x =svg.transform.x;
  svg._groups[0][0].__zoom.y =svg.transform.y;
}

/***********************************************************************************************************/

function hideShowValuesDouble(svg,trSelec,selectionIn,selectionOut,xlength){
  var duration = 800;
  var trSelecSize = trSelec.size();
  var hiddenValues = [];
  var stringifiedIn = JSON.stringify(svg.valuesIn);
  var stringifiedOut = JSON.stringify(svg.valuesOut);

  var newValuesIn = JSON.parse(stringifiedIn);
  var newValuesOut = JSON.parse(stringifiedOut);
  var valuesInTrans = JSON.parse(stringifiedIn);
  var valuesOutTrans = JSON.parse(stringifiedOut);
  selectionIn.data(valuesInTrans);
  selectionOut.data(valuesOutTrans);

  trSelec.on("click",function(d){
    var totalSumIn = [];
    var totalSumOut = [];
    var clickedRow = d3.select(this);


    svg.transition("hideshow").duration(duration).tween("",function(){



      var x;
      var sum;
      var i;

      if(svg.popup.pieChart !==null){
        return;
      }

      var index = hiddenValues.indexOf(d.item);

      
      
      
      
      if( index === -1){
        //Hide the data
        hiddenValues.push(d.item);
        clickedRow.classed("strikedRow",true);

        x=svg.valuesIn[0].x;
        i=0;

        while(x < xlength){
          sum=0;
          while(i <  newValuesIn.length && newValuesIn[i].x == x){
            if(newValuesIn[i].item === d.item){
              newValuesIn[i].height = 0;
            }
            newValuesIn[i].y = sum;
            sum += newValuesIn[i].height;
            i++;
          }
          totalSumIn.push(sum);
          x++;
        }

        x = svg.valuesOut[0].x;
        i=0;

        while(x < xlength){
          sum=0;

          while(i <  newValuesOut.length && newValuesOut[i].x == x){
            if(newValuesOut[i].item === d.item){
              newValuesOut[i].height = 0;
            }
            sum += newValuesOut[i].height;
            newValuesOut[i].y = sum;
            i++;
          }
          totalSumOut.push(sum);
          x++;
        }


      }else{
        //Show the data
        hiddenValues.splice(index,1);
        clickedRow.classed("strikedRow",false);


        x=svg.valuesIn[0].x;
        i=0;

        while(x < xlength){
          sum=0;
          while(i <  newValuesIn.length && newValuesIn[i].x == x){
            if(newValuesIn[i].item === d.item){
              newValuesIn[i].height = svg.valuesIn[i].height;
            }
            newValuesIn[i].y = sum;
            sum += newValuesIn[i].height;
            i++;
          }
          totalSumIn.push(sum);
          x++;
        }

        x = svg.valuesOut[0].x;
        i=0;

        while(x < xlength){
          sum=0;

          while(i <  newValuesOut.length && newValuesOut[i].x == x){
            if(newValuesOut[i].item === d.item){
              newValuesOut[i].height = svg.valuesOut[i].height;
            }
            sum += newValuesOut[i].height;
            newValuesOut[i].y = sum;
            i++;
          }
          totalSumOut.push(sum);
          x++;
        }


      }



      var newTotalIn;
      var newTotalOut;

      if(hiddenValues.length === trSelecSize){
        newTotalIn=1;
        newTotalOut=1;
      }else{
        newTotalIn=d3.max(totalSumIn);
        newTotalOut=d3.max(totalSumOut);
      }

      var oldTotalIn = svg.yInput.domain()[1]/1.1;
      var oldTotalOut = svg.yOutput.domain()[1]/1.1;

      var valuesInStart = JSON.parse(JSON.stringify(valuesInTrans));
      var valuesOutStart = JSON.parse(JSON.stringify(valuesOutTrans));


      var t0,totalInTrans, totalOutTrans;

      return function(t){

        t=Math.min(1,Math.max(0,t));
        t0 = (1-t);

        valuesInTrans.forEach(function(elem,i){
          elem.y = t0*valuesInStart[i].y + t*newValuesIn[i].y;
          elem.height = t0*valuesInStart[i].height + t*newValuesIn[i].height;
        });

        valuesOutTrans.forEach(function(elem,i){
          elem.y = t0*valuesOutStart[i].y + t*newValuesOut[i].y;
          elem.height = t0*valuesOutStart[i].height + t*newValuesOut[i].height;
        });


        totalInTrans = oldTotalIn* t0 + newTotalIn*t;
        totalOutTrans = oldTotalOut*t0 + newTotalOut*t;
        var actTranslate1 = -svg.transform.y/(svg.scaley*svg.transform.k);

        svg.heightOutput = (svg.height - svg.margin.zero)*totalOutTrans/(totalInTrans+totalOutTrans);

        var marginViewTop = Math.min(svg.height,Math.max(-svg.margin.zero,
          svg.heightOutput*svg.transform.k*svg.scaley+svg.transform.y));
        var marginViewBottom = marginViewTop + svg.margin.zero;

        svg.yInput.range([svg.heightOutput+svg.margin.zero,svg.height]);
        svg.yOutput.range([svg.heightOutput,0]);
        svg.yInput.domain([0,totalInTrans*1.1]);
        svg.yOutput.domain([0,totalOutTrans*1.1]);
        svg.newYOutput.range([marginViewTop,Math.min(marginViewTop,0)]);
        svg.newYInput.range([marginViewBottom, Math.max(marginViewBottom,svg.height)]);
        svg.newYOutput.domain([svg.yOutput.invert(svg.height/(svg.transform.k*svg.scaley) + actTranslate1),
          svg.yOutput.invert(actTranslate1)]);

        svg.newYInput.domain([svg.yInput.invert(actTranslate1  + (1-1/(svg.transform.k*svg.scaley))*svg.margin.zero),
          svg.yInput.invert(actTranslate1 + (1-1/(svg.transform.k*svg.scaley))*svg.margin.zero + svg.height/(svg.transform.k*svg.scaley))]);


        updateHisto2DStackDouble(svg);

      }



    });


  });

  trSelec.on("contextmenu",function(d) {

    d3.event.preventDefault();

    var totalSumIn = [];
    var totalSumOut = [];
    var clickedRow = d3.select(this);

    svg.transition("hideshow").duration(duration).tween("",function(){


      var x;
      var sum;
      var i;

      if (svg.popup.pieChart !== null) {
        return;
      }

      var index = hiddenValues.indexOf(d.item);


      if ((index !== -1) || (trSelecSize - 1 !== hiddenValues.length )) {

        //Hide all data except this one
        hiddenValues = trSelec.data().map(function (elem) {
          return elem.item;
        });
        hiddenValues.splice(hiddenValues.indexOf(d.item), 1);

        trSelec.classed("strikedRow", true);
        clickedRow.classed("strikedRow", false);



        x=svg.valuesIn[0].x;
        i=0;

        while(x < xlength){
          sum=0;
          while(i <  newValuesIn.length && newValuesIn[i].x == x){
            if(newValuesIn[i].item !== d.item){
              newValuesIn[i].height = 0;
            }else{
              newValuesIn[i].height = svg.valuesIn[i].height;
            }
            newValuesIn[i].y = sum;
            sum += newValuesIn[i].height;
            i++;
          }
          totalSumIn.push(sum);
          x++;
        }

        x = svg.valuesOut[0].x;
        i=0;

        while(x < xlength){
          sum=0;

          while(i <  newValuesOut.length && newValuesOut[i].x == x){
            if(newValuesOut[i].item !== d.item){
              newValuesOut[i].height = 0;
            }else{
              newValuesOut[i].height = svg.valuesOut[i].height;
            }

            sum += newValuesOut[i].height;
            newValuesOut[i].y = sum;
            i++;
          }
          totalSumOut.push(sum);
          x++;
        }


      } else {
        //index === -1 && hiddenValues.length == trSelec.size() -1
        // ->show all data.
        hiddenValues = [];
        trSelec.classed("strikedRow", false);

        x=svg.valuesIn[0].x;
        i=0;

        while(x < xlength){
          sum=0;
          while(i <  newValuesIn.length && newValuesIn[i].x == x){
            newValuesIn[i].height = svg.valuesIn[i].height;
            newValuesIn[i].y = sum;
            sum += newValuesIn[i].height;
            i++;
          }
          totalSumIn.push(sum);
          x++;
        }

        x = svg.valuesOut[0].x;
        i=0;

        while(x < xlength){
          sum=0;

          while(i <  newValuesOut.length && newValuesOut[i].x == x){

            newValuesOut[i].height = svg.valuesOut[i].height;
            sum += newValuesOut[i].height;
            newValuesOut[i].y = sum;
            i++;
          }
          totalSumOut.push(sum);
          x++;
        }


      }



      var newTotalIn = Math.max(0.000000001,d3.max(totalSumIn));
      var newTotalOut = Math.max(0.000000001,d3.max(totalSumOut));

      var oldTotalIn = svg.yInput.domain()[1]/1.1;
      var oldTotalOut = svg.yOutput.domain()[1]/1.1;

      var valuesInStart = JSON.parse(JSON.stringify(valuesInTrans));
      var valuesOutStart = JSON.parse(JSON.stringify(valuesOutTrans));

      var t0,totalInTrans, totalOutTrans;

      return function(t){

        t=Math.min(1,Math.max(0,t));
        t0 = (1-t);

        valuesInTrans.forEach(function(elem,i){
          elem.y = t0*valuesInStart[i].y + t*newValuesIn[i].y;
          elem.height = t0*valuesInStart[i].height + t*newValuesIn[i].height;
        });

        valuesOutTrans.forEach(function(elem,i){
          elem.y = t0*valuesOutStart[i].y + t*newValuesOut[i].y;
          elem.height = t0*valuesOutStart[i].height + t*newValuesOut[i].height;
        });


        totalInTrans = oldTotalIn* t0 + newTotalIn*t;
        totalOutTrans = oldTotalOut*t0 + newTotalOut*t;
        var actTranslate1 = -svg.transform.y/(svg.scaley*svg.transform.k);
        svg.heightOutput = (svg.height - svg.margin.zero)*totalOutTrans/(totalInTrans+totalOutTrans);

        var marginViewTop = Math.min(svg.height,Math.max(-svg.margin.zero,
          svg.heightOutput*svg.transform.k*svg.scaley+svg.transform.y));

        var marginViewBottom = marginViewTop + svg.margin.zero;

        svg.yInput.range([svg.heightOutput+svg.margin.zero,svg.height]);
        svg.yOutput.range([svg.heightOutput,0]);
        svg.yInput.domain([0,totalInTrans*1.1]);
        svg.yOutput.domain([0,totalOutTrans*1.1]);
        svg.newYOutput.range([marginViewTop,Math.min(marginViewTop,0)]);
        svg.newYInput.range([marginViewBottom, Math.max(marginViewBottom,svg.height)]);
        svg.newYOutput.domain([svg.yOutput.invert(svg.height/(svg.transform.k*svg.scaley) + actTranslate1),
          svg.yOutput.invert(actTranslate1)]);

        svg.newYInput.domain([svg.yInput.invert(actTranslate1  + (1-1/(svg.transform.k*svg.scaley))*svg.margin.zero),
          svg.yInput.invert(actTranslate1 + (1-1/(svg.transform.k*svg.scaley))*svg.margin.zero + svg.height/(svg.transform.k*svg.scaley))]);


        updateHisto2DStackDouble(svg);

      }



    });


  });


}