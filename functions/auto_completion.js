
var autoCompletion = function(){
//alert("com"+jsonLocalhosts.items.length);
	
	require(["dojo/ready", "dijit/registry", "dojo/data/ItemFileReadStore", "dijit/form/ComboBox"], function(ready, registry,ItemFileReadStore, ComboBox){
		ready(function(){

			var JsonCountry = null;
			var JsonApp= null;
			var JsonLocalhosts = null;
			
		//alert("hi1");
			// auto completion des noms et ip machines
			var xhr = createXhrObject();

			try{
				if(jsonLocalhosts.items.length)
					xhr.open("GET", askWhere +   "getListLocalhosts.json?nb="+jsonLocalhosts.items.length, false);
				else
					xhr.open("GET", askWhere +   "getListLocalhosts.json", false);
			}catch(e){
				xhr.open("GET", askWhere +   "getListLocalhosts.json", false);
			}
			
			xhr.send(null);
				if (xhr.readyState == 4) 
				{
					if (xhr.status == 200) 
					{
						if( xhr.responseText == "") {}
						else{//alert("hi3");
							var JsonAuto = jsonFormModifier(eval("(" + xhr.responseText + ")"));
							var JsonLocalhosts = jsonFormModifier(eval("(" + xhr.responseText + ")"));
							
							// remplir le tableau des localhosts dans l'onglet "Plus" de l'onglet "Localhosts"
							localhostsTabCompletion(JsonAuto);
							
							// virer les sans name pour la suite sinon plantage chrome
								for(var i=0; i<JsonLocalhosts.items.length; i++){
									if(JsonLocalhosts.items[i].name == ""){
										JsonLocalhosts.items.splice(i, 1);
										i--;
									}
								}
							
							//alert("h4i");
							try{
								jsonLocalhosts = JsonAuto;
								

			//alert(JsonLocalhosts.items[0].name+" : "+JsonLocalhosts.items[0].ip+"\n"+JsonLocalhosts.items[1].name+" : "+JsonLocalhosts.items[1].ip+"\n"+JsonLocalhosts.items[2].name+" : "+JsonLocalhosts.items[2].ip+"\n"+JsonLocalhosts.items[3].name+" : "+JsonLocalhosts.items[3].ip)
								JsonLocalhosts.items.sort(compareHostsNameArray);
			//alert(JsonLocalhosts.items[0].name+" : "+JsonLocalhosts.items[0].ip+"\n"+JsonLocalhosts.items[1].name+" : "+JsonLocalhosts.items[1].ip+"\n"+JsonLocalhosts.items[2].name+" : "+JsonLocalhosts.items[2].ip+"\n"+JsonLocalhosts.items[3].name+" : "+JsonLocalhosts.items[3].ip)
								//JsonLocalhosts.items.reverse();
								//ESSS = JsonLocalhosts;
								
								//alert("hi");
								while(JsonLocalhosts.items.length != 0 && JsonLocalhosts.items[0].name == "") JsonLocalhosts.items.splice(0, 1);
								
							//alert("h6i");
									
									var stateStore = new dojo.data.ItemFileReadStore({
									    data: JsonAuto
									});
								
									//alert("h6ibis");
									/*	var filteringSelectIp = new ComboBox({
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
												SelectIpData.setAttribute('value', evt) ;
										}else{ 
											if(evt == "")this.name ="";
											document.getElementById("lhNamePlus").innerHTML = "" ; 
											this.value = "";
											this.setAttribute('value', ""); 
											document.getElementById("ApplyPlus").disabled = "disabled";
												//alert(evt+" :::: " +autoIptoName(evt));
											if(evt != "" &&  !autoIptoName(evt)){
												alert("Invalid  Localhost Ip Address4: "+ evt);
											}
										}
									    },
									    store: stateStore,
									    searchAttr: "ip", 
									    style: {width: "14em"},
									    pageSize: 20
									},
									dojo.byId("formIpPlus"));*/
								
								
							//alert("h5i");
								var filteringSelectIpData = new ComboBox({
								    id: "SelectIpData",
								    //name: "iploc",
								    value: "",
								    lastValue: "",
								    onChange: function(evt){
									//if( evt != "" && autoIptoName(evt)!=null){ 
									//if( evt != "" ){ 
									    
										if(evt.indexOf(':')!=-1)
											document.getElementById('iplocMask').value = 128; 
										else if(evt.indexOf('.')!=-1) 
											document.getElementById('iplocMask').value = 32;
										
										registry.byId("SelectNameData").setValue(autoIptoName(evt));
										
										/*if(ongletActif() != "Plus")
											SelectIp.setAttribute('value', evt) ;*/
										
									/*}else{ 
										document.getElementById('iplocMask').value = "";
										SelectNameData.setValue("");
										this.value = ""; 
										this.setAttribute('value', "");
											//alert(evt+" :: " +autoIptoName(evt));
										if(evt != "" &&  !autoIptoName(evt)){
											alert("Invalid  Localhost Ip Address2: "+ evt);
										}
										
									}*/
									setIpLocValue(); 
								    },
								    store: stateStore,
								    searchAttr: "ip", 
								    style: {width: "10em"},
								    pageSize: 20
								},
								"iploc");
								
								
							//alert("h7i");
								
								var filteringSelectIpAlerts = new ComboBox({
								    id: "SelectIpAlerts",
								    name: "ip",
								    value: "",
								    lastValue: "",
								    selectOnClick: "true",
								    onChange: function(){
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
											alert("Invalid  Localhost Ip Address3: "+ evt);
										}*/
									}
								    },
								    store: stateStore,
								    searchAttr: "ip", 
								    style: {width: "10em"},
								    pageSize: 20
								   
								},
								"ipAlerts");
								
		
								
								
							//alert("h8i");
								var stateStore2 = new dojo.data.ItemFileReadStore({
								    data: JsonLocalhosts
								});
									//alert("h8bisi");	
								var filteringSelectName = new ComboBox({
								    id: "SelectNameData",
								    value: " ",
								    onChange: function(evt){
										/*if(evt != ' '){
											if(evt){
												document.getElementById(dialogHostName.domNode.source).setAttribute("value", autoNametoIp(evt)); 
											}
											
											//if(dialogHostName.open)
											//	dialogHostName.hide();
											//else
											//	dialogHostName.show();
											//
											if(!autoNametoIp(evt)){
												if(evt != "")
													alert("Invalid Host Name : "+ evt);
												this.value = ""; 
												this.setAttribute('value', "");
											}
										}*/
									    
										registry.byId("SelectIpData").setValue(autoNametoIp(evt));
									    
								    },
								    store: stateStore2,
								    sort: {attribute:"n",descending: true},
								    style: {width: "100%"},
								    searchAttr: "name", 
								    pageSize: 20
								},
								"nameloc");
							}catch(e){
								alert(e);
								if(JsonAuto.errMsg)alert("getListLocalhosts.json Bug Report: "+JsonAuto.errMsg);	
								else alert("ERRRRRROR");
							}
							
						}
					} else {
						
					}
					
				}else{
					
				}
			
			
							//alert("h8i");
			
			// auto completion des noms et codes-lettres pays
			var xhr1 = createXhrObject();
			
							//alert("h9i");
			xhr1.open("GET", askWhere +  "getCountryList.json", false);
			xhr1.send(null);
				if (xhr1.readyState == 4) 
				{
					if (xhr1.status == 200) 
					{
						if( xhr1.responseText == "") {}
						else{
							
							var JsonCountry = jsonFormModifier(eval("(" + xhr1.responseText + ")"));
							if(JsonCountry.errMsg)alert("getCountryList.json Bug Report: "+JsonCountry.errMsg);	
							
							//tri du tableau
							JsonCountry.items.sort(compareNInJsonArray); 
							
							// inversion pour rajouter un champs en t�te de liste
							// rajout du champ "All" en fin de liste (soit en debut dans l'ordre du tri)
							// inversion pour retrouver l'ordre de tri
							JsonCountry.items.reverse();
							JsonCountry.items.push({ n:"All", c:""});
							JsonCountry.items.reverse();	
							
							
							//alert("h10i");
							var stateStore = new dojo.data.ItemFileReadStore({
							    data: JsonCountry
							});
							//alert("h10bis");
							var filteringSelectCountry = new dijit.form.ComboBox({
							    id: "SelectCountry",
							    //name: "country",
							    value: "All",
							    style: {width: "24em"},
							    onChange: function(evt){
								    if(GeoIP=="disabled"){ 
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
							    disabled: (GeoIP=="disabled")
							},
							"country");
							
							//alert("h11i");
							filteringSelectCountry.set("class", "countryTextBox");
							
							//alert("h12i");
							
						}
					} else {
						
					}
				}
				
				
				
				
				// auto completion des noms d'application
				var xhr2 = createXhrObject();
				
								//alert("h9i");
				xhr2.open("GET", askWhere +  "getAppList.json", false);
				xhr2.send(null);
					if (xhr2.readyState == 4) 
					{
						if (xhr2.status == 200) 
						{
							if( xhr2.responseText == "") {}
							else{
								
								var JsonApp = jsonFormModifier(eval("(" + xhr2.responseText + ")"));
								if(JsonApp.errMsg)alert("getAppList.json Bug Report: "+JsonApp.errMsg);	
								
								
								
								//tri du tableau
								JsonApp.items.sort(compareNInJsonArray); 
								
								// inversion pour rajouter un champs en t�te de liste
								// rajout du champ "All" en fin de liste (soit en debut dans l'ordre du tri)
								// inversion pour retrouver l'ordre de tri
								//JsonApp.items.reverse();
								JsonApp.items.push({ n:"All", id:""});
								//JsonApp.items.reverse();	
								
								
								//alert("h10i");
								var stateStore2 = new dojo.data.ItemFileReadStore({
								    data: JsonApp
								});
								//alert("h10bis");
								//alert(TabAPP.length);
								var filteringSelectApp = new dijit.form.ComboBox({
								    id: "SelectApp",
								    //name: "country",
								    value: "All",
								    style: {width: "24em"},
								    onChange: function(evt){
									 
										    if(evt == "N/A") evt="All";
										    if(TabAPP[evt]){
											document.getElementById("hiddenApp").value=TabAPP[evt];
										    }else{
											this.value="All";
											this.setAttribute('value', 'All');
											document.getElementById("hiddenApp").value="";
											
										    }
									 
									},
								    store: stateStore2,
								    sort: {attribute:"n",descending: true},
								    searchAttr: "n", 
								    pageSize: 20,
								    disabled: false
								},
								"app");
								
								//alert("h11i");
								filteringSelectApp.set("class", "appTextBox");
								
								//alert("h12i");
								
							}
						} else {
							
						}
					}
				
			
					
			// auto completion des serveurs "whois"
			serverWhoIsList.items.sort(compareServerInJsonArray); 
			/*var stateStore = new dojo.data.ItemFileReadStore({
			    data: serverWhoIsList 
			});
			var filteringSelectIp = new dijit.form.ComboBox({
			    id: "serverWhoIs",
			    name: "server",
			    value: "",
				
									onMouseDown : function(evt){
										alert(evt);
									},
			    onChange: function(evt){addNewWhoIsServer(this, evt);},
			    store: stateStore,
			    searchAttr: "server", 
			    style: {width: "12em"},
			    pageSize: 20
			},
			"serverWhoIs");*/
						
						//alert(serverWhoIsList);

						// create store instance referencing data from states.json
						var stateStore = new dojo.data.ItemFileReadStore({
						data: serverWhoIsList 
						});

						//alert(stateStoresss);
						// create ComboBox widget, populating its options from the store
						var select = new ComboBox({
							id: "serverWhoIs",
							name: "server",
							placeHolder: "Select a Server",
							store: stateStore,
							searchAttr: "server", 
							 onChange: function(evt){addNewWhoIsServer(this, evt);},
							style: {width: "12em"},
							pageSize: 20
						}, "serverWhoIs");
						//select.startup();
					
			
						
			remplissageCorrespondance(JsonAuto, JsonCountry, JsonApp);
			autoRemplissageCorrespondance();
			//alert("end");
		});
	});
	
	
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
		//SelectIp.store = new dojo.data.ItemFileReadStore({data: jsonIp1});
		
		SelectIpData.store = new dojo.data.ItemFileReadStore({data: jsonIp1});
		
		SelectIpAlerts.store = new dojo.data.ItemFileReadStore({data: jsonIp1});
		
		SelectName.store = new dojo.data.ItemFileReadStore({data: jsonIp2});
	}catch(e){};
	//	alert("re");
}
