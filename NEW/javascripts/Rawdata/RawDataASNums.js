/**
 * Created by smile on 29/07/16.
 */



function initializeASNumsId(){

    ///callAJAX("getAsList.json", '', "json", setASNumsId, null);

    $('#ASId').bind('input keyup', function(){
        var _this = $(this);
        var delay = 1000; // 1 second delay after last input

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




function retrieveASNum(el){

    ///callAJAX("getAsList.json", '', "json", setASNumsId, null);
    var element = $(el);
    var delay = 500; // 0.5 seconds delay after last input

    if($(element).attr('data-original-title') === "") {

        clearTimeout(element.data('timer'));

        if (element.html())
            element.data('timer', setTimeout(function () {
                element.removeData('timer');

                // Do your stuff after 2 seconds of last user input
                callAJAX("getAsName.json", 'as=' + element.html(), "json", setASToElementTitle, element);
            }, delay));
        else{
            $(element).attr('data-original-title', "No AS");
            $(element).attr("title", "No AS");
        }

    }

}




function abordASNumRetrieval(el){

    var element = $(el);

    clearTimeout(element.data('timer'));

}



function setASToElementTitle(jsonResponse, element){

    var title = "AS Name not found";

    if(jsonResponse)
        if(jsonResponse.n)
            title = jsonResponse.n;

    element.parents("table").dataTable().find("div.asnumTooltip[data-toggle='tooltip'][value='"+element.attr("value")+"']").each(function() {
        $(this).tooltip();
        $(this).attr('data-original-title', title);
        $(this).tooltip();
    });

    $(element).mouseover();

}

