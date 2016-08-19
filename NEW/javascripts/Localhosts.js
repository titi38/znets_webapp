/**
 * Created by smile on 30/06/16.
 */



function checkLocalhostTab(localhostIp, localhostName){

    var localhostNum = localhostIp.replace(/\./g, "");

    if( $('.tab'+localhostNum).length > 0 )
    {
        $('.tab'+localhostNum).find("a").click()
    }
    else
    {
        addLocalhostTab(localhostIp, localhostName);
    }

}


function addLocalhostTab(localhostIp, localhostName){

    var localhostNum = localhostIp.replace(/\./g, "");

    console.warn(localhostIp);

    var element_tab = $('<li class="tab'+localhostNum+' tab" title="Ip Adress: '+localhostIp+'"><a data-toggle="tab" href="#divLocalhost'+localhostNum+'">'+( (localhostName) ? localhostName : localhostIp )+' <span class="closeTab close-icon" title="Remove this page">&#x2715</span></a></li>');
    var element_div = $('<div class="tab-pane fade localhost" data-localhost-num="'+localhostNum+'" id="divLocalhost'+localhostNum+'">'+( (localhostName) ? localhostName : localhostIp )+'  Localhost Content</div>');

    element_tab.click(adjustOnTabClick);

    element_div.html(JST["localhostsTabsContent"]);

    $(".list.localhost-tab-list").append(element_tab);
    $(".tab-content.localhost-tab-content").append(element_div);

    $( document ).ready(function() {
        rivets.bind(
            $(element_div),
            {localhostNum: localhostNum,
                localhostIp: localhostIp}
        );
    });

    element_tab.find("a").click(function (e) {
        e.preventDefault();
        $(this).tab('show');

        // Show formular on localhost machine tab click
        $(this).parents(".wrapper.localhosts").siblings("#charts_form_container").show();
    });

    element_tab.find("a").click();

    element_tab.find(".closeTab").on('click', function(event){

        var tab2Switch = null;
        if($(this).parents('li').hasClass("active")) {
            if ($(this).parents('li').prev().length > 0) {
                tab2Switch = $(this).parents('li').prev().find("a");
            }else {
                tab2Switch = $(this).parents('li').next().find("a");
            }
        }

        var tabID = $(this).parents('a').attr('href');

        $(this).parents('li').remove();
        $(tabID).remove();

        if(tab2Switch)
            tab2Switch.click();

        event.stopPropagation();

    });



    element_div.find('ul.nav-nest a[data-toggle="tab"]').each( function () {

        $(this).on('click', function (e) {
            $($(e.target).parents("ul")[$(e.target).parents("ul").length-1]).find("li").removeClass("active");
        });

        $(this).on('shown.bs.tab', function (e) {

            loadChartJsonToDiv(e.target, false);

        });

    });

    initChartsTabsNavAnimation("#localhosts");

}



/*********************************************************************************************************
 Localhosts Constructor
 ********************************************************************************************************/

function Localhosts(theWSEventNotifier) {

    var localhostEntries = new Array();
    var loadingAJAX = true;
    var bufferSize = 0;
    var nextLocalhostId = 0;
    var firstSignificativeLocalhostReached = false;
    //var localhostId = -1;

    /*
     Display a new localhost entry into the Localhosts datatable
     Parameter : localhostEntry
     return : nothing
     */
    this.insertLocalhostDisplay = function(localhostEntry)
    {
        // TODO write D3JS update table function
        console.log("NEW ALERT ENTRY :");
        console.log(localhostEntry);

        var t = $('#tableLocalhosts').DataTable();

        t.row.add( [
            localhostEntry.severity,
            localhostEntry.date,
            localhostEntry.message,
            localhostEntry.detail
        ] ).draw( false );


    }


    this.addLocalhostEntry = function (id, severity, date, message, detail)
    {
        localhostEntries.push({"id": id, "severity" : severity, "date" : date, "message" : message, "detail" : detail});
        if (!loadingAJAX)
            this.unstackFIFO();
    }


    this.onWSConnect = function(){
        var _this = this;
        theWSEventNotifier.addCallback("notify", "localhosts", function (param_json) {
            _this.addLocalhostEntry(param_json.id, param_json.severity, param_json.date, param_json.message, param_json.detail);
        });
        // TODO CallAJAX to get Localhosts (getLocalhost.json)
        callAJAX('getListLocalhosts.json', '', 'json', _this.displayLocalhosts, _this);

    };


    this.unstackFIFO = function (){
        while (localhostEntries.length != 0)
        {
            var i = localhostEntries.shift();

            if(!firstSignificativeLocalhostReached && i.id == nextLocalhostId)
                firstSignificativeLocalhostReached = true;

            if(firstSignificativeLocalhostReached){
                this.insertLocalhostDisplay(i);
            }
        }
    };



    this.displayLocalhosts = function(jsonContent, _this)
    {

        bufferSize = jsonContent.bufSize;
        nextLocalhostId = jsonContent.nextId;

        var tableColumns = [];

        var lh_ipIndex = 0;
        var lh_nameIndex = 0;

        for (var i = 0; i < jsonContent.content.length; i++) {
            switch (jsonContent.content[i]) {
                case "ip":
                    tableColumns.push({'targets': i, "type": 'ip-address', 'title': "Ip", "className": "dt-head-center dt-body-center"});
                    lh_ipIndex = i;
                    break;
                case "name":
                    tableColumns.push({'targets': i, 'title': "Name", "className": "dt-head-center dt-body-center"});
                    lh_nameIndex = i;
                    break;
                case "network":
                    tableColumns.push({'targets': i, 'title': "Network", "className": "dt-head-center dt-body-center"});
                    break;
                case "lastSeen":
                    tableColumns.push({'targets': i, 'title': "Last seen", "className": "dt-head-center dt-body-center"});
                    break;
                case "mac":
                    tableColumns.push({'targets': i, 'title': "Mac Adress", "className": "dt-head-center dt-body-center"});
                    break;
                case "osName":
                    tableColumns.push({'targets': i, 'title': "OS Name", "className": "dt-head-center dt-body-center"});
                    break;
                case "arch64":
                    tableColumns.push({'targets': i, 'title': "Architecture", "className": "dt-head-center dt-body-center", "visible": false, "searchable": false});
                    break;
                case "mobile":
                    tableColumns.push({'targets': i, 'title': "Mobile", "className": "dt-head-center dt-body-center", "visible": false, "searchable": false});
                    break;
                case "locServices":
                    tableColumns.push({'targets': i, 'title': "Local Services", "className": "dt-head-center dt-body-center"});
                    break;
                case "extServices":
                    tableColumns.push({'targets': i, 'title': "External Services", "className": "dt-head-center dt-body-center"});
                    break;
            }
        }



        // Set Localhost global variable
        for (var i = 0; i < jsonContent.data.length; i++){

            var lh_ip = jsonContent.data[i][lh_ipIndex];
            var lh_name = jsonContent.data[i][lh_nameIndex];
            localhosts_Ip_Name_Array.push({ ip : lh_ip, name : lh_name});

        }

        //initialize localhost list in rawdata form now that "localhosts_Ip_Name_Array" global variable is setted
        initializeRawDataLocalhostsIp();


        $('#divLocalhosts').append('<table id="tableLocalhosts" class="display table table-striped table-bordered dataTable no-footer"></table>');

        var table = $('#tableLocalhosts').DataTable( {

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
                        {
                            extend: 'pdf',
                            filename: 'local_hosts_dataTable.pdf'
                        },
                        'print'
                    ]
                }
            ],

            data: jsonContent.data,
            columns: tableColumns,
            paging: false,
            pageLength: -1,
            scrollY: 1,
            responsive: true,
            scrollCollapse: true,
            language: {
                "sInfo": 'Showing _END_ Entries.',
                "sInfoEmpty": 'No entries to show',
            },
            fnInitComplete: function() { $( document ).trigger("dataTable_Loaded");},
            columnDefs: [
                {
                    "targets": 3,
                    "data": function ( row, type, val, meta ) {
                        if (type === 'display') {
                            return moment.duration({'seconds' : row[3]}).humanize();
                        }
                        else if (type === 'filter') {
                            return moment.duration({'seconds' : row[3]}).humanize();
                        }
                        return row[3];
                    }
                },
                {
                    // The `data` parameter refers to the data for the cell (defined by the
                    // `data` option, which defaults to the column being worked with, in
                    // this case `data: 0`.
                    "render": function ( data, type, row ) {

                        return data + ( (row[6] === "t") ? " <img src='../../images/64bit-icon.png' height='20px' title='64-bits' alt='64-bits'/>" : "" ) + ( (row[7] === "t") ? " <img src='../../images/mobile-icon.png' height='20px' title='Mobile' alt='Mobile'/>" : "" );

                    },
                    "targets": 5
                },
                { "targets": [8, 9],
                    "createdCell": function (td, cellData, rowData, row, col) {
                        $(td).attr("title",cellData);
                    },
                    "render": function ( data, type, row ) {
                        var renderedString = data.toString().substring(0, 30);
                        return renderedString+ ( (data.toString() != renderedString) ? "..." : "" );
                    }
                }

            ],
            "rowCallback": function( row, data ) {
                $(row).attr("role", "button");
                $(row).off("click");
                $(row).on("click", function(){
                    // TODO : click on localhost (show localhost details)
                    console.warn( 'TODO: click on localhost ROW (show localhost details ???)' );
                    checkLocalhostTab(data[0], data[1]);
                });

                /*if ( $.inArray(data.DT_RowId, selected) !== -1 ) {
                 $(row).addClass('selected');
                 }*/

            }

        } );

        _this.unstackFIFO();
        loadingAJAX = false;

    };



    this.init = function()
    {
        var _this = this;
        theWSEventNotifier.waitForSocketConnection(
            _this.onWSConnect()
        );
    };

}


/**
 * Function to be used as search function in Array.prototype.find() function
 * in order to find element (localhost) whose ip is past as second attribute of find function ( attribute as 'this' inside findIp function)
 * @param element
 * @param index
 * @param array
 * @returns {boolean} true if
 */
function findIp(element, index, array) {
    return element.ip == this.toString();
}



/**
 * Function to be used as search function in Array.prototype.find(function, thisArgument) function
 * in order to find element (localhost) whose name is past as second attribute 'thisArgument' of find function ( attribute as 'this' inside findName function)
 * @param element
 * @param index
 * @param array
 * @returns {boolean}
 */
function findName(element, index, array) {
    return element.name == this.toString();
}



