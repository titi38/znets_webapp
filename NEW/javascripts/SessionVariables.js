/**
 * Created by smile on 17/06/16.
 */



function initializeRawdataShownColumnsSessionVariable(tableColumns) {

    var rawdataShownColumns = {};

    for (var i = 0; i < tableColumns.length; i++) {

        rawdataShownColumns[tableColumns[i].title] = true;

        $('#shownColumns').append('<li><a href="#" class="small" data-column="' + i + '" data-column-name="' + tableColumns[i].title + '"><div class="columnIcon glyphicon glyphicon-ok"></div>&nbsp;' + tableColumns[i].title + '</a></li>');

    }

    // Put the object into storage
    localStorage.setItem('rawdataShownColumns', JSON.stringify(rawdataShownColumns));

}


function setRawdataShownColumnsSessionVariable(tableColumns) {

    var rawdataShownColumns = getRawdataShownColumnsSessionVariable();

    for (var i = 0; i < tableColumns.length; i++) {

        if (rawdataShownColumns[tableColumns[i].title] == 'undefined' || rawdataShownColumns[tableColumns[i].title] == null)
        {
            rawdataShownColumns[tableColumns[i].title] = true;
            $('#shownColumns').append('<li><a href="#" class="small" data-column="' + i + '" data-column-name="' + tableColumns[i].title + '" onclick="switchShownColumnState($(this))"><div class="columnIcon glyphicon glyphicon-ok"></div>&nbsp;' + tableColumns[i].title + '</a></li>');
        }
        else {
            if ($('#shownColumns').find('a[data-column-name="' + tableColumns[i].title + '"]').length > 0)
            {
                if(rawdataShownColumns[tableColumns[i].title])
                    $('#shownColumns').find('a[data-column-name="'+tableColumns[i].title+'"]').find('div.columnIcon').switchClass('glyphicon-remove','glyphicon-ok');
                else
                    $('#shownColumns').find('a[data-column-name="'+tableColumns[i].title+'"]').find('div.columnIcon').switchClass('glyphicon-ok','glyphicon-remove');
            }
            else
            {
                $('#shownColumns').append('<li><a href="#" class="small" data-column="' + i + '" data-column-name="' + tableColumns[i].title + '" onclick="switchShownColumnState($(this))"><div class="columnIcon glyphicon ' + ( (rawdataShownColumns[tableColumns[i].title]) ? 'glyphicon-ok' : 'glyphicon-remove' ) + '"></div>&nbsp;' + tableColumns[i].title + '</a></li>')
            }
        }

    }

    /*rawdataShownColumns[key] = value;

     localStorage.setItem('rawdataShownColumns', JSON.stringify(rawdataShownColumns));*/

}


function getRawdataShownColumnsSessionVariable() {

    var rawdataShownColumns = localStorage.getItem('rawdataShownColumns');

    return JSON.parse(rawdataShownColumns);

}



function changeRawdataShownColumnsSessionVariableKey(key) {

    var rawdataShownColumns = getRawdataShownColumnsSessionVariable();

    rawdataShownColumns[key] = !rawdataShownColumns[key];

    localStorage.setItem('rawdataShownColumns', JSON.stringify(rawdataShownColumns));

}
