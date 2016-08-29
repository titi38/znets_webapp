/**
 * Created by elie.
 */


/**
 * Requests two Json objects from the server, the world map and the data, then call the function to draw the map.
 * @param div {Object} D3 encapsulated parent div element.
 * @param svg {Object} D3 encapsulated parent svg element, direct child of div parameter.
 * @param mydiv {String} Div identifier.
 * @param urlJson {String} Url to request the data to the server.
 */

function createChoroplethDirection(div, svg, mydiv, urlJson){



  d3.queue()
    .defer(d3.json,"javascripts/D3JSCharts/worldmap.json")
//    .defer(d3.json, "worldmap.json")
    .defer(d3.json, urlJson)
    .await(function(error,worldmap,json){
      createMapDirection(error, div, svg, mydiv, urlJson, worldmap, json);
    })

}


/**
 * Create a map with resize and zoom features.
 * @param error {Object} A Javascript error returned by d3.json
 * @param div {Object} D3 encapsulated parent div element.
 * @param svg {Object} D3 encapsulated parent svg element, direct child of div parameter.
 * @param mydiv {String} Div identifier.
 * @param urlJson {String} Url to request the data to the server.
 * @param worldmap {Object} The Json object containing the information to create a map of the world.
 * @param json {Object} The Json object containing the data sent by the server.
 */

function createMapDirection(error,div,svg,mydiv, urlJson, worldmap,json){

  svg.style("margin", "auto").classed("diagram",false).style("display","block");

  var colorBottomStart = "#ffff00", colorBottomEnd = "#ff0000";
  var colorTopStart = "#66ffcc", colorTopEnd = "#0066ff";

  svg.margin.offsetLegend = 5;
  svg.margin.legendWidth = 10;
  svg.margin.right = svg.margin.offsetLegend * 2 + svg.margin.legendWidth + 60;
  svg.margin.left = 5;
  svg.margin.top = 20;
  svg.margin.bottom = 5;

  if(error || typeof json === "undefined" || json.result != "true" || typeof json.response.data === "undefined"){
    noData(div,svg,mydiv,"error json conformity");
    return;
  }


  json = json.response;
  var jsonContent = json.content;
  var jsonData = json.data[0][1];

  var itemValue = searchItemValue(jsonContent);
  var amountValue = searchAmountValue(jsonContent);
  var directionValue = searchDirectionValue(jsonContent);

  svg.amountByCountryCodeBottom = new Map();
  svg.amountByCountryCodeTop = new Map();

  if(!(itemValue && amountValue && directionValue)){
    noData(div,svg,mydiv,"error no value found");
    return;
  }

  var bottomMax = 0;
  var bottomMin = Infinity;

  var topMax = 0;
  var topMin = Infinity;

  var elemAmount;
  var elemItem;
  jsonData.forEach(function(elem){

    elemItem = elem[itemValue];
    elemAmount = +elem[amountValue];

    if(elemItem === "--" || elemItem === ""){
      return;
    }

    switch(elem[directionValue]){

      case "OUT":
        svg.amountByCountryCodeBottom.set(elem[itemValue], elemAmount);
        bottomMax = Math.max(bottomMax, elemAmount);
        bottomMin = Math.min(bottomMin, elemAmount);
        break;

      case "IN":
        svg.amountByCountryCodeTop.set(elem[itemValue], elemAmount);
        topMax = Math.max(topMax, elemAmount);
        topMin = Math.min(topMin, elemAmount);
        break;

      default:
        console.log("inconsistent direction value");
        break;

    }

  });

  if(svg.amountByCountryCodeBottom.size === 0){
    bottomMin = 0;
    bottomMax = 1;
  }


  if(svg.amountByCountryCodeTop.size === 0){
    topMin = 0;
    topMax = 1;
  }



  svg.lastMinute = json.data[0][0];
  svg.units = json.units;

  //finding/computing the div dimensions

  var clientRect = div.node().getBoundingClientRect();
  var divWidth = Math.max(svg.margin.left + svg.margin.right + 1,clientRect.width),
    divHeight = Math.max(svg.margin.bottom + svg.margin.top + svg.margin.zero + 1,clientRect.height);



  //Some pre-computation to find the dimensions of the map (with a determined height/width ratio
  // for a given standard latitude)

  //Maximum potential width & height the map will have

  svg.width = divWidth - svg.margin.left - svg.margin.right;
  svg.height = divHeight - svg.margin.bottom - svg.margin.top;
  svg.mapHeight = (svg.height - svg.margin.zero)*0.5 ;

  //The wished standard latitude for a cylindrical equal-area projection (in degree)
  //37.5: Hobo-Dyer projection, 45: Gall-Peters projection

  var standardParallelDeg = 37.5;

  //Conversion in radians and cosinus precomputation

  var standardParallelRad = standardParallelDeg*2*Math.PI/360;
  var cosStdPar = Math.cos(standardParallelRad);

  //evaluation of the map width & height if the projection scale = 1, then homothetic zooming.

  svg.mapDefaultWidth = 2*Math.PI*cosStdPar;
  svg.mapDefaultHeight = 2/cosStdPar;

  //evaluation of the optimal scale coefficient for the chosen format

  var projectionScale = Math.min(svg.width/svg.mapDefaultWidth,svg.mapHeight/svg.mapDefaultHeight);

  //update of the correct width & height

  svg.width = projectionScale*svg.mapDefaultWidth;
  svg.mapHeight = projectionScale*svg.mapDefaultHeight;
  svg.height = svg.mapHeight * 2 + svg.margin.zero;

  //dimensions of the root svg (= with margins)

  svg.attr("width", svg.width + svg.margin.left + svg.margin.right + "px")
    .attr("height", svg.height + svg.margin.bottom + svg.margin.top + "px");

  //dimensions of the svg map container (= without margins)

  svg.svg = svg.append("svg").attr("x",svg.margin.left).attr("y",svg.margin.top).attr("width",svg.width)
    .attr("height", svg.mapHeight).classed("geometricPrecision",true);

  //A rect is appended first (= background) with the size of svg.svg as a sea representation

  svg.backgroundRect = svg.svg.append("rect")
    .attr("width",svg.width)
    .attr("height",svg.mapHeight)
    .attr("y",0)
    .classed("backgroundSea sizeMap",true);



  //Computation of the cylindrical equal-area projection with the given standard latitude and
  // the precomputed scale projectionScale

  var projection = d3.geoProjection(function(lambda,phi){
      return [lambda*cosStdPar,Math.sin(phi)/cosStdPar]; })
    .translate([svg.width/2,svg.mapHeight/2])
    .scale(projectionScale);

  //The corresponding path function creation for this projection
  var path = d3.geoPath().projection(projection);

  //svg.maps will contain the 2 maps for rotation

  svg.svg.maps = svg.svg.append("g");

  //svg.map will contain the first initial map

  svg.map = svg.svg.maps.append("g").classed("gMap",true);

  //stroke-width controlled by javascript to adapt it to the current scale
  //0.3 when map scale = 100

  svg.strokeWidth = 0.003*projectionScale;
  svg.svg.maps.style("stroke-width", svg.strokeWidth);

  //test json conformity

  if (typeof worldmap === "undefined" || error) {
    noData(div, svg,mydiv, "error json conformity");
    return false;
  }





  svg.scaleLinearBottom = d3.scaleLinear().range([0,1]);
  var colorInterpolatorBottom = d3.interpolateRgb(colorBottomStart,colorBottomEnd);

  svg.scaleLinearTop = d3.scaleLinear().range([0,1]);
  var colorInterpolatorTop = d3.interpolateRgb(colorTopStart,colorTopEnd);

  //Axes

  svg.scaleBottomDisplay = d3.scaleLinear().range([svg.mapHeight,0]);

  svg.axisBottom = svg.append("g")
    .attr("class", "axisGraph");

  svg.labelGradientBottom = svg.append("text")
    .classed("labelChoropleth",true)
    .attr("x",svg.margin.top + 1.5 * svg.mapHeight + svg.margin.zero)
    .attr("y",-svg.margin.left - svg.width - svg.margin.right)
    .attr("dy","1.3em")
    .attr("transform", "rotate(90)");


  svg.scaleTopDisplay = d3.scaleLinear().range([svg.mapHeight,0]);

  svg.axisTop = svg.append("g").attr("class", "axisGraph");

  svg.labelGradientTop = svg.append("text")
    .classed("labelChoropleth",true)
    .attr("x",svg.margin.top + 0.5 * svg.mapHeight)
    .attr("y",-svg.margin.left - svg.width - svg.margin.right)
    .attr("dy","1.3em")
    .attr("transform", "rotate(90)");

  updateDataAxesMap(svg,bottomMin,bottomMax,topMin,topMax);









  svg.scaleColorBottom = function(countryCode){

    var value = svg.amountByCountryCodeBottom.get(countryCode);

    if(!value){
      return "#ffffff";
    }

    return colorInterpolatorBottom(svg.scaleLinearBottom(value));

  };

  svg.scaleColorTop = function(countryCode){

    var value = svg.amountByCountryCodeTop.get(countryCode);

    if(!value){
      return "#ffffff";
    }

    return colorInterpolatorTop(svg.scaleLinearTop(value));

  };





  //the binded data, containing the countries info and topology

  var data = topojson.feature(worldmap,worldmap.objects.countries).features;

  console.log(data);

  svg.titleTop = mapCountryTitleTop(svg);
  //Creation of the countries
  svg.map.selectAll(".countries")
    .data(data)
    .enter().append("path")
    .style("fill",function(d){return svg.scaleColorTop(d.id)})
    .attr("d",path)
    .classed("countries",true)
    .append("svg:title").text(svg.titleTop);


  //stroke-dasharray controlled by javascript to adapt it to the current scale
  // value 2,2 when map scale = 100

  svg.strokeDash = 0.02*projectionScale;

  //Interior boundaries creation

  svg.map.append("path")
    .datum(topojson.mesh(worldmap,worldmap.objects.countries,function(a,b){
      return a !==b;
    }))
    .attr("d",path)
    .classed("countries_boundaries interior",true)
    //zoom dependant, javascript controlled style property with precalculed svg.strokeDash
    .style("stroke-dasharray", svg.strokeDash + "," + svg.strokeDash);

  //Exterior boundaries creation

  svg.map.append("path")
    .datum(topojson.mesh(worldmap,worldmap.objects.countries,function(a,b){
      return a ===b;
    }))
    .attr("d",path)
    .classed("countries_boundaries exterior",true);

  //map border.
  svg.svg.append("rect")
    .attr("width",svg.width)
    .attr("height",svg.mapHeight)
    .attr("y",0)
    .classed("rectBorder sizeMap",true);


  //A duplicate map is created and translated next to the other, outside viewport
  //The .99991 operation avoid a little cut to be too visible where the 2 maps meet.

  svg.map2 = d3.select(svg.svg.maps.node().appendChild(svg.map.node().cloneNode(true)))
    .attr("transform","matrix(1, 0, 0,1," + (0.99991*svg.width) + ", 0)");

  //the data are binded to the second map (may be useful later)

  svg.map2.selectAll(".countries").data(data);



  //Maps out

  svg.svg2 = d3.select(svg.node().appendChild(svg.svg.node().cloneNode(true)))
    .attr("y",svg.margin.top + svg.margin.zero + svg.mapHeight);


  svg.svg2.maps = svg.svg2.select("g");

  svg.titleBottom = mapCountryTitleBottom(svg);

  svg.countriesBottom = svg.svg2.maps.selectAll(".gMap").selectAll(".countries");
  svg.countriesBottom.data(data)
    .style("fill",function(d){return svg.scaleColorBottom(d.id)})
    .select("title").text(svg.titleBottom);

  svg.countriesTop = svg.svg.maps.selectAll(".gMap").selectAll(".countries");


  //titles

  svg.label1 = svg.append("text")
    .classed("labelChoropleth",true)
    .attr("x", svg.margin.left + svg.width/2)
    .attr("dy", "-0.5em")
    .attr("y",svg.margin.top)
    .text("Ingress");

  svg.label2 = svg.append("text")
    .classed("labelChoropleth",true)
    .attr("x", svg.margin.left + svg.width/2)
    .attr("dy", "-0.5em")
    .attr("y",svg.margin.top + svg.mapHeight + svg.margin.zero)
    .text("Egress");


  //legend
  //Definition of the colors gradient

  appendVerticalLinearGradientDefs(svg,"linearTop",colorTopStart,colorTopEnd);

  svg.legendTop = svg.append("rect").attr("x",svg.width + svg.margin.left + svg.margin.offsetLegend)
    .attr("y",svg.margin.top)
    .attr("width",svg.margin.legendWidth)
    .attr("height",svg.mapHeight)
    .attr("fill", "url(#linearTop)");


  appendVerticalLinearGradientDefs(svg,"linearBottom",colorBottomStart,colorBottomEnd);

  svg.legendBottom = svg.append("rect").attr("x",svg.width + svg.margin.left + svg.margin.offsetLegend)
    .attr("y",svg.margin.top + svg.mapHeight + svg.margin.zero)
    .attr("width",svg.margin.legendWidth)
    .attr("height",svg.mapHeight)
    .attr("fill", "url(#linearBottom)");



  //added functionalities

  addZoomMapDirection(svg,svg.svg);
  addZoomMapDirection(svg,svg.svg2);
  addResizeMapDirection(div,svg,mydiv);

  autoUpdateMapDirection(svg, urlJson);




}


/**
 * Updates the maps with new data on websocket's notification.
 * @param svg {Object} D3 encapsulated parent svg element.
 * @param urlJson {String} Url to request the data to the server.
 */

function autoUpdateMapDirection(svg,urlJson){
  var duration = 800;

  var id = myLastHourHistory.addMinuteRequest(urlJson,function(json){

    console.log(json);

    if(typeof json === "undefined" || typeof json.data === "undefined"){
      console.warn("map update: no data");
      return;
    }

    if(json.data[0][0] === svg.lastMinute){
      console.log("same minute");
      return;
    }

    svg.lastMinute = json.data[0][0];
    var jsonContent = json.content;
    var jsonData = json.data[0][1];

    var itemValue = searchItemValue(jsonContent);
    var amountValue = searchAmountValue(jsonContent);
    var directionValue = searchDirectionValue(jsonContent);

    svg.amountByCountryCodeBottom = new Map();
    svg.amountByCountryCodeTop = new Map();

    if(!(itemValue && amountValue && directionValue)){
      return;
    }

    var bottomMax = 0;
    var bottomMin = Infinity;

    var topMax = 0;
    var topMin = Infinity;

    var elemAmount;
    var elemItem;


    jsonData.forEach(function(elem){

      elemItem = elem[itemValue];
      elemAmount = +elem[amountValue];

      if(elemItem === "--" || elemItem === ""){
        return;
      }

      switch(elem[directionValue]){

        case "OUT":
          svg.amountByCountryCodeBottom.set(elem[itemValue], elemAmount);
          bottomMax = Math.max(bottomMax, elemAmount);
          bottomMin = Math.min(bottomMin, elemAmount);
          break;

        case "IN":
          svg.amountByCountryCodeTop.set(elem[itemValue], elemAmount);
          topMax = Math.max(topMax, elemAmount);
          topMin = Math.min(topMin, elemAmount);
          break;

        default:
          console.warn("inconsistent direction value");
          break;

      }

    });

    if(svg.amountByCountryCodeBottom.size === 0){
      bottomMin = 0;
      bottomMax = 1;
    }


    if(svg.amountByCountryCodeTop.size === 0){
      topMin = 0;
      topMax = 1;
    }
    console.log(svg.amountByCountryCodeTop);
    console.log(svg.amountByCountryCodeBottom);


    updateDataAxesMap(svg,bottomMin,bottomMax,topMin,topMax);

    svg.countriesBottom.style("fill",function(d){return svg.scaleColorBottom(d.id)})
      .select("title").text(svg.titleBottom);

    svg.countriesTop.style("fill",function(d){
        return svg.scaleColorTop(d.id)})
      .select("title").text(svg.titleTop);

  },-1);

  console.log(id);
}


/**
 * Updates internal variables and redraw the maps on resize event.
 * @param div {Object} D3 encapsulated parent div element.
 * @param svg {Object} D3 encapsulated parent svg element, direct child of div parameter.
 * @param mydiv {String} Div identifier.
 */


function addResizeMapDirection(div,svg,mydiv){

  var oldMapHeight, divWidth,divHeight,coefScaling,scaleTotal1,scaleTotal2,projectionScale;

  //the total ratio alteration since the beginning

  if(typeof svg.ratioProjectionScale === "undefined"){
    svg.ratioProjectionScale = 1;
  }

  d3.select(window).on("resize."+mydiv,function(){




    //initial height kept for future computation of the resize augmentation

    oldMapHeight = svg.mapHeight;

    //finding/computing the div dimensions
    var clientRect = div.node().getBoundingClientRect();
    divWidth = Math.max(svg.margin.left + svg.margin.right + 1,clientRect.width);
    divHeight = Math.max(svg.margin.bottom + svg.margin.top + 1,clientRect.height);


    //Some computation to find the new dimensions of the map (with a constant height/width ratio)

    svg.width = divWidth - svg.margin.left - svg.margin.right;
    svg.height = divHeight - svg.margin.bottom - svg.margin.top;
    svg.mapHeight = (svg.height - svg.margin.zero)*0.5 ;


    projectionScale = Math.min(svg.width/svg.mapDefaultWidth,svg.mapHeight/svg.mapDefaultHeight);
    svg.width = projectionScale*svg.mapDefaultWidth;
    svg.mapHeight = projectionScale*svg.mapDefaultHeight;
    svg.height = svg.mapHeight * 2 + svg.margin.zero;

    //svg and svg.svg dimensions are accordingly updated

    svg.attr("width", svg.width + svg.margin.left + svg.margin.right + "px")
      .attr("height", svg.height + svg.margin.bottom + svg.margin.top + "px");

    svg.svg.attr("width",svg.width).attr("height",svg.mapHeight);

    svg.svg2.attr("width",svg.width).attr("height",svg.mapHeight)
      .attr("y",svg.margin.top + svg.margin.zero + svg.mapHeight);

    //Evaluation of the resize ratio augmentation

    coefScaling = svg.mapHeight/oldMapHeight;

    //update of svg.ratioProjectionScale and computation of the map total effective scaling

    svg.ratioProjectionScale *= coefScaling;

    scaleTotal1 = svg.ratioProjectionScale * svg.svg.transform.k;
    scaleTotal2 = svg.ratioProjectionScale * svg.svg2.transform.k;


    //update of the translation vector

    svg.svg.transform.x *= coefScaling;
    svg.svg.transform.y *= coefScaling;

    svg.svg2.transform.x *= coefScaling;
    svg.svg2.transform.y *= coefScaling;

    //update of the internal zoom translation vector

    updateTransform(svg.svg,svg.svg.transform);
    updateTransform(svg.svg2,svg.svg2.transform);


    //the modifications are performed

    svg.svg.maps.attr("transform","matrix(" +  scaleTotal1 + ", 0, 0, " + scaleTotal1 + ", " + svg.svg.transform.x + ", " + svg.svg.transform.y + ")");
    svg.svg2.maps.attr("transform","matrix(" +  scaleTotal2 + ", 0, 0, " + scaleTotal2 + ", " + svg.svg2.transform.x + ", " + svg.svg2.transform.y + ")");

    //update of the sea rect

    svg.selectAll(".sizeMap").attr("width",svg.width).attr("height",svg.mapHeight);

    //update of some styling variables.

    svg.strokeDash *= coefScaling;
    svg.strokeWidth *= coefScaling;

    //update of labels position
    svg.label1.attr("x", svg.margin.left + svg.width/2);
    svg.label2.attr("x", svg.margin.left + svg.width/2)
      .attr("y",svg.margin.top + svg.mapHeight + svg.margin.zero);

    svg.legendBottom
      .attr("x",svg.width + svg.margin.left + svg.margin.offsetLegend)
      .attr("y",svg.margin.top + svg.mapHeight + svg.margin.zero)
      .attr("height",svg.mapHeight);

    svg.legendTop
      .attr("x",svg.width + svg.margin.left + svg.margin.offsetLegend)
      .attr("height",svg.mapHeight);

    resizeAxesMap(svg);


  })

}


/**
 * Add zoom feature to one map.
 * @param parentSvg {Object} D3 encapsulated parent svg element.
 * @param svg {Object} D3 encapsulated svg element, which contains one map.
 */

function addZoomMapDirection(parentSvg,svg){



  if(typeof parentSvg.ratioProjectionScale === "undefined"){
    parentSvg.ratioProjectionScale = 1;
  }

  svg.transform = {k:1,x:0,y:0};
  var widthScale, scaleTotal, dashValue;


  svg.zoom = d3.zoom().scaleExtent([1,100]).on("zoom",function(){

      //computation of useful values
      svg.transform = d3.event.transform;

      widthScale = parentSvg.width*svg.transform.k;
      scaleTotal = svg.transform.k*parentSvg.ratioProjectionScale;
      dashValue = parentSvg.strokeDash/scaleTotal;


      //Evaluation of effective translation vectors
      //for "rotation" of the planisphere, svg.transform.x should always be in the [0,-widthScale] range.
      svg.transform.x = svg.transform.x - Math.ceil(svg.transform.x/widthScale)*widthScale;
      svg.transform.y = Math.min(0, Math.max(svg.transform.y,parentSvg.mapHeight - svg.transform.k*parentSvg.mapHeight));

      //zoom and translation are performed

      svg.maps.attr("transform","matrix(" + scaleTotal + ", 0, 0, " + scaleTotal + ", " + svg.transform.x + ", " + svg.transform.y + ")");

      //styling update, for keeping the same visual effect

      svg.maps.style("stroke-width",parentSvg.strokeWidth/scaleTotal);
      svg.maps.selectAll(".interior").style("stroke-dasharray",dashValue + "," + dashValue);




    })
    .on("start",function(){
      svg.on("contextmenu.zoomReset",null);
    })

    .on("end",function(){
      svg._groups[0][0].__zoom.k =svg.transform.k;
      svg._groups[0][0].__zoom.x =svg.transform.x;
      svg._groups[0][0].__zoom.y =svg.transform.y;

      svg.on("contextmenu.zoomReset",function(){

        svg._groups[0][0].__zoom.k = 1;
        svg._groups[0][0].__zoom.x = 0;
        svg._groups[0][0].__zoom.y = 0;

        svg.transform.k = 1;
        svg.transform.x = 0;
        svg.transform.y = 0;

        scaleTotal = parentSvg.ratioProjectionScale;
        dashValue = parentSvg.strokeDash/scaleTotal;

        svg.maps.attr("transform","matrix(" + scaleTotal + ", 0, 0, " + scaleTotal + ",0,0)");
        svg.maps.style("stroke-width",parentSvg.strokeWidth/scaleTotal);
        svg.maps.selectAll(".interior").style("stroke-dasharray",dashValue + "," + dashValue);
      });

    });

  //the listener is finally created on the svg element used as the map container.

  svg.call(svg.zoom);

  //A fresh start...
  svg._groups[0][0].__zoom.k =svg.transform.k;
  svg._groups[0][0].__zoom.x =svg.transform.x;
  svg._groups[0][0].__zoom.y =svg.transform.y;


}
