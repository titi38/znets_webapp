/**
 * Created by descombes on 28/04/17.
 */



/*********************************************************************************************************
 DefaultParamsSelection Object
 ********************************************************************************************************/

/**
 * DefaultParamsSelection
 * Update and propagate selected param value
 */
function DefaultParamsSelection() {
}

DefaultParamsSelection.setNdiApplication = function (value) {
    $("#appId").combobox("destroy");
    $('select#appId option').filter(function () {
        //may want to use $.trim in here
        return $(this).val() == value;
    }).prop('selected', true);
    $('select#appId').combobox();
};

DefaultParamsSelection.updateDateFrom = function (value) {

    $( "input#dateDebData" ).val(moment(value, "ddd MMM DD YYYY HH:mm:ss").format('YYYY-MM-DD HH:mm'));

};

DefaultParamsSelection.updateDateTo = function (value) {

    $( "input#dateFinData" ).val(moment(value, "ddd MMM DD YYYY HH:mm:ss").format('YYYY-MM-DD HH:mm'));

};

DefaultParamsSelection.updateIp = function (value) {
    if (jQuery.inArray( value, myLocalhosts.getAllIpAddress() ) !== -1)
        DefaultParamsSelection.setLocalHostIP(value);
    else
        DefaultParamsSelection.setExtHostIP(value);
};

DefaultParamsSelection.setLocalHostIP = function (value) {
    $("#iplocMask").val("");
    $("#iploc").val(value);
    if (value !== "")
        rawDataForm_updateLocHostName();
    else $("#nameloc").val( "" );
};

DefaultParamsSelection.setExtHostIP = function (value) {
    $("#ipextMask").val("");
    $("#ipext").val(value);
};

DefaultParamsSelection.setDir = function (value) {
    $("select#dir option[value='"+value+"']").prop("selected", true);
}

DefaultParamsSelection.setIpProto = function (value) {
    $('select#proto').combobox("destroy");
    $('select#proto option').filter(function () {
        //may want to use $.trim in here
        return $(this).text() == value;
    }).prop('selected', true);
    $('select#proto').combobox();
}

DefaultParamsSelection.setCountry = function (value) {
    $("#countryId").combobox("destroy");
    $('select#countryId option').filter(function () {
        //may want to use $.trim in here
        return $(this).val() == value;
    }).prop('selected', true);
    $('select#countryId').combobox();
}

DefaultParamsSelection.setAsNumber = function (asn) {
    $('input#ASId').val(asn);
    if (asn !== "")
        resolveASName(asn);
    else
        $('#ASName').html("No AS selected.")
}

DefaultParamsSelection.setPort = function (port, isLocal) {
    if (isLocal)
        $("input#portLoc").val(port);
    else
        $("input#portExt").val(port);
}


DefaultParamsSelection.clearForm = function () {
    DefaultParamsSelection.setLocalHostIP("");
    DefaultParamsSelection.setExtHostIP("");
    DefaultParamsSelection.setDir("");
    DefaultParamsSelection.setIpProto("");
    DefaultParamsSelection.setCountry("");
    DefaultParamsSelection.setAsNumber("");
    DefaultParamsSelection.setPort("", false);
    DefaultParamsSelection.setPort("", true);
}

DefaultParamsSelection.updateFromChartTitle = function (itemName, dir, isLocal) {
//    console.error("item: " + itemName +", dir: " + dir + ", isLocal: " + isLocal);

    var isInc=false, isOut=false;

    DefaultParamsSelection.clearForm();

    if (dir != null) {
        isInc = dir.indexOf("inc") != -1;
        isOut = dir.indexOf("out") != -1;

        if (isInc)
            DefaultParamsSelection.setDir('<');
        else if (isOut)
            DefaultParamsSelection.setDir('>');
    }

    if (itemName != null)
        if (itemName === parseInt(itemName, 10))
        {
            // This is a AppId
            DefaultParamsSelection.setNdiApplication(itemName);
        }
        else
        {
            var isTCP = itemName.indexOf("TCP") != -1 ;
            var isUDP = !isTCP && (itemName.indexOf("UDP") != -1);

            if ( isTCP || isUDP )
            {
                var value="TCP";
                if (isUDP) value="UDP";
                DefaultParamsSelection.setIpProto(value);

                var tmp = itemName.split('/');
                if (tmp.length>1)
                    DefaultParamsSelection.setPort(tmp[0], isLocal);
                    //alert ("port "+tmp[0])
            }
            else
                if (itemName.length == 2) // Pays
                {
                    DefaultParamsSelection.setCountry(itemName);
                }
                else {
                    if (itemName.substring(0, 3) === "AS ") {
                        DefaultParamsSelection.setAsNumber(itemName.substr(3));
                    }
                    else if ( /((^\s*((([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]))\s*$)|(^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$))/g.test(itemName))
                    {
                        DefaultParamsSelection.updateIp(itemName);
                    }
                    else
                      alert( "?? = " + itemName );
                }
        }

};