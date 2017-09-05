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
function Localhosts(ServerDate) {

    var table;

    var autoUpdateEnabledByDefault = false;
    var datatable = null;
    var _this = this;

    this.resolveIp = function( ip ) {
        var localhostRows = datatable.rows().data();
        var found=false;
        var i = 0;

        for (; i < localhostRows.length && !found; i++) {
            found = (ip == localhostRows[i][0]);
        }
        if (found)
        {
            i--;
            var hsname=localhostRows[i][1];
            if (hsname !== "") return hsname;
            else return "No name";
        }
        else return "Unknown"
    }

    this.resolveHostName = function( hname ) {
        var localhostRows = datatable.rows().data();
        var found=false;
        var i = 0;

        for (; i < localhostRows.length && !found; i++) {
            found = (hname == localhostRows[i][1]);
        }
        if (found)
        {
            i--;
            return localhostRows[i][0];
        }
        else return "";
    }

    this.getAllIpAddress = function() {
        if (datatable == null || !datatable.rows())
            return [];
        var localhostRows = datatable.rows().data();
        var result = [];

        for (i = 0; i < localhostRows.length ; i++) {
            result [i] = localhostRows[i][0];
        }

        return result
    }

    this.getAllLocHostName = function() {
        if (datatable == null || !datatable.rows())
            return [];
        var localhostRows = datatable.rows().data();
        var result = [];

        for (i = 0; i < localhostRows.length ; i++) {
            result [i] = localhostRows[i][1];
        }

        return result
    }

    this.loadLocalHosts = function ()
    {
        var currentNetworkFilter = $("#filterNetworkLocalHosts").val();
        var params =  "";
        if (currentNetworkFilter !== "" && currentNetworkFilter !== null)
            params += "net=" + currentNetworkFilter;

        callAJAX('getListLocalhosts.json', params, 'json', _this.displayLocalHosts, _this);
    }

    this.updateListLocalHosts = function (jsonContent)
    {
        var mapIp = new Object();
        for (i = 0; i < datatable.rows().data().length ; i++)
            mapIp[datatable.rows().data()[i][0]]=datatable.rows().data()[i];

        for  (i = 0; i < jsonContent.data.length ; i++) {
            var ipData=jsonContent.data[i];
            if ( !(ipData[0] in mapIp) ) {
                //console.error("NEW HOST: " + ipData[0]);
                datatable.row.add( ipData ).draw( false );
                destroy_RawDataForm_autocompletion();
            }
            else
            {
               // mapIp[ipData[0]] = ipData.slice();

               for (j = 1; j < 7; j++)
                    mapIp[ipData[0]][j] = ipData[j];
            }
        }

        datatable.rows().invalidate();
        datatable.rows().draw( 'page' );
    }

    /**
     * Displays (in a DataTable) alerts list received from server after ajac query
     * @param jsonContent {JSON} Request's Response JSON
     * @param _this {Alerts} Self
     */
    this.displayLocalHosts = function(jsonContent, _this)
    {
        if (datatable !== null) {
            // The datatable is already created => update it !
            _this.updateListLocalHosts(jsonContent);
            return;
        }
        else
          $('#divLocalhosts').append('<table id="tableLocalhosts" class="display table table-striped table-bordered dataTable no-footer"></table>');

        // -------------------------------------------------------------------------------------------------------------

        datatable = $('#tableLocalhosts').DataTable( {
            data: jsonContent.data,
            dom: 'Bfrtip',
            buttons: [
                {
                    extend: 'collection',
                    text: 'Export List',
                    buttons: [
                        'copy',
                        {
                            extend: 'excel',
                            filename: 'local_hosts.xlsx'
                        },
                        {
                            extend: 'csv',
                            filename: 'local_hosts.csv'
                        },
                        'print'
                    ]
                }
            ],

            paging: true,
            pageLength: 100 /* -1 */,
            scrollY: 1,
            responsive: true,
            scrollCollapse: true,
            language: {
     //           "sInfo": 'Showing _END_ Entries.',
                "sInfoEmpty": 'No entries to show',
            },
            fnInitComplete: function() { $( document ).trigger("dataTable_Loaded"); initializeRawDataLocalhostsIp();
                                         $(".macadressTooltip").each(function( index ) {
                                                $( this ).tooltip(); });
            },
            columnDefs: [
                {'targets': 0, "type": 'ip-address', 'title': "Ip"},
                {'targets': 1, 'title': "Name", "sortable": true, "searchable": true },
                {'targets': 2, 'title': "Network", "sortable": true},
                {
                    "targets": 3, 'title': "Last seen", "sortable": true,
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
                {'targets': 4, 'title': "Mac Adress", "sortable": true,
                    "render": function ( data, type, row ) {
                        return " <div class='macadressTooltip' data-toggle='tooltip' data-placement='top' data-original-title='...' onmouseover='openResolveMacAddressPopup(this)' onmouseout='clearPopup(this)' value="+data+">"+data+"</div>";
                    }
                },
                {
                    // The `data` parameter refers to the data for the cell (defined by the
                    // `data` option, which defaults to the column being worked with, in
                    // this case `data: 0`.
                    "render": function ( data, type, row ) {

                        var os_icon = "";

                        if(data.indexOf("Windows") > -1)
                            os_icon = "<img src='../../images/win_icon.png' height='20px' title='Windows' alt='Microsoft'/> ";
                        else if(data.indexOf("Linux") > -1)
                            os_icon = "<img src='../../images/unix_icon.png' height='20px' title='Linux' alt='Linux'/> ";
                        else if(data.indexOf("Android") > -1)
                            os_icon = "<img src='../../images/android_icon.png' height='20px' title='Android' alt='Google Android'/> ";
                        else if(( data.indexOf("Mac") > -1 ) || ( data.indexOf("iPhone") > -1 ))
                            os_icon = "<img src='../../images/mac_icon.png' height='20px' title='Iphone' alt='Apple'/> ";

                        return os_icon + data + ( (row[6] === "t") ? " <img src='../../images/64bit-icon.png' height='20px' title='64-bits' alt='64-bits'/>" : "" ) + ( (row[7] === "t") ? " <img src='../../images/mobile-icon.png' height='20px' title='Mobile' alt='Mobile'/>" : "" );

                    },
                    "targets": 5, 'title': "OS Name", "sortable": true
                },
                {'targets': [6, 7], "visible": false, "searchable": false},
                { "targets": 8, 'title': "Local Services", "sortable": false,
                    "createdCell": function (td, cellData, rowData, row, col) {
                        $(td).attr("title",cellData);
                    },
                    "render": function ( data, type, row ) {
                        var renderedString = data.toString().substring(0, 30);
                        return renderedString+ ( (data.toString() != renderedString) ? "..." : "" );
                    }
                },
                { "targets": 9, 'title': "External Services", "sortable": false,
                    "createdCell": function (td, cellData, rowData, row, col) {
                        $(td).attr("title",cellData);
                    },
                    "render": function ( data, type, row ) {
                        var renderedString = data.toString().substring(0, 30);
                        return renderedString+ ( (data.toString() != renderedString) ? "..." : "" );
                    }
                },
                {
                  "targets": 10, 'data': null, "sortable": false, "searchable": false, "render": function ( data, type, row ) {
                     return "<div style='text-align: center'><button><i class='glyphicon glyphicon-search'></i></button></div>"; }
                },
                {"className": "dt-center dt-head-center", "targets": "_all"},
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
        update_RawDataForm_autocompletion();
    };


    this.init = function() {
        $('#autoUpdateLocalHosts').click(function() {
            var checked = $(this).prop('checked');

            $('#updateLH-button').prop('disabled', checked == true);
            myLocalhosts.autoUpdate(checked == true);
        });

        if (autoUpdateEnabledByDefault)
            this.autoUpdate(true);
        else
          this.loadLocalHosts();

        $('#autoUpdateLocalHosts').prop('checked', autoUpdateEnabledByDefault);
        $('#updateLH-button').prop('disabled', autoUpdateEnabledByDefault);

    };

    this.autoUpdate = function( enabled ) {
        if (enabled)
            ServerDate.addCallback("listLocalhost", _this.loadLocalHosts, null, 4999);
        else
            ServerDate.removeCallback("listLocalhost");
    }

    this.updateNetworkList = function( networksNamesArray ) {

        var htmlStr = "<option value=\"\" selected=\"\">All</option>";
        $.each( networksNamesArray, function( index, value ) {
            if(value !== null && typeof value === 'object')
            {
                for(var j=0 ; j<value.o.length; j++) {
                    htmlStr += "<option value='" + value.o[j] + "'>";
                    htmlStr += value.o[j]  + "</option>";
                }
            }
            else
              if (value !== "Global") {
                htmlStr += "<option value='" + value + "'>";
                htmlStr += value + "</option>";
            }
        });
        $("#filterNetworkLocalHosts").append(htmlStr);
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

    DefaultParamsSelection.setLocalHostIP(localhostIp);
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

    // Set charts preset view
    element_div.find(".chartTimePreset").html("Timeslice: "+$("#timeslice_ChartsForm").val().replace(/last/g, 'Last ').replace(/custom/g, 'Custom') + " | Timestep: " + $("#preset_ChartsForm").val().replace(/HOURLY/g, 'Hourly ').replace(/MINUTE/g, 'Minute').replace(/DAILY/g, 'Daily') + ( ($("#timeslice_ChartsForm").val().indexOf("last") > -1) ? ("") : (" | From: " + $("#dateDebCharts").val() + " | To: " + $("#dateFinCharts").val()) ) );


    element_tab.find("a").on('shown.bs.tab', function (e) {
        if($(element_div).find(".graph.tab-pane.fade.active").length === 0) $(element_div).find("a[href*='#trafficByProtocols']").click();
    });


    element_div.find(".chartNavDropdownButton").on("click", function() {
        if($(this).hasClass("fa-plus-square"))
            $(this).switchClass('fa-plus-square', 'fa-minus-square');
        else
            $(this).switchClass('fa-minus-square', 'fa-plus-square');
    });



    element_div.find(".chartNavDropdownContainer").on('hide.bs.dropdown', function (e) {

        $(this).find(".chartNavDropdownButton").each( function() { $(this).switchClass('fa-minus-square', 'fa-plus-square'); } );

    });

    element_div.find(".chartNavContainer").find("li a.navtab").on("click", function() {
        if($(this).find("i").hasClass("fa-plus-square"))
            $(this).find("i").switchClass('fa-plus-square', 'fa-minus-square');
        else
            $(this).find("i").switchClass('fa-minus-square', 'fa-plus-square');
    });


    initChartsTabsNavAnimation("#localhosts");

}



/**
 * RawData Results DataTable - Mac Organization Retrieval Function
 * THIS FUNCTION IS TRIGGERED ON MacAdress TABLE CELL MOUSEOVER
 * - Checks for cell's Mac Organization if it exists (Ajax request to server), once user's pointer stays over cell for 500ms
 * - Ajax request result will trigger Cell's Tooltip definition
 * @param el : cell element
 */

function openResolveMacAddressPopup(el){

    var element = $(el);
    var delay = 500; // 0.5 seconds delay after last input

    if($(element).attr('data-original-title') === "...") {

        clearTimeout(element.data('timer'));

        if (element.html())
            element.data('timer', setTimeout(function () {
                element.removeData('timer');

                callAJAX("getMacOrganization.json", 'mac=' + element.html(), "json", setMacAddressAndOpenPopup, element);
            }, delay));
        else
            setMacToElementTitle(null, element);
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

function setMacAddressAndOpenPopup(jsonResponse, element){

    var title = "Mac Organization not found";

    if (jsonResponse !== null && jsonResponse !== "" && jsonResponse.organization)
        title = jsonResponse.organization;

    $(".macadressTooltip").each(function( index ) {
        $(this).tooltip('hide');
    });
    $(element).attr('data-original-title', title);
    $(element).unbind('onmouseover');
    $(element).unbind('mouseover');

    $(element).tooltip('show');
    $(element).mouseover();
}

