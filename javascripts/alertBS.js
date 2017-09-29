/**
 * Created by descombes on 18/04/17.
 */


function alertBS(title, content, butLabel, callBack)
{
    $("#alertBS_title").html(title);
    $("#alertBS_content").html(content);
    $("#alertBS_buttonLabel").html(butLabel);
    if (callBack != null)
        $("#alertBS_button").on('click', function() { callBack(); $('#alertBS_Modal').modal('hide'); } );
    else
        $("#alertBS_button").on('click', function() { $('#alertBS_Modal').modal('hide'); } );
    $('#alertBS_Modal').modal('show');
}


