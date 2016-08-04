
/***********************************************************************************************************/



function getPieJsonQuery(svg, clickData) {

  /*
   console.error(moment(getDateFromAbscissa(svg, clickData.x)).format("YYYY-MM-DD HH:mm"));// &dd=
   console.error(moment(getDateFromAbscissa(svg, clickData.x+1)).format("YYYY-MM-DD HH:mm"));// &df=
   console.error($("#preset_ChartsForm").val());// &pset=
   console.error(svg.attr("data-network")); // &net=
   console.error(clickData.item);//&ip=
   console.error(clickData.direction.toLowerCase());//&type=
   */

  //?

  return proxyPass + ( ( svg.attr("data-pie-json") ) ? svg.attr("data-pie-json")+"?" : "" )
    +( ( moment(getDateFromAbscissa(svg, clickData.x)).format("YYYY-MM-DD+HH:mm") ) ? "&dd="+moment(getDateFromAbscissa(svg, clickData.x - 1)).format("YYYY-MM-DD+HH:mm") : "" )
    + ( ( moment(getDateFromAbscissa(svg, clickData.x + 1)).format("YYYY-MM-DD+HH:mm") ) ? "&df="+moment(getDateFromAbscissa(svg, clickData.x)).format("YYYY-MM-DD+HH:mm") : "" )
    + ( ( $("#preset_ChartsForm").val() ) ? "&pset="+$("#preset_ChartsForm").val() : "" )
    + ( ( svg.attr("data-network") && svg.attr("data-network") != "Global" ) ? "&net="+svg.attr("data-network") : "" )
    + ( ( clickData.item ) ? "&ip="+clickData.item : "" )
    + ( ( clickData.direction.toLowerCase() ) ? "&type="+clickData.direction.toLowerCase() : "" ) ;
}


/***********************************************************************************************************/

function addPopup(selection, div, svg , onCreationFunct, onSupprFunct) {


  svg.pieside = 0.75 * Math.min(svg.height, svg.width);
  div.overlay = div.append("div").classed("overlay", true).style("display", "none").style("width", (svg.width + svg.margin.left + svg.margin.right) + "px");
  svg.popup = div.append("div").classed("popup", true).style("display", "none");

  svg.popup.title = svg.popup.append("h3").classed("popupTitle",true);


  svg.popup.pieChart = null;
  svg.timer = null;


  selection
    .on("click", function (d) {

      console.log(getPieJsonQuery(svg, d));

      clearTimeout(svg.timer);
      svg.timer = setTimeout(function () {
        div.overlay.style("display", null);
        onCreationFunct(d);
        svg.popup.pieChart = svg.popup.append("svg").attr("width", svg.pieside).attr("height", svg.pieside).classed("pieSvg", true);
        //drawComplData("/dynamic/netExtHostsTopHostsTraffic.json?dd=2016-07-18%2020:00&df=2016-07-18%2021:00&pset=HOURLY&type=out&ip=193.48.83.251", svg, svg.pieside, d,div.overlay);
        //drawComplData(getPieJsonQuery(svg, d), svg, svg.pieside, d,div.overlay);
      }, 500);

    });

  div.overlay.on("click", function () {
    div.overlay.style("display", "none");
    svg.popup.style("display", "none");
    if(svg.popup.pieChart.divTable) {
      svg.popup.pieChart.divTable.remove();
    }
    svg.popup.pieChart.remove();
    svg.popup.pieChart = null;

    onSupprFunct();
  });


}
/***********************************************************************************************************/

function positionPopup(svg){


  svg.popup.style("left", ((svg.width - parseInt(svg.popup.style("width"),10)) / 2 + svg.margin.left) + "px")
    .style("bottom", ((svg.height - parseInt(svg.popup.style("height"),10)) / 2 + svg.margin.bottom) + "px");

  svg.popup.pieChart.divTable.style("margin-top",(svg.pieside - svg.popup.pieChart.divTable.node().offsetHeight)/2 + "px");


}

/***********************************************************************************************************/


function redrawPopup(div, svg){

  div.overlay.style("width",(svg.width+svg.margin.left + svg.margin.right) + "px");
  svg.pieside = 0.75*Math.min(svg.height,svg.width);


  if(svg.popup.pieChart != null){
    svg.popup.pieChart.attr("width", svg.pieside).attr("height", svg.pieside);
    var chartside = 0.75*svg.pieside;
    svg.popup.innerRad = 0;
    svg.popup.outerRad = chartside/2;
    svg.popup.pieChart.g.attr("transform","translate(" + (svg.pieside/2) + "," + (svg.pieside/2) + ")");


    var arc = d3.arc()
      .innerRadius(svg.popup.innerRad)
      .outerRadius(svg.popup.outerRad)
      .startAngle(function(d){return d.startAngle})
      .endAngle(function(d){return d.endAngle});


    svg.popup.pieChart.g.selectAll("path").attr("d",arc);
    svg.popup.pieChart.g.selectAll("text").attr("transform",function(d){
      var midAngle = (d.endAngle + d.startAngle)/2;
      var dist = svg.popup.outerRad * 0.8;
      return "translate(" + (Math.sin(midAngle)*dist) + "," +(-Math.cos(midAngle)*dist) +")";});



    svg.popup.pieChart.table.style("max-height",svg.pieside + "px");


    positionPopup(svg);

    svg.popup.dist = svg.popup.outerRad * 0.8;
    svg.popup.distTranslTemp = svg.popup.outerRad/4;
    svg.popup.distTransl = svg.popup.outerRad/10;



  }

}

/************************************************************************************************************/


function drawComplData(urlJson,svg,pieside,dataInit,overlay){

  var chartside = 0.75*pieside;


  //TODO TEMPORAIRE: test, à supprimer lors de l'utilisation avec de véritables valeurs.
  console.log(dataInit);
  total=6000000000;
  //TEMPORAIRE

  //Title
  svg.popup.title.text(dataInit.item);


  //Some values relative to the popup dimensions
  svg.popup.innerRad = 0;
  svg.popup.outerRad = chartside/2;
  svg.popup.dist = svg.popup.outerRad * 0.8;
  svg.popup.distTranslTemp = svg.popup.outerRad/4;
  svg.popup.distTransl = svg.popup.outerRad/10;


  d3.json(urlJson,function(error, json){

    var values = json.data;

    //data are prepared

    var sum = d3.sum(values,function(e){
      return e.y;
    });

    //sorted
    values.sort(function(a,b){
      return a.y -b.y;
    });

    //We attribute a color to each
    var f = colorEval(170);
    var listColors = [];
    var length = values.length;


    for(var w = 0; w < length; w++){

      listColors.push(f())

    }

    values.unshift({y: total -sum, hostname:" Remainder ",amount:bytesConvert(total-sum)});

    listColors.unshift("#f2f2f2");


    //The angles of the pie arcs are evaluated

    function anglesCalc(){
      var posAngle = 0;
      return function(value){
        value.startAngle = posAngle;
        posAngle += 2*Math.PI * value.y / total;
        value.endAngle = posAngle;
      }
    }

    var functAngles = anglesCalc();

    values.forEach(functAngles);

    var arc = d3.arc()
      .innerRadius(svg.popup.innerRad)
      .outerRadius(svg.popup.outerRad);

    //The arc template is readied
    function interpolateArc(d){

      //.toFixed(5) avoid having complete circles at the beginning of the transition,
      //if start and end angles are too close, the precision isn't good enough to order them
      //correctly and d3 can creates a 2PI angle.

      return function(t){
        return (arc
          .innerRadius(svg.popup.innerRad)
          .outerRadius(svg.popup.outerRad)
          .startAngle(d.startAngle)
          .endAngle((d.startAngle + t * (d.endAngle - d.startAngle)).toFixed(5)))();
      }

    }

    //g element parent of path and text components of the pie chart
    svg.popup.pieChart.g = svg.popup.pieChart.append("g")
      .attr("transform","translate(" + (pieside/2) + "," + (pieside/2) + ")")
      .classed("part",true).classed("elemtext",true);

    //path elements, the arcs themselves
    var pathSelec = svg.popup.pieChart.g.selectAll("path").data(values).enter().append("path")
      .attr("d","")
      .style("fill",function(d,i){ return listColors[i]; });
    pathSelec.append("svg:title").text(function(d){
      return  d.hostname + "\n" + d.amount});

    //text elements, the arcs' legends
    var textSelec = svg.popup.pieChart.g.selectAll("text").data(values).enter().append("text")
      .attr("transform",function(d){
        var midAngle = (d.endAngle + d.startAngle)/2;
        return "translate(" + (Math.sin(midAngle)*svg.popup.dist) + "," +(-Math.cos(midAngle)*svg.popup.dist) +")";})
      .text(function(d){ return d.amount;});


    //transition on paths for fanciness
    pathSelec.transition("creation").ease(easeFct(3)).duration(800).attrTween("d",interpolateArc);


    //Table
    svg.popup.pieChart.divTable = svg.popup.append("div").classed("popupTableDiv", true);
    svg.popup.pieChart.table = svg.popup.pieChart.divTable.append("table").classed("popupTableLegend",true)
      .style("max-height",svg.pieside + "px");

    var trSelec = svg.popup.pieChart.table.selectAll("tr").data(values)
      .enter().append("tr").attr("title",function(d){
        return d.hostname + "\nVolume: " + d.amount;
      });

    trSelec.append("td").append("div").classed("lgd", true).style("background-color", function (d,i) {
      return listColors[i];
    });
    trSelec.append("td").text(function(d){return d.hostname;});




    //name of the current element being hovered, at first none then null.
    var activeHostname = null;

    //Hover listener on the pie chart svg.
    svg.popup
      .on("mouseover", mouseoverFunction);

    //Hover listener on the table.
    overlay
      .on("mouseover",mouseoverFunction);


    function mouseoverFunction(){

      var target = d3.event.target;
      var path;
      var text;
      var d;
      var onTable = false;

      //hostname of the element being hovered currently
      var hostname;
      console.log(target.tagName);
      //detection of the element being hovered
      switch (target.tagName){
        //if path or text, variables are being instantiated accordingly.
        case "path":
          path = d3.select(target);
          d = path.datum();
          hostname = d.hostname;
          text = textSelec.filter(function(data){return data.hostname === hostname;});
          break;

        case "text":
          text = d3.select(target);
          d = text.datum();
          hostname = d.hostname;
          path = pathSelec.filter(function(data){return data.hostname === hostname;});
          break;

        case "TD":
        case "DIV":
          d = d3.select(target).datum();
          if(!d){
            hostname = null;
            break;
          }
          onTable = true;
          hostname = d.hostname;
          text = textSelec.filter(function(data){return data.hostname === hostname;});
          path = pathSelec.filter(function(data){return data.hostname === hostname;});
          break;

        //if anything else, no pie element is hovered.
        default:
          hostname = null;
          break;
      }

      //activeHostname records the last element hovered (before this one)

      //if the cursor is hovering between text and path of the same data (or comes and goes on the svg), nothing
      //should be done.
      if(activeHostname === hostname){
        return;
      }

      //From here, the last hovered element and the current have different hostnames (one of them can be null)

      //if the last hovered element wasn't the svg (the "background"), the corresponding path and text should
      //be translated to their initial position.
      if(activeHostname !== null){
        var textOut, pathOut;
        textOut = textSelec.filter(function(data){return data.hostname === activeHostname;});
        pathOut = pathSelec.filter(function(data){return data.hostname === activeHostname;});

        var dOut = textOut.datum();
        var midAngleOut = (dOut.endAngle + dOut.startAngle)/2;

        var transitionOut = pathOut.transition().attr("transform", "translate(0,0)");
        textOut.transition(transitionOut).attr("transform", "translate(" + (Math.sin(midAngleOut)*svg.popup.dist) + "," +(-Math.cos(midAngleOut)*svg.popup.dist) +")");

        trSelec.filter(function(d){return d.hostname === activeHostname}).classed("outlined",false);
      }

      //the activeHostname variable has no further use here, it can be updated with the current hostname.
      activeHostname = hostname;

      //if the current hovered element is the svg, end of the event.
      if(hostname === null){
        return;
      }


      //Finally, the current element hovered and associated path/text can be translated.


      var midAngle = (d.endAngle + d.startAngle)/2;
      var transition = path.transition()
        .attr("transform","translate(" + (Math.sin(midAngle)*svg.popup.distTranslTemp) + "," +(-Math.cos(midAngle)*svg.popup.distTranslTemp) +")" )
        .transition()
        .attr("transform","translate(" + (Math.sin(midAngle)*svg.popup.distTransl) + "," +(-Math.cos(midAngle)*svg.popup.distTransl) +")" );

      text.transition(transition)
        .attr("transform","translate(" + (Math.sin(midAngle)*(svg.popup.distTranslTemp + svg.popup.dist)) + "," +(-Math.cos(midAngle)*(svg.popup.distTranslTemp+svg.popup.dist)) +")" )
        .transition()
        .attr("transform","translate(" + (Math.sin(midAngle)*(svg.popup.distTransl+svg.popup.dist)) + "," +(-Math.cos(midAngle)*(svg.popup.distTransl+svg.popup.dist)) +")" );



      //the corresponding row is outlined
      var elem = trSelec.filter(function(d){return d.hostname === activeHostname;}).classed("outlined",true);

      //no transition if the cursor is on the table
      if(onTable){
        return;
      }

      scrollToElementTableTransition(elem,svg.popup.pieChart.table)

    }


    //display and positioning
    svg.popup.style("display", null);

    positionPopup(svg);

  }); //end json
}
