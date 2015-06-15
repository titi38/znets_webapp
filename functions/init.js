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
								
						//verification de la validité de la clé produit
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
						if(json.errMsg)alert("dynamic/getConfig.json Bug Report: "+json.errMsg);	
						//alert("dynamic/Wrong format of 'getConfig.json' !\n"+e+"\n file: "+e.fileName+"\n line: "+e.lineNumber);
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
