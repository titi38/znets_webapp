/**
 * Created by smile on 17/06/16.
 */


/**
 * RawData Colums - Session variable initialization function.
 * Initialize all rawdata column's visibility (to true) for user's local browser session.
 * @param tableColumns
 */
function initializeRawdataShownColumnsSessionVariable(tableColumns) {

    var rawdataShownColumns = {};

    for (var i = 0; i < tableColumns.length; i++) {

        if (tableColumns[i].title !== "country") {

            if (tableColumns[i].title !== "lasttime")
              rawdataShownColumns[tableColumns[i].title] = true;
            else   rawdataShownColumns[tableColumns[i].title] = false;

                $('#shownColumns').append('<li><a href="#" class="small" data-column="' + i + '" data-column-name="' + tableColumns[i].title + '"><div class="columnIcon glyphicon glyphicon-ok"></div>&nbsp;' + tableColumns[i].title + '</a></li>');
        }
    }

    // Put the object into storage
    localStorage.setItem('rawdataShownColumns', JSON.stringify(rawdataShownColumns));
}



/**
 * RawData Colums - Session variable modification function.
 * Sets all rawdata column's visibility (to true or false) of user's local browser session.
 * @param tableColumns
 */
function setRawdataShownColumnsSessionVariable(tableColumns) {

    var rawdataShownColumns = getRawdataShownColumnsSessionVariable();

    for (var i = 0; i < tableColumns.length; i++) {

        if(tableColumns[i].title !== "datecycle" && tableColumns[i].title !== "country") {

            if (rawdataShownColumns[tableColumns[i].title] === 'undefined' || rawdataShownColumns[tableColumns[i].title] === null) {
                rawdataShownColumns[tableColumns[i].title] = true;
                $('#shownColumns').append('<li><a href="#" class="small" data-column="' + i + '" data-column-name="' + tableColumns[i].title + '" onclick="switchShownColumnState($(this))"><div class="columnIcon glyphicon glyphicon-ok"></div>&nbsp;' + tableColumns[i].title + '</a></li>');
            }
            else {
                if ($('#shownColumns').find('a[data-column-name="' + tableColumns[i].title + '"]').length > 0) {
                    if (rawdataShownColumns[tableColumns[i].title])
                        $('#shownColumns').find('a[data-column-name="' + tableColumns[i].title + '"]').find('div.columnIcon').switchClass('glyphicon-remove', 'glyphicon-ok');
                    else
                        $('#shownColumns').find('a[data-column-name="' + tableColumns[i].title + '"]').find('div.columnIcon').switchClass('glyphicon-ok', 'glyphicon-remove');
                }
                else {
                    $('#shownColumns').append('<li><a href="#" class="small" data-column="' + i + '" data-column-name="' + tableColumns[i].title + '" onclick="switchShownColumnState($(this))"><div class="columnIcon glyphicon ' + ( (rawdataShownColumns[tableColumns[i].title]) ? 'glyphicon-ok' : 'glyphicon-remove' ) + '"></div>&nbsp;' + tableColumns[i].title + '</a></li>')
                }
            }

        }

    }

}


/**
 * RawData Columns - Columns Visibility Retrieval Function
 * Retrieves all rawdata column's visibility (true or false) of user's local browser session.
 * @returns {*|string|string|string|string|null} (parsed JSON)
 */
function getRawdataShownColumnsSessionVariable() {

    var rawdataShownColumns = localStorage.getItem('rawdataShownColumns');

    return JSON.parse(rawdataShownColumns);

}


/**
 * RawData Columns - Columns Visibility Modification Function
 * Sets a specific (identified by key in array) rawdata column's visibility (to true or false) of user's local browser session.
 * - Switch the visibility boolean of column referenced by "key"
 * - Saves new boolean value to the local storage (user's browser session)
 * @param key
 */
function changeRawdataShownColumnsSessionVariableKey(key) {

    var rawdataShownColumns = getRawdataShownColumnsSessionVariable();

    rawdataShownColumns[key] = !rawdataShownColumns[key];

    localStorage.setItem('rawdataShownColumns', JSON.stringify(rawdataShownColumns));

}



/**
 * RawData Columns - Columns Selector Interactions Function
 * Deals Columns Selector View changes and Interactions
 * @param rawdataTabID
 */
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

        // Prevent Dropdown menu closing
        return false;
    });

}





/**
 * RawData Columns - Shown Columns Selector - Column Visibility Switch Function
 * Switches RawData Columns Status (Visibility) in Session Variable (local storage)
 * @param a_element
 */
function switchShownColumnState(a_element) {

    // Refresh session variable shownColumns
    changeRawdataShownColumnsSessionVariableKey(a_element.attr('data-column-name'));

}

