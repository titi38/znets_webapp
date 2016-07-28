/**
 * Created by smile on 30/06/16.
 */



function addLocalhostTab(localhostName){

    var ai = (localhostName === 'Global') ? 'active in' : '';
    var a = (localhostName === 'Global') ? 'active' : '';

    var element_tab = $('<li class="tab'+localhostName+' tab '+a+'"><a data-toggle="tab" href="#divLocalhost'+localhostName+'">'+localhostName+'</a></li>');
    var element_div = $('<div class="tab-pane fade localhost '+ai+'" data-localhost="'+localhostName+'" id="divLocalhost'+localhostName+'">'+localhostName+'  Localhost Content</div>');



    element_div.html(JST["localhostsTabsContent"]);

    $(".list.localhost-tab-list").append(element_tab);
    $(".tab-content.localhost-tab-content").append(element_div);


    $( document ).ready(function() {
        rivets.bind(
            $(element_div),
            {localhost: localhostName}
        );
    });

    element_tab.find("a").click(function (e) {
        e.preventDefault();
        $(this).tab('show');
    });


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
            tableColumns.push({'title': jsonContent.content[i]});

            if(jsonContent.content[i] === "ip")
                lh_ipIndex = i;

            if(jsonContent.content[i] === "name")
                lh_nameIndex = i;
        }



        // Set Localhost global variable
        for (var i = 0; i < jsonContent.data.length; i++){

            var lh_ip = jsonContent.data[i][lh_ipIndex];
            var lh_name = jsonContent.data[i][lh_nameIndex];
            localhosts_Ip_Name_Array.push({ ip : lh_ip, name : lh_name});

        }


        $('#divLocalhosts').append('<table id="tableLocalhosts" class="display"></table>');

        $('#tableLocalhosts').DataTable( {

            data: jsonContent.data,

            iDisplayLength: 25,
            columns: tableColumns,
            scrollY: 1,
            lengthMenu: [[ 10, 25, 50, 100, -1 ],[ 10, 25, 50, 100, "All" ]],
            pageLength: 50,
            responsive: true,
            scrollCollapse: true,
            sDom: '<"dataTable_Header"lf><"dataTable_Content"rt><"dataTable_Footer"ip><"clear">',
            fnInitComplete: function() { $( document ).trigger("dataTable_Loaded"); this.fnPageChange( 'last' ) },
            columnDefs: [

                /*{
                    "render": function (data, type, row) {
                        return moment.duration({'seconds': data}).humanize();
                    },
                    "targets": 3
                },*/
                {
                    "targets": 3,
                    "data": function ( row, type, val, meta ) {
                        /*if (type === 'set') {
                            console.error("setting");
                            row.price = val;
                            // Store the computed display and filter values for efficiency
                            row.price_display = moment.duration({'seconds' : val}).humanize();
                            row.price_filter  = moment.duration({'seconds' : val}).humanize();
                            return;
                        }
                        else */
                        if (type === 'display') {
                            return moment.duration({'seconds' : row[3]}).humanize();
                        }
                        else if (type === 'filter') {
                            return moment.duration({'seconds' : row[3]}).humanize();
                        }
                        // 'sort', 'type' and undefined all j
                        return row[3];
                    }
                },
                {
                    // The `data` parameter refers to the data for the cell (defined by the
                    // `data` option, which defaults to the column being worked with, in
                    // this case `data: 0`.
                    "render": function ( data, type, row ) {

                        return data + ( (row[6] === "t") ? " <img src='../../images/64bit-icon-300x300.png' height='100%' title='64-bits' alt='64-bits'/>" : "" ) + ( (row[7] === "t") ? " <img src='../../images/mobile2.png' title='Mobile' alt='Mobile'/>" : "" );

                    },
                    "targets": 5
                },
                /*{
                    "render": function ( data, type, row ) {
                        switch (data){
                            case "t":
                                return "Yes";//"<div class='logWarningIcon' title='Warning'/>";
                                break;
                            case "f":
                                return "No";//"<div class='logAlertIcon' title='Alert'/>";
                                break;
                            default:
                                alert("localhosts datatable (Localhosts.js) : unexpected value found : "+ data+" ! (103)");
                                break;
                        }
                    },
                    "targets": 6
                },*/
                /*{
                    "render": function ( data, type, row ) {
                        switch (data){
                            case "t":
                                return "Yes";//"<div class='logWarningIcon' title='Warning'/>";
                                break;
                            case "f":
                                return "No";//"<div class='logAlertIcon' title='Alert'/>";
                                break;
                            default:
                                alert("localhosts datatable (Localhosts.js) : unexpected value found : "+ data+" ! (104)");
                                break;
                        }
                    },
                    "targets": [6, 7]
                },*/
                { "targets": [6, 7], "visible": false, "searchable": false },
                { "targets": [8, 9],
                    "createdCell": function (td, cellData, rowData, row, col) {
                        $(td).attr("title",cellData);
                    },
                    "render": function ( data, type, row ) {
                        var renderedString = data.toString().substring(0, 30);
                        return renderedString+ ( (data.toString() != renderedString) ? "..." : "" );
                    }
                },
                {
                    "targets": tableColumns.length,
                    "data": null,

                    "createdCell": function (td, cellData, rowData, row, col) {

                        var dataJsonObject = {};

                        for (var index in rowData) {
                            dataJsonObject[tableColumns[index].title] = rowData[index];
                        }

                        console.warn( 'TODO: click on localhost BUTTON CLICK (open localhost tab)' );
                        var button = $("<button type='button' class='btn btn-default'> Open Tab</button>").on("click", function(){console.log(dataJsonObject);});

                        $(td).empty();

                        $(td).append(button);
                    }
                }

            ],
            "rowCallback": function( row, data ) {
                $(row).attr("role", "button");
                $(row).off("click");
                $(row).on("click", function(){
                    // TODO : click on localhost (show localhost details)
                    console.warn( 'TODO: click on localhost ROW (show localhost details ???)' );
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



