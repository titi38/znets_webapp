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

  hideShowValues2Histo(svg,svgChild,svgChild.trSelec,svgChild.selection,svg.xMax);
  /*
   addPopup2Histo(selection, div, svg , svgChild, numSvg, function(data){
   desactivationElems();
   activationElemsAutoScrollPopup(data);},
   desactivationElems)
   */

}


