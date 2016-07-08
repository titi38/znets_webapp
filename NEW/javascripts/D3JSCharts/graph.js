function drawChartFromInterface(urlJson, mydiv) {
    var div = d3.select(mydiv);
    var svg = div.select("svg");
    svg.margin = {top: 50, right: 50, bottom: 50, left: 60, zero:28};


    whichCreationFunction(urlJson)(div,svg,urlJson,mydiv)

}




function drawChart(urlJson, mydiv) {

    var div = d3.select('#' + mydiv);
    var svg = div.select("svg");
    svg.margin = {top: 50, right: 50, bottom: 50, left: 60, zero:28};


    whichCreationFunction(urlJson)(div,svg,urlJson,mydiv);


}

/***********************************************************************************************************/

function whichCreationFunction(urlJson){
var typeGraph = urlJson.split(/[\.\/]+/);
    //For test & real use, can be simplified later
    typeGraph = typeGraph[typeGraph.length - 2];
    console.log(typeGraph);
    switch(typeGraph){
        case "netNbLocalHosts":
            return createCurve;
        case "netTop10appTraffic":
        case "netProtocolesPackets":
        case "netTop10CountryTraffic":
            return createHisto2DStackDouble;
        case "netTop10NbExtHosts":
            return createHisto2DStackSimple;
        //for now
        case "worldmap":
            return createMap;
    }

}

/***********************************************************************************************************/
function noData(div,svg,mydiv){
    console.log("incorrect url/data");

    var divWidth = parseInt(div.style("width"),10),
      divHeight = window.innerHeight;

    svg.attr("width",divWidth).attr("height",divHeight);

    svg.nodata = svg.append("text").attr("transform", "translate(" + (divWidth/2) + "," +
        (divHeight/2 ) + ")")
      .classed("bckgr-txt",true)
      .text("No data")
      .style("fill", "#000");

    d3.select(window).on("resize." + mydiv, function(){
        var divWidth = parseInt(div.style("width"),10),
          divHeight = window.innerHeight;

        svg.attr("width",divWidth).attr("height",divHeight);

        svg.nodata.attr("transform", "translate(" + (divWidth/2) + "," +
          (divHeight/2 ) + ")");

    } );
}
/***********************************************************************************************************/

function createHisto2DStackDouble(div,svg,urlJson,mydiv){

    d3.json(urlJson, function (error, json) {


        console.log(json);

        //test json conformity
        if (typeof json === "undefined" || json.result != "true" || error) {
            noData(div, svg,mydiv);
            return false;
        }

        //json ok, graph creation

        json = json.response.data;
        svg.legend = json[1].legend;
        console.log(json);

        //table for legend
        svg.tableWidth = 200;


        var divWidth = Math.max(1.15 * svg.tableWidth + svg.margin.left + svg.margin.right + 1, parseInt(div.style("width"), 10)),
          divHeight = Math.max(svg.margin.bottom + svg.margin.top + svg.margin.zero + 1, window.innerHeight);

        var divtable = div.append("div").classed("diagram divtable", true);
        divtable.append("h4").classed("tableTitle", true).text("Legend");
        var table = divtable.append("table").classed("diagram font2", true).style("width", svg.tableWidth + "px").style("max-height",
          (divHeight - 2 * parseFloat(getComputedStyle(div.select("h4").node()).fontSize) - 60) + "px");


        div.style("height", divHeight + "px");
        svg.attr("width", divWidth - 1.15 * svg.tableWidth).attr("height", divHeight);


        svg.width = divWidth - 1.15 * svg.tableWidth - svg.margin.left - svg.margin.right;
        svg.height = divHeight - svg.margin.bottom - svg.margin.top;


        svg.x = d3.scaleLinear()
          .range([0, svg.width]);

        svg.yInput = d3.scaleLinear().clamp(true);

        svg.yOutput = d3.scaleLinear().clamp(true);

        svg.svg = svg.append("svg").attr("x", svg.margin.left).attr("y", svg.margin.top).attr("width", svg.width).attr("height", svg.height);


        //Will contain the chart itself, without the axis
        svg.chartBackground = svg.svg.append("g");


        svg.chartInput = svg.svg.append('g');
        svg.chartOutput = svg.svg.append('g');


        //Will contain the axis and the rectselec, for a better display of scaling
        svg.frame = svg.svg.append("g");

        svg.selec = svg.frame.append("rect").attr("class", "rectSelec");


        svg.valuesIn = [];
        svg.valuesOut = [];
        var xlength = json[2].tab.length;

        var colorMap = new Map();
        var sumMap = new Map();
        var i;

        if (typeof json[2].tab[0].item === "undefined") {

            //json[i].tab[j].item = json[i].name
            //Remainder = OTHERS

            for (i = 2; i < json.length; i++) {

                for (var j = 0; j < xlength; j++) {
                    if (json[i].tab[j].y == 0) {
                        continue;
                    }
                    json[i].tab[j].x = j;
                    json[i].tab[j].height = json[i].tab[j].y;
                    json[i].tab[j].item = json[i].name;

                    if (!sumMap.has(json[i].tab[j].item)) {
                        sumMap.set(json[i].tab[j].item, json[i].tab[j].height);
                    } else {
                        sumMap.set(json[i].tab[j].item, sumMap.get(json[i].tab[j].item) + json[i].tab[j].height)
                    }

                    json[i].tab[j].stroke = "#000000";

                    if (i % 2 == 0) {
                        //json[i].tab[j].stroke = "#fff";
                        svg.valuesIn.push(json[i].tab[j]);

                    } else {
                        //json[i].tab[j].stroke="#cccccc";
                        svg.valuesOut.push(json[i].tab[j]);

                    }

                }
            }

        } else {

            for (i = 2; i < json.length; i++) {

                for (var j = 0; j < xlength; j++) {
                    if (json[i].tab[j].y == 0) {
                        continue;
                    }
                    json[i].tab[j].x = j;
                    json[i].tab[j].height = json[i].tab[j].y;

                    if (!sumMap.has(json[i].tab[j].item)) {
                        sumMap.set(json[i].tab[j].item, json[i].tab[j].height);
                    } else {
                        sumMap.set(json[i].tab[j].item, sumMap.get(json[i].tab[j].item) + json[i].tab[j].height)
                    }

                    json[i].tab[j].stroke = "#000000";

                    if (i % 2 == 0) {
                        //json[i].tab[j].stroke = "#fff";
                        svg.valuesIn.push(json[i].tab[j]);

                    } else {
                        //json[i].tab[j].stroke="#cccccc";
                        svg.valuesOut.push(json[i].tab[j]);

                    }

                }
            }
        }


        var sumArray = [];

        var f = colorEval();


        sumMap.forEach(function (value, key) {
            sumArray.push({item: key, sum: value});
        });

        sumArray.sort(function (a, b) {

            if (a.item == " Remainder " || a.item == "OTHERS") {
                return -1;
            }
            if (b.item == " Remainder " || b.item == "OTHERS") {
                return 1;
            }
            return b.sum - a.sum;
        });

        console.log(sumArray);
        //The most importants elements should have distinct colors.
        i = 0;
        if (sumArray[0].item == " Remainder " || sumArray[0].item == "OTHERS") {
            colorMap.set(sumArray[0].item, "#f2f2f2");
            i = 1;
        }

        while (i < sumArray.length) {
            colorMap.set(sumArray[i].item, f());
            i++;
        }


        console.log(colorMap);


        function sortValues(a, b) {

            if (a.x - b.x != 0) {
                return a.x - b.x;
            }
            if (a.item == " Remainder " || a.item == "OTHERS") {
                return -1;
            }
            if (b.item == " Remainder " || b.item == "OTHERS") {
                return 1;
            }
            return b.height - a.height;
        }

        svg.valuesIn.sort(sortValues);
        svg.valuesOut.sort(sortValues);


        //Evaluation of the abscissa domain
        svg.x.domain([-0.625, xlength - 0.375]);

        var totalSumIn = [];
        var totalSumOut = [];

        var x = svg.valuesIn[0].x;
        var sum = 0;
        i = 0;

        while (x < xlength) {

            while (i < svg.valuesIn.length && svg.valuesIn[i].x == x) {
                svg.valuesIn[i].y = sum;
                sum += svg.valuesIn[i].height;
                i++;
            }
            totalSumIn.push(sum);
            sum = 0;
            x++;
        }

        x = svg.valuesOut[0].x;
        i = 0;

        while (x < xlength) {

            while (i < svg.valuesOut.length && svg.valuesOut[i].x == x) {
                sum += svg.valuesOut[i].height;
                svg.valuesOut[i].y = sum;
                i++;
            }
            totalSumOut.push(sum);
            sum = 0;
            x++;
        }


        var totalIn = d3.max(totalSumIn);
        var totalOut = d3.max(totalSumOut);

        svg.heightOutput = (svg.height - svg.margin.zero) * totalOut / (totalIn + totalOut);

        svg.yInput.range([svg.heightOutput + svg.margin.zero, svg.height]);
        svg.yOutput.range([svg.heightOutput, 0]);


        //the *1.1 operation allow a little margin
        svg.yInput.domain([0, totalIn * 1.1]);
        svg.yOutput.domain([0, totalOut * 1.1]);

        //Text background


        svg.rectInput = svg.chartBackground.append("rect").attr("x", 0).attr("y", svg.heightOutput + svg.margin.zero)
          .attr("width", svg.width)
          .attr("height", svg.height - svg.heightOutput - svg.margin.zero)
          .style("fill", "#e6e6e6");


        svg.textOutput = svg.chartBackground.append("text").classed("bckgr-txt", true)
          .style("fill", "#e6e6e6")
          .text("Outgoing");

        svg.textOutput.attr("transform", "translate(" + (svg.width / 2) + "," + (svg.heightOutput / 8 +
          parseFloat(getComputedStyle(svg.textOutput.node()).fontSize)) + ")");


        svg.textInput = svg.chartBackground.append("text").attr("transform", "translate(" + (svg.width / 2) + "," +
            ((svg.height + (svg.heightOutput + svg.margin.zero) / 3) * 0.75) + ")")
          .classed("bckgr-txt", true)
          .text("Ingoing")
          .style("fill", "#fff");


        //Here, the grid, after the rectInput & the text
        svg.grid = svg.chartBackground.append("g").classed("grid", true);



        svg.newX = d3.scaleLinear().range(svg.x.range()).domain(svg.x.domain());
        svg.newYOutput = d3.scaleLinear().range(svg.yOutput.range()).domain(svg.yOutput.domain());
        svg.newYInput = d3.scaleLinear().range(svg.yInput.range()).domain(svg.yInput.domain());

        var selectionIn = svg.chartInput.selectAll(".data")
          .data(svg.valuesIn)
          .enter().append("rect")
          .classed("data", true)
          .attr("fill", function (d) {
              return colorMap.get(d.item);
          })
          .attr("stroke", function (d) {
              return d.stroke;
          });

        var selectionOut = svg.chartOutput.selectAll(".data")
          .data(svg.valuesOut)
          .enter().append("rect")
          .classed("data", true)
          .attr("fill", function (d) {
              return colorMap.get(d.item);
          })
          .attr("stroke", function (d) {
              return d.stroke;
          });


        drawChartDouble(svg,svg.yOutput.range()[0],svg.yInput.range()[0]);

        var selection = svg.selectAll(".data");


        selection.append("svg:title")
          .text(function (d) {
              return d.item + "\n" + svg.legend[d.x % svg.legend.length].text + ", " + d.height + " " + json[0].unit;
          });


        function blink() {

            this.parentNode.appendChild(this);
            var rect = d3.select(this);

            var col1 = colorMap.get(rect.datum().item), col2 = "#ffffff", col3 = "#ff0000", col4 = rect.datum().stroke;
            rect.attr("stroke", col3).attr("fill", col2);
            (function doitagain() {
                rect.transition().duration(1000)
                  .attr("stroke", col4).attr("fill", col1)
                  .transition().duration(1000)
                  .attr("stroke", col3).attr("fill", col2)
                  .on("end", doitagain);
            })()
        }

        svg.activeItem = null;

        function activationElems(d) {

            if (svg.popup.pieChart !== null) {
                return;
            }

            svg.activeItem = d.item;

            function testitem(data) {
                return d.item == data.item;

            }

            trSelec.filter(testitem).classed("outlined", true);

            selection.filter(testitem).each(blink);

        }

        function activationElemsAutoScroll(d) {


            if (svg.popup.pieChart !== null) {
                return;
            }
            svg.activeItem = d.item;


            function testitem(data) {
                return d.item == data.item;

            }

            var elem = trSelec.filter(testitem).classed("outlined", true);
            var tableViewHeight = table.property("clientHeight");
            //var tableScrollHeight = table.property("scrollHeight"); //not used anymore
            var tableScrollTop = table.property("scrollTop");
            var elemOffsetHeight = elem.property("offsetHeight");
            var elemOffsetTop = elem.property("offsetTop");
            var scrollEnd = (elemOffsetTop <= tableScrollTop) ? elemOffsetTop : Math.max(elemOffsetTop - tableViewHeight + elemOffsetHeight + 1, tableScrollTop);

            console.log("elemoffsettop " + elemOffsetTop);


            table.transition().ease(easeFct(3)).tween("scrolltoptween", function () {
                var tab = this;
                return function (t) {
                    tab.scrollTop = tableScrollTop * (1 - t) + t * scrollEnd;
                };
            });

            selection.filter(testitem).each(blink);

        }

        function activationElemsAutoScrollPopup(d) {

            desactivationElems();
            svg.activeItem = d.item;


            function testitem(data) {
                return d.item == data.item;

            }

            var elem = trSelec.filter(testitem).classed("outlined", true);
            var tableViewHeight = table.property("clientHeight");
            //var tableScrollHeight = table.property("scrollHeight"); //not used anymore
            var tableScrollTop = table.property("scrollTop");
            var elemOffsetHeight = elem.property("offsetHeight");
            var elemOffsetTop = elem.property("offsetTop");
            var scrollEnd = (elemOffsetTop <= tableScrollTop) ? elemOffsetTop : Math.max(elemOffsetTop - tableViewHeight + elemOffsetHeight + 1, tableScrollTop);

            console.log("elemoffsettop " + elemOffsetTop);


            table.transition().ease(easeFct(3)).tween("scrolltoptween", function () {
                var tab = this;
                return function (t) {
                    tab.scrollTop = tableScrollTop * (1 - t) + t * scrollEnd;
                };
            });

        }

        function desactivationElems() {

            if (svg.activeItem == null || svg.popup.pieChart !== null) {
                return;
            }


            function testitem(data) {
                return data.item == svg.activeItem;
            }

            trSelec.filter(testitem).classed("outlined", false);

            selection.filter(testitem).transition().duration(0).attr("stroke", function (d) {
                return d.stroke;
            }).attr("fill", colorMap.get(svg.activeItem));

            svg.activeItem = null;

        }

        selection.on("mouseover", activationElemsAutoScroll).on("mouseout", desactivationElems);


        svg.axisx = svg.append("g")
          .attr("class", "axis")
          .attr('transform', 'translate(' + [svg.margin.left, svg.heightOutput + svg.margin.top] + ")");

        svg.axisx.rect = svg.axisx.append("rect").classed("rectAxis", true).attr("height", svg.margin.zero - 1 ).attr("y",0.5);
        svg.axisx.path = svg.axisx.append("path");
        svg.axisx.call(d3.axisBottom(svg.x));
        svg.heightTick = svg.axisx.select(".tick").select("line").attr("y2");

        axisXDoubleDraw(svg);

        ticksSecondAxisXDouble(svg);

        axisXLegendDouble(svg);


        svg.axisyInput = svg.append("g").attr('transform', 'translate(' + [svg.margin.left, svg.margin.top - 1] + ')')
          .attr("class", "axis");
        svg.axisyInput.call(d3.axisLeft(svg.yInput));

        niceTicks(svg.axisyInput);

        svg.axisyOutput = svg.append("g").attr('transform', 'translate(' + [svg.margin.left, svg.margin.top] + ')')
          .attr("class", "axis");
        svg.axisyOutput.call(d3.axisLeft(svg.yOutput));

        niceTicks(svg.axisyOutput);

        gridDoubleGraph(svg);

        //Label of the y axis
        svg.ylabel = svg.axisyInput.append("text")
          .attr("class", "label")
          .attr("text-anchor", "middle")
          .attr("dy", "1em")
          .attr('y', -svg.margin.left)
          .attr("x", -svg.height / 2)
          .attr("transform", "rotate(-90)")
          .text(json[0].unit);

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
                  desactivationElems();
                  activationElemsAutoScrollPopup(d);
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
            desactivationElems();
        });

        //Legend creation

        var trSelec;

        trSelec = table.selectAll("tr").data(sumArray).enter().append("tr").attr("title", function (d) {
            return d.item + "\n" + "Overall volume: " + Math.round(d.sum * 100) / 100 + " " + json[0].unit;
        });
        trSelec.append("td").classed("color", true).append("div").classed("lgd", true).style("background-color", function (d) {
            return colorMap.get(d.item);
        });
        trSelec.append("td").classed("item", true).text(function (d) {
            return d.item;
        });
        trSelec.on("mouseover", activationElems).on("mouseout", desactivationElems);


        //zoom



        addZoomDouble(svg, updateHisto1DStackDouble);
        d3.select(window).on("resize." + mydiv, function () {
            console.log("resize");
            redrawHisto2DStackDouble(div, svg);
        });

        hideShowValuesDouble(svg, trSelec, selectionIn, selectionOut, xlength)

    });


}




/***********************************************************************************************************/

function createHisto2DStackSimple(div,svg,urlJson,mydiv){

    d3.json(urlJson, function (error, json) {


        console.log(json);

        //test json conformity
        if (typeof json === "undefined" || json.result != "true" || error) {
            console.log("incorrect url/data");
            noData(div, svg,mydiv);
            return false;
        }

        //json ok, graph creation

        json = json.response.data;
        svg.legend = json[1].legend;
        console.log(json);

        //table for legend
        svg.tableWidth = 200;


        var divWidth = Math.max(1.15 * svg.tableWidth + svg.margin.left + svg.margin.right + 1, parseInt(div.style("width"), 10)),
          divHeight = Math.max(svg.margin.bottom + svg.margin.top + svg.margin.zero + 1, window.innerHeight);

        var divtable = div.append("div").classed("diagram divtable", true);
        divtable.append("h4").classed("tableTitle", true).text("Legend");
        var table = divtable.append("table").classed("diagram font2", true).style("width", svg.tableWidth + "px").style("max-height",
          (divHeight - 2 * parseFloat(getComputedStyle(div.select("h4").node()).fontSize) - 60) + "px");


        div.style("height", divHeight + "px");
        svg.attr("width", divWidth - 1.15 * svg.tableWidth).attr("height", divHeight);


        svg.width = divWidth - 1.15 * svg.tableWidth - svg.margin.left - svg.margin.right;
        svg.height = divHeight - svg.margin.bottom - svg.margin.top;


        svg.x = d3.scaleLinear()
          .range([0, svg.width]);

        svg.y = d3.scaleLinear().clamp(true);

        svg.svg = svg.append("svg").attr("x", svg.margin.left).attr("y", svg.margin.top).attr("width", svg.width).attr("height", svg.height);

        svg.grid = svg.svg.append("g").classed("grid", true);

        //Will contain the chart itself, without the axis
        svg.chart = svg.svg.append("g");


        //Will contain the axis and the rectselec, for a better display of scaling
        svg.frame = svg.svg.append("g");

        svg.selec = svg.frame.append("rect").attr("class", "rectSelec");


        svg.values = [];
        var xlength = json[2].tab.length;

        var colorMap = new Map();
        var sumMap = new Map();
        var i;

        if (typeof json[2].tab[0].item === "undefined") {

            //json[i].tab[j].item = json[i].name
            //Remainder = OTHERS

            for (i = 2; i < json.length; i++) {

                for (var j = 0; j < xlength; j++) {
                    if (json[i].tab[j].y == 0) {
                        continue;
                    }
                    json[i].tab[j].x = j;
                    json[i].tab[j].height = json[i].tab[j].y;
                    json[i].tab[j].item = json[i].name;

                    if (!sumMap.has(json[i].tab[j].item)) {
                        sumMap.set(json[i].tab[j].item, json[i].tab[j].height);
                    } else {
                        sumMap.set(json[i].tab[j].item, sumMap.get(json[i].tab[j].item) + json[i].tab[j].height)
                    }

                    json[i].tab[j].stroke = "#000000";

                    svg.values.push(json[i].tab[j]);

                }
            }

        } else {

            for (i = 2; i < json.length; i++) {

                for (var j = 0; j < xlength; j++) {
                    if (json[i].tab[j].y == 0) {
                        continue;
                    }
                    json[i].tab[j].x = j;
                    json[i].tab[j].height = json[i].tab[j].y;

                    if (!sumMap.has(json[i].tab[j].item)) {
                        sumMap.set(json[i].tab[j].item, json[i].tab[j].height);
                    } else {
                        sumMap.set(json[i].tab[j].item, sumMap.get(json[i].tab[j].item) + json[i].tab[j].height)
                    }

                    json[i].tab[j].stroke = "#000000";


                    svg.values.push(json[i].tab[j]);

                }
            }
        }


        var sumArray = [];

        var f = colorEval();


        sumMap.forEach(function (value, key) {
            sumArray.push({item: key, sum: value});
        });

        sumArray.sort(function (a, b) {

            if (a.item == " Remainder " || a.item == "OTHERS") {
                return -1;
            }
            if (b.item == " Remainder " || b.item == "OTHERS") {
                return 1;
            }
            return b.sum - a.sum;
        });

        console.log(sumArray);
        //The most importants elements should have distinct colors.
        i = 0;
        if (sumArray[0].item == " Remainder " || sumArray[0].item == "OTHERS") {
            colorMap.set(sumArray[0].item, "#f2f2f2");
            i = 1;
        }

        while (i < sumArray.length) {
            colorMap.set(sumArray[i].item, f());
            i++;
        }

        console.log(colorMap);


        function sortValues(a, b) {

            if (a.x - b.x != 0) {
                return a.x - b.x;
            }
            if (a.item == " Remainder " || a.item == "OTHERS") {
                return -1;
            }
            if (b.item == " Remainder " || b.item == "OTHERS") {
                return 1;
            }
            return b.height - a.height;
        }

        svg.values.sort(sortValues);


        //Evaluation of the abscissa domain
        svg.x.domain([-0.625, xlength - 0.375]);

        var totalSum = [];

        var x = svg.values[0].x;
        var sum;
        i = 0;

        while (x < xlength) {
            sum = 0;
            while (i < svg.values.length && svg.values[i].x == x) {
                sum += svg.values[i].height;
                svg.values[i].y = sum;
                i++;
            }
            totalSum.push(sum);
            x++;
        }


        var total = d3.max(totalSum);

        svg.y.range([svg.height, 0]);


        //the *1.05 operation allow a little margin
        svg.y.domain([0, total * 1.05]);


        var dataWidth = 0.75 * (svg.x(svg.x.domain()[0] + 1) - svg.x.range()[0]);

        var selection = svg.chart.selectAll(".data")
          .data(svg.values)
          .enter().append("rect")
          .classed("data", true)
          .attr("x", function (d) {
              return svg.x(d.x - 0.375);
          })
          .attr("y", function (d) {
              return svg.y(d.y);
          })
          .attr("height", function (d) {
              return svg.y.range()[0] - svg.y(d.height);
          })
          .attr("width", dataWidth)
          .attr("fill", function (d) {
              return colorMap.get(d.item);
          })
          .attr("stroke", function (d) {
              return d.stroke
          });


        selection.append("svg:title")
          .text(function (d) {
              return d.item + "\n" + svg.legend[d.x % svg.legend.length].text + ", " + d.height + " " + json[0].unit;
          });


        function blink() {

            this.parentNode.appendChild(this);
            var rect = d3.select(this);

            var col1 = colorMap.get(rect.datum().item), col2 = "#ffffff", col3 = "#ff0000", col4 = rect.datum().stroke;
            rect.attr("stroke", col3).attr("fill", col2);
            (function doitagain() {
                rect.transition().duration(1000)
                  .attr("stroke", col4).attr("fill", col1)
                  .transition().duration(1000)
                  .attr("stroke", col3).attr("fill", col2)
                  .on("end", doitagain);
            })()
        }

        svg.activeItem = null;

        function activationElems(d) {

            if (svg.popup.pieChart !== null) {
                return;
            }

            svg.activeItem = d.item;

            function testitem(data) {
                return d.item == data.item;

            }

            trSelec.filter(testitem).classed("outlined", true);

            selection.filter(testitem).each(blink);

        }

        function activationElemsAutoScroll(d) {

            if (svg.popup.pieChart !== null) {
                return;
            }
            svg.activeItem = d.item;


            function testitem(data) {
                return d.item == data.item;

            }

            var elem = trSelec.filter(testitem).classed("outlined", true);
            var tableViewHeight = table.property("clientHeight");
            //var tableScrollHeight = table.property("scrollHeight"); //not used anymore
            var tableScrollTop = table.property("scrollTop");
            var elemOffsetHeight = elem.property("offsetHeight");
            var elemOffsetTop = elem.property("offsetTop");
            var scrollEnd = (elemOffsetTop <= tableScrollTop) ? elemOffsetTop : Math.max(elemOffsetTop - tableViewHeight + elemOffsetHeight + 1, tableScrollTop);

            console.log("elemoffsettop " + elemOffsetTop);


            table.transition().ease(easeFct(3)).tween("scrolltoptween", function () {
                var tab = this;
                return function (t) {
                    tab.scrollTop = tableScrollTop * (1 - t) + t * scrollEnd;
                };
            });

            selection.filter(testitem).each(blink);

        }

        function activationElemsAutoScrollPopup(d) {

            desactivationElems();
            svg.activeItem = d.item;


            function testitem(data) {
                return d.item == data.item;

            }

            var elem = trSelec.filter(testitem).classed("outlined", true);
            var tableViewHeight = table.property("clientHeight");
            //var tableScrollHeight = table.property("scrollHeight"); //not used anymore
            var tableScrollTop = table.property("scrollTop");
            var elemOffsetHeight = elem.property("offsetHeight");
            var elemOffsetTop = elem.property("offsetTop");
            var scrollEnd = (elemOffsetTop <= tableScrollTop) ? elemOffsetTop : Math.max(elemOffsetTop - tableViewHeight + elemOffsetHeight + 1, tableScrollTop);

            console.log("elemoffsettop " + elemOffsetTop);


            table.transition().ease(easeFct(3)).tween("scrolltoptween", function () {
                var tab = this;
                return function (t) {
                    tab.scrollTop = tableScrollTop * (1 - t) + t * scrollEnd;
                };
            });

        }

        function desactivationElems() {

            if (svg.activeItem == null || svg.popup.pieChart !== null) {
                return;
            }


            function testitem(data) {
                return data.item == svg.activeItem;
            }

            trSelec.filter(testitem).classed("outlined", false);

            selection.filter(testitem).transition().duration(0).attr("stroke", function (d) {
                return d.stroke;
            }).attr("fill", colorMap.get(svg.activeItem));

            svg.activeItem = null;

        }

        selection.on("mouseover", activationElemsAutoScroll).on("mouseout", desactivationElems);


        svg.axisx = svg.append("g")
          .attr("class", "axis")
          .attr('transform', 'translate(' + [svg.margin.left, svg.height + svg.margin.top] + ")");

        svg.axisx.call(d3.axisBottom(svg.x));

        svg.axisx.selectAll(".tick").select("text").text(function (d) {
            if (Math.floor(d) != d) {
                this.parentNode.remove();
            } else {
                return svg.legend[d % svg.legend.length].text;
            }
        });

        svg.axisy = svg.append("g").attr('transform', 'translate(' + [svg.margin.left, svg.margin.top] + ')')
          .attr("class", "axis");
        svg.axisy.call(d3.axisLeft(svg.y));

        niceTicks(svg.axisy);

        gridSimpleGraph(svg);


        //      Label of the y axis
        svg.ylabel = svg.axisy.append("text")
          .attr("class", "label")
          .attr("text-anchor", "middle")
          .attr("dy", "1em")
          .attr('y', -svg.margin.left)
          .attr("x", -svg.height / 2)
          .attr("transform", "rotate(-90)")
          .text(json[0].unit);

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
                  desactivationElems();
                  activationElemsAutoScrollPopup(d);
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
            desactivationElems();
        });

        //Legend creation

        var trSelec;

        trSelec = table.selectAll("tr").data(sumArray).enter().append("tr").attr("title", function (d) {
            return d.item + "\n" + "Overall volume: " + Math.round(d.sum * 100) / 100 + " " + json[0].unit;
        });
        trSelec.append("td").classed("color", true).append("div").classed("lgd", true).style("background-color", function (d) {
            return colorMap.get(d.item);
        });
        trSelec.append("td").classed("item", true).text(function (d) {
            return d.item;
        });
        trSelec.on("mouseover", activationElems).on("mouseout", desactivationElems);


        //zoom


        svg.newX = d3.scaleLinear().range(svg.x.range()).domain(svg.x.domain());
        svg.newY = d3.scaleLinear().range(svg.y.range()).domain(svg.y.domain());


        addZoomSimple(svg, updateHisto1DStackSimple);

        d3.select(window).on("resize." + mydiv, function () {
            console.log("resize");
            redrawHisto2DStackSimple(div, svg);
        });

        hideShowValuesSimple(svg, trSelec, selection, xlength);

    });





}

/***********************************************************************************************************/

function hideShowValuesSimple(svg,trSelec,selection,xlength){
    var duration = 800;

    var trSelecSize = trSelec.size();

    var hiddenValues = [];
    var newValues = JSON.parse(JSON.stringify(svg.values));
    var valuesTrans = JSON.parse(JSON.stringify(svg.values));
    selection.data(valuesTrans);

    console.log(newValues);


    trSelec.on("click",function(d){

        var clickedRow = d3.select(this);
        svg.transition("hideshow").duration(duration).tween("",function(){

            var totalSum = [];

            var x = svg.values[0].x;
            var sum;
            var i=0;

            if(svg.popup.pieChart !==null){
                return;
            }

            var index = hiddenValues.indexOf(d.item);

            if( index === -1){
                //Hide the data
                hiddenValues.push(d.item);
                clickedRow.classed("hidden",true);




                while(x < xlength){
                    sum=0;
                    while(i <  newValues.length && newValues[i].x == x){
                        if(newValues[i].item === d.item){
                            newValues[i].height = 0;
                        }
                        sum += newValues[i].height;
                        newValues[i].y = sum;
                        i++;
                    }
                    totalSum.push(sum);
                    x++;
                }


            }else{
                //Show the data
                hiddenValues.splice(index,1);
                clickedRow.classed("hidden",false);


                while(x < xlength){
                    sum=0;
                    while(i <  newValues.length && newValues[i].x == x){
                        if(newValues[i].item === d.item){
                            newValues[i].height = svg.values[i].height;
                        }
                        sum += newValues[i].height;
                        newValues[i].y = sum;
                        i++;
                    }
                    totalSum.push(sum);
                    x++;
                }


            }

            var valuesStart = JSON.parse(JSON.stringify(valuesTrans));
            var newTotal;
            if(hiddenValues.length === trSelecSize){
                newTotal=1;
            }else {
                newTotal = d3.max(totalSum);
            }
            var oldTotal = svg.y.domain()[1]/1.05;

            var t0,totalTrans;

            return function(t){
                t0 = (1-t);
                valuesTrans.forEach(function(elem,i){
                    elem.y = t0*valuesStart[i].y + t*newValues[i].y;
                    elem.height = t0*valuesStart[i].height + t*newValues[i].height;
                });

                totalTrans = oldTotal* t0 + newTotal*t;
                var actTranslate1 = -svg.transform.y/(svg.scaley*svg.transform.k);
                svg.y.domain([0,totalTrans*1.05]);
                svg.newY.domain([svg.y.invert(actTranslate1 + svg.height/(svg.transform.k*svg.scaley)), svg.y.invert(actTranslate1)]);
                updateHisto1DStackSimple(svg);

            }
        });

    });

    trSelec.on("contextmenu",function(d) {

        d3.event.preventDefault();
        var clickedRow = d3.select(this);

        svg.transition("hideshow").duration(duration).tween("",function(){


            var totalSum = [];

            var x = svg.values[0].x;
            var sum;
            var i=0;

            if(svg.popup.pieChart !==null){
                return;
            }

            var index = hiddenValues.indexOf(d.item);


            if((index !== -1) || (trSelecSize - 1 !== hiddenValues.length )){
                //Hide all data except this one
                hiddenValues = trSelec.data().map(function(elem){return elem.item;});
                hiddenValues.splice(hiddenValues.indexOf(d.item),1);

                trSelec.classed("hidden",true);
                clickedRow.classed("hidden",false);

                while(x < xlength){
                    sum=0;
                    while(i <  newValues.length && newValues[i].x == x){
                        if(newValues[i].item !== d.item){
                            newValues[i].height = 0;
                        }else{
                            newValues[i].height = svg.values[i].height;
                        }
                        sum += newValues[i].height;
                        newValues[i].y = sum;
                        i++;
                    }
                    totalSum.push(sum);
                    x++;
                }

            }else{
                //index === -1 && hiddenValues.length == trSelec.size() -1
                // ->show all data.
                hiddenValues = [];
                trSelec.classed("hidden",false);

                while(x < xlength){
                    sum=0;
                    while(i <  newValues.length && newValues[i].x == x){
                        newValues[i].height = svg.values[i].height;
                        sum += newValues[i].height;
                        newValues[i].y = sum;
                        i++;
                    }
                    totalSum.push(sum);
                    x++;
                }

            }


            var valuesStart = JSON.parse(JSON.stringify(valuesTrans));
            var newTotal = Math.max(0.000000001,d3.max(totalSum));

            var oldTotal = svg.y.domain()[1]/1.05;

            var t0,totalTrans;

            return function(t){

                t=Math.min(1,Math.max(0,t));
                t0 = (1-t);

                valuesTrans.forEach(function(elem,i){
                    elem.y = t0*valuesStart[i].y + t*newValues[i].y;
                    elem.height = t0*valuesStart[i].height + t*newValues[i].height;
                });

                totalTrans = oldTotal* t0 + newTotal*t;
                var actTranslate1 = -svg.transform.y/(svg.scaley*svg.transform.k);
                svg.y.domain([0,totalTrans*1.05]);
                svg.newY.domain([svg.y.invert(actTranslate1 + svg.height/(svg.transform.k*svg.scaley)), svg.y.invert(actTranslate1) ]);
                updateHisto1DStackSimple(svg);

            }
        });

    });

}



/***********************************************************************************************************/

function hideShowValuesDouble(svg,trSelec,selectionIn,selectionOut,xlength){
    var duration = 800;
    var trSelecSize = trSelec.size();
    var hiddenValues = [];
    var newValuesIn = JSON.parse(JSON.stringify(svg.valuesIn));
    var newValuesOut = JSON.parse(JSON.stringify(svg.valuesOut));
    var valuesInTrans = JSON.parse(JSON.stringify(svg.valuesIn));
    var valuesOutTrans = JSON.parse(JSON.stringify(svg.valuesOut));
    selectionIn.data(valuesInTrans);
    selectionOut.data(valuesOutTrans);

    trSelec.on("click",function(d){
        var totalSumIn = [];
        var totalSumOut = [];
        var clickedRow = d3.select(this);


        svg.transition("hideshow").duration(duration).tween("",function(){

            var x;
            var sum;
            var i;

            if(svg.popup.pieChart !==null){
                return;
            }

            var index = hiddenValues.indexOf(d.item);

            if( index === -1){
                //Hide the data
                hiddenValues.push(d.item);
                clickedRow.classed("hidden",true);



                x=svg.valuesIn[0].x;
                i=0;

                while(x < xlength){
                    sum=0;
                    while(i <  newValuesIn.length && newValuesIn[i].x == x){
                        if(newValuesIn[i].item === d.item){
                            newValuesIn[i].height = 0;
                        }
                        newValuesIn[i].y = sum;
                        sum += newValuesIn[i].height;
                        i++;
                    }
                    totalSumIn.push(sum);
                    x++;
                }

                x = svg.valuesOut[0].x;
                i=0;

                while(x < xlength){
                    sum=0;

                    while(i <  newValuesOut.length && newValuesOut[i].x == x){
                        if(newValuesOut[i].item === d.item){
                            newValuesOut[i].height = 0;
                        }
                        sum += newValuesOut[i].height;
                        newValuesOut[i].y = sum;
                        i++;
                    }
                    totalSumOut.push(sum);
                    x++;
                }


            }else{
                //Show the data
                hiddenValues.splice(index,1);
                clickedRow.classed("hidden",false);


                x=svg.valuesIn[0].x;
                i=0;

                while(x < xlength){
                    sum=0;
                    while(i <  newValuesIn.length && newValuesIn[i].x == x){
                        if(newValuesIn[i].item === d.item){
                            newValuesIn[i].height = svg.valuesIn[i].height;
                        }
                        newValuesIn[i].y = sum;
                        sum += newValuesIn[i].height;
                        i++;
                    }
                    totalSumIn.push(sum);
                    x++;
                }

                x = svg.valuesOut[0].x;
                i=0;

                while(x < xlength){
                    sum=0;

                    while(i <  newValuesOut.length && newValuesOut[i].x == x){
                        if(newValuesOut[i].item === d.item){
                            newValuesOut[i].height = svg.valuesOut[i].height;
                        }
                        sum += newValuesOut[i].height;
                        newValuesOut[i].y = sum;
                        i++;
                    }
                    totalSumOut.push(sum);
                    x++;
                }


            }



            var newTotalIn;
            var newTotalOut;

            if(hiddenValues.length === trSelecSize){
                newTotalIn=1;
                newTotalOut=1;
            }else{
                newTotalIn=d3.max(totalSumIn);
                newTotalOut=d3.max(totalSumOut);
            }

            var oldTotalIn = svg.yInput.domain()[1]/1.1;
            var oldTotalOut = svg.yOutput.domain()[1]/1.1;

            var valuesInStart = JSON.parse(JSON.stringify(valuesInTrans));
            var valuesOutStart = JSON.parse(JSON.stringify(valuesOutTrans));


            var t0,totalInTrans, totalOutTrans;

            return function(t){

                t=Math.min(1,Math.max(0,t));
                t0 = (1-t);

                valuesInTrans.forEach(function(elem,i){
                    elem.y = t0*valuesInStart[i].y + t*newValuesIn[i].y;
                    elem.height = t0*valuesInStart[i].height + t*newValuesIn[i].height;
                });

                valuesOutTrans.forEach(function(elem,i){
                    elem.y = t0*valuesOutStart[i].y + t*newValuesOut[i].y;
                    elem.height = t0*valuesOutStart[i].height + t*newValuesOut[i].height;
                });


                totalInTrans = oldTotalIn* t0 + newTotalIn*t;
                totalOutTrans = oldTotalOut*t0 + newTotalOut*t;
                var actTranslate1 = -svg.transform.y/(svg.scaley*svg.transform.k);
                svg.heightOutput = (svg.height - svg.margin.zero)*totalOutTrans/(totalInTrans+totalOutTrans);
                svg.yInput.range([svg.heightOutput+svg.margin.zero,svg.height]);
                svg.yOutput.range([svg.heightOutput,0]);
                svg.yInput.domain([0,totalInTrans*1.1]);
                svg.yOutput.domain([0,totalOutTrans*1.1]);
                svg.newYOutput.range([Math.min(svg.height,Math.max(0,svg.heightOutput*svg.transform.k*svg.scaley+svg.transform.y)),0]);
                svg.newYInput.range([Math.min(svg.height,Math.max(0,svg.heightOutput*svg.transform.k*svg.scaley+svg.transform.y + svg.margin.zero)),svg.height]);
                svg.newYOutput.domain([svg.yOutput.invert(svg.height/(svg.transform.k*svg.scaley) + actTranslate1),
                    svg.yOutput.invert(actTranslate1)]);

                svg.newYInput.domain([svg.yInput.invert(actTranslate1  + (1-1/(svg.transform.k*svg.scaley))*svg.margin.zero),
                    svg.yInput.invert(actTranslate1 + (1-1/(svg.transform.k*svg.scaley))*svg.margin.zero + svg.height/(svg.transform.k*svg.scaley))]);


                updateHisto1DStackDouble(svg);

            }



        });


    });

    trSelec.on("contextmenu",function(d) {

        d3.event.preventDefault();

        var totalSumIn = [];
        var totalSumOut = [];
        var clickedRow = d3.select(this);

        svg.transition("hideshow").duration(duration).tween("",function(){


            var x;
            var sum;
            var i;

            if (svg.popup.pieChart !== null) {
                return;
            }

            var index = hiddenValues.indexOf(d.item);


            if ((index !== -1) || (trSelecSize - 1 !== hiddenValues.length )) {

                //Hide all data except this one
                hiddenValues = trSelec.data().map(function (elem) {
                    return elem.item;
                });
                hiddenValues.splice(hiddenValues.indexOf(d.item), 1);

                trSelec.classed("hidden", true);
                clickedRow.classed("hidden", false);



                x=svg.valuesIn[0].x;
                i=0;

                while(x < xlength){
                    sum=0;
                    while(i <  newValuesIn.length && newValuesIn[i].x == x){
                        if(newValuesIn[i].item !== d.item){
                            newValuesIn[i].height = 0;
                        }else{
                            newValuesIn[i].height = svg.valuesIn[i].height;
                        }
                        newValuesIn[i].y = sum;
                        sum += newValuesIn[i].height;
                        i++;
                    }
                    totalSumIn.push(sum);
                    x++;
                }

                x = svg.valuesOut[0].x;
                i=0;

                while(x < xlength){
                    sum=0;

                    while(i <  newValuesOut.length && newValuesOut[i].x == x){
                        if(newValuesOut[i].item !== d.item){
                            newValuesOut[i].height = 0;
                        }else{
                            newValuesOut[i].height = svg.valuesOut[i].height;
                        }

                        sum += newValuesOut[i].height;
                        newValuesOut[i].y = sum;
                        i++;
                    }
                    totalSumOut.push(sum);
                    x++;
                }


            } else {
                //index === -1 && hiddenValues.length == trSelec.size() -1
                // ->show all data.
                hiddenValues = [];
                trSelec.classed("hidden", false);

                x=svg.valuesIn[0].x;
                i=0;

                while(x < xlength){
                    sum=0;
                    while(i <  newValuesIn.length && newValuesIn[i].x == x){
                        newValuesIn[i].height = svg.valuesIn[i].height;
                        newValuesIn[i].y = sum;
                        sum += newValuesIn[i].height;
                        i++;
                    }
                    totalSumIn.push(sum);
                    x++;
                }

                x = svg.valuesOut[0].x;
                i=0;

                while(x < xlength){
                    sum=0;

                    while(i <  newValuesOut.length && newValuesOut[i].x == x){

                        newValuesOut[i].height = svg.valuesOut[i].height;
                        sum += newValuesOut[i].height;
                        newValuesOut[i].y = sum;
                        i++;
                    }
                    totalSumOut.push(sum);
                    x++;
                }


            }



            var newTotalIn = Math.max(0.000000001,d3.max(totalSumIn));
            var newTotalOut = Math.max(0.000000001,d3.max(totalSumOut));

            var oldTotalIn = svg.yInput.domain()[1]/1.1;
            var oldTotalOut = svg.yOutput.domain()[1]/1.1;

            var valuesInStart = JSON.parse(JSON.stringify(valuesInTrans));
            var valuesOutStart = JSON.parse(JSON.stringify(valuesOutTrans));

            var t0,totalInTrans, totalOutTrans;

            return function(t){

                t=Math.min(1,Math.max(0,t));
                t0 = (1-t);

                valuesInTrans.forEach(function(elem,i){
                    elem.y = t0*valuesInStart[i].y + t*newValuesIn[i].y;
                    elem.height = t0*valuesInStart[i].height + t*newValuesIn[i].height;
                });

                valuesOutTrans.forEach(function(elem,i){
                    elem.y = t0*valuesOutStart[i].y + t*newValuesOut[i].y;
                    elem.height = t0*valuesOutStart[i].height + t*newValuesOut[i].height;
                });


                totalInTrans = oldTotalIn* t0 + newTotalIn*t;
                totalOutTrans = oldTotalOut*t0 + newTotalOut*t;
                var actTranslate1 = -svg.transform.y/(svg.scaley*svg.transform.k);
                svg.heightOutput = (svg.height - svg.margin.zero)*totalOutTrans/(totalInTrans+totalOutTrans);
                svg.yInput.range([svg.heightOutput+svg.margin.zero,svg.height]);
                svg.yOutput.range([svg.heightOutput,0]);
                svg.yInput.domain([0,totalInTrans*1.1]);
                svg.yOutput.domain([0,totalOutTrans*1.1]);
                svg.newYOutput.range([Math.min(svg.height,Math.max(0,svg.heightOutput*svg.transform.k*svg.scaley+svg.transform.y)),0]);
                svg.newYInput.range([Math.min(svg.height,Math.max(0,svg.heightOutput*svg.transform.k*svg.scaley+svg.transform.y + svg.margin.zero)),svg.height]);
                svg.newYOutput.domain([svg.yOutput.invert(svg.height/(svg.transform.k*svg.scaley) + actTranslate1),
                    svg.yOutput.invert(actTranslate1)]);

                svg.newYInput.domain([svg.yInput.invert(actTranslate1  + (1-1/(svg.transform.k*svg.scaley))*svg.margin.zero),
                    svg.yInput.invert(actTranslate1 + (1-1/(svg.transform.k*svg.scaley))*svg.margin.zero + svg.height/(svg.transform.k*svg.scaley))]);


                updateHisto1DStackDouble(svg);

            }



        });






    });


}




/***********************************************************************************************************/



function updateHisto1DStackSimple(svg){

    /*
     svg.chartOutput.attr("transform","matrix(" + (svg.scalex*svg.scale) + ", 0, 0, " + (svg.scaley*svg.scale) + ", " + svg.translate[0] + "," + svg.translate[1] + ")" );

     svg.chartInput.attr("transform","matrix(" + (svg.scalex*svg.scale) + ", 0, 0, " + (svg.scaley*svg.scale) + ", " + svg.translate[0] + "," + (svg.translate[1] - (svg.scaley*svg.scale-1)*svg.margin.zero) + ")" );
     */


    var newydom0 = svg.newY(svg.y.domain()[0]);
    var dataWidth = 0.75*(svg.newX(svg.newX.domain()[0] + 1) - svg.newX.range()[0]);


    svg.chart.selectAll(".data")
      .attr("x",function(d){return svg.newX(d.x - 0.375);})
      .attr("y", function(d){return svg.newY(d.y);})
      .attr("height", function(d){return newydom0 - svg.newY(d.height);})
      .attr("width", dataWidth);


    svg.axisx.call(d3.axisBottom(svg.newX));

    svg.axisx.selectAll(".tick").select("text").text(function(d){
        if (Math.floor(d) != d){
            this.parentNode.remove();
        }else{
            return svg.legend[d%svg.legend.length].text;
        }
    });

    svg.axisy.call(d3.axisLeft(svg.newY));

    niceTicks(svg.axisy);

    gridSimpleGraph(svg);

}



/***********************************************************************************************************/



function updateHisto1DStackDouble(svg){

/*
    svg.chartOutput.attr("transform","matrix(" + (svg.scalex*svg.scale) + ", 0, 0, " + (svg.scaley*svg.scale) + ", " + svg.translate[0] + "," + svg.translate[1] + ")" );
    svg.chartInput.attr("transform","matrix(" + (svg.scalex*svg.scale) + ", 0, 0, " + (svg.scaley*svg.scale) + ", " + svg.translate[0] + "," + (svg.translate[1] - (svg.scaley*svg.scale-1)*svg.margin.zero) + ")" );
*/


    var newHeightOutput = svg.newYOutput(svg.yOutput.domain()[0]);
    var newHOmarg = svg.newYInput(svg.yInput.domain()[0]);

    var effectiveNewHeightOutput = Math.min(newHeightOutput, svg.height);
    svg.rectInput.attr("y", newHOmarg).attr("height",svg.height-newHOmarg);

    svg.textOutput.attr("transform", "translate(" + (svg.width/2) + "," +(effectiveNewHeightOutput/8 +
        parseFloat(getComputedStyle(svg.textOutput.node()).fontSize)) + ")");



    svg.textInput.attr("transform", "translate(" + (svg.width/2) + "," +
        ((svg.height + Math.max(0,newHOmarg)/3) *0.75) + ")");


    drawChartDouble(svg,newHeightOutput,newHOmarg);

    svg.axisx.call(d3.axisBottom(svg.newX));

    ticksSecondAxisXDouble(svg);

    axisXLegendDouble(svg);

    svg.axisx.attr("transform","matrix(1, 0, 0, 1," + svg.margin.left+ "," + Math.min(svg.margin.top + svg.height,Math.max(svg.margin.top - svg.margin.zero,(svg.heightOutput)*svg.transform.k*svg.scaley +svg.margin.top + svg.transform.y)) + ")" );


    svg.axisyOutput.call(d3.axisLeft(svg.newYOutput));

    niceTicks(svg.axisyOutput);

    svg.axisyInput.call(d3.axisLeft(svg.newYInput));

    niceTicks(svg.axisyInput);


    gridDoubleGraph(svg);

}



/***********************************************************************************************************/


function addZoomDouble(svg,updateFunction){

    if(svg.svg == undefined){
        svg.svg=svg;
    }

    //Scales to update the current view (if not already implemented for specific reasons)
    if(svg.newX == undefined){
        svg.newX = d3.scaleLinear().range(svg.x.range()).domain(svg.x.domain());
    }
    if(svg.newYOutput == undefined) {
        svg.newYOutput = d3.scaleLinear().range(svg.yOutput.range()).domain(svg.yOutput.domain());
    }

    if(svg.newYInput == undefined) {
        svg.newYInput = d3.scaleLinear().range(svg.yInput.range()).domain(svg.yInput.domain());
    }

    //Selection rectangle for zooming (if not already implemented for better display control)
    if(svg.selec == undefined){
        svg.selec = svg.frame.append("rect").attr("class", "rectSelec");
    }



    var startCoord = [NaN,NaN];
    var mouseCoord;

    svg.scalex = 1;
    svg.scaley = 1;

    //coordinates within the x&y ranges frames, points towards the top left corner of the actual view
    //workaround for the zoom.translate([0,0]) which doesn't work as intended.
    svg.transform = {k:1,x:0,y:0};

    //Vector pointing towards the top left corner of the current view in the x&y ranges frame
    //Calculated from svg.translate
    var actTranslate = [0,0];

    //to stop triggering animations during rectselec
    var rectOverlay = svg.frame.append("rect").attr("x",0).attr("y",0)
      .attr("height",svg.height).attr("width",0).attr("fill-opacity",0).classed("rectOverlay",true);

    var event = {k:1,x:0,y:0};

    var calcCoord = [];


    svg.heightData = svg.height - svg.margin.zero;



    svg.zoom = d3.zoom().scaleExtent([1, Infinity]).on("zoom", function () {

          rectOverlay.attr("width",svg.width);

            if(isNaN(startCoord[0])){

                var lastEvent = {k:event.k,x:event.x,y:event.y};
                event = d3.event.transform;

                if(event.k == lastEvent.k){
                    //case: translation

                    //Avoid some "false" executions
                    if(event.k  != 1){
                        svg.style("cursor", "move");

                    }

                    //actualization of the translation vector (translate) within the x&y ranges frames
                    svg.transform.x = Math.min(0, Math.max(event.x,svg.width - event.k*svg.scalex*svg.width));
                    svg.transform.y = Math.min(0, Math.max(event.y,svg.height - event.k*svg.scaley*svg.heightData - svg.margin.zero));

                }else{

                    //case: zoom
                    var coefScale = event.k/lastEvent.k;

                    //Retrieve the cursor coordinates. Quick dirty fix to accept double click while trying to minimize side effects.
                    calcCoord[0] = -svg.margin.left-(event.x -lastEvent.x*coefScale)/(coefScale -1);
                    calcCoord[1] = -svg.margin.top-(event.y -lastEvent.y*coefScale)/(coefScale -1);


                    var mouse = d3.mouse(svg.svg.node());
                    console.log("x: " + (calcCoord[0] - mouse[0]).toFixed(5) + " y: " + (calcCoord[1] - mouse[1]).toFixed(5));

                    var lastScalex = svg.scalex;
                    var lastScaley = svg.scaley;

                    //Actualization of the local scales
                    svg.scalex = Math.max(1/event.k, svg.scalex);
                    svg.scaley = Math.max(1/event.k, svg.scaley);

                    //Evaluation of the scale changes by axis
                    var xrel = coefScale*svg.scalex/lastScalex;
                    var yrel = coefScale*svg.scaley/lastScaley;

                    //console.log("zoom " + svg.translate + " e.t " + e.translate);


                    //actualization of the translation vector with the scale change
                    svg.transform.x*= xrel;

                    //actualization of the translation vector (translate) to the top left corner of our view within the standard x&y.range() frame
                    //If possible, the absolute location pointed by the cursor stay the same
                    //Since zoom.translate(translate) doesn't work immediately but at the end of all consecutive zoom actions,
                    //we can't rely on d3.event.translate for smooth zooming and have to separate zoom & translation
                    svg.transform.x = Math.min(0, Math.max(svg.transform.x - calcCoord[0]*(xrel - 1),svg.width - event.k*svg.scalex*svg.width ));

                    var oldMouse = calcCoord[1] - svg.transform.y;
                    
                    var newMouse = oldMouse* yrel + Math.min(svg.margin.zero, Math.max(0,oldMouse - svg.heightOutput*svg.transform.k*lastScaley))*(1 - yrel);
                    svg.transform.y = oldMouse - newMouse + svg.transform.y;
                    svg.transform.y = Math.min(0, Math.max(svg.transform.y,svg.height - event.k*svg.scaley*svg.heightData - svg.margin.zero));

                    //console.log("newmouse :" + newMouse + " oldMouse :" + oldMouse);

                    svg.transform.k = event.k;

                    //console.log(" lastScalex " + lastScalex + " scalex " + svg.scalex + " lastScaley " + lastScaley + " scaley " + svg.scaley + " xrel " + xrel + " yrel " + yrel);
                }



                actTranslate[0] = -svg.transform.x/(svg.scalex*event.k);
                actTranslate[1] = -svg.transform.y/(svg.scaley*event.k);



                //actualization of the current (newX&Y) scales domains
                svg.newX.domain([ svg.x.invert(actTranslate[0]), svg.x.invert(actTranslate[0] + svg.width/(svg.transform.k*svg.scalex)) ]);

                svg.newYOutput.range([Math.min(svg.height,Math.max(0,svg.heightOutput*svg.transform.k*svg.scaley+svg.transform.y)),0]);
                svg.newYInput.range([Math.min(svg.height,Math.max(0,svg.heightOutput*svg.transform.k*svg.scaley+svg.transform.y + svg.margin.zero)),svg.height]);

                svg.newYOutput.domain([svg.yOutput.invert(svg.height/(svg.transform.k*svg.scaley) + actTranslate[1]),
                    svg.yOutput.invert(actTranslate[1])]);

                svg.newYInput.domain([svg.yInput.invert(actTranslate[1]  + (1-1/(svg.transform.k*svg.scaley))*svg.margin.zero),
                    svg.yInput.invert(actTranslate[1] + (1-1/(svg.transform.k*svg.scaley))*svg.margin.zero + svg.height/(svg.transform.k*svg.scaley))]);



                updateFunction(svg);



            } else {

                mouseCoord = d3.mouse(svg.frame.node());

                //Drawing of the selection rect
                console.log("carré mousecoord " + mouseCoord + " start " + startCoord );

                mouseCoord[0] = Math.min(Math.max(mouseCoord[0],svg.x.range()[0]),svg.x.range()[1]);
                mouseCoord[1] = Math.min(Math.max(mouseCoord[1],0),svg.height);

                svg.selec.attr("x", Math.min(mouseCoord[0],startCoord[0]))
                    .attr("y", Math.min(mouseCoord[1],startCoord[1]))
                    .attr("width",  Math.abs(mouseCoord[0] - startCoord[0]))
                    .attr("height", Math.abs(mouseCoord[1] - startCoord[1]));
            }


        })

        .on("start",function () {
            clearTimeout(svg.timer);
            event = {k:svg.transform.k,x:svg.transform.x,y:svg.transform.y};

            if(isShiftKeyDown){
                console.log("key is down start");
                startCoord = d3.mouse(svg.frame.node());
                startCoord[0] = Math.min(Math.max(startCoord[0],svg.x.range()[0]),svg.x.range()[1]);
                startCoord[1] = Math.min(Math.max(startCoord[1],0),svg.height);

                svg.style("cursor","crosshair");
            }

        })
        .on("end", function () {

            rectOverlay.attr("width",0);

            if(!isNaN(startCoord[0]) && !isNaN(mouseCoord[0])){


                svg.selec.attr("width",  0)
                    .attr("height", 0);

                //Top left corner coordinates of the selection rectangle
                var xmin = Math.min(mouseCoord[0],startCoord[0]);
                var ymin = Math.min(mouseCoord[1],startCoord[1]);
                var ymax = ymin + Math.abs(mouseCoord[1] - startCoord[1]);


                var marginIncl = Math.max(0,ymax - ymin + svg.margin.zero -
                    Math.max(svg.heightOutput*svg.transform.k*svg.scaley + svg.transform.y + svg.margin.zero,ymax)
                    + Math.min(ymin,svg.heightOutput*svg.transform.k*svg.scaley + svg.transform.y));

                var sqheight = ymax - ymin - marginIncl;


                var sqwidth = Math.abs(mouseCoord[0] - startCoord[0]);


                if(sqwidth != 0 && sqheight != 0){

                    var lastScale = svg.transform.k;
                    var lastScalex = svg.scalex;
                    var lastScaley = svg.scaley;



                    //Repercussion on the translate vector
                    svg.transform.x -= xmin;
                    svg.transform.y -= ymin;

                    //Evaluation of the total scale change from the beginning, by axis.
                    svg.scalex = svg.width*svg.transform.k*svg.scalex/sqwidth;

                    svg.scaley = (svg.height-marginIncl)*svg.transform.k*svg.scaley/sqheight;

                    //Evaluation of the global scale
                    svg.transform.k = Math.max(svg.scalex,svg.scaley);

                    //Evaluation of the local scale change (with 0<svg.scalen<=1 &&
                    // total scale change for n axis == svg.scalen*svg.scale >=1)
                    svg.scalex = svg.scalex/svg.transform.k;
                    svg.scaley = svg.scaley/svg.transform.k;


                    //Evaluation of the ratio by axis between the new & old scales
                    var xrel = (svg.scalex * svg.transform.k)/(lastScale * lastScalex);
                    var yrel = (svg.scaley * svg.transform.k)/(lastScale * lastScaley);

                    //Actualization of the translate vector
                    svg.transform.x*= xrel;
                    svg.transform.y = svg.transform.y*yrel + Math.max(-svg.margin.zero,Math.min(svg.transform.y + lastScaley*lastScale*svg.heightOutput,0))*(1-yrel);


                    actTranslate[1] = -svg.transform.y/(svg.scaley*svg.transform.k);


                    //actualization of the current (newX&Y) scales domains
                    svg.newX.domain([ svg.newX.invert(xmin), svg.newX.invert(xmin + sqwidth)]);
                    svg.newYOutput.range([Math.min(svg.height,Math.max(0,svg.heightOutput*svg.transform.k*svg.scaley+svg.transform.y)),0]);
                    svg.newYInput.range([Math.min(svg.height,Math.max(0,svg.heightOutput*svg.transform.k*svg.scaley+svg.transform.y + svg.margin.zero)),svg.height]);

                    svg.newYOutput.domain([svg.yOutput.invert(svg.height/(svg.transform.k*svg.scaley) + actTranslate[1]),
                        svg.yOutput.invert(actTranslate[1])]);

                    svg.newYInput.domain([svg.yInput.invert(actTranslate[1]  + (1-1/(svg.transform.k*svg.scaley))*svg.margin.zero),
                        svg.yInput.invert(actTranslate[1] + (1-1/(svg.transform.k*svg.scaley))*svg.margin.zero + svg.height/(svg.transform.k*svg.scaley))]);


                    updateFunction(svg);
                }

            }

            //update of the zoom behavior
            svg._groups[0][0].__zoom.k =svg.transform.k;
            svg._groups[0][0].__zoom.x =svg.transform.x;
            svg._groups[0][0].__zoom.y =svg.transform.y;

            startCoord = [NaN,NaN];
            mouseCoord = [NaN,NaN];

            svg.style("cursor","auto");


        });

    svg.call(svg.zoom);
}
/************************************************************************************************************/

function redrawHisto2DStackDouble(div,svg){

    var divWidth = Math.max(1.15*svg.tableWidth + svg.margin.left + svg.margin.right + 1,parseInt(div.style("width"),10)),
      divHeight = Math.max(svg.margin.bottom + svg.margin.top + svg.margin.zero + 1,window.innerHeight);
    console.log("width " + divWidth );

    var oldsvgheight = svg.height;
    var oldsvgwidth = svg.width;
    div.style("height",divHeight + "px");

    svg.attr("width",divWidth-1.15*svg.tableWidth).attr("height",divHeight);

    svg.width = divWidth-1.15*svg.tableWidth - svg.margin.left - svg.margin.right;
    svg.height = divHeight - svg.margin.bottom - svg.margin.top;
    div.select("table").style("max-height",
      (divHeight - 2*parseFloat(getComputedStyle(div.select("h4").node()).fontSize) -60)  + "px");

    var oldheightoutput = svg.heightOutput;

    
    var margIncTransl = Math.max(-svg.margin.zero,Math.min(svg.transform.y + (svg.transform.k*svg.scaley)*oldheightoutput,0));
    var margInView = Math.max(-svg.margin.zero,Math.min((svg.transform.y-oldsvgheight) + (svg.transform.k*svg.scaley)*oldheightoutput,0)) - margIncTransl;

    var oldheightData = svg.heightData;
    svg.heightData = svg.height - svg.margin.zero;
    svg.heightOutput = svg.heightOutput*svg.heightData/oldheightData;


    console.log("marginview " + margInView);

  
    var ratiox = svg.width/oldsvgwidth;

    svg.x.range([0, svg.width]);

    svg.yInput.range([svg.heightOutput+svg.margin.zero,svg.height]);
    svg.yOutput.range([svg.heightOutput,0]);

    svg.svg.attr("width",svg.width).attr("height",svg.height);



    svg.rectInput.attr("width",svg.width);

    axisXDoubleDraw(svg);

    svg.ylabel.attr("x",- svg.height/2).attr('y',- svg.margin.left);

    svg.frame.select(".rectOverlay").attr("height",svg.height);



    console.log("marincltransl " + margIncTransl);
    svg.transform.y = (svg.transform.y - margIncTransl) * (svg.height + margInView)/(oldsvgheight + margInView) + margIncTransl;
    svg.transform.x *= ratiox;

    var oldscaleytot = svg.transform.k*svg.scaley;

    var scaleytot = oldscaleytot * (svg.height + margInView) * oldheightData / (svg.heightData * (oldsvgheight + margInView)) ;
 
    var scalextot = svg.transform.k*svg.scalex;
 
    svg.transform.k = Math.max(scalextot,scaleytot);
    svg.scalex = scalextot/svg.transform.k;
    svg.scaley = scaleytot/svg.transform.k;

    svg.newX.range([0,svg.width]);
    svg.newYOutput.range([Math.min(svg.height,Math.max(0,svg.heightOutput*scaleytot+svg.transform.y)),0]);
    svg.newYInput.range([Math.min(svg.height,Math.max(0,svg.heightOutput*scaleytot+svg.transform.y + svg.margin.zero)),svg.height]);


    svg._groups[0][0].__zoom.k =svg.transform.k;
    svg._groups[0][0].__zoom.x =svg.transform.x;
    svg._groups[0][0].__zoom.y =svg.transform.y;

    updateHisto1DStackDouble(svg);

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

function redrawHisto2DStackSimple(div,svg){

    var divWidth = Math.max(1.15*svg.tableWidth + svg.margin.left + svg.margin.right + 1,parseInt(div.style("width"),10)),
      divHeight = Math.max(svg.margin.bottom + svg.margin.top + svg.margin.zero + 1,window.innerHeight);
    console.log("width " + divWidth );

    var oldsvgheight = svg.height;
    var oldsvgwidth = svg.width;
    div.style("height",divHeight + "px");

    svg.attr("width",divWidth-1.15*svg.tableWidth).attr("height",divHeight);

    svg.width = divWidth-1.15*svg.tableWidth - svg.margin.left - svg.margin.right;
    svg.height = divHeight - svg.margin.bottom - svg.margin.top;
    div.select("table").style("max-height",
      (divHeight - 2*parseFloat(getComputedStyle(div.select("h4").node()).fontSize) -60)  + "px");


    var ratiox = svg.width/oldsvgwidth;
    var ratioy = svg.height/oldsvgheight;

    svg.x.range([0, svg.width]);

    svg.y.range([svg.height,0]);

    svg.svg.attr("width",svg.width).attr("height",svg.height);

    svg.ylabel.attr("x",- svg.height/2).attr('y',- svg.margin.left);

    svg.frame.select(".rectOverlay").attr("height",svg.height);


    svg.transform.x = svg.transform.x*ratiox;
    svg.transform.y = svg.transform.y*ratioy;

    var scaleytot = svg.transform.k*svg.scaley;
    var scalextot = svg.transform.k*svg.scalex;

    svg.transform.k = Math.max(scalextot,scaleytot);
    svg.scalex = scalextot/svg.transform.k;
    svg.scaley = scaleytot/svg.transform.k;

    svg.newX.range([0,svg.width]);
    svg.newY.range([svg.height,0]);

    svg.axisx.attr('transform', 'translate(' + [svg.margin.left, svg.height+svg.margin.top] +  ")");

    svg._groups[0][0].__zoom.k =svg.transform.k;
    svg._groups[0][0].__zoom.x =svg.transform.x;
    svg._groups[0][0].__zoom.y =svg.transform.y;

    updateHisto1DStackSimple(svg);

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

/************************************************************************************************************

 convert bytes to NiB string

************************************************************************************************************/

function bytesConvert(nbBytes){

    var exp = Math.min(8,Math.max(0,Math.floor(Math.log(nbBytes)/Math.log(1024))));

    var value = (nbBytes/Math.pow(1024,exp)).toFixed(1);

    if(value == Math.floor(value)){
        value = Math.floor(value);
    }

    switch (exp){

        default:
        case 0:
            return value + " B";
        case 1 :
            return value + " KB";
        case 2 :
            return value + " MB";
        case 3 :
            return value + " GB";
        case 4 :
            return value + " TB";
        case 5 :
            return value + " PB";
        case 6 :
            return value + " EB";
        case 7 :
            return value + " ZB";
        case 8 :
            return value + " YB";
    }

}


/************************************************************************************************************

 Return a function that should give a new color each, two successive colors should be different enough.


 ************************************************************************************************************/

/*

function colorEval(){

    var lim = 5;
    var threshold = 360/Math.pow(2,lim);

    var val = 0;
    var extent = 360;
    var color;

    var j = -1;
    var ylim = 5;
    var ystart = ylim, zstart = 3;
    var ythresh = ystart;
    var y = ystart;
    var z = zstart;

    var start = 0.4;
    var segm = (0.8 - start)/6;


    var s = start + segm*y;
    var l = start + segm*z;


    return function(){

        color = d3.hsl(val,s,l);
        val = val + j*180 + extent * (1+j)/2;
        j = -1 * j;


        y = (y+4)%7;
        if(y==ythresh){
            y++;
            ythresh++;
        }
        z = (z+4)%7;
        s = y*segm +start;
        l= z*segm+start;


        if(val >= 360){

            extent = extent/2;

            if(extent <= threshold){
                val = 0;
                extent = 360;
                ystart = (ystart+4)%7;
                if(ystart==ylim){
                    ylim++;
                    ystart++;
                }
                zstart = (zstart+4)%7;
                y=ystart;
                z=zstart;
                ythresh = ystart;
                s = start + segm*y;
                l = start + segm*z;
            }else{
                val = extent/2 + 180;
            }
        }

        return color;
    }
}

*/
/************************************************************************************************************/




function colorEval(firstValue){



    var calcexpmin;
    var added;
    var idecal;
    var val = typeof firstValue !== "undefined" ? firstValue%360 : 0;
    var exp;
    var i = 0;


    var color;

    /* à voir pour répartition non homogène autour cercle hsl

    var coef = 3 * 20 / Math.PI;


    function disp(x){
        return x + coef * Math.sin(x * Math.PI/60);
    }
    */

    var y = 5;
    var z = 5;

    var starty = 0.5;
    var startz = 0.5;
    var segmy = (1 - starty)/6;
    var segmz = (0.8 - startz)/10;

    var s = starty + segmy*y;
    var l = startz + segmz*z;


    return function(){
        i++;
        color = d3.hsl(val,s,l);
        exp = Math.floor(Math.log(i)/Math.log(2));
        idecal = i - Math.pow(2,exp);
        calcexpmin =  1;
        do{
            idecal = idecal / 2;
            calcexpmin --;
        }
        while(idecal == Math.floor(idecal) && calcexpmin > -exp);

        //console.log("i " + i + "  exp " + exp + " idecal "+ idecal + " calcexpmin " + calcexpmin + " 1/4 " + Math.floor(((i-1)%4)/3));
        added = (Math.pow(2,calcexpmin) + Math.floor(((i-1)%4)/3)*0.5)*180;
        val =(val + added)%360;
        //console.log("val " + val);


        y = (y+4)%7;
        z = (z+7)%11;
        s = y*segmy +starty;
        l= z*segmz +startz;

        //console.log(color);

        return color;
    }
}


/************************************************************************************************************/

function easeFct(exp){
    var exp = exp;
    var a = Math.pow(2,exp-1);

    return function(t){

        return (t<.5)?a*Math.pow(t,exp):Math.min(1,1-a*Math.pow(1-t,exp));

    }

}



/*****************************************************************************

 To be functional, the method addZoom has several requirements:

 -svg.svg refers to an svg element that contains all the chart elements (and possibly more),
 addZoom will listen to it.

 -svg.frame is used to capture the position of the mouse in the chart
 viewport without offset, if the transform translate/scale way is implemented,
 svg.frame should refers to a g element superposed on the g containing the chart
 itself.

 -svg.y & svg.x, the initial scales used for drawing the chart.

 Some other elements will be implemented with standard parameters unless
 they already exist.

 svg.newX and svg.newY, the scales about to define the current altered
 view, implemented by default with clamping behavior enabled.

 svg.selec, the selection rectangle. It may be interesting
 to decide where it should be placed priorily, if you use the css transform
 function for example.


 Should work whichever the way scaling and translating are handled.

 *****************************************************************************/



function addZoomSimple(svg,updateFunction){

    if(svg.frame == undefined){
        svg.frame=svg.chart;
    }

    if(svg.svg == undefined){
        svg.svg=svg;
    }

    //Scales to update the current view (if not already implemented for specific reasons)
    if(svg.newX == undefined){
        svg.newX = d3.scale.linear().range(svg.x.range()).clamp(true).domain(svg.x.domain());
    }
    if(svg.newY == undefined) {
        svg.newY = d3.scale.linear().range(svg.y.range()).clamp(true).domain(svg.y.domain());
    }

    //Selection rectangle for zooming (if not already implemented for better display control)
    if(svg.selec == undefined){
        svg.selec = svg.chart.append("rect").attr("class", "rectSelec");
    }



    //to stop triggering animations during rectselec
    var rectOverlay = svg.frame.append("rect").attr("x",0).attr("y",0)
      .attr("height",svg.height).attr("width",0).attr("fill-opacity",0).classed("rectOverlay",true);


    var startCoord = [NaN,NaN];
    var mouseCoord = [NaN,NaN];


    svg.scalex = 1;
    svg.scaley = 1;

    //coordinates within the x&y ranges frames, points towards the top left corner of the actual view
    //workaround for the zoom.translate([0,0]) which doesn't work as intended.
    svg.transform = {k:1,x:0,y:0};


    //Vector pointing towards the top left corner of the current view in the x&y ranges frame
    //Calculated from svg.translate
    var actTranslate = [0,0];

    var event = {k:1,x:0,y:0};
    var calcCoord =[];

    svg.zoom = d3.zoom().scaleExtent([1, Infinity]).on("zoom", function () {

          rectOverlay.attr("width",svg.width);

          if(isNaN(startCoord[0])){
              
              var lastEvent = {k:event.k,x:event.x,y:event.y};
              event = d3.event.transform;

              if(event.k == lastEvent.k){
                  //case: translation

                  //Avoid some "false" executions
                  if(event.k != 1){
                      svg.style("cursor", "move");

                  }

                  //actualization of the translation vector (translate) within the x&y ranges frames
                  svg.transform.x = Math.min(0, Math.max(event.x,svg.width - event.k*svg.scalex*svg.width ));
                  svg.transform.y = Math.min(0, Math.max(event.y,svg.height - event.k*svg.scaley*svg.height ));


              }else{

                  //case: zoom
                  var coefScale = event.k/lastEvent.k;
                  //Retrieve the cursor coordinates. Quick dirty fix to accept double click while trying to minimize side effects.
                  calcCoord[0] = -svg.margin.left-(event.x -lastEvent.x*coefScale)/(coefScale -1);
                  calcCoord[1] = -svg.margin.top-(event.y -lastEvent.y*coefScale)/(coefScale -1);

                  var mouse = d3.mouse(svg.svg.node());
                  console.log("x: " + (calcCoord[0] - mouse[0]).toFixed(5) + " y: " + (calcCoord[1] - mouse[1]).toFixed(5));

                  var lastScalex = svg.scalex;
                  var lastScaley = svg.scaley;


                  //Actualization of the local scales
                  svg.scalex = Math.max(1/event.k, svg.scalex);
                  svg.scaley = Math.max(1/event.k, svg.scaley);

                  //Evaluation of the scale changes by axis
                  var xrel = coefScale*svg.scalex/lastScalex;
                  var yrel = coefScale*svg.scaley/lastScaley;



                  //actualization of the translation vector with the scale change
                  svg.transform.x*= xrel;
                  svg.transform.y*= yrel;

                  //actualization of the translation vector (translate) to the top left corner of our view within the standard x&y.range() frame
                  //If possible, the absolute location pointed by the cursor stay the same
                  //Since zoom.translate(translate) doesn't work immediately but at the end of all consecutive zoom actions,
                  //we can't rely on d3.event.translate for smooth zooming and have to separate zoom & translation
                  svg.transform.x = Math.min(0, Math.max(svg.transform.x - calcCoord[0]*(xrel - 1),svg.width - event.k*svg.scalex*svg.width ));
                  svg.transform.y = Math.min(0, Math.max(svg.transform.y - calcCoord[1]*(yrel - 1),svg.height- event.k*svg.scaley*svg.height ));
                  svg.transform.k = event.k;

              }

              actTranslate[0] = -svg.transform.x/(svg.scalex*event.k);
              actTranslate[1] = -svg.transform.y/(svg.scaley*event.k);



              //actualization of the current (newX&Y) scales domains
              svg.newX.domain([ svg.x.invert(actTranslate[0]), svg.x.invert(actTranslate[0] + svg.width/(svg.transform.k*svg.scalex)) ]);
              svg.newY.domain([ svg.y.invert(actTranslate[1] + svg.height/(svg.transform.k*svg.scaley)), svg.y.invert(actTranslate[1]) ]);

              updateFunction(svg);



          } else {

              mouseCoord = d3.mouse(svg.frame.node());

              //Drawing of the selection rect
              console.log("carré mousecoord " + mouseCoord + " start " + startCoord );

              mouseCoord[0] = Math.min(Math.max(mouseCoord[0],svg.x.range()[0]),svg.x.range()[1]);
              mouseCoord[1] = Math.min(Math.max(mouseCoord[1],svg.y.range()[1]),svg.y.range()[0]);

              svg.selec.attr("x", Math.min(mouseCoord[0],startCoord[0]))
                .attr("y", Math.min(mouseCoord[1],startCoord[1]))
                .attr("width",  Math.abs(mouseCoord[0] - startCoord[0]))
                .attr("height", Math.abs(mouseCoord[1] - startCoord[1]));



          }


      })

      .on("start",function () {
          clearTimeout(svg.timer);
          event = {k:svg.transform.k,x:svg.transform.x,y:svg.transform.y};

          console.log("zoomstart");
          if(isShiftKeyDown){
              console.log("key is down start");
              startCoord = d3.mouse(svg.frame.node());
              startCoord[0] = Math.min(Math.max(startCoord[0],svg.x.range()[0]),svg.x.range()[1]);
              startCoord[1] = Math.min(Math.max(startCoord[1],svg.y.range()[1]),svg.y.range()[0]);

              svg.style("cursor","crosshair");
          }

      })
      .on("end", function () {
          console.log("zoomend");
          rectOverlay.attr("width",0);

          if(!isNaN(startCoord[0]) && !isNaN(mouseCoord[0])){



              svg.selec.attr("width",  0)
                .attr("height", 0);


              var sqwidth = Math.abs(mouseCoord[0] - startCoord[0]);
              var sqheight = Math.abs(mouseCoord[1] - startCoord[1]);

              if(sqwidth != 0 && sqheight != 0){

                  var lastScale = svg.transform.k;
                  var lastScalex = svg.scalex;
                  var lastScaley = svg.scaley;

                  //Top left corner coordinates of the selection rectangle
                  var xmin = Math.min(mouseCoord[0],startCoord[0]);
                  var ymin = Math.min(mouseCoord[1],startCoord[1]);

                  //Repercussion on the translate vector
                  svg.transform.x -= xmin;
                  svg.transform.y -= ymin;

                  //Evaluation of the total scale change from the beginning, by axis.
                  svg.scalex = svg.width*svg.transform.k*svg.scalex/sqwidth;
                  svg.scaley = svg.height*svg.transform.k*svg.scaley/sqheight;

                  //Evaluation of the global scale
                  svg.transform.k = Math.max(svg.scalex,svg.scaley);

                  //Evaluation of the local scale change (with 0<svg.scalen<=1 &&
                  // total scale change for n axis == svg.scalen*svg.scale >=1)
                  svg.scalex = svg.scalex/svg.transform.k;
                  svg.scaley = svg.scaley/svg.transform.k;

                  //Evaluation of the ratio by axis between the new & old scales
                  var xrel = (svg.scalex * svg.transform.k)/(lastScale * lastScalex);
                  var yrel = (svg.scaley * svg.transform.k)/(lastScale * lastScaley);

                  //Actualization of the translate vector
                  svg.transform.x*= xrel;
                  svg.transform.y*= yrel;

                  //actualization of the current (newX&Y) scales domains
                  svg.newX.domain([ svg.newX.invert(xmin), svg.newX.invert(xmin + sqwidth)]);
                  svg.newY.domain([ svg.newY.invert(ymin + sqheight),svg.newY.invert(ymin) ]);

                  updateFunction(svg);
              }

          }

          //update of the zoom behavior
          svg._groups[0][0].__zoom.k =svg.transform.k;
          svg._groups[0][0].__zoom.x =svg.transform.x;
          svg._groups[0][0].__zoom.y =svg.transform.y;

          startCoord = [NaN,NaN];
          mouseCoord = [NaN,NaN];
          svg.style("cursor","auto");


      });

    svg.call(svg.zoom);
}

/************************************************************************************************************/

function createCurve(div,svg,urlJson,mydiv){


    d3.json(urlJson, function (error, json) {


        console.log(json);

        //test json conformity
        if (typeof json === "undefined" || json.result != "true" || error) {
            console.log("incorrect url/data");
            noData(div, svg,mydiv);
            return false;
        }

        //json ok, graph creation

        json = json.response.data;
        svg.legendFirstItem = +json[1].legend[0].text.split("h")[0];
        console.log(json);

        var divWidth = Math.max(svg.margin.left + svg.margin.right + 1, parseInt(div.style("width"), 10)),
          divHeight = Math.max(svg.margin.bottom + svg.margin.top + 1, window.innerHeight);


        div.style("height", divHeight + "px");
        svg.attr("width", divWidth).attr("height", divHeight);


        svg.width = divWidth - svg.margin.left - svg.margin.right;
        svg.height = divHeight - svg.margin.bottom - svg.margin.top;


        svg.x = d3.scaleLinear()
          .range([0, svg.width]);

        svg.y = d3.scaleLinear()
          .range([svg.height, 0]);


        svg.svg = svg.append("svg").attr("x", svg.margin.left).attr("y", svg.margin.top).attr("width", svg.width)
          .attr("height", svg.height).classed("svgline", true);

        svg.grid = svg.svg.append("g").classed("grid", true);

        svg.chart = svg.svg.append("g");

        svg.valueline = d3.line();
        svg.area = d3.area();
        var tab = json[2].tab;
        var tabLength = tab.length;

        //value each couple minutes;
        var valuesPerHour = 30;
        var i;

        svg.data = [];

        for (var x = 0; x < tabLength; x++) {

            if (tab[x].y.length === 0) {

                for (i = 0; i < valuesPerHour; i++) {
                    svg.data.push(0);
                }

            } else {

                for (i = 0; i < valuesPerHour; i++) {
                    svg.data.push(tab[x].y[i]);
                }

            }

        }


        svg.x.domain([0, svg.data.length]);
        //*1.05 for margin
        svg.y.domain([0, d3.max(svg.data) * 1.05]);


        console.log(svg.data);


        svg.chart.append("path").classed("line", true);
        svg.chart.append("path").classed("area", true);

        svg.area.x(function (d, i) {
            return svg.x(i);
        }).y1(function (d) {
            return svg.y(d);
        }).y0(svg.y.range()[0]);


        svg.valueline
          .x(function (d, i) {
              return svg.x(i);
          }).y(function (d) {
            return svg.y(d);
        });


        svg.axisx = svg.append("g")
          .classed("x axis", true)
          .attr('transform', 'translate(' + [svg.margin.left, svg.height + svg.margin.top] + ")");

        svg.axisx.call(d3.axisBottom(svg.x));

        svg.axisy = svg.append("g").attr('transform', 'translate(' + [svg.margin.left, svg.margin.top] + ')').classed("y axis", true);
        svg.axisy.call(d3.axisLeft(svg.y));

        niceTicks(svg.axisy);

        gridSimpleGraph(svg, true);

        //      Label of the y axis
        svg.ylabel = svg.axisy.append("text")
          .attr("class", "label")
          .attr("text-anchor", "middle")
          .attr("dy", "1em")
          .attr('y', -svg.margin.left)
          .attr("x", -svg.height / 2)
          .attr("transform", "rotate(-90)")
          .text(json[0].unit);

        legendCurveAxisX(svg);

        svg.newX = d3.scaleLinear().range(svg.x.range()).domain(svg.x.domain());
        svg.newY = d3.scaleLinear().range(svg.y.range()).domain(svg.y.domain());


        svg.newValueline = d3.line();
        svg.newArea = d3.area();


        svg.newArea.x(function (d, i) {
            return svg.newX(i);
        }).y1(function (d) {
            return svg.newY(d);
        }).y0(svg.newY.range()[0]);


        svg.newValueline
          .x(function (d, i) {
              return svg.newX(i);
          }).y(function (d) {
            return svg.newY(d);
        });


        svg.transition("start").duration(800).tween("", function () {

            var data = JSON.parse(JSON.stringify(svg.data));
            var line = svg.chart.select(".line");
            var area = svg.chart.select(".area");

            return function (t) {
                t = Math.min(1, Math.max(0, t));
                svg.data = data.map(function (elem, i) {
                    return data[i] * t;
                });
                line.attr("d", svg.newValueline(svg.data));
                area.attr("d", svg.newArea(svg.data));
            }
        });


        addZoomSimple(svg, updateCurve);

        d3.select(window).on("resize." + mydiv, function () {
            console.log("resize");
           redrawCurve(div, svg);
        });

    });


}
/************************************************************************************************************/

function redrawCurve(div,svg){

    var divWidth = Math.max(svg.margin.left + svg.margin.right + 1,parseInt(div.style("width"),10)),
      divHeight = Math.max(svg.margin.bottom + svg.margin.top + 1,window.innerHeight);
    console.log("width " + divWidth );

    var oldsvgheight = svg.height;
    var oldsvgwidth = svg.width;
    div.style("height",divHeight + "px");

    svg.attr("width",divWidth).attr("height",divHeight);

    svg.width = divWidth - svg.margin.left - svg.margin.right;
    svg.height = divHeight - svg.margin.bottom - svg.margin.top;


    var ratiox = svg.width/oldsvgwidth;
    var ratioy = svg.height/oldsvgheight;


    svg.x.range([0, svg.width]);

    svg.y.range([svg.height,0]);

    svg.svg.attr("width",svg.width).attr("height",svg.height);

    svg.ylabel.attr("x",- svg.height/2).attr('y',- svg.margin.left);

    svg.frame.select(".rectOverlay").attr("height",svg.height);


    svg.transform.x *= ratiox;
    svg.transform.y *= ratioy;

    var scaleytot = svg.transform.k*svg.scaley;
    var scalextot = svg.transform.k*svg.scalex;

    svg.transform.k = Math.max(scalextot,scaleytot);
    svg.scalex = scalextot/svg.transform.k;
    svg.scaley = scaleytot/svg.transform.k;



    svg.newX.range([0,svg.width]);
    svg.newY.range([svg.height,0]);
    svg.newArea.y0(svg.newY.range()[0]);


    //update of the zoom behavior
    svg._groups[0][0].__zoom.k =svg.transform.k;
    svg._groups[0][0].__zoom.x =svg.transform.x;
    svg._groups[0][0].__zoom.y =svg.transform.y;


    svg.axisx.attr('transform', 'translate(' + [svg.margin.left, svg.height+svg.margin.top] +  ")");

    updateCurve(svg);


}

/************************************************************************************************************/

function updateCurve(svg){


    svg.chart.select(".line").attr("d",svg.newValueline(svg.data));
    svg.chart.select(".area").attr("d",svg.newArea(svg.data));

    svg.axisx.call(d3.axisBottom(svg.newX));

    svg.axisy.call(d3.axisLeft(svg.newY));

    niceTicks(svg.axisy);

    legendCurveAxisX(svg);

    gridSimpleGraph(svg,true);



}
/************************************************************************************************************
 *
 ************************************************************************************************************/

function legendCurveAxisX(svg){
    var mn, roundedMn;
    svg.axisx.selectAll(".tick").select("text").text(function(d){
        mn = ((d%30)*2);
        roundedMn = Math.round(mn);

        //Javascript isn't a precise calculator, this avoid some weirdness.
        if(mn.toFixed(3) !== roundedMn.toFixed(3)){
            this.parentNode.remove();
            return;
        }

        if(roundedMn !=0){
            if(roundedMn <10){
                roundedMn = "0"+roundedMn;
            }
            return (Math.floor(d/30) + svg.legendFirstItem)%24 + "h" + roundedMn;

        }

        return (Math.floor(d/30) + svg.legendFirstItem)%24 + "h";
    });
}


/************************************************************************************************************
 *
 *    Create a background grid exclusive for x & y axis
 *    need svg.grid, svg.axisx and svg.axisy to be set.
 *
 ***********************************************************************************************************/

function gridSimpleGraph(svg, isCurve){

    if(typeof isCurve === "undefined"){
        isCurve = false;
    }

    svg.grid.selectAll("line").remove();

    if(isCurve) {
        svg.axisx.selectAll(".tick").each(function () {
            var transform = this.getAttribute("transform");
            svg.grid.append("line")
              .attr("y2", svg.height)
              .attr("x1", 0.5)
              .attr("x2", 0.5)
              .attr("transform", transform);
        });
    }

    svg.axisy.selectAll(".tick").each(function(){
        var transform = this.getAttribute("transform");
        svg.grid.append("line")
          .attr("y1",0.5)
          .attr("y2",0.5)
          .attr("x2",svg.width)
          .attr("transform",transform);
    });



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

//temporary definitions
/************************************************************************************************************
 *
 * createMap
 *
 * @param div: the container div
 * @param svg: the root svg
 * @param urlJson: the url to get the world
 * @param mydiv: div name (string)
 *
 * Create a map with resize and zoom functionality
 *
 ***********************************************************************************************************/

function createMap(div,svg,urlJson,mydiv){

    //finding/computing the div dimensions

    var divWidth = Math.max(svg.margin.left + svg.margin.right + 1,parseInt(div.style("width"),10)),
      divHeight = Math.max(svg.margin.bottom + svg.margin.top + 1,window.innerHeight);


    //div height instantiated

    div.style("height",divHeight + "px");

    //Some pre-computation to find the dimensions of the map (with a determined height/width ratio
    // for a given standard latitude)

    //Maximum potential width & height the map will have

    svg.width = divWidth - svg.margin.left - svg.margin.right;
    svg.height = divHeight - svg.margin.bottom - svg.margin.top;

    //The wished standard latitude for a cylindrical equal-area projection (in degree)
    //37.5: Hobo-Dyer projection, 45: Gall-Peters projection

    var standardParallelDeg = 37.5;

    //Conversion in radians and cosinus precomputation

    var standardParallelRad = standardParallelDeg*2*Math.PI/360;
    var cosStdPar = Math.cos(standardParallelRad);

    //evaluation of the map width & height if the projection scale = 1, then homothetic zooming.

    svg.mapDefaultWidth = 2*Math.PI*cosStdPar;
    svg.mapDefaultHeight = 2/cosStdPar;

    //evaluation of the optimal scale coefficient for the chosen format

    var projectionScale = Math.min(svg.width/svg.mapDefaultWidth,svg.height/svg.mapDefaultHeight);

    //update of the correct width & height

    svg.width = projectionScale*svg.mapDefaultWidth;
    svg.height = projectionScale*svg.mapDefaultHeight;

    //dimensions of the root svg (= with margins)

    svg.attr("width", svg.width + svg.margin.top + svg.margin.bottom + "px")
      .attr("height", svg.height + svg.margin.left + svg.margin.right + "px");

    //dimensions of the svg map container (= without margins)

    svg.svg = svg.append("svg").attr("x",svg.margin.left).attr("y",svg.margin.top).attr("width",svg.width)
      .attr("height",svg.height).classed("geometricPrecision",true);

    //A rect is appended first (= background) with the size of svg.svg as a sea representation

    svg.backgroundRect = svg.svg.append("rect").attr("width",svg.width).attr("height",svg.height).classed("backgroundSea",true);

    //Computation of the cylindrical equal-area projection with the given standard latitude and
    // the precomputed scale projectionScale

    var projection = d3.geoProjection(function(lambda,phi){
        return [lambda*cosStdPar,Math.sin(phi)/cosStdPar]; })
      .translate([svg.width/2,svg.height/2])
      .scale(projectionScale);

    //The corresponding path function creation for this projection
    var path = d3.geoPath().projection(projection);

    //svg.maps will contain the 2 maps for rotation

    svg.maps = svg.svg.append("g");

    //svg.map will contain the first initial map

    svg.map = svg.maps.append("g");

    //stroke-width controlled by javascript to adapt it to the current scale
    //0.3 when map scale = 100

    svg.strokeWidth = 0.003*projectionScale;
    svg.maps.style("stroke-width", svg.strokeWidth);

    //color for test

    var f = colorEval();


    d3.json(urlJson,function(error, worldmap) {

        //test json conformity

        if (typeof worldmap === "undefined" || error) {
            noData(div, svg,mydiv);
            return false;
        }

        //the binded data, containing the countries info and topology

        var data = topojson.feature(worldmap,worldmap.objects.countries).features;

        //Creation of the countries

        svg.map.selectAll(".countries")
          .data(data)
          .enter().append("path")
          .style("fill",function(){return f()})
          .attr("d",path)
          .classed("countries",true)
          .append("svg:title").text(function(d){return d.properties.name;});


        //stroke-dasharray controlled by javascript to adapt it to the current scale
        // value 2,2 when map scale = 100

        svg.strokeDash = 0.02*projectionScale;

        //Interior boundaries creation

        svg.map.append("path")
          .datum(topojson.mesh(worldmap,worldmap.objects.countries,function(a,b){
              return a !==b;
          }))
          .attr("d",path)
          .classed("countries_boundaries interior",true)
          //zoom dependant, javascript controlled style property with precalculed svg.strokeDash
          .style("stroke-dasharray", svg.strokeDash + "," + svg.strokeDash);

        //Exterior boundaries creation

        svg.map.append("path")
          .datum(topojson.mesh(worldmap,worldmap.objects.countries,function(a,b){
              return a ===b;
          }))
          .attr("d",path)
          .classed("countries_boundaries exterior",true);


        //A duplicate map is created and translated next to the other, outside viewport
        //The .99991 operation avoid a little cut to be too visible where the 2 maps meet.

        svg.map2 = d3.select(svg.maps.node().appendChild(svg.map.node().cloneNode(true)))
          .attr("transform","matrix(1, 0, 0,1," + (0.99991*svg.width) + ", 0)");

        //the data are binded to the second map (may be useful later)

        svg.map2.selectAll(".countries").data(data);

        //listener showing the binded datum on click, for test

        svg.maps.selectAll(".countries").on("click",function(d){
            console.log(d);});

        //added functionalities

        addZoomMap(svg);
        addResizeMap(div,svg,mydiv);


    }); //d3.json end
}

/************************************************************************************************************
 *
 *
 *
 ************************************************************************************************************/

 function getJsonMap(){

}

/************************************************************************************************************
 *
 ***********************************************************************************************************/

function updateTransform(selection,transform){

    var zoom = selection._groups[0][0].__zoom;
    zoom.k = transform.k;
    zoom.x = transform.x;
    zoom.y = transform.y;

}


/************************************************************************************************************
 *
 * addResizeMap
 *
 * @param div: the container div
 * @param svg: the root svg
 * @param mydiv: div name (string)
 *
 * Add a listener to resize the map
 *
 * Needed:
 * svg.svg, the map container
 * svg.width,svg.width, the dimensions of svg.svg
 * svg.maps, a g element child of svg.svg containing the maps
 * svg.translate, svg.zoom, zoom functionalities provided by addZoomMap
 * svg.backgroundRect, the rect providing the sea color
 * svg.mapDefaultWidth, svg.mapDefaultHeight, the map dimensions when scale projection = 1
 *
 ***********************************************************************************************************/


function addResizeMap(div,svg,mydiv){

    var oldHeight, divWidth,divHeight,coefScaling,scaleTotal,projectionScale;

    //the total ratio alteration since the beginning

    if(typeof svg.ratioProjectionScale === "undefined"){
        svg.ratioProjectionScale = 1;
    }

    d3.select(window).on("resize."+mydiv,function(){




        //initial height kept for future computation of the resize augmentation

        oldHeight = svg.height;

        //finding/computing the div dimensions

        divWidth = Math.max(svg.margin.left + svg.margin.right + 1,parseInt(div.style("width"),10));
        divHeight = Math.max(svg.margin.bottom + svg.margin.top + 1,window.innerHeight);

        //div height updated

        div.style("height",divHeight + "px");

        //Some computation to find the new dimensions of the map (with a constant height/width ratio)

        svg.width = divWidth - svg.margin.left - svg.margin.right;
        svg.height = divHeight - svg.margin.bottom - svg.margin.top;
        projectionScale = Math.min(svg.width/svg.mapDefaultWidth,svg.height/svg.mapDefaultHeight);
        svg.width = projectionScale*svg.mapDefaultWidth;
        svg.height = projectionScale*svg.mapDefaultHeight;

        //svg and svg.svg dimensions are accordingly updated

        svg.attr("width", svg.width + svg.margin.top + svg.margin.bottom + "px")
          .attr("height", svg.height + svg.margin.left + svg.margin.right + "px");
        svg.svg.attr("width",svg.width).attr("height",svg.height);

        //Evaluation of the resize ratio augmentation

        coefScaling = svg.height/oldHeight;

        //update of svg.ratioProjectionScale and computation of the map total effective scaling

        svg.ratioProjectionScale *= coefScaling;
        scaleTotal = svg.ratioProjectionScale * svg.transform.k;

        //update of the translation vector

        svg.transform.x *= coefScaling;
        svg.transform.y *= coefScaling;

        //update of the internal zoom translation vector

        updateTransform(svg.svg,svg.transform);

        //the modifications are performed

        svg.maps.attr("transform","matrix(" +  scaleTotal + ", 0, 0, " + scaleTotal + ", " + svg.transform.x + ", " + svg.transform.y + ")");

        //update of the sea rect

        svg.backgroundRect.attr("width",svg.width).attr("height",svg.height);

        //update of some styling variables.

        svg.strokeDash *= coefScaling;
        svg.strokeWidth *= coefScaling;


    })

}


/************************************************************************************************************
 *
 * addZoomMap
 *
 * @param svg: the root svg.
 *
 * Add a listener allowing to zoom and translate the map
 *
 * Needed:
 * svg.svg, the map container
 * svg.width,svg.width, the dimensions of svg.svg
 * svg.maps, a g element child of svg.svg containing the maps
 * svg.strokeDash, the size and spacing of internal's borders strokes when the zoom scale = 1
 * svg.strokeWidth, the width of strokes when zoom scale = 1
 *
 ************************************************************************************************************/

function addZoomMap(svg){


    if(typeof svg.ratioProjectionScale === "undefined"){
        svg.ratioProjectionScale = 1;
    }

    svg.transform = {k:1,x:0,y:0};
    var widthScale, scaleTotal, dashValue;


    svg.zoom = d3.zoom().scaleExtent([1,20]).on("zoom",function(){

        //computation of useful values
        svg.transform = d3.event.transform;

        widthScale = svg.width*svg.transform.k;
        scaleTotal = svg.transform.k*svg.ratioProjectionScale;
        dashValue = svg.strokeDash/scaleTotal;


        //Evaluation of effective translation vectors
        //for "rotation" of the planisphere, svg.transform.x should always be in the [0,-widthScale] range.
        svg.transform.x = svg.transform.x - Math.ceil(svg.transform.x/widthScale)*widthScale;
        svg.transform.y = Math.min(0, Math.max(svg.transform.y,svg.height - svg.transform.k*svg.height));

        //zoom and translation are performed

        svg.maps.attr("transform","matrix(" + scaleTotal + ", 0, 0, " + scaleTotal + ", " + svg.transform.x + ", " + svg.transform.y + ")");

        //styling update, for keeping the same visual effect

        svg.maps.style("stroke-width",svg.strokeWidth/scaleTotal);
        svg.maps.selectAll(".interior").style("stroke-dasharray",dashValue + "," + dashValue);




    })
      .on("end",function(){
          svg.svg._groups[0][0].__zoom.k =svg.transform.k;
          svg.svg._groups[0][0].__zoom.x =svg.transform.x;
          svg.svg._groups[0][0].__zoom.y =svg.transform.y;
      });

    //the listener is finally created on the svg element used as the map container.

    svg.svg.call(svg.zoom);


}


/************************************************************************************************************/



isShiftKeyDown = false;
d3.select(window).on("keydown",function (){

        if( d3.event.keyCode == '16'){
            isShiftKeyDown = true;
            console.log("shiftdown");
        }
    })
    .on("keyup",function () {
        if( d3.event.keyCode == '16'){
            isShiftKeyDown = false;

            console.log("shiftup");
        }
    });


//drawChart("/dynamic/netNbLocalHosts.json?accurate=true&dd=2016-06-20%2011%3A44&df=2016-06-27%2011%3A44&dh=2", "Graph");
//drawChart("/dynamic/netTop10appTraffic.json?service=loc&dd=2016-06-22%2011%3A44&df=2016-06-23%2011%3A44&dh=2", "Graph");
//drawChart("/dynamic/netProtocolesPackets.json?dd=2016-06-18%2011%3A44&df=2016-06-23%2011%3A44&pset=2", "Graph");
//drawChart("/dynamic/netTop10NbExtHosts.json?dd=2016-06-20%2011%3A44&df=2016-06-23%2011%3A44&dh=2", "Graph");
//drawChart("/dynamic/netTop10CountryTraffic.json?dd=2016-06-20%2011%3A44&df=2016-06-23%2011%3A44&dh=2", "Graph");
//drawChart("./netTop10appTraffic.json", "Graph");
//drawChart("./netTop10NbExtHosts.json", "Graph");
//drawChart("./netNbLocalHosts.json", "Graph");
drawChart("worldmap.json","Graph");