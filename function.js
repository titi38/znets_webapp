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
		
		xhr.open("GET", "dynamic/getAlertDetail.json?id="+value, false);
		xhr.send(null);
			
		if (xhr.readyState == 4){
			if(xhr.status == 200){
					
				var JsonAlert = eval("(" + xhr.responseText + ")");
				if(JsonAlert.errMsg)
					alert('getAlertDetail.json Bug Report: "+JsonAlert.errMsg);	
				
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
				document.getElementById("descAlerts").getAttribute("value") == "true") ){// si on est sur l'onglet alert et que les options de last alerts sont celles activÈes
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
	// si on regarde de pr√®s une alerte (pop up alertes ouverte) verifier et r√©activer si necessaire le bouton "next(alerte)"
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



function fadeNewLogs(){
	
	setTimeout("fadeLogs()",3000);
	
}


function fadeLogs(){
	
	var tabTR = document.getElementById('TabLogs').getElementsByTagName("tr");
	
	for( var i=0; i< tabTR.length; i++){
		
		if( tabTR[i].getAttribute("style") =="background: #EEFFEE;")
			tabTR[i].setAttribute("style","background: white;");
	
	}
	
}




function animatePlusTab(){
	document.getElementById("body").scrollTop = 0;
	// code pour faire clignoter l'onglet plus
	if(!compteur){
		compteur = 6;
		lancerAnimation();
	}
	
	// code pour passer directement a l'onglet plus
	//ChangerDiv("DivPlus");
	//ChangerOnglet("Plus");
}


function lancerAnimation(){
	
	if(compteur == 0) {
		clearTimeout(setTOAnim);
	}else{
		setTOAnim = setTimeout("animation(document.getElementById('Plus')); lancerAnimation()",500);
	}
	
}

function animation(element){
	
	switch(element.className){
		case "bipping":
			element.className = "inactive";
			break;

		case "inactive":
			element.className = "bipping";
			break;

		default:
			break;
	}
	
		compteur--;
	
	
}

function loading(divId){
	
	// pour eviter tout conflit et perte de la div de chargement, on decharge la div
	unLoading();
	
	try{
		
		if(divId != null && divId != "") document.getElementById(divId).appendChild(document.getElementById("divdiv"));
		
		// redimensionement du tableau pr center la gif de chargement
		document.getElementById("divdiv").setAttribute("height", document.getElementById(divId).getHeight());
		document.getElementById("divdiv").getElementsByTagName('tr')[0].setAttribute("height", document.getElementById(divId).getHeight());
		document.getElementById("divdiv").setAttribute("width", document.getElementById(divId).getWidth());
		document.getElementById("divdiv").getElementsByTagName('td')[0].setAttribute("width", document.getElementById(divId).getWidth());
	}catch(e){
		
		// redimensionement du tableau pr center la gif de chargement
		document.getElementById("divdiv").setAttribute("height", document.body.getHeight());
		document.getElementById("divdiv").getElementsByTagName('tr')[0].setAttribute("height", document.body.getHeight());
		document.getElementById("divdiv").setAttribute("width", document.body.getWidth());
		document.getElementById("divdiv").getElementsByTagName('td')[0].setAttribute("width", document.body.getWidth());
	}
		
	document.getElementById("divdiv").style.display = "block";
		
}

function unLoading(){
	
	document.body.appendChild(document.getElementById("divdiv"));
	
	document.getElementById("divdiv").style.display = "none";
	
}



var autoCompletion = function(){
//alert("com"+jsonLocalhosts.items.length);

	var JsonCountry = null;
	var JsonLocalhosts = null;
	

	// auto completion des noms et ip machines
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
				if( xhr.responseText == "") {}
				else{
					var JsonAuto = eval("(" + xhr.responseText + ")");
					var JsonLocalhosts = eval("(" + xhr.responseText + ")");
					
					// virer les sans name pour la suite sinon plantage chrome
						for(var i=0; i<JsonLocalhosts.items.length; i++){
							if(JsonLocalhosts.items[i].name == ""){
								JsonLocalhosts.items.splice(i, 1);
								i--;
							}
						}
					
					
					try{
						jsonLocalhosts = JsonAuto;
						

	//alert(JsonLocalhosts.items[0].name+" : "+JsonLocalhosts.items[0].ip+"\n"+JsonLocalhosts.items[1].name+" : "+JsonLocalhosts.items[1].ip+"\n"+JsonLocalhosts.items[2].name+" : "+JsonLocalhosts.items[2].ip+"\n"+JsonLocalhosts.items[3].name+" : "+JsonLocalhosts.items[3].ip)
						JsonLocalhosts.items.sort(compareHostsNameArray);
	//alert(JsonLocalhosts.items[0].name+" : "+JsonLocalhosts.items[0].ip+"\n"+JsonLocalhosts.items[1].name+" : "+JsonLocalhosts.items[1].ip+"\n"+JsonLocalhosts.items[2].name+" : "+JsonLocalhosts.items[2].ip+"\n"+JsonLocalhosts.items[3].name+" : "+JsonLocalhosts.items[3].ip)
						//JsonLocalhosts.items.reverse();
						//ESSS = JsonLocalhosts;
						
						while(JsonLocalhosts.items[0].name == "") JsonLocalhosts.items.splice(0, 1);
						
						var stateStore = new dojo.data.ItemFileReadStore({
						    data: JsonAuto
						});
						var filteringSelectIp = new dijit.form.ComboBox({
						    id: "SelectIp",
						    name: "ip",
						    value: "",
						    lastValue: "",
						    onChange: function(evt){
							//if( evt != "" && autoIptoName(evt)!=null){
							if( evt != ""){ 
								this.name ="ip";
								if(evt.indexOf("/") == -1)document.getElementById("lhNamePlus").innerHTML = autoIptoName(evt) ; // si mask reseau, pas de resolution d'ip
								else document.getElementById("lhNamePlus").innerHTML = "";
								document.getElementById("ApplyPlus").disabled = "";
								if(ongletActif() != "Plus")
									dijit.byId("SelectIpData").setAttribute('value', evt) ;
							}else{ 
								if(evt == "")this.name ="";
								document.getElementById("lhNamePlus").innerHTML = "" ; 
								this.value = "";
								this.setAttribute('value', ""); 
								document.getElementById("ApplyPlus").disabled = "disabled";
									//alert(evt+" :::: " +autoIptoName(evt));
								if(evt != "" &&  !autoIptoName(evt)){
									alert("Invalid  Localhost Ip Adress4: "+ evt);
								}
							}
						    },
						    store: stateStore,
						    searchAttr: "ip", 
						    style: {width: "14em"},
						    pageSize: 20
						},
						"formIpPlus");
						
						
						
						var filteringSelectIpData = new dijit.form.ComboBox({
						    id: "SelectIpData",
						    //name: "iploc",
						    value: "",
						    lastValue: "",
						    onChange: function(evt){
							//if( evt != "" && autoIptoName(evt)!=null){ 
							if( evt != "" ){ 
								if(evt.indexOf(':')!=-1)
									document.getElementById('iplocMask').value = 128; 
								else if(evt.indexOf('.')!=-1) 
									document.getElementById('iplocMask').value = 32;
								
								document.getElementById("lhNameData").innerHTML = autoIptoName(evt) ; 
								
								if(ongletActif() != "Plus")
									dijit.byId("SelectIp").setAttribute('value', evt) ;
								
							}else{ 
								document.getElementById('iplocMask').value = "";
								document.getElementById("lhNameData").innerHTML = "" ; 
								this.value = ""; 
								this.setAttribute('value', "");
									//alert(evt+" :: " +autoIptoName(evt));
								if(evt != "" &&  !autoIptoName(evt)){
									alert("Invalid  Localhost Ip Adress2: "+ evt);
								}
								
							}
							setIpLocValue(); 
						    },
						    store: stateStore,
						    searchAttr: "ip", 
						    style: {width: "10em"},
						    pageSize: 20
						},
						"iploc");
						
						
						
						var filteringSelectIpAlerts = new dijit.form.ComboBox({
						    id: "SelectIpAlerts",
						    name: "ip",
						    value: "",
						    lastValue: "",
						    onChange: function(evt){
							document.getElementById('ApplyFilterAlerts').disabled=''; 
							if( evt != "" && autoIptoName(evt)!=null){ 
								this.name ="ip";
								document.getElementById("lhNameAlerts").innerHTML = autoIptoName(evt) ; 
								//document.getElementById('ApplyFilterAlerts').disabled=''; 
								document.getElementById('ResetFilterAlerts').disabled='';
							}else{ 
								if(evt == ""){
									this.name ="";
									if(document.getElementById('presetsAlerts').options[0].selected)
										document.getElementById('ResetFilterAlerts').disabled='true'; 
									else
										document.getElementById('ResetFilterAlerts').disabled='';
								}
								document.getElementById("lhNameAlerts").innerHTML = "" ; 
								this.value = ""; 
								this.setAttribute('value', "");
									//alert(evt+" ::: " +autoIptoName(evt));
								/*if(evt != "" &&  !autoIptoName(evt)){
									alert("Invalid  Localhost Ip Adress3: "+ evt);
								}*/
							}
						    },
						    store: stateStore,
						    searchAttr: "ip", 
						    style: {width: "10em"},
						    pageSize: 20
						   
						},
						"ipAlerts");
						
						
						
						var stateStore2 = new dojo.data.ItemFileReadStore({
						    data: JsonLocalhosts
						});
								
						var filteringSelectName = new dijit.form.ComboBox({
						    id: "SelectName",
						    value: " ",
						    style: {width: "14em"},
						    onChange: function(evt){
								if(evt != ' '){
									if(evt){
										dijit.byId(dijit.byId("dialogHostName").source).setAttribute("value", autoNametoIp(evt)); 
									}
									
									if(dijit.byId("dialogHostName").open)
										dijit.byId("dialogHostName").hide();
									else
										dijit.byId("dialogHostName").show();
									
									if(!autoNametoIp(evt)){
										if(evt != "")
											alert("Invalid Host Name : "+ evt);
										this.value = ""; 
										this.setAttribute('value', "");
									}
								}
							
						    },
						    store: stateStore2,
						    searchAttr: "name", 
						    pageSize: 20
						},
						"formNamePlus");
					}catch(e){
						if(JsonAuto.errMsg)alert('getListLocalhosts.json Bug Report: "+JsonAuto.errMsg);	
					}
					
				}
			} else {
				
			}
			
		}else{
			
		}
	
	
	
	// auto completion des noms et codes-lettres pays
	var xhr1 = createXhrObject();
	
	xhr1.open("GET", "dynamic/getCountryList.json", false);
	xhr1.send(null);
		if (xhr1.readyState == 4) 
		{
			if (xhr1.status == 200) 
			{
				if( xhr1.responseText == "") {}
				else{
					
					var JsonCountry = eval("(" + xhr1.responseText + ")");
					if(JsonCountry.errMsg)alert('getCountryList.json Bug Report: "+JsonCountry.errMsg);	
					
					//tri du tableau
					JsonCountry.items.sort(compareNInJsonArray); 
					
					// inversion pour rajouter un champs en tÍte de liste
					// rajout du champ "All" en fin de liste (soit en debut dans l'ordre du tri)
					// inversion pour retrouver l'ordre de tri
					JsonCountry.items.reverse();
					JsonCountry.items.push({ n:"All", c:""});
					JsonCountry.items.reverse();	
					
					
					var stateStore = new dojo.data.ItemFileReadStore({
					    data: JsonCountry
					});
					var filteringSelectCountry = new dijit.form.ComboBox({
					    id: "SelectCountry",
					    //name: "country",
					    value: "All",
					    onChange: function(evt){
						    if(geoIp=="disabled"){ 
							    this.value="All";
							    this.setAttribute('value', 'All');
						    }else{
							    if(evt == "N/A") evt="All";
							    if(TabCOUNTRY[evt]){
								document.getElementById("hiddenCountry").value=TabCOUNTRY[evt];
							    }else{
								this.value="All";
								this.setAttribute('value', 'All');
								document.getElementById("hiddenCountry").value="";
							    }
						    }
						},
					    store: stateStore,
					    sort: {attribute:"n",descending: true},
					    searchAttr: "n", 
					    pageSize: 20,
					    disabled: (geoIp=="disabled")
					},
					"country");
					
					filteringSelectCountry.set("class", "countryTextBox");
					
					
				}
			} else {
				
			}
		}
	
	
	// auto completion des serveurs "whois"
	serverWhoIsList.items.sort(compareServerInJsonArray); 
	var stateStore = new dojo.data.ItemFileReadStore({
	    data: serverWhoIsList 
	});
	var filteringSelectIp = new dijit.form.ComboBox({
	    id: "serverWhoIs",
	    name: "server",
	    value: "",
	    onChange: function(evt){addNewWhoIsServer(this, evt);},
	    store: stateStore,
	    searchAttr: "server", 
	    style: {width: "12em"},
	    pageSize: 20
	},
	"serverWhoIs");
	
	
	remplissageCorrespondance(JsonLocalhosts, JsonCountry);
	autoRemplissageCorrespondance();

}
		
		
function addNewWhoIsServer(combobox, server){
	
	newServer = true;
	for(var i = 0; i < serverWhoIsList.items.length; i++){
		if(serverWhoIsList.items[i].server == server)
			newServer = false;
	}
	
	if(newServer){
		for(var i = serverWhoIsList.items.length; i > 1; i--){
			if(i==serverWhoIsList.items.length)serverWhoIsList.items[i] = {"server": ""};
			serverWhoIsList.items[i] = serverWhoIsList.items[i-1];
		}
		serverWhoIsList.items[1] = {"server": server};
		combobox.store = new dojo.data.ItemFileReadStore({data: serverWhoIsList});
	}else{
		var i = 0;
		while(serverWhoIsList.items[i].server != server)
			i++;
		if(i!=0){
			for(var j = i; j > 1; j--){
				serverWhoIsList.items[j]= serverWhoIsList.items[j-1];
			}
			serverWhoIsList.items[1] = {"server": server};
			combobox.store = new dojo.data.ItemFileReadStore({data: serverWhoIsList});
		}
	}
	
}



var reIpLocAutoCompletion = function(jsonIp1, jsonIp2){
	/*jsonIp1.items.reverse();
	jsonIp2.items.reverse();*/
	//alert(jsonIp1.items[0].ip);
	// virer les sans name pour la suite sinon plantage chrome
	for(var i=0; i<jsonIp2.items.length; i++){
		if(jsonIp2.items[i].name == ""){
			jsonIp2.items.splice(i, 1);
			i--;
		}
	}
	
	jsonIp1.items.sort(compareHostsIpArray);
	jsonIp2.items.sort(compareHostsNameArray);
	
	//alert(jsonIp1.items[0].ip);
	jsonLocalhosts = jsonIp1;
	try{		
		dijit.byId("SelectIp").store = new dojo.data.ItemFileReadStore({data: jsonIp1});
		
		dijit.byId("SelectIpData").store = new dojo.data.ItemFileReadStore({data: jsonIp1});
		
		dijit.byId("SelectIpAlerts").store = new dojo.data.ItemFileReadStore({data: jsonIp1});
		
		dijit.byId("SelectName").store = new dojo.data.ItemFileReadStore({data: jsonIp2});
	}catch(e){};
	//	alert("re");
}

var date=0;
var dateNow=0;
var calendarWithHours=true;
var calendarWithMinutes=false;
var fieldId='';


/***********************************************************************/

function calendarTheEnd()
{
	var newDate = "";
	var m = "";
	var d = "";
	var h = "";
	var mn = "";
	
	if( date.getMonth()+1 <10)m = "0";
	if( date.getDate() <10)d = "0";
	if( date.getHours() <10)h = "0";
	if( date.getMinutes() <10)mn = "0";
	
	newDate = date.getFullYear()+"-"+m+(date.getMonth()+1)+"-"+d+date.getDate()+" "+h+date.getHours()+":"+mn+date.getMinutes();
	
	document.getElementById(fieldId).value = newDate;
	document.getElementById(fieldId).onchange();
	
	dijit.byId("dialogCalendar").hide();
	
}

/***********************************************************************/

function calendarClickDate()
{
  if (!calendarWithHours)
		calendarTheEnd();
}

/***********************************************************************/

function calendarFill(date)
{
        var cur_month = date.getMonth();
        var cur_year = date.getYear();
				var isCurrentMonth=false;
				
        cur_year += 1900;
        
        months = new Array ('Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec');
        nbJours = new Array(31,28,31,30,31,30,31,31,30,31,30,31);
        if(cur_year%4 == 0)
        {
                nbJours[1]=29;
        }
        total = nbJours[cur_month];

        var dep_j = new Date(date);
        dep_j.setDate(1);
	
        if(dep_j.getDate()==2)
        {
                dep_j=setDate(0);
        }
        dep_j = dep_j.getDay();
	
	sem = 0;
	nbLigne = 0;

        var selection = '<select onchange="calendarSelectChangeMonth(this.value);">';
        for (i=0; i<12; i++)
        {
        	if(dateNow.getMonth() >= i && dateNow.getYear()+1900==cur_year || dateNow.getYear()+1900!=cur_year)
        	{
            selection += '<option value="'+i+'"';
            if (cur_month == i) selection +=' selected="true"';
            selection += '>' + months[i] +'</option>';
          }
        }
        selection += "</select> ";

				selection += '<select onchange="calendarSelectChangeYear(this.value);">';
				for (i=dateNow.getYear()+1900; i>cur_year-20; i--)
        {
          selection += '<option value="'+i+'"';
          if (cur_year == i) selection +=' selected="true"';
          selection += '>' + i +'</option>';
        }
        selection += "</select>";

				var htmlCalendar = '<tbody id="cal_body"><tr><th><img src="images/leftCalendar.gif" onclick="calendarUpdatePrevMonth()"></th><th colspan="5">'+selection+'</th><th id="nextMonthImg"></th></tr>';
        htmlCalendar += '<tr class="cal_j_semaines"><th>Sun</th><th>Mon</th><th>Tue</th><th>Wed</th><th>Thu</th><th>Fri</th><th>Sat</th></tr>';  

			  if (dep_j)
				  htmlCalendar += '<tr>';

        for(i=1;i<=dep_j;i++)
        {
        				var prev_year=cur_year;
        			  prev_month=cur_month-1; if (prev_month < 0) { prev_month = 11; prev_year=prev_year-1 };
        			  
                htmlCalendar += '<td class="cal_jours_av_ap"  >'+(nbJours[prev_month]-dep_j+i)+'</td>'; //
                sem++;
        }
        for(i=1;i<=total;i++)
        {
                if(sem==0)
                {
                        htmlCalendar += '<tr>';
                }
                if(dateNow.getDate()==i && dateNow.getMonth()==cur_month && dateNow.getYear()+1900==cur_year)
                {
                        htmlCalendar += '<td class="hoverOn" ondblclick="calendarTheEnd();" onclick="calendarToggleCells(this); date.setDate('+i+'); calendarClickDate();">'+i+'</td>';
                        isCurrentMonth=true;
                }
                else
                {
                	if (!isCurrentMonth)
			{
                          htmlCalendar += '<td class="hoverOn ';
			
			  if (date.getDate()==i && date.getMonth()==cur_month && date.getYear()+1900==cur_year)  {	htmlCalendar += 'selection';  }
			  htmlCalendar += '"  ondblclick="calendarTheEnd();" onclick="calendarToggleCells(this); date.setDate('+i+'); calendarClickDate();">'+i+'</td>'; 
				
			}
                  else  htmlCalendar += '<td class="cal_jours_av_ap"  >'+i+'</td>';
                }
                sem++;
                if(sem==7)
                {
                      	htmlCalendar += '</tr>';
                        nbLigne++;

                        sem=0;
                }
        }
        var next_month = cur_month + 1;
        var next_year = cur_year;
        if (next_month > 11) { next_month = 0; next_year ++; }

        for(i=1;sem!=0 || nbLigne<6;i++)
        {
        		    if (!isCurrentMonth)
                  htmlCalendar += '<td class="cal_jours_av_ap"  >'+i+'</td>';
                else
                	htmlCalendar += '<td class="cal_jours_av_ap">'+i+'</td>';
                sem++;
                if(sem==7)
                {
                       htmlCalendar += '</tr>';
                			 nbLigne++;
                       sem=0;
                }
        }

        if (calendarWithHours)
        {
        	htmlCalendar += '<tr><th colspan="6"><select onchange="date.setHours(parseInt(this.value,10)+12*parseInt(document.getElementById(\'selAMPMId\').value,10));">'; 
        	for (i=1; i<=12; i++)
          {
            htmlCalendar += '<option value="'+i+'"';
            if (date.getHours() == i || date.getHours() == i+12) htmlCalendar +=' selected="true"';
            htmlCalendar += '>' + i +'</option>';
          }
          htmlCalendar += '</select>:';
          var minutes="";
          if (date.getMinutes() >= 10)
            minutes=date.getMinutes();
          else minutes="0"+date.getMinutes();
        	if (!calendarWithMinutes)
        	  htmlCalendar+= '<input type="text" value="'+minutes+'" size="2" maxlength="2" disabled/> ';
        	else
        		htmlCalendar+= '<input type="text" value="'+minutes+'" size="2" maxlength="2" onchange="date.setMinutes(this.value);" /> ';

        		
        	htmlCalendar += '<select  id="selAMPMId" onchange="calendarSelectChangeAMPM(this.value);">';
        	htmlCalendar += '<option value="0"';
        	if (date.getHours() <= 11) htmlCalendar +=' selected="true"';
        	htmlCalendar += '>AM</option>';
        	htmlCalendar += '<option value="1"';
       	  if (date.getHours() > 11) htmlCalendar +=' selected="true"';
        	htmlCalendar += '>PM</option>';       	
        	htmlCalendar += '</select>';
        	
        	htmlCalendar += '</th><th>';
        	htmlCalendar += '<input type="image" src="images/ok.gif" onclick="calendarTheEnd()";>';
        	htmlCalendar += '</th></tr>';
        	
        }
      
        document.getElementById('theCalendar').innerHTML = htmlCalendar;
        
        if (!isCurrentMonth)
        	document.getElementById('nextMonthImg').innerHTML= '<img src="images/rightCalendar.gif" onclick="calendarUpdateNextMonth()">';
        	
        	
}

/***********************************************************************/

function calendarToggleCells(el)
{
  rCells=document.getElementById('theCalendar').getElementsByTagName('td');
  for (i = 0; i < rCells.length; i++)
  {
  	var pos=rCells[i].className.indexOf('selection');
    if (pos != -1)
      rCells[i].className=rCells[i].className.substring(0, pos-1);
  }
  el.className+=' selection'
}

/***********************************************************************/

function calendarUpdatePrevMonth()
{
  var newMonth= date.getMonth()-1;
  if (newMonth < 0)
  {
    newMonth=11; 
  	var newYear = date.getYear() - 1 ; 
  	date.setYear( 1900+newYear ); 
  }
  date.setMonth(newMonth);
  calendarFill(date);
}

/***********************************************************************/

function calendarUpdateNextMonth()
{
 if ( ( dateNow.getYear() - date.getYear() >0 ) || (( dateNow.getYear() - date.getYear() == 0) && ( dateNow.getMonth() - date.getMonth() ) > 0))
 {
 	 var newMonth= date.getMonth()+1;
   if (newMonth > 11) { newMonth=0; date.setYear(1900+date.getYear()+1); };
   date.setMonth(newMonth);
   calendarFill(date);
 }
}

/***********************************************************************/

function calendarSelectChangeAMPM(value)
{
	if (value == 0 && date.getHours() > 11)
	  date.setHours(date.getHours()-12)
	if (value == 1 && date.getHours() <= 11)
		  date.setHours(date.getHours()+12)
}

/***********************************************************************/

function calendarSelectChangeMonth(value)
{
	date.setMonth(value);
	calendarFill(date);
}


/***********************************************************************/

function calendarSelectChangeYear(value)
{
	date.setYear(value);
	if (date.getMonth() >= dateNow.getMonth()) date.setMonth(dateNow.getMonth());
	calendarFill(date);
}

/***********************************************************************/

function calendarDisplay(withMinutes,withHours, id)
{
  //alert(id);l
  fieldId = id;
  dateNow = new Date();
  date = new Date();
	
  if( document.getElementById(fieldId).value ){
	
	var val = document.getElementById(fieldId).value;	
	  
	date.setFullYear( parseInt(extractDate(val,'y'),10) );
	date.setMonth( parseInt(extractDate(val,'m'),10) -1);
	date.setDate( parseInt(extractDate(val,'d'),10) );
	date.setHours( parseInt(extractDate(val,'h'),10) );
	date.setMinutes( parseInt(extractDate(val,'mn'),10) );
  }
  
  calendarWithMinutes=withMinutes;
  calendarWithHours=withHours;
	
  date.setSeconds(0);
	if (!calendarWithMinutes)
	  date.setMinutes(0);
	if (!calendarWithHours)
	  date.setHours(0);
	
  var table = document.createElement("table");
  table.setAttribute("cellspacing", 0);
  table.setAttribute("border", 0);
  table.setAttribute("cellspacing", 0);
  table.setAttribute("class", "cal_calendar");
  table.setAttribute("id", "theCalendar");
  document.getElementById('calendarWindow').appendChild(table);

  var tbody = document.createElement("tbody");
  table.appendChild(tbody);


 	calendarFill(date);

  return true;
}

/***********************************************************************/
	
dojo.require("dojox.widget.Calendar");
makeCalendar = function(){
	
	// create a new instance of calendar
	
	dojo.extend(dojo.NodeList, {
		
		addPicker: function(args){
			
			this.forEach(function(n){
				
				var O;
				if(n.id.split("Deb")[1]) O=n.id.split("Deb")[1];
				else O=n.id.split("Fin")[1];
				
				// add an image after the input
				var img;
				if(dojo.hasClass(n, "hasIcon")){
					
					var id = n.id;
					img = dojo.query("img[for='" + id + "']")[0]; 
					
				}else{
					
					// create and place the image. no class="hasIcon" ok. 
					img = dojo.doc.createElement('img');
					
					if( O != "Data")
						dojo.attr(img, {
							src:"/images/calendarDisabled_icon.png", 
							alt:"calendar",
							style:{ cursor:"default" }
						});
					else
						dojo.attr(img, {
							src:"/images/calendar_icon.png", 
							alt:"calendar",
							style:{ cursor:"pointer" }
						});
					
					dojo.place(img, n, "after");
					dojo.attr(n, {Class : "hasIcon"});
					
				}
				
				dojo.connect(img, "onclick", function(e){
					if(!document.getElementById(n.id).disabled){
						
						var O;
						if(n.id.split("Deb")[1]) O=n.id.split("Deb")[1];
						else O=n.id.split("Fin")[1];
							
						if(O != "Data"){
							calendarDisplay(false,document.getElementById("presets"+O).value==2,n.id);
						}else{
							calendarDisplay(true,true,n.id);
						}
						dijit.byId("dialogCalendar").show();
						
					}
				})
				
			});
			return this; 
		}
	});
	
	dojo.query(".datePicker").addPicker();
	
}

dojo.addOnLoad(makeCalendar);

///////////////////////////////////////////////////////////////////////////////////////////////////////  FONCTION DE CONSTRUCTION DU GRAPHE 1  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



 makeChart1= function(){

	var xhr = createXhrObject();
	 
	
	xhr.open("GET",  document.getElementById("globalGraphe1"+ongletActif()).value+"?"+document.getElementById(ongletActif()).getAttribute('params') , true);
	xhr.onreadystatechange=function() 
	{
		if (xhr.readyState == 4) 
		{
			if (xhr.status == 200) 
			{
					
				JsonObj1[ongletActif()] = eval("(" + xhr.responseText + ")");
				
				try{
					
					Chart1[ongletActif()] = new dojox.charting.Chart2D("chart1"+ongletActif());
					//Chart1[ongletActif()].setAttribute("toJson", JsonObj1[ongletActif()])
					
					
					if(JsonObj1[ongletActif()].data[1].legend.length>24){
						// ajout de l'axe x
						Chart1[ongletActif()].addAxis("x", { 
							labels: JsonObj1[ongletActif()].data[1].legend,
							majorTickStep:	2

						});
					}else{
						// ajout de l'axe x
						Chart1[ongletActif()].addAxis("x", {
							labels: JsonObj1[ongletActif()].data[1].legend

						});					
					}
					

					// ajout de l'axe y
					Chart1[ongletActif()].addAxis("y", {vertical:true, fixLower: "minor", fixUpper: "minor", natural: true, tick:{stroke: {color:"blue"}, width: 1}});

					
					// d√©finition des graphes affich√©s
					Chart1[ongletActif()].addPlot("default", {type: "Columns", gap:80/JsonObj1[ongletActif()].data[1].legend.length, hAxis: "x", vAxis: "y"});
					
					

					// ajout du quadrillage
					Chart1[ongletActif()].addPlot("grid", {type: "Grid",
						hAxis: "y",
						vAxis: "x",
						vMajorLines: false,
						vMinorLines:false,
						hMajorLines: true,
						hMinorLines:false
					});
					
					
					
					var up = new Array();
					var down = new Array();
					
					/*try{// ajout automatique des sÈries
						curTab = JsonObj1[ongletActif()].data[2].tab;
						for(var j = 0; j < curTab.length; j++){
							curTab[j].y = -10;
							curTab[j].item = "espacedown"+j;
							curTab[j].color = "#e5e5ff";
							curTab[j].stroke = "#e5e5ff";
							curTab[j].tooltip = "";
							if(down[j] != null)curTab[j].y += down[j];
							down[j] = curTab[j].y ;
						}
						Chart1[ongletActif()].addSeries("espace axe down", curTab, {plot : "default"});
						for(var j = 0; j < curTab.length; j++){
							curTab[j].y = 10;
							curTab[j].item = "espaceup"+j;
							curTab[j].color = "#e5e5ff";
							curTab[j].stroke = "#e5e5ff";
							curTab[j].tooltip = "";
							if(up[j] != null)curTab[j].y += up[j];
							up[j] = curTab[j].y ;
						}
						Chart1[ongletActif()].addSeries("espace axe up", curTab, {plot : "default"});
					}catch(e){
						alert(e);
					}
					alert( JsonObj1[ongletActif()].data[2].tab.length+" ::: "+down.length+" ::: "+up.length)
					*/
					
					// ajout automatique des sÈries
					if(document.getElementById("globalGraphe1"+ongletActif()).value.indexOf("Protocole") == -1){
						var i = 2;
						while(JsonObj1[ongletActif()].data[i] != null){
							if( JsonObj1[ongletActif()].data[i].type ==="IN"){
								curTab = JsonObj1[ongletActif()].data[i].tab;
								for(var j = 0; j < curTab.length; j++){
									curTab[j].y = -curTab[j].y;
									if(down[j] != null)curTab[j].y += down[j];
									down[j] = curTab[j].y ;
								}
								Chart1[ongletActif()].addSeries(JsonObj1[ongletActif()].data[i].name+JsonObj1[ongletActif()].data[i].type, curTab, {plot : "default"});
								i++;
							}else{
								curTab = JsonObj1[ongletActif()].data[i].tab;
								for(var j = 0; j < curTab.length; j++){
									if(up[j] != null)curTab[j].y += up[j];
									up[j] = curTab[j].y ;
								}
								Chart1[ongletActif()].addSeries(JsonObj1[ongletActif()].data[i].name+JsonObj1[ongletActif()].data[i].type, curTab, {plot : "default"});
								i++;
							}
						};
						
					}else{
						try{// ajout automatique des sÈries et des couleurs prÈdÈfinies
						var i = 2;
						var Vcolor = [  '#FFC8A3' , '#61F554' , '#A3C6FF' ];
						while(JsonObj1[ongletActif()].data[i] != null){
							
							if(2<=i && i<=3)var CouleurSerie = Vcolor[0];
							else if(4<=i && i<=5)var CouleurSerie = Vcolor[1];
							else var CouleurSerie = Vcolor[2];
							
							if( JsonObj1[ongletActif()].data[i].type ==="IN"){
								curTab = JsonObj1[ongletActif()].data[i].tab;
								for(var j = 0; j < curTab.length; j++){
									curTab[j].y = -curTab[j].y;
									if(down[j] != null)curTab[j].y += down[j];
									down[j] = curTab[j].y ;
								}
								Chart1[ongletActif()].addSeries(JsonObj1[ongletActif()].data[i].name+JsonObj1[ongletActif()].data[i].type, curTab, {plot : "default", stroke: "black", fill: CouleurSerie});
								i++;
							}else{
								curTab = JsonObj1[ongletActif()].data[i].tab;
								for(var j = 0; j < curTab.length; j++){
									if(up[j] != null)curTab[j].y += up[j];
									up[j] = curTab[j].y ;
								}
								Chart1[ongletActif()].addSeries(JsonObj1[ongletActif()].data[i].name+JsonObj1[ongletActif()].data[i].type, curTab, {plot : "default", stroke: "black", fill: CouleurSerie});
								i++;
							}
						}
						}catch(e){alert(e);}
					}

				
					
					// ajouter l'axe vertical de droite
					addVerticalRightAxis(Chart1[ongletActif()], down, up);
		
					var anim_cE = new dojox.charting.action2d.Tooltip(Chart1[ongletActif()], "default");


						
				
					// dessin du graphe
					Chart1[ongletActif()].render();
					/*try{
					var foo = new dojox.gfx.Surface();
					img = document.createElement("img");
					document.getElementById("BigDiv").appendChild(img);
					img.setAttribute('src', '/images/saveToCSVdisabled.png');
					ESSS = new dojox.gfx.svg.Image(img);
						
						ESSS.shape.height = 200;
						ESSS.shape.width = 200;
						ESSS._setParent(dojo.byId("chart1"+ongletActif()));
					//dojo.byId("chart1"+ongletActif()).appendChild(ESSS);
					}catch(e){alert(e+" : "+e.lineNo);}*/
					
					// graduation minimale du zoom
					addZoomZero(Chart1[ongletActif()]);

					
					mySetTheme(Chart1[ongletActif()]);
					//Chart1[ongletActif()].theme.plotarea.fill.y2;
					

					// Setting zoom-bar	
					dijit.byId("zoomTraffic"+ongletActif()).setAttribute("minimum", Chart1[ongletActif()].getAxis("y").scaler.bounds.lower);
					dijit.byId("zoomTraffic"+ongletActif()).setAttribute("maximum", Chart1[ongletActif()].getAxis("y").scaler.bounds.upper);
					dijit.byId("zoomTraffic"+ongletActif()).setAttribute("value", [Chart1[ongletActif()].getAxis("y").scaler.bounds.lower, Chart1[ongletActif()].getAxis("y").scaler.bounds.upper]);
			
					// changer les labels de l'axe de droite et ajouter les unites au dessus
					changeAxes(Chart1[ongletActif()], "1", JsonObj1[ongletActif()]);
					
					
					// definir le type de curseur quand l'utilisateur pointe sur un 'clickable'
					setCursors("chart1"+ongletActif(), "rect");
					
					
	
					// CrÈation manuelle de la legende
					if(document.getElementById("globalGraphe1"+ongletActif()).value.indexOf("Protocole") != -1){
						// CrÈation manuelle de la legende des protocoles
						creerLegendeProtocole(JsonObj1[ongletActif()], "1", ongletActif(), Vcolor);
					}else{
						// CrÈation manuelle de la legende
						creerLegende(JsonObj1[ongletActif()], "1", ongletActif(), 17);
					}
					
	
					document.getElementById("zoomTraffic"+ongletActif()).style.visibility="visible";
					document.getElementById("legend1"+ongletActif()).style.visibility="visible";
					
					
					
					///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
					// definition des evens click et passage sur graphe
					
									var colors = [];
													
									if(document.getElementById("globalGraphe1"+ongletActif()).value.indexOf("Hosts") != -1){
										Chart1[ongletActif()].connectToPlot( "default", function(evt){
											if(evt.type === "onclick"){
												if(evt.run.data[evt.index].y<0) var sens = "inc";
												else var sens = "out";
												clickToPie(Chart1[ongletActif()].axes.x.labels[evt.index].text, evt.run.data[evt.index].item, "", "", "", sens, false, "dynamic/globalExtHostsTop10HostsTraffic.json", "", "", "");
											};
										});
										setTimeout(function(){Chart1[ongletActif()].connectToPlot( "default",  function(evt){ eventMouse(evt, "1", ongletActif());});},500);
									}else if(document.getElementById("globalGraphe1"+ongletActif()).value.indexOf("Protocoles") != -1){
										Chart1[ongletActif()].connectToPlot( "default", function(evt){
											if(evt.type === "onclick"){
												if(evt.run.data[evt.index].y<0) var sens = "inc";
												else var sens = "out";
												clickToPie(Chart1[ongletActif()].axes.x.labels[evt.index].text, "", "", evt.run.name.slice(0,3), "", sens, true, "dynamic/globalLocHostsProtoTraffic.json", "", "", "");
											};
										})
									}else if(document.getElementById("globalGraphe1"+ongletActif()).value.indexOf("Country") != -1){
										Chart1[ongletActif()].connectToPlot( "default", function(evt){
											if(evt.type === "onclick"){
												if(evt.run.data[evt.index].y<0) var sens = "inc";
												else var sens = "out";
												clickToPie(Chart1[ongletActif()].axes.x.labels[evt.index].text, "", "", "", "", sens, true, "dynamic/globalLocHostsTop10CountryTraffic.json", "", evt.run.data[evt.index].item.split("(")[0], "");
												dijit.byId("SelectCountry").setAttribute( 'value' , evt.run.data[evt.index].item.split("(")[0] );
											};
										});
										setTimeout(function(){Chart1[ongletActif()].connectToPlot( "default",  function(evt){ eventMouse(evt, "1", ongletActif());});},500);
									}else if(document.getElementById("globalGraphe1"+ongletActif()).value.indexOf("as") != -1){
										Chart1[ongletActif()].connectToPlot( "default", function(evt){
											if(evt.type === "onclick"){
												if(evt.run.data[evt.index].y<0) var sens = "inc";
												else var sens = "out";
												clickToPie(Chart1[ongletActif()].axes.x.labels[evt.index].text, "", "", "", "", sens, true, "dynamic/globalLocHostsTop10asTraffic.json", "", "", evt.run.data[evt.index].item.split("(")[1].split(")")[0]);
												dijit.byId("SelectCountry").setAttribute( 'value' , evt.run.data[evt.index].item.split("(")[0] );
											};
										});
										setTimeout(function(){Chart1[ongletActif()].connectToPlot( "default",  function(evt){ eventMouse(evt, "1", ongletActif());});},500);
									}else {}
													
					
					///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
					
					
				}catch(e){
					if(JsonObj1[ongletActif()].errMsg)alert("Json Bug Report: "+JsonObj1[ongletActif()].errMsg);	
					unLoading();
					effacerNone("1",ongletActif());
					var image = document.createElement("img");
					//image.setAttribute( 'style', "height: 300px; width: 800px;" );
					image.setAttribute( 'class', "photo" );
					image.setAttribute( 'src', "images/nodata.png" );
					var div = document.createElement("div");
					div.setAttribute( 'isNone', "true");
					div.setAttribute( 'style', "position: absolute;");
					div.appendChild(image);
					var element = document.getElementById("DivGraphe1"+ongletActif());
					element.insertBefore(div, element.firstChild);
					
					document.getElementById("zoomTraffic"+ongletActif()).style.visibility="hidden";
					document.getElementById("legend1"+ongletActif()).style.visibility="hidden";
					
					
				}
				
			}else {
				unLoading();
				var element = document.getElementById("chart1"+ongletActif());
				if ( element.hasChildNodes() ){
					while ( element.childNodes.length >= 1 ){
						element.removeChild( element.firstChild );       
					} 
				}
				document.getElementById("chart1"+ongletActif()).innerHTML =  "ERROR: no data received ! (Bug report)" ;
				
			}
			
			unLoading();
			
		}
		
	}
	xhr.send(null);
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////  FIN DE FONCTION GRAPHE 1  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////////////////////////////////////////////////  FONCTION DE CONSTRUCTION DU GRAPHE 2  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



makeChart2 = function(){

	var xhr = createXhrObject();

	
	xhr.open("GET",  document.getElementById("globalGraphe2"+ongletActif()).value+"?"+document.getElementById(ongletActif()).getAttribute('params'), true);
	xhr.onreadystatechange=function() 
	{
		if (xhr.readyState == 4) 
		{
			if (xhr.status == 200)
			{
					
				JsonObj2[ongletActif()] = eval("(" + xhr.responseText + ")");
			
				try{
					
					Chart2[ongletActif()] = new dojox.charting.Chart2D("chart2"+ongletActif());
					if(JsonObj2[ongletActif()].data[1].legend.length>24){
						// ajout de l'axe x
						Chart2[ongletActif()].addAxis("x", { 
							labels: JsonObj2[ongletActif()].data[1].legend,
							majorTickStep:	2

						});
					}else{
						// ajout de l'axe x
						Chart2[ongletActif()].addAxis("x", { 
							labels: JsonObj2[ongletActif()].data[1].legend

						});						
					}
		
					

					// d√©finition des graphes affich√©s
					Chart2[ongletActif()].addPlot("default", {type: "Columns", gap:80/JsonObj2[ongletActif()].data[1].legend.length, hAxis: "x", vAxis: "y"});
					

					// ajout de l'axe y
					Chart2[ongletActif()].addAxis("y", {vertical:true, fixLower: "minor", fixUpper: "minor", natural: true});

					
					// ajout du quadrillage
					Chart2[ongletActif()].addPlot("grid", {type: "Grid",
						hAxis: "y",
						vAxis: "x",
						vMajorLines: false,
						vMinorLines:false,
						hMajorLines: true,
						hMinorLines:false
					});
					
								
									
					var up = new Array();
					var down = new Array();
					
					// ajout automatique des sÈries
					if(document.getElementById("globalGraphe2"+ongletActif()).value.indexOf("Protocole") == -1){
						var i = 2;
						while(JsonObj2[ongletActif()].data[i] != null){
							if( JsonObj2[ongletActif()].data[i].type ==="IN"){
								curTab = JsonObj2[ongletActif()].data[i].tab;
								for(var j = 0; j < curTab.length; j++){
									curTab[j].y = -curTab[j].y;
									if(down[j] != null)curTab[j].y += down[j];
									down[j] = curTab[j].y ;
								}
								Chart2[ongletActif()].addSeries(JsonObj2[ongletActif()].data[i].name+JsonObj2[ongletActif()].data[i].type, curTab, {plot : "default"});
								i++;
							}else{
								curTab = JsonObj2[ongletActif()].data[i].tab;
								for(var j = 0; j < curTab.length; j++){
									if(up[j] != null)curTab[j].y += up[j];
									up[j] = curTab[j].y ;
								}
								Chart2[ongletActif()].addSeries(JsonObj2[ongletActif()].data[i].name+JsonObj2[ongletActif()].data[i].type, curTab, {plot : "default"});
								i++;
							}
						};
						
					}else{
						try{// ajout automatique des sÈries et des couleurs prÈdÈfinies
						var i = 2;
						var Vcolor = [  '#FFC8A3' , '#61F554' , '#A3C6FF' ];
						while(JsonObj2[ongletActif()].data[i] != null){
							
							if(2<=i && i<=3)var CouleurSerie = Vcolor[0];
							else if(4<=i && i<=5)var CouleurSerie = Vcolor[1];
							else var CouleurSerie = Vcolor[2];
							
							if( JsonObj2[ongletActif()].data[i].type ==="IN"){
								curTab = JsonObj2[ongletActif()].data[i].tab;
								for(var j = 0; j < curTab.length; j++){
									curTab[j].y = -curTab[j].y;
									if(down[j] != null)curTab[j].y += down[j];
									down[j] = curTab[j].y ;
								}
								Chart2[ongletActif()].addSeries(JsonObj2[ongletActif()].data[i].name+JsonObj2[ongletActif()].data[i].type, curTab, {plot : "default", stroke: "black", fill: CouleurSerie});
								i++;
							}else{
								curTab = JsonObj2[ongletActif()].data[i].tab;
								for(var j = 0; j < curTab.length; j++){
									if(up[j] != null)curTab[j].y += up[j];
									up[j] = curTab[j].y ;
								}
								Chart2[ongletActif()].addSeries(JsonObj2[ongletActif()].data[i].name+JsonObj2[ongletActif()].data[i].type, curTab, {plot : "default", stroke: "black", fill: CouleurSerie});
								i++;
							}
						}
						}catch(e){alert(e);}
					}
					
					
					// ajouter l'axe vertical de droite
					addVerticalRightAxis(Chart2[ongletActif()], down, up);
		
					var anim_cE = new dojox.charting.action2d.Tooltip(Chart2[ongletActif()], "default");
		
					

					
					// dessin du graphe
					Chart2[ongletActif()].render();
					
					
					// graduation minimale du zoom
					addZoomZero(Chart2[ongletActif()]);

					
					mySetTheme(Chart2[ongletActif()]);
					//Chart1[ongletActif()].theme.plotarea.fill.y2;

					// Setting zoom-bar	
					dijit.byId("zoomPackets"+ongletActif()).setAttribute("minimum", Chart2[ongletActif()].getAxis("y").scaler.bounds.lower);
					dijit.byId("zoomPackets"+ongletActif()).setAttribute("maximum", Chart2[ongletActif()].getAxis("y").scaler.bounds.upper);
					dijit.byId("zoomPackets"+ongletActif()).setAttribute("value", [Chart2[ongletActif()].getAxis("y").scaler.bounds.lower, Chart2[ongletActif()].getAxis("y").scaler.bounds.upper]);
				
					
					// changer les labels de l'axe de droite et ajouter les unites au dessus
					changeAxes(Chart2[ongletActif()], "2", JsonObj2[ongletActif()]);
					
					// definir le type de curseur quand l'utilisateur pointe sur un 'clickable'
					setCursors("chart2"+ongletActif(), "rect");
					
					
					
					
					// CrÈation manuelle de la legende
					if(document.getElementById("globalGraphe2"+ongletActif()).value.indexOf("Protocole") != -1){
						// CrÈation manuelle de la legende des protocoles
						creerLegendeProtocole(JsonObj2[ongletActif()], "2", ongletActif(), Vcolor);
					}else{
						// CrÈation manuelle de la legende
						creerLegende(JsonObj2[ongletActif()], "2", ongletActif(), 17);
					}
					
					document.getElementById("zoomPackets"+ongletActif()).style.visibility="visible";
					document.getElementById("legend2"+ongletActif()).style.visibility="visible";
					
					
					
					
					///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
					// definition des evens click et passage sur graphe
					
									var colors = [];
									
									if(document.getElementById("globalGraphe2"+ongletActif()).value.indexOf("Hosts") != -1){
										Chart2[ongletActif()].connectToPlot( "default", function(evt){
											if(evt.type === "onclick"){
												if(evt.run.data[evt.index].y<0) var sens = "inc";
												else var sens = "out";
												clickToPie(Chart2[ongletActif()].axes.x.labels[evt.index].text, evt.run.data[evt.index].item, "", "", "", sens, false, "dynamic/globalExtHostsTop10HostsPackets.json", "", "", "");
											};
										});
										setTimeout(function(){Chart2[ongletActif()].connectToPlot( "default",  function(evt){ eventMouse(evt, "2", ongletActif());});},500);
									}else if(document.getElementById("globalGraphe2"+ongletActif()).value.indexOf("Protocoles") != -1){
										Chart2[ongletActif()].connectToPlot( "default", function(evt){
											if(evt.type === "onclick"){
												if(evt.run.data[evt.index].y<0) var sens = "inc";
												else var sens = "out";
												clickToPie(Chart2[ongletActif()].axes.x.labels[evt.index].text, "", "", evt.run.name.slice(0,3), "", sens, true, "dynamic/globalLocHostsProtoPackets.json", "", "", "");
											};
										})
									}else if(document.getElementById("globalGraphe2"+ongletActif()).value.indexOf("Country") != -1){
										Chart2[ongletActif()].connectToPlot( "default", function(evt){
											if(evt.type === "onclick"){
												if(evt.run.data[evt.index].y<0) var sens = "inc";
												else var sens = "out";
												clickToPie(Chart2[ongletActif()].axes.x.labels[evt.index].text, "", "", "", "", sens, true, "dynamic/globalLocHostsTop10CountryPackets.json", "", evt.run.data[evt.index].item.split("(")[0], "");
												dijit.byId("SelectCountry").setAttribute( 'value' , evt.run.data[evt.index].item.split("(")[0] );
											};
										});
										setTimeout(function(){Chart2[ongletActif()].connectToPlot( "default",  function(evt){ eventMouse(evt, "2", ongletActif());});},500);
									}else if(document.getElementById("globalGraphe2"+ongletActif()).value.indexOf("as") != -1){
										Chart2[ongletActif()].connectToPlot( "default", function(evt){
											if(evt.type === "onclick"){
												if(evt.run.data[evt.index].y<0) var sens = "inc";
												else var sens = "out";
												clickToPie(Chart2[ongletActif()].axes.x.labels[evt.index].text, "", "", "", "", sens, true, "dynamic/globalLocHostsTop10asPackets.json", "", "", evt.run.data[evt.index].item.split("(")[1].split(")")[0]);
												dijit.byId("SelectCountry").setAttribute( 'value' , evt.run.data[evt.index].item.split("(")[0] );
											};
										});
										setTimeout(function(){Chart2[ongletActif()].connectToPlot( "default",  function(evt){ eventMouse(evt, "2", ongletActif());});},500);
									}else {}
										
					
		
					///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
				
					
						
				}catch(e){
					unLoading();
					effacerNone("2",ongletActif());
					var image = document.createElement("img");
					//image.setAttribute( 'style', "height: 300px; width: 800px;" );
					image.setAttribute( 'class', "photo" );
					image.setAttribute( 'src', "images/nodata.png" );
					var div = document.createElement("div");
					div.setAttribute( 'isNone', "true");
					div.setAttribute( 'style', "position: absolute;");
					div.appendChild(image);
					var element = document.getElementById("DivGraphe2"+ongletActif());
					element.insertBefore(div, element.firstChild);
					
					document.getElementById("zoomPackets"+ongletActif()).style.visibility="hidden";
					document.getElementById("legend2"+ongletActif()).style.visibility="hidden";
					
					
				}
				
			}else {
				if(JsonObj2[ongletActif()].errMsg)alert("Json Bug Report: "+JsonObj2[ongletActif()].errMsg);	
				unLoading();
				var element = document.getElementById("chart2"+ongletActif());
				if ( element.hasChildNodes() ){
					while ( element.childNodes.length >= 1 ){
						element.removeChild( element.firstChild );       
					} 
				}
				document.getElementById("chart2"+ongletActif()).innerHTML =  "ERROR: no data received ! (Bug report)" ;
			}
			
		
			unLoading();
		
		}
		
	}
	xhr.send(null);

};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////  FIN DE FONCTION GRAPHE 2  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	

///////////////////////////////////////////////////////////////////////////////////////////////////////  FONCTION DE CONSTRUCTION DU GRAPHE 3  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

makeChart3 = function(){

	var xhr = createXhrObject();

	
	xhr.open("GET",  document.getElementById("globalGraphe3"+ongletActif()).value+"?"+document.getElementById(ongletActif()).getAttribute('params')+"&service=loc", true);
	xhr.onreadystatechange=function() 
	{
		if (xhr.readyState == 4) 
		{
			if (xhr.status == 200) 
			{
					
				JsonObj3[ongletActif()] = eval("(" + xhr.responseText + ")");
			
				try{
					
					Chart3[ongletActif()] = new dojox.charting.Chart2D("chart3"+ongletActif());
					if(JsonObj3[ongletActif()].data[1].legend.length>24){
						// ajout de l'axe x
						Chart3[ongletActif()].addAxis("x", { 
							labels: JsonObj3[ongletActif()].data[1].legend,
							majorTickStep:	2

						});
					}else{
						// ajout de l'axe x
						Chart3[ongletActif()].addAxis("x", { 
							labels: JsonObj3[ongletActif()].data[1].legend

						});						
					}
		
					
					// d√©finition des graphes affich√©s
					Chart3[ongletActif()].addPlot("default", {type: "Columns", gap:80/JsonObj3[ongletActif()].data[1].legend.length, hAxis: "x", vAxis: "y"});
				

					// ajout de l'axe y
					Chart3[ongletActif()].addAxis("y", {vertical:true, fixLower: "minor", fixUpper: "minor", natural: true});

					
					// ajout du quadrillage
					Chart3[ongletActif()].addPlot("grid", {type: "Grid",
						hAxis: "y",
						vAxis: "x",
						vMajorLines: false,
						vMinorLines:false,
						hMajorLines: true,
						hMinorLines:false
					});
					
					
					
					var up = new Array();
					var down = new Array();
					
					
					// ajout automatique des sÈries
					try{
						var i = 2;
						while(JsonObj3[ongletActif()].data[i] != null){
							if( JsonObj3[ongletActif()].data[i].type ==="IN"){
								curTab = JsonObj3[ongletActif()].data[i].tab;
								for(var j = 0; j < curTab.length; j++){
									curTab[j].y = -curTab[j].y;
									if(down[j] != null)curTab[j].y += down[j];
									down[j] = curTab[j].y ;
								}
								Chart3[ongletActif()].addSeries(JsonObj3[ongletActif()].data[i].name+JsonObj3[ongletActif()].data[i].type, curTab, {plot : "default"});
								i++;
							}else{
								curTab = JsonObj3[ongletActif()].data[i].tab;
								for(var j = 0; j < curTab.length; j++){
									if(up[j] != null)curTab[j].y += up[j];
									up[j] = curTab[j].y ;
								}
								Chart3[ongletActif()].addSeries(JsonObj3[ongletActif()].data[i].name+JsonObj3[ongletActif()].data[i].type, curTab, {plot : "default"});
								i++;
							}
						};
						
					}catch(e){alert(e);}
					

					// ajouter l'axe vertical de droite
					addVerticalRightAxis(Chart3[ongletActif()], down, up);
									
		
					var anim_cE = new dojox.charting.action2d.Tooltip(Chart3[ongletActif()], "default");
		
					

					
					
					// dessin du graphe
					Chart3[ongletActif()].render();
					
					
					// graduation minimale du zoom
					addZoomZero(Chart3[ongletActif()]);

					
					mySetTheme(Chart3[ongletActif()]);
					//Chart1[ongletActif()].theme.plotarea.fill.y2;
					

					// Setting zoom-bar	
					dijit.byId("zoomLoc"+ongletActif()).setAttribute("minimum", Chart3[ongletActif()].getAxis("y").scaler.bounds.lower);
					dijit.byId("zoomLoc"+ongletActif()).setAttribute("maximum", Chart3[ongletActif()].getAxis("y").scaler.bounds.upper);
					dijit.byId("zoomLoc"+ongletActif()).setAttribute("value", [Chart3[ongletActif()].getAxis("y").scaler.bounds.lower, Chart3[ongletActif()].getAxis("y").scaler.bounds.upper]);
				
					
					// changer les labels de l'axe de droite et ajouter les unites au dessus
					changeAxes(Chart3[ongletActif()], "3", JsonObj3[ongletActif()]);
					
					// definir le type de curseur quand l'utilisateur pointe sur un 'clickable'
					setCursors("chart3"+ongletActif(), "rect");
					
					
					
		
					// CrÈation manuelle de la legende
					if(document.getElementById("globalGraphe3"+ongletActif()).value.indexOf("Protocole") != -1){
						// CrÈation manuelle de la legende des protocoles
						creerLegendeProtocole(JsonObj3[ongletActif()], "3", ongletActif(), Vcolor);
					}else{
						// CrÈation manuelle de la legende
						creerLegende(JsonObj3[ongletActif()], "3", ongletActif(), 17);
					}
					
					document.getElementById("zoomLoc"+ongletActif()).style.visibility="visible";
					document.getElementById("legend3"+ongletActif()).style.visibility="visible";
					
					
					
					
					///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
					// definition des evens click et passage sur graphe
							
									//definition du type du graphe des services : "packets" ou "traffic"
									var PACorTRAF = "";
									if(document.getElementById("globalGraphe3"+ongletActif()).value.indexOf("Packets") != -1) PACorTRAF = "Packets";
									else if(document.getElementById("globalGraphe3"+ongletActif()).value.indexOf("Traffic") != -1) PACorTRAF = "Traffic";
									else alert( "can't find string 'Packets' or 'Traffic'" );
									
									var colors = [];
									if(document.getElementById("globalGraphe3"+ongletActif()).value.indexOf("Protocole") == -1){
										if(document.getElementById("globalGraphe3"+ongletActif()).value.indexOf("Country") == -1){
											Chart3[ongletActif()].connectToPlot( "default", function(evt){
												// click
												if(evt.type === "onclick"){
													if(evt.run.data[evt.index].y<0) var sens = "inc";
													else var sens = "out";
													//setPlusTab(chart1.axes.x.labels[evt.index].text,evt.run.data[evt.index].item);
													//setPlusTabProto(chart1.axes.x.labels[evt.index].text, "");
													if(evt.run.data[evt.index].tooltip.split("(").length == 3)
														clickToPie(Chart3[ongletActif()].axes.x.labels[evt.index].text, "", parseInt(evt.run.data[evt.index].item), evt.run.data[evt.index].item.split("/")[1].slice(0,3), "<", sens, true, "dynamic/globalLocHostsService"+PACorTRAF+".json", "loc", "", "");
													else if(evt.run.data[evt.index].tooltip.split("(").length == 2)
														clickToPie(Chart3[ongletActif()].axes.x.labels[evt.index].text, "", parseInt(evt.run.data[evt.index].item), evt.run.data[evt.index].item.split("/")[1].slice(0,3), "<", sens, true, "dynamic/globalLocHostsService"+PACorTRAF+".json", "loc", "", "");
													else alert("errata in index.js line: 247");
													
													//ChangerOnglet("Plus");
													//ChangerDiv("DivPlus");
												};
											})
										}else{
											Chart3[ongletActif()].connectToPlot( "default", function(evt){
												// click
												if(evt.type === "onclick"){
													dijit.byId("SelectCountry").setAttribute( 'value' , evt.run.data[evt.index].item.split("(")[0] );
													
													animatePlusTab();
													
												};
											})
										}
										setTimeout(function(){Chart3[ongletActif()].connectToPlot( "default",  function(evt){ eventMouse(evt, "3", ongletActif());});},500);
									}
										
									
						
					///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
									
									
					
					
					
					
				}catch(e){
					if(JsonObj3[ongletActif()].errMsg)alert("Json Bug Report: "+JsonObj3[ongletActif()].errMsg);	
					unLoading();
					effacerNone("3",ongletActif());
					var image = document.createElement("img");
					//image.setAttribute( 'style', "height: 300px; width: 800px;" );
					image.setAttribute( 'class', "photo" );
					image.setAttribute( 'src', "images/nodata.png" );
					var div = document.createElement("div");
					div.setAttribute( 'isNone', "true");
					div.setAttribute( 'style', "position: absolute;");
					div.appendChild(image);
					var element = document.getElementById("DivGraphe3"+ongletActif());
					element.insertBefore(div, element.firstChild);
					
					document.getElementById("zoomLoc"+ongletActif()).style.visibility="hidden";
					document.getElementById("legend3"+ongletActif()).style.visibility="hidden";
					
					
				}
				
			}else {
				unLoading();
				var element = document.getElementById("chart3"+ongletActif());
				if ( element.hasChildNodes() ){
					while ( element.childNodes.length >= 1 ){
						element.removeChild( element.firstChild );       
					} 
				}
				document.getElementById("chart3"+ongletActif()).innerHTML =  "ERROR: no data received ! (Bug report)" ;
			}
			
			unLoading();
		
		}
		
	}
	xhr.send(null);

};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////  FIN DE FONCTION GRAPHE 3  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	

///////////////////////////////////////////////////////////////////////////////////////////////////////  FONCTION DE CONSTRUCTION DU GRAPHE 4  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

makeChart4 = function(){

	var xhr = createXhrObject();
	
	
	xhr.open("GET",  document.getElementById("globalGraphe4"+ongletActif()).value+"?"+document.getElementById(ongletActif()).getAttribute('params')+"&service=ext", true);
	xhr.onreadystatechange=function() 
	{
		if (xhr.readyState == 4) 
		{
			if (xhr.status == 200) 
			{
					
				JsonObj4[ongletActif()] = eval("(" + xhr.responseText + ")");
				
				try{
					
					Chart4[ongletActif()] = new dojox.charting.Chart2D("chart4"+ongletActif());
					if(JsonObj4[ongletActif()].data[1].legend.length>24){
						// ajout de l'axe x
						Chart4[ongletActif()].addAxis("x", { 
							labels: JsonObj4[ongletActif()].data[1].legend,
							majorTickStep:	2

						});
					}else{
						// ajout de l'axe x
						Chart4[ongletActif()].addAxis("x", { 
							labels: JsonObj4[ongletActif()].data[1].legend

						});						
					}
		
					

					// d√©finition des graphes affich√©s
					Chart4[ongletActif()].addPlot("default", {type: "Columns", gap:80/JsonObj4[ongletActif()].data[1].legend.length, hAxis: "x", vAxis: "y"});
				

					// ajout de l'axe y
					Chart4[ongletActif()].addAxis("y", {vertical:true, fixLower: "minor", fixUpper: "minor", natural: true});

					
					// ajout du quadrillage
					Chart4[ongletActif()].addPlot("grid", {type: "Grid",
						hAxis: "y",
						vAxis: "x",
						vMajorLines: false,
						vMinorLines:false,
						hMajorLines: true,
						hMinorLines:false
					});
					
					
						
					var up = new Array();
					var down = new Array();
					
						
					try{
						var i = 2;
						while(JsonObj4[ongletActif()].data[i] != null){
							if( JsonObj4[ongletActif()].data[i].type ==="IN"){
								curTab = JsonObj4[ongletActif()].data[i].tab;
								for(var j = 0; j < curTab.length; j++){
									curTab[j].y = -curTab[j].y;
									if(down[j] != null)curTab[j].y += down[j];
									down[j] = curTab[j].y ;
								}
								Chart4[ongletActif()].addSeries(JsonObj4[ongletActif()].data[i].name+JsonObj4[ongletActif()].data[i].type, curTab, {plot : "default"});
								i++;
							}else{
								curTab = JsonObj4[ongletActif()].data[i].tab;
								for(var j = 0; j < curTab.length; j++){
									if(up[j] != null)curTab[j].y += up[j];
									up[j] = curTab[j].y ;
								}
								Chart4[ongletActif()].addSeries(JsonObj4[ongletActif()].data[i].name+JsonObj4[ongletActif()].data[i].type, curTab, {plot : "default"});
								i++;
							}
						}
					}catch(e){alert(e);}
					
					
					
					// ajouter l'axe vertical de droite
					addVerticalRightAxis(Chart4[ongletActif()], down, up);
					
		
					var anim_cE = new dojox.charting.action2d.Tooltip(Chart4[ongletActif()], "default");
		
					

					
					// dessin du graphe
					Chart4[ongletActif()].render();
					
					
					// graduation minimale du zoom
					addZoomZero(Chart4[ongletActif()]);

					
					mySetTheme(Chart4[ongletActif()]);
					//Chart1[ongletActif()].theme.plotarea.fill.y2;
					

					// Setting zoom-bar	
					dijit.byId("zoomExt"+ongletActif()).setAttribute("minimum", Chart4[ongletActif()].getAxis("y").scaler.bounds.lower);
					dijit.byId("zoomExt"+ongletActif()).setAttribute("maximum", Chart4[ongletActif()].getAxis("y").scaler.bounds.upper);
					dijit.byId("zoomExt"+ongletActif()).setAttribute("value", [Chart4[ongletActif()].getAxis("y").scaler.bounds.lower, Chart4[ongletActif()].getAxis("y").scaler.bounds.upper]);
				
					
					// changer les labels de l'axe de droite et ajouter les unites au dessus
					changeAxes(Chart4[ongletActif()], "4", JsonObj4[ongletActif()]);
					
					// definir le type de curseur quand l'utilisateur pointe sur un 'clickable'
					setCursors("chart4"+ongletActif(), "rect");
					
					
		
					// CrÈation manuelle de la legende
					if(document.getElementById("globalGraphe4"+ongletActif()).value.indexOf("Protocole") != -1){
						// CrÈation manuelle de la legende des protocoles
						creerLegendeProtocole(JsonObj4[ongletActif()], "4", ongletActif(), Vcolor);
					}else{
						// CrÈation manuelle de la legende
						creerLegende(JsonObj4[ongletActif()], "4", ongletActif(), 17);
					}
					
					document.getElementById("zoomExt"+ongletActif()).style.visibility="visible";
					document.getElementById("legend4"+ongletActif()).style.visibility="visible";
					
					
					
					///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
					// definition des evens click et passage sur graphe
							
									//definition du type du graphe des services : "packets" ou "traffic"
									var PACorTRAF = "";
									if(document.getElementById("globalGraphe4"+ongletActif()).value.indexOf("Packets") != -1) PACorTRAF = "Packets";
									else if(document.getElementById("globalGraphe4"+ongletActif()).value.indexOf("Traffic") != -1) PACorTRAF = "Traffic";
									else alert( "can't find string 'Packets' or 'Traffic'" );
													
									var colors = [];
									if(document.getElementById("globalGraphe4"+ongletActif()).value.indexOf("Protocole") == -1){
										if(document.getElementById("globalGraphe4"+ongletActif()).value.indexOf("Country") == -1){
											Chart4[ongletActif()].connectToPlot( "default", function(evt){
												// click
												if(evt.type === "onclick"){
													if(evt.run.data[evt.index].y<0) var sens = "inc";
													else var sens = "out";
													//setPlusTab(chart1.axes.x.labels[evt.index].text,evt.run.data[evt.index].item);
													//setPlusTabProto(chart1.axes.x.labels[evt.index].text, "");
													if(evt.run.data[evt.index].tooltip.split("(").length == 3)
														clickToPie(Chart4[ongletActif()].axes.x.labels[evt.index].text, "", parseInt(evt.run.data[evt.index].item), evt.run.data[evt.index].item.split("/")[1].slice(0,3), ">", sens, true, "dynamic/globalLocHostsService"+PACorTRAF+".json", "ext", "", "");
													else if(evt.run.data[evt.index].tooltip.split("(").length == 2)
														clickToPie(Chart4[ongletActif()].axes.x.labels[evt.index].text, "", parseInt(evt.run.data[evt.index].item), evt.run.data[evt.index].item.split("/")[1].slice(0,3), ">", sens, true, "dynamic/globalLocHostsService"+PACorTRAF+".json", "ext", "", "");
													else alert("errata in index.js line: 247");
													
													//ChangerOnglet("Plus");
													//ChangerDiv("DivPlus");
												};
											})
										}else{
											Chart4[ongletActif()].connectToPlot( "default", function(evt){
												// click
												if(evt.type === "onclick"){
													dijit.byId("SelectCountry").setAttribute( 'value' , evt.run.data[evt.index].item.split("(")[0] );
													
													animatePlusTab();
												};
											})
										}
										setTimeout(function(){Chart4[ongletActif()].connectToPlot( "default",  function(evt){ eventMouse(evt, "4", ongletActif());});},500);
									}
										
					///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
									
					
					
					
					
					
				}catch(e){
					if(JsonObj4[ongletActif()].errMsg)alert("Json Bug Report: "+JsonObj4[ongletActif()].errMsg);	
					unLoading();
					effacerNone("4",ongletActif());
					var image = document.createElement("img");
					//image.setAttribute( 'style', "height: 300px; width: 800px;" );
					image.setAttribute( 'class', "photo" );
					image.setAttribute( 'src', "images/nodata.png" );
					var div = document.createElement("div");
					div.setAttribute( 'isNone', "true");
					div.setAttribute( 'style', "position: absolute;");
					div.appendChild(image);
					var element = document.getElementById("DivGraphe4"+ongletActif());
					element.insertBefore(div, element.firstChild);
					
					document.getElementById("zoomExt"+ongletActif()).style.visibility="hidden";
					document.getElementById("legend4"+ongletActif()).style.visibility="hidden";
					
					
				}
				
			}else {
				unLoading();
				var element = document.getElementById("chart4"+ongletActif());
				if ( element.hasChildNodes() ){
					while ( element.childNodes.length >= 1 ){
						element.removeChild( element.firstChild );       
					} 
				}
				document.getElementById("chart4"+ongletActif()).innerHTML =  "ERROR: no data received ! (Bug report)" ;
			}
			
			unLoading();
		
		}
		
	}
	xhr.send(null);

};



////////////////////////////////////////////////////////////////////////////////////////////////////////////////  FIN DE FONCTION GRAPHE 4  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	

///////////////////////////////////////////////////////////////////////////////////////////////////////  FONCTION DE CONSTRUCTION DU GRAPHE 5  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////




makeChart5 = function(){

	var xhr = createXhrObject();

	
	xhr.open("GET", "dynamic/globalTop10NbExtHosts.json?"+document.getElementById(ongletActif()).getAttribute('params'), true);
	xhr.onreadystatechange=function() 
	{
		if (xhr.readyState == 4) 
		{
			if (xhr.status == 200) 
			{
					
				JsonObj5[ongletActif()] = eval("(" + xhr.responseText + ")");
				
				try{
					
					Chart5[ongletActif()] = new dojox.charting.Chart2D("chart5"+ongletActif());
					
					Chart5[ongletActif()].setTheme( new dojox.charting.Theme({
										axis:{
											majorTick: {color: "#777", width: .5, length: 6},
											minorTick: {color: "#777", width: .5, length: 3}
										}	
									})
					);
				
					// d√©finition des graphes affich√©s
					Chart5[ongletActif()].addPlot("default", {type: "Columns", gap:80/JsonObj5[ongletActif()].data[1].legend.length});
					
					
					// ajout de l'axe x
					if(JsonObj5[ongletActif()].data[1].legend.length>24){
						Chart5[ongletActif()].addAxis("x", { 
							labels: JsonObj5[ongletActif()].data[1].legend,
							majorTickStep:	2

						});
					}else{
						Chart5[ongletActif()].addAxis("x", { 
							labels: JsonObj5[ongletActif()].data[1].legend

						});
					}
					
					// ajout de l'axe y
					Chart5[ongletActif()].addAxis("y", {vertical:true, fixLower: "minor", fixUpper: "minor", natural: true});

						
					// ajout du quadrillage
					Chart5[ongletActif()].addPlot("grid", {type: "Grid",
						hAxis: "y",
						vAxis: "x",
						vMajorLines: false,
						vMinorLines:false,
						hMajorLines: true,
						hMinorLines:false
					});
					
					
					
					// ajout automatique des sÈries	
					var up = new Array();
					
						
					try{
						var i = 2;
						while(JsonObj5[ongletActif()].data[i] != null){
								curTab = JsonObj5[ongletActif()].data[i].tab;
								for(var j = 0; j < curTab.length; j++){
									if(up[j] != null)curTab[j].y += up[j];
									up[j] = curTab[j].y ;
								}
								Chart5[ongletActif()].addSeries(JsonObj5[ongletActif()].data[i].name+JsonObj5[ongletActif()].data[i].type, curTab, {plot : "default"});
								i++;
						}
					}catch(e){alert(e);}
					
					
					
					// ajout automatique des sÈries
					var i = 2;
					while(JsonObj5[ongletActif()].data[i] != null){
						Chart5[ongletActif()].addSeries(JsonObj5[ongletActif()].data[i].name,  JsonObj5[ongletActif()].data[i].tab,{plot : "default"});
						i++;
					};
					
					
					
		
					var anim_c = new dojox.charting.action2d.Tooltip(Chart5[ongletActif()], "default");

					
					
					// dessin du graphe
					Chart5[ongletActif()].render();
					
					
					
					// graduation minimale du zoom
					addZoomZero(Chart5[ongletActif()]);

					
					// Setting zoom-bar	
					dijit.byId("zoomNb"+ongletActif()).setAttribute("minimum", Chart5[ongletActif()].getAxis("y").scaler.bounds.lower);
					dijit.byId("zoomNb"+ongletActif()).setAttribute("maximum", Chart5[ongletActif()].getAxis("y").scaler.bounds.upper);
					dijit.byId("zoomNb"+ongletActif()).setAttribute("value", [Chart5[ongletActif()].getAxis("y").scaler.bounds.lower, Chart5[ongletActif()].getAxis("y").scaler.bounds.upper]);
				
					
					
					// definir le type de curseur quand l'utilisateur pointe sur un 'clickable'
					setCursors("chart5"+ongletActif(), "rect");
					
					// legende des ordonnÈes
					try{
						document.getElementById("unit5"+ongletActif()).removeChild( document.getElementById("unit5"+ongletActif()).firstChild );     
					}catch(e){}  
					if(JsonObj5[ongletActif()].data[0].unit){
					var text = document.createTextNode(JsonObj5[ongletActif()].data[0].unit);
					document.getElementById("unit5"+ongletActif()).appendChild(text);
					}
		
					
					
					// CrÈation manuelle de la legende
					creerLegende(JsonObj5[ongletActif()], "5", ongletActif(), 17);
					
					
					document.getElementById("zoomNb"+ongletActif()).style.visibility="visible";
					document.getElementById("legend5"+ongletActif()).style.visibility="visible";
					
					
					
									///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
									// definition des evens click et passage sur graphe
									Chart5[ongletActif()].connectToPlot( "default", function(evt){
												// click
												if(evt.type === "onclick"){
													setPlusTab(Chart5[ongletActif()].axes.x.labels[evt.index].text, "", ongletActif());
													setPlusTabProto(Chart5[ongletActif()].axes.x.labels[evt.index].text, "");
													//document.getElementById("ipext").value = ipFrom(evt.run.data[evt.index].item);
													//alert(ipFrom(evt.run.data[evt.index].item));
													dijit.byId("SelectIp").setAttribute( 'value' , ipFrom(evt.run.data[evt.index].item));
													/*dijit.byId("SelectIp").value = ipFrom(evt.run.data[evt.index].item) ;
													dijit.byId("SelectIp").onChange();*/
													
													animatePlusTab();
												};
											});
									setTimeout(function(){Chart5[ongletActif()].connectToPlot( "default",  function(evt){ eventMouse(evt, "5", ongletActif());});},500);
							

					
					
				}catch(e){

					if(JsonObj5[ongletActif()].errMsg)alert("Json Bug Report: "+JsonObj5[ongletActif()].errMsg);	
					unLoading();
					effacerNone("5",ongletActif());
					var image = document.createElement("img");
					//image.setAttribute( 'style', "height: 300px; width: 800px;" );
					image.setAttribute( 'class', "photo" );
					image.setAttribute( 'src', "images/nodata.png" );
					var div = document.createElement("div");
					div.setAttribute( 'isNone', "true");
					div.setAttribute( 'style', "position: absolute;");
					div.appendChild(image);
					var element = document.getElementById("DivGraphe5"+ongletActif());
					element.insertBefore(div, element.firstChild);
					
					document.getElementById("zoomNb"+ongletActif()).style.visibility="hidden";
					document.getElementById("legend5"+ongletActif()).style.visibility="hidden";
					
					
				}
				
			}else {
				unLoading();
				var element = document.getElementById("chart5"+ongletActif());
				if ( element.hasChildNodes() ){
					while ( element.childNodes.length >= 1 ){
						element.removeChild( element.firstChild );       
					} 
				}
				document.getElementById("chart5"+ongletActif()).innerHTML =  "ERROR: no data received ! (Bug report)" ;
			}
			
			unLoading();
		
		}
		
	}
	xhr.send(null);
	
}




////////////////////////////////////////////////////////////////////////////////////////////////////////////////  FIN DE FONCTION GRAPHE 5  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////////////////////////////////////////////////  FONCTION DE CONSTRUCTION DU GRAPHE 6  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


makeChart6 = function(){

	var xhr = createXhrObject();

	
	xhr.open("GET", "dynamic/globalNbExternalHosts.json?"+document.getElementById(ongletActif()).getAttribute('params'), true);
	xhr.onreadystatechange=function() 
	{
		if (xhr.readyState == 4) 
		{
			if (xhr.status == 200) 
			{
					
				JsonObj6 = eval("(" + xhr.responseText + ")");
				
				try{
					
					chart6 = new dojox.charting.Chart2D("chart6"+ongletActif());
					
					dojox.charting.themes.PlotKit.green.chart.fill = dojox.charting.themes.PlotKit.green.plotarea.fill = "#fff";
					dojox.charting.themes.PlotKit.green.axis.stroke.color = "#999";
					dojox.charting.themes.PlotKit.green.axis.majorTick.color = "#777";
					dojox.charting.themes.PlotKit.green.axis.minorTick.color = "#777";
					chart6.setTheme(dojox.charting.themes.PlotKit.green);
		
					chart6.addPlot("default", {type: "Default", lines: true, markers: true, tension:3});
					if(JsonObj6.data[1].legend.length>24){
						chart6.addAxis("x", { labels: JsonObj6.data[1].legend, majorTickStep:2, majorTick: {stroke: "black", length: 3}, minorTick: {stroke: "gray", length: 3}});
					}else{
						chart6.addAxis("x", { labels: JsonObj6.data[1].legend, majorTick: {stroke: "black", length: 3}, minorTick: {stroke: "gray", length: 3}});
					}	
					chart6.addAxis("y", {vertical: true, majorTick: {stroke: "black", length: 3}, minorTick: {stroke: "gray", length: 3}, min: 0, max: ( JsonObj6.data[0].max*1.05 )});
					chart6.addSeries(JsonObj6.data[2].name,  JsonObj6.data[2].tab);
					//chart6.addSeries(JsonObj6.data[3].type,  JsonObj6.data[3].tab);

					var anim_aE = new dojox.charting.action2d.Magnify(chart6, "default");
					var anim_cE = new dojox.charting.action2d.Tooltip(chart6, "default");
					
					chart6.render();

					
					// legende des ordonnÈes
					try{
						document.getElementById("unit6"+ongletActif()).removeChild( document.getElementById("unit6"+ongletActif()).firstChild );  
					}catch(e){}
					if(JsonObj6.data[0].unit){
					var text = document.createTextNode(JsonObj6.data[0].unit);
					document.getElementById("unit6"+ongletActif()).appendChild(text);
					}
		
					
					
					//Legende
					/*try{
						var legend6 = new dojox.charting.widget.Legend({chart: chart6, horizontal: false}, "legend6Tab"+ongletActif());
					}catch(e){}
					
					document.getElementById("legend6"+ongletActif()).style.visibility="visible";*/
						
						
					///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
					// definition des evens click et passage sur graphe
					chart6.connectToPlot( "default", function(evt){
						// click
						if(evt.type === "onclick"){
							setPlusTab(chart6.axes.x.labels[evt.index].text, "", ongletActif());
							setPlusTabProto(chart6.axes.x.labels[evt.index].text, "");
							animatePlusTab();
						};
					});	
					
				}catch(e){
					if(JsonObj6.errMsg)alert("Json Bug Report: "+JsonObj6.errMsg);	
					unLoading();
					effacerNone("6",ongletActif());
					var image = document.createElement("img");
					//image.setAttribute( 'style', "height: 300px; width: 800px;" );
					image.setAttribute( 'class', "photo" );
					image.setAttribute( 'src', "images/nodataS.png" );
					var div = document.createElement("div");
					div.setAttribute( 'isNone', "true");
					div.setAttribute( 'style', "position: absolute;");
					div.appendChild(image);
					var element = document.getElementById("DivGraphe6"+ongletActif());
					element.insertBefore(div, element.firstChild);
					
					document.getElementById("legend6"+ongletActif()).style.visibility="hidden";
					
					
				}
				
			}else{
				unLoading();
				var element = document.getElementById("chart6"+ongletActif());
				if ( element.hasChildNodes() ){
					while ( element.childNodes.length >= 1 ){
						element.removeChild( element.firstChild );       
					} 
				}
				document.getElementById("chart6"+ongletActif()).innerHTML =  "ERROR: no data received ! (Bug report)" ;
			}
			
			unLoading();
		
		}
		
	}
	xhr.send(null);
	
}




////////////////////////////////////////////////////////////////////////////////////////////////////////////////  FIN DE FONCTION GRAPHE 6  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////////////////////////////////////////////////  FONCTION DE CONSTRUCTION DU GRAPHE 7  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


makeChart7 = function(){

	var xhr = createXhrObject();
	
	
	xhr.open("GET", "dynamic/globalNbLocalHosts.json?"+document.getElementById(ongletActif()).getAttribute('params'), true);
	xhr.onreadystatechange=function() 
	{
		if (xhr.readyState == 4) 
		{
			if (xhr.status == 200) 
			{
					
				JsonObj7 = eval("(" + xhr.responseText + ")");
				
				try{
					
					dojox.charting.themes.PlotKit.green.chart.fill = dojox.charting.themes.PlotKit.green.plotarea.fill = "#fff";
					dojox.charting.themes.PlotKit.green.axis.stroke.color = "#999";
					dojox.charting.themes.PlotKit.green.axis.majorTick.color = "#777";
					dojox.charting.themes.PlotKit.green.axis.minorTick.color = "#777";
					dojox.charting.themes.PlotKit.green.axis.tick.fontColor = "#000";
					chart7 = new dojox.charting.Chart2D("chart7"+ongletActif());
					
					chart7.setTheme(dojox.charting.themes.PlotKit.green);
		
					chart7.addPlot("default", {type: "Default", lines: true, markers: true, tension:3});
					if(JsonObj7.data[1].legend.length>24){
						chart7.addAxis("x", { labels: JsonObj7.data[1].legend, majorTickStep:2, majorTick: {stroke: "black", length: 3}, minorTick: {stroke: "gray", length: 3}});
					}else{
						chart7.addAxis("x", { labels: JsonObj7.data[1].legend, majorTick: {stroke: "black", length: 3}, minorTick: {stroke: "gray", length: 3}});
					}	
					chart7.addAxis("y", {vertical: true, majorTick: {stroke: "black", length: 3}, minorTick: {stroke: "gray", length: 3}, min: 0, max: ( JsonObj7.data[0].max*1.05 )});
					chart7.addSeries(JsonObj7.data[2].name,  JsonObj7.data[2].tab);
					//chart7.addSeries(JsonObj7.data[3].type,  JsonObj7.data[3].tab);

					var anim_aE = new dojox.charting.action2d.Magnify(chart7, "default");
					var anim_cE = new dojox.charting.action2d.Tooltip(chart7, "default");
					
					chart7.render();
					
					
					// legende des ordonnÈes
					try{
						document.getElementById("unit7"+ongletActif()).removeChild( document.getElementById("unit7"+ongletActif()).firstChild );  
					}catch(e){}
					if(JsonObj7.data[0].unit){
					var text = document.createTextNode(JsonObj7.data[0].unit);
					document.getElementById("unit7"+ongletActif()).appendChild(text);
					}
		
					
					
					//Legende
					/*try{
						var legend7 = new dojox.charting.widget.Legend({chart: chart7, horizontal: false}, "legend7Tab"+ongletActif());
					}catch(e){}
					
					document.getElementById("legend7"+ongletActif()).style.visibility="visible";*/
						
						
						
					///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
					// definition des evens click et passage sur graphe
					chart7.connectToPlot( "default", function(evt){
						// click
						if(evt.type === "onclick"){
							setPlusTab(chart7.axes.x.labels[evt.index].text, "", ongletActif());
							setPlusTabProto(chart7.axes.x.labels[evt.index].text, "");
							animatePlusTab();
						};
					});	
					
					
				}catch(e){
					if(JsonObj7.errMsg)alert("Json Bug Report: "+JsonObj7.errMsg);	
					unLoading();
					effacerNone("7",ongletActif());
					var image = document.createElement("img");
					//image.setAttribute( 'style', "height: 300px; width: 800px;" );
					image.setAttribute( 'class', "photo" );
					image.setAttribute( 'src', "images/nodataS.png" );
					var div = document.createElement("div");
					div.setAttribute( 'isNone', "true");
					div.setAttribute( 'style', "position: absolute;");
					div.appendChild(image);
					var element = document.getElementById("DivGraphe7"+ongletActif());
					element.insertBefore(div, element.firstChild);
					
					document.getElementById("legend7"+ongletActif()).style.visibility="hidden";
					
					
				}
				
			}else{
				unLoading();
				var element = document.getElementById("chart7"+ongletActif());
				if ( element.hasChildNodes() ){
					while ( element.childNodes.length >= 1 ){
						element.removeChild( element.firstChild );       
					} 
				}
				document.getElementById("chart7"+ongletActif()).innerHTML =  "ERROR: no data received ! (Bug report)" ;
			}
			
			unLoading();
		
		}
		
	}
	xhr.send(null);
	
};






////////////////////////////////////////////////////////////////////////////////////////////////////////////////  FIN DE FONCTION GRAPHE 7  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////





///////////////////////////////////////////////////////////////////////////////////////////////////////  FONCTION DE CONSTRUCTION DES GRAPHES ONGLET  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

makeChart11 = function(){

	var xhr = createXhrObject();

	
	xhr.open("GET", "dynamic/hostNbDiffHosts.json?"+document.getElementById(ongletActif()).getAttribute('params'), true);
	xhr.onreadystatechange=function() 
	{
		if (xhr.readyState == 4) 
		{
			if (xhr.status == 200) 
			{
				
				var JsonObj11 = eval("(" + xhr.responseText + ")");
				
				try{
					
					chart11 = new dojox.charting.Chart2D("chart1"+ongletActif());
					
					dojox.charting.themes.PlotKit.green.chart.fill = dojox.charting.themes.PlotKit.green.plotarea.fill = "#fff";
					dojox.charting.themes.PlotKit.green.axis.stroke.color = "#999";
					dojox.charting.themes.PlotKit.green.axis.majorTick.color = "#777";
					dojox.charting.themes.PlotKit.green.axis.minorTick.color = "#777";
					dojox.charting.themes.PlotKit.green.axis.tick.fontColor = "#000";
					dojox.charting.themes.PlotKit.green.axis.tick.fontColor = "#000";
					chart11.setTheme(dojox.charting.themes.PlotKit.green);
			
					chart11.addPlot("default", {type: "Default", lines: true, markers: true, tension:3});
					if(JsonObj11.data[1].legend.length>24){
						chart11.addAxis("x", { labels: JsonObj11.data[1].legend, majorTickStep:2, majorTick: {stroke: "black", length: 3}, minorTick: {stroke: "gray", length: 3}});
					}else{
						chart11.addAxis("x", { labels: JsonObj11.data[1].legend, majorTick: {stroke: "black", length: 3}, minorTick: {stroke: "gray", length: 3}});	
					}
					chart11.addAxis("y", {vertical: true, majorTick: {stroke: "black", length: 3}, minorTick: {stroke: "gray", length: 3}, min: 0, max: ( JsonObj11.data[0].max*1.05 )});
					
					chart11.addSeries(JsonObj11.data[2].type,  JsonObj11.data[2].tab);
					chart11.addSeries(JsonObj11.data[3].type,  JsonObj11.data[3].tab);

				
					var anim_aE = new dojox.charting.action2d.Magnify(chart11, "default");
					var anim_cE = new dojox.charting.action2d.Tooltip(chart11, "default");
					

					
					// dessin du graphe
					chart11.render();
					
					// legende des ordonnÈes
					try{
						document.getElementById("unit1"+ongletActif()).removeChild( document.getElementById("unit1"+ongletActif()).firstChild );  
					}catch(e){}
					if(JsonObj11.data[0].unit){
					var text = document.createTextNode(JsonObj11.data[0].unit);
					document.getElementById("unit1"+ongletActif()).appendChild(text);
					}
					
					
					
					//Legende
					try{
						var legend11 = new dojox.charting.widget.Legend({chart: chart11, horizontal: false}, "legend1Tab"+ongletActif());
					}catch(e){}
					
					document.getElementById("legend1"+ongletActif()).style.visibility="visible";
						
						
					///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
					// definition des evens click et passage sur graphe
					chart11.connectToPlot( "default", function(evt){
						// click
						if(evt.type === "onclick"){
							setPlusTab(chart11.axes.x.labels[evt.index].text, "", ongletActif());
							setPlusTabProto(chart11.axes.x.labels[evt.index].text, "");
							animatePlusTab();
						};
					});
					
				}catch(e){
					if(JsonObj11.errMsg)alert("Json Bug Report: "+JsonObj11.errMsg);	
					unLoading();
					effacerNone("1",ongletActif());
					var image = document.createElement("img");
					//image.setAttribute( 'style', "height: 300px; width: 800px;" );
					image.setAttribute( 'class', "photo" );
					image.setAttribute( 'src', "images/nodataS.png" );
					var div = document.createElement("div");
					div.setAttribute( 'isNone', "true");
					div.setAttribute( 'style', "position: absolute;");
					div.appendChild(image);
					var element = document.getElementById("DivGraphe1"+ongletActif());
					element.insertBefore(div, element.firstChild);
					
					document.getElementById("legend1"+ongletActif()).style.visibility="hidden";
					
					
				}
			}else{
				unLoading();
				var element = document.getElementById("chart1"+ongletActif());
				if ( element.hasChildNodes() ){
					while ( element.childNodes.length >= 1 ){
						element.removeChild( element.firstChild );       
					} 
				}
				document.getElementById("chart1"+ongletActif()).innerHTML =  "ERROR: no data received ! (Bug report)" ;
			}
			
			unLoading();
		
		}
		
	}
	xhr.send(null);

};

makeChart12 = function(){


	var xhr = createXhrObject();

	
	xhr.open("GET",   document.getElementById("hostGraphe2"+ongletActif()).value+"?"+document.getElementById(ongletActif()).getAttribute('params'), true);
	xhr.onreadystatechange=function() 
	{
		if (xhr.readyState == 4) 
		{
			if (xhr.status == 200) 
			{
						
				JsonObj12[ongletActif()] = eval("(" + xhr.responseText + ")");
				
				try{
					
					Chart12[ongletActif()] = new dojox.charting.Chart2D("chart2"+ongletActif());
					if(JsonObj12[ongletActif()].data[1].legend.length>24){
						// ajout de l'axe x
						Chart12[ongletActif()].addAxis("x", { 
							labels: JsonObj12[ongletActif()].data[1].legend,
							majorTickStep:	2

						});
					}else{
						// ajout de l'axe x
						Chart12[ongletActif()].addAxis("x", { 
							labels: JsonObj12[ongletActif()].data[1].legend

						});							
					}
		
					
		
					// d√©finition des graphes affich√©s
					Chart12[ongletActif()].addPlot("default", {type: "Columns", gap:80/JsonObj12[ongletActif()].data[1].legend.length, hAxis: "x", vAxis: "y"});
					

					// ajout de l'axe y
					Chart12[ongletActif()].addAxis("y", {vertical:true, fixLower: "minor", fixUpper: "minor", natural: true});

					
					// ajout du quadrillage
					Chart12[ongletActif()].addPlot("grid", {type: "Grid",
						hAxis: "y",
						vAxis: "x",
						vMajorLines: false,
						vMinorLines:false,
						hMajorLines: true,
						hMinorLines:false
					});
					
					
						
									
					var up = new Array();
					var down = new Array();
					
					// ajout automatique des sÈries
				
					try{// ajout automatique des sÈries et des couleurs prÈdÈfinies
						var i = 2;
						var Vcolor = [  '#FFC8A3' , '#61F554' , '#A3C6FF' ];
						while(JsonObj12[ongletActif()].data[i] != null){
							
							if(2<=i && i<=3)var CouleurSerie = Vcolor[0];
							else if(4<=i && i<=5)var CouleurSerie = Vcolor[1];
							else var CouleurSerie = Vcolor[2];
							
							if( JsonObj12[ongletActif()].data[i].type ==="IN"){
								curTab = JsonObj12[ongletActif()].data[i].tab;
								for(var j = 0; j < curTab.length; j++){
									curTab[j].y = -curTab[j].y;
									if(down[j] != null)curTab[j].y += down[j];
									down[j] = curTab[j].y ;
								}
								Chart12[ongletActif()].addSeries(JsonObj12[ongletActif()].data[i].name+JsonObj12[ongletActif()].data[i].type, curTab, {plot : "default", stroke: "black", fill: CouleurSerie});
								i++;
							}else{
								curTab = JsonObj12[ongletActif()].data[i].tab;
								for(var j = 0; j < curTab.length; j++){
									if(up[j] != null)curTab[j].y += up[j];
									up[j] = curTab[j].y ;
								}
								Chart12[ongletActif()].addSeries(JsonObj12[ongletActif()].data[i].name+JsonObj12[ongletActif()].data[i].type, curTab, {plot : "default", stroke: "black", fill: CouleurSerie});
								i++;
							}
						}
					}catch(e){alert(e);}
					

					
					
					// ajouter l'axe vertical de droite
					addVerticalRightAxis(Chart12[ongletActif()], down, up);
									
		
					var anim_cE = new dojox.charting.action2d.Tooltip(Chart12[ongletActif()], "default");
		
					
					
					// dessin du graphe
					Chart12[ongletActif()].render();
					
					
					// graduation minimale du zoom
					addZoomZero(Chart12[ongletActif()]);

					
					mySetTheme(Chart12[ongletActif()]);
					//Chart1[ongletActif()].theme.plotarea.fill.y2;
					

					// Setting zoom-bar	
					dijit.byId("zoomProto"+ongletActif()).setAttribute("minimum", Chart12[ongletActif()].getAxis("y").scaler.bounds.lower);
					dijit.byId("zoomProto"+ongletActif()).setAttribute("maximum", Chart12[ongletActif()].getAxis("y").scaler.bounds.upper);
					dijit.byId("zoomProto"+ongletActif()).setAttribute("value", [Chart12[ongletActif()].getAxis("y").scaler.bounds.lower, Chart12[ongletActif()].getAxis("y").scaler.bounds.upper]);
				
					
					// changer les labels de l'axe de droite et ajouter les unites au dessus
					changeAxes(Chart12[ongletActif()], "2", JsonObj12[ongletActif()]);
					
					
					// changer les labels de l'axe de droite et ajouter les unites au dessus
					try{
						document.getElementById("unit2"+ongletActif()).removeChild( document.getElementById("unit2"+ongletActif()).firstChild ); 
					}catch(e){} 
					
					var text = document.createTextNode(JsonObj12[ongletActif()].data[0].unit);
					document.getElementById("unit2"+ongletActif()).appendChild(text);
	
					// definir le type de curseur quand l'utilisateur pointe sur un 'clickable'
					setCursors("chart2"+ongletActif(), "rect");
					
					
					
		
					// CrÈation manuelle de la legende
					if(document.getElementById("hostGraphe2"+ongletActif()).value.indexOf("Protocole") != -1){
						// CrÈation manuelle de la legende des protocoles
						creerLegendeProtocole(JsonObj12[ongletActif()], "2", ongletActif(), Vcolor);
					}else{
						// CrÈation manuelle de la legende
						creerLegende(JsonObj12[ongletActif()], "2", ongletActif(), 17);
					}
					
					document.getElementById("zoomProto"+ongletActif()).style.visibility="visible";
					document.getElementById("legend2"+ongletActif()).style.visibility="visible";
					
					
					
					

					///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
					// definition des evens click et passage sur graphe
					
					// event click
					if(document.getElementById("hostGraphe2"+ongletActif()).value.indexOf("Traffic") != -1){
							
						Chart12[ongletActif()].connectToPlot( "default", function(evt){
							// click
							if(evt.type === "onclick"){
								if(evt.run.data[evt.index].y<0) var sens = "inc";
								else var sens = "out";
								clickToPie(Chart12[ongletActif()].axes.x.labels[evt.index].text, ongletActif(), "", evt.run.name.slice(0,3), "", sens, false, "dynamic/hostExtHostsProtocolesTraffic.json", "", "", "");
							};
						})
						
					}else{
							
						Chart12[ongletActif()].connectToPlot( "default", function(evt){
							// click
							if(evt.type === "onclick"){
								if(evt.run.data[evt.index].y<0) var sens = "inc";
								else var sens = "out";
								clickToPie(Chart12[ongletActif()].axes.x.labels[evt.index].text, ongletActif(), "", evt.run.name.slice(0,3), "", sens, false, "dynamic/hostExtHostsProtocolesPackets.json", "", "", "");
							};
						})
						
					}				
		
					
					
				}catch(e){
					if(JsonObj12[ongletActif()].errMsg)alert("Json Bug Report: "+JsonObj12[ongletActif()].errMsg);	
					unLoading();
					effacerNone("2",ongletActif());
					var image = document.createElement("img");
					//image.setAttribute( 'style', "height: 300px; width: 800px;" );
					image.setAttribute( 'class', "photo" );
					image.setAttribute( 'src', "images/nodata.png" );
					var div = document.createElement("div");
					div.setAttribute( 'isNone', "true");
					div.setAttribute( 'style', "position: absolute;");
					div.appendChild(image);
					var element = document.getElementById("DivGraphe2"+ongletActif());
					element.insertBefore(div, element.firstChild);
					
					document.getElementById("zoomProto"+ongletActif()).style.visibility="hidden";
					document.getElementById("legend2"+ongletActif()).style.visibility="hidden";
					
					
				}
				
			}else {
				unLoading();
				var element = document.getElementById("chart2"+ongletActif());
				if ( element.hasChildNodes() ){
					while ( element.childNodes.length >= 1 ){
						element.removeChild( element.firstChild );       
					} 
				}
				document.getElementById("chart2"+ongletActif()).innerHTML =  "ERROR: no data received ! (Bug report)" ;
			}
			
			unLoading();
		
		}
		
	}
	xhr.send(null);

};



makeChart13 = function(){


	var xhr = createXhrObject();

	
	xhr.open("GET",   document.getElementById("hostGraphe3"+ongletActif()).value+"?"+document.getElementById(ongletActif()).getAttribute('params')+"&service=loc", true);
	xhr.onreadystatechange=function() 
	{
		if (xhr.readyState == 4) 
		{
			if (xhr.status == 200) 
			{
						
				JsonObj13[ongletActif()] = eval("(" + xhr.responseText + ")");
				
				try{
					
					Chart13[ongletActif()] = new dojox.charting.Chart2D("chart3"+ongletActif());
					if(JsonObj13[ongletActif()].data[1].legend.length>24){
						// ajout de l'axe x
						Chart13[ongletActif()].addAxis("x", { 
							labels: JsonObj13[ongletActif()].data[1].legend,
							majorTickStep:	2

						});
					}else{
						// ajout de l'axe x
						Chart13[ongletActif()].addAxis("x", { 
							labels: JsonObj13[ongletActif()].data[1].legend

						});						
					}
		
					

					// d√©finition des graphes affich√©s
					Chart13[ongletActif()].addPlot("default", {type: "Columns", gap:80/JsonObj13[ongletActif()].data[1].legend.length, hAxis: "x", vAxis: "y"});
					

					// ajout de l'axe y
					Chart13[ongletActif()].addAxis("y", {vertical:true, fixLower: "minor", fixUpper: "minor", natural: true});

					
					// ajout du quadrillage
					Chart13[ongletActif()].addPlot("grid", {type: "Grid",
						hAxis: "y",
						vAxis: "x",
						vMajorLines: false,
						vMinorLines:false,
						hMajorLines: true,
						hMinorLines:false
					});
					
					
					
					
									
					var up = new Array();
					var down = new Array();
					
					// ajout automatique des sÈries
					var i = 2;
					while(JsonObj13[ongletActif()].data[i] != null){
						if( JsonObj13[ongletActif()].data[i].type ==="IN"){
							curTab = JsonObj13[ongletActif()].data[i].tab;
							for(var j = 0; j < curTab.length; j++){
								curTab[j].y = -curTab[j].y;
								if(down[j] != null)curTab[j].y += down[j];
								down[j] = curTab[j].y ;
							}
							Chart13[ongletActif()].addSeries(JsonObj13[ongletActif()].data[i].name+JsonObj13[ongletActif()].data[i].type, curTab, {plot : "default"});
							i++;
						}else{
							curTab = JsonObj13[ongletActif()].data[i].tab;
							for(var j = 0; j < curTab.length; j++){
								if(up[j] != null)curTab[j].y += up[j];
								up[j] = curTab[j].y ;
							}
							Chart13[ongletActif()].addSeries(JsonObj13[ongletActif()].data[i].name+JsonObj13[ongletActif()].data[i].type, curTab, {plot : "default"});
							i++;
						}
					};

					
					
					// ajouter l'axe vertical de droite
					addVerticalRightAxis(Chart13[ongletActif()], down, up);
									
		
					var anim_cE = new dojox.charting.action2d.Tooltip(Chart13[ongletActif()], "default");


					
					// dessin du graphe
					Chart13[ongletActif()].render();
					
					
					// graduation minimale du zoom
					addZoomZero(Chart13[ongletActif()]);

					
					mySetTheme(Chart13[ongletActif()]);
					//Chart1[ongletActif()].theme.plotarea.fill.y2;
					

					// Setting zoom-bar	
					dijit.byId("zoomLoc"+ongletActif()).setAttribute("minimum", Chart13[ongletActif()].getAxis("y").scaler.bounds.lower);
					dijit.byId("zoomLoc"+ongletActif()).setAttribute("maximum", Chart13[ongletActif()].getAxis("y").scaler.bounds.upper);
					dijit.byId("zoomLoc"+ongletActif()).setAttribute("value", [Chart13[ongletActif()].getAxis("y").scaler.bounds.lower, Chart13[ongletActif()].getAxis("y").scaler.bounds.upper]);
				
					
					// changer les labels de l'axe de droite et ajouter les unites au dessus
					changeAxes(Chart13[ongletActif()], "3", JsonObj13[ongletActif()]);
					
					// definir le type de curseur quand l'utilisateur pointe sur un 'clickable'
					setCursors("chart3"+ongletActif(), "rect");
					
					
					
		
					// CrÈation manuelle de la legende
					if(document.getElementById("hostGraphe3"+ongletActif()).value.indexOf("Protocole") != -1){
						// CrÈation manuelle de la legende des protocoles
						creerLegendeProtocole(JsonObj13[ongletActif()], "3", ongletActif(), Vcolor);
					}else{
						// CrÈation manuelle de la legende
						creerLegende(JsonObj13[ongletActif()], "3", ongletActif(), 17);
					}
					
					document.getElementById("zoomLoc"+ongletActif()).style.visibility="visible";
					document.getElementById("legend3"+ongletActif()).style.visibility="visible";
					
					
					
					
					///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
					// definition des evens click et passage sur graphe
						
									//definition du type du graphe des services : "packets" ou "traffic"
									var PACorTRAF = "";
									if(document.getElementById("hostGraphe3"+ongletActif()).value.indexOf("Packets") != -1) PACorTRAF = "Packets";
									else if(document.getElementById("hostGraphe3"+ongletActif()).value.indexOf("Traffic") != -1) PACorTRAF = "Traffic";
									else alert( "can't find string 'Packets' or 'Traffic'" );
												
									var colors = [];
									if(document.getElementById("hostGraphe3"+ongletActif()).value.indexOf("Protocole") == -1){
										if(document.getElementById("hostGraphe3"+ongletActif()).value.indexOf("Country") == -1){
											Chart13[ongletActif()].connectToPlot( "default", function(evt){
												// click
												if(evt.type === "onclick"){
													if(evt.run.data[evt.index].y<0) var sens = "inc";
													else var sens = "out";
													dijit.byId("SelectIp").setAttribute( 'value' , ipFrom(ongletActif()) );
													/*dijit.byId("SelectIp").value = ipFrom(ongletActif()) ;
													dijit.byId("SelectIp").onChange();*/
													
													//setPlusTab(chart1.axes.x.labels[evt.index].text,evt.run.data[evt.index].item);
													//setPlusTabProto(chart1.axes.x.labels[evt.index].text, "");
													if(evt.run.data[evt.index].tooltip.split("(").length == 3)
														clickToPie(Chart13[ongletActif()].axes.x.labels[evt.index].text, ongletActif(), parseInt(evt.run.data[evt.index].item), evt.run.data[evt.index].item.split('dynamic//")[1].slice(0,3), "<", sens, false, "hostExtHostsService"+PACorTRAF+".json", "loc", "", "");
													else if(evt.run.data[evt.index].tooltip.split("(").length == 2)
														clickToPie(Chart13[ongletActif()].axes.x.labels[evt.index].text, ongletActif(), parseInt(evt.run.data[evt.index].item), evt.run.data[evt.index].item.split('dynamic//")[1].slice(0,3), "<", sens, false, "hostExtHostsService"+PACorTRAF+".json", "loc", "", "");
													else alert("errata in index.js line: 247");
													
													//ChangerOnglet("Plus");
													//ChangerDiv("DivPlus");
												};
											})
										}else{
											Chart13[ongletActif()].connectToPlot( "default", function(evt){
												// click
												if(evt.type === "onclick"){
													dijit.byId("SelectIp").setAttribute( 'value' , ipFrom(ongletActif()) );
													/*dijit.byId("SelectIp").value = ipFrom(ongletActif()) ;
													dijit.byId("SelectIp").onChange();*/
													dijit.byId("SelectCountry").setAttribute( 'value' , evt.run.data[evt.index].item.split("(")[0] );
													
													animatePlusTab();
												};
											})
										}
										setTimeout(function(){Chart13[ongletActif()].connectToPlot( "default",  function(evt){ eventMouse(evt, "3", ongletActif());});},500);
									}
										
					///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
									
					
					
					
					
				}catch(e){
					if(JsonObj13[ongletActif()].errMsg)alert("Json Bug Report: "+JsonObj13[ongletActif()].errMsg);	
					unLoading();
					effacerNone("3",ongletActif());
					var image = document.createElement("img");
					//image.setAttribute( 'style', "height: 300px; width: 800px;" );
					image.setAttribute( 'class', "photo" );
					image.setAttribute( 'src', "images/nodata.png" );
					var div = document.createElement("div");
					div.setAttribute( 'isNone', "true");
					div.setAttribute( 'style', "position: absolute;");
					div.appendChild(image);
					var element = document.getElementById("DivGraphe3"+ongletActif());
					element.insertBefore(div, element.firstChild);
					
					document.getElementById("zoomLoc"+ongletActif()).style.visibility="hidden";
					document.getElementById("legend3"+ongletActif()).style.visibility="hidden";
					
					
				}
				
			}else {
				unLoading();
				var element = document.getElementById("chart3"+ongletActif());
				if ( element.hasChildNodes() ){
					while ( element.childNodes.length >= 1 ){
						element.removeChild( element.firstChild );       
					} 
				}
				document.getElementById("chart3"+ongletActif()).innerHTML =  "ERROR: no data received ! (Bug report)" ;
			}
			
			unLoading();
		
		}
		
	}
	xhr.send(null);

};



makeChart14 = function(){



	var xhr = createXhrObject();
	

	
	xhr.open("GET",   document.getElementById("hostGraphe4"+ongletActif()).value+"?"+document.getElementById(ongletActif()).getAttribute('params')+"&service=ext", true);
	xhr.onreadystatechange=function() 
	{
		if (xhr.readyState == 4) 
		{
			if (xhr.status == 200) 
			{

				JsonObj14[ongletActif()] = eval("(" + xhr.responseText + ")");
				
				try{
					
					Chart14[ongletActif()] = new dojox.charting.Chart2D("chart4"+ongletActif());
					if(JsonObj14[ongletActif()].data[1].legend.length>24){
						// ajout de l'axe x
						Chart14[ongletActif()].addAxis("x", { 
							labels: JsonObj14[ongletActif()].data[1].legend,
							majorTickStep:	2


						});
					}else{
						// ajout de l'axe x
						Chart14[ongletActif()].addAxis("x", { 
							labels: JsonObj14[ongletActif()].data[1].legend

						});						
					}
		
					

					// d√©finition des graphes affich√©s
					Chart14[ongletActif()].addPlot("default", {type: "Columns", gap:80/JsonObj14[ongletActif()].data[1].legend.length, hAxis: "x", vAxis: "y"});
					

					// ajout de l'axe y
					Chart14[ongletActif()].addAxis("y", {vertical:true, fixLower: "minor", fixUpper: "minor", natural: true});

					
					// ajout du quadrillage
					Chart14[ongletActif()].addPlot("grid", {type: "Grid",
						hAxis: "y",
						vAxis: "x",
						vMajorLines: false,
						vMinorLines:false,
						hMajorLines: true,
						hMinorLines:false
					});
					
					
									
					var up = new Array();
					var down = new Array();
					
					// ajout automatique des sÈries
					var i = 2;
					while(JsonObj14[ongletActif()].data[i] != null){
						if( JsonObj14[ongletActif()].data[i].type ==="IN"){
							curTab = JsonObj14[ongletActif()].data[i].tab;
							for(var j = 0; j < curTab.length; j++){
								curTab[j].y = -curTab[j].y;
								if(down[j] != null)curTab[j].y += down[j];
								down[j] = curTab[j].y ;
							}
							Chart14[ongletActif()].addSeries(JsonObj14[ongletActif()].data[i].name+JsonObj14[ongletActif()].data[i].type, curTab, {plot : "default"});
							i++;
						}else{
							curTab = JsonObj14[ongletActif()].data[i].tab;
							for(var j = 0; j < curTab.length; j++){
								if(up[j] != null)curTab[j].y += up[j];
								up[j] = curTab[j].y ;
							}
							Chart14[ongletActif()].addSeries(JsonObj14[ongletActif()].data[i].name+JsonObj14[ongletActif()].data[i].type, curTab, {plot : "default"});
							i++;
						}
					};
						
					

					
					// ajouter l'axe vertical de droite
					addVerticalRightAxis(Chart14[ongletActif()], down, up);
									
		
					var anim_cE = new dojox.charting.action2d.Tooltip(Chart14[ongletActif()], "default");
		


					
					// dessin du graphe
					Chart14[ongletActif()].render();
					
					
					// graduation minimale du zoom
					addZoomZero(Chart14[ongletActif()]);

					
					mySetTheme(Chart14[ongletActif()]);
					//Chart1[ongletActif()].theme.plotarea.fill.y2;
					

					// Setting zoom-bar	
					dijit.byId("zoomExt"+ongletActif()).setAttribute("minimum", Chart14[ongletActif()].getAxis("y").scaler.bounds.lower);
					dijit.byId("zoomExt"+ongletActif()).setAttribute("maximum", Chart14[ongletActif()].getAxis("y").scaler.bounds.upper);
					dijit.byId("zoomExt"+ongletActif()).setAttribute("value", [Chart14[ongletActif()].getAxis("y").scaler.bounds.lower, Chart14[ongletActif()].getAxis("y").scaler.bounds.upper]);
				
					
					// changer les labels de l'axe de droite et ajouter les unites au dessus
					changeAxes(Chart14[ongletActif()], "4", JsonObj14[ongletActif()]);
					
					// definir le type de curseur quand l'utilisateur pointe sur un 'clickable'
					setCursors("chart4"+ongletActif(), "rect");
					
					
					
		
					// CrÈation manuelle de la legende
					if(document.getElementById("hostGraphe4"+ongletActif()).value.indexOf("Protocole") != -1){
						// CrÈation manuelle de la legende des protocoles
						creerLegendeProtocole(JsonObj14[ongletActif()], "4", ongletActif(), Vcolor);
					}else{
						// CrÈation manuelle de la legende
						creerLegende(JsonObj14[ongletActif()], "4", ongletActif(), 17);
					}
					
					document.getElementById("zoomExt"+ongletActif()).style.visibility="visible";
					document.getElementById("legend4"+ongletActif()).style.visibility="visible";
					
					
					
					
					///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
					// definition des evens click et passage sur graphe
																		
									//definition du type du graphe des services : "packets" ou "traffic"
									var PACorTRAF = "";
									if(document.getElementById("hostGraphe4"+ongletActif()).value.indexOf("Packets") != -1) PACorTRAF = "Packets";
									else if(document.getElementById("hostGraphe4"+ongletActif()).value.indexOf("Traffic") != -1) PACorTRAF = "Traffic";
									else alert( "can't find string 'Packets' or 'Traffic'" );
												
									
									var colors = [];
									if(document.getElementById("hostGraphe4"+ongletActif()).value.indexOf("Protocole") == -1){
										if(document.getElementById("hostGraphe4"+ongletActif()).value.indexOf("Country") == -1){
											Chart14[ongletActif()].connectToPlot( "default", function(evt){
												// click
												if(evt.type === "onclick"){
													
													if(evt.run.data[evt.index].y<0) var sens = "inc";
													else var sens = "out";
													
													dijit.byId("SelectIp").setAttribute( 'value' , ipFrom(ongletActif()) );
													/*dijit.byId("SelectIp").value = ipFrom(ongletActif()) ;
													dijit.byId("SelectIp").onChange();*/
													
													//setPlusTab(chart1.axes.x.labels[evt.index].text,evt.run.data[evt.index].item);
													//setPlusTabProto(chart1.axes.x.labels[evt.index].text, "");
													if(evt.run.data[evt.index].tooltip.split("(").length == 3)
														clickToPie(Chart14[ongletActif()].axes.x.labels[evt.index].text, ongletActif(), parseInt(evt.run.data[evt.index].item), evt.run.data[evt.index].item.split('dynamic//")[1].slice(0,3), ">", sens, false, "hostExtHostsService"+PACorTRAF+".json", "ext", "", "");
													else if(evt.run.data[evt.index].tooltip.split("(").length == 2)
														clickToPie(Chart14[ongletActif()].axes.x.labels[evt.index].text, ongletActif(), parseInt(evt.run.data[evt.index].item), evt.run.data[evt.index].item.split('dynamic//")[1].slice(0,3), ">", sens, false, "hostExtHostsService"+PACorTRAF+".json", "ext", "", "");
													else alert("errata in index.js line: 247");
													
													//ChangerOnglet("Plus");
													//ChangerDiv("DivPlus");
												};
											})
										}else{
											Chart14[ongletActif()].connectToPlot( "default", function(evt){
												// click
												if(evt.type === "onclick"){
													dijit.byId("SelectIp").setAttribute( 'value' , ipFrom(ongletActif()) );
													/*dijit.byId("SelectIp").value = ipFrom(ongletActif()) ;
													dijit.byId("SelectIp").onChange();*/
													dijit.byId("SelectCountry").setAttribute( 'value' , evt.run.data[evt.index].item.split("(")[0] );
													
													animatePlusTab();
												};
											})
										}
										setTimeout(function(){Chart14[ongletActif()].connectToPlot( "default",  function(evt){ eventMouse(evt, "4", ongletActif());})},500);
									}
										
					///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
							
					
					
				}catch(e){
					if(JsonObj14[ongletActif()].errMsg)alert("Json Bug Report: "+JsonObj14[ongletActif()].errMsg);	
					unLoading();
					effacerNone("4",ongletActif());
					var image = document.createElement("img");
					//image.setAttribute( 'style', "height: 300px; width: 800px;" );
					image.setAttribute( 'class', "photo" );
					image.setAttribute( 'src', "images/nodata.png" );
					var div = document.createElement("div");
					div.setAttribute( 'isNone', "true");
					div.setAttribute( 'style', "position: absolute;");
					div.appendChild(image);
					var element = document.getElementById("DivGraphe4"+ongletActif());
					element.insertBefore(div, element.firstChild);
					
					document.getElementById("zoomExt"+ongletActif()).style.visibility="hidden";
					document.getElementById("legend4"+ongletActif()).style.visibility="hidden";
					
					
				}
				
			}else {
				unLoading();
				var element = document.getElementById("chart4"+ongletActif());
				if ( element.hasChildNodes() ){
					while ( element.childNodes.length >= 1 ){
						element.removeChild( element.firstChild );       
					} 
				}
				document.getElementById("chart4"+ongletActif()).innerHTML =  "ERROR: no data received ! (Bug report)" ;
			}
			
			unLoading();
		
		}
		
	}
	xhr.send(null);
}





makeChart16a = function(){


	var xhr = createXhrObject();
	//alert(JsonName+"?"+parameters);
	
	xhr.open("GET",   JsonName+"?"+parameters, true);
	
	xhr.onreadystatechange=function() 
	{
		if (xhr.readyState == 4) 
		{
			if (xhr.status == 200) 
			{
				if( xhr.responseText == "") document.getElementById("camembert1").innerHTML = "No results";
				else{
						
					var JsonObj16a = eval("(" + xhr.responseText + ")");
					
					try{
						
						creerTooltip(JsonObj16a);
						
						chart16a = new dojox.charting.Chart2D("camembert1");
			
						// d√©finition des graphes affich√©s
						chart16a.addPlot("default", {type: "Pie", radius: 100,  labelOffset: -20});


						// ajout de l'axe y
						chart16a.addSeries("IN",  JsonObj16a.data, {plot : "default"});
						
						// theme
						chart16a.setTheme(dojox.charting.themes.Harmony);
			

						var anim_aE = new dojox.charting.action2d.Magnify(chart16a, "default");
						var anim_aE = new dojox.charting.action2d.MoveSlice(chart16a, "default");
						var anim_cE = new dojox.charting.action2d.Tooltip(chart16a, "default");
						
						
						//chart16b.connectToPlot( "default",  function(evt){ eventMouse(evt, "16b", "");})
						chart16a.connectToPlot( "default", function(evt){
							// click
							if(evt.type === "onclick"){
								
								// mettre en haut de page pr voir les onglets (surtout detail qui clignote)
								document.getElementById("body").scrollTop = 0;
								
								if(document.getElementById("camembert1Sub").innerHTML == "External"){
									dijit.byId("SelectCountry").setAttribute( 'value' , nameOfCountry(evt.run.data[evt.index].c) );
									/*dijit.byId("SelectCountry").value = nameOfCountry(evt.run.data[evt.index].c) ;*/
									document.getElementById("ipext").setAttribute("value", evt.run.data[evt.index].ip);
									document.getElementById("ipext").value = evt.run.data[evt.index].ip;
									document.getElementById("ipext").onchange();
									setASValueTO(evt.run.data[evt.index].asn);
								}else if(document.getElementById("camembert1Sub").innerHTML == "Local"){
									//alert(evt.run.data[evt.index].ip);
									dijit.byId("SelectIp").setAttribute( 'value' , evt.run.data[evt.index].ip );
									dijit.byId("SelectIpData").setAttribute( 'value' , evt.run.data[evt.index].ip );
									/*dijit.byId("SelectIp").value = evt.run.data[evt.index].ip ;
									dijit.byId("SelectIp").onChange();*/
								}else alert("errata in index.js line:2471");
								
								dijit.byId("dialogCamemberts").hide();
								
								animatePlusTab();
							}
						})
						
						// dessin du graphe
						chart16a.render();
						
						// definir le type de curseur quand l'utilisateur pointe sur un 'clickable'
						setCursors("camembert1", "path");
			
						
						//Legende
						// On remplace les valeurs des legendes du camemberts par celles donnÈes dans le Json
						var pieDivs = document.getElementById('camembert1').getElementsByTagName("div");
						//var ess = document.getElementById('camembert1').getElementsByTagName("path");
						var pieData = chart16a.series[0].data;
						var ySum = 0;
						var j=0;
						
						//for(var i=0; i<ess.length; i++) ess[i].innerHTML = "<img src='/images/flags/fr.png'><img>";
						
						for(var i=0; i<pieData.length; i++) ySum += pieData[i].y;
						
						for(var i=0; i<pieData.length; i++){
							if( (pieData[pieData.length-(1+i)].y*100) > ySum){
								try{
									//pieDivs[j].childNodes[0].innerHTML = "<img src='/images/flags/fr.png'><img>";
									pieDivs[j].childNodes[0].childNodes[0].nodeValue = pieData[pieData.length-(1+i)].amount;
								}catch(e){
									j++;
									//pieDivs[j].childNodes[0].innerHTML = "<img src='/images/flags/fr.png'><img>";
									pieDivs[j].childNodes[0].childNodes[0].nodeValue = pieData[pieData.length-(1+i)].amount;
								}
								j++;
							}else{
								try{
									pieDivs[j].childNodes[0].childNodes[0].nodeValue = "";
								}catch(e){
									j++;
									pieDivs[j].childNodes[0].childNodes[0].nodeValue = "";
								}
								j++;
							}
						}
						
					}catch(e){
						
						if(JsonObj16a.errMsg)alert("Json Bug Report: "+JsonObj16a.errMsg);	
						unLoading();
						var image = document.createElement("img");
						//image.setAttribute( 'style', "height: 300px; width: 800px;" );
						image.setAttribute( 'class', "photo" );
						image.setAttribute( 'src', "images/nodataC.png" );
						var div = document.createElement("div");
						div.setAttribute( 'style', "position: absolute;");
						div.appendChild(image);
						var element = document.getElementById("camembert1");
						element.insertBefore(div, element.firstChild);
						
					}
			
					
				}
			}else{
				unLoading();
				document.getElementById("camembert1").innerHTML =  "ERROR: no data received ! (Bug report)" ;
			}
			
			unLoading();
		
		}
		
	}
	xhr.send(null);

};



makeChart16b = function(){


	var xhr = createXhrObject();
	
	
	xhr.open("GET",   JsonName+"?"+parameters, true);
	
	xhr.onreadystatechange=function() 
	{
		if (xhr.readyState == 4) 
		{
			if (xhr.status == 200) 
			{
				if( xhr.responseText == "") document.getElementById("camembert2").innerHTML = "No results";
				else{
						
					var JsonObj16b = eval("(" + xhr.responseText + ")");
					
					try{
						
						creerTooltip(JsonObj16b);
						
						chart16b = new dojox.charting.Chart2D("camembert2");		
			
						// d√©finition des graphes affich√©s
						chart16b.addPlot("default", {type: "Pie", radius: 100,  labelOffset: -20});


						// ajout de l'axe y
						chart16b.addSeries("IN",  JsonObj16b.data, {plot : "default"});
						
						// theme
						chart16b.setTheme(dojox.charting.themes.Harmony);
			

						var anim_aE = new dojox.charting.action2d.Magnify(chart16b, "default");
						var anim_aE = new dojox.charting.action2d.MoveSlice(chart16b, "default");
						var anim_cE = new dojox.charting.action2d.Tooltip(chart16b, "default");
						
						
						// dessin du graphe
						chart16b.render();
						
						// definir le type de curseur quand l'utilisateur pointe sur un 'clickable'
						setCursors("camembert2", "path");
						
			
						chart16b.connectToPlot( "default", function(evt){
							// click
							if(evt.type === "onclick"){
								
								// mettre en haut de page pr voir les onglets (surtout detail qui clignote)
								document.getElementById("body").scrollTop = 0;
								
								dijit.byId("SelectCountry").setAttribute( 'value' , nameOfCountry(evt.run.data[evt.index].c) );
								/*dijit.byId("SelectCountry").value = nameOfCountry(evt.run.data[evt.index].c) ;*/
								document.getElementById("ipext").setAttribute("value", evt.run.data[evt.index].ip);
								document.getElementById("ipext").value = evt.run.data[evt.index].ip;
								document.getElementById("ipext").onchange();
								setASValueTO(evt.run.data[evt.index].asn);
								
								dijit.byId("dialogCamemberts").hide();
								
								animatePlusTab();
								
							}
						})
						
						//Legende
						// On remplace les valeurs des legendes du camemberts par celles donnÈes dans le Json
						var pieDivs = document.getElementById('camembert2').getElementsByTagName("div");
						var pieData = chart16b.series[0].data;
						var ySum = 0;
						var j=0;
						
						for(var i=0; i<pieData.length; i++) ySum += pieData[i].y;
						
						for(var i=0; i<pieData.length; i++){
							if( (pieData[pieData.length-(1+i)].y*100) > ySum){
								try{
									pieDivs[j].childNodes[0].childNodes[0].nodeValue = pieData[pieData.length-(1+i)].amount;
								}catch(e){
									j++;
									pieDivs[j].childNodes[0].childNodes[0].nodeValue = pieData[pieData.length-(1+i)].amount;
								}
								j++;
							}else{
								try{
									pieDivs[j].childNodes[0].childNodes[0].nodeValue = "";
								}catch(e){
									j++;
									pieDivs[j].childNodes[0].childNodes[0].nodeValue = "";
								}
								j++;
							}
						}
						
					}catch(e){
						
						if(JsonObj16b.errMsg)alert("Json Bug Report: "+JsonObj16b.errMsg);	
						unLoading();
						var image = document.createElement("img");
						//image.setAttribute( 'style', "height: 300px; width: 800px;" );
						image.setAttribute( 'class', "photo" );
						image.setAttribute( 'src', "images/nodataC.png" );
						var div = document.createElement("div");
						div.setAttribute( 'style', "position: absolute;");
						div.appendChild(image);
						var element = document.getElementById("camembert2");
						element.insertBefore(div, element.firstChild);
						
					}
					
				}
			} else {
				document.getElementById("camembert2").innerHTML =  "ERROR: no data received ! (Bug report)" ;
			}
			
			unLoading();
		
		}
		
		
	}
	xhr.send(null);

};

/*function decalerDate(date, an, mois, jour, heure){
	alert("hi");
	return decalerDate(date, an, mois, jour, heure, 0);
	
}*/

function decalerDate(date, an, mois, jour, heure, minute){
	//alert(an+" "+mois+" "+jour);
	
	var date_heure = date.split(" ");
	
	var CHARannee_mois_jour = date_heure[0].split("-");
	var CHARheure_minute = date_heure[1].split(":");
	
	var annee_mois_jour = []  ;
	var heure_minute = [];
	
	annee_mois_jour[0] = parseInt(CHARannee_mois_jour[0],10);
	annee_mois_jour[1] = parseInt(CHARannee_mois_jour[1],10);
	annee_mois_jour[2] = parseInt(CHARannee_mois_jour[2],10);
	heure_minute[0] = parseInt(CHARheure_minute[0],10);
	heure_minute[1] = parseInt(CHARheure_minute[1],10);
	
	heure_minute[1] += minute;
	
	while (heure_minute[1] >= 60){
		heure_minute[1] += -60;
		heure ++;
	}
	
	while (heure_minute[1] <0 ){
		heure_minute[1] += 60;
		heure --;
	}
	
	heure_minute[0] += heure;
	
	while (heure_minute[0] >= 24){
		heure_minute[0] += -24;
		jour ++;
	}
	
	while (heure_minute[0] <0 ){
		heure_minute[0] += 24;
		jour --;
	}
	
	annee_mois_jour[2] += jour;
	
	while ( (annee_mois_jour[2] > 31 && annee_mois_jour[1] == 1) ||
			(annee_mois_jour[2] > 28 && annee_mois_jour[1] == 2 && annee_mois_jour[0]%4 != 0) ||
			(annee_mois_jour[2] > 29 && annee_mois_jour[1] == 2 && annee_mois_jour[0]%4 == 0) ||
			(annee_mois_jour[2] > 31 && annee_mois_jour[1] == 3) ||
			(annee_mois_jour[2] > 30 && annee_mois_jour[1] == 4) ||
			(annee_mois_jour[2] > 31 && annee_mois_jour[1] == 5) ||
			(annee_mois_jour[2] > 30 && annee_mois_jour[1] == 6) ||
			(annee_mois_jour[2] > 31 && annee_mois_jour[1] == 7) ||
			(annee_mois_jour[2] > 31 && annee_mois_jour[1] == 8) ||
			(annee_mois_jour[2] > 30 && annee_mois_jour[1] == 9) ||
			(annee_mois_jour[2] > 31 && annee_mois_jour[1] == 10) ||
			(annee_mois_jour[2] > 30 && annee_mois_jour[1] == 11) ||
			(annee_mois_jour[2] > 31 && annee_mois_jour[1] == 12) )
	{	
		
		if ( annee_mois_jour[1] == 4 || annee_mois_jour[1] == 6 || annee_mois_jour[1] == 9 || annee_mois_jour[1] == 11){
			annee_mois_jour[2]+= -30;
		}else if ( annee_mois_jour[1] == 2 && annee_mois_jour[0]%4 != 0){
			//alert("1!=");
			annee_mois_jour[2]+= -28;
		}else if ( annee_mois_jour[1] == 2 && annee_mois_jour[0]%4 == 0){
			//alert("1==");
			annee_mois_jour[2]+= -29;
		}else {
			annee_mois_jour[2]+= -31;
		}
		
		mois++;
		
	}
	//alert("moisAV: "+mois);
	while (annee_mois_jour[2] <=0)
	{
		
		if ( annee_mois_jour[1]-1 == 4 || annee_mois_jour[1]-1 == 6 || annee_mois_jour[1]-1 == 9 || annee_mois_jour[1]-1 == 11){
			annee_mois_jour[2] += 30;
		}else if ( annee_mois_jour[1]-1 == 2 && (annee_mois_jour[0]-1)%4 != 0){
			//alert("2!=");
			annee_mois_jour[2]+= 28;
		}else if ( annee_mois_jour[1]-1 == 2 && (annee_mois_jour[0]-1)%4 == 0){
			//alert("2==");
			annee_mois_jour[2] += 29;
		}else {
			annee_mois_jour[2] += 31;
		}
		
		mois --;
	}
	//alert("moisAP: "+mois);
	
	annee_mois_jour[1] += mois;
	
	while( annee_mois_jour[1] <= 0){
		annee_mois_jour[1] += 12
		an-- ;
	}
		
	while( annee_mois_jour[1] > 12){
		annee_mois_jour[1] += -12
		an++ ;
	}
	//alert(jour);
	if ( annee_mois_jour[1] == 4 || annee_mois_jour[1] == 6 || annee_mois_jour[1] == 9 || annee_mois_jour[1] == 11){
			if(annee_mois_jour[2]> 30) annee_mois_jour[2]= 30;
	}else if ( annee_mois_jour[1] == 2 && annee_mois_jour[0]%4 != 0){
			//alert("3!=");
			if(annee_mois_jour[2]> 28) annee_mois_jour[2]= 28;
	}else if ( annee_mois_jour[1] == 2 && annee_mois_jour[0]%4 == 0){
			//alert("3==");
			if(annee_mois_jour[2]>29 || (mois == -1 && jour == -1 && annee_mois_jour[2]<29)) annee_mois_jour[2]= 29;
			//alert(annee_mois_jour[2]);
	}else {
			if(annee_mois_jour[2]> 31) annee_mois_jour[2]= 31;
	}

	annee_mois_jour[0] += an ;	
	
	CHARannee_mois_jour[0] = annee_mois_jour[0];
	
	if( annee_mois_jour[1]<10)
	CHARannee_mois_jour[1] = "0"+annee_mois_jour[1];
	else	
	CHARannee_mois_jour[1] = annee_mois_jour[1];
	
	if( annee_mois_jour[2]<10)
	CHARannee_mois_jour[2] = "0"+annee_mois_jour[2];
	else	
	CHARannee_mois_jour[2] = annee_mois_jour[2];
	
	if( heure_minute[0]<10)
	CHARheure_minute[0] ="0"+heure_minute[0];
	else	
	CHARheure_minute[0] =heure_minute[0];
	
	if( heure_minute[1]<10)
	CHARheure_minute[1] = "0"+heure_minute[1];
	else
	CHARheure_minute[1] = heure_minute[1];
	
	return CHARannee_mois_jour[0]+"-"+CHARannee_mois_jour[1]+"-"+CHARannee_mois_jour[2]+" "+CHARheure_minute[0]+":"+CHARheure_minute[1]
}

function decalerDateP(date, presets, plus){
	
	if(presets == "2"){
		if(plus)
			return decalerDate(date, 0,0,1,0,0);
		else
			return decalerDate(date, 0,0,-1,0,0);
	}else if(presets == "1"){
		if(plus)
			return decalerDate(date, 0,1,0,0,0);
		else
			return decalerDate(date, 0,-1,0,0,0);
		
	}else if(presets == "LD"){
		if(plus)
			return decalerDate(date, 0,0,1,0,0);
		else
			return decalerDate(date, 0,0,-1,0,0);
		
	}else if(presets == "1 Year"){
		if(plus)
			return decalerDate(date,1, 0,0,0,0);
		else
			return decalerDate(date,-1, 0,0,0,0);
		
	}else{
		alert("ERROR : in 'cal.js' function 'decalerDateP' ");
		return null;
	}
	
}function mouseOverTitre(numGraphe , Onglet){

	var input = document.getElementById("BoutonGraphe"+numGraphe+Onglet);
	var src = input.src;
	if(src.indexOf(".png",0)>=0){
		src = src.substr(0, src.indexOf(".png",0));
		input.setAttribute('src', src.concat("Over.png"));
	}
	
}
	
function mouseOutTitre(numGraphe, Onglet){

	var input = document.getElementById("BoutonGraphe"+numGraphe+Onglet);
	var src = input.src;
			
	if(src.indexOf("Over.png",0)>=0){
		src = src.substr(0, src.indexOf("Over.png",0));
		input.setAttribute('src', src.concat(".png"));
	}
	
}

		
function clickApply(Onglet){
	
	if(Onglet != 'Plus' && Onglet != 'PlusData'){
		document.getElementById('Apply'+Onglet).disabled = true;
		document.getElementById('Apply'+Onglet).style.cursor = "default";
	}
	
	if(Onglet == "Plus"){
			
		if( dijit.byId("SelectIp").value == ""){
			
			if(!document.getElementById('ApplyPlus').disabled)
				alert("Please enter a valid Ip Adress or Host Name ");
			
		}else{
			
			if( estMachine(dijit.byId("SelectIp").value) ){
				var i = 0;
				while(TabIP[i] != dijit.byId("SelectIp").value && i<TabIP.length) i++;
				
				if(i == TabIP.length){
					i = 0;
					while(TabNAME[i] != dijit.byId("SelectIp").value && i<TabNAME.length) i++;
					if(i == TabNAME.length){
						alert("Host not found");
					}else{
						addNewIpTab(TabNAME[i]);	
					}
				}else{
					if(TabNAME[i]=="") addNewIpTab(dijit.byId("SelectIp").value);
					else addNewIpTab(TabNAME[i]);
				}
			}else{
				alert("Host not found");
			}
		}
	
	}else if(Onglet == "PlusData"){
		
		var O = addNewDataTab();
		
		dataPage='&page=1';
		
		setTimeout('ChargerData("'+O+'", "false"); ', 500);
		
	}else{
		
		document.getElementById("presetsApplied"+Onglet).setAttribute('value', document.getElementById("presets"+Onglet).value ) ;
		document.getElementById("presetsApplied"+Onglet).value = document.getElementById("presets"+Onglet).value ;
			
		if(document.getElementById("dateFin"+Onglet).value == ""){
			
			var now = new Date();
			var m = "";
			var d = "";
			var h = "";
			if( now.getMonth()+1 <10)m = "0";
			if( now.getDate() <10)d = "0";
			if( now.getHours() <10)h = "0";
			
			if(document.getElementById("presetsApplied"+Onglet).value == 1)
				document.getElementById("dateFinApplied"+Onglet).setAttribute('value', now.getFullYear()+"-"+m+(now.getMonth()+1)+"-"+d+now.getDate()+" "+"00"+":"+"00");
			else if(document.getElementById("presetsApplied"+Onglet).value == 2)
				document.getElementById("dateFinApplied"+Onglet).setAttribute('value', now.getFullYear()+"-"+m+(now.getMonth()+1)+"-"+d+now.getDate()+" "+h+now.getHours()+":"+"00");
			else alert("error in function.js' line 175");
			
		}else
			document.getElementById("dateFinApplied"+Onglet).setAttribute('value', document.getElementById("dateFin"+Onglet).value ) ;
		 
		if(document.getElementById("dateDeb"+Onglet).value == ""){
			document.getElementById("dateDebApplied"+Onglet).setAttribute('value', decalerDateP( document.getElementById("dateFinApplied"+Onglet).value, document.getElementById("presetsApplied"+Onglet).value, 0 ));
		}else
			document.getElementById("dateDebApplied"+Onglet).setAttribute('value', document.getElementById("dateDeb"+Onglet).value ) ;
			
		initAllZooms(Onglet);
		
		// on a 4 ou 6 fenetres de graphes suivant l'onglet
		var nbFenetres = 4; // 4 fenetres dans les autres onglet que le global
		
		if (document.getElementById(Onglet).isClosable){
			try{dojo.empty("chart1"+Onglet);}catch(e){}
			try{dojo.empty("chart2"+Onglet);}catch(e){}
			try{dojo.empty("chart3"+Onglet);}catch(e){}
			try{dojo.empty("chart4"+Onglet);}catch(e){}
		}else{ // 6 fenetres ds le global
			nbFenetres = 7;
			try{dojo.empty("chart1"+Onglet);}catch(e){}
			try{dojo.empty("chart2"+Onglet);}catch(e){}
			try{dojo.empty("chart3"+Onglet);}catch(e){}
			try{dojo.empty("chart4"+Onglet);}catch(e){}
			try{dojo.empty("chart5"+Onglet);}catch(e){}
			try{dojo.empty("chart6"+Onglet);}catch(e){}
			try{dojo.empty("chart7"+Onglet);}catch(e){}
		}
		
		try{
			for( var i=1 ; i<=nbFenetres; i++){
				var div = document.getElementById("DivGraphe"+i+Onglet);
				var bouton = document.getElementById("BoutonGraphe"+i+Onglet);
				//var boutonActu = document.getElementById("BoutonActu"+i+Onglet);
				
				//boutonActu.style.visibility = 'hidden';
				div.style.display = 'none';
				getParent(bouton, "div").setAttribute('style', 'margin-top: 25px; border: 3px solid #1CC48B;');
				bouton.setAttribute("src", "/images/smallGreenButtonDown.png");
			}
		}catch(e){
		}
			
		try{
			// modification de l'affichage de l'interval de temps
			document.getElementById("timeSpace"+Onglet).innerHTML = document.getElementById("dateDebApplied"+Onglet).value 
															+"<img src='/images/arrow_right.png' style='margin-left: 15px; margin-right: 15px;'>"
															+ document.getElementById("dateFinApplied"+Onglet).value;
			document.getElementById("timeSpaceChange"+Onglet).innerHTML = "";
		}catch(e){}
	}
	
}


		
function clickTitre(numGraphe, Onglet){
	
	// Faire un "mini-Apply" () avant toute action
	
	effacerNone( numGraphe, Onglet );
	
	//setParameters($('formulaire'+Onglet).serialize());
		
	var div = document.getElementById("DivGraphe"+numGraphe+Onglet);
	var bouton = document.getElementById("BoutonGraphe"+numGraphe+Onglet);
	
	
	// setting size of div when opened
	if( div.getDimensions().height != 0 && div.getAttribute('openedHeight') ==0 ){
		div.setAttribute('openedHeight', div.getDimensions().height+30);
	}else if( div.getDimensions().height == 0 && div.getAttribute('openedHeight') ==0 ){
		div.setAttribute('openedHeight', 530);
	}
			
	
	
	if( div.style.display == 'none' ){
		
		div.style.height='0px';
		
		div.style.display = 'block';		
		
		// animate opening of the div
		dojo.animateProperty({
			node: div,
			properties: { height: div.getAttribute('openedHeight') },
			onEnd: function(){
				drawChart(numGraphe, Onglet);
			}
		}).play();
		
		
		getParent(bouton, "div").setAttribute('class', 'graphWinOpened');
		bouton.setAttribute("src", "/images/smallGreenButtonUp.png");
		
		
	}else if( div.style.display == 'block' ){
		
		// animate opening of the div
		dojo.animateProperty({
			node: div,
			properties: { height: 0 },
			onEnd: function(){ 
				emptyChart(numGraphe, Onglet);
				div.style.display = 'none'; 
			}
		}).play();
		
		
		getParent(bouton, "div").setAttribute('class', 'graphWinClosed');
		bouton.setAttribute("src", "/images/smallGreenButtonDown.png");
	}else{
		alert("ERR2 : in function 'clickTitre'");
	}
			
	initZoom(numGraphe, Onglet);
}



		
/*function clickActu(numGraphe, Onglet){
	
	if(Onglet=="Logs"){			
		
		lastScrollTop = document.getElementById('TabLogsDiv').scrollHeight;
		ChargerLogs();
				
	}else {
			
		setParameters($('formulaire'+Onglet).serialize());
		initZoom(numGraphe, Onglet);	
		
		if(Onglet=="Global"){			
			if(numGraphe == 1){	
				dojo.empty("chart1");
				dojo.addOnLoad(makeChart1); 	
			}
			else if(numGraphe == 2){	
				dojo.empty("chart2");
				dojo.addOnLoad(makeChart2);	
			}
			else if(numGraphe == 3){	
				dojo.empty("chart3");
				dojo.addOnLoad(makeChart3);	
			}
			else if(numGraphe == 4){	
				dojo.empty("chart4");
				dojo.addOnLoad(makeChart4);	
				}
			else if(numGraphe == 5){	
				dojo.empty("chart5a");
				dojo.empty("chart5b");
				dojo.addOnLoad(makeChart5a);
				dojo.addOnLoad(makeChart5b);	
			}
			else if(numGraphe == 6){	
				dojo.empty("chart6a");	
				dojo.empty("chart6b");
				dojo.addOnLoad(makeChart6a);	
				dojo.addOnLoad(makeChart6b);	
			}
			else {	alert("ERR1 : in function 'clickTitre'");	}
		}else{
		
			if(numGraphe == 1){	
				dojo.empty("chart"+numGraphe+Onglet);
				dojo.addOnLoad(makeChart11); 	
			}
			else if(numGraphe == 2){	
				dojo.empty("chart"+numGraphe+Onglet);
				dojo.addOnLoad(makeChart12);	
			}
			else if(numGraphe == 3){	
				dojo.empty("chart"+numGraphe+Onglet);
				dojo.addOnLoad(makeChart13);	
			}
			else if(numGraphe == 4){	
				dojo.empty("chart"+numGraphe+"a"+Onglet);
				dojo.empty("chart"+numGraphe+"b"+Onglet);
				dojo.addOnLoad(makeChart14a);	
				dojo.addOnLoad(makeChart14b);	
				}
			else if(numGraphe == 5){	
				dojo.empty("chart"+numGraphe+"a"+Onglet);
				dojo.empty("chart"+numGraphe+"b"+Onglet);
				dojo.addOnLoad(makeChart15a);	
				dojo.addOnLoad(makeChart15b);	
			}
			else if(numGraphe == 6){	
				ChargerData(Onglet);
			}
			else {	alert("ERR1 : in function 'clickActu'");	}
			
		}
	}
	
	

}

*/		
		
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
	
	var rect = document.getElementById(id).getElementsByTagName(tag);
	
	for(var i = 0; i< rect.length; i++) {
		var ess = rect[i].getAttribute("fill").replace(/ /, "");
		ess = ess.replace(/rgb\(/, "");
		ess = ess.replace(/\)/, "");
		
		var rgb = ess.split(",");
		
		for(var j=0; j< rgb.length; j++) rgb[j] = myParseInt(rgb[j]);
		
		if(rgb[0] != rgb[1] || rgb[0] != rgb[2]){
			rect[i].setAttribute("style", "cursor: pointer;");
		}
	}
	
}

function makeWhoIs( ip, server ){
	
		var xhr = createXhrObject();

		if(server)
			xhr.open("GET", "dynamic/whois.json?ip="+ip+"&server="+server, true);
		else
			xhr.open("GET", "dynamic/whois.json?ip="+ip, true);
		xhr.onreadystatechange=function() 
		{
			if (xhr.readyState == 4) 
			{
				dijit.byId('dialogWhoIs').setAttribute('title', 'Whois: '+ip);	
				
				if (xhr.status == 200) 
				{
					var JsonWhoIs = eval("(" + xhr.responseText + ")");
					if(JsonWhoIs.errMsg)alert('whois.json Bug Report: "+ JsonWhoIs.errMsg);	
					
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
					document.getElementById('whoIsTextArea'dynamic/).innerHTML = 'dynamic/whois.json?ip="+ip+" not found";
				}
				
				dijit.byId('dialogWhoIs').show();
			}

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
			
				xhr.open("GET", "dynamic/resolv.json?ip="+element.getAttribute('host'), true);
			xhr.onreadystatechange=function() 
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
			
				xhr.open("GET", "dynamic/resolv.json?ip="+value, false);
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
			
				xhr.open("GET", "dynamic/getProtoDesc.json?proto="+element.innerHTML, true);
			xhr.onreadystatechange=function() 
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
			
				xhr.open("GET", "dynamic/getPortServiceName.json?proto="+element.getAttribute('proto')+"&port="+element.innerHTML, true);
			xhr.onreadystatechange=function() 
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

		xhr.open("GET", "dynamic/getConfig.json", true);
		xhr.onreadystatechange=function() 
		{
			if (xhr.readyState == 4) 
			{	
				
				if (xhr.status == 200) 
				{
					var JsonConf = eval("(" + xhr.responseText + ")");
					if(JsonConf.errMsg)alert('getConfig.json Bug Report: "+JsonConf.errMsg);	
					
					var table = document.getElementById('dialogConfTable');
					if ( table.hasChildNodes() ){
						while ( table.childNodes.length >= 1 ){
							table.removeChild( table.firstChild ); 
						} 
					}
					
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
						text = document.createTextNode("checkMacAddress");
						Ntd.appendChild(text);
						Ntr.appendChild(Ntd);
						Ntd = document.createElement("td");
						text = document.createTextNode(JsonConf.checkMacAddress);
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
					document.getElementById('confTexttable'dynamic/).innerHTML = 'dynamic/getConfig.json?ip="+ip+" not found";
				}
								dijit.byId('dialogConf').show();
			}

		}
		xhr.send(null);
	
}
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
// definition des evens click et passage sur graphe

function overLegende(chart, couleur){

	var red = parseInt(""+couleur.charAt(1)+couleur.charAt(2), 16);
	var green = parseInt(""+couleur.charAt(3)+couleur.charAt(4), 16);
	var blue = parseInt(""+couleur.charAt(5)+couleur.charAt(6), 16);
						
	if(red != green || red != blue ){
		colors[1] =  "rgb("+red+", "+green+", "+blue+")";
	
		tabRect = document.getElementById(chart).getElementsByTagName("rect");
	
		clignote();
		clignoteGraph(tabRect,colors[1] );
		
	}
}

function outLegende(chart){

	TR = tabRect;
	tabRect = null;
	//tabRect = document.getElementById(chart).getElementsByTagName("rect");
	try{
		for( var i=0; i<TR.length; i++){
			try{
				var text = ""+ TR[i].getAttribute('fill');
				if(text == colors[2]){
					TR[i].setAttribute('fill', colors[1]);
					TR[i].setAttribute('stroke', "rgb(0, 0 ,0)");
					TR[i].setAttribute('stroke-width', "1");
				}
			}catch(e){}
		}
	}catch(e){}
	//setTOClign=null;
	clearTimeout(setTOClign);
	
	
}



function clickLegende(id){

	try{
		// intialisation de l'onglet plus
		initPlusData();
		
		//alert(ongletActif());
		copyPreset(ongletActif(), "Plus");
		
		var tabFont = document.getElementById(id).getElementsByTagName("font");
		
		if(tabFont[0].innerHTML.split("/")[1] != null){ // ports
			try{
				setPlusTabProto("", tabFont[0].innerHTML.split("/")[1].slice(0,3));
				document.getElementById("portLoc").value = tabFont[0].innerHTML.split("/")[0];		
			}catch(e){
			}				
		}else if(tabFont[0].innerHTML.split("(")[1] != null){ // country or AS
			//alert(isNaN(tabFont[0].innerHTML.split("(")[1].split(")")[0]))
			try{
				if(isNaN(tabFont[0].innerHTML.split("(")[1].split(")")[0]))
					dijit.byId("SelectCountry").setAttribute( 'value' , tabFont[0].innerHTML.split("(")[0] );		
				else{					
					document.getElementById("AS").setAttribute("value", tabFont[0].innerHTML.split("(")[1].split(")")[0]);
					document.getElementById("AS").value = tabFont[0].innerHTML.split("(")[1].split(")")[0];
					document.getElementById("AS").onchange();
				}
			}catch(e){
			}			
		/*}else if(tabFont[0].innerHTML == "TCP" || "UDP" || "OTHERS"){
			alert("hi");*/
		}else{// machine (ip ou name)
			dijit.byId("SelectIp").setAttribute( 'value' , ipFrom(tabFont[0].innerHTML));
		}
		
		animatePlusTab();
		
	}catch(e){
		
	}
	
}


function clignoteGraph(){
	
	setTOClign = setTimeout("clignote();clignoteGraph()",500);
	
}


function clignote(){
	
	try{
		for( var i=0; i<tabRect.length; i++){
			
			var colorText = ""+ tabRect[i].getAttribute('fill');
			
			switch(colorText){
				case colors[1]:
					try{
						tabRect[i].setAttribute('fill', colors[2]);
						tabRect[i].setAttribute('stroke', "rgb(255, 0 ,0)");
						tabRect[i].setAttribute('stroke-width', "2");
					}catch(e){}
					break;

				case colors[2]:
					try{
							tabRect[i].setAttribute('fill', colors[1]);
							tabRect[i].setAttribute('stroke', "rgb(0, 0 ,0)");
							tabRect[i].setAttribute('stroke-width', "1");
					}catch(e){}
				break;

				default:
					break;
			}
				
		}
	}catch(e){
	}
	
}

function clickToPie(label, name, port, proto, dir, direction, multiplePie, JN, service, country, as){
	//alert(name+" : "+ipFrom(name));
//alert("label : "+label+"\n name : "+name+"("+ipFrom(name)+")"+"\n port : "+port+"\n proto : "+proto+"\n dir : "+dir+"\n direction : "+direction+"\n multiplePie : "+multiplePie+"\n JN : "+JN+"\n service : "+service+"\n country : "+country+"\n as : "+as)
	// initialisation du formulaire
	initPlusData();
	
	// remplissage des champs de l'onglet plus (1er partie)
	setPlusTab(label, name, ongletActif());
	
	// check de la valeur de dRDTD egale a celle du champ "disabledRecordDataflowToDatabase" du fichier de conf
	// si dRDTD == false ( !dRDTD == true ) alors affichage des camemberts; sinon, non
	if(!dRDTD && name != " Remainder " && port != " Remainder " && proto != "OTH" && country != " Remainder "){
		
		// sauvegarde du nom du json a utiliser pour le camembert
		JsonName = JN;
		
		// pretraitement du parametre proto
		switch(proto){
			case 'TCP':
				proto = 'tcp';
				break;
			case 'UDP':
				proto = 'udp';
				break;
			case 'OTH':
				proto = 'others';
				break;
			default :
				break;
			}
		
		// remplissage des champs de l'onglet plus (2eme partie)
		setPlusTabProto(label, proto);
			
			
		try{
			document.getElementById("dir").value = dir;
		}catch(e){
			document.getElementById("dir").value = "";
		}
		
		
		if(port != ""){
			if(dir == "<"){
				document.getElementById("portLoc").value = port;
			}else if(dir == ">"){
				document.getElementById("portExt").value =port;	
			}else {
				//document.getElementById("dir").value = "";
			}
		} 
		
		dijit.byId("dialogCamemberts").show();
		document.getElementById("divC2").style.display='none';
		
		if(multiplePie){
			document.getElementById("buttonDialog").style.visibility= "visible";
			document.getElementById("buttonDialog").innerHTML = "Display Ext. Chart";	
			document.getElementById("buttonDialog").innerHTML = "Display Ext. Chart";	
			document.getElementById("camembert1Sub").innerHTML = "Local";
			
		}else{
			document.getElementById("buttonDialog").style.visibility= "hidden";
			document.getElementById("camembert1Sub").innerHTML = "External";
		}
		
		
		// defintion et ecriture des parametres
		// determination de la valeur du preset
		var psetValue;
		if(ongletActif().split('Onglet')[1]){
			psetValue = document.getElementById("presetsApplied"+ongletActif().split('Onglet')[1]).value ;
		}else{
			psetValue = document.getElementById("presetsApplied"+ongletActif()).value ;
		}
		
		// definition des df et dd
		var DD = document.getElementById("dateDebData").value;
		DD = DD.replace(/ /, "%20");
		DD = DD.replace(/:/,"%3A");
		var DF = document.getElementById("dateFinData").value;
		DF = DF.replace(/ /, "%20");
		DF = DF.replace(/:/,"%3A");
		
		
		// ecriture :
		setParameters( null, "dd="+DD+"&df="+DF );
		addToParameters( null, "&dh="+document.getElementById("dh").value+"&pset="+psetValue );
		if(proto!="") addToParameters( null, "&proto="+proto );
		if(port!="") addToParameters( null, "&port="+port );
		if(direction!="") addToParameters( null, "&type="+direction );
		if(service!="") addToParameters( null, "&service="+service );
		if(name!="") addToParameters( null, "&ip="+ipFrom(name) );
		if(country!=""){
			if(country == "All" || country == "N/A"){
				//addToParameters( "&c=" );
			}else{
				if(TabCOUNTRY[country])
					addToParameters( null, "&c="+TabCOUNTRY[country] );
			}
		}
		if(as!=""){
			document.getElementById("AS").setAttribute("value", as);
			document.getElementById("AS").value = as;
			document.getElementById("AS").onchange();
			
			addToParameters( null, "&as="+as );
		}
		if(ongletActif() != "Global" && !document.getElementById(ongletActif()).isClosable) addToParameters( null, "&net="+ongletActif() );
		
		// ajout des parametres complÔøΩmentaire "type" et "ip si nous sommes dans les cas d'un click sur non-port
		// if(port == "") addToParameters( "&type="+direction+"&ip="+ipFrom(name) );
		
		datesTitle = "<br>"+document.getElementById("dateDebData").value+"<img style='margin-left: 15px; margin-right: 15px;' src='/images/arrow_right.png'>"+document.getElementById("dateFinData").value;
		if(name != "" && proto =="") dijit.byId("dialogCamemberts").set('title', "<center>Traffic of "+name+datesTitle+"<center>");
		else if(country != "") dijit.byId("dialogCamemberts").set('title', "<center>Traffic in "+country+datesTitle+"<center>");
		else if(as != "") dijit.byId("dialogCamemberts").set('title', "<center>Traffic of ASN "+as+": "+ resolveASNum(as)+datesTitle+"<center>" );
		else if(port != "") {
			if(name != "") dijit.byId("dialogCamemberts").set('title', "<center>Traffic of "+name+" using port "+port+"/"+proto+datesTitle+"<center>");
			else dijit.byId("dialogCamemberts").set('title', "<center>Using port "+port+"/"+proto+datesTitle+"<center>");
		}
		else if(proto != "") {
			if(name != "") dijit.byId("dialogCamemberts").set('title', "<center>Traffic of "+name+" using protocole "+proto+datesTitle+"<center>");
			else dijit.byId("dialogCamemberts").set('title', "<center>Using protocole "+proto+datesTitle+"<center>"); 
		}
		else dijit.byId("dialogCamemberts").setA('title', "<center>"+datesTitle+"<center>");
		
		dijit.byId("dialogCamemberts").setAttribute('alt', "");
		document.getElementById("dialogCamemberts").setAttribute('alt', "");
		
		// Resizing dialog widget if necessary
		if(dijit.byId("dialogCamemberts").title.length > 200){
			dijit.byId("dialogCamemberts").set('dimensions', [400, 240+dijit.byId("dialogCamemberts").title.length]);
			dijit.byId("dialogCamemberts").layout();
		}else{
			dijit.byId("dialogCamemberts").setAttribute('dimensions', [400, 430]);
			dijit.byId("dialogCamemberts").layout();
		}
		
		// dessin du graphe par dojo
		dojo.empty("camembert1");
		loading("camembert1");
		setTimeout('dojo.addOnLoad(makeChart16a); ', 50);
	}else{
		animatePlusTab();
	}
	
}



function clickMore(){
	if(dijit.byId("dialogCamemberts").dimensions[0] == 800){
		clickMoreAction();
		dijit.byId("dialogCamemberts").setAttribute('dimensions', [400, dijit.byId("dialogCamemberts").get('dimensions')[1]]); 
		dijit.byId("dialogCamemberts").layout();
	}else{
		dijit.byId("dialogCamemberts").setAttribute('dimensions', [800, dijit.byId("dialogCamemberts").get('dimensions')[1]]); 
		dijit.byId("dialogCamemberts").layout();
		setTimeout("clickMoreAction()", 600);
	}
	
}


function clickMoreAction(){
	
	JsonName = JsonName.replace(/Loc/, 'dynamic/Ext");//globalExtHostsServiceTraffic.json";
	
	var button = document.getElementById("buttonDialog");
	
	if(button.innerHTML == "Display Ext. Chart"){

		button.innerHTML = "Hide Ext. Chart";
		document.getElementById("divC2").style.display='block';
		dojo.empty("camembert2");
		loading("camembert2");
		setTimeout('dojo.addOnLoad(makeChart16b); ', 50);
		//JsonName ="";
		//dojo.addOnLoad(makeChart16b); 
	}
	else if(button.innerHTML == "Hide Ext. Chart"){ 
				
		button.innerHTML = "Display Ext. Chart";
		document.getElementById("divC2").style.display='none';
	}
	else alert("eror");
	
	
}


function eventMouse(evt, suffixe1, suffixe2){
	
	// souris dessus
	if(evt.type === "onmouseover"){
		
		var couleur = evt.run.data[evt.index].color; 	// element comparateur de couleur (graphe)
		var item = evt.run.data[evt.index].item;		// element comparateur de nom (legende)

		/*var red = myParseInt(""+couleur.charAt(1)+couleur.charAt(2), 16);
		var green = myParseInt(""+couleur.charAt(3)+couleur.charAt(4), 16);
		var blue = myParseInt(""+couleur.charAt(5)+couleur.charAt(6), 16);
		
		
		if(red != green || red != blue){
			colors[1] = "rgb("+red+", "+green+", "+blue+")";
			colors[2] = "rgb(254, 254, 254)";
									
			// modif. graphe
			var element = document.getElementById( "chart"+suffixe1+suffixe2);
			var tabRect = element.getElementsByTagName("rect");
											
			for( var i=0; i<tabRect.length; i++){
				try{
					var text = ""+ tabRect[i].getAttribute('fill');
					if(text == colors[1]){
						tabRect[i].setAttribute('fill', colors[2]);
						tabRect[i].setAttribute('stroke', "rgb(255, 0 ,0)");
						tabRect[i].setAttribute('stroke-width', "2");
					}
				}catch(e){}
			}*/
			overLegende("chart"+suffixe1+suffixe2, couleur);
									
			// modif legende
			document.getElementById( "legend"+suffixe1+suffixe2+item).setAttribute('style','border:  1px solid black');						
		
	}
	
	
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////	
	// souris dÔøΩpointe		
	if(evt.type === "onmouseout" || evt.type === "onclick"){
		//alert('hi');
		var couleur = evt.run.data[evt.index].color; 	// element comparateur de couleur (graphe)
		var item = evt.run.data[evt.index].item;		// element comparateur de nom (legende)
		
		//alert("chart"+suffixe1+suffixe2);			
		// modif. graphe
		/*var element = document.getElementById( "chart"+suffixe1+suffixe2);
		var tabRect = element.getElementsByTagName("rect");
		
		
		for( var i=0; i<tabRect.length; i++){
			try{
				var text = ""+ tabRect[i].getAttribute('fill');
				if(text == colors[2]){
					tabRect[i].setAttribute('fill', colors[1]);
					tabRect[i].setAttribute('stroke', "rgb(0, 0 ,0)");
					tabRect[i].setAttribute('stroke-width', "1");
				}
				
			}catch(e){}
		}*/
		outLegende("chart"+suffixe1+suffixe2);
		
		// modif legende
		document.getElementById( "legend"+suffixe1+suffixe2+item).setAttribute('style','border:  1px solid white');	
	
	}
	
}






var mySetTheme = function(chart$){
	
	var tabes = document.getElementById(chart$.node.getAttribute('id')).getElementsByTagName('rect');
	//alert(tabes.length);
	var i = 0
	var element = null;
	while(i < tabes.length && element == null){
		if(tabes[i].getAttribute('width') == chart$.plotArea.width+2 && tabes[i].getAttribute('height') == chart$.plotArea.height+2){
			element = tabes[i];
			i = tabes.length;
		}else{
			i++;
		}
	}
	/*
			element = document.createElement("img");
			element.setAttribute('style', "width:600px; height:300px;");
			element.setAttribute('src', '/images/smallGreenButtonDown.png');
	*/
	
	/*var parent = getParent(element, "svg");
	var insertBefore = null;
	i=0;
	for( i=0; i< parent.childNodes.length; i++){
		if(parent.childNodes[i] == element) insertBefore = parent.childNodes[i+1];
	}

	E = document.createElement("img");
	E.setAttribute('style', "width:600px; height:300px;");
	E.setAttribute('src', '/images/smallGreenButtonDown.png');
	
	insertBefore.appendChild(E);*/
	
	
	
	
	
	var ord = ordXAxis(chart$);

	if(chart$.theme.plotArea){
		
		chart$.theme.plotarea.fill.y2 = ord;
		chart$.theme.plotarea.fill.y1 = ord-0.1;
		
		
	}else{
		var MT = null;
		var dc = dojox.charting, themes = dc.themes, Theme = dc.Theme, g = Theme.generateGradient,
		defaultFill = {type: "linear", space: "shape", x1: 0, y1: 0, x2: 0, y2: 100};
		//alert(chart$.theme.axis.minorTick);
		if(chart$.getAxis("y").getScaler().bounds.from < 0 && chart$.getAxis("y").getScaler().bounds.to > 0){
			MT = dojox.charting.themes.Mytheme = new dojox.charting.Theme({
				plotarea: {
					fill:{
						type: "linear",
						x1: 0, x2: 0, y1: ord-0.1, y2: ord,
						colors: [
							{ offset: 0, color: "#ffffff" },
							{ offset: 1, color: "#e5e5e5" }
						]
					}
				},
				axis:{
					majorTick: {color: "#777", width: .5, length: 6},
					minorTick: {color: "#777", width: .5, length: 3}
				}			
			});
		}else if( chart$.getAxis("y").getScaler().bounds.from >= 0 ){
			MT = dojox.charting.themes.Mytheme = new dojox.charting.Theme({
				plotarea:{
					stroke: null,
					fill: "#ffffff"
					//style: {backgroundColor: "red", backgroundImage: "/images/redButton.png", color: "inherit"}
				},
				axis:{
					majorTick: {color: "#777", width: .5, length: 6},
					minorTick: {color: "#777", width: .5, length: 3}
				}
			});
		}else{
			MT = dojox.charting.themes.Mytheme = new dojox.charting.Theme({
				plotarea:{
					stroke: null,
					fill: "#e5e5e5"
				},
				axis:{
					majorTick: {color: "#777", width: .5, length: 6},
					minorTick: {color: "#777", width: .5, length: 3}
				}
			});
		}
		
		
		MT.next = function(elementType, mixin, doPost){
			//ESSS = MT;
			var theme = dc.Theme.prototype.next.apply(this, arguments);
		if(elementType == "line"){
			theme.marker.outline = {width: 2, color: "#fff"};
			theme.series.stroke.width = 3.5;
			theme.marker.stroke.width = 2;
		} else if (elementType == "candlestick"){
			theme.series.stroke.width = 1;
		} else {
			theme.series.stroke.color = "#fff";
		}
		return theme;
				};
	
				
		MT.post = function(theme, elementType){
			theme = Theme.prototype.post.apply(this, arguments);
			if((elementType == "slice" || elementType == "circle") && theme.series.fill && theme.series.fill.type == "radial"){
				theme.series.fill = dojox.gfx.gradutils.reverse(theme.series.fill);
			}
			return theme;
		};
		
		
		chart$ = chart$.setTheme(MT);
		
	}
	
	
	addPlotIOLabels(chart$);
	
}










var addVerticalRightAxis = function(chart$, down, up){

	var from = 0;
	var to = 0;

	for(var i = 0; i< down.length; i++){
		if(down[i]<from)from = down[i];
	}
	for(var i = 0; i< up.length; i++){
		if(up[i]>to)to = up[i];
	}
	
	chart$.addAxis("autre y", {min: from, max: to, leftBottom: false, vertical:true, fixLower: "minor", fixUpper: "minor", natural: true});
	
	chart$.addPlot("default1", {type: "Columns", hAxis: "x", vAxis: "autre y"});

	
}




var changeAxes = function(chart$, chartNum, json$){
	
	unit = json$.data[0].unit;
	factD = json$.data[0].factD;
	unitD = json$.data[0].unitD;
	
	// legende des ordonnÈes de gauche
	try{
		try{
		document.getElementById("unit"+chartNum+ongletActif()).removeChild( document.getElementById("unit"+chartNum+ongletActif()).firstChild ); 
		}catch(e){} 
		
		var text = document.createTextNode(unit);
		document.getElementById("unit"+chartNum+ongletActif()).appendChild(text);
	}catch(e){}  
		
		
	// legende des ordonnÈes de droite
	try{
		try{
		document.getElementById("unitD"+chartNum+ongletActif()).removeChild( document.getElementById("unitD"+chartNum+ongletActif()).firstChild ); 
		}catch(e){} 
			
		var text = document.createTextNode(unitD);
		document.getElementById("unitD"+chartNum+ongletActif()).appendChild(text);
	}catch(e){}  

	
	// changement des labels de l'axe vertical de droite
	try{	
		line = document.getElementById("chart"+chartNum+ongletActif()).getElementsByTagName("line");
		
		if(line.length>0){
			rightestLineX = limitLineX("right", line);
			leftestLineX = limitLineX("left", line);
			
			var chartDivs = document.getElementById("chart"+chartNum+ongletActif()).getElementsByTagName("text");
				var neg = false;
			for(var i=0; i<chartDivs.length; i++){
				try{
					if(rightestLineX < chartDivs[i].x.baseVal[0].value){
						
						//if(chartDivs[i].textContent.replace(/,/g,'').indexOf("h")==-1 && chartDivs[i].textContent.replace(/,/g,'').indexOf("/")==-1){ // on s'assure kan mm que ce n'est pas une legende de l'axe des abscisse (heures "h" ou jours "/")
							
							if(parseInt(chartDivs[i].textContent.replace(/,/g,'')) < 0) chartDivs[i].textContent = (chartDivs[i].textContent.replace(/,/g,'') * (-1));
							
							if(parseInt(chartDivs[i].textContent.replace(/,/g,'') * factD)!=(chartDivs[i].textContent.replace(/,/g,'') * factD)){
								try{
									if(parseInt((chartDivs[i].textContent.replace(/,/g,'') * factD))<10)
										chartDivs[i].textContent = (chartDivs[i].textContent.replace(/,/g,'') * factD).toFixed(3);
									else if(parseInt((chartDivs[i].textContent.replace(/,/g,'') * factD))>=10 && parseInt((chartDivs[i].textContent.replace(/,/g,'') * factD))<100)
										chartDivs[i].textContent = (chartDivs[i].textContent.replace(/,/g,'') * factD).toFixed(2);
									else if(parseInt((chartDivs[i].textContent.replace(/,/g,'') * factD))>=100 && parseInt((chartDivs[i].textContent.replace(/,/g,'') * factD))<1000)
										chartDivs[i].textContent = (chartDivs[i].textContent.replace(/,/g,'') * factD).toFixed(1);
									else
										chartDivs[i].textContent = parseInt(chartDivs[i].textContent.replace(/,/g,'') * factD);
								}catch(e){
								}
							}else{
								chartDivs[i].textContent = parseInt(chartDivs[i].textContent.replace(/,/g,'') * factD);
							}
							
						//}
						
					}
					if(chartDivs[i].x.baseVal[0].value < leftestLineX){
						
						if(parseInt(chartDivs[i].textContent.replace(/,/g,'')) < 0) {
							chartDivs[i].textContent = (chartDivs[i].textContent.replace(/,/g,'') * (-1));
							neg = true;
						}
					}
				}catch(e){}
				
			}
		}
		
	}catch(e){}

		
	// changing axis X stroke to white
	addWhiteAxisX(chart$);

}


function addWhiteAxisX(chart){
	
	try{
	
		/*var ord = ordXAxis(chart);
		var chartLines = chart.node.getElementsByTagName("line");
		
		for(var i = 0; i < chartLines.length; i++){
			if( parseFloat(chartLines[i].getAttribute("y1")).toFixed(3) == ord.toFixed(3) 
							&& chart.plotArea.width == (parseFloat(chartLines[i].getAttribute("x2"))-parseFloat(chartLines[i].getAttribute("x1"))) ){
				chartLines[i].setAttribute("stroke", "rgb(255, 255, 255)");
			}
		}*/
		/*aff = "";
		for(var i=0; i<getParent(chart.node, 'td').childNodes.length; i++){
			aff += i+" : "+getParent(chart.node, 'td').childNodes[i]+"\n";
		}
		alert(aff);*/
		
		var ord = ordXAxis(chart);
		var td = getParent(chart.node, 'td');
		
		if(td.childNodes.length >1 && td.lastChild.tagName == "DIV")
			td.removeChild(td.lastChild);
			
		if( (ord-26) <= (chart.plotArea.height-12)){
			
			line = chart.node.getElementsByTagName("line");
			if(line.length>0){
				rightestLineX = limitLineX("right", line);
				leftestLineX = limitLineX("left", line);
				width = rightestLineX - leftestLineX;
				
				var ord = ordXAxis(chart);
				var E;
				var E1 = document.createElement("div");
				//E1.setAttribute('style', "");
				td.appendChild(E1);
			
				if( (ord-parseInt(ord)) > 0.5) 
					ord = (ord-2).toFixed(0);
				else
					ord = (ord-1).toFixed(0);
				E = document.createElement("div");
				E.setAttribute('style', "position: absolute; background: white; height:3px; width:"+(width-2)+"; margin-left:"+(leftestLineX+2)+"px; margin-top:"+ord+"px;");
				E1.appendChild(E);
				
				E1 = document.createElement("div");
				E1.setAttribute('style', "background: black; height:1px; width:"+(width-2)+"; margin-top: 1px; position: absolute;");
				E.appendChild(E1);
			}
			
		}
		
	}catch(e){
		alert(e+" : "+e.lineNo);
	}
}


function addZoomZero(chart){
	
	try{
		
			
		if(getParent(getParent(chart.node, 'td'), 'tr').childNodes.length >3)
			var td = getParent(getParent(chart.node, 'td'), 'tr').childNodes[3];
		else
			var td = getParent(getParent(chart.node, 'td'), 'tr').childNodes[1];
		
		if(td.childNodes.length >1 && td.lastChild.tagName == "DIV")
			td.removeChild(td.lastChild);

		
		var ord = ordXAxis(chart);
		var E;
		var E1 = document.createElement("div");
		E1.setAttribute('style', "position: absolute");
		td.appendChild(E1);
		
		if( (ord-26) > 15){
			E = document.createElement("img");
			E.setAttribute('src', '/images/maxUp.png');
			E.setAttribute('style', "position: absolute; margin-top: -2;");
			E1.appendChild(E);
		}
		
		E = document.createElement("img");
		E.setAttribute('src', '/images/zero.png');
		if( (ord-26) <= (chart.plotArea.height-12))
			E.setAttribute('style', "position: absolute; margin-top: "+(ord-26)+";");
		else
			E.setAttribute('style', "position: absolute; margin-top: "+(ord-36)+";");
		E1.appendChild(E);
		
		if( (ord-26) < (chart.plotArea.height-12-15)){
			E = document.createElement("img");
			E.setAttribute('src', '/images/maxDown.png');
			E.setAttribute('style', "position: absolute; margin-top: "+(chart.plotArea.height-12)+";");
			E1.appendChild(E);
		}
		
	
		
	}catch(e){
		alert(e+" : "+e.lineNo);
	}
}



function limitLineX(side, line){
	try{
		if(side == "right"){
			rightestLineX = 0;
			for(var i=0; i<line.length; i++){
				if(line[i].x1.baseVal.value == line[i].x2.baseVal.value &&  rightestLineX < line[i].x1.baseVal.value)
					rightestLineX = line[i].x1.baseVal.value;
			}
			return rightestLineX;
		}else if(side == "left"){
			leftestLineX = 0;
			leftestLineX = line[0].x1.baseVal.value;
			for(var i=0; i<line.length; i++){
				if(line[i].x1.baseVal.value == line[i].x2.baseVal.value &&  leftestLineX > line[i].x1.baseVal.value)
					leftestLineX = line[i].x1.baseVal.value;
			}
			return leftestLineX;
		}else
			return null;
	}catch(e){
		alert(e+" :: "+e.lineNo);
	}
}




function addPlotIOLabels(chart){
	
	var ord = ordXAxis(chart);
	
	if( (ord-26) <= (chart.plotArea.height-12)){
		
		var tabes = document.getElementById(chart.node.getAttribute('id')).getElementsByTagName('g');
		
		var newG = document.createElementNS(svgNS,"g");
		newG.setAttribute('transform', 'translate(310, 45)');
		tabes[0].appendChild(newG);
	      
	      
		var newText = document.createElementNS(svgNS,"text");
		newText.setAttributeNS(null,"font-size",30);		
		newText.setAttributeNS(null,"font-family","Verdana");
		newText.setAttributeNS(null,"style", "stroke: #e5e5e5; fill: #e5e5e5 ");
		var textNode = document.createTextNode("OUTGOING");
		newText.appendChild(textNode);
		newG.appendChild(newText);
		
		newG = document.createElementNS(svgNS,"g");
		newG.setAttribute('transform', 'translate(310, 445)');
		tabes[0].appendChild(newG);
	      
	      
		newText = document.createElementNS(svgNS,"text");
		newText.setAttributeNS(null,"font-size",30);		
		newText.setAttributeNS(null,"font-family","Verdana");
		newText.setAttributeNS(null,"style", "stroke: #ffffff; fill: #ffffff ");
		textNode = document.createTextNode("INCOMING");
		newText.appendChild(textNode);
		newG.appendChild(newText);
		
	}
	
}




function drawChart(numGraphe, Onglet){
	
	if(document.getElementById(Onglet).isClosable){	// onglet machine (de 1 ‡ 4) ou data (6)
			
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
			else {	alert("ERR1 : in function 'clickTitre'");	}
		
			
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
			else {	alert("ERR1 : in function 'clickTitre'");	}
			
			
		}
		
}



function emptyChart(numGraphe, Onglet){
	
	
		if(document.getElementById(Onglet).isClosable){	// onglet machine (de 1 ‡ 4) ou data (6)
			if(numGraphe == 1){
				unLoading();
				dojo.empty("chart1"+Onglet);	
			}else if(numGraphe == 2){
				unLoading();
				dojo.empty("chart2"+Onglet);
			}else if(numGraphe == 3){
				unLoading();
				dojo.empty("chart3"+Onglet);
			}else if(numGraphe == 4){
				unLoading();
				dojo.empty("chart4"+Onglet);	
			}else if(numGraphe == 5)alert("error: found a 5");		
			else if(numGraphe == 6){}
			else {	alert("ERR1 : in function 'clickTitre'");	}
		}else { // onglet global ou reseau
			if(numGraphe == 1){
				unLoading();
				dojo.empty("chart1"+Onglet);
			}else if(numGraphe == 2){
				unLoading();
				dojo.empty("chart2"+Onglet);
			}else if(numGraphe == 3){
				unLoading();
				dojo.empty("chart3"+Onglet);
			}else if(numGraphe == 4){
				unLoading();
				dojo.empty("chart4"+Onglet);
			}else if(numGraphe == 5){
				unLoading();
				dojo.empty("chart5"+Onglet);
			}else if(numGraphe == 6){
				unLoading();
				dojo.empty("chart6"+Onglet);		
			}else if(numGraphe == 7){
				unLoading();
				dojo.empty("chart7"+Onglet);		
			}else {	alert("ERR1 : in function 'clickTitre'");	}
		}
		
		
}

		
		
		//dojo.require("dojox.lang.functional");
		
		
		var df = dojox.lang.functional;
		var TabIP=  new Array();
		var TabNAME=  new Array();
		var TabCOUNTRY=  new Array();
		

		
		var parameters="";
		var dataPage="&page=1";
		var lastScrollTop=0;
		var lastDay=null;
		var lastHour=null;
		//var mouseDown = 0;
		var validKey = null;
		var lastLogEntry="";
		var JsonName = "";
		var NbCPH = 0;
		var dRDTD = false;
		var geoIpASNum = "disabled";
		var geoIp = "disabled";
		var isDBMS = false;
		var setTOAnim = null;
		var setTOClign = null;
		var setTOResolv = null;
		var tabRect = null;
		var decalageHoraire = 0;
		var lastAlertIndex = null;
		var serverWhoIsList = {"items":[{"server": ""},
			{"server": "whois.apnic.net"},
			{"server": "whois.afrinic.net"},
			{"server": "whois.arin.net"},
			{"server": "whois.lacnic.net"},
			{"server": "whois.ripe.net"},
			{"server": "whois.cymru.com"},
			{"server": "whois.adamsnames.tc"},
			{"server": "whois.aero"},
			{"server": "whois.afilias.info"},
			{"server": "whois.amnic.net"},
			{"server": "whois.aunic.net"},
			{"server": "whois.ausregistry.net.au"},
			{"server": "whois.belizenic.bz"},
			{"server": "whois.centralnic.net"},
			{"server": "whois.cira.ca"},
			{"server": "whois.cnnic.net.cn"},
			{"server": "whois.dk-hostmaster.dk"},
			{"server": "whois.dns.be"},
			{"server": "whois.dns.lu"},
			{"server": "whois.domain.kg"},
			{"server": "whois.domainregistry.ie"},
			{"server": "whois.domreg.lt"},
			{"server": "whois.educause.net"},
			{"server": "whois.edu.cn"},
			{"server": "whois.eenet.ee"},
			{"server": "whois.eu"},
			{"server": "whois.eu.org"},
			{"server": "whois.ficora.fi"},
			{"server": "whois.hkdnr.net.hk"},
			{"server": "whois.iana.org"},
			{"server": "whois.idnic.net.id"},
			{"server": "whois.internic.net"},
			{"server": "whois.isles.net"},
			{"server": "whois.isoc.org.il"},
			{"server": "whois.krnic.net"},
			{"server": "whois.museum"},
			{"server": "whois.mynic.net.my"},
			{"server": "whois.na-nic.com.na"},
			{"server": "whois.ncst.ernet.in"},
			{"server": "whois.neulevel.biz"},
			{"server": "whois.nic.ac"},
			{"server": "whois.nic.ag"},
			{"server": "whois.nic.as"},
			{"server": "whois.nic.at"},
			{"server": "whois.nic.br"},
			{"server": "whois.nic.cc"},
			{"server": "whois.nic.cd"},
			{"server": "whois.nic.ch"},
			{"server": "whois.nic.ck"},
			{"server": "whois.nic.cl"},
			{"server": "whois.nic.coop"},
			{"server": "whois.nic.cx"},
			{"server": "whois.nic.cz"},
			{"server": "whois.nic.do"},
			{"server": "whois.nic.fr"},
			{"server": "whois.nic.gov"},
			{"server": "whois.nic.hu"},
			{"server": "whois.nic.ir"},
			{"server": "whois.nic.kz"},
			{"server": "whois.nic.la"},
			{"server": "whois.nic.li"},
			{"server": "whois.nic.lk"},
			{"server": "whois.nic.lv"},
			{"server": "whois.nic.mil"},
			{"server": "whois.nic.mm"},
			{"server": "whois.nic.mx"},
			{"server": "whois.nic.name"},
			{"server": "whois.offshore.ai"},
			{"server": "whois.registry.hm"},
			{"server": "whois.ripe.net"},
			{"server": "whois.uaenic.ae"},
			{"server": "whois.usp.ac.fj"},
		]};
		var svgNS = "http://www.w3.org/2000/svg";
		var xlinkNS = "http://www.w3.org/1999/xlink";
		
		
		var colors = [];
		colors[2] = "rgb(254, 254, 254)";
		
		//definitions des onglet et div actifs au demarrage (logs)
		var AncienOnglet = 'Logs';
		var AncienneDiv = 'DivLogs';
		
		
		// Tableaux (dynamiques) pr les zooms des networks
		var Chart1 = new Array();
		var Chart2 = new Array();
		var Chart3 = new Array();
		var Chart4 = new Array();
		var Chart5 = new Array();
		var JsonObj1 = new Array();
		var JsonObj2 = new Array();
		var JsonObj3 = new Array();
		var JsonObj4 = new Array();
		var JsonObj5 = new Array();
		
		
		// Tableaux (dynamiques) pr les zooms des hosts
		var Chart12 = new Array();
		var Chart13 = new Array();
		var Chart14 = new Array
		var JsonObj12 = new Array();
		var JsonObj13 = new Array();
		var JsonObj14 = new Array();
		var MT;
		
		// compteur servant au bipping de l'onglet plus
		var compteur=0;
		var pending=0;
		
		// compteur de (re)chargement (pr serveur temporairement injoignable)
		var reloadCompt=null;
		var retryCompt=null;
		
		// variables de resolution de l'AS
		var rASTO = null;
		var waitingForResolvingAS = false;
				
		var ESSS = 0;
		var ESSSS = 0;
		
		var logAutoRefreshTO = null;
		
		var jsonLocalhosts = {  "items" : [ ] };
		
	
	function creerLegende( jsonObj, suffixe1, suffixe2, nbMaxLines){
	
	// CrÔøΩation manuelle de la legende
	var LTab = document.getElementById("legend"+suffixe1+"Tab"+suffixe2);
						
		
	// Clear Table's children if they was created previously
	if ( LTab.hasChildNodes() ){
		while ( LTab.childNodes.length >= 1 ){
			LTab.removeChild( LTab.firstChild );   	
		} 
	}
	
						
	var TBody = document.createElement("tbody");
						
	LTab.appendChild(TBody);
	LTab.insertBefore(TBody, LTab.firstChild);
					
	var x=0;
	var y=0;
	var j=0;
	var colonne = 1;
	//var tableau = new Array(jsonObj.data[0].nbItems);
	var tableau = new Array();	
	
	//for( var i = 0; i< tableau.length; i++) tableau[i] = new Array(4);
	
	var Ntr = document.createElement("tr");
	
	while(jsonObj.data[2+x] != null){
		while(jsonObj.data[2+x].tab[y] !=null){
			if(jsonObj.data[2+x].tab[y].item != null){
				var existant = false;
				
				for( var i = 0; i< tableau.length; i++) {
					if (tableau[i][0] == jsonObj.data[2+x].tab[y].item)
						existant = true;
				};
				
				if(!existant){
					tableau[i] = new Array(4)
					//if(j>=61)alert(">=");
					tableau[j][0] = jsonObj.data[2+x].tab[y].item;
					tableau[j][1] = jsonObj.data[2+x].tab[y].color;
					if(jsonObj.data[2+x].tab[y].c){ if(x==0 && y ==0) alert('hi'); tableau[j][2] = jsonObj.data[2+x].tab[y].c.toLowerCase();}
					if(jsonObj.data[2+x].tab[y].tooltip) tableau[j][3] = jsonObj.data[2+x].tab[y].tooltip.split("(")[0];
					j++;
				}
			}
			y++;
		}
		y=0;
		x++;
	}
	x=0;
	
	
	tableau.sort(compareLegendArray);
	
	
	var nbColonne = tableau.length / nbMaxLines;
	
 
	for (var l = nbMaxLines -1 ; l >= 0 ; l--){
		var position = TBody.firstChild;
		var Ntr = document.createElement("tr");
		TBody.appendChild(Ntr);
		TBody.insertBefore(Ntr, position);
 
		for (var c = 0; c < nbColonne; c++){
			var i = nbMaxLines * c + l;
			if (i < tableau.length && tableau[i][0] != null){
				var Ntd = document.createElement("td");
				Ntd.setAttribute('id','legend'+suffixe1+suffixe2+tableau[i][0]);
				Ntd.setAttribute('title',tableau[i][3]);
				Ntd.setAttribute('onmouseover', ' overLegende("chart'+suffixe1+suffixe2+'", "' +tableau[i][1]+ ' " ); this.setAttribute("style" ,"border: 1px solid black; cursor: pointer;"); ');
				Ntd.setAttribute('onmouseout', ' outLegende("chart'+suffixe1+suffixe2+'"); this.setAttribute("style","border: 1px solid white; cursor: pointer;"); ');
				Ntd.setAttribute('onclick', ' clickLegende(this.id); ');
				Ntd.setAttribute('style','cursor: pointer; border: 1px solid white');
				Ntr.appendChild(Ntd);
 
				var TABLE = document.createElement("table");
				Ntd.appendChild(TABLE);
				
				var TR = document.createElement("tr");
				TABLE.appendChild(TR);
 
				var TD = document.createElement("td");
				TR.appendChild(TD);
 
				var NDiv = document.createElement("div");
				NDiv.setAttribute('style', "width:10px; height:10px; background:"+tableau[i][1]);
				NDiv.setAttribute('align', 'left');
				TD.appendChild(NDiv);
				
				TD = document.createElement("td");
				TD.setAttribute('style','white-space: nowrap');
				TR.appendChild(TD);
				
				var font = document.createElement("font");
				font.setAttribute('size', 1);
				font.setAttribute('id', 'font'+suffixe1+suffixe2+tableau[i][0]);
				TD.appendChild(font);
 
				var text = document.createTextNode(tableau[i][0]);
				font.appendChild(text);
				
				
				if(tableau[i][2]){
					var img = document.createElement("img");
					img.setAttribute('style', 'margin-left: 5px');
					if(tableau[i][2]=="--") img.setAttribute('src', '/images/flags/unknown.png');
					else img.setAttribute('src', '/images/flags/'+tableau[i][2]+'.png');
					TD.appendChild(img);
				}
				
			}
		}
	}
	
}




function creerLegendeProtocole(JsonObj, index, onglet, Vcolor){

	//Legende
	var LTab = document.getElementById("legend"+index+"Tab"+onglet);
							
	// Clear Table's children if they was created previously
	if ( LTab.hasChildNodes() ){
		while ( LTab.childNodes.length >= 1 ){
			LTab.removeChild( LTab.firstChild );       
		} 
	}
	
	var TBody = document.createElement("tbody");
	
	LTab.appendChild(TBody);
	LTab.insertBefore(TBody, LTab.firstChild);
	
	var x=0;
	var Ntr = document.createElement("tr");
	try{
		while(JsonObj.data[2+x] != null){
			if(JsonObj.data[2+x].name != null){
				if(document.getElementById('legend'+index+JsonObj.data[2+x].name+onglet) == null){
					
					var position = TBody.firstChild;
					
					var Ntr = document.createElement("tr");
					TBody.appendChild(Ntr);
					TBody.insertBefore(Ntr, position);
						
					var Ntd = document.createElement("td");
					Ntd.setAttribute('id', 'legend'+index+JsonObj.data[2+x].name+onglet);
					Ntd.setAttribute('style','border: 1px solid white');
					Ntr.appendChild(Ntd);
					Ntr.insertBefore(Ntd, Ntr.firstChild);
					
					var NDiv = document.createElement("div");
					NDiv.setAttribute('style', "width:10px; height:10px; background: "+Vcolor[x/2]);
					NDiv.setAttribute('align', 'left');
					Ntd.appendChild(NDiv);
					
					var text = document.createTextNode(JsonObj.data[2+x].name);
					Ntr.appendChild(text);	
				}
			
			}
			x++;
		}
		x=0;
	}catch(e){
	}	

}


function purgerLegende( suffixe1, suffixe2 ){
	
	var LTab = document.getElementById("legend"+suffixe1+"Tab"+suffixe2);
						
	// Clear Table's children if they was created previously
	if ( LTab.hasChildNodes() ){
		while ( LTab.childNodes.length >= 1 ){
			LTab.removeChild( LTab.firstChild );   		
		} 
	}

}

function ChangerOnglet(NouvelOnglet){		
	
		try{
			setParameters(null, document.getElementById(NouvelOnglet).getAttribute("params"));
		}catch(e){}
	
		if(AncienOnglet != NouvelOnglet){
			//alert(AncienOnglet+" : "+NouvelOnglet);
			
			if(AncienOnglet == "Alerts") document.getElementById('newAlertsTabGif').style.display = "none";
			
			if(NouvelOnglet == "Logs"){
				lastScrollTop = document.getElementById('TabLogsDiv').scrollHeight;
				fadeNewLogs();
			}
			document.getElementById(NouvelOnglet).className = 'active';
			
			try{
				document.getElementById(AncienOnglet).className = 'inactive';
			}catch(e){}
				
				
			try{
				if(document.getElementById(NouvelOnglet).getAttribute("genre")=="data" && document.getElementById("Datas") ){
					//document.getElementById("Datas").onclick();
					/*tabs = document.getElementById("TabOngletsDatas").getElementsByTagName("li");
					for(var i=0 ; i<tabs.length ; i++)
						tabs[i].setAttribute("underclass", "inactive");
					document.getElementById(NouvelOnglet).setAttribute("underclass", "active");*/
					//document.getElementById(NouvelOnglet).onclick();
					tabs = document.getElementById("TabGroupes").getElementsByTagName("div");
					for(var i=0 ; i<tabs.length ; i++)
						if(tabs[i].id.indexOf("TabOnglets") == 0)
							tabs[i].style.display = "none";
					document.getElementById("TabOngletsDatas").style.display = "block";
					document.getElementById("Datas").style.display = "block";
					document.getElementById(NouvelOnglet).setAttribute("underclass", "active");
				}else if(document.getElementById(NouvelOnglet).getAttribute("genre")=="localhost" && document.getElementById("Localhosts") ){
					//document.getElementById("Localhosts").onclick();
					/*tabs = document.getElementById("TabOngletsLocalhosts").getElementsByTagName("li");
					for(var i=0 ; i<tabs.length ; i++)
						tabs[i].setAttribute("underclass", "inactive");
					document.getElementById(NouvelOnglet).setAttribute("underclass", "active");*/
					//document.getElementById(NouvelOnglet).onclick();
					tabs = document.getElementById("TabGroupes").getElementsByTagName("div");
					for(var i=0 ; i<tabs.length ; i++)
						if(tabs[i].id.indexOf("TabOnglets") == 0)
							tabs[i].style.display = "none";
					document.getElementById("TabOngletsLocalhosts").style.display = "block";
					document.getElementById("Localhosts").style.display = "block";
					document.getElementById(NouvelOnglet).setAttribute("underclass", "active");
				}else{
				}
			}catch(e){}
				
			AncienOnglet = NouvelOnglet;
				
		}
	}
	


function ChangerDiv(NouvelleDiv){
		//alert(AncienneDiv+" : "+NouvelleDiv);
		if(AncienneDiv != NouvelleDiv){
			document.getElementById(NouvelleDiv).className = 'active';
			document.getElementById(NouvelleDiv).style.display = 'block';
			try{
				document.getElementById(AncienneDiv).className = 'inactive';
				document.getElementById(AncienneDiv).style.display = 'none';
			}catch(e){}
			AncienneDiv = NouvelleDiv;
				
		}
	}


function clickOnClose(ongletId){
	
		unLoading();
		
		if(AncienOnglet == ongletId){
			document.getElementById("Global").onclick();
			//ChangerDiv("DivGlobal");
		}
		
		deleteZoomVar(ongletId);
		
		document.getElementById('BigDiv').removeChild(document.getElementById("Div"+ongletId)); 
		
		if(document.getElementById(ongletId).getAttribute("genre") == "data"){
			try{
				if(document.getElementById('TabOngletsDatas').getElementsByTagName("li").length >= 1){
					var i = 0;
					while(document.getElementById('TabOngletsDatas').getElementsByTagName("li")[i].id != ongletId && i < document.getElementById('TabOngletsDatas').getElementsByTagName("li").length ) 
						i++;
					i-=1;
					if(i==-1)i=1;
					document.getElementById('TabOngletsDatas').removeChild(document.getElementById(ongletId)); 
					try{document.getElementById('TabOngletsDatas').getElementsByTagName("li")[i].setAttribute("underclass", "active");}
					catch(e){/*si erreur donc [1] inexistant
							la suite dans le if*/}
					if(document.getElementById('TabOngletsDatas').getElementsByTagName("li").length == 1){
						/*document.getElementById('TabOnglets').appendChild(document.getElementById('TabOngletsDatas').getElementsByTagName("li")[0]); 
						document.getElementById('TabOnglets').removeChild(document.getElementById("Datas")); 
						document.getElementById('AllTabs').removeChild(document.getElementById("TabOngletsDatas")); */
						tempId = document.getElementById('TabOngletsDatas').getElementsByTagName("li")[0].getAttribute("id");
						tempParams = document.getElementById('TabOngletsDatas').getElementsByTagName("li")[0].getAttribute("params");
						document.getElementById('TabOngletsDatas').removeChild(document.getElementById('TabOngletsDatas').getElementsByTagName("li")[0]); 
						setParameters(null, tempParams);
						AjouterOnglet(tempId, true, true, false, "");
						document.getElementById('TabOnglets').removeChild(document.getElementById("Datas")); 
						document.getElementById('TabGroupes').removeChild(document.getElementById("TabOngletsDatas")); 
						
					}else
						document.getElementById('Datas').onclick();
				}else
					document.getElementById('TabOnglets').removeChild(document.getElementById(ongletId)); 
			}catch(e){
				try{
					document.getElementById('TabOnglets').removeChild(document.getElementById(ongletId)); 
				}catch(e){}
			}
		}else if(document.getElementById(ongletId).getAttribute("genre") == "localhost"){
			//alert('hi');
			try{
				if(document.getElementById('TabOngletsLocalhosts').getElementsByTagName("li").length >= 1){
					var i = 0;
					while(document.getElementById('TabOngletsLocalhosts').getElementsByTagName("li")[i].id != ongletId) 
						i++;
					i-=1;
					if(i==-1)i=1;
					document.getElementById('TabOngletsLocalhosts').removeChild(document.getElementById(ongletId)); 
					try{document.getElementById('TabOngletsLocalhosts').getElementsByTagName("li")[i].setAttribute("underclass", "active");}
					catch(e){/*si erreur donc [1] inexistant
							la suite dans le if*/}
					if(document.getElementById('TabOngletsLocalhosts').getElementsByTagName("li").length == 1){
						tempId = document.getElementById('TabOngletsLocalhosts').getElementsByTagName("li")[0].getAttribute("id");
						tempParams = document.getElementById('TabOngletsLocalhosts').getElementsByTagName("li")[0].getAttribute("params");
						document.getElementById('TabOngletsLocalhosts').removeChild(document.getElementById('TabOngletsLocalhosts').getElementsByTagName("li")[0]); 
						setParameters(null, tempParams);
						AjouterOnglet(tempId, false, true, false, "");
						document.getElementById('TabOnglets').removeChild(document.getElementById("Localhosts")); 
						document.getElementById('TabGroupes').removeChild(document.getElementById("TabOngletsLocalhosts")); 
					}else
						document.getElementById('Localhosts').onclick();
				}else
					document.getElementById('TabOnglets').removeChild(document.getElementById(ongletId)); 
			}catch(e){
				//alert("errr= "+e);
				try{
					document.getElementById('TabOnglets').removeChild(document.getElementById(ongletId)); 
				}catch(e){}
			}
		}else
			document.getElementById('TabOnglets').removeChild(document.getElementById(ongletId)); 
		
		if(ongletId=="Datas" && ongletId=="Localhosts"){
			
			tabs = document.getElementById("TabOnglets"+ongletId).getElementsByTagName("li"); 
			for(var i=0; i<tabs.length; i++)
				document.getElementById('BigDiv').removeChild(document.getElementById("Div"+tabs.getAttribute("id"))); 
			
			document.getElementById('AllTabs').removeChild(document.getElementById("TabOnglets"+ongletId)); 
			
		}
		
	}
	
function addNewIpTab(ip){
	
	initZoomVar(ip);
	
	if(document.getElementById(ip) == null){
		if(localhostAlreadyOpened()){
			if(!document.getElementById("Localhosts"))
				AjouterOnglet("Localhosts", false, true, true, "");
			TOTabs = document.getElementById("TabOnglets").getElementsByTagName("li");
			//alert(TOTabs.length)
			for(var i=0; i<TOTabs.length; i++){
				if(TOTabs[i].isClosable && TOTabs[i].getAttribute("genre")=="localhost"){
					var p = parameters;
					tempId = TOTabs[i].getAttribute("id");
					tempPara = TOTabs[i].getAttribute("params");
					//alert(i+" : "+TOTabs.length);
					document.getElementById("TabOnglets").removeChild(TOTabs[i]);
					//alert(TOTabs.length);
					setParameters(null, tempPara);
					AjouterOnglet(tempId, false, true, false, "Localhosts");
					setParameters(null, p);
				}
			}
			AjouterOnglet(ip, false, true, false, "Localhosts");
		}else
			AjouterOnglet(ip, false, true, false, "" );
		copyPreset("Plus", ip);
		document.getElementById("Apply"+ip).onclick();
					//alert(TOTabs.length);
	}else{
		ChangerOnglet(ip);
		ChangerDiv('Div'+ip);
		
		copyPreset("Plus", ip);
		
		try{
			document.getElementById("Apply"+ip).disabled=false;
		}catch(e){
		}
	};
	
}

function addNewDataTab(){
	
	var j = 1;
	while( document.getElementById("Data"+j) != null ) j++;
	
	if(dataAlreadyOpened()){
		if(!document.getElementById("Datas"))
			AjouterOnglet("Datas", false, true, true, "")
		TOTabs = document.getElementById("TabOnglets").getElementsByTagName("li");
		for(var i=0; i<TOTabs.length; i++){
			if(TOTabs[i].isClosable && TOTabs[i].getAttribute("id").indexOf("Data")==0){
				var p = parameters;
				tempId = TOTabs[i].getAttribute("id");
				tempPara = TOTabs[i].getAttribute("params");
			//alert(i+" : "+tempId+" : "+tempPara+" : "+TOTabs.length);
				document.getElementById("TabOnglets").removeChild(TOTabs[i]);
				//alert(TOTabs.length);
				setParameters(null, tempPara);
				AjouterOnglet(tempId, true, true, false, "Datas");
				setParameters(null, p);
			}
		}
		AjouterOnglet("Data"+j, true, true, false, "Datas");
	}else
		AjouterOnglet("Data"+j, true, true, false, "" );
	return "Data"+j;
	
}

		
		
function AjouterOnglet(NouvelOnglet, estData, isClosable, estGroupe, underGroup){
	
		if(estGroupe){
			
			// Creation d'une nouvelle sous-table
			var ND = document.createElement("div");
			
			// Definition des attributs de la Div
			ND.setAttribute('id', "TabOnglets"+NouvelOnglet);
			ND.setAttribute('class', "TabOnglets");
			ND.setAttribute('style', "display: none;");
			
			// Connexion de l'element div √† la BigDiv (definition en tant que fils)
			document.getElementById("TabGroupes").appendChild(ND);		
			
			
			
			/////////////////////////////////////////////////////////////////////////////// ONGLET /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
			// Creation de l'element onglet
			var NO = document.createElement("li");
			//NO.isClosable = isClosable;
			//NO.setAttribute('params', parameters);
			/*if(isClosable){
				if(estData) {
					NO.setAttribute('genre', "data");
				}
				else NO.setAttribute('genre', "localhost");
			}else{*/
				NO.setAttribute('genre', "groupe");
			//}
			
			NO.setAttribute('onclick', "if(document.getElementById('"+NouvelOnglet+"') != null ){clickOnglet('"+NouvelOnglet+"')}"); 
		
			
			E1 = document.createElement("table");
			E1.setAttribute('style', "margin-right: 7px; margin-left: 7px; ");
			E1.setAttribute('cellspacing', 0);
			E1.setAttribute('cellpadding', 0);
			NO.appendChild(E1);
			
			E2 = document.createElement("tbody");
			E1.appendChild(E2);
			
			E1 = document.createElement("tr");
			E2.appendChild(E1);
			
			E2 = document.createElement("td");
			E1.appendChild(E2);
				
			if(NouvelOnglet == "Datas")
				var text = document.createTextNode("Data"); 	// creation du node associ√©
			else
				var text = document.createTextNode(NouvelOnglet); 	// creation du node associ√©
			var font = document.createElement("font");
			font.appendChild(text);
			E2.appendChild(font); 							// connexion du node associ√©
					
			// Definition des attributs de l'onglet
			NO.setAttribute('id', NouvelOnglet);
			
			// Connexion de l'element onglet √† la table des onglet (definition en tant que fils)
			document.getElementById("TabOnglets"+underGroup).appendChild(NO);
					
			if(!underGroup){
				// Recup√©ration du Noeud(node) "position" et Insertion de l'onglet ( avant l'onglet + )
				var NPosition = document.getElementById("TabOnglets");
				var position = document.getElementById("Plus"); 
				NPosition.insertBefore(NO,position);
			}
					
				NO.className = 'inactive';
				
				// crÈation des variables des zooms de l'onglet network
				//initZoomVarNetwork(NouvelOnglet);
	
			
			// resize de la table des onglet utile si les onglet passents a la ligne suivante
			setTabOngletHeight();
			
		}else{

			/////////////////////////////////////////////////////////////////////////////// DIV ASSOCIEE ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
			
			if(!document.getElementById("Div"+NouvelOnglet)){
				// Creation de l'element div
				var ND = document.createElement("div");
				
				// Definition des attributs de la Div
				ND.setAttribute('id', "Div"+NouvelOnglet);
				ND.isClosable = isClosable;
				
				// Connexion de l'element div √† la BigDiv (definition en tant que fils)
				document.getElementById("BigDiv").appendChild(ND);				
				
				// Recup√©ration du Noeud(node) "position" : PEU IMPORTANT
				NPosition = document.getElementById("BigDiv");
				NPosition.insertBefore(ND, NPosition.firstChild);
					
				if(isClosable){			
					ND.className = 'active';
					if(estData){
						creerDivData(NouvelOnglet);
					}else{
						creerDivGraphique(NouvelOnglet);
					}
				}else{
					ND.className = 'inactive';
					ND.setAttribute('style', "display: none");
					creerDivGraphiqueReseau(NouvelOnglet);
				}
			}
			
			/////////////////////////////////////////////////////////////////////////////// ONGLET /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
			// Creation de l'element onglet
			var NO = document.createElement("li");
			NO.isClosable = isClosable;
			NO.setAttribute('params', parameters);
			if(underGroup)NO.setAttribute('groupe', underGroup);
			if(isClosable){
				if(estData) {
					NO.setAttribute('genre', "data");
				}
				else NO.setAttribute('genre', "localhost");
			}else{
				NO.setAttribute('genre', "ssreseau");
			}
			
			NO.setAttribute('onclick', "if(document.getElementById('"+NouvelOnglet+"') != null ){clickOnglet('"+NouvelOnglet+"')}"); 
		
			
			E1 = document.createElement("table");
			E1.setAttribute('style', "margin-right: 7px; margin-left: 7px; ");
			E1.setAttribute('cellspacing', 0);
			E1.setAttribute('cellpadding', 0);
			NO.appendChild(E1);
			
			E2 = document.createElement("tbody");
			E1.appendChild(E2);
			
			E1 = document.createElement("tr");
			E2.appendChild(E1);
			
			E2 = document.createElement("td");
			E1.appendChild(E2);
				
			var text = document.createTextNode(NouvelOnglet); 	// creation du node associ√©
			var font = document.createElement("font");
			font.appendChild(text);
			E2.appendChild(font); 							// connexion du node associ√©
					
			// Definition des attributs de l'onglet
			NO.setAttribute('id', NouvelOnglet);
			
			// Connexion de l'element onglet √† la table des onglet (definition en tant que fils)
			document.getElementById("TabOnglets"+underGroup).appendChild(NO);
					
			if(!underGroup){
				// Recup√©ration du Noeud(node) "position" et Insertion de l'onglet ( avant l'onglet + )
				var NPosition = document.getElementById("TabOnglets");
				var position = document.getElementById("Plus"); 
				NPosition.insertBefore(NO,position);
			}else{
				NO.setAttribute("underClass", "active");
			}
					
					
			if(isClosable){
				E2 = document.createElement("td");
				E1.appendChild(E2);
				
				// bouton fermer de l'onglet
				var button = document.createElement("img");
				button.setAttribute('src', "images/smallRedCloseButton.gif");
				button.setAttribute('style', "margin-top: 4px; margin-left: 5px;");
				button.setAttribute('onmouseover', "this.setAttribute('src', '/images/smallRedCloseButtonOver.gif');");
				button.setAttribute('onmouseout', "this.setAttribute('src', '/images/smallRedCloseButton.gif');");	
				button.setAttribute('onclick', "clickOnClose('"+NouvelOnglet+"')"); 	
				E2.appendChild(button);
					
				if(underGroup) document.getElementById(underGroup).onclick();
				// class = active et changement d'onglet
				NO.className = 'active';
				ChangerOnglet(NouvelOnglet);
				
				// Changer de Div : (Activation/Desactivation du Nouvelle/Ancienne div ; nouvelle div =devient=> ancienne)
				ChangerDiv("Div"+NouvelOnglet);
				
			}else{
				NO.className = 'inactive';
				
				// crÈation des variables des zooms de l'onglet network
				initZoomVarNetwork(NouvelOnglet);
			}
			
			// resize de la table des onglet utile si les onglet passents a la ligne suivante
			setTabOngletHeight();
			
		}
		
	}


function creerDivGraphique(Onglet){
		
		var DIV = document.createElement("div");
		DIV.setAttribute('style', "position: relative; background-color: #EEE; margin-top: 10px;");
		document.getElementById('Div'+Onglet).appendChild(DIV);
		
		var E1 = document.createElement("form");
		E1.setAttribute('id','formulaire'+Onglet);
		E1.setAttribute('onsubmit',"return false;");
		E1.setAttribute('style', "margin-bottom: 0px;");
		
		DIV.appendChild(E1);
		
		var E2 = document.createElement("font");
		var text = document.createTextNode("Presets : ");
		E2.appendChild(text);	
		E1.appendChild(E2);
		
		E2 = document.createElement("select");
		E2.setAttribute('style','cursor: pointer;');
		E2.setAttribute('id','presets'+Onglet);
		E2.setAttribute('onchange', 'mettreChampsAJour(this.value, this.id, "'+Onglet+'");');
		E1.appendChild(E2);
					
		var E3 = document.createElement("option");
		E3.setAttribute('id','defaultPreset'+Onglet);
		E3.setAttribute('value', '2');
		E3.setAttribute('selected', 'selected');
		text = document.createTextNode("Last 24 Hours");
		E3.appendChild(text);
		E2.appendChild(E3);
		
		
		E3 = document.createElement("option");
		E3.setAttribute('id','defaultMonthPreset'+Onglet);
		E3.setAttribute('value', '1');
		//E3.selected;
		text = document.createTextNode("Last Month");
		E3.appendChild(text);
		E2.appendChild(E3);
		
		E3 = document.createElement("option");
		E3.setAttribute('value', '2');
		text = document.createTextNode("24 Hours");
		E3.appendChild(text);
		E2.appendChild(E3);
		
		E3 = document.createElement("option");
		E3.setAttribute('value', '1');
		text = document.createTextNode("1 Month");
		E3.appendChild(text);
		E2.appendChild(E3);
		
		E2 = document.createElement("input");
		E2.setAttribute('type','hidden');
		E2.setAttribute('name', 'pset');		
		E2.setAttribute('id','presetsApplied'+Onglet);
		E2.setAttribute('value','');
		E1.appendChild(E2);
	
	
		E2 = document.createElement("img");       
		E2.setAttribute('title','Previous Month');       
		E2.setAttribute('style','margin-left: 30px' );
		E2.setAttribute('src', '/images/prevMonth.png');
		E2.setAttribute('onmouseout','if(!this.disabled)this.src = "images/prevMonth.png"');
		E2.setAttribute('onmouseover','if(!this.disabled)this.src = "images/prevMonthMO.png"');	
		E2.setAttribute('onclick','if(!this.disabled){ document.getElementById("dateDeb"+ongletActif()).value = decalerDate( document.getElementById("dateDeb"+ongletActif()).value,0,-1,0,0,0 ); document.getElementById("dateDeb"+ongletActif()).onchange();} ');
		E1.appendChild(E2);
		
		E2 = document.createElement("img");
		E2.setAttribute('title','Previous Day');
		E2.setAttribute('style','margin-left: 5px' );
		E2.setAttribute('src', '/images/prevDay.png');	
		E2.setAttribute('onmouseout','if(!this.disabled)this.src = "images/prevDay.png"');
		E2.setAttribute('onmouseover','if(!this.disabled)this.src = "images/prevDayMO.png"');
		E2.setAttribute('onclick','if(!this.disabled){ document.getElementById("dateDeb"+ongletActif()).value = decalerDate( document.getElementById("dateDeb"+ongletActif()).value,0,0,-1,0,0 ); document.getElementById("dateDeb"+ongletActif()).onchange();} ');
		E1.appendChild(E2);
		
		
		E2 = document.createElement("font");
		E2.setAttribute('style','margin-left: 10px' );
		text = document.createTextNode("From : ");
		E2.appendChild(text);	
		E1.appendChild(E2);
		
		E2 = document.createElement("input");
		//E2.setAttribute('readOnly','true');
		E2.setAttribute('class','datePicker');
		E2.setAttribute('id','dateDeb'+Onglet);
		E2.setAttribute('value','');
		E2.setAttribute('onchange', "this.value = DateCoherente(this.value); mettreChampsAJour(document.getElementById('presets"+Onglet+"').value, this.id, '"+Onglet+"');");
		E1.appendChild(E2);
		
		E2 = document.createElement("input");
		E2.setAttribute('type','hidden');
		E2.setAttribute('name', 'dd');	
		E2.setAttribute('id','dateDebApplied'+Onglet);
		E2.setAttribute('value','');
		E1.appendChild(E2);
		
		
		E2 = document.createElement("font");
		E2.innerHTML="&nbsp;&nbsp;&nbsp;";
		text = document.createTextNode(" To : ");
		E2.appendChild(text);	
		E1.appendChild(E2);
		
		E2 = document.createElement("input");
		E2.setAttribute('class','datePicker');
		E2.setAttribute('id','dateFin'+Onglet);
		E2.setAttribute('value','');
		E2.setAttribute('onchange', "this.value = DateCoherente(this.value); mettreChampsAJour(document.getElementById('presets"+Onglet+"').value, this.id, '"+Onglet+"');");
		E1.appendChild(E2);
		
		E2 = document.createElement("input");
		E2.setAttribute('type','hidden');
		E2.setAttribute('name', 'df');		
		E2.setAttribute('id','dateFinApplied'+Onglet);
		E2.setAttribute('value','');
		E1.appendChild(E2);
	
		
		E2 = document.createElement("img");
		E2.setAttribute('title','Next Day');
		E2.setAttribute('style','margin-left: 10px' );
		E2.setAttribute('src', '/images/nextDay.png');	
		E2.setAttribute('onmouseout','if(!this.disabled)this.src = "images/nextDay.png"');
		E2.setAttribute('onmouseover','if(!this.disabled)this.src = "images/nextDayMO.png"');
		E2.setAttribute('onclick',' if(!this.disabled){document.getElementById("dateDeb"+ongletActif()).value = decalerDate( document.getElementById("dateDeb"+ongletActif()).value,0,0,1,0,0 ); document.getElementById("dateDeb"+ongletActif()).onchange();} ');
		E1.appendChild(E2);
		
		E2 = document.createElement("img");
		E2.setAttribute('title','Next Month');
		E2.setAttribute('style','margin-left: 5px' );
		E2.setAttribute('src', '/images/nextMonth.png');	
		E2.setAttribute('onmouseout','if(!this.disabled)this.src = "images/nextMonth.png"');
		E2.setAttribute('onmouseover','if(!this.disabled)this.src = "images/nextMonthMO.png"');
		E2.setAttribute('onclick',' if(!this.disabled){document.getElementById("dateDeb"+ongletActif()).value =  decalerDate( document.getElementById("dateDeb"+ongletActif()).value,0,1,0,0,0 ); document.getElementById("dateDeb"+ongletActif()).onchange();} ');
		E2.setAttribute('id','dateDebApplied'+Onglet);
		E1.appendChild(E2);
		
		
		E2 = document.createElement("font");
		E2.innerHTML="&nbsp;&nbsp;&nbsp;";
		
		var i = 0;
		while(TabNAME[i] != Onglet && i<TabNAME.length) i++;
				
		if(i==TabNAME.length) text = document.createTextNode(" Ip : "+Onglet+"     ");
		else	text = document.createTextNode(" Ip : "+TabIP[i]+"     ");
		E2.appendChild(text);	
		
		E1.appendChild(E2);
		
		E2 = document.createElement("font");
		E2.innerHTML="&nbsp;&nbsp;&nbsp;";
		E1.appendChild(E2);
		
		E2 = document.createElement("input");
		E2.setAttribute('type','hidden');
		E2.setAttribute('name','ip');
		E2.setAttribute('id','formIp'+Onglet);
		E2.setAttribute('title', 'formIp field');
		E2.setAttribute('size', '15');
		E2.setAttribute('value', ipFrom(Onglet));
		
		E1.appendChild(E2);
		
		E2 = document.createElement("input");
		E2.setAttribute('type','button');
		E2.setAttribute('id', 'Apply'+Onglet);
		E2.setAttribute('value', 'Apply');
		E2.setAttribute('title', 'Apply to charts');
		E2.setAttribute('onclick', " clickApply('"+Onglet+"'); setParameters(document.getElementById('"+Onglet+"') , $('formulaire"+Onglet+"').serialize());");
		E1.appendChild(E2);
		
		E2 = document.createElement("input");
		E2.setAttribute('type','hidden');
		E2.setAttribute('name', 'dh');
		E2.setAttribute('value', document.getElementById('dh').value);
		E1.appendChild(E2);
		
		mettreChampsAJour(document.getElementById('presets'+Onglet).value, 'presets'+Onglet, Onglet);
		
		
		// l'affichage de l'interval de temps affichÈ par les graphes
		E1 = document.createElement("div");
		E1.innerHTML = '<table cellspacing=0 cellpadding=0><tr><td style="width: 50%"><center><table><tr><td><img src="images/clock.png" title="Current selection"></td><td><i>:<font id="timeSpace'+Onglet+'" style="margin-left: 15px;"></font></i></td></tr></table></center></td><td id="timeSpaceChange'+Onglet+'" style="width: 50%"></td></tr></table>'
		
		document.getElementById('Div'+Onglet).appendChild(E1);
		
		
		/*
		1ere fenetre (Graphe1)
		*/
		
		DIV = document.createElement("div");
		DIV.setAttribute('style', "margin-top: 10px; border: 3px solid #1CC48B;");
		DIV.setAttribute('class', "graphWinClosed");
		document.getElementById('Div'+Onglet).appendChild(DIV);
		
		var table = document.createElement("table");
		table.setAttribute("cellspacing", 0);
		table.setAttribute("cellpadding", 0);
		DIV.appendChild(table);
		
		var tbody = document.createElement("tbody");
		table.appendChild(tbody);
		
		var tr =  document.createElement("tr");
		tbody.appendChild(tr);
		
		var td = document.createElement("td");
		
		E2 = document.createElement("input");
		E2.setAttribute('type','image');
		E2.setAttribute('src','/images/smallGreenButtonDown.png');
		E2.setAttribute('id','BoutonGraphe1'+Onglet);
		E2.setAttribute('alt', 'Submit button');
		E2.setAttribute('onclick', 'clickTitre(1,"'+Onglet+'")');
		E2.setAttribute('onmouseover', 'mouseOverTitre(1,"'+Onglet+'")');
		E2.setAttribute('onmouseout', 'mouseOutTitre(1,"'+Onglet+'")');
		td.appendChild(E2);
		tr.appendChild(td);
		
		td = document.createElement("td");
		E2 = document.createElement("font");
		E2.setAttribute('size',3);
		E2.setAttribute('style', "margin-left: 10px;");
		text = document.createTextNode("Number of Contacted External Hosts (incoming/outgoing connections)");
		E2.appendChild(text);
		td.appendChild(E2);
		tr.appendChild(td);
		
		
		E1 = document.createElement("div");
		E1.setAttribute('id',"DivGraphe1"+Onglet);
		E1.setAttribute('openedHeight', 0);
		E1.setAttribute('style', "position: relative; display: none; overflow : auto;");
		DIV.appendChild(E1);
		
		E2 = document.createElement("div");
		E2.setAttribute('style', "position : absolute; ");
		E1.appendChild(E2);
		
		E3 =  document.createElement("font");
		E3.setAttribute('id',"unit1"+Onglet);
		E3.setAttribute('style',"margin-left: 30px;");
		E3.setAttribute('size', 1);
		E2.appendChild(E3);
		
		E2 = document.createElement("div");
		E2.setAttribute('id',"chart1"+Onglet);
		E2.setAttribute('style', "width: 800px; height: 300px; float:left; margin-left:1px;");
		E1.appendChild(E2);
		
		E2 = document.createElement("div");
		E2.setAttribute('id',"legend1"+Onglet);
		E2.setAttribute('style', "position: absolute; margin-left: 830px;");
		E1.appendChild(E2);
		
		E3 =  document.createElement("font");
		E3.setAttribute('size', 2);
		E2.appendChild(E3);
		
		E1 = document.createElement("center");
		E3.appendChild(E1);
		
		E3 = document.createElement("u");
		E1.appendChild(E3);
		
		text = document.createTextNode("LEGENDE");
		E3.appendChild(text);
		
		E1 = document.createElement("div");
		E1.setAttribute('id',"legend1Tab"+Onglet);
		E1.setAttribute('style', "height: 300px");
		E2.appendChild(E1);
		
		/*
		2ere fenetre (Graphe2)
		*/
		
		DIV = document.createElement("div");
		DIV.setAttribute('style', "margin-top: 10px; border: 3px solid #1CC48B;");
		DIV.setAttribute('class', "graphWinClosed");
		document.getElementById('Div'+Onglet).appendChild(DIV);
		
		table = document.createElement("table");
		table.setAttribute("cellspacing", 0);
		table.setAttribute("cellpadding", 0);
		DIV.appendChild(table);
		
		tbody = document.createElement("tbody");
		table.appendChild(tbody);
		
		tr =  document.createElement("tr");
		tbody.appendChild(tr);
		
		td = document.createElement("td");
		E2 = document.createElement("input");
		E2.setAttribute('type','image');
		E2.setAttribute('src','/images/smallGreenButtonDown.png');
		E2.setAttribute('id','BoutonGraphe2'+Onglet);
		E2.setAttribute('alt', 'Submit button');
		E2.setAttribute('onclick', 'clickTitre(2,"'+Onglet+'")');
		E2.setAttribute('onmouseover', 'mouseOverTitre(2,"'+Onglet+'")');
		E2.setAttribute('onmouseout', 'mouseOutTitre(2,"'+Onglet+'")');
		td.appendChild(E2);
		tr.appendChild(td);
		
		
		td = document.createElement("td");
		E2 = document.createElement("font");
		E2.setAttribute('size',3);
		E2.setAttribute('style', "margin-left: 10px;");
		text = document.createTextNode("Incoming/Outgoing ");
		E2.appendChild(text);
		td.appendChild(E2);
		tr.appendChild(td);
		
		//***************************
		td = document.createElement("td");
		E2 = document.createElement("select");
		E2.setAttribute('id','hostGraphe2'+Onglet);
		E2.setAttribute('onchange', 'selectGrapheOption("2", "'+Onglet+'")');
		E2.setAttribute('style', 'margin-left: 10px; cursor: pointer;');
		td.appendChild(E2);
		tr.appendChild(td);
		
		
		E3 = document.createElement("option");
		E3.setAttribute('value', 'dynamic/hostProtocolesTraffic.json');
		text = document.createTextNode("Traffic");
		E3.appendChild(text);
		E2.appendChild(E3);
		
		E3 = document.createElement("option");
		E3.setAttribute('value', 'dynamic/hostProtocolesPackets.json');
		text = document.createTextNode("Packets' number");
		E3.appendChild(text);
		E2.appendChild(E3);
		
		td = document.createElement("td");
		E2 = document.createElement("font");
		E2.innerHTML="&nbsp";
		E2.setAttribute('size',3);
		text = document.createTextNode("by Protocoles");
		E2.appendChild(text);
		td.appendChild(E2);
		tr.appendChild(td);
		//*************************
		
		var E = document.createElement("div");
		E.setAttribute('id',"DivGraphe2"+Onglet);
		E.setAttribute('openedHeight', 0);
		E.setAttribute('style', "position: relative; display: none; overflow : auto;");
		DIV.appendChild(E);
		
		E1 = document.createElement("div");
		E.appendChild(E1);
		
		E2 = document.createElement("div");
		E2.setAttribute('style', "position : absolute; ");
		E1.appendChild(E2);
		
		E3 =  document.createElement("font");
		E3.setAttribute('id',"unit2"+Onglet);
		E3.setAttribute('style',"margin-left: 30px;");
		E3.setAttribute('size', 1);
		E2.appendChild(E3);
		
		E2 = document.createElement("div");
		E2.setAttribute('style', "position : absolute; ");
		E1.appendChild(E2);
		
		E3 =  document.createElement("font");
		E3.setAttribute('id',"unitD2"+Onglet);
		E3.setAttribute('style',"margin-left: 750px;");
		E3.setAttribute('size', 1);
		E2.appendChild(E3);
		
		E2 = document.createElement("table");
		E1.appendChild(E2);
		
		E1 = document.createElement("tbody");
		E2.appendChild(E1);
		
		var ETR = document.createElement("tr");
		E1.appendChild(ETR);
		
		var ETD = document.createElement("td");
		ETR.appendChild(ETD);
		
		E2 = document.createElement("div");
		E2.setAttribute('id',"chart2"+Onglet);
		E2.setAttribute('style', "width: 800px; height: 500px; float:left; margin-left:1px;");
		ETD.appendChild(E2);
		
		
		ETD = document.createElement("td");
		ETR.appendChild(ETD);
		
		E2 = document.createElement("div");
		E2.setAttribute('id',"zoomProto"+Onglet);
		ETD.appendChild(E2);
		
		dojo.addOnLoad(function() {
			try{
				var vertical = dojo.byId("zoomProto"+Onglet);
				var slider = new dojox.form.VerticalRangeSlider({
					Class: "zoomAxisSlider",
					intermediateChanges: false,
					showButtons: false,
					style: "height:450px; margin-left:5px; margin-right:50px; margin-bottom: 20px; float: left;",
					name: "zoomProto"+Onglet,
					onChange: function(evt){
						chargeZoomVar(Chart12[Onglet], 2 , JsonObj12[Onglet]);
						zoomYAxis("zoomProto"+Onglet);
					}
				}, vertical);
			}catch(e){alert(e);}
		});
		
		ETD = document.createElement("td");
		ETR.appendChild(ETD);
		
		E2 = document.createElement("div");
		E2.setAttribute('id',"legend2"+Onglet);
		ETD.appendChild(E2);
		
		E3 =  document.createElement("font");
		E3.setAttribute('size', 2);
		E2.appendChild(E3);
		
		E1 = document.createElement("center");
		E3.appendChild(E1);
		
		E3 = document.createElement("u");
		E1.appendChild(E3);
		
		text = document.createTextNode("LEGENDE");
		E3.appendChild(text);
		
		E1 = document.createElement("div");
		E1.setAttribute('id',"legend2Tab"+Onglet);
		E1.setAttribute('style', "height: 300px");
		E2.appendChild(E1);
		
		
		
		/*
		3ere fenetre (Graphe3)
		*/
		
	
		
		DIV = document.createElement("div");
		DIV.setAttribute('style', "margin-top: 10px; border: 3px solid #1CC48B;");
		DIV.setAttribute('class', "graphWinClosed");
		document.getElementById('Div'+Onglet).appendChild(DIV);
		
		table = document.createElement("table");
		table.setAttribute("cellspacing", 0);
		table.setAttribute("cellpadding", 0);
		DIV.appendChild(table);
		
		tbody = document.createElement("tbody");
		table.appendChild(tbody);
		
		tr =  document.createElement("tr");
		tbody.appendChild(tr);
		
		td = document.createElement("td");
		E2 = document.createElement("input");
		E2.setAttribute('type','image');
		E2.setAttribute('src','/images/smallGreenButtonDown.png');
		E2.setAttribute('id','BoutonGraphe3'+Onglet);
		E2.setAttribute('alt', 'Submit button');
		E2.setAttribute('onclick', 'clickTitre(3,"'+Onglet+'")');
		E2.setAttribute('onmouseover', 'mouseOverTitre(3,"'+Onglet+'")');
		E2.setAttribute('onmouseout', 'mouseOutTitre(3,"'+Onglet+'")');
		td.appendChild(E2);
		tr.appendChild(td);
		
		td = document.createElement("td");
		E2 = document.createElement("font");
		E2.setAttribute('size',3);
		E2.setAttribute('style', "margin-left: 10px;");
		text = document.createTextNode("Local Services ");
		E2.appendChild(text);
		td.appendChild(E2);
		tr.appendChild(td);
		
		//***************************
		td = document.createElement("td");
		E2 = document.createElement("select");
		E2.setAttribute('id','hostGraphe3'+Onglet);
		E2.setAttribute('onchange', 'selectGrapheOption("3", "'+Onglet+'")');
		E2.setAttribute('style', 'margin-left: 10px; cursor: pointer;');
		td.appendChild(E2);
		tr.appendChild(td);
		
		
		E3 = document.createElement("option");
		E3.setAttribute('value', 'dynamic/hostTop10ServicesTraffic.json');
		text = document.createTextNode("Traffic");
		E3.appendChild(text);
		E2.appendChild(E3);
		
		E3 = document.createElement("option");
		E3.setAttribute('value', 'dynamic/hostTop10ServicesPackets.json');
		text = document.createTextNode("Packets' number");
		E3.appendChild(text);
		E2.appendChild(E3);
		
		td = document.createElement("td");
		E2 = document.createElement("font");
		E2.innerHTML="&nbsp";
		E2.setAttribute('size',3);
		text = document.createTextNode(" (Top 10)");
		E2.appendChild(text);
		td.appendChild(E2);
		tr.appendChild(td);
		//*************************
		
		
		E = document.createElement("div");
		E.setAttribute('id',"DivGraphe3"+Onglet);
		E.setAttribute('openedHeight', 0);
		E.setAttribute('style', "position: relative; display: none; overflow : auto;");
		DIV.appendChild(E);
		
		E1 = document.createElement("div");
		E.appendChild(E1);
		
		E2 = document.createElement("div");
		E2.setAttribute('style', "position : absolute; ");
		E1.appendChild(E2);
		
		E3 =  document.createElement("font");
		E3.setAttribute('id',"unit3"+Onglet);
		E3.setAttribute('style',"margin-left: 30px;");
		E3.setAttribute('size', 1);
		E2.appendChild(E3);
		
		E2 = document.createElement("div");
		E2.setAttribute('style', "position : absolute; ");
		E1.appendChild(E2);
		
		E3 =  document.createElement("font");
		E3.setAttribute('id',"unitD3"+Onglet);
		E3.setAttribute('style',"margin-left: 750px;");
		E3.setAttribute('size', 1);
		E2.appendChild(E3);
		
		E2 = document.createElement("table");
		E1.appendChild(E2);
		
		E1 = document.createElement("tbody");
		E2.appendChild(E1);
		
		ETR = document.createElement("tr");
		E1.appendChild(ETR);
		
		ETD = document.createElement("td");
		ETR.appendChild(ETD);
		
		E2 = document.createElement("div");
		E2.setAttribute('id',"chart3"+Onglet);
		E2.setAttribute('style', "width: 800px; height: 500px; float:left; margin-left:1px;");
		ETD.appendChild(E2);
		
		
		ETD = document.createElement("td");
		ETR.appendChild(ETD);
		
		E2 = document.createElement("div");
		E2.setAttribute('id',"zoomLoc"+Onglet);
		ETD.appendChild(E2);


		dojo.addOnLoad(function() {
			try{
				var vertical = dojo.byId("zoomLoc"+Onglet);
				
				var slider = new dojox.form.VerticalRangeSlider({
					Class: "zoomAxisSlider",
					intermediateChanges: false,
					showButtons: false,
					style: "height:450px; margin-left:5px; margin-right:50px; margin-bottom: 20px; float: left;",
					name: "zoomLoc"+Onglet,
					onChange: function(evt){
						chargeZoomVar(Chart13[Onglet], 3,  JsonObj13[Onglet]);
						zoomYAxis("zoomLoc"+Onglet);
					}
				}, vertical);
			}catch(e){}
		});
		
		ETD = document.createElement("td");
		ETR.appendChild(ETD);
		
		E2 = document.createElement("div");
		E2.setAttribute('id',"legend3"+Onglet);
		ETD.appendChild(E2);
		
		E3 =  document.createElement("font");
		E3.setAttribute('size', 2);
		E2.appendChild(E3);
		
		E1 = document.createElement("center");
		E3.appendChild(E1);
		
		E3 = document.createElement("u");
		E1.appendChild(E3);
		
		text = document.createTextNode("LEGENDE");
		E3.appendChild(text);
		
		E1 = document.createElement("div");
		E1.setAttribute('id',"legend3Tab"+Onglet);
		E2.appendChild(E1);
		
		

		
		
		
		/*
		4ere fenetre (Graphe4)
		*/
		
		
		DIV = document.createElement("div");
		DIV.setAttribute('style', "margin-top: 10px; border: 3px solid #1CC48B;");
		DIV.setAttribute('class', "graphWinClosed");
		document.getElementById('Div'+Onglet).appendChild(DIV);
		
		table = document.createElement("table");
		table.setAttribute("cellspacing", 0);
		table.setAttribute("cellpadding", 0);
		DIV.appendChild(table);
		
		tbody = document.createElement("tbody");
		table.appendChild(tbody);
		
		tr =  document.createElement("tr");
		tbody.appendChild(tr);
		
		td = document.createElement("td");
		E2 = document.createElement("input");
		E2.setAttribute('type','image');
		E2.setAttribute('src','/images/smallGreenButtonDown.png');
		E2.setAttribute('id','BoutonGraphe4'+Onglet);
		E2.setAttribute('alt', 'Submit button');
		E2.setAttribute('onclick', 'clickTitre(4,"'+Onglet+'")');
		E2.setAttribute('onmouseover', 'mouseOverTitre(4,"'+Onglet+'")');
		E2.setAttribute('onmouseout', 'mouseOutTitre(4,"'+Onglet+'")');
		td.appendChild(E2);
		tr.appendChild(td);
		
		td = document.createElement("td");
		E2 = document.createElement("font");
		E2.setAttribute('size',3);
		E2.setAttribute('style', "margin-left: 10px;");
		text = document.createTextNode("External Services");
		E2.appendChild(text);
		td.appendChild(E2);
		tr.appendChild(td);
		
		//***************************
		td = document.createElement("td");
		E2 = document.createElement("select");
		E2.setAttribute('id','hostGraphe4'+Onglet);
		E2.setAttribute('onchange', 'selectGrapheOption("4", "'+Onglet+'")');
		E2.setAttribute('style', 'margin-left: 10px; cursor: pointer;');
		td.appendChild(E2);
		tr.appendChild(td);
		
		
		E3 = document.createElement("option");
		E3.setAttribute('value', 'dynamic/hostTop10ServicesTraffic.json');
		text = document.createTextNode("Traffic");
		E3.appendChild(text);
		E2.appendChild(E3);
		
		E3 = document.createElement("option");
		E3.setAttribute('value', 'dynamic/hostTop10ServicesPackets.json');
		text = document.createTextNode("Packets' number");
		E3.appendChild(text);
		E2.appendChild(E3);
		
		td = document.createElement("td");
		E2 = document.createElement("font");
		E2.innerHTML="&nbsp";
		E2.setAttribute('size',3);
		text = document.createTextNode(" (Top 10)");
		E2.appendChild(text);
		td.appendChild(E2);
		tr.appendChild(td);
		//*************************
		
		
		E = document.createElement("div");
		E.setAttribute('id',"DivGraphe4"+Onglet);
		E.setAttribute('openedHeight', 0);
		E.setAttribute('style', "position: relative; display: none; overflow : auto;");
		DIV.appendChild(E);
		
		E1 = document.createElement("div");
		E.appendChild(E1);
		
		E2 = document.createElement("div");
		E2.setAttribute('style', "position : absolute; ");
		E1.appendChild(E2);
		
		E3 =  document.createElement("font");
		E3.setAttribute('id',"unit4"+Onglet);
		E3.setAttribute('style',"margin-left: 30px;");
		E3.setAttribute('size', 1);
		E2.appendChild(E3);
		
		E2 = document.createElement("div");
		E2.setAttribute('style', "position : absolute; ");
		E1.appendChild(E2);
		
		E3 =  document.createElement("font");
		E3.setAttribute('id',"unitD4"+Onglet);
		E3.setAttribute('style',"margin-left: 750px;");
		E3.setAttribute('size', 1);
		E2.appendChild(E3);
		
		E2 = document.createElement("table");
		E1.appendChild(E2);
		
		E1 = document.createElement("tbody");
		E2.appendChild(E1);
		
		ETR = document.createElement("tr");
		E1.appendChild(ETR);
		
		ETD = document.createElement("td");
		ETR.appendChild(ETD);
		
		E2 = document.createElement("div");
		E2.setAttribute('id',"chart4"+Onglet);
		E2.setAttribute('style', "width: 800px; height: 500px; float:left; margin-left:1px;");
		ETD.appendChild(E2);
		
		
		ETD = document.createElement("td");
		ETR.appendChild(ETD);
		
		E2 = document.createElement("div");
		E2.setAttribute('id',"zoomExt"+Onglet);
		ETD.appendChild(E2);
		
		dojo.addOnLoad(function() {
			try{
				var vertical = dojo.byId("zoomExt"+Onglet);
				
				var slider = new dojox.form.VerticalRangeSlider({
					Class: "zoomAxisSlider",
					intermediateChanges: false,
					showButtons: false,
					style: "height:450px; margin-left:5px; margin-right:50px; margin-bottom: 20px; float: left;",
					name: "zoomExt"+Onglet,
					onChange: function(evt){
						chargeZoomVar(Chart14[Onglet], 4,  JsonObj14[Onglet] );
						zoomYAxis("zoomExt"+Onglet);
					}
				}, vertical);
			}catch(e){}
		});
		
		ETD = document.createElement("td");
		ETR.appendChild(ETD);
		
		E2 = document.createElement("div");
		E2.setAttribute('id',"legend4"+Onglet);
		ETD.appendChild(E2);
		
		E3 =  document.createElement("font");
		E3.setAttribute('size', 2);
		E2.appendChild(E3);
		
		E1 = document.createElement("center");
		E3.appendChild(E1);
		
		E3 = document.createElement("u");
		E1.appendChild(E3);
		
		text = document.createTextNode("LEGENDE");
		E3.appendChild(text);
		
		E1 = document.createElement("div");
		E1.setAttribute('id',"legend4Tab"+Onglet);
		E2.appendChild(E1);
		
		
		
		document.getElementById("dateDebApplied"+Onglet).setAttribute('value', document.getElementById("dateDeb"+Onglet).value ) ;
		document.getElementById("dateFinApplied"+Onglet).setAttribute('value', document.getElementById("dateFin"+Onglet).value ) ;
		document.getElementById("presetsApplied"+Onglet).setAttribute('value', document.getElementById("presets"+Onglet).value ) ;
		
		document.getElementById('Apply'+Onglet).disabled = true;

		dojo.addOnLoad(makeCalendar);

		setParameters(document.getElementById(Onglet) , $('formulaire'+Onglet).serialize());
		
	}
	

	
function creerDivData(Onglet){
		
		E1 = document.createElement("div");
		E1.setAttribute('id',"DivGraphe6"+Onglet);
		E1.setAttribute('style', "width: 100%; height: 78%; margin-top:10px;");
		document.getElementById('Div'+Onglet).appendChild(E1);
		
		
		E2 = document.createElement("div");
		E2.setAttribute('id',"TabData"+Onglet);
		// inutile car nous la rendrons visible une fois que le tableau sera completÈ a 100%
		//E2.setAttribute('style', "width: 100%; border: 1px solid #6c6; margin: 2px; height: 98%; overflow-y: auto;");
		E1.appendChild(E2);
		
		/*E3 = document.createElement("table");
		E3.setAttribute('style', 'width: 100%; height: 93%;');
		E3.setAttribute('id',"TabData");
		E3.setAttribute('cellspacing',"0");
		E3.setAttribute('cellpadding',"0");
		E2.appendChild(E3);*/
		
		E2 = document.createElement("center");
		document.getElementById('Div'+Onglet).appendChild(E2);
		
		E1 = document.createElement("div");
		E1.setAttribute('id',"DivResults6"+Onglet);
		E1.setAttribute('style', "width: 100%; height: 15px;");
		E2.appendChild(E1);
		
		E2 = document.createElement("div");
		document.getElementById('Div'+Onglet).appendChild(E2);
		
		E3 = document.createElement("center");
		E2.appendChild(E3);
		
		E2 = document.createElement("div");
		E2.setAttribute('style', 'width: 100%; white-space: nowrap;');
		E2.setAttribute('id',"Buttons"+Onglet);
		E3.appendChild(E2);
		
	}
	
	
	
	
function creerDivGraphiqueReseau(Onglet){
		
		var DIV = document.createElement("div");
		DIV.setAttribute('style', "position: relative; background-color: #EEE; margin-top: 10px;");
		document.getElementById('Div'+Onglet).appendChild(DIV);
		
		var E1 = document.createElement("form");
		E1.setAttribute('id','formulaire'+Onglet);
		E1.setAttribute('onsubmit',"return false;");
		E1.setAttribute('style', "margin-bottom: 0px;");
		
		DIV.appendChild(E1);
		
		var E2 = document.createElement("font");
		var text = document.createTextNode("Presets : ");
		E2.appendChild(text);	
		E1.appendChild(E2);
		
		E2 = document.createElement("select");
		E2.setAttribute('id','presets'+Onglet);
		E2.setAttribute('style','cursor: pointer;');
		E2.setAttribute('onchange', 'mettreChampsAJour(this.value, this.id, "'+Onglet+'");');
		E1.appendChild(E2);
					
		var E3 = document.createElement("option");
		E3.setAttribute('id','defaultPreset'+Onglet);
		E3.setAttribute('value', '2');
		E3.setAttribute('selected', 'selected');
		text = document.createTextNode("Last 24 Hours");
		E3.appendChild(text);
		E2.appendChild(E3);
		
		
		E3 = document.createElement("option");
		E3.setAttribute('id','defaultMonthPreset'+Onglet);
		E3.setAttribute('value', '1');
		//E3.selected;
		text = document.createTextNode("Last Month");
		E3.appendChild(text);
		E2.appendChild(E3);
		
		E3 = document.createElement("option");
		E3.setAttribute('value', '2');
		text = document.createTextNode("24 Hours");
		E3.appendChild(text);
		E2.appendChild(E3);
		
		E3 = document.createElement("option");
		E3.setAttribute('value', '1');
		text = document.createTextNode("1 Month");
		E3.appendChild(text);
		E2.appendChild(E3);
		
		E2 = document.createElement("input");
		E2.setAttribute('type','hidden');
		E2.setAttribute('name', 'pset');		
		E2.setAttribute('id','presetsApplied'+Onglet);
		E2.setAttribute('value','');
		E1.appendChild(E2);
	
	
		E2 = document.createElement("img");       
		E2.setAttribute('title','Previous Month');       
		E2.setAttribute('style','margin-left: 30px' );
		E2.setAttribute('src', '/images/prevMonth.png');
		E2.setAttribute('onmouseout','if(!this.disabled)this.src = "images/prevMonth.png"');
		E2.setAttribute('onmouseover','if(!this.disabled)this.src = "images/prevMonthMO.png"');	
		E2.setAttribute('onclick','if(!this.disabled){ document.getElementById("dateDeb"+ongletActif()).value = decalerDate( document.getElementById("dateDeb"+ongletActif()).value,0,-1,0,0,0 ); document.getElementById("dateDeb"+ongletActif()).onchange();} ');
		E1.appendChild(E2);
		
		E2 = document.createElement("img");
		E2.setAttribute('title','Previous Day');
		E2.setAttribute('style','margin-left: 5px' );
		E2.setAttribute('src', '/images/prevDay.png');	
		E2.setAttribute('onmouseout','if(!this.disabled)this.src = "images/prevDay.png"');
		E2.setAttribute('onmouseover','if(!this.disabled)this.src = "images/prevDayMO.png"');
		E2.setAttribute('onclick','if(!this.disabled){ document.getElementById("dateDeb"+ongletActif()).value = decalerDate( document.getElementById("dateDeb"+ongletActif()).value,0,0,-1,0,0 ); document.getElementById("dateDeb"+ongletActif()).onchange();} ');
		E1.appendChild(E2);
		
		
		E2 = document.createElement("font");
		E2.setAttribute('style','margin-left: 10px' );
		text = document.createTextNode("From : ");
		E2.appendChild(text);	
		E1.appendChild(E2);
		
		E2 = document.createElement("input");
		//E2.setAttribute('readOnly','true');
		E2.setAttribute('class','datePicker');
		E2.setAttribute('id','dateDeb'+Onglet);
		E2.setAttribute('value','');
		E2.setAttribute('onchange', "this.value = DateCoherente(this.value); mettreChampsAJour(document.getElementById('presets"+Onglet+"').value, this.id, '"+Onglet+"');");
		E1.appendChild(E2);
		
		E2 = document.createElement("input");
		E2.setAttribute('type','hidden');
		E2.setAttribute('name', 'dd');	
		E2.setAttribute('id','dateDebApplied'+Onglet);
		E2.setAttribute('value','');
		E1.appendChild(E2);
		
		
		E2 = document.createElement("font");
		E2.innerHTML="&nbsp;&nbsp;&nbsp;";
		text = document.createTextNode(" To : ");
		E2.appendChild(text);	
		E1.appendChild(E2);
		
		E2 = document.createElement("input");
		E2.setAttribute('class','datePicker');
		E2.setAttribute('id','dateFin'+Onglet);
		E2.setAttribute('value','');
		E2.setAttribute('onchange', "this.value = DateCoherente(this.value); mettreChampsAJour(document.getElementById('presets"+Onglet+"').value, this.id, '"+Onglet+"');");
		E1.appendChild(E2);
		
		E2 = document.createElement("input");
		E2.setAttribute('type','hidden');
		E2.setAttribute('name', 'df');		
		E2.setAttribute('id','dateFinApplied'+Onglet);
		E2.setAttribute('value','');
		E1.appendChild(E2);
	
		
		E2 = document.createElement("img");
		E2.setAttribute('title','Next Day');
		E2.setAttribute('style','margin-left: 10px' );
		E2.setAttribute('src', '/images/nextDay.png');	
		E2.setAttribute('onmouseout','if(!this.disabled)this.src = "images/nextDay.png"');
		E2.setAttribute('onmouseover','if(!this.disabled)this.src = "images/nextDayMO.png"');
		E2.setAttribute('onclick',' if(!this.disabled){document.getElementById("dateDeb"+ongletActif()).value = decalerDate( document.getElementById("dateDeb"+ongletActif()).value,0,0,1,0,0 ); document.getElementById("dateDeb"+ongletActif()).onchange();} ');
		E1.appendChild(E2);
		
		E2 = document.createElement("img");
		E2.setAttribute('title','Next Month');
		E2.setAttribute('style','margin-left: 5px' );
		E2.setAttribute('src', '/images/nextMonth.png');	
		E2.setAttribute('onmouseout','if(!this.disabled)this.src = "images/nextMonth.png"');
		E2.setAttribute('onmouseover','if(!this.disabled)this.src = "images/nextMonthMO.png"');
		E2.setAttribute('onclick',' if(!this.disabled){document.getElementById("dateDeb"+ongletActif()).value =  decalerDate( document.getElementById("dateDeb"+ongletActif()).value,0,1,0,0,0 ); document.getElementById("dateDeb"+ongletActif()).onchange();} ');
		E2.setAttribute('id','dateDebApplied'+Onglet);
		E1.appendChild(E2);
		
		
		E2 = document.createElement("font");
		E2.innerHTML="&nbsp;&nbsp;&nbsp;";
		
		//var i = 0;
		//while(TabNAME[i] != Onglet && i<TabNAME.length) i++;
				
		//if(i==TabNAME.length) text = document.createTextNode(" Ip : "+Onglet+"     ");
		//else	text = document.createTextNode(" Ip : "+TabIP[i]+"     ");
		//E2.appendChild(text);	
		
		//E1.appendChild(E2);
		
		//E2 = document.createElement("font");
		//E2.innerHTML="&nbsp;&nbsp;&nbsp;";
		//E1.appendChild(E2);
		
		E2 = document.createElement("input");
		E2.setAttribute('type','hidden');
		E2.setAttribute('name','net');
		E2.setAttribute('value', Onglet);
		//E2.setAttribute('id','formIp'+Onglet);
		//E2.setAttribute('title', 'formIp field');
		//E2.setAttribute('size', '15');
		
		E1.appendChild(E2);
		
		E2 = document.createElement("input");
		E2.setAttribute('type','button');
		E2.setAttribute('id', 'Apply'+Onglet);
		E2.setAttribute('style', 'margin-left: 25px;');
		E2.setAttribute('value', 'Apply');
		E2.setAttribute('title', 'Apply to charts');
		E2.setAttribute('onclick', " clickApply('"+Onglet+"'); setParameters(document.getElementById('"+Onglet+"') , $('formulaire"+Onglet+"').serialize());");
		E1.appendChild(E2);
		
		E2 = document.createElement("input");
		E2.setAttribute('type','hidden');
		E2.setAttribute('name', 'dh');
		E2.setAttribute('value', document.getElementById('dh').value);
		E1.appendChild(E2);
		
		mettreChampsAJour(document.getElementById('presets'+Onglet).value, 'presets'+Onglet, Onglet);
		
		
		// l'affichage de l'interval de temps affichÈ par les graphes
		E1 = document.createElement("div");
		E1.innerHTML ='<table cellspacing=0 cellpadding=0><tr><td style="width: 50%"><center><table><tr><td><img src="images/clock.png" title="Current selection"></td><td><i>:<font id="timeSpace'+Onglet+'" style="margin-left: 15px;"></font></i></td></tr></table></center></td><td id="timeSpaceChange'+Onglet+'" style="width: 50%"></td></tr></table>'
		
		document.getElementById('Div'+Onglet).appendChild(E1);
		
		
		
		//1ere fenetre (Graphe1)
		
		
		DIV = document.createElement("div");
		DIV.setAttribute('style', "margin-top: 10px; border: 3px solid #1CC48B;");
		DIV.setAttribute('class', "graphWinClosed");
		document.getElementById('Div'+Onglet).appendChild(DIV);
		
		table = document.createElement("table");
		table.setAttribute("cellspacing", 0);
		table.setAttribute("cellpadding", 0);
		DIV.appendChild(table);
		
		tbody = document.createElement("tbody");
		table.appendChild(tbody);
		
		tr =  document.createElement("tr");
		tbody.appendChild(tr);
		
		td = document.createElement("td");
		E2 = document.createElement("input");
		E2.setAttribute('type','image');
		E2.setAttribute('src','/images/smallGreenButtonDown.png');
		E2.setAttribute('id','BoutonGraphe1'+Onglet);
		E2.setAttribute('alt', 'Submit button');
		E2.setAttribute('onclick', 'clickTitre(1,"'+Onglet+'")');
		E2.setAttribute('onmouseover', 'mouseOverTitre(1,"'+Onglet+'")');
		E2.setAttribute('onmouseout', 'mouseOutTitre(1,"'+Onglet+'")');
		td.appendChild(E2);
		tr.appendChild(td);
		
		td = document.createElement("td");
		E2 = document.createElement("font");
		E2.setAttribute('size',3);
		E2.setAttribute('style', "margin-left: 10px;");
		text = document.createTextNode("Incoming/Outgoing Traffic by");
		E2.appendChild(text);
		td.appendChild(E2);
		tr.appendChild(td);
		
		//***************************
		td = document.createElement("td");
		E2 = document.createElement("select");
		E2.setAttribute('id','globalGraphe1'+Onglet);
		E2.setAttribute('onchange', 'selectGrapheOption("1", "'+Onglet+'")');
		E2.setAttribute('style', 'margin-left: 10px; cursor: pointer;');
		td.appendChild(E2);
		tr.appendChild(td);
		
		
		E3 = document.createElement("option");
		E3.setAttribute('value', 'dynamic/netTop10HostsTraffic.json');
		E3.selected = 'selected';
		text = document.createTextNode("Local Hosts (Top 10)");
		E3.appendChild(text);
		E2.appendChild(E3);
		
		E3 = document.createElement("option");
		E3.setAttribute('value', 'dynamic/netTop10CountryTraffic.json');
		text = document.createTextNode("Country (Top 10)");
		E3.appendChild(text);
		E2.appendChild(E3);
		
		E3 = document.createElement("option");
		E3.setAttribute('value', 'dynamic/netTop10asTraffic.json');
		text = document.createTextNode("Autonomous System (Top 10)");
		E3.appendChild(text);
		E2.appendChild(E3);
		
		E3 = document.createElement("option");
		E3.setAttribute('value', 'dynamic/netProtocolesTraffic.json');
		text = document.createTextNode("Protocoles");
		E3.appendChild(text);
		E2.appendChild(E3);
		//*************************
		
		
		var E = document.createElement("div");
		E.setAttribute('id',"DivGraphe1"+Onglet);
		E.setAttribute('openedHeight', 0);
		E.setAttribute('style', "position: relative; display: none; overflow : auto;");
		DIV.appendChild(E);
		
		E1 = document.createElement("div");
		E.appendChild(E1);
		
		E2 = document.createElement("div");
		E2.setAttribute('style', "position : absolute; ");
		E1.appendChild(E2);
		
		E3 =  document.createElement("font");
		E3.setAttribute('id',"unit1"+Onglet);
		E3.setAttribute('style',"margin-left: 30px;");
		E3.setAttribute('size', 1);
		E2.appendChild(E3);
		
		E2 = document.createElement("div");
		E2.setAttribute('style', "position : absolute; ");
		E1.appendChild(E2);
		
		E3 =  document.createElement("font");
		E3.setAttribute('id',"unitD1"+Onglet);
		E3.setAttribute('style',"margin-left: 750px;");
		E3.setAttribute('size', 1);
		E2.appendChild(E3);
		
		E2 = document.createElement("table");
		E1.appendChild(E2);
		
		E1 = document.createElement("tbody");
		E2.appendChild(E1);
		
		var ETR = document.createElement("tr");
		E1.appendChild(ETR);
		
		var ETD = document.createElement("td");
		ETR.appendChild(ETD);
		
		E2 = document.createElement("div");
		E2.setAttribute('id',"chart1"+Onglet);
		E2.setAttribute('style', "width: 800px; height: 500px; float:left; margin-left:1px;");
		ETD.appendChild(E2);
		
		
		ETD = document.createElement("td");
		ETR.appendChild(ETD);
		
		E2 = document.createElement("div");
		E2.setAttribute('id',"zoomTraffic"+Onglet);
		ETD.appendChild(E2);
		
		dojo.addOnLoad(function() {
			try{
				var vertical = dojo.byId("zoomTraffic"+Onglet);
				var slider = new dojox.form.VerticalRangeSlider({
					Class: "zoomAxisSlider",
					intermediateChanges: false,
					showButtons: false,
					style: "height:450px; margin-left:5px; margin-right:50px; margin-bottom: 20px; float: left;",
					name: "zoomTraffic"+Onglet,
					onChange: function(evt){
						chargeZoomVar(Chart1[Onglet], 1,  JsonObj1[Onglet] );
						zoomYAxis("zoomTraffic"+Onglet);
					}
				}, vertical);
			}catch(e){alert(e);}
		});
		
		ETD = document.createElement("td");
		ETR.appendChild(ETD);
		
		E2 = document.createElement("div");
		E2.setAttribute('id',"legend1"+Onglet);
		ETD.appendChild(E2);
		
		E3 =  document.createElement("font");
		E3.setAttribute('size', 2);
		E2.appendChild(E3);
		
		E1 = document.createElement("center");
		E3.appendChild(E1);
		
		E3 = document.createElement("u");
		E1.appendChild(E3);
		
		text = document.createTextNode("LEGENDE");
		E3.appendChild(text);
		
		E1 = document.createElement("div");
		E1.setAttribute('id',"legend1Tab"+Onglet);
		E2.appendChild(E1);
		
		
		//2ere fenetre (Graphe2)
		
		
		DIV = document.createElement("div");
		DIV.setAttribute('style', "margin-top: 10px; border: 3px solid #1CC48B;");
		DIV.setAttribute('class', "graphWinClosed");
		document.getElementById('Div'+Onglet).appendChild(DIV);
		
		table = document.createElement("table");
		table.setAttribute("cellspacing", 0);
		table.setAttribute("cellpadding", 0);
		DIV.appendChild(table);
		
		tbody = document.createElement("tbody");
		table.appendChild(tbody);
		
		tr =  document.createElement("tr");
		tbody.appendChild(tr);
		
		td = document.createElement("td");
		E2 = document.createElement("input");
		E2.setAttribute('type','image');
		E2.setAttribute('src','/images/smallGreenButtonDown.png');
		E2.setAttribute('id','BoutonGraphe2'+Onglet);
		E2.setAttribute('alt', 'Submit button');
		E2.setAttribute('onclick', 'clickTitre(2,"'+Onglet+'")');
		E2.setAttribute('onmouseover', 'mouseOverTitre(2,"'+Onglet+'")');
		E2.setAttribute('onmouseout', 'mouseOutTitre(2,"'+Onglet+'")');
		td.appendChild(E2);
		tr.appendChild(td);
		
		td = document.createElement("td");
		E2 = document.createElement("font");
		E2.setAttribute('size',3);
		E2.setAttribute('style', "margin-left: 10px;");
		text = document.createTextNode("Incoming/Outgoing Packets Number by");
		E2.appendChild(text);
		td.appendChild(E2);
		tr.appendChild(td);
		
		//***************************
		td = document.createElement("td");
		E2 = document.createElement("select");
		E2.setAttribute('id','globalGraphe2'+Onglet);
		E2.setAttribute('onchange', 'selectGrapheOption("2", "'+Onglet+'")');
		E2.setAttribute('style', 'margin-left: 10px; cursor: pointer;');
		td.appendChild(E2);
		tr.appendChild(td);
		
		
		E3 = document.createElement("option");
		E3.setAttribute('value', 'dynamic/netTop10HostsPackets.json');
		E3.selected = 'selected';
		text = document.createTextNode("Local Hosts (Top 10)");
		E3.appendChild(text);
		E2.appendChild(E3);
		
		E3 = document.createElement("option");
		E3.setAttribute('value', 'dynamic/netTop10CountryPackets.json');
		text = document.createTextNode("Country (Top 10)");
		E3.appendChild(text);
		E2.appendChild(E3);
		
		E3 = document.createElement("option");
		E3.setAttribute('value', 'dynamic/netTop10asPackets.json');
		text = document.createTextNode("Autonomous System (Top 10)");
		E3.appendChild(text);
		E2.appendChild(E3);
		
		E3 = document.createElement("option");
		E3.setAttribute('value', 'dynamic/netProtocolesPackets.json');
		text = document.createTextNode("Protocoles");
		E3.appendChild(text);
		E2.appendChild(E3);
		//*************************
		
		
		E = document.createElement("div");
		E.setAttribute('id',"DivGraphe2"+Onglet);
		E.setAttribute('openedHeight', 0);
		E.setAttribute('style', "position: relative; display: none; overflow : auto;");
		DIV.appendChild(E);
		
		E1 = document.createElement("div");
		E.appendChild(E1);
		
		E2 = document.createElement("div");
		E2.setAttribute('style', "position : absolute; ");
		E1.appendChild(E2);
		
		E3 =  document.createElement("font");
		E3.setAttribute('id',"unit2"+Onglet);
		E3.setAttribute('style',"margin-left: 30px;");
		E3.setAttribute('size', 1);
		E2.appendChild(E3);
		
		E2 = document.createElement("div");
		E2.setAttribute('style', "position : absolute; ");
		E1.appendChild(E2);
		
		E3 =  document.createElement("font");
		E3.setAttribute('id',"unitD2"+Onglet);
		E3.setAttribute('style',"margin-left: 750px;");
		E3.setAttribute('size', 1);
		E2.appendChild(E3);
		
		E2 = document.createElement("table");
		E1.appendChild(E2);
		
		E1 = document.createElement("tbody");
		E2.appendChild(E1);
		
		ETR = document.createElement("tr");
		E1.appendChild(ETR);
		
		ETD = document.createElement("td");
		ETR.appendChild(ETD);
		
		E2 = document.createElement("div");
		E2.setAttribute('id',"chart2"+Onglet);
		E2.setAttribute('style', "width: 800px; height: 500px; float:left; margin-left:1px;");
		ETD.appendChild(E2);
		
		ETD = document.createElement("td");
		ETR.appendChild(ETD);
		
		E2 = document.createElement("div");
		E2.setAttribute('id',"zoomPackets"+Onglet);
		ETD.appendChild(E2);
		
		dojo.addOnLoad(function() {
			try{
				var vertical = dojo.byId("zoomPackets"+Onglet);
				var slider = new dojox.form.VerticalRangeSlider({
					Class: "zoomAxisSlider",
					intermediateChanges: false,
					showButtons: false,
					style: "height:450px; margin-left:5px; margin-right:50px; margin-bottom: 20px; float: left;",
					name: "zoomPackets"+Onglet,
					onChange: function(evt){
						chargeZoomVar(Chart2[Onglet], 2,  JsonObj2[Onglet]);
						zoomYAxis("zoomPackets"+Onglet);
					}
				}, vertical);
			}catch(e){alert(e);}
		});
		
		ETD = document.createElement("td");
		ETR.appendChild(ETD);
		
		E2 = document.createElement("div");
		E2.setAttribute('id',"legend2"+Onglet);
		ETD.appendChild(E2);
		
		E3 =  document.createElement("font");
		E3.setAttribute('size', 2);
		E2.appendChild(E3);
		
		E1 = document.createElement("center");
		E3.appendChild(E1);
		
		E3 = document.createElement("u");
		E1.appendChild(E3);
		
		text = document.createTextNode("LEGENDE");
		E3.appendChild(text);
		
		E1 = document.createElement("div");
		E1.setAttribute('id',"legend2Tab"+Onglet);
		E2.appendChild(E1);
		
		
		
		
		//3ere fenetre (Graphe3)
		
		
		DIV = document.createElement("div");
		DIV.setAttribute('style', "margin-top: 10px; border: 3px solid #1CC48B;");
		DIV.setAttribute('class', "graphWinClosed");
		document.getElementById('Div'+Onglet).appendChild(DIV);
		
		table = document.createElement("table");
		table.setAttribute("cellspacing", 0);
		table.setAttribute("cellpadding", 0);
		DIV.appendChild(table);
		
		tbody = document.createElement("tbody");
		table.appendChild(tbody);
		
		tr =  document.createElement("tr");
		tbody.appendChild(tr);
		
		td = document.createElement("td");
		E2 = document.createElement("input");
		E2.setAttribute('type','image');
		E2.setAttribute('src','/images/smallGreenButtonDown.png');
		E2.setAttribute('id','BoutonGraphe3'+Onglet);
		E2.setAttribute('alt', 'Submit button');
		E2.setAttribute('onclick', 'clickTitre(3,"'+Onglet+'")');
		E2.setAttribute('onmouseover', 'mouseOverTitre(3,"'+Onglet+'")');
		E2.setAttribute('onmouseout', 'mouseOutTitre(3,"'+Onglet+'")');
		td.appendChild(E2);
		tr.appendChild(td);
		
		td = document.createElement("td");
		E2 = document.createElement("font");
		E2.setAttribute('size',3);
		E2.setAttribute('style', "margin-left: 10px;");
		text = document.createTextNode("Local Services");
		E2.appendChild(text);
		td.appendChild(E2);
		tr.appendChild(td);
		
		//***************************
		td = document.createElement("td");
		E2 = document.createElement("select");
		E2.setAttribute('id','globalGraphe3'+Onglet);
		E2.setAttribute('onchange', 'selectGrapheOption("3", "'+Onglet+'")');
		E2.setAttribute('style', 'margin-left: 10px; cursor: pointer;');
		td.appendChild(E2);
		tr.appendChild(td);
		
		
		E3 = document.createElement("option");
		E3.setAttribute('value', 'dynamic/netTop10ServicesTraffic.json');
		text = document.createTextNode("Traffic");
		E3.appendChild(text);
		E2.appendChild(E3);
		
		E3 = document.createElement("option");
		E3.setAttribute('value', 'dynamic/netTop10ServicesPackets.json');
		text = document.createTextNode("Packets' number");
		E3.appendChild(text);
		E2.appendChild(E3);
		
		td = document.createElement("td");
		E2 = document.createElement("font");
		E2.innerHTML="&nbsp;&nbsp;";
		E2.setAttribute('size',3);
		text = document.createTextNode(" (Top 10)");
		E2.appendChild(text);
		td.appendChild(E2);
		tr.appendChild(td);
		//*************************
		
		
		E = document.createElement("div");
		E.setAttribute('id',"DivGraphe3"+Onglet);
		E.setAttribute('openedHeight', 0);
		E.setAttribute('style', "position: relative; display: none; overflow : auto;");
		DIV.appendChild(E);
		
		E1 = document.createElement("div");
		E.appendChild(E1);
		
		E2 = document.createElement("div");
		E2.setAttribute('style', "position : absolute; ");
		E1.appendChild(E2);
		
		E3 =  document.createElement("font");
		E3.setAttribute('id',"unit3"+Onglet);
		E3.setAttribute('style',"margin-left: 30px;");
		E3.setAttribute('size', 1);
		E2.appendChild(E3);
		
		E2 = document.createElement("div");
		E2.setAttribute('style', "position : absolute; ");
		E1.appendChild(E2);
		
		E3 =  document.createElement("font");
		E3.setAttribute('id',"unitD3"+Onglet);
		E3.setAttribute('style',"margin-left: 750px;");
		E3.setAttribute('size', 1);
		E2.appendChild(E3);
		
		E2 = document.createElement("table");
		E1.appendChild(E2);
		
		E1 = document.createElement("tbody");
		E2.appendChild(E1);
		
		ETR = document.createElement("tr");
		E1.appendChild(ETR);
		
		ETD = document.createElement("td");
		ETR.appendChild(ETD);
		
		E2 = document.createElement("div");
		E2.setAttribute('id',"chart3"+Onglet);
		E2.setAttribute('style', "width: 800px; height: 500px; float:left; margin-left:1px;");
		ETD.appendChild(E2);
		
		
		ETD = document.createElement("td");
		ETR.appendChild(ETD);
		
		E2 = document.createElement("div");
		E2.setAttribute('id',"zoomLoc"+Onglet);
		ETD.appendChild(E2);
		
		dojo.addOnLoad(function() {
			try{
				var vertical = dojo.byId("zoomLoc"+Onglet);
				var slider = new dojox.form.VerticalRangeSlider({
					Class: "zoomAxisSlider",
					intermediateChanges: false,
					showButtons: false,
					style: "height:450px; margin-left:5px; margin-right:50px; margin-bottom: 20px; float: left;",
					name: "zoomLoc"+Onglet,
					onChange: function(evt){
						chargeZoomVar(Chart3[Onglet], 3,  JsonObj3[Onglet] );
						zoomYAxis("zoomLoc"+Onglet);
					}
				}, vertical);
			}catch(e){alert(e);}
		});
		
		ETD = document.createElement("td");
		ETR.appendChild(ETD);
		
		E2 = document.createElement("div");
		E2.setAttribute('id',"legend3"+Onglet);
		ETD.appendChild(E2);
		
		E3 =  document.createElement("font");
		E3.setAttribute('size', 2);
		E2.appendChild(E3);
		
		E1 = document.createElement("center");
		E3.appendChild(E1);
		
		E3 = document.createElement("u");
		E1.appendChild(E3);
		
		text = document.createTextNode("LEGENDE");
		E3.appendChild(text);
		
		E1 = document.createElement("div");
		E1.setAttribute('id',"legend3Tab"+Onglet);
		E2.appendChild(E1);
		
		
		
		
		
		//4ere fenetre (Graphe4)
		
		
		
		
		DIV = document.createElement("div");
		DIV.setAttribute('style', "margin-top: 10px; border: 3px solid #1CC48B;");
		DIV.setAttribute('class', "graphWinClosed");
		document.getElementById('Div'+Onglet).appendChild(DIV);
		
		table = document.createElement("table");
		table.setAttribute("cellspacing", 0);
		table.setAttribute("cellpadding", 0);
		DIV.appendChild(table);
		
		tbody = document.createElement("tbody");
		table.appendChild(tbody);
		
		tr =  document.createElement("tr");
		tbody.appendChild(tr);
		
		td = document.createElement("td");
		E2 = document.createElement("input");
		E2.setAttribute('type','image');
		E2.setAttribute('src','/images/smallGreenButtonDown.png');
		E2.setAttribute('id','BoutonGraphe4'+Onglet);
		E2.setAttribute('alt', 'Submit button');
		E2.setAttribute('onclick', 'clickTitre(4,"'+Onglet+'")');
		E2.setAttribute('onmouseover', 'mouseOverTitre(4,"'+Onglet+'")');
		E2.setAttribute('onmouseout', 'mouseOutTitre(4,"'+Onglet+'")');
		td.appendChild(E2);
		tr.appendChild(td);
		
		td = document.createElement("td");
		E2 = document.createElement("font");
		E2.setAttribute('size',3);
		E2.setAttribute('style', "margin-left: 10px;");
		text = document.createTextNode("External Services");
		E2.appendChild(text);
		td.appendChild(E2);
		tr.appendChild(td);
		
		//***************************
		td = document.createElement("td");
		E2 = document.createElement("select");
		E2.setAttribute('id','globalGraphe4'+Onglet);
		E2.setAttribute('onchange', 'selectGrapheOption("4", "'+Onglet+'")');
		E2.setAttribute('style', 'margin-left: 10px; cursor: pointer;');
		td.appendChild(E2);
		tr.appendChild(td);
		
		
		E3 = document.createElement("option");
		E3.setAttribute('value', 'dynamic/netTop10ServicesTraffic.json');
		text = document.createTextNode("Traffic");
		E3.appendChild(text);
		E2.appendChild(E3);
		
		E3 = document.createElement("option");
		E3.setAttribute('value', 'dynamic/netTop10ServicesPackets.json');
		text = document.createTextNode("Packets' number");
		E3.appendChild(text);
		E2.appendChild(E3);
		
		td = document.createElement("td");
		E2 = document.createElement("font");
		E2.innerHTML="&nbsp;&nbsp;";
		E2.setAttribute('size',3);
		text = document.createTextNode(" (Top 10)");
		E2.appendChild(text);
		td.appendChild(E2);
		tr.appendChild(td);
		//*************************
		
		
		var E = document.createElement("div");
		E.setAttribute('id',"DivGraphe4"+Onglet);
		E.setAttribute('openedHeight', 0);
		E.setAttribute('style', "position: relative; display: none; overflow : auto;");
		DIV.appendChild(E);
		
		E1 = document.createElement("div");
		E.appendChild(E1);
		
		E2 = document.createElement("div");
		E2.setAttribute('style', "position : absolute; ");
		E1.appendChild(E2);
		
		E3 =  document.createElement("font");
		E3.setAttribute('id',"unit4"+Onglet);
		E3.setAttribute('style',"margin-left: 30px;");
		E3.setAttribute('size', 1);
		E2.appendChild(E3);
		
		E2 = document.createElement("div");
		E2.setAttribute('style', "position : absolute; ");
		E1.appendChild(E2);
		
		E3 =  document.createElement("font");
		E3.setAttribute('id',"unitD4"+Onglet);
		E3.setAttribute('style',"margin-left: 750px;");
		E3.setAttribute('size', 1);
		E2.appendChild(E3);
		
		E2 = document.createElement("table");
		E1.appendChild(E2);
		
		E1 = document.createElement("tbody");
		E2.appendChild(E1);
		
		ETR = document.createElement("tr");
		E1.appendChild(ETR);
		
		ETD = document.createElement("td");
		ETR.appendChild(ETD);
		
		E2 = document.createElement("div");
		E2.setAttribute('id',"chart4"+Onglet);
		E2.setAttribute('style', "width: 800px; height: 500px; float:left; margin-left:1px;");
		ETD.appendChild(E2);
		
		
		ETD = document.createElement("td");
		ETR.appendChild(ETD);
		
		E2 = document.createElement("div");
		E2.setAttribute('id',"zoomExt"+Onglet);
		ETD.appendChild(E2);
		
		dojo.addOnLoad(function() {
			try{
				var vertical = dojo.byId("zoomExt"+Onglet);
				var slider = new dojox.form.VerticalRangeSlider({
					Class: "zoomAxisSlider",
					intermediateChanges: false,
					showButtons: false,
					style: "height:450px; margin-left:5px; margin-right:50px; margin-bottom: 20px; float: left;",
					name: "zoomExt"+Onglet,
					onChange: function(evt){
						chargeZoomVar(Chart4[Onglet], 4,  JsonObj4[Onglet] );
						zoomYAxis("zoomExt"+Onglet);
					}
				}, vertical);
			}catch(e){alert(e);}
		});
		
		ETD = document.createElement("td");
		ETR.appendChild(ETD);
		
		E2 = document.createElement("div");
		E2.setAttribute('id',"legend4"+Onglet);
		ETD.appendChild(E2);
		
		E3 =  document.createElement("font");
		E3.setAttribute('size', 2);
		E2.appendChild(E3);
		
		E1 = document.createElement("center");
		E3.appendChild(E1);
		
		E3 = document.createElement("u");
		E1.appendChild(E3);
		
		text = document.createTextNode("LEGENDE");
		E3.appendChild(text);
		
		E1 = document.createElement("div");
		E1.setAttribute('id',"legend4Tab"+Onglet);
		E2.appendChild(E1);
		
		

		
		
		//5ere fenetre 
		
		
		DIV = document.createElement("div");
		DIV.setAttribute('style', "margin-top: 10px; border: 3px solid #1CC48B;");
		DIV.setAttribute('class', "graphWinClosed");
		document.getElementById('Div'+Onglet).appendChild(DIV);
		
		table = document.createElement("table");
		table.setAttribute("cellspacing", 0);
		table.setAttribute("cellpadding", 0);
		DIV.appendChild(table);
		
		tbody = document.createElement("tbody");
		table.appendChild(tbody);
		
		tr =  document.createElement("tr");
		tbody.appendChild(tr);
		
		td = document.createElement("td");
		E2 = document.createElement("input");
		E2.setAttribute('type','image');
		E2.setAttribute('src','/images/smallGreenButtonDown.png');
		E2.setAttribute('id','BoutonGraphe5'+Onglet);
		E2.setAttribute('alt', 'Submit button');
		E2.setAttribute('onclick', 'clickTitre(5,"'+Onglet+'")');
		E2.setAttribute('onmouseover', 'mouseOverTitre(5,"'+Onglet+'")');
		E2.setAttribute('onmouseout', 'mouseOutTitre(5,"'+Onglet+'")');
		td.appendChild(E2);
		tr.appendChild(td);
		
		td = document.createElement("td");
		E2 = document.createElement("font");
		E2.setAttribute('size',3);
		E2.setAttribute('style', "margin-left: 10px;");
		text = document.createTextNode("Number of Destinations by Local Hosts (Top 10)");
		E2.appendChild(text);
		td.appendChild(E2);
		tr.appendChild(td);
		
		
		var E = document.createElement("div");
		E.setAttribute('id',"DivGraphe5"+Onglet);
		E.setAttribute('openedHeight', 0);
		E.setAttribute('style', "position: relative; display: none; overflow : auto;");
		DIV.appendChild(E);
		
		E1 = document.createElement("div");
		E.appendChild(E1);
		
		E2 = document.createElement("div");
		E2.setAttribute('style', "position : absolute; ");
		E1.appendChild(E2);
		
		E3 =  document.createElement("font");
		E3.setAttribute('id',"unit5"+Onglet);
		E3.setAttribute('style',"margin-left: 30px;");
		E3.setAttribute('size', 1);
		E2.appendChild(E3);
		
		E2 = document.createElement("table");
		E1.appendChild(E2);
		
		E1 = document.createElement("tbody");
		E2.appendChild(E1);
		
		ETR = document.createElement("tr");
		E1.appendChild(ETR);
		
		ETD = document.createElement("td");
		ETR.appendChild(ETD);
		
		E2 = document.createElement("div");
		E2.setAttribute('id',"chart5"+Onglet);
		E2.setAttribute('style', "width: 800px; height: 500px; float:left; margin-left:1px;");
		ETD.appendChild(E2);
		
		
		ETD = document.createElement("td");
		ETR.appendChild(ETD);
		
		E2 = document.createElement("div");
		E2.setAttribute('id',"zoomNb"+Onglet);
		ETD.appendChild(E2);
		
		dojo.addOnLoad(function() {
			try{
				var vertical = dojo.byId("zoomNb"+Onglet);
				var slider = new dojox.form.VerticalRangeSlider({
					Class: "zoomAxisSlider",
					intermediateChanges: false,
					showButtons: false,
					style: "height:450px; margin-left:5px; margin-right:50px; margin-bottom: 20px; float: left;",
					name: "zoomNb"+Onglet,
					onChange: function(evt){
						chargeZoomVar(Chart5[Onglet], 5,  JsonObj5[Onglet] );
						zoomYAxis("zoomNb"+Onglet);
					}
				}, vertical);
			}catch(e){alert(e);}
		});
		
		ETD = document.createElement("td");
		ETR.appendChild(ETD);
		
		E2 = document.createElement("div");
		E2.setAttribute('id',"legend5"+Onglet);
		ETD.appendChild(E2);
		
		E3 =  document.createElement("font");
		E3.setAttribute('size', 2);
		E2.appendChild(E3);
		
		E1 = document.createElement("center");
		E3.appendChild(E1);
		
		E3 = document.createElement("u");
		E1.appendChild(E3);
		
		text = document.createTextNode("LEGENDE");
		E3.appendChild(text);
		
		E1 = document.createElement("div");
		E1.setAttribute('id',"legend5Tab"+Onglet);
		E2.appendChild(E1);
		
		
		
		
		//6eme fenetre
		
		
		DIV = document.createElement("div");
		DIV.setAttribute('style', "margin-top: 25px; border: 3px solid #1CC48B;");
		DIV.setAttribute('class', "graphWinClosed");
		document.getElementById('Div'+Onglet).appendChild(DIV);
		
		table = document.createElement("table");
		table.setAttribute("cellspacing", 0);
		table.setAttribute("cellpadding", 0);
		DIV.appendChild(table);
		
		tbody = document.createElement("tbody");
		table.appendChild(tbody);
		
		tr =  document.createElement("tr");
		tbody.appendChild(tr);
		
		td = document.createElement("td");
		E2 = document.createElement("input");
		E2.setAttribute('type','image');
		E2.setAttribute('src','/images/smallGreenButtonDown.png');
		E2.setAttribute('id','BoutonGraphe6'+Onglet);
		E2.setAttribute('alt', 'Submit button');
		E2.setAttribute('onclick', 'clickTitre(6,"'+Onglet+'")');
		E2.setAttribute('onmouseover', 'mouseOverTitre(6,"'+Onglet+'")');
		E2.setAttribute('onmouseout', 'mouseOutTitre(6,"'+Onglet+'")');
		td.appendChild(E2);
		tr.appendChild(td);
		
		td = document.createElement("td");
		E2 = document.createElement("font");
		E2.setAttribute('size',3);
		E2.setAttribute('style', 'margin-left: 10px;');
		text = document.createTextNode("Number of Contacted External Hosts");
		E2.appendChild(text);
		td.appendChild(E2);
		tr.appendChild(td);
		
		
		E1 = document.createElement("div");
		E1.setAttribute('id',"DivGraphe6"+Onglet);
		E1.setAttribute('openedHeight', 0);
		E1.setAttribute('style', "position: relative; display: none; overflow : auto;");
		DIV.appendChild(E1);
		
		E2 = document.createElement("div");
		E2.setAttribute('style', "position : absolute; ");
		E1.appendChild(E2);
		
		E3 =  document.createElement("font");
		E3.setAttribute('id',"unit6"+Onglet);
		E3.setAttribute('style',"margin-left: 30px;");
		E3.setAttribute('size', 1);
		E2.appendChild(E3);
	
		
		E2 = document.createElement("div");
		E2.setAttribute('id',"chart6"+Onglet);
		E2.setAttribute('style', "width: 800px; height: 300px; float:left; margin-left:1px; ");
		E1.appendChild(E2);
		
		/*E2 = document.createElement("div");
		E2.setAttribute('id',"legend6"+Onglet);
		E2.setAttribute('style', "position: absolute; margin-left: 830px;");
		E1.appendChild(E2);
		
		E3 =  document.createElement("font");
		E3.setAttribute('size', 2);
		E2.appendChild(E3);
		
		E1 = document.createElement("center");
		E3.appendChild(E1);
		
		E3 = document.createElement("u");
		E1.appendChild(E3);
		
		text = document.createTextNode("LEGENDE");
		E3.appendChild(text);
		
		E1 = document.createElement("div");
		E1.setAttribute('id',"legend6Tab"+Onglet);
		E2.appendChild(E1);*/
		
		
		
		
		
		
		
		
		//7ere fenetre 
		
		
		DIV = document.createElement("div");
		DIV.setAttribute('style', "margin-top: 25px; border: 3px solid #1CC48B;");
		DIV.setAttribute('class', "graphWinClosed");
		document.getElementById('Div'+Onglet).appendChild(DIV);
		
		table = document.createElement("table");
		table.setAttribute("cellspacing", 0);
		table.setAttribute("cellpadding", 0);
		DIV.appendChild(table);
		
		tbody = document.createElement("tbody");
		table.appendChild(tbody);
		
		tr =  document.createElement("tr");
		tbody.appendChild(tr);
		
		td = document.createElement("td");
		E2 = document.createElement("input");
		E2.setAttribute('type','image');
		E2.setAttribute('src','/images/smallGreenButtonDown.png');
		E2.setAttribute('id','BoutonGraphe7'+Onglet);
		E2.setAttribute('alt', 'Submit button');
		E2.setAttribute('onclick', 'clickTitre(7,"'+Onglet+'")');
		E2.setAttribute('onmouseover', 'mouseOverTitre(7,"'+Onglet+'")');
		E2.setAttribute('onmouseout', 'mouseOutTitre(7,"'+Onglet+'")');
		td.appendChild(E2);
		tr.appendChild(td);
		
		td = document.createElement("td");
		E2 = document.createElement("font");
		E2.setAttribute('size',3);
		E2.setAttribute('style', 'margin-left: 10px;');
		text = document.createTextNode("Number of Local Hosts (having Incoming and Outgoing Traffic)");
		E2.appendChild(text);
		td.appendChild(E2);
		tr.appendChild(td);
		
		
		E1 = document.createElement("div");
		E1.setAttribute('id',"DivGraphe7"+Onglet);
		E1.setAttribute('openedHeight', 0);
		E1.setAttribute('style', "position: relative; display: none; overflow : auto;");
		DIV.appendChild(E1);
		
		E2 = document.createElement("div");
		E2.setAttribute('style', "position : absolute; ");
		E1.appendChild(E2);
		
		E3 =  document.createElement("font");
		E3.setAttribute('id',"unit7"+Onglet);
		E3.setAttribute('style',"margin-left: 30px;");
		E3.setAttribute('size', 1);
		E2.appendChild(E3);
	
		
		E2 = document.createElement("div");
		E2.setAttribute('id',"chart7"+Onglet);
		E2.setAttribute('style', "width: 800px; height: 300px; float:left; margin-left:1px;");
		E1.appendChild(E2);
		
		/*E2 = document.createElement("div");
		E2.setAttribute('id',"legend7"+Onglet);
		E2.setAttribute('style', "position: absolute; margin-left: 830px;");
		E1.appendChild(E2);
		
		E3 =  document.createElement("font");
		E3.setAttribute('size', 2);
		E2.appendChild(E3);
		
		E1 = document.createElement("center");
		E3.appendChild(E1);
		
		E3 = document.createElement("u");
		E1.appendChild(E3);
		
		text = document.createTextNode("LEGENDE");
		E3.appendChild(text);
		
		E1 = document.createElement("div");
		E1.setAttribute('id',"legend7Tab"+Onglet);
		E2.appendChild(E1);*/
		
		
		document.getElementById("dateDebApplied"+Onglet).setAttribute('value', document.getElementById("dateDeb"+Onglet).value ) ;
		document.getElementById("dateFinApplied"+Onglet).setAttribute('value', document.getElementById("dateFin"+Onglet).value ) ;
		document.getElementById("presetsApplied"+Onglet).setAttribute('value', document.getElementById("presets"+Onglet).value ) ;
		
		document.getElementById('Apply'+Onglet).disabled = true;

		dojo.addOnLoad(makeCalendar);

		setParameters(document.getElementById(Onglet) , $('formulaire'+Onglet).serialize());
		
	}


	
function ChargerLogs(){
	
		// si un chargement a dÈja echouÈ (car serveur introuvable) !
		if (pending>=2)  return;
		
		//sinon
		try{
			
			var xhr = createXhrObject();
			
			if(document.getElementById("Logs").getAttribute("value") == null ||document.getElementById("Logs").getAttribute("value") == ""){
				//open xml element (case as first run)
				xhr.open("GET", "dynamic/getLogs.json?dh="+decalageHoraire, true);
				
			}else{
				xhr.open("GET", "dynamic/getLogs.json?dh="+decalageHoraire+"&id="+document.getElementById("Logs").value, true);
			}
			xhr.onreadystatechange=function() 
			{
				if (xhr.readyState == 4) 
				{
					//alert("ChargÈ");
					
					if (xhr.status == 200) 
					{
						
						var JsonLogs = eval("(" + xhr.responseText + ")");
						
						try{
							var TBody;
							var Ntr;					
							var Ntd;					
							var text;
							
							// gestion des alertes (s'il y en a de nouvelles)
							if(lastAlertIndex != null){
								if(lastAlertIndex < JsonLogs.lastAlertIdx)
									nouvellesAlertes(JsonLogs.lastAlertIdx);
							}else{
								lastAlertIndex =  JsonLogs.lastAlertIdx;
							}
							
							//if table is empty, creatre and append tbody
							if(document.getElementById('TabLogs').tBodies.length == 0){
								TBody = document.createElement("tbody");
								document.getElementById('TabLogs').appendChild(TBody);
								document.getElementById('TabLogs').insertBefore(TBody,document.getElementById('TabLogs').firstChild);
							}
							
							if(JsonLogs.nextId != document.getElementById("Logs").value && JsonLogs.Tab.length > 0){
								
								TBody = document.getElementById('TabLogs').tBodies[0];
								
								for( var i=0; i< JsonLogs.Tab.length; i++){
									
									//if(i == (JsonLogs.Tab.length-1)) lastLogEntry = JsonLogs.Tab[i].msg ;
									
									var Ntr = document.createElement("tr");
									Ntr.setAttribute("style","background: #EEFFEE;");
									TBody.appendChild(Ntr);
									//TBody.insertBefore(Ntr, null);
									
									Ntd = document.createElement("td");
									text = document.createTextNode(JsonLogs.Tab[i].msg+"    ");
									Ntd.appendChild(text);
									
									
									if(JsonLogs.Tab[i].detail){
										var detail = document.createElement("input");
										detail.setAttribute('type',"image"); 
										detail.setAttribute('value',JsonLogs.Tab[i].detail); 
										detail.setAttribute('msg',JsonLogs.Tab[i].msg); 
										detail.setAttribute('src', "images/more.png");
										detail.setAttribute('onmouseover', "this.src='/images/moreOver.png'");
										detail.setAttribute('onmouseout', "this.src='/images/more.png'");
										detail.setAttribute('onclick','clickLoupe(this.getAttribute("value"),this.getAttribute("msg"))'); 
										Ntd.appendChild(detail);
									}
									
															
									Ntr.appendChild(Ntd);
									Ntr.insertBefore(Ntd, Ntr.firstChild);
									
									Ntd = document.createElement("td");
									Ntd.setAttribute('class', 'icone');
									
									var Input = document.createElement("img");
									
									if(JsonLogs.Tab[i].severity == "WARNING"){
										Input.setAttribute('src', "images/warnIcon.gif");
										Input.setAttribute('title', "Warning");
									}else if(JsonLogs.Tab[i].severity == "ALERT"){
										Input.setAttribute('src', "images/alertIcon.gif");
										Input.setAttribute('height', "20");
										Input.setAttribute('title', "Alert");
									}else if(JsonLogs.Tab[i].severity == "INFO"){
										Input.setAttribute('src', "images/InfoIcon.gif");
										Input.setAttribute('title', "Info");
									}else if(JsonLogs.Tab[i].severity == "ERROR"){
										Input.setAttribute('src', "images/errorIcon.gif");
										Input.setAttribute('title', "Error");
									}else{							
										Input.setAttribute('src', "images/smallBlueButton.png");
									}
									
									Ntd.appendChild(Input);
									Ntd.insertBefore(Input, Ntd.firstChild);
									
									Ntr.appendChild(Ntd);
									Ntr.insertBefore(Ntd, Ntr.firstChild);
									
								}
							
								// Mettre l'ascenseur en bas
								if(lastScrollTop == 0) lastScrollTop = document.getElementById('TabLogsDiv').scrollHeight;
								document.getElementById('TabLogsDiv').scrollTop = lastScrollTop;
		
								if(ongletActif() == "Logs"){
									
									fadeNewLogs();
									
								}
								
								
								document.getElementById("Logs").setAttribute("value", JsonLogs.nextId);
								
								// hide dialog alert box if shown
								dijit.byId('dialogAlert').hide();
								
							}	
					
						}catch(e){
							if(JsonLogs.errMsg){
								document.getElementById('dynamic/dialogAlert").getElementsByTagName("textarea")[0] += "\ngetLogs.json Bug Report: "+JsonLogs.errMsg;
								//alert('getLogs.json Bug Report: "+JsonLogs.errMsg);	
								pending =0;
								
								document.getElementById("Logs").setAttribute("value", "");

								//empty document.getElementById('TabLogs')
								if ( document.getElementById('TabLogs').hasChildNodes() ){
									while ( document.getElementById('TabLogs').childNodes.length >= 1 ){
										document.getElementById('TabLogs').removeChild( document.getElementById('TabLogs').firstChild );       
									} 
								}
				
								setTimeout("ChargerLogs();", 1000);
								
								return;
							}
						}
					
					}else{
						//document.getElementById('TabLogs'dynamic/).innerHTML = 'dynamic/getLogs.json not found";
						
				
						/*dijit.byId('dialogAlert')._onKey=function(evt){
							if (evt.keyCode == dojo.keys.ESCAPE) {
								dojo.stopEvent(evt);
							}
						}*/
						
						// afficher l'alert de perte de connection serveur
						dijit.byId('dialogAlert').show();
					}
				}else if (xhr.readyState == 0) 
				{
					//alert("Non initialisÈ");
				}else if (xhr.readyState == 1) 
				{
					//alert("Ouvert");
				}else if (xhr.readyState == 2) 
				{
					//alert("pending++ :"+pending);
					pending ++;
					if(pending==2){
						dijit.byId('dialogAlert').show();
					}
					//pending =0;
				}else if (xhr.readyState == 3) 
				{
					//alert("pending=0");
					pending =0;
				}
			}
			xhr.send(null);
		}catch(e){
			//alert(e);
			pending =0;
		}
		
		
		
	}
	

function ChargerData(Onglet, force){

		loading("DivGraphe6"+Onglet);
	
		var Table;
		var TBody;
		var THead;
		var Ntr;					
		var Ntd;					
		var text;
	
		
		// Clear div TabData+"onglet" childNodes if they was created previously
		TBody = document.getElementById('TabData'+Onglet); 
		if ( TBody.hasChildNodes() ){
			while ( TBody.childNodes.length >= 1 ){
				TBody.removeChild( TBody.firstChild );       
			} 
		}
		document.getElementById('TabData'+Onglet).style.height= "0%";
		document.getElementById('TabData'+Onglet).style.border= "0px solid #6c6";
		
		

		// Clear div buttons childNodes if they was created previously
		TBody = document.getElementById('DivResults6'+Onglet); 
		if ( TBody.hasChildNodes() ){
			while ( TBody.childNodes.length >= 1 ){
				TBody.removeChild( TBody.firstChild );       
			} 
		}
		
		
		// Clear div buttons childNodes if they was created previously
		TBody = document.getElementById('Buttons'+Onglet); 
		if ( TBody.hasChildNodes() ){
			while ( TBody.childNodes.length >= 1 ){
				TBody.removeChild( TBody.firstChild );       
			} 
		}
		
		try{
			setParameters(null, document.getElementById(Onglet).getAttribute("params"));
		}catch(e){}
			
		var xhr = createXhrObject();
		
		if(force == "true")
			xhr.open("GET", "dynamic/rawDataFlow.json?"+parameters+dataPage+"&force=true", true);
		else
			xhr.open("GET", "dynamic/rawDataFlow.json?"+parameters+dataPage, true);
		xhr.onreadystatechange=function() 
		{
			if (xhr.readyState == 4) 
			{
				if (xhr.status == 200) 
				{
						
						var JsonData = eval("(" + xhr.responseText + ")");
					
					try{	
						font = document.createElement("font");//.createTextNode(JsonData.data.length+" results");
						font.setAttribute('size',1);
						font.setAttribute('style','position: absolute;');
						font.innerHTML = JsonData.nbResults+" results";
						document.getElementById('DivResults6'+Onglet).appendChild(font);
						
						
						
						// Create and fill TabData Content
						TBody = document.createElement("div");
						TBody.setAttribute('style', 'width: 100%; height: 100%; overflow: auto;');
						document.getElementById('TabData'+Onglet).appendChild(TBody);
						
						Table = document.createElement("table");
						Table.setAttribute("id", "BodyData"+Onglet);
						Table.setAttribute("cellspacing", "0");
						Table.setAttribute("cellpadding", "0");
						Table.setAttribute('style', 'width: 100%;', 'height: 100%;');
						TBody.appendChild(Table);
						
						// Create, set size and fill actual HeadersData
						
						THead = document.createElement("thead");
						THead.setAttribute("class", "HeadersTable");
						THead.setAttribute("style", "height: 26px;");
						Table.appendChild(THead);
						
						Ntr = document.createElement("tr");
						THead.appendChild(Ntr);
						THead.insertBefore(Ntr, null);
						
						Ntd = document.createElement("th");
						text = document.createTextNode('Duration');
						Ntd.appendChild(text);
						Ntr.appendChild(Ntd);
						Ntr.insertBefore(Ntd, Ntr.firstChild);
						
						Ntd = document.createElement("th");
						text = document.createTextNode('OutgPkts ');
						Ntd.appendChild(text);
						Ntr.appendChild(Ntd);
						Ntr.insertBefore(Ntd, Ntr.firstChild);
						
						Ntd = document.createElement("th");
						text = document.createTextNode('IncPkts ');
						Ntd.appendChild(text);
						Ntr.appendChild(Ntd);
						Ntr.insertBefore(Ntd, Ntr.firstChild);
						
						Ntd = document.createElement("th");
						text = document.createTextNode('OutgTraf');
						Ntd.appendChild(text);
						Ntr.appendChild(Ntd);
						Ntr.insertBefore(Ntd, Ntr.firstChild);
						
						Ntd = document.createElement("th");
						text = document.createTextNode('IncTraf');
						Ntd.appendChild(text);
						Ntr.appendChild(Ntd);
						Ntr.insertBefore(Ntd, Ntr.firstChild);
						
						Ntd = document.createElement("th");
						text = document.createTextNode('TcpFlg ');
						Ntd.appendChild(text);
						Ntr.appendChild(Ntd);
						Ntr.insertBefore(Ntd, Ntr.firstChild);
					
						Ntd = document.createElement("th");
						text = document.createTextNode('PtExt');
						Ntd.appendChild(text);
						Ntr.appendChild(Ntd);
						Ntr.insertBefore(Ntd, Ntr.firstChild);
						
						Ntd = document.createElement("th");
						text = document.createTextNode('PtLoc');
						Ntd.appendChild(text);
						Ntr.appendChild(Ntd);
						Ntr.insertBefore(Ntd, Ntr.firstChild);
						
						Ntd = document.createElement("th");
						text = document.createTextNode('Proto');
						Ntd.appendChild(text);
						Ntr.appendChild(Ntd);
						Ntr.insertBefore(Ntd, Ntr.firstChild);
						
						Ntd = document.createElement("th");
						text = document.createTextNode('ASNum');
						Ntd.appendChild(text);
						Ntr.appendChild(Ntd);
						Ntr.insertBefore(Ntd, Ntr.firstChild);
						
						Ntd = document.createElement("th");
						//Ntd.setAttribute('colspan',2);
						text = document.createTextNode('IpExtern');
						Ntd.appendChild(text);
						Ntr.appendChild(Ntd);
						Ntr.insertBefore(Ntd, Ntr.firstChild);
						
						Ntd = document.createElement("th");
						text = document.createTextNode('Dir');
						Ntd.appendChild(text);
						Ntr.appendChild(Ntd);
						Ntr.insertBefore(Ntd, Ntr.firstChild);
						
						Ntd = document.createElement("th");
						text = document.createTextNode('IpLocal');
						Ntd.appendChild(text);
						Ntr.appendChild(Ntd);
						Ntr.insertBefore(Ntd, Ntr.firstChild);
						
						Ntd = document.createElement("th");
						text = document.createTextNode('LastTime');
						Ntd.appendChild(text);
						Ntr.appendChild(Ntd);
						Ntr.insertBefore(Ntd, Ntr.firstChild);
						
						Ntd = document.createElement("th");
						text = document.createTextNode('FirstTime');
						Ntd.appendChild(text);
						Ntr.appendChild(Ntd);
						Ntr.insertBefore(Ntd, Ntr.firstChild);
						
						TBody = document.createElement("tbody");
						TBody.setAttribute("class", "BodyTable");
						Table.appendChild(TBody);
						
						var cyc = 0;
						for( var i=0; i< JsonData.data.length; i++){
							
							Ntr = document.createElement("tr");
							Ntr.setAttribute('style', 'height: 20px;');
							TBody.appendChild(Ntr);
							TBody.insertBefore(Ntr, null);
							
							if( JsonData.data[i].cyc == cyc){
							
								Ntd = document.createElement("td");
								if(!JsonData.data[i].dur) Ntd.innerHTML = "&nbsp";
								else{
									text = document.createTextNode(JsonData.data[i].dur);
									Ntd.appendChild(text);
								}
								//Ntr.appendChild(Ntd);
								Ntr.insertBefore(Ntd, Ntr.firstChild);
								
								Ntd = document.createElement("td");
								if(!JsonData.data[i].opk) Ntd.innerHTML = "&nbsp";
								else{
									text = document.createTextNode(JsonData.data[i].opk);
									Ntd.appendChild(text);
								}
								//Ntr.appendChild(Ntd);
								Ntr.insertBefore(Ntd, Ntr.firstChild);
								
								Ntd = document.createElement("td");
								if(!JsonData.data[i].ipk) Ntd.innerHTML = "&nbsp";
								else{
									text = document.createTextNode(JsonData.data[i].ipk);
									Ntd.appendChild(text);
								}
								//Ntr.appendChild(Ntd);
								Ntr.insertBefore(Ntd, Ntr.firstChild);
								
								Ntd = document.createElement("td");
								if(!JsonData.data[i].otr) Ntd.innerHTML = "&nbsp";
								else{
									text = document.createTextNode(JsonData.data[i].otr);
									Ntd.appendChild(text);
								}
								//Ntr.appendChild(Ntd);
								Ntr.insertBefore(Ntd, Ntr.firstChild);
								
								Ntd = document.createElement("td");
								if(!JsonData.data[i].itr) Ntd.innerHTML = "&nbsp";
								else{
									text = document.createTextNode(JsonData.data[i].itr);
									Ntd.appendChild(text);
								}
								//Ntr.appendChild(Ntd);
								Ntr.insertBefore(Ntd, Ntr.firstChild);
								
								Ntd = document.createElement("td");
								if(!JsonData.data[i].flg) Ntd.innerHTML = "&nbsp";
								else{
									text = document.createTextNode(JsonData.data[i].flg);
									Ntd.setAttribute('proto', JsonData.data[i].p);
									Ntd.setAttribute('onmouseover', "this.style.background= '#EEFFEE'; if(this.title=='')this.title=resolveTCPFlag(this)");	
									Ntd.setAttribute('onmouseout', "this.style.background= 'white';");
									Ntd.setAttribute('style',"cursor: pointer; ");
									Ntd.setAttribute('onclick', "setTCPFlags(this);");
									Ntd.appendChild(text);
								}
								//Ntr.appendChild(Ntd);
								Ntr.insertBefore(Ntd, Ntr.firstChild);
								
								Ntd = document.createElement("td");
								if(!JsonData.data[i].po) Ntd.innerHTML = "&nbsp";
								else{
									//if( JsonData.data[i].po == "0" ) alert ( "d="+JsonData.data[i].d );
									Ntd.setAttribute('proto', JsonData.data[i].p);
									if( JsonData.data[i].po == "0" && JsonData.data[i].d == "&lt;" ){
										text = document.createTextNode("*");
										Ntd.setAttribute('onmouseover', "this.style.background= '#EEFFEE';");	
										Ntd.setAttribute('onmouseout', "this.style.background= 'white';");
									}else{
										text = document.createTextNode(JsonData.data[i].po);
										if(JsonData.data[i].p == "1")
											Ntd.setAttribute('onmouseover', "this.style.background= '#EEFFEE'; if(this.title=='')this.title=resolveCodeICMP('"+JsonData.data[i].pl+"', '"+JsonData.data[i].po+"');");
										else		
											Ntd.setAttribute('onmouseover', "this.style.background= '#EEFFEE'; if(this.title=='')this.title=resolveService(this);");
											
										Ntd.setAttribute('onmouseout', "this.style.background= 'white';");
										Ntd.setAttribute('style',"cursor: pointer; ");
										
										if(JsonData.data[i].p == "6")
											Ntd.setAttribute('onclick', "document.getElementById('proto').setAttribute('value', 'tcp'); document.getElementById('proto').value = 'tcp'; document.getElementById('proto').onchange(); \
															document.getElementById('portExt').setAttribute('value', this.innerHTML); document.getElementById('portExt').value = this.innerHTML; document.getElementById('portExt').onchange(); animatePlusTab();");
										else if(JsonData.data[i].p == "17")
											Ntd.setAttribute('onclick', "document.getElementById('proto').setAttribute('value', 'udp'); document.getElementById('proto').value = 'udp'; document.getElementById('proto').onchange(); \
															document.getElementById('portExt').setAttribute('value', this.innerHTML); document.getElementById('portExt').value = this.innerHTML; document.getElementById('portExt').onchange(); animatePlusTab();");
										else
										Ntd.setAttribute('onclick', "document.getElementById('proto').setAttribute('value', 'others'); document.getElementById('proto').value = 'others'; document.getElementById('proto').onchange(); \
															document.getElementById('portExt').setAttribute('value', this.innerHTML); document.getElementById('portExt').value = this.innerHTML; document.getElementById('portExt').onchange(); animatePlusTab();");
										
									}
									Ntd.appendChild(text);
								}
								//Ntr.appendChild(Ntd);
								Ntr.insertBefore(Ntd, Ntr.firstChild);
								
								Ntd = document.createElement("td");
								if(!JsonData.data[i].pl) Ntd.innerHTML = "&nbsp";
								else{
									Ntd.setAttribute('proto', JsonData.data[i].p);
									if( JsonData.data[i].pl == "0" && JsonData.data[i].d == ">" ){
										text = document.createTextNode("*");
										Ntd.setAttribute('onmouseover', "this.style.background= '#EEFFEE';");	
										Ntd.setAttribute('onmouseout', "this.style.background= 'white';");
									}else{
										text = document.createTextNode(JsonData.data[i].pl);
										Ntd.setAttribute('onmouseover', "this.style.background= '#EEFFEE'; if(this.title=='') this.title=resolveService(this);");	
										Ntd.setAttribute('onmouseout', "this.style.background= 'white';");
										Ntd.setAttribute('style',"cursor: pointer; ");
										if(JsonData.data[i].p == "6")
											Ntd.setAttribute('onclick', "document.getElementById('proto').setAttribute('value', 'tcp'); document.getElementById('proto').value = 'tcp'; document.getElementById('proto').onchange(); \
															document.getElementById('portLoc').setAttribute('value', this.innerHTML); document.getElementById('portLoc').value = this.innerHTML; document.getElementById('portLoc').onchange(); animatePlusTab();");
										else if(JsonData.data[i].p == "17")
											Ntd.setAttribute('onclick', "document.getElementById('proto').setAttribute('value', 'udp'); document.getElementById('proto').value = 'udp'; document.getElementById('proto').onchange(); \
															document.getElementById('portLoc').setAttribute('value', this.innerHTML); document.getElementById('portLoc').value = this.innerHTML; document.getElementById('portLoc').onchange(); animatePlusTab();");
										else
										Ntd.setAttribute('onclick', "document.getElementById('proto').setAttribute('value', 'others'); document.getElementById('proto').value = 'others'; document.getElementById('proto').onchange(); \
															document.getElementById('portLoc').setAttribute('value', this.innerHTML); document.getElementById('portLoc').value = this.innerHTML; document.getElementById('portLoc').onchange(); animatePlusTab();");
										
									}
									Ntd.appendChild(text);
								}
								//Ntr.appendChild(Ntd);
								Ntr.insertBefore(Ntd, Ntr.firstChild);
								
								Ntd = document.createElement("td");
								if(!JsonData.data[i].p) Ntd.innerHTML = "&nbsp";
								else{
									text = document.createTextNode(JsonData.data[i].p);
									Ntd.appendChild(text);
									Ntd.setAttribute('onmouseover', "this.style.background= '#EEFFEE'; if(this.title=='')this.title=resolveProto(this);");	
									Ntd.setAttribute('onmouseout', "this.style.background= 'white'; ");
									Ntd.setAttribute('style',"cursor: pointer; ");
									if(JsonData.data[i].p == "6")
										Ntd.setAttribute('onclick', "document.getElementById('proto').setAttribute('value', 'tcp'); document.getElementById('proto').value = 'tcp'; document.getElementById('proto').onchange(); animatePlusTab();");
									else if(JsonData.data[i].p == "17")
										Ntd.setAttribute('onclick', "document.getElementById('proto').setAttribute('value', 'udp'); document.getElementById('proto').value = 'udp'; document.getElementById('proto').onchange(); animatePlusTab();");
									else
										Ntd.setAttribute('onclick', "document.getElementById('proto').setAttribute('value', 'others'); document.getElementById('proto').value = 'others'; document.getElementById('proto').onchange(); animatePlusTab();");
									
									/*Ntd.setAttribute('pnum', JsonData.data[i].p)
									if(JsonData.data[i].pnam)
										text = document.createTextNode(JsonData.data[i].pnam);
									else
										text = document.createTextNode(JsonData.data[i].pnu);*/
								}
								//Ntr.appendChild(Ntd);
								Ntr.insertBefore(Ntd, Ntr.firstChild);
								
								Ntd = document.createElement("td");
								//Ntd.setAttribute('class', 'ipExt');
								//Ntd.setAttribute('id', 'ext'+i+Onglet);
								//Ntd.setAttribute('host', JsonData.data[i].ipo);
								Ntd.value=JsonData.data[i].asn;
								Ntd.setAttribute('onmouseover', "this.style.background= '#EEFFEE'; if(this.title=='') this.title=resolveAS(this);");
								Ntd.setAttribute('onmouseout', "this.style.background= 'white'; ");
								Ntd.setAttribute('style',"cursor: pointer; ");
								Ntd.setAttribute('onclick', "document.getElementById('AS').setAttribute('value', this.innerHTML); document.getElementById('AS').value = this.innerHTML; document.getElementById('AS').onchange(); animatePlusTab();");
								if(JsonData.data[i].asn == "0"){
									Ntd.innerHTML="&nbsp;";
								}else{
									text = document.createTextNode(JsonData.data[i].asn);
									Ntd.appendChild(text);
								}
								Ntr.insertBefore(Ntd, Ntr.firstChild);
								
								Ntd = document.createElement("td");
								Ntd.setAttribute('class', 'ipExt');
								Ntd.setAttribute('id', 'ext'+i+Onglet);
								Ntd.setAttribute('host', JsonData.data[i].ipo);
								Ntd.setAttribute('country', JsonData.data[i].c);
								Ntd.setAttribute('style',"cursor: pointer; ");
								Ntd.setAttribute('onmouseover', "this.style.background= '#EEFFEE'; var element=this; setTOResolv = setTimeout('solveIpExt('+this.id+')',500);");
								Ntd.setAttribute('onmouseout', "this.style.background= 'white'; clearTimeout(setTOResolv);");
								Ntd.setAttribute('onclick', "document.getElementById('ipext').setAttribute('value', this.getAttribute(\"host\")); document.getElementById('ipext').value = this.getAttribute(\"host\"); document.getElementById('ipext').onchange(); animatePlusTab();\
														dijit.byId('SelectCountry').attr( 'value' , nameOfCountry(this.getAttribute(\"country\")) ); dijit.byId('SelectCountry').value = nameOfCountry(this.getAttribute(\"country\"));");
								text = document.createTextNode(JsonData.data[i].ipo);
								Ntd.appendChild(text);
								//Ntr.insertBefore(Ntd, Ntr.firstChild);
								
								//Ntd = document.createElement("td");
								text = document.createElement("img");
								if(JsonData.data[i].c=="--") text.setAttribute('src', 'images/flags/unknown.png');
								else text.setAttribute('src', 'images/flags/'+JsonData.data[i].c.toLowerCase()+'.png');
								text.setAttribute('title', nameOfCountry(JsonData.data[i].c));
								text.setAttribute('style', 'margin-left: 5px');
								Ntd.appendChild(text);
								//Ntr.appendChild(Ntd);
								Ntr.insertBefore(Ntd, Ntr.firstChild);
								
								Ntd = document.createElement("td");
								text = document.createTextNode(JsonData.data[i].d);
								Ntd.appendChild(text);
								//Ntr.appendChild(Ntd);
								Ntr.insertBefore(Ntd, Ntr.firstChild);
								
								Ntd = document.createElement("td");
								text = document.createTextNode(JsonData.data[i].ipl);
								Ntd.setAttribute('style',"cursor: pointer;");
								Ntd.setAttribute('id', 'loc'+i+Onglet);
								Ntd.setAttribute("localhost", JsonData.data[i].ipl)
								Ntd.setAttribute('onmouseover', "this.style.background= '#EEFFEE'; setTOResolv = setTimeout('solveIpLoc('+this.id+')', 500);");
								Ntd.setAttribute('onmouseout', "this.style.background= 'white'; clearTimeout(setTOResolv);");
								Ntd.setAttribute('onclick', "dijit.byId('SelectIp').attr( 'value' , this.getAttribute(\"localhost\") ); dijit.byId('SelectIp').value = this.getAttribute(\"localhost\"); animatePlusTab();");
								Ntd.appendChild(text);
								//Ntr.appendChild(Ntd);
								Ntr.insertBefore(Ntd, Ntr.firstChild);
								
								Ntd = document.createElement("td");
								text = document.createTextNode(JsonData.data[i].lst);
								Ntd.appendChild(text);
								//Ntr.appendChild(Ntd);
								Ntr.insertBefore(Ntd, Ntr.firstChild);
								
								Ntd = document.createElement("td");
								text = document.createTextNode(JsonData.data[i].fst);
								Ntd.appendChild(text);
								//Ntr.appendChild(Ntd);
								Ntr.insertBefore(Ntd, Ntr.firstChild);
								/*
								*/
							}else{
								Ntd = document.createElement("td");
								Ntd.setAttribute('colspan',15);
								Ntr.setAttribute('style', 'background-color: #FFEFA8;');
								text = document.createTextNode("Aggregation period started at : "+JsonData.data[i].cyc);
								Ntd.appendChild(text);
								Ntr.appendChild(Ntd);
								Ntr.insertBefore(Ntd, Ntr.firstChild);
								cyc = JsonData.data[i].cyc;
								i --;
							}
						}
						
						
						// Pages Buttons
						TBody = document.getElementById('Buttons'+Onglet); 
						
						if(JsonData.nbPages >1){
							
							var borneInf = JsonData.curPage - 5 ;
							var borneSup = JsonData.curPage + 5 ;
							
							if( JsonData.nbPages > 11){
								if (borneInf <1) {
									borneInf=1;
									borneSup=11;
								}
								if (borneSup > JsonData.nbPages) {
									borneInf=JsonData.nbPages-10;
									borneSup=JsonData.nbPages;
								}
								
							}else{
								borneInf=1;
								borneSup=JsonData.nbPages;
							}
							
							// le premier bouton : 'first page'
							if(borneInf > 1){
								Ntd = document.createElement("button");
								Ntd.setAttribute('onclick',"dataPage='&page=1'; loading('DivGraphe6'+ongletActif()); setTimeout('ChargerData(ongletActif(),\""+force+"\")', 500);");
								Ntd.setAttribute('title',"First Page");
								Ntd.innerHTML = '<<';
								TBody.appendChild(Ntd);	
							}
							
							// les boutons des pages
							for( var i=borneInf; i<=borneSup; i++){
								Ntd = document.createElement("button");
								if(JsonData.curPage == i)
									Ntd.disabled=true;
								else
									Ntd.setAttribute('style',"cursor: pointer;");
								Ntd.setAttribute('onclick',"dataPage='&page='+this.innerHTML; loading('DivGraphe6'+ongletActif()); setTimeout('ChargerData(ongletActif(),\""+force+"\")', 500);");
								Ntd.innerHTML = i;
								TBody.appendChild(Ntd);	
							}
							
							//le dernier bouton : 'last page'
							if (borneSup < JsonData.nbPages) {
								Ntd = document.createElement("button");
								Ntd.setAttribute('onclick',"dataPage='&page="+JsonData.nbPages+"'; loading('DivGraphe6'+ongletActif()); setTimeout('ChargerData(ongletActif(),\""+force+"\")', 500);");
								Ntd.setAttribute('title',"Last Page");
								Ntd.innerHTML = '>>';
								TBody.appendChild(Ntd);	
							}
							
						}
						
						
						
						
						// crÈation de l'icone "save to CSV"
						E1 = document.createElement("button");
						E1.setAttribute('type', "button");
						//E1.setAttribute('onclick', "this.disabled = true; body.style.cursor = 'wait'; self.location.href='http://lpsc-znets:8443/rawDataFlow.csv?'+parameters;");
						E1.setAttribute('onclick', "saveToCSV(document.getElementById(ongletActif()).getAttribute('params'))");
						E1.setAttribute('title', "Save to CSV");
						E1.setAttribute('id', ongletActif()+"STCButton");
						E1.setAttribute('style', "float: right; cursor: pointer;");
						E3 = document.createElement("img");
						E3.setAttribute('src',"images/saveToCSV.png");
						E1.appendChild(E3);
						document.getElementById('DivResults6'+Onglet).appendChild(E1);
						
						
						// Mettre l'ascenseur en bas
						document.getElementById('TabData'+Onglet).scrollTop = 0;
						
						// definition des attributs de la div pr enfin la rendre visible
						document.getElementById('TabData'+Onglet).setAttribute('style', "width: 100%; border: 1px solid #6c6; margin: 2px; height: 98%;");
						
						// set Tables sizes
						//tablesResize();
						
						
					}catch(e){ 						
						if(JsonData.warnMsg){
							var forcer = confirm(JsonData.warnMsg);
							if (forcer){
								ChargerData(Onglet, "true")
								return;
							}else{
								clickOnClose(ongletActif())
								ChangerOnglet("Plus");
								ChangerDiv("DivPlus");
							}

						}else{
							if(JsonData.errMsg)
								alert('rawDataFlow.json Bug Report: "+JsonData.errMsg);	
							else
								alert("rawData empty !");
							clickOnClose(Onglet);
							ChangerOnglet("Plus");
							ChangerDiv("DivPlus");
						}
					}
					
					
				}else {
					document.getElementById('TabData'+Onglet).innerHTML = 'Json not found';
				}
				unLoading();
				document.getElementById('TabData'+Onglet).style.height= "98%";
				document.getElementById('TabData'+Onglet).style.border= "1px solid #6c6";
				
			}else{
				
			}
		}
		xhr.send(null);
	}
	
	
function chargerAlerts(page){
	
	loading("TabAlertsDiv");
	
	try{
		
		var TBody;
		var THead;
		var Ntr;					
		var Ntd;					
		var text;
	
		
	
		ids = ['TabAlerts', 'DivResultsAlerts', 'ButtonsAlerts'];
		
		for(var i = 0; i<ids.length; i++){
			try{
				// Clear div TabData+"onglet" childNodes if they was created previously
				TBody = document.getElementById(ids[i]); 
				
				if ( TBody.hasChildNodes() ){
					while ( TBody.childNodes.length >= 1 ){
						TBody.removeChild( TBody.firstChild );       
					} 
				}
			}catch(e){}
		}
		
		
		var xhr = createXhrObject();
		
		if(page==null || page == "")//open xml element (case as first run)
			xhr.open("GET", "dynamic/getAlertList.json?"+document.getElementById("Alerts").getAttribute('params'), false);
		else{
			if(document.getElementById("Alerts").getAttribute('params') == "" || document.getElementById("Alerts").getAttribute('params') == null)
				xhr.open("GET", "dynamic/getAlertList.json?page="+page, false);
			else
				xhr.open("GET", "dynamic/getAlertList.json?"+document.getElementById("Alerts").getAttribute('params')+"&page="+page, false);
		}
		
		xhr.send(null);
		
			if (xhr.readyState == 4) 
			{
				if (xhr.status == 200) 
				{
						
						var JsonAlerts = eval("(" + xhr.responseText + ")");
					
					try{	
						
						if(!document.cookie)
							document.cookie = ":";
						
						
						font = document.createElement("font");//.createTextNode(JsonAlerts.data.length+" results");
						font.setAttribute('size',1);
						font.setAttribute('style','position: absolute;');
						if(JsonAlerts.nbResults != null)
							font.innerHTML = JsonAlerts.nbResults+" results";
						else
							font.innerHTML = "0 results";
						document.getElementById('DivResultsAlerts').appendChild(font);
						
						
						
						if(JsonAlerts.nbResults != null){
							
							var button = document.createElement("img");
							button.setAttribute('id', "sortArrow");
							button.setAttribute('height', 20);
							button.setAttribute('width', 20);
							button.setAttribute('style', "cursor: pointer;");
							button.setAttribute('onclick', "changeSortAlertsOrder()"); 			
							if(document.getElementById("descAlerts").value == "true"){	
								button.setAttribute('src', "images/smallGreenButtonDown.png");
								button.setAttribute('onmouseover', "this.setAttribute('src', '/images/smallGreenButtonDownOver.png');");
								button.setAttribute('onmouseout', "this.setAttribute('src', '/images/smallGreenButtonDown.png');");	
							}else{
								button.setAttribute('src', "images/smallGreenButtonUp.png");
								button.setAttribute('onmouseover', "this.setAttribute('src', '/images/smallGreenButtonUpOver.png');");
								button.setAttribute('onmouseout', "this.setAttribute('src', '/images/smallGreenButtonUp.png');");	
							}
							
							
							/*// Empty, Create and fill TabAlertsHeaders Content						
							if (  document.getElementById('TabHeadersAlerts').hasChildNodes() ){
								while ( document.getElementById('TabHeadersAlerts').childNodes.length >= 1 ){
									document.getElementById('TabHeadersAlerts').removeChild( document.getElementById('TabHeadersAlerts').firstChild );   	
								} 
							}*/
							
							THead = document.createElement("thead");
							THead.setAttribute('class',"HeadersTable");
							document.getElementById('TabAlerts').appendChild(THead);
							
							Ntr = document.createElement("tr");
							THead.appendChild(Ntr);
							
							
							Ntd = document.createElement("th");
							Ntr.appendChild(Ntd);
							tab = document.createElement("table");
							tab.setAttribute('align', "center"); 
							tab.setAttribute('cellspacing', "0"); 
							tab.setAttribute('cellpadding', "0");  
							Ntd.appendChild(tab);
							tb = document.createElement("tbody");
							tab.appendChild(tb);
							tr = document.createElement("tr");
							tb.appendChild(tr);
							td = document.createElement("td");
							tr.appendChild(td);
							div = document.createElement("div");
							div.setAttribute('onclick', "newSortAlerts(0)"); 
							div.setAttribute('style',"cursor: pointer;");
							text = document.createTextNode('Date');
							div.appendChild(text);
							td.appendChild(div);
							if(document.getElementById("sortAlerts").value == 0){
								td = document.createElement("td");
								td.appendChild(button);
								tr.appendChild(td);
							}
							
							
							Ntd = document.createElement("th");
							Ntr.appendChild(Ntd);
							tab = document.createElement("table");
							tab.setAttribute('align', "center"); 
							Ntd.appendChild(tab);
							tb = document.createElement("tbody");
							tab.appendChild(tb);
							tr = document.createElement("tr");
							tb.appendChild(tr);
							td = document.createElement("td");
							tr.appendChild(td);
							div = document.createElement("div");
							div.setAttribute('onclick', "newSortAlerts(1)"); 
							div.setAttribute('style',"cursor: pointer;");
							text = document.createTextNode('Message');
							div.appendChild(text);
							td.appendChild(div);
							if(document.getElementById("sortAlerts").value == 1){
								td = document.createElement("td");
								td.appendChild(button);
								tr.appendChild(td);
							}
							
							
							Ntd = document.createElement("th");
							Ntr.appendChild(Ntd);
							tab = document.createElement("table");
							tab.setAttribute('align', "center"); 
							Ntd.appendChild(tab);
							tb = document.createElement("tbody");
							tab.appendChild(tb);
							tr = document.createElement("tr");
							tb.appendChild(tr);
							td = document.createElement("td");
							tr.appendChild(td);
							div = document.createElement("div");
							div.setAttribute('onclick', "newSortAlerts(2)"); 
							div.setAttribute('style',"cursor: pointer;");
							text = document.createTextNode('Localhost');
							div.appendChild(text);
							td.appendChild(div);
							if(document.getElementById("sortAlerts").value == 2){
								td = document.createElement("td");
								td.appendChild(button);
								tr.appendChild(td);
							}

							
							
							
							// Create and fill TabAlerts Content						
							TBody = document.createElement("tbody");		
							TBody.setAttribute("class", "BodyTable");
							document.getElementById('TabAlerts').appendChild(TBody);
							
							for( var i=0; i< JsonAlerts.tab.length; i++){
								
								Ntr = document.createElement("tr");
								Ntr.setAttribute('value', JsonAlerts.tab[i].id);
								Ntr.setAttribute('date', JsonAlerts.tab[i].date);
								Ntr.setAttribute('localhost', JsonAlerts.tab[i].ip);
								Ntr.setAttribute('alertType',"UNDEF");
								if(JsonAlerts.tab[i].msg.indexOf("SMTP") != -1)
									Ntr.setAttribute('alertType',"SMTP");
								else
								if(JsonAlerts.tab[i].msg.indexOf("SUSPICIOUS") != -1)
									Ntr.setAttribute('alertType',"SUSPICIOUS");
								else
								if(JsonAlerts.tab[i].msg.indexOf("MULTIPLE") != -1)
									Ntr.setAttribute('alertType',"MULTIPLESCAN");
								else
								if(JsonAlerts.tab[i].msg.indexOf("SCAN") != -1)
									Ntr.setAttribute('alertType',"SCAN");
								else
								if(JsonAlerts.tab[i].msg.indexOf("MANY") != -1)
									Ntr.setAttribute('alertType',"MANYRECIPIENTS");
/*
								if(JsonAlerts.tab[i].msg.indexOf("SMTP") != -1)
									Ntr.setAttribute('SMTP', "true");
								else
									Ntr.setAttribute('SMTP', "false");
								if(JsonAlerts.tab[i].msg.indexOf("SUSPICIOUS") != -1)
									Ntr.setAttribute('SUSPICIOUS', "true");
								else
									Ntr.setAttribute('SUSPICIOUS', "false");
*/
								Ntr.setAttribute('style', "cursor: pointer; background-color: white; ");
								Ntr.setAttribute('onmouseover', " this.style.background= '#EEFFEE' ");
								Ntr.setAttribute('onmouseout', "if(!dijit.byId('dialogLogs')._isShown())this.style.background= 'white';");
								Ntr.setAttribute('onclick','clickOnAlert(this); ');
								TBody.appendChild(Ntr);
								
								Ntd = document.createElement("td");
								//text = document.createTextNode(JsonAlerts.tab[i].date);
								if( JsonAlerts.tab[i].n == "new" ){
									if(document.cookie.indexOf(":"+JsonAlerts.tab[i].id+":") != -1)
										Ntd.innerHTML = "<div style='font-weight: normal;'><img src='/images/new_alert_icon.gif'>"+JsonAlerts.tab[i].date+"</img></div>";
									else
										Ntd.innerHTML = "<div style='font-weight: bold;'><img src='/images/new_alert_icon.gif'>"+JsonAlerts.tab[i].date+"</img></div>";
								}else{
									Ntd.innerHTML = "<div style='font-weight: normal;'>"+JsonAlerts.tab[i].date+"</div>";
								}
								Ntr.appendChild(Ntd);
								
								
								
									/*Ntd = document.createElement("td");
									text = document.createTextNode(JsonAlerts.tab[i].date);
									if( JsonAlerts.tab[i].id > lastAlertIndex ){
										img = document.createElement("img");
										img.setAttribute("type", "image");
										img.setAttribute("src", "images/alertIcon.gif");
										img.setAttribute("style", "display: block;");
										Ntd.appendChild(img);
									}
									Ntd.appendChild(text);
									Ntr.appendChild(Ntd);
								
								///////////////////////////////////////////////////////////////////////////////////////////////////////////
								
									Ntd = document.createElement("td");
								
									tab = document.createElement("table");
									tb = document.createElement("tbody");
									tab.appendChild(tb);
									tr = document.createElement("tr")
									tb.appendChild(tr);
									td = document.createElement("td")
									tr.appendChild(td);
									
									if( JsonAlerts.tab[i].id > lastAlertIndex ){
										img = document.createElement("img");
										img.setAttribute("type", "image");
										img.setAttribute("src", "images/alertIcon.gif");
										img.setAttribute("style", "display: block;");
										td.appendChild(img);
									}
									
									td = document.createElement("td")
									tr.appendChild(td);
									
									text = document.createTextNode(JsonAlerts.tab[i].date);
									td.appendChild(text);
									
									Ntd.appendChild(tab);
									Ntr.appendChild(Ntd)*/
								
								///////////////////////////////////////////////////////////////////////////////////////////////////////////
									
									
								
									Ntd = document.createElement("td");
									if( JsonAlerts.tab[i].n == "new"  &&  document.cookie.indexOf(":"+JsonAlerts.tab[i].id+":") == -1)
										Ntd.innerHTML = "<div style='font-weight: bold;'>"+JsonAlerts.tab[i].msg+"</div>";
									else
										Ntd.innerHTML = "<div style='font-weight: normal;'>"+JsonAlerts.tab[i].msg+"</div>";
									Ntr.appendChild(Ntd);
									
									Ntd = document.createElement("td");
									Ntd.setAttribute("id", "loc"+i+ongletActif())
									Ntd.setAttribute("localhost", JsonAlerts.tab[i].ip)
									Ntd.setAttribute("onmouseover", "setTOResolv = setTimeout('solveIpLoc('+this.id+')', 500);")
									Ntd.setAttribute("onmouseout", "clearTimeout(setTOResolv)");
									
									var namedEP = "";
									if( autoIptoName( JsonAlerts.tab[i].ip ) ) namedEP = autoIptoName( JsonAlerts.tab[i].ip );
									else namedEP = JsonAlerts.tab[i].ip;
									
									if( JsonAlerts.tab[i].n == "new"  && document.cookie.indexOf(":"+JsonAlerts.tab[i].id+":") == -1)
										Ntd.innerHTML = "<div style='font-weight: bold;'>"+namedEP+" </div>";
									else
										Ntd.innerHTML = "<div style='font-weight: normal;'>"+namedEP+" </div>";
									Ntr.appendChild(Ntd);
									
							}
								
							
							// Pages Buttons
							TBody = document.getElementById('ButtonsAlerts'); 
							
							if(JsonAlerts.nbPages >1){
								
								var borneInf = JsonAlerts.curPage - 5 ;
								var borneSup = JsonAlerts.curPage + 5 ;
								
								if( JsonAlerts.nbPages > 11){
									if (borneInf <1) {
										borneInf=1;
										borneSup=11;
									}
									if (borneSup > JsonAlerts.nbPages) {
										borneInf=JsonAlerts.nbPages-10;
										borneSup=JsonAlerts.nbPages;
									}
									
								}else{
									borneInf=1;
									borneSup=JsonAlerts.nbPages;
								}
								
								// le premier bouton : 'first page'
								if(borneInf > 1){
									Ntd = document.createElement("button");
									Ntd.setAttribute('onclick',"loading('TabAlertsDiv'); setTimeout('chargerAlerts(1)', 500);");
									Ntd.setAttribute('title',"First Page");
									Ntd.innerHTML = '<<';
									TBody.appendChild(Ntd);	
								}
								
								// les boutons des pages
								for( var i=borneInf; i<=borneSup; i++){
									Ntd = document.createElement("button");
									if(JsonAlerts.curPage == i)
										Ntd.disabled=true;
									else
										Ntd.setAttribute('style',"cursor: pointer;");
									Ntd.setAttribute('onclick',"loading('TabAlertsDiv'); setTimeout('chargerAlerts("+i+")', 500);");
									Ntd.innerHTML = i;
									TBody.appendChild(Ntd);	
								}
								
								//le dernier bouton : 'last page'
								if (borneSup < JsonAlerts.nbPages) {
									Ntd = document.createElement("button");
									Ntd.setAttribute('onclick',"loading('TabAlertsDiv'); setTimeout('chargerAlerts("+JsonAlerts.nbPages+")', 500);");
									Ntd.setAttribute('title',"Last Page");
									Ntd.innerHTML = '>>';
									TBody.appendChild(Ntd);	
								}
								
							}
							
							
							// Mettre l'ascenseur en bas
							document.getElementById('TabAlerts').scrollTop = document.getElementById('TabAlerts').scrollHeight;
							
							// definition des attributs de la div pr enfin la rendre visible
							//document.getElementById('TabData'+Onglet).setAttribute('style', "width: 100%; border: 1px solid #6c6; margin: 2px; height: 98%;");
							
							// set Tables sizes
							//tablesResize();
							
						}
					}catch(e){ 
						//alert(e+" : "+e.lineNo)
						if(JsonAlerts.errMsg)
							alert('getAlertList.json Bug Report: "+JsonAlerts.errMsg);	
						else
							alert("rawData empty !");
						clickOnClose(Onglet);
						ChangerOnglet("Plus");
						ChangerDiv("DivPlus");
					}
					
					
				}else {
					document.getElementById('TabData'+Onglet).innerHTML = 'Json not found';
				}
				unLoading();
				
			}
		
		
	}catch(e){
		alert(e);
	}
	
	unLoading();
	
}


function tablesResize(){
		
		var THead = null;
		var TBody = null;
		
		try{
			if(ongletActif().indexOf("Data")>=0){
				tabTab = document.getElementById("TabData"+ongletActif()).getElementsByTagName("table");
				PEU = 1;
			}else{
				tabTab = document.getElementById("TabAlertsDiv").getElementsByTagName("table");
				PEU = 0;
			}
				
			
			for(var k=0; k<tabTab.length; k++){
				if(tabTab[k].getAttribute("class") == "HeadersTable") THead = tabTab[k].getElementsByTagName("thead")[0];
				else if(tabTab[k].getAttribute("class") == "BodyTable") TBody = tabTab[k].getElementsByTagName("tbody")[0];
			}
			//alert(THead +TBody);
			for(var i=0; i<THead.childNodes[0].childNodes.length; i++){
				/*if(i==4){
					if( THead.childNodes[0].childNodes[i].getWidth() > TBody.childNodes[PEU].childNodes[i].getWidth() + TBody.childNodes[PEU].childNodes[i+1].getWidth()){
						TBody.childNodes[PEU].childNodes[i].setAttribute( "width", THead.childNodes[0].childNodes[i].getWidth() );
					}
				}else if(i>4){
					if( THead.childNodes[0].childNodes[i].getWidth() > TBody.childNodes[PEU].childNodes[i+1].getWidth()){
						TBody.childNodes[PEU].childNodes[i+1].setAttribute( "width", THead.childNodes[0].childNodes[i].getWidth() );
					}
				}else{*/
					if( THead.childNodes[0].childNodes[i].getWidth() > TBody.childNodes[PEU].childNodes[i].getWidth())//{
						TBody.childNodes[PEU].childNodes[i].setAttribute( "width", THead.childNodes[0].childNodes[i].getWidth() );
					//}
				//}
			}
			
			
			for(var i=0; i<THead.childNodes[0].childNodes.length; i++){
				/*if(i==4){
					THead.childNodes[0].childNodes[i].setAttribute( "width", TBody.childNodes[PEU].childNodes[i].getWidth()+TBody.childNodes[PEU].childNodes[i+1].getWidth());
					THead.childNodes[0].childNodes[i].setAttribute.width=TBody.childNodes[PEU].childNodes[i].getWidth()+TBody.childNodes[PEU].childNodes[i+1].getWidth();
				}else if(i>4){
					THead.childNodes[0].childNodes[i].setAttribute( "width", TBody.childNodes[PEU].childNodes[i+1].getWidth());
					THead.childNodes[0].childNodes[i].setAttribute.width=TBody.childNodes[PEU].childNodes[i+1].getWidth();
				}else{*/
					THead.childNodes[0].childNodes[i].setAttribute( "width", TBody.childNodes[PEU].childNodes[i].getWidth()-1);
					THead.childNodes[0].childNodes[i].width=TBody.childNodes[PEU].childNodes[i].getWidth();
				//}
			}		
		}catch(e){alert(e);}
		}

	
	
function setNetworksTabs(){
	
		var xhr = createXhrObject();

		xhr.open("GET", "dynamic/getNetworkList.json", false);
		xhr.send(null);
		
		if (xhr.readyState == 4) 
		{
			if (xhr.status == 200) 
			{
				
				var JsonNetwork = eval("(" + xhr.responseText + ")");
				if(JsonNetwork.errMsg)
					alert('getNetworkList.json Bug Report: "+JsonNetwork.errMsg);	
				
				for( var i = 0 ; i< JsonNetwork.data.length ; i++ ){ 
					//alert(JsonNetwork.data[i].n)
					if(JsonNetwork.data[i].n && JsonNetwork.data[i].o){
						
						AjouterOnglet( JsonNetwork.data[i].n, false, false, true, "" );
						
						for( var j = 0 ; j< JsonNetwork.data[i].o.length ; j++ ){ 
							AjouterOnglet( JsonNetwork.data[i].o[j], false, false, false, JsonNetwork.data[i].n );
							if(j == 0)
								document.getElementById(JsonNetwork.data[i].o[j]).setAttribute("underClass", "active");
							else
								document.getElementById(JsonNetwork.data[i].o[j]).setAttribute("underClass", "inactive");
						}
					}else{
						AjouterOnglet( JsonNetwork.data[i], false, false, false, "" );
					}
					
				}
				
				setTabOngletHeight();
				
			}else {
				//document.getElementById('TabLogsDiv'dynamic/).innerHTML = 'dynamic/getLogs.json" + " not found";
			}
		}
	
}


/*  Prototype JavaScript framework, version 1.6.1
 *  (c) 2005-2009 Sam Stephenson
 *
 *  Prototype is freely distributable under the terms of an MIT-style license.
 *  For details, see the Prototype web site: http://www.prototypejs.org/
 *
 *--------------------------------------------------------------------------*/

var Prototype = {
  Version: '1.6.1',

  Browser: (function(){
    var ua = navigator.userAgent;
    var isOpera = Object.prototype.toString.call(window.opera) == '[object Opera]';
    return {
      IE:             !!window.attachEvent && !isOpera,
      Opera:          isOpera,
      WebKit:         ua.indexOf('AppleWebKit/') > -1,
      Gecko:          ua.indexOf('Gecko') > -1 && ua.indexOf('KHTML') === -1,
      MobileSafari:   /Apple.*Mobile.*Safari/.test(ua)
    }
  })(),

  BrowserFeatures: {
    XPath: !!document.evaluate,
    SelectorsAPI: !!document.querySelector,
    ElementExtensions: (function() {
      var constructor = window.Element || window.HTMLElement;
      return !!(constructor && constructor.prototype);
    })(),
    SpecificElementExtensions: (function() {
      if (typeof window.HTMLDivElement !== 'undefined')
        return true;

      var div = document.createElement('div');
      var form = document.createElement('form');
      var isSupported = false;

      if (div['__proto__'] && (div['__proto__'] !== form['__proto__'])) {
        isSupported = true;
      }

      div = form = null;

      return isSupported;
    })()
  },

  ScriptFragment: '<script[^>]*>([\\S\\s]*?)<\/script>',
  JSONFilter: /^\/\*-secure-([\s\S]*)\*\/\s*$/,

  emptyFunction: function() { },
  K: function(x) { return x }
};

if (Prototype.Browser.MobileSafari)
  Prototype.BrowserFeatures.SpecificElementExtensions = false;


var Abstract = { };


var Try = {
  these: function() {
    var returnValue;

    for (var i = 0, length = arguments.length; i < length; i++) {
      var lambda = arguments[i];
      try {
        returnValue = lambda();
        break;
      } catch (e) { }
    }

    return returnValue;
  }
};

/* Based on Alex Arnell's inheritance implementation. */

var Class = (function() {
  function subclass() {};
  function create() {
    var parent = null, properties = $A(arguments);
    if (Object.isFunction(properties[0]))
      parent = properties.shift();

    function klass() {
      this.initialize.apply(this, arguments);
    }

    Object.extend(klass, Class.Methods);
    klass.superclass = parent;
    klass.subclasses = [];

    if (parent) {
      subclass.prototype = parent.prototype;
      klass.prototype = new subclass;
      parent.subclasses.push(klass);
    }

    for (var i = 0; i < properties.length; i++)
      klass.addMethods(properties[i]);

    if (!klass.prototype.initialize)
      klass.prototype.initialize = Prototype.emptyFunction;

    klass.prototype.constructor = klass;
    return klass;
  }

  function addMethods(source) {
    var ancestor   = this.superclass && this.superclass.prototype;
    var properties = Object.keys(source);

    if (!Object.keys({ toString: true }).length) {
      if (source.toString != Object.prototype.toString)
        properties.push("toString");
      if (source.valueOf != Object.prototype.valueOf)
        properties.push("valueOf");
    }

    for (var i = 0, length = properties.length; i < length; i++) {
      var property = properties[i], value = source[property];
      if (ancestor && Object.isFunction(value) &&
          value.argumentNames().first() == "$super") {
        var method = value;
        value = (function(m) {
          return function() { return ancestor[m].apply(this, arguments); };
        })(property).wrap(method);

        value.valueOf = method.valueOf.bind(method);
        value.toString = method.toString.bind(method);
      }
      this.prototype[property] = value;
    }

    return this;
  }

  return {
    create: create,
    Methods: {
      addMethods: addMethods
    }
  };
})();
(function() {

  var _toString = Object.prototype.toString;

  function extend(destination, source) {
    for (var property in source)
      destination[property] = source[property];
    return destination;
  }

  function inspect(object) {
    try {
      if (isUndefined(object)) return 'undefined';
      if (object === null) return 'null';
      return object.inspect ? object.inspect() : String(object);
    } catch (e) {
      if (e instanceof RangeError) return '...';
      throw e;
    }
  }

  function toJSON(object) {
    var type = typeof object;
    switch (type) {
      case 'undefined':
      case 'function':
      case 'unknown': return;
      case 'boolean': return object.toString();
    }

    if (object === null) return 'null';
    if (object.toJSON) return object.toJSON();
    if (isElement(object)) return;

    var results = [];
    for (var property in object) {
      var value = toJSON(object[property]);
      if (!isUndefined(value))
        results.push(property.toJSON() + ': ' + value);
    }

    return '{' + results.join(', ') + '}';
  }

  function toQueryString(object) {
    return $H(object).toQueryString();
  }

  function toHTML(object) {
    return object && object.toHTML ? object.toHTML() : String.interpret(object);
  }

  function keys(object) {
    var results = [];
    for (var property in object)
      results.push(property);
    return results;
  }

  function values(object) {
    var results = [];
    for (var property in object)
      results.push(object[property]);
    return results;
  }

  function clone(object) {
    return extend({ }, object);
  }

  function isElement(object) {
    return !!(object && object.nodeType == 1);
  }

  function isArray(object) {
    return _toString.call(object) == "[object Array]";
  }


  function isHash(object) {
    return object instanceof Hash;
  }

  function isFunction(object) {
    return typeof object === "function";
  }

  function isString(object) {
    return _toString.call(object) == "[object String]";
  }

  function isNumber(object) {
    return _toString.call(object) == "[object Number]";
  }

  function isUndefined(object) {
    return typeof object === "undefined";
  }

  extend(Object, {
    extend:        extend,
    inspect:       inspect,
    toJSON:        toJSON,
    toQueryString: toQueryString,
    toHTML:        toHTML,
    keys:          keys,
    values:        values,
    clone:         clone,
    isElement:     isElement,
    isArray:       isArray,
    isHash:        isHash,
    isFunction:    isFunction,
    isString:      isString,
    isNumber:      isNumber,
    isUndefined:   isUndefined
  });
})();
Object.extend(Function.prototype, (function() {
  var slice = Array.prototype.slice;

  function update(array, args) {
    var arrayLength = array.length, length = args.length;
    while (length--) array[arrayLength + length] = args[length];
    return array;
  }

  function merge(array, args) {
    array = slice.call(array, 0);
    return update(array, args);
  }

  function argumentNames() {
    var names = this.toString().match(/^[\s\(]*function[^(]*\(([^)]*)\)/)[1]
      .replace(/\/\/.*?[\r\n]|\/\*(?:.|[\r\n])*?\*\//g, '')
      .replace(/\s+/g, '').split(',');
    return names.length == 1 && !names[0] ? [] : names;
  }

  function bind(context) {
    if (arguments.length < 2 && Object.isUndefined(arguments[0])) return this;
    var __method = this, args = slice.call(arguments, 1);
    return function() {
      var a = merge(args, arguments);
      return __method.apply(context, a);
    }
  }

  function bindAsEventListener(context) {
    var __method = this, args = slice.call(arguments, 1);
    return function(event) {
      var a = update([event || window.event], args);
      return __method.apply(context, a);
    }
  }

  function curry() {
    if (!arguments.length) return this;
    var __method = this, args = slice.call(arguments, 0);
    return function() {
      var a = merge(args, arguments);
      return __method.apply(this, a);
    }
  }

  function delay(timeout) {
    var __method = this, args = slice.call(arguments, 1);
    timeout = timeout * 1000
    return window.setTimeout(function() {
      return __method.apply(__method, args);
    }, timeout);
  }

  function defer() {
    var args = update([0.01], arguments);
    return this.delay.apply(this, args);
  }

  function wrap(wrapper) {
    var __method = this;
    return function() {
      var a = update([__method.bind(this)], arguments);
      return wrapper.apply(this, a);
    }
  }

  function methodize() {
    if (this._methodized) return this._methodized;
    var __method = this;
    return this._methodized = function() {
      var a = update([this], arguments);
      return __method.apply(null, a);
    };
  }

  return {
    argumentNames:       argumentNames,
    bind:                bind,
    bindAsEventListener: bindAsEventListener,
    curry:               curry,
    delay:               delay,
    defer:               defer,
    wrap:                wrap,
    methodize:           methodize
  }
})());


Date.prototype.toJSON = function() {
  return '"' + this.getUTCFullYear() + '-' +
    (this.getUTCMonth() + 1).toPaddedString(2) + '-' +
    this.getUTCDate().toPaddedString(2) + 'T' +
    this.getUTCHours().toPaddedString(2) + ':' +
    this.getUTCMinutes().toPaddedString(2) + ':' +
    this.getUTCSeconds().toPaddedString(2) + 'Z"';
};


RegExp.prototype.match = RegExp.prototype.test;

RegExp.escape = function(str) {
  return String(str).replace(/([.*+?^=!:${}()|[\]\/\\])/g, '\\$1');
};
var PeriodicalExecuter = Class.create({
  initialize: function(callback, frequency) {
    this.callback = callback;
    this.frequency = frequency;
    this.currentlyExecuting = false;

    this.registerCallback();
  },

  registerCallback: function() {
    this.timer = setInterval(this.onTimerEvent.bind(this), this.frequency * 1000);
  },

  execute: function() {
    this.callback(this);
  },

  stop: function() {
    if (!this.timer) return;
    clearInterval(this.timer);
    this.timer = null;
  },

  onTimerEvent: function() {
    if (!this.currentlyExecuting) {
      try {
        this.currentlyExecuting = true;
        this.execute();
        this.currentlyExecuting = false;
      } catch(e) {
        this.currentlyExecuting = false;
        throw e;
      }
    }
  }
});
Object.extend(String, {
  interpret: function(value) {
    return value == null ? '' : String(value);
  },
  specialChar: {
    '\b': '\\b',
    '\t': '\\t',
    '\n': '\\n',
    '\f': '\\f',
    '\r': '\\r',
    '\\': '\\\\'
  }
});

Object.extend(String.prototype, (function() {

  function prepareReplacement(replacement) {
    if (Object.isFunction(replacement)) return replacement;
    var template = new Template(replacement);
    return function(match) { return template.evaluate(match) };
  }

  function gsub(pattern, replacement) {
    var result = '', source = this, match;
    replacement = prepareReplacement(replacement);

    if (Object.isString(pattern))
      pattern = RegExp.escape(pattern);

    if (!(pattern.length || pattern.source)) {
      replacement = replacement('');
      return replacement + source.split('').join(replacement) + replacement;
    }

    while (source.length > 0) {
      if (match = source.match(pattern)) {
        result += source.slice(0, match.index);
        result += String.interpret(replacement(match));
        source  = source.slice(match.index + match[0].length);
      } else {
        result += source, source = '';
      }
    }
    return result;
  }

  function sub(pattern, replacement, count) {
    replacement = prepareReplacement(replacement);
    count = Object.isUndefined(count) ? 1 : count;

    return this.gsub(pattern, function(match) {
      if (--count < 0) return match[0];
      return replacement(match);
    });
  }

  function scan(pattern, iterator) {
    this.gsub(pattern, iterator);
    return String(this);
  }

  function truncate(length, truncation) {
    length = length || 30;
    truncation = Object.isUndefined(truncation) ? '...' : truncation;
    return this.length > length ?
      this.slice(0, length - truncation.length) + truncation : String(this);
  }

  function strip() {
    return this.replace(/^\s+/, '').replace(/\s+$/, '');
  }

  function stripTags() {
    return this.replace(/<\w+(\s+("[^"]*"|'[^']*'|[^>])+)?>|<\/\w+>/gi, '');
  }

  function stripScripts() {
    return this.replace(new RegExp(Prototype.ScriptFragment, 'img'), '');
  }

  function extractScripts() {
    var matchAll = new RegExp(Prototype.ScriptFragment, 'img');
    var matchOne = new RegExp(Prototype.ScriptFragment, 'im');
    return (this.match(matchAll) || []).map(function(scriptTag) {
      return (scriptTag.match(matchOne) || ['', ''])[1];
    });
  }

  function evalScripts() {
    return this.extractScripts().map(function(script) { return eval(script) });
  }

  function escapeHTML() {
    return this.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

  function unescapeHTML() {
    return this.stripTags().replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&');
  }


  function toQueryParams(separator) {
    var match = this.strip().match(/([^?#]*)(#.*)?$/);
    if (!match) return { };

    return match[1].split(separator || '&').inject({ }, function(hash, pair) {
      if ((pair = pair.split('='))[0]) {
        var key = decodeURIComponent(pair.shift());
        var value = pair.length > 1 ? pair.join('=') : pair[0];
        if (value != undefined) value = decodeURIComponent(value);

        if (key in hash) {
          if (!Object.isArray(hash[key])) hash[key] = [hash[key]];
          hash[key].push(value);
        }
        else hash[key] = value;
      }
      return hash;
    });
  }

  function toArray() {
    return this.split('');
  }

  function succ() {
    return this.slice(0, this.length - 1) +
      String.fromCharCode(this.charCodeAt(this.length - 1) + 1);
  }

  function times(count) {
    return count < 1 ? '' : new Array(count + 1).join(this);
  }

  function camelize() {
    var parts = this.split('-'), len = parts.length;
    if (len == 1) return parts[0];

    var camelized = this.charAt(0) == '-'
      ? parts[0].charAt(0).toUpperCase() + parts[0].substring(1)
      : parts[0];

    for (var i = 1; i < len; i++)
      camelized += parts[i].charAt(0).toUpperCase() + parts[i].substring(1);

    return camelized;
  }

  function capitalize() {
    return this.charAt(0).toUpperCase() + this.substring(1).toLowerCase();
  }

  function underscore() {
    return this.replace(/::/g, '/')
               .replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2')
               .replace(/([a-z\d])([A-Z])/g, '$1_$2')
               .replace(/-/g, '_')
               .toLowerCase();
  }

  function dasherize() {
    return this.replace(/_/g, '-');
  }

  function inspect(useDoubleQuotes) {
    var escapedString = this.replace(/[\x00-\x1f\\]/g, function(character) {
      if (character in String.specialChar) {
        return String.specialChar[character];
      }
      return '\\u00' + character.charCodeAt().toPaddedString(2, 16);
    });
    if (useDoubleQuotes) return '"' + escapedString.replace(/"/g, '\\"') + '"';
    return "'" + escapedString.replace(/'/g, '\\\'') + "'";
  }

  function toJSON() {
    return this.inspect(true);
  }

  function unfilterJSON(filter) {
    return this.replace(filter || Prototype.JSONFilter, '$1');
  }

  function isJSON() {
    var str = this;
    if (str.blank()) return false;
    str = this.replace(/\\./g, '@').replace(/"[^"\\\n\r]*"/g, '');
    return (/^[,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t]*$/).test(str);
  }

  function evalJSON(sanitize) {
    var json = this.unfilterJSON();
    try {
      if (!sanitize || json.isJSON()) return eval('(' + json + ')');
    } catch (e) { }
    throw new SyntaxError('Badly formed JSON string: ' + this.inspect());
  }

  function include(pattern) {
    return this.indexOf(pattern) > -1;
  }

  function startsWith(pattern) {
    return this.indexOf(pattern) === 0;
  }

  function endsWith(pattern) {
    var d = this.length - pattern.length;
    return d >= 0 && this.lastIndexOf(pattern) === d;
  }

  function empty() {
    return this == '';
  }

  function blank() {
    return /^\s*$/.test(this);
  }

  function interpolate(object, pattern) {
    return new Template(this, pattern).evaluate(object);
  }

  return {
    gsub:           gsub,
    sub:            sub,
    scan:           scan,
    truncate:       truncate,
    strip:          String.prototype.trim ? String.prototype.trim : strip,
    stripTags:      stripTags,
    stripScripts:   stripScripts,
    extractScripts: extractScripts,
    evalScripts:    evalScripts,
    escapeHTML:     escapeHTML,
    unescapeHTML:   unescapeHTML,
    toQueryParams:  toQueryParams,
    parseQuery:     toQueryParams,
    toArray:        toArray,
    succ:           succ,
    times:          times,
    camelize:       camelize,
    capitalize:     capitalize,
    underscore:     underscore,
    dasherize:      dasherize,
    inspect:        inspect,
    toJSON:         toJSON,
    unfilterJSON:   unfilterJSON,
    isJSON:         isJSON,
    evalJSON:       evalJSON,
    include:        include,
    startsWith:     startsWith,
    endsWith:       endsWith,
    empty:          empty,
    blank:          blank,
    interpolate:    interpolate
  };
})());

var Template = Class.create({
  initialize: function(template, pattern) {
    this.template = template.toString();
    this.pattern = pattern || Template.Pattern;
  },

  evaluate: function(object) {
    if (object && Object.isFunction(object.toTemplateReplacements))
      object = object.toTemplateReplacements();

    return this.template.gsub(this.pattern, function(match) {
      if (object == null) return (match[1] + '');

      var before = match[1] || '';
      if (before == '\\') return match[2];

      var ctx = object, expr = match[3];
      var pattern = /^([^.[]+|\[((?:.*?[^\\])?)\])(\.|\[|$)/;
      match = pattern.exec(expr);
      if (match == null) return before;

      while (match != null) {
        var comp = match[1].startsWith('[') ? match[2].replace(/\\\\]/g, ']') : match[1];
        ctx = ctx[comp];
        if (null == ctx || '' == match[3]) break;
        expr = expr.substring('[' == match[3] ? match[1].length : match[0].length);
        match = pattern.exec(expr);
      }

      return before + String.interpret(ctx);
    });
  }
});
Template.Pattern = /(^|.|\r|\n)(#\{(.*?)\})/;

var $break = { };

var Enumerable = (function() {
  function each(iterator, context) {
    var index = 0;
    try {
      this._each(function(value) {
        iterator.call(context, value, index++);
      });
    } catch (e) {
      if (e != $break) throw e;
    }
    return this;
  }

  function eachSlice(number, iterator, context) {
    var index = -number, slices = [], array = this.toArray();
    if (number < 1) return array;
    while ((index += number) < array.length)
      slices.push(array.slice(index, index+number));
    return slices.collect(iterator, context);
  }

  function all(iterator, context) {
    iterator = iterator || Prototype.K;
    var result = true;
    this.each(function(value, index) {
      result = result && !!iterator.call(context, value, index);
      if (!result) throw $break;
    });
    return result;
  }

  function any(iterator, context) {
    iterator = iterator || Prototype.K;
    var result = false;
    this.each(function(value, index) {
      if (result = !!iterator.call(context, value, index))
        throw $break;
    });
    return result;
  }

  function collect(iterator, context) {
    iterator = iterator || Prototype.K;
    var results = [];
    this.each(function(value, index) {
      results.push(iterator.call(context, value, index));
    });
    return results;
  }

  function detect(iterator, context) {
    var result;
    this.each(function(value, index) {
      if (iterator.call(context, value, index)) {
        result = value;
        throw $break;
      }
    });
    return result;
  }

  function findAll(iterator, context) {
    var results = [];
    this.each(function(value, index) {
      if (iterator.call(context, value, index))
        results.push(value);
    });
    return results;
  }

  function grep(filter, iterator, context) {
    iterator = iterator || Prototype.K;
    var results = [];

    if (Object.isString(filter))
      filter = new RegExp(RegExp.escape(filter));

    this.each(function(value, index) {
      if (filter.match(value))
        results.push(iterator.call(context, value, index));
    });
    return results;
  }

  function include(object) {
    if (Object.isFunction(this.indexOf))
      if (this.indexOf(object) != -1) return true;

    var found = false;
    this.each(function(value) {
      if (value == object) {
        found = true;
        throw $break;
      }
    });
    return found;
  }

  function inGroupsOf(number, fillWith) {
    fillWith = Object.isUndefined(fillWith) ? null : fillWith;
    return this.eachSlice(number, function(slice) {
      while(slice.length < number) slice.push(fillWith);
      return slice;
    });
  }

  function inject(memo, iterator, context) {
    this.each(function(value, index) {
      memo = iterator.call(context, memo, value, index);
    });
    return memo;
  }

  function invoke(method) {
    var args = $A(arguments).slice(1);
    return this.map(function(value) {
      return value[method].apply(value, args);
    });
  }

  function max(iterator, context) {
    iterator = iterator || Prototype.K;
    var result;
    this.each(function(value, index) {
      value = iterator.call(context, value, index);
      if (result == null || value >= result)
        result = value;
    });
    return result;
  }

  function min(iterator, context) {
    iterator = iterator || Prototype.K;
    var result;
    this.each(function(value, index) {
      value = iterator.call(context, value, index);
      if (result == null || value < result)
        result = value;
    });
    return result;
  }

  function partition(iterator, context) {
    iterator = iterator || Prototype.K;
    var trues = [], falses = [];
    this.each(function(value, index) {
      (iterator.call(context, value, index) ?
        trues : falses).push(value);
    });
    return [trues, falses];
  }

  function pluck(property) {
    var results = [];
    this.each(function(value) {
      results.push(value[property]);
    });
    return results;
  }

  function reject(iterator, context) {
    var results = [];
    this.each(function(value, index) {
      if (!iterator.call(context, value, index))
        results.push(value);
    });
    return results;
  }

  function sortBy(iterator, context) {
    return this.map(function(value, index) {
      return {
        value: value,
        criteria: iterator.call(context, value, index)
      };
    }).sort(function(left, right) {
      var a = left.criteria, b = right.criteria;
      return a < b ? -1 : a > b ? 1 : 0;
    }).pluck('value');
  }

  function toArray() {
    return this.map();
  }

  function zip() {
    var iterator = Prototype.K, args = $A(arguments);
    if (Object.isFunction(args.last()))
      iterator = args.pop();

    var collections = [this].concat(args).map($A);
    return this.map(function(value, index) {
      return iterator(collections.pluck(index));
    });
  }

  function size() {
    return this.toArray().length;
  }

  function inspect() {
    return '#<Enumerable:' + this.toArray().inspect() + '>';
  }









  return {
    each:       each,
    eachSlice:  eachSlice,
    all:        all,
    every:      all,
    any:        any,
    some:       any,
    collect:    collect,
    map:        collect,
    detect:     detect,
    findAll:    findAll,
    select:     findAll,
    filter:     findAll,
    grep:       grep,
    include:    include,
    member:     include,
    inGroupsOf: inGroupsOf,
    inject:     inject,
    invoke:     invoke,
    max:        max,
    min:        min,
    partition:  partition,
    pluck:      pluck,
    reject:     reject,
    sortBy:     sortBy,
    toArray:    toArray,
    entries:    toArray,
    zip:        zip,
    size:       size,
    inspect:    inspect,
    find:       detect
  };
})();
function $A(iterable) {
  if (!iterable) return [];
  if ('toArray' in Object(iterable)) return iterable.toArray();
  var length = iterable.length || 0, results = new Array(length);
  while (length--) results[length] = iterable[length];
  return results;
}

function $w(string) {
  if (!Object.isString(string)) return [];
  string = string.strip();
  return string ? string.split(/\s+/) : [];
}

Array.from = $A;


(function() {
  var arrayProto = Array.prototype,
      slice = arrayProto.slice,
      _each = arrayProto.forEach; // use native browser JS 1.6 implementation if available

  function each(iterator) {
    for (var i = 0, length = this.length; i < length; i++)
      iterator(this[i]);
  }
  if (!_each) _each = each;

  function clear() {
    this.length = 0;
    return this;
  }

  function first() {
    return this[0];
  }

  function last() {
    return this[this.length - 1];
  }

  function compact() {
    return this.select(function(value) {
      return value != null;
    });
  }

  function flatten() {
    return this.inject([], function(array, value) {
      if (Object.isArray(value))
        return array.concat(value.flatten());
      array.push(value);
      return array;
    });
  }

  function without() {
    var values = slice.call(arguments, 0);
    return this.select(function(value) {
      return !values.include(value);
    });
  }

  function reverse(inline) {
    return (inline !== false ? this : this.toArray())._reverse();
  }

  function uniq(sorted) {
    return this.inject([], function(array, value, index) {
      if (0 == index || (sorted ? array.last() != value : !array.include(value)))
        array.push(value);
      return array;
    });
  }

  function intersect(array) {
    return this.uniq().findAll(function(item) {
      return array.detect(function(value) { return item === value });
    });
  }


  function clone() {
    return slice.call(this, 0);
  }

  function size() {
    return this.length;
  }

  function inspect() {
    return '[' + this.map(Object.inspect).join(', ') + ']';
  }

  function toJSON() {
    var results = [];
    this.each(function(object) {
      var value = Object.toJSON(object);
      if (!Object.isUndefined(value)) results.push(value);
    });
    return '[' + results.join(', ') + ']';
  }

  function indexOf(item, i) {
    i || (i = 0);
    var length = this.length;
    if (i < 0) i = length + i;
    for (; i < length; i++)
      if (this[i] === item) return i;
    return -1;
  }

  function lastIndexOf(item, i) {
    i = isNaN(i) ? this.length : (i < 0 ? this.length + i : i) + 1;
    var n = this.slice(0, i).reverse().indexOf(item);
    return (n < 0) ? n : i - n - 1;
  }

  function concat() {
    var array = slice.call(this, 0), item;
    for (var i = 0, length = arguments.length; i < length; i++) {
      item = arguments[i];
      if (Object.isArray(item) && !('callee' in item)) {
        for (var j = 0, arrayLength = item.length; j < arrayLength; j++)
          array.push(item[j]);
      } else {
        array.push(item);
      }
    }
    return array;
  }

  Object.extend(arrayProto, Enumerable);

  if (!arrayProto._reverse)
    arrayProto._reverse = arrayProto.reverse;

  Object.extend(arrayProto, {
    _each:     _each,
    clear:     clear,
    first:     first,
    last:      last,
    compact:   compact,
    flatten:   flatten,
    without:   without,
    reverse:   reverse,
    uniq:      uniq,
    intersect: intersect,
    clone:     clone,
    toArray:   clone,
    size:      size,
    inspect:   inspect,
    toJSON:    toJSON
  });

  var CONCAT_ARGUMENTS_BUGGY = (function() {
    return [].concat(arguments)[0][0] !== 1;
  })(1,2)

  if (CONCAT_ARGUMENTS_BUGGY) arrayProto.concat = concat;

  if (!arrayProto.indexOf) arrayProto.indexOf = indexOf;
  if (!arrayProto.lastIndexOf) arrayProto.lastIndexOf = lastIndexOf;
})();
function $H(object) {
  return new Hash(object);
};

var Hash = Class.create(Enumerable, (function() {
  function initialize(object) {
    this._object = Object.isHash(object) ? object.toObject() : Object.clone(object);
  }

  function _each(iterator) {
    for (var key in this._object) {
      var value = this._object[key], pair = [key, value];
      pair.key = key;
      pair.value = value;
      iterator(pair);
    }
  }

  function set(key, value) {
    return this._object[key] = value;
  }

  function get(key) {
    if (this._object[key] !== Object.prototype[key])
      return this._object[key];
  }

  function unset(key) {
    var value = this._object[key];
    delete this._object[key];
    return value;
  }

  function toObject() {
    return Object.clone(this._object);
  }

  function keys() {
    return this.pluck('key');
  }

  function values() {
    return this.pluck('value');
  }

  function index(value) {
    var match = this.detect(function(pair) {
      return pair.value === value;
    });
    return match && match.key;
  }

  function merge(object) {
    return this.clone().update(object);
  }

  function update(object) {
    return new Hash(object).inject(this, function(result, pair) {
      result.set(pair.key, pair.value);
      return result;
    });
  }

  function toQueryPair(key, value) {
    if (Object.isUndefined(value)) return key;
    return key + '=' + encodeURIComponent(String.interpret(value));
  }

  function toQueryString() {
    return this.inject([], function(results, pair) {
      var key = encodeURIComponent(pair.key), values = pair.value;

      if (values && typeof values == 'object') {
        if (Object.isArray(values))
          return results.concat(values.map(toQueryPair.curry(key)));
      } else results.push(toQueryPair(key, values));
      return results;
    }).join('&');
  }

  function inspect() {
    return '#<Hash:{' + this.map(function(pair) {
      return pair.map(Object.inspect).join(': ');
    }).join(', ') + '}>';
  }

  function toJSON() {
    return Object.toJSON(this.toObject());
  }

  function clone() {
    return new Hash(this);
  }

  return {
    initialize:             initialize,
    _each:                  _each,
    set:                    set,
    get:                    get,
    unset:                  unset,
    toObject:               toObject,
    toTemplateReplacements: toObject,
    keys:                   keys,
    values:                 values,
    index:                  index,
    merge:                  merge,
    update:                 update,
    toQueryString:          toQueryString,
    inspect:                inspect,
    toJSON:                 toJSON,
    clone:                  clone
  };
})());

Hash.from = $H;
Object.extend(Number.prototype, (function() {
  function toColorPart() {
    return this.toPaddedString(2, 16);
  }

  function succ() {
    return this + 1;
  }

  function times(iterator, context) {
    $R(0, this, true).each(iterator, context);
    return this;
  }

  function toPaddedString(length, radix) {
    var string = this.toString(radix || 10);
    return '0'.times(length - string.length) + string;
  }

  function toJSON() {
    return isFinite(this) ? this.toString() : 'null';
  }

  function abs() {
    return Math.abs(this);
  }

  function round() {
    return Math.round(this);
  }

  function ceil() {
    return Math.ceil(this);
  }

  function floor() {
    return Math.floor(this);
  }

  return {
    toColorPart:    toColorPart,
    succ:           succ,
    times:          times,
    toPaddedString: toPaddedString,
    toJSON:         toJSON,
    abs:            abs,
    round:          round,
    ceil:           ceil,
    floor:          floor
  };
})());

function $R(start, end, exclusive) {
  return new ObjectRange(start, end, exclusive);
}

var ObjectRange = Class.create(Enumerable, (function() {
  function initialize(start, end, exclusive) {
    this.start = start;
    this.end = end;
    this.exclusive = exclusive;
  }

  function _each(iterator) {
    var value = this.start;
    while (this.include(value)) {
      iterator(value);
      value = value.succ();
    }
  }

  function include(value) {
    if (value < this.start)
      return false;
    if (this.exclusive)
      return value < this.end;
    return value <= this.end;
  }

  return {
    initialize: initialize,
    _each:      _each,
    include:    include
  };
})());



var Ajax = {
  getTransport: function() {
    return Try.these(
      function() {return new XMLHttpRequest()},
      function() {return new ActiveXObject('Msxml2.XMLHTTP')},
      function() {return new ActiveXObject('Microsoft.XMLHTTP')}
    ) || false;
  },

  activeRequestCount: 0
};

Ajax.Responders = {
  responders: [],

  _each: function(iterator) {
    this.responders._each(iterator);
  },

  register: function(responder) {
    if (!this.include(responder))
      this.responders.push(responder);
  },

  unregister: function(responder) {
    this.responders = this.responders.without(responder);
  },

  dispatch: function(callback, request, transport, json) {
    this.each(function(responder) {
      if (Object.isFunction(responder[callback])) {
        try {
          responder[callback].apply(responder, [request, transport, json]);
        } catch (e) { }
      }
    });
  }
};

Object.extend(Ajax.Responders, Enumerable);

Ajax.Responders.register({
  onCreate:   function() { Ajax.activeRequestCount++ },
  onComplete: function() { Ajax.activeRequestCount-- }
});
Ajax.Base = Class.create({
  initialize: function(options) {
    this.options = {
      method:       'post',
      asynchronous: true,
      contentType:  'application/x-www-form-urlencoded',
      encoding:     'UTF-8',
      parameters:   '',
      evalJSON:     true,
      evalJS:       true
    };
    Object.extend(this.options, options || { });

    this.options.method = this.options.method.toLowerCase();

    if (Object.isString(this.options.parameters))
      this.options.parameters = this.options.parameters.toQueryParams();
    else if (Object.isHash(this.options.parameters))
      this.options.parameters = this.options.parameters.toObject();
  }
});
Ajax.Request = Class.create(Ajax.Base, {
  _complete: false,

  initialize: function($super, url, options) {
    $super(options);
    this.transport = Ajax.getTransport();
    this.request(url);
  },

  request: function(url) {
    this.url = url;
    this.method = this.options.method;
    var params = Object.clone(this.options.parameters);

    if (!['get', 'post'].include(this.method)) {
      params['_method'] = this.method;
      this.method = 'post';
    }

    this.parameters = params;

    if (params = Object.toQueryString(params)) {
      if (this.method == 'get')
        this.url += (this.url.include('?') ? '&' : '?') + params;
      else if (/Konqueror|Safari|KHTML/.test(navigator.userAgent))
        params += '&_=';
    }

    try {
      var response = new Ajax.Response(this);
      if (this.options.onCreate) this.options.onCreate(response);
      Ajax.Responders.dispatch('onCreate', this, response);

      this.transport.open(this.method.toUpperCase(), this.url,
        this.options.asynchronous);

      if (this.options.asynchronous) this.respondToReadyState.bind(this).defer(1);

      this.transport.onreadystatechange = this.onStateChange.bind(this);
      this.setRequestHeaders();

      this.body = this.method == 'post' ? (this.options.postBody || params) : null;
      this.transport.send(this.body);

      /* Force Firefox to handle ready state 4 for synchronous requests */
      if (!this.options.asynchronous && this.transport.overrideMimeType)
        this.onStateChange();

    }
    catch (e) {
      this.dispatchException(e);
    }
  },

  onStateChange: function() {
    var readyState = this.transport.readyState;
    if (readyState > 1 && !((readyState == 4) && this._complete))
      this.respondToReadyState(this.transport.readyState);
  },

  setRequestHeaders: function() {
    var headers = {
      'X-Requested-With': 'XMLHttpRequest',
      'X-Prototype-Version': Prototype.Version,
      'Accept': 'text/javascript, text/html, application/xml, text/xml, */*'
    };

    if (this.method == 'post') {
      headers['Content-type'] = this.options.contentType +
        (this.options.encoding ? '; charset=' + this.options.encoding : '');

      /* Force "Connection: close" for older Mozilla browsers to work
       * around a bug where XMLHttpRequest sends an incorrect
       * Content-length header. See Mozilla Bugzilla #246651.
       */
      if (this.transport.overrideMimeType &&
          (navigator.userAgent.match(/Gecko\/(\d{4})/) || [0,2005])[1] < 2005)
            headers['Connection'] = 'close';
    }

    if (typeof this.options.requestHeaders == 'object') {
      var extras = this.options.requestHeaders;

      if (Object.isFunction(extras.push))
        for (var i = 0, length = extras.length; i < length; i += 2)
          headers[extras[i]] = extras[i+1];
      else
        $H(extras).each(function(pair) { headers[pair.key] = pair.value });
    }

    for (var name in headers)
      this.transport.setRequestHeader(name, headers[name]);
  },

  success: function() {
    var status = this.getStatus();
    return !status || (status >= 200 && status < 300);
  },

  getStatus: function() {
    try {
      return this.transport.status || 0;
    } catch (e) { return 0 }
  },

  respondToReadyState: function(readyState) {
    var state = Ajax.Request.Events[readyState], response = new Ajax.Response(this);

    if (state == 'Complete') {
      try {
        this._complete = true;
        (this.options['on' + response.status]
         || this.options['on' + (this.success() ? 'Success' : 'Failure')]
         || Prototype.emptyFunction)(response, response.headerJSON);
      } catch (e) {
        this.dispatchException(e);
      }

      var contentType = response.getHeader('Content-type');
      if (this.options.evalJS == 'force'
          || (this.options.evalJS && this.isSameOrigin() && contentType
          && contentType.match(/^\s*(text|application)\/(x-)?(java|ecma)script(;.*)?\s*$/i)))
        this.evalResponse();
    }

    try {
      (this.options['on' + state] || Prototype.emptyFunction)(response, response.headerJSON);
      Ajax.Responders.dispatch('on' + state, this, response, response.headerJSON);
    } catch (e) {
      this.dispatchException(e);
    }

    if (state == 'Complete') {
      this.transport.onreadystatechange = Prototype.emptyFunction;
    }
  },

  isSameOrigin: function() {
    var m = this.url.match(/^\s*https?:\/\/[^\/]*/);
    return !m || (m[0] == '#{protocol}//#{domain}#{port}'.interpolate({
      protocol: location.protocol,
      domain: document.domain,
      port: location.port ? ':' + location.port : ''
    }));
  },

  getHeader: function(name) {
    try {
      return this.transport.getResponseHeader(name) || null;
    } catch (e) { return null; }
  },

  evalResponse: function() {
    try {
      return eval((this.transport.responseText || '').unfilterJSON());
    } catch (e) {
      this.dispatchException(e);
    }
  },

  dispatchException: function(exception) {
    (this.options.onException || Prototype.emptyFunction)(this, exception);
    Ajax.Responders.dispatch('onException', this, exception);
  }
});

Ajax.Request.Events =
  ['Uninitialized', 'Loading', 'Loaded', 'Interactive', 'Complete'];








Ajax.Response = Class.create({
  initialize: function(request){
    this.request = request;
    var transport  = this.transport  = request.transport,
        readyState = this.readyState = transport.readyState;

    if((readyState > 2 && !Prototype.Browser.IE) || readyState == 4) {
      this.status       = this.getStatus();
      this.statusText   = this.getStatusText();
      this.responseText = String.interpret(transport.responseText);
      this.headerJSON   = this._getHeaderJSON();
    }

    if(readyState == 4) {
      var xml = transport.responseXML;
      this.responseXML  = Object.isUndefined(xml) ? null : xml;
      this.responseJSON = this._getResponseJSON();
    }
  },

  status:      0,

  statusText: '',

  getStatus: Ajax.Request.prototype.getStatus,

  getStatusText: function() {
    try {
      return this.transport.statusText || '';
    } catch (e) { return '' }
  },

  getHeader: Ajax.Request.prototype.getHeader,

  getAllHeaders: function() {
    try {
      return this.getAllResponseHeaders();
    } catch (e) { return null }
  },

  getResponseHeader: function(name) {
    return this.transport.getResponseHeader(name);
  },

  getAllResponseHeaders: function() {
    return this.transport.getAllResponseHeaders();
  },

  _getHeaderJSON: function() {
    var json = this.getHeader('X-JSON');
    if (!json) return null;
    json = decodeURIComponent(escape(json));
    try {
      return json.evalJSON(this.request.options.sanitizeJSON ||
        !this.request.isSameOrigin());
    } catch (e) {
      this.request.dispatchException(e);
    }
  },

  _getResponseJSON: function() {
    var options = this.request.options;
    if (!options.evalJSON || (options.evalJSON != 'force' &&
      !(this.getHeader('Content-type') || '').include('application/json')) ||
        this.responseText.blank())
          return null;
    try {
      return this.responseText.evalJSON(options.sanitizeJSON ||
        !this.request.isSameOrigin());
    } catch (e) {
      this.request.dispatchException(e);
    }
  }
});

Ajax.Updater = Class.create(Ajax.Request, {
  initialize: function($super, container, url, options) {
    this.container = {
      success: (container.success || container),
      failure: (container.failure || (container.success ? null : container))
    };

    options = Object.clone(options);
    var onComplete = options.onComplete;
    options.onComplete = (function(response, json) {
      this.updateContent(response.responseText);
      if (Object.isFunction(onComplete)) onComplete(response, json);
    }).bind(this);

    $super(url, options);
  },

  updateContent: function(responseText) {
    var receiver = this.container[this.success() ? 'success' : 'failure'],
        options = this.options;

    if (!options.evalScripts) responseText = responseText.stripScripts();

    if (receiver = $(receiver)) {
      if (options.insertion) {
        if (Object.isString(options.insertion)) {
          var insertion = { }; insertion[options.insertion] = responseText;
          receiver.insert(insertion);
        }
        else options.insertion(receiver, responseText);
      }
      else receiver.update(responseText);
    }
  }
});

Ajax.PeriodicalUpdater = Class.create(Ajax.Base, {
  initialize: function($super, container, url, options) {
    $super(options);
    this.onComplete = this.options.onComplete;

    this.frequency = (this.options.frequency || 2);
    this.decay = (this.options.decay || 1);

    this.updater = { };
    this.container = container;
    this.url = url;

    this.start();
  },

  start: function() {
    this.options.onComplete = this.updateComplete.bind(this);
    this.onTimerEvent();
  },

  stop: function() {
    this.updater.options.onComplete = undefined;
    clearTimeout(this.timer);
    (this.onComplete || Prototype.emptyFunction).apply(this, arguments);
  },

  updateComplete: function(response) {
    if (this.options.decay) {
      this.decay = (response.responseText == this.lastText ?
        this.decay * this.options.decay : 1);

      this.lastText = response.responseText;
    }
    this.timer = this.onTimerEvent.bind(this).delay(this.decay * this.frequency);
  },

  onTimerEvent: function() {
    this.updater = new Ajax.Updater(this.container, this.url, this.options);
  }
});



function $(element) {
  if (arguments.length > 1) {
    for (var i = 0, elements = [], length = arguments.length; i < length; i++)
      elements.push($(arguments[i]));
    return elements;
  }
  if (Object.isString(element))
    element = document.getElementById(element);
  return Element.extend(element);
}

if (Prototype.BrowserFeatures.XPath) {
  document._getElementsByXPath = function(expression, parentElement) {
    var results = [];
    var query = document.evaluate(expression, $(parentElement) || document,
      null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    for (var i = 0, length = query.snapshotLength; i < length; i++)
      results.push(Element.extend(query.snapshotItem(i)));
    return results;
  };
}

/*--------------------------------------------------------------------------*/

if (!window.Node) var Node = { };

if (!Node.ELEMENT_NODE) {
  Object.extend(Node, {
    ELEMENT_NODE: 1,
    ATTRIBUTE_NODE: 2,
    TEXT_NODE: 3,
    CDATA_SECTION_NODE: 4,
    ENTITY_REFERENCE_NODE: 5,
    ENTITY_NODE: 6,
    PROCESSING_INSTRUCTION_NODE: 7,
    COMMENT_NODE: 8,
    DOCUMENT_NODE: 9,
    DOCUMENT_TYPE_NODE: 10,
    DOCUMENT_FRAGMENT_NODE: 11,
    NOTATION_NODE: 12
  });
}


(function(global) {

  var SETATTRIBUTE_IGNORES_NAME = (function(){
    var elForm = document.createElement("form");
    var elInput = document.createElement("input");
    var root = document.documentElement;
    elInput.setAttribute("name", "test");
    elForm.appendChild(elInput);
    root.appendChild(elForm);
    var isBuggy = elForm.elements
      ? (typeof elForm.elements.test == "undefined")
      : null;
    root.removeChild(elForm);
    elForm = elInput = null;
    return isBuggy;
  })();

  var element = global.Element;
  global.Element = function(tagName, attributes) {
    attributes = attributes || { };
    tagName = tagName.toLowerCase();
    var cache = Element.cache;
    if (SETATTRIBUTE_IGNORES_NAME && attributes.name) {
      tagName = '<' + tagName + ' name="' + attributes.name + '">';
      delete attributes.name;
      return Element.writeAttribute(document.createElement(tagName), attributes);
    }
    if (!cache[tagName]) cache[tagName] = Element.extend(document.createElement(tagName));
    return Element.writeAttribute(cache[tagName].cloneNode(false), attributes);
  };
  Object.extend(global.Element, element || { });
  if (element) global.Element.prototype = element.prototype;
})(this);

Element.cache = { };
Element.idCounter = 1;

Element.Methods = {
  visible: function(element) {
    return $(element).style.display != 'none';
  },

  toggle: function(element) {
    element = $(element);
    Element[Element.visible(element) ? 'hide' : 'show'](element);
    return element;
  },


  hide: function(element) {
    element = $(element);
    element.style.display = 'none';
    return element;
  },

  show: function(element) {
    element = $(element);
    element.style.display = '';
    return element;
  },

  remove: function(element) {
    element = $(element);
    element.parentNode.removeChild(element);
    return element;
  },

  update: (function(){

    var SELECT_ELEMENT_INNERHTML_BUGGY = (function(){
      var el = document.createElement("select"),
          isBuggy = true;
      el.innerHTML = "<option value=\"test\">test</option>";
      if (el.options && el.options[0]) {
        isBuggy = el.options[0].nodeName.toUpperCase() !== "OPTION";
      }
      el = null;
      return isBuggy;
    })();

    var TABLE_ELEMENT_INNERHTML_BUGGY = (function(){
      try {
        var el = document.createElement("table");
        if (el && el.tBodies) {
          el.innerHTML = "<tbody><tr><td>test</td></tr></tbody>";
          var isBuggy = typeof el.tBodies[0] == "undefined";
          el = null;
          return isBuggy;
        }
      } catch (e) {
        return true;
      }
    })();

    var SCRIPT_ELEMENT_REJECTS_TEXTNODE_APPENDING = (function () {
      var s = document.createElement("script"),
          isBuggy = false;
      try {
        s.appendChild(document.createTextNode(""));
        isBuggy = !s.firstChild ||
          s.firstChild && s.firstChild.nodeType !== 3;
      } catch (e) {
        isBuggy = true;
      }
      s = null;
      return isBuggy;
    })();

    function update(element, content) {
      element = $(element);

      if (content && content.toElement)
        content = content.toElement();

      if (Object.isElement(content))
        return element.update().insert(content);

      content = Object.toHTML(content);

      var tagName = element.tagName.toUpperCase();

      if (tagName === 'SCRIPT' && SCRIPT_ELEMENT_REJECTS_TEXTNODE_APPENDING) {
        element.text = content;
        return element;
      }

      if (SELECT_ELEMENT_INNERHTML_BUGGY || TABLE_ELEMENT_INNERHTML_BUGGY) {
        if (tagName in Element._insertionTranslations.tags) {
          while (element.firstChild) {
            element.removeChild(element.firstChild);
          }
          Element._getContentFromAnonymousElement(tagName, content.stripScripts())
            .each(function(node) {
              element.appendChild(node)
            });
        }
        else {
          element.innerHTML = content.stripScripts();
        }
      }
      else {
        element.innerHTML = content.stripScripts();
      }

      content.evalScripts.bind(content).defer();
      return element;
    }

    return update;
  })(),

  replace: function(element, content) {
    element = $(element);
    if (content && content.toElement) content = content.toElement();
    else if (!Object.isElement(content)) {
      content = Object.toHTML(content);
      var range = element.ownerDocument.createRange();
      range.selectNode(element);
      content.evalScripts.bind(content).defer();
      content = range.createContextualFragment(content.stripScripts());
    }
    element.parentNode.replaceChild(content, element);
    return element;
  },

  insert: function(element, insertions) {
    element = $(element);

    if (Object.isString(insertions) || Object.isNumber(insertions) ||
        Object.isElement(insertions) || (insertions && (insertions.toElement || insertions.toHTML)))
          insertions = {bottom:insertions};

    var content, insert, tagName, childNodes;

    for (var position in insertions) {
      content  = insertions[position];
      position = position.toLowerCase();
      insert = Element._insertionTranslations[position];

      if (content && content.toElement) content = content.toElement();
      if (Object.isElement(content)) {
        insert(element, content);
        continue;
      }

      content = Object.toHTML(content);

      tagName = ((position == 'before' || position == 'after')
        ? element.parentNode : element).tagName.toUpperCase();

      childNodes = Element._getContentFromAnonymousElement(tagName, content.stripScripts());

      if (position == 'top' || position == 'after') childNodes.reverse();
      childNodes.each(insert.curry(element));

      content.evalScripts.bind(content).defer();
    }

    return element;
  },

  wrap: function(element, wrapper, attributes) {
    element = $(element);
    if (Object.isElement(wrapper))
      $(wrapper).writeAttribute(attributes || { });
    else if (Object.isString(wrapper)) wrapper = new Element(wrapper, attributes);
    else wrapper = new Element('div', wrapper);
    if (element.parentNode)
      element.parentNode.replaceChild(wrapper, element);
    wrapper.appendChild(element);
    return wrapper;
  },

  inspect: function(element) {
    element = $(element);
    var result = '<' + element.tagName.toLowerCase();
    $H({'id': 'id', 'className': 'class'}).each(function(pair) {
      var property = pair.first(), attribute = pair.last();
      var value = (element[property] || '').toString();
      if (value) result += ' ' + attribute + '=' + value.inspect(true);
    });
    return result + '>';
  },

  recursivelyCollect: function(element, property) {
    element = $(element);
    var elements = [];
    while (element = element[property])
      if (element.nodeType == 1)
        elements.push(Element.extend(element));
    return elements;
  },

  ancestors: function(element) {
    return Element.recursivelyCollect(element, 'parentNode');
  },

  descendants: function(element) {
    return Element.select(element, "*");
  },

  firstDescendant: function(element) {
    element = $(element).firstChild;
    while (element && element.nodeType != 1) element = element.nextSibling;
    return $(element);
  },

  immediateDescendants: function(element) {
    if (!(element = $(element).firstChild)) return [];
    while (element && element.nodeType != 1) element = element.nextSibling;
    if (element) return [element].concat($(element).nextSiblings());
    return [];
  },

  previousSiblings: function(element) {
    return Element.recursivelyCollect(element, 'previousSibling');
  },

  nextSiblings: function(element) {
    return Element.recursivelyCollect(element, 'nextSibling');
  },

  siblings: function(element) {
    element = $(element);
    return Element.previousSiblings(element).reverse()
      .concat(Element.nextSiblings(element));
  },

  match: function(element, selector) {
    if (Object.isString(selector))
      selector = new Selector(selector);
    return selector.match($(element));
  },

  up: function(element, expression, index) {
    element = $(element);
    if (arguments.length == 1) return $(element.parentNode);
    var ancestors = Element.ancestors(element);
    return Object.isNumber(expression) ? ancestors[expression] :
      Selector.findElement(ancestors, expression, index);
  },

  down: function(element, expression, index) {
    element = $(element);
    if (arguments.length == 1) return Element.firstDescendant(element);
    return Object.isNumber(expression) ? Element.descendants(element)[expression] :
      Element.select(element, expression)[index || 0];
  },

  previous: function(element, expression, index) {
    element = $(element);
    if (arguments.length == 1) return $(Selector.handlers.previousElementSibling(element));
    var previousSiblings = Element.previousSiblings(element);
    return Object.isNumber(expression) ? previousSiblings[expression] :
      Selector.findElement(previousSiblings, expression, index);
  },

  next: function(element, expression, index) {
    element = $(element);
    if (arguments.length == 1) return $(Selector.handlers.nextElementSibling(element));
    var nextSiblings = Element.nextSiblings(element);
    return Object.isNumber(expression) ? nextSiblings[expression] :
      Selector.findElement(nextSiblings, expression, index);
  },


  select: function(element) {
    var args = Array.prototype.slice.call(arguments, 1);
    return Selector.findChildElements(element, args);
  },

  adjacent: function(element) {
    var args = Array.prototype.slice.call(arguments, 1);
    return Selector.findChildElements(element.parentNode, args).without(element);
  },

  identify: function(element) {
    element = $(element);
    var id = Element.readAttribute(element, 'id');
    if (id) return id;
    do { id = 'anonymous_element_' + Element.idCounter++ } while ($(id));
    Element.writeAttribute(element, 'id', id);
    return id;
  },

  readAttribute: function(element, name) {
    element = $(element);
    if (Prototype.Browser.IE) {
      var t = Element._attributeTranslations.read;
      if (t.values[name]) return t.values[name](element, name);
      if (t.names[name]) name = t.names[name];
      if (name.include(':')) {
        return (!element.attributes || !element.attributes[name]) ? null :
         element.attributes[name].value;
      }
    }
    return element.getAttribute(name);
  },

  writeAttribute: function(element, name, value) {
    element = $(element);
    var attributes = { }, t = Element._attributeTranslations.write;

    if (typeof name == 'object') attributes = name;
    else attributes[name] = Object.isUndefined(value) ? true : value;

    for (var attr in attributes) {
      name = t.names[attr] || attr;
      value = attributes[attr];
      if (t.values[attr]) name = t.values[attr](element, value);
      if (value === false || value === null)
        element.removeAttribute(name);
      else if (value === true)
        element.setAttribute(name, name);
      else element.setAttribute(name, value);
    }
    return element;
  },

  getHeight: function(element) {
    return Element.getDimensions(element).height;
  },

  getWidth: function(element) {
    return Element.getDimensions(element).width;
  },

  classNames: function(element) {
    return new Element.ClassNames(element);
  },

  hasClassName: function(element, className) {
    if (!(element = $(element))) return;
    var elementClassName = element.className;
    return (elementClassName.length > 0 && (elementClassName == className ||
      new RegExp("(^|\\s)" + className + "(\\s|$)").test(elementClassName)));
  },

  addClassName: function(element, className) {
    if (!(element = $(element))) return;
    if (!Element.hasClassName(element, className))
      element.className += (element.className ? ' ' : '') + className;
    return element;
  },

  removeClassName: function(element, className) {
    if (!(element = $(element))) return;
    element.className = element.className.replace(
      new RegExp("(^|\\s+)" + className + "(\\s+|$)"), ' ').strip();
    return element;
  },

  toggleClassName: function(element, className) {
    if (!(element = $(element))) return;
    return Element[Element.hasClassName(element, className) ?
      'removeClassName' : 'addClassName'](element, className);
  },

  cleanWhitespace: function(element) {
    element = $(element);
    var node = element.firstChild;
    while (node) {
      var nextNode = node.nextSibling;
      if (node.nodeType == 3 && !/\S/.test(node.nodeValue))
        element.removeChild(node);
      node = nextNode;
    }
    return element;
  },

  empty: function(element) {
    return $(element).innerHTML.blank();
  },

  descendantOf: function(element, ancestor) {
    element = $(element), ancestor = $(ancestor);

    if (element.compareDocumentPosition)
      return (element.compareDocumentPosition(ancestor) & 8) === 8;

    if (ancestor.contains)
      return ancestor.contains(element) && ancestor !== element;

    while (element = element.parentNode)
      if (element == ancestor) return true;

    return false;
  },

  scrollTo: function(element) {
    element = $(element);
    var pos = Element.cumulativeOffset(element);
    window.scrollTo(pos[0], pos[1]);
    return element;
  },

  getStyle: function(element, style) {
    element = $(element);
    style = style == 'float' ? 'cssFloat' : style.camelize();
    var value = element.style[style];
    if (!value || value == 'auto') {
      var css = document.defaultView.getComputedStyle(element, null);
      value = css ? css[style] : null;
    }
    if (style == 'opacity') return value ? parseFloat(value) : 1.0;
    return value == 'auto' ? null : value;
  },

  getOpacity: function(element) {
    return $(element).getStyle('opacity');
  },

  setStyle: function(element, styles) {
    element = $(element);
    var elementStyle = element.style, match;
    if (Object.isString(styles)) {
      element.style.cssText += ';' + styles;
      return styles.include('opacity') ?
        element.setOpacity(styles.match(/opacity:\s*(\d?\.?\d*)/)[1]) : element;
    }
    for (var property in styles)
      if (property == 'opacity') element.setOpacity(styles[property]);
      else
        elementStyle[(property == 'float' || property == 'cssFloat') ?
          (Object.isUndefined(elementStyle.styleFloat) ? 'cssFloat' : 'styleFloat') :
            property] = styles[property];

    return element;
  },

  setOpacity: function(element, value) {
    element = $(element);
    element.style.opacity = (value == 1 || value === '') ? '' :
      (value < 0.00001) ? 0 : value;
    return element;
  },

  getDimensions: function(element) {
    element = $(element);
    var display = Element.getStyle(element, 'display');
    if (display != 'none' && display != null) // Safari bug
      return {width: element.offsetWidth, height: element.offsetHeight};

    var els = element.style;
    var originalVisibility = els.visibility;
    var originalPosition = els.position;
    var originalDisplay = els.display;
    els.visibility = 'hidden';
    if (originalPosition != 'fixed') // Switching fixed to absolute causes issues in Safari
      els.position = 'absolute';
    els.display = 'block';
    var originalWidth = element.clientWidth;
    var originalHeight = element.clientHeight;
    els.display = originalDisplay;
    els.position = originalPosition;
    els.visibility = originalVisibility;
    return {width: originalWidth, height: originalHeight};
  },

  makePositioned: function(element) {
    element = $(element);
    var pos = Element.getStyle(element, 'position');
    if (pos == 'static' || !pos) {
      element._madePositioned = true;
      element.style.position = 'relative';
      if (Prototype.Browser.Opera) {
        element.style.top = 0;
        element.style.left = 0;
      }
    }
    return element;
  },

  undoPositioned: function(element) {
    element = $(element);
    if (element._madePositioned) {
      element._madePositioned = undefined;
      element.style.position =
        element.style.top =
        element.style.left =
        element.style.bottom =
        element.style.right = '';
    }
    return element;
  },

  makeClipping: function(element) {
    element = $(element);
    if (element._overflow) return element;
    element._overflow = Element.getStyle(element, 'overflow') || 'auto';
    if (element._overflow !== 'hidden')
      element.style.overflow = 'hidden';
    return element;
  },

  undoClipping: function(element) {
    element = $(element);
    if (!element._overflow) return element;
    element.style.overflow = element._overflow == 'auto' ? '' : element._overflow;
    element._overflow = null;
    return element;
  },

  cumulativeOffset: function(element) {
    var valueT = 0, valueL = 0;
    do {
      valueT += element.offsetTop  || 0;
      valueL += element.offsetLeft || 0;
      element = element.offsetParent;
    } while (element);
    return Element._returnOffset(valueL, valueT);
  },

  positionedOffset: function(element) {
    var valueT = 0, valueL = 0;
    do {
      valueT += element.offsetTop  || 0;
      valueL += element.offsetLeft || 0;
      element = element.offsetParent;
      if (element) {
        if (element.tagName.toUpperCase() == 'BODY') break;
        var p = Element.getStyle(element, 'position');
        if (p !== 'static') break;
      }
    } while (element);
    return Element._returnOffset(valueL, valueT);
  },

  absolutize: function(element) {
    element = $(element);
    if (Element.getStyle(element, 'position') == 'absolute') return element;

    var offsets = Element.positionedOffset(element);
    var top     = offsets[1];
    var left    = offsets[0];
    var width   = element.clientWidth;
    var height  = element.clientHeight;

    element._originalLeft   = left - parseFloat(element.style.left  || 0);
    element._originalTop    = top  - parseFloat(element.style.top || 0);
    element._originalWidth  = element.style.width;
    element._originalHeight = element.style.height;

    element.style.position = 'absolute';
    element.style.top    = top + 'px';
    element.style.left   = left + 'px';
    element.style.width  = width + 'px';
    element.style.height = height + 'px';
    return element;
  },

  relativize: function(element) {
    element = $(element);
    if (Element.getStyle(element, 'position') == 'relative') return element;

    element.style.position = 'relative';
    var top  = parseFloat(element.style.top  || 0) - (element._originalTop || 0);
    var left = parseFloat(element.style.left || 0) - (element._originalLeft || 0);

    element.style.top    = top + 'px';
    element.style.left   = left + 'px';
    element.style.height = element._originalHeight;
    element.style.width  = element._originalWidth;
    return element;
  },

  cumulativeScrollOffset: function(element) {
    var valueT = 0, valueL = 0;
    do {
      valueT += element.scrollTop  || 0;
      valueL += element.scrollLeft || 0;
      element = element.parentNode;
    } while (element);
    return Element._returnOffset(valueL, valueT);
  },

  getOffsetParent: function(element) {
    if (element.offsetParent) return $(element.offsetParent);
    if (element == document.body) return $(element);

    while ((element = element.parentNode) && element != document.body)
      if (Element.getStyle(element, 'position') != 'static')
        return $(element);

    return $(document.body);
  },

  viewportOffset: function(forElement) {
    var valueT = 0, valueL = 0;

    var element = forElement;
    do {
      valueT += element.offsetTop  || 0;
      valueL += element.offsetLeft || 0;

      if (element.offsetParent == document.body &&
        Element.getStyle(element, 'position') == 'absolute') break;

    } while (element = element.offsetParent);

    element = forElement;
    do {
      if (!Prototype.Browser.Opera || (element.tagName && (element.tagName.toUpperCase() == 'BODY'))) {
        valueT -= element.scrollTop  || 0;
        valueL -= element.scrollLeft || 0;
      }
    } while (element = element.parentNode);

    return Element._returnOffset(valueL, valueT);
  },

  clonePosition: function(element, source) {
    var options = Object.extend({
      setLeft:    true,
      setTop:     true,
      setWidth:   true,
      setHeight:  true,
      offsetTop:  0,
      offsetLeft: 0
    }, arguments[2] || { });

    source = $(source);
    var p = Element.viewportOffset(source);

    element = $(element);
    var delta = [0, 0];
    var parent = null;
    if (Element.getStyle(element, 'position') == 'absolute') {
      parent = Element.getOffsetParent(element);
      delta = Element.viewportOffset(parent);
    }

    if (parent == document.body) {
      delta[0] -= document.body.offsetLeft;
      delta[1] -= document.body.offsetTop;
    }

    if (options.setLeft)   element.style.left  = (p[0] - delta[0] + options.offsetLeft) + 'px';
    if (options.setTop)    element.style.top   = (p[1] - delta[1] + options.offsetTop) + 'px';
    if (options.setWidth)  element.style.width = source.offsetWidth + 'px';
    if (options.setHeight) element.style.height = source.offsetHeight + 'px';
    return element;
  }
};

Object.extend(Element.Methods, {
  getElementsBySelector: Element.Methods.select,

  childElements: Element.Methods.immediateDescendants
});

Element._attributeTranslations = {
  write: {
    names: {
      className: 'class',
      htmlFor:   'for'
    },
    values: { }
  }
};

if (Prototype.Browser.Opera) {
  Element.Methods.getStyle = Element.Methods.getStyle.wrap(
    function(proceed, element, style) {
      switch (style) {
        case 'left': case 'top': case 'right': case 'bottom':
          if (proceed(element, 'position') === 'static') return null;
        case 'height': case 'width':
          if (!Element.visible(element)) return null;

          var dim = parseInt(proceed(element, style), 10);

          if (dim !== element['offset' + style.capitalize()])
            return dim + 'px';

          var properties;
          if (style === 'height') {
            properties = ['border-top-width', 'padding-top',
             'padding-bottom', 'border-bottom-width'];
          }
          else {
            properties = ['border-left-width', 'padding-left',
             'padding-right', 'border-right-width'];
          }
          return properties.inject(dim, function(memo, property) {
            var val = proceed(element, property);
            return val === null ? memo : memo - parseInt(val, 10);
          }) + 'px';
        default: return proceed(element, style);
      }
    }
  );

  Element.Methods.readAttribute = Element.Methods.readAttribute.wrap(
    function(proceed, element, attribute) {
      if (attribute === 'title') return element.title;
      return proceed(element, attribute);
    }
  );
}

else if (Prototype.Browser.IE) {
  Element.Methods.getOffsetParent = Element.Methods.getOffsetParent.wrap(
    function(proceed, element) {
      element = $(element);
      try { element.offsetParent }
      catch(e) { return $(document.body) }
      var position = element.getStyle('position');
      if (position !== 'static') return proceed(element);
      element.setStyle({ position: 'relative' });
      var value = proceed(element);
      element.setStyle({ position: position });
      return value;
    }
  );

  $w('positionedOffset viewportOffset').each(function(method) {
    Element.Methods[method] = Element.Methods[method].wrap(
      function(proceed, element) {
        element = $(element);
        try { element.offsetParent }
        catch(e) { return Element._returnOffset(0,0) }
        var position = element.getStyle('position');
        if (position !== 'static') return proceed(element);
        var offsetParent = element.getOffsetParent();
        if (offsetParent && offsetParent.getStyle('position') === 'fixed')
          offsetParent.setStyle({ zoom: 1 });
        element.setStyle({ position: 'relative' });
        var value = proceed(element);
        element.setStyle({ position: position });
        return value;
      }
    );
  });

  Element.Methods.cumulativeOffset = Element.Methods.cumulativeOffset.wrap(
    function(proceed, element) {
      try { element.offsetParent }
      catch(e) { return Element._returnOffset(0,0) }
      return proceed(element);
    }
  );

  Element.Methods.getStyle = function(element, style) {
    element = $(element);
    style = (style == 'float' || style == 'cssFloat') ? 'styleFloat' : style.camelize();
    var value = element.style[style];
    if (!value && element.currentStyle) value = element.currentStyle[style];

    if (style == 'opacity') {
      if (value = (element.getStyle('filter') || '').match(/alpha\(opacity=(.*)\)/))
        if (value[1]) return parseFloat(value[1]) / 100;
      return 1.0;
    }

    if (value == 'auto') {
      if ((style == 'width' || style == 'height') && (element.getStyle('display') != 'none'))
        return element['offset' + style.capitalize()] + 'px';
      return null;
    }
    return value;
  };

  Element.Methods.setOpacity = function(element, value) {
    function stripAlpha(filter){
      return filter.replace(/alpha\([^\)]*\)/gi,'');
    }
    element = $(element);
    var currentStyle = element.currentStyle;
    if ((currentStyle && !currentStyle.hasLayout) ||
      (!currentStyle && element.style.zoom == 'normal'))
        element.style.zoom = 1;

    var filter = element.getStyle('filter'), style = element.style;
    if (value == 1 || value === '') {
      (filter = stripAlpha(filter)) ?
        style.filter = filter : style.removeAttribute('filter');
      return element;
    } else if (value < 0.00001) value = 0;
    style.filter = stripAlpha(filter) +
      'alpha(opacity=' + (value * 100) + ')';
    return element;
  };

  Element._attributeTranslations = (function(){

    var classProp = 'className';
    var forProp = 'for';

    var el = document.createElement('div');

    el.setAttribute(classProp, 'x');

    if (el.className !== 'x') {
      el.setAttribute('class', 'x');
      if (el.className === 'x') {
        classProp = 'class';
      }
    }
    el = null;

    el = document.createElement('label');
    el.setAttribute(forProp, 'x');
    if (el.htmlFor !== 'x') {
      el.setAttribute('htmlFor', 'x');
      if (el.htmlFor === 'x') {
        forProp = 'htmlFor';
      }
    }
    el = null;

    return {
      read: {
        names: {
          'class':      classProp,
          'className':  classProp,
          'for':        forProp,
          'htmlFor':    forProp
        },
        values: {
          _getAttr: function(element, attribute) {
            return element.getAttribute(attribute);
          },
          _getAttr2: function(element, attribute) {
            return element.getAttribute(attribute, 2);
          },
          _getAttrNode: function(element, attribute) {
            var node = element.getAttributeNode(attribute);
            return node ? node.value : "";
          },
          _getEv: (function(){

            var el = document.createElement('div');
            el.onclick = Prototype.emptyFunction;
            var value = el.getAttribute('onclick');
            var f;

            if (String(value).indexOf('{') > -1) {
              f = function(element, attribute) {
                attribute = element.getAttribute(attribute);
                if (!attribute) return null;
                attribute = attribute.toString();
                attribute = attribute.split('{')[1];
                attribute = attribute.split('}')[0];
                return attribute.strip();
              };
            }
            else if (value === '') {
              f = function(element, attribute) {
                attribute = element.getAttribute(attribute);
                if (!attribute) return null;
                return attribute.strip();
              };
            }
            el = null;
            return f;
          })(),
          _flag: function(element, attribute) {
            return $(element).hasAttribute(attribute) ? attribute : null;
          },
          style: function(element) {
            return element.style.cssText.toLowerCase();
          },
          title: function(element) {
            return element.title;
          }
        }
      }
    }
  })();

  Element._attributeTranslations.write = {
    names: Object.extend({
      cellpadding: 'cellPadding',
      cellspacing: 'cellSpacing'
    }, Element._attributeTranslations.read.names),
    values: {
      checked: function(element, value) {
        element.checked = !!value;
      },

      style: function(element, value) {
        element.style.cssText = value ? value : '';
      }
    }
  };

  Element._attributeTranslations.has = {};

  $w('colSpan rowSpan vAlign dateTime accessKey tabIndex ' +
      'encType maxLength readOnly longDesc frameBorder').each(function(attr) {
    Element._attributeTranslations.write.names[attr.toLowerCase()] = attr;
    Element._attributeTranslations.has[attr.toLowerCase()] = attr;
  });

  (function(v) {
    Object.extend(v, {
      href:        v._getAttr2,
      src:         v._getAttr2,
      type:        v._getAttr,
      action:      v._getAttrNode,
      disabled:    v._flag,
      checked:     v._flag,
      readonly:    v._flag,
      multiple:    v._flag,
      onload:      v._getEv,
      onunload:    v._getEv,
      onclick:     v._getEv,
      ondblclick:  v._getEv,
      onmousedown: v._getEv,
      onmouseup:   v._getEv,
      onmouseover: v._getEv,
      onmousemove: v._getEv,
      onmouseout:  v._getEv,
      onfocus:     v._getEv,
      onblur:      v._getEv,
      onkeypress:  v._getEv,
      onkeydown:   v._getEv,
      onkeyup:     v._getEv,
      onsubmit:    v._getEv,
      onreset:     v._getEv,
      onselect:    v._getEv,
      onchange:    v._getEv
    });
  })(Element._attributeTranslations.read.values);

  if (Prototype.BrowserFeatures.ElementExtensions) {
    (function() {
      function _descendants(element) {
        var nodes = element.getElementsByTagName('*'), results = [];
        for (var i = 0, node; node = nodes[i]; i++)
          if (node.tagName !== "!") // Filter out comment nodes.
            results.push(node);
        return results;
      }

      Element.Methods.down = function(element, expression, index) {
        element = $(element);
        if (arguments.length == 1) return element.firstDescendant();
        return Object.isNumber(expression) ? _descendants(element)[expression] :
          Element.select(element, expression)[index || 0];
      }
    })();
  }

}

else if (Prototype.Browser.Gecko && /rv:1\.8\.0/.test(navigator.userAgent)) {
  Element.Methods.setOpacity = function(element, value) {
    element = $(element);
    element.style.opacity = (value == 1) ? 0.999999 :
      (value === '') ? '' : (value < 0.00001) ? 0 : value;
    return element;
  };
}

else if (Prototype.Browser.WebKit) {
  Element.Methods.setOpacity = function(element, value) {
    element = $(element);
    element.style.opacity = (value == 1 || value === '') ? '' :
      (value < 0.00001) ? 0 : value;

    if (value == 1)
      if(element.tagName.toUpperCase() == 'IMG' && element.width) {
        element.width++; element.width--;
      } else try {
        var n = document.createTextNode(' ');
        element.appendChild(n);
        element.removeChild(n);
      } catch (e) { }

    return element;
  };

  Element.Methods.cumulativeOffset = function(element) {
    var valueT = 0, valueL = 0;
    do {
      valueT += element.offsetTop  || 0;
      valueL += element.offsetLeft || 0;
      if (element.offsetParent == document.body)
        if (Element.getStyle(element, 'position') == 'absolute') break;

      element = element.offsetParent;
    } while (element);

    return Element._returnOffset(valueL, valueT);
  };
}

if ('outerHTML' in document.documentElement) {
  Element.Methods.replace = function(element, content) {
    element = $(element);

    if (content && content.toElement) content = content.toElement();
    if (Object.isElement(content)) {
      element.parentNode.replaceChild(content, element);
      return element;
    }

    content = Object.toHTML(content);
    var parent = element.parentNode, tagName = parent.tagName.toUpperCase();

    if (Element._insertionTranslations.tags[tagName]) {
      var nextSibling = element.next();
      var fragments = Element._getContentFromAnonymousElement(tagName, content.stripScripts());
      parent.removeChild(element);
      if (nextSibling)
        fragments.each(function(node) { parent.insertBefore(node, nextSibling) });
      else
        fragments.each(function(node) { parent.appendChild(node) });
    }
    else element.outerHTML = content.stripScripts();

    content.evalScripts.bind(content).defer();
    return element;
  };
}

Element._returnOffset = function(l, t) {
  var result = [l, t];
  result.left = l;
  result.top = t;
  return result;
};

Element._getContentFromAnonymousElement = function(tagName, html) {
  var div = new Element('div'), t = Element._insertionTranslations.tags[tagName];
  if (t) {
    div.innerHTML = t[0] + html + t[1];
    t[2].times(function() { div = div.firstChild });
  } else div.innerHTML = html;
  return $A(div.childNodes);
};

Element._insertionTranslations = {
  before: function(element, node) {
    element.parentNode.insertBefore(node, element);
  },
  top: function(element, node) {
    element.insertBefore(node, element.firstChild);
  },
  bottom: function(element, node) {
    element.appendChild(node);
  },
  after: function(element, node) {
    element.parentNode.insertBefore(node, element.nextSibling);
  },
  tags: {
    TABLE:  ['<table>',                '</table>',                   1],
    TBODY:  ['<table><tbody>',         '</tbody></table>',           2],
    TR:     ['<table><tbody><tr>',     '</tr></tbody></table>',      3],
    TD:     ['<table><tbody><tr><td>', '</td></tr></tbody></table>', 4],
    SELECT: ['<select>',               '</select>',                  1]
  }
};

(function() {
  var tags = Element._insertionTranslations.tags;
  Object.extend(tags, {
    THEAD: tags.TBODY,
    TFOOT: tags.TBODY,
    TH:    tags.TD
  });
})();

Element.Methods.Simulated = {
  hasAttribute: function(element, attribute) {
    attribute = Element._attributeTranslations.has[attribute] || attribute;
    var node = $(element).getAttributeNode(attribute);
    return !!(node && node.specified);
  }
};

Element.Methods.ByTag = { };

Object.extend(Element, Element.Methods);

(function(div) {

  if (!Prototype.BrowserFeatures.ElementExtensions && div['__proto__']) {
    window.HTMLElement = { };
    window.HTMLElement.prototype = div['__proto__'];
    Prototype.BrowserFeatures.ElementExtensions = true;
  }

  div = null;

})(document.createElement('div'))

Element.extend = (function() {

  function checkDeficiency(tagName) {
    if (typeof window.Element != 'undefined') {
      var proto = window.Element.prototype;
      if (proto) {
        var id = '_' + (Math.random()+'').slice(2);
        var el = document.createElement(tagName);
        proto[id] = 'x';
        var isBuggy = (el[id] !== 'x');
        delete proto[id];
        el = null;
        return isBuggy;
      }
    }
    return false;
  }

  function extendElementWith(element, methods) {
    for (var property in methods) {
      var value = methods[property];
      if (Object.isFunction(value) && !(property in element))
        element[property] = value.methodize();
    }
  }

  var HTMLOBJECTELEMENT_PROTOTYPE_BUGGY = checkDeficiency('object');

  if (Prototype.BrowserFeatures.SpecificElementExtensions) {
    if (HTMLOBJECTELEMENT_PROTOTYPE_BUGGY) {
      return function(element) {
        if (element && typeof element._extendedByPrototype == 'undefined') {
          var t = element.tagName;
          if (t && (/^(?:object|applet|embed)$/i.test(t))) {
            extendElementWith(element, Element.Methods);
            extendElementWith(element, Element.Methods.Simulated);
            extendElementWith(element, Element.Methods.ByTag[t.toUpperCase()]);
          }
        }
        return element;
      }
    }
    return Prototype.K;
  }

  var Methods = { }, ByTag = Element.Methods.ByTag;

  var extend = Object.extend(function(element) {
    if (!element || typeof element._extendedByPrototype != 'undefined' ||
        element.nodeType != 1 || element == window) return element;

    var methods = Object.clone(Methods),
        tagName = element.tagName.toUpperCase();

    if (ByTag[tagName]) Object.extend(methods, ByTag[tagName]);

    extendElementWith(element, methods);

    element._extendedByPrototype = Prototype.emptyFunction;
    return element;

  }, {
    refresh: function() {
      if (!Prototype.BrowserFeatures.ElementExtensions) {
        Object.extend(Methods, Element.Methods);
        Object.extend(Methods, Element.Methods.Simulated);
      }
    }
  });

  extend.refresh();
  return extend;
})();

Element.hasAttribute = function(element, attribute) {
  if (element.hasAttribute) return element.hasAttribute(attribute);
  return Element.Methods.Simulated.hasAttribute(element, attribute);
};

Element.addMethods = function(methods) {
  var F = Prototype.BrowserFeatures, T = Element.Methods.ByTag;

  if (!methods) {
    Object.extend(Form, Form.Methods);
    Object.extend(Form.Element, Form.Element.Methods);
    Object.extend(Element.Methods.ByTag, {
      "FORM":     Object.clone(Form.Methods),
      "INPUT":    Object.clone(Form.Element.Methods),
      "SELECT":   Object.clone(Form.Element.Methods),
      "TEXTAREA": Object.clone(Form.Element.Methods)
    });
  }

  if (arguments.length == 2) {
    var tagName = methods;
    methods = arguments[1];
  }

  if (!tagName) Object.extend(Element.Methods, methods || { });
  else {
    if (Object.isArray(tagName)) tagName.each(extend);
    else extend(tagName);
  }

  function extend(tagName) {
    tagName = tagName.toUpperCase();
    if (!Element.Methods.ByTag[tagName])
      Element.Methods.ByTag[tagName] = { };
    Object.extend(Element.Methods.ByTag[tagName], methods);
  }

  function copy(methods, destination, onlyIfAbsent) {
    onlyIfAbsent = onlyIfAbsent || false;
    for (var property in methods) {
      var value = methods[property];
      if (!Object.isFunction(value)) continue;
      if (!onlyIfAbsent || !(property in destination))
        destination[property] = value.methodize();
    }
  }

  function findDOMClass(tagName) {
    var klass;
    var trans = {
      "OPTGROUP": "OptGroup", "TEXTAREA": "TextArea", "P": "Paragraph",
      "FIELDSET": "FieldSet", "UL": "UList", "OL": "OList", "DL": "DList",
      "DIR": "Directory", "H1": "Heading", "H2": "Heading", "H3": "Heading",
      "H4": "Heading", "H5": "Heading", "H6": "Heading", "Q": "Quote",
      "INS": "Mod", "DEL": "Mod", "A": "Anchor", "IMG": "Image", "CAPTION":
      "TableCaption", "COL": "TableCol", "COLGROUP": "TableCol", "THEAD":
      "TableSection", "TFOOT": "TableSection", "TBODY": "TableSection", "TR":
      "TableRow", "TH": "TableCell", "TD": "TableCell", "FRAMESET":
      "FrameSet", "IFRAME": "IFrame"
    };
    if (trans[tagName]) klass = 'HTML' + trans[tagName] + 'Element';
    if (window[klass]) return window[klass];
    klass = 'HTML' + tagName + 'Element';
    if (window[klass]) return window[klass];
    klass = 'HTML' + tagName.capitalize() + 'Element';
    if (window[klass]) return window[klass];

    var element = document.createElement(tagName);
    var proto = element['__proto__'] || element.constructor.prototype;
    element = null;
    return proto;
  }

  var elementPrototype = window.HTMLElement ? HTMLElement.prototype :
   Element.prototype;

  if (F.ElementExtensions) {
    copy(Element.Methods, elementPrototype);
    copy(Element.Methods.Simulated, elementPrototype, true);
  }

  if (F.SpecificElementExtensions) {
    for (var tag in Element.Methods.ByTag) {
      var klass = findDOMClass(tag);
      if (Object.isUndefined(klass)) continue;
      copy(T[tag], klass.prototype);
    }
  }

  Object.extend(Element, Element.Methods);
  delete Element.ByTag;

  if (Element.extend.refresh) Element.extend.refresh();
  Element.cache = { };
};


document.viewport = {

  getDimensions: function() {
    return { width: this.getWidth(), height: this.getHeight() };
  },

  getScrollOffsets: function() {
    return Element._returnOffset(
      window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft,
      window.pageYOffset || document.documentElement.scrollTop  || document.body.scrollTop);
  }
};

(function(viewport) {
  var B = Prototype.Browser, doc = document, element, property = {};

  function getRootElement() {
    if (B.WebKit && !doc.evaluate)
      return document;

    if (B.Opera && window.parseFloat(window.opera.version()) < 9.5)
      return document.body;

    return document.documentElement;
  }

  function define(D) {
    if (!element) element = getRootElement();

    property[D] = 'client' + D;

    viewport['get' + D] = function() { return element[property[D]] };
    return viewport['get' + D]();
  }

  viewport.getWidth  = define.curry('Width');

  viewport.getHeight = define.curry('Height');
})(document.viewport);


Element.Storage = {
  UID: 1
};

Element.addMethods({
  getStorage: function(element) {
    if (!(element = $(element))) return;

    var uid;
    if (element === window) {
      uid = 0;
    } else {
      if (typeof element._prototypeUID === "undefined")
        element._prototypeUID = [Element.Storage.UID++];
      uid = element._prototypeUID[0];
    }

    if (!Element.Storage[uid])
      Element.Storage[uid] = $H();

    return Element.Storage[uid];
  },

  store: function(element, key, value) {
    if (!(element = $(element))) return;

    if (arguments.length === 2) {
      Element.getStorage(element).update(key);
    } else {
      Element.getStorage(element).set(key, value);
    }

    return element;
  },

  retrieve: function(element, key, defaultValue) {
    if (!(element = $(element))) return;
    var hash = Element.getStorage(element), value = hash.get(key);

    if (Object.isUndefined(value)) {
      hash.set(key, defaultValue);
      value = defaultValue;
    }

    return value;
  },

  clone: function(element, deep) {
    if (!(element = $(element))) return;
    var clone = element.cloneNode(deep);
    clone._prototypeUID = void 0;
    if (deep) {
      var descendants = Element.select(clone, '*'),
          i = descendants.length;
      while (i--) {
        descendants[i]._prototypeUID = void 0;
      }
    }
    return Element.extend(clone);
  }
});
/* Portions of the Selector class are derived from Jack Slocum's DomQuery,
 * part of YUI-Ext version 0.40, distributed under the terms of an MIT-style
 * license.  Please see http://www.yui-ext.com/ for more information. */

var Selector = Class.create({
  initialize: function(expression) {
    this.expression = expression.strip();

    if (this.shouldUseSelectorsAPI()) {
      this.mode = 'selectorsAPI';
    } else if (this.shouldUseXPath()) {
      this.mode = 'xpath';
      this.compileXPathMatcher();
    } else {
      this.mode = "normal";
      this.compileMatcher();
    }

  },

  shouldUseXPath: (function() {

    var IS_DESCENDANT_SELECTOR_BUGGY = (function(){
      var isBuggy = false;
      if (document.evaluate && window.XPathResult) {
        var el = document.createElement('div');
        el.innerHTML = '<ul><li></li></ul><div><ul><li></li></ul></div>';

        var xpath = ".//*[local-name()='ul' or local-name()='UL']" +
          "//*[local-name()='li' or local-name()='LI']";

        var result = document.evaluate(xpath, el, null,
          XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

        isBuggy = (result.snapshotLength !== 2);
        el = null;
      }
      return isBuggy;
    })();

    return function() {
      if (!Prototype.BrowserFeatures.XPath) return false;

      var e = this.expression;

      if (Prototype.Browser.WebKit &&
       (e.include("-of-type") || e.include(":empty")))
        return false;

      if ((/(\[[\w-]*?:|:checked)/).test(e))
        return false;

      if (IS_DESCENDANT_SELECTOR_BUGGY) return false;

      return true;
    }

  })(),

  shouldUseSelectorsAPI: function() {
    if (!Prototype.BrowserFeatures.SelectorsAPI) return false;

    if (Selector.CASE_INSENSITIVE_CLASS_NAMES) return false;

    if (!Selector._div) Selector._div = new Element('div');

    try {
      Selector._div.querySelector(this.expression);
    } catch(e) {
      return false;
    }

    return true;
  },

  compileMatcher: function() {
    var e = this.expression, ps = Selector.patterns, h = Selector.handlers,
        c = Selector.criteria, le, p, m, len = ps.length, name;

    if (Selector._cache[e]) {
      this.matcher = Selector._cache[e];
      return;
    }

    this.matcher = ["this.matcher = function(root) {",
                    "var r = root, h = Selector.handlers, c = false, n;"];

    while (e && le != e && (/\S/).test(e)) {
      le = e;
      for (var i = 0; i<len; i++) {
        p = ps[i].re;
        name = ps[i].name;
        if (m = e.match(p)) {
          this.matcher.push(Object.isFunction(c[name]) ? c[name](m) :
            new Template(c[name]).evaluate(m));
          e = e.replace(m[0], '');
          break;
        }
      }
    }

    this.matcher.push("return h.unique(n);\n}");
    eval(this.matcher.join('\n'));
    Selector._cache[this.expression] = this.matcher;
  },

  compileXPathMatcher: function() {
    var e = this.expression, ps = Selector.patterns,
        x = Selector.xpath, le, m, len = ps.length, name;

    if (Selector._cache[e]) {
      this.xpath = Selector._cache[e]; return;
    }

    this.matcher = ['.//*'];
    while (e && le != e && (/\S/).test(e)) {
      le = e;
      for (var i = 0; i<len; i++) {
        name = ps[i].name;
        if (m = e.match(ps[i].re)) {
          this.matcher.push(Object.isFunction(x[name]) ? x[name](m) :
            new Template(x[name]).evaluate(m));
          e = e.replace(m[0], '');
          break;
        }
      }
    }

    this.xpath = this.matcher.join('');
    Selector._cache[this.expression] = this.xpath;
  },

  findElements: function(root) {
    root = root || document;
    var e = this.expression, results;

    switch (this.mode) {
      case 'selectorsAPI':
        if (root !== document) {
          var oldId = root.id, id = $(root).identify();
          id = id.replace(/([\.:])/g, "\\$1");
          e = "#" + id + " " + e;
        }

        results = $A(root.querySelectorAll(e)).map(Element.extend);
        root.id = oldId;

        return results;
      case 'xpath':
        return document._getElementsByXPath(this.xpath, root);
      default:
       return this.matcher(root);
    }
  },

  match: function(element) {
    this.tokens = [];

    var e = this.expression, ps = Selector.patterns, as = Selector.assertions;
    var le, p, m, len = ps.length, name;

    while (e && le !== e && (/\S/).test(e)) {
      le = e;
      for (var i = 0; i<len; i++) {
        p = ps[i].re;
        name = ps[i].name;
        if (m = e.match(p)) {
          if (as[name]) {
            this.tokens.push([name, Object.clone(m)]);
            e = e.replace(m[0], '');
          } else {
            return this.findElements(document).include(element);
          }
        }
      }
    }

    var match = true, name, matches;
    for (var i = 0, token; token = this.tokens[i]; i++) {
      name = token[0], matches = token[1];
      if (!Selector.assertions[name](element, matches)) {
        match = false; break;
      }
    }

    return match;
  },

  toString: function() {
    return this.expression;
  },

  inspect: function() {
    return "#<Selector:" + this.expression.inspect() + ">";
  }
});

if (Prototype.BrowserFeatures.SelectorsAPI &&
 document.compatMode === 'BackCompat') {
  Selector.CASE_INSENSITIVE_CLASS_NAMES = (function(){
    var div = document.createElement('div'),
     span = document.createElement('span');

    div.id = "prototype_test_id";
    span.className = 'Test';
    div.appendChild(span);
    var isIgnored = (div.querySelector('#prototype_test_id .test') !== null);
    div = span = null;
    return isIgnored;
  })();
}

Object.extend(Selector, {
  _cache: { },

  xpath: {
    descendant:   "//*",
    child:        "/*",
    adjacent:     "/following-sibling::*[1]",
    laterSibling: '/following-sibling::*',
    tagName:      function(m) {
      if (m[1] == '*') return '';
      return "[local-name()='" + m[1].toLowerCase() +
             "' or local-name()='" + m[1].toUpperCase() + "']";
    },
    className:    "[contains(concat(' ', @class, ' '), ' #{1} ')]",
    id:           "[@id='#{1}']",
    attrPresence: function(m) {
      m[1] = m[1].toLowerCase();
      return new Template("[@#{1}]").evaluate(m);
    },
    attr: function(m) {
      m[1] = m[1].toLowerCase();
      m[3] = m[5] || m[6];
      return new Template(Selector.xpath.operators[m[2]]).evaluate(m);
    },
    pseudo: function(m) {
      var h = Selector.xpath.pseudos[m[1]];
      if (!h) return '';
      if (Object.isFunction(h)) return h(m);
      return new Template(Selector.xpath.pseudos[m[1]]).evaluate(m);
    },
    operators: {
      '=':  "[@#{1}='#{3}']",
      '!=': "[@#{1}!='#{3}']",
      '^=': "[starts-with(@#{1}, '#{3}')]",
      '$=': "[substring(@#{1}, (string-length(@#{1}) - string-length('#{3}') + 1))='#{3}']",
      '*=': "[contains(@#{1}, '#{3}')]",
      '~=': "[contains(concat(' ', @#{1}, ' '), ' #{3} ')]",
      '|=': "[contains(concat('-', @#{1}, '-'), '-#{3}-')]"
    },
    pseudos: {
      'first-child': '[not(preceding-sibling::*)]',
      'last-child':  '[not(following-sibling::*)]',
      'only-child':  '[not(preceding-sibling::* or following-sibling::*)]',
      'empty':       "[count(*) = 0 and (count(text()) = 0)]",
      'checked':     "[@checked]",
      'disabled':    "[(@disabled) and (@type!='hidden')]",
      'enabled':     "[not(@disabled) and (@type!='hidden')]",
      'not': function(m) {
        var e = m[6], p = Selector.patterns,
            x = Selector.xpath, le, v, len = p.length, name;

        var exclusion = [];
        while (e && le != e && (/\S/).test(e)) {
          le = e;
          for (var i = 0; i<len; i++) {
            name = p[i].name
            if (m = e.match(p[i].re)) {
              v = Object.isFunction(x[name]) ? x[name](m) : new Template(x[name]).evaluate(m);
              exclusion.push("(" + v.substring(1, v.length - 1) + ")");
              e = e.replace(m[0], '');
              break;
            }
          }
        }
        return "[not(" + exclusion.join(" and ") + ")]";
      },
      'nth-child':      function(m) {
        return Selector.xpath.pseudos.nth("(count(./preceding-sibling::*) + 1) ", m);
      },
      'nth-last-child': function(m) {
        return Selector.xpath.pseudos.nth("(count(./following-sibling::*) + 1) ", m);
      },
      'nth-of-type':    function(m) {
        return Selector.xpath.pseudos.nth("position() ", m);
      },
      'nth-last-of-type': function(m) {
        return Selector.xpath.pseudos.nth("(last() + 1 - position()) ", m);
      },
      'first-of-type':  function(m) {
        m[6] = "1"; return Selector.xpath.pseudos['nth-of-type'](m);
      },
      'last-of-type':   function(m) {
        m[6] = "1"; return Selector.xpath.pseudos['nth-last-of-type'](m);
      },
      'only-of-type':   function(m) {
        var p = Selector.xpath.pseudos; return p['first-of-type'](m) + p['last-of-type'](m);
      },
      nth: function(fragment, m) {
        var mm, formula = m[6], predicate;
        if (formula == 'even') formula = '2n+0';
        if (formula == 'odd')  formula = '2n+1';
        if (mm = formula.match(/^(\d+)$/)) // digit only
          return '[' + fragment + "= " + mm[1] + ']';
        if (mm = formula.match(/^(-?\d*)?n(([+-])(\d+))?/)) { // an+b
          if (mm[1] == "-") mm[1] = -1;
          var a = mm[1] ? Number(mm[1]) : 1;
          var b = mm[2] ? Number(mm[2]) : 0;
          predicate = "[((#{fragment} - #{b}) mod #{a} = 0) and " +
          "((#{fragment} - #{b}) div #{a} >= 0)]";
          return new Template(predicate).evaluate({
            fragment: fragment, a: a, b: b });
        }
      }
    }
  },

  criteria: {
    tagName:      'n = h.tagName(n, r, "#{1}", c);      c = false;',
    className:    'n = h.className(n, r, "#{1}", c);    c = false;',
    id:           'n = h.id(n, r, "#{1}", c);           c = false;',
    attrPresence: 'n = h.attrPresence(n, r, "#{1}", c); c = false;',
    attr: function(m) {
      m[3] = (m[5] || m[6]);
      return new Template('n = h.attr(n, r, "#{1}", "#{3}", "#{2}", c); c = false;').evaluate(m);
    },
    pseudo: function(m) {
      if (m[6]) m[6] = m[6].replace(/"/g, '\\"');
      return new Template('n = h.pseudo(n, "#{1}", "#{6}", r, c); c = false;').evaluate(m);
    },
    descendant:   'c = "descendant";',
    child:        'c = "child";',
    adjacent:     'c = "adjacent";',
    laterSibling: 'c = "laterSibling";'
  },

  patterns: [
    { name: 'laterSibling', re: /^\s*~\s*/ },
    { name: 'child',        re: /^\s*>\s*/ },
    { name: 'adjacent',     re: /^\s*\+\s*/ },
    { name: 'descendant',   re: /^\s/ },

    { name: 'tagName',      re: /^\s*(\*|[\w\-]+)(\b|$)?/ },
    { name: 'id',           re: /^#([\w\-\*]+)(\b|$)/ },
    { name: 'className',    re: /^\.([\w\-\*]+)(\b|$)/ },
    { name: 'pseudo',       re: /^:((first|last|nth|nth-last|only)(-child|-of-type)|empty|checked|(en|dis)abled|not)(\((.*?)\))?(\b|$|(?=\s|[:+~>]))/ },
    { name: 'attrPresence', re: /^\[((?:[\w-]+:)?[\w-]+)\]/ },
    { name: 'attr',         re: /\[((?:[\w-]*:)?[\w-]+)\s*(?:([!^$*~|]?=)\s*((['"])([^\4]*?)\4|([^'"][^\]]*?)))?\]/ }
  ],

  assertions: {
    tagName: function(element, matches) {
      return matches[1].toUpperCase() == element.tagName.toUpperCase();
    },

    className: function(element, matches) {
      return Element.hasClassName(element, matches[1]);
    },

    id: function(element, matches) {
      return element.id === matches[1];
    },

    attrPresence: function(element, matches) {
      return Element.hasAttribute(element, matches[1]);
    },

    attr: function(element, matches) {
      var nodeValue = Element.readAttribute(element, matches[1]);
      return nodeValue && Selector.operators[matches[2]](nodeValue, matches[5] || matches[6]);
    }
  },

  handlers: {
    concat: function(a, b) {
      for (var i = 0, node; node = b[i]; i++)
        a.push(node);
      return a;
    },

    mark: function(nodes) {
      var _true = Prototype.emptyFunction;
      for (var i = 0, node; node = nodes[i]; i++)
        node._countedByPrototype = _true;
      return nodes;
    },

    unmark: (function(){

      var PROPERTIES_ATTRIBUTES_MAP = (function(){
        var el = document.createElement('div'),
            isBuggy = false,
            propName = '_countedByPrototype',
            value = 'x'
        el[propName] = value;
        isBuggy = (el.getAttribute(propName) === value);
        el = null;
        return isBuggy;
      })();

      return PROPERTIES_ATTRIBUTES_MAP ?
        function(nodes) {
          for (var i = 0, node; node = nodes[i]; i++)
            node.removeAttribute('_countedByPrototype');
          return nodes;
        } :
        function(nodes) {
          for (var i = 0, node; node = nodes[i]; i++)
            node._countedByPrototype = void 0;
          return nodes;
        }
    })(),

    index: function(parentNode, reverse, ofType) {
      parentNode._countedByPrototype = Prototype.emptyFunction;
      if (reverse) {
        for (var nodes = parentNode.childNodes, i = nodes.length - 1, j = 1; i >= 0; i--) {
          var node = nodes[i];
          if (node.nodeType == 1 && (!ofType || node._countedByPrototype)) node.nodeIndex = j++;
        }
      } else {
        for (var i = 0, j = 1, nodes = parentNode.childNodes; node = nodes[i]; i++)
          if (node.nodeType == 1 && (!ofType || node._countedByPrototype)) node.nodeIndex = j++;
      }
    },

    unique: function(nodes) {
      if (nodes.length == 0) return nodes;
      var results = [], n;
      for (var i = 0, l = nodes.length; i < l; i++)
        if (typeof (n = nodes[i])._countedByPrototype == 'undefined') {
          n._countedByPrototype = Prototype.emptyFunction;
          results.push(Element.extend(n));
        }
      return Selector.handlers.unmark(results);
    },

    descendant: function(nodes) {
      var h = Selector.handlers;
      for (var i = 0, results = [], node; node = nodes[i]; i++)
        h.concat(results, node.getElementsByTagName('*'));
      return results;
    },

    child: function(nodes) {
      var h = Selector.handlers;
      for (var i = 0, results = [], node; node = nodes[i]; i++) {
        for (var j = 0, child; child = node.childNodes[j]; j++)
          if (child.nodeType == 1 && child.tagName != '!') results.push(child);
      }
      return results;
    },

    adjacent: function(nodes) {
      for (var i = 0, results = [], node; node = nodes[i]; i++) {
        var next = this.nextElementSibling(node);
        if (next) results.push(next);
      }
      return results;
    },

    laterSibling: function(nodes) {
      var h = Selector.handlers;
      for (var i = 0, results = [], node; node = nodes[i]; i++)
        h.concat(results, Element.nextSiblings(node));
      return results;
    },

    nextElementSibling: function(node) {
      while (node = node.nextSibling)
        if (node.nodeType == 1) return node;
      return null;
    },

    previousElementSibling: function(node) {
      while (node = node.previousSibling)
        if (node.nodeType == 1) return node;
      return null;
    },

    tagName: function(nodes, root, tagName, combinator) {
      var uTagName = tagName.toUpperCase();
      var results = [], h = Selector.handlers;
      if (nodes) {
        if (combinator) {
          if (combinator == "descendant") {
            for (var i = 0, node; node = nodes[i]; i++)
              h.concat(results, node.getElementsByTagName(tagName));
            return results;
          } else nodes = this[combinator](nodes);
          if (tagName == "*") return nodes;
        }
        for (var i = 0, node; node = nodes[i]; i++)
          if (node.tagName.toUpperCase() === uTagName) results.push(node);
        return results;
      } else return root.getElementsByTagName(tagName);
    },

    id: function(nodes, root, id, combinator) {
      var targetNode = $(id), h = Selector.handlers;

      if (root == document) {
        if (!targetNode) return [];
        if (!nodes) return [targetNode];
      } else {
        if (!root.sourceIndex || root.sourceIndex < 1) {
          var nodes = root.getElementsByTagName('*');
          for (var j = 0, node; node = nodes[j]; j++) {
            if (node.id === id) return [node];
          }
        }
      }

      if (nodes) {
        if (combinator) {
          if (combinator == 'child') {
            for (var i = 0, node; node = nodes[i]; i++)
              if (targetNode.parentNode == node) return [targetNode];
          } else if (combinator == 'descendant') {
            for (var i = 0, node; node = nodes[i]; i++)
              if (Element.descendantOf(targetNode, node)) return [targetNode];
          } else if (combinator == 'adjacent') {
            for (var i = 0, node; node = nodes[i]; i++)
              if (Selector.handlers.previousElementSibling(targetNode) == node)
                return [targetNode];
          } else nodes = h[combinator](nodes);
        }
        for (var i = 0, node; node = nodes[i]; i++)
          if (node == targetNode) return [targetNode];
        return [];
      }
      return (targetNode && Element.descendantOf(targetNode, root)) ? [targetNode] : [];
    },

    className: function(nodes, root, className, combinator) {
      if (nodes && combinator) nodes = this[combinator](nodes);
      return Selector.handlers.byClassName(nodes, root, className);
    },

    byClassName: function(nodes, root, className) {
      if (!nodes) nodes = Selector.handlers.descendant([root]);
      var needle = ' ' + className + ' ';
      for (var i = 0, results = [], node, nodeClassName; node = nodes[i]; i++) {
        nodeClassName = node.className;
        if (nodeClassName.length == 0) continue;
        if (nodeClassName == className || (' ' + nodeClassName + ' ').include(needle))
          results.push(node);
      }
      return results;
    },

    attrPresence: function(nodes, root, attr, combinator) {
      if (!nodes) nodes = root.getElementsByTagName("*");
      if (nodes && combinator) nodes = this[combinator](nodes);
      var results = [];
      for (var i = 0, node; node = nodes[i]; i++)
        if (Element.hasAttribute(node, attr)) results.push(node);
      return results;
    },

    attr: function(nodes, root, attr, value, operator, combinator) {
      if (!nodes) nodes = root.getElementsByTagName("*");
      if (nodes && combinator) nodes = this[combinator](nodes);
      var handler = Selector.operators[operator], results = [];
      for (var i = 0, node; node = nodes[i]; i++) {
        var nodeValue = Element.readAttribute(node, attr);
        if (nodeValue === null) continue;
        if (handler(nodeValue, value)) results.push(node);
      }
      return results;
    },

    pseudo: function(nodes, name, value, root, combinator) {
      if (nodes && combinator) nodes = this[combinator](nodes);
      if (!nodes) nodes = root.getElementsByTagName("*");
      return Selector.pseudos[name](nodes, value, root);
    }
  },

  pseudos: {
    'first-child': function(nodes, value, root) {
      for (var i = 0, results = [], node; node = nodes[i]; i++) {
        if (Selector.handlers.previousElementSibling(node)) continue;
          results.push(node);
      }
      return results;
    },
    'last-child': function(nodes, value, root) {
      for (var i = 0, results = [], node; node = nodes[i]; i++) {
        if (Selector.handlers.nextElementSibling(node)) continue;
          results.push(node);
      }
      return results;
    },
    'only-child': function(nodes, value, root) {
      var h = Selector.handlers;
      for (var i = 0, results = [], node; node = nodes[i]; i++)
        if (!h.previousElementSibling(node) && !h.nextElementSibling(node))
          results.push(node);
      return results;
    },
    'nth-child':        function(nodes, formula, root) {
      return Selector.pseudos.nth(nodes, formula, root);
    },
    'nth-last-child':   function(nodes, formula, root) {
      return Selector.pseudos.nth(nodes, formula, root, true);
    },
    'nth-of-type':      function(nodes, formula, root) {
      return Selector.pseudos.nth(nodes, formula, root, false, true);
    },
    'nth-last-of-type': function(nodes, formula, root) {
      return Selector.pseudos.nth(nodes, formula, root, true, true);
    },
    'first-of-type':    function(nodes, formula, root) {
      return Selector.pseudos.nth(nodes, "1", root, false, true);
    },
    'last-of-type':     function(nodes, formula, root) {
      return Selector.pseudos.nth(nodes, "1", root, true, true);
    },
    'only-of-type':     function(nodes, formula, root) {
      var p = Selector.pseudos;
      return p['last-of-type'](p['first-of-type'](nodes, formula, root), formula, root);
    },

    getIndices: function(a, b, total) {
      if (a == 0) return b > 0 ? [b] : [];
      return $R(1, total).inject([], function(memo, i) {
        if (0 == (i - b) % a && (i - b) / a >= 0) memo.push(i);
        return memo;
      });
    },

    nth: function(nodes, formula, root, reverse, ofType) {
      if (nodes.length == 0) return [];
      if (formula == 'even') formula = '2n+0';
      if (formula == 'odd')  formula = '2n+1';
      var h = Selector.handlers, results = [], indexed = [], m;
      h.mark(nodes);
      for (var i = 0, node; node = nodes[i]; i++) {
        if (!node.parentNode._countedByPrototype) {
          h.index(node.parentNode, reverse, ofType);
          indexed.push(node.parentNode);
        }
      }
      if (formula.match(/^\d+$/)) { // just a number
        formula = Number(formula);
        for (var i = 0, node; node = nodes[i]; i++)
          if (node.nodeIndex == formula) results.push(node);
      } else if (m = formula.match(/^(-?\d*)?n(([+-])(\d+))?/)) { // an+b
        if (m[1] == "-") m[1] = -1;
        var a = m[1] ? Number(m[1]) : 1;
        var b = m[2] ? Number(m[2]) : 0;
        var indices = Selector.pseudos.getIndices(a, b, nodes.length);
        for (var i = 0, node, l = indices.length; node = nodes[i]; i++) {
          for (var j = 0; j < l; j++)
            if (node.nodeIndex == indices[j]) results.push(node);
        }
      }
      h.unmark(nodes);
      h.unmark(indexed);
      return results;
    },

    'empty': function(nodes, value, root) {
      for (var i = 0, results = [], node; node = nodes[i]; i++) {
        if (node.tagName == '!' || node.firstChild) continue;
        results.push(node);
      }
      return results;
    },

    'not': function(nodes, selector, root) {
      var h = Selector.handlers, selectorType, m;
      var exclusions = new Selector(selector).findElements(root);
      h.mark(exclusions);
      for (var i = 0, results = [], node; node = nodes[i]; i++)
        if (!node._countedByPrototype) results.push(node);
      h.unmark(exclusions);
      return results;
    },

    'enabled': function(nodes, value, root) {
      for (var i = 0, results = [], node; node = nodes[i]; i++)
        if (!node.disabled && (!node.type || node.type !== 'hidden'))
          results.push(node);
      return results;
    },

    'disabled': function(nodes, value, root) {
      for (var i = 0, results = [], node; node = nodes[i]; i++)
        if (node.disabled) results.push(node);
      return results;
    },

    'checked': function(nodes, value, root) {
      for (var i = 0, results = [], node; node = nodes[i]; i++)
        if (node.checked) results.push(node);
      return results;
    }
  },

  operators: {
    '=':  function(nv, v) { return nv == v; },
    '!=': function(nv, v) { return nv != v; },
    '^=': function(nv, v) { return nv == v || nv && nv.startsWith(v); },
    '$=': function(nv, v) { return nv == v || nv && nv.endsWith(v); },
    '*=': function(nv, v) { return nv == v || nv && nv.include(v); },
    '~=': function(nv, v) { return (' ' + nv + ' ').include(' ' + v + ' '); },
    '|=': function(nv, v) { return ('-' + (nv || "").toUpperCase() +
     '-').include('-' + (v || "").toUpperCase() + '-'); }
  },

  split: function(expression) {
    var expressions = [];
    expression.scan(/(([\w#:.~>+()\s-]+|\*|\[.*?\])+)\s*(,|$)/, function(m) {
      expressions.push(m[1].strip());
    });
    return expressions;
  },

  matchElements: function(elements, expression) {
    var matches = $$(expression), h = Selector.handlers;
    h.mark(matches);
    for (var i = 0, results = [], element; element = elements[i]; i++)
      if (element._countedByPrototype) results.push(element);
    h.unmark(matches);
    return results;
  },

  findElement: function(elements, expression, index) {
    if (Object.isNumber(expression)) {
      index = expression; expression = false;
    }
    return Selector.matchElements(elements, expression || '*')[index || 0];
  },

  findChildElements: function(element, expressions) {
    expressions = Selector.split(expressions.join(','));
    var results = [], h = Selector.handlers;
    for (var i = 0, l = expressions.length, selector; i < l; i++) {
      selector = new Selector(expressions[i].strip());
      h.concat(results, selector.findElements(element));
    }
    return (l > 1) ? h.unique(results) : results;
  }
});

if (Prototype.Browser.IE) {
  Object.extend(Selector.handlers, {
    concat: function(a, b) {
      for (var i = 0, node; node = b[i]; i++)
        if (node.tagName !== "!") a.push(node);
      return a;
    }
  });
}

function $$() {
  return Selector.findChildElements(document, $A(arguments));
}

var Form = {
  reset: function(form) {
    form = $(form);
    form.reset();
    return form;
  },

  serializeElements: function(elements, options) {
    if (typeof options != 'object') options = { hash: !!options };
    else if (Object.isUndefined(options.hash)) options.hash = true;
    var key, value, submitted = false, submit = options.submit;

    var data = elements.inject({ }, function(result, element) {
      if (!element.disabled && element.name) {
        key = element.name; value = $(element).getValue();
        if (value != null && element.type != 'file' && (element.type != 'submit' || (!submitted &&
            submit !== false && (!submit || key == submit) && (submitted = true)))) {
          if (key in result) {
            if (!Object.isArray(result[key])) result[key] = [result[key]];
            result[key].push(value);
          }
          else result[key] = value;
        }
      }
      return result;
    });

    return options.hash ? data : Object.toQueryString(data);
  }
};

Form.Methods = {
  serialize: function(form, options) {
    return Form.serializeElements(Form.getElements(form), options);
  },

  getElements: function(form) {
    var elements = $(form).getElementsByTagName('*'),
        element,
        arr = [ ],
        serializers = Form.Element.Serializers;
    for (var i = 0; element = elements[i]; i++) {
      arr.push(element);
    }
    return arr.inject([], function(elements, child) {
      if (serializers[child.tagName.toLowerCase()])
        elements.push(Element.extend(child));
      return elements;
    })
  },

  getInputs: function(form, typeName, name) {
    form = $(form);
    var inputs = form.getElementsByTagName('input');

    if (!typeName && !name) return $A(inputs).map(Element.extend);

    for (var i = 0, matchingInputs = [], length = inputs.length; i < length; i++) {
      var input = inputs[i];
      if ((typeName && input.type != typeName) || (name && input.name != name))
        continue;
      matchingInputs.push(Element.extend(input));
    }

    return matchingInputs;
  },

  disable: function(form) {
    form = $(form);
    Form.getElements(form).invoke('disable');
    return form;
  },

  enable: function(form) {
    form = $(form);
    Form.getElements(form).invoke('enable');
    return form;
  },

  findFirstElement: function(form) {
    var elements = $(form).getElements().findAll(function(element) {
      return 'hidden' != element.type && !element.disabled;
    });
    var firstByIndex = elements.findAll(function(element) {
      return element.hasAttribute('tabIndex') && element.tabIndex >= 0;
    }).sortBy(function(element) { return element.tabIndex }).first();

    return firstByIndex ? firstByIndex : elements.find(function(element) {
      return /^(?:input|select|textarea)$/i.test(element.tagName);
    });
  },

  focusFirstElement: function(form) {
    form = $(form);
    form.findFirstElement().activate();
    return form;
  },

  request: function(form, options) {
    form = $(form), options = Object.clone(options || { });

    var params = options.parameters, action = form.readAttribute('action') || '';
    if (action.blank()) action = window.location.href;
    options.parameters = form.serialize(true);

    if (params) {
      if (Object.isString(params)) params = params.toQueryParams();
      Object.extend(options.parameters, params);
    }

    if (form.hasAttribute('method') && !options.method)
      options.method = form.method;

    return new Ajax.Request(action, options);
  }
};

/*--------------------------------------------------------------------------*/


Form.Element = {
  focus: function(element) {
    $(element).focus();
    return element;
  },

  select: function(element) {
    $(element).select();
    return element;
  }
};

Form.Element.Methods = {

  serialize: function(element) {
    element = $(element);
    if (!element.disabled && element.name) {
      var value = element.getValue();
      if (value != undefined) {
        var pair = { };
        pair[element.name] = value;
        return Object.toQueryString(pair);
      }
    }
    return '';
  },

  getValue: function(element) {
    element = $(element);
    var method = element.tagName.toLowerCase();
    return Form.Element.Serializers[method](element);
  },

  setValue: function(element, value) {
    element = $(element);
    var method = element.tagName.toLowerCase();
    Form.Element.Serializers[method](element, value);
    return element;
  },

  clear: function(element) {
    $(element).value = '';
    return element;
  },

  present: function(element) {
    return $(element).value != '';
  },

  activate: function(element) {
    element = $(element);
    try {
      element.focus();
      if (element.select && (element.tagName.toLowerCase() != 'input' ||
          !(/^(?:button|reset|submit)$/i.test(element.type))))
        element.select();
    } catch (e) { }
    return element;
  },

  disable: function(element) {
    element = $(element);
    element.disabled = true;
    return element;
  },

  enable: function(element) {
    element = $(element);
    element.disabled = false;
    return element;
  }
};

/*--------------------------------------------------------------------------*/

var Field = Form.Element;

var $F = Form.Element.Methods.getValue;

/*--------------------------------------------------------------------------*/

Form.Element.Serializers = {
  input: function(element, value) {
    switch (element.type.toLowerCase()) {
      case 'checkbox':
      case 'radio':
        return Form.Element.Serializers.inputSelector(element, value);
      default:
        return Form.Element.Serializers.textarea(element, value);
    }
  },

  inputSelector: function(element, value) {
    if (Object.isUndefined(value)) return element.checked ? element.value : null;
    else element.checked = !!value;
  },

  textarea: function(element, value) {
    if (Object.isUndefined(value)) return element.value;
    else element.value = value;
  },

  select: function(element, value) {
    if (Object.isUndefined(value))
      return this[element.type == 'select-one' ?
        'selectOne' : 'selectMany'](element);
    else {
      var opt, currentValue, single = !Object.isArray(value);
      for (var i = 0, length = element.length; i < length; i++) {
        opt = element.options[i];
        currentValue = this.optionValue(opt);
        if (single) {
          if (currentValue == value) {
            opt.selected = true;
            return;
          }
        }
        else opt.selected = value.include(currentValue);
      }
    }
  },

  selectOne: function(element) {
    var index = element.selectedIndex;
    return index >= 0 ? this.optionValue(element.options[index]) : null;
  },

  selectMany: function(element) {
    var values, length = element.length;
    if (!length) return null;

    for (var i = 0, values = []; i < length; i++) {
      var opt = element.options[i];
      if (opt.selected) values.push(this.optionValue(opt));
    }
    return values;
  },

  optionValue: function(opt) {
    return Element.extend(opt).hasAttribute('value') ? opt.value : opt.text;
  }
};

/*--------------------------------------------------------------------------*/


Abstract.TimedObserver = Class.create(PeriodicalExecuter, {
  initialize: function($super, element, frequency, callback) {
    $super(callback, frequency);
    this.element   = $(element);
    this.lastValue = this.getValue();
  },

  execute: function() {
    var value = this.getValue();
    if (Object.isString(this.lastValue) && Object.isString(value) ?
        this.lastValue != value : String(this.lastValue) != String(value)) {
      this.callback(this.element, value);
      this.lastValue = value;
    }
  }
});

Form.Element.Observer = Class.create(Abstract.TimedObserver, {
  getValue: function() {
    return Form.Element.getValue(this.element);
  }
});

Form.Observer = Class.create(Abstract.TimedObserver, {
  getValue: function() {
    return Form.serialize(this.element);
  }
});

/*--------------------------------------------------------------------------*/

Abstract.EventObserver = Class.create({
  initialize: function(element, callback) {
    this.element  = $(element);
    this.callback = callback;

    this.lastValue = this.getValue();
    if (this.element.tagName.toLowerCase() == 'form')
      this.registerFormCallbacks();
    else
      this.registerCallback(this.element);
  },

  onElementEvent: function() {
    var value = this.getValue();
    if (this.lastValue != value) {
      this.callback(this.element, value);
      this.lastValue = value;
    }
  },

  registerFormCallbacks: function() {
    Form.getElements(this.element).each(this.registerCallback, this);
  },

  registerCallback: function(element) {
    if (element.type) {
      switch (element.type.toLowerCase()) {
        case 'checkbox':
        case 'radio':
          Event.observe(element, 'click', this.onElementEvent.bind(this));
          break;
        default:
          Event.observe(element, 'change', this.onElementEvent.bind(this));
          break;
      }
    }
  }
});

Form.Element.EventObserver = Class.create(Abstract.EventObserver, {
  getValue: function() {
    return Form.Element.getValue(this.element);
  }
});

Form.EventObserver = Class.create(Abstract.EventObserver, {
  getValue: function() {
    return Form.serialize(this.element);
  }
});
(function() {

  var Event = {
    KEY_BACKSPACE: 8,
    KEY_TAB:       9,
    KEY_RETURN:   13,
    KEY_ESC:      27,
    KEY_LEFT:     37,
    KEY_UP:       38,
    KEY_RIGHT:    39,
    KEY_DOWN:     40,
    KEY_DELETE:   46,
    KEY_HOME:     36,
    KEY_END:      35,
    KEY_PAGEUP:   33,
    KEY_PAGEDOWN: 34,
    KEY_INSERT:   45,

    cache: {}
  };

  var docEl = document.documentElement;
  var MOUSEENTER_MOUSELEAVE_EVENTS_SUPPORTED = 'onmouseenter' in docEl
    && 'onmouseleave' in docEl;

  var _isButton;
  if (Prototype.Browser.IE) {
    var buttonMap = { 0: 1, 1: 4, 2: 2 };
    _isButton = function(event, code) {
      return event.button === buttonMap[code];
    };
  } else if (Prototype.Browser.WebKit) {
    _isButton = function(event, code) {
      switch (code) {
        case 0: return event.which == 1 && !event.metaKey;
        case 1: return event.which == 1 && event.metaKey;
        default: return false;
      }
    };
  } else {
    _isButton = function(event, code) {
      return event.which ? (event.which === code + 1) : (event.button === code);
    };
  }

  function isLeftClick(event)   { return _isButton(event, 0) }

  function isMiddleClick(event) { return _isButton(event, 1) }

  function isRightClick(event)  { return _isButton(event, 2) }

  function element(event) {
    event = Event.extend(event);

    var node = event.target, type = event.type,
     currentTarget = event.currentTarget;

    if (currentTarget && currentTarget.tagName) {
      if (type === 'load' || type === 'error' ||
        (type === 'click' && currentTarget.tagName.toLowerCase() === 'input'
          && currentTarget.type === 'radio'))
            node = currentTarget;
    }

    if (node.nodeType == Node.TEXT_NODE)
      node = node.parentNode;

    return Element.extend(node);
  }

  function findElement(event, expression) {
    var element = Event.element(event);
    if (!expression) return element;
    var elements = [element].concat(element.ancestors());
    return Selector.findElement(elements, expression, 0);
  }

  function pointer(event) {
    return { x: pointerX(event), y: pointerY(event) };
  }

  function pointerX(event) {
    var docElement = document.documentElement,
     body = document.body || { scrollLeft: 0 };

    return event.pageX || (event.clientX +
      (docElement.scrollLeft || body.scrollLeft) -
      (docElement.clientLeft || 0));
  }

  function pointerY(event) {
    var docElement = document.documentElement,
     body = document.body || { scrollTop: 0 };

    return  event.pageY || (event.clientY +
       (docElement.scrollTop || body.scrollTop) -
       (docElement.clientTop || 0));
  }


  function stop(event) {
    Event.extend(event);
    event.preventDefault();
    event.stopPropagation();

    event.stopped = true;
  }

  Event.Methods = {
    isLeftClick: isLeftClick,
    isMiddleClick: isMiddleClick,
    isRightClick: isRightClick,

    element: element,
    findElement: findElement,

    pointer: pointer,
    pointerX: pointerX,
    pointerY: pointerY,

    stop: stop
  };


  var methods = Object.keys(Event.Methods).inject({ }, function(m, name) {
    m[name] = Event.Methods[name].methodize();
    return m;
  });

  if (Prototype.Browser.IE) {
    function _relatedTarget(event) {
      var element;
      switch (event.type) {
        case 'mouseover': element = event.fromElement; break;
        case 'mouseout':  element = event.toElement;   break;
        default: return null;
      }
      return Element.extend(element);
    }

    Object.extend(methods, {
      stopPropagation: function() { this.cancelBubble = true },
      preventDefault:  function() { this.returnValue = false },
      inspect: function() { return '[object Event]' }
    });

    Event.extend = function(event, element) {
      if (!event) return false;
      if (event._extendedByPrototype) return event;

      event._extendedByPrototype = Prototype.emptyFunction;
      var pointer = Event.pointer(event);

      Object.extend(event, {
        target: event.srcElement || element,
        relatedTarget: _relatedTarget(event),
        pageX:  pointer.x,
        pageY:  pointer.y
      });

      return Object.extend(event, methods);
    };
  } else {
    Event.prototype = window.Event.prototype || document.createEvent('HTMLEvents').__proto__;
    Object.extend(Event.prototype, methods);
    Event.extend = Prototype.K;
  }

  function _createResponder(element, eventName, handler) {
    var registry = Element.retrieve(element, 'prototype_event_registry');

    if (Object.isUndefined(registry)) {
      CACHE.push(element);
      registry = Element.retrieve(element, 'prototype_event_registry', $H());
    }

    var respondersForEvent = registry.get(eventName);
    if (Object.isUndefined(respondersForEvent)) {
      respondersForEvent = [];
      registry.set(eventName, respondersForEvent);
    }

    if (respondersForEvent.pluck('handler').include(handler)) return false;

    var responder;
    if (eventName.include(":")) {
      responder = function(event) {
        if (Object.isUndefined(event.eventName))
          return false;

        if (event.eventName !== eventName)
          return false;

        Event.extend(event, element);
        handler.call(element, event);
      };
    } else {
      if (!MOUSEENTER_MOUSELEAVE_EVENTS_SUPPORTED &&
       (eventName === "mouseenter" || eventName === "mouseleave")) {
        if (eventName === "mouseenter" || eventName === "mouseleave") {
          responder = function(event) {
            Event.extend(event, element);

            var parent = event.relatedTarget;
            while (parent && parent !== element) {
              try { parent = parent.parentNode; }
              catch(e) { parent = element; }
            }

            if (parent === element) return;

            handler.call(element, event);
          };
        }
      } else {
        responder = function(event) {
          Event.extend(event, element);
          handler.call(element, event);
        };
      }
    }

    responder.handler = handler;
    respondersForEvent.push(responder);
    return responder;
  }

  function _destroyCache() {
    for (var i = 0, length = CACHE.length; i < length; i++) {
      Event.stopObserving(CACHE[i]);
      CACHE[i] = null;
    }
  }

  var CACHE = [];

  if (Prototype.Browser.IE)
    window.attachEvent('onunload', _destroyCache);

  if (Prototype.Browser.WebKit)
    window.addEventListener('unload', Prototype.emptyFunction, false);


  var _getDOMEventName = Prototype.K;

  if (!MOUSEENTER_MOUSELEAVE_EVENTS_SUPPORTED) {
    _getDOMEventName = function(eventName) {
      var translations = { mouseenter: "mouseover", mouseleave: "mouseout" };
      return eventName in translations ? translations[eventName] : eventName;
    };
  }

  function observe(element, eventName, handler) {
    element = $(element);

    var responder = _createResponder(element, eventName, handler);

    if (!responder) return element;

    if (eventName.include(':')) {
      if (element.addEventListener)
        element.addEventListener("dataavailable", responder, false);
      else {
        element.attachEvent("ondataavailable", responder);
        element.attachEvent("onfilterchange", responder);
      }
    } else {
      var actualEventName = _getDOMEventName(eventName);

      if (element.addEventListener)
        element.addEventListener(actualEventName, responder, false);
      else
        element.attachEvent("on" + actualEventName, responder);
    }

    return element;
  }

  function stopObserving(element, eventName, handler) {
    element = $(element);

    var registry = Element.retrieve(element, 'prototype_event_registry');

    if (Object.isUndefined(registry)) return element;

    if (eventName && !handler) {
      var responders = registry.get(eventName);

      if (Object.isUndefined(responders)) return element;

      responders.each( function(r) {
        Element.stopObserving(element, eventName, r.handler);
      });
      return element;
    } else if (!eventName) {
      registry.each( function(pair) {
        var eventName = pair.key, responders = pair.value;

        responders.each( function(r) {
          Element.stopObserving(element, eventName, r.handler);
        });
      });
      return element;
    }

    var responders = registry.get(eventName);

    if (!responders) return;

    var responder = responders.find( function(r) { return r.handler === handler; });
    if (!responder) return element;

    var actualEventName = _getDOMEventName(eventName);

    if (eventName.include(':')) {
      if (element.removeEventListener)
        element.removeEventListener("dataavailable", responder, false);
      else {
        element.detachEvent("ondataavailable", responder);
        element.detachEvent("onfilterchange",  responder);
      }
    } else {
      if (element.removeEventListener)
        element.removeEventListener(actualEventName, responder, false);
      else
        element.detachEvent('on' + actualEventName, responder);
    }

    registry.set(eventName, responders.without(responder));

    return element;
  }

  function fire(element, eventName, memo, bubble) {
    element = $(element);

    if (Object.isUndefined(bubble))
      bubble = true;

    if (element == document && document.createEvent && !element.dispatchEvent)
      element = document.documentElement;

    var event;
    if (document.createEvent) {
      event = document.createEvent('HTMLEvents');
      event.initEvent('dataavailable', true, true);
    } else {
      event = document.createEventObject();
      event.eventType = bubble ? 'ondataavailable' : 'onfilterchange';
    }

    event.eventName = eventName;
    event.memo = memo || { };

    if (document.createEvent)
      element.dispatchEvent(event);
    else
      element.fireEvent(event.eventType, event);

    return Event.extend(event);
  }


  Object.extend(Event, Event.Methods);

  Object.extend(Event, {
    fire:          fire,
    observe:       observe,
    stopObserving: stopObserving
  });

  Element.addMethods({
    fire:          fire,

    observe:       observe,

    stopObserving: stopObserving
  });

  Object.extend(document, {
    fire:          fire.methodize(),

    observe:       observe.methodize(),

    stopObserving: stopObserving.methodize(),

    loaded:        false
  });

  if (window.Event) Object.extend(window.Event, Event);
  else window.Event = Event;
})();

(function() {
  /* Support for the DOMContentLoaded event is based on work by Dan Webb,
     Matthias Miller, Dean Edwards, John Resig, and Diego Perini. */

  var timer;

  function fireContentLoadedEvent() {
    if (document.loaded) return;
    if (timer) window.clearTimeout(timer);
    document.loaded = true;
    document.fire('dom:loaded');
  }

  function checkReadyState() {
    if (document.readyState === 'complete') {
      document.stopObserving('readystatechange', checkReadyState);
      fireContentLoadedEvent();
    }
  }

  function pollDoScroll() {
    try { document.documentElement.doScroll('left'); }
    catch(e) {
      timer = pollDoScroll.defer();
      return;
    }
    fireContentLoadedEvent();
  }

  if (document.addEventListener) {
    document.addEventListener('DOMContentLoaded', fireContentLoadedEvent, false);
  } else {
    document.observe('readystatechange', checkReadyState);
    if (window == top)
      timer = pollDoScroll.defer();
  }

  Event.observe(window, 'load', fireContentLoadedEvent);
})();

Element.addMethods();

/*------------------------------- DEPRECATED -------------------------------*/

Hash.toQueryString = Object.toQueryString;

var Toggle = { display: Element.toggle };

Element.Methods.childOf = Element.Methods.descendantOf;

var Insertion = {
  Before: function(element, content) {
    return Element.insert(element, {before:content});
  },

  Top: function(element, content) {
    return Element.insert(element, {top:content});
  },

  Bottom: function(element, content) {
    return Element.insert(element, {bottom:content});
  },

  After: function(element, content) {
    return Element.insert(element, {after:content});
  }
};

var $continue = new Error('"throw $continue" is deprecated, use "return" instead');

var Position = {
  includeScrollOffsets: false,

  prepare: function() {
    this.deltaX =  window.pageXOffset
                || document.documentElement.scrollLeft
                || document.body.scrollLeft
                || 0;
    this.deltaY =  window.pageYOffset
                || document.documentElement.scrollTop
                || document.body.scrollTop
                || 0;
  },

  within: function(element, x, y) {
    if (this.includeScrollOffsets)
      return this.withinIncludingScrolloffsets(element, x, y);
    this.xcomp = x;
    this.ycomp = y;
    this.offset = Element.cumulativeOffset(element);

    return (y >= this.offset[1] &&
            y <  this.offset[1] + element.offsetHeight &&
            x >= this.offset[0] &&
            x <  this.offset[0] + element.offsetWidth);
  },

  withinIncludingScrolloffsets: function(element, x, y) {
    var offsetcache = Element.cumulativeScrollOffset(element);

    this.xcomp = x + offsetcache[0] - this.deltaX;
    this.ycomp = y + offsetcache[1] - this.deltaY;
    this.offset = Element.cumulativeOffset(element);

    return (this.ycomp >= this.offset[1] &&
            this.ycomp <  this.offset[1] + element.offsetHeight &&
            this.xcomp >= this.offset[0] &&
            this.xcomp <  this.offset[0] + element.offsetWidth);
  },

  overlap: function(mode, element) {
    if (!mode) return 0;
    if (mode == 'vertical')
      return ((this.offset[1] + element.offsetHeight) - this.ycomp) /
        element.offsetHeight;
    if (mode == 'horizontal')
      return ((this.offset[0] + element.offsetWidth) - this.xcomp) /
        element.offsetWidth;
  },


  cumulativeOffset: Element.Methods.cumulativeOffset,

  positionedOffset: Element.Methods.positionedOffset,

  absolutize: function(element) {
    Position.prepare();
    return Element.absolutize(element);
  },

  relativize: function(element) {
    Position.prepare();
    return Element.relativize(element);
  },

  realOffset: Element.Methods.cumulativeScrollOffset,

  offsetParent: Element.Methods.getOffsetParent,

  page: Element.Methods.viewportOffset,

  clone: function(source, target, options) {
    options = options || { };
    return Element.clonePosition(target, source, options);
  }
};

/*--------------------------------------------------------------------------*/

if (!document.getElementsByClassName) document.getElementsByClassName = function(instanceMethods){
  function iter(name) {
    return name.blank() ? null : "[contains(concat(' ', @class, ' '), ' " + name + " ')]";
  }

  instanceMethods.getElementsByClassName = Prototype.BrowserFeatures.XPath ?
  function(element, className) {
    className = className.toString().strip();
    var cond = /\s/.test(className) ? $w(className).map(iter).join('') : iter(className);
    return cond ? document._getElementsByXPath('.//*' + cond, element) : [];
  } : function(element, className) {
    className = className.toString().strip();
    var elements = [], classNames = (/\s/.test(className) ? $w(className) : null);
    if (!classNames && !className) return elements;

    var nodes = $(element).getElementsByTagName('*');
    className = ' ' + className + ' ';

    for (var i = 0, child, cn; child = nodes[i]; i++) {
      if (child.className && (cn = ' ' + child.className + ' ') && (cn.include(className) ||
          (classNames && classNames.all(function(name) {
            return !name.toString().blank() && cn.include(' ' + name + ' ');
          }))))
        elements.push(Element.extend(child));
    }
    return elements;
  };

  return function(className, parentElement) {
    return $(parentElement || document.body).getElementsByClassName(className);
  };
}(Element.Methods);

/*--------------------------------------------------------------------------*/

Element.ClassNames = Class.create();
Element.ClassNames.prototype = {
  initialize: function(element) {
    this.element = $(element);
  },

  _each: function(iterator) {
    this.element.className.split(/\s+/).select(function(name) {
      return name.length > 0;
    })._each(iterator);
  },

  set: function(className) {
    this.element.className = className;
  },

  add: function(classNameToAdd) {
    if (this.include(classNameToAdd)) return;
    this.set($A(this).concat(classNameToAdd).join(' '));
  },

  remove: function(classNameToRemove) {
    if (!this.include(classNameToRemove)) return;
    this.set($A(this).without(classNameToRemove).join(' '));
  },

  toString: function() {
    return $A(this).join(' ');
  }
};

Object.extend(Element.ClassNames.prototype, Enumerable);

/*--------------------------------------------------------------------------*/

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
			
			// rajouter le '0' devant les valeurs ÔøΩ 1 chiffre
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
			
			// si la date du click > la date de fin alors on a clickÔøΩ sur un jour du mois precedent !
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
				/*if( myParseInt(label.split("/")[0]) > myParseInt(extractDate(date,"d")) )DD = decalerDate( DD,0,-1,0,0,0 ); // si la date du click > la date de fin alors on a clickÔøΩ sur un jour du mois precedent !
				if( myParseInt(label.split("/")[1]) > myParseInt(extractDate(date,"m")) )DD = decalerDate( DD,-1,0,0,0,0 ); // si le mois du click > au mois de fin alors on a clickÔøΩ sur l'annÈe precedente !
				alert(DD);*/
				document.getElementById("dateDebData").value =  DD;			
				document.getElementById("dateDebData").onchange();	
				document.getElementById("dateFinData").value = decalerDate( document.getElementById("dateDebData").value,0,0,1,0,0 );	
				document.getElementById("dateFinData").onchange();	
				
			}else{			
				if( myParseInt(label.split("h")[0]) <10)h = "0";
				
				var DD =  extractDate(date,"y")+"-"+extractDate(date,"m")+"-"+extractDate(date,"d")+" "+h+myParseInt(label.split("h")[0])+":"+"00";
				
				if( myParseInt(label.split("h")[0]) >= myParseInt(extractDate(date,"h")) ){DD = decalerDate( DD,0,0,-1,0,0 ); }// si l'heure du click > l'heure de fin alors on a clickÔøΩ sur le jour precedent !
				
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
		
		// on s'assure que la date entrÔøΩe n'est pas future
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
    return null; // non support√©
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
		
	return null; // non support√©
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

var chart$=null;
var divIdNum$ = null;
var json$=null;


function chargeZoomVar(chart,  idNum, json) {
	chart$ = chart;
	divIdNum$ = idNum;
	json$ = json;
	
}



function zoomYAxis(id){

	try{
		var scale = dijit.byId(id).value
		chart$.zoomIn("y",scale);
		chart$.zoomIn("autre y",scale);
		mySetTheme(chart$);
		chart$.zoomIn("y",scale);
		chart$.zoomIn("autre y",scale);
		mySetTheme(chart$);
		changeAxes(chart$, divIdNum$, json$);
		
		setCursor(chart$.node.id, "rect");
	}catch(e){
	}
}


function initZoom(numGraphe, Onglet){
	/*
	if(document.getElementById(Onglet).isClosable){
		if(numGraphe == 2) {try{dijit.byId('zoomProto'+Onglet).setAttribute('value', 1);}catch(e){};}
		else if(numGraphe == 3) {try{dijit.byId('zoomLoc'+Onglet).setAttribute('value', 1);}catch(e){};}
		else if(numGraphe == 4) {try{dijit.byId('zoomExt'+Onglet).setAttribute('value', 1);}catch(e){};}
		else {}
	}else{
		if(numGraphe == 1) {try{dijit.byId("zoomTraffic"+Onglet).setAttribute('value', 1);}catch(e){};}
		else if(numGraphe == 2) {try{dijit.byId("zoomPackets"+Onglet).setAttribute('value', 1);}catch(e){};}
		else if(numGraphe == 3) {try{dijit.byId("zoomLoc"+Onglet).setAttribute('value', 1);}catch(e){};}
		else if(numGraphe == 4) {try{dijit.byId("zoomExt"+Onglet).setAttribute('value', 1);}catch(e){};}
		else if(numGraphe == 5) {try{dijit.byId('zoomNb'+Onglet).setAttribute('value', 1);}catch(e){};}
		else {}
	}
	*/
}



function initAllZooms(Onglet){
	if(document.getElementById(Onglet).isClosable){
		try{dijit.byId('zoomProto'+Onglet).setAttribute('value', 1);}catch(e){};
		try{dijit.byId('zoomLoc'+Onglet).setAttribute('value', 1);}catch(e){};
		try{dijit.byId('zoomExt'+Onglet).setAttribute('value', 1);}catch(e){};
	}else{
		try{dijit.byId("zoomTraffic"+Onglet).setAttribute('value', 1);}catch(e){};
		try{dijit.byId("zoomPackets"+Onglet).setAttribute('value', 1);}catch(e){};
		try{dijit.byId("zoomLoc"+Onglet).setAttribute('value', 1);}catch(e){};
		try{dijit.byId("zoomExt"+Onglet).setAttribute('value', 1);}catch(e){};
		try{dijit.byId('zoomNb'+Onglet).setAttribute('value', 1);}catch(e){};
	}
}


function initZoomVar(onglet){
	
	Chart12[onglet] = "";
	Chart13[onglet] = "";
	Chart14[onglet] = "";
	JsonObj12[onglet] = "";
	JsonObj13[onglet] = "";
	JsonObj14[onglet] = "";
	
}

function initZoomVarNetwork(onglet){
	
	Chart1[onglet] = "";
	Chart2[onglet] = "";
	Chart3[onglet] = "";
	Chart4[onglet] = "";
	Chart5[onglet] = "";
	JsonObj1[onglet] = "";
	JsonObj2[onglet] = "";
	JsonObj3[onglet] = "";
	JsonObj4[onglet] = "";
	JsonObj5[onglet] = "";
	
}


function deleteZoomVar(onglet){
	
	// destroying zooms which are dijit elements
	try{
		dijit.byId('zoomProto'+onglet).destroy();
		dijit.byId('zoomLoc'+onglet).destroy();
		dijit.byId('zoomExt'+onglet).destroy();
	}catch(e){
	}
	
	
	// destroying saved zooms variables 
	delete Chart12.onglet;
	delete Chart13.onglet;
	delete Chart14.onglet;
	delete JsonObj12.onglet;
	delete JsonObj13.onglet;
	delete JsonObj14.onglet;
	
}




	
		function initFunction(){
	//alert(decalHoraire("2011-11-16 12:00"));
	//alert(navigator.userAgent);
	browserIsOk = isBrowserOk();
	if(!browserIsOk){
		//alert("The browser used is not supported yet by ZNeTS ! Please download one of those browsers listed below ... ");
		window.location='navigator.html';
	}else{
		//setMyTheme();
		if(browserIsOk != "later") alert("Please update your browser to "+browserIsOk+"+ version or ZNeTS might encounter graphical errors");
		
		var xhr = createXhrObject();

		xhr.open("GET", "dynamic/getConfig.json", true);
		xhr.onreadystatechange=function() 
		{
			if (xhr.readyState == 4) 
			{
				if (xhr.status ==200) 
				{
					json = eval("(" + xhr.responseText + ")");
						
					try{
						//////////////////////////////////////////////////////////////////////////////////////// variables de chargement
						//PdC du nombre de cycle par heure
						NbCPH = json.nbCollectCyclePerHour;
						
						// booleen sur l'affichage ou non des camemberts et rawData
						dRDTD = json.disabledRecordDataflowToDatabase;
						dRDTD = ( dRDTD == "true");
						
						
						// booleen sur l'affichage ou non champs country et as de l'onglet plus
						setGI_GIAS(json.geoIp, json.geoIpASNum);
								
						if(dRDTD)document.getElementById("2ndPartDetailTab").style.display="none" ;
						else document.getElementById("2ndPartDetailTab").style.display="block" ;
								
						//verification de la validitÈ de la clÈ produit
						//alert(json.validKey+" : "+json.validKey == "true");
						//alert(json.validKey);
						if(json.validKey == "true"){
							validKey = true;
						}else{
							validKey = false;
							popupShow();
						}
								
						try{
							if(json.whoIs =="true"){
								document.getElementById("whoIsDiv").style.display="block" ;
							}
						}catch(e){
						}
						///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
						
						decalageHoraire = decalageHoraireLocal();

						// chargement des logs pour l'affichage dans le tableau
						ChargerLogs();  logsAutoRefresh();
						
						//boole affichage ou non d'autres onglets que logs et alertes
						var tabOnglet = document.getElementById("AllTabs").getElementsByTagName("li");
							
						if(json.DBMS == "None"){		//si false, masquage des onglets autres que logs 
							ChangerOnglet("Logs"); 		//on s'assure d'etre sur l'onglet logs
							ChangerDiv("DivLogs"); 		//et la div correspondante
							for(var i=0; i<tabOnglet.length; i++){
								if( tabOnglet[i].id != "Logs"){
									tabOnglet[i].setAttribute("style", "display:none;");
								}
							}
						}else{						//si true, on continue
							

							dojo.addOnLoad(autoCompletion);
							
							// initialisation des parametres de l'onglet Plus
							initPlusData();
							
						
							// initialisation du decalage horaire sur la div Globale
							document.getElementById('dh').setAttribute('value', decalageHoraire);
							document.getElementById('dh1').setAttribute('value', document.getElementById('dh').value);
							document.getElementById('dh2').setAttribute('value', document.getElementById('dh').value);
							document.getElementById('dhAlerts').setAttribute('value', document.getElementById('dh').value);
							
							// obtention des divers reseaux existants
							setNetworksTabs();
						
							// Initialisation/MaJ des champs horaires de tous les onglets
							// et stockage des parametres du preset pour l'onglet Alerts
							tabOnglet = document.getElementById("AllTabs").getElementsByTagName("li");
							for(var i = 0; i < tabOnglet.length; i++){
								if(tabOnglet[i].id){
									var O = tabOnglet[i];
								
									try{
										// initialisation des champs 'to' et 'from'
										document.getElementById('defaultPreset'+O.id).selected = "selected";
										mettreChampsAJour(document.getElementById('presets'+O.id).value, "presets"+O.id, O.id);
									}catch(e){
										//alert(O.id+" : "+e);
									}
									
									try{
										// initialisation des champs des dates effectifs (hidden)
										document.getElementById("Apply"+O.id).onclick();
									}catch(e){
										//alert(O.id+" : "+e);
									}
								}
							}
							
							
							
							// definition des tableaux pr la correspondance ip<=>name
							//remplissageCorrespondance(); autoRemplissageCorrespondance();
							
							// initialisation des filtres 'proto'
							updateProtoFilter('all');
							
							// disable buttons
							//document.getElementById('ApplyGlobal').disabled = true;
							document.getElementById("TabQueryFormData").disabled = true ;
							
							
							//popupAutoShowFunction(); 
							
							// hide dialog popup (error connecting server) if shown, and
							// stop reload if running
							dijit.byId("conEchecDialog").hide();
							return;

						}
						
					}catch(e){
						if(json.errMsg)alert('getConfig.json Bug Report: "+json.errMsg);	
						//alert("Wrong format of 'dynamic/getConfig.json' !\n"+e+"\n file: "+e.fileName+"\n line: "+e.lineNumber);
						//popupShow();
					}
							
				}else{
					//alert("status :"+xhr.status);
					//popupShow();
					//setTimeout(initFunction(), 10000);
					reload();
				}
			}
		}
		xhr.send(null);
		
	}
}


function reloadDecompte(){
	setTimeout(function(){	
				if(reloadCompt>0){
					reloadCompt--;
					document.getElementById("conEchecDialog").getElementsByTagName("textarea")[0].innerHTML = "Connection to your ZNeTS server failed !\n"+retryCompt+" try(s) remaining";
					reloadDecompte()
				}else{
					//retryCompt--;
					reloadCompt=1;
					initFunction();
					if(retryCompt<=0){
						dijit.byId("conEchecDialog").hide();
						dijit.byId("dialogAlert").show();
					}
				}
			},1000);
}


function retryDecompte(){
	if(retryCompt>0){
		retryCompt--;
		reloadDecompte();
	}else{
		retryCompt--;
		reloadCompt=1;
		initFunction();
	}
}


function reload(){

	if(reloadCompt==null && retryCompt==null){
		
		reloadCompt = 1;
		retryCompt = 30;
		dijit.byId("conEchecDialog").show();
		
	}
	if(retryCompt>0)setTimeout("retryDecompte()", 1000)
	
}
	
setTimeout("initFunction();", 100);
