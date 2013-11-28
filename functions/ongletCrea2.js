function ChangerOnglet(NouvelOnglet){		
		if(AncienOnglet != NouvelOnglet){
			//alert(AncienOnglet+" : "+NouvelOnglet);
			
			if(AncienOnglet == "Alerts") document.getElementById('newAlertsTabGif').style.display = "none";
			
			if(NouvelOnglet == "Logs"){
				lastScrollTop = document.getElementById('TabLogsDiv').scrollHeight;
				fadeNewLogs();
			}
			document.getElementById(NouvelOnglet).className = 'active';
			
			if(document.getElementById(NouvelOnglet).isClosable){
				if(document.getElementById(NouvelOnglet).getAttribute("genre")=="data"){
					if(document.getElementById("Datas")){
						try{
							if(document.getElementById(AncienOnglet).getAttribute("genre")=="data")
								document.getElementById(AncienOnglet).setAttribute("underclass", 'inactive');
							else if(document.getElementById(AncienOnglet).getAttribute("genre")=="localhost"){
								if(document.getElementById("LocalHosts")){
									document.getElementById("LocalHosts").className = 'inactive';
								}else{
									document.getElementById(AncienOnglet).className = 'inactive';
								}
							}else
								document.getElementById(AncienOnglet).className = 'inactive';
								
						}catch(e){}
						document.getElementById("Datas").className = 'active';
						document.getElementById(NouvelOnglet).setAttribute("underclass", 'active');
					}else{
						document.getElementById(NouvelOnglet).className = 'active';
					}
				}else{
					/*
					try{
						document.getElementById(AncienOnglet).className = 'inactive';
					}catch(e){}
					document.getElementById(NouvelOnglet).className = 'active';
					*/
					if(document.getElementById("Localhosts")){
						try{
							if(document.getElementById(AncienOnglet).getAttribute("genre")=="localhost")
								document.getElementById(AncienOnglet).setAttribute("underclass", 'inactive');
							else if(document.getElementById(AncienOnglet).getAttribute("genre")=="data"){
								if(document.getElementById("Datas")){
									document.getElementById("Datas").className = 'inactive';
								}else{
									document.getElementById(AncienOnglet).className = 'inactive';
								}
							}else
								document.getElementById(AncienOnglet).className = 'inactive';
								
						}catch(e){}
						document.getElementById("Localhosts").className = 'active';
						document.getElementById(NouvelOnglet).setAttribute("underclass", 'active');
					}else{
						document.getElementById(NouvelOnglet).className = 'active';
					}
				}
			}else{
				/*if(document.getElementById(AncienOnglet).getAttribute("genre")=="ssreseau"){
					if(document.getElementById(NouvelOnglet).getAttribute("genre")=="ssreseau"){
						if(document.getElementById(NouvelOnglet).getAttribute("groupe")==document.getElementById(AncienOnglet).getAttribute("groupe")){
							document.getElementById(AncienOnglet).setAttribute("underclass", 'inactive');
							document.getElementById(NouvelOnglet).setAttribute("underclass", 'active');
							document.getElementById(AncienOnglet).className = 'inactive';
							document.getElementById(NouvelOnglet).className = 'active';
						}else{
							document.getElementById(document.getElementById(AncienOnglet).getAttribute("groupe")).className = 'inactive';
							document.getElementById(document.getElementById(NouvelOnglet).getAttribute("groupe")).className = 'active';
							document.getElementById(NouvelOnglet).setAttribute("underclass", 'active');
							document.getElementById(NouvelOnglet).className = 'active';
							document.getElementById(AncienOnglet).className = 'inactive';
						}
					}else{
						document.getElementById(document.getElementById(AncienOnglet).getAttribute("groupe")).className = 'inactive';
						document.getElementById(NouvelOnglet).className = 'active';
					}
				}else{*/
					document.getElementById(AncienOnglet).className = 'inactive';
					document.getElementById(NouvelOnglet).className = 'active';
				//}
			}
				
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
					document.getElementById('TabOngletsDatas').removeChild(document.getElementById(ongletId)); 
					document.getElementById('TabOngletsDatas').getElementsByTagName("li")[i].setAttribute("underclass", "active");
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
				document.getElementById('TabOnglets').removeChild(document.getElementById(ongletId)); 
			}
		}else if(document.getElementById(ongletId).getAttribute("genre") == "localhost"){
			alert('hi');
			try{
				if(document.getElementById('TabOngletsLocalhosts').getElementsByTagName("li").length >= 1){
					var i = 0;
					while(document.getElementById('TabOngletsLocalhosts').getElementsByTagName("li")[i].id != ongletId) 
						i++;
					i-=1;
					if(i==-1)i=1;
					document.getElementById('TabOngletsLocalhosts').removeChild(document.getElementById(ongletId)); 
					try{document.getElementById('TabOngletsLocalhosts').getElementsByTagName("li")[i].setAttribute("underclass", "active");}catch(e){}
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
				document.getElementById('TabOnglets').removeChild(document.getElementById(ongletId)); 
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
	
