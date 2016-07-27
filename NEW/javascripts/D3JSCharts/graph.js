

function emptyChartContainer(jqueryElement) {

    d3.select(jqueryElement).select(".diagram").selectAll("*").remove();

    d3.select(jqueryElement).select(".diagram.divtable").remove();

}



function drawChartFromInterface(urlJson, mydiv) {
    var div = d3.select(mydiv);
    if(div.size() === 0){
        return;
    }

    var svg = div.select("svg");
    if(svg.size() === 0){
        return;
    }

    if(svg.node().firstChild){
        var divNode = div.node();
        var divChild = divNode.firstChild;
        while(divChild){

            divNode.removeChild(divChild);
            divChild = divNode.firstChild;

        }

        svg = div.append("svg").classed("diagram",true);
    }
    svg.classed("crisp",true);
    svg.margin = {top: 20, right: 50, bottom: 20, left: 60, zero:28};


    whichCreationFunction(urlJson)(div,svg,mydiv,urlJson)

}




function drawChart(urlJson, mydiv) {

    var div = d3.select('#' + mydiv);
    if(div.size() === 0){
        return;
    }

    var svg = div.select("svg");
    if(svg.size() === 0){
        return;
    }

    if(svg.node().firstChild){
        var divNode = div.node();
        var divChild = divNode.firstChild;
        while(divChild){

            divNode.removeChild(divChild);
            divChild = divNode.firstChild;

        }

        svg = div.append("svg").classed("diagram",true);
    }
    svg.classed("crisp",true);

    svg.margin = {top: 50, right: 50, bottom: 50, left: 60, zero:28};

    whichCreationFunction(urlJson)(div,svg,mydiv,urlJson);


}

/***********************************************************************************************************/

function whichCreationFunction(urlJson){
var typeGraph = urlJson.split(/[\.\/]+/);
    //For test & real use, can be simplified later
    typeGraph = typeGraph[typeGraph.length - 2];
    console.log(typeGraph);
    switch(typeGraph){
        case "netNbLocalHosts":
        case "netNbExternalHosts":
            return createCurve;
        case "netTopHostsTraffic":
        case "netTopServicesTraffic":
        case "netTopAsTraffic":
        case "netTopAppTraffic":
        case "netTopCountryTraffic":
        case "netTopHostsNbFlow":
        case "netTopCountryNbFlow":
        case "netTopAsNbFlow":
        case "netTopAppNbFlow":
            return createHisto2DStackDouble;
        case "netNbFlow":
        case "netProtocolePackets":
        case "netProtocoleTraffic":
            return createHisto2DStackDoubleFormatVariation;
        case "netTopServicesNbFlow":
        case "netTopNbExtHosts":
            return createHisto2DStackSimple;
        //for now
        case "worldmap":
            return createMap;
        case "netTopCurrentCountryTraffic":
            return createChoroplethDirection;
        default:
            return noData;
    }

}

/***********************************************************************************************************/
function noData(div,svg,mydiv){
    console.log("incorrect url/data");

    var clientRect = div.node().getBoundingClientRect();
    var divWidth = clientRect.width,
      divHeight = clientRect.height;

    svg.attr("width",divWidth).attr("height",divHeight);

    svg.nodata = svg.append("text").attr("transform", "translate(" + (divWidth/2) + "," +
        (divHeight/2 ) + ")")
      .classed("bckgr-txt",true)
      .text("No data")
      .style("fill", "#000");

    d3.select(window).on("resize." + mydiv, function(){
        var clientRect = div.node().getBoundingClientRect();
        var divWidth = clientRect.width,
          divHeight = clientRect.height;

        svg.attr("width",divWidth).attr("height",divHeight);

        svg.nodata.attr("transform", "translate(" + (divWidth/2) + "," +
          (divHeight/2 ) + ")");

    } );
}
/***********************************************************************************************************/


function createHisto2DStackDouble(div,svg,mydiv,urlJson){

    d3.json(urlJson, function (error, json) {

        svg.margin.left = 50;
        svg.margin.right = 50;


        console.log(json);

        //test json conformity
        if (testJson(json) || error) {
            noData(div, svg,mydiv);
            return false;
        }

        //json ok, graph creation


        //table for legend
        svg.tableWidth = 200;

        var clientRect = div.node().getBoundingClientRect();
        var divWidth = Math.max(1.15 * svg.tableWidth + svg.margin.left + svg.margin.right + 1, clientRect.width),
          divHeight = Math.max(svg.margin.bottom + svg.margin.top + svg.margin.zero + 1, clientRect.height);





        svg.attr("width", divWidth - 1.15 * svg.tableWidth).attr("height", divHeight);


        svg.width = divWidth - 1.15 * svg.tableWidth - svg.margin.left - svg.margin.right;
        svg.height = divHeight - svg.margin.bottom - svg.margin.top;


        svg.x = d3.scaleLinear()
          .range([0, svg.width]);

        svg.yInput = d3.scaleLinear().clamp(true);

        svg.yOutput = d3.scaleLinear().clamp(true);

        svg.svg = svg.append("svg").attr("x", svg.margin.left).attr("y", svg.margin.top).attr("width", svg.width).attr("height", svg.height).classed("crisp",true);


        //Will contain the chart itself, without the axis
        svg.chartBackground = svg.svg.append("g");


        svg.chartInput = svg.svg.append('g');
        svg.chartOutput = svg.svg.append('g');


        //Will contain the axis and the rectselec, for a better display of scaling
        svg.frame = svg.svg.append("g");

        svg.selec = svg.frame.append("rect").attr("class", "rectSelec");




        
        
        json = json.response;
        var jsonData = json.data;
        var jsonContent = json.content;


        var contentItemValue = searchItemValue(jsonContent);
        var contentDateValue = searchDateValue(jsonContent);
        var contentAmountValue = searchAmountValue(jsonContent);
        var contentDirectionValue = searchDirectionValue(jsonContent);

        //optional display value for legend, no guaranty on uniqueness/existence.
        var contentDisplayValue = searchDisplayValue(jsonContent);

        //if no display value, then the display value is the item value.
        if (contentDisplayValue === false){
            contentDisplayValue = contentItemValue;
        }

        //if no item/date/amount/direction value found, the graph can't be done.
        if(contentItemValue === false || contentDateValue === false || contentAmountValue === false || contentDirectionValue === false ){
            noData(div,svg,mydiv);
            return;
        }

        //Now, no more nodata can happen,so we create the table
        var divtable = div.append("div").classed("diagram divtable", true);
        divtable.append("h4").classed("tableTitle", true).text("Legend");
        var table = divtable.append("table").classed("diagram font2 tableLegend", true).style("width", svg.tableWidth + "px").style("max-height",
          (divHeight - 2 * parseInt(div.style("font-size"),10) - 60) + "px");

        svg.units = unitsStringProcessing(json.units);



        console.log(json);
        
        

        svg.valuesIn = [];
        svg.valuesOut = [];

        var dataLength = jsonData.length;

        var colorMap = new Map();
        var sumMap = new Map();
        var i, elemJson, elemToPush, elemSumMap;
        svg.timeMin = Infinity;
        var timeMax = 0;


        var hourShift = getTimeShift(urlJson)  * 3600000;

        // Data are processed and sorted according to their direction.
        for(i = 0; i < dataLength; i++){
            elemJson = jsonData[i];

            if(+elemJson[contentAmountValue] === 0){
                continue;
            }

            elemToPush = {
                x: (new Date(elemJson[contentDateValue])).getTime() + hourShift,
                height: +elemJson[contentAmountValue],
                item: (elemJson[contentItemValue] === "")?" Remainder ":elemJson[contentItemValue],
                direction: elemJson[contentDirectionValue].toLowerCase()
            };

            if (!sumMap.has(elemToPush.item)) {
                sumMap.set(elemToPush.item, {sum: elemToPush.height,display: (elemToPush.item === " Remainder ")?" Remainder ":(elemJson[contentDisplayValue] === "")?elemToPush.item:elemJson[contentDisplayValue]});
            } else {
                elemSumMap = sumMap.get(elemToPush.item);
                elemSumMap.sum += elemToPush.height;
            }

            svg.timeMin = Math.min(svg.timeMin,elemToPush.x);
            timeMax = Math.max(timeMax,elemToPush.x);

            if(elemJson[contentDirectionValue] === "IN"){
                elemToPush.direction = "inc";
                svg.valuesIn.push(elemToPush);

            }else{

                svg.valuesOut.push(elemToPush)

            }


        }
        




        var sumArray = [];

        var f = colorEval();


        sumMap.forEach(function (value, key) {
            sumArray.push({item: key, sum: value.sum, display: value.display});
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

        //step = 1 hour by default
        svg.step = (urlJson.indexOf("pset=DAILY") === -1)?3600000:86400000;

        svg.valuesIn.forEach(function(elem){
            elem.x = (elem.x - svg.timeMin)/svg.step
        });

        svg.valuesOut.forEach(function(elem){
            elem.x = (elem.x - svg.timeMin)/svg.step
        });


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

        var xMax = (timeMax - svg.timeMin)/svg.step + 1;


        //Evaluation of the abscissa domain
        svg.x.domain([-0.625, xMax - 0.375]);

        var totalSumIn = [];
        var totalSumOut = [];

        var x = svg.valuesIn[0].x;
        var sum = 0;
        i = 0;

        while (x < xMax) {

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

        while (x < xMax) {

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
          .attr("stroke", "#000000");

        var selectionOut = svg.chartOutput.selectAll(".data")
          .data(svg.valuesOut)
          .enter().append("rect")
          .classed("data", true)
          .attr("fill", function (d) {
              return colorMap.get(d.item);
          })
          .attr("stroke", "#000000");


        drawChartDouble(svg,svg.yOutput.range()[0],svg.yInput.range()[0]);

        var selection = svg.selectAll(".data");

        //Tooltip creation
        var convertArray,valDisplay, isBytes = svg.units === "Bytes";
        selection.append("svg:title")
          .text(function (d) {
              convertArray = quantityConvertUnit(d.height,isBytes);
              valDisplay = sumMap.get(d.item).display;
              return ((d.item === valDisplay)?"":(valDisplay + "\n"))
                + d.item + "\n"
                + getDateFromAbscissa(svg,d.x).toString() + "\n"
                + ((Math.round(100 * d.height * convertArray[1])/100) + " " + convertArray[0] + svg.units) + "\n"
                + "(" +  d.height + " " + svg.units + ")";
          });


        function blink() {

            this.parentNode.appendChild(this);
            var rect = d3.select(this);

            var col1 = colorMap.get(rect.datum().item), col2 = "#ffffff", col3 = "#ff0000", col4 = "#000000";
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
            
            scrollToElementTableTransition(elem,table);

            selection.filter(testitem).each(blink);

        }

        function activationElemsAutoScrollPopup(d) {

            desactivationElems();
            svg.activeItem = d.item;


            function testitem(data) {
                return d.item == data.item;

            }

            var elem = trSelec.filter(testitem).classed("outlined", true);
            scrollToElementTableTransition(elem,table);


        }

        function desactivationElems() {

            if (svg.activeItem == null || svg.popup.pieChart !== null) {
                return;
            }


            function testitem(data) {
                return data.item == svg.activeItem;
            }

            trSelec.filter(testitem).classed("outlined", false);

            selection.filter(testitem).transition().duration(0).attr("stroke", "#000000").attr("fill", colorMap.get(svg.activeItem));

            svg.activeItem = null;

        }

        selection.on("mouseover", activationElemsAutoScroll).on("mouseout", desactivationElems);


        svg.axisx = svg.append("g")
          .attr("class", "axisGraph")
          .attr('transform', 'translate(' + [svg.margin.left, svg.heightOutput + svg.margin.top] + ")");

        svg.axisx.rect = svg.axisx.append("rect").classed("rectAxis", true).attr("height", svg.margin.zero - 1 ).attr("y",0.5);
        svg.axisx.path = svg.axisx.append("path");
        svg.axisx.call(d3.axisBottom(svg.x));
        svg.heightTick = svg.axisx.select(".tick").select("line").attr("y2");

        axisXDoubleDraw(svg);

        ticksSecondAxisXDouble(svg);

        legendAxisX(svg);


        axesDoubleCreation(svg);


        //TODO TODO TODO finir 
        //optionalAxesDoubleCreation(svg);



        gridDoubleGraph(svg);
        
        
        addPopup(selection,div,svg,function(data){
            desactivationElems();
            activationElemsAutoScrollPopup(data);},
            desactivationElems);

        //Legend creation
        var cA;
        var trSelec;
        trSelec = table.selectAll("tr").data(sumArray).enter().append("tr").attr("title", function (d) {

            cA = quantityConvertUnit(d.sum,isBytes);
            return ((d.item === d.display)?"":(d.display + "\n")) + d.item + "\n" 
              + "Overall volume: " + ((Math.round(100 * d.sum * cA[1])/100) + " " + cA[0] + svg.units) + "\n"
              + "(" +  d.sum + " " + svg.units + ")";
        });


        trSelec.append("td").append("div").classed("lgd", true).style("background-color", function (d) {
            return colorMap.get(d.item);
        });
        trSelec.append("td").text(function (d) {
            return d.display;
        });
        trSelec.on("mouseover", activationElems).on("mouseout", desactivationElems);


        //zoom



        addZoomDouble(svg, updateHisto2DStackDouble);
        d3.select(window).on("resize." + mydiv, function () {
            console.log("resize");
            redrawHisto2DStackDouble(div, svg);
        });

        hideShowValuesDouble(svg, trSelec, selectionIn, selectionOut, xMax);

    });


}


/***********************************************************************************************************/


function createHisto2DStackDoubleFormatVariation(div, svg, mydiv, urlJson){

    d3.json(urlJson, function (error, json) {

        svg.margin.left = 50;

        
        console.log(json);

        //test json conformity
        if (testJson(json) || error) {
            noData(div, svg,mydiv);
            return false;
        }

        //json ok, graph creation


        //table for legend
        svg.tableWidth = 200;

        var clientRect = div.node().getBoundingClientRect();
        var divWidth = Math.max(1.15 * svg.tableWidth + svg.margin.left + svg.margin.right + 1, clientRect.width),
          divHeight = Math.max(svg.margin.bottom + svg.margin.top + svg.margin.zero + 1, clientRect.height);




        svg.attr("width", divWidth - 1.15 * svg.tableWidth).attr("height", divHeight);


        svg.width = divWidth - 1.15 * svg.tableWidth - svg.margin.left - svg.margin.right;
        svg.height = divHeight - svg.margin.bottom - svg.margin.top;


        svg.x = d3.scaleLinear()
          .range([0, svg.width]);

        svg.yInput = d3.scaleLinear().clamp(true);

        svg.yOutput = d3.scaleLinear().clamp(true);

        svg.svg = svg.append("svg").attr("x", svg.margin.left).attr("y", svg.margin.top).attr("width", svg.width).attr("height", svg.height).classed("crisp",true);


        //Will contain the chart itself, without the axis
        svg.chartBackground = svg.svg.append("g");


        svg.chartInput = svg.svg.append('g');
        svg.chartOutput = svg.svg.append('g');


        //Will contain the axis and the rectselec, for a better display of scaling
        svg.frame = svg.svg.append("g");

        svg.selec = svg.frame.append("rect").attr("class", "rectSelec");



        json = json.response;
        var jsonData = json.data;
        var jsonContent = json.content;


        //step = 1 hour by default
        svg.step = (urlJson.indexOf("pset=MINUTE") === -1)?((urlJson.indexOf("pset=DAILY") === - 1)?3600000:86400000):60000;

        var contentDateValue = searchDateValue(jsonContent);

        //if no date value found, the graph can't be done.
        if(contentDateValue === false){
            noData(div,svg,mydiv);
            return;
        }

        //Now, no more nodata can happen,so we create the table
        var divtable = div.append("div").classed("diagram divtable", true);
        divtable.append("h4").classed("tableTitle", true).text("Legend");
        var table = divtable.append("table").classed("diagram font2 tableLegend", true).style("width", svg.tableWidth + "px").style("max-height",
          (divHeight - 2 * parseInt(div.style("font-size"),10) - 60) + "px");

        svg.units = unitsStringProcessing(json.units);

        console.log(json);



        svg.valuesIn = [];
        svg.valuesOut = [];

        var dataLength = jsonData.length;
        var contentLength = jsonContent.length;

        //More useful jsonContent. 0: item / 1: direction
        for(i = 0; i < contentLength; i++){

            if(i === contentDateValue){
                continue;
            }

            jsonContent[i] = jsonContent[i].split("_");
            jsonContent[i][0] = jsonContent[i][0].toUpperCase();

        }

        var colorMap = new Map();
        var sumMap = new Map();
        var i,j,k, elemJson, elemToPush, elemSumMap;
        svg.timeMin = Infinity;
        var timeMax = 0;


        var hourShift = getTimeShift(urlJson)  * 3600000;


        // Data are processed and sorted according to their direction.

        if(svg.step === 60000){
            
            var elemAmountMinuteArray;

            for(i = 0; i < dataLength; i++){
                elemJson = jsonData[i];

                for(j = 0; j < contentLength; j++){

                    if(j === contentDateValue){
                        continue;
                    }

                    elemAmountMinuteArray = elemJson[j];

                    for(k = 0; k < 60; k++) {


                        if(+elemAmountMinuteArray[k] === 0){
                            continue;
                        }

                        elemToPush = {
                            //The given time is the corresping, we add the correct minutes according to the position k
                            //of the element in the array
                            x: (new Date(elemJson[contentDateValue])).getTime() + k*svg.step + hourShift,
                            height: +elemAmountMinuteArray[k],
                            item: jsonContent[j][0],
                            direction: jsonContent[j][1]
                        };

                        // .display kept, can have an use someday
                        if (!sumMap.has(elemToPush.item)) {
                            sumMap.set(elemToPush.item, {sum: elemToPush.height, display: elemToPush.item});
                        } else {
                            elemSumMap = sumMap.get(elemToPush.item);
                            elemSumMap.sum += elemToPush.height;
                        }

                        svg.timeMin = Math.min(svg.timeMin, elemToPush.x);
                        timeMax = Math.max(timeMax, elemToPush.x);

                        if (elemToPush.direction === "in") {
                            elemToPush.direction = "inc";
                            svg.valuesIn.push(elemToPush);

                        } else {

                            svg.valuesOut.push(elemToPush)

                        }

                    }


                }


            }




        }else{


            for(i = 0; i < dataLength; i++){
                elemJson = jsonData[i];

                for(j = 0; j < contentLength; j++){

                    if(j === contentDateValue || +elemJson[j] === 0){
                        continue;
                    }

                    elemToPush = {
                        x: (new Date(elemJson[contentDateValue])).getTime() + hourShift,
                        height: +elemJson[j],
                        item: jsonContent[j][0],
                        direction: jsonContent[j][1]
                    };

                    // .display kept, can have an use someday
                    if (!sumMap.has(elemToPush.item)) {
                        sumMap.set(elemToPush.item, {sum: elemToPush.height,display: elemToPush.item});
                    } else {
                        elemSumMap = sumMap.get(elemToPush.item);
                        elemSumMap.sum += elemToPush.height;
                    }

                    svg.timeMin = Math.min(svg.timeMin,elemToPush.x);
                    timeMax = Math.max(timeMax,elemToPush.x);

                    if(elemToPush.direction === "in"){
                        elemToPush.direction = "inc";
                        svg.valuesIn.push(elemToPush);

                    }else{

                        svg.valuesOut.push(elemToPush)

                    }


                }


            }

        }





        var sumArray = [];

        var f = colorEval();


        sumMap.forEach(function (value, key) {
            sumArray.push({item: key, sum: value.sum, display: value.display});
        });

        sumArray.sort(function (a, b) {

            if (a.item == "OTHERS") {
                return -1;
            }
            if (b.item == "OTHERS") {
                return 1;
            }
            return b.sum - a.sum;
        });


        console.log(sumArray);
        //The most importants elements should have distinct colors.
        i = 0;
        if (sumArray[0].item == "OTHERS") {
            colorMap.set(sumArray[0].item, "#f2f2f2");
            i = 1;
        }

        while (i < sumArray.length) {
            colorMap.set(sumArray[i].item, f());
            i++;
        }


        console.log(colorMap);


        svg.valuesIn.forEach(function(elem){
            elem.x = (elem.x - svg.timeMin)/svg.step
        });

        svg.valuesOut.forEach(function(elem){
            elem.x = (elem.x - svg.timeMin)/svg.step
        });


        function sortValues(a, b) {

            if (a.x - b.x != 0) {
                return a.x - b.x;
            }
            if (a.item == "OTHERS") {
                return -1;
            }
            if (b.item == "OTHERS") {
                return 1;
            }
            return b.height - a.height;
        }

        svg.valuesIn.sort(sortValues);
        svg.valuesOut.sort(sortValues);

        var xMax = (timeMax - svg.timeMin)/svg.step + 1;


        //Evaluation of the abscissa domain
        svg.x.domain([-0.625, xMax - 0.375]);

        var totalSumIn = [];
        var totalSumOut = [];

        var x = svg.valuesIn[0].x;
        var sum = 0;
        i = 0;

        while (x < xMax) {

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

        while (x < xMax) {

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
          .attr("stroke", "#000000");

        var selectionOut = svg.chartOutput.selectAll(".data")
          .data(svg.valuesOut)
          .enter().append("rect")
          .classed("data", true)
          .attr("fill", function (d) {
              return colorMap.get(d.item);
          })
          .attr("stroke", "#000000");


        drawChartDouble(svg,svg.yOutput.range()[0],svg.yInput.range()[0]);

        var selection = svg.selectAll(".data");

        //Tooltip creation
        var convertArray,valDisplay, isBytes = svg.units === "Bytes";
        selection.append("svg:title")
          .text(function (d) {
              convertArray = quantityConvertUnit(d.height, isBytes);
              valDisplay = sumMap.get(d.item).display;
              return ((d.item === valDisplay)?"":(valDisplay + "\n"))
                + d.item + "\n"
                + getDateFromAbscissa(svg,d.x).toString() + "\n"
                + ((Math.round(100 * d.height * convertArray[1])/100) + " " + convertArray[0] + svg.units) + "\n"
                + "(" +  d.height + " " + svg.units + ")";
          });


        function blink() {

            this.parentNode.appendChild(this);
            var rect = d3.select(this);

            var col1 = colorMap.get(rect.datum().item), col2 = "#ffffff", col3 = "#ff0000", col4 = "#000000";
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

            scrollToElementTableTransition(elem,table);

            selection.filter(testitem).each(blink);

        }

        function activationElemsAutoScrollPopup(d) {

            desactivationElems();
            svg.activeItem = d.item;


            function testitem(data) {
                return d.item == data.item;

            }

            var elem = trSelec.filter(testitem).classed("outlined", true);
            scrollToElementTableTransition(elem,table);


        }

        function desactivationElems() {

            if (svg.activeItem == null || svg.popup.pieChart !== null) {
                return;
            }


            function testitem(data) {
                return data.item == svg.activeItem;
            }

            trSelec.filter(testitem).classed("outlined", false);

            selection.filter(testitem).transition().duration(0).attr("stroke", "#000000")
              .attr("fill", colorMap.get(svg.activeItem));

            svg.activeItem = null;

        }

        selection.on("mouseover", activationElemsAutoScroll).on("mouseout", desactivationElems);


        svg.axisx = svg.append("g")
          .attr("class", "axisGraph")
          .attr('transform', 'translate(' + [svg.margin.left, svg.heightOutput + svg.margin.top] + ")");

        svg.axisx.rect = svg.axisx.append("rect").classed("rectAxis", true).attr("height", svg.margin.zero - 1 ).attr("y",0.5);
        svg.axisx.path = svg.axisx.append("path");
        svg.axisx.call(d3.axisBottom(svg.x));
        svg.heightTick = svg.axisx.select(".tick").select("line").attr("y2");

        axisXDoubleDraw(svg);

        ticksSecondAxisXDouble(svg);

        legendAxisX(svg);


        axesDoubleCreation(svg);

        gridDoubleGraph(svg);




        addPopup(selection,div,svg,function(data){
              desactivationElems();
              activationElemsAutoScrollPopup(data);},
          desactivationElems);

        //Legend creation
        var cA;
        var trSelec;
        trSelec = table.selectAll("tr").data(sumArray).enter().append("tr").attr("title", function (d) {

            cA = quantityConvertUnit(d.sum, isBytes);
            return ((d.item === d.display)?"":(d.display + "\n")) + d.item + "\n"
              + "Overall volume: " + ((Math.round(100 * d.sum * cA[1])/100) + " " + cA[0] + svg.units) + "\n"
              + "(" +  d.sum + " " + svg.units + ")";
        });


        trSelec.append("td").append("div").classed("lgd", true).style("background-color", function (d) {
            return colorMap.get(d.item);
        });
        trSelec.append("td").text(function (d) {
            return d.display;
        });
        trSelec.on("mouseover", activationElems).on("mouseout", desactivationElems);


        //zoom



        addZoomDouble(svg, updateHisto2DStackDouble);
        d3.select(window).on("resize." + mydiv, function () {
            console.log("resize");
            redrawHisto2DStackDouble(div, svg);
        });

        hideShowValuesDouble(svg, trSelec, selectionIn, selectionOut, xMax);

    });


}


/***********************************************************************************************************/

function createHisto2DStackSimple(div,svg,mydiv, urlJson){


    d3.json(urlJson, function (error, json) {

        svg.margin.left = 50;

        console.log(json);

        //test json conformity
        if (testJson(json) || error) {
            console.log("incorrect url/data");
            noData(div, svg,mydiv);
            return false;
        }

        //json ok, graph creation


        //table for legend
        svg.tableWidth = 200;

        var clientRect = div.node().getBoundingClientRect();
        var divWidth = Math.max(1.15 * svg.tableWidth + svg.margin.left + svg.margin.right + 1, clientRect.width),
          divHeight = Math.max(svg.margin.bottom + svg.margin.top + svg.margin.zero + 1, clientRect.height);



        svg.attr("width", divWidth - 1.15 * svg.tableWidth).attr("height", divHeight);


        svg.width = divWidth - 1.15 * svg.tableWidth - svg.margin.left - svg.margin.right;
        svg.height = divHeight - svg.margin.bottom - svg.margin.top;


        svg.x = d3.scaleLinear()
          .range([0, svg.width]);

        svg.y = d3.scaleLinear().clamp(true);

        svg.svg = svg.append("svg").attr("x", svg.margin.left).attr("y", svg.margin.top).attr("width", svg.width).attr("height", svg.height).classed("crisp",true);

        svg.grid = svg.svg.append("g").classed("grid", true);

        //Will contain the chart itself, without the axis
        svg.chart = svg.svg.append("g");


        //Will contain the axis and the rectselec, for a better display of scaling
        svg.frame = svg.svg.append("g");

        svg.selec = svg.frame.append("rect").attr("class", "rectSelec");




        json = json.response;
        var jsonData = json.data;
        var jsonContent = json.content;
        console.log(json);



        var contentItemValue = searchItemValue(jsonContent);
        var contentDateValue = searchDateValue(jsonContent);
        var contentAmountValue = searchAmountValue(jsonContent);


        //optional display value for legend, no guaranty on uniqueness/existence.
        var contentDisplayValue = searchDisplayValue(jsonContent);

        //if no display value, then the display value is the item value.
        if (contentDisplayValue === false){
            contentDisplayValue = contentItemValue;
        }


        //if no item/date/amount value found, the graph can't be done.
        if(contentItemValue === false || contentDateValue === false || contentAmountValue === false){
            noData(div,svg,mydiv);
            return;
        }


        //Now, no more nodata can happen,so we create the table
        var divtable = div.append("div").classed("diagram divtable", true);
        divtable.append("h4").classed("tableTitle", true).text("Legend");
        var table = divtable.append("table").classed("diagram font2 tableLegend", true).style("width", svg.tableWidth + "px").style("max-height",
          (divHeight - 2 * parseInt(div.style("font-size"),10) - 60) + "px");

        svg.units = unitsStringProcessing(json.units);

        svg.values = [];

        var dataLength = jsonData.length;

        var colorMap = new Map();
        var sumMap = new Map();
        var sumMapByX = new Map();

        var i, elemJson, elemToPush, elemSumMap;
        svg.timeMin = Infinity;
        var timeMax = 0;



        var hourShift = getTimeShift(urlJson)  * 3600000;


        // Data are processed and sorted.
        for(i = 0; i < dataLength; i++){
            elemJson = jsonData[i];

            if(+elemJson[contentAmountValue] === 0){
                continue;
            }

            elemToPush = {
                x: (new Date(elemJson[contentDateValue])).getTime() + hourShift,
                height: +elemJson[contentAmountValue],
                item: (elemJson[contentItemValue] === "")?" Remainder ":elemJson[contentItemValue]
            };

            elemToPush.display = (elemToPush.item === " Remainder ")?" Remainder ":(elemJson[contentDisplayValue] === "")?elemToPush.item:elemJson[contentDisplayValue];

            if(!sumMapByX.has(elemToPush.x)){
                sumMapByX.set(elemToPush.x,elemToPush.height);
            }{
                sumMapByX.set(elemToPush.x,sumMapByX.get(elemToPush.x) + elemToPush.height);
            }



            svg.timeMin = Math.min(svg.timeMin,elemToPush.x);
            timeMax = Math.max(timeMax,elemToPush.x);


            svg.values.push(elemToPush);


        }









        //Compute 1% of total amount by date.
        sumMapByX.forEach(function(value, key){
           sumMapByX.set(key,value/100)
        });

        var elemValue, valuesLength = svg.values.length;
        i = 0;
        while(i < valuesLength){

            elemValue = svg.values[i];

            if(elemValue.height < sumMapByX.get(elemValue.x)){
                svg.values.splice(i,1);
                valuesLength --;
            }else{
                i++;
            }

        }



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

        //values are sorted according primarily x (date) then height.

        svg.values.sort(sortValues);

        console.log(sumMapByX);


        //step = 1 hour by default
        svg.step = (urlJson.indexOf("pset=DAILY") === -1)?3600000:86400000;



        svg.values.forEach(function(elem,i){
            elem.x = (elem.x - svg.timeMin)/svg.step;

            if (!sumMap.has(elem.item)) {
                sumMap.set(elem.item, {sum: elem.height,display: elem.display});
            } else {
                elemSumMap = sumMap.get(elem.item);
                elemSumMap.sum += elem.height;
            }

            svg.values[i] = {x:elem.x,height:elem.height,item:elem.item};

        });


        var xMax = (timeMax - svg.timeMin)/svg.step + 1;


        var sumArray = [];

        var f = colorEval();


        sumMap.forEach(function (value, key) {
            sumArray.push({item: key, sum: value.sum, display: value.display});
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





        //Evaluation of the abscissa domain
        svg.x.domain([-0.625, xMax - 0.375]);

        var totalSum = [];

        var x = svg.values[0].x;
        var sum;
        i = 0;

        while (x < xMax) {
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


        svg.newX = d3.scaleLinear().range(svg.x.range()).domain(svg.x.domain());
        svg.newY = d3.scaleLinear().range(svg.y.range()).domain(svg.y.domain());

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
          .attr("stroke", "#000000");


        //Tooltip creation
        var convertArray,valDisplay;
        selection.append("svg:title")
          .text(function (d) {
              convertArray = quantityConvertUnit(d.height);
              valDisplay = sumMap.get(d.item).display;
              return ((d.item === valDisplay)?"":(valDisplay + "\n"))
                + d.item + "\n"
                + getDateFromAbscissa(svg,d.x).toString() + "\n"
                + ((Math.round(100 * d.height * convertArray[1])/100) + " " + convertArray[0] + svg.units) + "\n"
                + "(" +  d.height + " " + svg.units + ")";
          });


        function blink() {

            this.parentNode.appendChild(this);
            var rect = d3.select(this);

            var col1 = colorMap.get(rect.datum().item), col2 = "#ffffff", col3 = "#ff0000", col4 = "#000000";
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
            scrollToElementTableTransition(elem,table);


            selection.filter(testitem).each(blink);

        }

        function activationElemsAutoScrollPopup(d) {

            desactivationElems();
            svg.activeItem = d.item;


            function testitem(data) {
                return d.item == data.item;

            }

            var elem = trSelec.filter(testitem).classed("outlined", true);
            scrollToElementTableTransition(elem,table);


        }

        function desactivationElems() {

            if (svg.activeItem == null || svg.popup.pieChart !== null) {
                return;
            }


            function testitem(data) {
                return data.item == svg.activeItem;
            }

            trSelec.filter(testitem).classed("outlined", false);

            selection.filter(testitem).transition().duration(0).attr("stroke", "#000000").attr("fill", colorMap.get(svg.activeItem));

            svg.activeItem = null;

        }

        selection.on("mouseover", activationElemsAutoScroll).on("mouseout", desactivationElems);


        svg.axisx = svg.append("g")
          .attr("class", "axisGraph")
          .attr('transform', 'translate(' + [svg.margin.left, svg.height + svg.margin.top] + ")");

        svg.axisx.call(d3.axisBottom(svg.x));

        legendAxisX(svg);

        svg.axisy = svg.append("g").attr('transform', 'translate(' + [svg.margin.left, svg.margin.top] + ')')
          .attr("class", "axisGraph");
        svg.axisy.call(d3.axisLeft(svg.y));

        niceTicks(svg.axisy);

        gridSimpleGraph(svg);


        //      Label of the y axis
        svg.ylabel = svg.axisy.append("text")
          .attr("class", "labelGraph")
          .attr("text-anchor", "middle")
          .attr("dy", "1em")
          .attr('y', -svg.margin.left)
          .attr("x", -svg.height / 2)
          .attr("transform", "rotate(-90)");

        axisYLegendSimple(svg);

        addPopup(selection,div,svg,function(data){
              desactivationElems();
              activationElemsAutoScrollPopup(data);},
          desactivationElems);

        //Legend creation

        var cA;
        var trSelec;
        trSelec = table.selectAll("tr").data(sumArray).enter().append("tr").attr("title", function (d) {

            cA = quantityConvertUnit(d.sum);
            return ((d.item === d.display)?"":(d.display + "\n")) + d.item + "\n"
              + "Overall volume: " + ((Math.round(100 * d.sum * cA[1])/100) + " " + cA[0] + svg.units) + "\n"
              + "(" +  d.sum + " " + svg.units + ")";
        });

        trSelec.append("td").append("div").classed("lgd", true).style("background-color", function (d) {
            return colorMap.get(d.item);
        });
        trSelec.append("td").text(function (d) {
            return d.display;
        });
        trSelec.on("mouseover", activationElems).on("mouseout", desactivationElems);


        //zoom




        addZoomSimple(svg, updateHisto2DStackSimple);

        d3.select(window).on("resize." + mydiv, function () {
            console.log("resize");
            redrawHisto2DStackSimple(div, svg);
        });

        hideShowValuesSimple(svg, trSelec, selection, xMax);

    });





}

/***********************************************************************************************************/

function hideShowValuesSimple(svg,trSelec,selection,xlength){
    var duration = 800;

    var trSelecSize = trSelec.size();

    var hiddenValues = [];
    var stringified = JSON.stringify(svg.values);
    var newValues = JSON.parse(stringified);
    var valuesTrans = JSON.parse(stringified);
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
                clickedRow.classed("strikedRow",true);




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
                clickedRow.classed("strikedRow",false);


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
                updateHisto2DStackSimple(svg);

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

                trSelec.classed("strikedRow",true);
                clickedRow.classed("strikedRow",false);

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
                trSelec.classed("strikedRow",false);

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
                updateHisto2DStackSimple(svg);

            }
        });

    });

}



/***********************************************************************************************************/

function hideShowValuesDouble(svg,trSelec,selectionIn,selectionOut,xlength){
    var duration = 800;
    var trSelecSize = trSelec.size();
    var hiddenValues = [];
    var stringifiedIn = JSON.stringify(svg.valuesIn);
    var stringifiedOut = JSON.stringify(svg.valuesOut);

    var newValuesIn = JSON.parse(stringifiedIn);
    var newValuesOut = JSON.parse(stringifiedOut);
    var valuesInTrans = JSON.parse(stringifiedIn);
    var valuesOutTrans = JSON.parse(stringifiedOut);
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
                clickedRow.classed("strikedRow",true);



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
                clickedRow.classed("strikedRow",false);


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

                var marginViewTop = Math.min(svg.height,Math.max(-svg.margin.zero,
                  svg.heightOutput*svg.transform.k*svg.scaley+svg.transform.y));
                var marginViewBottom = marginViewTop + svg.margin.zero;

                svg.yInput.range([svg.heightOutput+svg.margin.zero,svg.height]);
                svg.yOutput.range([svg.heightOutput,0]);
                svg.yInput.domain([0,totalInTrans*1.1]);
                svg.yOutput.domain([0,totalOutTrans*1.1]);
                svg.newYOutput.range([marginViewTop,Math.min(marginViewTop,0)]);
                svg.newYInput.range([marginViewBottom, Math.max(marginViewBottom,svg.height)]);
                svg.newYOutput.domain([svg.yOutput.invert(svg.height/(svg.transform.k*svg.scaley) + actTranslate1),
                    svg.yOutput.invert(actTranslate1)]);

                svg.newYInput.domain([svg.yInput.invert(actTranslate1  + (1-1/(svg.transform.k*svg.scaley))*svg.margin.zero),
                    svg.yInput.invert(actTranslate1 + (1-1/(svg.transform.k*svg.scaley))*svg.margin.zero + svg.height/(svg.transform.k*svg.scaley))]);


                updateHisto2DStackDouble(svg);

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

                trSelec.classed("strikedRow", true);
                clickedRow.classed("strikedRow", false);



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
                trSelec.classed("strikedRow", false);

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

                var marginViewTop = Math.min(svg.height,Math.max(-svg.margin.zero,
                  svg.heightOutput*svg.transform.k*svg.scaley+svg.transform.y));

                var marginViewBottom = marginViewTop + svg.margin.zero;

                svg.yInput.range([svg.heightOutput+svg.margin.zero,svg.height]);
                svg.yOutput.range([svg.heightOutput,0]);
                svg.yInput.domain([0,totalInTrans*1.1]);
                svg.yOutput.domain([0,totalOutTrans*1.1]);
                svg.newYOutput.range([marginViewTop,Math.min(marginViewTop,0)]);
                svg.newYInput.range([marginViewBottom, Math.max(marginViewBottom,svg.height)]);
                svg.newYOutput.domain([svg.yOutput.invert(svg.height/(svg.transform.k*svg.scaley) + actTranslate1),
                    svg.yOutput.invert(actTranslate1)]);

                svg.newYInput.domain([svg.yInput.invert(actTranslate1  + (1-1/(svg.transform.k*svg.scaley))*svg.margin.zero),
                    svg.yInput.invert(actTranslate1 + (1-1/(svg.transform.k*svg.scaley))*svg.margin.zero + svg.height/(svg.transform.k*svg.scaley))]);


                updateHisto2DStackDouble(svg);

            }



        });


    });


}




/***********************************************************************************************************/



function updateHisto2DStackSimple(svg){

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

    legendAxisX(svg);

    svg.axisy.call(d3.axisLeft(svg.newY));

    niceTicks(svg.axisy);

    axisYLegendSimple(svg);

    gridSimpleGraph(svg);

}



/***********************************************************************************************************/



function updateHisto2DStackDouble(svg){

/*
    svg.chartOutput.attr("transform","matrix(" + (svg.scalex*svg.scale) + ", 0, 0, " + (svg.scaley*svg.scale) + ", " + svg.translate[0] + "," + svg.translate[1] + ")" );
    svg.chartInput.attr("transform","matrix(" + (svg.scalex*svg.scale) + ", 0, 0, " + (svg.scaley*svg.scale) + ", " + svg.translate[0] + "," + (svg.translate[1] - (svg.scaley*svg.scale-1)*svg.margin.zero) + ")" );
*/


    var newHeightOutput = svg.newYOutput(svg.yOutput.domain()[0]);
    var newHOmarg = svg.newYInput(svg.yInput.domain()[0]);

    var effectiveNewHeightOutput = Math.min(newHeightOutput, svg.height);
    svg.rectInput.attr("y", newHOmarg).attr("height",Math.max(0,svg.height-newHOmarg));
    svg.textOutput.attr("transform", "translate(" + (svg.width/2) + "," +(effectiveNewHeightOutput/8 +
        parseFloat(getComputedStyle(svg.textOutput.node()).fontSize)) + ")");



    svg.textInput.attr("transform", "translate(" + (svg.width/2) + "," +
        ((svg.height + Math.max(0,newHOmarg)/3) *0.75) + ")");


    drawChartDouble(svg,newHeightOutput,newHOmarg);

    svg.axisx.call(d3.axisBottom(svg.newX));

    ticksSecondAxisXDouble(svg);

    legendAxisX(svg);

    svg.axisx.attr("transform","matrix(1, 0, 0, 1," + svg.margin.left+ "," + Math.min(svg.margin.top + svg.height,Math.max(svg.margin.top - svg.margin.zero,(svg.heightOutput)*svg.transform.k*svg.scaley +svg.margin.top + svg.transform.y)) + ")" );


    axesDoubleUpdate(svg);

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
    var mouseCoord = [NaN,NaN];

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

    var marginViewTop, marginViewBottom;
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
                    //console.log("x: " + (calcCoord[0] - mouse[0]).toFixed(5) + " y: " + (calcCoord[1] - mouse[1]).toFixed(5));

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

                marginViewTop = Math.min(svg.height,Math.max(-svg.margin.zero,
                  svg.heightOutput*svg.transform.k*svg.scaley+svg.transform.y));

                marginViewBottom = marginViewTop + svg.margin.zero;

                //actualization of the current (newX&Y) scales domains
                svg.newX.domain([ svg.x.invert(actTranslate[0]), svg.x.invert(actTranslate[0] + svg.width/(svg.transform.k*svg.scalex)) ]);

                svg.newYOutput.range([marginViewTop,Math.min(marginViewTop,0)]);
                svg.newYInput.range([marginViewBottom, Math.max(marginViewBottom,svg.height)]);

                svg.newYOutput.domain([svg.yOutput.invert(svg.height/(svg.transform.k*svg.scaley) + actTranslate[1]),
                    svg.yOutput.invert(actTranslate[1])]);

                svg.newYInput.domain([svg.yInput.invert(actTranslate[1]  + (1-1/(svg.transform.k*svg.scaley))*svg.margin.zero),
                    svg.yInput.invert(actTranslate[1] + (1-1/(svg.transform.k*svg.scaley))*svg.margin.zero + svg.height/(svg.transform.k*svg.scaley))]);



                updateFunction(svg);



            } else {

                mouseCoord = d3.mouse(svg.frame.node());

                //Drawing of the selection rect
                //console.log("carré mousecoord " + mouseCoord + " start " + startCoord );

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

            if(null !== d3.event.sourceEvent && d3.event.sourceEvent.shiftKey){
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
                    marginViewTop = Math.min(svg.height,Math.max(-svg.margin.zero,
                      svg.heightOutput*svg.transform.k*svg.scaley+svg.transform.y));
                    marginViewBottom = marginViewTop + svg.margin.zero;


                    //actualization of the current (newX&Y) scales domains
                    svg.newX.domain([ svg.newX.invert(xmin), svg.newX.invert(xmin + sqwidth)]);

                    svg.newYOutput.range([marginViewTop,Math.min(marginViewTop,0)]);
                    svg.newYInput.range([marginViewBottom, Math.max(marginViewBottom,svg.height)]);

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

    //A fresh start...
    svg._groups[0][0].__zoom.k =svg.transform.k;
    svg._groups[0][0].__zoom.x =svg.transform.x;
    svg._groups[0][0].__zoom.y =svg.transform.y;
}
/************************************************************************************************************/

function redrawHisto2DStackDouble(div,svg){

    var clientRect = div.node().getBoundingClientRect();
    var divWidth = Math.max(1.15*svg.tableWidth + svg.margin.left + svg.margin.right + 1, clientRect.width),
      divHeight = Math.max(svg.margin.bottom + svg.margin.top + svg.margin.zero + 1, clientRect.height);
    //console.log("width " + divWidth );

    var oldsvgheight = svg.height;
    var oldsvgwidth = svg.width;

    svg.attr("width",divWidth-1.15*svg.tableWidth).attr("height",divHeight);

    svg.width = divWidth-1.15*svg.tableWidth - svg.margin.left - svg.margin.right;
    svg.height = divHeight - svg.margin.bottom - svg.margin.top;
    div.select("table").style("max-height",
      (divHeight - 2*parseInt(div.style("font-size"),10) -60)  + "px");

    var oldheightoutput = svg.heightOutput;

    
    var margIncTransl = Math.max(-svg.margin.zero,Math.min(svg.transform.y + (svg.transform.k*svg.scaley)*oldheightoutput,0));
    var margInView = Math.max(-svg.margin.zero,Math.min((svg.transform.y-oldsvgheight) + (svg.transform.k*svg.scaley)*oldheightoutput,0)) - margIncTransl;

    var oldheightData = svg.heightData;
    svg.heightData = svg.height - svg.margin.zero;
    svg.heightOutput = svg.heightOutput*svg.heightData/oldheightData;


    //console.log("marginview " + margInView);

  
    var ratiox = svg.width/oldsvgwidth;

    svg.x.range([0, svg.width]);

    svg.yInput.range([svg.heightOutput+svg.margin.zero,svg.height]);
    svg.yOutput.range([svg.heightOutput,0]);

    svg.svg.attr("width",svg.width).attr("height",svg.height);



    svg.rectInput.attr("width",svg.width);

    axisXDoubleDraw(svg);

    svg.ylabel.attr("x",- svg.height/2).attr('y',- svg.margin.left);

    svg.frame.select(".rectOverlay").attr("height",svg.height);



    //console.log("marincltransl " + margIncTransl);
    svg.transform.y = (svg.transform.y - margIncTransl) * (svg.height + margInView)/(oldsvgheight + margInView) + margIncTransl;
    svg.transform.x *= ratiox;

    var oldscaleytot = svg.transform.k*svg.scaley;

    var scaleytot = oldscaleytot * (svg.height + margInView) * oldheightData / (svg.heightData * (oldsvgheight + margInView)) ;
 
    var scalextot = svg.transform.k*svg.scalex;
 
    svg.transform.k = Math.max(scalextot,scaleytot);
    svg.scalex = scalextot/svg.transform.k;
    svg.scaley = scaleytot/svg.transform.k;

    svg.newX.range([0,svg.width]);

    var marginViewTop = Math.min(svg.height,Math.max(-svg.margin.zero,
      svg.heightOutput*scaleytot+svg.transform.y));

    var marginViewBottom = marginViewTop + svg.margin.zero;

    svg.newYOutput.range([marginViewTop,Math.min(marginViewTop,0)]);
    svg.newYInput.range([marginViewBottom, Math.max(marginViewBottom,svg.height)]);


    svg._groups[0][0].__zoom.k =svg.transform.k;
    svg._groups[0][0].__zoom.x =svg.transform.x;
    svg._groups[0][0].__zoom.y =svg.transform.y;

    updateHisto2DStackDouble(svg);

    redrawPopup(div, svg);


}

/************************************************************************************************************/

function redrawHisto2DStackSimple(div,svg){
    var clientRect = div.node().getBoundingClientRect();
    var divWidth = Math.max(1.15*svg.tableWidth + svg.margin.left + svg.margin.right + 1, clientRect.width),
      divHeight = Math.max(svg.margin.bottom + svg.margin.top + svg.margin.zero + 1, clientRect.height);
    //console.log("width " + divWidth );

    var oldsvgheight = svg.height;
    var oldsvgwidth = svg.width;

    svg.attr("width",divWidth-1.15*svg.tableWidth).attr("height",divHeight);

    svg.width = divWidth-1.15*svg.tableWidth - svg.margin.left - svg.margin.right;
    svg.height = divHeight - svg.margin.bottom - svg.margin.top;
    div.select("table").style("max-height",
      (divHeight - 2*parseInt(div.style("font-size"),10) -60)  + "px");


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

    updateHisto2DStackSimple(svg);

    redrawPopup(div, svg);


}





/************************************************************************************************************

 convert bytes to NiB string

************************************************************************************************************/

function bytesConvert(nbBytes){

    var exp = Math.min(8,Math.max(0,Math.floor(Math.log(nbBytes)/Math.log(1024))));

    var value = Math.round(nbBytes*Math.pow(1024,-exp) * 100)/100;


    switch (exp){

        default:
        case 0:
            return value + " B";
        case 1 :
            return value + " KiB";
        case 2 :
            return value + " MiB";
        case 3 :
            return value + " GiB";
        case 4 :
            return value + " TiB";
        case 5 :
            return value + " PiB";
        case 6 :
            return value + " EiB";
        case 7 :
            return value + " ZiB";
        case 8 :
            return value + " YiB";
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


    //non homogeneous repartition circle hsl. (optional: to test usefulness maybe sometimes)

    //specify the repartition. should be comprised between 0 & 60/Math.PI (env. 19.09), function not injective if greater.
    var coef = 15;

    //specify the period, do not tweak
    var theta = Math.PI/60;

    function display(x){
        return x + coef*Math.sin(theta*x);
        //return x;
    }

    //y: saturation
    //z: lightness
    var y = 5;
    var z = 5;

    var starty = 0.45;
    var startz = 0.45;
    var segmy = (1 - starty)/6;
    var segmz = (0.80 - startz)/10;

    var s = starty + segmy*y;
    var l = startz + segmz*z;


    return function(){
        i++;
        color = d3.hsl(display(val),s,l);
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


        y = (y+3)%7;
        z = (z+4)%11;
        s = y*segmy +starty;
        l= z*segmz +startz;

        //console.log(color.h);

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
                  //console.log("x: " + (calcCoord[0] - mouse[0]).toFixed(5) + " y: " + (calcCoord[1] - mouse[1]).toFixed(5));

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
          if(null !== d3.event.sourceEvent && d3.event.sourceEvent.shiftKey){
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

    //A fresh start...
    svg._groups[0][0].__zoom.k =svg.transform.k;
    svg._groups[0][0].__zoom.x =svg.transform.x;
    svg._groups[0][0].__zoom.y =svg.transform.y;

}


/************************************************************************************************************/

function createCurve(div, svg, mydiv, urlJson){


    d3.json(urlJson, function (error, json) {


        console.log(json);

        //test json conformity
        if (testJson(json) || error ) {
            console.log("incorrect url/data");
            noData(div, svg,mydiv);
            return false;
        }

        //json ok, graph creation

        json = json.response;
        console.log(json);

        var clientRect = div.node().getBoundingClientRect();
        var divWidth = Math.max(svg.margin.left + svg.margin.right + 1, clientRect.width),
          divHeight = Math.max(svg.margin.bottom + svg.margin.top + 1, clientRect.height);

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

        svg.valueline = d3.line().curve(d3.curveMonotoneX);
        svg.area = d3.area().curve(d3.curveMonotoneX);
        
        var jsonData = json.data;
        var jsonContent = json.content;
        svg.units = unitsStringProcessing(json.units);

        var contentAmountValue = searchAmountValue(jsonContent);
        var contentDateValue = searchDateValue(jsonContent);

        //if no date/amount value found, the graph can't be done.
        if(contentAmountValue === false || contentDateValue === false){
            noData(div,svg,mydiv);
            return;
        }

        var hourShift = getTimeShift(urlJson) * 3600000;


        //Conversion date to elapsed time since 1st January 1970.
        jsonData.forEach(function(elem){
            elem[contentDateValue] = (new Date(elem[contentDateValue])).getTime() + hourShift;
        });

        //sort, to make sure
        jsonData.sort(function(a,b){return a[contentDateValue] - b[contentDateValue];});


        var jsonDataLength = jsonData.length;


        svg.step = (urlJson.indexOf("pset=MINUTE") === -1)?((urlJson.indexOf("pset=DAILY") === - 1)?3600000:86400000):60000;
        svg.timeMin = jsonData[0][contentDateValue];

        var index,elemJson;

        svg.data = [];


        //Final data array construction.
        for(var i = 0; i < jsonDataLength; i++){

            elemJson = jsonData[i];
            index = (elemJson[contentDateValue] - svg.timeMin)/svg.step;

            //Fill the gaps in the dates with 0s;
            while(svg.data.length < index){
                svg.data.push(0);
            }

            if(svg.step === 60000){
                //pset=MINUTE

                var amountArray = elemJson[contentAmountValue];


                for(var j = 0; j < 60; j++){

                    svg.data.push(+amountArray[j]);

                }

            }else {

                svg.data.push(+elemJson[contentAmountValue]);

            }
        }

        var dataLength = svg.data.length;


        svg.x.domain([0, dataLength - 1]);

        //*1.05 for margin
        svg.y.domain([0, d3.max(svg.data) * 1.05]);




        console.log(svg.data);


        svg.chart.append("path").classed("lineGraph", true);
        svg.chart.append("path").classed("area", true);

        svg.area.x(function (d,i) {
            return svg.x(i);
        }).y1(function (d) {
            return svg.y(d);
        }).y0(svg.y.range()[0]);


        svg.valueline
          .x(function (d,i) {
              return svg.x(i);
          }).y(function (d) {
            return svg.y(d);
        });


        svg.axisx = svg.append("g")
          .classed("x axisGraph", true)
          .attr('transform', 'translate(' + [svg.margin.left, svg.height + svg.margin.top] + ")");

        svg.axisx.call(d3.axisBottom(svg.x));

        svg.axisy = svg.append("g").attr('transform', 'translate(' + [svg.margin.left, svg.margin.top] + ')').classed("y axisGraph", true);
        svg.axisy.call(d3.axisLeft(svg.y));

        niceTicks(svg.axisy);

        gridSimpleGraph(svg, true);

        //      Label of the y axis
        svg.ylabel = svg.axisy.append("text")
          .attr("class", "labelGraph")
          .attr("text-anchor", "middle")
          .attr("dy", "1em")
          .attr('y', -svg.margin.left)
          .attr("x", -svg.height / 2)
          .attr("transform", "rotate(-90)");


        svg.newX = d3.scaleLinear().range(svg.x.range()).domain(svg.x.domain());
        svg.newY = d3.scaleLinear().range(svg.y.range()).domain(svg.y.domain());

        axisYLegendSimple(svg);

        legendAxisX(svg);

        svg.newValueline = d3.line().curve(d3.curveMonotoneX);
        svg.newArea = d3.area().curve(d3.curveMonotoneX);


        svg.newArea.x(function (d,i) {
            return svg.newX(i);
        }).y1(function (d) {
            return svg.newY(d);
        }).y0(svg.newY.range()[0]);


        svg.newValueline
          .x(function (d,i) {
              return svg.newX(i);
          }).y(function (d) {
            return svg.newY(d);
        });

        var mouseCoordX;


        addCirclePosition(svg);

        svg.transition("start").duration(800).tween("", function () {

            var data = JSON.parse(JSON.stringify(svg.data));
            var line = svg.chart.select(".lineGraph");
            var area = svg.chart.select(".area");

            return function (t) {
                t = Math.min(1, Math.max(0, t));
                data.forEach(function (value, i) {
                    svg.data[i] = value * t;
                });

                updateCirclePosition(svg,mouseCoordX);
                line.attr("d", svg.newValueline(svg.data));
                area.attr("d", svg.newArea(svg.data));
            }
        }).on("start",function(){

            var nodeRef = svg.svg.node();
            svg.on("mousemove.start", function(){

                mouseCoordX = d3.mouse(nodeRef)[0];

            })

        }).on("end", function(){

            svg.on("mousemove.start", null);

        });




        addZoomSimple(svg, updateCurve);

        d3.select(window).on("resize." + mydiv, function () {
            console.log("resize");
            console.log(d3.event);
            redrawCurve(div, svg);
        });
        

    });


}


/************************************************************************************************************/

function redrawCurve(div,svg){

    var clientRect = div.node().getBoundingClientRect();
    var divWidth = Math.max(svg.margin.left + svg.margin.right + 1,clientRect.width),
      divHeight = Math.max(svg.margin.bottom + svg.margin.top + 1,clientRect.height);
    //console.log("width " + divWidth );

    var oldsvgheight = svg.height;
    var oldsvgwidth = svg.width;

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


    svg.chart.select(".lineGraph").attr("d",svg.newValueline(svg.data));
    svg.chart.select(".area").attr("d",svg.newArea(svg.data));

    svg.axisx.call(d3.axisBottom(svg.newX));

    svg.axisy.call(d3.axisLeft(svg.newY));

    niceTicks(svg.axisy);

    axisYLegendSimple(svg);

    legendAxisX(svg);

    gridSimpleGraph(svg,true);

    updateCirclePosition(svg,d3.mouse(svg.svg.node())[0]);



}
/************************************************************************************************************
 *
 ************************************************************************************************************/

function legendAxisX(svg){

    var date,dround;
    //if graph hourly
    if(svg.step === 3600000){

        svg.axisx.selectAll(".tick").select("text").text(function (d) {

            dround = Math.round(d);

            //if the ticks isn't at "x" o'clock
            if(Math.abs(dround - d) >= 1e-7){
                this.parentNode.remove();
                return;
            }

            date = getDateFromAbscissa(svg, dround);

            return (date.getMonth() + 1) + "/" + date.getDate() + " " + date.getHours() + "h";

        });

    }else if(svg.step === 60000){
        //graph minute
        var mn;
        svg.axisx.selectAll(".tick").select("text").text(function (d) {

            dround = Math.round(d);

            //if the ticks isn't at "x" o'clock
            if(Math.abs(dround - d) >= 1e-7){
                this.parentNode.remove();
                return;
            }

            date = getDateFromAbscissa(svg, dround);
            mn = date.getMinutes();
            mn = (mn < 10)?("0" + mn):mn;

            return (date.getMonth() + 1) + "/" + date.getDate() + " " + date.getHours() + "h" + mn;

        });

    } else {
        //graph daily
        svg.axisx.selectAll(".tick").select("text").text(function (d) {

            dround = Math.round(d);

            //if the ticks isn't at "x" o'clock (some javascript weirdness here...)
            if(Math.abs(dround - d) >= 1e-7){
                this.parentNode.remove();
                return;
            }

            date = getDateFromAbscissa(svg, dround);

            return (date.getMonth() + 1) + "/" + date.getDate();

        });



    }
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


/************************************************************************************************************/

function createChoroplethDirection(div, svg, mydiv, urlJson){



    d3.queue()
      .defer(d3.json,"worldmap.json")
      .defer(d3.json, urlJson)
      .await(function(error,worldmap,json){
          createMapDirection(error, div, svg, mydiv, urlJson, worldmap, json);
      })

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

function createMapDirection(error,div,svg,mydiv, urlJson, worldmap,json){

    var colorInStart = "#ffff00", colorInEnd = "#ff0000";
    var colorOutStart = "#66ffcc", colorOutEnd = "#0066ff";

    svg.margin.offsetLegend = 5;
    svg.margin.legendWidth = 10;
    svg.margin.right = svg.margin.offsetLegend * 2 + svg.margin.legendWidth + 60;
    svg.margin.left = 5;
    svg.margin.top = 20;
    svg.margin.bottom = 5;

    if(error || typeof json === "undefined" || json.result != "true" || typeof json.response.data === "undefined"){
        noData(div,svg,mydiv);
        return;
    }


    json = json.response;
    var jsonContent = json.content;
    var jsonData = json.data;

    var itemValue = searchItemValue(jsonContent);
    var amountValue = searchAmountValue(jsonContent);
    var directionValue = searchDirectionValue(jsonContent);

    svg.amountByCountryCodeIn = new Map();
    svg.amountByCountryCodeOut = new Map();

    if(!(itemValue && amountValue && directionValue)){
        noData(div,svg,mydiv);
        return;
    }

    var inMax = 0;
    var inMin = Infinity;

    var outMax = 0;
    var outMin = Infinity;

    var elemAmount;
    var elemItem;
    jsonData.forEach(function(elem){

        elemItem = elem[itemValue];
        elemAmount = +elem[amountValue];

        if(elemItem === "--" || elemItem === ""){
            return;
        }

        switch(elem[directionValue]){

            case "IN":
                svg.amountByCountryCodeIn.set(elem[itemValue], elemAmount);
                inMax = Math.max(inMax, elemAmount);
                inMin = Math.min(inMin, elemAmount);
                break;

            case "OUT":
                svg.amountByCountryCodeOut.set(elem[itemValue], elemAmount);
                outMax = Math.max(outMax, elemAmount);
                outMin = Math.min(outMin, elemAmount);
                break;

            default:
                console.log("inconsistent direction value");
                break;

        }

    });

    if(svg.amountByCountryCodeIn.size === 0){
        inMin = 0;
        inMax = 1;
    }


    if(svg.amountByCountryCodeOut.size === 0){
        outMin = 0;
        outMax = 1;
    }



    svg.lastMinute = json.minute;


    //finding/computing the div dimensions

    var clientRect = div.node().getBoundingClientRect();
    var divWidth = Math.max(svg.margin.left + svg.margin.right + 1,clientRect.width),
      divHeight = Math.max(svg.margin.bottom + svg.margin.top + svg.margin.zero + 1,clientRect.height);



    //Some pre-computation to find the dimensions of the map (with a determined height/width ratio
    // for a given standard latitude)

    //Maximum potential width & height the map will have

    svg.width = divWidth - svg.margin.left - svg.margin.right;
    svg.height = divHeight - svg.margin.bottom - svg.margin.top;
    svg.mapHeight = (svg.height - svg.margin.zero)*0.5 ;

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

    var projectionScale = Math.min(svg.width/svg.mapDefaultWidth,svg.mapHeight/svg.mapDefaultHeight);

    //update of the correct width & height

    svg.width = projectionScale*svg.mapDefaultWidth;
    svg.mapHeight = projectionScale*svg.mapDefaultHeight;
    svg.height = svg.mapHeight * 2 + svg.margin.zero;

    //dimensions of the root svg (= with margins)

    svg.attr("width", svg.width + svg.margin.left + svg.margin.right + "px")
      .attr("height", svg.height + svg.margin.bottom + svg.margin.top + "px");

    //dimensions of the svg map container (= without margins)

    svg.svg = svg.append("svg").attr("x",svg.margin.left).attr("y",svg.margin.top).attr("width",svg.width)
      .attr("height", svg.mapHeight).classed("geometricPrecision",true);

    //A rect is appended first (= background) with the size of svg.svg as a sea representation

    svg.backgroundRect = svg.svg.append("rect")
      .attr("width",svg.width)
      .attr("height",svg.mapHeight)
      .attr("y",0)
      .classed("backgroundSea sizeMap",true);



    //Computation of the cylindrical equal-area projection with the given standard latitude and
    // the precomputed scale projectionScale

    var projection = d3.geoProjection(function(lambda,phi){
        return [lambda*cosStdPar,Math.sin(phi)/cosStdPar]; })
      .translate([svg.width/2,svg.mapHeight/2])
      .scale(projectionScale);

    //The corresponding path function creation for this projection
    var path = d3.geoPath().projection(projection);

    //svg.maps will contain the 2 maps for rotation

    svg.svg.maps = svg.svg.append("g");

    //svg.map will contain the first initial map

    svg.map = svg.svg.maps.append("g").classed("gMap",true);

    //stroke-width controlled by javascript to adapt it to the current scale
    //0.3 when map scale = 100

    svg.strokeWidth = 0.003*projectionScale;
    svg.svg.maps.style("stroke-width", svg.strokeWidth);

    //test json conformity

    if (typeof worldmap === "undefined" || error) {
        noData(div, svg,mydiv);
        return false;
    }





    svg.scaleLinearIn = d3.scaleLinear().range([0,1]);
    var colorInterpolatorIn = d3.interpolateRgb(colorInStart,colorInEnd);

    svg.scaleLinearOut = d3.scaleLinear().range([0,1]);
    var colorInterpolatorOut = d3.interpolateRgb(colorOutStart,colorOutEnd);

    //Axes

    svg.scaleInDisplay = d3.scaleLinear().range([svg.mapHeight,0]);

    svg.axisIn = svg.append("g")
      .attr("class", "axisGraph");

    svg.labelGradientIn = svg.append("text")
      .classed("labelChoropleth",true)
      .attr("x",svg.margin.top + 1.5 * svg.mapHeight + svg.margin.zero)
      .attr("y",-svg.margin.left - svg.width - svg.margin.right)
      .attr("dy","1.3em")
      .attr("transform", "rotate(90)");


    svg.scaleOutDisplay = d3.scaleLinear().range([svg.mapHeight,0]);

    svg.axisOut = svg.append("g").attr("class", "axisGraph");

    svg.labelGradientOut = svg.append("text")
      .classed("labelChoropleth",true)
      .attr("x",svg.margin.top + 0.5 * svg.mapHeight)
      .attr("y",-svg.margin.left - svg.width - svg.margin.right)
      .attr("dy","1.3em")
      .attr("transform", "rotate(90)");

    updateDataAxesMap(svg,inMin,inMax,outMin,outMax);









    svg.scaleColorIn = function(countryCode){

        var value = svg.amountByCountryCodeIn.get(countryCode);

        if(!value){
            return "#ffffff";
        }

        return colorInterpolatorIn(svg.scaleLinearIn(value));

    };

    svg.scaleColorOut = function(countryCode){

        var value = svg.amountByCountryCodeOut.get(countryCode);

        if(!value){
            return "#ffffff";
        }

        return colorInterpolatorOut(svg.scaleLinearOut(value));

    };





    //the binded data, containing the countries info and topology

    var data = topojson.feature(worldmap,worldmap.objects.countries).features;

    console.log(data);

    svg.titleOut = mapCountryTitleOut(svg);
    //Creation of the countries
    svg.map.selectAll(".countries")
      .data(data)
      .enter().append("path")
      .style("fill",function(d){return svg.scaleColorOut(d.id)})
      .attr("d",path)
      .classed("countries",true)
      .append("svg:title").text(svg.titleOut);


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

    //map border.
    svg.svg.append("rect")
      .attr("width",svg.width)
      .attr("height",svg.mapHeight)
      .attr("y",0)
      .classed("rectBorder sizeMap",true);


    //A duplicate map is created and translated next to the other, outside viewport
    //The .99991 operation avoid a little cut to be too visible where the 2 maps meet.

    svg.map2 = d3.select(svg.svg.maps.node().appendChild(svg.map.node().cloneNode(true)))
      .attr("transform","matrix(1, 0, 0,1," + (0.99991*svg.width) + ", 0)");

    //the data are binded to the second map (may be useful later)

    svg.map2.selectAll(".countries").data(data);



    //Maps out

    svg.svg2 = d3.select(svg.node().appendChild(svg.svg.node().cloneNode(true)))
      .attr("y",svg.margin.top + svg.margin.zero + svg.mapHeight);


    svg.svg2.maps = svg.svg2.select("g");

    svg.titleIn = mapCountryTitleIn(svg);

    svg.countriesIn = svg.svg2.maps.selectAll(".gMap").selectAll(".countries");
    svg.countriesIn.data(data)
      .style("fill",function(d){return svg.scaleColorIn(d.id)})
      .select("title").text(svg.titleIn);

    svg.countriesOut = svg.svg.maps.selectAll(".gMap").selectAll(".countries");


    //titles

    svg.label1 = svg.append("text")
      .classed("labelChoropleth",true)
      .attr("x", svg.margin.left + svg.width/2)
      .attr("dy", "-0.5em")
      .attr("y",svg.margin.top)
      .text("Outgoing");

    svg.label2 = svg.append("text")
      .classed("labelChoropleth",true)
      .attr("x", svg.margin.left + svg.width/2)
      .attr("dy", "-0.5em")
      .attr("y",svg.margin.top + svg.mapHeight + svg.margin.zero)
      .text("Ingoing");

    
    //legend
    //Definition of the colors gradient

    appendVerticalLinearGradientDefs(svg,"linearOut",colorOutStart,colorOutEnd);

    svg.legendOut = svg.append("rect").attr("x",svg.width + svg.margin.left + svg.margin.offsetLegend)
      .attr("y",svg.margin.top)
      .attr("width",svg.margin.legendWidth)
      .attr("height",svg.mapHeight)
      .attr("fill", "url(#linearOut)");


    appendVerticalLinearGradientDefs(svg,"linearIn",colorInStart,colorInEnd);

    svg.legendIn = svg.append("rect").attr("x",svg.width + svg.margin.left + svg.margin.offsetLegend)
      .attr("y",svg.margin.top + svg.mapHeight + svg.margin.zero)
      .attr("width",svg.margin.legendWidth)
      .attr("height",svg.mapHeight)
      .attr("fill", "url(#linearIn)");
    


    //added functionalities

    addZoomMapDirection(svg,svg.svg);
    addZoomMapDirection(svg,svg.svg2);
    addResizeMapDirection(div,svg,mydiv);

    autoUpdateMapDirection(svg, urlJson);




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

function createMap(div,svg,mydiv, urlJson){

    //finding/computing the div dimensions

    var clientRect = div.node().getBoundingClientRect();
    var divWidth = Math.max(svg.margin.left + svg.margin.right + 1,clientRect.width),
      divHeight = Math.max(svg.margin.bottom + svg.margin.top + 1,clientRect.height);



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

    svg.attr("width", svg.width + svg.margin.left + svg.margin.right + "px")
      .attr("height", svg.height + svg.margin.bottom + svg.margin.top + "px");

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

        console.log(data);

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
        var clientRect = div.node().getBoundingClientRect();
        divWidth = Math.max(svg.margin.left + svg.margin.right + 1,clientRect.width);
        divHeight = Math.max(svg.margin.bottom + svg.margin.top + 1,clientRect.height);


        //Some computation to find the new dimensions of the map (with a constant height/width ratio)

        svg.width = divWidth - svg.margin.left - svg.margin.right;
        svg.height = divHeight - svg.margin.bottom - svg.margin.top;
        projectionScale = Math.min(svg.width/svg.mapDefaultWidth,svg.height/svg.mapDefaultHeight);
        svg.width = projectionScale*svg.mapDefaultWidth;
        svg.height = projectionScale*svg.mapDefaultHeight;

        //svg and svg.svg dimensions are accordingly updated

        svg.attr("width", svg.width + svg.margin.left + svg.margin.right + "px")
          .attr("height", svg.height + svg.margin.bottom + svg.margin.top + "px");
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

/************************************************************************************************************/


function addResizeMapDirection(div,svg,mydiv){

    var oldMapHeight, divWidth,divHeight,coefScaling,scaleTotal1,scaleTotal2,projectionScale;

    //the total ratio alteration since the beginning

    if(typeof svg.ratioProjectionScale === "undefined"){
        svg.ratioProjectionScale = 1;
    }

    d3.select(window).on("resize."+mydiv,function(){




        //initial height kept for future computation of the resize augmentation

        oldMapHeight = svg.mapHeight;

        //finding/computing the div dimensions
        var clientRect = div.node().getBoundingClientRect();
        divWidth = Math.max(svg.margin.left + svg.margin.right + 1,clientRect.width);
        divHeight = Math.max(svg.margin.bottom + svg.margin.top + 1,clientRect.height);


        //Some computation to find the new dimensions of the map (with a constant height/width ratio)

        svg.width = divWidth - svg.margin.left - svg.margin.right;
        svg.height = divHeight - svg.margin.bottom - svg.margin.top;
        svg.mapHeight = (svg.height - svg.margin.zero)*0.5 ;


        projectionScale = Math.min(svg.width/svg.mapDefaultWidth,svg.mapHeight/svg.mapDefaultHeight);
        svg.width = projectionScale*svg.mapDefaultWidth;
        svg.mapHeight = projectionScale*svg.mapDefaultHeight;
        svg.height = svg.mapHeight * 2 + svg.margin.zero;

        //svg and svg.svg dimensions are accordingly updated

        svg.attr("width", svg.width + svg.margin.left + svg.margin.right + "px")
          .attr("height", svg.height + svg.margin.bottom + svg.margin.top + "px");

        svg.svg.attr("width",svg.width).attr("height",svg.mapHeight);

        svg.svg2.attr("width",svg.width).attr("height",svg.mapHeight)
          .attr("y",svg.margin.top + svg.margin.zero + svg.mapHeight);

        //Evaluation of the resize ratio augmentation

        coefScaling = svg.mapHeight/oldMapHeight;

        //update of svg.ratioProjectionScale and computation of the map total effective scaling

        svg.ratioProjectionScale *= coefScaling;

        scaleTotal1 = svg.ratioProjectionScale * svg.svg.transform.k;
        scaleTotal2 = svg.ratioProjectionScale * svg.svg2.transform.k;


        //update of the translation vector

        svg.svg.transform.x *= coefScaling;
        svg.svg.transform.y *= coefScaling;

        svg.svg2.transform.x *= coefScaling;
        svg.svg2.transform.y *= coefScaling;

        //update of the internal zoom translation vector

        updateTransform(svg.svg,svg.svg.transform);
        updateTransform(svg.svg2,svg.svg2.transform);


        //the modifications are performed

        svg.svg.maps.attr("transform","matrix(" +  scaleTotal1 + ", 0, 0, " + scaleTotal1 + ", " + svg.svg.transform.x + ", " + svg.svg.transform.y + ")");
        svg.svg2.maps.attr("transform","matrix(" +  scaleTotal2 + ", 0, 0, " + scaleTotal2 + ", " + svg.svg2.transform.x + ", " + svg.svg2.transform.y + ")");

        //update of the sea rect

        svg.selectAll(".sizeMap").attr("width",svg.width).attr("height",svg.mapHeight);

        //update of some styling variables.

        svg.strokeDash *= coefScaling;
        svg.strokeWidth *= coefScaling;

        //update of labels position
        svg.label1.attr("x", svg.margin.left + svg.width/2);
        svg.label2.attr("x", svg.margin.left + svg.width/2)
          .attr("y",svg.margin.top + svg.mapHeight + svg.margin.zero);

        svg.legendIn
          .attr("x",svg.width + svg.margin.left + svg.margin.offsetLegend)
          .attr("y",svg.margin.top + svg.mapHeight + svg.margin.zero)
          .attr("height",svg.mapHeight);

        svg.legendOut
          .attr("x",svg.width + svg.margin.left + svg.margin.offsetLegend)
          .attr("height",svg.mapHeight);

        resizeAxesMap(svg);


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

    //A fresh start...
    svg.svg._groups[0][0].__zoom.k =svg.transform.k;
    svg.svg._groups[0][0].__zoom.x =svg.transform.x;
    svg.svg._groups[0][0].__zoom.y =svg.transform.y;


}

/*********************************************************************************************************************/

function addZoomMapDirection(parentSvg,svg){



    if(typeof parentSvg.ratioProjectionScale === "undefined"){
        parentSvg.ratioProjectionScale = 1;
    }

    svg.transform = {k:1,x:0,y:0};
    var widthScale, scaleTotal, dashValue;


    svg.zoom = d3.zoom().scaleExtent([1,100]).on("zoom",function(){

          //computation of useful values
          svg.transform = d3.event.transform;

          widthScale = parentSvg.width*svg.transform.k;
          scaleTotal = svg.transform.k*parentSvg.ratioProjectionScale;
          dashValue = parentSvg.strokeDash/scaleTotal;


          //Evaluation of effective translation vectors
          //for "rotation" of the planisphere, svg.transform.x should always be in the [0,-widthScale] range.
          svg.transform.x = svg.transform.x - Math.ceil(svg.transform.x/widthScale)*widthScale;
          svg.transform.y = Math.min(0, Math.max(svg.transform.y,parentSvg.mapHeight - svg.transform.k*parentSvg.mapHeight));

          //zoom and translation are performed

          svg.maps.attr("transform","matrix(" + scaleTotal + ", 0, 0, " + scaleTotal + ", " + svg.transform.x + ", " + svg.transform.y + ")");

          //styling update, for keeping the same visual effect

          svg.maps.style("stroke-width",parentSvg.strokeWidth/scaleTotal);
          svg.maps.selectAll(".interior").style("stroke-dasharray",dashValue + "," + dashValue);




      })
      .on("end",function(){
          svg._groups[0][0].__zoom.k =svg.transform.k;
          svg._groups[0][0].__zoom.x =svg.transform.x;
          svg._groups[0][0].__zoom.y =svg.transform.y;
      });

    //the listener is finally created on the svg element used as the map container.

    svg.call(svg.zoom);

    //A fresh start...
    svg._groups[0][0].__zoom.k =svg.transform.k;
    svg._groups[0][0].__zoom.x =svg.transform.x;
    svg._groups[0][0].__zoom.y =svg.transform.y;


}

/********************************************************************************************************************/

function autoUpdateMapDirection(svg,urlJson){
    var delay = 45000;

    setTimeout(function(){
        console.log("update");
        d3.json(urlJson,function(error,json){

            if(error || typeof json === "undefined" || json.result != "true" || typeof json.response.data === "undefined"){
                console.warn("map update: no data");
                autoUpdateMapDirection(svg,urlJson);
                return;
            }


            json = json.response;
            if(json.minute === svg.lastMinute){
                console.log("same minute");
                autoUpdateMapDirection(svg,urlJson);
                return;
            }

            svg.lastMinute = json.minute;
            var jsonContent = json.content;
            var jsonData = json.data;

            var itemValue = searchItemValue(jsonContent);
            var amountValue = searchAmountValue(jsonContent);
            var directionValue = searchDirectionValue(jsonContent);

            svg.amountByCountryCodeIn = new Map();
            svg.amountByCountryCodeOut = new Map();

            if(!(itemValue && amountValue && directionValue)){
                autoUpdateMapDirection(svg,urlJson);
                return;
            }

            var inMax = 0;
            var inMin = Infinity;

            var outMax = 0;
            var outMin = Infinity;

            var elemAmount;
            var elemItem;



            jsonData.forEach(function(elem){

                elemItem = elem[itemValue];
                elemAmount = +elem[amountValue];

                if(elemItem === "--" || elemItem === ""){
                    return;
                }

                switch(elem[directionValue]){

                    case "IN":
                        svg.amountByCountryCodeIn.set(elem[itemValue], elemAmount);
                        inMax = Math.max(inMax, elemAmount);
                        inMin = Math.min(inMin, elemAmount);
                        break;

                    case "OUT":
                        svg.amountByCountryCodeOut.set(elem[itemValue], elemAmount);
                        outMax = Math.max(outMax, elemAmount);
                        outMin = Math.min(outMin, elemAmount);
                        break;

                    default:
                        console.warn("inconsistent direction value");
                        break;

                }

            });

            if(svg.amountByCountryCodeIn.size === 0){
                inMin = 0;
                inMax = 1;
            }


            if(svg.amountByCountryCodeOut.size === 0){
                outMin = 0;
                outMax = 1;
            }
            console.log(svg.amountByCountryCodeOut);
            console.log(svg.amountByCountryCodeIn);


            updateDataAxesMap(svg,inMin,inMax,outMin,outMax);

            svg.countriesIn.style("fill",function(d){return svg.scaleColorIn(d.id)})
              .select("title").text(svg.titleIn);

            svg.countriesOut.style("fill",function(d){
                return svg.scaleColorOut(d.id)})
              .select("title").text(svg.titleOut);


            autoUpdateMapDirection(svg,urlJson);

        })

    },delay)
}






//map
//drawChart("/dynamic/netTopCurrentCountryTraffic.json?net=labo","Graph");

//drawChart("netTopCurrentCountryTraffic.json","Graph");

//drawChart("/dynamic/netTop10appTraffic.json?service=loc&dd=2016-07-07%2011%3A44&df=2016-07-08%2011%3A44&dh=2", "Graph");
//drawChart("/dynamic/netNbExternalHosts.json?dd=2016-07-16%2011%3A44&df=2016-07-25%2011%3A44&pset=MINUTE", "Graph");
//drawChart("/dynamic/netNbLocalHosts.json?&pset=HOURLY&dd=2016-07-24+16%3A28&df=2016-07-25+16%3A28&dh=2", "Graph");
//drawChart("/dynamic/netTopHostsTraffic.json?dd=2016-07-19+23:00&df=2016-07-20+23:00&pset=HOURLY", "Graph");
drawChart("/dynamic/netTopCountryNbFlow.json?dd=2016-07-18%2011%3A44&df=2016-07-19%2011%3A44&pset=2&dh=2", "Graph");
//drawChart("/dynamic/netTopNbExtHosts.json?dd=2016-07-17+00:00&df=2016-07-22+23:59&pset=DAILY&dh=2", "Graph");
//drawChart("/dynamic/netNbLocalHosts.json?dd=2016-07-21+00:00&df=2016-07-21+23:59&pset=MINUTE&dh=2", "Graph");
//drawChart("/dynamic/netProtocoleTraffic.json?dd=2016-07-20%2011%3A44&df=2016-07-21%2011%3A44&pset=MINUTE&dh=2", "Graph");
//drawChart("/dynamic/netNbLocalHosts.json?dd=2016-07-01%2011%3A44&df=2016-07-20%2011%3A44&dh=2&pset=HOURLY", "Graph");
//drawChart("/dynamic/netTop10NbExtHosts.json?dd=2016-06-20%2011%3A44&df=2016-06-23%2011%3A44&dh=2", "Graph");
//drawChart("/dynamic/netTop10CountryTraffic.json?dd=2016-07-11%2011%3A44&df=2016-07-13%2011%3A44&dh=2", "Graph");
//drawChart("./netTop10appTraffic.json", "Graph");
//drawChart("./netTop10NbExtHosts.json", "Graph");
//drawChart("./netNbLocalHosts.json", "Graph");
//drawChart("./netTopHostsTraffic.json?pset=HOURLY","Graph");
//drawChart("worldmap.json","Graph");
