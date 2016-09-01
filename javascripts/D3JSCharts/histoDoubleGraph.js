/**
 * Created by elie.
 */

/**
 * Creates a double stacked histogram with zoom, resize, transition and popup features.
 * @param div {Object} D3 encapsulated parent div element.
 * @param svg {Object} D3 encapsulated parent svg element, direct child of div parameter.
 * @param mydiv {String} Div identifier.
 * @param urlJson {String} Url to request the data to the server.
 */

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
      noData(div, svg,mydiv, error?error:json&&json.response&&json.response.data&&json.response.data.length === 0?
        "No data to display for the given interval":json&&json.response&&json.response.errMsg?json.response.errMsg:"error result conformity");
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

    svg.yBottom = d3.scaleLinear().clamp(true);

    svg.yTop = d3.scaleLinear().clamp(true);

    svg.svg = svg.append("svg").attr("x", svg.margin.left).attr("y", svg.margin.top).attr("width", svg.width).attr("height", svg.height).classed("crisp",true);


    //Will contain the chart itself, without the axis
    svg.chartBackground = svg.svg.append("g");


    svg.chartBottom = svg.svg.append('g');
    svg.chartTop = svg.svg.append('g');


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
      noData(div,svg,mydiv, "error no value found");
      return;
    }



    svg.units = unitsStringProcessing(json.units);



    console.log(json);



    svg.valuesBottom = [];
    svg.valuesTop = [];

    var dataLength = jsonData.length;

    var colorMap = new Map();
    svg.sumMap = new Map();
    var sumMapBottom = new Map();
    var sumMapTop = new Map();

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


      mapElemToSum(svg.sumMap, elemToPush, elemJson, contentDisplayValue,itemType);

      svg.timeMin = Math.min(svg.timeMin,elemToPush.x);
      timeMax = Math.max(timeMax,elemToPush.x);

      if(elemJson[contentDirectionValue] === "IN"){
        elemToPush.direction = "inc";

        mapElemToSum(sumMapTop, elemToPush, elemJson, contentDisplayValue,itemType);
        svg.valuesTop.push(elemToPush);

      }else{

        mapElemToSum(sumMapBottom, elemToPush, elemJson, contentDisplayValue,itemType);
        svg.valuesBottom.push(elemToPush)

      }


    }


    //


    var sumArray = [];
    var sumArrayBottom = [];
    var sumArrayTop = [];



    var f = colorEval();


    svg.sumMap.forEach(mapToArray(sumArray));
    sumMapBottom.forEach(mapToArray(sumArrayBottom));
    sumMapTop.forEach(mapToArray(sumArrayTop));



    sumArray.sort(sortArrayVolume);



    i = 0;
    if (sumArray[0].item == " Remainder " || sumArray[0].item == "OTHERS") {
      colorMap.set(sumArray[0].item, "#f2f2f2");
      i = 1;
    }

    while (i < sumArray.length) {
      colorMap.set(sumArray[i].item, f());
      i++;
    }

    //sort alphabetically

    sumArrayBottom.sort(sortAlphabet);
    sumArrayTop.sort(sortAlphabet);
    sumArray.sort(sortAlphabet);



    //step = 1 hour by default
    svg.step = (urlJson.indexOf("pset=DAILY") === -1)?3600000:86400000;

    svg.valuesBottom.forEach(function(elem){
      elem.x = (elem.x - svg.timeMin)/svg.step
    });

    svg.valuesTop.forEach(function(elem){
      elem.x = (elem.x - svg.timeMin)/svg.step
    });


    svg.valuesBottom.sort(sortValues);
    svg.valuesTop.sort(sortValues);

    var xMax = (timeMax - svg.timeMin)/svg.step + 1;


    //Evaluation of the abscissa domain
    svg.x.domain([-0.625, xMax - 0.375]);

    var totalSumBottom = [];
    var totalSumTop = [];

    var x = 0;
    var sum = 0;
    i = 0;

    while (x < xMax) {

      while (i < svg.valuesBottom.length && svg.valuesBottom[i].x == x) {
        svg.valuesBottom[i].y = sum;
        sum += svg.valuesBottom[i].height;
        i++;
      }
      totalSumBottom.push(sum);
      sum = 0;
      x++;
    }

    x = 0;
    i = 0;

    while (x < xMax) {

      while (i < svg.valuesTop.length && svg.valuesTop[i].x == x) {
        sum += svg.valuesTop[i].height;
        svg.valuesTop[i].y = sum;
        i++;
      }
      totalSumTop.push(sum);
      sum = 0;
      x++;
    }


    svg.totalBottom = d3.max(totalSumBottom);
    svg.totalTop = d3.max(totalSumTop);

    svg.heightTop = (svg.height - svg.margin.zero) * svg.totalTop / (svg.totalBottom + svg.totalTop);

    svg.yBottom.range([svg.heightTop + svg.margin.zero, svg.height]);
    svg.yTop.range([svg.heightTop, 0]);


    //the *1.1 operation allow a little margin
    svg.yBottom.domain([0, svg.totalBottom * 1.1]);
    svg.yTop.domain([0, svg.totalTop * 1.1]);

    //Text background


    svg.rectBottom = svg.chartBackground.append("rect").attr("x", 0).attr("y", svg.heightTop + svg.margin.zero)
      .attr("width", svg.width)
      .attr("height", svg.height - svg.heightTop - svg.margin.zero)
      .style("fill", "#e6e6e6");


    svg.textTop = svg.chartBackground.append("text").classed("bckgr-txt", true)
      .style("fill", "#e6e6e6")
      .text("Ingress");

    svg.textTop.attr("transform", "translate(" + (svg.width / 2) + "," + (svg.heightTop / 8 +
      parseFloat(getComputedStyle(svg.textTop.node()).fontSize)) + ")");


    svg.textBottom = svg.chartBackground.append("text").attr("transform", "translate(" + (svg.width / 2) + "," +
        ((svg.height + (svg.heightTop + svg.margin.zero) / 3) * 0.75) + ")")
      .classed("bckgr-txt", true)
      .text("Egress")
      .style("fill", "#fff");


    //Here, the grid, after the rectInput & the text
    svg.grid = svg.chartBackground.append("g").classed("grid", true);



    svg.newX = d3.scaleLinear().range(svg.x.range()).domain(svg.x.domain());
    svg.newYTop = d3.scaleLinear().range(svg.yTop.range()).domain(svg.yTop.domain());
    svg.newYBottom = d3.scaleLinear().range(svg.yBottom.range()).domain(svg.yBottom.domain());

    var selectionBottom = svg.chartBottom.selectAll(".data")
      .data(svg.valuesBottom)
      .enter().append("rect")
      .classed("data", true)
      .attr("fill", function (d) {
        return colorMap.get(d.item);
      })
      .attr("stroke", "#000000");

    var selectionTop = svg.chartTop.selectAll(".data")
      .data(svg.valuesTop)
      .enter().append("rect")
      .classed("data", true)
      .attr("fill", function (d) {
        return colorMap.get(d.item);
      })
      .attr("stroke", "#000000");


    drawChartDouble(svg,  svg.yTop.range()[0],svg.yBottom.range()[0]);

    var selection = svg.selectAll(".data");

    //Tooltip creation

    createTooltipHisto(svg,selection,svg.sumMap);


    var blink = blinkCreate(colorMap);

    svg.activeItem = null;

    function activationElemsFromTable(direction){
      if(direction === "In"){

        return function(d){
          if (svg.popup.pieChart !== null) {
            return;
          }

          svg.activeItem = {item: d.item, direction: "inc"};

          function testitem(data) {
            return d.item === data.item;
          }

          trSelecTop.filter(testitem).classed("outlined", true);
          selectionTop.filter(testitem).each(blink);

        };

      }

      return function(d){
        if (svg.popup.pieChart !== null) {
          return;
        }

        svg.activeItem = {item: d.item, direction: "out"};

        function testitem(data) {
          return d.item === data.item;

        }

        trSelecBottom.filter(testitem).classed("outlined", true);
        selectionBottom.filter(testitem).each(blink);

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

      if(d.direction === "inc"){

        elem = trSelecTop.filter(testitem).classed("outlined", true);

        scrollToElementTableTransition(elem,svg.divLegend.divtableTop.table);

        selectionTop.filter(testitem).each(blink);

      }else{

        elem = trSelecBottom.filter(testitem).classed("outlined", true);

        scrollToElementTableTransition(elem,svg.divLegend.divtableBottom.table);

        selectionBottom.filter(testitem).each(blink);

      }

    }

    function activationElemsAutoScrollPopup(d) {

      svg.activeItem = {item: d.item, direction: d.direction};


      function testitem(data) {

        return d.item == data.item;

      }

      var elem;

      if(d.direction === "inc"){

        elem = trSelecTop.filter(testitem).classed("outlined", true);
        scrollToElementTableTransition(elem,svg.divLegend.divtableTop.table);

      }else{

        elem = trSelecBottom.filter(testitem).classed("outlined", true);
        scrollToElementTableTransition(elem,svg.divLegend.divtableBottom.table);

      }

    }

    function deactivationElems() {

      if (svg.activeItem === null || svg.popup.pieChart !== null) {
        return;
      }

      var activeItem = svg.activeItem.item;

      function testitem(data) {
        return data.item == activeItem;
      }


      if(svg.activeItem.direction === "inc"){


        trSelecTop.filter(testitem).classed("outlined", false);

        selectionTop.filter(testitem).interrupt().attr("stroke", "#000000").attr("fill", colorMap.get(activeItem));


      }else{

        trSelecBottom.filter(testitem).classed("outlined", false);

        selectionBottom.filter(testitem).interrupt().attr("stroke", "#000000").attr("fill", colorMap.get(activeItem));


      }


      svg.activeItem = null;

    }



    svg.axisx = svg.append("g")
      .attr("class", "axisGraph")
      .attr('transform', 'translate(' + [svg.margin.left, svg.heightTop + svg.margin.top] + ")");

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
    
    if(svg.hasPopup) {
      addPopup(selection, div, svg, function (data) {
          deactivationElems();
          activationElemsAutoScrollPopup(data);
        },
        deactivationElems);
    }else{
      svg.popup = [];
      svg.popup.pieChart = null;
    }




    selection.on("mouseover", activationElemsAutoScroll).on("mouseout", deactivationElems);


    //Now, no more nodata can happen,so we create the table
    svg.divLegend = div.append("div").classed("diagram", true).style("vertical-align", "top").style("width", svg.tableWidth + "px");

    var trSelecTop = createTableLegendDouble(svg,"In",sumArrayTop,colorMap, activationElemsFromTable,deactivationElems);
    var trSelecBottom = createTableLegendDouble(svg,"Out",sumArrayBottom,colorMap, activationElemsFromTable,deactivationElems);

    //zoom




    addZoomDouble(svg, updateHisto2DStackDouble);
    d3.select(window).on("resize." + mydiv, function () {
      console.log("resize");
      redrawHisto2DStackDouble(div, svg);

    });

  });


}

/**
 * Creates a double stacked histogram with zoom, resize, transition and popup features.
 * This function differs from createHisto2DStackDouble in the json's format it receives from the server.
 * @param div {Object} D3 encapsulated parent div element.
 * @param svg {Object} D3 encapsulated parent svg element, direct child of div parameter.
 * @param mydiv {String} Div identifier.
 * @param urlJson {String} Url to request the data to the server.
 */

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
      noData(div, svg,mydiv, error?error:json&&json.response&&json.response.data&&json.response.data.length === 0 ?
        "No data to display for the given interval":json&&json.response&&json.response.errMsg?json.response.errMsg:"error result conformity");
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

    svg.yBottom = d3.scaleLinear().clamp(true);

    svg.yTop = d3.scaleLinear().clamp(true);

    svg.svg = svg.append("svg").attr("x", svg.margin.left).attr("y", svg.margin.top).attr("width", svg.width).attr("height", svg.height).classed("crisp",true);


    //Will contain the chart itself, without the axis
    svg.chartBackground = svg.svg.append("g");


    svg.chartBottom = svg.svg.append('g');
    svg.chartTop = svg.svg.append('g');


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
      noData(div,svg,mydiv,"error no date found");
      return;
    }


    if(json.units){
      svg.units = unitsStringProcessing(json.units);
    }else{
      svg.units = "";
    }

    console.log(json);



    svg.valuesBottom = [];
    svg.valuesTop = [];

    var dataLength = jsonData.length;
    var contentLength = jsonContent.length;




    //More useful jsonContent. 0: item / 1: direction
    for(i = 0; i < contentLength; i++){

      if(i === contentDateValue){
        continue;
      }

      var tempArrayName = jsonContent[i].split("_");

      if(tempArrayName[tempArrayName.length - 1] === ""){
        tempArrayName.splice(tempArrayName.length - 1, 1);
      }

      var strName = tempArrayName[0];

      for(var w = 1; w < tempArrayName.length - 1; w++){

          strName = strName + " " + tempArrayName[w];

      }

      jsonContent[i] = [strName, tempArrayName[tempArrayName.length-1]];

      if(svg.units !== "hosts"){

        jsonContent[i][0] = jsonContent[i][0].toUpperCase();

      }


    }

    console.log(jsonContent);



    var colorMap = new Map();
    svg.sumMap = new Map();
    var sumMapBottom = new Map();
    var sumMapTop = new Map();

    var i,j,k, elemJson, elemToPush, elemSumMap,timeElem;
    svg.timeMin = Infinity;
    var timeMax = 0;


    svg.hourShift = getTimeShift(urlJson)  * 3600000;



    // Data are processed and sorted according to their direction.

    if(svg.step === 60000){

      if(jsonData[dataLength - 1][0][0] === "current"){
        jsonData[0].push(jsonData[1][0]);
        jsonData = jsonData[0];
        dataLength = jsonData.length;
      }

      var dateCurrent = getDateCurrent(urlJson);

      var elemAmountMinuteArray, elemAmountMinuteArrayLength;

      for(i = 0; i < dataLength; i++){
        elemJson = jsonData[i];

        for(j = 0; j < contentLength; j++){

          if(j === contentDateValue){
            continue;
          }

          elemAmountMinuteArray = elemJson[j];

          if(elemJson[contentDateValue] !== "current"){
            timeElem = (new Date(elemJson[contentDateValue])).getTime() - 3600000  + svg.hourShift;
          }
          else{
            timeElem = dateCurrent.getTime();
          }

          console.log(elemAmountMinuteArray);
          elemAmountMinuteArrayLength = elemAmountMinuteArray.length;

          for(k = 0; k < elemAmountMinuteArrayLength; k++) {

            if(+elemAmountMinuteArray[k] === 0 || !elemAmountMinuteArray[k]){
              continue;
            }

            elemToPush = {
              //we add the correct minutes according to the position k
              //of the element in the array
              x: timeElem + k*svg.step,
              height: +elemAmountMinuteArray[k],
              item: jsonContent[j][0],
              direction: jsonContent[j][1]
            };

            // .display kept, can have an use someday
            if (!svg.sumMap.has(elemToPush.item)) {
              svg.sumMap.set(elemToPush.item, {sum: elemToPush.height, display: elemToPush.item});
            } else {
              elemSumMap = svg.sumMap.get(elemToPush.item);
              elemSumMap.sum += elemToPush.height;
            }

            svg.timeMin = Math.min(svg.timeMin, elemToPush.x);
            timeMax = Math.max(timeMax, elemToPush.x);

            if (elemToPush.direction === "in" || elemToPush.direction === "inc") {
              elemToPush.direction = "inc";


              if (!sumMapTop.has(elemToPush.item)) {
                sumMapTop.set(elemToPush.item, {sum: elemToPush.height, display: elemToPush.item});
              } else {
                elemSumMap = sumMapTop.get(elemToPush.item);
                elemSumMap.sum += elemToPush.height;
              }

              svg.valuesTop.push(elemToPush);

            } else {


              if (!sumMapBottom.has(elemToPush.item)) {
                sumMapBottom.set(elemToPush.item, {sum: elemToPush.height, display: elemToPush.item});
              } else {
                elemSumMap = sumMapBottom.get(elemToPush.item);
                elemSumMap.sum += elemToPush.height;
              }


              svg.valuesBottom.push(elemToPush)

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
          if (!svg.sumMap.has(elemToPush.item)) {
            svg.sumMap.set(elemToPush.item, {sum: elemToPush.height,display: elemToPush.item});
          } else {
            elemSumMap = svg.sumMap.get(elemToPush.item);
            elemSumMap.sum += elemToPush.height;
          }

          svg.timeMin = Math.min(svg.timeMin,elemToPush.x);
          timeMax = Math.max(timeMax,elemToPush.x);

          if(elemToPush.direction === "in" || elemToPush.direction === "inc"){
            elemToPush.direction = "inc";


            if (!sumMapTop.has(elemToPush.item)) {
              sumMapTop.set(elemToPush.item, {sum: elemToPush.height, display: elemToPush.item});
            } else {
              elemSumMap = sumMapTop.get(elemToPush.item);
              elemSumMap.sum += elemToPush.height;
            }

            svg.valuesTop.push(elemToPush);

          }else{


            if (!sumMapBottom.has(elemToPush.item)) {
              sumMapBottom.set(elemToPush.item, {sum: elemToPush.height, display: elemToPush.item});
            } else {
              elemSumMap = sumMapBottom.get(elemToPush.item);
              elemSumMap.sum += elemToPush.height;
            }


            svg.valuesBottom.push(elemToPush)

          }


        }


      }

    }

    //



    var sumArray = [];
    var sumArrayBottom = [];
    var sumArrayTop = [];



    var f = colorEval();


    svg.sumMap.forEach(mapToArray(sumArray));
    sumMapBottom.forEach(mapToArray(sumArrayBottom));
    sumMapTop.forEach(mapToArray(sumArrayTop));




    sumArray.sort(sortArrayVolume);



    i = 0;
    if (sumArray[0].item == " Remainder " || sumArray[0].item == "OTHERS") {
      colorMap.set(sumArray[0].item, "#f2f2f2");
      i = 1;
    }

    while (i < sumArray.length) {
      colorMap.set(sumArray[i].item, f());
      i++;
    }


    //sort alphabetically

    sumArray.sort(sortAlphabet);
    sumArrayBottom.sort(sortAlphabet);
    sumArrayTop.sort(sortAlphabet);



    svg.valuesBottom.forEach(function(elem){
      elem.x = (elem.x - svg.timeMin)/svg.step
    });

    svg.valuesTop.forEach(function(elem){
      elem.x = (elem.x - svg.timeMin)/svg.step
    });



    svg.valuesBottom.sort(sortValues);
    svg.valuesTop.sort(sortValues);

    var xMax = (timeMax - svg.timeMin)/svg.step + 1;


    //Evaluation of the abscissa domain
    svg.x.domain([-0.625, xMax - 0.375]);

    var totalSumBottom = [];
    var totalSumTop = [];

    var x = 0;
    var sum = 0;
    i = 0;

    while (x < xMax) {

      while (i < svg.valuesBottom.length && svg.valuesBottom[i].x == x) {
        svg.valuesBottom[i].y = sum;
        sum += svg.valuesBottom[i].height;
        i++;
      }
      totalSumBottom.push(sum);
      sum = 0;
      x++;
    }

    x = 0;
    i = 0;

    while (x < xMax) {

      while (i < svg.valuesTop.length && svg.valuesTop[i].x == x) {
        sum += svg.valuesTop[i].height;
        svg.valuesTop[i].y = sum;
        i++;
      }
      totalSumTop.push(sum);
      sum = 0;
      x++;
    }


    svg.totalBottom = Math.max(1,d3.max(totalSumBottom));
    svg.totalTop = Math.max(1,d3.max(totalSumTop));

    svg.heightTop = (svg.height - svg.margin.zero) * svg.totalTop / (svg.totalBottom + svg.totalTop);

    svg.yBottom.range([svg.heightTop + svg.margin.zero, svg.height]);
    svg.yTop.range([svg.heightTop, 0]);


    //the *1.1 operation allow a little margin
    svg.yBottom.domain([0, svg.totalBottom * 1.1]);
    svg.yTop.domain([0, svg.totalTop * 1.1]);

    //Text background


    svg.rectBottom = svg.chartBackground.append("rect").attr("x", 0).attr("y", svg.heightTop + svg.margin.zero)
      .attr("width", svg.width)
      .attr("height", svg.height - svg.heightTop - svg.margin.zero)
      .style("fill", "#e6e6e6");


    svg.textTop = svg.chartBackground.append("text").classed("bckgr-txt", true)
      .style("fill", "#e6e6e6")
      .text("Ingress");

    svg.textTop.attr("transform", "translate(" + (svg.width / 2) + "," + (svg.heightTop / 8 +
      parseFloat(getComputedStyle(svg.textTop.node()).fontSize)) + ")");


    svg.textBottom = svg.chartBackground.append("text").attr("transform", "translate(" + (svg.width / 2) + "," +
        ((svg.height + (svg.heightTop + svg.margin.zero) / 3) * 0.75) + ")")
      .classed("bckgr-txt", true)
      .text("Egress")
      .style("fill", "#fff");


    //Here, the grid, after the rectInput & the text
    svg.grid = svg.chartBackground.append("g").classed("grid", true);



    svg.newX = d3.scaleLinear().range(svg.x.range()).domain(svg.x.domain());
    svg.newYTop = d3.scaleLinear().range(svg.yTop.range()).domain(svg.yTop.domain());
    svg.newYBottom = d3.scaleLinear().range(svg.yBottom.range()).domain(svg.yBottom.domain());

    var selectionBottom = svg.chartBottom.selectAll(".data")
      .data(svg.valuesBottom)
      .enter().append("rect")
      .classed("data", true)
      .attr("fill", function (d) {
        return colorMap.get(d.item);
      })
      .attr("stroke", "#000000");

    var selectionTop = svg.chartTop.selectAll(".data")
      .data(svg.valuesTop)
      .enter().append("rect")
      .classed("data", true)
      .attr("fill", function (d) {
        return colorMap.get(d.item);
      })
      .attr("stroke", "#000000");


    drawChartDouble(svg,svg.yTop.range()[0],svg.yBottom.range()[0]);

    var selection = svg.selectAll(".data");

    //Tooltip creation

    createTooltipHisto(svg,selection,svg.sumMap);


    var blink = blinkCreate(colorMap);

    svg.activeItem = null;

    function activationElemsFromTable(direction){
      if(direction === "In"){

        return function(d){
          if (svg.popup.pieChart !== null) {
            return;
          }

          svg.activeItem = {item: d.item, direction: "inc"};

          function testitem(data) {
            return d.item === data.item;

          }

          trSelecTop.filter(testitem).classed("outlined", true);
          selectionTop.filter(testitem).each(blink);

        };

      }

      return function(d){
        if (svg.popup.pieChart !== null) {
          return;
        }

        svg.activeItem = {item: d.item, direction: "out"};

        function testitem(data) {
          return d.item === data.item;

        }

        trSelecBottom.filter(testitem).classed("outlined", true);
        selectionBottom.filter(testitem).each(blink);

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

      if(d.direction === "inc"){

        elem = trSelecTop.filter(testitem).classed("outlined", true);

        scrollToElementTableTransition(elem,svg.divLegend.divtableTop.table);

        selectionTop.filter(testitem).each(blink);

      }else{

        elem = trSelecBottom.filter(testitem).classed("outlined", true);

        scrollToElementTableTransition(elem,svg.divLegend.divtableBottom.table);

        selectionBottom.filter(testitem).each(blink);

      }

    }

    function activationElemsAutoScrollPopup(d) {


      svg.activeItem = {item: d.item, direction: d.direction};


      function testitem(data) {
        return d.item == data.item;

      }

      var elem;

      if(d.direction === "inc"){

        elem = trSelecTop.filter(testitem).classed("outlined", true);

        scrollToElementTableTransition(elem,svg.divLegend.divtableTop.table);

      }else{

        elem = trSelecBottom.filter(testitem).classed("outlined", true);

        scrollToElementTableTransition(elem,svg.divLegend.divtableBottom.table);

      }

    }

    function deactivationElems() {

      if (svg.activeItem == null || svg.popup.pieChart !== null) {
        return;
      }

      var activeItem = svg.activeItem.item;

      function testitem(data) {
        return data.item == activeItem;
      }

      if(svg.activeItem.direction === "inc"){

        trSelecTop.filter(testitem).classed("outlined", false);

        selectionTop.filter(testitem).interrupt().attr("stroke", "#000000").attr("fill", colorMap.get(activeItem));


      }else{

        trSelecBottom.filter(testitem).classed("outlined", false);

        selectionBottom.filter(testitem).interrupt().attr("stroke", "#000000").attr("fill", colorMap.get(activeItem));

      }


      svg.activeItem = null;

    }



    svg.axisx = svg.append("g")
      .attr("class", "axisGraph")
      .attr('transform', 'translate(' + [svg.margin.left, svg.heightTop + svg.margin.top] + ")");

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



    if(svg.hasPopup) {
      addPopup(selection, div, svg, function (data) {
          deactivationElems();
          activationElemsAutoScrollPopup(data);
        },
        deactivationElems);
    }else{
      svg.popup = [];
      svg.popup.pieChart = null;
    }

    selection.on("mouseover", activationElemsAutoScroll).on("mouseout", deactivationElems);

    //Now, no more nodata can happen,so we create the table
    svg.divLegend = div.append("div").classed("diagram", true).style("vertical-align", "top").style("width", svg.tableWidth + "px");

    var trSelecTop = createTableLegendDouble(svg,"In",sumArrayTop,colorMap, activationElemsFromTable,deactivationElems);
    var trSelecBottom = createTableLegendDouble(svg,"Out",sumArrayBottom,colorMap, activationElemsFromTable,deactivationElems);

    //zoom
    addZoomDouble(svg, updateHisto2DStackDouble);
    d3.select(window).on("resize." + mydiv, function () {
      console.log("resize");
      redrawHisto2DStackDouble(div, svg);
    });

  });

}

/**
 * Effectively redraws the double stacked histogram.
 * @param svg {Object} D3 encapsulated parent svg element.
 */


function updateHisto2DStackDouble(svg){

  /*
   svg.chartOutput.attr("transform","matrix(" + (svg.scalex*svg.scale) + ", 0, 0, " + (svg.scaley*svg.scale) + ", " + svg.translate[0] + "," + svg.translate[1] + ")" );
   svg.chartInput.attr("transform","matrix(" + (svg.scalex*svg.scale) + ", 0, 0, " + (svg.scaley*svg.scale) + ", " + svg.translate[0] + "," + (svg.translate[1] - (svg.scaley*svg.scale-1)*svg.margin.zero) + ")" );
   */


  var newHeightTop = svg.newYTop(svg.yTop.domain()[0]);
  var newHOmarg = svg.newYBottom(svg.yBottom.domain()[0]);

  var effectiveNewHeightTop = Math.min(newHeightTop, svg.height);
  svg.rectBottom.attr("y", newHOmarg).attr("height",Math.max(0,svg.height-newHOmarg));
  svg.textTop.attr("transform", "translate(" + (svg.width/2) + "," +(effectiveNewHeightTop/8 +
    parseFloat(getComputedStyle(svg.textTop.node()).fontSize)) + ")");



  svg.textBottom.attr("transform", "translate(" + (svg.width/2) + "," +
    ((svg.height + Math.max(0,newHOmarg)/3) *0.75) + ")");


  drawChartDouble(svg,newHeightTop,newHOmarg);

  svg.axisx.call(d3.axisBottom(svg.newX));

  ticksSecondAxisXDouble(svg);

  legendAxisX(svg);

  svg.axisx.attr("transform","matrix(1, 0, 0, 1," + svg.margin.left+ "," + Math.min(svg.margin.top + svg.height,Math.max(svg.margin.top - svg.margin.zero,(svg.heightTop)*svg.transform.k*svg.scaley +svg.margin.top + svg.transform.y)) + ")" );


  axesDoubleUpdate(svg);
  optionalAxesDoubleUpdate(svg);

  gridDoubleGraph(svg);

}


/**
 * Called when a resize occurs on the div parameter.
 * Adjusts svg's internal variables before calling updateHisto2DStackDouble which effectively redraw the graph.
 * @param div {Object} D3 encapsulated parent div element.
 * @param svg {Object} D3 encapsulated parent svg element, direct child of div parameter.
 */

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
  table = svg.divLegend.divtableTop.table.style("max-height",maxHeight + "px");
  svg.divLegend.divtableTop.style("margin-bottom",maxHeight - parseInt(table.style("height"),10) + "px");
  table = svg.divLegend.divtableBottom.table.style("max-height",maxHeight + "px");
  svg.divLegend.divtableBottom.style("margin-bottom",maxHeight - parseInt(table.style("height"),10) + "px");

  var oldheighttop = svg.heightTop;


  var margIncTransl = Math.max(-svg.margin.zero,Math.min(svg.transform.y + (svg.transform.k*svg.scaley)*oldheighttop,0));
  var margInView = Math.max(-svg.margin.zero,Math.min((svg.transform.y-oldsvgheight) + (svg.transform.k*svg.scaley)*oldheighttop,0)) - margIncTransl;

  var oldheightData = svg.heightData;
  svg.heightData = svg.height - svg.margin.zero;
  svg.heightTop = svg.heightTop*svg.heightData/oldheightData;


  //console.log("marginview " + margInView);


  var ratiox = svg.width/oldsvgwidth;

  svg.x.range([0, svg.width]);

  svg.yBottom.range([svg.heightTop+svg.margin.zero,svg.height]);
  svg.yTop.range([svg.heightTop,0]);

  svg.svg.attr("width",svg.width).attr("height",svg.height);



  svg.rectBottom.attr("width",svg.width);

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
    svg.heightTop*scaleytot+svg.transform.y));

  var marginViewBottom = marginViewTop + svg.margin.zero;

  svg.newYTop.range([marginViewTop,Math.min(marginViewTop,0)]);
  svg.newYBottom.range([marginViewBottom, Math.max(marginViewBottom,svg.height)]);


  svg._groups[0][0].__zoom.k =svg.transform.k;
  svg._groups[0][0].__zoom.x =svg.transform.x;
  svg._groups[0][0].__zoom.y =svg.transform.y;

  updateHisto2DStackDouble(svg);

  redrawPopup(div.overlay, svg);


}


/**
 * Add zoom feature to the stacked double histogram.
 * @param svg {Object} D3 encapsulated parent svg element.
 * @param updateFunction {Function} The function that will be called to update the view of the graph.
 */


function addZoomDouble(svg,updateFunction){

  if(svg.svg == undefined){
    svg.svg=svg;
  }

  //Scales to update the current view (if not already implemented for specific reasons)
  if(svg.newX == undefined){
    svg.newX = d3.scaleLinear().range(svg.x.range()).domain(svg.x.domain());
  }
  if(svg.newYTop == undefined) {
    svg.newYTop = d3.scaleLinear().range(svg.yTop.range()).domain(svg.yTop.domain());
  }

  if(svg.newYBottom == undefined) {
    svg.newYBottom = d3.scaleLinear().range(svg.yBottom.range()).domain(svg.yBottom.domain());
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

          var newMouse = oldMouse* yrel + Math.min(svg.margin.zero, Math.max(0,oldMouse - svg.heightTop*svg.transform.k*lastScaley))*(1 - yrel);
          svg.transform.y = oldMouse - newMouse + svg.transform.y;
          svg.transform.y = Math.min(0, Math.max(svg.transform.y,svg.height - event.k*svg.scaley*svg.heightData - svg.margin.zero));

          //console.log("newmouse :" + newMouse + " oldMouse :" + oldMouse);

          svg.transform.k = event.k;

          //console.log(" lastScalex " + lastScalex + " scalex " + svg.scalex + " lastScaley " + lastScaley + " scaley " + svg.scaley + " xrel " + xrel + " yrel " + yrel);
        }



        actTranslate[0] = -svg.transform.x/(svg.scalex*event.k);
        actTranslate[1] = -svg.transform.y/(svg.scaley*event.k);

        marginViewTop = Math.min(svg.height,Math.max(-svg.margin.zero,
          svg.heightTop*svg.transform.k*svg.scaley+svg.transform.y));

        marginViewBottom = marginViewTop + svg.margin.zero;

        //actualization of the current (newX&Y) scales domains
        svg.newX.domain([ svg.x.invert(actTranslate[0]), svg.x.invert(actTranslate[0] + svg.width/(svg.transform.k*svg.scalex)) ]);

        svg.newYTop.range([marginViewTop,Math.min(marginViewTop,0)]);
        svg.newYBottom.range([marginViewBottom, Math.max(marginViewBottom,svg.height)]);

        svg.newYTop.domain([svg.yTop.invert(svg.height/(svg.transform.k*svg.scaley) + actTranslate[1]),
          svg.yTop.invert(actTranslate[1])]);

        svg.newYBottom.domain([svg.yBottom.invert(actTranslate[1]  + (1-1/(svg.transform.k*svg.scaley))*svg.margin.zero),
          svg.yBottom.invert(actTranslate[1] + (1-1/(svg.transform.k*svg.scaley))*svg.margin.zero + svg.height/(svg.transform.k*svg.scaley))]);



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
          Math.max(svg.heightTop*svg.transform.k*svg.scaley + svg.transform.y + svg.margin.zero,ymax)
          + Math.min(ymin,svg.heightTop*svg.transform.k*svg.scaley + svg.transform.y));

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
          svg.transform.y = svg.transform.y*yrel + Math.max(-svg.margin.zero,Math.min(svg.transform.y + lastScaley*lastScale*svg.heightTop,0))*(1-yrel);


          actTranslate[1] = -svg.transform.y/(svg.scaley*svg.transform.k);
          marginViewTop = Math.min(svg.height,Math.max(-svg.margin.zero,
            svg.heightTop*svg.transform.k*svg.scaley+svg.transform.y));
          marginViewBottom = marginViewTop + svg.margin.zero;


          //actualization of the current (newX&Y) scales domains
          svg.newX.domain([ svg.newX.invert(xmin), svg.newX.invert(xmin + sqwidth)]);

          svg.newYTop.range([marginViewTop,Math.min(marginViewTop,0)]);
          svg.newYBottom.range([marginViewBottom, Math.max(marginViewBottom,svg.height)]);

          svg.newYTop.domain([svg.yTop.invert(svg.height/(svg.transform.k*svg.scaley) + actTranslate[1]),
            svg.yTop.invert(actTranslate[1])]);

          svg.newYBottom.domain([svg.yBottom.invert(actTranslate[1]  + (1-1/(svg.transform.k*svg.scaley))*svg.margin.zero),
            svg.yBottom.invert(actTranslate[1] + (1-1/(svg.transform.k*svg.scaley))*svg.margin.zero + svg.height/(svg.transform.k*svg.scaley))]);


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

