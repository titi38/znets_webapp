var pcapDeviceDetected;


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
	loadJson("getListPcapDevice.json", setInterfaceFromJson);
}

function loadConfig()
{
	loadJson("getConfig.json", setConfigFromJson);
}

var validIP=false;
			
function isValidIp(ip)
{
	validIP=false;
	loadJson("isValid.json?ip="+ip, isValidIpResult);
    return validIP;
}
			
function isValidIpResult( jsonItf )
{
  validIP=jsonItf.isValid == "true";
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
	for(yo=0;yo<document.form.listPcap.length;yo++)
	{
		if(document.form.listPcap.options[yo].selected == true)
			compteselect++;

		if(compteselect>0)
		{
			for(yo=0;yo<document.form.listPcap.length;yo++)
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
			
	
			
	
function setConfigFromJson( jsonConf )
{
	for(var i=0; i<jsonConf.localNetworks.length; i++)
		//addRowLocalHost( "localhostTable", jsonConf.localNetworks[i].v,jsonConf.localNetworks[i].n);
		addRow3Col("localhostTable", jsonConf.localNetworks[i].v,jsonConf.localNetworks[i].n, "localhost");

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
		addRow3Col( "TabListSuspicious",dir, jsonConf.suspiciousHostList[i].list[j].name + " (" + jsonConf.suspiciousHostList[i].list[j].nb + ")", "suspiciousHostList");
	}
	for(var i=0; i<jsonConf.ignoredLocalhosts.length; i++)
		addRow2Col( "httpdAuthorizedPeerDN",jsonConf.ignoredLocalhosts[i], "ignoredLocalhosts");
		
	for(var i=0; i<jsonConf.httpdAuthorizedPamUsers.length; i++)
		addRow2Col( "httpdAuthorizedPamUsers",jsonConf.httpdAuthorizedPamUsers[i], "httpdAuthorizedPamUsers");
		
	for(var i=0; i<jsonConf.ignoredLocalhosts.length; i++)
		addRow2Col( "ignoredLocalhosts",jsonConf.ignoredLocalhosts[i], "ignoredLocalhosts");
			   
	document.getElementById('AcquisitionPcap').checked = ( jsonConf.usePcap.toLowerCase() == "true" );
	document.getElementById('AcquisitionNetFlow').checked = ( jsonConf.useNetFlow.toLowerCase() == "true" );
			  
	document.getElementById('disableIpV4').checked = ( jsonConf.disableIpV4.toLowerCase() == "true" );
	document.getElementById('disableIpV6').checked = ( jsonConf.disableIpV6.toLowerCase() == "true" );
	document.getElementById('whoisCmd').value = jsonConf.whoIsCmd;
	document.getElementById('processCycleOnExit').value = jsonConf.processCycleOnExit;


	document.getElementById('pcapBufferSize').value = jsonConf.pcapBufSize;
	document.getElementById('pcapFilter').value = jsonConf.pcapFilter;
	document.getElementById('netFlowDevice').value = jsonConf.netFlowDevice;
	document.getElementById('netFlowUdpPort').value = jsonConf.netFlowUdpPort;
	document.getElementById('netFlowIpDataSources').value = jsonConf.netFlowIpDataSources;
	document.getElementById('sendNflowToHost').value = jsonConf.sendNflowToHost;
	document.getElementById('sendNflowToPort').value = jsonConf.sendNflowToPort;
			  
	document.getElementById('DBMS').value =  jsonConf.DBMS;
    document.getElementById('disableRecordDataflowToDatabase').checked = ( jsonConf.disabledRecordDataflowToDatabase.toLowerCase() == "true" );

	document.getElementById('databaseUser').value = jsonConf.databaseUser;
	document.getElementById('databasePassword').value = jsonConf.databasePassword;
	document.getElementById('databaseIPaddr').value = jsonConf.databaseIPaddr;
	document.getElementById('databasePort').value = jsonConf.databasePort;
	document.getElementById('databaseName').value = jsonConf.databaseName;
	document.getElementById('databaseNbConn').value = jsonConf.databaseNbConn;
			  
	document.getElementById('databaseDataflowAutovacuum').checked = ( jsonConf.databaseDataflowAutovacuum.toLowerCase() == "true" );
			  
	document.getElementById('databaseDataflowAutovacuumSize').value = jsonConf.databaseDataflowAutovacuumSize;
			  
	document.getElementById('disableHttpdServer').checked = ( jsonConf.httpdServer.toLowerCase() == "true" );
			  
	document.getElementById('httpdDevice').value = jsonConf.httpdDevice;
	document.getElementById('httpdIpAllowed').value = jsonConf.httpdIpAllowed;
	document.getElementById('httpdPort').value = jsonConf.httpdPort;
			  
	document.getElementById('httpdAuthPAM').checked = ( jsonConf.httpdAuthLoginPwd.toLowerCase() == "true" );
	document.getElementById('PAMservice').checked = ( jsonConf.pamService.toLowerCase() == "true" );
	document.getElementById('httpdAuthorizedPamUsers').value = jsonConf.httpdAuthorizedPamUsers;
	document.getElementById('httpdAuthLoginPwd').value = jsonConf.httpdAuthLoginPwd;
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
			  
	document.getElementById('suspiciousHost').value = jsonConf.nbSuspiciousHosts;
	document.getElementById('loadSuspiciousHostsFiles').value = jsonConf.nbSuspiciousHosts;
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
	document.getElementById('checkDNSquery').checked = jsonConf.checkDNSquery;
	document.getElementById('externalDNSLists').value = jsonConf.extDNSlist;
	document.getElementById('pcapIgnoreMac').checked = ( jsonConf.pcapIgnoreMac.toLowerCase() == "true" );
	document.getElementById('whiteListDupIp').value = jsonConf.whiteListDupIp;
	document.getElementById('ipMaxLeaseTime').value = jsonConf.ipMaxLeaseTime;
			 
			 
	document.getElementById('sendMailOnAlert').checked = jsonConf.sendMailOnAlert;
	document.getElementById('mailServer').value = jsonConf.mailServer;
	document.getElementById('mailSrc').value = jsonConf.mailSrc;
	document.getElementById('mailDst').value = jsonConf.mailDst;
			
	if (jsonConf.GeoIPASNum == 'enabled')
	document.getElementById('GeoIPASNum').checked =true;
	
	document.getElementById('autoupdate').checked = ( jsonConf.autoupdate.toLowerCase() == "true" );
	
	document.getElementById('verboseMode').checked = ( jsonConf.verboseMode.toLowerCase() == "true" );
	document.getElementById('useSyslogd').checked = ( jsonConf.useSyslogd.toLowerCase() == "true" );
	checkboxTest();
}

dojo.addOnLoad( function() 
{ 
	loadListPcapDevice();
	loadConfig();
} );
  

function addRowLocalHost(tableID, ip, name) 
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
	element2.readOnly=true
	element3.readOnly=true
    cell3.appendChild(element2);
	cell3.appendChild(element3);
	var element4 = document.createElement("input");
    element4.type = "hidden";
	element4.name = "localhost"+(table.rows.length-1);
	element4.value="\""+name+"\"" +","+ip;
	cell3.appendChild(element4);
	var cell1 = row.insertCell(1);
    var element1 = document.createElement("input");
    element1.type = "checkbox";
    cell1.appendChild(element1);
}




function addRow3Col(tableID, ip, name, hiddenName) 
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
	var element4 = document.createElement("input");
    element4.type = "hidden";
	element4.name = hiddenName+(table.rows.length-1);
	element4.value="\""+name+"\"" +","+ip;
	cell3.appendChild(element4);
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

	element2.disabled=true

    cell3.appendChild(element2);

	var element4 = document.createElement("input");
    element4.type = "hidden";
	element4.name = hiddenName +(table.rows.length-1);
	element4.value="\""+name+"\"";
	cell3.appendChild(element4);
	var cell1 = row.insertCell(1);
    var element1 = document.createElement("input");
    element1.type = "checkbox";
    cell1.appendChild(element1);
}
	
		


function addRowItf(tableID, itf, isDetected) 
{

	for(yo=0;yo<document.getElementById('listPcap').length;yo++)
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
	element2.readOnly=true;
	element2.size=70;
							
	if (!isDetected)
	{
		var element3 = document.createElement("img");
		element3.src="images/errorIcon.gif";
		element3.title="This device id not detected on your system";
		cell3.appendChild(element3);
	}
							
	cell3.appendChild(element2);

	var element4 = document.createElement("input");
	element4.type = "hidden";
	element4.name = "pcapDevice"+(table.rows.length-1);
	element4.value="\""+itf+"\"";
	cell3.appendChild(element4);
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
		
function sendConf()
{
	var outForm = document.createElement("text");
	outForm.setAttribute("type", "hidden");
	document.getElementById("theForm").submit();
		
}
		
		
		

function checkboxTest()
{
	if(document.getElementById('AcquisitionNetFlow').checked)
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
		
	if(document.getElementById('AcquisitionPcap').checked)
	{
		document.getElementById('listPcap').disabled='';
		
	}
	else
	{
		document.getElementById('listPcap').disabled='disabled';
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
			document.getElementById('httpdAuthorizedPeerDN').disabled='disabled';
			document.getElementById('httpdNbThreads').disabled='disabled';
			document.getElementById('PAMservice').disabled='disabled';
			document.getElementById('loginhttpdAuthorizedPamUsers').disabled='disabled';
	}
	else
	{
			document.getElementById('httpdDevice').disabled='';
			document.getElementById('httpdIpAllowed').disabled='';
			document.getElementById('httpdPort').disabled='';
			document.getElementById('httpdAuthPAM').disabled='';
			document.getElementById('httpdAuthorizedPamUsers').disabled='';
			document.getElementById('httpdAuthLoginPwd').disabled='';
			document.getElementById('httpdUseSSL').disabled='';
			document.getElementById('httpdSSLcertFile').disabled='';
			document.getElementById('httpdSSLcertPwd').disabled='';
			document.getElementById('httpdSSLCaFile').disabled='';
			document.getElementById('httpdAuthPeerSSL').disabled='';
			document.getElementById('httpdAuthorizedPeerDN').disabled='';
			document.getElementById('httpdNbThreads').disabled='';
			document.getElementById('PAMservice').disabled='';
			document.getElementById('loginhttpdAuthorizedPamUsers').disabled='';
	}
			
	if(document.getElementById('disableRecordDataflowToDatabase').checked)
	{
			document.getElementById('databaseUser').disabled='disabled';
			document.getElementById('databasePassword').disabled='disabled';
			document.getElementById('databaseIPaddr').disabled='disabled';
			document.getElementById('databaseName').disabled='disabled';
			document.getElementById('databaseNbConn').disabled='disabled';
			document.getElementById('databaseDataflowAutovacuum').disabled='disabled';
			document.getElementById('databasePort').disabled='disabled';
			document.getElementById('databaseDataflowAutovacuumSize').disabled='disabled';
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
	
	
	if(document.getElementById('httpdUseSSL').checked)
	{
		
		document.getElementById('httpdSSLcertFile').disabled='';
		document.getElementById('httpdSSLcertPwd').disabled='';
		document.getElementById('httpdSSLCaFile').disabled='';
	}	
	else
	{
		document.getElementById('httpdSSLcertFile').disabled='disabled';
		document.getElementById('httpdSSLcertPwd').disabled='disabled';
		document.getElementById('httpdSSLCaFile').disabled='disabled';
	}
	
	if(document.getElementById('httpdAuthPAM').checked)
	{
		document.getElementById('PAMservice').disabled='';
		document.getElementById('httpdAuthorizedPamUsers').disabled='';
		document.getElementById('httpdAuthLoginPwd').disabled='';
		document.getElementById('AddUser').disabled='';
		document.getElementById('loginhttpdAuthorizedPamUsers').disabled='';
	}
	else
	{
		document.getElementById('PAMservice').disabled='disabled';
		document.getElementById('httpdAuthorizedPamUsers').disabled='disabled';
		document.getElementById('httpdAuthLoginPwd').disabled='disabled';
		document.getElementById('AddUser').disabled='disabled';
		document.getElementById('loginhttpdAuthorizedPamUsers').disabled='disabled';
	}
	
		
	if(document.getElementById('httpdAuthPeerSSL').checked)
	{
		document.getElementById('httpdAuthorizedPeerDN').disabled='';
		document.getElementById('httpdNbThreads').disabled='';
		document.getElementById('AddHttpdAuthorizedPeerDN').disabled='';
		document.getElementById('httpdAuthorizedPeer').disabled='';

		
	}		
	else
	{
		document.getElementById('httpdAuthorizedPeerDN').disabled='disabled';
		document.getElementById('httpdNbThreads').disabled='disabled';	
		document.getElementById('AddHttpdAuthorizedPeerDN').disabled='disabled';
		document.getElementById('httpdAuthorizedPeer').disabled='disabled';
	}
	
}		
		
		

			   

		

		
		
