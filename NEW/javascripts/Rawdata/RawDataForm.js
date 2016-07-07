/**
 * Created by smile on 14/06/16.
 */

/**
 *
 * @returns {*|jQuery} serialized rawdata form string
 */
function serializeRawDataForm(){

    return $("form[id='rawData_form']").find("input,select").filter(function(index, element) {return ($(element).val() != "" && $(element).attr("name") != "");}).serialize();

}

function getRawData(paramRawData){

    callAJAX("rawDataFlow.json", paramRawData, "json", addRawDataResults, null);

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
