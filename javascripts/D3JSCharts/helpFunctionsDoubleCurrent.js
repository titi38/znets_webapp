/**
 * Created by elie.
 */


/**
 * Function that updates the sum of elements'amount by item by subtraction of elements older than one hour when the
 *                                                                                           graph's data is actualized.
 * @param svg {Object} D3 encapsulated parent svg element.
 * @param valuesData {Array} Array which contains the elements'data.
 * @param sumMapUpdate {Object} Javascript Map object, associates elements'item with the numerical's variation of their
 *                                                                                                  sum on an autoupdate.
 * @param gapMinute {Number} Indicates how many minutes separate the new data from the old.
 */

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


/**
 * Updates the sumArray map with the variations computed in sumMapUpdate to match the new data.
 * @param sumArray {Object} Javascript Map object, contains the sum of elements' quantity by item.
 * @param sumMapUpdate {Object} Javascript Map object, associates elements'item with the numerical's variation of their
 *                                                                                                  sum on an autoupdate.
 * @param hiddenValuesArray {Array} Keep track of masked items, updated if needed.
 * @param mapPercentDisplay {Object} Javascript Map object, used to record how much of an element in function of its
 * item value is displayed for the hide/show transitions.
 */

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


/**
 * Updates the rows of one legend's table during an update.
 * @param svg {Object} D3 encapsulated parent svg element.
 * @param direction {String} Indicates which table is updated.
 * */

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


/**
 * Creates the legend's table for one set of data according their direction property and add the hide/show feature for
 *                                                                                             the auto-updating graphs.
 * @param svg {Object} D3 encapsulated parent svg element.
 * @param direction {String} "In" or "Out", indicates the value of the data's direction property.
 * @param sumArrayDirection {Array} The array which contains item and display values, and the overall volume by item.
 * @param colorMap {Object} Javascript Map, links item value to the corresponding color.
 * @param activFunct {Function} The function called when the mouse hovers the data or the table entries.
 * @param desacFunct {Function} The function called when the mouse quits the data or the table entries.
 * @returns {Object} D3 selection of created tr elements.
 */

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


/**
 * Allows the possibility to hide/show data inside the auto-updating stacked double histogram according their item value.
 * @param svg {Object} D3 encapsulated parent svg element.
 * @param trSelec {Object} D3 selection of tr elements from the corresponding legend's table.
 * @param direction {String} "In" or "Out", indicates the value of the data's direction property.
 */

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

/**
 * Computes the new heights and positions of element for a given direction, then updates internal variables and
 *                                                                                                    redraws the graph.
 * @param svg {Object} D3 encapsulated parent svg element.
 * @param direction {String} "Top" or "Bottom", depends on the value of the data's direction property.
 */

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


/**
 * Calculates the display text value and sum of the javascript object elemToPush's height according to elemToPush.item
 * and stores them into the sumMap parameter, for the autoupdating graphs.
 * @param sumMap {Object} Javascript Map, stores height's sums and display text by item.
 * @param elemToPush {Object} The object corresponding to the data that will be used to create a stacked histogram.
 * @param elemJson {Array} The array returned by the server used to represent a given datum.
 * @param contentDisplayValue {Number} The position of the display text inside the elemJson parameter.
 * @param itemType {String} The reference name for item values by the json returned by the server into
 * json.response.content, used to detect non-generic cases.
 */


function mapElemToSumCurrent(sumMap, elemToPush, elemJson, contentDisplayValue,itemType){

  if (!sumMap.has(elemToPush.item)) {
    sumMap.set(elemToPush.item, {sum: elemToPush.heightRef,display:
      "" + ((elemToPush.item === " Remainder ")?" Remainder ":
        (elemJson[contentDisplayValue] === "")?elemToPush.item:
          (itemType === "portproto")?elemToPush.item + " (" +  elemJson[contentDisplayValue] + ")":
            elemJson[contentDisplayValue])});
  } else {
    sumMap.get(elemToPush.item).sum += elemToPush.heightRef;
  }

}


/**
 * Utility function for sorting elements in an array according their heightRef and abscissa (numbers), before being processed to be
 * displayed, for auto-updating graphs.
 * @param a {Object} Javascript object with item property set as string, x and height properties set as numbers.
 * @param b {Object} Javascript object with item property set as string, x and height properties set as numbers.
 * @returns {Number} If less than 0, a will have a lower index than b in the sorting array, if greater,
 * b will have a lower index than a in the sorting array.
 */

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





/**
 * Utility function used to append svg:title element to each data from a stacked histogram displaying quantity, date,
 * display name and item name, for auto-updating graphs.
 * @param svg {Object} D3 encapsulated svg element having the svg.units, svg.timeMin and svg.step properties.
 * @param selection {Object} A D3 selection of rect html elements bound to their datum.
 * @param sumMap {Object} A Javascript Map used to retrieve the display value of requested elements from their item
 *                                                                                                                value.
 */

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

/**
 * End the auto-update behavior by unsubscribing from the websocket if the graph isn't displayed anymore.
 * @param id {Number} Received id when subscribed to the websocket.
 * @param urljson {String} Url sent as parameter when subscribed to the websocket.
 * @param div {Object} D3 encapsulated parent div element.
 * @returns {Boolean} True if the graph wasn't displayed so the unsubscription has been made, false is the graph is
 *                                                                                                        still active.
 */

function unsubscribeGraphIfInactive(id, urljson, div){
  if(!(div.classed("active") && div.classed("in"))){
    console.log(myLastHourHistory.unsubscribe(urljson, id));
    console.log(id);
    return true;
  }
  return false;
}

/**
 * Instantiates the transition to mask or show data after a click or a contextmenu event on a table row.
 * @param svg {Object} D3 encapsulated parent svg element.
 * @param direction {String} "Top" or "Bottom", depends on the value of the data's direction property.
 * @param duration {Number} The duration of the transition.
 * @param mapDisplayString {String} The name of the svg property which references the mapPercentDisplay map according
 *                                                                                                the correct direction.
 * @param hiddenValuesStr {String} The name of the svg property which references the hiddenValues array according
 *                                                                                                the correct direction
 */


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


