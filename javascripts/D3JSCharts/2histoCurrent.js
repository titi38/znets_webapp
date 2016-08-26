function create2HistoStackCurrent(div,svg,mydiv,urlJson){


  var effectiveUrlJson = urlJson;
  //some non-exhaustive tests on urlJson
  if(effectiveUrlJson.indexOf('?') === -1){
    effectiveUrlJson = effectiveUrlJson + "?minute=60";
  }else if(effectiveUrlJson.indexOf("minute") === -1){
    effectiveUrlJson = effectiveUrlJson + "&minute=60";
  }

  d3.json(effectiveUrlJson, function (error, json) {

    setStartDate(svg);

    svg.margin = {left: 60, right: 60, top: 40, zero: 40, bottom: 40};



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

    svg.heightGraph = (svg.height - svg.margin.zero)/2;

    svg.svgTop = svg.append("svg").attr("x", svg.margin.left).attr("y", svg.margin.top).attr("width", svg.width).attr("height", svg.heightGraph).classed("crisp",true);
    svg.svgBottom = svg.append("svg").attr("x", svg.margin.left).attr("y", svg.margin.top + svg.heightGraph + svg.margin.zero).attr("width", svg.width).attr("height", svg.heightGraph).classed("crisp",true);


    svg.divLegend = div.append("div").classed("diagram", true).style("vertical-align", "top").style("width", svg.tableWidth + "px");

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
      noData(div,svg,mydiv, "error value not found");
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



    svg.svgBottom.values = [];
    svg.svgTop.values = [];

    var dataLength = jsonData.length;

    svg.colorMap = new Map();
    svg.sumMap = new Map();
    var sumBottomMap = new Map();
    var sumTopMap = new Map();
    var i, elemJson, elemToPush;






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
        height: +elemJson[svg.contentAmountValue],
        heightRef: +elemJson[svg.contentAmountValue],
        item: (elemJson[svg.contentItemValue] === "")?" Remainder ":elemJson[svg.contentItemValue],
        direction: elemJson[svg.contentDirectionValue].toLowerCase()
      };


      mapElemToSumCurrent(svg.sumMap, elemToPush, elemJson, svg.contentDisplayValue,itemType);

      if(elemJson[svg.contentDirectionValue] === "IN"){
        elemToPush.direction = "inc";

        mapElemToSumCurrent(sumTopMap, elemToPush, elemJson, svg.contentDisplayValue,itemType);
        svg.svgTop.values.push(elemToPush);

      }else{

        mapElemToSumCurrent(sumBottomMap, elemToPush, elemJson, svg.contentDisplayValue,itemType);
        svg.svgBottom.values.push(elemToPush)

      }


    }



    //




    svg.sumArrayTotal = [];
    svg.svgBottom.sumArray = [];
    svg.svgTop.sumArray = [];


    svg.colorGenerator = colorEval();




    svg.sumMap.forEach(mapToArray(svg.sumArrayTotal));
    sumBottomMap.forEach(mapToArray(svg.svgBottom.sumArray));
    sumTopMap.forEach(mapToArray(svg.svgTop.sumArray));

    svg.sumArrayTotal.sort(sortArrayVolume);
    svg.svgBottom.sumArray.sort(sortArrayVolume);
    svg.svgTop.sumArray.sort(sortArrayVolume);


    svg.colorMap.set(" Remainder ", "#f2f2f2");
    svg.colorMap.set("OTHERS", "#f2f2f2");

    i = 0;
    if (svg.sumArrayTotal[0].item == " Remainder " || svg.sumArrayTotal[0].item == "OTHERS") {
      i = 1;
    }

    while (i < svg.sumArrayTotal.length) {
      svg.colorMap.set(svg.sumArrayTotal[i].item, svg.colorGenerator());
      i++;
    }




    //step = 1 minute (real time)
    svg.step = 60000;


    svg.svgBottom.values.sort(sortValuesCurrent);
    svg.svgTop.values.sort(sortValuesCurrent);

    svg.svgBottom.valuesSCAlphabetSort = svg.svgBottom.values.concat();
    svg.svgBottom.valuesSCAlphabetSort.sort(sortAlphabetItemOnly);

    svg.svgTop.valuesSCAlphabetSort = svg.svgTop.values.concat();
    svg.svgTop.valuesSCAlphabetSort.sort(sortAlphabetItemOnly);
    

    svg.xMax = 60;


    //for the template...
    svg.popup = [];
    svg.popup.pieChart = null;

    createChildSvgCurrent(div, svg, svg.svgTop,0, svg.divLegend, mydiv);
    createChildSvgCurrent(div, svg, svg.svgBottom,1, svg.divLegend, mydiv);

    var selection = svg.selectAll(".data");

    //Tooltip creation
    createTooltipHisto(svg,selection,svg.sumMap);

    

    d3.select(window).on("resize." + mydiv, function () {
      console.log("resize");

      var clientRect = div.node().getBoundingClientRect();
      var divWidth = Math.max(1.15 * svg.tableWidth + svg.margin.left + svg.margin.right + 1, clientRect.width),
        divHeight = Math.max(svg.margin.bottom + svg.margin.top + svg.margin.zero + 1, clientRect.height);


      svg.attr("width", divWidth - 1.15 * svg.tableWidth).attr("height", divHeight);


      var oldsvgheightgraph = svg.heightGraph;
      var oldsvgwidth = svg.width;

      svg.width = divWidth - 1.15 * svg.tableWidth - svg.margin.left - svg.margin.right;
      svg.height = divHeight - svg.margin.bottom - svg.margin.top;


      svg.heightGraph = (svg.height - svg.margin.zero)/2;


      svg.svgTop
        .attr("width", svg.width)
        .attr("height", svg.heightGraph);

      svg.svgBottom
        .attr("y", svg.margin.top + svg.heightGraph + svg.margin.zero)
        .attr("width", svg.width)
        .attr("height", svg.heightGraph);

      redraw2HistoStack( svg,svg.svgTop,0,oldsvgwidth,oldsvgheightgraph);
      redraw2HistoStack( svg,svg.svgBottom,1,oldsvgwidth,oldsvgheightgraph);
      redrawPopup(div.overlay,svg);

    });




    //zoom
    /*


     addZoomDouble(svg, updateHisto2DStackDouble);


     hideShowValuesDouble(svg, trSelec, selectionIn, selectionOut, svg.xMax);
     */
  });


}




