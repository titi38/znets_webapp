


//temporary definitions
/************************************************************************************************************
 *
 * createMap
 *
 * @param div: the container div
 * @param svg: the root svg
 * @param urlJson: the url to get the world
 * @param mydiv: div name (string)
 *
 * Create a map with resize and zoom functionality
 *
 ***********************************************************************************************************/

function createMap(div,svg,mydiv, urlJson){

  //finding/computing the div dimensions

  var clientRect = div.node().getBoundingClientRect();
  var divWidth = Math.max(svg.margin.left + svg.margin.right + 1,clientRect.width),
    divHeight = Math.max(svg.margin.bottom + svg.margin.top + 1,clientRect.height);



  //Some pre-computation to find the dimensions of the map (with a determined height/width ratio
  // for a given standard latitude)

  //Maximum potential width & height the map will have

  svg.width = divWidth - svg.margin.left - svg.margin.right;
  svg.height = divHeight - svg.margin.bottom - svg.margin.top;

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

  var projectionScale = Math.min(svg.width/svg.mapDefaultWidth,svg.height/svg.mapDefaultHeight);

  //update of the correct width & height

  svg.width = projectionScale*svg.mapDefaultWidth;
  svg.height = projectionScale*svg.mapDefaultHeight;

  //dimensions of the root svg (= with margins)

  svg.attr("width", svg.width + svg.margin.left + svg.margin.right + "px")
    .attr("height", svg.height + svg.margin.bottom + svg.margin.top + "px");

  //dimensions of the svg map container (= without margins)

  svg.svg = svg.append("svg").attr("x",svg.margin.left).attr("y",svg.margin.top).attr("width",svg.width)
    .attr("height",svg.height).classed("geometricPrecision",true);

  //A rect is appended first (= background) with the size of svg.svg as a sea representation

  svg.backgroundRect = svg.svg.append("rect").attr("width",svg.width).attr("height",svg.height).classed("backgroundSea",true);

  //Computation of the cylindrical equal-area projection with the given standard latitude and
  // the precomputed scale projectionScale

  var projection = d3.geoProjection(function(lambda,phi){
      return [lambda*cosStdPar,Math.sin(phi)/cosStdPar]; })
    .translate([svg.width/2,svg.height/2])
    .scale(projectionScale);

  //The corresponding path function creation for this projection
  var path = d3.geoPath().projection(projection);

  //svg.maps will contain the 2 maps for rotation

  svg.maps = svg.svg.append("g");

  //svg.map will contain the first initial map

  svg.map = svg.maps.append("g");

  //stroke-width controlled by javascript to adapt it to the current scale
  //0.3 when map scale = 100

  svg.strokeWidth = 0.003*projectionScale;
  svg.maps.style("stroke-width", svg.strokeWidth);

  //color for test

  var f = colorEval();


  d3.json(urlJson,function(error, worldmap) {

    //test json conformity

    if (typeof worldmap === "undefined" || error) {
      noData(div, svg,mydiv);
      return false;
    }

    //the binded data, containing the countries info and topology

    var data = topojson.feature(worldmap,worldmap.objects.countries).features;

    console.log(data);

    //Creation of the countries

    svg.map.selectAll(".countries")
      .data(data)
      .enter().append("path")
      .style("fill",function(){return f()})
      .attr("d",path)
      .classed("countries",true)
      .append("svg:title").text(function(d){return d.properties.name;});


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


    //A duplicate map is created and translated next to the other, outside viewport
    //The .99991 operation avoid a little cut to be too visible where the 2 maps meet.

    svg.map2 = d3.select(svg.maps.node().appendChild(svg.map.node().cloneNode(true)))
      .attr("transform","matrix(1, 0, 0,1," + (0.99991*svg.width) + ", 0)");

    //the data are binded to the second map (may be useful later)

    svg.map2.selectAll(".countries").data(data);

    //listener showing the binded datum on click, for test

    svg.maps.selectAll(".countries").on("click",function(d){
      console.log(d);});

    //added functionalities

    addZoomMap(svg);
    addResizeMap(div,svg,mydiv);


  }); //d3.json end
}


/************************************************************************************************************
 *
 * addResizeMap
 *
 * @param div: the container div
 * @param svg: the root svg
 * @param mydiv: div name (string)
 *
 * Add a listener to resize the map
 *
 * Needed:
 * svg.svg, the map container
 * svg.width,svg.width, the dimensions of svg.svg
 * svg.maps, a g element child of svg.svg containing the maps
 * svg.translate, svg.zoom, zoom functionalities provided by addZoomMap
 * svg.backgroundRect, the rect providing the sea color
 * svg.mapDefaultWidth, svg.mapDefaultHeight, the map dimensions when scale projection = 1
 *
 ***********************************************************************************************************/


function addResizeMap(div,svg,mydiv){

  var oldHeight, divWidth,divHeight,coefScaling,scaleTotal,projectionScale;

  //the total ratio alteration since the beginning

  if(typeof svg.ratioProjectionScale === "undefined"){
    svg.ratioProjectionScale = 1;
  }

  d3.select(window).on("resize."+mydiv,function(){




    //initial height kept for future computation of the resize augmentation

    oldHeight = svg.height;

    //finding/computing the div dimensions
    var clientRect = div.node().getBoundingClientRect();
    divWidth = Math.max(svg.margin.left + svg.margin.right + 1,clientRect.width);
    divHeight = Math.max(svg.margin.bottom + svg.margin.top + 1,clientRect.height);


    //Some computation to find the new dimensions of the map (with a constant height/width ratio)

    svg.width = divWidth - svg.margin.left - svg.margin.right;
    svg.height = divHeight - svg.margin.bottom - svg.margin.top;
    projectionScale = Math.min(svg.width/svg.mapDefaultWidth,svg.height/svg.mapDefaultHeight);
    svg.width = projectionScale*svg.mapDefaultWidth;
    svg.height = projectionScale*svg.mapDefaultHeight;

    //svg and svg.svg dimensions are accordingly updated

    svg.attr("width", svg.width + svg.margin.left + svg.margin.right + "px")
      .attr("height", svg.height + svg.margin.bottom + svg.margin.top + "px");
    svg.svg.attr("width",svg.width).attr("height",svg.height);

    //Evaluation of the resize ratio augmentation

    coefScaling = svg.height/oldHeight;

    //update of svg.ratioProjectionScale and computation of the map total effective scaling

    svg.ratioProjectionScale *= coefScaling;
    scaleTotal = svg.ratioProjectionScale * svg.transform.k;

    //update of the translation vector

    svg.transform.x *= coefScaling;
    svg.transform.y *= coefScaling;

    //update of the internal zoom translation vector

    updateTransform(svg.svg,svg.transform);

    //the modifications are performed

    svg.maps.attr("transform","matrix(" +  scaleTotal + ", 0, 0, " + scaleTotal + ", " + svg.transform.x + ", " + svg.transform.y + ")");

    //update of the sea rect

    svg.backgroundRect.attr("width",svg.width).attr("height",svg.height);

    //update of some styling variables.

    svg.strokeDash *= coefScaling;
    svg.strokeWidth *= coefScaling;


  })

}



/************************************************************************************************************
 *
 * addZoomMap
 *
 * @param svg: the root svg.
 *
 * Add a listener allowing to zoom and translate the map
 *
 * Needed:
 * svg.svg, the map container
 * svg.width,svg.width, the dimensions of svg.svg
 * svg.maps, a g element child of svg.svg containing the maps
 * svg.strokeDash, the size and spacing of internal's borders strokes when the zoom scale = 1
 * svg.strokeWidth, the width of strokes when zoom scale = 1
 *
 ************************************************************************************************************/

function addZoomMap(svg){


  if(typeof svg.ratioProjectionScale === "undefined"){
    svg.ratioProjectionScale = 1;
  }

  svg.transform = {k:1,x:0,y:0};
  var widthScale, scaleTotal, dashValue;


  svg.zoom = d3.zoom().scaleExtent([1,20]).on("zoom",function(){

      //computation of useful values
      svg.transform = d3.event.transform;

      widthScale = svg.width*svg.transform.k;
      scaleTotal = svg.transform.k*svg.ratioProjectionScale;
      dashValue = svg.strokeDash/scaleTotal;


      //Evaluation of effective translation vectors
      //for "rotation" of the planisphere, svg.transform.x should always be in the [0,-widthScale] range.
      svg.transform.x = svg.transform.x - Math.ceil(svg.transform.x/widthScale)*widthScale;
      svg.transform.y = Math.min(0, Math.max(svg.transform.y,svg.height - svg.transform.k*svg.height));

      //zoom and translation are performed

      svg.maps.attr("transform","matrix(" + scaleTotal + ", 0, 0, " + scaleTotal + ", " + svg.transform.x + ", " + svg.transform.y + ")");

      //styling update, for keeping the same visual effect

      svg.maps.style("stroke-width",svg.strokeWidth/scaleTotal);
      svg.maps.selectAll(".interior").style("stroke-dasharray",dashValue + "," + dashValue);




    })
    .on("end",function(){
      svg.svg._groups[0][0].__zoom.k =svg.transform.k;
      svg.svg._groups[0][0].__zoom.x =svg.transform.x;
      svg.svg._groups[0][0].__zoom.y =svg.transform.y;
    });

  //the listener is finally created on the svg element used as the map container.

  svg.svg.call(svg.zoom);

  //A fresh start...
  svg.svg._groups[0][0].__zoom.k =svg.transform.k;
  svg.svg._groups[0][0].__zoom.x =svg.transform.x;
  svg.svg._groups[0][0].__zoom.y =svg.transform.y;


}

