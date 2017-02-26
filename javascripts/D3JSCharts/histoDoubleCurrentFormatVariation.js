/**
 * Created by elie on 07/09/16.
 */

/********************************************************************************************************************/

function createHistoDoubleCurrentFormatVariation(div,svg,mydiv,urlJson){

  console.log(urlJson);

  d3.json(urlJson, function (error, json) {

    setStartDate(svg);

    svg.margin.left = 50;
    svg.margin.right = 50;
    svg.margin.top = 20;
    svg.margin.bottom = 20;
    svg.margin.zero = 28;

    console.log(json);
    //test json conformity
    if (typeof json === "undefined" || json.result != "true" || typeof json.response.data === "undefined" || error) {
      noData(div, svg,mydiv, error?error:json&&json.response&&json.response.errMsg?json.response.errMsg:"error result conformity");
      return false;
    }

    //json ok, graph creation

    if("netTopCountryTraffic" === svg.typeGraph || svg.typeGraph === "hostTopCountryTraffic")
    {
      var button = div.append("button").text("Switch to map").classed("buttonMap", true).remove();
      div.node().insertBefore(button.node(), svg.node());

      /*********************/
      button.on("click",function(){
        cleanDiv(div,svg);
        myLastHourHistory.unsubscribe(urlJson, svg.id);
        d3.select(window).on("resize." + mydiv, null);
        var newSvg = svg.node().cloneNode(true);
        div.node().replaceChild(newSvg,svg.node());
        svg = d3.select(newSvg);

        lastSvg = svg;

        svg.margin = {top: 20, right: 50, bottom: 20, left: 60, zero:28};
        svg.urlJson = urlJson;

        createChoroplethDirection(div,svg,mydiv,urlJson);

      })
    }

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
    svg.step = 60000;

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

      if(svg.units !== "hosts")
      {
        jsonContent[i][0] = jsonContent[i][0].toUpperCase();
      }
    }

    console.log(jsonContent);


    svg.colorMap = new Map();
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
       //     console.error("hourshift="+svg.hourShift);
          }
          else{
            timeElem = dateCurrent.getTime();
          }

          //console.log(elemAmountMinuteArray);
          elemAmountMinuteArrayLength = elemAmountMinuteArray.length;

          for(k = 0; k < elemAmountMinuteArrayLength; k++)
          {

            if(+elemAmountMinuteArray[k] === 0 || !elemAmountMinuteArray[k]){
              continue;
            }

            elemToPush =
            {
              //we add the correct minutes according to the position k
              //of the element in the array
              x: timeElem + k*svg.step,
              height: +elemAmountMinuteArray[k],
              heightRef: +elemAmountMinuteArray[k],
              item: jsonContent[j][0],
              direction: jsonContent[j][1]
            };

            // .display kept, can have an use someday
            if (!svg.sumMap.has(elemToPush.item))
            {
              svg.sumMap.set(elemToPush.item, {sum: elemToPush.height, display: elemToPush.item});
            }
            else
            {
              elemSumMap = svg.sumMap.get(elemToPush.item);
              elemSumMap.sum += elemToPush.height;
            }

            svg.timeMin = Math.min(svg.timeMin, elemToPush.x);
            timeMax = Math.max(timeMax, elemToPush.x);

            if (elemToPush.direction === "in" || elemToPush.direction === "inc") {
              elemToPush.direction = "inc";


              if (!sumMapTop.has(elemToPush.item))
              {
                sumMapTop.set(elemToPush.item, {sum: elemToPush.height, display: elemToPush.item});
              }
              else
              {
                elemSumMap = sumMapTop.get(elemToPush.item);
                elemSumMap.sum += elemToPush.height;
              }

              svg.valuesTop.push(elemToPush);
            }
            else
            {
              if (!sumMapBottom.has(elemToPush.item))
              {
                sumMapBottom.set(elemToPush.item, {sum: elemToPush.height, display: elemToPush.item});
              } else
              {
                elemSumMap = sumMapBottom.get(elemToPush.item);
                elemSumMap.sum += elemToPush.height;
              }

              svg.valuesBottom.push(elemToPush)
            }
          }
        }
      }
    }

    if(svg.timeMin === Infinity){
      svg.timeMin = 0;
    }

    //

    svg.sumArray = [];
    svg.sumArrayBottom = [];
    svg.sumArrayTop = [];

    svg.colorGenerator = colorEval();

    svg.sumMap.forEach(mapToArray(svg.sumArray));
    sumMapBottom.forEach(mapToArray(svg.sumArrayBottom));
    sumMapTop.forEach(mapToArray(svg.sumArrayTop));


    //sort alphabetically
    svg.sumArray.sort(sortArrayVolume);
    svg.sumArrayBottom.sort(sortAlphabet);
    svg.sumArrayTop.sort(sortAlphabet);


    svg.colorMap.set(" Remainder ", "#f2f2f2");
    svg.colorMap.set("OTHERS", "#f2f2f2");

    i = 0;
    if (i < svg.sumArray.length && (svg.sumArray[0].item == " Remainder " || svg.sumArray[0].item == "OTHERS"))
    {
      i = 1;
    }

    while (i < svg.sumArray.length)
    {
      svg.colorMap.set(svg.sumArray[i].item, svg.colorGenerator());
      i++;
    }


    svg.valuesBottom.forEach(function(elem){
      elem.x = (elem.x - svg.timeMin)/svg.step
    });

    svg.valuesTop.forEach(function(elem){
      elem.x = (elem.x - svg.timeMin)/svg.step
    });


    svg.valuesBottom.sort(sortValuesCurrent);
    svg.valuesTop.sort(sortValuesCurrent);

    svg.valuesBottomSCAlphabetSort = svg.valuesBottom.concat();
    svg.valuesBottomSCAlphabetSort.sort(sortAlphabetItemOnly);

    svg.valuesTopSCAlphabetSort = svg.valuesTop.concat();
    svg.valuesTopSCAlphabetSort.sort(sortAlphabetItemOnly);


    svg.xMax = (timeMax - svg.timeMin)/svg.step + 1;


    //Evaluation of the abscissa domain
    svg.x.domain([-0.625, svg.xMax - 0.375]);

    var totalSumBottom = [];
    var totalSumTop = [];

    var x = 0;
    var sum = 0;
    i = 0;

    while (x < svg.xMax) {

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

    while (x < svg.xMax) {

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
    svg.totalTop = Math.max(d3.max(totalSumTop));

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


    svg.selectionBottom = svg.chartBottom.selectAll(".data")
      .data(svg.valuesBottom)
      .enter().append("rect")
      .classed("data", true)
      .attr("fill", function (d) {
        return svg.colorMap.get(d.item);
      })
      .attr("stroke", "#000000");

    svg.selectionTop = svg.chartTop.selectAll(".data")
      .data(svg.valuesTop)
      .enter().append("rect")
      .classed("data", true)
      .attr("fill", function (d) {
        return svg.colorMap.get(d.item);
      })
      .attr("stroke", "#000000");


    drawChartDouble(svg,svg.yTop.range()[0],svg.yBottom.range()[0]);

    var selection = svg.selectAll(".data");

    //Tooltip creation

    createTooltipHistoCurrent(svg,selection,svg.sumMap);

    var blink = blinkCreate(svg.colorMap);


    svg.activeItem = null;

    /*********************/
    svg.activationElemsFromTable = function(direction)
    {
      if(direction === "In"){

        return function(d){
          if (svg.popup.pieChart !== null) {
            return;
          }

          svg.activeItem = {item: d.item, direction: "inc"};

          /*********************/
          function testitem(data) {
            return d.item === data.item;
          }

          svg.trSelecTop.filter(testitem).classed("outlined", true);
          svg.selectionTop.filter(testitem).each(blink);

        };

      }

      return function(d){
        if (svg.popup.pieChart !== null) {
          return;
        }

        svg.activeItem = {item: d.item, direction: "out"};

        /*********************/
        function testitem(data) {
          return d.item === data.item;
        }

        svg.trSelecBottom.filter(testitem).classed("outlined", true);
        svg.selectionBottom.filter(testitem).each(blink);

      };

    };

      /******************************************/

      svg.activationElemsAutoScroll = function(d) {

      if (svg.popup.pieChart !== null) {
        return;
      }

      svg.activeItem = {item: d.item, direction: d.direction};

      /*********************/
      function testitem(data) {
        return d.item == data.item;
      }

      var elem;

      if(d.direction === "inc"){

        elem = svg.trSelecTop.filter(testitem).classed("outlined", true);

        scrollToElementTableTransition(elem,svg.divLegend.divtableTop.table);

        svg.selectionTop.filter(testitem).each(blink);

      }else{

        elem = svg.trSelecBottom.filter(testitem).classed("outlined", true);

        scrollToElementTableTransition(elem,svg.divLegend.divtableBottom.table);

        svg.selectionBottom.filter(testitem).each(blink);

      }

    };

    /******************************************/

    svg.deactivationElems = function() {

      if (svg.activeItem === null || svg.popup.pieChart !== null) {
        return;
      }

      var activeItem = svg.activeItem.item;

      /***********************/

      function testitem(data)
      {
        return data.item == activeItem;
      }

      if(svg.activeItem.direction === "inc")
      {
        svg.trSelecTop.filter(testitem).classed("outlined", false);
        svg.selectionTop.filter(testitem).interrupt().attr("stroke", "#000000").attr("fill", svg.colorMap.get(activeItem));
      }
      else
      {
        svg.trSelecBottom.filter(testitem).classed("outlined", false);
        svg.selectionBottom.filter(testitem).interrupt().attr("stroke", "#000000").attr("fill", svg.colorMap.get(activeItem));
      }
      svg.activeItem = null;
    };

    /******************************************/

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

    //for the template...
    svg.popup = [];
    svg.popup.pieChart = null;

    selection.on("mouseover", svg.activationElemsAutoScroll).on("mouseout", svg.deactivationElems);

    //Now, no more nodata can happen,so we create the table
    svg.divLegend = div.append("div").classed("diagram", true).style("vertical-align", "top").style("width", svg.tableWidth + "px");

    svg.trSelecTop = createTableLegendDoubleCurrent(svg,"In",svg.sumArrayTop,svg.colorMap, svg.activationElemsFromTable,svg.deactivationElems);
    svg.trSelecBottom = createTableLegendDoubleCurrent(svg,"Out",svg.sumArrayBottom,svg.colorMap, svg.activationElemsFromTable,svg.deactivationElems);

    //zoom
    addZoomDouble(svg, updateHisto2DStackDouble);
    d3.select(window).on("resize." + mydiv, function () {
      console.log("resize");
      redrawHisto2DStackDouble(div, svg);

    });

    timerupdate(urlJson,mydiv);
    //autoUpdateDoubleCurrentFormatVariation(svg,urlJson, div);

  }); //d3.json end

} //function end

/********************************************************************************************************************/

function timerupdate(urlJson, mydiv){

  console.error (urlJson);

  var df = getParamUrlJson(urlJson,"df");
  var dh = getParamUrlJson(urlJson, "dh");
  urlJson = removeParamUrl(urlJson,"df");
  var array = df.split("%3A");

    var timesliceValue = $("#timesliceCharts").val();

    switch (timesliceValue) {
        case "lastHour" :
        case "lastDay" :
        case "lastWeek" :
        case "lastMonth" :
            myServerDate.addCallback("theGraph", drawChartFromInterfaceUpdate, [urlJson, mydiv], 500);
            break;
        default :
            break;
    }
}

drawChartFromInterfaceUpdate = function (date, params) {
  var dh = getParamUrlJson(params[0], "dh");
  df = moment(date).add(parseInt(dh), "hours").format('YYYY-MM-DD+HH:mm');
  urlJson = params[0] + "&df=" + df;
  console.error ("urlJson:" + urlJson);
  drawChartFromInterface( urlJson, params[1] /* mydiv */ );
}

/**********************************************************************************************************************/
/**
 * Allows the graph to actualize its data on real-time by subscribing to a websocket.
 * @param svg {Object} D3 encapsulated parent svg element.
 * @param urlJson {String} Url to request the data to the server.
 * @param div {Object} D3 encapsulated parent div element.
 */

function autoUpdateDoubleCurrentFormatVariation(svg,urlJson, div){

  //The transition seems to really harm the performances of the computer when not 0 and tab inactive for too long.
  //Maybe take a look at that someday to see if something can somehow be done...
  svg.updateTransitionDuration = 0;

  var onUpdate = false;

  var responsesFIFOList = [];

  //We suppose that urljson doesn't contain a minute parameter

  svg.id = myLastHourHistory.addMinuteRequest(urlJson,
    function(json, notifdate){

      if(unsubscribeGraphIfInactive(svg.id, urlJson, div)){
        console.log("unsubscribe");
        return;
      }

      responsesFIFOList.push([json, notifdate]);
      console.log("update list responses");

      if(onUpdate){
        console.log("on Update");
        return;
      }

      onUpdate = true;

      var resp= responsesFIFOList.shift();
      updateGraph(resp[0],resp[1]);

    }
    ,svg.lastMinute);

  /********************************************************************************************************************/

  function updateGraph(json, notificationDate){

    svg.deactivationElems();

    var gapMinute = (notificationDate.getTime() - notificationDate.getTimezoneOffset() * 60000 - svg.startDate.getTime() - 3540000)/60000;
    console.log(json);

    svg.lastMinute = notificationDate.getMinutes();

    svg.timeMin += gapMinute * 60000;
    svg.startDate = new Date(svg.timeMin);


    var processedDataArray = [];

    var jsonData = json.data;

    processServices(jsonData,json.content,svg);

    jsonData.forEach(function(minuteAndElems){

      var position = trueModulo(minuteAndElems[0] - svg.lastMinute, 60)  + gapMinute + 59;

      minuteAndElems[1].forEach(function(elem){

        elem.push(position);
        processedDataArray.push(elem);
      });
    });

    jsonData = processedDataArray;

    var dataLength = jsonData.length;

    var sumMapBottomUpdate = new Map();
    var sumMapTopUpdate = new Map();
    var sumMapUpdate = new Map();

    var valuesTopNew = [];
    var valuesBottomNew = [];

    var i, elemJson, elemToPush;

    var itemType = json.content[svg.contentItemValue];

    // Data are processed and sorted according to their direction.
    for(i = 0; i < dataLength; i++){
      elemJson = jsonData[i];

      if(+elemJson[svg.contentAmountValue] === 0){
        continue;
      }

      elemToPush = {
        x: elemJson[svg.contentXPositionValue],
        heightRef: +elemJson[svg.contentAmountValue],
        item: ((elemJson[svg.contentItemValue] === "")?" Remainder ":elemJson[svg.contentItemValue]) + "",
        direction: elemJson[svg.contentDirectionValue].toLowerCase()
      };



      if(elemJson[svg.contentDirectionValue] === "IN"){
        elemToPush.direction = "inc";


        if(!svg.mapPercentDisplayByItemTop.has(elemToPush.item)){
          svg.mapPercentDisplayByItemTop.set(elemToPush.item,{percentDisplay:1});
        }

        elemToPush.height = elemToPush.heightRef*svg.mapPercentDisplayByItemTop.get(elemToPush.item).percentDisplay;


        mapElemToSumCurrent(sumMapTopUpdate, elemToPush, elemJson, svg.contentDisplayValue,itemType);
        valuesTopNew.push(elemToPush);

      }else{


        if(!svg.mapPercentDisplayByItemBottom.has(elemToPush.item)){
          svg.mapPercentDisplayByItemBottom.set(elemToPush.item,{percentDisplay:1});
        }

        elemToPush.height = elemToPush.heightRef*svg.mapPercentDisplayByItemBottom.get(elemToPush.item).percentDisplay;



        mapElemToSumCurrent(sumMapBottomUpdate, elemToPush, elemJson, svg.contentDisplayValue,itemType);
        valuesBottomNew.push(elemToPush)

      }

      mapElemToSumCurrent(sumMapUpdate, elemToPush, elemJson, svg.contentDisplayValue,itemType);

    }

    sumMapUpdate.forEach(function(value, key){

      if(!svg.colorMap.has(key)){
        svg.colorMap.set(key, svg.colorGenerator());
      }

    });


    valuesTopNew.sort(sortValuesCurrent);
    valuesBottomNew.sort(sortValuesCurrent);

    var totalSumBottomUpdate = [];
    var totalSumTopUpdate = [];

    var x = 60;

    var xMax = 60 + gapMinute;

    var sum = 0;
    i = 0;

    while (x < xMax) {

      while (i < valuesBottomNew.length && valuesBottomNew[i].x === x) {
        valuesBottomNew[i].y = sum;
        sum += valuesBottomNew[i].height;
        i++;
      }
      totalSumBottomUpdate.push(sum);
      sum = 0;
      x++;
    }

    x = 60;
    i = 0;

    while (x < xMax) {

      while (i < valuesTopNew.length && valuesTopNew[i].x === x) {
        sum += valuesTopNew[i].height;
        valuesTopNew[i].y = sum;
        i++;
      }
      totalSumTopUpdate.push(sum);
      sum = 0;
      x++;
    }

    svg.totalBottom = Math.max(svg.totalBottom,d3.max(totalSumBottomUpdate));
    svg.totalTop = Math.max(svg.totalTop,d3.max(totalSumTopUpdate));


    console.log(valuesTopNew);
    console.log(valuesBottomNew);


    removeValuesOnUpdate(svg,svg.valuesTop,sumMapTopUpdate,gapMinute);
    removeValuesOnUpdate(svg,svg.valuesBottom,sumMapBottomUpdate,gapMinute);

    sumMapUpdate.forEach(function(value,key){

      if(!svg.sumMap.has(key)){
        svg.sumMap.set(key,{sum:value.sum, display:value.display})
      }
    });


    svg.selectionTop = svg.chartTop.selectAll(".data");
    svg.valuesTop = svg.selectionTop.data();
    svg.valuesTop = svg.valuesTop.concat(valuesTopNew);

    svg.selectionBottom = svg.chartBottom.selectAll(".data");
    svg.valuesBottom = svg.selectionBottom.data();
    svg.valuesBottom = svg.valuesBottom.concat(valuesBottomNew);


    svg.selectionBottom = svg.chartBottom.selectAll(".data")
      .data(svg.valuesBottom);

    var selecBottomEnter = svg.selectionBottom.enter()
      .append("rect")
      .classed("data", true)
      .attr("fill", function (d) {
        return svg.colorMap.get(d.item);
      })
      .attr("stroke", "#000000");

    svg.selectionBottom = selecBottomEnter.merge(svg.selectionBottom);

    svg.selectionTop = svg.chartTop.selectAll(".data")
      .data(svg.valuesTop);

    var selecTopEnter = svg.selectionTop.enter()
      .append("rect")
      .classed("data", true)
      .attr("fill", function (d) {
        return svg.colorMap.get(d.item);
      })
      .attr("stroke", "#000000");

    svg.selectionTop = selecTopEnter.merge(svg.selectionTop);

    selecTopEnter.on("mouseover", svg.activationElemsAutoScroll).on("mouseout", svg.deactivationElems);
    selecBottomEnter.on("mouseover", svg.activationElemsAutoScroll).on("mouseout", svg.deactivationElems);


    svg.valuesBottom.sort(sortValuesCurrent);
    svg.valuesTop.sort(sortValuesCurrent);

    svg.valuesBottomSCAlphabetSort = svg.valuesBottom.concat();
    svg.valuesBottomSCAlphabetSort.sort(sortAlphabetItemOnly);

    svg.valuesTopSCAlphabetSort = svg.valuesTop.concat();
    svg.valuesTopSCAlphabetSort.sort(sortAlphabetItemOnly);

    updateScalesDouble(svg);

    svg.transition("updateX").duration(svg.updateTransitionDuration).ease(d3.easeLinear).tween("",function(){

        var lastT = 0;
        var coef;
        return function(t){

          coef = (lastT - t)*gapMinute;

          svg.valuesBottom.forEach(function(elem){
            elem.x = elem.x + coef;
          });

          svg.valuesTop.forEach(function(elem){
            elem.x = elem.x + coef;
          });

          lastT = t;

          updateHisto2DStackDouble(svg);
        }

      })
      .on("end",function(){

        var maxTotal = 1;

        svg.chartBottom.selectAll(".data").each(function(d){

          d.x = Math.round(d.x);
          if(d.x < 0){
            this.remove();
          }else{
            maxTotal = Math.max(maxTotal,d.y + d.height);
          }

        });

        svg.totalBottom = maxTotal;



        svg.selectionBottom = svg.chartBottom.selectAll(".data");
        svg.valuesBottom = svg.selectionBottom.data();

        maxTotal = 1;
        svg.chartTop.selectAll(".data").each(function(d){

          d.x = Math.round(d.x);
          if(d.x < 0){
            this.remove();
          }else{
            maxTotal = Math.max(maxTotal,d.y);
          }

        });

        svg.totalTop = maxTotal;


        svg.selectionTop = svg.chartTop.selectAll(".data");

        svg.valuesTop = svg.selectionTop.data();

        createTooltipHistoCurrent(svg,selecTopEnter,svg.sumMap);
        createTooltipHistoCurrent(svg,selecBottomEnter, svg.sumMap);

        svg.valuesTop.sort(sortValuesCurrent);
        svg.valuesBottom.sort(sortValuesCurrent);

        svg.valuesBottomSCAlphabetSort = svg.valuesBottom.concat();
        svg.valuesBottomSCAlphabetSort.sort(sortAlphabetItemOnly);

        svg.valuesTopSCAlphabetSort = svg.valuesTop.concat();
        svg.valuesTopSCAlphabetSort.sort(sortAlphabetItemOnly);

        updateSumArray(svg.sumArrayTop, sumMapTopUpdate,svg.hiddenValuesTopArray,svg.mapPercentDisplayByItemTop);
        updateSumArray(svg.sumArrayBottom, sumMapBottomUpdate,svg.hiddenValuesBottomArray,svg.mapPercentDisplayByItemBottom);

        svg.sumArrayBottom.sort(sortAlphabet);
        svg.sumArrayTop.sort(sortAlphabet);

        updateTrSelec(svg,"In");
        updateTrSelec(svg,"Out");


        calculationsHideShowDirection(svg);

        if(responsesFIFOList.length > 0){
          var resp= responsesFIFOList.shift();
          updateGraph(resp[0],resp[1]);
        }else{
          onUpdate = false;
        }

      });


  }

  /*

   if(typeof arrayAutoUpdate === "undefined"){
   arrayAutoUpdate =[[id, urlJson]]
   }else{
   arrayAutoUpdate.push([id, urlJson]);
   }*/

  console.log(svg.id);

}