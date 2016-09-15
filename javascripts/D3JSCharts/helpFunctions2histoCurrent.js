/**
 * Created by elie.
 */

/**
 /**
 * Generates one stacked histogram with auto-update and its legend inside the svg parameter which will have two of them.
 * @param div {Object} D3 encapsulated parent div element.
 * @param svg {Object} D3 encapsulated parent svg element, direct child of div parameter, which contains svgChild.
 * @param svgChild {Object} D3 encapsulated svg element, child of the svg parameter, contains one graph.
 * @param numSvg {Number} Used to differentiate the different graphs from top to bottom.
 * @param divLegend {Object} D3 selection of the div which contains the legend's table of the two graphs.
 * @param mydiv {String} The parent div id.
 */

function createChildSvgCurrent(div, svg, svgChild, numSvg, divLegend, mydiv){

  var maxHeight = svg.margin.top/2 + svg.margin.zero/4 + svg.heightGraph;

  svgChild.divtable = divLegend.append("div").classed("borderTable diagram",true).style("top", svg.margin.zero/2 +  "px")
    .style("position","relative");
  svgChild.table = svgChild.divtable.append("table").classed("diagram font2 tableLegend", true).style("width", svg.tableWidth + "px")
    .style("max-height", maxHeight + "px");


  svgChild.values.sort(sortValuesCurrent);

  var totalSumValues = [];

  var x = 0;
  var sum = 0;
  var i = 0;

  while (x < svg.xMax) {

    while (i < svgChild.values.length && svgChild.values[i].x == x) {
      sum += svgChild.values[i].height;
      svgChild.values[i].y = sum;
      i++;
    }
    totalSumValues.push(sum);
    sum = 0;
    x++;
  }


  svgChild.total = Math.max(1, d3.max(totalSumValues));

  svgChild.x = d3.scaleLinear().range([0,svg.width]).domain([-0.625, svg.xMax - 0.375]);
  svgChild.y = d3.scaleLinear().range([svg.heightGraph,0]).domain([0,svgChild.total * 1.1]);


  svgChild.chartBackground = svgChild.append("g");
  svgChild.backgroundRect = svgChild.chartBackground.append("rect").attr("y",0).attr("x",0).attr("height",svg.heightGraph)
    .attr("width",svg.width).attr("fill",numSvg === 0?"#fff":"#e6e6e6");

  svgChild.text = svgChild.chartBackground.append("text").classed("bckgr-txt", true)
    .style("fill",numSvg === 0?"#e6e6e6":"#fff")
    .text(numSvg === 0?"Ingress":"Egress");

  svgChild.text.attr("transform", "translate(" + (svg.width / 2) + "," + (svg.heightGraph/8 +
    parseFloat(getComputedStyle(svgChild.text.node()).fontSize)) + ")");


  //Here, the grid, after the text
  svgChild.grid = svgChild.chartBackground.append("g").classed("grid", true);

  svgChild.newX = d3.scaleLinear().range(svgChild.x.range()).domain(svgChild.x.domain());
  svgChild.newY = d3.scaleLinear().range(svgChild.y.range()).domain(svgChild.y.domain());

  svgChild.chart = svgChild.append("g");
  svgChild.selec = svgChild.append("g").append("rect").attr("class", "rectSelec");

  var dataWidth = 0.75*(svgChild.newX(svgChild.newX.domain()[0] + 1) - svgChild.newX.range()[0]);


  svgChild.selection = svgChild.chart.selectAll(".data")
    .data(svgChild.values)
    .enter().append("rect")
    .classed("data", true)
    .attr("fill", function (d) {
      return svg.colorMap.get(d.item);
    })
    .attr("stroke", "#000000")
    .attr("x",function(d){return svgChild.newX(d.x - 0.375);})
    .attr("y", function(d){return svgChild.newY(d.y);})
    .attr("height", function(d){return svg.heightGraph - svgChild.newY(d.height);})
    .attr("width", dataWidth);

  svgChild.trSelec = svgChild.table.selectAll("tr").data(svgChild.sumArray).enter().append("tr");

  var blink = blinkCreate(svg.colorMap);

  svgChild.activeItem = null;

  function activationElems(d) {

    if (svg.popup.pieChart !== null) {
      return;
    }

    svgChild.activeItem = d.item;

    function testitem(data) {
      return d.item == data.item;

    }

    svgChild.trSelec.filter(testitem).classed("outlined", true);

    svgChild.selection.filter(testitem).each(blink);

  }

  function activationElemsAutoScroll(d) {

    if (svg.popup.pieChart !== null) {
      return;
    }
    svgChild.activeItem = d.item;


    function testitem(data) {
      return d.item == data.item;

    }

    var elem = svgChild.trSelec.filter(testitem).classed("outlined", true);

    scrollToElementTableTransition(elem,svgChild.table);

    svgChild.selection.filter(testitem).each(blink);

  }

  function activationElemsAutoScrollPopup(d) {

    svgChild.activeItem = d.item;


    function testitem(data) {
      return d.item == data.item;

    }

    var elem = svgChild.trSelec.filter(testitem).classed("outlined", true);
    scrollToElementTableTransition(elem,svgChild.table);


  }

  function deactivationElems() {

    if (svgChild.activeItem == null || svg.popup.pieChart !== null) {
      return;
    }


    function testitem(data) {
      return data.item == svgChild.activeItem;
    }

    svgChild.trSelec.filter(testitem).classed("outlined", false);

    svgChild.selection.filter(testitem).interrupt().attr("stroke", "#000000").attr("fill", svg.colorMap.get(svgChild.activeItem));

    svgChild.activeItem = null;

  }

  svgChild.deactivationElems = deactivationElems;
  svgChild.activationElemsAutoScrollPopup = activationElemsAutoScrollPopup;
  svgChild.activationElemsAutoScroll = activationElemsAutoScroll;
  svgChild.activationElems = activationElems;

  svgChild.selection.on("mouseover", activationElemsAutoScroll).on("mouseout", deactivationElems);

  svgChild.axisx = svg.append("g")
    .attr("class", "axisGraph")
    .attr('transform', 'translate(' + [svg.margin.left, svg.margin.top + svg.heightGraph + numSvg * (svg.heightGraph + svg.margin.zero) - 0.5] + ")");

  svgChild.axisx.call(d3.axisBottom(svgChild.x));

  svgChild.step = svg.step;
  svgChild.timeMin = svg.timeMin;

  legendAxisX(svgChild);

  yAxe2HistoCreation(svg, svgChild, numSvg);

  optionalAxes2HistoCreation(svg,svgChild,numSvg);

  gridHisto2Graph(svg, svgChild);
  /*
   addPopup2Histo(selection,div,svg, svgChild, numSvg, function(data){
   desactivationElems();
   activationElemsAutoScrollPopup(data);},
   desactivationElems);
   */


  //Legend creation
  //(not svgChild, ok)

  tableLegendTitle(svg,svgChild.trSelec);

  svgChild.trSelec.append("td").append("div").classed("lgd", true).style("background-color", function (d) {
    return svg.colorMap.get(d.item);
  });
  svgChild.trSelec.append("td").text(function (d) {
    return d.display;
  });
  svgChild.trSelec.on("mouseover", activationElems).on("mouseout", deactivationElems);

  svgChild.divtable.style("margin-bottom",maxHeight - parseInt(svgChild.table.style("height"),10) + "px");


  addZoom2Histo(svg, svgChild, update2HistoStack);

  hideShowValuesCurrent2Histo(svg, svgChild);

  /*
   addPopup2Histo(selection, div, svg , svgChild, numSvg, function(data){
   desactivationElems();
   activationElemsAutoScrollPopup(data);},
   desactivationElems)
   */

}

/**
 *
 * @param svg
 * @param svgChild
 */


function hideShowValuesCurrent2Histo(svg, svgChild){

  var duration = 800;

  svgChild.hiddenValues  = [];

  svgChild.mapPercentDisplay = new Map();

  svgChild.trSelec.each(function(d){

    svgChild.mapPercentDisplay.set(d.item,{percentDisplay:1});

  });



  svgChild.onClick = function(d){


    var clickedRow = d3.select(this);

    var index = svgChild.hiddenValues.indexOf(d.item);


    if(index === -1){
      //hide the data

      svgChild.hiddenValues.push(d.item);
      clickedRow.classed("strikedRow",true);


    }else{
      //show the data

      svgChild.hiddenValues.splice(index,1);
      clickedRow.classed("strikedRow",false);


    }


    createTransitionSimpleCurrent2Histo(svg,svgChild, duration);

  };

  svgChild.onContextMenu = function(d){
    d3.event.preventDefault();

    var clickedRow = d3.select(this);

    var index = svgChild.hiddenValues.indexOf(d.item);


    if ((index !== -1) || (svgChild.trSelec.size() - 1 !== svgChild.hiddenValues.length )) {
      //Hide all data except this one

      svgChild.hiddenValues = [];
      svgChild.mapPercentDisplay.forEach(function(value, key){
        svgChild.hiddenValues.push(key);
      });


      svgChild.hiddenValues.splice(svgChild.hiddenValues.indexOf(d.item), 1);

      svgChild.trSelec.classed("strikedRow",true);
      clickedRow.classed("strikedRow",false);


    }else{


      //index === -1 && hiddenValues.length == trSelec.size() -1
      // ->show all data.
      svgChild.hiddenValues = [];
      svgChild.trSelec.classed("strikedRow", false);


    }

    createTransitionSimpleCurrent2Histo(svg,svgChild, duration);


  };

  svgChild.trSelec.on("click", svgChild.onClick).on("contextmenu",svgChild.onContextMenu);



}


/**
 *
 * @param svg
 * @param svgChild
 * @param duration
 */

function createTransitionSimpleCurrent2Histo(svg, svgChild, duration){
  svgChild.interrupt("hideshow");
  svgChild.transition("hideshow").duration(duration)
    .tween("",function(){
      var arrayUpdate = [];

      svgChild.mapPercentDisplay.forEach(function(value, key){
        var coef = (svgChild.hiddenValues.indexOf(key) === -1?1:0) - value.percentDisplay;
        if(coef !== 0){
          arrayUpdate.push([value,value.percentDisplay,coef]);
        }
      });


      return function(t){

        arrayUpdate.forEach(function(elem){
          elem[0].percentDisplay = elem[1] + t * elem[2];
        });

        transitionRefreshSimpleCurrent2Histo(svg, svgChild);
      }

    })
    .on("end",function(){

      svgChild.mapPercentDisplay.forEach(function(value, key){

        value.percentDisplay = (svgChild.hiddenValues.indexOf(key) === -1?1:0);

      });
      transitionRefreshSimpleCurrent2Histo(svg,svgChild);

    });
}


function transitionRefreshSimpleCurrent2Histo(svg, svgChild){


  var i, currentX;
  var sum, elemValues, currentPercent;

  var mapDisplay = svgChild.mapPercentDisplay;
  var valuesSortAlphabet = svgChild.valuesSCAlphabetSort;
  var valuesUsualSort = svgChild.values;
  var valuesLength = valuesUsualSort.length;

  var totalSum = [], currentItem = null;


  //height actualization
  for (i = 0; i < valuesLength; i++) {

    elemValues = valuesSortAlphabet[i];

    if (elemValues.item !== currentItem) {

      currentItem = elemValues.item;
      currentPercent = mapDisplay.get(currentItem).percentDisplay;
      
    }

    elemValues.height = elemValues.heightRef * currentPercent;

  }


  currentX = null;
  sum = 0;

  for (i = 0; i < valuesLength; i++) {
    elemValues = valuesUsualSort[i];

    if (currentX !== elemValues.x) {
      currentX = elemValues.x;
      totalSum.push(sum);
      sum = 0;
    }

    sum += elemValues.height;
    elemValues.y = sum;

  }


  totalSum.push(sum);

  svgChild.total = Math.max(1,d3.max(totalSum));


  updateScales2HistoCurrent(svg,svgChild);
  update2HistoStack(svg, svgChild);


}


function updateScales2HistoCurrent(svg, svgChild){

  var actTranslate1 = -svgChild.transform.y/(svgChild.scaley*svgChild.transform.k);
  svgChild.y.domain([0,svgChild.total*1.1]);
  svgChild.newY.domain([svgChild.y.invert(actTranslate1 + svg.heightGraph/(svgChild.transform.k*svgChild.scaley)), svgChild.y.invert(actTranslate1)]);


}


function onAutoUpdate(svg, svgChild, valuesNew, gapMinute, sumMapUpdate){

  valuesNew.sort(sortValuesCurrent);
  
  var totalUpdate = [];

  var x = 60;

  var xMax = 60 + gapMinute;

  var sum = 0;
  var i = 0;


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

  svgChild.total = Math.max(svgChild.total,d3.max(totalUpdate));

  removeValuesOnUpdate(svg,svgChild.values,sumMapUpdate,gapMinute);

  sumMapUpdate.forEach(function(value,key){

    if(!svg.sumMap.has(key)){
      svg.sumMap.set(key,{sum:value.sum, display:value.display})
    }

  });


  svgChild.selection = svgChild.chart.selectAll(".data");
  svgChild.values = svgChild.selection.data();
  svgChild.values = svgChild.values.concat(valuesNew);


  svgChild.selection = svgChild.chart.selectAll(".data")
    .data(svgChild.values);

  var selecEnter = svgChild.selection.enter()
    .append("rect")
    .classed("data", true)
    .attr("fill", function (d) {
      return svg.colorMap.get(d.item);
    })
    .attr("stroke", "#000000");

  svgChild.selection = selecEnter.merge(svgChild.selection);

  svgChild.values.sort(sortValuesCurrent);


  svgChild.valuesSCAlphabetSort = svgChild.values.concat();
  svgChild.valuesSCAlphabetSort.sort(sortAlphabetItemOnly);


  selecEnter.on("mouseover", svgChild.activationElemsAutoScroll).on("mouseout", svgChild.deactivationElems);

  svgChild.selecEnter = selecEnter;

  updateScales2HistoCurrent(svg, svgChild);




}


/**
 *
 * @param svg
 * @param svgChild
 * @param sumMapUpdate
 */
function onEndAutoUpdate(svg,svgChild, sumMapUpdate){


  createTooltipHistoCurrent(svg,svgChild.selecEnter,svg.sumMap);


  var maxTotal = 1;

  svgChild.chart.selectAll(".data").each(function(d){

    d.x = Math.round(d.x);
    if(d.x < 0){
      this.remove();
    }else{
      maxTotal = Math.max(maxTotal,d.y);
    }

  });

  svgChild.total = maxTotal;

  svgChild.selection = svgChild.chart.selectAll(".data");

  svgChild.values = svgChild.selection.data();


  svgChild.values.sort(sortValuesCurrent);

  svgChild.valuesSCAlphabetSort = svgChild.values.concat();
  svgChild.valuesSCAlphabetSort.sort(sortAlphabetItemOnly);

  updateSumArray(svgChild.sumArray, sumMapUpdate,svgChild.hiddenValues,svgChild.mapPercentDisplay);

  svgChild.sumArray.sort(sortAlphabet);




  svgChild.trSelec = svgChild.table.selectAll("tr").data(svgChild.sumArray);
  svgChild.trSelec.classed("strikedRow",function(d){return svgChild.hiddenValues.indexOf(d.item) !== -1; });
  svgChild.trSelec.select("div").style("background-color", function (d) {
    return svg.colorMap.get(d.item);
  });

  svgChild.trSelec.select("td:nth-of-type(2)").text(function (d) {
    return d.display;
  });


  var trselecEnter = svgChild.trSelec.enter().append("tr")
    .classed("strikedRow",function(d){return svgChild.hiddenValues.indexOf(d.item) !== -1; });

  trselecEnter.append("td").append("div").classed("lgd", true).style("background-color", function (d) {
    return svg.colorMap.get(d.item);
  });

  trselecEnter.append("td").text(function (d) {
    return d.display;
  });


  trselecEnter.on("click",svgChild.onClick).on("contextmenu", svgChild.onContextMenu);

  svgChild.trSelec.exit().remove();

  svgChild.trSelec = svgChild.table.selectAll("tr");

  svgChild.trSelec.on("mouseover",svgChild.activationElems).on("mouseout", svgChild.deactivationElems);

  tableLegendTitle(svg, svgChild.trSelec);

  updateScales2HistoCurrent(svg, svgChild);
  update2HistoStack(svg, svgChild);

}