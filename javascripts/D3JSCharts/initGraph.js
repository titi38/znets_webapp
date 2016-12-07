/**
 * Created by elie.
 */


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

/**
 * Instantiates the parent div and svg then call the function to create the correct graph.
 * @param urlJson {String} The url to request data from the server.
 * @param mydiv {String} The parent div id.
 */

function drawChartFromInterface(urlJson, mydiv) {
    if(typeof lastDiv !== "undefined"){

        d3.select(window).on("resize." + lastMyDiv, null);
        var newSvg = lastSvg.node().cloneNode(true);
        lastDiv.node().replaceChild(newSvg,lastSvg.node());

        cleanDiv(lastDiv, lastSvg);
    }

    var div = d3.select(mydiv);
    var svg = div.select("svg").classed("diagram",true).classed("parentSvg",true)
      .style("margin", "0 0 0 0").style("display","inline-block");

    cleanDiv(div, svg);


    svg.on("contextmenu.preventDefault",function(){d3.event.preventDefault();});

    svg.margin = {top: 20, right: 50, bottom: 20, left: 60, zero:28};

    svg.urlJson = urlJson;

    lastDiv = div;
    lastSvg = svg;
    lastMyDiv = mydiv;

    //TODO suppr

    //svg.typeGraph = "netTopServicesTraffic";

    //createChoroplethDirection(div,svg,mydiv,"dynamic/netTopCountryTraffic.json?pset=MINUTE");
    //createHistoDoubleCurrent(div,svg,mydiv,"dynamic/netTopAppTraffic.json?service=loc&pset=MINUTE");
    whichCreationFunction(urlJson,svg)(div,svg,mydiv,urlJson);

}


/**
 * Instantiates the parent div and svg then call the function to create the correct graph.
 * @param urlJson {String} The url to request data from the server.
 * @param mydiv {String} The parent div id.
 */


function drawChart(urlJson, mydiv) {

    var div = d3.select('#' + mydiv);
    var svg = div.select("svg").classed("diagram",true).classed("parentSvg",true);

    cleanDiv(div, svg);



    svg.on("contextmenu.preventDefault",function(){d3.event.preventDefault();});

    svg.margin = {top: 50, right: 50, bottom: 50, left: 60, zero:28};

    svg.urlJson = urlJson;
    whichCreationFunction(urlJson,svg)(div,svg,mydiv,urlJson);

}

/**
 * Returns the function to create the correct graph.
 * @param urlJson {String} The url to request data from the server.
 * @param svg {Object} D3 selection of the parent svg.
 * @returns {Function} The function to create the correct graph
 */

function whichCreationFunction(urlJson,svg){

    var typeGraph = urlJson.split(/[\?]/)[0].split(/[\.\/]+/);

    //For test & real use, can be simplified later
    typeGraph = typeGraph[typeGraph.length - 2];
    svg.typeGraph = typeGraph;
    
    var GraphsWithoutPopup = ["netNbFlow","hostNbFlow","hostNbDiffHosts","netNbDiffHosts","netTopNbExtHosts","hostTopNbExtHosts"];
    
    svg.hasPopup = GraphsWithoutPopup.indexOf(typeGraph) === -1;

    if(getParamUrlJson(urlJson,"pset") === "MINUTE"){
        svg.hasPopup = false;

        switch(typeGraph){

            case "netTopAsTraffic":
            case "hostTopAsTraffic":
            case "netTopAppTraffic":
            case "hostTopAppTraffic":
            case "netTopCountryTraffic":
            case "hostTopCountryTraffic":
            case "netTopHostsTraffic":
            case "netTopServicesTraffic":
            case "hostTopServicesTraffic":
            case "netTopLHostsTraffic":
                return createHistoDoubleCurrent;

            case "netTopLHostsNbFlow":
            case "netTopHostsNbFlow":
            case "netTopCountryNbFlow":
            case "hostTopCountryNbFlow":
            case "netTopAsNbFlow":
            case "hostTopAsNbFlow":
            case "netTopAppNbFlow":
            case "hostTopAppNbFlow":
                return create2HistoStackCurrent;

            case "netTopServicesNbFlow":
            case "hostTopServicesNbFlow":
                return createHisto2DStackSimpleCurrent;

            case "netProtocolTraffic":
            case "hostProtocolTraffic":
                return createHistoDoubleCurrentFormatVariation;
        }
    }
    
    switch(typeGraph){
        case "netNbLocalHosts":
        case "netNbExternalHosts":
            return createCurve;

        case "netTopLHostsTraffic":
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


        case "netProtocolTraffic":
        case "hostProtocolTraffic":

            return createHisto2DStackDoubleFormatVariation;

        case "netNbFlow":
        case "hostNbFlow":
        case "netProtocolPackets":
        case "hostProtocolPacket":
        case "hostNbDiffHosts":

            return create2HistoStackFormatVariation;

        case "netTopServicesNbFlow":
        case "hostTopServicesNbFlow":
            return createHisto2DStackSimple;

        //for now
        case "worldmap":
            return createMap;

        case "netTopCurrentCountryTraffic":
            return createChoroplethDirection;

        case "netTopLHostsNbFlow":
        case "netTopHostsNbFlow":
        case "netTopCountryNbFlow":
        case "hostTopCountryNbFlow":

        case "netTopAsNbFlow":
        case "hostTopAsNbFlow":

        case "netTopAppNbFlow":
        case "hostTopAppNbFlow":

        case "netTopNbExtHosts":


            return create2HistoStack;

        case "netTopCurrentLhostsTraffic" :
        case "netTopCurrentExtServiceTraffic" :
        case "netTopCurrentLocServiceTraffic" :
       //Choropleth ?
        //case "netTopCurrentCountryTraffic" :
        case "netTopCurrentAsTraffic" :
        case "netTopCurrentAppTraffic" :
            return;

        default:
            return noData;
    }

}


/**
 * Display a text if no graph can be draw.
 * @param div {Object} D3 encapsulated parent div element.
 * @param svg {Object} D3 encapsulated parent svg element, direct child of div parameter.
 * @param mydiv {String} Div identifier.
 * @param msg {String} The optional message which be displayed.
 */

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












