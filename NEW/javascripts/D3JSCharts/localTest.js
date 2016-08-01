
//map
//drawChart("/dynamic/netTopCurrentCountryTraffic.json?net=labo","Graph");

//drawChart("netTopCurrentCountryTraffic.json","Graph");

//drawChart("/dynamic/netTop10appTraffic.json?service=loc&dd=2016-07-07%2011%3A44&df=2016-07-08%2011%3A44&dh=2", "Graph");
//drawChart("/dynamic/netNbExternalHosts.json?dd=2016-07-16%2011%3A44&df=2016-07-25%2011%3A44&pset=MINUTE", "Graph");
//drawChart("/dynamic/netNbLocalHosts.json?&pset=HOURLY&dd=2016-07-24+16%3A28&df=2016-07-25+16%3A28&dh=2", "Graph");
//drawChart("/dynamic/netTopHostsTraffic.json?dd=2016-07-19+23:00&df=2016-07-20+23:00&pset=HOURLY", "Graph");
//drawChart("/dynamic/netTopCountryTraffic.json?dd=2016-07-18%2011%3A44&df=2016-07-19%2011%3A44&pset=2&dh=2", "Graph");
//drawChart("/dynamic/netTopNbExtHosts.json?dd=2016-07-17+00:00&df=2016-07-22+23:59&pset=DAILY&dh=2", "Graph");
//drawChart("/dynamic/netNbLocalHosts.json?dd=2016-07-21+00:00&df=2016-07-21+23:59&pset=MINUTE&dh=2", "Graph");
//drawChart("/dynamic/netProtocoleTraffic.json?dd=2016-07-20%2011%3A44&df=2016-07-21%2011%3A44&pset=MINUTE&dh=2", "Graph");
//drawChart("/dynamic/netNbLocalHosts.json?dd=2016-07-01%2011%3A44&df=2016-07-20%2011%3A44&dh=2&pset=HOURLY", "Graph");
//drawChart("/dynamic/netTop10NbExtHosts.json?dd=2016-06-20%2011%3A44&df=2016-06-23%2011%3A44&dh=2", "Graph");
//drawChart("/dynamic/netTop10CountryTraffic.json?dd=2016-07-11%2011%3A44&df=2016-07-13%2011%3A44&dh=2", "Graph");
//drawChart("./netTop10appTraffic.json", "Graph");
//drawChart("./netTop10NbExtHosts.json", "Graph");
//drawChart("./netNbLocalHosts.json", "Graph");
//drawChart("./netTopHostsTraffic.json?pset=HOURLY","Graph");
//drawChart("worldmap.json","Graph");




function testtest(){

  var myWSEventNotifier = new WSEventNotifier('EventNotifier');

  /*********************************************************************************************************
   New Logs Object
   ********************************************************************************************************/
  test = new LastHourHistory(myWSEventNotifier);
  test.init();

  drawChart("/dynamic/netTopCurrentCountryTraffic.json?net=labo","Graph");

}

proxyPass = "dynamic/";
testtest();

test.addMinuteRequest("/dynamic/netTopCurrentCountryTraffic.json?net=labo",function(json){console.log(json);},40);
test.addMinuteRequest("/dynamic/netTopCurrentCountryTraffic.json?net=labo",function(json){console.log(json);},45);