

function createHisto2DStackSimpleCurrent(div,svg,mydiv, urlJson){

  var effectiveUrlJson = urlJson;
  //some non-exhaustive tests on urlJson
  if(effectiveUrlJson.indexOf('?') === -1){
    effectiveUrlJson = effectiveUrlJson + "?minute=60";
  }else if(effectiveUrlJson.indexOf("minute") === -1){
    effectiveUrlJson = effectiveUrlJson + "&minute=60";
  }


  d3.json(effectiveUrlJson, function (error, json) {

    setStartDate(svg);


    svg.margin.left = 50;
    svg.margin.right = 50;


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

    processServices(jsonData,jsonContent,svg);


    svg.contentItemValue = searchItemValue(jsonContent);
    svg.contentAmountValue = searchAmountValue(jsonContent);


    //optional display value for legend, no guaranty on uniqueness/existence.
    svg.contentDisplayValue = searchDisplayValue(jsonContent);

    //if no display value, then the display value is the item value.
    if (svg.contentDisplayValue === false){
      svg.contentDisplayValue = svg.contentItemValue;
    }


    //if no item/amount value found, the graph can't be done.
    if(svg.contentItemValue === false  || svg.contentAmountValue === false){
      noData(div,svg,mydiv, "error no value found");
      return;
    }


    //Now, no more nodata can happen,so we create the table
    var divtable = div.append("div").classed("diagram divtable", true);
    divtable.append("h4").classed("tableTitle", true).text("Legend");
    svg.table = divtable.append("table").classed("diagram font2 tableLegend", true).style("width", svg.tableWidth + "px").style("max-height",
      (divHeight - 2 * parseInt(div.style("font-size"),10) - 60) + "px");




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

    svg.values = [];

    var dataLength = jsonData.length;

    svg.colorMap = new Map();
    svg.sumMap = new Map();

    var i, elemJson, elemToPush, elemSumMap;



    svg.hourShift = getTimeShift(urlJson)  * 3600000;

    var itemType = jsonContent[svg.contentItemValue];

    // Data are processed and sorted.
    for(i = 0; i < dataLength; i++){
      elemJson = jsonData[i];

      if(+elemJson[svg.contentAmountValue] === 0){
        continue;
      }

      elemToPush = {
        x: elemJson[svg.contentXPositionValue],
        height: +elemJson[svg.contentAmountValue],
        heightRef: +elemJson[svg.contentAmountValue],
        item: (elemJson[svg.contentItemValue] === "")?" Remainder ":elemJson[svg.contentItemValue]
      };

      mapElemToSumCurrent(svg.sumMap,elemToPush,elemJson,svg.contentDisplayValue,itemType);


      svg.values.push(elemToPush);


    }





    svg.sumArray = [];

    svg.colorGenerator = colorEval();


    svg.sumMap.forEach(mapToArray(svg.sumArray));


    svg.sumArray.sort(sortArrayVolume);

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


    svg.sumArray.sort(sortAlphabet);

    //step = 1 minute (real time)
    svg.step = 60000;

    svg.values.sort(sortValuesCurrent);


    svg.valuesSCAlphabetSort = svg.values.concat();
    svg.valuesSCAlphabetSort.sort(sortAlphabetItemOnly);

    var xMax = 60;


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


    svg.total = Math.max(1,d3.max(totalSum));

    svg.y.range([svg.height, 0]);


    //the *1.05 operation allow a little margin
    svg.y.domain([0, svg.total * 1.05]);


    svg.newX = d3.scaleLinear().range(svg.x.range()).domain(svg.x.domain());
    svg.newY = d3.scaleLinear().range(svg.y.range()).domain(svg.y.domain());

    var dataWidth = 0.75 * (svg.x(svg.x.domain()[0] + 1) - svg.x.range()[0]);

    svg.selection = svg.chart.selectAll(".data")
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
        return svg.colorMap.get(d.item);
      })
      .attr("stroke", "#000000");


    //Tooltip creation
    createTooltipHistoCurrent(svg,svg.selection,svg.sumMap);

    var blink = blinkCreate(svg.colorMap);

    svg.activeItem = null;

    svg.activationElems = function(d) {
      if (svg.popup.pieChart !== null) {
        return;
      }

      svg.activeItem = d.item;

      function testitem(data) {
        return d.item == data.item;

      }

      svg.trSelec.filter(testitem).classed("outlined", true);

      svg.selection.filter(testitem).each(blink);

    }

    svg.activationElemsAutoScroll = function(d) {
      if (svg.popup.pieChart !== null) {
        return;
      }
      svg.activeItem = d.item;


      function testitem(data) {
        return d.item == data.item;

      }

      var elem = svg.trSelec.filter(testitem).classed("outlined", true);
      scrollToElementTableTransition(elem,svg.table);


      svg.selection.filter(testitem).each(blink);

    }


    svg.deactivationElems = function() {
      if (svg.activeItem == null || svg.popup.pieChart !== null) {
        return;
      }


      function testitem(data) {
        return data.item == svg.activeItem;
      }

      svg.trSelec.filter(testitem).classed("outlined", false);

      svg.selection.filter(testitem).interrupt().attr("stroke", "#000000").attr("fill", svg.colorMap.get(svg.activeItem));

      svg.activeItem = null;

    }

    svg.selection.on("mouseover", svg.activationElemsAutoScroll).on("mouseout", svg.deactivationElems);


    svg.axisx = svg.append("g")
      .attr("class", "axisGraph")
      .attr('transform', 'translate(' + [svg.margin.left, svg.height + svg.margin.top] + ")");

    svg.axisx.call(d3.axisBottom(svg.x));

    legendAxisX(svg);

    yAxeSimpleCreation(svg);
    optionalYAxeSimpleCreation(svg);

    gridSimpleGraph(svg);
/*
    if(svg.hasPopup){

      addPopup(selection,div,svg,function(data){
          deactivationElems();
          activationElemsAutoScrollPopup(data);},
        deactivationElems);

    }else{*/

      svg.popup = [];
      svg.popup.pieChart = null;

    //}

    //Legend creation
    svg.trSelec = svg.table.selectAll("tr").data(svg.sumArray).enter().append("tr");

    tableLegendTitle(svg,svg.trSelec);

    svg.trSelec.append("td").append("div").classed("lgd", true).style("background-color", function (d) {
      return svg.colorMap.get(d.item);
    });
    svg.trSelec.append("td").text(function (d) {
      return d.display;
    });
    svg.trSelec.on("mouseover", svg.activationElems).on("mouseout", svg.deactivationElems);



    //zoom




    addZoomSimple(svg, updateHisto2DStackSimple);

    d3.select(window).on("resize." + mydiv, function () {
      console.log("resize");
      redrawHisto2DStackSimple(div, svg);
    });

    hideShowValuesCurrent(svg);

    autoUpdateSimpleCurrent(svg, urlJson, div);
  });



}







function autoUpdateSimpleCurrent(svg,urlJson, div){


  //The transition seems to really harm the performances of the computer when not 0 and tab inactive for too long.
  //Maybe take a look at that someday to see if something can somehow be done...
  svg.updateTransitionDuration = 0;

  var onUpdate = false;

  var responsesFIFOList = [];

  //We suppose that urljson doesn't contain a minute parameter

  var id = myLastHourHistory.addMinuteRequest(urlJson,
    function(json, notifdate){

      if(unsubscribeGraphIfInactive(id, urlJson, div)){
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

    var sumMapUpdate = new Map();

    var valuesNew = [];

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
        item: ((elemJson[svg.contentItemValue] === "")?" Remainder ":elemJson[svg.contentItemValue]) + ""
      };




      if(!svg.mapPercentDisplay.has(elemToPush.item)){
        svg.mapPercentDisplay.set(elemToPush.item,{percentDisplay:1});
      }

      elemToPush.height = elemToPush.heightRef*svg.mapPercentDisplay.get(elemToPush.item).percentDisplay;
      
      valuesNew.push(elemToPush);

      mapElemToSumCurrent(sumMapUpdate, elemToPush, elemJson, svg.contentDisplayValue,itemType);

    }

    sumMapUpdate.forEach(function(value, key){

      if(!svg.colorMap.has(key)){
        svg.colorMap.set(key, svg.colorGenerator());
      }

    });


    valuesNew.sort(sortValuesCurrent);

    var totalUpdate = [];

    var x = 60;

    var xMax = 60 + gapMinute;

    var sum = 0;
    i = 0;
    

    while (x < xMax) {

      while (i < valuesNew.length && valuesNew[i].x === x) {
        sum += valuesNew[i].height;
        valuesNew[i].y = sum;
        i++;
      }
      totalUpdate.push(sum);
      sum = 0;
      x++;
    }

    svg.total = Math.max(svg.total,d3.max(totalUpdate));
    


    removeValuesOnUpdate(svg,svg.values,sumMapUpdate,gapMinute);

    sumMapUpdate.forEach(function(value,key){

      if(!svg.sumMap.has(key)){
        svg.sumMap.set(key,{sum:value.sum, display:value.display})
      }

    });


    svg.selection = svg.chart.selectAll(".data");
    svg.values = svg.selection.data();
    svg.values = svg.values.concat(valuesNew);

    
    svg.selection = svg.chart.selectAll(".data")
      .data(svg.values);

    var selecEnter = svg.selection.enter()
      .append("rect")
      .classed("data", true)
      .attr("fill", function (d) {
        return svg.colorMap.get(d.item);
      })
      .attr("stroke", "#000000");

    svg.selection = selecEnter.merge(svg.selection);

    svg.values.sort(sortValuesCurrent);


    svg.valuesSCAlphabetSort = svg.values.concat();
    svg.valuesSCAlphabetSort.sort(sortAlphabetItemOnly);

    updateScalesSimpleCurrent(svg);

    svg.transition("updateX").duration(svg.updateTransitionDuration).ease(d3.easeLinear).tween("",function(){

        var lastT = 0;
        var coef;
        return function(t){

          coef = (lastT - t)*gapMinute;


          svg.values.forEach(function(elem){
            elem.x = elem.x + coef;
          });

          lastT = t;

          updateHisto2DStackSimple(svg);
        }

      })
      .on("end",function(){

        var maxTotal = 1;


        svg.chart.selectAll(".data").each(function(d){

          d.x = Math.round(d.x);
          if(d.x < 0){
            this.remove();
          }else{
            maxTotal = Math.max(maxTotal,d.y);
          }

        });

        svg.total = maxTotal;


        svg.selection = svg.chart.selectAll(".data");

        svg.values = svg.selection.data();

        selecEnter.on("mouseover", svg.activationElemsAutoScroll).on("mouseout", svg.deactivationElems);

        createTooltipHistoCurrent(svg,selecEnter,svg.sumMap);

        svg.values.sort(sortValuesCurrent);

        svg.valuesSCAlphabetSort = svg.values.concat();
        svg.valuesSCAlphabetSort.sort(sortAlphabetItemOnly);

        updateSumArray(svg.sumArray, sumMapUpdate,svg.hiddenValues,svg.mapPercentDisplay);

        svg.sumArray.sort(sortAlphabet);


        svg.trSelec = svg.table.selectAll("tr").data(svg.sumArray);
        svg.trSelec.classed("strikedRow",function(d){return svg.hiddenValues.indexOf(d.item) !== -1; });
        svg.trSelec.select("div").style("background-color", function (d) {
          return svg.colorMap.get(d.item);
        });

        svg.trSelec.select("td:nth-of-type(2)").text(function (d) {
          return d.display;
        });


        var trselecEnter = svg.trSelec.enter().append("tr")
          .classed("strikedRow",function(d){return svg.hiddenValues.indexOf(d.item) !== -1; });

        trselecEnter.append("td").append("div").classed("lgd", true).style("background-color", function (d) {
          return svg.colorMap.get(d.item);
        });

        trselecEnter.append("td").text(function (d) {
          return d.display;
        });


        trselecEnter.on("click",svg.onClick).on("contextmenu", svg.onContextMenu);

        svg.trSelec.exit().remove();

        svg.trSelec = svg.table.selectAll("tr");

        svg.trSelec.on("mouseover",svg.activationElems).on("mouseout", svg.deactivationElems);

        tableLegendTitle(svg, svg.trSelec);

        updateScalesSimpleCurrent(svg);
        updateHisto2DStackSimple(svg);

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

  console.log(id);

}
