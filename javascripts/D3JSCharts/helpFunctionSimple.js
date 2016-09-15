/**
 * Updates the legend of the abscissa axe.
 * @param svg {Object} D3 encapsulated parent svg element.
 */

function legendAxisX(svg){

  var date,dround;
  var lastDay = null, currentDay;

  //if graph hourly
  if(svg.step === 3600000){


    svg.axisx.selectAll(".tick").select("text").text(function (d) {

      dround = Math.round(d);

      //if the ticks isn't at "x" o'clock
      if(Math.abs(dround - d) >= 1e-7){
        this.parentNode.remove();
        return;
      }

      date = getDateFromAbscissa(svg, dround);

      currentDay = (date.getMonth() + 1) + "/" + date.getDate();

      if(currentDay === lastDay){
        return date.getHours() + "h";
      }

      lastDay = currentDay;
      return currentDay + " " + date.getHours() + "h";

    });

  }else if(svg.step === 60000){
    //graph minute
    var mn;
    svg.axisx.selectAll(".tick").select("text").text(function (d) {

      dround = Math.round(d);

      //if the ticks aren't at "x" o'clock
      if(Math.abs(dround - d) >= 1e-7){
        this.parentNode.remove();
        return;
      }

      date = getDateFromAbscissa(svg, dround);
      mn = date.getMinutes();
      mn = (mn < 10)?("0" + mn):mn;

      currentDay = (date.getMonth() + 1) + "/" + date.getDate();

      if(currentDay === lastDay){
        return date.getHours() + "h" + mn;
      }
      lastDay = currentDay;
      return currentDay + " " + date.getHours() + "h" + mn;

    });

  } else {
    //graph daily
    svg.axisx.selectAll(".tick").select("text").text(function (d) {

      dround = Math.round(d);

      //if the ticks isn't at "x" o'clock (some javascript weirdness here...)
      if(Math.abs(dround - d) >= 1e-7){
        this.parentNode.remove();
        return;
      }

      date = getDateFromAbscissa(svg, dround);

      return (date.getMonth() + 1) + "/" + date.getDate();

    });



  }
  
  axisXNiceLegend(svg);
}


/**
 * Removes ticks to avoid text overlap.
 * @param svg {Object} D3 encapsulated parent svg element.
 */

function axisXNiceLegend(svg){

  var selecticks = svg.axisx.selectAll(".tick");
  var selecsize = selecticks.size();

  if(selecsize <= 1){
    return;
  }

  var array = [];
  selecticks._groups[0].forEach(function(elem){
    array.push(elem);
  });

  array.sort(function(a,b){
    return a.__data__ - b.__data__;
  });

  var distTick = Math.abs(array[0].getAttribute("transform").split(/[,)(]+/)[1]
    - array[1].getAttribute("transform").split(/[,)(]+/)[1]);

  var old = - Infinity, current;
  var max = distTick/2;
  var selectext = selecticks.select("text");

  selectext.each(function(){

    current = this.getBoundingClientRect().width/2;
    max = Math.max(max, old + current);
    old = current;
    
  });

  var nb = Math.ceil(max/distTick);

  if(nb <= 1){
    return;
  }

  var dec = Math.ceil(nb/2);

  for (var i=0; i<selecsize;i++) {
    if ((i + dec) % nb !== 0) {
      array[i].remove();
    }
  }

}

/**
 * Creates a background grid for x & y axis.
 * @param svg {Object} D3 encapsulated parent svg element.
 * @param isCurve {Boolean} True if the graph is a curve, false otherwise.
 */


function gridSimpleGraph(svg, isCurve){

  if(typeof isCurve === "undefined"){
    isCurve = false;
  }

  svg.grid.selectAll("line").remove();

  if(isCurve) {
    svg.axisx.selectAll(".tick").each(function () {
      var transform = this.getAttribute("transform");
      svg.grid.append("line")
        .attr("y2", svg.height)
        .attr("x1", 0.5)
        .attr("x2", 0.5)
        .attr("transform", transform);
    });
  }

  svg.axisy.selectAll(".tick").each(function(){
    var transform = this.getAttribute("transform");
    svg.grid.append("line")
      .attr("y1",0.5)
      .attr("y2",0.5)
      .attr("x2",svg.width)
      .attr("transform",transform);
  });



}


/**
 * Creates a left vertical axe.
 * @param svg {Object} D3 encapsulated parent svg element.
 */

function yAxeSimpleCreation(svg){

  var isBytes = svg.units === "Bytes";

  var domain = svg.newY.domain();

  var convert = svg.units === "hosts"?["",1]:quantityConvertUnit(domain[1] - domain[0], isBytes);


  svg.yDisplay = d3.scaleLinear().clamp(true).range(svg.newY.range())
    .domain([domain[0]*convert[1],domain[1]*convert[1]]);

  svg.axisy = svg.append("g").attr('transform', 'translate(' + [svg.margin.left, svg.margin.top] + ')')
    .attr("class", "axisGraph");
  
  svg.axisy.call(d3.axisLeft(svg.yDisplay));

  niceTicks(svg.axisy);

  //Label of the y axis
  svg.ylabel = svg.append("text")
    .attr("class", "labelGraph")
    .attr("dy", "0.8em")
    .attr('y', 0)
    .attr("x", -(svg.height + svg.margin.top + svg.margin.bottom) / 2)
    .attr("transform", "rotate(-90)")
    .text(convert[0] + svg.units);

}

/**
 * Creates a right vertical axe if needed.
 * @param svg {Object} D3 encapsulated parent svg element.
 */

function optionalYAxeSimpleCreation(svg) {

  var isBytes = svg.units === "Bytes";

  if (isBytes) {

    var coef = 8000 / svg.step;


    var domain = svg.newY.domain();

    domain.forEach(function(elem,i){ domain[i] *= coef;});

    var convert = quantityConvertUnit(domain[1] - domain[0], true);


    svg.yDisplayRight = d3.scaleLinear().clamp(true).range(svg.newY.range())
      .domain([domain[0]*convert[1],domain[1]*convert[1]]);

    svg.axisyRight = svg.append("g").attr('transform', 'translate(' + [svg.margin.left + svg.width, svg.margin.top] + ')')
      .attr("class", "axisGraph");

    svg.axisyRight.call(d3.axisRight(svg.yDisplayRight));

    niceTicks(svg.axisyRight);

    //Label of the y axis
    svg.ylabelRight = svg.append("text")
      .attr("class", "labelGraph")
      .attr("dy", "-0.4em")
      .attr('y', svg.margin.left + svg.width + svg.margin.right)
      .attr("x", -(svg.margin.bottom + svg.height + svg.margin.top) / 2)
      .attr("transform", "rotate(-90)")
      .text(convert[0] + "bits/s");


  }

}

/**
 * Updates the right vertical axe if needed.
 * @param svg {Object} D3 encapsulated parent svg element.
 */


function optionalYAxeSimpleUpdate(svg) {

  var isBytes = svg.units === "Bytes";

  if (isBytes) {

    var coef = 8000 / svg.step;


    var domain = svg.newY.domain();

    domain.forEach(function(elem,i){ domain[i] *= coef;});

    var convert = quantityConvertUnit(domain[1] - domain[0], true);


    svg.yDisplayRight.range(svg.newY.range())
      .domain([domain[0]*convert[1],domain[1]*convert[1]]);

    svg.axisyRight.attr('transform', 'translate(' + [svg.margin.left + svg.width, svg.margin.top] + ')');

    svg.axisyRight.call(d3.axisRight(svg.yDisplayRight));

    niceTicks(svg.axisyRight);

    //Label of the y axis
    svg.ylabelRight
      .attr('y', svg.margin.left + svg.width + svg.margin.right)
      .attr("x", -(svg.margin.bottom + svg.height + svg.margin.top) / 2)
      .text(convert[0] + "bits/s");


  }

}

/**
 * Updates the left vertical axe.
 * @param svg {Object} D3 encapsulated parent svg element.
 */

function yAxeSimpleUpdate(svg){

  var isBytes = svg.units === "Bytes";

  var domain = svg.newY.domain();

  var convert = quantityConvertUnit(domain[1] - domain[0], isBytes);


  svg.yDisplay.range(svg.newY.range())
    .domain([domain[0]*convert[1],domain[1]*convert[1]]);

  svg.axisy.attr('transform', 'translate(' + [svg.margin.left, svg.margin.top] + ')');
  svg.axisy.call(d3.axisLeft(svg.yDisplay));

  niceTicks(svg.axisy);

  //Label of the y axis
  svg.ylabel
    .attr("x", -(svg.height + svg.margin.top + svg.margin.bottom) / 2)
    .text(convert[0] + svg.units);

}

/**
 * Returns a function that set the internal zoom values of svg to their default then redraw the graph.
 * @param svg {Object} D3 encapsulated parent svg element.
 * @param updateFunction {Function} The function used to redraw the graph.
 * @returns {Function} Sets the internal zoom values of svg to their default then redraw the graph.
 */

function simpleZoomReset(svg, updateFunction){

  return function(){

    svg._groups[0][0].__zoom.k = 1;
    svg._groups[0][0].__zoom.x = 0;
    svg._groups[0][0].__zoom.y = 0;

    svg.transform.k = 1;
    svg.transform.x = 0;
    svg.transform.y = 0;

    svg.scalex = 1;
    svg.scaley = 1;

    svg.newX.domain(svg.x.domain());
    svg.newY.domain(svg.y.domain());

    updateFunction(svg);
  };

}