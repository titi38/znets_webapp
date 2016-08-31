/**
 * Created by elie on 31/08/16.
 */

function hideShowValuesCurrent(svg){

  var duration = 800;

  svg.hiddenValues  = [];

  svg.mapPercentDisplay = new Map();

  svg.trSelec.each(function(d){

    svg.mapPercentDisplay.set(d.item,{percentDisplay:1});

  });



  svg.onClick = function(d){


    var clickedRow = d3.select(this);

    var index = svg.hiddenValues.indexOf(d.item);


    if(index === -1){
      //hide the data

      svg.hiddenValues.push(d.item);
      clickedRow.classed("strikedRow",true);


    }else{
      //show the data

      svg.hiddenValues.splice(index,1);
      clickedRow.classed("strikedRow",false);


    }


    createTransitionSimpleCurrent(svg, duration);

  };

  svg.onContextMenu = function(d){
    d3.event.preventDefault();

    var clickedRow = d3.select(this);

    var index = svg.hiddenValues.indexOf(d.item);


    if ((index !== -1) || (svg.trSelec.size() - 1 !== svg.hiddenValues.length )) {
      //Hide all data except this one

      svg.hiddenValues = [];
      svg.mapPercentDisplay.forEach(function(value, key){
        svg.hiddenValues.push(key);
      });


      svg.hiddenValues.splice(svg.hiddenValues.indexOf(d.item), 1);

      svg.trSelec.classed("strikedRow",true);
      clickedRow.classed("strikedRow",false);


    }else{


      //index === -1 && hiddenValues.length == trSelec.size() -1
      // ->show all data.
      svg.hiddenValues = [];
      svg.trSelec.classed("strikedRow", false);


    }

    createTransitionSimpleCurrent(svg, duration);


  };

  svg.trSelec.on("click", svg.onClick).on("contextmenu",svg.onContextMenu);



}


function createTransitionSimpleCurrent(svg, duration){
  svg.transition("hideshow").duration(duration)
    .tween("",function(){
      var arrayUpdate = [];

      svg.mapPercentDisplay.forEach(function(value, key){
        var coef = (svg.hiddenValues.indexOf(key) === -1?1:0) - value.percentDisplay;
        if(coef !== 0){
          arrayUpdate.push([value,value.percentDisplay,coef]);
        }
      });


      return function(t){

        arrayUpdate.forEach(function(elem){
          elem[0].percentDisplay = elem[1] + t * elem[2];
        });

        transitionRefreshSimpleCurrent(svg);
      }

    });
}


function transitionRefreshSimpleCurrent(svg){


  var i, currentX;
  var sum, elemValues, currentPercent;

  var mapDisplay = svg.mapPercentDisplay;
  var valuesSortAlphabet = svg.valuesSCAlphabetSort;
  var valuesUsualSort = svg.values;
  var valuesLength = valuesUsualSort.length;

  var totalSum = [], currentItem = null;


  //height actualization
  for (i = 0; i < valuesLength; i++) {

    elemValues = valuesSortAlphabet[i];

    if (elemValues.item !== currentItem) {
      currentItem = elemValues.item;
      currentPercent = mapDisplay.get(currentItem).percentDisplay;
    }

    elemValues.height = elemValues.heightRef * currentPercent;

  }


    currentX = null;
    sum = 0;

    for (i = 0; i < valuesLength; i++) {
      elemValues = valuesUsualSort[i];

      if (currentX !== elemValues.x) {
        currentX = elemValues.x;
        totalSum.push(sum);
        sum = 0;
      }

      sum += elemValues.height;
      elemValues.y = sum;

    }


  totalSum.push(sum);

  svg.total = Math.max(1,d3.max(totalSum));
  
  updateScalesSimpleCurrent(svg);
  updateHisto2DStackSimple(svg);


}


function updateScalesSimpleCurrent(svg){

  var actTranslate1 = -svg.transform.y/(svg.scaley*svg.transform.k);
  svg.y.domain([0,svg.total*1.05]);
  svg.newY.domain([svg.y.invert(actTranslate1 + svg.height/(svg.transform.k*svg.scaley)), svg.y.invert(actTranslate1)]);

}