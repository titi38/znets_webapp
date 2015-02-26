

var cptRequest=0;


function lockScreen()
	{	
		if(cptRequest==0)
		{
			document.getElementById('disablingDiv').style.display='block';
			//alert('lock:'+cptRequest);	
		}
		cptRequest++;
		
	}
	

function unlockScreen()
{

	cptRequest--;
	if(cptRequest==0)
	{
		document.getElementById('disablingDiv').style.display='none';
		//alert('unlock:'+cptRequest);
	}
	
}
	
	
function selectGrapheOption(numGraphe, Onglet){
	
	initZoom(numGraphe, Onglet);	
	
	effacerNone( numGraphe, Onglet );
		
	if( document.getElementById("DivGraphe"+numGraphe+Onglet).style.display == 'block' ){
			
		//setParameters($('formulaire'+Onglet).serialize());
		
		if(document.getElementById(Onglet).isClosable){	// onglet machine		
			
			if(numGraphe == 1){	
				dojo.empty("chart1"+Onglet);
				loading("chart1"+Onglet);
				setTimeout('dojo.addOnLoad(makeChart11); ', 50);
			}
			else if(numGraphe == 2){	
				dojo.empty("chart2"+Onglet);
				loading("chart2"+Onglet);
				setTimeout('dojo.addOnLoad(makeChart12); ', 50);
			}
			else if(numGraphe == 3){	
				dojo.empty("chart3"+Onglet);
				loading("chart3"+Onglet);
				setTimeout('dojo.addOnLoad(makeChart13); ', 50);
			}
			else if(numGraphe == 4){
				dojo.empty("chart4"+Onglet);
				loading("chart4"+Onglet);
				setTimeout('dojo.addOnLoad(makeChart14); ', 50);			
			}
			else if(numGraphe == 5){
				alert("error: found a 5");				
			}
			else if(numGraphe == 6){	
				ChargerData(Onglet, "false");
			}
			else {	alert("ERR1 : in function 'clickActu'");	}
		
			
		}else { // onglet global ou reseau
			
			if(numGraphe == 1){	
				dojo.empty("chart1"+Onglet);
				loading("chart1"+Onglet);
				setTimeout('dojo.addOnLoad(makeChart1); ', 50);
			}
			else if(numGraphe == 2){	
				dojo.empty("chart2"+Onglet);
				loading("chart2"+Onglet);
				setTimeout('dojo.addOnLoad(makeChart2); ', 50);
			}
			else if(numGraphe == 3){	
				dojo.empty("chart3"+Onglet);
				loading("chart3"+Onglet);
				setTimeout('dojo.addOnLoad(makeChart3); ', 50);
			}
			else if(numGraphe == 4){
				dojo.empty("chart4"+Onglet);
				loading("chart4"+Onglet);
				setTimeout('dojo.addOnLoad(makeChart4); ', 50);
			}
			else if(numGraphe == 5){	
				dojo.empty("chart5"+Onglet);
				loading("chart5"+Onglet);
				setTimeout('dojo.addOnLoad(makeChart5); ', 50);
			}
			else if(numGraphe == 6){	
				dojo.empty("chart6"+Onglet);	
				loading("chart6"+Onglet);
				setTimeout('dojo.addOnLoad(makeChart6); ', 50);
			}
			else if(numGraphe == 7){	
				dojo.empty("chart7"+Onglet);	
				loading("chart7"+Onglet);
				setTimeout('dojo.addOnLoad(makeChart7); ', 50);
			}
			else {	alert("ERR1 : in function 'clickActu'");	}
			
			
		}
	}

}



function effacerNone( suffixe1, suffixe2 ){

	var Div = document.getElementById("DivGraphe"+suffixe1+suffixe2);
	for (var i = 0; i < Div.childNodes.length; i++){
		try{
			if(Div.childNodes[i].getAttribute("isNone") == "true") {
				Div.removeChild( Div.childNodes[i] );
			}
		}catch(e){
			//alert(e+" in function.js line: "+e.lineNo);
		}
	}
	
}

function estNone( divId, rang ){
	
	var Div = document.getElementById(divId);
	
	for (var i = 0; i < Div.childNodes.length; i++){
		if(Div.childNodes[i].getAttribute("rang") == rang) {
			return true;
		}
	}
	return false;
}

function creerTooltip( json ){
	for ( var i = 0 ; i<json.data.length ; i++ ){
		if( json.data[i].hostname != "" ) json.data[i].tooltip = json.data[i].hostname+"<br>("+json.data[i].ip+")" ;
		else json.data[i].tooltip = json.data[i].ip;
		if(json.data[i].c){
			if(json.data[i].c=="--") json.data[i].tooltip += "<img src='/images/flags/unknown.png' style='vertical-align: middle; margin-left: 5px;'>";
			else json.data[i].tooltip += "<img src='/images/flags/"+json.data[i].c.toLowerCase()+".png' style='vertical-align: middle; margin-left: 5px;'>";
		}
		if(json.data[i].asn){
			json.data[i].tooltip += "<br>"+resolveASNum(json.data[i].asn);
		}
	}
}

function nameOfCountry( id ){
	for(Country in TabCOUNTRY){
		if( TabCOUNTRY[Country] == id) return Country;
	}
}

function setCursors( id, tag ){
	//alert(id+"   _   "+tag);
	
	var rect = document.getElementById(id).getElementsByTagName(tag);
	
	for(var i = 0; i< rect.length; i++) {
		try{
			var ess = rect[i].getAttribute("fill").replace(/ /, "");
			ess = ess.replace(/rgb\(/, "");
			ess = ess.replace(/\)/, "");
			
			var rgb = ess.split(",");
			
			for(var j=0; j< rgb.length; j++) rgb[j] = myParseInt(rgb[j]);
			
			if(rgb[0] != rgb[1] || rgb[0] != rgb[2]){
				rect[i].setAttribute("style", "cursor: pointer;");
			}
		}catch(e){
			//alert("errrrrrrrrrr in here");
		}
	}
	
}

function makeWhoIs( ip, server ){
	
		var xhr = createXhrObject();

		if(server)
			xhr.open("GET", askWhere +  "whois.json?ip="+ip+"&server="+server, true);
		else
			xhr.open("GET", askWhere +  "whois.json?ip="+ip, true);
		lockScreen();xhr.onreadystatechange=function() 
		{
			if (xhr.readyState == 4) 
			{
				dialogWhoIs.setAttribute('title', 'Whois: '+ip);	
				
				if (xhr.status == 200) 
				{
					var JsonWhoIs = eval("(" + xhr.responseText + ")");
					if(JsonWhoIs.errMsg)alert("whois.json Bug Report: "+ JsonWhoIs.errMsg);	
					
					var area = document.getElementById('whoIsTextArea');
					if ( area.hasChildNodes() ){
						while ( area.childNodes.length >= 1 ){
							area.removeChild( area.firstChild ); 
						} 
					}
						
					try{
						var text = document.createTextNode(JsonWhoIs.msg);
						area.appendChild(text);
					}catch(e){
						var text = document.createTextNode(JsonWhoIs.errMsg);
						area.appendChild(text);
					}
					
				}else {
					document.getElementById('whoIsTextArea').innerHTML = "whois.json?ip="+ip+" not found";
				}
				
				dialogWhoIs.show();
			}
			unlockScreen();	
		}
		xhr.send(null);
	
}




function debutDeCycle(date){
	
	if(date=="")return "";
	
	var minOfDate= extractDate(date,"mn");
	var minOfCycleStart= 0;
	
	while(parseInt(minOfCycleStart) <= minOfDate)
		minOfCycleStart += 60/NbCPH;
	
	minOfCycleStart -= 60/NbCPH;

	var mn = "";
	if(parseInt(minOfCycleStart) < 10) mn = "0";
	var returnDate= extractDate(date,"y")+"-"+extractDate(date,"m")+"-"+extractDate(date,"d")+" "+extractDate(date,"h")+":"+mn+parseInt(minOfCycleStart);
	
	if(decalerDate( returnDate, 0, 0, 0, 0, parseInt(60/NbCPH)) > DateCoherente("maintenant")){
		return decalerDate( returnDate, 0, 0, 0, 0, -parseInt(60/NbCPH));
	}else{
		return returnDate;
	}
}

function finDeCycle(date){
	
	if(date=="")return "";
	
	if( date == debutDeCycle(date)){
		return date;
	}else if(parseInt(60/NbCPH)!=60/NbCPH){
		
		if( debutDeCycle(decalerDate( date, 0, 0, 0, 0, parseInt(60/NbCPH))) == debutDeCycle(decalerDate( debutDeCycle(date), 0, 0, 0, 0, parseInt(60/NbCPH)))){
			return decalerDate( debutDeCycle(date), 0, 0, 0, 0, parseInt(60/NbCPH))
		}else{
			return decalerDate( debutDeCycle(date), 0, 0, 0, 0, parseInt(60/NbCPH)+1);
		}
		
	}else{
		
		if( date == decalerDate( debutDeCycle(date), 0, 0, 0, 0, parseInt(60/NbCPH))){
			return date;
		}else{
			return decalerDate( debutDeCycle(date), 0, 0, 0, 0, parseInt(60/NbCPH));
		}
		
	}
	
	/*var minOfDate= extractDate(date,"mn");
	var minOfCycleEnd= 0;
	
	while(minOfCycleEnd < minOfDate && !( parseInt(minOfCycleEnd) != minOfCycleEnd && (parseInt(minOfCycleEnd)+1) == minOfDate ) ){
		minOfCycleEnd += 60/NbCPH;
		alert(minOfCycleEnd+" : "+minOfDate);
	}
	
	if(parseInt(minOfCycleEnd) != minOfCycleEnd) minOfCycleEnd = parseInt(minOfCycleEnd)+1;
	
	if(minOfCycleEnd>=60){
		date = decalerDate(date, 0, 0, 0, 1,0);
		return extractDate(date,"y")+"-"+extractDate(date,"m")+"-"+extractDate(date,"d")+" "+extractDate(date,"h")+":00";
		
	}else{
		var mn = "";
		if(minOfCycleEnd < 10) mn = "0";
		return extractDate(date,"y")+"-"+extractDate(date,"m")+"-"+extractDate(date,"d")+" "+extractDate(date,"h")+":"+mn+minOfCycleEnd;
	}*/
}



function solveIpExt(element){
	
	try{
		if(element.title==""){
			
			var xhr = createXhrObject();
			
				xhr.open("GET", askWhere +  "resolv.json?ip="+element.getAttribute('host'), true);
			lockScreen();xhr.onreadystatechange=function() 
			{
				if (xhr.readyState == 4) 
				{
					if (xhr.status == 200) 
					{
						try{
							//alert('hi');
							var JsonIp = eval("(" + xhr.responseText + ")");
							if(JsonIp.items[0].n==""){
								element.setAttribute('title', "None");
								element.title = "None";
							}else{
								element.setAttribute('title', JsonIp.items[0].n)
								element.title = JsonIp.items[0].n;
							}
						}catch(e){
							element.setAttribute('title', "None");
							element.title = "None";
						}
						
					}else{
						//alert('hio');
						element.setAttribute('title', "None");
						element.title = "None";
					}
				}
				unlockScreen();	
			}
			xhr.send(null);
		}	
	}catch(e){
		//alert(e);
		element.setAttribute('title', "Can't resolve");
		element.title = "Can't resolve";
	}

}


function returnSolvedIpExt(value){
	
	try{
			var xhr = createXhrObject();
			
				xhr.open("GET", askWhere +  "resolv.json?ip="+value, false);
				xhr.send(null);
				if (xhr.readyState == 4) 
				{
					if (xhr.status == 200) 
					{
						try{
							//alert('hi');
							var JsonIp = eval("(" + xhr.responseText + ")");
							if(JsonIp.items[0].n==""){
								return "None";
							}else{
								return JsonIp.items[0].n;
							}
						}catch(e){
							return "None";
						}
						
					}else{
						//alert('hio');
						return "None";
					}
				}
	
	}catch(e){
		//alert(e);
		return "None";
	}

}


function solveIpLoc(element){
	//alert(element.innerHTML);
	try{
		//alert(element.getAttribute("localhost"));
		var i = 0;
		while(TabIP[i] != element.getAttribute("localhost") && i<TabIP.length) i++;
				
		if(i < TabIP.length){
			if(TabNAME[i] == ""){
				element.setAttribute('title', "None");
				element.title = "None";
			}else{
				element.setAttribute('title', TabNAME[i]);
				element.title = TabNAME[i];
			}
		}else{
			element.setAttribute('title', "None");
			element.title = "None";
		}
		
		
		
	}catch(e){
		element.setAttribute('title', "Can't resolve");
		element.title = "Can't resolve";
	}

}

function resolveProto(element){
	//alert(element.innerHTML);
	try{
		if(element.title==""){
			
			var xhr = createXhrObject();
			
				xhr.open("GET", askWhere +  "getProtoDesc.json?proto="+element.innerHTML, true);
			lockScreen();xhr.onreadystatechange=function() 
			{
				if (xhr.readyState == 4) 
				{
					if (xhr.status == 200) 
					{
						try{
							//alert('hi');
							var JsonProto = eval("(" + xhr.responseText + ")");
							if(JsonProto.items[0].keyword!="" && JsonProto.items[0].proto!=""){
								element.setAttribute('title', JsonProto.items[0].proto+"("+JsonProto.items[0].keyword+")")
								element.title = JsonProto.items[0].proto+"("+JsonProto.items[0].keyword+")";
							}else if(JsonProto.items[0].keyword=="" && JsonProto.items[0].proto==""){
								element.setAttribute('title', "None")
								element.title = "None";
							}else if(JsonProto.items[0].keyword==""){
								element.setAttribute('title', JsonProto.items[0].proto)
								element.title = JsonProto.items[0].proto;
							}else if(JsonProto.items[0].proto==""){
								element.setAttribute('title', JsonProto.items[0].keyword)
								element.title = JsonProto.items[0].keyword;
							}else{
								element.setAttribute('title', "None")
								element.title = "None";
							}
						}catch(e){
							element.setAttribute('title', "None")
							element.title = "None";
						}
						
					}else{
						//alert('hio');
						element.setAttribute('title', "Can't resolve")
						element.title = "Can't resolve";
					}
				}
				unlockScreen();	
			}
			xhr.send(null);
		}	
	}catch(e){
		//alert(e);
		element.setAttribute('title', "Can't resolve")
		element.title = "Can't resolve";
	}

}


function resolveService(element){
	
	try{
		if(element.title==""){
			
			var xhr = createXhrObject();
			
				xhr.open("GET", askWhere +  "getPortServiceName.json?proto="+element.getAttribute('proto')+"&port="+element.innerHTML, true);
			lockScreen();xhr.onreadystatechange=function() 
			{
				if (xhr.readyState == 4) 
				{
					if (xhr.status == 200) 
					{
						try{
							//alert('hi');
							var JsonServ = eval("(" + xhr.responseText + ")");
							if(JsonServ.items[0].n==""){
								element.setAttribute('title', "None");
								element.title = "None";
							}else{
								element.setAttribute('title', JsonServ.items[0].n)
								element.title = JsonServ.items[0].n;
							}
						}catch(e){
							element.setAttribute('title', "None");
							element.title = "None";
						}
						
					}else{
						//alert('hio');
						element.setAttribute('title', "Can't resolve");
						element.title = "Can't resolve";
					}
				}
				unlockScreen();	
			}
			xhr.send(null);
		}	
	}catch(e){
		//alert(e);
		element.setAttribute('title', "Can't resolve");
		element.title = "Can't resolve";
	}

}



function resolveCodeICMP(type, code)
{
  codeDesc="ICMP_code: "+code;

  switch (type)
  {
    case "3":
      switch (code)
      {
	case "0":
	  codeDesc="Destination network unreachable"; break;
	case "1":
	  codeDesc="Destination host unreachable"; break;
	case "2":
	  codeDesc="Destination protocol unreachable"; break;
	case "3":
	  codeDesc="Destination port unreachable"; break;
	case "4":
	  codeDesc="Fragmentation required, and DF flag set"; break;
	case "5":
	  codeDesc="Source route failed"; break;
	case "6":
	  codeDesc="Destination network unknown"; break;
	case "7":
	  codeDesc="Destination host unknown"; break;
	case "8":
	  codeDesc="Source host isolated"; break;
	case "9":
	  codeDesc="Network administratively prohibited"; break;
	case "10":
	  codeDesc="Host administratively prohibited"; break;
	case "11":
	  codeDesc="Network unreachable for TOS"; break;
	case "12":
	  codeDesc="Host unreachable for TOS"; break;
	case "13":
	  codeDesc="Communication administratively prohibited"; break;
      }
    case "5":
      switch (code)
      {
	case "0":
	  codeDesc="Redirect Datagram for the Network"; break;
	case "1":
	  codeDesc="Redirect Datagram for the Host"; break;
	case "2":
	  codeDesc="Redirect Datagram for the TOS & network"; break;
	case "3":
	  codeDesc="Redirect Datagram for the TOS & host"; break;
     }
    case "11":
      switch (code)
      {
	case "0":
	  codeDesc="TTL expired in transit"; break;
	case "1":
	  codeDesc="Fragment reassembly time exceeded"; break;
      }
    case "12":
      switch (code)
      {
	case "0":
	  codeDesc="Pointer indicates the error"; break;
	case "1":
	  codeDesc="Missing a required option"; break;
	case "2":
	  codeDesc="Bad length"; break;
      }
   }

   return codeDesc;
}



function resolveTCPFlag(element){
	
	tab = [ "C","E","U","A","P","R","S","F"];
	tabE = [ "CWR Reduced","ECE ECN Echo","URG Urgent","ACK","PSH Push","RST Reset","SYN","FIN"];
	retour = "";
	for(var i =0; i< tab.length; i++){
		if(element.innerHTML.indexOf(tab[i]) != -1){
			//alert('hi');
			//element.setAttribute('title', element.getAttribute('title')+tab[i]+": "+tabE[i]+"\n");
			retour+= tab[i]+"("+tabE[i]+") - ";
		}
	}
	
	return retour.substring(0,retour.length-3);
			
	

}


function setTCPFlags(element){
	
	tab = [ "C","E","U","A","P","R","S","F"];
	
	document.getElementById("proto").value= "tcp";
	document.getElementById("proto").onchange();

	for(var i =0; i< tab.length; i++){
		if(element.innerHTML.indexOf(tab[i]) != -1){
			document.getElementById("tcpflag"+tab[i]).checked = "checked";
		}else{
			document.getElementById("tcpflag"+tab[i]).checked = "";
		}
	}
	
			
	

}


function makeConf(){
	
		var xhr = createXhrObject();

		xhr.open("GET", askWhere + "getConfig.json", true);
		lockScreen();xhr.onreadystatechange=function() 
		{
			if (xhr.readyState == 4) 
			{	
				
				if (xhr.status == 200) 
				{
					var JsonConf = eval("(" + xhr.responseText + ")");
					if(JsonConf.errMsg)alert("getConfig.json Bug Report: "+JsonConf.errMsg);	
					
					var table = document.getElementById('dialogConfTable');
					if ( table.hasChildNodes() ){
						while ( table.childNodes.length >= 1 ){
							table.removeChild( table.firstChild ); 
						} 
					}
					
					
					button = document.createElement("button");
					button.innerHTML = "Edit";
					button.setAttribute('onClick', "javascript:document.location.href='config.html'")
					table.appendChild(button);
					
					var TBody = document.createElement("tbody");
					table.appendChild(TBody);
					
					
					var Ntr;
					var Ntd;
					var text;
						
					try{
						
						
						Ntr = document.createElement("tr");
						TBody.appendChild(Ntr);
						Ntd = document.createElement("th");
						Ntd.setAttribute('class', 'spaceUB');
						Ntd.setAttribute('colspan', 2);
						text = document.createTextNode("");
						Ntd.appendChild(text);
						Ntr.appendChild(Ntd);
						
						
						Ntr.appendChild(Ntd);
						Ntr = document.createElement("tr");
						TBody.appendChild(Ntr);
						Ntd = document.createElement("th");
						Ntd.setAttribute('colspan', 2);
						text = document.createTextNode("List of local network(s)");
						Ntd.appendChild(text);
						Ntr.appendChild(Ntd);
						
						for(var i=0; i<=JsonConf.localNetworks.length-1; i++){
							try{
								Ntr = document.createElement("tr");
								TBody.appendChild(Ntr);
								Ntd = document.createElement("td");
								if( i == JsonConf.localNetworks.length-1 )
									Ntd.setAttribute("class","leftbottom");
								else
									Ntd.setAttribute("class","left");
									text = document.createTextNode(JsonConf.localNetworks[i].n);
								Ntd.appendChild(text);
								Ntr.appendChild(Ntd);
								Ntd = document.createElement("td");
								if(JsonConf.localNetworks[i].n != "")
									document.getElementById(JsonConf.localNetworks[i].n).setAttribute('ipReseau', JsonConf.localNetworks[i].v);
								if( i == JsonConf.localNetworks.length-1 )
									Ntd.setAttribute("class","bottom");
								text = document.createTextNode(JsonConf.localNetworks[i].v);
								Ntd.appendChild(text);
								Ntr.appendChild(Ntd);
							}catch(e){
							}
						}
						
						
						Ntr = document.createElement("tr");
						TBody.appendChild(Ntr);
						Ntd = document.createElement("th");
						Ntd.setAttribute('class', 'space');
						Ntd.setAttribute('colspan', 2);
						text = document.createTextNode("");
						Ntd.appendChild(text);
						Ntr.appendChild(Ntd);
						
						
						Ntr.appendChild(Ntd);
						Ntr = document.createElement("tr");
						TBody.appendChild(Ntr);
						Ntd = document.createElement("th");
						Ntd.setAttribute('colspan', 2);
						text = document.createTextNode("Acquisition's method");
						Ntd.appendChild(text);
						Ntr.appendChild(Ntd);
						
						
						Ntr = document.createElement("tr");
						TBody.appendChild(Ntr);
						Ntd = document.createElement("td");
						Ntd.setAttribute("class","left");
						text = document.createTextNode("usePcap  ");
						Ntd.appendChild(text);
						Ntr.appendChild(Ntd);
						Ntd = document.createElement("td");
						text = document.createTextNode(JsonConf.usePcap);
						Ntd.appendChild(text);
						Ntr.appendChild(Ntd);
						
						
						Ntr = document.createElement("tr");
						TBody.appendChild(Ntr);
						Ntd = document.createElement("td");
						Ntd.setAttribute("class","leftbottom");
						text = document.createTextNode("useNetFlow  ");
						Ntd.appendChild(text);
						Ntr.appendChild(Ntd);
						Ntd = document.createElement("td");
						Ntd.setAttribute("class","bottom");
						text = document.createTextNode(JsonConf.useNetFlow);
						Ntd.appendChild(text);
						Ntr.appendChild(Ntd);
						
						
						Ntr = document.createElement("tr");
						TBody.appendChild(Ntr);
						Ntd = document.createElement("th");
						Ntd.setAttribute('class', 'space');
						Ntd.setAttribute('colspan', 2);
						text = document.createTextNode("");
						Ntd.appendChild(text);
						Ntr.appendChild(Ntd);
						
						
						Ntr.appendChild(Ntd);
						Ntr = document.createElement("tr");
						TBody.appendChild(Ntr);
						Ntd = document.createElement("th");
						Ntd.setAttribute('colspan', 2);
						text = document.createTextNode("Pcap options");
						Ntd.appendChild(text);
						Ntr.appendChild(Ntd);
						
						
						Ntr = document.createElement("tr");
						TBody.appendChild(Ntr);
						Ntd = document.createElement("td");
						Ntd.setAttribute("class","left");
						text = document.createTextNode("pcapDevice  ");
						Ntd.appendChild(text);
						Ntr.appendChild(Ntd);
						Ntd = document.createElement("td");
						text = document.createTextNode(JsonConf.pcapDevice);
						Ntd.appendChild(text);
						Ntr.appendChild(Ntd);
						
						
						Ntr = document.createElement("tr");
						TBody.appendChild(Ntr);
						Ntd = document.createElement("td");
						Ntd.setAttribute("class","left");
						text = document.createTextNode("pcapBufferSize  ");
						Ntd.appendChild(text);
						Ntr.appendChild(Ntd);
						Ntd = document.createElement("td");
						text = document.createTextNode(JsonConf.pcapBufSize);
						Ntd.appendChild(text);
						Ntr.appendChild(Ntd);
						
						
						Ntr = document.createElement("tr");
						TBody.appendChild(Ntr);
						Ntd = document.createElement("td");
						Ntd.setAttribute("class","leftbottom");
						text = document.createTextNode("pcapFilter  ");
						Ntd.appendChild(text);
						Ntr.appendChild(Ntd);
						Ntd = document.createElement("td");
						Ntd.setAttribute("class","bottom");
						text = document.createTextNode(JsonConf.pcapFilter);
						Ntd.appendChild(text);
						Ntr.appendChild(Ntd);
						
						
						Ntr = document.createElement("tr");
						TBody.appendChild(Ntr);
						Ntd = document.createElement("th");
						Ntd.setAttribute('class', 'space');
						Ntd.setAttribute('colspan', 2);
						text = document.createTextNode("");
						Ntd.appendChild(text);
						Ntr.appendChild(Ntd);
						
						
						Ntr.appendChild(Ntd);
						Ntr = document.createElement("tr");
						TBody.appendChild(Ntr);
						Ntd = document.createElement("th");
						Ntd.setAttribute('colspan', 2);
						text = document.createTextNode("NetFlow options");
						Ntd.appendChild(text);
						Ntr.appendChild(Ntd);
						
						
						Ntr = document.createElement("tr");
						TBody.appendChild(Ntr);
						Ntd = document.createElement("td");
						Ntd.setAttribute("class","left");
						text = document.createTextNode("netFlowDevice  ");
						Ntd.appendChild(text);
						Ntr.appendChild(Ntd);
						Ntd = document.createElement("td");
						text = document.createTextNode(JsonConf.netFlowDevice);
						Ntd.appendChild(text);
						Ntr.appendChild(Ntd);
						
						
						Ntr = document.createElement("tr");
						TBody.appendChild(Ntr);
						Ntd = document.createElement("td");
						Ntd.setAttribute("class","left");
						text = document.createTextNode("netFlowUdpPort  ");
						Ntd.appendChild(text);
						Ntr.appendChild(Ntd);
						Ntd = document.createElement("td");
						text = document.createTextNode(JsonConf.netFlowUdpPort);
						Ntd.appendChild(text);
						Ntr.appendChild(Ntd);
						
						
						Ntr = document.createElement("tr");
						TBody.appendChild(Ntr);
						Ntd = document.createElement("td");
						Ntd.setAttribute("class","left");
						text = document.createTextNode("netFlowIpDataSources  ");
						Ntd.appendChild(text);
						Ntr.appendChild(Ntd);
						Ntd = document.createElement("td");
						text = document.createTextNode(JsonConf.netFlowIpDataSources);
						Ntd.appendChild(text);
						Ntr.appendChild(Ntd);
						
						
						Ntr = document.createElement("tr");
						TBody.appendChild(Ntr);
						Ntd = document.createElement("td");
						Ntd.setAttribute("class","left");
						text = document.createTextNode("sendNflowToHost  ");
						Ntd.appendChild(text);
						Ntr.appendChild(Ntd);
						Ntd = document.createElement("td");
						text = document.createTextNode(JsonConf.sendNflowToHost);
						Ntd.appendChild(text);
						Ntr.appendChild(Ntd);
						
						
						Ntr = document.createElement("tr");
						TBody.appendChild(Ntr);
						Ntd = document.createElement("td");
						Ntd.setAttribute("class","leftbottom");
						text = document.createTextNode("sendNflowToPort  ");
						Ntd.appendChild(text);
						Ntr.appendChild(Ntd);
						Ntd = document.createElement("td");
						Ntd.setAttribute("class","bottom");
						text = document.createTextNode(JsonConf.sendNflowToPort);
						Ntd.appendChild(text);
						Ntr.appendChild(Ntd);
						
						
						Ntr = document.createElement("tr");
						TBody.appendChild(Ntr);
						Ntd = document.createElement("th");
						Ntd.setAttribute('class', 'space');
						Ntd.setAttribute('colspan', 2);
						text = document.createTextNode("");
						Ntd.appendChild(text);
						Ntr.appendChild(Ntd);
						
						
						Ntr.appendChild(Ntd);
						Ntr = document.createElement("tr");
						TBody.appendChild(Ntr);
						Ntd = document.createElement("th");
						Ntd.setAttribute('colspan', 2);
						text = document.createTextNode("Database options");
						Ntd.appendChild(text);
						Ntr.appendChild(Ntd);
						
						
						Ntr = document.createElement("tr");
						TBody.appendChild(Ntr);
						Ntd = document.createElement("td");
						Ntd.setAttribute("class","left");
						text = document.createTextNode("DBMS  ");
						Ntd.appendChild(text);
						Ntr.appendChild(Ntd);
						Ntd = document.createElement("td");
						text = document.createTextNode(JsonConf.DBMS);
						Ntd.appendChild(text);
						Ntr.appendChild(Ntd);
						
						
						Ntr = document.createElement("tr");
						TBody.appendChild(Ntr);
						Ntd = document.createElement("td");
						Ntd.setAttribute("class","left");
						text = document.createTextNode("disabledRecordDataflowToDatabase  ");
						Ntd.appendChild(text);
						Ntr.appendChild(Ntd);
						Ntd = document.createElement("td");
						text = document.createTextNode(JsonConf.disabledRecordDataflowToDatabase);
						Ntd.appendChild(text);
						Ntr.appendChild(Ntd);
						
						
						Ntr = document.createElement("tr");
						TBody.appendChild(Ntr);
						Ntd = document.createElement("td");
						Ntd.setAttribute("class","left");
						text = document.createTextNode("databaseUser  ");
						Ntd.appendChild(text);
						Ntr.appendChild(Ntd);
						Ntd = document.createElement("td");
						text = document.createTextNode(JsonConf.databaseUser);
						Ntd.appendChild(text);
						Ntr.appendChild(Ntd);
						
						
						Ntr = document.createElement("tr");
						TBody.appendChild(Ntr);
						Ntd = document.createElement("td");
						Ntd.setAttribute("class","left");
						text = document.createTextNode("databasePassword  ");
						Ntd.appendChild(text);
						Ntr.appendChild(Ntd);
						Ntd = document.createElement("td");
						text = document.createTextNode(JsonConf.databasePassword);
						Ntd.appendChild(text);
						Ntr.appendChild(Ntd);
						
						
						Ntr = document.createElement("tr");
						TBody.appendChild(Ntr);
						Ntd = document.createElement("td");
						Ntd.setAttribute("class","left");
						text = document.createTextNode("databaseIPaddr  ");
						Ntd.appendChild(text);
						Ntr.appendChild(Ntd);
						Ntd = document.createElement("td");
						text = document.createTextNode(JsonConf.databaseIPaddr);
						Ntd.appendChild(text);
						Ntr.appendChild(Ntd);
					
						
						
						Ntr = document.createElement("tr");
						TBody.appendChild(Ntr);
						Ntd = document.createElement("td");
						Ntd.setAttribute("class","left");
						text = document.createTextNode("databasePort  ");
						Ntd.appendChild(text);
						Ntr.appendChild(Ntd);
						Ntd = document.createElement("td");
						text = document.createTextNode(JsonConf.databasePort);
						Ntd.appendChild(text);
						Ntr.appendChild(Ntd);
						
						
						Ntr = document.createElement("tr");
						TBody.appendChild(Ntr);
						Ntd = document.createElement("td");
						Ntd.setAttribute("class","left");
						text = document.createTextNode("databaseName  ");
						Ntd.appendChild(text);
						Ntr.appendChild(Ntd);
						Ntd = document.createElement("td");
						text = document.createTextNode(JsonConf.databaseName);
						Ntd.appendChild(text);
						Ntr.appendChild(Ntd);
						
						
						Ntr = document.createElement("tr");
						TBody.appendChild(Ntr);
						Ntd = document.createElement("td");
						Ntd.setAttribute("class","left");
						text = document.createTextNode("databaseNbConn  ");
						Ntd.appendChild(text);
						Ntr.appendChild(Ntd);
						Ntd = document.createElement("td");
						text = document.createTextNode(JsonConf.databaseNbConn);
						Ntd.appendChild(text);
						Ntr.appendChild(Ntd);
						
						
						Ntr = document.createElement("tr");
						TBody.appendChild(Ntr);
						Ntd = document.createElement("td");
						Ntd.setAttribute("class","left");
						text = document.createTextNode("databaseQueryTimeout  ");
						Ntd.appendChild(text);
						Ntr.appendChild(Ntd);
						Ntd = document.createElement("td");
						text = document.createTextNode(JsonConf.databaseQueryTimeout);
						Ntd.appendChild(text);
						Ntr.appendChild(Ntd);
						
						
						Ntr = document.createElement("tr");
						TBody.appendChild(Ntr);
						Ntd = document.createElement("td");
						Ntd.setAttribute("class","left");
						text = document.createTextNode("databaseDataflowAutovacuum  ");
						Ntd.appendChild(text);
						Ntr.appendChild(Ntd);
						Ntd = document.createElement("td");
						text = document.createTextNode(JsonConf.databaseDataflowAutovacuum);
						Ntd.appendChild(text);
						Ntr.appendChild(Ntd);
						
						
						Ntr = document.createElement("tr");
						TBody.appendChild(Ntr);
						Ntd = document.createElement("td");
						Ntd.setAttribute("class","leftbottom");
						text = document.createTextNode("databaseDataflowAutovacuumSize  ");
						Ntd.appendChild(text);
						Ntr.appendChild(Ntd);
						Ntd = document.createElement("td");
						Ntd.setAttribute("class","bottom");
						text = document.createTextNode(JsonConf.databaseDataflowAutovacuumSize);
						Ntd.appendChild(text);
						Ntr.appendChild(Ntd);
						
						
						Ntr = document.createElement("tr");
						TBody.appendChild(Ntr);
						Ntd = document.createElement("th");
						Ntd.setAttribute('class', 'space');
						Ntd.setAttribute('colspan', 2);
						text = document.createTextNode("");
						Ntd.appendChild(text);
						Ntr.appendChild(Ntd);
						
						
						Ntr.appendChild(Ntd);
						Ntr = document.createElement("tr");
						TBody.appendChild(Ntr);
						Ntd = document.createElement("th");
						Ntd.setAttribute('colspan', 2);
						text = document.createTextNode("Webserver options");
						Ntd.appendChild(text);
						Ntr.appendChild(Ntd);
						
						
						
						Ntr = document.createElement("tr");
						TBody.appendChild(Ntr);
						Ntd = document.createElement("td");
						Ntd.setAttribute("class","left");
						text = document.createTextNode("disabledHttpdServer  ");
						Ntd.appendChild(text);
						Ntr.appendChild(Ntd);
						Ntd = document.createElement("td");
						text = document.createTextNode(JsonConf.httpdServer);
						Ntd.appendChild(text);
						Ntr.appendChild(Ntd);
						
						
						Ntr = document.createElement("tr");
						TBody.appendChild(Ntr);
						Ntd = document.createElement("td");
						Ntd.setAttribute("class","left");
						text = document.createTextNode("httpdDevice  ");
						Ntd.appendChild(text);
						Ntr.appendChild(Ntd);
						Ntd = document.createElement("td");
						text = document.createTextNode(JsonConf.httpdDevice);
						Ntd.appendChild(text);
						Ntr.appendChild(Ntd);
						
						
						
						Ntr = document.createElement("tr");
						TBody.appendChild(Ntr);
						Ntd = document.createElement("td");
						Ntd.setAttribute("class","left");
						text = document.createTextNode("httpdIpAllowed  ");
						Ntd.appendChild(text);
						Ntr.appendChild(Ntd);
						Ntd = document.createElement("td");
						text = document.createTextNode(JsonConf.httpdIpAllowed);
						Ntd.appendChild(text);
						Ntr.appendChild(Ntd);
						
						
						Ntr = document.createElement("tr");
						TBody.appendChild(Ntr);
						Ntd = document.createElement("td");
						Ntd.setAttribute("class","left");
						text = document.createTextNode("httpdPort  ");
						Ntd.appendChild(text);
						Ntr.appendChild(Ntd);
						Ntd = document.createElement("td");
						text = document.createTextNode(JsonConf.httpdPort);
						Ntd.appendChild(text);
						Ntr.appendChild(Ntd);
						
						
						
						Ntr = document.createElement("tr");
						TBody.appendChild(Ntr);
						Ntd = document.createElement("td");
						Ntd.setAttribute("class","left");
						text = document.createTextNode("httpdAuthLoginPwd  ");
						Ntd.appendChild(text);
						Ntr.appendChild(Ntd);
						Ntd = document.createElement("td");
						text = document.createTextNode(JsonConf.httpdAuthLoginPwd);
						Ntd.appendChild(text);
						Ntr.appendChild(Ntd);
						
						
						Ntr = document.createElement("tr");
						TBody.appendChild(Ntr);
						Ntd = document.createElement("td");
						Ntd.setAttribute("class","left");
						text = document.createTextNode("httpdUseSSL  ");
						Ntd.appendChild(text);
						Ntr.appendChild(Ntd);
						Ntd = document.createElement("td");
						text = document.createTextNode(JsonConf.httpdUseSSL);
						Ntd.appendChild(text);
						Ntr.appendChild(Ntd);
						
						
						Ntr = document.createElement("tr");
						TBody.appendChild(Ntr);
						Ntd = document.createElement("td");
						Ntd.setAttribute("class","left");
						text = document.createTextNode("httpdSSLcertFile  ");
						Ntd.appendChild(text);
						Ntr.appendChild(Ntd);
						Ntd = document.createElement("td");
						text = document.createTextNode(JsonConf.httpdSSLcertFile);
						Ntd.appendChild(text);
						Ntr.appendChild(Ntd);
						
						
						Ntr = document.createElement("tr");
						TBody.appendChild(Ntr);
						Ntd = document.createElement("td");
						Ntd.setAttribute("class","left");
						text = document.createTextNode("httpdSSLcertPwd  ");
						Ntd.appendChild(text);
						Ntr.appendChild(Ntd);
						Ntd = document.createElement("td");
						text = document.createTextNode(JsonConf.httpdSSLcertPwd);
						Ntd.appendChild(text);
						Ntr.appendChild(Ntd);
						
						
						Ntr = document.createElement("tr");
						TBody.appendChild(Ntr);
						Ntd = document.createElement("td");
						Ntd.setAttribute("class","left");
						text = document.createTextNode("httpdSSLCaFile  ");
						Ntd.appendChild(text);
						Ntr.appendChild(Ntd);
						Ntd = document.createElement("td");
						text = document.createTextNode(JsonConf.httpdSSLCaFile);
						Ntd.appendChild(text);
						Ntr.appendChild(Ntd);
						
						
						Ntr = document.createElement("tr");
						TBody.appendChild(Ntr);
						Ntd = document.createElement("td");
						Ntd.setAttribute("class","left");
						text = document.createTextNode("httpdAuthPeerSSL  ");
						Ntd.appendChild(text);
						Ntr.appendChild(Ntd);
						Ntd = document.createElement("td");
						text = document.createTextNode(JsonConf.httpdAuthPeerSSL);
						Ntd.appendChild(text);
						Ntr.appendChild(Ntd);
						
						
						Ntr = document.createElement("tr");
						TBody.appendChild(Ntr);
						Ntd = document.createElement("td");
						Ntd.setAttribute("class","left");
						text = document.createTextNode("httpdAuthorizedPeerDNs  ");
						Ntd.appendChild(text);
						Ntr.appendChild(Ntd);
						Ntd = document.createElement("td");
						text = document.createTextNode(JsonConf.httpdAuthorizedPeerDNs);
						Ntd.appendChild(text);
						Ntr.appendChild(Ntd);
						
						
						Ntr = document.createElement("tr");
						TBody.appendChild(Ntr);
						Ntd = document.createElement("td");
						Ntd.setAttribute("class","leftbottom");
						text = document.createTextNode("httpdNbThreads  ");
						Ntd.appendChild(text);
						Ntr.appendChild(Ntd);
						Ntd = document.createElement("td");
						Ntd.setAttribute("class","bottom");
						text = document.createTextNode(JsonConf.httpdNbThreads);
						Ntd.appendChild(text);
						Ntr.appendChild(Ntd);
						
						
						Ntr = document.createElement("tr");
						TBody.appendChild(Ntr);
						Ntd = document.createElement("th");
						Ntd.setAttribute('class', 'space');
						Ntd.setAttribute('colspan', 2);
						text = document.createTextNode("");
						Ntd.appendChild(text);
						Ntr.appendChild(Ntd);
						
						
						Ntr.appendChild(Ntd);
						Ntr = document.createElement("tr");
						TBody.appendChild(Ntr);
						Ntd = document.createElement("th");
						Ntd.setAttribute('colspan', 2);
						text = document.createTextNode("Data files options");
						Ntd.appendChild(text);
						Ntr.appendChild(Ntd);
						
					
						Ntr = document.createElement("tr");
						TBody.appendChild(Ntr);
						Ntd = document.createElement("td");
						Ntd.setAttribute("class","left");
						text = document.createTextNode("saveDataflowToFile  ");
						Ntd.appendChild(text);
						Ntr.appendChild(Ntd);
						Ntd = document.createElement("td");
						text = document.createTextNode(JsonConf.saveDataflowToFile);
						Ntd.appendChild(text);
						Ntr.appendChild(Ntd);
						
						
						Ntr = document.createElement("tr");
						TBody.appendChild(Ntr);
						Ntd = document.createElement("td");
						Ntd.setAttribute("class","left");
						text = document.createTextNode("dataflowFilePath  ");
						Ntd.appendChild(text);
						Ntr.appendChild(Ntd);
						Ntd = document.createElement("td");
						text = document.createTextNode(JsonConf.dataflowFilePath);
						Ntd.appendChild(text);
						Ntr.appendChild(Ntd);
						
						
						Ntr = document.createElement("tr");
						TBody.appendChild(Ntr);
						Ntd = document.createElement("td");
						Ntd.setAttribute("class","left");
						text = document.createTextNode("dataflowFileRotateDaily  ");
						Ntd.appendChild(text);
						Ntr.appendChild(Ntd);
						Ntd = document.createElement("td");
						text = document.createTextNode(JsonConf.dataflowFileRotateDaily);
						Ntd.appendChild(text);
						Ntr.appendChild(Ntd);
						
						
						Ntr = document.createElement("tr");
						TBody.appendChild(Ntr);
						Ntd = document.createElement("td");
						Ntd.setAttribute("class","left");
						text = document.createTextNode("dataflowFileRotateHourly  ");
						Ntd.appendChild(text);
						Ntr.appendChild(Ntd);
						Ntd = document.createElement("td");
						text = document.createTextNode(JsonConf.dataflowFileRotateHourly);
						Ntd.appendChild(text);
						Ntr.appendChild(Ntd);
						
						
						Ntr = document.createElement("tr");
						TBody.appendChild(Ntr);
						Ntd = document.createElement("td");
						Ntd.setAttribute("class","leftbottom");
						text = document.createTextNode("nbCollectCyclePerHour  ");
						Ntd.appendChild(text);
						Ntr.appendChild(Ntd);
						Ntd = document.createElement("td");
						Ntd.setAttribute("class","bottom");
						text = document.createTextNode(JsonConf.nbCollectCyclePerHour);
						Ntd.appendChild(text);
						Ntr.appendChild(Ntd);
						
						
						Ntr = document.createElement("tr");
						TBody.appendChild(Ntr);
						Ntd = document.createElement("th");
						Ntd.setAttribute('class', 'space');
						Ntd.setAttribute('colspan', 2);
						text = document.createTextNode("");
						Ntd.appendChild(text);
						Ntr.appendChild(Ntd);
						
						
						Ntr.appendChild(Ntd);
						Ntr = document.createElement("tr");
						TBody.appendChild(Ntr);
						Ntd = document.createElement("th");
						Ntd.setAttribute('colspan', 2);
						text = document.createTextNode("Aggregation options");
						Ntd.appendChild(text);
						Ntr.appendChild(Ntd);
						
						
						Ntr = document.createElement("tr");
						TBody.appendChild(Ntr);
						Ntd = document.createElement("td");
						Ntd.setAttribute("class","left");
						text = document.createTextNode("aggregateTcpClientPorts  ");
						Ntd.appendChild(text);
						Ntr.appendChild(Ntd);
						Ntd = document.createElement("td");
						text = document.createTextNode(JsonConf.aggregateTcpClientPorts);
						Ntd.appendChild(text);
						Ntr.appendChild(Ntd);
						
						
						Ntr = document.createElement("tr");
						TBody.appendChild(Ntr);
						Ntd = document.createElement("td");
						Ntd.setAttribute("class","left");
						text = document.createTextNode("aggregateUdpClientPorts  ");
						Ntd.appendChild(text);
						Ntr.appendChild(Ntd);
						Ntd = document.createElement("td");
						text = document.createTextNode(JsonConf.aggregateUdpClientPorts);
						Ntd.appendChild(text);
						Ntr.appendChild(Ntd);
						
						
						Ntr = document.createElement("tr");
						TBody.appendChild(Ntr);
						Ntd = document.createElement("td");
						Ntd.setAttribute("class","leftbottom");
						text = document.createTextNode("localHostToIgnore  ");
						Ntd.appendChild(text);
						Ntr.appendChild(Ntd);
						Ntd = document.createElement("td");
						Ntd.setAttribute("class","bottom");
						text = document.createTextNode(JsonConf.ignoredLocalhosts);
						Ntd.appendChild(text);
						Ntr.appendChild(Ntd);
						
						
						Ntr = document.createElement("tr");
						TBody.appendChild(Ntr);
						Ntd = document.createElement("th");
						Ntd.setAttribute('class', 'space');
						Ntd.setAttribute('colspan', 2);
						text = document.createTextNode("");
						Ntd.appendChild(text);
						Ntr.appendChild(Ntd);
						
						
						Ntr.appendChild(Ntd);
						Ntr = document.createElement("tr");
						TBody.appendChild(Ntr);
						Ntd = document.createElement("th");
						Ntd.setAttribute('colspan', 2);
						text = document.createTextNode("Alerts options");
						Ntd.appendChild(text);
						Ntr.appendChild(Ntd);
						
						
						Ntr = document.createElement("tr");
						TBody.appendChild(Ntr);
						Ntd = document.createElement("td");
						Ntd.setAttribute("class","left");
						text = document.createTextNode("nbSuspiciousHosts  ");
						Ntd.appendChild(text);
						Ntr.appendChild(Ntd);
						Ntd = document.createElement("td");
						text = document.createTextNode(JsonConf.nbSuspiciousHosts);
						Ntd.appendChild(text);
						Ntr.appendChild(Ntd);
						

						Ntr = document.createElement("tr");
						TBody.appendChild(Ntr);
						Ntd = document.createElement("td");
						Ntd.setAttribute("class","left");
						text = document.createTextNode("autoupdate  ");
						Ntd.appendChild(text);
						Ntr.appendChild(Ntd);
						Ntd = document.createElement("td");
						text = document.createTextNode(JsonConf.autoupdate);
						Ntd.appendChild(text);
						Ntr.appendChild(Ntd);
						

						Ntr = document.createElement("tr");
						TBody.appendChild(Ntr);
						Ntd = document.createElement("td");
						Ntd.setAttribute("class","left");
						text = document.createTextNode("alertMaxDest  ");
						Ntd.appendChild(text);
						Ntr.appendChild(Ntd);
						Ntd = document.createElement("td");
						text = document.createTextNode(JsonConf.alertMaxDest);
						Ntd.appendChild(text);
						Ntr.appendChild(Ntd);
						
						
						Ntr = document.createElement("tr");
						TBody.appendChild(Ntr);
						Ntd = document.createElement("td");
						Ntd.setAttribute("class","left");
						text = document.createTextNode("whiteListLHostsMaxDest");
						Ntd.appendChild(text);
						Ntr.appendChild(Ntd);
						Ntd = document.createElement("td");
						text = document.createTextNode(JsonConf.whiteListLHostsMaxDest);
						Ntd.appendChild(text);
						Ntr.appendChild(Ntd);
						
						
						Ntr = document.createElement("tr");
						TBody.appendChild(Ntr);
						Ntd = document.createElement("td");
						Ntd.setAttribute("class","left");
						text = document.createTextNode("alertMaxInFlowByDest  ");
						Ntd.appendChild(text);
						Ntr.appendChild(Ntd);
						Ntd = document.createElement("td");
						text = document.createTextNode(JsonConf.alertMaxInFlowByDest);
						Ntd.appendChild(text);
						Ntr.appendChild(Ntd);
						
						
						Ntr = document.createElement("tr");
						TBody.appendChild(Ntr);
						Ntd = document.createElement("td");
						Ntd.setAttribute("class","left");
						text = document.createTextNode("alertMaxOutFlowByDest  ");
						Ntd.appendChild(text);
						Ntr.appendChild(Ntd);
						Ntd = document.createElement("td");
						text = document.createTextNode(JsonConf.alertMaxOutFlowByDest);
						Ntd.appendChild(text);
						Ntr.appendChild(Ntd);
						
						
						Ntr = document.createElement("tr");
						TBody.appendChild(Ntr);
						Ntd = document.createElement("td");
						Ntd.setAttribute("class","left");
						text = document.createTextNode("whiteListLHostInc  ");
						Ntd.appendChild(text);
						Ntr.appendChild(Ntd);
						Ntd = document.createElement("td");
						text = document.createTextNode(JsonConf.whiteListLHostInc);
						Ntd.appendChild(text);
						Ntr.appendChild(Ntd);
						
						
						Ntr = document.createElement("tr");
						TBody.appendChild(Ntr);
						Ntd = document.createElement("td");
						Ntd.setAttribute("class","left");
						text = document.createTextNode("whiteListLHostOut  ");
						Ntd.appendChild(text);
						Ntr.appendChild(Ntd);
						Ntd = document.createElement("td");
						text = document.createTextNode(JsonConf.whiteListLHostOut);
						Ntd.appendChild(text);
						Ntr.appendChild(Ntd);
						
						
						Ntr = document.createElement("tr");
						TBody.appendChild(Ntr);
						Ntd = document.createElement("td");
						Ntd.setAttribute("class","left");
						text = document.createTextNode("alertMaxMultOutScanDest  ");
						Ntd.appendChild(text);
						Ntr.appendChild(Ntd);
						Ntd = document.createElement("td");
						text = document.createTextNode(JsonConf.alertMaxMultOutScanDest);
						Ntd.appendChild(text);
						Ntr.appendChild(Ntd);
						
						
						Ntr = document.createElement("tr");
						TBody.appendChild(Ntr);
						Ntd = document.createElement("td");
						Ntd.setAttribute("class","left");
						text = document.createTextNode("whiteListLHost  ");
						Ntd.appendChild(text);
						Ntr.appendChild(Ntd);
						Ntd = document.createElement("td");
						text = document.createTextNode(JsonConf.whiteListLHost);
						Ntd.appendChild(text);
						Ntr.appendChild(Ntd);
						
						
						Ntr = document.createElement("tr");
						TBody.appendChild(Ntr);
						Ntd = document.createElement("td");
						Ntd.setAttribute("class","left");
						text = document.createTextNode("whiteListEHost  ");
						Ntd.appendChild(text);
						Ntr.appendChild(Ntd);
						Ntd = document.createElement("td");
						text = document.createTextNode(JsonConf.whiteListEHost);
						Ntd.appendChild(text);
						Ntr.appendChild(Ntd);
						
						
						Ntr = document.createElement("tr");
						TBody.appendChild(Ntr);
						Ntd = document.createElement("td");
						Ntd.setAttribute("class","left");
						text = document.createTextNode("alertMaxExtSMTPtraffic  ");
						Ntd.appendChild(text);
						Ntr.appendChild(Ntd);
						Ntd = document.createElement("td");
						text = document.createTextNode(JsonConf.alertMaxExtSMTPtraffic);
						Ntd.appendChild(text);
						Ntr.appendChild(Ntd);
						
						
						Ntr = document.createElement("tr");
						TBody.appendChild(Ntr);
						Ntd = document.createElement("td");
						Ntd.setAttribute("class","left");
						text = document.createTextNode("checkDNSquery  ");
						Ntd.appendChild(text);
						Ntr.appendChild(Ntd);
						Ntd = document.createElement("td");
						text = document.createTextNode(JsonConf.checkDNSquery);
						Ntd.appendChild(text);
						Ntr.appendChild(Ntd);
						
						
						
						Ntr = document.createElement("tr");
						TBody.appendChild(Ntr);
						Ntd = document.createElement("td");
						Ntd.setAttribute("class","left");
						text = document.createTextNode("externalDNSLists  ");
						Ntd.appendChild(text);
						Ntr.appendChild(Ntd);
						Ntd = document.createElement("td");
						text = document.createTextNode(JsonConf.extDNSlist);
						Ntd.appendChild(text);
						Ntr.appendChild(Ntd);
						
						
						Ntr = document.createElement("tr");
						TBody.appendChild(Ntr);
						Ntd = document.createElement("td");
						Ntd.setAttribute("class","left");
						text = document.createTextNode("pcapIgnoreMac");
						Ntd.appendChild(text);
						Ntr.appendChild(Ntd);
						Ntd = document.createElement("td");
						text = document.createTextNode(JsonConf.pcapIgnoreMac);
						Ntd.appendChild(text);
						Ntr.appendChild(Ntd);
						
						
						Ntr = document.createElement("tr");
						TBody.appendChild(Ntr);
						Ntd = document.createElement("td");
						Ntd.setAttribute("class","left");
						text = document.createTextNode("whiteListDupIp  ");
						Ntd.appendChild(text);
						Ntr.appendChild(Ntd);
						Ntd = document.createElement("td");
						text = document.createTextNode(JsonConf.whiteListDupIp);
						Ntd.appendChild(text);
						Ntr.appendChild(Ntd);
						
						
						Ntr = document.createElement("tr");
						TBody.appendChild(Ntr);
						Ntd = document.createElement("td");
						Ntd.setAttribute("class","leftbottom");
						text = document.createTextNode("ipMaxLeaseTime  ");
						Ntd.appendChild(text);
						Ntr.appendChild(Ntd);
						Ntd = document.createElement("td");
						Ntd.setAttribute("class","bottom");
						text = document.createTextNode(JsonConf.ipMaxLeaseTime);
						Ntd.appendChild(text);
						Ntr.appendChild(Ntd);
						
						
						Ntr = document.createElement("tr");
						TBody.appendChild(Ntr);
						Ntd = document.createElement("th");
						Ntd.setAttribute('class', 'space');
						Ntd.setAttribute('colspan', 2);
						text = document.createTextNode("");
						Ntd.appendChild(text);
						Ntr.appendChild(Ntd);
						
						
						Ntr.appendChild(Ntd);
						Ntr = document.createElement("tr");
						TBody.appendChild(Ntr);
						Ntd = document.createElement("th");
						Ntd.setAttribute('colspan', 2);
						text = document.createTextNode("Mail Alert Configuration");
						Ntd.appendChild(text);
						Ntr.appendChild(Ntd);
						
						
						
						Ntr = document.createElement("tr");
						TBody.appendChild(Ntr);
						Ntd = document.createElement("td");
						Ntd.setAttribute("class","left");
						text = document.createTextNode("sendMailOnAlert  ");
						Ntd.appendChild(text);
						Ntr.appendChild(Ntd);
						Ntd = document.createElement("td");
						text = document.createTextNode(JsonConf.sendMailOnAlert);
						Ntd.appendChild(text);
						Ntr.appendChild(Ntd);
						
						
						Ntr = document.createElement("tr");
						TBody.appendChild(Ntr);
						Ntd = document.createElement("td");
						Ntd.setAttribute("class","left");
						text = document.createTextNode("mailServer  ");
						Ntd.appendChild(text);
						Ntr.appendChild(Ntd);
						Ntd = document.createElement("td");
						text = document.createTextNode(JsonConf.mailServer);
						Ntd.appendChild(text);
						Ntr.appendChild(Ntd);
						
						
						Ntr = document.createElement("tr");
						TBody.appendChild(Ntr);
						Ntd = document.createElement("td");
						Ntd.setAttribute("class","left");
						text = document.createTextNode("mailHostName  ");
						Ntd.appendChild(text);
						Ntr.appendChild(Ntd);
						Ntd = document.createElement("td");
						text = document.createTextNode(JsonConf.mailHostname);
						Ntd.appendChild(text);
						Ntr.appendChild(Ntd);
						
						
						Ntr = document.createElement("tr");
						TBody.appendChild(Ntr);
						Ntd = document.createElement("td");
						Ntd.setAttribute("class","left");
						text = document.createTextNode("mailSrc  ");
						Ntd.appendChild(text);
						Ntr.appendChild(Ntd);
						Ntd = document.createElement("td");
						text = document.createTextNode(JsonConf.mailSrc);
						Ntd.appendChild(text);
						Ntr.appendChild(Ntd);
						
						
						Ntr = document.createElement("tr");
						TBody.appendChild(Ntr);
						Ntd = document.createElement("td");
						Ntd.setAttribute("class","leftbottom");
						text = document.createTextNode("mailDst  ");
						Ntd.appendChild(text);
						Ntr.appendChild(Ntd);
						Ntd = document.createElement("td");
						Ntd.setAttribute("class","bottom");
						text = document.createTextNode(JsonConf.mailDst);
						Ntd.appendChild(text);
						Ntr.appendChild(Ntd);
						
						
						Ntr = document.createElement("tr");
						TBody.appendChild(Ntr);
						Ntd = document.createElement("th");
						Ntd.setAttribute('class', 'space');
						Ntd.setAttribute('colspan', 2);
						text = document.createTextNode("");
						Ntd.appendChild(text);
						Ntr.appendChild(Ntd);
						
						
						Ntr.appendChild(Ntd);
						Ntr = document.createElement("tr");
						TBody.appendChild(Ntr);
						Ntd = document.createElement("th");
						Ntd.setAttribute('colspan', 2);
						text = document.createTextNode("Log Configuration");
						Ntd.appendChild(text);
						Ntr.appendChild(Ntd);
						
						
						Ntr = document.createElement("tr");
						TBody.appendChild(Ntr);
						Ntd = document.createElement("td");
						Ntd.setAttribute("class","left");
						text = document.createTextNode("verboseMode  ");
						Ntd.appendChild(text);
						Ntr.appendChild(Ntd);
						Ntd = document.createElement("td");
						text = document.createTextNode(JsonConf.verboseMode);
						Ntd.appendChild(text);
						Ntr.appendChild(Ntd);
						
						
						Ntr = document.createElement("tr");
						TBody.appendChild(Ntr);
						Ntd = document.createElement("td");
						Ntd.setAttribute("class","leftbottom");
						text = document.createTextNode("useSyslogd  ");
						Ntd.appendChild(text);
						Ntr.appendChild(Ntd);
						Ntd = document.createElement("td");
						Ntd.setAttribute("class","bottom");
						text = document.createTextNode(JsonConf.useSyslogd);
						Ntd.appendChild(text);
						Ntr.appendChild(Ntd);
						
						
						Ntr = document.createElement("tr");
						TBody.appendChild(Ntr);
						Ntd = document.createElement("th");
						Ntd.setAttribute('class', 'space');
						Ntd.setAttribute('colspan', 2);
						text = document.createTextNode("");
						Ntd.appendChild(text);
						Ntr.appendChild(Ntd);
						
						
						Ntr = document.createElement("tr");
						TBody.appendChild(Ntr);
						Ntd = document.createElement("td");
						Ntd.setAttribute("class","left");
						text = document.createTextNode("disabledIpV4  ");
						Ntd.appendChild(text);
						Ntr.appendChild(Ntd);
						Ntd = document.createElement("td");
						text = document.createTextNode(JsonConf.disableIpV4);
						Ntd.appendChild(text);
						Ntr.appendChild(Ntd);
						
						Ntr = document.createElement("tr");
						TBody.appendChild(Ntr);
						Ntd = document.createElement("td");
						Ntd.setAttribute("class","left");
						text = document.createTextNode("disabledIpV6  ");
						Ntd.appendChild(text);
						Ntr.appendChild(Ntd);
						Ntd = document.createElement("td");
						text = document.createTextNode(JsonConf.disableIpV6);
						Ntd.appendChild(text);
						Ntr.appendChild(Ntd);
						
						try{
							Ntr = document.createElement("tr");
							TBody.appendChild(Ntr);
							Ntd = document.createElement("td");
							Ntd.setAttribute("class","leftbottom");
							text = document.createTextNode("whoisCmd  ");
							Ntd.appendChild(text);
							Ntr.appendChild(Ntd);
							Ntd = document.createElement("td");
							Ntd.setAttribute("class","bottom");
							text = document.createTextNode(JsonConf.whoIsCmd);
							Ntd.appendChild(text);
							Ntr.appendChild(Ntd);
						}catch(e){
							//alert(e);
						}
						
						
						Ntr = document.createElement("tr");
						TBody.appendChild(Ntr);
						Ntd = document.createElement("th");
						Ntd.setAttribute('class', 'spaceUB');
						Ntd.setAttribute('colspan', 2);
						//ESSS=Ntd;
						text = document.createTextNode("");
						Ntd.appendChild(text);
						Ntr.appendChild(Ntd);
				
					
					}catch(e){
						//var text = document.createTextNode(JsonConf.errMsg);
						//table.appendChild(text);
					}
					

				}else {
					document.getElementById('confTexttable').innerHTML = "getConfig.json?ip="+ip+" not found";
				}
								dialogConf.show();
			}
			unlockScreen();	
		}
		xhr.send(null);
	
}

/*
	var startButton = dojo.byId("startButton"),
		reverseButton = dojo.byId("reverseButton"),
		anim8target = dojo.byId("anim8target");

	// Set up a couple of click handlers to run our animations
	dojo.connect(startButton, "onclick", function(evt){
		dojo.animateProperty({
			node: anim8target,
			properties: { width: 1000 }
		}).play();
	});
	dojo.connect(reverseButton, "onclick", function(evt){
		dojo.animateProperty({
			node: anim8target,
			properties: { width: 100 }
		}).play();
	});
*/	
	
function makeWhoisSearchBar(){	
	require(["dijit/Toolbar", "dijit/form/Button", "dojo/_base/array", "dojo/domReady!"], function(Toolbar, Button, array){
	    var toolbar = new Toolbar({}, "whoisSearchBar");
	    /*array.forEach(["Cut", "Copy", "Paste"], function(label){
		var button = new Button({
		    // note: should always specify a label, for accessibility reasons.
		    // Just set showLabel=false if you don't want it to be displayed normally
		    label: label,
		    showLabel: false,
		    iconClass: "dijitEditorIcon dijitEditorIcon"+label
		});
		toolbar.addChild(button);
	    });*/
		    toolbar.startup();
	});
}



function showAccurate (button, numGraphe, Onglet){
	
	//alert("DivChart"+numGraphe+Onglet);
	
	if(document.getElementById("DivChart"+numGraphe+Onglet).style.display == 'block' ){
		
		button.innerHTML = "Show Default Chart";
		
		document.getElementById("DivChart"+numGraphe+Onglet).setAttribute("style", "display: none;");
		document.getElementById("DivChart"+numGraphe+Onglet+"Accurate").setAttribute("style", "display: block;");
		
		drawChart(numGraphe, Onglet, true);
		
	}else{
		
		button.innerHTML = "Show Accurate Chart";
		
		document.getElementById("DivChart"+numGraphe+Onglet).setAttribute("style", "display: block;");
		document.getElementById("DivChart"+numGraphe+Onglet+"Accurate").setAttribute("style", "display: none;");
		
		drawChart(numGraphe, Onglet, false);
		
	}
	
}



function setToDefault (numGraphe, Onglet){
	
	try{
		var button = document.getElementById("Button"+graphIndexFromTreePath(Onglet)+Onglet);
	
		button.innerHTML = "Show Accurate Chart";
		
		document.getElementById("DivChart"+numGraphe+Onglet).setAttribute("style", "display: block;");
		document.getElementById("DivChart"+numGraphe+Onglet+"Accurate").setAttribute("style", "display: none;");
		
	}catch(e){/*alert("hifunction");*/}
		
}



var newDivMinimisable = function(id, height, width, margin, padding, headerPosition, headerSize){
	
	var div = document.createElement("div");
	div.setAttribute("id", id);
	if(height) div.setAttribute("height", height);
	if(width) div.setAttribute("width", width);
	if(margin) div.setAttribute("margin", margin);
	if(padding) div.setAttribute("padding", padding);
	alert("in")
	
	var headerDiv =  document.createElement("div");
	headerDiv.setAttribute("style", "background: red");
	var bodyDiv =  document.createElement("div");
	bodyDiv.setAttribute("style", "background: yellow");
	
	switch(headerPosition){
		case "top":
			headerDiv.setAttribute("id", id+"_headerDiv");
			if(headerSize) headerDiv.setAttribute("height", headerSize);
			headerDiv.setAttribute("width", "100%");
			headerDiv.innerHTML = "<font align='center' valign='center'>v<font/>";
			div.appendChild(headerDiv);
		
			bodyDiv.setAttribute("id", id+"_bodyDiv");
			bodyDiv.setAttribute("height", "100%");
			bodyDiv.setAttribute("width", "100%");
			div.appendChild(bodyDiv);
		break;
		case "bottom":
			bodyDiv.setAttribute("id", id+"_bodyDiv");
			bodyDiv.setAttribute("height", "100%");
			bodyDiv.setAttribute("width", "100%");
			div.appendChild(bodyDiv);
		
			headerDiv.setAttribute("id", id+"_headerDiv");
			if(headerSize) headerDiv.setAttribute("height", headerSize);
			headerDiv.setAttribute("width", "100%");
			headerDiv.innerHTML = "<font align='center' valign='center'>^<font/>";
			div.appendChild(headerDiv);
		break;
		case "left":
			headerDiv.setAttribute("id", id+"_headerDiv");
			if(headerSize) headerDiv.setAttribute("width", headerSize);
			headerDiv.setAttribute("height", "100%");
			headerDiv.innerHTML = "<font align='center' valign='center'>><font/>";
			div.appendChild(headerDiv);
		
			bodyDiv.setAttribute("id", id+"_bodyDiv");
			bodyDiv.setAttribute("height", "100%");
			bodyDiv.setAttribute("width", "100%");
			div.appendChild(bodyDiv);
		break;
		case "right":
			bodyDiv.setAttribute("id", id+"_bodyDiv");
			bodyDiv.setAttribute("height", "100%");
			bodyDiv.setAttribute("width", "100%");
			div.appendChild(bodyDiv);
			
			headerDiv.setAttribute("id", id+"_headerDiv");
			if(headerSize) headerDiv.setAttribute("width", headerSize);
			headerDiv.setAttribute("height", "100%");
			headerDiv.innerHTML = "<font align='center' valign='center'><<font/>";
			div.appendChild(headerDiv);
		break;
		default:
		break;
	
	}
	
	return div;
}