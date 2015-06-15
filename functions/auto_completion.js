

var autoCompletion = function(){
//alert("com"+jsonLocalhosts.items.length);

	var JsonCountry = null;
	var JsonLocalhosts = null;
	

	// auto completion des noms et ip machines
	var xhr = createXhrObject();

	if(jsonLocalhosts.items.length)
		xhr.open("GET",   "dynamic/getListLocalhosts.json?nb="+jsonLocalhosts.items.length, false);
	else
		xhr.open("GET",   "dynamic/getListLocalhosts.json", false);
	
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
						if(JsonAuto.errMsg)alert("dynamic/getListLocalhosts.json Bug Report: "+JsonAuto.errMsg);	
					}
					
				}
			} else {
				
			}
			
		}else{
			
		}
	
	
	
	// auto completion des noms et codes-lettres pays
	var xhr1 = createXhrObject();
	
	xhr1.open("GET",  "dynamic/getCountryList.json", false);
	xhr1.send(null);
		if (xhr1.readyState == 4) 
		{
			if (xhr1.status == 200) 
			{
				if( xhr1.responseText == "") {}
				else{
					
					var JsonCountry = eval("(" + xhr1.responseText + ")");
					if(JsonCountry.errMsg)alert("dynamic/getCountryList.json Bug Report: "+JsonCountry.errMsg);	
					
					//tri du tableau
					JsonCountry.items.sort(compareNInJsonArray); 
					
					// inversion pour rajouter un champs en tête de liste
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
