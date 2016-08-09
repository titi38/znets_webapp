

function emptyChartContainer(jqueryElement) {

    d3.select(jqueryElement).select(".diagram").selectAll("*").remove();

    d3.select(jqueryElement).select(".diagram.divtable").remove();

}



function drawChartFromInterface(urlJson, mydiv) {

    var div = d3.select(mydiv);
    if(div.size() === 0){
        return;
    }


    var divNode = div.node();
    var divChild = divNode.firstChild;
    while(divChild){

        divNode.removeChild(divChild);
        divChild = divNode.firstChild;

    }

    var svg = div.append("svg").classed("diagram",true);

    svg.classed("parentSvg",true).on("contextmenu.preventDefault",function(){d3.event.preventDefault();});
    svg.margin = {top: 20, right: 50, bottom: 20, left: 60, zero:28};


    //createChoroplethDirection(div,svg,mydiv,"/dynamic/netTopCurrentCountryTraffic.json?net=labo");
    whichCreationFunction(urlJson,svg)(div,svg,mydiv,urlJson);

}




function drawChart(urlJson, mydiv) {

    var div = d3.select('#' + mydiv);
    if(div.size() === 0){
        return;
    }
    var divNode = div.node();
    var divChild = divNode.firstChild;
    while(divChild){

        divNode.removeChild(divChild);
        divChild = divNode.firstChild;

    }

    var svg = div.append("svg").classed("diagram",true);

    svg.classed("parentSvg",true).on("contextmenu.preventDefault",function(){d3.event.preventDefault();});

    svg.margin = {top: 50, right: 50, bottom: 50, left: 60, zero:28};

    whichCreationFunction(urlJson,svg)(div,svg,mydiv,urlJson);




}

/***********************************************************************************************************/

function whichCreationFunction(urlJson,svg){
var typeGraph = urlJson.split(/[\.\/]+/);
    //For test & real use, can be simplified later
    typeGraph = typeGraph[typeGraph.length - 2];
    svg.typeGraph = typeGraph;
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
        case "netTopHostsNbFlow":
        case "netTopCountryNbFlow":
        case "netTopAsNbFlow":
        case "netTopAppNbFlow":
        return create2HistoStack;
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












