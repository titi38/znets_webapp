/**
 * Created by smile on 14/06/16.
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



function initializeRawDataForm_OtherFields(){

    initializeApplicationsId();
    initializeCountriesId();
    initializeProtosId();
    initializeASNumsId();
    initializeCountriesId();
}








/**
 *
 * @returns {*|jQuery} serialized rawdata form string
 */
function serializeRawDataForm(){

    console.log($("form[id='rawData_form']").find("input,select").filter(function(index, element) {return ($(element).val() != "" && $(element).attr("name") != "");}).serialize())

    return $("form[id='rawData_form']").find("input,select").filter(function(index, element) {return ($(element).val() != "" && $(element).attr("name") != "");}).serialize();

}

function getRawData(paramRawData){

    callAJAX("rawDataFlow.json", paramRawData, "json", addRawDataResults, null);

}



function submitFormRawData(){

    if ( !$("#advancedFiltersButton").hasClass( "collapsed" ) ){
        $("#advancedFiltersButton").click();
    }

    getRawData(serializeRawDataForm());

}

function addRawDataResults(jsonResponse){

    var rawdataTabID = moment();

    addRawDataTab(rawdataTabID);

    drawRawdataDatatable(rawdataTabID, jsonResponse);

}




function drawRawdataDatatable(rawdataTabID, jsonResponse) {


    var tableColumns = [];
    for (var i = 0; i < jsonResponse.content.length; i++){
        tableColumns.push({'title':jsonResponse.content[i]});
    }


    if(!getRawdataShownColumnsSessionVariable())
    {
        initializeRawdataShownColumnsSessionVariable(tableColumns);
    }
    else
    {
        setRawdataShownColumnsSessionVariable(tableColumns)
    }


    var datatableColumnDefs = []

    for (var i = 0; i < jsonResponse.content.length; i++) {
       // if(jsonResponse.content[i] === )
        datatableColumnDefs.push({"targets": i, "visible": getRawdataShownColumnsSessionVariable()[tableColumns[i].title], "className": "dt-head-center dt-body-center"});
    }


    $('#divRawdata'+rawdataTabID).append('<table id="tableRawdata'+rawdataTabID+'" class="display" cellspacing="0" width="100%"></table>');
    $('#tableRawdata'+rawdataTabID).DataTable( {
        data: jsonResponse.data,
        columns: tableColumns,
        scrollY: 1,
        scrollX: true,
        lengthMenu: [[ 10, 25, 50, 100, -1 ],[ 10, 25, 50, 100, "All" ]],
        pageLength: 50,
        responsive: true,
        scrollCollapse: true,
        sDom: '<"dataTable_Header"lf><"dataTable_Content"rt><"dataTable_Footer"ip><"clear">',
        fnDrawCallback: function() { var _this = this; setTimeout(function(){_this.DataTable().columns.adjust();}, 150) },
        fnInitComplete: function() { $( document ).trigger("dataTable_Loaded"); this.fnPageChange( 'last' ); },
        columnDefs: datatableColumnDefs,

    } );

    // Cheat : trigger draw to call drawCallback function in order to adjust column's width
    $('#tableRawdata'+rawdataTabID).DataTable().draw();

    drawShownColumnsSelector(rawdataTabID);



}



function drawShownColumnsSelector(rawdataTabID) {

    $('#shownColumns a').on('click', function (event) {

        // Get the column API object
        var column = $('#tableRawdata' + rawdataTabID).DataTable().column($(this).attr('data-column'));

        // Toggle the visibility
        column.visible(!column.visible());



        // Blur (unfocus) clicked "a" tag
        $(event.target).blur();

        // Prevent "a" tag default behavior (href redirection)
        //event.preventDefault();

        // Prevent Dropdown menu closing
        return false;
    });


    $('#shownColumns a input').on('click', function (event) {

        // Prevent "a" tag default behavior (href redirection)
        event.stopPropagation();
        event.preventDefault();

        // Prevent Dropdown menu closing
        return false;

    });
}


function switchShownColumnState(a_element) {


    // Get the input checkbox object
    var input = a_element.find('input');

    // Toggle the checked state
    if (input.prop('checked'))
        input.prop('checked', false);
    else
        input.prop('checked', true);

    // Refresh session variable shownColumns
    changeRawdataShownColumnsSessionVariableKey(a_element.attr('data-column-name'));


}




function invalidMsg(textbox) {
    if (textbox.value == '') {
        textbox.setCustomValidity('');
    }
    else if (textbox.validity.typeMismatch) {
        textbox.setCustomValidity('please enter a valid email address');
    }
    else
    {
        textbox.setCustomValidity('');
    }
    return true;
}









function setIpLocValue(){

    $("#iplocHidden").val( $("#iploc").val() + ( ($("#iplocMask").val()) ? ("/"+$("#iplocMask").val()) : "" ) )

}





function setIpExtValue(){

    $("#ipextHidden").val( $("#ipext").val() + ( ($("#ipextMask").val()) ? ("/"+$("#ipextMask").val()) : "" ) )
    
}



function setIncTcpFlagsValue(){

    var incTcpFlags = "";
    var incCheckboxesTable = $("#incTcpFlagsHidden").siblings().find("input[type='checkbox']");
    for (var i = 0 ; i < incCheckboxesTable.length ; i++){
        if($(incCheckboxesTable[i]).is(':checked'))
            incTcpFlags += $(incCheckboxesTable[i]).val();
    }

    $("#incTcpFlagsHidden").val( incTcpFlags );

}



function setOutTcpFlagsValue(){

    var outTcpFlags = "";
    var outCheckboxesTable = $("#outTcpFlagsHidden").siblings().find("input[type='checkbox']");
    for (var i = 0 ; i < outCheckboxesTable.length ; i++){
        if($(outCheckboxesTable[i]).is(':checked'))
            outTcpFlags += $(outCheckboxesTable[i]).val();
    }

    $("#outTcpFlagsHidden").val( outTcpFlags );

}





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






function setLocalhostIp(){

    $("#iplocMask").val("");

    $("#iploc").val( $("#nameloc").val() );

}




