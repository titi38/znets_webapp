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

    svg.svgOutput = svg.append("svg").attr("x", svg.margin.left).attr("y", svg.margin.top).attr("width", svg.width).attr("height", svg.heightGraph).classed("crisp",true);
    svg.svgInput = svg.append("svg").attr("x", svg.margin.left).attr("y", svg.margin.top + svg.heightGraph + svg.margin.zero).attr("width", svg.width).attr("height", svg.heightGraph).classed("crisp",true);


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



    svg.svgInput.values = [];
    svg.svgOutput.values = [];

    var dataLength = jsonData.length;

    svg.colorMap = new Map();
    svg.sumMap = new Map();
    var sumInMap = new Map();
    var sumOutMap = new Map();
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

        mapElemToSum(sumInMap, elemToPush, elemJson, contentDisplayValue,itemType);


        elemToPush.direction = "inc";
        svg.svgInput.values.push(elemToPush);

      }else{

        mapElemToSum(sumOutMap, elemToPush, elemJson, contentDisplayValue,itemType);

        svg.svgOutput.values.push(elemToPush);

      }


    }





    svg.sumArrayTotal = [];
    svg.svgInput.sumArray = [];
    svg.svgOutput.sumArray = [];


    var f = colorEval();
    



    svg.sumMap.forEach(mapToArray(svg.sumArrayTotal));
    sumInMap.forEach(mapToArray(svg.svgInput.sumArray));
    sumOutMap.forEach(mapToArray(svg.svgOutput.sumArray));

    svg.sumArrayTotal.sort(sortAlphabet);
    svg.svgInput.sumArray.sort(sortAlphabet);
    svg.svgOutput.sumArray.sort(sortAlphabet);

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

    createChildSvg(div, svg, svg.svgOutput,0, divLegend, mydiv);
    createChildSvg(div, svg, svg.svgInput,1, divLegend, mydiv);

    var selection = svg.selectAll(".data");

    //Tooltip creation
    createTooltipHisto(svg,selection,svg.sumMap);

    function desacAll(){
      svg.svgInput.desactivationElems();
      svg.svgOutput.desactivationElems();
    }

    function activElemAllAutoScrollPopup(data){
      if(data.direction === "out"){
        svg.svgOutput.activationElemsAutoScrollPopup(data);
      }else{
        svg.svgInput.activationElemsAutoScrollPopup(data);
      }
    }

    addPopup(selection,div,svg,function(data){
        desacAll();
        activElemAllAutoScrollPopup(data);},
      desacAll);
    
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


      svg.svgOutput
        .attr("width", svg.width)
        .attr("height", svg.heightGraph);
      
      svg.svgInput
        .attr("y", svg.margin.top + svg.heightGraph + svg.margin.zero)
        .attr("width", svg.width)
        .attr("height", svg.heightGraph);

      redraw2HistoStack( svg,svg.svgOutput,0,oldsvgwidth,oldsvgheightgraph);
      redraw2HistoStack( svg,svg.svgInput,1,oldsvgwidth,oldsvgheightgraph);
      redrawPopup(div.overlay,svg);

    });




    //zoom
/*


    addZoomDouble(svg, updateHisto2DStackDouble);


    hideShowValuesDouble(svg, trSelec, selectionIn, selectionOut, svg.xMax);
*/
  });


}



/************************************************************************************************************/

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


/***********************************************************************************************************/


function redrawPopup2Histo(svg, svgChild, numSvg){

  svgChild.overlay.style("width",(svg.width+svg.margin.left + svg.margin.right) + "px")
    .style("top",(numSvg ===0?0:svg.margin.top + svg.height/2) + "px");

  if(svgChild.popup.pieChart != null){
    svgChild.popup.pieChart.attr("width", svg.pieside).attr("height", svg.pieside);
    /*
    var chartside = 0.75*svg.pieside;
    svgChild.popup.innerRad = 0;
    svgChild.popup.outerRad = chartside/2;
    svgChild.popup.pieChart.g.attr("transform","translate(" + (svg.pieside/2) + "," + (svg.pieside/2) + ")");


    var arc = d3.arc()
      .innerRadius(svgChild.popup.innerRad)
      .outerRadius(svgChild.popup.outerRad)
      .startAngle(function(d){return d.startAngle})
      .endAngle(function(d){return d.endAngle});


    svgChild.popup.pieChart.g.selectAll("path").attr("d",arc);
    svgChild.popup.pieChart.g.selectAll("text").attr("transform",function(d){
      var midAngle = (d.endAngle + d.startAngle)/2;
      var dist = svgChild.popup.outerRad * 0.8;
      return "translate(" + (Math.sin(midAngle)*dist) + "," +(-Math.cos(midAngle)*dist) +")";});



    svgChild.popup.pieChart.table.style("max-height",svg.pieside + "px");


    positionPopup(svg);

    svgChild.popup.dist = Child.popup.outerRad * 0.8;
    svgChild.popup.distTranslTemp = svgChild.popup.outerRad/4;
    svgChild.popup.distTransl = svgChild.popup.outerRad/10;


    */
  }


}




