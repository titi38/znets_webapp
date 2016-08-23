
function removeValuesOnUpdate(svg, valuesData,sumMapUpdate,gapMinute){
  
  for(var i = valuesData.length - 1; i >= 0; i-- ){

    var valueI = valuesData[i];

    if(valueI.x < gapMinute){

      if(sumMapUpdate.has(valueI.item)){
        
        sumMapUpdate.get(valueI.item).sum -= valueI.height;

      }else{
        
        sumMapUpdate.set(valueI.item, {sum:- valueI.height,display:svg.sumMap.get(valueI.item).display});
        
      }
      
    }

  }



}


/***********************************************************************************************************/

function updateSumArray( sumArray, sumMapUpdate){

  sumMapUpdate.forEach(function(value, key){

    var arrayElem = sumArray.find(function(elem){return elem.item === key;});

    if(arrayElem){
      arrayElem.sum += value.sum;
    }else{
      sumArray.push({item: key, sum: value.sum, display: value.display})
    }

  });


  for(var i = sumArray.length - 1; i >= 0; i--){
    if(sumArray[i].sum <= 0){
      sumArray.splice(i,1);
    }

  }
  
}


/*******************************************************************************************************************/

function updateTrSelec(svg, direction){
  
  var position = (direction === "In"?"Top":"Bottom");


  var trSelecPositionStr = "trSelec" + position;
  var divtablePositionStr = "divtable" + position;
  var sumArrayPositionStr = "sumArray" + position;
  console.log(svg[sumArrayPositionStr]);


  svg[trSelecPositionStr] = svg.divLegend[divtablePositionStr].table.selectAll("tr").data(svg[sumArrayPositionStr]);
  svg[trSelecPositionStr].select("div").style("background-color", function (d) {
    return svg.colorMap.get(d.item);
  });

  svg[trSelecPositionStr].select("td:nth-of-type(2)").text(function (d) {
    return d.display;
  });

  var trselecEnter = svg[trSelecPositionStr].enter().append("tr");

  trselecEnter.append("td").append("div").classed("lgd", true).style("background-color", function (d) {
    return svg.colorMap.get(d.item);
  });

  trselecEnter.append("td").text(function (d) {
    return d.display;
  });

  svg[trSelecPositionStr].exit().remove();
  svg[trSelecPositionStr] = svg.divLegend[divtablePositionStr].table.selectAll("tr");

  svg[trSelecPositionStr].on("mouseover",svg.activationElemsFromTable(direction)).on("mouseout", svg.deactivationElems);

  tableLegendTitle(svg, svg[trSelecPositionStr]);



}


/***********************************************************************************************************/

function createTableLegendDoubleCurrent(svg, direction, sumArrayDirection, colorMap,activFunct,desacFunct){

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

function hideShowValuesDirectionCurrent(svg,trSelec,direction){

  direction = ("In"=== direction?"Top":"Bottom");
  var valuesDirectionString = "values" + direction;
  var mapDisplayString = "mapPercentDisplayByItem" + direction;
  var chartDirString = "chart" + direction;
  var duration = 800;

  var hiddenValuesDirectionArray = [];

  svg[mapDisplayString] = new Map();

  trSelec.each(function(d){

    svg[mapDisplayString].set(d.item,{percentDisplay:1});

  });


  var totalDirectionString = "total" + direction;




  trSelec.on("click", function(d){

      if(svg.popup.pieChart !==null){
        return;
      }

      var valuesDirectionBounded = svg[valuesDirectionString];

      var clickedRow = d3.select(this);

      var index = hiddenValuesDirectionArray.indexOf(d.item);


      if(index === -1){
        //hide the data

        hiddenValuesDirectionArray.push(d.item);
        clickedRow.classed("strikedRow",true);


      }else{
        //show the data

        hiddenValuesDirectionArray.splice(index,1);
        clickedRow.classed("strikedRow",false);


      }


      var clickedItemPercent = svg[mapDisplayString].get(d.item);

      clickedRow.transition("hideshow").duration(duration * (1 - clickedItemPercent.percentDisplay))
        .tween("",function(){

          var initPercent = clickedItemPercent.percentDisplay;
          var finalPercent = (index === -1)?0:1;
          var finmininitPercent = finalPercent-initPercent;

          return function(t){
            clickedItemPercent.percentDisplay = initPercent + t*finmininitPercent;
          }
          
        });





      svg.transition("hideshow" + direction).duration(duration).tween("",function(){

        var x, sum, i, index, elemValues;



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

        if(hiddenValuesDirectionArray.length === trSelecSize){

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

        index = hiddenValuesDirectionArray.indexOf(d.item);

        var functionHeight;

        if ((index !== -1) || (trSelecSize - 1 !== hiddenValuesDirectionArray.length )) {
          //Hide all data except this one

          hiddenValuesDirectionArray = trSelec.data().map(function (elem) {
            return elem.item;
          });

          hiddenValuesDirectionArray.splice(hiddenValuesDirectionArray.indexOf(d.item), 1);

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
          hiddenValuesDirectionArray = [];
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

        if(hiddenValuesDirectionArray.length === trSelecSize){

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

/***********************************************************************************************************************/

function transitionRefresh(svg, duration, direction, valuesDirBounded){

  var mapDisplay = svg["mapPercentDisplayByItem" + direction];


  svg.transition("refresh" + direction).duration(duration).tween("",function(){

    //to be sure.
    var firstX = -60;
    var lengthX = 120;
    

    var x = firstX;
    var i = 0;
    var sum, elemValues, boundedValuesLength = valuesDirBounded.length;

    if(direction === "Top"){

      elemValues = valuesDirBounded[i];

      while(x < lengthX){

        sum = 0;

        while(i < valuesDirBounded && elemValues.x === x){


          elemValues.height = elemValues.heightRef * mapDisplay.get(elemValues.item);

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


  });

}

