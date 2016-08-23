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

    // Initialize "search" tab (button)
    $("button.rawDataFormularTab[href='#rawDataFormularTab']").on("click", function () {
        $(".rawdata-tab-list li.active").removeClass("active");
    });

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

    callAJAX("rawDataFlow.json", paramRawData, "json", checkRawDataResults, paramRawData);

}



function submitFormRawData(){

    if ( !$("#advancedFiltersButton").hasClass( "collapsed" ) ){
        $("#advancedFiltersButton").click();
    }

    getRawData(serializeRawDataForm());

}

function checkRawDataResults(jsonResponse, paramRawData){

    console.error(jsonResponse);
    console.error(paramRawData);

    // Set cursor style to 'load' status
    $(document.body).css({'cursor' : 'wait'});


    var rawdataTabID = moment();

    if(jsonResponse.warnMsg ){
        if(jsonResponse.warnMsg === "Long query detected, continue ?" ){
            var r = confirm("Long query detected, do you still want to continue ?");
            if (r == true) {
                // Create rawdata Tab
                addRawDataTab(rawdataTabID);
                // Force callAjax execution on server side
                callAJAX("rawDataFlow.json", paramRawData+"&force", "json", drawRawdataDatatable, rawdataTabID);
            } else {
                // Set cursor style to 'default' status
                $(document.body).css({'cursor' : 'default'});
            }
        }
        else {
            console.error("TODO in RawDataForm.js : UNEXPECTED value (on callAjax response.result) of 'warnMsg' attribute ! (707)");

            // Set cursor style to 'default' status
            $(document.body).css({'cursor' : 'default'});
        }
    }
    else if(jsonResponse.content) {
        // Create rawdata Tab
        addRawDataTab(rawdataTabID);
        drawRawdataDatatable(jsonResponse, rawdataTabID);
    }
    else {
        console.error("TODO in RawDataForm.js : UNEXPECTED response on rawdata callAjax ! (708)");

        // Set cursor style to 'default' status
        $(document.body).css({'cursor': 'default'});
    }

}

/*function addRawDataResults(jsonResponse, rawdataTabID){

    var rawdataTabID = moment();

    addRawDataTab(rawdataTabID);

    drawRawdataDatatable(jsonResponse, rawdataTabID);

}*/




function drawRawdataDatatable(jsonResponse, rawdataTabID) {

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


    var datatableColumnDefs = buildRawdatColumnRefs(jsonResponse);

    $('#divRawdata'+rawdataTabID).append('<table id="tableRawdata'+rawdataTabID+'" class="display table table-striped table-bordered dataTable no-footer" cellspacing="0" width="100%"></table>');
    $('#tableRawdata'+rawdataTabID).DataTable( {

        dom: 'Bfrtip',
        buttons: [
            {
                extend: 'collection',
                text: 'Export',
                buttons: [
                    'copy',
                    {
                        extend: 'excel',
                        filename: 'local_hosts_dataTable.xlsx'
                    },
                    {
                        extend: 'csv',
                        filename: 'local_hosts_dataTable.csv'
                    },
                    'print'
                ]
            }
        ],

        order: [[ 0, 'desc' ]],

        data: jsonResponse.data,
        paging: false,
        pageLength: -1,
        scrollY: 1,
        scrollX: true,
        pageLength: 50,
        responsive: true,
        orderFixed: [ 0, 'desc' ],
        scrollCollapse: true,
        language: {
            "sInfo": 'Showing _END_ Entries.',
            "sInfoEmpty": 'No entries to show',
        },
        //fnDrawCallback: function() { var _this = this; setTimeout(function(){_this.DataTable().columns.adjust();}, 150) },
        fnInitComplete: function() { $( document ).trigger("dataTable_Loaded");},
        columnDefs: datatableColumnDefs,
        drawCallback: function ( settings ) {
            var api = this.api();
            var rows = api.rows( {page:'current'} ).nodes();
            var last=null;

            api.column(0, {page:'current'} ).data().each( function ( group, i ) {
                var cycleText = (group!='current') ? 'Cycle Date : '+group : 'Current Cycle';
                if ( last !== group ) {
                    $(rows).eq( i ).before(
                        '<tr class="group cyclerow"><td colspan="666">' + cycleText + '</td></tr>'
                    );

                    last = group;
                }
            } );

            var _this = this;
            setTimeout(function(){
                _this.DataTable().columns.adjust();
            }, 150);
        }

    } );

    // DOESN'T WORK WHEN "ORDERFIXED" CYCLE
    // Order by the grouping
    /*$('#tableRawdata' + rawdataTabID + ' tbody').on('click', 'tr.group', function () {
        var currentOrder = table.order()[0];
        console.error(currentOrder);
        if (currentOrder[0] === 0 && currentOrder[1] === 'asc') {
            table.order([0, 'desc']).draw();
            table.order.fixed([0, 'desc']).draw();
            $(this).parents("table").DataTable().order([[0, 'desc']]).draw();
        }
        else {
            table.order([0, 'asc']).draw();
            table.order.fixed([0, 'asc']).draw();
            $(this).parents("table").DataTable().order([[0, 'asc']]).draw();
        }
    });*/

    // Cheat : trigger draw to call drawCallback function in order to adjust column's width
    $('#tableRawdata'+rawdataTabID).DataTable().draw();

    drawShownColumnsSelector(rawdataTabID);



    // Set cursor style to 'default' status after datatable is created
    $(document.body).css({'cursor' : 'default'});

}


function buildRawdatColumnRefs(jsonResponse) {

    var colDefs = []

    for (var i = 0; i < jsonResponse.content.length; i++) {
        switch (jsonResponse.content[i]) {
            case "datecycle":
                //colDefs.push({"targets": i, "title": "Cycle Date", "visible": getRawdataShownColumnsSessionVariable()[jsonResponse.content[i]], "className": "dt-head-center dt-body-center"});
                colDefs.push({"targets": i, "title": "Cycle Date", "visible": false, "className": "dt-head-center dt-body-center"});
                break;
            case "iplocal":
                colDefs.push({"targets": i, "title": "Local Ip", "type": 'ip-address', "visible": getRawdataShownColumnsSessionVariable()[jsonResponse.content[i]], "className": "dt-head-center dt-body-center"});
                break;
            case "dir":
                colDefs.push({"targets": i, "title": "Direction", "type": 'ip-address', "visible": getRawdataShownColumnsSessionVariable()[jsonResponse.content[i]], "className": "dt-head-center dt-body-center"});
                break;
            case "ipextern":
                colDefs.push({"targets": i, "title": "External Ip", "visible": getRawdataShownColumnsSessionVariable()[jsonResponse.content[i]], "className": "dt-head-center dt-body-center",
                    "render": function ( data, type, row ) {
                        if(row[4] == "" || row[4] == "--")
                            return data;
                        else
                            return " <div title='"+countryTable[row[4]]+"' style = 'padding-right: 20px; background-image: url(images/flags/"+row[4].toLowerCase()+".png); background-position: right 2px top 3px; background-repeat: no-repeat;'>"+data+"</div>";
                            //return " <div style = 'padding-left: 30px; background-image: url(images/flags/af.png); background-position: 7px 7px; background-repeat: no-repeat;'>"+data+"</div>";
                            //return "<div style = 'padding-right: 30px; display: inline-block;'>"+data+" </div><img class='pull-right' src='images/flags/"+row[4].toLowerCase()+".png'>";
                    }
                });
                break;
            case "country":
                //colDefs.push({"targets": i, "title": "Country", "visible": getRawdataShownColumnsSessionVariable()[jsonResponse.content[i]], "className": "dt-head-center dt-body-center"});
                colDefs.push({"targets": i, "title": "Country", "visible": false, "className": "dt-head-center dt-body-center", "searchable": true,
                    "data": function ( row, type, val, meta ) {
                        if (type === 'filter' && countryTable[row[4]]) {
                            return countryTable[row[4]];
                        }
                        // 'sort', 'type' and undefined all j
                        return row[4];
                    }
                });
                break;
            case "asnum":
                colDefs.push({"targets": i, "title": "AS Num.", "visible": getRawdataShownColumnsSessionVariable()[jsonResponse.content[i]], "className": "dt-head-center dt-body-center",
                    "render": function ( data, type, row ) {
                        return " <div class='asnumTooltip' data-toggle='tooltip' data-placement='top' data-original-title='' onmouseover='retrieveASNum(this)' onmouseout='abordASNumRetrieval(this)' value="+data+">"+data+"</div>";
                    }
                });
                break;
            case "proto":
                colDefs.push({"targets": i, "title": "Protocole", "visible": getRawdataShownColumnsSessionVariable()[jsonResponse.content[i]], "className": "dt-head-center dt-body-center",
                    "render": function ( data, type, row ) {
                        if (protocoleTable[row[6]]) {
                            return " <div title='protocole id: "+row[6]+"'>"+protocoleTable[row[6]]+"</div>";
                        }
                        return row[6];
                    }
                });
                break;
            case "ptloc":
                colDefs.push({"targets": i, "title": "Local Port", "visible": getRawdataShownColumnsSessionVariable()[jsonResponse.content[i]], "className": "dt-head-center dt-body-center"});
                break;
            case "ptext":
                colDefs.push({"targets": i, "title": "External Port", "visible": getRawdataShownColumnsSessionVariable()[jsonResponse.content[i]], "className": "dt-head-center dt-body-center"});
                break;
            case "inctcpflags":
            case "inctcpflg":
                colDefs.push({"targets": i, "title": "Inc. TCP Flags", "visible": getRawdataShownColumnsSessionVariable()[jsonResponse.content[i]], "className": "dt-head-center dt-body-center"});
                break;
            case "outtcpflags":
            case "outtcpflg":
                colDefs.push({"targets": i, "title": "Out. TCP Flags", "visible": getRawdataShownColumnsSessionVariable()[jsonResponse.content[i]], "className": "dt-head-center dt-body-center"});
                break;
            case "inctraf":
                colDefs.push({"targets": i, "title": "Inc. Traffic", "visible": getRawdataShownColumnsSessionVariable()[jsonResponse.content[i]], "className": "dt-head-center dt-body-center"});
                break;
            case "outgtraf":
                colDefs.push({"targets": i, "title": "Out. Traffic", "visible": getRawdataShownColumnsSessionVariable()[jsonResponse.content[i]], "className": "dt-head-center dt-body-center"});
                break;
            case "incpkts":
                colDefs.push({"targets": i, "title": "Inc. Packets", "visible": getRawdataShownColumnsSessionVariable()[jsonResponse.content[i]], "className": "dt-head-center dt-body-center"});
                break;
            case "outgpkts":
                colDefs.push({"targets": i, "title": "Out. Packets", "visible": getRawdataShownColumnsSessionVariable()[jsonResponse.content[i]], "className": "dt-head-center dt-body-center"});
                break;
            case "application_id":
                colDefs.push({"targets": i, "title": "App. Id", "visible": getRawdataShownColumnsSessionVariable()[jsonResponse.content[i]], "className": "dt-head-center dt-body-center",
                    "data": function ( row, type, val, meta ) {
                        return ( (row[15].indexOf('z') == 0) ? row[15].substr(1) : row[15] );
                    }
                });
                break;
            case "firsttime":
                colDefs.push({"targets": i, "title": "First Time", "visible": getRawdataShownColumnsSessionVariable()[jsonResponse.content[i]], "className": "dt-head-center dt-body-center"});
                break;
            case "lasttime":
                colDefs.push({"targets": i, "title": "Last Time", "visible": getRawdataShownColumnsSessionVariable()[jsonResponse.content[i]], "className": "dt-head-center dt-body-center"});
                break;
            case "duration":
                colDefs.push({"targets": i, "title": "Duration", "visible": getRawdataShownColumnsSessionVariable()[jsonResponse.content[i]], "className": "dt-head-center dt-body-center"});
                break;
            case "appinfo":
                colDefs.push({"targets": i, "title": "App. Info", "visible": getRawdataShownColumnsSessionVariable()[jsonResponse.content[i]], "className": "dt-head-center dt-body-center"});
                break;
            default :
                console.error("UNEXPECTED rawdata field found : "+jsonResponse.content[i]+" ( in file RawDataForm.js ), %i ", 141);
                break;
        }

    }

    return colDefs;
}



function drawShownColumnsSelector(rawdataTabID) {

    $('#shownColumns a').on('click', function (event) {

        // Get the column API object
        var column = $('#tableRawdata' + rawdataTabID).DataTable().column($(this).attr('data-column'));

        // Toggle the visibility
        column.visible(!column.visible());



        // Blur (unfocus) clicked "a" tag
        $(event.target).blur();


        var div = $(this).find('div.columnIcon');

        if(div.hasClass("glyphicon-ok"))
            div.switchClass("glyphicon-ok", "glyphicon-remove")
        else
            div.switchClass("glyphicon-remove", "glyphicon-ok")

        // Prevent "a" tag default behavior (href redirection)
        //event.preventDefault();

        // Prevent Dropdown menu closing
        return false;
    });

}


function switchShownColumnState(a_element) {

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

    console.warn(iplocHidden);
    console.warn($("#iplocHidden"));
    console.warn($("#iploc").val());

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



