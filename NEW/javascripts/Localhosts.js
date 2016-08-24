/**
 * Created by smile on 22/08/16.
 */



/**
 * Localhosts Tab Initialisation Function
 */
function initializeLocalhosts() {

    //$( "#charts_form" ).clone(true, true).appendTo( "#charts_form_container" );

    // Initialize localhosts "Inventory" tab
    $('.localhost-tab-list').find("a[href='#localhostsInventory']").click(function (e) {
        $(this).tab('show');

        // Hide formular on localhost machine tab click
        $(this).parents(".wrapper.localhosts").siblings("#charts_form_container").hide();
    });


    /*********************************************************************************************************
     Activate localhosts tab
     ********************************************************************************************************/
    activateTabOfClass("localhosts");

}



/*********************************************************************************************************
 Localhosts Constructor
 ********************************************************************************************************/
/**
 * Localhosts Object Constructor. Involves a WebSocket Event Listener in order to refresh known localhosts list.
 * Displays Localhosts in a table (DataTable)
 * @param theWSEventNotifier
 * @constructor
 */
function Localhosts(theWSEventNotifier) {

    var table;

    this.onWSConnect = function(){
        var _this = this;
        theWSEventNotifier.addCallback("notify", "date_processing", function () {
            console.error("UPDATING LOCALHOST TaBLE !!!!");
            _this.update();
        });

        _this.displayLocalhosts();

    };



    this.displayLocalhosts = function()
    {

        var lh_ipIndex = 0;
        var lh_nameIndex = 0;

        // Not Used !!!
        var tableColumns = [];

        $('#divLocalhosts').append('<table id="tableLocalhosts" class="display table table-striped table-bordered dataTable no-footer"></table>');

        table = $('#tableLocalhosts').DataTable( {

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

            ajax: {
                url: proxyPass+'getListLocalhosts.json',
                "dataSrc": function ( json ) {

                    for (var i = 0; i < json.response.content.length; i++) {
                        switch (json.response.content[i]) {
                            case "ip":
                                tableColumns.push({'targets': i, "type": 'ip-address', 'title': "Ip", "className": "dt-head-center dt-body-center"});
                                lh_ipIndex = i;
                                break;
                            case "name":
                                tableColumns.push({'targets': i, 'title': "Name", "className": "dt-head-center dt-body-center"});
                                lh_nameIndex = i;
                                break;
                            default :
                                // DO NOTHING
                                break;
                        }
                    }

                    // Set Localhost global variable
                    for (var i = 0; i < json.response.data.length; i++){

                        var lh_ip = json.response.data[i][lh_ipIndex];
                        var lh_name = json.response.data[i][lh_nameIndex];
                        localhosts_Ip_Name_Array.push({ ip : lh_ip, name : lh_name});

                    }

                    //initialize localhost list in rawdata form now that "localhosts_Ip_Name_Array" global variable is setted
                    initializeRawDataLocalhostsIp();


                    return json.response.data;
                }
            },
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
                {'targets': 0, "type": 'ip-address', 'title': "Ip", "className": "dt-head-center dt-body-center"},
                {'targets': 1, 'title': "Name", "className": "dt-head-center dt-body-center"},
                {'targets': 2, 'title': "Network", "className": "dt-head-center dt-body-center"},
                {
                    "targets": 3, 'title': "Last seen", "className": "dt-head-center dt-body-center",
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
                {'targets': 4, 'title': "Mac Adress", "className": "dt-head-center dt-body-center"},
                {
                    // The `data` parameter refers to the data for the cell (defined by the
                    // `data` option, which defaults to the column being worked with, in
                    // this case `data: 0`.
                    "render": function ( data, type, row ) {

                        return data + ( (row[6] === "t") ? " <img src='../../images/64bit-icon.png' height='20px' title='64-bits' alt='64-bits'/>" : "" ) + ( (row[7] === "t") ? " <img src='../../images/mobile-icon.png' height='20px' title='Mobile' alt='Mobile'/>" : "" );

                    },
                    "targets": 5
                },
                {'targets': [6, 7], "visible": false, "searchable": false},
                { "targets": 8, 'title': "Local Services", "className": "dt-head-center dt-body-center",
                    "createdCell": function (td, cellData, rowData, row, col) {
                        $(td).attr("title",cellData);
                    },
                    "render": function ( data, type, row ) {
                        var renderedString = data.toString().substring(0, 30);
                        return renderedString+ ( (data.toString() != renderedString) ? "..." : "" );
                    }
                },
                { "targets": 9, 'title': "External Services", "className": "dt-head-center dt-body-center",
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

            }

        } );

    };



    this.init = function()
    {
        var _this = this;
        theWSEventNotifier.waitForSocketConnection(
            _this.onWSConnect()
        );
    };



    this.update = function()
    {
        table.ajax.reload();
    }

}





/**
 * Checks if a specific Localhost's (sub)Tab already exists
 * If it exist, then Open this Localhost's Tab
 * If not, create and add this Localhost's Tab
 * @param localhostIp
 * @param localhostName
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





/**
 * Creation of Localhost's (sub)Tab Function
 * Creates and adds a specified Localhost's Tab (with interactions) in the user's interface
 * @param localhostIp
 * @param localhostName
 */
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


