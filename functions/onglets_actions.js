function ChangerOnglet(NouvelOnglet){	

	if(AncienOnglet != NouvelOnglet){
		//alert(AncienOnglet+" : "+NouvelOnglet);
		
		if(AncienOnglet == "Alerts") document.getElementById('newAlertsTabGif').style.display = "none";
		
		//if(NouvelOnglet == "Logs"){
		//	lastScrollTop = document.getElementById('TabLogsDiv').scrollHeight;
		//	fadeNewLogs();
		//}
		document.getElementById(NouvelOnglet).className = 'active';
		
		try{
			//alert(document.getElementById(AncienOnglet).getAttribute("niveauOnglet")+" : "+document.getElementById(NouvelOnglet).getAttribute("niveauOnglet"));
			//if(document.getElementById(AncienOnglet).getAttribute("niveauOnglet") == document.getElementById(NouvelOnglet).getAttribute("niveauOnglet"))
			//	document.getElementById(AncienOnglet).className = 'inactive';
		}catch(e){console.log("error : "+e+"\n in 'onglets_actions.js' function ! Alert raised at line :"+new Error().lineNumber);}
			
		
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
		}catch(e){console.log("error : "+e+"\n in 'onglets_actions.js' function ! Alert raised at line :"+new Error().lineNumber);}
		
		AncienOnglet = NouvelOnglet;
		
	}
	
	try{
		setParameters(null, document.getElementById(NouvelOnglet).getAttribute("params"));
	}catch(e){console.log("error : "+e+"\n nouvel onglet : "+NouvelOnglet+"\n in 'onglets_actions.js' function ! Alert raised at line :"+new Error().lineNumber);}

	setTabOngletHeight();
	
}
	


function ChangerDiv(NouvelleDiv){
		//alert(AncienneDiv+" : "+NouvelleDiv);
		if(AncienneDiv != NouvelleDiv){
			document.getElementById(NouvelleDiv).className = 'active';
			document.getElementById(NouvelleDiv).style.display = 'block';
			try{
				document.getElementById(AncienneDiv).className = 'inactive';
				document.getElementById(AncienneDiv).style.display = 'none';
			}catch(e){console.log("error : "+e+"\n in 'onglets_actions.js' function ! Alert raised at line :"+new Error().lineNumber);}
			
			AncienneDiv = NouvelleDiv;
				
		}
		
		if(NouvelleDiv == "DivRawData")
			try{
				require(["dijit/registry"], function(registry){
					registry.byId('RawDataTabContainer').resize();
				});
			}catch(e){ console.log("error : "+e+"\n in 'onglets_actions.js' function ! Alert raised at line :"+new Error().lineNumber); }		
		
		if(NouvelleDiv == "DivNetworks")
			try{
				require(["dijit/registry"], function(registry){
					registry.byId('NetworksTabContainer').resize();
				});
			}catch(e){ console.log("error : "+e+"\n in 'onglets_actions.js' function ! Alert raised at line :"+new Error().lineNumber);; }
		
		if(NouvelleDiv == "DivLocalhosts")
			try{
				require(["dijit/registry"], function(registry){
					registry.byId('LocalhostsTabContainer').resize();
				});
			}catch(e){ console.log("error : "+e+"\n in 'onglets_actions.js' function ! Alert raised at line :"+new Error().lineNumber); }
	
}

/*
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
					catch(e){//si erreur donc [1] inexistant
							//la suite dans le if}
					if(document.getElementById('TabOngletsDatas').getElementsByTagName("li").length == 1){
						//document.getElementById('TabOnglets').appendChild(document.getElementById('TabOngletsDatas').getElementsByTagName("li")[0]); 
						//document.getElementById('TabOnglets').removeChild(document.getElementById("Datas")); 
						//document.getElementById('AllTabs').removeChild(document.getElementById("TabOngletsDatas")); 
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
					catch(e){//si erreur donc [1] inexistant
							//la suite dans le if}
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
	*/
