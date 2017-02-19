/**
 * Created by descombes on 19/02/17.
 */


/*********************************************************************************************************
 WSEventNotifier Constructor
 ********************************************************************************************************/


/**
 * Clock Object (Constructor)
 * @constructor
 */
function ClockWidget(ServerDate, div_clock_container)
{

    var _this = this;


    this.draw = function(div_clock_container) {

        div_clock_container.html('<ul class="nav navbar-nav pull-right margin-left-15px" title="Server Time">\
                                    <li class="active"><a><i class="fa fa-clock-o fa-1_3x" id="serverDate" aria-hidden="true"></i></a></li>\
                                </ul>')

    };


    // Make the function wait until the connection is made...
    this.update = function(dateString){
        $("#serverDate").html(" "+moment(dateString).add(parseInt(moment().format("Z")), "hours").format('HH:mm'));
    }


    this.init = function(div_clock_container)
    {
        this.draw(div_clock_container);
        ServerDate.addCallback("theClock", _this.update, 150);
    };

    this.draw(div_clock_container);
    this.init(div_clock_container);


}

