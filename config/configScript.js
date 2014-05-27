var pcapDeviceDetected;

function infos(param)
{

  contentText="No description found";
  switch (param)
  {
  
    case 'usePcap':
	  contentText="Enables the acquisition from an interface in promiscuous mode.<BR/>(disable by default)";
	  break;
    case 'pcapDevice':
	  contentText="Defines the names of the physical interfaces to use. pcapDevice can be set to \"any\" to capture traffic from all interfaces.<BR/>(If not set, ZNeTS will use the first autodetected interface by default)";
	  break;  
    case 'pcapBufferSize':
	  contentText="Sets the buffer size (in MB)<BR>(default: 2)";
	  break; 
    case 'pcapFilter':
	  contentText="Sets the filter to use (in tcpdump format)<BR>(default: none)";
	  break;

	case 'useNetFlow':  
	contentText="Actives Netflow collector acquisition mode.<BR/>(disable by default)";
	
	
	case 'netFlowDevice':
	contentText="Defines the name of the physical interface to use<BR>(default: all)";
	break;
	
	
	
	case 'netFlowUdpPort':
	contentText="Sets the UDP port number to listen<BR>(default: 2055)";
	break;
	
	
	case 'netFlowIpDataSources':
	contentText="Sets IP of an authorized NetFlow exporter. There can be several netFlowIpDataSources entries.<BR>(default: all)";
	break;
	
	
	
	case 'sendNflowToHost':
	contentText="Switches the ZNeTS instance into probe mode. HOST is the collector to use.<BR>(default: None - No NetFlow are sent)";
	break;
	
	
	
	case 'sendNflowToPort':
	
	contentText="Sets the UDP port number to send netflow.<BR/>(defaut: 2055)";
	break;
	
	case 'DBMS':
	contentText="Disables the use of the DBMS. No stat will be processed.";
	break;
	
	
	case 'disableRecordDataflowToDatabase':
	contentText="Disables recording raw data into the DBMS. All charts will be available (except pie charts) and alerts will be raised normally.For use in case of very heavy traffic.";
	break;
	
	
	case 'databaseUser':
	contentText="Sets the PostgreSQL user to use to connect to DBMS<BR>(default: \"znets\")";
	break;
	
	
	case 'databasePassword':
	contentText="Sets the user PostgreSQL password to use to connect to DBMS<BR>(default: none)";
	break;
	
	
	case 'databaseIPaddr':
	contentText="Sets the IP address of the PostgreSQL server to use<BR>(default: 127.0.0.1)";
	break;
	
	
	
	case 'databasePort':
	contentText="Sets the TCP port to connect the PostgreSQL DBMS<BR>(default: 5432)";
	break;
	
	case 'databaseName':
	contentText="Sets the name of the PostgreSQL database<BR>(default: \"znets\")";
	break;
	
	
	case 'databaseNbConn':
	contentText="Sets the number of simultaneous connections pairs to DBMS<BR>(default: 5)";
	break;
	
	
	
	case 'databaseOthersOpts':
	contentText="Add DBMS connection options.<BR/>(See the Database Connection Control Functions of PostgreSQL documentation)<BR>(default: none)";
	break;
	
	
	case 'databaseQueryTimeout':
	contentText="Sets the maximum period allowed (in s) of a SQL query<BR>(default: 30 for 30s)";
	break;
	
	
	case 'databaseDataflowAutovacuumSize':
	contentText="Activates the automatic deletion of old data traffic<BR>(default: false)";
	break;
	
	case 'databaseDataflowAutovacuum':
	contentText="Activates the automatic deletion of old data traffic<BR>(default: false)";
	break;
	
	case 'disableHttpdServer':
	contentText="Disables the HTTP server<BR>(default: false)";
	break;
	
	
	
	case 'httpdDevice':
	contentText="Defines the name of the physical interface to use<BR>(default: all)";
	break;
	
	
	
	case 'httpdIpAllowed':
	contentText="Allows one or more machines to interact with the HTTP server If no machine is specified, anyone can access the server.<BR>(default:none)";
	break;
	
	
	case 'httpdPort':
	contentText="Sets the HTTP listening port<BR>(default: 8000)";
	break;
	
	
	case 'httpdAuthLoginPwd':
	contentText="Add a pair \"Login / Password\" allowed to connect the HTTP server (could be several entries)<BR/>(default none)";
	break;
	
	
	
	case 'httpdAuthPAM':
	contentText="Enable PAM authentification to connect the HTTP server<BR/>(default no)";
	break;
	
	
	
	case 'PAMservice':
	contentText="Set a PAM service file to use (by default, set to \"/etc/pam.d/login\")";
	break;
	
	
	case 'httpdAuthorizedPamUsers':
	contentText="Set a list of PAM users allowed to connect the HTTP server<BR/>(by default, all PAM users are allowed)";
	break;
	
	
	case 'httpdUseSSL':
	contentText="Uses HTTP over SSL";
	break;
	
	
	case 'httpdSSLcertFile':
	contentText="Sets SSL server certificate and key";
	break;
	
	
	
	case 'httpdSSLcertPwd':
	contentText="Sets SSL server certificate password";
	break;
	
	
	case 'httpdSSLCaFile':
	contentText="Sets SSL certification authority";
	break;
	
	
	
	case 'httpdAuthPeerSSL':
	contentText="Uses SSL client's authentification with certificate";
	break;
	
	
	case 'httpdAuthorizedPeerDN':
	contentText="Sets the Distinguished Name of autorized clients. There can be several httpdAuthorizedPeerDN entries.";
	break;
	
	
	case 'httpdNbThreads':
	contentText="Sets the number of HTTP server threads<BR>(default: 100)";
	break;
	
	case 'saveDataflowToFile':
	contentText="Saves the traffic data in files<BR>(default: off)";
	break;
	  
	  
	  
	  
	case 'dataflowFilePath':
	contentText="Sets the file Folder to use<BR>(default: none)";
	break;
	  
	  
	  
	case 'dataflowFileRotateDaily':
	contentText="Defines dataflowfiles as daily. They will be created and closed at midnight, UTC. Their name is \"dataflowDDMMYY.txt\"<BR>(default: true)";
	break;
	  
	  
	  
	case 'dataflowFileRotateHourly':
	contentText="Defines dataflowfiles as hourly. They will be created and closed hourly. Their name is \"dataflow_DDMMYY_XYh.txt\", where XY is the creation hour in UTC<BR>(default: false)";
	break;
	
	case 'nbCollectCyclePerHour':
	contentText="Sets the traffic data aggregation's Period<BR>(default: 4 - for every quarter of a hour)";
	break;
	
	case 'aggregateTcpClientPorts':
	contentText="Aggregates the client ports TCP connections (for 2 machines using the same identified TCP service)<BR>(default: false)";
	break;
	
	
	case 'aggregateUdpClientPorts':
	contentText="Aggregates the client ports UDP connections (for 2 machines using the same identified UDP service)<BR>(default: false)";
	break;
	
	
	case 'localNetwork':
	  contentText="Defines a network (or host) IP address.<BR/>There can be several localNetwork entries. The Name must not exceed 30 characters. If networks have the same name, their stastics will be aggregated. Moreover, it is possible to segment a network.<BR/>(and then, separate the statisics of a machine or machines group from the ones of the network they belong) The rules must be specify from the most restrictive to the most general ones.<BR/>(No default value: REQUIRED !)";
      break;
  
    case 'groupLocalNetwork':
      contentText="Defines an additional virtual hierarchy level in the tabs of the graphical interface (to decrease the number of visible local network's tabs). It only acts on the display aspect.";
      break;
  
    case 'localHostToIgnore':
      contentText="Adds a local machine to ignore. This machine will not appear in the statistics, and its traffic will be ignored. There can be several localHostToIgnore entries.<BR>(default: none)";
      break; 

    case 'downloadSuspiciousHostsList':
      contentText="Download a list of suspicious hosts. Lists' names are given in default configuration file. See znets.conf";
      break;
  
    case 'autoupdate':
      contentText="Automatically update suspicious hosts lists every day";
      break;
  
    case 'suspiciousHost':
      contentText="Adds an IP adress of an external machine defined as suspicious. An alert will be raised each time a local machine will interact with it. There can be several suspiciousHost entries.<BR>(default: none)";
      break;
  
    case 'loadSuspiciousHostsFile':
      contentText="Load an external file containing a list of IP addresses of suspicious external machines. In this file, addresses (NETWORK_ADDR/MASK) must be separated by a comma, a semicolon, a tab or a newline.<BR>(default: none)";
      break;
  
    case 'alertMaxDest':
      contentText="Sets the maximum number of external recipients authorized for a local machine by aggregation period. If set to 0, alertMaxDest is disabled.<BR>(default: 300)";
      break;
  
    case 'whiteListLHostMaxDest':
      contentText="Defines local machines authorized to contact unlimited number of destinations. There can be several whiteListLhostsMaxDest entries.<BR>(default: none)";
      break;
  
    case 'alertMaxInFlowByDest':
      contentText="Sets the number of unsuccessful connection from an external host to one local machine. If set to 0, alertMaxInFlowByDest is disabled.<BR>(default: 100)";
      break;
  
    case 'alertMaxOutFlowByDest':
      contentText="Sets the number of unsuccessful connections attempts from a local machine to one external host. If set to 0, alertMaxOutFlowByDest is disabled.<BR>(default: 100)";
      break;
  
    case 'whiteListLHostInc':
      contentText="Defines a local service of the local network or an extern machine, which should not generate alerts. There can be several whiteListLHostInc entries.<BR>(default: none)";
      break;
  
    case 'whiteListLHostOut':
      contentText="Defines an external service of the local network or a local machine, which should not generate alerts. There can be several whiteListLHostOut entries.<BR>(default: none)";
      break;
  
    case 'alertMaxMultOutScanDest':
      contentText="Sets the number of unsuccessful connections attempts from a local machine to one or more external hosts. If set to 0, alertMaxMultOutScanDest is disabled.<BR>(default: 150)";
      break;
  
    case 'whiteListLHost':
      contentText="Sets local host(s) that will never raised alert";
      break;
  
    case 'whiteListEHost':
      contentText="Sets external host(s) that will never raised alert";
      break;
  
    case 'alertMaxExtSMTPtraffic':
      contentText="Sets the SMTP maximum amount of traffic (in KB) allowed to an external server If set to 0, alertMaxExtSMTPtraffic is disabled.<BR>(default: 10000)";
      break;

    case 'checkDNSquery':
      contentText="Activates the external DNS alerts";
      break;
  
    case 'externalDNSLists':
      contentText="Adds a valid extern DNS server IP. DNS alert will be raised, each time a local host try to use an address that was not explicitly specified. There can be several externalDNSLists entries.<BR>(default: none)";
      break;
  
    case 'checkMacAddress':
      contentText="Enable MAC Spoofing detection ! Raised an Alert as soon as a duplicate IP address is detected. Should be enable only into non-routed networks.<BR>(disable by default)";
      break;
  
    case 'whiteListDupIp':
      contentText="Defines an IP which can be attributed to several ethernet addresses. There can be several whiteListDupIp entries.<BR>(default: none)";
      break;
  
    case 'ipMaxLeaseTime':
      contentText="Specifies your DHCPd Ip Max Lease Time (in seconds). (defaut: 300)";
      break;
  
    case 'sendMailOnAlert':
      contentText="Enables the automatic mail alert sending.<BR>(default: false)";
      break;
  
    case 'mailServer':
      contentText="Specifies the mail server to use<BR>(default: none)";
      break;
  
    case 'mailSrc':
      contentText="Specifies the sender email adress<BR>(default: \"ALERT@znets.net\")";
      break;
  
    case 'mailDst':
      contentText="Specifies the recipient emails list (separated by a coma)<BR>(default: none)";
      break;
  
    case 'mailHostname':
      contentText="If Specified, use it to generate a redirection link to the ZNeTS interface, into the email alert.<BR>(default: none)";
      break;
  
    case 'verboseMode':
      contentText="Switches to a very verbose debug mode";
      break;
  
    case 'useSyslogd':
      contentText="Logs into local syslog deamon";
      break;
  
    case 'disableIpV4':
      contentText="Services listen only on IpV6 sockets<BR>(default: dual sockets are used)";
      break;
  
    case 'disableIpV6':
      contentText="Services listen only on IpV4 sockets<BR>(default: dual sockets are used)";
      break;
  
    case 'whoisCmd':
      contentText="Set the external whois command to use.<BR>(default: none)";
      break;

    case 'processCycleOnExit':
      contentText="Process last data before exiting. If enabled, stopping ZNeTS may take several minutes.<BR>(default behavior is to ignore last data cycle)";
      break;
	  
	  
	case 'paranoiacSuspiciousMode':
	contentText="Raised more alerts";
	break;
	  
    defaut:
      break;
  }

  dojo.require("dijit.Dialog");
  var myDialog = new dojox.widget.Dialog({
	title:param,
	showTitle: true,
	content: "<BR/>"+contentText,
	draggable:true,
	easing: dojo.fx.easing.elasticOut,
	sizeDuration:900,
	sizeMethod:"combine"
	});
  myDialog.startup();
  myDialog.show();
}

function loadJson(urlJson, functionTreatment)
{
	var bindArgs = 
	{
		url: urlJson,
		sync:true, 
		error: function(type, data, evt) { alert("error"); },
			mimetype: "text/json",
			load: function (res, io) {
			    jsonEval=eval("(" + res + ")");
			    if(jsonEval.errMsg) alert(urlJson + " Bug Report: "+jsonEval.errMsg);
			    functionTreatment(jsonEval); }
	};
	var req = dojo.xhrGet(bindArgs);
}	

function loadListPcapDevice()
{
	loadJson("/getListPcapDevice.json", setInterfaceFromJson);
}

function loadConfig()
{
	loadJson("/getConfig.json", setConfigFromJson);
}

var validIP=false;
			
function isValidIp(ip)
{
	validIP=false;
	loadJson("/isValidIp.json?ip="+ip, isValidIpResult);
    return validIP;
}
			
function isValidIpResult( jsonItf )
{
  validIP=jsonItf.res == "true";
}

var pgConnResult=false;

function testPgConn (databaseName, databaseUser,databasePassword,databaseIPaddr,databasePort,databaseOpts)
{
  pgConnResult=false;
  loadJson("/testPgConn.json?dbName="+databaseName+"&dbUser="+databaseUser+"&dbPwd="+databasePassword+"&dbHost="+databaseIPaddr+"&dbPort="+databasePort+"&dbOpts="+databaseOpts, testPgConnResult);
  return pgConnResult;
}

function testPgConnResult( jsonItf )
{
  pgConnResult=jsonItf.res == "true";
}

function setInterfaceFromJson( jsonItf )
{
	pcapDeviceDetected=jsonItf;
			
	var select = document.getElementById("listPcap");
	for(var i=0; i<jsonItf.data.length; i++)
	{
		//alert(jsonItf.data[i].name);
		theOption= new Option(jsonItf.data[i].name);
		theOption.title=jsonItf.data[i].desc;
		select.options[select.options.length] = theOption;
	}
	PcapDeviceButtonsSetter();
}



			
			
			
function effacer()
{
	var compteselect=0;

	for(var yo=document.form.listPcap.length-1;yo>0;yo--)
	//for(yo=0;yo<document.form.listPcap.length;yo++)
	{
		if(document.form.listPcap.options[yo].selected == true)
			compteselect++;

		if(compteselect>0)
		{
			//for(yo=0;yo<document.form.listPcap.length;yo++)
			for(var yo=document.form.listPcap.length-1;yo>=0;yo--)
			{
				if(document.form.listPcap.options[yo].selected == true)
				{
					if ( document.form.listPcap.options[yo].value !== 'Please choose an interface' )
					{
						var monitored = document.form.listPcap.options[yo];
						var select = document.getElementById("listPcapM");
						select.options[select.options.length] = new Option(monitored.value);
						document.form.listPcap.options[yo] = null;
					}
				}
			}
		}
	}
				
}
			
	
	
function updateLocalNetworkListCombo ()
{

	for(var yo=document.form.LocalNetworkNameSelect.length-1;yo>0;yo--)
	  if ( document.form.LocalNetworkNameSelect.options[yo].value != 'Default Local Network' )
	    document.form.LocalNetworkNameSelect.options[yo] = null;

	//GroupNetwork

	var table = document.getElementById('localhostTable');
	var rowCount = table.rows.length;
	
	for(var i=1; i<rowCount; i++) 
	{
		var row = table.rows[i];
		var lnetname = row.cells[0].childNodes[1].value;
		var select = document.getElementById("LocalNetworkNameSelect");
		newOption2= new Option(lnetname);
		select.options[select.options.length] = newOption2;
	}

}


	
			
	
function setConfigFromJson( jsonConf )
{
	document.getElementById('localhostsToIgnore').value = "ip/mask";
	document.getElementById('groupLocal').value = "MyGroupName";
	document.getElementById('httpdAuthorizedPamUsers').value = "MyLogin";
	
	for(var i=0; i<jsonConf.localNetworks.length; i++)
		//addRowLocalHost( "localhostTable", jsonConf.localNetworks[i].v,jsonConf.localNetworks[i].n);
		addRow3Col("localhostTable", jsonConf.localNetworks[i].v,jsonConf.localNetworks[i].n);

	for(var i=0; i<jsonConf.pcapDevice.length; i++)
	{
		if (jsonConf.pcapDevice[i] != "")
		{
			isDetected=false;
			for(var j=0; j<pcapDeviceDetected.data.length && !isDetected; j++)
				isDetected= (jsonConf.pcapDevice[i] == pcapDeviceDetected.data[j].name);
				 
			addRowItf( "pcapDeviceTable", jsonConf.pcapDevice[i], isDetected);
		}
	}
	
	for(var i=0; i<jsonConf.suspiciousHostList.length; i++)
	{
	    dir=jsonConf.suspiciousHostList[i].dir;
		for(var j=0; j<jsonConf.suspiciousHostList[i].list.length; j++)
		addRow3Col( "suspiciousListTable",dir, jsonConf.suspiciousHostList[i].list[j].name + " (" + jsonConf.suspiciousHostList[i].list[j].nb + ")");
	}
	for(var i=0; i<jsonConf.httpdAuthorizedPeerDNs.length; i++)
		addRow2Col( "httpdAuthorizedPeerDNsTable",jsonConf.httpdAuthorizedPeerDNs[i], "httpdAuthorizedPeerDNs");
		
	for(var i=0; i<jsonConf.httpdAuthorizedPamUsers.length; i++)
		addRow2Col( "httpdAuthorizedPamUsersTable",jsonConf.httpdAuthorizedPamUsers[i], "httpdAuthorizedPamUsers");
		
	for(var i=0; i<jsonConf.ignoredLocalhosts.length; i++)
		addRow2Col( "ignoredLocalhostsTable",jsonConf.ignoredLocalhosts[i], "ignoredLocalhosts");

	for(var i=0; i<jsonConf.httpdAuthLoginPwd.length; i++)
		addRow2Col( "httpdAuthLoginPwdTable",jsonConf.httpdAuthLoginPwd[i], "httpdAuthLoginPwd");

		
		
	// LIST DBMS
	var select = document.getElementById("DBMS");
	newOption= new Option(jsonConf.DBMS);
	select.options[select.options.length] = newOption;
	
	newOption2= new Option('None');
	select.options[select.options.length] = newOption2;


	
	document.getElementById('usePcap').checked = ( jsonConf.usePcap.toLowerCase() == "true" );
	document.getElementById('useNetFlow').checked = ( jsonConf.useNetFlow.toLowerCase() == "true" );
			  
	document.getElementById('disableIpV4').checked = ( jsonConf.disableIpV4.toLowerCase() == "true" );
	document.getElementById('disableIpV6').checked = ( jsonConf.disableIpV6.toLowerCase() == "true" );
	document.getElementById('whoisCmd').value = jsonConf.whoIsCmd;
	document.getElementById('processCycleOnExit').value = jsonConf.processCycleOnExit;

	document.getElementById('nbCollectCyclePerHour').value = jsonConf.nbCollectCyclePerHour;
	
	
	
	
	document.getElementById('pcapBufferSize').value = jsonConf.pcapBufSize;
	document.getElementById('pcapFilter').value = jsonConf.pcapFilter;
	document.getElementById('netFlowDevice').value = jsonConf.netFlowDevice;
	document.getElementById('netFlowUdpPort').value = jsonConf.netFlowUdpPort;
	document.getElementById('netFlowIpDataSources').value = jsonConf.netFlowIpDataSources;
	document.getElementById('sendNflowToHost').value = jsonConf.sendNflowToHost;
	document.getElementById('sendNflowToPort').value = jsonConf.sendNflowToPort;
			  
    document.getElementById('disableRecordDataflowToDatabase').checked = ( jsonConf.disabledRecordDataflowToDatabase.toLowerCase() == "true" );

	document.getElementById('databaseUser').value = jsonConf.databaseUser;
	document.getElementById('databasePassword').value = jsonConf.databasePassword;
	document.getElementById('databaseIPaddr').value = jsonConf.databaseIPaddr;
	document.getElementById('databasePort').value = jsonConf.databasePort;
	document.getElementById('databaseName').value = jsonConf.databaseName;
	document.getElementById('databaseNbConn').value = jsonConf.databaseNbConn;
			  
	document.getElementById('databaseDataflowAutovacuum').checked = ( jsonConf.databaseDataflowAutovacuum.toLowerCase() == "true" );
			  
	document.getElementById('databaseDataflowAutovacuumSize').value = jsonConf.databaseDataflowAutovacuumSize;
			  
	document.getElementById('disableHttpdServer').checked = ( jsonConf.httpdServer.toLowerCase() == "false" );
			  
	document.getElementById('httpdDevice').value = jsonConf.httpdDevice;
	document.getElementById('httpdIpAllowed').value = jsonConf.httpdIpAllowed;
	document.getElementById('httpdPort').value = jsonConf.httpdPort;
			  
	document.getElementById('httpdAuthPAM').checked = ( jsonConf.httpdAuthPAM.toLowerCase() == "true" );
	document.getElementById('PAMservice').value = jsonConf.pamService;
	document.getElementById('httpdAuthorizedPamUsers').value = jsonConf.httpdAuthorizedPamUsers;

	document.getElementById('httpdUseSSL').checked = ( jsonConf.httpdUseSSL.toLowerCase() == "true" );
	document.getElementById('httpdSSLcertFile').value = jsonConf.httpdSSLcertFile;
	document.getElementById('httpdSSLcertPwd').value = jsonConf.httpdSSLcertPwd;
	document.getElementById('httpdSSLCaFile').value = jsonConf.httpdSSLCaFile;
	document.getElementById('httpdAuthPeerSSL').checked = ( jsonConf.httpdAuthPeerSSL.toLowerCase() == "true" );
	//A faire list		  //document.getElementById('httpdAuthorizedPeerDN').value = jsonConf.ignoredLocalhosts;
	document.getElementById('httpdNbThreads').value = jsonConf.httpdNbThreads;
			  
			  
			  
	document.getElementById('saveDataflowToFile').checked = ( jsonConf.saveDataflowToFile.toLowerCase() == "true" );
	document.getElementById('dataflowFilePath').value = jsonConf.dataflowFilePath;
			  
	document.getElementById('dataflowFileRotateDaily').checked = ( jsonConf.dataflowFileRotateDaily.toLowerCase() == "true" );
	document.getElementById('dataflowFileRotateHourly').checked = ( jsonConf.dataflowFileRotateHourly.toLowerCase() == "true" );
			  
	document.getElementById('dataflowFileRotateHourly').value = jsonConf.dataflowFileRotateHourly;
			
	document.getElementById('aggregateTcpClientPorts').checked = ( jsonConf.aggregateTcpClientPorts.toLowerCase() == "true" );
	document.getElementById('aggregateUdpClientPorts').checked = ( jsonConf.aggregateUdpClientPorts.toLowerCase() == "true" );
			  
	//document.getElementById('suspiciousHost').value = jsonConf.nbSuspiciousHosts;
	//document.getElementById('loadSuspiciousHostsFiles').value = jsonConf.nbSuspiciousHosts;
	document.getElementById('alertMaxDest').value = jsonConf.alertMaxDest;
	document.getElementById('whiteListLHostMaxDest').value = jsonConf.whiteListLHostsMaxDest;
	document.getElementById('alertMaxInFlowByDest').value = jsonConf.alertMaxInFlowByDest;
	document.getElementById('alertMaxOutFlowByDest').value = jsonConf.alertMaxOutFlowByDest;
	document.getElementById('whiteListLHostInc').value = jsonConf.whiteListLHostInc;
	document.getElementById('whiteListLHostOut').value = jsonConf.whiteListLHostOut;
	document.getElementById('alertMaxMultOutScanDest').value = jsonConf.alertMaxMultOutScanDest;
	document.getElementById('whiteListLHost').value = jsonConf.whiteListLHost;
	document.getElementById('whiteListEHost').value = jsonConf.whiteListEHost;
	document.getElementById('alertMaxExtSMTPtraffic').value = jsonConf.alertMaxExtSMTPtraffic;
	document.getElementById('checkDNSquery').checked = ( jsonConf.checkDNSquery.toLowerCase() == "true" );
	document.getElementById('externalDNSLists').value = jsonConf.extDNSlist;
	document.getElementById('checkMacAddress').checked = ( jsonConf.checkMacAddress.toLowerCase() == "true" );
	document.getElementById('whiteListDupIp').value = jsonConf.whiteListDupIp;
	document.getElementById('ipMaxLeaseTime').value = jsonConf.ipMaxLeaseTime;
			 
	document.getElementById('mailHostname').value = jsonConf.mailHostname;
	document.getElementById('sendMailOnAlert').checked = jsonConf.sendMailOnAlert;
	document.getElementById('mailServer').value = jsonConf.mailServer;
	document.getElementById('mailSrc').value = jsonConf.mailSrc;
	document.getElementById('mailDst').value = jsonConf.mailDst;
			
	//if (jsonConf.GeoIPASNum == 'enabled')
	//document.getElementById('GeoIPASNum').checked =true;
	
	document.getElementById('autoupdate').checked = ( jsonConf.autoupdate.toLowerCase() == "true" );
	
	document.getElementById('verboseMode').checked = ( jsonConf.verboseMode.toLowerCase() == "true" );
	document.getElementById('useSyslogd').checked = ( jsonConf.useSyslogd.toLowerCase() == "true" );
	updateLocalNetworkListCombo ();
	checkboxTest();
}

dojo.addOnLoad( function() 
{ 
	loadListPcapDevice();
	loadConfig();
} );
  

function addRow3Col(tableID, ip, name) 
{
	var table = document.getElementById(tableID);         
    var row = table.insertRow(1);
 

    var cell3 = row.insertCell(0);
    var element2 = document.createElement("input");
	var element3 = document.createElement("input");
    element2.type = "text";
	element3.type = "text";
	element2.value=ip;
	element3.value=name;
	element2.readOnly=true;
	element3.readOnly=true;
    cell3.appendChild(element2);
	cell3.appendChild(element3);
/*	var element4 = document.createElement("input");
    element4.type = "hidden";
	element4.name = hiddenName+(table.rows.length-1);
	element4.value="\""+name+"\"" +","+ip;
	cell3.appendChild(element4);*/
	var cell1 = row.insertCell(1);
    var element1 = document.createElement("input");
    element1.type = "checkbox";
    cell1.appendChild(element1);
}


function addRow2Col(tableID, name, hiddenName) 
{
    var table = document.getElementById(tableID);         
    var row = table.insertRow(1);
 

    var cell3 = row.insertCell(0);
    var element2 = document.createElement("input");

    element2.type = "text";

	element2.value=name;
	element2.id="data";
	element2.readOnly=true
	element2.size=70;
    cell3.appendChild(element2);

/*	var element4 = document.createElement("input");
    element4.type = "hidden";
	element4.name = hiddenName +(table.rows.length-1);
	element4.value="\""+name+"\"";
	cell3.appendChild(element4);*/
	var cell1 = row.insertCell(1);
    var element1 = document.createElement("input");
    element1.type = "checkbox";
    cell1.appendChild(element1);
}
	
		


function addRowItf(tableID, itf, isDetected) 
{
	for(var yo=document.getElementById('listPcap').length-1;yo>0;yo--)
	{
		if (itf == document.getElementById('listPcap').options[yo].value)
					document.getElementById('listPcap').options[yo] = null;
	}

	var table = document.getElementById(tableID);

	var row = table.insertRow(1);
	var cell3 = row.insertCell(0);

	var element2 = document.createElement("input");
	element2.type = "text";
	element2.value=itf;
	element2.id="data";
	element2.readOnly=true;
	element2.size=70;
							
	if (!isDetected)
	{
		var element3 = document.createElement("img");
		element3.src="/images/warnIcon.gif";
		element3.title="This device id not detected on your system";
		element3.style.verticalAlign="middle" 
		cell3.appendChild(element3);
	}
							
	cell3.appendChild(element2);

/*	var element4 = document.createElement("input");
	element4.type = "hidden";
	element4.name = "pcapDevice"+(table.rows.length-1);
	element4.value="\""+itf+"\"";
	cell3.appendChild(element4);*/
	var cell1 = row.insertCell(1);
	var element1 = document.createElement("input");
	element1.type = "checkbox";
	cell1.appendChild(element1);
	PcapDeviceButtonsSetter();
}
				
 
function deleteRowItf(tableID) 
{
    try 
	{
		var table = document.getElementById(tableID);
		var rowCount = table.rows.length;
		var back2add = null;
			
        for(var i=1; i<rowCount; i++) 
		{
			var row = table.rows[i];
            var chkbox = row.cells[1].childNodes[0];
            if(null != chkbox && true == chkbox.checked) 
			{
				back2add = row.cells[0].childNodes[0].value;
				table.deleteRow(i);
                rowCount--;
                i--;
            }
			if (back2add != null)
			{
				updateSelectDeleteItfRaw(tableID, back2add);
				back2add = null;
			}  
		}
    }
	catch(e) 
	{
        alert(e);
	}
}



function deleteRow(tableID) 
{
    try 
	{
		var table = document.getElementById(tableID);
		var rowCount = table.rows.length;
			
        for(var i=1; i<rowCount; i++) 
		{
			var row = table.rows[i];
            var chkbox = row.cells[1].childNodes[0];
            if(null != chkbox && true == chkbox.checked) 
			{
				table.deleteRow(i);
                rowCount--;
                i--;
            }
		}
    }
	catch(e) 
	{
        alert(e);
	}
}

		
function updateSelectDeleteItfRaw(tableID, back2add) 
{
	try 
	{

		var select = document.getElementById("listPcap");
		select.options[select.options.length] = new Option(back2add);
		PcapDeviceButtonsSetter();
	}
            
    catch(e) 
	{
		alert(e);
	}
}
		
function deleteRowITF(pcapDeviceTable) 
{
	try 
	{
		var table = document.getElementById('pcapDeviceTable');
		var rowCount = table.rows.length;
	    for(var i=1; i<rowCount; i++) 
		{
			var row = document.getElementById('pcapDeviceTable').rows[i];
			var chkbox = row.cells[1].childNodes[0];
			if(null != chkbox && true == chkbox.checked) 
			{
				table.deleteRow(i);
				rowCount--;
				i--;
			}
		}
	}
	catch(e) 
	{
		alert(e);
	}
}
			
			
			
function PcapDeviceButtonsSetter ()
{
	document.getElementById('DelInterface').disabled=(document.getElementById('pcapDeviceTable').rows.length==1);
	document.getElementById('AddInterface').disabled=(document.getElementById('listPcap').length==1);
}
			
			
			
function LocalNetworksButtonsSetter ()
{
	document.getElementById('DelNetwork').disabled=(document.getElementById('localhostTable').rows.length==1);
}
		
		
		
		
		
function 	ClearRow(tableID)
{
	var table = document.getElementById(tableID);
	var rowCount = table.rows.length;
	var i=1;
		
	while(i!=rowCount)
	{
		table.deleteRow(-1);
		rowCount --;
	}
		

}
		
		
function validation(form) 
{
	if ( document.getElementById(netFlowDevice).value == '' )
	{
		alert('Veuillez rentrer votre nom')
		return false;
	}		
			
}

function buildListRow3Col(tableId, inputId)
{
        // ListLocalhosts	
	var table = document.getElementById(tableId);
	var rowCount = table.rows.length;
	if (rowCount<1) { document.getElementById(inputId).value=""; return; }
	var localHostList="";
	
        for(var i=1; i<rowCount; i++) 
	{
	  row = table.rows[i];
          ip = row.cells[0].childNodes[0].value;
  	  name = row.cells[0].childNodes[1].value;
	
	  localHostList+="["+ip+","+name+"],";
	}
	if (rowCount)
  	  localHostList = localHostList.slice(0,-1);

	document.getElementById(inputId).value=localHostList;
}

function buildListRow2Col(tableId, inputId)
{
        // ListLocalhosts	
	var table = document.getElementById(tableId);
	var rowCount = table.rows.length;
	if (rowCount<1) { document.getElementById(inputId).value=""; return; }
	var localHostList="";

        for(var i=1; i<rowCount; i++) 
	{
	  row = table.rows[i];
	  
	  var allChilds = row.cells[0].childNodes;
	  var ip="";
	  for(var j = 0; j < allChilds.length && ip == ""; j++)
	    if (allChilds[j].id != "")
	     ip = allChilds[j].value;
	  	
	  localHostList+=ip+",";
	}
	if (rowCount)
	  localHostList = localHostList.slice(0,-1);

	document.getElementById(inputId).value=localHostList;
}
		
	
function sendConf()
{
	if(document.getElementById('disableIpV4').checked && document.getElementById('disableIpV6').checked)
	{
	alert("You can't disable both IPv4 and IPv6");
	return;
	}
	
	if(!document.getElementById('usePcap').checked && !document.getElementById('useNetFlow').checked)
	{
	alert("You need enable at least one acquisition method (usePcap or useNetFlow)");
	return;
	}
	
	if (document.getElementById('localhostTable').rows.length<=1)
	{
	alert("You need to define at least one local host network");
	return;
	}
	
	
	if (document.getElementById('pcapDeviceTable').rows.length<=1 && document.getElementById('usePcap').checked)
	{
	alert("You need to select at least one Pcap device");
	return;
	}

	buildListRow3Col('localhostTable', 'localHostList');
	buildListRow3Col('groupLocalListTable','groupLocalList');
	buildListRow2Col('ignoredLocalhostsTable','localhostsToIgnoreList');
	
	buildListRow2Col('pcapDeviceTable','pcapDeviceList');
	buildListRow2Col('httpdAuthorizedPamUsersTable','httpdAuthorizedPamUsersList');
	buildListRow2Col('httpdAuthorizedPeerDNsTable','httpdAuthorizedPeerDNsList');
	
	buildListRow3Col('suspiciousListTable','suspiciousList');

	//
	
	/*var outForm = document.createElement("text");
	outForm.setAttribute("type", "hidden");*/
	document.getElementById("theForm").submit();
		
}
		
		
		

function checkboxTest()
{
	if(document.getElementById('useNetFlow').checked)
	{
		document.getElementById('netFlowDevice').disabled=''; 
		document.getElementById('netFlowUdpPort').disabled=''; 
		document.getElementById('netFlowIpDataSources').disabled=''; 
		document.getElementById('sendNflowToHost').disabled=''; 
		document.getElementById('sendNflowToPort').disabled=''; 
	
	}
	else
	{
		document.getElementById('netFlowDevice').disabled="disabled" ; 
		document.getElementById('netFlowUdpPort').disabled="disabled" ; 
		document.getElementById('netFlowIpDataSources').disabled="disabled" ; 
		document.getElementById('sendNflowToHost').disabled='disabled'; 
		document.getElementById('sendNflowToPort').disabled='disabled';
	}
		
	if(document.getElementById('usePcap').checked)
	{
		document.getElementById('listPcap').disabled='';
		document.getElementById('pcapFilter').disabled='';
		document.getElementById('pcapBufferSize').disabled='';
		dijit.byId("AddInterface").setAttribute('disabled',0);
		dijit.byId("DelInterface").setAttribute('disabled',0);
	}
	else
	{
		document.getElementById('listPcap').disabled='disabled';
		document.getElementById('pcapFilter').disabled='disabled';
		document.getElementById('pcapBufferSize').disabled='disabled';
		dijit.byId("AddInterface").setAttribute('disabled',1);
		dijit.byId("DelInterface").setAttribute('disabled',1);
	}
			
	if(document.getElementById('DBMS').value=="None")
	{
			document.getElementById('databaseUser').disabled='disabled';
			document.getElementById('databasePassword').disabled='disabled';
			document.getElementById('databaseIPaddr').disabled='disabled';
			document.getElementById('databaseName').disabled='disabled';
			document.getElementById('databaseNbConn').disabled='disabled';
			document.getElementById('databaseDataflowAutovacuum').disabled='disabled';
			document.getElementById('databasePort').disabled='disabled';
			document.getElementById('databaseDataflowAutovacuumSize').disabled='disabled';
			document.getElementById('disableRecordDataflowToDatabase').disabled='disabled';
			document.getElementById('databaseOthersOpts').disabled='disabled';
			document.getElementById('databaseQueryTimeout').disabled='disabled';		
			dijit.byId("Test2PGS").setAttribute('disabled',1);
	}
	else 
	{
			document.getElementById('databaseUser').disabled='';
			document.getElementById('databasePassword').disabled='';
			document.getElementById('databaseIPaddr').disabled='';
			document.getElementById('databaseName').disabled='';
			document.getElementById('databaseNbConn').disabled='';
			document.getElementById('databaseDataflowAutovacuum').disabled='';
			document.getElementById('databaseDataflowAutovacuumSize').disabled='';
			document.getElementById('databasePort').disabled='';
			document.getElementById('databaseDataflowAutovacuumSize').disabled='';
			document.getElementById('disableRecordDataflowToDatabase').disabled='';
			document.getElementById('databaseOthersOpts').disabled='';
			document.getElementById('databaseQueryTimeout').disabled='';
			dijit.byId("Test2PGS").setAttribute('disabled',0);
	}
	
	if(document.getElementById('sendMailOnAlert').checked)
	{
		
		document.getElementById('mailServer').disabled='';
		document.getElementById('mailSrc').disabled='';
		document.getElementById('mailDst').disabled='';
	}	
	else
	{
		document.getElementById('mailServer').disabled='disabled';
		document.getElementById('mailSrc').disabled='disabled';
		document.getElementById('mailDst').disabled='disabled';
	}
	
				
	if(document.getElementById('disableHttpdServer').checked)
	{
			document.getElementById('httpdDevice').disabled='disabled';
			document.getElementById('httpdIpAllowed').disabled='disabled';
			document.getElementById('httpdPort').disabled='disabled';
			document.getElementById('httpdAuthPAM').disabled='disabled';
			document.getElementById('httpdAuthorizedPamUsers').disabled='disabled';
			document.getElementById('httpdAuthLoginPwd').disabled='disabled';
			document.getElementById('httpdUseSSL').disabled='disabled';
			document.getElementById('httpdSSLcertFile').disabled='disabled';
			document.getElementById('httpdSSLcertPwd').disabled='disabled';
			document.getElementById('httpdSSLCaFile').disabled='disabled';
			document.getElementById('httpdAuthPeerSSL').disabled='disabled';
			document.getElementById('httpdAuthorizedPeerDNs').disabled='disabled';
			document.getElementById('httpdNbThreads').disabled='disabled';
			dijit.byId("AddHttpdAuthLoginPwd").setAttribute('disabled',1);
			dijit.byId("DelHttpdAuthLoginPwd").setAttribute('disabled',1);
			document.getElementById('PAMservice').disabled='disabled';
			document.getElementById('httpdAuthorizedPamUsers').disabled='disabled';
			document.getElementById('AddIgnoredLocalhosts').disabled='disabled';
			document.getElementById('DelIgnoredLocalhosts').disabled='disabled';
			document.getElementById('DelHttpdAuthorizedPeerDN').disabled='disabled';
			document.getElementById('DelHttpdAuthorizedPamUser').disabled='disabled';
			
			document.getElementById('httpdSSLcertFile').disabled='disabled';
			document.getElementById('httpdSSLcertPwd').disabled='disabled';
			document.getElementById('httpdSSLCaFile').disabled='disabled';
			document.getElementById('httpdAuthPeerSSL').disabled='disabled';
			document.getElementById('httpdAuthorizedPeerDNs').disabled='disabled';
			document.getElementById('httpdNbThreads').disabled='disabled';	
			dijit.byId("AddHttpdAuthorizedPeerDN").setAttribute('disabled',1);
			dijit.byId("DelHttpdAuthorizedPeerDN").setAttribute('disabled',1);

 			dijit.byId("AddHttpdAuthorizedPamUser").setAttribute('disabled',1);
			dijit.byId("DelHttpdAuthorizedPamUser").setAttribute('disabled',1);

			
	}		
	else
	{
			document.getElementById('httpdDevice').disabled='';
			document.getElementById('httpdIpAllowed').disabled='';
			document.getElementById('httpdPort').disabled='';

			document.getElementById('httpdAuthLoginPwd').disabled='';
			document.getElementById('httpdUseSSL').disabled='';
			document.getElementById('httpdSSLcertFile').disabled='';
			document.getElementById('httpdSSLcertPwd').disabled='';
			document.getElementById('httpdSSLCaFile').disabled='';
			document.getElementById('httpdAuthPeerSSL').disabled='';
			document.getElementById('httpdAuthorizedPeerDNs').disabled='';
			document.getElementById('httpdNbThreads').disabled='';
			dijit.byId("AddHttpdAuthLoginPwd").setAttribute('disabled',0);
			dijit.byId("DelHttpdAuthLoginPwd").setAttribute('disabled',0);
			document.getElementById('AddIgnoredLocalhosts').disabled='';
			document.getElementById('DelIgnoredLocalhosts').disabled='';
			document.getElementById('DelHttpdAuthorizedPeerDN').disabled='';
			document.getElementById('DelHttpdAuthorizedPamUser').disabled='';

			document.getElementById('httpdAuthPAM').disabled='';

			if(document.getElementById('httpdAuthPAM').checked)
			{
				document.getElementById('PAMservice').disabled='';
				document.getElementById('httpdAuthorizedPamUsers').disabled='';
		
			 	dijit.byId("AddHttpdAuthorizedPamUser").setAttribute('disabled',0);
				dijit.byId("DelHttpdAuthorizedPamUser").setAttribute('disabled',0);

			}
			else
			{
				document.getElementById('PAMservice').disabled='disabled';
				document.getElementById('httpdAuthorizedPamUsers').disabled='disabled';

	 			dijit.byId("AddHttpdAuthorizedPamUser").setAttribute('disabled',1);
				dijit.byId("DelHttpdAuthorizedPamUser").setAttribute('disabled',1);
			}
			
			dijit.byId("AddHttpdAuthorizedPeerDN").setAttribute('disabled',1);
		  	dijit.byId("DelHttpdAuthorizedPeerDN").setAttribute('disabled',1);
			
			if(document.getElementById('httpdUseSSL').checked)
			{
		
			document.getElementById('httpdSSLcertFile').disabled='';
			document.getElementById('httpdSSLcertPwd').disabled='';
			document.getElementById('httpdSSLCaFile').disabled='';
			document.getElementById('httpdAuthPeerSSL').disabled='';

			if(document.getElementById('httpdAuthPeerSSL').checked)
			{
			  dijit.byId("AddHttpdAuthorizedPeerDN").setAttribute('disabled',0);
			  dijit.byId("DelHttpdAuthorizedPeerDN").setAttribute('disabled',0);
			}

			}
			else
			{
			document.getElementById('httpdSSLcertFile').disabled='disabled';
			document.getElementById('httpdSSLcertPwd').disabled='disabled';
			document.getElementById('httpdSSLCaFile').disabled='disabled';
			document.getElementById('httpdAuthPeerSSL').disabled='disabled';
			document.getElementById('httpdAuthorizedPeerDNs').disabled='disabled';
			document.getElementById('httpdNbThreads').disabled='disabled';	
			dijit.byId("AddHttpdAuthorizedPeerDN").setAttribute('disabled',1);
			dijit.byId("DelHttpdAuthorizedPeerDN").setAttribute('disabled',1);
			}
	}
	
	/*if(document.getElementById('httpdUseSSL').checked)
	{
		
		document.getElementById('httpdSSLcertFile').disabled='';
		document.getElementById('httpdSSLcertPwd').disabled='';
		document.getElementById('httpdSSLCaFile').disabled='';
		document.getElementById('httpdAuthPeerSSL').disabled='';

		if(document.getElementById('httpdAuthPAM').checked)
		{
		  dijit.byId("AddHttpdAuthorizedPeerDN").setAttribute('disabled',1);
		  dijit.byId("DelHttpdAuthorizedPeerDN").setAttribute('disabled',1);
		}
	}	
	else
	{
		document.getElementById('httpdSSLcertFile').disabled='disabled';
		document.getElementById('httpdSSLcertPwd').disabled='disabled';
		document.getElementById('httpdSSLCaFile').disabled='disabled';
		document.getElementById('httpdAuthPeerSSL').disabled='disabled';

		document.getElementById('httpdAuthorizedPeerDNs').disabled='disabled';
		document.getElementById('httpdNbThreads').disabled='disabled';	
		dijit.byId("AddHttpdAuthorizedPeerDN").setAttribute('disabled',1);
		dijit.byId("DelHttpdAuthorizedPeerDN").setAttribute('disabled',1);
	}
	
	if(document.getElementById('httpdAuthPAM').checked || !document.getElementById('disableHttpdServer').checked)
	{
		document.getElementById('PAMservice').disabled='';
		document.getElementById('httpdAuthorizedPamUsers').disabled='';
		
	 	dijit.byId("AddHttpdAuthorizedPamUser").setAttribute('disabled',0);
		dijit.byId("DelHttpdAuthorizedPamUser").setAttribute('disabled',0);
		//document.getElementById('AddHttpdAuthorizedPamUser').disabled='';
		//document.getElementById('DelHttpdAuthorizedPamUser').disabled='';
	}
	else
	{
		document.getElementById('PAMservice').disabled='disabled';
		document.getElementById('httpdAuthorizedPamUsers').disabled='disabled';
		document.getElementById('httpdAuthorizedPamUsers').disabled='disabled';

	 	dijit.byId("AddHttpdAuthorizedPamUser").setAttribute('disabled',1);
		dijit.byId("DelHttpdAuthorizedPamUser").setAttribute('disabled',1);
		//document.getElementById('AddHttpdAuthorizedPamUser').disabled='disabled';
		//document.getElementById('DelHttpdAuthorizedPamUser').disabled='disabled';
	}
	*/
		
	if(document.getElementById('httpdAuthPeerSSL').checked || document.getElementById('httpdUseSSL').checked)
	{
		document.getElementById('httpdAuthorizedPeerDNs').disabled='';
		document.getElementById('httpdNbThreads').disabled='';

		if(document.getElementById('httpdAuthPeerSSL').checked)
		{
	 	  dijit.byId("AddHttpdAuthorizedPeerDN").setAttribute('disabled',0);
		  dijit.byId("DelHttpdAuthorizedPeerDN").setAttribute('disabled',0);
		}
	}		
	else
	{
		document.getElementById('httpdAuthorizedPeerDNs').disabled='disabled';
		document.getElementById('httpdNbThreads').disabled='disabled';	

		dijit.byId("AddHttpdAuthorizedPeerDN").setAttribute('disabled',1);
		dijit.byId("DelHttpdAuthorizedPeerDN").setAttribute('disabled',1);
	}
	
}		
		
		

			   

		

		
		
