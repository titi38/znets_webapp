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

    var datatableColumnDefs = buildRawdataColumnRefs(jsonResponse, rawdataTabID);

    $('#divRawdata'+rawdataTabID).append('<table id="tableRawdata'+rawdataTabID+'" class="display table table-striped table-bordered dataTable no-footer" cellspacing="0" width="100%"></table>');
    $('#tableRawdata'+rawdataTabID).DataTable( {
//        div#divRawdata1490283095298.tab-pane.fade.active.in
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
        nowrap: true,
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
        "bProcessing": true,
        "bDeferRender": true,
        "bSortClasses": false,
        //fnDrawCallback: function() { var _this = this; setTimeout(function(){_this.DataTable().columns.adjust();}, 150) },
        fnInitComplete: function() { initLocalhostsNamePopup( rawdataTabID ); $( document ).trigger("dataTable_Loaded");},
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



function numberWithSeparator(x, sep) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, sep);
}

/**
 * RawData Results DataTable - Columns Definition Function
 * Define DataTable Columns according to RawData Query Results "jsonResponse"
 * @param jsonResponse : RawData Query Results
 * @returns {Array} of Columns Definition
 */
function buildRawdataColumnRefs(jsonResponse, rawdataTabID) {

    var colDefs = []

    for (var i = 0; i < jsonResponse.content.length; i++) {
        switch (jsonResponse.content[i]) {
            case "datecycle":
                //colDefs.push({"targets": i, "title": "Cycle Date", "visible": getRawdataShownColumnsSessionVariable()[jsonResponse.content[i]]});
                colDefs.push({"targets": i, "title": "Cycle Date", "visible": false});
                break;
            case "iplocal":
                colDefs.push({"targets": i, "title": "Local Ip", "type": 'ip-address', "visible": getRawdataShownColumnsSessionVariable()[jsonResponse.content[i]],
                    "render": function ( data, type, row ) {
                        return "<div data-toggle='tooltip' data-placement='top' data-original-title='...' class='rawdataResult_iplocal'>"
                            + data + "</div>";
                    }
                });
                break;
            case "dir":
                colDefs.push({"targets": i, "title": "Direction", "visible": getRawdataShownColumnsSessionVariable()[jsonResponse.content[i]],
                    "render": function ( data, type, row ) {
                       var dir="";
                       if (data === '>') dir="Outgoing";
                       else
                         if (data === '<') dir="Incoming";
                       return "<span data-toggle='tooltip' title='" + dir + "' style='text-align: center'>" + data + "</span>";
                    }
                    });
                break;
            case "ipextern":
                colDefs.push({"targets": i, "title": "External Ip", "type": 'ip-address', "visible": getRawdataShownColumnsSessionVariable()[jsonResponse.content[i]],
                            "render": function ( data, type, row ) {
                                dataIP = "<div data-toggle='tooltip' data-placement='top' data-original-title='...' onmouseover='openResolveHostNamePopup(this, \""+ rawdataTabID +"\");' onmouseout='clearPopup(this);' "
                                         + "class='rawdataResult_ipextern'>" + data + "</div>";

                                if (row[4] == "" || row[4] == "--")
                                    return dataIP;
                                else
                                    return dataIP
                                           + "<img src='images/flags/" + row[4].toLowerCase() + ".png' title='" + countryTable[row[4]] + "' />";
                            }
                });
                break;
            case "country":
                colDefs.push({"targets": i, "title": "Country", "visible": false, "searchable": true,
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
                colDefs.push({"targets": i, "title": "AS Num.", "visible": getRawdataShownColumnsSessionVariable()[jsonResponse.content[i]],
                    "render": function ( data, type, row ) {
                        return " <div class='rawdataResult_as' data-toggle='tooltip' data-placement='top' data-original-title='...' onmouseover='openResolveAsNamePopup(this, \""+ rawdataTabID +"\");' onmouseout='clearPopup(this)'>"
                               + data + "</div>";
                    }
                });
                break;
            case "proto":
                colDefs.push({"targets": i, "title": "Protocol", "visible": getRawdataShownColumnsSessionVariable()[jsonResponse.content[i]],
                    "render": function ( data, type, row ) {
                        if (protocolTable[row[6]]) {
                            return " <div title='protocol id: "+row[6]+"'>"+protocolTable[row[6]]+"</div>";
                        }
                        return row[6];
                    }
                });
                break;
            case "ptloc":
                colDefs.push({"targets": i, "title": "Local Port", "visible": getRawdataShownColumnsSessionVariable()[jsonResponse.content[i]],
                    "render": function ( data, type, row ) {
                        if ( data == 0 && (row[6] == 6 || row[6]== 17) )
                            return "*";
                        else return  "<div data-toggle='tooltip' data-placement='top' data-original-title='...' onmouseover='openResolvePortProtoNamePopup(this, \""+ rawdataTabID +"\");' onmouseout='clearPopup(this);' "
                                      + "data-port='" + data + "/" + row[6] + "' class='rawdataResult_port'>" + data + "</div>";
                    }});
                break;
            case "ptext":
                colDefs.push({"targets": i, "title": "External Port", "visible": getRawdataShownColumnsSessionVariable()[jsonResponse.content[i]],
                    "render": function ( data, type, row ) {
                        if ( data == 0 && (row[6] == 6 || row[6]== 17) )
                            return "*";
                        else return  "<div data-toggle='tooltip' data-placement='top' data-original-title='...' onmouseover='openResolvePortProtoNamePopup(this, \""+ rawdataTabID +"\");' onmouseout='clearPopup(this);' "
                            + "data-port='" + data + "/" + row[6] + "' class='rawdataResult_port'>" + data + "</div>";
                    }});
                break;
            case "inctcpflags":
            case "inctcpflg":
                colDefs.push({"targets": i, "title": "Inc. TCP Flags", "visible": getRawdataShownColumnsSessionVariable()[jsonResponse.content[i]]});
                break;
            case "outtcpflags":
            case "outtcpflg":
                colDefs.push({"targets": i, "title": "Out. TCP Flags", "visible": getRawdataShownColumnsSessionVariable()[jsonResponse.content[i]]});
                break;
            case "inctraf":
                colDefs.push({"targets": i, "title": "Inc. Traffic", "visible": getRawdataShownColumnsSessionVariable()[jsonResponse.content[i]],
                    "render": function ( data, type, row ) {
                        if (data == 0)
                          return "<span class='rawdataResult_amountIsNull'>" + data + "</span>";
                        else return numberWithSeparator(data,' ');
                    }
                });
                break;
            case "outgtraf":
                colDefs.push({"targets": i, "title": "Out. Traffic", "visible": getRawdataShownColumnsSessionVariable()[jsonResponse.content[i]],
                    "render": function ( data, type, row ) {
                        if (data == 0)
                            return "<span class='rawdataResult_amountIsNull'>" + data + "</span>";
                        else return numberWithSeparator(data,' ');
                    }});
                break;
            case "incpkts":
                colDefs.push({"targets": i, "title": "Inc. Packets", "visible": getRawdataShownColumnsSessionVariable()[jsonResponse.content[i]],
                    "render": function ( data, type, row ) {
                        if (data == 0)
                            return "<span class='rawdataResult_amountIsNull'>" + data + "</span>";
                        else return numberWithSeparator(data,' ');
                    }});
                break;
            case "outgpkts":
                colDefs.push({"targets": i, "title": "Out. Packets", "visible": getRawdataShownColumnsSessionVariable()[jsonResponse.content[i]],
                    "render": function ( data, type, row ) {
                        if (data == 0)
                            return "<span class='rawdataResult_amountIsNull'>" + data + "</span>";
                        else return numberWithSeparator(data,' ');
                    }});
                break;
            case "application_id":
                colDefs.push({"targets": i, "title": "App. Id", "visible": getRawdataShownColumnsSessionVariable()[jsonResponse.content[i]],
                    "data": function ( row, type, val, meta ) {
                        return ( (row[15].indexOf('z') == 0) ? row[15].substr(1) : row[15] );
                    }
                });
                break;
            case "firsttime":
                colDefs.push({"targets": i, "title": "First Time", "visible": getRawdataShownColumnsSessionVariable()[jsonResponse.content[i]]});
                break;
            case "lasttime":
                colDefs.push({"targets": i, "title": "Last Time", "visible": getRawdataShownColumnsSessionVariable()[jsonResponse.content[i]]});
                break;
            case "duration":
                colDefs.push({"targets": i, "title": "Duration", "visible": getRawdataShownColumnsSessionVariable()[jsonResponse.content[i]]});
                break;
            case "appinfo":
                colDefs.push({"targets": i, "title": "App. Info", "visible": getRawdataShownColumnsSessionVariable()[jsonResponse.content[i]]});
                break;
            default :
                console.error("UNEXPECTED rawdata field found : "+jsonResponse.content[i]+" ( in file RawDataForm.js ), %i ", 141);
                break;
        }

    }
    colDefs.push({"className": "dt-center dt-head-center", "targets": "_all"});

    return colDefs;
}


function clearPopup(el) {
    var element = $(el);
    clearTimeout(element.data('timer'));
}

// ---------------------------------------------------------------------------------------------------------------------
// POPUP - RESOLVE (EXTERNAL) HOSTNAME

/**
 * RawData Results DataTable - Mac Organization Retrieval Function
 * THIS FUNCTION IS TRIGGERED ON MacAdress TABLE CELL MOUSEOVER
 * - Checks for cell's Mac Organization if it exists (Ajax request to server), once user's pointer stays over cell for 500ms
 * - Ajax request result will trigger Cell's Tooltip definition
 * @param el : cell element
 */
function openResolveHostNamePopup(el, rawdataTabID){
    var element = $(el);
    var delay = 500; // 0.5 seconds delay after last input

    if($(element).attr('data-original-title') === "...") {

        clearTimeout(element.data('timer'));

        if (element.html())
            element.data('timer', setTimeout(function () {
                element.removeData('timer');

                callAJAX("resolv.json", 'ip=' + element.html(), "json", setHostNameAndOpenPopup, [ element, rawdataTabID ]);
            }, delay));
        else
            setHostNameAndOpenPopup(null, [ element, rawdataTabID ]);
    }
    else
        element.tooltip('show');
}

/**
 * RawData Results DataTable - Mac Cell's Tooltip Definition Function
 * - Sets Cell's Tooltip definition
 * - Trigger Cell Mouseover to show tooltip
 * @param jsonResponse : server's response containing Mac Organization
 * @param element : Cell Element
 */
function setHostNameAndOpenPopup(jsonResponse, params){

    var title = "No DNS record found";

    if(jsonResponse !== null && jsonResponse !== "" && jsonResponse.n)
      title = jsonResponse.n;

    var hname=$(params[0]).html();

    $('#tableRawdata'+params[1]).dataTable().$(".rawdataResult_ipextern").each(function( index ) {
        $( this ).tooltip('hide');
        if ($( this ).html() == hname ) {
            $(this).attr('data-original-title', title);
            $(this).unbind('onmouseover');
            $(this).unbind('mouseover');
        }
    });

    $(params[0]).tooltip('show');
    $(params[0]).mouseover();
}

// ---------------------------------------------------------------------------------------------------------------------
// POPUP - RESOLVE ASNUM


function openResolveAsNamePopup(el, rawdataTabID){

    var element = $(el);
    var delay = 500; // 0.5 seconds delay after last input

    if($(element).attr('data-original-title') === "...") {

        clearTimeout(element.data('timer'));

        if (element.html())
            element.data('timer', setTimeout(function () {
                element.removeData('timer');

                // Do your stuff after 2 seconds of last user input
                callAJAX("getAsName.json", 'as=' + element.html(), "json", setAsNameAndOpenPopup, [ element, rawdataTabID ]);
            }, delay));
        else
            setAsNameAndOpenPopup(null, [ element, rawdataTabID ]);
    }
    else
      element.tooltip('show');
}

function setAsNameAndOpenPopup(jsonResponse, params){

    var title = "No AS name found";

    if(jsonResponse !== null && jsonResponse !== "" && jsonResponse.n)
        title = jsonResponse.n;

    var asNum=$(params[0]).html();

    $('#tableRawdata'+params[1]).dataTable().$(".rawdataResult_as").each(function( index ) {
        $( this ).tooltip('hide');
        if ($( this ).html() == asNum ) {
            $(this).attr('data-original-title', title);
            $(this).unbind('onmouseover');
            $(this).unbind('mouseover');
        }
    });

    $(params[0]).tooltip('show');
    $(params[0]).mouseover();
}


// ---------------------------------------------------------------------------------------------------------------------
// POPUP - RESOLVE Port/Proto

function openResolvePortProtoNamePopup(el, rawdataTabID){

    var element = $(el);
    var delay = 500; // 0.5 seconds delay after last input

    if($(element).attr('data-original-title') === "...") {

        clearTimeout(element.data('timer'));

        if (element.data( "port" ))
            element.data('timer', setTimeout(function () {
                element.removeData('timer');

                var portProto = element.data( "port" ).split("/", 2);

                callAJAX("getPortServiceName.json", 'port=' + portProto[0] +'&proto=' + portProto[1] , "json", setPortProtoAndOpenPopup, [ element, rawdataTabID ]);
            }, delay));
        else
            setPortProtoAndOpenPopup(null, [ element, rawdataTabID ]);
    }
    else
        element.tooltip('show');
}

//
function setPortProtoAndOpenPopup(jsonResponse, params){

    var title = "Port Service not found";

    if(jsonResponse !== null && jsonResponse !== "" && jsonResponse.n)
        title = jsonResponse.n.match(/\(([^)]+)\)/)[1];;

    var portProto=$(params[0]).data( "port" );

    $('#tableRawdata'+params[1]).dataTable().$(".rawdataResult_port").each(function( index ) {
        $( this ).tooltip('hide');
        if ($( this ).data( "port" ) == portProto ) {
            $(this).attr('data-original-title', title);
            $(this).unbind('onmouseover');
            $(this).unbind('mouseover');
        }
    });

    $(params[0]).tooltip('show');
    $(params[0]).mouseover();
}

// ---------------------------------------------------------------------------------------------------------------------
// POPUP - set all local hosts' name

function initLocalhostsNamePopup( rawdataTabID ) {

    var theDataTable=$('#tableRawdata'+rawdataTabID).dataTable();

    theDataTable.$(".rawdataResult_ipextern").each(function( index ) {
        $( this ).tooltip();
    });
    theDataTable.$(".rawdataResult_as").each(function( index ) {
        $( this ).tooltip();
    });
    theDataTable.$(".rawdataResult_port").each(function( index ) {
        $( this ).tooltip();
    });

    var theIpLocal = theDataTable.$(".rawdataResult_iplocal");
    theIpLocal.each(function( index ) {
        if($(this).attr('data-original-title') === "...")
        {
            var iplocal = $( this ).html();
            var hname = myLocalhosts.resolveIp(iplocal);
            $(".rawdataResult_iplocal").each(function( index ) {
                if (iplocal === $( this ).html()) {
                    $(this).attr('data-original-title', hname);
                    $(this).tooltip();
                }
            });
        }
    });

}

