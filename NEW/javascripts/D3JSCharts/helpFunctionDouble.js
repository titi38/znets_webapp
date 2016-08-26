



/************************************************************************************************************/

function axesDoubleCreation(svg){

  var isBytes = svg.units === "Bytes";

  var domainBottom = svg.newYBottom.domain(), domainTop = svg.newYTop.domain();


  var convert = quantityConvertUnit(Math.max(domainBottom[1] - domainBottom[0],
    domainTop[1] - domainTop[0]), isBytes);


  svg.yBottomDisplay = d3.scaleLinear().clamp(true).range(svg.newYBottom.range())
    .domain([domainBottom[0]*convert[1],domainBottom[1]*convert[1]]);

  svg.yTopDisplay = d3.scaleLinear().clamp(true).range(svg.newYTop.range())
    .domain([domainTop[0]*convert[1],domainTop[1]*convert[1]]);

  svg.axisyTop = svg.append("g").attr('transform', 'translate(' + [svg.margin.left, svg.margin.top] + ')')
    .attr("class", "axisGraph");

  svg.axisyBottom = svg.append("g").attr('transform', 'translate(' + [svg.margin.left, svg.margin.top - 1] + ')')
    .attr("class", "axisGraph");

  svg.axisyBottom.call(d3.axisLeft(svg.yBottomDisplay));
  svg.axisyTop.call(d3.axisLeft(svg.yTopDisplay));

  niceTicks(svg.axisyBottom);
  niceTicks(svg.axisyTop);

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

  var domainBottom = svg.newYBottom.domain(), domainTop = svg.newYTop.domain();

  var convert = quantityConvertUnit(Math.max(domainBottom[1] - domainBottom[0],
    domainTop[1] - domainTop[0]), isBytes);

  svg.yBottomDisplay.range(svg.newYBottom.range())
    .domain([domainBottom[0]*convert[1],domainBottom[1]*convert[1]]);

  svg.yTopDisplay.range(svg.newYTop.range())
    .domain([domainTop[0]*convert[1],domainTop[1]*convert[1]]);

  svg.axisyTop.attr('transform', 'translate(' + [svg.margin.left, svg.margin.top] + ')');
  svg.axisyBottom.attr('transform', 'translate(' + [svg.margin.left, svg.margin.top - 1] + ')');

  svg.axisyBottom.call(d3.axisLeft(svg.yBottomDisplay));
  svg.axisyTop.call(d3.axisLeft(svg.yTopDisplay));

  niceTicks(svg.axisyBottom);
  niceTicks(svg.axisyTop);

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

    var domainBottom = svg.newYBottom.domain(), domainTop = svg.newYTop.domain();

    domainBottom.forEach(function(elem,i){ domainBottom[i] *= coef;});
    domainTop.forEach(function(elem,i){ domainTop[i] *= coef;});

    var convert = quantityConvertUnit(Math.max(domainBottom[1] - domainBottom[0],
      domainTop[1] - domainTop[0]), true);


    svg.yBottomRightDisplay = d3.scaleLinear().clamp(true).range(svg.newYBottom.range())
      .domain([domainBottom[0]*convert[1],domainBottom[1]*convert[1]]);
    svg.yTopRightDisplay = d3.scaleLinear().clamp(true).range(svg.newYTop.range())
      .domain([domainTop[0]*convert[1],domainTop[1]*convert[1]]);


    svg.axisyTopRight = svg.append("g")
      .attr('transform', 'translate(' + [svg.margin.left + svg.width, svg.margin.top] + ')')
      .attr("class", "axisGraph");
    svg.axisyBottomRight = svg.append("g").attr('transform', 'translate(' + [svg.margin.left + svg.width,
        svg.margin.top - 1] + ')')
      .attr("class", "axisGraph");


    svg.axisyTopRight.call(d3.axisRight(svg.yTopRightDisplay));
    svg.axisyBottomRight.call(d3.axisRight(svg.yBottomRightDisplay));

    niceTicks(svg.axisyBottomRight);
    niceTicks(svg.axisyTopRight);

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

    var domainBottom = svg.newYBottom.domain(), domainTop = svg.newYTop.domain();

    domainBottom.forEach(function(elem,i){ domainBottom[i] *= coef;});
    domainTop.forEach(function(elem,i){ domainTop[i] *= coef;});

    var convert = quantityConvertUnit(Math.max(domainBottom[1] - domainBottom[0],
      domainTop[1] - domainTop[0]), true);


    svg.yBottomRightDisplay.range(svg.newYBottom.range())
      .domain([domainBottom[0]*convert[1],domainBottom[1]*convert[1]]);
    svg.yTopRightDisplay.range(svg.newYTop.range())
      .domain([domainTop[0]*convert[1],domainTop[1]*convert[1]]);


    svg.axisyTopRight
      .attr('transform', 'translate(' + [svg.margin.left + svg.width, svg.margin.top] + ')');
    svg.axisyBottomRight
      .attr('transform', 'translate(' + [svg.margin.left + svg.width,
          svg.margin.top - 1] + ')');


    svg.axisyTopRight.call(d3.axisRight(svg.yTopRightDisplay));
    svg.axisyBottomRight.call(d3.axisRight(svg.yBottomRightDisplay));

    niceTicks(svg.axisyBottomRight);
    niceTicks(svg.axisyTopRight);

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

/***********************************************************************************************************/

function axisXDoubleDraw(svg){
  svg.axisx.rect.attr("width", svg.width);
  svg.axisx.path.attr("d", "M0.5," + (svg.margin.zero - svg.heightTick) + "V" + (svg.margin.zero - 0.5) + "H" + (svg.width + 0.5)+ "V" + (svg.margin.zero - svg.heightTick));
}

/***********************************************************************************************************/


function drawChartDouble(svg,newHeightTop,newHOmarg){



  var dataWidth = 0.75*(svg.newX(svg.newX.domain()[0] + 1) - svg.newX.range()[0]);



  var adjust;

  svg.chartBottom.selectAll(".data").each(function(d){
    adjust = (d.y===0&&d.height !==0)?0.5:0;

    this.setAttribute("x",svg.newX(d.x - 0.375));
    this.setAttribute("y", svg.newYBottom(d.y) - adjust);
    this.setAttribute("height",svg.newYBottom(d.height) - newHOmarg + adjust);
    this.setAttribute("width",dataWidth);

  });



  svg.chartTop.selectAll(".data")
    .attr("x",function(d){return svg.newX(d.x - 0.375);})
    .attr("y", function(d){return svg.newYTop(d.y);})
    .attr("height", function(d){return newHeightTop - svg.newYTop(d.height) + ((d.y===d.height&&d.height !==0)?0.5:0);})
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


  svg.axisyBottom.selectAll(".tick").each(function(){
    var transform = this.getAttribute("transform");
    svg.grid.append("line")
      .attr("y2",-0.5)
      .attr("y1",-0.5)
      .attr("x2",svg.width)
      .attr("transform",transform);
  });

  svg.axisyTop.selectAll(".tick").each(function(){
    var transform = this.getAttribute("transform");
    svg.grid.append("line")
      .attr("y2",0.5)
      .attr("y1",0.5)
      .attr("x2",svg.width)
      .attr("transform",transform);
  });



}


/***********************************************************************************************************/

function createTableLegendDouble(svg, direction, sumArrayDirection, colorMap,activFunct,desacFunct){

  var position = (direction === "In"?"Top":"Bottom");

  var maxHeight = svg.height/2;

  console.log(svg.divLegend);

  var divtableStr = "divtable" + position;
  svg.divLegend[divtableStr] = svg.divLegend.append("div").classed("borderTable diagram",true)
    .style("top", svg.margin.top/2 +  "px")
    .style("position","relative");

  var divtable = svg.divLegend[divtableStr];

  divtable.table = divtable.append("table")
    .classed("diagram font2 tableLegend", true).style("width", svg.tableWidth + "px")
    .style("max-height", maxHeight + "px");
  
  var table = divtable.table;

  var trSelec = table.selectAll("tr").data(sumArrayDirection).enter().append("tr");

  tableLegendTitle(svg,trSelec);

  trSelec.append("td").append("div").classed("lgd", true).style("background-color", function (d) {
    return colorMap.get(d.item);
  });

  trSelec.append("td").text(function (d) {
    return d.display;
  });
  
  divtable.style("margin-bottom",maxHeight - parseInt(table.style("height"),10) + "px");
  
  trSelec.on("mouseover",activFunct(direction)).on("mouseout", desacFunct);

  hideShowValuesDirection(svg,trSelec,direction);
  

  return trSelec;

}


/***********************************************************************************************************/

function hideShowValuesDirection(svg,trSelec,direction){

  direction = ("In"=== direction?"Top":"Bottom");
  var duration = 800;
  var trSelecSize = trSelec.size();
  var valuesDirectionBounded = svg["values" + direction];
  var stringifiedDirection = JSON.stringify(valuesDirectionBounded);
  var valuesDirectionImmutable = JSON.parse(stringifiedDirection);
  var valuesDirectionFinal = JSON.parse(stringifiedDirection);

  svg["values" + direction + "Immutable"] = valuesDirectionImmutable;

  var hiddenValuesDirection = [];

  var firstX = 0;
  var lengthX = (valuesDirectionImmutable.length === 0?0:valuesDirectionImmutable[valuesDirectionImmutable.length - 1].x + 1);

  var valuesFinalLength = valuesDirectionFinal.length;

  var totalDirectionString = "total" + direction;




    trSelec.on("click", function(d){


      var clickedRow = d3.select(this);


      svg.transition("hideshow" + direction).duration(duration).tween("",function(){
  
        var x, sum, i, index, elemValues;
  
  
        if(svg.popup.pieChart !==null){
          return;
        }
  
        index = hiddenValuesDirection.indexOf(d.item);
  
        var functionHeight;
  
        if(index === -1){
          //hide the data
  
          hiddenValuesDirection.push(d.item);
          clickedRow.classed("strikedRow",true);
          functionHeight = function(){
            return 0;
          }
  
        }else{
          //show the data
  
          hiddenValuesDirection.splice(index,1);
          clickedRow.classed("strikedRow",false);
  
          functionHeight = function(){
            return valuesDirectionImmutable[i].height;
          }
  
        }
  
        x = firstX;
        i = 0;
        var totalSumDirection = [];
  
        if(direction === "Top"){

          elemValues = valuesDirectionFinal[i];

          while(x < lengthX){
  
            sum = 0;
            
            while(i < valuesFinalLength && elemValues.x === x){
  
  
              if(elemValues.item === d.item){
                elemValues.height = functionHeight();
              }
  
              sum += elemValues.height;
              elemValues.y = sum;
              i++;
              elemValues = valuesDirectionFinal[i];
            }
            totalSumDirection.push(sum);
            x++;
          }
  
        }else{

          elemValues = valuesDirectionFinal[i];

          while(x < lengthX){
  
            sum = 0;
  
  
            while(i < valuesFinalLength && elemValues.x === x){
  
              if(elemValues.item === d.item){
                elemValues.height = functionHeight();
              }
  
              elemValues.y = sum;
              sum += elemValues.height;
              i++;
              elemValues = valuesDirectionFinal[i];
            }
            totalSumDirection.push(sum);
            x++;
          }
  
        }
  
  
  
        var finalTotalDirection;
  
        if(hiddenValuesDirection.length === trSelecSize){
  
          finalTotalDirection = 1;
  
        }else{
  
          finalTotalDirection = d3.max(totalSumDirection);
  
        }
  
  

        var startTotalDirection = svg[totalDirectionString];
  
        var valuesDirectionStart = JSON.parse(JSON.stringify(valuesDirectionBounded));
  
        var t0;
  
        return function(t){
  
          t0 = (1-t);
  
          var valueStart, valueFinal;
  
          valuesDirectionBounded.forEach(function(valueBounded,i){
  
            valueStart = valuesDirectionStart[i];
            valueFinal = valuesDirectionFinal[i];
            valueBounded.y = t0 * valueStart.y + t * valueFinal.y;
            valueBounded.height = t0 * valueStart.height + t * valueFinal.height;
  
          });
  
          svg[totalDirectionString] = t0 * startTotalDirection + t * finalTotalDirection;
  
          calculationsHideShowDirection(svg);
  
        }; //function t
  
  
  
      }); //svg tween transition on click




  }) //trselec on click
      
    .on("contextmenu",function(d){
      d3.event.preventDefault();

      var clickedRow = d3.select(this);

      svg.transition("hideshow" + direction).duration(duration).tween("",function() {

        var x, sum, i, index, elemValues;


        if(svg.popup.pieChart !==null){
          return;
        }

        index = hiddenValuesDirection.indexOf(d.item);

        var functionHeight;

        if ((index !== -1) || (trSelecSize - 1 !== hiddenValuesDirection.length )) {
          //Hide all data except this one

          hiddenValuesDirection = trSelec.data().map(function (elem) {
            return elem.item;
          });
          
          hiddenValuesDirection.splice(hiddenValuesDirection.indexOf(d.item), 1);

          trSelec.classed("strikedRow", true);
          clickedRow.classed("strikedRow", false);

          functionHeight = function(){

            if(elemValues.item !== d.item){
              return 0;
            }

            return valuesDirectionImmutable[i].height;

          };

        }else{


          //index === -1 && hiddenValues.length == trSelec.size() -1
          // ->show all data.
          hiddenValuesDirection = [];
          trSelec.classed("strikedRow", false);

          functionHeight = function(){
            return valuesDirectionImmutable[i].height;
          };
          
          
        }




        x = firstX;
        i = 0;
        var totalSumDirection = [];

        if(direction === "Top"){

          elemValues = valuesDirectionFinal[i];

          while(x < lengthX){

            sum = 0;


            while(i < valuesFinalLength && elemValues.x === x){


              elemValues.height = functionHeight();

              sum += elemValues.height;
              elemValues.y = sum;
              i++;
              elemValues = valuesDirectionFinal[i];
            }
            totalSumDirection.push(sum);
            x++;
          }

        }else{

          elemValues = valuesDirectionFinal[i];

          while(x < lengthX){

            sum = 0;


            while(i < valuesFinalLength && elemValues.x === x){

              elemValues.height = functionHeight();


              elemValues.y = sum;
              sum += elemValues.height;
              i++;
              elemValues = valuesDirectionFinal[i];
            }
            totalSumDirection.push(sum);
            x++;
          }

        }


        var finalTotalDirection;

        if(hiddenValuesDirection.length === trSelecSize){

          finalTotalDirection = 1;

        }else{

          finalTotalDirection = d3.max(totalSumDirection);

        }



        var startTotalDirection = svg[totalDirectionString];

        var valuesDirectionStart = JSON.parse(JSON.stringify(valuesDirectionBounded));

        var t0;

        return function(t){

          t0 = (1-t);

          var valueStart, valueFinal;

          valuesDirectionBounded.forEach(function(valueBounded,i){

            valueStart = valuesDirectionStart[i];
            valueFinal = valuesDirectionFinal[i];
            valueBounded.y = t0 * valueStart.y + t * valueFinal.y;
            valueBounded.height = t0 * valueStart.height + t * valueFinal.height;

          });

          svg[totalDirectionString] = t0 * startTotalDirection + t * finalTotalDirection;

          calculationsHideShowDirection(svg);

        }; //function t




      }); //svg tween transition on contextmenu


    }); //trselec on contextmenu
      


}


/**********************************************************************************************************************/

function calculationsHideShowDirection(svg){

  updateScalesDouble(svg);

  updateHisto2DStackDouble(svg);

}


/************************************************************************************************************/

function updateScalesDouble(svg){
  
  var actTranslate1 = -svg.transform.y/(svg.scaley*svg.transform.k);

  svg.heightTop = (svg.height - svg.margin.zero)*svg.totalTop/(svg.totalBottom+svg.totalTop);

  var marginViewTop = Math.min(svg.height,Math.max(-svg.margin.zero,
    svg.heightTop*svg.transform.k*svg.scaley+svg.transform.y));
  var marginViewBottom = marginViewTop + svg.margin.zero;

  svg.yBottom.range([svg.heightTop+svg.margin.zero,svg.height]);
  svg.yTop.range([svg.heightTop,0]);
  svg.yBottom.domain([0,svg.totalBottom*1.1]);
  svg.yTop.domain([0,svg.totalTop*1.1]);
  svg.newYTop.range([marginViewTop,Math.min(marginViewTop,0)]);
  svg.newYBottom.range([marginViewBottom, Math.max(marginViewBottom,svg.height)]);
  svg.newYTop.domain([svg.yTop.invert(svg.height/(svg.transform.k*svg.scaley) + actTranslate1),
    svg.yTop.invert(actTranslate1)]);

  svg.newYBottom.domain([svg.yBottom.invert(actTranslate1  + (1-1/(svg.transform.k*svg.scaley))*svg.margin.zero),
    svg.yBottom.invert(actTranslate1 + (1-1/(svg.transform.k*svg.scaley))*svg.margin.zero + svg.height/(svg.transform.k*svg.scaley))]);

}


/************************************************************************************************************/



function doubleZoomReset(svg, updateFunction){

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
    svg.newYTop.domain(svg.yTop.domain()).range(svg.yTop.range());
    svg.newYBottom.domain(svg.yBottom.domain()).range(svg.yBottom.range());

    updateFunction(svg);
  };

}
















