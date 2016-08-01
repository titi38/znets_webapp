
/************************************************************************************************************/

function updateDataAxesMap(svg, inMin, inMax, outMin, outMax){

  var isBytes = svg.units === "Bytes";

  var convertArray = quantityConvertUnit(outMax,isBytes);

  svg.scaleOutDisplay.domain([outMin * convertArray[1], outMax * convertArray[1]]).nice();

  svg.axisOut.attr('transform', 'translate('
    + [svg.margin.left + svg.width + svg.margin.offsetLegend + svg.margin.legendWidth,
      svg.margin.top] + ')');

  svg.axisOut.call(d3.axisRight(svg.scaleOutDisplay));
  niceTicks(svg.axisOut);

  svg.labelGradientOut.text(convertArray[0] + svg.units);

  var domain = svg.scaleOutDisplay.domain();

  svg.scaleLinearOut.domain([domain[0]/convertArray[1],domain[1]/convertArray[1]]);

  convertArray = quantityConvertUnit(inMax,isBytes);

  svg.scaleInDisplay.domain([inMin * convertArray[1], inMax * convertArray[1]]).nice();

  svg.axisIn.attr('transform', 'translate('
    + [svg.margin.left + svg.width + svg.margin.offsetLegend + svg.margin.legendWidth,
      svg.margin.top + svg.margin.zero + svg.mapHeight] + ')');

  svg.axisIn.call(d3.axisRight(svg.scaleInDisplay));
  niceTicks(svg.axisIn);

  svg.labelGradientIn.text(convertArray[0] + svg.units);

  domain = svg.scaleInDisplay.domain();

  svg.scaleLinearIn.domain([domain[0]/convertArray[1],domain[1]/convertArray[1]]);

}

/************************************************************************************************************/

function resizeAxesMap(svg){

  svg.scaleOutDisplay.range([svg.mapHeight,0]);

  svg.axisOut.attr('transform', 'translate('
    + [svg.margin.left + svg.width + svg.margin.offsetLegend + svg.margin.legendWidth,
      svg.margin.top] + ')');

  svg.axisOut.call(d3.axisRight(svg.scaleOutDisplay));
  niceTicks(svg.axisOut);

  svg.labelGradientOut
    .attr("x",svg.margin.top + 0.5 * svg.mapHeight)
    .attr("y",-svg.margin.left - svg.width - svg.margin.right);



  svg.scaleInDisplay.range([svg.mapHeight,0]);

  svg.axisIn.attr('transform', 'translate('
    + [svg.margin.left + svg.width + svg.margin.offsetLegend + svg.margin.legendWidth,
      svg.margin.top + svg.margin.zero + svg.mapHeight] + ')');

  svg.axisIn.call(d3.axisRight(svg.scaleInDisplay));
  niceTicks(svg.axisIn);

  svg.labelGradientIn
    .attr("x",svg.margin.top + 1.5 * svg.mapHeight + svg.margin.zero)
    .attr("y",-svg.margin.left - svg.width - svg.margin.right);
}



/************************************************************************************************************/

function mapCountryTitleOut(svg){

  var isBytes = svg.units === "Bytes";

  return function(d){

    var amount = (svg.amountByCountryCodeOut.has(d.id)?svg.amountByCountryCodeOut.get(d.id):0);

    var cvA = quantityConvertUnit(amount, isBytes);

    return d.properties.name + "\n"
      + Math.round(amount*cvA[1]*100)/100 + " " + cvA[0]  + svg.units + "\n" + "(" + amount + " " + svg.units + ")";
  }
}

/************************************************************************************************************/

function mapCountryTitleIn(svg){

  var isBytes = svg.units === "Bytes";


  return function(d){

    var amount = (svg.amountByCountryCodeIn.has(d.id)?svg.amountByCountryCodeIn.get(d.id):0);

    var cvA = quantityConvertUnit(amount, true);

    return d.properties.name + "\n"
      + Math.round(amount*cvA[1]*100)/100 + " " + cvA[0] + svg.units + "\n" + "(" + amount + " " + svg.units + ")";
  }
}

/************************************************************************************************************/

function appendVerticalLinearGradientDefs(svg,nameId,colorStart,colorEnd){
  var linearGradient;

  linearGradient = svg.append("defs").append("linearGradient")
    .attr("id",nameId)
    .attr("x1","0%")
    .attr("x2","0%")
    .attr("y1","100%")
    .attr("y2","0%");

  linearGradient.append("stop")
    .attr("offset","0%")
    .attr("stop-color",colorStart);

  linearGradient.append("stop")
    .attr("offset","100%")
    .attr("stop-color",colorEnd);

}