/**
 * Created by elie.
 */



/**
 * Create two stacked histograms, one above the other, with zoom, resize, transition and popup features.
 * @param div {Object} D3 encapsulated parent div element.
 * @param svg {Object} D3 encapsulated parent svg element, direct child of div parameter.
 * @param mydiv {String} Div identifier.
 * @param urlJson {String} Url to request the data to the server.
 */
function create2HistoStack(div,svg,mydiv,urlJson){

  svg.margin = {left: 60, right: 60, top: 40, zero: 40, bottom: 40};
  d3.json(urlJson, function (error, json) {




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

    svg.heightGraph = (svg.height - svg.margin.zero)/2;

    svg.svgTop = svg.append("svg").attr("x", svg.margin.left).attr("y", svg.margin.top).attr("width", svg.width).attr("height", svg.heightGraph).classed("crisp",true);
    svg.svgBottom = svg.append("svg").attr("x", svg.margin.left).attr("y", svg.margin.top + svg.heightGraph + svg.margin.zero).attr("width", svg.width).attr("height", svg.heightGraph).classed("crisp",true);


    var divLegend = div.append("div").classed("diagram", true).style("vertical-align", "top").style("width", svg.tableWidth + "px");

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
      noData(div,svg,mydiv, "error value not found");
      return;
    }

    

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

        mapElemToSum(sumTopMap, elemToPush, elemJson, contentDisplayValue,itemType);


        elemToPush.direction = "inc";
        svg.svgTop.values.push(elemToPush);

      }else{

        mapElemToSum(sumBottomMap, elemToPush, elemJson, contentDisplayValue,itemType);

        svg.svgBottom.values.push(elemToPush);

      }


    }





    svg.sumArrayTotal = [];
    svg.svgBottom.sumArray = [];
    svg.svgTop.sumArray = [];


    var f = colorEval();
    



    svg.sumMap.forEach(mapToArray(svg.sumArrayTotal));
    sumBottomMap.forEach(mapToArray(svg.svgBottom.sumArray));
    sumTopMap.forEach(mapToArray(svg.svgTop.sumArray));

    svg.sumArrayTotal.sort(sortArrayVolume);
    svg.svgBottom.sumArray.sort(sortAlphabet);
    svg.svgTop.sumArray.sort(sortAlphabet);


    i = 0;
    if (svg.sumArrayTotal[0].item == " Remainder " || svg.sumArrayTotal[0].item == "OTHERS") {
      svg.colorMap.set(svg.sumArrayTotal[0].item, "#f2f2f2");
      i = 1;
    }

    while (i < svg.sumArrayTotal.length) {
      svg.colorMap.set(svg.sumArrayTotal[i].item, f());
      i++;
    }

    
    
    //step = 1 hour by default
    svg.step = (urlJson.indexOf("pset=DAILY") === -1)?3600000:86400000;

    svg.xMax = (timeMax - svg.timeMin)/svg.step + 1;

    createChildSvg(div, svg, svg.svgTop,0, divLegend);
    createChildSvg(div, svg, svg.svgBottom,1, divLegend);

    var selection = svg.selectAll(".data");

    //Tooltip creation
    createTooltipHisto(svg,selection,svg.sumMap);

    function desacAll(){
      svg.svgBottom.deactivationElems();
      svg.svgTop.deactivationElems();
    }

    function activElemAllAutoScrollPopup(data){
      if(data.direction === "inc"){
        svg.svgTop.activationElemsAutoScrollPopup(data);
      }else{
        svg.svgBottom.activationElemsAutoScrollPopup(data);
      }
    }

    if(svg.hasPopup) {
      addPopup(selection,div,svg,function(data){
          desacAll();
          activElemAllAutoScrollPopup(data);},
        desacAll);
    }else{
      svg.popup = [];
      svg.popup.pieChart = null;
    }

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


/**
 * Called when a resize occurs on the parent div element for svgChild.
 * Adjusts svgChild's internal variables before calling update2HistoStack which effectively redraw the graph.
 * @param svg {Object} D3 encapsulated parent svg element.
 * @param svgChild {Object} D3 encapsulated svg element, child of the svg parameter, contains one graph.
 * @param numSvg {Number} Used to differentiate the different graphs from top to bottom.
 * @param oldsvgwidth {Number} The width of svgChild (previously contained in svg.width) before the resize event occurs.
 * @param oldsvgheightgraph {Number} The height of svgChild (previously contained in svg.heightGraph)
 *                                                                                       before the resize event occurs.
 */

function redraw2HistoStack(svg, svgChild, numSvg,oldsvgwidth,oldsvgheightgraph){

  var ratiox = svg.width/oldsvgwidth;
  var ratioy = svg.heightGraph/oldsvgheightgraph;

  svgChild.x.range([0, svg.width]);
  svgChild.y.range([svg.heightGraph,0]);

  svgChild.frame.select(".rectOverlay").attr("height",svg.heightGraph);
  svgChild.backgroundRect.attr("width",svg.width).attr("height",svg.heightGraph);

  svgChild.transform.x = svgChild.transform.x*ratiox;
  svgChild.transform.y = svgChild.transform.y*ratioy;

  var scaleytot = svgChild.transform.k*svgChild.scaley;
  var scalextot = svgChild.transform.k*svgChild.scalex;

  svgChild.transform.k = Math.max(scalextot,scaleytot);
  svgChild.scalex = scalextot/svgChild.transform.k;
  svgChild.scaley = scaleytot/svgChild.transform.k;

  svgChild.newX.range([0,svg.width]);
  svgChild.newY.range([svg.heightGraph,0]);

  svgChild.axisx
    .attr('transform', 'translate(' + [svg.margin.left, svg.margin.top + svg.heightGraph + numSvg * (svg.heightGraph + svg.margin.zero) - 0.5] + ")");

  svgChild.axisy
    .attr('transform', 'translate(' + [svg.margin.left,
        svg.margin.top + numSvg * (svg.heightGraph + svg.margin.zero) - 0.5 ] + ')');

  if(svgChild.axisyRight){
    svgChild.axisyRight
      .attr('transform', 'translate(' + [svg.margin.left + svg.width,
          svg.margin.top + numSvg * (svg.margin.zero + svg.heightGraph) - 0.5 ] + ')');
  }

  svgChild.ylabel.attr("x", -svg.margin.top -(svg.heightGraph) / 2 - numSvg  * (svg.margin.zero + svg.heightGraph));

  if(svgChild.ylabelRight){

    svgChild.ylabelRight
      .attr('y', svg.margin.left + svg.width + svg.margin.right)
      .attr("x", - svg.margin.top - svg.heightGraph/2 - numSvg * (svg.margin.zero + svg.heightGraph));

  }

  svgChild._groups[0][0].__zoom.k =svgChild.transform.k;
  svgChild._groups[0][0].__zoom.x =svgChild.transform.x;
  svgChild._groups[0][0].__zoom.y =svgChild.transform.y;

  var maxHeight = svg.margin.top/2 + svg.margin.zero/4 + svg.heightGraph;


  svgChild.table.style("max-height", maxHeight + "px");
  svgChild.divtable.style("margin-bottom",maxHeight - parseInt(svgChild.table.style("height"),10) + "px");

  svgChild.text.attr("transform", "translate(" + (svg.width / 2) + "," + (svg.heightGraph/8 +
    parseFloat(getComputedStyle(svgChild.text.node()).fontSize)) + ")");

  update2HistoStack(svg,svgChild);

  //redrawPopup2Histo(svg, svgChild, numSvg);


}


/**
 * Create two stacked histograms, one above the other, with zoom, resize, transition and popup features.
 * This function differs from create2HistoStack in the json's format it receives from the server.
 * @param div {Object} D3 encapsulated parent div element.
 * @param svg {Object} D3 encapsulated parent svg element, direct child of div parameter.
 * @param mydiv {String} Div identifier.
 * @param urlJson {String} Url to request the data to the server.
 */
function create2HistoStackFormatVariation(div,svg,mydiv,urlJson){

  svg.margin = {left: 60, right: 60, top: 40, zero: 40, bottom: 40};
  d3.json(urlJson, function (error, json) {

    


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

    svg.heightGraph = (svg.height - svg.margin.zero)/2;

    svg.svgTop = svg.append("svg").attr("x", svg.margin.left).attr("y", svg.margin.top).attr("width", svg.width).attr("height", svg.heightGraph).classed("crisp",true);
    svg.svgBottom = svg.append("svg").attr("x", svg.margin.left).attr("y", svg.margin.top + svg.heightGraph + svg.margin.zero).attr("width", svg.width).attr("height", svg.heightGraph).classed("crisp",true);


    var divLegend = div.append("div").classed("diagram", true).style("vertical-align", "top").style("width", svg.tableWidth + "px");

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



    svg.svgBottom.values = [];
    svg.svgTop.values = [];

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



    svg.colorMap = new Map();
    svg.sumMap = new Map();
    var sumBottomMap = new Map();
    var sumTopMap = new Map();

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


              if (!sumTopMap.has(elemToPush.item)) {
                sumTopMap.set(elemToPush.item, {sum: elemToPush.height, display: elemToPush.item});
              } else {
                elemSumMap = sumTopMap.get(elemToPush.item);
                elemSumMap.sum += elemToPush.height;
              }

              svg.svgTop.values.push(elemToPush);

            } else {


              if (!sumBottomMap.has(elemToPush.item)) {
                sumBottomMap.set(elemToPush.item, {sum: elemToPush.height, display: elemToPush.item});
              } else {
                elemSumMap = sumBottomMap.get(elemToPush.item);
                elemSumMap.sum += elemToPush.height;
              }


              svg.svgBottom.values.push(elemToPush)

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

          if(elemToPush.direction === "inc" || elemToPush.direction === "in"){
            elemToPush.direction = "inc";


            if (!sumTopMap.has(elemToPush.item)) {
              sumTopMap.set(elemToPush.item, {sum: elemToPush.height, display: elemToPush.item});
            } else {
              elemSumMap = sumTopMap.get(elemToPush.item);
              elemSumMap.sum += elemToPush.height;
            }

            svg.svgTop.values.push(elemToPush);

          }else{


            if (!sumBottomMap.has(elemToPush.item)) {
              sumBottomMap.set(elemToPush.item, {sum: elemToPush.height, display: elemToPush.item});
            } else {
              elemSumMap = sumBottomMap.get(elemToPush.item);
              elemSumMap.sum += elemToPush.height;
            }


            svg.svgBottom.values.push(elemToPush)

          }


        }


      }

    }
    



    svg.sumArrayTotal = [];
    svg.svgBottom.sumArray = [];
    svg.svgTop.sumArray = [];


    var f = colorEval();




    svg.sumMap.forEach(mapToArray(svg.sumArrayTotal));
    sumBottomMap.forEach(mapToArray(svg.svgBottom.sumArray));
    sumTopMap.forEach(mapToArray(svg.svgTop.sumArray));

    svg.sumArrayTotal.sort(sortArrayVolume);
    svg.svgBottom.sumArray.sort(sortAlphabet);
    svg.svgTop.sumArray.sort(sortAlphabet);

    i = 0;
    if (svg.sumArrayTotal[0].item == " Remainder " || svg.sumArrayTotal[0].item == "OTHERS") {
      svg.colorMap.set(svg.sumArrayTotal[0].item, "#f2f2f2");
      i = 1;
    }

    while (i < svg.sumArrayTotal.length) {
      svg.colorMap.set(svg.sumArrayTotal[i].item, f());
      i++;
    }


    svg.xMax = (timeMax - svg.timeMin)/svg.step + 1;

    createChildSvg(div, svg, svg.svgTop,0, divLegend);
    createChildSvg(div, svg, svg.svgBottom,1, divLegend);

    var selection = svg.selectAll(".data");

    //Tooltip creation
    createTooltipHisto(svg,selection,svg.sumMap);

    function desacAll(){
      svg.svgBottom.deactivationElems();
      svg.svgTop.deactivationElems();
    }

    function activElemAllAutoScrollPopup(data){
      if(data.direction === "inc"){
        svg.svgTop.activationElemsAutoScrollPopup(data);
      }else{
        svg.svgBottom.activationElemsAutoScrollPopup(data);
      }
    }

    if(svg.hasPopup) {
      addPopup(selection,div,svg,function(data){
          desacAll();
          activElemAllAutoScrollPopup(data);},
        desacAll);
    }else{
      svg.popup = [];
      svg.popup.pieChart = null;
    }

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




