function myParseInt( string , base ){
	
	var str = string;
	
	while( str.charAt(0) == "0" && str.length>1){
		str = str.substring(1,str.length);
	}
	
	return parseInt(str , base);
	
}



function decalageHoraireLocal(){
			
	var xhr = createXhrObject();

	xhr.open("GET", "dynamic/getGMTdate.json", false);
	xhr.send(null);
			
	if (xhr.readyState == 4) 
	{ 
		if (xhr.status == 200) 
		{
			var serverNow = eval("(" + xhr.responseText + ")");
			if(serverNow.errMsg)alert('getGMTdate.json Bug Report: "+serverNow.errMsg);	
			
			var year = myParseInt(serverNow.data[0].yr,10);
			var month = myParseInt(serverNow.data[0].m,10);
			var day = myParseInt(serverNow.data[0].d,10);
			var hours = myParseInt(serverNow.data[0].h,10);
			var minutes = myParseInt(serverNow.data[0].mn,10);					
			var now = new Date();
			
			hours = hours - now.getTimezoneOffset()/60;
				
			if (hours>=24){
				hours = hours -24;
				day ++;
				if(month == 2){
					if ( (year%4 == 0 && day == 30) || (year%4 != 0 && day == 29) ){
						day = 1;
						month = 3;
					}
				}
				else if (month== 4 || month== 6 || month== 9 || month== 11){
					if (day == 31 ){
						day = 1;
						month++;
					}	
				}
				else {
					if (day == 32 ){
						day = 1;
						month ++;
						if(month == 13){
							month = 1;
							year ++;
						}
					}
				}
			}
			else if( hours < 0){
				hours = 24+hours;
				day --;
				if(day==0){
					month --;
					if(month == 2){
						if (year%4 == 0){
							day = 29;
						}else{
							day = 28;
						}
					}
					else if(month == 0){
						day = 31;
						month = 12;
						year --;									
					}
					else if(month== 4 || month== 6 || month== 9 || month== 11){
						day = 30;								
					}
					else {
						day = 31;		
					}
						
				}
						
			}
			
			
			
			var mn = "";
			var h = "";
			var d = "";
			var m = "";
			
			if(minutes < 10) mn = "0";
			if(hours < 10) h = "0";
			if(day < 10) d = "0";
			if(month < 10) m = "0";
			
			BSDate = decalerDate( year+"-"+m+month+"-"+d+day+" "+h+hours+":"+mn+minutes,0,0,0,0,15 );
			BIDate = decalerDate( year+"-"+m+month+"-"+d+day+" "+h+hours+":"+mn+minutes,0,0,0,0,-15 );
			
			if(now.getMinutes() < 10) mn = "0"; else mn = ""; 
			if(now.getHours() < 10) h = "0"; else h = ""; 
			if(now.getDate() < 10) d = "0"; else d = ""; 
			if((now.getMonth()+1) < 10) m = "0"; else m = ""; 
			
			localDate = now.getFullYear()+"-"+m+(now.getMonth()+1)+"-"+d+now.getDate()+" "+h+now.getHours()+":"+mn+now.getMinutes()
			
			if(BIDate<localDate && localDate<BSDate){
					return -now.getTimezoneOffset()/60 ;
			}else{
				if(serverNow.data[0].mn < 10) mn = "0"; else mn = ""; 
				if(serverNow.data[0].h < 10) h = "0"; else h = ""; 
				if(serverNow.data[0].d < 10) d = "0"; else d = ""; 
				if(serverNow.data[0].m < 10) m = "0"; else m = ""; 
				serverN = serverNow.data[0].yr +"-"+ m+serverNow.data[0].m +"-"+ d+serverNow.data[0].d +" "+ h+serverNow.data[0].h +":"+ mn+serverNow.data[0].mn;
				
				if(minutes < 10) mn = "0"; else mn = ""; 
				if(hours < 10) h = "0"; else h = ""; 
				if(day < 10) d = "0"; else d = ""; 
				if(month < 10) m = "0"; else m = ""; 
				localN = year +"-"+ m+month +"-"+ d+day +" "+ h+hours +":"+ mn+minutes;
			
				changeDate_ErrorTextDialog(serverN, localN);
				dijit.byId('dialogDateError').show();
				return -now.getTimezoneOffset()/60;
			}
			/*
			if( (Math.abs(now.getMinutes()-minutes)<10 && Math.abs(now.getHours()-hours)==0 ) || (Math.abs(now.getMinutes()-minutes)>50 && Math.abs(now.getHours()-hours)==1 ) ){
				if ( now.getFullYear() != year || now.getMonth()+1 != month || now.getDate() != day){
					//alert( "Date error !!! Please check your local system's date. Server's date : " +  serverNow.y +"-"+ serverNow.m +"-"+ serverNow.d +"   "+ serverNow.h +":"+ serverNow.mn );
					changeDate_ErrorTextDialog("modify", serverNow.data[0].yr +"-"+ serverNow.data[0].m +"-"+ serverNow.data[0].d +" "+ serverNow.data[0].h +":"+ serverNow.data[0].mn, year +"-"+ month +"-"+ day +" "+ hours +":"+ minutes);
					dijit.byId('dialogDateError').show();
					return -now.getTimezoneOffset()/60;
				}
				if( Math.abs(now.getHours()-hours)>1 ){
					//alert( "Date ERROR !!! Your system's clock looks bad. Please adjust it to : " +  year +"-"+ month +"-"+ day +"   "+ hours +":"+ minutes );
					changeDate_ErrorTextDialog("adjust", serverNow.data[0].yr +"-"+ serverNow.data[0].m +"-"+ serverNow.data[0].d +" "+ serverNow.data[0].h +":"+ serverNow.data[0].mn, year +"-"+ month +"-"+ day +" "+ hours +":"+ minutes);
					dijit.byId('dialogDateError').show();
					return -now.getTimezoneOffset()/60;
				}else{
					return -now.getTimezoneOffset()/60 ;
				}
			}
			else{
				//alert( "Date ERROR !!! More than a 15 minutes difference between server's clock and yours. Please adjust your local system's minutes and refresh. Server's date : " +serverNow.y +"-"+ serverNow.m +"-"+ serverNow.d +"   "+ serverNow.h +" : "+ serverNow.mn );
				changeDate_ErrorTextDialog("modify", serverNow.data[0].yr +"-"+ serverNow.data[0].m +"-"+ serverNow.data[0].d +" "+ serverNow.data[0].h +":"+ serverNow.data[0].mn, year +"-"+ month +"-"+ day +" "+ hours +":"+ minutes);
				dijit.byId('dialogDateError').show();
				return -now.getTimezoneOffset()/60;
			}*/					
		}
	}
}



function changeDate_ErrorTextDialog(stringServer, stringLocal){
	element = document.getElementById('dialogDateError').getElementsByTagName("textarea")[0];
	element.innerHTML = "ZNeTS noticed that your local system's date and/or location settings are wrong !\nPlease refresh page once changes are done.\nServer UTC Time :  "+ stringServer
							+"\nYour local system's date should be : "+stringLocal;
}




function decalHoraire(date){
	//alert("hhh"+date);
	var date_heure = date.split(" ");
	
	var CHARannee_mois_jour = date_heure[0].split("-");
	var CHARheure_minute = date_heure[1].split(":");
	//alert('ho');
	var annee_mois_jour = []  ;
	var heure_minute = [];
	
	//alert('ho1');
	var year = myParseInt(CHARannee_mois_jour[0],10);
	var month = myParseInt(CHARannee_mois_jour[1],10);
	var day = myParseInt(CHARannee_mois_jour[2],10);
	var hours = myParseInt(CHARheure_minute[0],10);
	var minutes = myParseInt(CHARheure_minute[1],10);
	
	//alert('ho2');
	var DATE = new Date(year, month-1, day, hours, minutes);
	//alert(DATE.getTimezoneOffset()/60);
	//alert('ho');

	return -DATE.getTimezoneOffset()/60;
	
}




function getParent(element, parentTagName) {
	if ( ! element )
		return null;
	else if ( element.nodeType == 1 && element.tagName.toLowerCase() == parentTagName.toLowerCase() )
		return element;
	else
		return getParent(element.parentNode, parentTagName);
}



function mettreChampsAJour(presetValue, origine, Onglet){
	//alert(origine+" : "+Onglet); 
	if( origine == "presets"+Onglet ){
		var now = new Date();
			
		if(document.getElementById('defaultPreset'+Onglet).selected || document.getElementById('defaultMonthPreset'+Onglet).selected){
			
			try{
				var imgTab = document.getElementById('formulaire'+Onglet).getElementsByTagName('img');
				for( var i = 0; i< imgTab.length; i++){					
					var src = imgTab[i].src;
					if(src.indexOf("calendar_icon.png",0)>=0)
						imgTab[i].src = "images/calendarDisabled_icon.png";
					else if(src.indexOf("prevMonth.png",0)>=0)
						imgTab[i].src = "images/prevMonthDisabled.png";
					else if(src.indexOf("prevDay.png",0)>=0)
						imgTab[i].src = "images/prevDayDisabled.png";
					else if(src.indexOf("nextDay.png",0)>=0)
						imgTab[i].src = "images/nextDayDisabled.png";
					else if(src.indexOf("nextMonth.png",0)>=0)
						imgTab[i].src = "images/nextMonthDisabled.png";
					else;
					
					if(src.indexOf("lhost.png",0)>=0){
					}else{
						imgTab[i].style.cursor = "default";
						imgTab[i].setAttribute('disabled','true');
						imgTab[i].disabled = true;
					}
				}				
			}catch(e){
			}
			
			document.getElementById('dateFin'+Onglet).value = '';
			document.getElementById('dateDeb'+Onglet).value = '';
			document.getElementById('dateFin'+Onglet).disabled = true;
			document.getElementById('dateDeb'+Onglet).disabled = true;
			
			/*if(Onglet != 'Plus'){
				document.getElementById('dateFinApplied'+Onglet).disabled = true;
				document.getElementById('dateDebApplied'+Onglet).disabled = true;
			}*/
		}
		else{
			try{
				var imgTab = document.getElementById('formulaire'+Onglet).getElementsByTagName('img');
				for( var i = 0; i< imgTab.length; i++){
					var src = imgTab[i].src;
					if(src.indexOf("calendarDisabled_icon.png",0)>=0)
						imgTab[i].src = "images/calendar_icon.png";
					else if(src.indexOf("prevMonthDisabled.png",0)>=0)
						imgTab[i].src = "images/prevMonth.png";
					else if(src.indexOf("prevDayDisabled.png",0)>=0)
						imgTab[i].src = "images/prevDay.png";
					else if(src.indexOf("nextDayDisabled.png",0)>=0)
						imgTab[i].src = "images/nextDay.png";
					else if(src.indexOf("nextMonthDisabled.png",0)>=0)
						imgTab[i].src = "images/nextMonth.png";
					else;
					
					if(src.indexOf("lhost.png",0)>=0){
					}else{
						imgTab[i].style.cursor = "pointer";
						imgTab[i].setAttribute('disabled','false');
						imgTab[i].disabled = false;
					}
				}
			}catch(e){
			}
			
			// rajouter le '0' devant les valeurs � 1 chiffre
			var m = "";
			var d = "";
			var h = "";
			if( now.getMonth()+1 <10)m = "0";
			if( now.getDate() <10)d = "0";
			if( now.getHours() <10)h = "0";
			
			
			if(presetValue == 1)
				document.getElementById("dateFin"+Onglet).value = now.getFullYear()+"-"+m+(now.getMonth()+1)+"-"+d+now.getDate()+" "+"00"+":"+"00";
			else if(presetValue == 2)
				document.getElementById("dateFin"+Onglet).value = now.getFullYear()+"-"+m+(now.getMonth()+1)+"-"+d+now.getDate()+" "+h+now.getHours()+":"+"00";
			else alert("error in function.js' line 565");
			
			document.getElementById('dateFin'+Onglet).disabled = false;
			document.getElementById('dateDeb'+Onglet).disabled = false;
			
			/*if(Onglet != 'Plus'){
				document.getElementById('dateFinApplied'+Onglet).disabled = false;
				document.getElementById('dateDebApplied'+Onglet).disabled = false;
			}*/
			document.getElementById("dateDeb"+Onglet).value = decalerDateP(document.getElementById("dateFin"+Onglet).value, presetValue, 0);
		}
		
	}else if( origine == "dateDeb"+Onglet){
		
			var date = document.getElementById("dateDeb"+Onglet).value;
		
			if(presetValue == 1){
				document.getElementById("dateDeb"+Onglet).value = extractDate(date,"y")+"-"+extractDate(date,"m")+"-"+extractDate(date,"d")+" 00:00";
			}else if(presetValue == 2){
				document.getElementById("dateDeb"+Onglet).value = extractDate(date,"y")+"-"+extractDate(date,"m")+"-"+extractDate(date,"d")+" "+extractDate(date,"h")+":00";
			}else alert("error in function.js' line 565");
		
			document.getElementById("dateFin"+Onglet).value = decalerDateP(document.getElementById("dateDeb"+Onglet).value, presetValue,1);
			document.getElementById("dateFin"+Onglet).onchange();
		
	}else if( origine == "dateFin"+Onglet){
		
			var date = document.getElementById("dateFin"+Onglet).value;
		
			if(presetValue == 1){
				document.getElementById("dateFin"+Onglet).value = extractDate(date,"y")+"-"+extractDate(date,"m")+"-"+extractDate(date,"d")+" 00:00";
			}else if(presetValue == 2){
				document.getElementById("dateFin"+Onglet).value = extractDate(date,"y")+"-"+extractDate(date,"m")+"-"+extractDate(date,"d")+" "+extractDate(date,"h")+":00";
			}else alert("error in function.js' line 565");
		
			document.getElementById("dateDeb"+Onglet).value = decalerDateP(document.getElementById("dateFin"+Onglet).value, presetValue, 0);
		
	}else alert("error in function.js : function 'mettreChampsAJour()'");
	
	
	if(Onglet != 'Plus' && Onglet != 'PlusData'){
		document.getElementById('Apply'+Onglet).disabled = false;
		document.getElementById('Apply'+Onglet).style.cursor = "pointer";
	}
	
}




function setParameters(element, string){
	//alert("hi");
	//string = string.replace(/ /, "");
	string = string.replace(/&.*=&/, "&");
	//string = string.replace(/&df=&/, "&");
	//alert(string);
	if(element){
		string = modifDH(element, string, "set");
		element.setAttribute('params', string);
	}else{
		string = modifDH(null, string, "set");
		parameters=string;
	}
	//alert(parameters);
}

function addToParameters(element, string){
	//string = string.replace(/ /, "");
	string = string.replace(/&dd=&/, "&");
	string = string.replace(/&df=&/, "&");
	string = modifDH(element, string, "add");
	//modifDH(string);
	if(element){
		string = modifDH(element, string, "add");
		element.setAttribute('params', element.getAttribute('params')+string);
	}else{
		string = modifDH(null, string, "add");
		parameters+=string;
	}
	//alert(parameters);
}
		
		
	
function autoRemplissageCorrespondance(){
	setTimeout("functionAutoRemplissageCorrespondance(); autoRemplissageCorrespondance()", 60000);
}
	

function functionAutoRemplissageCorrespondance(){
			
		var xhr = createXhrObject();

	
		if(jsonLocalhosts.items.length)
			xhr.open("GET", "dynamic/getListLocalhosts.json?nb="+jsonLocalhosts.items.length, false);
		else
			xhr.open("GET", "dynamic/getListLocalhosts.json", false);
		xhr.send(null);
				
		if (xhr.readyState == 4) 
		{ 
			if (xhr.status == 200) 
			{
				var jsonO = eval("(" + xhr.responseText + ")");
				var jsonO2 = eval("(" + xhr.responseText + ")");
				try{
					//alert(jsonLocalhosts.items.length+" < "+jsonO.items.length+" = "+(jsonLocalhosts.items.length < jsonO.items.length));
					if(jsonO.items){
							TabIP=  new Array(); 
							TabNAME=  new Array();
							reIpLocAutoCompletion(jsonO, jsonO2);
							var i=0;
							while(jsonO.items[i] != null){
								TabNAME[i] = jsonO.items[i].name;
								TabIP[i] =  jsonO.items[i].ip;
								i++;
							}
					}
				}catch(e){
					if(jsonO.errMsg)alert('getListLocalhosts.json Bug Report: "+jsonO.errMsg);	
				}
			}else{
				//alert('errer');
			}
		}else{
			//alert('errer2');
		}
	
	//}
}
	

function remplissageCorrespondance(JsonLocalhosts, JsonCountry){
	//if(!mouseDown){
		
		// remplissage des noms et ip des machines
		TabIP=  new Array();
		TabNAME=  new Array();
	
		
			var absent = true;
			for(var j=0; j<TabNAME.length; j++) if(TabNAME[j] == JsonLocalhosts.items[i].name) absent =false;
			if(absent){
				var i=0;
				while(JsonLocalhosts.items[i] != null){
					TabNAME[i] = JsonLocalhosts.items[i].name;
					TabIP[i] =  JsonLocalhosts.items[i].ip;
					i++;
				}
			}
		
		
		
		// remplissage des noms et codes lettres des pays
		TabCOUNTRY =  new Array();
		for(var i=0; i<JsonCountry.items.length; i++){
			if(TabCOUNTRY[JsonCountry.items[i].n]){
			}else{
				var i=0;
				while(JsonCountry.items[i] != null){
					TabCOUNTRY[JsonCountry.items[i].n] = JsonCountry.items[i].c;
					i++;
				}
			}
		}
	//}
}
		


	


function updateProtoFilter(proto) {
  document.getElementById("proto").value= proto;
  document.getElementById("portLoc").disabled= (proto != 'tcp') && (proto != 'udp');
  document.getElementById("portExt").disabled= (proto != 'tcp') && (proto != 'udp');
  document.getElementById("tcpflagC").disabled= (proto != 'tcp');
  document.getElementById("tcpflagE").disabled= (proto != 'tcp');
  document.getElementById("tcpflagU").disabled= (proto != 'tcp');
  document.getElementById("tcpflagA").disabled= (proto != 'tcp');
  document.getElementById("tcpflagP").disabled= (proto != 'tcp');
  document.getElementById("tcpflagR").disabled= (proto != 'tcp');
  document.getElementById("tcpflagS").disabled= (proto != 'tcp');
  document.getElementById("tcpflagF").disabled= (proto != 'tcp');
  if(proto =='' ){
	document.getElementById("portLoc").value= '';
	document.getElementById("portExt").value= '';
	document.getElementById("tcpflagC").checked = "checked";
	document.getElementById("tcpflagE").checked = "checked";
	document.getElementById("tcpflagU").checked = "checked";
	document.getElementById("tcpflagA").checked = "checked";
	document.getElementById("tcpflagP").checked = "checked";
	document.getElementById("tcpflagR").checked = "checked";
	document.getElementById("tcpflagS").checked = "checked";
	document.getElementById("tcpflagF").checked = "checked";
  }
}

function setPlusTab(label, name, ongletOrigine){
	
	try{
		
		if(label.split("/")[1]){
			
			var now = new Date();
			
			var onglet = ongletActif();
			//if(onglet == "OngletGlobal")onglet="Global";
				
			var m = "";
			var d = "";
			var h = "";
			if( now.getMonth()+1 <10)m = "0";
			if( now.getDate() <10)d = "0";
			if( now.getHours() <10)h = "0";
			
			
			var date = document.getElementById("dateFinApplied"+onglet).value;
			//if(date == "") date = now.getFullYear()+"-"+m+(now.getMonth()+1)+"-"+d+now.getDate()+" "+h+now.getHours()+":00";
			
			m = "";
			d = "";
			h = "";			

			if( myParseInt(label.split("/")[1]) <10)m = "0";
			if( myParseInt(label.split("/")[0]) <10)d = "0";
			
			var DD =  extractDate(date,"y")+"-"+m+myParseInt(label.split("/")[1])+"-"+d+myParseInt(label.split("/")[0])+" "+"00"+":"+"00";
			
			// si la date du click > la date de fin alors on a click� sur un jour du mois precedent !
			if( myParseInt(label.split("/")[1]) > myParseInt(extractDate(date,"m")) )DD = decalerDate( DD,-1,0,0,0,0 ); 
			
			document.getElementById("HourPresetPlus").selected =  'selected';	
			document.getElementById("presetsPlus").onchange();
			document.getElementById("dateDebPlus").value =  DD;			
			document.getElementById("dateDebPlus").onchange();	
			document.getElementById("dateFinPlus").value = decalerDate( document.getElementById("dateDebPlus").value,0,0,1,0,0 );	
			document.getElementById("dateFinPlus").onchange();	
			
		}else{		
			copyPreset(ongletOrigine, 'Plus');
		}
	
	}catch(e){
		copyPreset(ongletOrigine, 'Plus');
	}	
	
	if(name != ""){
		//alert("nam: "+name+"\n ip: "+ipFrom(name));
		dijit.byId("SelectIp").setAttribute( 'value' , ipFrom(name) );
		//dijit.byId("SelectIp").value = ipFrom(name);
		dijit.byId("SelectIpData").setAttribute( 'value' , ipFrom(name) );	
	}
	
	
}

function setPlusTabProto(label, proto){
	
	//initPlusData();	
		
	/*if(proto == 'TCP') proto = 'tcp';
	else if(proto == 'UDP') proto = 'udp';
	else if(proto == 'OTH') proto = 'others';
	else proto = '';*/
	updateProtoFilter(proto);
	document.getElementById("proto").value = proto;
	
	if(label != ""){
		try{
			var now = new Date();
			
			var onglet = ongletActif();
			//if(onglet == "OngletGlobal")onglet="Global";
			
			var m = "";
			var d = "";
			var h = "";
			if( now.getMonth()+1 <10)m = "0";
			if( now.getDate() <10)d = "0";
			if( now.getHours() <10)h = "0";
			
			
			var date = document.getElementById("dateFinApplied"+onglet).value;
			if(date == "") date = now.getFullYear()+"-"+m+(now.getMonth()+1)+"-"+d+now.getDate()+" "+h+now.getHours()+":00";
			
			m = "";
			d = "";
			h = "";
			
			if(label.split("/")[1]){

				if( myParseInt(label.split("/")[1]) <10)m = "0";
				if( myParseInt(label.split("/")[0]) <10)d = "0";
				
				var DD =  extractDate(date,"y")+"-"+m+myParseInt(label.split("/")[1])+"-"+d+myParseInt(label.split("/")[0])+" "+"00"+":"+"00";
				//alert(DD);
				/*if( myParseInt(label.split("/")[0]) > myParseInt(extractDate(date,"d")) )DD = decalerDate( DD,0,-1,0,0,0 ); // si la date du click > la date de fin alors on a click� sur un jour du mois precedent !
				if( myParseInt(label.split("/")[1]) > myParseInt(extractDate(date,"m")) )DD = decalerDate( DD,-1,0,0,0,0 ); // si le mois du click > au mois de fin alors on a click� sur l'ann�e precedente !
				alert(DD);*/
				document.getElementById("dateDebData").value =  DD;			
				document.getElementById("dateDebData").onchange();	
				document.getElementById("dateFinData").value = decalerDate( document.getElementById("dateDebData").value,0,0,1,0,0 );	
				document.getElementById("dateFinData").onchange();	
				
			}else{			
				if( myParseInt(label.split("h")[0]) <10)h = "0";
				
				var DD =  extractDate(date,"y")+"-"+extractDate(date,"m")+"-"+extractDate(date,"d")+" "+h+myParseInt(label.split("h")[0])+":"+"00";
				
				if( myParseInt(label.split("h")[0]) >= myParseInt(extractDate(date,"h")) ){DD = decalerDate( DD,0,0,-1,0,0 ); }// si l'heure du click > l'heure de fin alors on a click� sur le jour precedent !
				
				document.getElementById("dateDebData").value =  DD;			
				document.getElementById("dateDebData").onchange();	
				document.getElementById("dateFinData").value = decalerDate( document.getElementById("dateDebData").value,0,0,0,1,0 );	
				document.getElementById("dateFinData").onchange();	
			}
		
		}catch(e){
			
		}
	}		
	
		
	
}





function ipFrom(Onglet){
	if(Onglet != ""){
		if(myParseInt(Onglet)){
			return Onglet;
		}else{
			var i = 0;
			while( TabNAME[i] != Onglet && i<TabNAME.length) i++;
			if( i<TabNAME.length) return TabIP[i];
			else return null;
		}
	}else{
		return null;
	}
}

	
	
function estMachine(identifiant){
	var bool = false;
	var i=0;
	
	while(!bool && i<TabIP.length){
		if( TabIP[i] == identifiant || TabNAME[i] == identifiant )bool = true;
		i++;
	}		
	
	return bool;
}


function autoIptoName( Ip ){

	for (var i = 0; i<TabIP.length; i++){
		if (TabIP[i] == Ip ) return  TabNAME[i];
	}
	return  null;
	
}

	

function autoNametoIp( Name ){

	for (var i = 0; i<TabNAME.length; i++){
		if (TabNAME[i] == Name ) return  TabIP[i];
	}
	return  null;
	
}

function initPlusData(){
	//alert("init");
	var tab = ["dateDebData", "dateFinData", "duration", "dir", "ipext", "minInTraffic", "maxInTraffic", "minOutTraffic", "maxOutTraffic", "minIncPkts", "minOutPkts", "maxIncPkts", "maxOutPkts", "proto", "portLoc", "portExt",  "hiddenCountry", "ipextHidden", "iplocHidden", "AS"];
	for( var i = 0; i< tab.length; i++){
		try{
			if(document.getElementById(tab[i])){
				//if(tab[i] == "AS")alert(document.getElementById(tab[i]).getAttribute('value'));
				document.getElementById(tab[i]).setAttribute('value', '');
				document.getElementById(tab[i]).value = "";
				document.getElementById(tab[i]).onchange();
			}
		}catch(e){}
	}
	
	try{dijit.byId('SelectCountry').setAttribute('value', 'All');}catch(e){}
	try{dijit.byId("SelectIpData").setAttribute('value', ""); }catch(e){}
	
	// initialisation du whois (qui fait aussi partie dde l'onglet "+"
	document.getElementById("whoIs").setAttribute('value', null);
		
}

function disableEmpty(){
	var tab = ["dateDebData", "dateFinData", "duration", "dir", "ipext", "minInTraffic", "maxInTraffic", "minOutTraffic", "maxOutTraffic", "minIncPkts", "minOutPkts", "maxIncPkts", "maxOutPkts", "proto", "portLoc", "portExt", "hiddenCountry", "iplocHidden", "ipextHidden", "AS"];
	
	for( var i = 0; i< tab.length; i++){
		try{
			var element = document.getElementById(tab[i]);
			if( element.value == "" || element.value == null) element.disabled="disabled";
			
		}catch(e){}
	}
		//alert(document.getElementById("AS").getAttribute('value'))
}

function enableAll(){
	
	var tab = ["dateDebData", "dateFinData", "duration", "dir", "ipext", "minInTraffic", "maxInTraffic", "minOutTraffic", "maxOutTraffic", "minIncPkts", "minOutPkts", "maxIncPkts", "maxOutPkts", "proto", "portLoc", "portExt", "hiddenCountry", "iplocHidden", "ipextHidden", "AS"];
	for( var i = 0; i< tab.length; i++){
		try{
			document.getElementById(tab[i]).disabled="";
		}catch(e){}
	}
	
	updateProtoFilter(document.getElementById("proto").value);
	
	if( !document.getElementById("tcpflagC").disabled){
		
		tab = ["tcpflagC", "tcpflagE", "tcpflagU", "tcpflagA", "tcpflagP", "tcpflagR", "tcpflagS", "tcpflagF"];
		
		addToParameters( null, "&tcpFlags=" );
		
		for( var i = 0; i< tab.length; i++)
			if(document.getElementById(tab[i]).checked) addToParameters( null, document.getElementById(tab[i]).value );
		
	}
	
}


function compareLegendArray(a,b) {
		return compareItems(a[0],b[0],'./');
}

function compareHostsNameArray(a,b) {
	return compareItems(a.name,b.name,'');
}

function compareHostsIpArray(a,b) {
	return compareItems(a.ip,b.ip,'./');
}

function compareNInJsonArray(a,b) {
	return compareItems(a.n,b.n,'');
}

function compareServerInJsonArray(a,b) {
	return compareItems(a.server,b.server,'');
}
 
/*function compareItems2(a,b,specialChars){
	if(a>b)return 1;
	if(a==b)return 0;
	return -1;
}
 
function compareItems(a,b,specialChars){
	try{
		//alert(a+" : "+b);
		
		if(a==b)
			return 0;
	 
		if(a=='')
			return 0;
	 
		if(b=='')
			return 1;
	 
		if(a.charAt(0)==' ') return 0;
		if(b.charAt(0)==' ') return 1;
	 
		x=specialChars;
		amin=a.length;
			for (i=0;i<x.length;i++)
			{
	 
				aidx=a.indexOf(x[i]);
				if((aidx < amin) && (aidx != -1))
				amin=aidx;
			}
	 
			bmin=b.length;
			for (i=0;i<x.length;i++)
			{
	 
				bidx=b.indexOf(x[i]);
				if((bidx < bmin) && (bidx != -1))
					bmin=bidx;
			}
	 
			if (isNaN(a.substring(0,amin)) && isNaN(b.substring(0,bmin)))
			{
				if (amin == a.length) return (bmin != b.length) || a>b;
				if (bmin == b.length) return 0;
				if (a.substring(amin,a.length) == b.substring(bmin,b.length)) 
					return a.substring(0,amin)>b.substring(0,bmin);
				else return a.substring(amin,a.length) > b.substring(bmin,b.length)
			}
			if (isNaN(a.substring(0,amin))) return 1;
			if (isNaN(b.substring(0,bmin))) return -1;
	 
			if (amin!=bmin) return amin>bmin;
	 
			if (a.substring(0,amin) == b.substring(0,bmin))
				return compareItems(a.substring(amin+1,a.length),b.substring(bmin+1,b.length),x);
	 
			//alert(a+" : "+b+" : "+myParseInt(a.substring(0,amin))>myParseInt(b.substring(0,bmin)));
			return myParseInt(a.substring(0,amin))>myParseInt(b.substring(0,bmin));
		}catch(e){alert(e);}
		
}
*/
 
function compareItems(a,b,specialChars){
	try{
		//alert(a+" : "+b);
		
		if(a==b)
			return 0;
	 
		if(a=='')
			return -1;
	 
		if(b=='')
			return 1;
	 
		if(a.charAt(0)==' ') return -1;
		if(b.charAt(0)==' ') return 1;
	 
		x=specialChars;
		amin=a.length;
			for (i=0;i<x.length;i++)
			{
	 
				aidx=a.indexOf(x[i]);
				if((aidx < amin) && (aidx != -1))
				amin=aidx;
			}
	 
			bmin=b.length;
			for (i=0;i<x.length;i++)
			{
	 
				bidx=b.indexOf(x[i]);
				if((bidx < bmin) && (bidx != -1))
					bmin=bidx;
			}
	 
			if (isNaN(a.substring(0,amin)) && isNaN(b.substring(0,bmin)))
			{
				if (amin == a.length) if ((bmin != b.length) || a>b) return 1; else return -1;
				if (bmin == b.length) return -1;
				if (a.substring(amin,a.length) == b.substring(bmin,b.length))
				{
					if (a.substring(0,amin)>b.substring(0,bmin))
					  return 1; else return -1;
				}
				else
				{
					if (a.substring(amin,a.length) > b.substring(bmin,b.length))
					  return 1; else return -1;
				}
			}
			if (isNaN(a.substring(0,amin))) return 1;
			if (isNaN(b.substring(0,bmin))) return -1;
	 
			if (amin!=bmin) if(amin>bmin)  return 1; else return -1;
	 
			if (a.substring(0,amin) == b.substring(0,bmin))
				return compareItems(a.substring(amin+1,a.length),b.substring(bmin+1,b.length),x);
	 
			//alert(a+" : "+b+" : "+myParseInt(a.substring(0,amin))>myParseInt(b.substring(0,bmin)));
			if (myParseInt(a.substring(0,amin))>myParseInt(b.substring(0,bmin)))
			  return 1; else return -1;
		}catch(e){alert(e);}
		
}



function ongletActif(){
	var Onglets= document.getElementById("AllTabs").getElementsByTagName("li");
	
	for(var i = 0; i<=Onglets.length; i++){
		if(Onglets[i].getAttribute('class') ==  "active" &&  Onglets[i].getAttribute("genre")!="groupe")
			return Onglets[i].id;
	}
	
}

function copyPreset(from, to){
	//alert(from+" : "+to);
	
	if(to !="Data"){
		//for( var i=0; i< document.getElementById("presets"+from).childNodes.length; i++){
			try{
				/*ESSS =document.getElementById("presets"+from).childNodes[1];
				ESSSS =document.getElementById("presets"+to).childNodes[2];
				if(document.getElementById("presetsApplied"+from).value == 2) {
					if(document.getElementById("dateDebApplied"+from).value == "") document.getElementById("presets"+to).childNodes[0].selected=true;
					else document.getElementById("presets"+to).childNodes[2].selected=true;
				}else{
					if(document.getElementById("dateDebApplied"+from).value == "") document.getElementById("presets"+to).childNodes[1].selected=true;
					else document.getElementById("presets"+to).childNodes[3].selected=true;
				}*/
				for( var i=0; i< document.getElementById("presets"+from).length; i++){
					if(document.getElementById("presets"+from).options[i].selected) {
						document.getElementById("presets"+to).options[i].selected='selected';
					}
				}
			}catch(e){
				/*for( var i=0; i< document.getElementById("presets"+from).childNodes.length; i++){
					if(document.getElementById("presets"+from).childNodes[i].selected) {
						document.getElementById("presets"+to).childNodes[i].selected=true;
					}
				}*/
			}
			if(document.getElementById("presets"+to).options[1].selected || document.getElementById("presets"+to).options[2].selected){
				document.getElementById('dateFin'+to).disabled = true;
				document.getElementById('dateDeb'+to).disabled = true;
			}else{
				document.getElementById('dateFin'+to).disabled = false;
				document.getElementById('dateDeb'+to).disabled = false;
			}
		//}	
	}
	
	try{
		document.getElementById("presets"+to).onchange();
	}catch(e){
		
	}
	
	try{
		document.getElementById("dateDeb"+to).setAttribute('value', document.getElementById("dateDebApplied"+from).value ) ;
		document.getElementById("dateFin"+to).setAttribute('value', document.getElementById("dateFinApplied"+from).value ) ;
		document.getElementById("dateDeb"+to).value=document.getElementById("dateDebApplied"+from).value ;
		document.getElementById("dateFin"+to).value=document.getElementById("dateFinApplied"+from).value ;

	}catch(e){}
		
	document.getElementById("dateDeb"+to).setAttribute('value', document.getElementById("dateDeb"+from).value ) ;
	document.getElementById("dateFin"+to).setAttribute('value', document.getElementById("dateFin"+from).value ) ;
	document.getElementById("dateDeb"+to).value=document.getElementById("dateDeb"+from).value ;
	document.getElementById("dateFin"+to).value=document.getElementById("dateFin"+from).value ;
	
}


function extractDate( date, extract ){
	
	var date_heure = date.split(" ");
	var CHARannee_mois_jour = date_heure[0].split("-");
	var CHARheure_minute = date_heure[1].split(":");
	
	switch(extract){
		case 'y':
			return CHARannee_mois_jour[0];
			break;
		case 'm':
			return CHARannee_mois_jour[1];
			break;
		case 'd':
			return CHARannee_mois_jour[2];
			break;
		case 'h':
			return CHARheure_minute[0];
			break;
		case 'mn':
			return CHARheure_minute[1];
			break;
		default :
			alert("default in function extractDate() !");
			return null;
			break;
	}
}

function DateCoherente( date ){
	
	if(date=="")return "";
	
	var now = new Date();

	var m = "";
	var d = "";
	var h = "";
	var mn = "";
	
	try{
		var date_heure = date.split(" ");
		var AMJ = date_heure[0].split("-");
		var HM = date_heure[1].split(":");
		
		if ( myParseInt(AMJ[0],10) || myParseInt(AMJ[0],10) == 0){
			if( AMJ[0].length < 4 ) {
				var L = 4-AMJ[0].length;
				//AMJ[0] = myParseInt(AMJ[0],10);
				for(var i = L-1; i>=0 ; i--) AMJ[0] = (""+now.getFullYear()).charAt(i)+AMJ[0];
			}else if( AMJ[0].length > 4 ) {
				AMJ[0] = now.getFullYear() ;
			}
		}else AMJ[0] = now.getFullYear() ;
		AMJ[0] = myParseInt(AMJ[0],10) ;
		
		if ( myParseInt(AMJ[1],10) ){
			AMJ[1] = myParseInt(AMJ[1],10) ;
			if( AMJ[1]>12) AMJ[1] = 12;
			else if( AMJ[1]<1) AMJ[1] = 1 ;
		}else AMJ[1] = now.getMonth()+1;
		
		if ( myParseInt(AMJ[2],10) ){
			AMJ[2] = myParseInt(AMJ[2],10) ;
			if( AMJ[2]<1 ) AMJ[2] = 1;
			else{
				if ( (AMJ[1] == 4 || AMJ[1] == 6 || AMJ[1] == 9 || AMJ[1] == 11) && AMJ[2] > 30 ){
					AMJ[2] = 30;
				}else if ( AMJ[1] == 2 && AMJ[0]%4 != 0 && AMJ[2] > 28 ){
					AMJ[2] = 28;
				}else if ( AMJ[1] == 2 && AMJ[0]%4 == 0 && AMJ[2] > 29 ){
					AMJ[2] = 29;
				}else if ( AMJ[2] > 31 ){
					AMJ[2] = 31;
				}
			}
		}else AMJ[2] = now.getDate();
		
		
		
		if ( myParseInt(HM[0],10) || myParseInt(HM[0],10) == 0){
			HM[0] = myParseInt(HM[0],10) ;
			if( HM[0]>23 || HM[0]<0) HM[0] = now.getHours();
		}else HM[0] = now.getHours();

		if ( myParseInt(HM[1],10) || myParseInt(HM[1],10) == 0){
			HM[1] = myParseInt(HM[1],10) ;
			if( HM[1]>59 || HM[1]<0) HM[1] = 0;
		}else HM[1] = 0;
		
		
		if( AMJ[1] <10)m = "0";
		if( AMJ[2] <10)d = "0";
		if( HM[0] <10)h = "0";
		if( HM[1] <10)mn = "0";
		var ourDate = AMJ[0]+"-"+m+AMJ[1]+"-"+d+AMJ[2]+" "+h+HM[0]+":"+mn+HM[1];
		
		if( now.getMonth()+1 <10)m = "0";
		else m = "";
		if( now.getDate() <10)d = "0";
		else d = "";
		if( now.getHours() <10)h = "0";
		else h = "";
		if( now.getMinutes() <10)mn = "0";
		else mn = "";
		var nowDate = now.getFullYear()+"-"+m+(now.getMonth()+1)+"-"+d+now.getDate()+" "+h+now.getHours()+":"+mn+now.getMinutes();
		
		// on s'assure que la date entr�e n'est pas future
		if(nowDate < ourDate) {/*alert( "now : "+nowDate);*/return nowDate;}
		else {/*alert("our : "+ourDate);*/return ourDate;}
		
	}catch(e){
		
		if( now.getMonth()+1 <10)m = "0";
		if( now.getDate() <10)d = "0";
		if( now.getHours() <10)h = "0";
		if( now.getMinutes() <10)mn = "0";
		
		//alert("catch = "+ now.getFullYear()+"-"+m+(now.getMonth()+1)+"-"+d+now.getDate()+" "+h+now.getHours()+":"+mn+now.getMinutes());
		return now.getFullYear()+"-"+m+(now.getMonth()+1)+"-"+d+now.getDate()+" "+h+now.getHours()+":"+mn+now.getMinutes();
			
	}
	
}



function saveToCSV(params){
	
	button = document.getElementById(ongletActif()+"STCButton");
	button.firstChild.setAttribute('src', "images/saveToCSVdisabled.png");
	button.disabled =true;

	myWin = window.open("rawDataFlow.csv?"+params);
	dojo.connect(myWin, "onclose", doneCSV());
	
}



function doneCSV(){
	
	button = document.getElementById(ongletActif()+"STCButton");
	button.firstChild.setAttribute('src', "images/saveToCSV.png");
	button.disabled = false;
	
}



	function restartLogsAutoRefresh(){
		clearTimeout(logAutoRefreshTO);
		logsAutoRefresh();
	}
	
	
	function logsAutoRefresh(){
		logAutoRefreshTO = setTimeout("logsAutoRefreshFunction(); logsAutoRefresh();", 15000);
	}
	
	
	
	function logsAutoRefreshFunction(){
		
		//if(!mouseDown){
			lastScrollTop = document.getElementById('TabLogsDiv').scrollTop; 
			ChargerLogs(); 
			document.getElementById('TabLogsDiv').scrollTop = lastScrollTop;
		//}
		
		var now = new Date();
		//alert(lastHour+" : "+lastDay);
		// initialisation de lastHour si necessaire
		if(lastHour == null) lastHour = now.getHours();
		if(lastDay == null) lastDay = now.getDate();
		
		//if(now.getHours() != lastHour || now.getDate() != lastDay)
		//	alert(lastHour+" : "+lastDay+" : "+now.getHours()+" : "+now.getDate());
		
		// check du changement d'heure et activation des boutons Apply si changement
		
		var TOC = document.getElementById("AllTabs").getElementsByTagName("li");
		
		for( var i=0 ; i< TOC.length ; i++ ){
			if(TOC[i].id != "Alerts" && TOC[i].id != "Plus"){ // sauf pour les onglets "plus" et "alertes"
				try{
					//if(TOC[i].id == "Global")alert(document.getElementById("presets"+TOC[i].id).childNodes[0].selected && now.getHours() != lastHour) 
					//		|| (document.getElementById("presets"+TOC[i].id).childNodes[1].selected && now.getDate() != lastDay);
					if( (document.getElementById("presets"+TOC[i].id).options[0].selected && now.getHours() != lastHour) 
							|| (document.getElementById("presets"+TOC[i].id).options[1].selected && now.getDate() != lastDay) ){
						
						var allClosed = true;
						var j = 1;
						
						while(document.getElementById("DivGraphe"+j+TOC[i].id) && allClosed){
							if(document.getElementById("DivGraphe"+j+TOC[i].id).style.display == "block") allClosed = false;
							j++;
						}
						if(allClosed){
							document.getElementById("Apply"+TOC[i].id).onclick();
						}else{
							document.getElementById("timeSpaceChange"+TOC[i].id).innerHTML = '<center><table><tr><td><img src="images/Warning.png"></td><td><font style="margin-left: 15px;">: New Data available ! Click "Apply" button to update.</font></td></tr></table></center> ';
							document.getElementById("Apply"+TOC[i].id).disabled = false;
						}		
					}
				}catch(e){
				//alert(e+" : "+TOC[i].id);
				}
			}
		}
		
		lastHour = now.getHours(); 
		lastDay = now.getDate();	
		
	}
	
	
	
	
	function popupAutoShow(){
		setTimeout("popupShow(); popupAutoShow()",7000);
	}
	
	
	function popupShow(){
		try{
			// definir la boite de dialogue comme non fermable
			dijit.byId("dialogPopUp").closable = "false";
			
			//document.getElementById("popupDialogContinueButton").disabled = "false";
			dijit.byId("dialogPopUp").show();
			document.getElementById("popupDialogContinueButton").value = 5;
			document.getElementById("popupDialogContinueButton").disabled = false;
			document.getElementById("popupDialogContinueButton").innerHTML="Continue free trial"; 
		}catch(e){
		}
	}
	
	
	
	function theFinalCountDown(TO){
		document.getElementById("popupDialogContinueButton").value -- ;
		if(document.getElementById("popupDialogContinueButton").value == 0){
			dijit.byId('dialogPopUp').hide();
			setTimeout("popupShow();",300000);
		}else{
			document.getElementById("popupDialogContinueButton").innerHTML="Wait... ("+document.getElementById("popupDialogContinueButton").value+")"; 
			clickOnContinue();
		}
		
	}
	
	
	function clickOnContinue(){
		
		document.getElementById("popupDialogContinueButton").disabled = true;
		document.getElementById("popupDialogContinueButton").innerHTML="Wait... ("+document.getElementById("popupDialogContinueButton").value+")"; 
		setTimeout('theFinalCountDown()', 500);
		
	}
	
	
	function resolveASDetailTab(input){
		
		if(input.value == ""){
			
			document.getElementById("resolvedAS").innerHTML ="";
			document.getElementById("resolvedAS").innerHTML ="";
			
		}else{
			
			var ASName = resolveAS(input);
			
			document.getElementById("resolvedAS").title = ASName;
			document.getElementById("resolvedAS").innerHTML = ASName;
			
			if(ASName == ""){
				setASValueTO("");
				document.getElementById("AS").style.color = 'red'; 
				document.getElementById('TabQueryFormData').disabled = true;
			}else{
				document.getElementById("AS").style.color = 'black'; 
				
				if(document.getElementById('dateFinData').style.color == 'black'
						&& document.getElementById('dateFinData').style.color == 'black'
						&& document.getElementById('dateFinData').value != ""
						&& document.getElementById('dateFinData').value != "")
					document.getElementById('TabQueryFormData').disabled = false;
			}
		}
	
	}
	
	
	
	function resolveAS(input){
		
		var ASNum = parseInt(input.value);
		if(isNaN(ASNum))ASNum = "";
		input.value = ASNum;
		input.setAttribute('value', ASNum);
		
		
		var xhr = createXhrObject();
		
		xhr.open("GET", "dynamic/getAsName.json?as="+ASNum, false);
		
		xhr.send(null);
		
		if (xhr.readyState == 4) 
		{ 
			if (xhr.status == 200) 
			{
				try{
					var JsonObj = eval("(" + xhr.responseText + ")");	
					return JsonObj.items[0].n;
				}catch(e){
					return "";
				}
				
			}
		}
		
	}
	
	
	function resolveASNum(num){
		
		
		var xhr = createXhrObject();

		xhr.open("GET", "dynamic/getAsName.json?as="+num, false);
		xhr.send(null);
			
		if (xhr.readyState == 4) { 
			if (xhr.status == 200) {
				try{
					var JsonObj = eval("(" + xhr.responseText + ")");	
					return JsonObj.items[0].n;
				}catch(e){
					if(num != 0)
						return "AS Num. : "+num;
					else
						return "" ;
				}	
			}
		}
		
	}
	
	
	
	
function clickLoupe(value, msg){

	var area = document.getElementById('TextArea');
	if ( area.hasChildNodes() ){
		while ( area.childNodes.length >= 1 ){
			area.removeChild( area.firstChild );       
		} 
	}
	var text = document.createTextNode(value);
	area.appendChild(text);
	dijit.byId('dialogLogs').setAttribute('title', 'Alert raised by '+msg.split("IPloc: ")[1]+'<br> the '+msg.split("[")[1].split("]")[0].split(" ")[0]+' at '+msg.split("[")[1].split("]")[0].split(" ")[1]);	
	dijit.byId('dialogLogs').show();
	
}
	
	
	
	
function ordXAxis(chart$){

	scal = chart$.getAxis("y").getScaler().bounds.to - chart$.getAxis("y").getScaler().bounds.from;
	ord = (chart$.plotArea.height * ((chart$.getAxis("y").getScaler().bounds.to)/scal) ) + chart$.offsets.t;
	return ord;
	
}	

	
	
function waitForResolving(){
	if(geoIpASNum=="disabled"){
		document.getElementById("AS").setAttribute("value", "");
		document.getElementById("AS").value = "";
	}else{
		waitingForResolvingAS = true;
		rASTO = setTimeout("resolveASDetailTab(document.getElementById('AS')); waitingForResolvingAS=false;", 1000);
	}
}

	

function keyPressedAS(event){
	//alert(event.charCode);
	if (event.charCode != 0 && (event.charCode < 44 || event.charCode > 57 || event.charCode==45 || event.charCode==47)){
		var ASNum = parseInt(document.getElementById('AS').value);
		//alert(ASNum+" : "+isNaN(ASNum));
		if(isNaN(ASNum) || ASNum ==''){
			ASNum = "";
			//alert('hio');
			setTimeout("setASValueTO('');", 10);
		}else{
			setTimeout("setASValueTO("+ASNum+");", 10);
		}
	}else{
		if(waitingForResolvingAS){
			waitingForResolvingAS= false; 
			clearTimeout(rASTO);
		}
		waitForResolving();
	}
	
}


	
function setASValueTO(value){
	//alert(value);
	try{
		document.getElementById("AS").setAttribute("value", value);
		document.getElementById("AS").value = value;
	}catch(e){
		document.getElementById("AS").setAttribute("value", "");
		document.getElementById("AS").value = "";
	}
	document.getElementById("AS").onchange();
}

	

function setIpExtValue(){
	if(document.getElementById('ipextMask').value != "" && document.getElementById('ipext').value != ""){
		document.getElementById('ipextHidden').name = "ipext";
		document.getElementById('ipextHidden').value = document.getElementById('ipext').value+"/"+document.getElementById('ipextMask').value;
		if(document.getElementById('ipextMask').value != "32" && document.getElementById('ipextMask').value != "128"){
			dijit.byId("SelectCountry").attr( 'value' , "");
			document.getElementById("AS").setAttribute("value", "");
			document.getElementById("AS").value = "";
			document.getElementById("AS").onchange();
			document.getElementById("lhNameDataExt").innerHTML = "";
		}else{
			document.getElementById("lhNameDataExt").innerHTML = returnSolvedIpExt(document.getElementById("ipext").value);
		}
	}else{
		document.getElementById("lhNameDataExt").innerHTML = "";
		document.getElementById('ipextHidden').name = "";
		document.getElementById('ipextHidden').value = "";
	}	
}


	

function setIpLocValue(){
	if(document.getElementById('iplocMask').value != "" && dijit.byId('SelectIpData').get('value') != "" && dijit.byId('SelectIpData').get('value') != " "){
		document.getElementById('iplocHidden').name = "iploc";
		document.getElementById('iplocHidden').value = dijit.byId('SelectIpData').get('value')+"/"+document.getElementById('iplocMask').value;
		if(document.getElementById('iplocMask').value != "32" && document.getElementById('iplocMask').value != "128"){
			document.getElementById("lhNameData").innerHTML = "";
		}
	}else{
		document.getElementById('iplocHidden').name = "";
		document.getElementById('iplocHidden').value = "";
	}	
}


function createXhrObject()
{
    if (window.XMLHttpRequest)
        return new XMLHttpRequest();
 
    if (window.ActiveXObject)
    {
        var names = [
            "Msxml2.XMLHTTP.6.0",
            "Msxml2.XMLHTTP.3.0",
            "Msxml2.XMLHTTP",
            "Microsoft.XMLHTTP"
        ];
        for(var i in names)
        {
            try{ return new ActiveXObject(names[i]); }
            catch(e){}
        }
    }
    window.alert("Votre navigateur ne prend pas en charge l'objet XMLHTTPRequest.");
    return null; // non supporté
}



var BrowserDetect = {
	
	run: function () {
		
		this.browser = this.searchString(this.dataBrowser) || "An unknown browser";
		this.version = this.searchVersion(navigator.userAgent)
			|| this.searchVersion(navigator.appVersion)
			|| "an unknown version";
	},
	searchString: function (data) {
		for (var i=0;i<data.length;i++)	{
			var dataString = data[i].string;
			var dataProp = data[i].prop;
			this.versionSearchString = data[i].versionSearch || data[i].identity;
			if (dataString) {
				if (dataString.indexOf(data[i].subString) != -1)
					return data[i].identity;
			}
			else if (dataProp)
				return data[i].identity;
		}
	},
	searchVersion: function (dataString) {
		var index = dataString.indexOf(this.versionSearchString);
		if (index == -1) return;
		return parseFloat(dataString.substring(index+this.versionSearchString.length+1));
	},
	dataBrowser: [
		{
			string: navigator.userAgent,
			subString: "Chrome",
			identity: "Chrome"
		},
		{ 	string: navigator.userAgent,
			subString: "OmniWeb",
			versionSearch: "OmniWeb/",
			identity: "OmniWeb"
		},
		{
			string: navigator.userAgent,
			subString: "Epiphany",
			identity: "Epiphany",
			versionSearch: "Epiphany"
		},
		{
			string: navigator.vendor,
			subString: "Apple",
			identity: "Safari",
			versionSearch: "Version"
		},
		{
			prop: window.opera,
			identity: "Opera",
			versionSearch: "Version"
		},
		{
			string: navigator.vendor,
			subString: "iCab",
			identity: "iCab"
		},
		{
			string: navigator.vendor,
			subString: "KDE",
			identity: "Konqueror"
		},
		{
			string: navigator.userAgent,
			subString: "MSIE",
			identity: "Explorer",
			versionSearch: "MSIE"
		},
		{
			string: navigator.userAgent,
			subString: "Firefox",
			identity: "Firefox"
		},
		{
			string: navigator.vendor,
			subString: "Camino",
			identity: "Camino"
		},
		{		// for newer Netscapes (6+)
			string: navigator.userAgent,
			subString: "Netscape",
			identity: "Netscape"
		},
		{
			string: navigator.userAgent,
			subString: "Gecko",
			identity: "Mozilla",
			versionSearch: "rv"
		},
		{ 		// for older Netscapes (4-)
			string: navigator.userAgent,
			subString: "Mozilla",
			identity: "Netscape",
			versionSearch: "Mozilla"
		}
	]
		
};



function isBrowserOk()
{
	BrowserDetect.run();
		
	testedBrowser = [
		{
			browser: "Chrome",
			version: "14"
		},
		{
			browser: "Epiphany",
			version:"2.4"
		},
		{
			browser: "Safari",
			version: "5.1"
		},
		{
			browser: "Opera",
			version: "11.4"
		},
		{
			browser: "Firefox",
			version: "4"
		},
		{
			browser: "Konqueror",
			version: "4"
		}/*,
		{		// for newer Netscapes (6+)
			browser: "Netscape",
			identity: "Netscape"
		},
		{
			browser: "Explorer",
			versionSearch: "MSIE"
		},
		{
			browser: "Mozilla",
			versionSearch: "rv"
		},
		{ 		// for older Netscapes (4-)
			browser: "Netscape",
			versionSearch: "Mozilla"
		}*/
	];
	
	for (var i=0;i<testedBrowser.length;i++){
		if (BrowserDetect.browser == testedBrowser[i].browser) {
			if(BrowserDetect.version < testedBrowser[i].version)
				return testedBrowser[i].version;
			else
				return "later";
		}
	}
		
	return null; // non supporté
}


function setTabOngletHeight(){
	
	document.getElementById("TabOnglets").setAttribute("style", "height: "+(document.getElementById("Plus").offsetTop-document.getElementById("tabEntete").clientHeight-3)+"px;");
	
	divs = document.getElementById("TabGroupes").getElementsByTagName("div");
	for(var i=0; i< divs.length; i++){
		if(divs[i].style.display == "block"){
			lis = divs[i].getElementsByTagName("li");
			try{
			divs[i].setAttribute("style", "height: "+(document.getElementById(lis[lis.length-1].id).offsetTop-document.getElementById("Plus").offsetTop-document.getElementById("Plus").clientHeight-9)+"px;");
			}catch(e){
				//alert("lis.length="+lis.length+"\n"+"err in tool.js:1600 = "+e);
			}
			//document.getElementById("TabGroupes").setAttribute("clientHeight", document.getElementById(lis[lis.length-1].id).offsetTop-document.getElementById("Plus").offsetTop-3);
			//return;
		}
	}
	
}



function modifDH(element, string, setORadd){
	//alert(element+" : "+string+" : "+setORadd);
	
	if(setORadd == "set"){
		if(string.indexOf("df=") != -1 && string.indexOf("dh=") != -1){
			dateF = string.split("df=")[1];
			if(dateF.split("&")[0] != "")dateF = dateF.split("&")[0];
			decalH = string.split("dh=")[1];
			if(decalH.split("&")[0] != "")decalH = decalH.split("&")[0];
			
			dateF =dateF.replace(/%3A/,":").replace(/%20/, " ");
			
			if(decalHoraire(dateF) == decalH) return string;
			else{
				returnString = string.split("dh=")[0]+"dh="+decalHoraire(dateF)+string.split("dh="+decalH)[1];
				return returnString;
			}
		}else return string;	
	}else if(setORadd == "add"){
		if(!element)
			prevParams = parameters;
		else
			prevParams = element.getAttribute('params');
		
		if(prevParams.indexOf("df=") != -1 && string.indexOf("dh=") != -1){
			dateF = prevParams.split("df=")[1];
			if(dateF.split("&")[0] != "")dateF = dateF.split("&")[0];
			decalH = string.split("dh=")[1];
			if(decalH.split("&")[0] != "")decalH = decalH.split("&")[0];
			
			dateF =dateF.replace(/%3A/,":").replace(/%20/, " ");
			
			if(decalHoraire(dateF) == decalH) return string;
			else{
				returnString = string.split("dh=")[0]+"dh="+decalHoraire(dateF)+string.split("dh="+decalH)[1];
				return returnString;
			}
		}else if(string.indexOf("df=") != -1 && string.indexOf("dh=") != -1){
			dateF = string.split("df=")[1];
			if(dateF.split("&")[0] != "")dateF = dateF.split("&")[0];
			decalH = string.split("dh=")[1];
			if(decalH.split("&")[0] != "")decalH = decalH.split("&")[0];
			
			dateF =dateF.replace(/%3A/,":").replace(/%20/, " ");
			
			if(decalHoraire(dateF) == decalH) return string;
			else{
				returnString = string.split("dh=")[0]+"dh="+decalHoraire(dateF)+string.split("dh="+decalH)[1];
				return returnString;
			}	
		}else return string;	
	}else return string;	
	
}




function changeAlertPopupTo(tr)
{
	dijit.byId('dialogLogs').hide();
	dijit.byId('dialogLogs').get('tr').onmouseout(); 
	tr.onmouseover(); 
	setTimeout(function(){clickOnAlert(tr);}, 500);
}



function setGI_GIAS(gi, gias)
{
	if(gi)geoIp = gi;
	if(gias)geoIpASNum = gias;
	
	try{
		if(geoIp=="disabled") dijit.byId("SelectCountry").set('disabled', "disabled");
		else dijit.byId("SelectCountry").set('disabled', "");
	}catch(e){
	}
	
	if(geoIpASNum=="disabled") document.getElementById("AS").disabled="disabled";
	else document.getElementById("AS").disabled="";
	
}



function clickOnglet(id)
{
	try{
		setParameters(null, document.getElementById(id).getAttribute("params"));
	}catch(e){}
	
	estGrp = (document.getElementById(id).getAttribute("genre")=="groupe");
	estUnderGrp = (document.getElementById(id).getAttribute("groupe")!=null);
	//alert("estGrp: "+estGrp+"    "+"estUnderGrp: "+estUnderGrp);
	
	tabGrpsDivs = document.getElementById('TabGroupes').getElementsByTagName("div");
	allTabs = document.getElementById('AllTabs').getElementsByTagName("li");
	
	if(estGrp){
		
		// Desactivations de tous les onglets
		for(var i=0; i<allTabs.length; i++)allTabs[i].setAttribute("class", 'inactive');
		
		tabGrpOnglet = document.getElementById('TabOnglets'+id);
		tabGrpOngletLi = tabGrpOnglet.getElementsByTagName("li");
		
		// Activation de la bonne table de sous onglets
		for(var i=0; i<tabGrpsDivs.length; i++)tabGrpsDivs[i].style.display='none';
		tabGrpOnglet.style.display='block'; 
		
		
		// Activation du bon sous onglet
		for(var i=0; i<tabGrpOngletLi.length; i++){
			if(tabGrpOngletLi[i].getAttribute("underClass") == "active"){
				ChangerOnglet(tabGrpOngletLi[i].id); ChangerDiv("Div"+tabGrpOngletLi[i].id);
				tabGrpOngletLi[i].setAttribute("class", "active");
			}
		}
		
		// Garder l'onglet du groupe actif
		document.getElementById(id).setAttribute("class", 'active');
		
	}else if(estUnderGrp){
		
		tabGrpOnglet = document.getElementById('TabOnglets'+document.getElementById(id).getAttribute("groupe"));
		tabGrpOngletLi = tabGrpOnglet.getElementsByTagName("li");
		
		// Activation du bon sous onglet
		for(var i=0; i<tabGrpOngletLi.length; i++){
			tabGrpOngletLi[i].setAttribute("underClass", "inactive");
		}
		document.getElementById(id).setAttribute("underClass", "active");
		
		ChangerOnglet(id); ChangerDiv("Div"+id);
		
		// Garder l'onglet du groupe actif
		document.getElementById(document.getElementById(id).getAttribute("groupe")).setAttribute("class", 'active');
		
	}else{
		
		// Desactivation de tous les onglets groupes
		for(var i=0; i<allTabs.length; i++)allTabs[i].setAttribute("class", 'inactive');
		document.getElementById(id).setAttribute("class", "active");
		
		// Desactivation de toutes les tables de sous onglets
		for(var i=0; i<tabGrpsDivs.length; i++)tabGrpsDivs[i].style.display='none';
		
		ChangerOnglet(id); ChangerDiv("Div"+id);
		
	}
	
	setTabOngletHeight();
	
}


function dataAlreadyOpened(){
	allTabs = document.getElementById("AllTabs").getElementsByTagName("li");
	for(var i=0; i<allTabs.length; i++)
		if(allTabs[i].isClosable && allTabs[i].getAttribute("id").indexOf("Data")==0)
			return true;
	return false;
}


function localhostAlreadyOpened(){
	allTabs = document.getElementById("AllTabs").getElementsByTagName("li");
	for(var i=0; i<allTabs.length; i++)
		if(allTabs[i].isClosable && allTabs[i].getAttribute("id").indexOf("Data")==-1)
			return true;
	return false;
}
