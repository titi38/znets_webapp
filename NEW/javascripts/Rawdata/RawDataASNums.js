/**
 * Created by smile on 29/07/16.
 */



function initializeASNumsId(){

    ///callAJAX("getAsList.json", '', "json", setASNumsId, null);

    $('#ASId').bind('input keyup', function(){
        var _this = $(this);
        var delay = 1000; // 2 seconds delay after last input

        clearTimeout(_this.data('timer'));

        if(_this.val())
            _this.data('timer', setTimeout(function(){
                _this.removeData('timer');

                // Do your stuff after 2 seconds of last user input
                callAJAX("getAsName.json", 'as='+_this.val(), "json", setASNumsName, null);
            }, delay));
        else
            $('#ASName').html("No AS selected.")
    });

}



function setASNumsName(jsonResponse){

    if(jsonResponse)
        if(jsonResponse.n)
            $('#ASName').html(jsonResponse.n);
        else
            $('#ASName').html("AS selected (Name not found)");
    else
        $('#ASName').html("AS selected (Name not found)");

}

