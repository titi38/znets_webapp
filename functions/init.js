function initFunction(){
	//alert(decalHoraire("yaaaa2011-11-16 12:00"));
	//alert(navigator.userAgent);

	
	browserIsOk = isBrowserOk();
	if(!browserIsOk){
		//alert("The browser used is not supported yet by ZNeTS ! Please download one of those browsers listed below ... ");
		window.location='navigator.html';
	}else{
		
		

		//setMyTheme();
		if(browserIsOk != "later") alert("Please update your browser to "+browserIsOk+"+ version or ZNeTS might encounter graphical errors");
		
		var xhr = createXhrObject();

		xhr.open("GET", askWhere + "getConfig.json", true);
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
						setGI_GIAS(json.GeoIP, json.GeoIPASNum);
								
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
								//document.getElementById("whoIsDiv").style.display="block" ;
								makeWhoisSearchBar();
							}
						}catch(e){
						}
						///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
						
						
						decalageHoraire = decalageHoraireLocal();

						// chargement des logs pour l'affichage dans le tableau
						ChargerLogs();  logsAutoRefresh();
						
						//var tabOngletsIds = document.getElementById("AllTabs").getElementsByTagName("li");
						
						
						ChangerOnglet("Logs"); 		//on s'assure d'etre sur l'onglet logs
						ChangerDiv("DivLogs"); 		//et la div correspondante
							
						//boole affichage ou non d'autres onglets que logs et alertes
						if(json.DBMS == "None"){		//si false, masquage des onglets autres que logs 
							/*for(var i=0; i<tabOnglet.length; i++){
								if( tabOnglet[i].id != "Logs"){
									tabOnglet[i].setAttribute("style", "display:none;");
								}
							}*/
							alert("TODO");
						}else{						//si true, on continue
							//alert('auto');
							try{dojo.addOnLoad(autoCompletion);}catch(e){alert(e);}
							//try{dojo.addOnLoad();}catch(e){alert('auto1');}
							//try{dojo.addOnLoad(function(){alert('hihi');})}catch(e){alert('auto1');}
							
							// initialisation des parametres de l'onglet Plus
							initPlusData();
							
						
							// initialisation du decalage horaire sur la div Globale
							document.getElementById('dh').setAttribute('value', decalageHoraire);
							//document.getElementById('dh1').setAttribute('value', document.getElementById('dh').value);
							document.getElementById('dh2').setAttribute('value', document.getElementById('dh').value);
							document.getElementById('dhAlerts').setAttribute('value', document.getElementById('dh').value);
							
							// obtention des divers reseaux existants et créations des onglets correspondants
							setNetworksTabs();
		
				
							require(["dojo/ready", "dojo/domReady!"], function(ready){
								ready(function(){
												
									// Initialisation/MaJ des champs horaires de tous les onglets
									// et stockage des parametres du preset pour l'onglet Alerts
									//tabOnglet = document.getElementById("AllTabs").getElementsByTagName("li");

									for(var i = 0; i < tabOngletsIds.length; i++){
											
												try{
													// initialisation des champs 'to' et 'from'
													document.getElementById('defaultPreset'+tabOngletsIds[i]).selected = "selected";
													mettreChampsAJour(document.getElementById('presets'+tabOngletsIds[i]).value, "presets"+tabOngletsIds[i], tabOngletsIds[i]);
													console.log(tabOngletsIds[i]+" : OK");
												}catch(e){
													console.log(tabOngletsIds[i]+" : NOT OK PRESET ===> "+e);
												}
												
												try{
													// initialisation des champs des dates effectifs (hidden)
													//alert(document.getElementById("Apply"+tabOngletsIds[i]));
													document.getElementById("Apply"+tabOngletsIds[i]).onclick();
													console.log(tabOngletsIds[i]+" : OK");
												}catch(e){
													console.log(tabOngletsIds[i]+" : NOT OK APPLY ===> "+e);
												}	
									}
									
									// definition des tableaux pr la correspondance ip<=>name
									//remplissageCorrespondance(); autoRemplissageCorrespondance();
									
									
									// initialisation des filtres 'proto'
									updateProtoFilter('all');
									
									// disable buttons
									//document.getElementById('ApplyGlobal').disabled = true;
									document.getElementById("TabQueryFormData").disabled = true ;
									
									
									// creer l'arbre des flows data par localhosts dans l'onglet Rawdata, sous onglet Tree
									//localhostsTreeFlowsCompletion();
									
									
									//popupAutoShowFunction(); 
									
									// hide dialog popup (error connecting server) if shown, and
									// stop reload if running
									conEchecDialog.hide(); 
									
									// test chart proto
									//makeChartTest();
									
									if(document.body.offsetWidth/document.body.offsetHeight < 2) divSizePercent = "75%"; 
									
									
									return;
								});
							});
							

						}
						
					}catch(e){
						if(json.errMsg)alert("getConfig.json Bug Report: "+json.errMsg);	
						alert("Wrong format of 'getConfig.json' !\n"+e+"\n file: "+e.fileName+"\n line: "+e.lineNumber);
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
					conEchecDialog.domNode.getElementsByTagName("textarea")[0].innerHTML = "Connection to your ZNeTS server failed !\n"+retryCompt+" try(s) remaining";
					reloadDecompte()
				}else{
					//retryCompt--;
					reloadCompt=1;
					initFunction();
					if(retryCompt<=0){
						conEchecDialog.hide();
						dialogAlert.show();
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
		conEchecDialog.show();
		
	}
	if(retryCompt>0)setTimeout("retryDecompte()", 1000)
	
}


	
require(["dojo/ready"], function(ready){
     ready(function(){
           // This won't run until the DOM has loaded, the parser has run, and other modules like dijit/hccss
           // have also run.
	     
           initFunction();
		activeTab = "Logs";
     });
});

/*
alert("hi")
require(["dojo/ready", "dojo/domReady!"], function(ready){
	var test = newDivMinimisable("testDiv", "500px", "500px", "30px", "5px", "right", "30px");
	alert("hi3")
	document.getElementById("BigDiv").appendChild(test);
	alert("done")
})
*/