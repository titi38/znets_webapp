
function removeValuesOnUpdate(svg, valuesData,sumMapUpdate,gapMinute){
  
  for(var i = valuesData.length - 1; i >= 0; i-- ){

    var valueI = valuesData[i];

    if(valueI.x < gapMinute){

      if(sumMapUpdate.has(valueI.item)){
        
        sumMapUpdate.get(valueI.item).sum -= valueI.heightRef;

      }else{
        
        sumMapUpdate.set(valueI.item, {sum:- valueI.heightRef,display:svg.sumMap.get(valueI.item).display});
        
      }
      
    }

  }



}


/***********************************************************************************************************/

function updateSumArray( sumArray, sumMapUpdate,hiddenValuesArray,mapPercentDisplay) {

  sumMapUpdate.forEach(function (value, key) {

    var arrayElem = sumArray.find(function (elem) {
      return elem.item === key;
    });

    if (arrayElem) {
      arrayElem.sum += value.sum;
    } else {
      sumArray.push({item: key, sum: value.sum, display: value.display})
    }

  });


  for (var i = sumArray.length - 1; i >= 0; i--) {
    if (sumArray[i].sum <= 0) {

      var index = hiddenValuesArray.indexOf(sumArray[i].item);
      if (index !== -1) {
        hiddenValuesArray.splice(index, 1);
      }
      mapPercentDisplay.delete(sumArray[i].item);
      sumArray.splice(i, 1);


    }

  }
}


/*******************************************************************************************************************/

function updateTrSelec(svg, direction){
  
  var position = (direction === "In"?"Top":"Bottom");


  var trSelecPositionStr = "trSelec" + position;
  var divtablePositionStr = "divtable" + position;
  var sumArrayPositionStr = "sumArray" + position;
  var hiddenValuesPositionStr = "hiddenValues" + position + "Array";
  console.log(svg[sumArrayPositionStr]);


  svg[trSelecPositionStr] = svg.divLegend[divtablePositionStr].table.selectAll("tr").data(svg[sumArrayPositionStr]);

  svg[trSelecPositionStr].classed("strikedRow",function(d){return svg[hiddenValuesPositionStr].indexOf(d.item) !== -1; });

  svg[trSelecPositionStr].select("div").style("background-color", function (d) {
    return svg.colorMap.get(d.item);
  });

  svg[trSelecPositionStr].select("td:nth-of-type(2)").text(function (d) {
    return d.display;
  });


  var trselecEnter = svg[trSelecPositionStr].enter().append("tr")
    .classed("strikedRow",function(d){return svg[hiddenValuesPositionStr].indexOf(d.item) !== -1; });

  trselecEnter.append("td").append("div").classed("lgd", true).style("background-color", function (d) {
    return svg.colorMap.get(d.item);
  });

  trselecEnter.append("td").text(function (d) {
    return d.display;
  });

  trselecEnter.on("click",svg["hideShowOnClickTr" + position]).on("contextmenu", svg["hideShowOnContextMenuTr" + position]);

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

  hideShowValuesDirectionCurrent(svg,trSelec,direction);


  return trSelec;

}



/***********************************************************************************************************/

function hideShowValuesDirectionCurrent(svg,trSelec,direction){

  direction = ("In"=== direction?"Top":"Bottom");
  var trSelecDirectionStr = "trSelec" + direction;
  var clickFunctionStr = "hideShowOnClickTr" + direction;
  var contextMenuFctStr = "hideShowOnContextMenuTr" + direction;
  var mapDisplayString = "mapPercentDisplayByItem" + direction;
  var hiddenValuesStr = "hiddenValues" + direction + "Array";
  var duration = 800;

  svg[hiddenValuesStr] = [];

  svg[mapDisplayString] = new Map();

  trSelec.each(function(d){

    svg[mapDisplayString].set(d.item,{percentDisplay:1});

  });



  svg[clickFunctionStr] = function(d){

    if(svg.popup.pieChart !==null){
      return;
    }

    var clickedRow = d3.select(this);

    var index = svg[hiddenValuesStr].indexOf(d.item);


    if(index === -1){
      //hide the data

      svg[hiddenValuesStr].push(d.item);
      clickedRow.classed("strikedRow",true);


    }else{
      //show the data

      svg[hiddenValuesStr].splice(index,1);
      clickedRow.classed("strikedRow",false);


    }


    createTransitionDirection(svg, direction, duration, mapDisplayString,hiddenValuesStr);


  };

  svg[contextMenuFctStr] = function(d){
    d3.event.preventDefault();

    if(svg.popup.pieChart !==null){
      return;
    }

    var clickedRow = d3.select(this);

    var index = svg[hiddenValuesStr].indexOf(d.item);


    if ((index !== -1) || (svg[trSelecDirectionStr].size() - 1 !== svg[hiddenValuesStr].length )) {
      //Hide all data except this one

      svg[hiddenValuesStr] = [];
      svg[mapDisplayString].forEach(function(value, key){
        svg[hiddenValuesStr].push(key);
      });


      svg[hiddenValuesStr].splice(svg[hiddenValuesStr].indexOf(d.item), 1);

      svg[trSelecDirectionStr].classed("strikedRow",true);
      clickedRow.classed("strikedRow",false);


    }else{


      //index === -1 && hiddenValues.length == trSelec.size() -1
      // ->show all data.
      svg[hiddenValuesStr] = [];
      svg[trSelecDirectionStr].classed("strikedRow", false);


    }

    createTransitionDirection(svg, direction, duration, mapDisplayString,hiddenValuesStr);



  };

  trSelec.on("click", svg[clickFunctionStr]).on("contextmenu",svg[contextMenuFctStr]);



}

/***********************************************************************************************************************/

function transitionRefresh(svg, direction){




  var totalDirString = "total" + direction;




    var i, currentX;
    var sum, elemValues, currentPercent;

    var mapDisplay = svg["mapPercentDisplayByItem" + direction];
    var valuesDirSortAlphabet = svg["values" + direction + "SCAlphabetSort"];
    var valuesDirUsualSort = svg["values" + direction];
    var valuesLength = valuesDirUsualSort.length;

    var totalSumDirection = [], currentItem = null;


    //height actualization
    for (i = 0; i < valuesLength; i++) {

      elemValues = valuesDirSortAlphabet[i];

      if (elemValues.item !== currentItem) {
        currentItem = elemValues.item;
        currentPercent = mapDisplay.get(currentItem).percentDisplay;
      }

      elemValues.height = elemValues.heightRef * currentPercent;

    }

    if (direction === "Top") {

      currentX = null;
      sum = 0;

      for (i = 0; i < valuesLength; i++) {
        elemValues = valuesDirUsualSort[i];

        if (currentX !== elemValues.x) {
          currentX = elemValues.x;
          totalSumDirection.push(sum);
          sum = 0;
        }

        sum += elemValues.height;
        elemValues.y = sum;

      }


    } else {

      currentX = null;
      sum = 0;

      for (i = 0; i < valuesLength; i++) {
        elemValues = valuesDirUsualSort[i];

        if (currentX !== elemValues.x) {
          currentX = elemValues.x;
          totalSumDirection.push(sum);
          sum = 0;
        }

        elemValues.y = sum;
        sum += elemValues.height;

      }

    }

    totalSumDirection.push(sum);

    svg[totalDirString] = Math.max(1,d3.max(totalSumDirection));

    calculationsHideShowDirection(svg);


}




/************************************************************************************************************/

function mapElemToSumCurrent(sumMap, elemToPush, elemJson, contentDisplayValue,itemType){

  if (!sumMap.has(elemToPush.item)) {
    sumMap.set(elemToPush.item, {sum: elemToPush.heightRef,display:
      (elemToPush.item === " Remainder ")?" Remainder ":
        (elemJson[contentDisplayValue] === "")?elemToPush.item:
          (itemType === "portproto")?elemToPush.item + " (" +  elemJson[contentDisplayValue] + ")":
            elemJson[contentDisplayValue]});
  } else {
    sumMap.get(elemToPush.item).sum += elemToPush.heightRef;
  }

}

/************************************************************************************************************/


function sortValuesCurrent(a, b) {

  if (a.x - b.x != 0) {
    return a.x - b.x;
  }
  if (a.item == " Remainder " || a.item == "OTHERS") {
    return 1;
  }
  if (b.item == " Remainder " || b.item == "OTHERS") {
    return -1;
  }
  return a.heightRef - b.heightRef;
}



/************************************************************************************************************/

function createTooltipHistoCurrent(svg, selection, sumMap){

  var isBytes = svg.units === "Bytes",coef = 8000/svg.step;

  var convertArray, valDisplay;

  if(isBytes){

    var heightPerSec, cAOptionel;

    selection.append("svg:title")
      .text(function (d) {
        heightPerSec = d.heightRef * coef;
        convertArray = quantityConvertUnit(d.heightRef,isBytes);
        cAOptionel = quantityConvertUnit(heightPerSec,true);
        valDisplay = sumMap.get(d.item).display;
        return ((d.item === valDisplay)?"":(valDisplay + "\n"))
          + d.item + "\n"
          + getDateFromAbscissa(svg,d.x).toString() + "\n"
          + ((Math.round(100 * heightPerSec * cAOptionel[1])/100) + " " + cAOptionel[0] + "bits/s") + "\n"
          + ((Math.round(100 * d.heightRef * convertArray[1])/100) + " " + convertArray[0] + svg.units) + "\n"
          + "(" +  d.heightRef + " " + svg.units + ")";
      });

  }else{

    selection.append("svg:title")
      .text(function (d) {
        convertArray = quantityConvertUnit(d.heightRef,isBytes);
        valDisplay = sumMap.get(d.item).display;
        return ((d.item === valDisplay)?"":(valDisplay + "\n"))
          + d.item + "\n"
          + getDateFromAbscissa(svg,d.x).toString() + "\n"
          + ((Math.round(100 * d.heightRef * convertArray[1])/100) + " " + convertArray[0] + svg.units) + "\n"
          + "(" +  d.heightRef + " " + svg.units + ")";
      });

  }



}

/**********************************************************************************************************************/

function unsubscribeGraphIfInactive(id, urljson, div){
  if(!(div.classed("active") && div.classed("in"))){
    console.log(myLastHourHistory.unsubscribe(urljson, id));
    console.log(id);
    return true;
  }
  return false;
}

/**********************************************************************************************************************/


function createTransitionDirection(svg, direction, duration, mapDisplayString,hiddenValuesStr){
  svg.transition("hideshow" + direction).duration(duration)
    .tween("",function(){
      var arrayUpdate = [];

      svg[mapDisplayString].forEach(function(value, key){
        var coef = (svg[hiddenValuesStr].indexOf(key) === -1?1:0) - value.percentDisplay;
        if(coef !== 0){
          arrayUpdate.push([value,value.percentDisplay,coef]);
        }
      });


      return function(t){

        arrayUpdate.forEach(function(elem){
          elem[0].percentDisplay = elem[1] + t * elem[2];
        });

        transitionRefresh(svg, direction);
      }

    });
}

/**********************************************************************************************************************/
