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

/***********************************************************************************************************/
//remove some ticks to avoid superimposition, for vertical axis

function niceTicks(axis) {
  var selectick = axis.selectAll(".tick");
  var selecsize = selectick.size();

  if(selecsize >1){
    var distTick = Math.abs(selectick._groups[0][0].getAttribute("transform").split(/[,)(]+/)[2]
      - selectick._groups[0][1].getAttribute("transform").split(/[,)(]+/)[2]);
    var fontsize = parseFloat(getComputedStyle(selectick._groups[0][0]).fontSize);
    var nb = Math.ceil(fontsize/distTick);
    if (nb>1){
      for (var i=1; i<selecsize;i++){
        if(i%nb !=0){
          selectick._groups[0][i].remove();
        }
      }
    }

  }
}


/***********************************************************************************************************/

function axisXLegendDouble(svg){
  var dround;

  svg.axisx.selectAll(".tick").select("text").text(function(d){
    dround = Math.round(d);
    if (Math.abs(dround - d) >= 1e-7){
      this.parentNode.remove();
    }else{
      return svg.legend[dround%svg.legend.length].text;
    }
  });

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

function addPopup(selection, div, svg , onCreationFunct, onSupprFunct) {


  svg.side = 0.75 * Math.min(svg.height, svg.width);
  svg.pieside = 1 * svg.side;
  div.overlay = div.append("div").classed("overlay", true).style("display", "none").style("width", (svg.width + svg.margin.left + svg.margin.right) + "px");
  svg.popup = div.append("div").classed("popup", true)
    .style("width", svg.side + "px")
    .style("height", svg.side + "px")
    .style("display", "none")
    .style("left", ((svg.width - svg.side) / 2 + svg.margin.left) + "px")
    .style("top", ((svg.height - svg.side) / 2 + svg.margin.top) + "px");

  svg.popup.pieChart = null;
  svg.timer = null;



  selection
    .on("click", function (d) {

      clearTimeout(svg.timer);
      svg.timer = setTimeout(function () {
        div.overlay.style("display", null);
        onCreationFunct(d);
        svg.popup.pieChart = svg.popup.append("svg").attr("width", svg.pieside).attr("height", svg.pieside).classed("pieSvg", true);
        drawComplData("./datacompl.json", svg.popup, svg.pieside, d.height);
        svg.popup.style("display", null);
      }, 500);

    });

  div.overlay.on("click", function () {
    div.overlay.style("display", "none");
    svg.popup.style("display", "none");
    svg.popup.pieChart.remove();
    svg.popup.pieChart = null;
    onSupprFunct();
  });


}


/***********************************************************************************************************/


function redrawPopup(div, svg){

  div.overlay.style("width",(svg.width+svg.margin.left + svg.margin.right) + "px");
  svg.side = 0.75*Math.min(svg.height,svg.width);
  svg.pieside = 1*svg.side;

  svg.popup.style("width",svg.side + "px")
    .style("height",svg.side + "px")
    .style("left",((svg.width-svg.side)/2 +svg.margin.left)+"px")
    .style("top", ((svg.height-svg.side)/2 +svg.margin.top) + "px");



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


    svg.popup.dist = svg.popup.outerRad * 0.8;
    svg.popup.distTranslTemp = svg.popup.outerRad/4;
    svg.popup.distTransl = svg.popup.outerRad/10;



  }
  
}

/************************************************************************************************************/

function drawComplData(urlJson,popup,pieside,total){

  var chartside = 0.75*pieside;


  //TEMPORAIRE: test, à supprimer lors de l'utilisation avec de véritables valeurs.
  console.log(total);
  total=6000000000;
  //TEMPORAIRE


  //Some values relative to the popup dimensions
  popup.innerRad = 0;
  popup.outerRad = chartside/2;
  popup.dist = popup.outerRad * 0.8;
  popup.distTranslTemp = popup.outerRad/4;
  popup.distTransl = popup.outerRad/10;


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
    var f = colorEval();
    var listColors = [];
    var length = values.length;


    for(var w = 0; w < length; w++){

      listColors.push(f())

    }

    values.push({y: total -sum, hostname:" Remainder ",amount:bytesConvert(total-sum)});

    listColors.push("#f2f2f2");


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
      .innerRadius(popup.innerRad)
      .outerRadius(popup.outerRad);

    //The arc template is readied
    function interpolateArc(d){

      //.toFixed(5) avoid having complete circles at the beginning of the transition,
      //if start and end angles are too close, the precision isn't good enough to order them
      //correctly and d3 can creates a 2PI angle.

      return function(t){
        return (arc
          .innerRadius(popup.innerRad)
          .outerRadius(popup.outerRad)
          .startAngle(d.startAngle)
          .endAngle((d.startAngle + t * (d.endAngle - d.startAngle)).toFixed(5)))();
      }

    }

    //g element parent of path and text components of the pie chart
    popup.pieChart.g = popup.pieChart.append("g")
      .attr("transform","translate(" + (pieside/2) + "," + (pieside/2) + ")")
      .classed("part",true).classed("elemtext",true);

    //path elements, the arcs themselves
    var pathSelec = popup.pieChart.g.selectAll("path").data(values).enter().append("path")
      .attr("d","")
      .style("fill",function(d,i){ return listColors[i]; });
    pathSelec.append("svg:title").text(function(d){
      return  d.hostname + "\n" + d.amount});

    //text elements, the arcs' legends
    var textSelec = popup.pieChart.g.selectAll("text").data(values).enter().append("text")
      .attr("transform",function(d){
        var midAngle = (d.endAngle + d.startAngle)/2;
        return "translate(" + (Math.sin(midAngle)*popup.dist) + "," +(-Math.cos(midAngle)*popup.dist) +")";})
      .text(function(d){ return d.amount;});


    //transition on paths for fanciness
    pathSelec.transition("creation").ease(easeFct(3)).duration(800).attrTween("d",interpolateArc);

    //name of the current element being hovered, at first none then null.
    var activeHostname = null;

    //Hover listener on the pie chart svg.
    popup.pieChart
      .on("mouseover", mouseoverFunction);


    function mouseoverFunction(){

      var target = d3.event.target;
      var path;
      var text;
      var d;

      //hostname of the element being hovered currently
      var hostname;

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

        //if svg, no pie element is hovered.
        case "svg":
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
        textOut.transition(transitionOut).attr("transform", "translate(" + (Math.sin(midAngleOut)*popup.dist) + "," +(-Math.cos(midAngleOut)*popup.dist) +")");
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
        .attr("transform","translate(" + (Math.sin(midAngle)*popup.distTranslTemp) + "," +(-Math.cos(midAngle)*popup.distTranslTemp) +")" )
        .transition()
        .attr("transform","translate(" + (Math.sin(midAngle)*popup.distTransl) + "," +(-Math.cos(midAngle)*popup.distTransl) +")" );

      text.transition(transition)
        .attr("transform","translate(" + (Math.sin(midAngle)*(popup.distTranslTemp + popup.dist)) + "," +(-Math.cos(midAngle)*(popup.distTranslTemp+popup.dist)) +")" )
        .transition()
        .attr("transform","translate(" + (Math.sin(midAngle)*(popup.distTransl+popup.dist)) + "," +(-Math.cos(midAngle)*(popup.distTransl+popup.dist)) +")" );

    }


  }); //end json
}