/**
 * Created by smile on 23/08/16.
 */




/**
 * Template retrieval function (simple)
 * @param templateUrl
 * @returns {*|string|string|string|string|null}
 */
function getTemplate(templateUrl) {
    return $.ajax({
        type: "GET",
        url: templateUrl,
        async: false
    }).responseText;
}


/**
 * Template retrieval function (complexe) with callback function + parameters
 * @param elementJQuery which will be injected ith the template
 * @param url of the template
 * @param callBack function triggered once the template is injected
 * @param callBackParams parameters of the callBack function
 */
function getHtmlTemplate( elementJQuery, url, callBack, callBackParams)
{
    $(elementJQuery).html(getTemplate(url)).promise().done(function(){
        if(callBack)
            if(callBackParams)
                callBack(callBackParams);
            else
                callBack();
    });
}