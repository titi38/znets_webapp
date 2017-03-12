/**
 * Created by descombes on 12/03/17.
 */

updateToolBoxSelection = function() {
    if ($("#cmdTool").val() === "whois")
    {
        if ( !$('#whoisServer option').size() )
        {
            $.getJSON( "static/getListWhoisServers.json", function( data ) {
                //var htmlStr = "<option selected disabled>Choose a server</option>";
                var htmlStr = "<option selected value=\"\">Default server</option>";
                var items = [];
                $.each( data.servers, function( index, value ) {
                    htmlStr += "<option value='" + value + "'>";
                    htmlStr += value+ "</option>";
                });

                $("#whoisServer").append(htmlStr);
            });
        }
        $("#whoisServerSelection").show();
    }
    else
    {
        $("#whoisServerSelection").hide();
    }
}
/*********************************************************************************/

iptoolboxShowResult = function(json) {
    console.log(json);
    $("#iptoolbox-result").html("");
    $("#iptoolbox-result").append("<B>$ "+json.command+"</B>\n");
    $("#iptoolbox-result").append(json.result) ;
}

/*********************************************************************************/

iptoolboxExec = function() {

    var params =  "ip=" + $("#iptoolboxElem").val();

    params += "&cmd=" + $("#cmdTool").val();

    if ($("#cmdTool").val() === "whois")
        params += "&server="+$("#whoisServer").val();
    //alert (params);
    callAJAX('iptools.json', params, 'json', iptoolboxShowResult, null);

}

/*********************************************************************************/

updateIptoolboxButton = function() {
    res = $("#iptoolboxElem").val().length == 0 || $("#cmdTool").val() === null;
    //  || ($("#cmdTool").val() === "whois" && $("#whoisServer").val() == null ) ;
    $("#btn-iptoolboxExec").prop('disabled', res);

}

/*********************************************************************************/
