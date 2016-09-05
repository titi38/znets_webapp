/**
 * Created by elie.
 */


/**
 * Create two stacked histograms, one above the other, with zoom, resize, transition and popup features,
 * which auto-updates to monitor all data in an one-hour window.
 * @param div {Object} D3 encapsulated parent div element.
 * @param svg {Object} D3 encapsulated parent svg element, direct child of div parameter.
 * @param mydiv {String} Div identifier.
 * @param urlJson {String} Url to request the data to the server.
 */

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


    if("netTopCountryNbFlow" === svg.typeGraph || svg.typeGraph === "hostTopCountryNbFlow"){
      var button = div.append("button").text("Switch to map").classed("buttonMap", true).remove();
      div.node().insertBefore(button.node(), svg.node());

      button.on("click",function(){
        cleanDiv(div,svg);
        myLastHourHistory.unsubscribe(urlJson, svg.id);
        var newSvg = svg.node().cloneNode(true);
        div.node().replaceChild(newSvg,svg.node());
        svg = d3.select(newSvg);

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
        item: (elemJson[svg.contentItemValue] === "")?" Remainder ":elemJson[svg.contentItemValue]+ "",
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
    createTooltipHistoCurrent(svg,selection,svg.sumMap);

    

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


    autoUpdate2HistoCurrent(svg, urlJson, div);

  });


}




function autoUpdate2HistoCurrent(svg,urlJson, div){


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


  function updateGraph(json, notificationDate){


    svg.svgTop.deactivationElems();
    svg.svgBottom.deactivationElems();

    var gapMinute = (notificationDate.getTime() - notificationDate.getTimezoneOffset() * 60000 - svg.startDate.getTime() - 3540000)/60000;
    console.log(json);

    svg.lastMinute = notificationDate.getMinutes();

    svg.timeMin += gapMinute * 60000;
    svg.startDate = new Date(svg.timeMin);
    svg.svgTop.timeMin = svg.timeMin;
    svg.svgBottom.timeMin = svg.timeMin;

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


        if(!svg.svgTop.mapPercentDisplay.has(elemToPush.item)){
          svg.svgTop.mapPercentDisplay.set(elemToPush.item,{percentDisplay:1});
        }

        elemToPush.height = elemToPush.heightRef*svg.svgTop.mapPercentDisplay.get(elemToPush.item).percentDisplay;


        mapElemToSumCurrent(sumMapTopUpdate, elemToPush, elemJson, svg.contentDisplayValue,itemType);
        valuesTopNew.push(elemToPush);

      }else{


        if(!svg.svgBottom.mapPercentDisplay.has(elemToPush.item)){
          svg.svgBottom.mapPercentDisplay.set(elemToPush.item,{percentDisplay:1});
        }

        elemToPush.height = elemToPush.heightRef*svg.svgBottom.mapPercentDisplay.get(elemToPush.item).percentDisplay;



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

    onAutoUpdate(svg, svg.svgTop,valuesTopNew, gapMinute, sumMapTopUpdate);
    onAutoUpdate(svg, svg.svgBottom,valuesBottomNew, gapMinute, sumMapBottomUpdate);
    
    svg.transition("updateX").duration(svg.updateTransitionDuration).ease(d3.easeLinear).tween("",function(){

        var lastT = 0;
        var coef;
        return function(t){

          coef = (lastT - t)*gapMinute;

          svg.svgBottom.values.forEach(function(elem){
            elem.x = elem.x + coef;
          });

          svg.svgTop.values.forEach(function(elem){
            elem.x = elem.x + coef;
          });

          lastT = t;

          update2HistoStack(svg, svg.svgTop);
          update2HistoStack(svg, svg.svgBottom);
        }

      })
      .on("end",function(){

        onEndAutoUpdate(svg, svg.svgTop, sumMapTopUpdate);
        onEndAutoUpdate(svg, svg.svgBottom, sumMapBottomUpdate);


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




