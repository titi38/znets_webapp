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

    

    svg.units = unitsStringProcessing(json.units);



    console.log(json);



    svg.svgInput.values = [];
    svg.svgOutput.values = [];

    var dataLength = jsonData.length;

    svg.colorMap = new Map();
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
        svg.svgInput.values.push(elemToPush);

      }else{

        if (!sumOutMap.has(elemToPush.item)) {
          sumOutMap.set(elemToPush.item, {sum: elemToPush.height,display: (elemToPush.item === " Remainder ")?" Remainder ":(elemJson[contentDisplayValue] === "")?elemToPush.item:elemJson[contentDisplayValue]});
        } else {
          elemSumMap = sumOutMap.get(elemToPush.item);
          elemSumMap.sum += elemToPush.height;
        }

        svg.svgOutput.values.push(elemToPush);

      }


    }





    svg.sumArrayTotal = [];
    svg.svgInput.sumArray = [];
    svg.svgOutput.sumArray = [];


    var f = colorEval();
    
    function mapToArray(array){
      return function(value, key) {
      array.push({item: key, sum: value.sum, display: value.display});
      };
    }


    sumMap.forEach(mapToArray(svg.sumArrayTotal));
    sumInMap.forEach(mapToArray(svg.svgInput.sumArray));
    sumOutMap.forEach(mapToArray(svg.svgOutput.sumArray));
    
    function sortArray(a, b) {

      if (a.item == " Remainder " || a.item == "OTHERS") {
        return -1;
      }
      if (b.item == " Remainder " || b.item == "OTHERS") {
        return 1;
      }
      return b.sum - a.sum;
    }
    
    svg.sumArrayTotal.sort(sortArray);
    svg.svgInput.sumArray.sort(sortArray);
    svg.svgOutput.sumArray.sort(sortArray);
    
    //The most importants elements should have distinct colors.
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

    blabla(div, svg, svg.svgOutput,0);
    blabla(div, svg, svg.svgInput,1);

    var selection = svg.selectAll(".data");

    //Tooltip creation
    createTooltipHisto(svg,selection,sumMap);

    
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
      return svg.colorMap.get(d.item);
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

    hideShowValuesDouble(svg, trSelec, selectionIn, selectionOut, svg.xMax);

  });


}
