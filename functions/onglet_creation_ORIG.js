function addNewIpTab(ip){
	
	/*initZoomVar(ip);
	
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
	};*/
	
	initZoomVar(ip);
	
	AjouterOnglet(ip, false, true, false, "");
	
	/*if(document.getElementById(ip) == null){
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
	};*/
	
}

function addNewDataTab(){
	
	var j = 1;
	while( document.getElementById("DivData"+j) != null ) j++;
	
	/*if(dataAlreadyOpened()){
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
	*/
	AjouterOnglet("Data"+j, true, true, false, "" );
	//document.getElementById("Data"+j).onclick();
	return "Data"+j;
}

		
		
function AjouterOnglet(NouvelOnglet, estData, isClosable, estGroupe, underGroup){
	//alert("NouvelOnglet : "+NouvelOnglet+"\n estData : "+estData+"\n isClosable : "+isClosable+"\n estGroupe : "+estGroupe+"\n underGroup : "+underGroup)
	
	// Creation du nouvel onglet dojo
	
	
	require(["dijit/registry", "dojo/aspect", "dijit/layout/TabContainer", "dijit/layout/ContentPane"], function(registry, aspect, TabContainer, ContentPane){
		
			
			if(isClosable){ 	// si isClosable = true alors il s'agit soit d'un onglet data, soit d'un onglet localhost
				
				if(estData){ // s'il est un onglet data alors l'"attache" � 'RawDataTabContainer'
					
					
						Elem = document.createElement("div");
						Elem.setAttribute('id', "Div"+NouvelOnglet);
						body.appendChild(Elem);
						
						creerDivData(NouvelOnglet+"");
						
						var TabContainer = registry.byId('RawDataTabContainer');
						
						var newTab = new ContentPane({
							title: NouvelOnglet+"",
							id: "Div"+NouvelOnglet,
							closable: true,
							onClose: function(){
								if(confirm("Do you really want to Close this tab?")){
									// remove element from tabOngletsIds table
									var index = tabOngletsIds.indexOf(NouvelOnglet+"");
									if(index > -1){
										tabOngletsIds.splice(index,1);
									}
									return true;
								};
							}
						}, "Div"+NouvelOnglet);
						
						TabContainer.addChild(newTab);
						
						TabContainer.startup();
						
						// ajout de l'onglet dans le tableau d'onglets
						tabOngletsIds.push(NouvelOnglet+"");

					
				}else{ // sinon, c'est un onglet localhost alors l'"attache" � 'LocalhostsTabContainer'
				
					
						Elem = document.createElement("div");
						Elem.setAttribute('id', "Div"+NouvelOnglet);
						body.appendChild(Elem);
						
						creerDivGraphique(NouvelOnglet+"");
						
						var TabContainer = registry.byId('LocalhostsTabContainer');
						
						var newTab = new ContentPane({
							title: autoIptoName(NouvelOnglet+""),
							id: "Div"+NouvelOnglet,
							closable: true,
							onClose: function(){
								if(confirm("Do you really want to Close this tab?")){
									// remove element from tabOngletsIds table
									var index = tabOngletsIds.indexOf(NouvelOnglet+"");
									if(index > -1){
										tabOngletsIds.splice(index,1);
									}
									return true;
								};
							}
						}, "Div"+NouvelOnglet);
						
						TabContainer.addChild(newTab);
						
						TabContainer.startup();
						
						// ajout de l'onglet dans le tableau d'onglets
						tabOngletsIds.push(NouvelOnglet+"");

					
				};
				
			}else{ 			// sinon c'est soit un onglet r�seau, soit un onglet groupe de r�seau
				
				if(estGroupe){ // s'il est un groupe de r�seaux, alors c'est un "TabContainer" et on l'"attache" � 'NetworksTabContainer'
					
					var TabContainer = registry.byId('NetworksTabContainer');
					
					Elem = document.createElement("div");
					Elem.setAttribute('id', NouvelOnglet+'GroupTabContainer');
					document.getElementById("NetworksTabContainer").appendChild(Elem);

					var newTab = new dijit.layout.TabContainer({
						style: "height: 100%; width: 100%;",
						title: NouvelOnglet+"",
						id: NouvelOnglet+'GroupTabContainer'
					}, NouvelOnglet+'GroupTabContainer');
					
					TabContainer.addChild(newTab);

					TabContainer.startup();
					
				}else{
				
					if(!underGroup){ // s'il n'est pas dans un groupe de r�seaux, alors, on l'"attache" � 'NetworksTabContainer'
					
						Elem = document.createElement("div");
						Elem.setAttribute('id', "Div"+NouvelOnglet);
						body.appendChild(Elem);
						
						creerDivGraphiqueReseau(NouvelOnglet+"");
						
						var TabContainer = registry.byId('NetworksTabContainer');
						
						var newTab = new ContentPane({
							title: NouvelOnglet+"",
							id: "Div"+NouvelOnglet
						}, "Div"+NouvelOnglet);
						
						TabContainer.addChild(newTab);
						
						TabContainer.startup();
						
						// ajout de l'onglet dans le tableau d'onglets
						tabOngletsIds.push(NouvelOnglet+"");
						
						
					}else{		// sinon, on l'"attache" au groupe de r�seaux correspondant
						
						// Creation du nouvel onglet dojo
						Elem = document.createElement("div");
						Elem.setAttribute('id', "Div"+NouvelOnglet);
						body.appendChild(Elem);
						
						creerDivGraphiqueReseau(NouvelOnglet+"");
						
						var TabContainer = registry.byId(underGroup+'GroupTabContainer');

						aspect.after(TabContainer, "selectChild", function() {
							setActiveTabDojo(this.selectedChildWidget);      
						});
						
						var newTab = new ContentPane({
							title: NouvelOnglet+"",
							id: "Div"+NouvelOnglet
						}, "Div"+NouvelOnglet);
						
						TabContainer.addChild(newTab);
						
						TabContainer.startup();
						
						// ajout de l'onglet dans le tableau d'onglets
						tabOngletsIds.push(NouvelOnglet+"");
					
					};
					
				};
				
			};
			


	});
	
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
		var text = document.createTextNode("Presets A: ");
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
		
		
		// l'affichage de l'interval de temps affich� par les graphes
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
		E3.setAttribute('value', 'hostProtocolesTraffic.json');
		text = document.createTextNode("Traffic");
		E3.appendChild(text);
		E2.appendChild(E3);
		
		E3 = document.createElement("option");
		E3.setAttribute('value', 'hostProtocolesPackets.json');
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
		
			try{
				dojo.require("dojox.form.RangeSlider");
				dojo.ready(function(){
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
				});
			}catch(e){alert(e);}
		
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
		E3.setAttribute('value', 'hostTop10ServicesTraffic.json');
		text = document.createTextNode("Traffic");
		E3.appendChild(text);
		E2.appendChild(E3);
		
		E3 = document.createElement("option");
		E3.setAttribute('value', 'hostTop10ServicesPackets.json');
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


			try{
				dojo.require("dojox.form.RangeSlider");
				dojo.ready(function(){
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
				});
			}catch(e){}
		
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
		E3.setAttribute('value', 'hostTop10ServicesTraffic.json');
		text = document.createTextNode("Traffic");
		E3.appendChild(text);
		E2.appendChild(E3);
		
		E3 = document.createElement("option");
		E3.setAttribute('value', 'hostTop10ServicesPackets.json');
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
		
			try{
				dojo.require("dojox.form.RangeSlider");
				dojo.ready(function(){
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
				});
			}catch(e){}
		
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
		
		document.getElementById('Apply'+Onglet).onclick();

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
		// inutile car nous la rendrons visible une fois que le tableau sera complet� a 100%
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
		
		//alert("stop");
		
	}
	
	
	
	
function creerDivGraphiqueReseau(Onglet){
		
		document.getElementById('Div'+Onglet).innerHTML = '<li style = "display : none;" id="'+Onglet+'"></li>';
	
		var DIV = document.createElement("div");
		DIV.setAttribute('style', "position: relative; background-color: #EEE;");
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
		E2.setAttribute('onclick', " clickApply('"+Onglet+"'); setParameters(document.getElementById('"+Onglet+"') , $('formulaire"+Onglet+"').serialize()); ");
		E1.appendChild(E2);
		
		E2 = document.createElement("input");
		E2.setAttribute('type','hidden');
		E2.setAttribute('name', 'dh');
		E2.setAttribute('value', document.getElementById('dh').value);
		E1.appendChild(E2);
		
		mettreChampsAJour(document.getElementById('presets'+Onglet).value, 'presets'+Onglet, Onglet);
		
		
		// l'affichage de l'interval de temps affich� par les graphes
		E1 = document.createElement("div");
		E1.innerHTML ='<table cellspacing=0 cellpadding=0><tr><td style="width: 50%"><center><table><tr><td><img src="images/clock.png" title="Current selection"></td><td><i>:<font id="timeSpace'+Onglet+'" style="margin-left: 15px;"></font></i></td></tr></table></center></td><td id="timeSpaceChange'+Onglet+'" style="width: 50%"></td></tr></table>'
		
		document.getElementById('Div'+Onglet).appendChild(E1);
		
		
		
		var E4 = document.createElement("table");
		E4.setAttribute('height', "90%");
		document.getElementById('Div'+Onglet).appendChild(E4);
		
		var E5 = document.createElement("tbody");
		E4.appendChild(E5);
		
		var E6 = document.createElement("tr");
		E5.appendChild(E6);
		
		var E7 = document.createElement("td");
		E6.appendChild(E7);
		
		//E7.innerHTML = ' <div id="thinTree'+Onglet+'" style="width: 170px; border: solid 1px #759dc0; height: 100%;" data-dojo-type="dijit/Tree" aria-label="my thin tree'+Onglet+'"  data-dojo-props="model:continentModel"><script type="dojo/aspect" data-dojo-advice="after" data-dojo-method="_adjustWidths"></script></div>';
		
		
		E7.innerHTML = '<div id="thinTree'+Onglet+'" style="width: 170px; border: solid 1px #759dc0; height: 100%;"\
				 data-dojo-type="dijit/Tree" aria-label="my thin tree'+Onglet+'"  data-dojo-props="model:continentModel">\
				<script type="dojo/aspect" data-dojo-advice="after" data-dojo-method="_adjustWidths">\
				</script>\
				<script type="dojo/aspect" data-dojo-advice="after" data-dojo-method="onClick" data-dojo-args="item">\
					if(!this.selectedNode.isExpandable){\
						try{\
							current_shown_graph_index["'+Onglet+'"] = graphIndexFromTreePath("'+Onglet+'");\
							clickTitreOpen(graphIndexFromTreePath("'+Onglet+'"),"'+Onglet+'");\
						}catch(e){alert(":::"+e)}\
					}\
				</script>\
				<script type="dojo/aspect" data-dojo-advice="before" data-dojo-method="onClick" data-dojo-args="item">\
					if(!this.selectedNode.isExpandable){\
						try{\
							if(current_shown_graph_index["'+Onglet+'"] != null){\
								clickTitreClose(current_shown_graph_index["'+Onglet+'"],"'+Onglet+'")\
							}else{\
								current_shown_graph_index["'+Onglet+'"] = null;\
							}\
						}catch(e){alert(":::"+e)}\
					}\
				</script>\
				<script type="dojo/aspect" data-dojo-advice="before" data-dojo-method="onLoad">\
					this.expandAll();\
				</script>\
			</div>';
		
		
		/*E4 = document.createElement("div");
		E4.setAttribute('id','thinTree'+Onglet);
		E4.setAttribute('style','width: 170px; border: solid 1px #759dc0; height: 100%;');
		E4.innerHTML = '<script type="dojo/aspect" data-dojo-advice="after" data-dojo-method="_adjustWidths"></script>';
		E7.appendChild(E4);
		
		//alert('ho');
		
		require(["dojo/ready", "dijit/registry",  "dijit/Tree"], function(ready, registry, Tree){
			ready(function(){
				//alert(document.getElementById("continentModel"));
				//alert(registry.byId("continentModel"));
				//alert(document.getElementById("continentMod"));
				//alert(registry.byId("continentMod"));
				// Create the Tree.   Note that all widget creation should be inside a dojo.ready().
				ready(function(){
					try{
					var tree = new Tree({
						model: document.getElementById("continentMod")
					});
					alert("h");
					tree.placeAt(E4);
					tree.startup();
					}catch(e){alert(e+"  "+e.lineNo);
					}
				});
			});
		});
		
		
		E7 = document.createElement("td");
		E6.appendChild(E7);		
		
		*/
		/*require(["dojo/ready", "dijit/registry"], function(ready, registry){
			ready(function(){
				alert(registry.byId("continentStore"));
				alert(registry.byId("continentModel"));
			});
		});*/
		
		/*require(["dojo/ready", "dojo/data/ItemFileWriteStore", "dojo/store/Memory", "dijit/tree/ObjectStoreModel", "dijit/Tree"], function(ready, ItemFileWriteStore, Memory, ObjectStoreModel, Tree){
			ready(function(){
				
			
				var datastore = new ItemFileWriteStore({url:"data/graphsZNeTS.json"});

				
				// Create test store, adding the getChildren() method required by ObjectStoreModel
				var myStore = new Memory(
					{data: datastore}
				);
				

					
				// Create the model
			   var myModel = new ObjectStoreModel({
				store: myStore,
				query: {id: 'treeRoot'}
			    });

			    
			    // Create the Tree.   Note that all widget creation should be inside a dojo.ready().
				var tree = new Tree({
				    model: myModel
				});
				tree.placeAt(E4);
				tree.startup();
				
			});
		});*/


		
		
		
		E7 = document.createElement("td");
		E6.appendChild(E7);
		
		
		
		
		
		
		//1ere fenetre (Graphe1)
		
		
		
		var E = document.createElement("div");
		E.setAttribute('id',"DivGraphe1"+Onglet);
		E.setAttribute('openedHeight', 0);
		E.setAttribute('style', "position: relative; display: none; overflow : auto;");
		E7.appendChild(E);
		
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
		
			try{
				dojo.require("dojox.form.RangeSlider");
				dojo.ready(function(){
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
				});
			}catch(e){alert(e);}
		
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
		
		
		
		E = document.createElement("div");
		E.setAttribute('id',"DivGraphe2"+Onglet);
		E.setAttribute('openedHeight', 0);
		E.setAttribute('style', "position: relative; display: none; overflow : auto;");
		E7.appendChild(E);
		
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
		
			try{
				dojo.require("dojox.form.RangeSlider");
				dojo.ready(function(){
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
				});
			}catch(e){alert(e);}
		
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
		
		
		
		E = document.createElement("div");
		E.setAttribute('id',"DivGraphe3"+Onglet);
		E.setAttribute('openedHeight', 0);
		E.setAttribute('style', "position: relative; display: none; overflow : auto;");
		E7.appendChild(E);
		
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
		
			try{
				dojo.require("dojox.form.RangeSlider");
				dojo.ready(function(){
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
				});
			}catch(e){alert(e);}
		
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
		
		
		
		E = document.createElement("div");
		E.setAttribute('id',"DivGraphe4"+Onglet);
		E.setAttribute('openedHeight', 0);
		E.setAttribute('style', "position: relative; display: none; overflow : auto;");
		E7.appendChild(E);
		
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
		
			try{
				dojo.require("dojox.form.RangeSlider");
				dojo.ready(function(){
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
				});
			}catch(e){alert(e);}
		
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
		
		
		
		E = document.createElement("div");
		E.setAttribute('id',"DivGraphe5"+Onglet);
		E.setAttribute('openedHeight', 0);
		E.setAttribute('style', "position: relative; display: none; overflow : auto;");
		E7.appendChild(E);
		
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
		
			try{
				dojo.require("dojox.form.RangeSlider");
				dojo.ready(function(){
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
				});
			}catch(e){alert(e);}
		
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
		
		
		
		E1 = document.createElement("div");
		E1.setAttribute('id',"DivGraphe6"+Onglet);
		E1.setAttribute('openedHeight', 0);
		E1.setAttribute('style', "position: relative; display: none; overflow : auto;");
		E7.appendChild(E1);
		
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
		
		
		
		E1 = document.createElement("div");
		E1.setAttribute('id',"DivGraphe7"+Onglet);
		E1.setAttribute('openedHeight', 0);
		E1.setAttribute('style', "position: relative; display: none; overflow : auto;");
		E7.appendChild(E1);
		
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
	
		// si un chargement a d�ja echou� (car serveur introuvable) !
		if (pending>=2)  return;
		
		//sinon
		try{
			
			var xhr = createXhrObject();
			
			if(document.getElementById("Logs").getAttribute("value") == null ||document.getElementById("Logs").getAttribute("value") == ""){
				//open xml element (case as first run)
				xhr.open("GET", "getLogs.json?dh="+decalageHoraire, true);
				
			}else{
				xhr.open("GET", "getLogs.json?dh="+decalageHoraire+"&id="+document.getElementById("Logs").value, true);
			}
			lockScreen();
			xhr.onreadystatechange=function() 
			{
				if (xhr.readyState == 4) 
				{
					//alert("Charg�");
					
					if (xhr.status == 200) 
					{
						
						var JsonLogs = jsonFormModifier(eval("(" + xhr.responseText + ")"));
						
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
							
							if(JsonLogs.nextId != document.getElementById("Logs").value && JsonLogs.items.length > 0){
								
								TBody = document.getElementById('TabLogs').tBodies[0];
								
								for( var i=0; i< JsonLogs.items.length; i++){
									
									//if(i == (JsonLogs.items.length-1)) lastLogEntry = JsonLogs.items[i].msg ;
									
									var Ntr = document.createElement("tr");
									Ntr.setAttribute("style","background: #EEFFEE;");
									TBody.appendChild(Ntr);
									//TBody.insertBefore(Ntr, null);
									
									Ntd = document.createElement("td");
									text = document.createTextNode(JsonLogs.items[i].msg+"    ");
									Ntd.appendChild(text);
									
									
									if(JsonLogs.items[i].detail){
										var detail = document.createElement("input");
										detail.setAttribute('type',"image"); 
										detail.setAttribute('value',JsonLogs.items[i].detail); 
										detail.setAttribute('msg',JsonLogs.items[i].msg); 
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
									
									if(JsonLogs.items[i].severity == "WARNING"){
										Input.setAttribute('src', "images/warnIcon.gif");
										Input.setAttribute('title', "Warning");
									}else if(JsonLogs.items[i].severity == "ALERT"){
										Input.setAttribute('src', "images/alertIcon.gif");
										Input.setAttribute('height', "20");
										Input.setAttribute('title', "Alert");
									}else if(JsonLogs.items[i].severity == "INFO"){
										Input.setAttribute('src', "images/InfoIcon.gif");
										Input.setAttribute('title', "Info");
									}else if(JsonLogs.items[i].severity == "ERROR"){
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
								dialogAlert.hide();
								
							}	
					
						}catch(e){
							if(JsonLogs.errMsg){
								dialogAlert.domNode.getElementsByTagName("textarea")[0] += "\ngetLogs.json Bug Report: "+JsonLogs.errMsg;
								//alert("getLogs.json Bug Report: "+JsonLogs.errMsg);	
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
						//document.getElementById('TabLogs').innerHTML = "getLogs.json not found";
						
				
						/*dialogAlert.domNode._onKey=function(evt){
							if (evt.keyCode == dojo.keys.ESCAPE) {
								dojo.stopEvent(evt);
							}
						}*/
						
						// afficher l'alert de perte de connection serveur
						dialogAlert.show();
					}
				}else if (xhr.readyState == 0) 
				{
					//alert("Non initialis�");
				}else if (xhr.readyState == 1) 
				{
					//alert("Ouvert");
				}else if (xhr.readyState == 2) 
				{
					//alert("pending++ :"+pending);
					pending ++;
					if(pending==2){
						dialogAlert.show();
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
			xhr.open("GET",  "rawDataFlow.json?"+parameters+dataPage+"&force=true", true);
		else
			xhr.open("GET",  "rawDataFlow.json?"+parameters+dataPage, true);
		//lockScreen();
		xhr.onreadystatechange=function() 
		{
			if (xhr.readyState == 4) 
			{
				if (xhr.status == 200) 
				{
						
						var JsonData = jsonFormModifier(eval("(" + xhr.responseText + ")"));
						
						JsonData = setLegendDataIndex(JsonData);
					
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
						
						for(var i=0; i<JsonData.legend.length; i++){
							Ntd = document.createElement("th");
							text = document.createTextNode(JsonData.legend[i]);
							Ntd.appendChild(text);
							Ntr.appendChild(Ntd);
						}
						
						TBody = document.createElement("tbody");
						TBody.setAttribute("class", "BodyTable");
						Table.appendChild(TBody);
						
						var cyc = 0;
						for( var i=0; i< JsonData.data.length; i++){
							
							Ntr = document.createElement("tr");
							Ntr.setAttribute('style', 'height: 20px;');
							TBody.appendChild(Ntr);
							TBody.insertBefore(Ntr, null);
							
							if( JsonData.data[i][cyc_INDEX] == cyc){
								for(var j = 0; j< JsonData.legend.length; j++){
									Ntd = document.createElement("td");
									switch (JsonData.legend[j]){
										case "FirstTime": 
										//alert(JsonData.data[i][j]);
												text = document.createTextNode(JsonData.data[i][fst_INDEX]);
												Ntd.appendChild(text);
										break;
										case "LastTime": 
												text = document.createTextNode(JsonData.data[i][lst_INDEX]);
												Ntd.appendChild(text);
										break;
										case "IpLocal":
												text = document.createTextNode(JsonData.data[i][ipl_INDEX]);
												Ntd.setAttribute('style',"cursor: pointer;");
												Ntd.setAttribute('id', 'loc'+i+Onglet);
												Ntd.setAttribute("localhost", JsonData.data[i][ipl_INDEX])
												Ntd.setAttribute('onmouseover', "this.style.background= '#EEFFEE'; setTOResolv = setTimeout('solveIpLoc('+this.id+')', 500);");
												Ntd.setAttribute('onmouseout', "this.style.background= 'white'; clearTimeout(setTOResolv);");
												Ntd.setAttribute('onclick', "dijit.byId('SelectIp').attr( 'value' , this.getAttribute(\"localhost\") ); dijit.byId('SelectIp').value = this.getAttribute(\"localhost\"); animatePlusTab();");
												Ntd.appendChild(text);	
										break;
										case "Dir":
												text = document.createTextNode(JsonData.data[i][d_INDEX]);
												Ntd.appendChild(text);
										break;
										case "IpExtern": 
												Ntd.setAttribute('class', 'ipExt');
												Ntd.setAttribute('id', 'ext'+i+Onglet);
												Ntd.setAttribute('host', JsonData.data[i][ipo_INDEX]);
												Ntd.setAttribute('country', JsonData.data[i][c_INDEX]);
												Ntd.setAttribute('style',"cursor: pointer; ");
												Ntd.setAttribute('onmouseover', "this.style.background= '#EEFFEE'; var element=this; setTOResolv = setTimeout('solveIpExt('+this.id+')',500);");
												Ntd.setAttribute('onmouseout', "this.style.background= 'white'; clearTimeout(setTOResolv);");
												Ntd.setAttribute('onclick', "document.getElementById('ipext').setAttribute('value', this.getAttribute(\"host\")); document.getElementById('ipext').value = this.getAttribute(\"host\"); document.getElementById('ipext').onchange(); animatePlusTab();\
																		dijit.byId('SelectCountry').attr( 'value' , nameOfCountry(this.getAttribute(\"country\")) ); dijit.byId('SelectCountry').value = nameOfCountry(this.getAttribute(\"country\"));");
												text = document.createTextNode(JsonData.data[i][ipo_INDEX]);
												Ntd.appendChild(text);
												
												// image du pays
												text = document.createElement("img");
												if(JsonData.data[i][c_INDEX]=="--") text.setAttribute('src', 'images/flags/unknown.png');
												else text.setAttribute('src', 'images/flags/'+JsonData.data[i][c_INDEX].toLowerCase()+'.png');
												text.setAttribute('title', nameOfCountry(JsonData.data[i][c_INDEX]));
												text.setAttribute('style', 'margin-left: 5px');
												Ntd.appendChild(text);
										break;
										case "ASNum": 
												Ntd.value=JsonData.data[i][asn_INDEX];
												Ntd.setAttribute('onmouseover', "this.style.background= '#EEFFEE'; if(this.title=='') this.title=resolveAS(this);");
												Ntd.setAttribute('onmouseout', "this.style.background= 'white'; ");
												Ntd.setAttribute('style',"cursor: pointer; ");
												Ntd.setAttribute('onclick', "document.getElementById('AS').setAttribute('value', this.innerHTML); document.getElementById('AS').value = this.innerHTML; document.getElementById('AS').onchange(); animatePlusTab();");
												if(JsonData.data[i][asn_INDEX] == "0"){
													Ntd.innerHTML="&nbsp;";
												}else{
													text = document.createTextNode(JsonData.data[i][asn_INDEX]);
													Ntd.appendChild(text);
												}	
										break;
										case "Proto": 	
												text = document.createTextNode(JsonData.data[i][p_INDEX]);
												Ntd.appendChild(text);
												Ntd.setAttribute('onmouseover', "this.style.background= '#EEFFEE'; if(this.title=='')this.title=resolveProto(this);");	
												Ntd.setAttribute('onmouseout', "this.style.background= 'white'; ");
												Ntd.setAttribute('style',"cursor: pointer; ");
												if(JsonData.data[i][p_INDEX] == "6")
													Ntd.setAttribute('onclick', "document.getElementById('proto').setAttribute('value', 'tcp'); document.getElementById('proto').value = 'tcp'; document.getElementById('proto').onchange(); animatePlusTab();");
												else if(JsonData.data[i][p_INDEX] == "17")
													Ntd.setAttribute('onclick', "document.getElementById('proto').setAttribute('value', 'udp'); document.getElementById('proto').value = 'udp'; document.getElementById('proto').onchange(); animatePlusTab();");
												else
													Ntd.setAttribute('onclick', "document.getElementById('proto').setAttribute('value', 'others'); document.getElementById('proto').value = 'others'; document.getElementById('proto').onchange(); animatePlusTab();");
												
										break;
										case "PtLoc":
												Ntd.setAttribute('proto', JsonData.data[i][p_INDEX]);
												if( JsonData.data[i][pl_INDEX] == "0" && JsonData.data[i][d_INDEX] == ">" ){
													text = document.createTextNode("*");
													Ntd.setAttribute('onmouseover', "this.style.background= '#EEFFEE';");	
													Ntd.setAttribute('onmouseout', "this.style.background= 'white';");
												}else{
													text = document.createTextNode(JsonData.data[i][pl_INDEX]);
													Ntd.setAttribute('onmouseover', "this.style.background= '#EEFFEE'; if(this.title=='') this.title=resolveService(this);");	
													Ntd.setAttribute('onmouseout', "this.style.background= 'white';");
													Ntd.setAttribute('style',"cursor: pointer; ");
													if(JsonData.data[i][p_INDEX] == "6")
														Ntd.setAttribute('onclick', "document.getElementById('proto').setAttribute('value', 'tcp'); document.getElementById('proto').value = 'tcp'; document.getElementById('proto').onchange(); \
																		document.getElementById('portLoc').setAttribute('value', this.innerHTML); document.getElementById('portLoc').value = this.innerHTML; document.getElementById('portLoc').onchange(); animatePlusTab();");
													else if(JsonData.data[i][p_INDEX] == "17")
														Ntd.setAttribute('onclick', "document.getElementById('proto').setAttribute('value', 'udp'); document.getElementById('proto').value = 'udp'; document.getElementById('proto').onchange(); \
																		document.getElementById('portLoc').setAttribute('value', this.innerHTML); document.getElementById('portLoc').value = this.innerHTML; document.getElementById('portLoc').onchange(); animatePlusTab();");
													else
													Ntd.setAttribute('onclick', "document.getElementById('proto').setAttribute('value', 'others'); document.getElementById('proto').value = 'others'; document.getElementById('proto').onchange(); \
																		document.getElementById('portLoc').setAttribute('value', this.innerHTML); document.getElementById('portLoc').value = this.innerHTML; document.getElementById('portLoc').onchange(); animatePlusTab();");
													
												}
												Ntd.appendChild(text);
										break;
										case "PtExt":
												//if( JsonData.data[i][po_INDEX] == "0" ) alert ( "d="+JsonData.data[i][d_INDEX] );
												Ntd.setAttribute('proto', JsonData.data[i][p_INDEX]);
												if( JsonData.data[i][po_INDEX] == "0" && JsonData.data[i][d_INDEX] == "&lt;" ){
													text = document.createTextNode("*");
													Ntd.setAttribute('onmouseover', "this.style.background= '#EEFFEE';");	
													Ntd.setAttribute('onmouseout', "this.style.background= 'white';");
												}else{
													text = document.createTextNode(JsonData.data[i][po_INDEX]);
													if(JsonData.data[i][p_INDEX] == "1")
														Ntd.setAttribute('onmouseover', "this.style.background= '#EEFFEE'; if(this.title=='')this.title=resolveCodeICMP('"+JsonData.data[i][pl_INDEX]+"', '"+JsonData.data[i][po_INDEX]+"');");
													else		
														Ntd.setAttribute('onmouseover', "this.style.background= '#EEFFEE'; if(this.title=='')this.title=resolveService(this);");
														
													Ntd.setAttribute('onmouseout', "this.style.background= 'white';");
													Ntd.setAttribute('style',"cursor: pointer; ");
													
													if(JsonData.data[i][p_INDEX] == "6")
														Ntd.setAttribute('onclick', "document.getElementById('proto').setAttribute('value', 'tcp'); document.getElementById('proto').value = 'tcp'; document.getElementById('proto').onchange(); \
																		document.getElementById('portExt').setAttribute('value', this.innerHTML); document.getElementById('portExt').value = this.innerHTML; document.getElementById('portExt').onchange(); animatePlusTab();");
													else if(JsonData.data[i][p_INDEX] == "17")
														Ntd.setAttribute('onclick', "document.getElementById('proto').setAttribute('value', 'udp'); document.getElementById('proto').value = 'udp'; document.getElementById('proto').onchange(); \
																		document.getElementById('portExt').setAttribute('value', this.innerHTML); document.getElementById('portExt').value = this.innerHTML; document.getElementById('portExt').onchange(); animatePlusTab();");
													else
													Ntd.setAttribute('onclick', "document.getElementById('proto').setAttribute('value', 'others'); document.getElementById('proto').value = 'others'; document.getElementById('proto').onchange(); \
																		document.getElementById('portExt').setAttribute('value', this.innerHTML); document.getElementById('portExt').value = this.innerHTML; document.getElementById('portExt').onchange(); animatePlusTab();");
												}
												Ntd.appendChild(text);
										break;
										case "TcpFlg":
												text = document.createTextNode(JsonData.data[i][flg_INDEX]);
												Ntd.setAttribute('proto', JsonData.data[i][p_INDEX]);
												Ntd.setAttribute('onmouseover', "this.style.background= '#EEFFEE'; if(this.title=='')this.title=resolveTCPFlag(this)");	
												Ntd.setAttribute('onmouseout', "this.style.background= 'white';");
												Ntd.setAttribute('style',"cursor: pointer; ");
												Ntd.setAttribute('onclick', "setTCPFlags(this);");
												Ntd.appendChild(text);
										break;
										case "IncTraf":
												text = document.createTextNode(JsonData.data[i][j]);
												Ntd.appendChild(text);
										break;
										case "OutgTraf": 
												text = document.createTextNode(JsonData.data[i][otr_INDEX]);
												Ntd.appendChild(text);
										break;
										case "IncPkts ":
												text = document.createTextNode(JsonData.data[i][ipk_INDEX]);
												Ntd.appendChild(text);
										break;
										case "OutgPkts ":
												text = document.createTextNode(JsonData.data[i][opk_INDEX]);
												Ntd.appendChild(text);
										break;
										case "Duration":
												text = document.createTextNode(JsonData.data[i][dur_INDEX]);
												Ntd.appendChild(text);
										break;
										default:
											Ntd.innerHTML = "&nbsp";
											alert("ChargerData : new legend name : "+JsonData.legend[j]);
										break;
									}
									
									Ntr.appendChild(Ntd);
									
								}
							
								/*Ntd = document.createElement("td");
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
									
									//Ntd.setAttribute('pnum', JsonData.data[i].p)
									//if(JsonData.data[i].pnam)
									//	text = document.createTextNode(JsonData.data[i].pnam);
									//else
									//	text = document.createTextNode(JsonData.data[i].pnu);
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
								Ntr.insertBefore(Ntd, Ntr.firstChild);*/
								
							}else{
								Ntd = document.createElement("td");
								Ntd.setAttribute('colspan',15);
								Ntr.setAttribute('style', 'background-color: #FFEFA8;');
								text = document.createTextNode("Aggregation period started at : "+JsonData.data[i][cyc_INDEX]);
								Ntd.appendChild(text);
								Ntr.appendChild(Ntd);
								Ntr.insertBefore(Ntd, Ntr.firstChild);
								cyc = JsonData.data[i][cyc_INDEX];
								i --;
							}
						}
						
						//"startOffset":0,"nbElemByPage":200, "nbResults":10837
						var curPage = Math.floor(JsonData.startOffset/JsonData.nbElemByPage)+1;
						var nbPages = Math.floor(JsonData.nbResults/JsonData.nbElemByPage)+1;
						//alert(curPage+" : "+nbPages);
						
						// Pages Buttons
						TBody = document.getElementById('Buttons'+Onglet); 
						
						if(nbPages >1){
							
							var borneInf = curPage - 5 ;
							var borneSup = curPage + 5 ;
							
							if( nbPages > 11){
								if (borneInf <1) {
									borneInf=1;
									borneSup=11;
								}
								if (borneSup > nbPages) {
									borneInf=nbPages-10;
									borneSup=nbPages;
								}
								
							}else{
								borneInf=1;
								borneSup=nbPages;
							}
							
							// le premier bouton : 'first page'
							if(borneInf > 1){
								Ntd = document.createElement("button");
								Ntd.setAttribute('onclick',"dataPage='&offset=0'; loading('DivGraphe6'+ongletActif()); setTimeout('ChargerData(ongletActif(),\""+force+"\")', 500);");
								Ntd.setAttribute('title',"First Page");
								Ntd.innerHTML = '<<';
								TBody.appendChild(Ntd);	
							}
							
							// les boutons des pages
							for( var i=borneInf; i<=borneSup; i++){
								Ntd = document.createElement("button");
								if(curPage == i)
									Ntd.disabled=true;
								else
									Ntd.setAttribute('style',"cursor: pointer;");
								Ntd.setAttribute('onclick',"dataPage='&offset='+((this.innerHTML-1)*"+JsonData.nbElemByPage+"); loading('DivGraphe6'+ongletActif()); setTimeout('ChargerData(ongletActif(),\""+force+"\")', 500);");
								Ntd.innerHTML = i;
								TBody.appendChild(Ntd);	
							}
							
							//le dernier bouton : 'last page'
							if (borneSup < nbPages) {
								Ntd = document.createElement("button");
								Ntd.setAttribute('onclick',"dataPage='&offset="+((nbPages-1)*JsonData.nbElemByPage)+"'; loading('DivGraphe6'+ongletActif()); setTimeout('ChargerData(ongletActif(),\""+force+"\")', 500);");
								Ntd.setAttribute('title',"Last Page");
								Ntd.innerHTML = '>>';
								TBody.appendChild(Ntd);	
							}
							
						}
						
						
						
						
						// cr�ation de l'icone "save to CSV"
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
						
						
					}catch(e){ 	alert(e);					
						if(JsonData.warnMsg){
							var forcer = confirm(JsonData.warnMsg);
							if (forcer){
								ChargerData(Onglet, "true")
								return;
							}else{
								//clickOnClose(ongletActif())
								ChangerOnglet("Plus");
								ChangerDiv("DivPlus");
							}

						}else{
							if(JsonData.errMsg)
								alert("rawDataFlow.json Bug Report: "+JsonData.errMsg);	
							else
								alert("rawData empty !");
							//clickOnClose(Onglet);
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
		//	unlockScreen();	
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
			xhr.open("GET",   "getAlertList.json?"+document.getElementById("Alerts").getAttribute('params'), false);
		else{
			if(document.getElementById("Alerts").getAttribute('params') == "" || document.getElementById("Alerts").getAttribute('params') == null)
				xhr.open("GET", "getAlertList.json?page="+page, false);
			else
				xhr.open("GET", "getAlertList.json?"+document.getElementById("Alerts").getAttribute('params')+"&page="+page, false);
		}
		
		xhr.send(null);
		
			if (xhr.readyState == 4) 
			{
				if (xhr.status == 200) 
				{
						
						var JsonAlerts = jsonFormModifier(eval("(" + xhr.responseText + ")"));
					
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
							
							for( var i=0; i< JsonAlerts.items.length; i++){
								
								Ntr = document.createElement("tr");
								Ntr.setAttribute('value', JsonAlerts.items[i].id);
								Ntr.setAttribute('date', JsonAlerts.items[i].date);
								Ntr.setAttribute('localhost', JsonAlerts.items[i].ip);
								Ntr.setAttribute('alertType',"UNDEF");
								if(JsonAlerts.items[i].msg.indexOf("SMTP") != -1)
									Ntr.setAttribute('alertType',"SMTP");
								else
								if(JsonAlerts.items[i].msg.indexOf("SUSPICIOUS") != -1)
									Ntr.setAttribute('alertType',"SUSPICIOUS");
								else
								if(JsonAlerts.items[i].msg.indexOf("MULTIPLE") != -1)
									Ntr.setAttribute('alertType',"MULTIPLESCAN");
								else
								if(JsonAlerts.items[i].msg.indexOf("SCAN") != -1)
									Ntr.setAttribute('alertType',"SCAN");
								else
								if(JsonAlerts.items[i].msg.indexOf("MANY") != -1)
									Ntr.setAttribute('alertType',"MANYRECIPIENTS");
/*
								if(JsonAlerts.items[i].msg.indexOf("SMTP") != -1)
									Ntr.setAttribute('SMTP', "true");
								else
									Ntr.setAttribute('SMTP', "false");
								if(JsonAlerts.items[i].msg.indexOf("SUSPICIOUS") != -1)
									Ntr.setAttribute('SUSPICIOUS', "true");
								else
									Ntr.setAttribute('SUSPICIOUS', "false");
*/
								Ntr.setAttribute('style', "cursor: pointer; background-color: white; ");
								Ntr.setAttribute('onmouseover', " this.style.background= '#EEFFEE' ");
								Ntr.setAttribute('onmouseout', " this.style.background= 'white';");
								Ntr.setAttribute('onclick','clickOnAlert(this); ');
								TBody.appendChild(Ntr);
								
								Ntd = document.createElement("td");
								//text = document.createTextNode(JsonAlerts.items[i].date);
								if( JsonAlerts.items[i].n == "new" ){
									if(document.cookie.indexOf(":"+JsonAlerts.items[i].id+":") != -1)
										Ntd.innerHTML = "<div style='font-weight: normal;'><img src='/images/new_alert_icon.gif'>"+JsonAlerts.items[i].date+"</img></div>";
									else
										Ntd.innerHTML = "<div style='font-weight: bold;'><img src='/images/new_alert_icon.gif'>"+JsonAlerts.items[i].date+"</img></div>";
								}else{
									Ntd.innerHTML = "<div style='font-weight: normal;'>"+JsonAlerts.items[i].date+"</div>";
								}
								Ntr.appendChild(Ntd);
								
								
								
									/*Ntd = document.createElement("td");
									text = document.createTextNode(JsonAlerts.items[i].date);
									if( JsonAlerts.items[i].id > lastAlertIndex ){
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
									
									if( JsonAlerts.items[i].id > lastAlertIndex ){
										img = document.createElement("img");
										img.setAttribute("type", "image");
										img.setAttribute("src", "images/alertIcon.gif");
										img.setAttribute("style", "display: block;");
										td.appendChild(img);
									}
									
									td = document.createElement("td")
									tr.appendChild(td);
									
									text = document.createTextNode(JsonAlerts.items[i].date);
									td.appendChild(text);
									
									Ntd.appendChild(tab);
									Ntr.appendChild(Ntd)*/
								
								///////////////////////////////////////////////////////////////////////////////////////////////////////////
									
									
								
									Ntd = document.createElement("td");
									if( JsonAlerts.items[i].n == "new"  &&  document.cookie.indexOf(":"+JsonAlerts.items[i].id+":") == -1)
										Ntd.innerHTML = "<div style='font-weight: bold;'>"+JsonAlerts.items[i].msg+"</div>";
									else
										Ntd.innerHTML = "<div style='font-weight: normal;'>"+JsonAlerts.items[i].msg+"</div>";
									Ntr.appendChild(Ntd);
									
									Ntd = document.createElement("td");
									Ntd.setAttribute("id", "loc"+i+ongletActif())
									Ntd.setAttribute("localhost", JsonAlerts.items[i].ip)
									Ntd.setAttribute("onmouseover", "setTOResolv = setTimeout('solveIpLoc('+this.id+')', 500);")
									Ntd.setAttribute("onmouseout", "clearTimeout(setTOResolv)");
									
									var namedEP = "";
									if( autoIptoName( JsonAlerts.items[i].ip ) ) namedEP = autoIptoName( JsonAlerts.items[i].ip );
									else namedEP = JsonAlerts.items[i].ip;
									
									if( JsonAlerts.items[i].n == "new"  && document.cookie.indexOf(":"+JsonAlerts.items[i].id+":") == -1)
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
						alert(e+" ::=:: "+e.lineNo)
						if(JsonAlerts.errMsg)
							alert("getAlertList.json Bug Report: "+JsonAlerts.errMsg);	
						else
							alert("rawData empty !");
						//clickOnClose(Onglet);
						ChangerOnglet("Logs");
						ChangerDiv("DivLogs");
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

		xhr.open("GET","getNetworkList.json", false);
		xhr.send(null);
		
		if (xhr.readyState == 4) 
		{
			if (xhr.status == 200) 
			{
				
				var JsonNetwork = eval("(" + xhr.responseText + ")");
				if(JsonNetwork.errMsg)
					alert("getNetworkList.json Bug Report: "+JsonNetwork.errMsg);	
				
				for( var i = 0 ; i< JsonNetwork.data.length ; i++ ){ 
					//alert(JsonNetwork.data[i].n)
					if(JsonNetwork.data[i].n && JsonNetwork.data[i].o){
						
						AjouterOnglet( JsonNetwork.data[i].n, false, false, true, "" );
						
						for( var j = 0 ; j< JsonNetwork.data[i].o.length ; j++ ){ 
							AjouterOnglet( JsonNetwork.data[i].o[j], false, false, false, JsonNetwork.data[i].n );
						}
					}else{
						AjouterOnglet( JsonNetwork.data[i], false, false, false, "" );
					}
					
				}
				
				setTabOngletHeight();
				
			}else {
				//document.getElementById('TabLogsDiv').innerHTML = "getLogs.json" + " not found";
			}
		}
		
}


function localhostsTabCompletion(Json){
	
	require(["dojo/ready", "dojox/grid/EnhancedGrid", "dojox/grid/enhanced/plugins/Pagination", "dojox/grid/enhanced/plugins/NestedSorting", "dojo/data/ItemFileWriteStore","dijit/form/Button"], function(ready, EnhancedGrid, Pagination, NestedSorting, ItemFileWriteStore, Button){
		ready(function(){
			/*
			/*set up data store	
			var data = {
				identifier: 'id',
				items: []
			};
			
			var data_list = [
				{ col1: "normal", col2: false, col3: 'But are not followed by two hexadecimal', col4: 29.91},
				{ col1: "important", col2: false, col3: 'Because a % sign always indicates', col4: 9.33},
				{ col1: "important", col2: false, col3: 'Signs can be selectively', col4: 19.34}
			];
				
			var rows = 60;
				
			for(var i=0, l=data_list.length; i<rows; i++){
				data.items.push(dojo.mixin({ id: i+1 }, data_list[i%l]));
			}
			
			var store = new dojo.data.ItemFileWriteStore({data: data});

			*/
			/*set up data store*/		
			var data = {
				identifier: 'id',
				items: []
			};
				
			for(var i=0; i<Json.items.length; i++){
				data.items.push(dojo.mixin({ id: i+1 }, Json.items[i]));
			}
			
			var store = new ItemFileWriteStore({data: data});

			
			/*set up layout*/		
			var layout = [
				{'name': 'Ip Adress', 'field': 'ip', 'width': 'auto'},
				{'name': 'Name', 'field': 'name', 'width': 'auto'},
				{ name: "Action", field: "_item", 'width': 'auto',  formatter: function(item){ 
														//alert(localhostAlreadyOpened(item.ip));
														if(localhostAlreadyOpened2(item.ip)){
															return new Button({ label: "Remove tab", onClick:function(){
																									require(["dojo/ready", "dijit/registry", "dojo/on"], function(ready, registry, on){
																										ready(function(){
																											registry.byId("Div"+item.ip).onClose();
																											registry.byId("LocalhostsTabContainer").removeChild(registry.byId("Div"+item.ip));
																											registry.byId("Div"+item.ip).destroyRecursive();
																											registry.byId("LocalhostsTabContainer").resize();
																										});
																									});
																								}
																			}); 
														}else{
															return new Button({ label: "Add tab", onClick:function(){
																											addNewIpTab(item.ip);
																											require(["dojo/ready", "dijit/registry"], function(ready, registry){
																												ready(function(){
																													registry.byId("LocalhostsTabContainer").resize();
																												});
																											});
																										}
																			}); 
														}	
													}
				}
			];

				
			/*create a new grid:*/			
			var grid = new EnhancedGrid({
				id: 'localhostsDojoTable',
				store: store,
				structure: layout,
				//rowSelector: "20px",
				//selectionMode: "multiple",
				plugins: {
					pagination: {
						nestedSorting: true,
						pageSizes: ["50", "100", "200", "All"],
						defaultSize: "50",
						description: true,
						sizeSwitch: true,
						pageStepper: true,
						gotoButton: true,
						/*page step to be displayed*/
						maxPageStep: 5,
						/*position of the pagination bar*/
						position: "bottom"
					}
				}},
			document.getElementById('localhostsTableDiv'));

				
			/*Call startup() to render the grid*/
			grid.startup();
		});
		
		/*var table = document.getElementById("localhostsTable");
		
		while (table.firstChild) table.removeChild(table.firstChild);

		Elem = document.createElement("tbody");
		table.appendChild(Elem);
		
		for( var i = 0 ; i< Json.items.length ; i++ ){ 
			
			E= document.createElement("tr");
			E.innerHTML = "<td>"+Json.items[i].name+"</td><td>"+Json.items[i].ip+"</td>"
			Elem.appendChild(E);
			
			/*E1= document.createElement("td");
			E1.innerHTML = "";
			E.appendChild(E1);		
			
			E1= document.createElement("td");
			E1.innerHTML = "";
			E.appendChild(E1);	
			
		}*/	
	
	});
}