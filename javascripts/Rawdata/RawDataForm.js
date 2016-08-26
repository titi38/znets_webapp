/**
 * Created by smile on 14/06/16.
 */





/**
 * RawData Formular - Time Fields Initialization Function
 * Initializes DatePicker (default values, max, behaviour, interactions)
 */
function initializeRawDataForm_TimeFields(){

    $('#fromDate_RawDataForm').datetimepicker({
        format: 'YYYY-MM-DD HH:mm',
        useCurrent: false,
        //defaultDate: moment(),


    });
    $('#toDate_RawDataForm').datetimepicker({
        format: 'YYYY-MM-DD HH:mm',
        useCurrent: false,
        //defaultDate: moment(),


    });

    $("#fromDate_RawDataForm").on("dp.show", function (e) {
        if(!$(this).data("DateTimePicker").date())
            $(this).data("DateTimePicker").date(moment($(this).data("DateTimePicker").maxDate()));
    });

    $("#toDate_RawDataForm").on("dp.show", function (e) {
        if(!$(this).data("DateTimePicker").date())
            $(this).data("DateTimePicker").date($(this).data("DateTimePicker").maxDate());
    });

    $("#fromDate_RawDataForm").on("dp.change", function (e) {
        checkDateConsistency("#fromDate_RawDataForm", "#toDate_RawDataForm");
    });

    $("#toDate_RawDataForm").on("dp.change", function (e) {
        checkDateConsistency("#fromDate_RawDataForm", "#toDate_RawDataForm");
    });

}






/**
 * RawData Formular - Fields Initialization Function
 * Initializes all Formular Fields (other than time fields)
 * Initializes RawData Search Button/Tab Interaction
 */
function initializeRawDataForm_OtherFields(){

    initializeApplicationsId();
    initializeCountriesId();
    initializeProtosId();
    initializeASNumsId();
    initializeCountriesId();

    // Initialize "search" tab (button)
    $("button.rawDataFormularTab[href='#rawDataFormularTab']").on("click", function () {
        $(".rawdata-tab-list li.active").removeClass("active");
    });

}


/**
 * RawData Formular - Date Consistency Function
 * Check if set dates are consistent (from_date < to_date ...)
 * @param fromDateQuery
 * @param toDateQuery
 */
function checkDateConsistency(fromDateQuery, toDateQuery){
    var fromDate = moment($(fromDateQuery).data("DateTimePicker").date());
    var toDate = moment($(toDateQuery).data("DateTimePicker").date());

    if(fromDate.isAfter(toDate)){
        // Dates are consistent.
        $(fromDateQuery).find("input").addClass("color-red-danger");
        $(toDateQuery).find("input").addClass("color-red-danger");

        $(fromDateQuery).parents("form").find("button[type='submit']").prop("disabled", true);
    }
    else
    {
        // Dates are NOT consistent.
        $(fromDateQuery).find("input").removeClass("color-red-danger");
        $(toDateQuery).find("input").removeClass("color-red-danger");

        $(fromDateQuery).parents("form").find("button[type='submit']").prop("disabled", false);
    }
}








/**
 * RawData Formular Serialization Function
 * @returns {*|jQuery} serialized rawdata form string
 */
function serializeRawDataForm(){

    console.log($("form[id='rawData_form']").find("input,select").filter(function(index, element) {return ($(element).val() != "" && $(element).attr("name") != "");}).serialize())

    return $("form[id='rawData_form']").find("input,select").filter(function(index, element) {return ($(element).val() != "" && $(element).attr("name") != "");}).serialize();

}





/**
 * RawData Formular Submission Function
 */
function submitFormRawData(){

    getRawData(serializeRawDataForm());

}





/**
 * Ajax RawData Request (to server) Function
 * Triggers rawData results Check Function (to get confirmation if query is too long)
 * @param paramRawData : request parameters
 */
function getRawData(paramRawData){

    callAJAX("rawDataFlow.json", paramRawData, "json", checkRawDataResults, paramRawData);

}





/**
 * RawData Results Check Function (to get confirmation if query is too long)
 *  - If response is a specific warning message, then ask for query (request again with same parameters + "force" parameter)
 *  - If response has an attribute "content", then it is the rawdata request Results => draw table of results
 * @param jsonResponse : response to RawData Request
 * @param paramRawData : request parameters
 */
function checkRawDataResults(jsonResponse, paramRawData){


    var rawdataTabID = moment();

    if(jsonResponse.warnMsg ){
        if(jsonResponse.warnMsg === "Long query detected, continue ?" ){
            var r = confirm("Long query detected, do you still want to continue ?");
            if (r == true) {
                // Create rawdata Tab
                addRawDataTab(rawdataTabID);
                // Force callAjax execution on server side
                callAJAX("rawDataFlow.json", paramRawData+"&force", "json", drawRawdataDataTable, rawdataTabID);
            } else {
                // DO NOTHING
            }
        }
        else {
            console.error("TODO in RawDataForm.js : UNEXPECTED value (on callAjax response.result) of 'warnMsg' attribute ! (707)");
        }
    }
    else if(jsonResponse.content) {
        // Create rawdata Tab
        addRawDataTab(rawdataTabID);
        drawRawdataDataTable(jsonResponse, rawdataTabID);
    }
    else {
        console.error("TODO in RawDataForm.js : UNEXPECTED response on rawdata callAjax ! (708)");
    }

}





/**
 * RawData Formular - Setting Local host Ip Function
 * Sets Localhost Ip Field Value OF THE NEXT RAWDATA REQUEST, to the value entered/selected by user in the RawData Formular
 */
function setIpLocValue(){

    console.warn(iplocHidden);
    console.warn($("#iplocHidden"));
    console.warn($("#iploc").val());

    $("#iplocHidden").val( $("#iploc").val() + ( ($("#iplocMask").val()) ? ("/"+$("#iplocMask").val()) : "" ) )

}





/**
 * RawData Formular - Setting External host Ip Function
 * Sets External Ip Field Value OF THE NEXT RAWDATA REQUEST, to the value entered/selected by user in the RawData Formular
 */
function setIpExtValue(){

    $("#ipextHidden").val( $("#ipext").val() + ( ($("#ipextMask").val()) ? ("/"+$("#ipextMask").val()) : "" ) )

}





/**
 * RawData Formular - Setting Incoming TCP Flags Function
 * Sets Incoming TCP Flags Field Value OF THE NEXT RAWDATA REQUEST, to the value entered/selected by user in the RawData Formular
 */
function setIncTcpFlagsValue(){

    var incTcpFlags = "";
    var incCheckboxesTable = $("#incTcpFlagsHidden").siblings().find("input[type='checkbox']");
    for (var i = 0 ; i < incCheckboxesTable.length ; i++){
        if($(incCheckboxesTable[i]).is(':checked'))
            incTcpFlags += $(incCheckboxesTable[i]).val();
    }

    $("#incTcpFlagsHidden").val( incTcpFlags );

}








/**
 * RawData Formular - Setting Outgoing TCP Flags Function
 * Sets Outgoing TCP Flags Field Value OF THE NEXT RAWDATA REQUEST, to the value entered/selected by user in the RawData Formular
 */
function setOutTcpFlagsValue(){

    var outTcpFlags = "";
    var outCheckboxesTable = $("#outTcpFlagsHidden").siblings().find("input[type='checkbox']");
    for (var i = 0 ; i < outCheckboxesTable.length ; i++){
        if($(outCheckboxesTable[i]).is(':checked'))
            outTcpFlags += $(outCheckboxesTable[i]).val();
    }

    $("#outTcpFlagsHidden").val( outTcpFlags );

}





/**
 * RawData Formular - Setting Local host Name Function
 * Sets Local host Name Field Value, to the corresponding Local host Ip value entered/selected by user in the RawData Formular
 */
function setLocalhostName(){

    if( $("#iplocMask").val() === "" || $("#iplocMask").val() === "32" || $("#iplocMask").val() === "128" )
    {
        $('#nameloc').combobox('setValueTo', $("#iploc").val());
    }
    else
    {
        $('#nameloc').combobox('setValueTo', "");
    }

}






/**
 * RawData Formular - Setting Local host Ip Function
 * Sets Local host Ip Field Value, to the corresponding Local host Name value entered/selected by user in the RawData Formular
 */
function setLocalhostIp(){

    $("#iplocMask").val("");

    $("#iploc").val( $("#nameloc").val() );

}



