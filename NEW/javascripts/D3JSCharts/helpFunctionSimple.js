
/************************************************************************************************************
 *
 ************************************************************************************************************/

function legendAxisX(svg){

  var date,dround;
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

      return (date.getMonth() + 1) + "/" + date.getDate() + " " + date.getHours() + "h";

    });

  }else if(svg.step === 60000){
    //graph minute
    var mn;
    svg.axisx.selectAll(".tick").select("text").text(function (d) {

      dround = Math.round(d);

      //if the ticks isn't at "x" o'clock
      if(Math.abs(dround - d) >= 1e-7){
        this.parentNode.remove();
        return;
      }

      date = getDateFromAbscissa(svg, dround);
      mn = date.getMinutes();
      mn = (mn < 10)?("0" + mn):mn;

      return (date.getMonth() + 1) + "/" + date.getDate() + " " + date.getHours() + "h" + mn;

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
}


/************************************************************************************************************
 *
 *    Create a background grid exclusive for x & y axis
 *    need svg.grid, svg.axisx and svg.axisy to be set.
 *
 ***********************************************************************************************************/

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



/************************************************************************************************************/

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

/************************************************************************************************************/

function optionalYAxeSimpleCreation(svg) {

  var isBytes = svg.units === "Bytes";

  if (isBytes) {

    var coef = 8000 / svg.step;


    var domain = svg.newY.domain();

    domain.forEach(function(elem,i){ domain[i] *= coef;});

    var convert = quantityConvertUnit(domain[1] - domain[0], false);


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

/************************************************************************************************************/


function optionalYAxeSimpleUpdate(svg) {

  var isBytes = svg.units === "Bytes";

  if (isBytes) {

    var coef = 8000 / svg.step;


    var domain = svg.newY.domain();

    domain.forEach(function(elem,i){ domain[i] *= coef;});

    var convert = quantityConvertUnit(domain[1] - domain[0], false);


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

/************************************************************************************************************/

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
