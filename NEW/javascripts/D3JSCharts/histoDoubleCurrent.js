
function createHistoDoubleCurrent(div,svg,mydiv,urlJson){

  var effectiveUrlJson = urlJson;
  //some non-exhaustive tests on urlJson
  if(effectiveUrlJson.indexOf('?') === -1){
    effectiveUrlJson = effectiveUrlJson + "?minute=60";
  }else if(effectiveUrlJson.indexOf("minute") === -1){
    effectiveUrlJson = effectiveUrlJson + "&minute=60";
  }

  d3.json(effectiveUrlJson, function (error, json) {


    svg.startDate = (typeof serverDate === "string"?new Date(serverDate):serverDate);
    svg.startDate = new Date(svg.startDate.getTime() - (svg.startDate.getTimezoneOffset() + 59 )*60000);
    console.log(svg.startDate);

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


    svg.contentItemValue = searchItemValue(jsonContent);
    svg.contentAmountValue = searchAmountValue(jsonContent);
    svg.contentDirectionValue = searchDirectionValue(jsonContent);

    //optional display value for legend, no guaranty on uniqueness/existence.
    svg.contentDisplayValue = searchDisplayValue(jsonContent);

    //if no display value, then the display value is the item value.
    if (svg.contentDisplayValue === false){
      svg.contentDisplayValue = svg.contentItemValue;
    }

    //if no item/date/amount/direction value found, the graph can't be done.
    if(svg.contentItemValue === false || svg.contentAmountValue === false || svg.contentDirectionValue === false ){
      noData(div,svg,mydiv, "error no value found");
      return;
    }






    //Here jsonData should lists 60 minutes of data.
    svg.lastMinute = (jsonData.length === 0?60:jsonData[0][0]);

    if(svg.lastMinute !== 60){
      var firstMinute = jsonData[jsonData.length - 1][0];
      var maxInterval = trueModulo(svg.startDate.getMinutes() - 1 - firstMinute , 60);
      var dataInterval = trueModulo(svg.lastMinute - firstMinute, 60);

      if(dataInterval > maxInterval){
        svg.startDate = new Date(svg.startDate.getTime() - trueModulo(svg.startDate.getMinutes() - firstMinute,60) * 60000);
      }

      svg.lastMinute = trueModulo(svg.startDate.getMinutes() - 1, 60);
    }


    svg.timeMin = svg.startDate.getTime();
    console.log(svg.timeMin);

    var processedDataArray = [];
    

    jsonData.forEach(function(minuteAndElems){
      var position = trueModulo(minuteAndElems[0] - svg.lastMinute - 1, 60);
      minuteAndElems[1].forEach(function(elem){
        elem.push(position);
        processedDataArray.push(elem);
      });
    });

    console.log(processedDataArray);
    console.log(svg.startDate);

    svg.contentXPositionValue = jsonContent.length;

    jsonData = processedDataArray;
    






    svg.units = unitsStringProcessing(json.units);



    console.log(json);



    svg.valuesBottom = [];
    svg.valuesTop = [];

    var dataLength = jsonData.length;

    svg.colorMap = new Map();
    svg.sumMap = new Map();
    var sumMapBottom = new Map();
    var sumMapTop = new Map();

    var i, elemJson, elemToPush, elemSumMap;


    svg.hourShift = getTimeShift(urlJson)  * 3600000;

    var itemType = jsonContent[svg.contentItemValue];

    // Data are processed and sorted according to their direction.
    for(i = 0; i < dataLength; i++){
      elemJson = jsonData[i];

      if(+elemJson[svg.contentAmountValue] === 0){
        continue;
      }

      elemToPush = {
        x: elemJson[svg.contentXPositionValue],
        heightRef: +elemJson[svg.contentAmountValue],
        height: +elemJson[svg.contentAmountValue],
        item: (elemJson[svg.contentItemValue] === "")?" Remainder ":elemJson[svg.contentItemValue],
        direction: elemJson[svg.contentDirectionValue].toLowerCase()
      };


      mapElemToSum(svg.sumMap, elemToPush, elemJson, svg.contentDisplayValue,itemType);
      
      if(elemJson[svg.contentDirectionValue] === "IN"){
        elemToPush.direction = "inc";

        mapElemToSum(sumMapTop, elemToPush, elemJson, svg.contentDisplayValue,itemType);
        svg.valuesTop.push(elemToPush);

      }else{

        mapElemToSum(sumMapBottom, elemToPush, elemJson, svg.contentDisplayValue,itemType);
        svg.valuesBottom.push(elemToPush)

      }


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
    svg.sumArray.sort(sortAlphabet);
    svg.sumArrayBottom.sort(sortAlphabet);
    svg.sumArrayTop.sort(sortAlphabet);


    svg.colorMap.set(" Remainder ", "#f2f2f2");
    svg.colorMap.set("OTHERS", "#f2f2f2");

    i = 0;
    if (svg.sumArray[0].item == " Remainder " || svg.sumArray[0].item == "OTHERS") {
      i = 1;
    }

    while (i < svg.sumArray.length) {
      svg.colorMap.set(svg.sumArray[i].item, svg.colorGenerator());
      i++;
    }




    //step = 1 minute (real time)
    svg.step = 60000;
    

    svg.valuesBottom.sort(sortValues);
    svg.valuesTop.sort(sortValues);

    
    var xMax = 60;


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

    createTooltipHisto(svg,selection,svg.sumMap);


    var blink = blinkCreate(svg.colorMap);



    svg.activeItem = null;

    svg.activationElemsFromTable = function(direction){
      if(direction === "In"){

        return function(d){
          if (svg.popup.pieChart !== null) {
            return;
          }

          svg.activeItem = {item: d.item, direction: "inc"};

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

        function testitem(data) {
          return d.item === data.item;

        }

        svg.trSelecBottom.filter(testitem).classed("outlined", true);
        svg.selectionBottom.filter(testitem).each(blink);

      };

    };

    svg.activationElemsAutoScroll = function(d) {

      if (svg.popup.pieChart !== null) {
        return;
      }

      svg.activeItem = {item: d.item, direction: d.direction};


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


    svg.deactivationElems = function() {

      if (svg.activeItem === null || svg.popup.pieChart !== null) {
        return;
      }

      var activeItem = svg.activeItem.item;

      function testitem(data) {
        return data.item == activeItem;
      }


      if(svg.activeItem.direction === "inc"){


        svg.trSelecTop.filter(testitem).classed("outlined", false);

        svg.selectionTop.filter(testitem).interrupt().attr("stroke", "#000000").attr("fill", svg.colorMap.get(activeItem));


      }else{

        svg.trSelecBottom.filter(testitem).classed("outlined", false);

        svg.selectionBottom.filter(testitem).interrupt().attr("stroke", "#000000").attr("fill", svg.colorMap.get(activeItem));


      }


      svg.activeItem = null;

    };



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


    autoUpdateDoubleCurrent(svg,urlJson);

  }); //d3.json end


} //function end

/***********************************************************************************************************************/

function autoUpdateDoubleCurrent(svg,urlJson){

  svg.updateTransitionDuration = 1000;

  var onUpdate = false;

  var responsesFIFOList = [];

  //We suppose that urljson doesn't contain a minute parameter

  var id = myLastHourHistory.addMinuteRequest(urlJson,
    function(json, notifdate){
      responsesFIFOList.push([json, notifdate]);
      timeoutUpdate();
    }
    ,svg.lastMinute);

  function timeoutUpdate(){
    if(onUpdate){
      setTimeout(timeoutUpdate,500)
    }else{
      onUpdate = true;
      var resp = responsesFIFOList.shift();
      updateGraph(resp[0],resp[1]);
    }
  }

  function updateGraph(json, notificationDate){


    svg.deactivationElems();

    var gapMinute = (notificationDate.getTime() - notificationDate.getTimezoneOffset() * 60000 - svg.startDate.getTime() - 3540000)/60000;
    console.log(json);

    svg.lastMinute = notificationDate.getMinutes();

    svg.timeMin += gapMinute * 60000;
    svg.startDate = new Date(svg.timeMin);


    var processedDataArray = [];

    var jsonData = json.data;

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
        //heightRef: +elemJson[svg.contentAmountValue],
        height: +elemJson[svg.contentAmountValue],
        item: (elemJson[svg.contentItemValue] === "")?" Remainder ":elemJson[svg.contentItemValue],
        direction: elemJson[svg.contentDirectionValue].toLowerCase()
      };



      if(elemJson[svg.contentDirectionValue] === "IN"){
        elemToPush.direction = "inc";

        //TODO virer comms
        /*
        if(!svg.mapDisplayPercentByItemTop.has(elemToPush.item)){
          svg.mapDisplayPercentByItemTop.set(elemToPush.item,{percentDisplay:1});
        }

        elemToPush.height = elemToPush.heightRef*svg.mapDisplayPercentByItemTop.get(elemToPush.item).percentDisplay;
        */

        mapElemToSum(sumMapTopUpdate, elemToPush, elemJson, svg.contentDisplayValue,itemType);
        valuesTopNew.push(elemToPush);

      }else{

        /*
        if(!svg.mapDisplayPercentByItemBottom.has(elemToPush.item)){
          svg.mapDisplayPercentByItemBottom.set(elemToPush.item,{percentDisplay:1});
        }

        elemToPush.height = elemToPush.heightRef*svg.mapDisplayPercentByItemBottom.get(elemToPush.item).percentDisplay;

        */

        mapElemToSum(sumMapBottomUpdate, elemToPush, elemJson, svg.contentDisplayValue,itemType);
        valuesBottomNew.push(elemToPush)

      }

      mapElemToSum(sumMapUpdate, elemToPush, elemJson, svg.contentDisplayValue,itemType);

    }








    sumMapUpdate.forEach(function(value, key){

      if(!svg.colorMap.has(key)){
        svg.colorMap.set(key, svg.colorGenerator());
      }

    });


    valuesTopNew.sort(sortValues);
    valuesBottomNew.sort(sortValues);



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




    var totalBottomUpdate = d3.max(totalSumBottomUpdate);
    var totalTopUpdate = d3.max(totalSumTopUpdate);





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



    svg.transition("updateX").duration(svg.updateTransitionDuration).tween("",function(){

        var lastT = 0;

        return function(t){
          svg.valuesBottom.forEach(function(elem){
            elem.x = elem.x + (lastT - t)*gapMinute;
          });

          svg.valuesTop.forEach(function(elem){
            elem.x = elem.x + (lastT - t)*gapMinute;
          });

          lastT = t;

          updateHisto2DStackDouble(svg);
        }

      })
      .on("end",function(){

        svg.chartBottom.selectAll(".data").each(function(d){

          d.x = Math.round(d.x);
          if(d.x < 0){
            this.remove();
          }

        });


        svg.selectionBottom = svg.chartBottom.selectAll(".data");
        svg.valuesBottom = svg.selectionBottom.data();

        svg.chartTop.selectAll(".data").each(function(d){

          d.x = Math.round(d.x);
          if(d.x < 0){
            this.remove();
          }

        });

        svg.selectionTop = svg.chartTop.selectAll(".data");
        svg.valuesTop = svg.selectionTop.data();

        selecTopEnter.on("mouseover", svg.activationElemsAutoScroll).on("mouseout", svg.deactivationElems);
        selecBottomEnter.on("mouseover", svg.activationElemsAutoScroll).on("mouseout", svg.deactivationElems);


        createTooltipHisto(svg,selecTopEnter,svg.sumMap);
        createTooltipHisto(svg,selecBottomEnter, svg.sumMap);

        onUpdate = false;

      });






    updateSumArray(svg.sumArrayTop, sumMapTopUpdate);
    updateSumArray(svg.sumArrayBottom, sumMapBottomUpdate);

    svg.sumArrayBottom.sort(sortAlphabet);
    svg.sumArrayTop.sort(sortAlphabet);


    updateTrSelec(svg,"In");
    updateTrSelec(svg,"Out");





    updateHisto2DStackDouble(svg);

    /*
     removeValuesOnUpdate(svg,valuesTopData,sumMapTopUpdate,gapMinute, sumMapUpdate);
     removeValuesOnUpdate(svg,valuesBottomData,sumMapBottomUpdate,gapMinute, sumMapUpdate);
     */







    /*
     sumMapBottomUpdate.forEach(mapToArray(svg.sumArrayBottom));
     sumMapTopUpdate.forEach(mapToArray(svg.sumArrayTop));
     */

    /*
     //sort alphabetically
     svg.sumArray.sort(sortAlphabet);
     svg.sumArrayBottom.sort(sortAlphabet);
     svg.sumArrayTop.sort(sortAlphabet);




     i = 0;
     if (svg.sumArray[0].item == " Remainder " || svg.sumArray[0].item == "OTHERS") {
     svg.colorMap.set(svg.sumArray[0].item, "#f2f2f2");
     i = 1;
     }

     while (i < svg.sumArray.length) {
     svg.colorMap.set(svg.sumArray[i].item, svg.colorGenerator());
     i++;
     }
     */
  }


  console.log(id);

}

/***********************************************************************************************************************/

function transitionRefresh(svg, duration, direction){

  svg.transition("refresh" + direction).duration(duration).tween("",function(){


    
  });

}





















