



/************************************************************************************************************/

function axesDoubleCreation(svg){

  var isBytes = svg.units === "Bytes";

  var domainInput = svg.newYInput.domain(), domainOutput = svg.newYOutput.domain();


  var convert = quantityConvertUnit(Math.max(domainInput[1] - domainInput[0],
    domainOutput[1] - domainOutput[0]), isBytes);


  svg.yInputDisplay = d3.scaleLinear().clamp(true).range(svg.newYInput.range())
    .domain([domainInput[0]*convert[1],domainInput[1]*convert[1]]);

  svg.yOutputDisplay = d3.scaleLinear().clamp(true).range(svg.newYOutput.range())
    .domain([domainOutput[0]*convert[1],domainOutput[1]*convert[1]]);

  svg.axisyOutput = svg.append("g").attr('transform', 'translate(' + [svg.margin.left, svg.margin.top] + ')')
    .attr("class", "axisGraph");

  svg.axisyInput = svg.append("g").attr('transform', 'translate(' + [svg.margin.left, svg.margin.top - 1] + ')')
    .attr("class", "axisGraph");

  svg.axisyInput.call(d3.axisLeft(svg.yInputDisplay));
  svg.axisyOutput.call(d3.axisLeft(svg.yOutputDisplay));

  niceTicks(svg.axisyInput);
  niceTicks(svg.axisyOutput);

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

function axesDoubleUpdate(svg){

  var isBytes = svg.units === "Bytes";

  var domainInput = svg.newYInput.domain(), domainOutput = svg.newYOutput.domain();

  var convert = quantityConvertUnit(Math.max(domainInput[1] - domainInput[0],
    domainOutput[1] - domainOutput[0]), isBytes);

  svg.yInputDisplay.range(svg.newYInput.range())
    .domain([domainInput[0]*convert[1],domainInput[1]*convert[1]]);

  svg.yOutputDisplay.range(svg.newYOutput.range())
    .domain([domainOutput[0]*convert[1],domainOutput[1]*convert[1]]);

  svg.axisyOutput.attr('transform', 'translate(' + [svg.margin.left, svg.margin.top] + ')');
  svg.axisyInput.attr('transform', 'translate(' + [svg.margin.left, svg.margin.top - 1] + ')');

  svg.axisyInput.call(d3.axisLeft(svg.yInputDisplay));
  svg.axisyOutput.call(d3.axisLeft(svg.yOutputDisplay));

  niceTicks(svg.axisyInput);
  niceTicks(svg.axisyOutput);

  //Label of the y axis
  svg.ylabel
    .attr("x", -(svg.height + svg.margin.top + svg.margin.bottom) / 2)
    .text(convert[0] + svg.units);


}



/************************************************************************************************************/

function optionalAxesDoubleCreation(svg){

  var isBytes = svg.units === "Bytes";


  if(isBytes){



    var coef = 8000/svg.step;

    var domainInput = svg.newYInput.domain(), domainOutput = svg.newYOutput.domain();

    domainInput.forEach(function(elem,i){ domainInput[i] *= coef;});
    domainOutput.forEach(function(elem,i){ domainOutput[i] *= coef;});

    var convert = quantityConvertUnit(Math.max(domainInput[1] - domainInput[0],
      domainOutput[1] - domainOutput[0]), isBytes);


    svg.yInputRightDisplay = d3.scaleLinear().clamp(true).range(svg.newYInput.range())
      .domain([domainInput[0]*convert[1],domainInput[1]*convert[1]]);
    svg.yOutputRightDisplay = d3.scaleLinear().clamp(true).range(svg.newYOutput.range())
      .domain([domainOutput[0]*convert[1],domainOutput[1]*convert[1]]);


    svg.axisyOutRight = svg.append("g")
      .attr('transform', 'translate(' + [svg.margin.left + svg.width, svg.margin.top] + ')')
      .attr("class", "axisGraph");
    svg.axisyInRight = svg.append("g").attr('transform', 'translate(' + [svg.margin.left + svg.width,
        svg.margin.top - 1] + ')')
      .attr("class", "axisGraph");


    svg.axisyOutRight.call(d3.axisRight(svg.yOutputRightDisplay));
    svg.axisyInRight.call(d3.axisRight(svg.yInputRightDisplay));

    niceTicks(svg.axisyInRight);
    niceTicks(svg.axisyOutRight);

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

function optionalAxesDoubleUpdate(svg){

  var isBytes = svg.units === "Bytes";


  if(isBytes){



    var coef = 8000/svg.step;

    var domainInput = svg.newYInput.domain(), domainOutput = svg.newYOutput.domain();

    domainInput.forEach(function(elem,i){ domainInput[i] *= coef;});
    domainOutput.forEach(function(elem,i){ domainOutput[i] *= coef;});

    var convert = quantityConvertUnit(Math.max(domainInput[1] - domainInput[0],
      domainOutput[1] - domainOutput[0]), isBytes);


    svg.yInputRightDisplay.range(svg.newYInput.range())
      .domain([domainInput[0]*convert[1],domainInput[1]*convert[1]]);
    svg.yOutputRightDisplay.range(svg.newYOutput.range())
      .domain([domainOutput[0]*convert[1],domainOutput[1]*convert[1]]);


    svg.axisyOutRight
      .attr('transform', 'translate(' + [svg.margin.left + svg.width, svg.margin.top] + ')');
    svg.axisyInRight
      .attr('transform', 'translate(' + [svg.margin.left + svg.width,
          svg.margin.top - 1] + ')');


    svg.axisyOutRight.call(d3.axisRight(svg.yOutputRightDisplay));
    svg.axisyInRight.call(d3.axisRight(svg.yInputRightDisplay));

    niceTicks(svg.axisyInRight);
    niceTicks(svg.axisyOutRight);

    svg.ylabelRight
      .attr('y', svg.margin.left + svg.width + svg.margin.right)
      .attr("x", -(svg.margin.bottom + svg.height + svg.margin.top) / 2)
      .text(convert[0] + "bits/s");

  }
}




/***********************************************************************************************************/

function ticksSecondAxisXDouble(svg){

  svg.axisx.selectAll(".tick").filter(function(){return !d3.select(this).classed("addedLine");}).classed("addedLine",true).append("line")
    .attr("x1",0.5)
    .attr("y1",svg.margin.zero - svg.heightTick)
    .attr("x2",0.5)
    .attr("y2",svg.margin.zero);

}

function axisXDoubleDraw(svg){
  svg.axisx.rect.attr("width", svg.width);
  svg.axisx.path.attr("d", "M0.5," + (svg.margin.zero - svg.heightTick) + "V" + (svg.margin.zero - 0.5) + "H" + (svg.width + 0.5)+ "V" + (svg.margin.zero - svg.heightTick));
}

/***********************************************************************************************************/


function drawChartDouble(svg,newHeightOutput,newHOmarg){



  var dataWidth = 0.75*(svg.newX(svg.newX.domain()[0] + 1) - svg.newX.range()[0]);



  var adjust;

  svg.chartInput.selectAll(".data").each(function(d){
    adjust = (d.y===0&&d.height !==0)?0.5:0;

    this.setAttribute("x",svg.newX(d.x - 0.375));
    this.setAttribute("y", svg.newYInput(d.y) - adjust);
    this.setAttribute("height",svg.newYInput(d.height) - newHOmarg + adjust);
    this.setAttribute("width",dataWidth);

  });



  svg.chartOutput.selectAll(".data")
    .attr("x",function(d){return svg.newX(d.x - 0.375);})
    .attr("y", function(d){return svg.newYOutput(d.y);})
    .attr("height", function(d){return newHeightOutput - svg.newYOutput(d.height) + ((d.y===d.height&&d.height !==0)?0.5:0);})
    .attr("width", dataWidth);

}




/************************************************************************************************************
 *
 *    Create a background grid exclusive for x, yInput & yOutput axis
 *    need svg.grid, svg.axis, svg.axisyInput & svg.axisyOutput to be set.
 *
 ***********************************************************************************************************/

function gridDoubleGraph(svg){


  svg.grid.selectAll("line").remove();


  svg.axisyInput.selectAll(".tick").each(function(){
    var transform = this.getAttribute("transform");
    svg.grid.append("line")
      .attr("y2",-0.5)
      .attr("y1",-0.5)
      .attr("x2",svg.width)
      .attr("transform",transform);
  });

  svg.axisyOutput.selectAll(".tick").each(function(){
    var transform = this.getAttribute("transform");
    svg.grid.append("line")
      .attr("y2",0.5)
      .attr("y1",0.5)
      .attr("x2",svg.width)
      .attr("transform",transform);
  });



}
