function clickOnAlert(tr){
	
	value = tr.getAttribute("value");
	date = tr.getAttribute("date");
	localhost = tr.getAttribute("localhost");
	
	// cookie ===> memorisation des alertes lues
	if(document.cookie.indexOf(":"+value+":") == -1)
		document.cookie += (value+":");
	
	divs = tr.getElementsByTagName("div");
	for(var i =0; i<divs.length; i++){
		divs[i].style.setProperty("font-weight", "normal", null);
	}
	
	// pre-remplissage de l'onglet plus
		// initialisation
	initPlusData();
	
		// definition des dates
	document.getElementById("dateFinData").value = date;
	document.getElementById("dateFinData").onchange();
	if(debutDeCycle(document.getElementById("dateFinData").value) == document.getElementById("dateFinData").value)
		document.getElementById("dateDebData").value = debutDeCycle(decalerDate(document.getElementById("dateFinData").value,0,0,0,0,-1)) ;
	else
		document.getElementById("dateDebData").value = debutDeCycle(document.getElementById("dateFinData").value) ;
	document.getElementById("dateDebData").onchange();
	
		// definition du localhost
	dijit.byId("SelectIpData").setAttribute('value', localhost);
	dijit.byId("SelectIpAlerts").setAttribute("value", localhost);
	
		// si alert SMTP, alors port Ext => 25/TCP
//	if( tr.getAttribute("SMTP") == "true"){
	if( tr.getAttribute("alertType") == "SMTP"){
		document.getElementById("proto").value= "tcp";
		document.getElementById("proto").onchange();
		document.getElementById("portExt").value= "25";
	}
	
	
	
	var area = document.getElementById('TextArea');
	
	if ( area.hasChildNodes() ){
		while ( area.childNodes.length >= 1 ){
			area.removeChild( area.firstChild );       
		}
	}
	
	
		var xhr = createXhrObject();
		
		xhr.open("GET",  "dynamic/getAlertDetail.json?id="+value, false);
		xhr.send(null);
			
		if (xhr.readyState == 4){
			if(xhr.status == 200){
					
				var JsonAlert = eval("(" + xhr.responseText + ")");
				if(JsonAlert.errMsg)
					alert("dynamic/getAlertDetail.json Bug Report: "+JsonAlert.errMsg);	
				
				// si alert SUSPICIOUS, alors ip EXT => suspicious ip
//				if( tr.getAttribute("SUSPICIOUS") == "true"){
				if( tr.getAttribute("alertType") == "SUSPICIOUS"){
					try{
						if( JsonAlert.data[0].details.split('IP address: ')[1].split('type:')[0].length < JsonAlert.data[0].details.split('IP address: ')[1].split('\nhostname:')[0].length )
							document.getElementById("ipext").value= JsonAlert.data[0].details.split('IP address: ')[1].split('type:')[0];
						else
							document.getElementById("ipext").value= JsonAlert.data[0].details.split('IP address: ')[1].split('\nhostname:')[0];
						document.getElementById("ipext").onchange();	
					}catch(e){}
				}

				// si alert SCAN, alors ip EXT => suspicious ip
//				if( tr.getAttribute("SCAN") == "true"){
				if( tr.getAttribute("alertType") == "SCAN"){
					try{
						document.getElementById("ipext").value= JsonAlert.data[0].details.split(' host ')[2].split(' ')[0];
						document.getElementById("ipext").onchange();	

					}catch(e){}
				}
				
				var text = document.createTextNode(JsonAlert.data[0].details);
				area.appendChild(text);
				

				dijit.byId('dialogLogs').set( 'title', '<center>Alert raised by  '+localhost+'<br> on '+date.split(" ")[0]+' at '+date.split(" ")[1]+'<center>' );	
				//dijit.byId('dialogLogs').title = '<center>Alert raised by  '+localhost+'<br> on '+date.split(" ")[0]+' at '+date.split(" ")[1]+'<center>'  ;	
				dijit.byId('dialogLogs').setAttribute( 'tr', tr );
	
		
		
				if( !dijit.byId('dialogLogs').get('tr').nextSiblings()[0] )
					document.getElementById("prevAlertButt").disabled="disabled";	
				else
					document.getElementById("prevAlertButt").disabled="";	
				if( !dijit.byId('dialogLogs').get('tr').previousSiblings()[0] )
					document.getElementById("nextAlertButt").disabled="disabled";
				else
					document.getElementById("nextAlertButt").disabled="";
				
				
				dijit.byId('dialogLogs').show();
				

			}else{
				area.innerHTML = 'Json not found';
			}
		}
}

	
function newSortAlerts(value){
	if(document.getElementById("sortAlerts").value == value){
		changeSortAlertsOrder();
	}else{
		document.getElementById("sortAlerts").value = value;
		document.getElementById("descAlerts").value = "true"
		applyAlertsFormChanges();
	}
	
}


function changeSortAlertsOrder(){
	if(document.getElementById("descAlerts").value == "true")
		document.getElementById("descAlerts").value = "false";
	else
		document.getElementById("descAlerts").value = "true";
	
	applyAlertsFormChanges();
}

function applyAlertsFormChanges(){
	
	document.getElementById('ApplyAlerts').onclick();
	setTimeout("document.getElementById('ApplyFilterAlerts').disabled='disabled';", 100);
	
}


function setToDefaultHiddenAlertsForm(){
	
	document.getElementById('descAlerts').value="true" ;
	document.getElementById('sortAlerts').value=0 ;
	
}


function resetFilterAlerts(){
	
	document.getElementById('presetsAlerts').value = 0;
	dijit.byId('SelectIpAlerts').setAttribute('value', "");
	applyAlertsFormChanges();
	setTimeout("document.getElementById('ResetFilterAlerts').disabled='disabled';", 100);
	
}


function nouvellesAlertes(newLastAlertIndex){
	
	isAll = "false";
	isNoIp = "true";
	//alert(dijit.byId('dialogLogs').get('tr').getAttribute("value"));
	//
	shownAlertId = null;
	if(dijit.byId('dialogLogs').get('tr')) shownAlertId = dijit.byId('dialogLogs').get('tr').getAttribute("value");
	//alert(shownAlertId);
	
	try{
		para = document.getElementById('Alerts').getAttribute("params").split("&");
		for(var i=0; i<para.length; i++){
			if(para[i]=="duree=0"){ isAll="true";}
			if(para[i].indexOf("ip=")>=0){ isNoIp="false";}
		}
	}catch(e){
		alert(e);
	}
	
	/*alert(document.getElementById('Alerts').getAttribute("params")+"\n"+"isAll :"+isAll+"\n"+"isNoIp :"+isNoIp+"\n"+"sort alert : "+document.getElementById('sortAlerts').getAttribute("value")+"\n"+"desc :"+document.getElementById("descAlerts").getAttribute("value"));
	alert(isAll);
	alert(isNoIp);
	alert(document.getElementById('sortAlerts').getAttribute("value"));
	alert(document.getElementById("descAlerts").getAttribute("value"));*/
	
	if(lastAlertIndex == null || ( isAll=="true" && isNoIp=="true" &&
				document.getElementById('sortAlerts').getAttribute("value") == 0 &&
				document.getElementById("descAlerts").getAttribute("value") == "true") ){// si on est sur l'onglet alert et que les options de last alerts sont celles activ�es
		if( ongletActif() != "Alerts" ){
			document.getElementById('newAlertsTabGif').style.display = "block";
		}else{
		}
		chargerAlerts(null);
		lastAlertIndex =  newLastAlertIndex;
	}else{
		document.getElementById('newAlertsTabGif').style.display = "block";
		document.getElementById('newAlertsMessage').style.display = "block";
		document.getElementById('newAlertsMessage').getElementsByTagName("button")[0].value = newLastAlertIndex;
	}
	
	/*alert(dijit.byId('dialogLogs').get('tr').value);
	// si on regarde de près une alerte (pop up alertes ouverte) verifier et réactiver si necessaire le bouton "next(alerte)"
	if( !dijit.byId('dialogLogs').get('tr').previousSiblings()[0] )
		document.getElementById("nextAlertButt").disabled="disabled";
	else
		document.getElementById("nextAlertButt").disabled="";
	*/
	
	if(shownAlertId){
		sameTrNewId = null;
		tabAlerts=document.getElementById('TabAlerts').getElementsByTagName("tr");
		for(var i=0; i<tabAlerts.length; i++){
			if(tabAlerts[i].getAttribute("value"))
				if(tabAlerts[i].getAttribute("value") == shownAlertId) sameTrNewId = tabAlerts[i];
		}
		//alert(sameTrNewId)
		if(sameTrNewId){
			//changeAlertPopupTo(sameTrNewId);
			dijit.byId('dialogLogs').setAttribute('tr', sameTrNewId);
			sameTrNewId.onmouseover();
			if( !dijit.byId('dialogLogs').get('tr').previousSiblings()[0] )
				document.getElementById("nextAlertButt").disabled="disabled";
			else
				document.getElementById("nextAlertButt").disabled="";
		}
	}
}


function afficherNouvellesAlertes(newLastAlertIndex){
	document.getElementById('presetsAlerts').value = 0;
	dijit.byId("SelectIpAlerts").setAttribute("value","");
	document.getElementById('sortAlerts').value = 0;
	document.getElementById("descAlerts").value = "true"
	applyAlertsFormChanges();
	//chargerAlerts(null);	
	//lastAlertIndex =  newLastAlertIndex;
	document.getElementById('newAlertsTabGif').style.display = "none";
	document.getElementById('newAlertsMessage').style.display = "none";
}



