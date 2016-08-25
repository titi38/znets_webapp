/**
 * Chart drawing Function from JSON's Url.
 * Evaluate JSON's Url from "selectedNavChart" (the selected chart)
 * @param selectedNavChart : contains all necessary data about JSON's Url and interface target element receiving the chart
 * @param forNetworks : boolean - true if charts concerns a network, false if it concerns a loaclhost
 */
function loadChartJsonToDiv(selectedNavChart, forNetworks) {

    var jsonData = selectedNavChart.dataset.chartJson;
    var ajaxParams = selectedNavChart.dataset.ajaxParams;
    var jqueryTarget = selectedNavChart.hash;

    emptyChartContainer(jqueryTarget);

    var subNet_or_lhIp = (forNetworks) ? ( (selectedNavChart.dataset.network === "Global") ? "" : selectedNavChart.dataset.network ) : ( selectedNavChart.dataset.localhostIp );
    drawChartFromInterface(setChartJsonFUllURL(jsonData, ajaxParams, subNet_or_lhIp, forNetworks), jqueryTarget);

}


/**
 * JSON Url evaluation Function
 * Evaluate JSON's Url from parameters
 * @param jsonData : Ajax called JSON Url
 * @param ajaxParams : parameters of the ajax called JSON Url
 * @param subNet_or_lhIp : (sub)Network Name , or, Localhost Ip
 * @param forNetworks : boolean - true if charts concerns a network, false if it concerns a loaclhost
 * @returns {string} - JSON Url
 */
function setChartJsonFUllURL (jsonData, ajaxParams, subNet_or_lhIp, forNetworks){

    var myform = $('#charts_form');

    // Find disabled inputs, and remove the "disabled" attribute
    var disabled = myform.find(':input:disabled').prop('disabled', false);

    // serialize the form
    var serializedTimestepForm = myform.serialize();

    // re-disabled the set of inputs that you previously enabled
    disabled.prop('disabled',true);

    var serialized_subNet_or_lhIp = (forNetworks) ? ( (subNet_or_lhIp === "") ? "" : "&net="+subNet_or_lhIp ) : ( "&ip="+subNet_or_lhIp );

    console.warn(proxyPass+jsonData+"?"+ajaxParams+serialized_subNet_or_lhIp+"&"+serializedTimestepForm+"&dh="+parseInt(moment().format("Z")));


    return proxyPass+jsonData+"?"+ajaxParams+serialized_subNet_or_lhIp+"&"+serializedTimestepForm+"&dh="+parseInt(moment().format("Z"));

}


/**
 * Empties Chart Container
 * @param jqueryElement : jQuery selector of element containing chart to delete (chart + legend)
 */
function emptyChartContainer(jqueryElement) {

    d3.select(jqueryElement).select(".diagram").selectAll("*").remove();

    d3.select(jqueryElement).select(".diagram.divtable").remove();

}



function drawChartFromInterface(urlJson, mydiv) {

    var div = d3.select(mydiv);
    var svg = div.select("svg").classed("diagram",true).classed("parentSvg",true);
    var svgNode = svg.node();

    if(div.size() === 0){
        return;
    }
    var divNode = div.node();
    var divChild = divNode.firstChild;

    while(divChild){

        divNode.removeChild(divChild);
        divChild = divNode.firstChild;

    }
    divNode.appendChild(svgNode);

    var svgChild = svgNode.firstChild;

    while(svgChild){

        svgNode.removeChild(svgChild);
        svgChild = svgNode.firstChild;

    }



    svg.on("contextmenu.preventDefault",function(){d3.event.preventDefault();});

    svg.margin = {top: 20, right: 50, bottom: 20, left: 60, zero:28};

    svg.urlJson = urlJson;

    //createChoroplethDirection(div,svg,mydiv,"/dynamic/netTopCurrentCountryTraffic.json");
    createHistoDoubleCurrent(div,svg,mydiv,"/dynamic/netTopCurrentCountryTraffic.json");
    //whichCreationFunction(urlJson,svg)(div,svg,mydiv,urlJson);

}




function drawChart(urlJson, mydiv) {

    var div = d3.select('#' + mydiv);
    var svg = div.select("svg").classed("diagram",true).classed("parentSvg",true);
    var svgNode = svg.node();

    if(div.size() === 0){
        return;
    }
    var divNode = div.node();
    var divChild = divNode.firstChild;

    while(divChild){

        divNode.removeChild(divChild);
        divChild = divNode.firstChild;

    }
    divNode.appendChild(svgNode);

    var svgChild = svgNode.firstChild;

    while(svgChild){

        svgNode.removeChild(svgChild);
        svgChild = svgNode.firstChild;

    }



    svg.on("contextmenu.preventDefault",function(){d3.event.preventDefault();});

    svg.margin = {top: 50, right: 50, bottom: 50, left: 60, zero:28};

    svg.urlJson = urlJson;
    whichCreationFunction(urlJson,svg)(div,svg,mydiv,urlJson);

}

/***********************************************************************************************************/

function whichCreationFunction(urlJson,svg){

    var typeGraph = urlJson.split(/[\?]/)[0].split(/[\.\/]+/);

    //For test & real use, can be simplified later
    typeGraph = typeGraph[typeGraph.length - 2];
    svg.typeGraph = typeGraph;
    
    var GraphsWithoutPopup = ["netNbFlow","hostNbFlow","hostNbDiffHosts","netNbDiffHosts","netTopNbExtHosts","hostTopNbExtHosts"];
    
    svg.hasPopup = GraphsWithoutPopup.indexOf(typeGraph) === -1;
    
    switch(typeGraph){
        case "netNbLocalHosts":
        case "netNbExternalHosts":
            return createCurve;
            break;

        case "netTopHostsTraffic":
        case "netTopServicesTraffic":
        case "hostTopServicesTraffic":
        case "netTopAsTraffic":
        case "hostTopAsTraffic":
        case "netTopAppTraffic":
        case "hostTopAppTraffic":
        case "netTopCountryTraffic":
        case "hostTopCountryTraffic":
            return createHisto2DStackDouble;
            break;

        case "netNbFlow":
        case "hostNbFlow":
        case "netProtocolePackets":
        case "hostProtocolePacket":
        case "netProtocoleTraffic":
        case "hostProtocoleTraffic":
        case "hostNbDiffHosts":

            return createHisto2DStackDoubleFormatVariation;
            break;

        case "netTopServicesNbFlow":
        case "hostTopServicesNbFlow":
            return createHisto2DStackSimple;
            break;

        //for now
        case "worldmap":
            return createMap;
            break;

        case "netTopCurrentCountryTraffic":
            return createChoroplethDirection;
            break;

        case "netTopHostsNbFlow":

        case "netTopCountryNbFlow":
        case "hostTopCountryNbFlow":

        case "netTopAsNbFlow":
        case "hostTopAsNbFlow":

        case "netTopAppNbFlow":
        case "hostTopAppNbFlow":

        case "netTopNbExtHosts":


            return create2HistoStack;
            break;

        case "netTopCurrentLhostsTraffic" :
        case "netTopCurrentExtServiceTraffic" :
        case "netTopCurrentLocServiceTraffic" :
       //Choropleth ?
        //case "netTopCurrentCountryTraffic" :
        case "netTopCurrentAsTraffic" :
        case "netTopCurrentAppTraffic" :
            return;
            break;

        default:
            return noData;
    }

}


/***********************************************************************************************************/
function noData(div,svg,mydiv, msg){
    console.log("incorrect url/data");

    if(!msg){
        msg = "No Data";
    }

    var clientRect = div.node().getBoundingClientRect();
    var divWidth = clientRect.width,
      divHeight = clientRect.height;

    svg.attr("width",divWidth).attr("height",divHeight);

    svg.nodata = svg.append("text").attr("transform", "translate(" + (divWidth/2) + "," +
        (divHeight/2 ) + ")")
      .classed("bckgr-txt",true)
      .text(msg)
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












