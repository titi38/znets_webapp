
/************************************************************************************************************/

function updateDataAxesMap(svg, inMin, inMax, outMin, outMax){

  var isBytes = svg.units === "Bytes";

  var convertArray = quantityConvertUnit(outMax,isBytes);

  svg.scaleTopDisplay.domain([outMin * convertArray[1], outMax * convertArray[1]]).nice();

  svg.axisTop.attr('transform', 'translate('
    + [svg.margin.left + svg.width + svg.margin.offsetLegend + svg.margin.legendWidth,
      svg.margin.top] + ')');

  svg.axisTop.call(d3.axisRight(svg.scaleTopDisplay));
  niceTicks(svg.axisTop);

  svg.labelGradientTop.text(convertArray[0] + svg.units);

  var domain = svg.scaleTopDisplay.domain();

  svg.scaleLinearTop.domain([domain[0]/convertArray[1],domain[1]/convertArray[1]]);

  convertArray = quantityConvertUnit(inMax,isBytes);

  svg.scaleBottomDisplay.domain([inMin * convertArray[1], inMax * convertArray[1]]).nice();

  svg.axisBottom.attr('transform', 'translate('
    + [svg.margin.left + svg.width + svg.margin.offsetLegend + svg.margin.legendWidth,
      svg.margin.top + svg.margin.zero + svg.mapHeight] + ')');

  svg.axisBottom.call(d3.axisRight(svg.scaleBottomDisplay));
  niceTicks(svg.axisBottom);

  svg.labelGradientBottom.text(convertArray[0] + svg.units);

  domain = svg.scaleBottomDisplay.domain();

  svg.scaleLinearBottom.domain([domain[0]/convertArray[1],domain[1]/convertArray[1]]);

}

/************************************************************************************************************/

function resizeAxesMap(svg){

  svg.scaleTopDisplay.range([svg.mapHeight,0]);

  svg.axisTop.attr('transform', 'translate('
    + [svg.margin.left + svg.width + svg.margin.offsetLegend + svg.margin.legendWidth,
      svg.margin.top] + ')');

  svg.axisTop.call(d3.axisRight(svg.scaleTopDisplay));
  niceTicks(svg.axisTop);

  svg.labelGradientTop
    .attr("x",svg.margin.top + 0.5 * svg.mapHeight)
    .attr("y",-svg.margin.left - svg.width - svg.margin.right);



  svg.scaleBottomDisplay.range([svg.mapHeight,0]);

  svg.axisBottom.attr('transform', 'translate('
    + [svg.margin.left + svg.width + svg.margin.offsetLegend + svg.margin.legendWidth,
      svg.margin.top + svg.margin.zero + svg.mapHeight] + ')');

  svg.axisBottom.call(d3.axisRight(svg.scaleBottomDisplay));
  niceTicks(svg.axisBottom);

  svg.labelGradientBottom
    .attr("x",svg.margin.top + 1.5 * svg.mapHeight + svg.margin.zero)
    .attr("y",-svg.margin.left - svg.width - svg.margin.right);
}



/************************************************************************************************************/

function mapCountryTitleTop(svg){

  var isBytes = svg.units === "Bytes";

  return function(d){

    var amount = (svg.amountByCountryCodeTop.has(d.id)?svg.amountByCountryCodeTop.get(d.id):0);

    var cvA = quantityConvertUnit(amount, isBytes);

    return d.properties.name + "\n"
      + Math.round(amount*cvA[1]*100)/100 + " " + cvA[0]  + svg.units + "\n" + "(" + amount + " " + svg.units + ")";
  }
}

/************************************************************************************************************/

function mapCountryTitleBottom(svg){

  var isBytes = svg.units === "Bytes";


  return function(d){

    var amount = (svg.amountByCountryCodeBottom.has(d.id)?svg.amountByCountryCodeBottom.get(d.id):0);

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