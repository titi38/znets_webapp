/**
 * Created by descombes on 16/03/17.
 */


loadZnetsConfiguration = function() {

    callAJAX('getConfig.json', '', 'json', displayZnetsConfiguration, null);

}

/*********************************************************************************/

displayZnetsConfiguration = function(json) {

    var formatter = new JSONFormatter(json);

    $("#showConf-result").append(formatter.render());

}
