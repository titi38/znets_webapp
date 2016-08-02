

/************************************************************************************************************/

function createCurve(div, svg, mydiv, urlJson){


  d3.json(urlJson, function (error, json) {


    console.log(json);

    //test json conformity
    if (testJson(json) || error ) {
      console.log("incorrect url/data");
      noData(div, svg,mydiv);
      return false;
    }

    //json ok, graph creation

    json = json.response;
    console.log(json);

    var clientRect = div.node().getBoundingClientRect();
    var divWidth = Math.max(svg.margin.left + svg.margin.right + 1, clientRect.width),
      divHeight = Math.max(svg.margin.bottom + svg.margin.top + 1, clientRect.height);

    svg.attr("width", divWidth).attr("height", divHeight);


    svg.width = divWidth - svg.margin.left - svg.margin.right;
    svg.height = divHeight - svg.margin.bottom - svg.margin.top;


    svg.x = d3.scaleLinear()
      .range([0, svg.width]);

    svg.y = d3.scaleLinear()
      .range([svg.height, 0]);


    svg.svg = svg.append("svg").attr("x", svg.margin.left).attr("y", svg.margin.top).attr("width", svg.width)
      .attr("height", svg.height).classed("svgline", true);

    svg.grid = svg.svg.append("g").classed("grid", true);

    svg.chart = svg.svg.append("g");

    svg.valueline = d3.line().curve(d3.curveMonotoneX);
    svg.area = d3.area().curve(d3.curveMonotoneX);

    var jsonData = json.data;
    var jsonContent = json.content;
    svg.units = unitsStringProcessing(json.units);

    var contentAmountValue = searchAmountValue(jsonContent);
    var contentDateValue = searchDateValue(jsonContent);

    //if no date/amount value found, the graph can't be done.
    if(contentAmountValue === false || contentDateValue === false){
      noData(div,svg,mydiv);
      return;
    }

    var hourShift = getTimeShift(urlJson) * 3600000;


    //Conversion date to elapsed time since 1st January 1970.
    jsonData.forEach(function(elem){
      elem[contentDateValue] = (new Date(elem[contentDateValue])).getTime() + hourShift;
    });

    //sort, to make sure
    jsonData.sort(function(a,b){return a[contentDateValue] - b[contentDateValue];});


    var jsonDataLength = jsonData.length;


    svg.step = (urlJson.indexOf("pset=MINUTE") === -1)?((urlJson.indexOf("pset=DAILY") === - 1)?3600000:86400000):60000;
    svg.timeMin = jsonData[0][contentDateValue];

    var index,elemJson;

    svg.data = [];


    //Final data array construction.
    for(var i = 0; i < jsonDataLength; i++){

      elemJson = jsonData[i];
      index = (elemJson[contentDateValue] - svg.timeMin)/svg.step;

      //Fill the gaps in the dates with 0s;
      while(svg.data.length < index){
        svg.data.push(0);
      }

      if(svg.step === 60000){
        //pset=MINUTE

        var amountArray = elemJson[contentAmountValue];


        for(var j = 0; j < 60; j++){

          svg.data.push(+amountArray[j]);

        }

      }else {

        svg.data.push(+elemJson[contentAmountValue]);

      }
    }

    var dataLength = svg.data.length;


    svg.x.domain([0, dataLength - 1]);

    //*1.05 for margin
    svg.y.domain([0, d3.max(svg.data) * 1.05]);




    console.log(svg.data);


    svg.chart.append("path").classed("lineGraph", true);
    svg.chart.append("path").classed("area", true);

    svg.area.x(function (d,i) {
      return svg.x(i);
    }).y1(function (d) {
      return svg.y(d);
    }).y0(svg.y.range()[0]);


    svg.valueline
      .x(function (d,i) {
        return svg.x(i);
      }).y(function (d) {
      return svg.y(d);
    });

    svg.newX = d3.scaleLinear().range(svg.x.range()).domain(svg.x.domain());
    svg.newY = d3.scaleLinear().range(svg.y.range()).domain(svg.y.domain());

    svg.axisx = svg.append("g")
      .classed("x axisGraph", true)
      .attr('transform', 'translate(' + [svg.margin.left, svg.height + svg.margin.top] + ")");

    svg.axisx.call(d3.axisBottom(svg.x));

    yAxeSimpleCreation(svg);
    gridSimpleGraph(svg, true);

    legendAxisX(svg);

    svg.newValueline = d3.line().curve(d3.curveMonotoneX);
    svg.newArea = d3.area().curve(d3.curveMonotoneX);


    svg.newArea.x(function (d,i) {
      return svg.newX(i);
    }).y1(function (d) {
      return svg.newY(d);
    }).y0(svg.newY.range()[0]);


    svg.newValueline
      .x(function (d,i) {
        return svg.newX(i);
      }).y(function (d) {
      return svg.newY(d);
    });

    var mouseCoordX;


    addCirclePosition(svg);

    svg.transition("start").duration(800).tween("", function () {

      var data = JSON.parse(JSON.stringify(svg.data));
      var line = svg.chart.select(".lineGraph");
      var area = svg.chart.select(".area");

      return function (t) {
        t = Math.min(1, Math.max(0, t));
        data.forEach(function (value, i) {
          svg.data[i] = value * t;
        });

        updateCirclePosition(svg,mouseCoordX);
        line.attr("d", svg.newValueline(svg.data));
        area.attr("d", svg.newArea(svg.data));
      }
    }).on("start",function(){

      var nodeRef = svg.svg.node();
      svg.on("mousemove.start", function(){

        mouseCoordX = d3.mouse(nodeRef)[0];

      })

    }).on("end", function(){

      svg.on("mousemove.start", null);

    });




    addZoomSimple(svg, updateCurve);

    d3.select(window).on("resize." + mydiv, function () {
      console.log("resize");
      console.log(d3.event);
      redrawCurve(div, svg);
    });


  });


}


/************************************************************************************************************/

function updateCurve(svg){


  svg.chart.select(".lineGraph").attr("d",svg.newValueline(svg.data));
  svg.chart.select(".area").attr("d",svg.newArea(svg.data));

  svg.axisx.call(d3.axisBottom(svg.newX));

  legendAxisX(svg);

  yAxeSimpleUpdate(svg);

  gridSimpleGraph(svg,true);

  updateCirclePosition(svg,d3.mouse(svg.svg.node())[0]);



}




/************************************************************************************************************/

function redrawCurve(div,svg){

  var clientRect = div.node().getBoundingClientRect();
  var divWidth = Math.max(svg.margin.left + svg.margin.right + 1,clientRect.width),
    divHeight = Math.max(svg.margin.bottom + svg.margin.top + 1,clientRect.height);
  //console.log("width " + divWidth );

  var oldsvgheight = svg.height;
  var oldsvgwidth = svg.width;

  svg.attr("width",divWidth).attr("height",divHeight);

  svg.width = divWidth - svg.margin.left - svg.margin.right;
  svg.height = divHeight - svg.margin.bottom - svg.margin.top;


  var ratiox = svg.width/oldsvgwidth;
  var ratioy = svg.height/oldsvgheight;


  svg.x.range([0, svg.width]);

  svg.y.range([svg.height,0]);

  svg.svg.attr("width",svg.width).attr("height",svg.height);

  svg.frame.select(".rectOverlay").attr("height",svg.height);


  svg.transform.x *= ratiox;
  svg.transform.y *= ratioy;

  var scaleytot = svg.transform.k*svg.scaley;
  var scalextot = svg.transform.k*svg.scalex;

  svg.transform.k = Math.max(scalextot,scaleytot);
  svg.scalex = scalextot/svg.transform.k;
  svg.scaley = scaleytot/svg.transform.k;



  svg.newX.range([0,svg.width]);
  svg.newY.range([svg.height,0]);
  svg.newArea.y0(svg.newY.range()[0]);


  //update of the zoom behavior
  svg._groups[0][0].__zoom.k =svg.transform.k;
  svg._groups[0][0].__zoom.x =svg.transform.x;
  svg._groups[0][0].__zoom.y =svg.transform.y;


  svg.axisx.attr('transform', 'translate(' + [svg.margin.left, svg.height+svg.margin.top] +  ")");

  svg.hiddenRect.attr("width",svg.width).attr("height",svg.height);
  updateCurve(svg);


}


/************************************************************************************************************/

function addCirclePosition(svg){




  svg.circlePosition = svg.append("circle").classed("circlePosition",true).remove().attr("r",4);
  svg.hiddenRect = svg.svg.append("rect").classed("hiddenRect",true)
    .attr("x",0).attr("y",0).attr("width",svg.width).attr("height",svg.height);

  var nodeReference = svg.svg.node();
  svg.hiddenRect.tooltip = svg.hiddenRect.append("svg:title");


  svg
    .on("mouseover.circlePosition",function(){

      updateCirclePosition(svg,d3.mouse(nodeReference)[0]);
      svg.chart.node().appendChild(svg.circlePosition.node());


      svg
        .on("mousemove.circlePosition",function(){
          updateCirclePosition(svg,d3.mouse(nodeReference)[0]);
        })
        .on("mouseover.circlePosition",null);

    });
}

/************************************************************************************************************/

function updateCirclePosition(svg,x){
  if(!x){

    //Various reason. for cosmetic reasons, the elements disappear until they are called again by a mousemove event.
    svg.circlePosition.remove();
    svg.on("mousemove.append",function(){
      svg.chart.node().appendChild(svg.circlePosition.node());
      svg.on("mousemove.append",null);
    });

    return;
  }
  var newXDomain;
  var xPosRound;
  newXDomain = svg.newX.domain();
  xPosRound = Math.round(Math.min(newXDomain[1],Math.max(newXDomain[0],svg.newX.invert(x))));

  var cx =  svg.newX(xPosRound);
  var amount = svg.data[xPosRound];
  var cy = svg.newY(amount);

  svg.circlePosition.attr("cx", cx).attr("cy", cy);
  var date, mn;
  date = getDateFromAbscissa(svg, xPosRound);

  switch(svg.step){
    //minute
    //hourly
    default:
    case 60000:
    case 3600000:
      mn = date.getMinutes();
      mn = (mn < 10)?("0" + mn):mn;
      svg.hiddenRect.tooltip.text(amount + " " + svg.units + "\n" + (date.getMonth() + 1) + "/" + date.getDate() + ", " + date.getHours() + "h" + mn);
      break;

    //daily
    case 86400000:
      svg.hiddenRect.tooltip.text(amount + " " + svg.units + "\n" +(date.getMonth() + 1) + "/" + date.getDate());
      break;
  }

}
