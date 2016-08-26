/**
 * Created by smile on 24/08/16.
 */


/**
 * RawData Results Table Creation Function
 * Creates a DataTable of query results "jsonResponse" from server inside the target tab "rawdataTabID"
 * @param jsonResponse : query results
 * @param rawdataTabID : target tab elements id suffix
 */
function drawRawdataDataTable(jsonResponse, rawdataTabID) {

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


    var datatableColumnDefs = buildRawdataColumnRefs(jsonResponse);

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

    // Cheat : trigger draw to call drawCallback function in order to adjust column's width
    $('#tableRawdata'+rawdataTabID).DataTable().draw();

    drawShownColumnsSelector(rawdataTabID);



    // Set cursor style to 'default' status after datatable is created
    //$(document.body).css({'cursor' : 'default'});

}





/**
 * RawData Results DataTable - Columns Definition Function
 * Define DataTable Columns according to RawData Query Results "jsonResponse"
 * @param jsonResponse : RawData Query Results
 * @returns {Array} of Columns Definition
 */
function buildRawdataColumnRefs(jsonResponse) {

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
                    }
                });
                break;
            case "country":
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


