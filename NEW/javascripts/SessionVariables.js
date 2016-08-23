/**
 * Created by smile on 17/06/16.
 */


/**
 * Session variable initialization function.
 * Initialize all rawdata column's visibility (to true) for user's local browser session.
 * @param tableColumns
 */
function initializeRawdataShownColumnsSessionVariable(tableColumns) {

    var rawdataShownColumns = {};

    for (var i = 0; i < tableColumns.length; i++) {

        if (tableColumns[i].title !== "country") {

            rawdataShownColumns[tableColumns[i].title] = true;

            $('#shownColumns').append('<li><a href="#" class="small" data-column="' + i + '" data-column-name="' + tableColumns[i].title + '"><div class="columnIcon glyphicon glyphicon-ok"></div>&nbsp;' + tableColumns[i].title + '</a></li>');

        }

    }

    // Put the object into storage
    localStorage.setItem('rawdataShownColumns', JSON.stringify(rawdataShownColumns));

}





/**
 * Session variable modification function.
 * Sets all rawdata column's visibility (to true or false) of user's local browser session.
 * @param tableColumns
 */
function setRawdataShownColumnsSessionVariable(tableColumns) {

    var rawdataShownColumns = getRawdataShownColumnsSessionVariable();

    for (var i = 0; i < tableColumns.length; i++) {

        if(tableColumns[i].title !== "country") {

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
 * Retrieves all rawdata column's visibility (true or false) of user's local browser session.
 * @returns {*|string|string|string|string|null} (parsed JSON)
 */
function getRawdataShownColumnsSessionVariable() {

    var rawdataShownColumns = localStorage.getItem('rawdataShownColumns');

    return JSON.parse(rawdataShownColumns);

}


/**
 * Sets a specific (identified by key in array) rawdata column's visibility (to true or false) of user's local browser session.
 * @param key
 */
function changeRawdataShownColumnsSessionVariableKey(key) {

    var rawdataShownColumns = getRawdataShownColumnsSessionVariable();

    rawdataShownColumns[key] = !rawdataShownColumns[key];

    localStorage.setItem('rawdataShownColumns', JSON.stringify(rawdataShownColumns));

}
