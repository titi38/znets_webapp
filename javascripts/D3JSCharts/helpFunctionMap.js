/**
 * Created by elie.
 */



/**
 * Updates the legend's axes of the maps.
 * @param svg {Object} D3 encapsulated parent svg element.
 * @param inMin {Number} the least value (except 0) the ingoing data amount can take.
 * @param inMax {Number} the greatest value the ingoing data amount can take.
 * @param outMin {Number} the least value (except 0) the outgoing data amount can take.
 * @param outMax {Number} the greatest value the outgoing data amount can take.
 */

function updateDataAxesMap(svg, inMin, inMax, outMin, outMax){

  var isBytes = svg.units === "Bytes";

  if(isBytes){


    var coef = 1000/1024;


    svg.scaleTopDisplay.domain([outMin * coef, outMax * coef]).nice();

    svg.axisTop.attr('transform', 'translate('
      + [svg.margin.left + svg.width + svg.margin.offsetLegend + svg.margin.legendWidth,
        svg.margin.top] + ')');

    svg.axisTop.call(d3.axisRight(svg.scaleTopDisplay).tickFormat(
      function(d){
        return svg.scaleTopDisplay.tickFormat(10,".0s")(d);
      }));
    //niceTicks(svg.axisTop);

    svg.labelGradientTop.text(svg.units);

    var domain = svg.scaleTopDisplay.domain();

    svg.scaleLogTop.domain([domain[0]/coef,domain[1]/coef]);


    svg.scaleBottomDisplay.domain([inMin* coef, inMax* coef]).nice();

    svg.axisBottom.attr('transform', 'translate('
      + [svg.margin.left + svg.width + svg.margin.offsetLegend + svg.margin.legendWidth,
        svg.margin.top + svg.margin.zero + svg.mapHeight] + ')');

    svg.axisBottom.call(d3.axisRight(svg.scaleBottomDisplay).tickFormat(
      function(d){
        return svg.scaleBottomDisplay.tickFormat(10,".0s")(d);
      }));
    //niceTicks(svg.axisBottom);

    svg.labelGradientBottom.text(svg.units);

    domain = svg.scaleBottomDisplay.domain();

    svg.scaleLogBottom.domain([domain[0]/coef,domain[1]/coef]);


  }else{


    svg.scaleTopDisplay.domain([outMin, outMax]).nice();

    svg.axisTop.attr('transform', 'translate('
      + [svg.margin.left + svg.width + svg.margin.offsetLegend + svg.margin.legendWidth,
        svg.margin.top] + ')');

    svg.axisTop.call(d3.axisRight(svg.scaleTopDisplay).tickFormat(function(d){

      return svg.scaleTopDisplay.tickFormat(10,".3")(d);

    }));
    //niceTicks(svg.axisTop);

    svg.labelGradientTop.text(svg.units);

    domain = svg.scaleTopDisplay.domain();

    svg.scaleLogTop.domain([domain[0],domain[1]]);

    convertArray = quantityConvertUnit(inMax,false);

    svg.scaleBottomDisplay.domain([inMin, inMax]).nice();

    svg.axisBottom.attr('transform', 'translate('
      + [svg.margin.left + svg.width + svg.margin.offsetLegend + svg.margin.legendWidth,
        svg.margin.top + svg.margin.zero + svg.mapHeight] + ')');

    svg.axisBottom.call(d3.axisRight(svg.scaleBottomDisplay).tickFormat(function(d){

      return svg.scaleBottomDisplay.tickFormat(10,".3")(d);

    }));
    //niceTicks(svg.axisBottom);

    svg.labelGradientBottom.text(svg.units);

    domain = svg.scaleBottomDisplay.domain();

    svg.scaleLogBottom.domain([domain[0],domain[1]]);

  }


}

/**
 * Dedicated function to redraws the axes when a resize event occurs.
 * @param svg {Object} D3 encapsulated parent svg element.
 */

function resizeAxesMap(svg){

  svg.scaleTopDisplay.range([svg.mapHeight,0]);

  svg.axisTop.attr('transform', 'translate('
    + [svg.margin.left + svg.width + svg.margin.offsetLegend + svg.margin.legendWidth,
      svg.margin.top] + ')');

  //niceTicks(svg.axisTop);

  svg.labelGradientTop
    .attr("x",svg.margin.top + 0.5 * svg.mapHeight)
    .attr("y",-svg.margin.left - svg.width - svg.margin.right);



  svg.scaleBottomDisplay.range([svg.mapHeight,0]);

  svg.axisBottom.attr('transform', 'translate('
    + [svg.margin.left + svg.width + svg.margin.offsetLegend + svg.margin.legendWidth,
      svg.margin.top + svg.margin.zero + svg.mapHeight] + ')');

  //niceTicks(svg.axisBottom);

  svg.labelGradientBottom
    .attr("x",svg.margin.top + 1.5 * svg.mapHeight + svg.margin.zero)
    .attr("y",-svg.margin.left - svg.width - svg.margin.right);

  if(svg.units === "Bytes"){

    svg.axisBottom.call(d3.axisRight(svg.scaleBottomDisplay).tickFormat(
      function(d){
        return svg.scaleBottomDisplay.tickFormat(10,".0s")(d);
      }));

    svg.axisTop.call(d3.axisRight(svg.scaleTopDisplay).tickFormat(
      function(d){
        return svg.scaleTopDisplay.tickFormat(10,".0s")(d);
      }));

  }else{
    svg.axisBottom.call(d3.axisRight(svg.scaleBottomDisplay).tickFormat(function(d){

      return svg.scaleBottomDisplay.tickFormat(10,".3")(d);

    }));
    svg.axisTop.call(d3.axisRight(svg.scaleTopDisplay).tickFormat(function(d){

      return svg.scaleTopDisplay.tickFormat(10,".3")(d);

    }));


  }
}


/**
 * Returns the function used to update the text of svg:title of top elements according their bound datum.
 * @param svg {Object} D3 encapsulated parent svg element.
 * @returns {Function} The function used to update the text of svg:title elements according their bound datum.
 */

function mapCountryTitleTop(svg){

  var isBytes = svg.units === "Bytes";

  return function(d){

    var amount = (svg.amountByCountryCodeTop.has(d.id)?svg.amountByCountryCodeTop.get(d.id):0);

    var cvA = quantityConvertUnit(amount, isBytes);

    return d.properties.name + "\n"
      + Math.round(amount*cvA[1]*100)/100 + " " + cvA[0]  + svg.units + "\n" + "(" + amount + " " + svg.units + ")";
  }
}

/**
 * Returns the function used to update the text of svg:title of bottom elements according their bound datum.
 * @param svg {Object} D3 encapsulated parent svg element.
 * @returns {Function} The function used to update the text of svg:title elements according their bound datum.
 */

function mapCountryTitleBottom(svg){

  var isBytes = svg.units === "Bytes";


  return function(d){

    var amount = (svg.amountByCountryCodeBottom.has(d.id)?svg.amountByCountryCodeBottom.get(d.id):0);

    var cvA = quantityConvertUnit(amount, isBytes);

    return d.properties.name + "\n"
      + Math.round(amount*cvA[1]*100)/100 + " " + cvA[0] + svg.units + "\n" + "(" + amount + " " + svg.units + ")";
  }
}

/**
 * Creates the definitions to instantiate a color gradient.
 * @param svg {Object} D3 encapsulated parent svg element.
 * @param nameId {String} Id of the gradient's definition.
 * @param colorStart {String} Start color.
 * @param colorEnd {String} End color.
 */

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