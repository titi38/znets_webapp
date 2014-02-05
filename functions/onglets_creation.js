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
	while( document.getElementById("DivResults"+j) != null ) j++;
	
	/*if(dataAlreadyOpened()){
		if(!document.getElementById("Datas"))
			AjouterOnglet("Datas", false, true, true, "")
		TOTabs = document.getElementById("TabOnglets").getElementsByTagName("li");
		for(var i=0; i<TOTabs.length; i++){
			if(TOTabs[i].isClosable && TOTabs[i].getAttribute("id").indexOf("Results")==0){
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
		AjouterOnglet("Results"+j, true, true, false, "Datas");
	}else
		AjouterOnglet("Results"+j, true, true, false, "" );
	return "Results"+j;
	*/
	AjouterOnglet("Results"+j, true, true, false, "" );
	
	require(["dojo/ready","dijit/registry"], function(ready, registry){
		ready(function(){
			registry.byId('RawDataTabContainer').selectChild(registry.byId("DivResults"+j));
		});
	});
	
	//document.getElementById("Results"+j).onclick();
	return "Results"+j;
}

		
		
function AjouterOnglet(NouvelOnglet, estData, isClosable, estGroupe, underGroup){
	//alert("NouvelOnglet : "+NouvelOnglet+"\n estData : "+estData+"\n isClosable : "+isClosable+"\n estGroupe : "+estGroupe+"\n underGroup : "+underGroup)
	
	// Creation du nouvel onglet dojo
	
	
	require(["dijit/registry", "dojo/aspect", "dijit/layout/TabContainer", "dijit/layout/ContentPane"], function(registry, aspect, TabContainer, ContentPane){
		
			
			if(isClosable){ 	// si isClosable = true alors il s'agit soit d'un onglet data, soit d'un onglet localhost
				
				if(estData){ // s'il est un onglet data alors l'"attache" à 'RawDataTabContainer'
					
					
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
							//	if(confirm("Do you really want to Close this tab?")){
									// remove element from tabOngletsIds table
									var index = tabOngletsIds.indexOf(NouvelOnglet+"");
									if(index > -1){
										tabOngletsIds.splice(index,1);
									}
									return true;
							//	};
							}
						}, "Div"+NouvelOnglet);
						
						TabContainer.addChild(newTab);
						
						TabContainer.startup();
						
						// ajout de l'onglet dans le tableau d'onglets
						tabOngletsIds.push(NouvelOnglet+"");

					
				}else{ // sinon, c'est un onglet localhost alors l'"attache" à 'LocalhostsTabContainer'
				
					
						Elem = document.createElement("div");
						Elem.setAttribute('id', "Div"+NouvelOnglet);
						body.appendChild(Elem);
						
						creerDivGraphique(NouvelOnglet+"");
						
						var TabContainer = registry.byId('LocalhostsTabContainer');
						
						var tabName = NouvelOnglet;
						if(autoIptoName(NouvelOnglet+"") != "") tabName = autoIptoName(NouvelOnglet+"");
					
						var newTab = new ContentPane({
							title: tabName,
							id: "Div"+NouvelOnglet,
							closable: true,
							onClose: function(){
							//	if(confirm("Do you really want to Close this tab?")){
									// remove element from tabOngletsIds table
									var index = tabOngletsIds.indexOf(NouvelOnglet+"");
									if(index > -1){
										tabOngletsIds.splice(index,1);
									}
									return true;
							//	};
							}
						}, "Div"+NouvelOnglet);
						
						TabContainer.addChild(newTab);
						
						TabContainer.startup();
						
						// ajout de l'onglet dans le tableau d'onglets
						tabOngletsIds.push(NouvelOnglet+"");

					
				};
				
			}else{ 			// sinon c'est soit un onglet réseau, soit un onglet groupe de réseau
				
				if(estGroupe){ // s'il est un groupe de réseaux, alors c'est un "TabContainer" et on l'"attache" à 'NetworksTabContainer'
					
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
				
					if(!underGroup){ // s'il n'est pas dans un groupe de réseaux, alors, on l'"attache" à 'NetworksTabContainer'
					
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
						
						
					}else{		// sinon, on l'"attache" au groupe de réseaux correspondant
						
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
	
	require(["dojo/ready", "dijit/layout/BorderContainer", "dojox/layout/ExpandoPane", "dijit/layout/ContentPane"], function(ready, BorderContainer, ExpandoPane, ContentPane){
		ready(function(){
			
			document.getElementById('Div'+Onglet).innerHTML = '<li style = "display : none;" id="'+Onglet+'"></li>';
			document.getElementById(Onglet).setAttribute("isClosable", "true");
		
			
		
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
		
		
		// l'affichage de l'interval de temps affiché par les graphes
		E1 = document.createElement("div");
		E1.innerHTML = '<table cellspacing=0 cellpadding=0><tr><td style="width: 50%"><center><table><tr><td><img src="images/clock.png" title="Current selection"></td><td><i>:<font id="timeSpace'+Onglet+'" style="margin-left: 15px;"></font></i></td></tr></table></center></td><td id="timeSpaceChange'+Onglet+'" style="width: 50%"></td></tr></table>'
		
		document.getElementById('Div'+Onglet).appendChild(E1);
		
		
			
			
			
			
			/*var E4 = document.createElement("table");
			E4.setAttribute('height', "90%");
			document.getElementById('Div'+Onglet).appendChild(E4);
			
			var E5 = document.createElement("tbody");
			E4.appendChild(E5);
			
			var E6 = document.createElement("tr");
			E5.appendChild(E6);
			
			var E7 = document.createElement("td");
			E6.appendChild(E7);*/
			
			//var thisInnerHTML = innerHTMLDivGraphsLocalhosts(Onglet);
			
			var  E4 = document.createElement("div");
			
			
			document.getElementById('Div'+Onglet).appendChild(E4);	
			
			
			

			require(["dijit/layout/BorderContainer", "dijit/layout/ContentPane", "dojox/layout/ExpandoPane", "dijit/Tree", "dojo/aspect", "dojo/domReady!"], function(BorderContainer, ContentPane, ExpandoPane, Tree, aspect){
				// create a BorderContainer as the top widget in the hierarchy
				var bc = new BorderContainer({
					id : 'borderContainer'+Onglet ,
					style : "width: 100%;height:90%;  padding: 5px;"
				});

				// create a ContentPane as the left pane in the BorderContainer
				var cp1 = new ExpandoPane({
					id : 'expandoPane'+Onglet,
					splitter : "true",
					duration : "125",
					region : "left",
					title : "Graphs",
					previewOnDblClick : "true"
				});
				bc.addChild(cp1);
				
				
				// Create the Tree.
				var tree = new Tree({
					id : "thinTree"+Onglet ,
					style : "width: auto; height:99.5%; border: solid 1px #759dc0; " ,
					attachParent : "true",	
					model: graphLocalhostsModel, 
					showRoot: false, 
					openOnClick: true
				});
				
				aspect.after(tree, "onClick", function(item, node, evt){
					if(!tree.selectedNode.isExpandable){
						try{
							current_shown_graph_index[Onglet] = graphIndexFromTreePath(Onglet);
							clickTitreOpen(graphIndexFromTreePath(Onglet), Onglet);
						}catch(e){alert(":::"+e)}
					}
				});
				
				aspect.before(tree, "onClick", function(item, node, evt){
					if(!tree.selectedNode.isExpandable){
						try{
							if(current_shown_graph_index[Onglet] != null){
								clickTitreClose(current_shown_graph_index[Onglet], Onglet)
							}else{
								current_shown_graph_index[Onglet] = null;
							}
						}catch(e){alert(":::"+e)}
					}
				});
				
				aspect.before(tree, "onLoad", function(){
					tree.expandAll();
				});
				
				/*aspect.after(tree, "onLoad", function(){
					alert("don1");
					tree.set('path', [ 'graphsRoot', 'N_C', 'E_H' ] );
					try{alert(tree.selectedNode);alert(tree.selectedItem);
					tree.onClick(null, tree.selectedNode, null);
					alert("don3");
					}catch(e){alert(e);}
				});*/
				
				tree.getRowStyle = function(item){
					if(item.type && item.type == "graph_name")
						return {backgroundColor: "#E6E6E7"};
				};
				
				tree.getIconClass = function(item, opened){
					if(item) return null;
					/*if(!item || continentStore.getValue(item, "type") != "continent")
						return (!item || this.model.mayHaveChildren(item)) ? (opened ? "dijitFolderOpened" : "dijitFolderClosed") : "dijitLeaf"
					else
						return "";*/
				};
				
				cp1.addChild(tree);

				// create a ContentPane as the center pane in the BorderContainer
				var cp2 = new ContentPane({
					id : 'contentPane'+Onglet,
					region: "center"//,
					//content : '<div>'+thisInnerHTML+'</div>'
				});
				bc.addChild(cp2);

				// put the top level widget into the document, and then call startup()
				bc.placeAt(E4);
				bc.startup();
				
				
				// create ContentPane's content
				createLocalhostContentPaneSContent(Onglet);
				//innerHTMLDivGraphsLocalhosts(Onglet);
				
				
			});
		
		
		
		
		document.getElementById("dateDebApplied"+Onglet).setAttribute('value', document.getElementById("dateDeb"+Onglet).value ) ;
		document.getElementById("dateFinApplied"+Onglet).setAttribute('value', document.getElementById("dateFin"+Onglet).value ) ;
		document.getElementById("presetsApplied"+Onglet).setAttribute('value', document.getElementById("presets"+Onglet).value ) ;
		
		document.getElementById('Apply'+Onglet).onclick();

		dojo.addOnLoad(makeCalendar);

		setParameters(document.getElementById(Onglet) , $('formulaire'+Onglet).serialize());
		
		});
	});
	
}
	

	
function creerDivData(Onglet){
		//alert("creerDivData");
		document.getElementById('Div'+Onglet).innerHTML = '<li style = "display : none;" id="'+Onglet+'"></li>';
		document.getElementById(Onglet).setAttribute("isClosable", "true");
	
		E1 = document.createElement("div");
		E1.setAttribute('id',"DivGraphe6"+Onglet);
		E1.setAttribute('style', "width: 100%; height: 78%; margin-top:10px;");
		document.getElementById('Div'+Onglet).appendChild(E1);
		
		
		/*E2 = document.createElement("div");
		E2.setAttribute('id',"TabData"+Onglet);
		// inutile car nous la rendrons visible une fois que le tableau sera completé a 100%
		//E2.setAttribute('style', "width: 100%; border: 1px solid #6c6; margin: 2px; height: 98%; overflow-y: auto;");
		E1.appendChild(E2);
		
		/*E3 = document.createElement("table");
		E3.setAttribute('style', 'width: 100%; height: 93%;');
		E3.setAttribute('id',"TabData");
		E3.setAttribute('cellspacing',"0");
		E3.setAttribute('cellpadding',"0");
		E2.appendChild(E3);*/
		
/*		E2 = document.createElement("center");
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
		
		//alert("stop")*/
		
	}
	
	
	
	
function creerDivGraphiqueReseau(Onglet){
	
	require(["dojo/ready", "dijit/layout/BorderContainer", "dojox/layout/ExpandoPane", "dijit/layout/ContentPane"], function(ready, BorderContainer, ExpandoPane, ContentPane){
		ready(function(){
			
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
			
			
			// l'affichage de l'interval de temps affiché par les graphes
			E1 = document.createElement("div");
			E1.innerHTML ='<table cellspacing=0 cellpadding=0><tr><td style="width: 50%"><center><table><tr><td><img src="images/clock.png" title="Current selection"></td><td><i>:<font id="timeSpace'+Onglet+'" style="margin-left: 15px;"></font></i></td></tr></table></center></td><td id="timeSpaceChange'+Onglet+'" style="width: 50%"></td></tr></table>'
			
			document.getElementById('Div'+Onglet).appendChild(E1);
			
			
			
			/*var E4 = document.createElement("table");
			E4.setAttribute('height', "90%");
			document.getElementById('Div'+Onglet).appendChild(E4);
			
			var E5 = document.createElement("tbody");
			E4.appendChild(E5);
			
			var E6 = document.createElement("tr");
			E5.appendChild(E6);
			
			var E7 = document.createElement("td");
			E6.appendChild(E7);*/
			
			//var thisInnerHTML = innerHTMLDivGraphsNetworks(Onglet);
			
					var  E4 = document.createElement("div");
					/*E4.innerHTML = '<div id="borderContainer'+Onglet+'" >\
									<div id="expandoPane'+Onglet+'" >\
										<div style="width: 100%; height:100%">	\
											<div id="thinTree'+Onglet+'" style="width: auto; height:99.5%; border: solid 1px #759dc0; " attachParent="true" \
													 data-dojo-type="dijit/Tree" aria-label="my thin tree'+Onglet+'"  data-dojo-props="model:continentModel, showRoot:false, openOnClick:true,">\
													<script type="dojo/aspect" data-dojo-advice="after" data-dojo-method="_adjustWidths">\
														//alert(this.id + ": adjusted widths of nodes");\
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
											</div>\
										</div>	\
									</div>\
									<div id="contentPane'+Onglet+'">\
										<div>'+thisInnerHTML+'</div>\
									</div>\
								</div>  '  ;*/
						
					document.getElementById('Div'+Onglet).appendChild(E4);	
						
						
			
			
			/*require(["dojox/layout/ExpandoPane", "dijit/layout/ContentPane", "dijit/layout/BorderContainer", "dijit/Tree", "dojo/store/Memory", "dijit/tree/ObjectStoreModel", "dojo/domReady!"], function(ExpandoPane, ContentPane, BorderContainer, Tree, Memory, ObjectStoreModel){
				
				try{
						
					var BC = new BorderContainer({
						id : 'borderContainer'+Onglet ,
						style : "width: 100%;height:90%;  padding: 5px;"});
						
					var CP = new ContentPane({
						id : 'contentPane'+Onglet,
						content : '<div>'+thisInnerHTML+'</div>',
						splitter : "true"});
						
					var EP = new ExpandoPane({
						id : 'expandoPane'+Onglet,
						splitter : "true",
						duration : "125",
						region : "left",
						title : "Graphs",
						previewOnDblClick : "true"});
						

						// Create the Tree.
					var tree = new Tree({
						id : "thinTree"+Onglet ,
						style : "width: auto; height:99.5%; border: solid 1px #759dc0; " ,
						attachParent : "true",	
						model:continentModel, 
						showRoot:false, 
						openOnClick:true
					});
					
					
					
					
					
					EP.addChild(tree);
					BC.addChild(EP);
					BC.addChild(CP);
					BC.placeAt(E4);
					
					tree.startup();
					EP.startup();
					CP.startup();
					BC.startup();
						
						
						
				}catch(e){alert('=====>'+e)};
				
			});	*/	





			require(["dijit/layout/BorderContainer", "dijit/layout/ContentPane", "dojox/layout/ExpandoPane", "dijit/Tree", "dojo/aspect", "dojo/domReady!"], function(BorderContainer, ContentPane, ExpandoPane, Tree, aspect){
				// create a BorderContainer as the top widget in the hierarchy
				var bc = new BorderContainer({
					id : 'borderContainer'+Onglet ,
					style : "width: 100%;height:90%;  padding: 5px;"
				});

				// create a ContentPane as the left pane in the BorderContainer
				var cp1 = new ExpandoPane({
					id : 'expandoPane'+Onglet,
					splitter : "true",
					duration : "125",
					region : "left",
					title : "Graphs",
					previewOnDblClick : "true"
				});
				bc.addChild(cp1);
				
				
				// Create the Tree.
				var tree = new Tree({
					id : "thinTree"+Onglet ,
					style : "width: auto; height:99.5%; border: solid 1px #759dc0; " ,
					attachParent : "true",	
					model: graphNetworksModel, 
					showRoot: false, 
					openOnClick: true
				});
				
				
				aspect.after(tree, "onClick", function(item){
					if(!tree.selectedNode.isExpandable){
						try{
							current_shown_graph_index[Onglet] = graphIndexFromTreePath(Onglet);
							clickTitreOpen(graphIndexFromTreePath(Onglet), Onglet);
						}catch(e){alert(":::"+e)}
					}
				});
				
				aspect.before(tree, "onClick", function(item){
					if(!tree.selectedNode.isExpandable){
						try{
							if(current_shown_graph_index[Onglet] != null){
								clickTitreClose(current_shown_graph_index[Onglet], Onglet)
							}else{
								current_shown_graph_index[Onglet] = null;
							}
						}catch(e){alert(":::"+e)}
					}
				});
				
				aspect.before(tree, "onLoad", function(){
					tree.expandAll();
				});
				
				/*aspect.after(tree, "onLoad", function(){
					alert("afterload");
					tree.set("selectedNode", getTreeFirstLeaf(tree));
				});*/
				
				tree.getRowStyle = function(item){
					if(item.type && item.type == "graph_name")
						return {backgroundColor: "#E6E6E7"};
				};
				
				tree.getIconClass = function(item, opened){
					if(item) return null;
					/*if(!item || continentStore.getValue(item, "type") != "continent")
						return (!item || this.model.mayHaveChildren(item)) ? (opened ? "dijitFolderOpened" : "dijitFolderClosed") : "dijitLeaf"
					else
						return "";*/
				};

				
				
				
				cp1.addChild(tree);

				// create a ContentPane as the center pane in the BorderContainer
				var cp2 = new ContentPane({
					id : 'contentPane'+Onglet,
					region: "center"
				});
				bc.addChild(cp2);

				// put the top level widget into the document, and then call startup()
				bc.placeAt(E4);
				bc.startup();
				
				
				// create ContentPane's content
				createNetworkContentPaneSContent(Onglet);
				//innerHTMLDivGraphsLocalhosts(Onglet);
			});
			
			
			
			
			document.getElementById("dateDebApplied"+Onglet).setAttribute('value', document.getElementById("dateDeb"+Onglet).value ) ;
			document.getElementById("dateFinApplied"+Onglet).setAttribute('value', document.getElementById("dateFin"+Onglet).value ) ;
			document.getElementById("presetsApplied"+Onglet).setAttribute('value', document.getElementById("presets"+Onglet).value ) ;
			
			document.getElementById('Apply'+Onglet).disabled = true;

			dojo.addOnLoad(makeCalendar);

			setParameters(document.getElementById(Onglet) , $('formulaire'+Onglet).serialize());
			
		});
	});
}


function myGetIconClassFunction(item, opened)
{
	/*if(item.type == ){
		//return "diagramIcon";
	}else{
		if (item.children){
			//return "diagramIcon";
		}else {
			//return "diagramIcon";
		}
	}*/
}

//var innerHTMLDivGraphsLocalhosts = function(Onglet){
function createLocalhostContentPaneSContent(Onglet){
	
	require(["dojo/ready", "dijit/registry", "dijit/layout/BorderContainer", "dojox/layout/ExpandoPane", "dijit/layout/ContentPane", "dijit/form/VerticalSlider", "dojo/domReady!"], function(ready, registry, BorderContainer, ExpandoPane, ContentPane, VerticalSlider){
		ready(function(){	
			
			/*
				////////////////////////////////////////////////////////////////////////////////////////////////////////////////
				// create a BorderContainer as the top widget in the hierarchy
				////////////////////////////////////////////////////////////////////////////////////////////////////////////////
				bc = new BorderContainer({
					style : "width: 100%;height:99%;  padding: 5px;"
				});

				// create a ContentPane as the left pane in the BorderContainer
				////////////////////////////////////////////////////////////////////////////////////////////////////////////////
				cp1 = new ExpandoPane({
					splitter : "true",
					duration : "125",
					region : "right",
					title : "Legend",
					previewOnDblClick : "true"
				});
				bc.addChild(cp1);
				
				
				// create a ContentPane as the center pane in the BorderContainer
				////////////////////////////////////////////////////////////////////////////////////////////////////////////////
				cp2 = new ContentPane({
					region: "center"//,
					//content : '<div>'+thisInnerHTML+'</div>'
				});
				bc.addChild(cp2);

				// put the top level widget into the document, and then call startup()
				////////////////////////////////////////////////////////////////////////////////////////////////////////////////
				bc.placeAt(E4);
				bc.startup();
			*/	
					
				var globalDiv = document.createElement("div");
				
				/*
				1ere fenetre (Graphe1)
				*/
			
				var E = document.createElement("div");
				E.setAttribute('id',"DivGraphe1"+Onglet);
				//E.setAttribute('openedHeight', 0);
				E.setAttribute('style', "position: relative; display: none; overflow : auto; width: 100%; height: 100%;");
				globalDiv.appendChild(E);
	
	
				////////////////////////////////////////////////////////////////////////////////////////////////////////////////
				// create a BorderContainer as the top widget in the hierarchy
				////////////////////////////////////////////////////////////////////////////////////////////////////////////////
				var bc = new BorderContainer({
					style : "width: 100%;height:99%;  padding: 5px;"
				});
				
				var EE = document.createElement("div");
				
				E2 = document.createElement("div");
				E2.setAttribute('id',"legend1"+Onglet);
				E2.setAttribute('style', "height:99.5%; border: solid 1px #759dc0; overflow-y : auto;");
				EE.appendChild(E2);
				
				E1 = document.createElement("table");
				E1.setAttribute('id',"legend1Tab"+Onglet);
				E1.setAttribute('style',"margin-right: 30px;");
				E2.appendChild(E1);

				
				// create a ContentPane as the left pane in the BorderContainer
				////////////////////////////////////////////////////////////////////////////////////////////////////////////////
				var cp1 = new ExpandoPane({
					splitter : "true",
					duration : "125",
					region : "right",
					title : "Legend",
					previewOnDblClick : "true",
					content : EE.innerHTML
				});
				bc.addChild(cp1);
				
	
				
				EE = document.createElement("div");
				
				E1 = document.createElement("button");
				E1.setAttribute('id', "Button1"+Onglet);
				E1.setAttribute('onclick', "showAccurate(this, 1, '"+Onglet+"')");
				E1.innerHTML = "Show Accurate Chart";
				EE.appendChild(E1);

				
				E1 = document.createElement("div");
				E1.setAttribute('id',"DivChart1"+Onglet);
				E1.setAttribute('style', "display: block;");
				EE.appendChild(E1);
				
			
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
				//E2.setAttribute('style', "width: 800px; height: 300px; float:left; margin-left:1px;");
				E1.appendChild(E2);
					
					
				E1 = document.createElement("div");
				E1.setAttribute('id',"DivChart1"+Onglet+"Accurate");
				E1.setAttribute('style', "display: none;");
				EE.appendChild(E1);
					
					
				E2 = document.createElement("div");
				E2.setAttribute('id',"chart1"+Onglet+"Accurate");
				//E2.setAttribute('style', "width: 800px; height: 500px; float:left; margin-left:1px;");
				E1.appendChild(E2);
	
				// create a ContentPane as the center pane in the BorderContainer
				////////////////////////////////////////////////////////////////////////////////////////////////////////////////
				var cp2 = new ContentPane({
					region: "center",
					content : '<div>'+EE.innerHTML+'</div>'
				});
				bc.addChild(cp2);
				
				
				// put the top level widget into the document, and then call startup()
				////////////////////////////////////////////////////////////////////////////////////////////////////////////////
				bc.placeAt(E);
				bc.startup();
				
				
				/*
				2ere fenetre (Graphe2)
				*/
				
				
				
				E = document.createElement("div");
				E.setAttribute('id',"DivGraphe2"+Onglet);
				//E.setAttribute('openedHeight', 0);
				E.setAttribute('style', "position: relative; display: none; overflow : auto; width: 100%; height: 100%;");
				globalDiv.appendChild(E);
				
				////////////////////////////////////////////////////////////////////////////////////////////////////////////////
				// create a BorderContainer as the top widget in the hierarchy
				////////////////////////////////////////////////////////////////////////////////////////////////////////////////
				bc = new BorderContainer({
					style : "width: 100%;height:99%;  padding: 5px;"
				});
	
				
				EE = document.createElement("div");
				
				E2 = document.createElement("div");
				E2.setAttribute('id',"legend2"+Onglet);
				E2.setAttribute('style', "height:99.5%; border: solid 1px #759dc0; overflow-y : auto;");
				EE.appendChild(E2);
				
				E1 = document.createElement("table");
				E1.setAttribute('id',"legend2Tab"+Onglet);
				E1.setAttribute('style',"margin-right: 30px;");
				E2.appendChild(E1);

				
				// create a ContentPane as the left pane in the BorderContainer
				////////////////////////////////////////////////////////////////////////////////////////////////////////////////
				cp1 = new ExpandoPane({
					splitter : "true",
					duration : "125",
					region : "right",
					title : "Legend",
					previewOnDblClick : "true",
					content : EE.innerHTML
				});
				bc.addChild(cp1);
				
	
				
				EE = document.createElement("div");
				
				//alert("hi");
				
				E1 = document.createElement("button");
				E1.setAttribute('id', "Button2"+Onglet);
				E1.setAttribute('onclick', "showAccurate(this, 2, '"+Onglet+"')");
				E1.innerHTML = "Show Accurate Chart";
				EE.appendChild(E1);

				
				E1 = document.createElement("div");
				E1.setAttribute('id',"DivChart2"+Onglet);
				E1.setAttribute('style', "display: block;");
				EE.appendChild(E1);
				
				/*E2 = document.createElement("div");
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
				E2.appendChild(E3);*/
				
				E2 = document.createElement("table");
				E2.setAttribute('style',"width: 100%; height: 100%;");
				E2.setAttribute('cellspacing',"0");
				E2.setAttribute('cellpadding',"0");
				E1.appendChild(E2);
				
				E1 = document.createElement("tbody");
				E2.appendChild(E1);
				
				var ETR = document.createElement("tr");
				E1.appendChild(ETR);
				
				var ETD = document.createElement("td");
				ETD.setAttribute('width',"90%");
				ETR.appendChild(ETD);
				
				
				E2 = document.createElement("div");
				E2.setAttribute('id',"chart2"+Onglet);
				E2.setAttribute('style', "width: 95%; height: 99%; float:left; margin-left:1px;");
				ETD.appendChild(E2);
				
				
				ETD = document.createElement("td");
				ETD.setAttribute('style',"border: solid 1px #759dc0;");
				ETR.appendChild(ETD);
				
				
				
				E2 = document.createElement("table");
				E2.setAttribute('style',"width: 100%; height: 100%;");
				ETD.appendChild(E2);
				
				E1 = document.createElement("tbody");
				E2.appendChild(E1);
				
				ETR = document.createElement("tr");
				ETR.setAttribute('height',"30px");
				E1.appendChild(ETR);
				
				ETD = document.createElement("td");
				ETD.setAttribute('align',"center");
				ETD.innerHTML = "<font><i><u>Zoom</u></i></font>"
				ETR.appendChild(ETD);
				
				
				ETD = document.createElement("td");
				ETD.setAttribute('align',"center");
				ETR.appendChild(ETD);
				
				
				
				E2 = document.createElement("div");
				E2.setAttribute('id',"zoomProto"+Onglet);
				ETD.appendChild(E2);
				
					try{
						dojo.require("dijit.form.VerticalSlider");
						dojo.ready(function(){
							var vertical = dojo.byId("zoomProto"+Onglet);
							var slider = new VerticalSlider({
								//Class: "zoomAxisSlider",
								intermediateChanges: true,
								style: "height: 100%;",
								name: "zoomProto"+Onglet,
								onChange: function(evt){
									chargeZoomVar(Chart12[Onglet], 2 , JsonObj12[Onglet]);
									zoomYAxis("zoomProto"+Onglet);
								}
							}, vertical);
						});
					}catch(e){alert(e);}
					
					
				E1 = document.createElement("div");
				E1.setAttribute('id',"DivChart2"+Onglet+"Accurate");
				E1.setAttribute('style', "display: none;");
				EE.appendChild(E1);
					
					
				E2 = document.createElement("div");
				E2.setAttribute('id',"chart2"+Onglet+"Accurate");
				E2.setAttribute('style', "width: 800px; height: 500px; float:left; margin-left:1px;");
				E1.appendChild(E2);
				
				
				
				
				
				// create a ContentPane as the center pane in the BorderContainer
				////////////////////////////////////////////////////////////////////////////////////////////////////////////////
				cp2 = new ContentPane({
					region: "center",
					content : '<div>'+EE.innerHTML+'</div>'
				});
				bc.addChild(cp2);
				

				
				// put the top level widget into the document, and then call startup()
				////////////////////////////////////////////////////////////////////////////////////////////////////////////////
				bc.placeAt(E);
				bc.startup();
				
				
				
				
				/*
				3ere fenetre (Graphe3)
				*/
				
				
				
				E = document.createElement("div");
				E.setAttribute('id',"DivGraphe3"+Onglet);
				//E.setAttribute('openedHeight', 0);
				E.setAttribute('style', "position: relative; display: none; overflow : auto; width: 100%; height: 100%;");
				globalDiv.appendChild(E);
				
				////////////////////////////////////////////////////////////////////////////////////////////////////////////////
				// create a BorderContainer as the top widget in the hierarchy
				////////////////////////////////////////////////////////////////////////////////////////////////////////////////
				bc = new BorderContainer({
					style : "width: 100%;height:99%;  padding: 5px;"
				});
	
				
				EE = document.createElement("div");
				
				E2 = document.createElement("div");
				E2.setAttribute('id',"legend3"+Onglet);
				E2.setAttribute('style', "height:99.5%; border: solid 1px #759dc0; overflow-y : auto;");
				EE.appendChild(E2);
				
				E1 = document.createElement("table");
				E1.setAttribute('id',"legend3Tab"+Onglet);
				E1.setAttribute('style',"margin-right: 30px;");
				E2.appendChild(E1);

				
				// create a ContentPane as the left pane in the BorderContainer
				////////////////////////////////////////////////////////////////////////////////////////////////////////////////
				cp1 = new ExpandoPane({
					splitter : "true",
					duration : "125",
					region : "right",
					title : "Legend",
					previewOnDblClick : "true",
					content : EE.innerHTML
				});
				bc.addChild(cp1);
				
	
				
				EE = document.createElement("div");
				
				
				
				
				E1 = document.createElement("div");
				EE.appendChild(E1);
				
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
								style: "height:450px; margin-left:5px; margin-right:50px;  float: left;",
								name: "zoomLoc"+Onglet,
								onChange: function(evt){
									chargeZoomVar(Chart13[Onglet], 3,  JsonObj13[Onglet]);
									zoomYAxis("zoomLoc"+Onglet);
								}
							}, vertical);
						});
					}catch(e){}
				
				
				
				
				
				
				// create a ContentPane as the center pane in the BorderContainer
				////////////////////////////////////////////////////////////////////////////////////////////////////////////////
				cp2 = new ContentPane({
					region: "center",
					content : '<div>'+EE.innerHTML+'</div>'
				});
				bc.addChild(cp2);
				
				
				// put the top level widget into the document, and then call startup()
				////////////////////////////////////////////////////////////////////////////////////////////////////////////////
				bc.placeAt(E);
				bc.startup();
				
						
				
				
				/*
				4ere fenetre (Graphe4)
				*/
				
				
				
				E = document.createElement("div");
				E.setAttribute('id',"DivGraphe4"+Onglet);
				//E.setAttribute('openedHeight', 0);
				E.setAttribute('style', "position: relative; display: none; overflow : auto; width: 100%; height: 100%;");
				globalDiv.appendChild(E);
				
				////////////////////////////////////////////////////////////////////////////////////////////////////////////////
				// create a BorderContainer as the top widget in the hierarchy
				////////////////////////////////////////////////////////////////////////////////////////////////////////////////
				bc = new BorderContainer({
					style : "width: 100%;height:99%;  padding: 5px;"
				});
	
				
				EE = document.createElement("div");
				
				E2 = document.createElement("div");
				E2.setAttribute('id',"legend4"+Onglet);
				E2.setAttribute('style', "height:99.5%; border: solid 1px #759dc0; overflow-y : auto;");
				EE.appendChild(E2);
				
				E1 = document.createElement("table");
				E1.setAttribute('id',"legend4Tab"+Onglet);
				E1.setAttribute('style',"margin-right: 30px;");
				E2.appendChild(E1);

				
				// create a ContentPane as the left pane in the BorderContainer
				////////////////////////////////////////////////////////////////////////////////////////////////////////////////
				cp1 = new ExpandoPane({
					splitter : "true",
					duration : "125",
					region : "right",
					title : "Legend",
					previewOnDblClick : "true",
					content : EE.innerHTML
				});
				bc.addChild(cp1);
				
	
				
				EE = document.createElement("div");
				
				
				
				
				E1 = document.createElement("div");
				EE.appendChild(E1);
				
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
								style: "height:450px; margin-left:5px; margin-right:50px;  float: left;",
								name: "zoomExt"+Onglet,
								onChange: function(evt){
									chargeZoomVar(Chart14[Onglet], 4,  JsonObj14[Onglet] );
									zoomYAxis("zoomExt"+Onglet);
								}
							}, vertical);
						});
					}catch(e){}
				
				
				
				
				
				// create a ContentPane as the center pane in the BorderContainer
				////////////////////////////////////////////////////////////////////////////////////////////////////////////////
				cp2 = new ContentPane({
					region: "center",
					content : '<div>'+EE.innerHTML+'</div>'
				});
				bc.addChild(cp2);
				
				
				// put the top level widget into the document, and then call startup()
				////////////////////////////////////////////////////////////////////////////////////////////////////////////////
				bc.placeAt(E);
				bc.startup();
				
	
	
				registry.byId('contentPane'+Onglet).set("content", globalDiv);			
			
		});
	});
}
	
	




//var innerHTMLDivGraphsNetworks = function(Onglet){
function createNetworkContentPaneSContent(Onglet){
	
	require(["dojo/ready", "dijit/registry", "dijit/layout/BorderContainer", "dojox/layout/ExpandoPane", "dijit/layout/ContentPane", "dojo/domReady!"], function(ready, registry, BorderContainer, ExpandoPane, ContentPane){
		ready(function(){	
			
			/*
				////////////////////////////////////////////////////////////////////////////////////////////////////////////////
				// create a BorderContainer as the top widget in the hierarchy
				////////////////////////////////////////////////////////////////////////////////////////////////////////////////
				bc = new BorderContainer({
					style : "width: 100%;height:99%;  padding: 5px;"
				});

				// create a ContentPane as the left pane in the BorderContainer
				////////////////////////////////////////////////////////////////////////////////////////////////////////////////
				cp1 = new ExpandoPane({
					splitter : "true",
					duration : "125",
					region : "right",
					title : "Legend",
					previewOnDblClick : "true"
				});
				bc.addChild(cp1);
				
				
				// create a ContentPane as the center pane in the BorderContainer
				////////////////////////////////////////////////////////////////////////////////////////////////////////////////
				cp2 = new ContentPane({
					region: "center"//,
					//content : '<div>'+thisInnerHTML+'</div>'
				});
				bc.addChild(cp2);

				// put the top level widget into the document, and then call startup()
				////////////////////////////////////////////////////////////////////////////////////////////////////////////////
				bc.placeAt(E4);
				bc.startup();
			*/	
					
				var globalDiv = document.createElement("div");
			
		
				//1ere fenetre (Graphe1)
				
				var E = document.createElement("div");
				E.setAttribute('id',"DivGraphe1"+Onglet);
				//E.setAttribute('openedHeight', 0);
				E.setAttribute('style', "position: relative; display: none; overflow : auto; width: 100%; height: 100%;");
				globalDiv.appendChild(E);
				
				
				////////////////////////////////////////////////////////////////////////////////////////////////////////////////
				// create a BorderContainer as the top widget in the hierarchy
				////////////////////////////////////////////////////////////////////////////////////////////////////////////////
				bc = new BorderContainer({
					style : "width: 100%;height:99%;  padding: 5px;"
				});
	
				
				EE = document.createElement("div");
				
				E2 = document.createElement("div");
				E2.setAttribute('id',"legend1"+Onglet);
				E2.setAttribute('style', "height:99.5%; border: solid 1px #759dc0; overflow-y : auto;");
				EE.appendChild(E2);
				
				E1 = document.createElement("table");
				E1.setAttribute('id',"legend1Tab"+Onglet);
				E1.setAttribute('style',"margin-right: 30px;");
				E2.appendChild(E1);

				// create a ContentPane as the left pane in the BorderContainer
				////////////////////////////////////////////////////////////////////////////////////////////////////////////////
				cp1 = new ExpandoPane({
					splitter : "true",
					duration : "125",
					region : "right",
					title : "Legend",
					previewOnDblClick : "true",
					content : EE.innerHTML
				});
				bc.addChild(cp1);
	
				
				EE = document.createElement("div");
				
				E1 = document.createElement("button");
				E1.setAttribute('id',"Button1"+Onglet);
				E1.innerHTML = "Show Accurate Chart";
				E1.setAttribute('onclick', "showAccurate(this, 1, '"+Onglet+"')");
				EE.appendChild(E1);
				
				
		
				var E1 = document.createElement("div");
				E1.setAttribute('id',"DivChart1"+Onglet);
				E1.setAttribute('style', "display: block;");
				EE.appendChild(E1);
				
				var E2 = document.createElement("div");
				E2.setAttribute('style', "position : absolute; ");
				E1.appendChild(E2);
				
				 var E3 =  document.createElement("font");
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
								style: "height:450px; margin-left:5px; margin-right:50px;  float: left;",
								name: "zoomTraffic"+Onglet,
								onChange: function(evt){
									chargeZoomVar(Chart1[Onglet], 1,  JsonObj1[Onglet] );
									zoomYAxis("zoomTraffic"+Onglet);
								}
							}, vertical);
						});
					}catch(e){alert(e);}
				
				
				E1 = document.createElement("div");
				E1.setAttribute('id',"DivChart1"+Onglet+"Accurate");
				E1.setAttribute('style', "display: none;");
				EE.appendChild(E1);
				
				
				E2 = document.createElement("div");
				E2.setAttribute('id',"chart1"+Onglet+"Accurate");
				E2.setAttribute('style', "width: 800px; height: 500px; float:left; margin-left:1px;");
				E1.appendChild(E2);
				
				
				// create a ContentPane as the center pane in the BorderContainer
				////////////////////////////////////////////////////////////////////////////////////////////////////////////////
				cp2 = new ContentPane({
					region: "center",
					content : '<div>'+EE.innerHTML+'</div>'
				});
				bc.addChild(cp2);

				// put the top level widget into the document, and then call startup()
				////////////////////////////////////////////////////////////////////////////////////////////////////////////////
				bc.placeAt(E);
				bc.startup();
				
				
				//2ere fenetre (Graphe2)
		
				
				E = document.createElement("div");
				E.setAttribute('id',"DivGraphe2"+Onglet);
				//E.setAttribute('openedHeight', 0);
				E.setAttribute('style', "position: relative; display: none; overflow : auto; width: 100%; height: 100%;");
				globalDiv.appendChild(E);
				
				
				////////////////////////////////////////////////////////////////////////////////////////////////////////////////
				// create a BorderContainer as the top widget in the hierarchy
				////////////////////////////////////////////////////////////////////////////////////////////////////////////////
				bc = new BorderContainer({
					style : "width: 100%;height:99%;  padding: 5px;"
				});
	
				
				EE = document.createElement("div");
				
				E2 = document.createElement("div");
				E2.setAttribute('id',"legend2"+Onglet);
				E2.setAttribute('style', "height:99.5%; border: solid 1px #759dc0; overflow-y : auto;");
				EE.appendChild(E2);
				
				E1 = document.createElement("table");
				E1.setAttribute('id',"legend2Tab"+Onglet);
				E1.setAttribute('style',"margin-right: 30px;");
				E2.appendChild(E1);

				// create a ContentPane as the left pane in the BorderContainer
				////////////////////////////////////////////////////////////////////////////////////////////////////////////////
				cp1 = new ExpandoPane({
					splitter : "true",
					duration : "125",
					region : "right",
					title : "Legend",
					previewOnDblClick : "true",
					content : EE.innerHTML
				});
				bc.addChild(cp1);
	
				
				EE = document.createElement("div");
				
				E1 = document.createElement("button");
				E1.setAttribute('id',"Button2"+Onglet);
				E1.innerHTML = "Show Accurate Chart";
				E1.setAttribute('onclick', "showAccurate(this, 2, '"+Onglet+"')");
				EE.appendChild(E1);
				
				E1 = document.createElement("div");
				E1.setAttribute('id',"DivChart2"+Onglet);
				E1.setAttribute('style', "display: block;");
				EE.appendChild(E1);
				
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
								style: "height:450px; margin-left:5px; margin-right:50px;  float: left;",
								name: "zoomPackets"+Onglet,
								onChange: function(evt){
									chargeZoomVar(Chart2[Onglet], 2,  JsonObj2[Onglet]);
									zoomYAxis("zoomPackets"+Onglet);
								}
							}, vertical);
						});
					}catch(e){alert(e);}
				
				
				E1 = document.createElement("div");
				E1.setAttribute('id',"DivChart2"+Onglet+"Accurate");
				E1.setAttribute('style', "display: none;");
				EE.appendChild(E1);
				
				
				E2 = document.createElement("div");
				E2.setAttribute('id',"chart2"+Onglet+"Accurate");
				E2.setAttribute('style', "width: 800px; height: 500px; float:left; margin-left:1px;");
				E1.appendChild(E2);
				
				
				// create a ContentPane as the center pane in the BorderContainer
				////////////////////////////////////////////////////////////////////////////////////////////////////////////////
				cp2 = new ContentPane({
					region: "center",
					content : '<div>'+EE.innerHTML+'</div>'
				});
				bc.addChild(cp2);

				// put the top level widget into the document, and then call startup()
				////////////////////////////////////////////////////////////////////////////////////////////////////////////////
				bc.placeAt(E);
				bc.startup();
				
				
				
				
				//3ere fenetre (Graphe3)
				
				
				
				E = document.createElement("div");
				E.setAttribute('id',"DivGraphe3"+Onglet);
				//E.setAttribute('openedHeight', 0);
				E.setAttribute('style', "position: relative; display: none; overflow : auto; width: 100%; height: 100%;");
				globalDiv.appendChild(E);
				
				
				////////////////////////////////////////////////////////////////////////////////////////////////////////////////
				// create a BorderContainer as the top widget in the hierarchy
				////////////////////////////////////////////////////////////////////////////////////////////////////////////////
				bc = new BorderContainer({
					style : "width: 100%;height:99%;  padding: 5px;"
				});
	
				
				EE = document.createElement("div");
				
				E2 = document.createElement("div");
				E2.setAttribute('id',"legend3"+Onglet);
				E2.setAttribute('style', "height:99.5%; border: solid 1px #759dc0; overflow-y : auto;");
				EE.appendChild(E2);
				
				E1 = document.createElement("table");
				E1.setAttribute('id',"legend3Tab"+Onglet);
				E1.setAttribute('style',"margin-right: 30px;");
				E2.appendChild(E1);

				// create a ContentPane as the left pane in the BorderContainer
				////////////////////////////////////////////////////////////////////////////////////////////////////////////////
				cp1 = new ExpandoPane({
					splitter : "true",
					duration : "125",
					region : "right",
					title : "Legend",
					previewOnDblClick : "true",
					content : EE.innerHTML
				});
				bc.addChild(cp1);
	
				
				EE = document.createElement("div");
				
				E1 = document.createElement("div");
				EE.appendChild(E1);
				
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
								style: "height:450px; margin-left:5px; margin-right:50px;  float: left;",
								name: "zoomLoc"+Onglet,
								onChange: function(evt){
									chargeZoomVar(Chart3[Onglet], 3,  JsonObj3[Onglet] );
									zoomYAxis("zoomLoc"+Onglet);
								}
							}, vertical);
						});
					}catch(e){alert(e);}
				
				
				// create a ContentPane as the center pane in the BorderContainer
				////////////////////////////////////////////////////////////////////////////////////////////////////////////////
				cp2 = new ContentPane({
					region: "center",
					content : '<div>'+EE.innerHTML+'</div>'
				});
				bc.addChild(cp2);

				// put the top level widget into the document, and then call startup()
				////////////////////////////////////////////////////////////////////////////////////////////////////////////////
				bc.placeAt(E);
				bc.startup();
				
				
				
				
				
				//4ere fenetre (Graphe4)
				
				
				
				E = document.createElement("div");
				E.setAttribute('id',"DivGraphe4"+Onglet);
				//E.setAttribute('openedHeight', 0);
				E.setAttribute('style', "position: relative; display: none; overflow : auto; width: 100%; height: 100%;");
				globalDiv.appendChild(E);
				
				
				////////////////////////////////////////////////////////////////////////////////////////////////////////////////
				// create a BorderContainer as the top widget in the hierarchy
				////////////////////////////////////////////////////////////////////////////////////////////////////////////////
				bc = new BorderContainer({
					style : "width: 100%;height:99%;  padding: 5px;"
				});
	
				
				EE = document.createElement("div");
				
				E2 = document.createElement("div");
				E2.setAttribute('id',"legend4"+Onglet);
				E2.setAttribute('style', "height:99.5%; border: solid 1px #759dc0; overflow-y : auto;");
				EE.appendChild(E2);
				
				E1 = document.createElement("table");
				E1.setAttribute('id',"legend4Tab"+Onglet);
				E1.setAttribute('style',"margin-right: 30px;");
				E2.appendChild(E1);

				// create a ContentPane as the left pane in the BorderContainer
				////////////////////////////////////////////////////////////////////////////////////////////////////////////////
				cp1 = new ExpandoPane({
					splitter : "true",
					duration : "125",
					region : "right",
					title : "Legend",
					previewOnDblClick : "true",
					content : EE.innerHTML
				});
				bc.addChild(cp1);
	
				
				EE = document.createElement("div");
				
				E1 = document.createElement("div");
				EE.appendChild(E1);
				
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
								style: "height:450px; margin-left:5px; margin-right:50px;  float: left;",
								name: "zoomExt"+Onglet,
								onChange: function(evt){
									chargeZoomVar(Chart4[Onglet], 4,  JsonObj4[Onglet] );
									zoomYAxis("zoomExt"+Onglet);
								}
							}, vertical);
						});
					}catch(e){alert(e);}
				
				
				// create a ContentPane as the center pane in the BorderContainer
				////////////////////////////////////////////////////////////////////////////////////////////////////////////////
				cp2 = new ContentPane({
					region: "center",
					content : '<div>'+EE.innerHTML+'</div>'
				});
				bc.addChild(cp2);

				// put the top level widget into the document, and then call startup()
				////////////////////////////////////////////////////////////////////////////////////////////////////////////////
				bc.placeAt(E);
				bc.startup();
				
				

				
				
				//5ere fenetre 
				
				
				
				E = document.createElement("div");
				E.setAttribute('id',"DivGraphe5"+Onglet);
				//E.setAttribute('openedHeight', 0);
				E.setAttribute('style', "position: relative; display: none; overflow : auto; width: 100%; height: 100%;");
				globalDiv.appendChild(E);
				
				
				////////////////////////////////////////////////////////////////////////////////////////////////////////////////
				// create a BorderContainer as the top widget in the hierarchy
				////////////////////////////////////////////////////////////////////////////////////////////////////////////////
				bc = new BorderContainer({
					style : "width: 100%;height:99%;  padding: 5px;"
				});
	
				
				EE = document.createElement("div");
				
				E2 = document.createElement("div");
				E2.setAttribute('id',"legend5"+Onglet);
				E2.setAttribute('style', "height:99.5%; border: solid 1px #759dc0; overflow-y : auto;");
				EE.appendChild(E2);
				
				E1 = document.createElement("table");
				E1.setAttribute('id',"legend5Tab"+Onglet);
				E1.setAttribute('style',"margin-right: 30px;");
				E2.appendChild(E1);

				// create a ContentPane as the left pane in the BorderContainer
				////////////////////////////////////////////////////////////////////////////////////////////////////////////////
				cp1 = new ExpandoPane({
					splitter : "true",
					duration : "125",
					region : "right",
					title : "Legend",
					previewOnDblClick : "true",
					content : EE.innerHTML
				});
				bc.addChild(cp1);
	
				
				EE = document.createElement("div");
				
				E1 = document.createElement("div");
				EE.appendChild(E1);
				
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
								style: "height:450px; margin-left:5px; margin-right:50px;  float: left;",
								name: "zoomNb"+Onglet,
								onChange: function(evt){
									chargeZoomVar(Chart5[Onglet], 5,  JsonObj5[Onglet] );
									zoomYAxis("zoomNb"+Onglet);
								}
							}, vertical);
						});
					}catch(e){alert(e);}
				
				
				// create a ContentPane as the center pane in the BorderContainer
				////////////////////////////////////////////////////////////////////////////////////////////////////////////////
				cp2 = new ContentPane({
					region: "center",
					content : '<div>'+EE.innerHTML+'</div>'
				});
				bc.addChild(cp2);

				// put the top level widget into the document, and then call startup()
				////////////////////////////////////////////////////////////////////////////////////////////////////////////////
				bc.placeAt(E);
				bc.startup();
				
				
				
				
				//6eme fenetre
				
				
				
				E = document.createElement("div");
				E.setAttribute('id',"DivGraphe6"+Onglet);
				//E.setAttribute('openedHeight', 0);
				E.setAttribute('style', "position: relative; display: none; overflow : auto; width: 100%; height: 100%;");
				globalDiv.appendChild(E);
				
				
				////////////////////////////////////////////////////////////////////////////////////////////////////////////////
				// create a BorderContainer as the top widget in the hierarchy
				////////////////////////////////////////////////////////////////////////////////////////////////////////////////
				bc = new BorderContainer({
					style : "width: 100%;height:99%;  padding: 5px;"
				});
	
				
				EE = document.createElement("div");
				
				E2 = document.createElement("div");
				E2.setAttribute('id',"legend6"+Onglet);
				E2.setAttribute('style', "height:99.5%; border: solid 1px #759dc0; overflow-y : auto;");
				EE.appendChild(E2);
				
				E1 = document.createElement("table");
				E1.setAttribute('id',"legend6Tab"+Onglet);
				E1.setAttribute('style',"margin-right: 30px;");
				E2.appendChild(E1);

				// create a ContentPane as the left pane in the BorderContainer
				////////////////////////////////////////////////////////////////////////////////////////////////////////////////
				cp1 = new ExpandoPane({
					splitter : "true",
					duration : "125",
					region : "right",
					title : "Legend",
					previewOnDblClick : "true",
					content : EE.innerHTML
				});
				bc.addChild(cp1);
	
				
				EE = document.createElement("div");
				
				/*E2 = document.createElement("div");
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
				E1.appendChild(E2);*/
				
				/*E2 = document.createElement("div");
				E2.setAttribute('style', "position : absolute; ");
				EE.appendChild(E2);*/
				
				E3 =  document.createElement("div");
				E3.setAttribute('id',"DivChart6"+Onglet+"Accurate");
				EE.appendChild(E3);
			
				
				E2 = document.createElement("div");
				E2.setAttribute('id',"chart6"+Onglet+"Accurate");
				E2.setAttribute('style', "width: 800px; height: 300px; float:left; margin-left:1px; ");
				E3.appendChild(E2);
				
				
				
				
				
				// create a ContentPane as the center pane in the BorderContainer
				////////////////////////////////////////////////////////////////////////////////////////////////////////////////
				cp2 = new ContentPane({
					region: "center",
					content : '<div>'+EE.innerHTML+'</div>'
				});
				bc.addChild(cp2);

				// put the top level widget into the document, and then call startup()
				////////////////////////////////////////////////////////////////////////////////////////////////////////////////
				bc.placeAt(E);
				bc.startup();
				
				
				
				
				
				
				
				
				//7ere fenetre 
				
				
				
				E = document.createElement("div");
				E.setAttribute('id',"DivGraphe7"+Onglet);
				//E.setAttribute('openedHeight', 0);
				E.setAttribute('style', "position: relative; display: none; overflow : auto; width: 100%; height: 100%;");
				globalDiv.appendChild(E);
				
				
				////////////////////////////////////////////////////////////////////////////////////////////////////////////////
				// create a BorderContainer as the top widget in the hierarchy
				////////////////////////////////////////////////////////////////////////////////////////////////////////////////
				bc = new BorderContainer({
					style : "width: 100%;height:99%;  padding: 5px;"
				});
	
				
				EE = document.createElement("div");

				E2 = document.createElement("div");
				E2.setAttribute('id',"legend7"+Onglet);
				E2.setAttribute('style', "height:99.5%; border: solid 1px #759dc0; overflow-y : auto;");
				EE.appendChild(E2);
				
				E1 = document.createElement("table");
				E1.setAttribute('id',"legend7Tab"+Onglet);
				E1.setAttribute('style',"margin-right: 30px;");
				E2.appendChild(E1);
				
				// create a ContentPane as the left pane in the BorderContainer
				////////////////////////////////////////////////////////////////////////////////////////////////////////////////
				cp1 = new ExpandoPane({
					splitter : "true",
					duration : "125",
					region : "right",
					title : "Legend",
					previewOnDblClick : "true",
					content : EE.innerHTML
				});
				bc.addChild(cp1);
	
				
				EE = document.createElement("div");
				
				/*E2 = document.createElement("div");
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
				E1.appendChild(E2);*/
				
				
				
				/*E2 = document.createElement("div");
				E2.setAttribute('style', "position : absolute; ");
				E1.appendChild(E2);*/
				
				E3 =  document.createElement("font");
				E3.setAttribute('id',"DivChart7"+Onglet+"Accurate");
				EE.appendChild(E3);
			
				
				E2 = document.createElement("div");
				E2.setAttribute('id',"chart7"+Onglet+"Accurate");
				E2.setAttribute('style', "width: 800px; height: 300px; float:left; margin-left:1px; ");
				E3.appendChild(E2);
				
				
				
				// create a ContentPane as the center pane in the BorderContainer
				////////////////////////////////////////////////////////////////////////////////////////////////////////////////
				cp2 = new ContentPane({
					region: "center",
					content : '<div>'+EE.innerHTML+'</div>'
				});
				bc.addChild(cp2);

				// put the top level widget into the document, and then call startup()
				////////////////////////////////////////////////////////////////////////////////////////////////////////////////
				bc.placeAt(E);
				bc.startup();
				
		
	
	
				registry.byId('contentPane'+Onglet).set("content", globalDiv);			
			
		});
	});	
			
			
}


	
function ChargerLogs(){
	
	
	
	require(["dojo/ready","dijit/registry", "dojo/aspect", "dojox/grid/EnhancedGrid", "dojox/grid/enhanced/plugins/Pagination", "dojox/grid/enhanced/plugins/NestedSorting", "dojo/data/ItemFileWriteStore","dijit/form/Button"], function(ready, registry, aspect, EnhancedGrid, Pagination, NestedSorting, ItemFileWriteStore, Button){
		ready(function(){
			// si un chargement a déja echoué (car serveur introuvable) !
			if (pending>=2)  return;
			
			//sinon
			try{
				
				var xhr = createXhrObject(); 
				
				
				if(registry.byId("DojoTableLogs")){
					xhr.open("GET", askWhere + "getLogs.json?dh="+decalageHoraire+"&id="+registry.byId("DojoTableLogs").store._arrayOfAllItems.length, true);
				}else{
					//open xml element (case as first run)
					xhr.open("GET", askWhere + "getLogs.json?dh="+decalageHoraire, true);
				}
				xhr.onreadystatechange=function() 
				{
					if (xhr.readyState == 4) 
					{
						//alert("Chargé");
						
						if (xhr.status == 200) 
						{
							
							var JsonLogs = jsonFormModifier(eval("(" + xhr.responseText + ")"));
							
							try{
								
								
								// gestion des alertes (s'il y en a de nouvelles)
								if(lastAlertIndex != null){
									if(lastAlertIndex < JsonLogs.lastAlertIdx)
										nouvellesAlertes(JsonLogs.lastAlertIdx);
								}else{
									lastAlertIndex =  JsonLogs.lastAlertIdx;
								}
							
								
								
										if(registry.byId("DojoTableLogs")){
											
											console.log("======="+JsonLogs.items.length+"========> tab LOGS ALREADY existing ===> refreshing store ::::::: scroll position : "+registry.byId("DojoTableLogs"));
											
											var store = registry.byId("DojoTableLogs").store;
											
											for(var i =0; i< JsonLogs.items.length; i++){
												try{
													store.newItem(dojo.mixin({ id: store._arrayOfAllItems.length+1 }, JsonLogs.items[i])); 
													//registry.byId("DojoTableLogs").setStore(store);
													registry.byId("DojoTableLogs").resize();
													console.log(" >>>>> ADDED LOG item : "+JsonLogs.items[i].date);
													
												}catch(e){
													console.log(">>>>>>>>>>>>>>>> error while adding LOG item >>>>> "+e);
												}
											}
											
										}else{
											
											var data = {
												identifier: 'id',
												items: []
											};
												
											for(var i=0; i<JsonLogs.items.length; i++){
												data.items.push(dojo.mixin({ id: i+1 }, JsonLogs.items[i]));
											}
											
											var store = new ItemFileWriteStore({data: data});
											

										
											
											//set up layout
											var layout = [
												//{"name" : "Severity", 'field': 'severity', "width" : "auto"},
												{ "name": "Severity", "field": "_item", 'width': '70px',  formatter: function(item){ 
														
																							switch (item.severity+""){
																								case "WARNING":
																									return "<img src='images/warnIcon.gif' title='Warning' width='20' height='20'/>";
																								break;
																								case "ALERT":
																									return "<img src='images/alertIcon.gif' title='Alert' width='20' height='20'/>";
																								break;
																								case "INFO":
																									return "<img src='images/InfoIcon.gif' title='Info' width='20' height='20'/>";
																								break;
																								case "ERROR":
																									return "<img src='images/errorIcon.gif' title='Error' width='20' height='20'/>";
																								break;
																								default:
																									alert("ChargerLogs : new severity :"+ JsonData.legend[i]+":");
																								break;	
																							}
																							
																						}
												},
												{"name" : "Date", 'field': 'date', "width" : "150px"},
												{"name" : "Message", 'field': 'msg', "width" : "auto"},
												//{"name" : "Localhost", 'field': 'ip', "width" : "auto"},
												{ "name": "Detail", "field": "_item", 'width': '90px',  formatter: function(item){ 
																							if(item.detail+"" != "")
																								return new Button({ label: "<img src='images/more.png' title='Alert' width='20' height='20'/>", onClick:function(){
																										
																											clickLoupe(item.severity[0], item.detail[0], item.msg[0], item.date[0]); 
																											//clickOnAlert(this);
																											//addNewIpTab(item.ip);
																											//require(["dojo/ready", "dijit/registry"], function(ready, registry){
																											//	ready(function(){
																											//		registry.byId("LocalhostsTabContainer").resize();
																											//	});
																											//});
																									}
																								}); 
																							else
																								return ""
																						}
												}
												
											
											];								
												
											
											
											//function myStyleRow(row){
											//	The row object has 4 parameters, and you can set two others to provide your own styling
											//	These parameters are :
											//	-- index : the row index
											//	-- selected: whether or not the row is selected
											//	-- over : whether or not the mouse is over this row
											//	-- odd : whether or not this row index is odd. 
											//	var item = grid.getItem(row.index);
											//	if(item.cyc != last_Cycle){
											//			last_Cycle = item.cyc;
														//row.customStyles += "display:none";
											//	}
											//	grid.focus.styleRow(row);
											//	grid.edit.styleRow(row);
											//}



											// modify existing grid or create new grid
											if(registry.byId('DojoTableLogs')){
												//registry.byId('DojoTableLogs').setStore(store);
												//registry.byId('DojoTableLogs').startup();
											}else{
												
												//create a new grid:			
												var grid = new EnhancedGrid({
													id: 'DojoTableLogs',
													store: store,
													structure: layout,
													keepSelection: true,
													editable: false,
													loadingMessage: "Loading data... Please wait.",
													noDataMessage:  "No data found...",
													selectable: true,
													selector: {row: "single", col: "disabled",cell: "disabled"}
													},
												document.getElementById("TabLogsDiv"));
													
												
												
												aspect.after(grid, "resize", function() {
													
													grid.scrollToRow(grid.rowCount);  
													
													var compt = 0
													var finalCompt = null;
													
													aspect.after(grid, "onStyleRow", function(e, item) {
														
														if( item[0].index == grid.rowCount-1 ){
															grid.scrollToRow(grid.rowCount)
															
															compt++;
															finalCompt = compt;
															
															aspect.after(grid, "onStyleRow", function(e, item) {
																if( item[0].index == grid.rowCount-(finalCompt+1) ){
																	alert(grid.rowCount);
																	setTimeout("grid.scrollToRow(grid.rowCount);", 12000);
																	//grid.scrollToRow(grid.rowCount);
																}
															});
															
														}else{
															compt++;
													
															console.log("item: "+item.length+" | index: "+item[0].index+" | count: "+grid.rowCount);
														}
														
														if( finalCompt != null && item[0].index == grid.rowCount-(finalCompt+1) ){
															BANC_TEST =grid;
															console.log("=======================> "+finalCompt+" : "+grid.rowCount+" : "+item[0].index)
															grid.scrollToRow(grid.rowCount);  
														}
														/*
															console.log("item: "+item.length+" | index: "+item[0].index+" | count: "+grid.rowCount);
														item[0].index;
															
															//grid.scrollToRow(grid.rowCount);  
															//console.log("hii5iii");
															//alert("hii5iii");*/
													});
													
												});
												
												/*aspect.after(grid.getRowNode(grid.rowCount-1), "resize", function() {
													//grid.scrollToRow(grid.rowCount);  
													console.log("hiiiii");
												});*/
													
												//Call startup() to render the grid
												grid.startup();
													
												grid.resize();
												
												
													/*aspect.after(grid, "onStyleRow", function(e, item) {
														
													});*/
													
											}
										}	
										
										
								/*var TBody;
								var Ntr;					
								var Ntd;					
								var text;
								
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
									
								}	*/
						
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
						//alert("Non initialisé");
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
			
		});
		
	});
	
}
	

function ChargerData(Onglet, force){
	
		try{
			setParameters(null, document.getElementById(Onglet).getAttribute("params"));
		}catch(e){}
			
		var xhr = createXhrObject();
		
		if(force == "true")
			xhr.open("GET", askWhere +  "rawDataFlow.json?"+parameters+"&force=true", true);
		else
			xhr.open("GET", askWhere +  "rawDataFlow.json?"+parameters, true);
		xhr.onreadystatechange=function() 
		{
			if (xhr.readyState == 4) 
			{
				if (xhr.status == 200) 
				{
						
					var JsonData = jsonFormModifier(eval("(" + xhr.responseText + ")"));
						
					JsonData = setLegendDataIndex(JsonData);
						
					
					try{	
						
											
						require(["dojo/ready", "dijit/registry", "dojox/grid/EnhancedGrid", "dojox/grid/enhanced/plugins/Pagination", "dojox/grid/enhanced/plugins/Menu", "dojox/grid/enhanced/plugins/NestedSorting", "dojox/grid/enhanced/plugins/Filter", "dojox/grid/enhanced/plugins/Selector", "dojo/data/ItemFileWriteStore","dijit/form/Button", "dojo/aspect"], function(ready, registry, EnhancedGrid, Pagination, Menu, NestedSorting, Filter, Selector, ItemFileWriteStore, Button, aspect){
							ready(function(){
					
								var data = {
									identifier: 'num_id_flow',
									items: []
								};
								
									
								for(var i=0; i<JsonData.items.length; i++){
									data.items.push(JsonData.items[i]);
								}
								
								
								var store = new ItemFileWriteStore({data: data});
								
								/*store.comparatorMap = {};
								store.comparatorMap["ipl"] = function(a, b){
									return compareItems(a, b, '.:');
								}
								
								store.comparatorMap["ipo"] = function(a, b){
									return compareItems(a, b, '.:');
								};*/
								
								/*    var sortAttributes = [{attribute: "cyc", descending: true}, { attribute: "fst", descending: true}];
								    function completed(items, findResult){
									//for(var i = 0; i < items.length; i++){
									//    var value = store.getValue(items[i], "uniqueId");
									//    console.log("Item ID: [" + store.getValue(items[i], "uniqueId") + "] with status: [" + store.getValue(items[i], "status") + "]");
									//}
								    }
								    function error(errData, request){
									console.log("Failed in sorting data.");
								    }

								    // Invoke the fetch.
								    store.fetch({onComplete: completed, onError: error, sort: sortAttributes});
								*/
								/* var store = new ItemFileReadStore({data: { identifier: "uniqueId",
									items: [ {uniqueId: 1, status:"CLOSED"},
									    {uniqueId: 2,  status:"OPEN"},
									    {uniqueId: 3,  status:"PENDING"},
									    {uniqueId: 4,  status:"BLOCKED"},
									    {uniqueId: 5,  status:"CLOSED"},
									    {uniqueId: 6,  status:"OPEN"},
									    {uniqueId: 7,  status:"PENDING"},
									    {uniqueId: 8,  status:"PENDING"},
									    {uniqueId: 10, status:"BLOCKED"},
									    {uniqueId: 12, status:"BLOCKED"},
									    {uniqueId: 11, status:"OPEN"},
									    {uniqueId: 9,  status:"CLOSED"}
									]
								    }});

								    // Define the comparator function for status.
								    store.comparatorMap = {};
								    store.comparatorMap["status"] = function(a, b){
									var ret = 0;
									// We want to map these by what the priority of these items are, not by alphabetical.
									// So, custom comparator.
									var enumMap = { OPEN: 3, BLOCKED: 2, PENDING: 1, CLOSED: 0};
									if(enumMap[a] > enumMap[b]){
									    ret = 1;
									}
									if(enumMap[a] < enumMap[b]){
									    ret = -1;
									}
									return ret;
								    };

								    var sortAttributes = [{attribute: "status", descending: true}, { attribute: "uniqueId", descending: true}];
								    function completed(items, findResult){
									for(var i = 0; i < items.length; i++){
									    var value = store.getValue(items[i], "uniqueId");
									    console.log("Item ID: [" + store.getValue(items[i], "uniqueId") + "] with status: [" + store.getValue(items[i], "status") + "]");
									}
								    }
								    function error(errData, request){
									console.log("Failed in sorting data.");
								    }

								    // Invoke the fetch.
								    store.fetch({onComplete: completed, onError: error, sort: sortAttributes});
								});
								*/
								
								var columnViewColspan =
								{
									cells: [
										[],
										[  // column header row 1
											{"name" : "Cycle", 'field': 'cyc', 'colSpan': JsonData.legend.length, 'width': 'auto', formatter: function(cyc){
																										//compteur_Cycle++;
																										//alert(last_cycle);
																										///////if(item.id == 1)last_Cycle = null;
																										if(cyc+"" == last_Cycle+""){
																											try{
																												this.customClasses.push("hiddenCycleRow");
																											}catch(e){alert(e);}
																										}else{
																											this.customStyles.push("background: -moz-linear-gradient(center top , #EDF2F7, #D0DFEA) repeat scroll 0 0 transparent !important;");
																											//alert(":"+last_Cycle+" : "+cyc+":");
																											last_Cycle = cyc;
																										}
																										//alert(compteur_Cycle+" : " + JsonData.items.length+"")
																										//if(compteur_Cycle == JsonData.items.length) {last_Cycle = null;compteur_Cycle=0;}
																										
																										return cyc;
																									}
											}
										],

										[  // column header row 2
										]

									] 
								};          
								
								/*var layout = [{
									defaultCell: { width: 8, editable: false, type: dojox.grid.cells._Widget },
									rows:
									[
										{ field: "Genre", width: '6'},
										{ field: "Artist", width: '10'},
										{ field: "Year", width: '6'},
										{ field: "Album", width: '12'},
										{ field: "Name", width: '17'},
										{ field: "Length", width: '6'},
										{ field: "Track", width: '6'},
										{ field: "Composer", width: '15'}                               
									]}
								];*/
								
								/*
								//, formatter: function(){ this.customClasses.push("hiddenCycleRow") }
								//, 'height': '20px'
								*/

								for(var i=0; i<JsonData.legend.length; i++){
									switch (JsonData.legend[i]){
										case "FirstTime":
											columnViewColspan.cells[0].push({"name" : "", 'field': '', 'width': '62px',  formatter: function(){this.customStyles.push("padding: 0px 5px ! important"); return null;} });
											columnViewColspan.cells[2].push({"name" : "FirstTime", 'field': 'fst', 'width': '62px'});
										break;
										case "LastTime":
											columnViewColspan.cells[0].push({"name" : "", 'field': '', 'width': '62px',  formatter: function(){this.customStyles.push("padding: 0px 5px ! important"); return null;}});
											columnViewColspan.cells[2].push({"name" : "LastTime", 'field': 'lst', 'width': '62px'});
										break;
										case "IpLocal":
											columnViewColspan.cells[0].push({"name" : "", 'field': '', 'width': 'auto',  formatter: function(){this.customStyles.push("padding: 0px 5px ! important"); return null;}});//250+(1,2,3)
											columnViewColspan.cells[2].push({"name" : "IpLocal", 'field': 'ipl', 'width': 'auto'});//250+(1,2,3)
										break;
										case "Dir":
											columnViewColspan.cells[0].push({"name" : "", 'field': '', 'width': '20px',  formatter: function(){this.customStyles.push("padding: 0px 5px ! important"); return null;}});
											columnViewColspan.cells[2].push({"name" : "Dir", 'field': 'd', 'width': '20px'});
										break;
										case "IpExtern":
											columnViewColspan.cells[0].push({'name': '', 'field': '', 'width': 'auto',  formatter: function(){this.customStyles.push("padding: 0px 5px ! important"); return null;}});
											columnViewColspan.cells[2].push({'name': 'IpExtern', 'field': '_item', 'width': '100px',  formatter: function(item){ 
															//alert(item.c);
															var retour = "<table cellspacing=0 align=center><tr><td> <font size = '2'> "+item.ipo+" </font> </td>";
												
															retour +=  "<td> &nbsp<img src='images/flags/"+item.c[0].toLowerCase()+".png'  title='"+nameOfCountry(item.c[0])+"'></img> </td>";
															retour +=  "</tr></table>";
															//var retour = "<font size='2' valign='middle'>"+item.osName+"</font>";
															//if(item.arch64 == "t") retour +=  " &nbsp <img valign='middle' src='images/mobile.png' title='64 bits' height='20' width='13'/>";
															//if(item.mobile == "t") retour +=  " &nbsp <img valign='middle' src='images/mobile.png' t='Mobile' height='20' width='13'/>";
															return retour;
														}
											});
											//columnViewColspan.cells[2].push({"name" : "IpExtern", 'field': 'ipo', 'width': 'auto'});//250+(1,2,3)
										break;
										case "ASNum":
											columnViewColspan.cells[0].push({"name" : "", 'field': '', 'width': '55px',  formatter: function(){this.customStyles.push("padding: 0px 5px ! important"); return null;}});
											columnViewColspan.cells[2].push({"name" : "ASNum", 'field': 'asn', 'width': '55px'});
										break;
										case "Application":
											columnViewColspan.cells[0].push({"name" : "", 'field': '', 'width': '70px',  formatter: function(){this.customStyles.push("padding: 0px 5px ! important"); return null;}});
											columnViewColspan.cells[2].push({"name" : "Application", 'field': '_item', 'width': '70px',  formatter: function(item){ 
															//alert(item.c);
															if(item.application_id[0].charAt(0)=="z")
																return "<font onmouseover='resolveApplication(this)'  value=\""+item.num_id_flow[0]+"\">"+item.application_id[0]+"</font>";
															else
																return "<font>"+item.application_id[0]+"</font>";
														}
											});
										break;
										case "Proto":
											columnViewColspan.cells[0].push({"name" : "", 'field': '', 'width': '40px',  formatter: function(){this.customStyles.push("padding: 0px 5px ! important"); return null;}});
											columnViewColspan.cells[2].push({"name" : "Proto", 'field': 'p', 'width': '40px'});
										break;
										case "PtLoc":
											columnViewColspan.cells[0].push({"name" : "", 'field': '', 'width': '45px',  formatter: function(){this.customStyles.push("padding: 0px 5px ! important"); return null;}});
											columnViewColspan.cells[2].push({"name" : "PtLoc", 'field': 'pl', 'width': '45px'});
										break;
										case "PtExt":
											columnViewColspan.cells[0].push({"name" : "", 'field': '', 'width': '45px',  formatter: function(){this.customStyles.push("padding: 0px 5px ! important"); return null;}});
											columnViewColspan.cells[2].push({"name" : "PtExt", 'field': 'po', 'width': '45px'});
										break;
										case "TcpFlg":
											columnViewColspan.cells[0].push({"name" : "", 'field': '', 'width': '65px',  formatter: function(){this.customStyles.push("padding: 0px 5px ! important"); return null;}});
											columnViewColspan.cells[2].push({"name" : "TcpFlg", 'field': 'flg', 'width': '65px'});
										break;
										case "IncTraf":
											columnViewColspan.cells[0].push({"name" : "", 'field': '', 'width': '60px',  formatter: function(){this.customStyles.push("padding: 0px 5px ! important"); return null;}});
											columnViewColspan.cells[2].push({"name" : "IncTraf", 'field': 'itr', 'width': '60px'});
										break;
										case "OutgTraf":
											columnViewColspan.cells[0].push({"name" : "", 'field': '', 'width': '60px',  formatter: function(){this.customStyles.push("padding: 0px 5px ! important"); return null;}});
											columnViewColspan.cells[2].push({"name" : "OutgTraf", 'field': 'otr', 'width': '60px'});
										break;
										case "IncPkts":
											columnViewColspan.cells[0].push({"name" : "", 'field': '', 'width': '60px',  formatter: function(){this.customStyles.push("padding: 0px 5px ! important"); return null;}});
											columnViewColspan.cells[2].push({"name" : "IncPkts", 'field': 'ipk', 'width': '60px'});
										break;
										case "OutgPkts":
											columnViewColspan.cells[0].push({"name" : "", 'field': '', 'width': '60px',  formatter: function(){this.customStyles.push("padding: 0px 5px ! important"); return null;}});
											columnViewColspan.cells[2].push({"name" : "OutgPkts", 'field': 'opk', 'width': '60px'});
										break;
										case "Duration":
											columnViewColspan.cells[0].push({"name" : "", 'field': '', 'width': '60px',  formatter: function(){this.customStyles.push("padding: 0px 5px ! important"); return null;}});
											columnViewColspan.cells[2].push({"name" : "Duration", 'field': 'dur', 'width': '60px'});
										break;
										default:
											alert("ChargerData : new item name in legend :"+ JsonData.legend[i]+":");
										break;	
									}
								}
								
								var layoutColspan = [ columnViewColspan ];

							
								
							/*	//set up layout	
								var layout = new Array();
								layout[0] = new Array();
								layout[1] = new Array();
								layout[0].push({"name" : "Cycle", 'field': '_item', 'colSpan': JsonData.legend.length, formatter: function(item){
	//compteur_Cycle++;
	if(item.id == 1)last_Cycle = null;
	if(item.cyc+"" == last_Cycle+""){
		try{
			this.customClasses.push("hiddenCycleRow");
		}catch(e){alert(e);}
	}else{
			this.customStyles.push("background: -moz-linear-gradient(center top , #EDF2F7, #D0DFEA) repeat scroll 0 0 transparent !important;");
		//alert(":"+last_Cycle+" : "+item.cyc+":");
		last_Cycle = item.cyc;
	}
	//alert(compteur_Cycle+" : " + JsonData.items.length+"")
	//if(compteur_Cycle == JsonData.items.length) {last_Cycle = null;compteur_Cycle=0;}
	
	return item.cyc;
}
								});
								//layout[1].push({"name" : "HC", 'field': 'cyc', 'width': 'auto'});
								for(var i=0; i<JsonData.legend.length; i++){
									switch (JsonData.legend[i]){
										case "FirstTime":
											layout[1].push({"name" : "FirstTime", 'field': 'fst', 'width': '62px'});
										break;
										case "LastTime":
											layout[1].push({"name" : "LastTime", 'field': 'lst', 'width': '62px'});
										break;
										case "IpLocal":
											layout[1].push({"name" : "IpLocal", 'field': 'ipl', 'width': 'auto'});//250+(1,2,3)
										break;
										case "Dir":
											layout[1].push({"name" : "Dir", 'field': 'd', 'width': '20px'});
										break;
										case "IpExtern":
											layout[1].push({"name" : "IpExtern", 'field': 'ipo', 'width': 'auto'});//250+(1,2,3)
										break;
										case "ASNum":
											layout[1].push({"name" : "ASNum", 'field': 'asn', 'width': '55px'});
										break;
										case "Proto":
											layout[1].push({"name" : "Proto", 'field': 'p', 'width': '40px'});
										break;
										case "PtLoc":
											layout[1].push({"name" : "PtLoc", 'field': 'pl', 'width': '45px'});
										break;
										case "PtExt":
											layout[1].push({"name" : "PtExt", 'field': 'po', 'width': '45px'});
										break;
										case "TcpFlg":
											layout[1].push({"name" : "TcpFlg", 'field': 'flg', 'width': '65px'});
										break;
										case "IncTraf":
											layout[1].push({"name" : "IncTraf", 'field': 'itr', 'width': '60px'});
										break;
										case "OutgTraf":
											layout[1].push({"name" : "OutgTraf", 'field': 'otr', 'width': '60px'});
										break;
										case "IncPkts":
											layout[1].push({"name" : "IncPkts", 'field': 'ipk', 'width': '60px'});
										break;
										case "OutgPkts":
											layout[1].push({"name" : "OutgPkts", 'field': 'opk', 'width': '60px'});
										break;
										case "Duration":
											layout[1].push({"name" : "Duration", 'field': 'dur', 'width': '60px'});
										break;
										default:
											alert("ChargerData : new item name in legend :"+ JsonData.legend[i]+":");
										break;	
									}
								}
								*/
								
								/*function myStyleRow(row){
									//The row object has 4 parameters, and you can set two others to provide your own styling
									//These parameters are :
									//-- index : the row index
									//-- selected: whether or not the row is selected
									//-- over : whether or not the mouse is over this row
									//-- odd : whether or not this row index is odd. 
									var item = grid.getItem(row.index);
									if(item.cyc != last_Cycle){
											last_Cycle = item.cyc;
											//row.customStyles += "display:none";
									}
									grid.focus.styleRow(row);
									grid.edit.styleRow(row);
								}*/
								
								
								
								/*programmatic menus*/
								var menusObject = {
									 //headerMenu: new dijit.Menu(),
									 rowMenu: new dijit.Menu(),
									 rightClickedItem: null,
									 //cellMenu: new dijit.Menu(),
									 //selectedRegionMenu: new dijit.Menu()
								     };
								     

								     
								menusObject.rowMenu.addChild(new dijit.MenuItem({
																				label: "Copy values to search form",
																				onClick: function(e){
																					//SelectIpData
																					alert(menusObject.rightClickedItem.ip);
																					/*addNewIpTab(menusObject.rightClickedItem.ip);
																					require(["dojo/ready", "dijit/registry"], function(ready, registry){
																						ready(function(){
																							registry.byId("LocalhostsTabContainer").resize();
																						});
																					});*/
																				}
																		}));
								/*menusObject.rowMenu.addChild(new dijit.MenuItem({
																				label: "Copy values to search form and switch",
																				onClick: function(e){
																					alert("TO DO | e = "+e);
																					//var selectedRow = grid.selection.getSelected();
																					//	//alert(menusObject.selectedRow);
																					//for(var i = 0; i< selectedRow.length; i++){
																					//	addNewIpTab(selectedRow[i].ip);
																					//}
																					//require(["dojo/ready", "dijit/registry"], function(ready, registry){
																					//	ready(function(){
																					//		registry.byId("LocalhostsTabContainer").resize();
																					//	});
																					//});
																				}
																		}));*/
																				
								menusObject.rowMenu.startup();

							
					
								
								
								// modify existing grid or create new grid
								if(registry.byId('DojoTable'+Onglet)){
									//registry.byId('DojoTable'+Onglet).setStore(store);
									//registry.byId('DojoTable'+Onglet).startup();
								}else{
									/*create a new grid:*/			
									var grid = new EnhancedGrid({
										id: 'DojoTable'+Onglet,
										store: store,
										structure: layoutColspan,
										autowidth: false,
										//columnReordering: true,
										//onShow: function(){alert("OS"); last_Cycle = null;},
										//onMouseMove: function(){alert("MM"); last_Cycle = null;},
										//onStyleRow: function(){alert("SR"); last_Cycle = null;},
										//onApplyEdit: function(){alert("AE"); last_Cycle = null;},
										//rowSelector: "20px",
										//selectionMode: "multiple",
										keepSelection: true,
										editable: false,
										loadingMessage: "Loading data... Please wait.",
										noDataMessage:  "No data found... ",
										selectable: true,
										canSort: function(){return false;},
										sortFields: [{attribute: 'cyc', descending: false}, {attribute: 'fst', descending: false}],
										plugins: {
											/*pagination: {
												//nestedSorting: true,
												//pageSizes: ["100", "200","500","1000", "All"],
												pageSizes: ["All"],
												defaultPageSize: "All",
												description: true,
												sizeSwitch: true,
												pageStepper: true,
												gotoButton: true,
												//page step to be displayed
												maxPageStep: 5,
												//position of the pagination bar
												position: "bottom"
											},*/
											selector: {row: "single", col: "disabled",cell: "disabled"},
											menus: menusObject,
											nestedSorting: true,
											/*filter: {
												// Show the closeFilterbarButton at the filter bar
												closeFilterbarButton: false,
												// Set the maximum rule count to 5
												ruleCount: 5,
												// Set the name of the items
												itemsName: "Flows"
											}*/
										}},
									document.getElementById("DivGraphe6"+Onglet));
										
										
						
									aspect.before(grid, 'onRowContextMenu', function(e){
										var rowIndex = e.rowIndex;
										var colIndex = e.cellIndex;
										menusObject.rightClickedItem = grid.getItem(rowIndex);
										
									});
									
									aspect.before(grid, "_resize", function() {
										last_Cycle = null;
										//alert("_resize");
									});	
									aspect.before(grid, "_render", function() {
										last_Cycle = null;
										//alert("_clearData");
									});	
									

										
									/*Call startup() to render the grid*/
									grid.startup();
								}
								
							});
								
						});
						
					}catch(e){
						alert("chargerData error : "+ e)
					}
				}
			}
		}
	
	
	
		xhr.send(null);
			
	
	
	
	

		/*loading("DivGraphe6"+Onglet);
	
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
			xhr.open("GET", askWhere +  "rawDataFlow.json?"+parameters+dataPage+"&force=true", true);
		else
			xhr.open("GET", askWhere +  "rawDataFlow.json?"+parameters+dataPage, true);
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
								
/*							}else{
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
						
						
						
						
						// création de l'icone "save to CSV"
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
		}
		xhr.send(null);*/
	}
	
	
function chargerAlerts(){
	
	//loading("TabAlertsDiv");
	//alert("e");
	
	try{
		
		/*var TBody;
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
		*/
		
		var xhr = createXhrObject();
		
		
		xhr.open("GET", askWhere +   "getAlertList.json?"+document.getElementById("Alerts").getAttribute('params'), true);
		
	
		xhr.onreadystatechange=function() 
		{
		
			if (xhr.readyState == 4) 
			{
				if (xhr.status == 200) 
				{
						
						var JsonAlerts = jsonFormModifier(eval("(" + xhr.responseText + ")"));
					
					try{	
						
						require(["dojo/ready", "dijit/registry", "dojo/aspect", "dojox/grid/EnhancedGrid", "dojox/grid/enhanced/plugins/Pagination", "dojox/grid/enhanced/plugins/NestedSorting", "dojox/grid/enhanced/plugins/Filter", "dojo/data/ItemFileWriteStore","dijit/form/Button"], function(ready, registry, aspect, EnhancedGrid, Pagination, NestedSorting, Filter, ItemFileWriteStore, Button){
							ready(function(){
					
								if(registry.byId("DojoTableAlerts")){
									
									console.log("======="+JsonAlerts.items.length+"========> tab ALERTS ALREADY existing ===> refreshing store ::::::: scroll position : "+registry.byId("DojoTableAlerts"));
									
									var store = registry.byId("DojoTableAlerts").store;

									
									for(var i =0; i< JsonLogs.items.length; i++){
										try{
											store.fetch({query : {id: JsonAlerts.items[i].id},
												onError: function (error ) {
													console.log("Not found: " +error);
												},
												onComplete : function (items ) {
													if(item  && items.length > 0){
														//console.log("items found: "+items.length+"DO nothing");
													}else{
														store.revert();
														store.newItem(JsonAlerts.items[i]); 
														store.revert();
														//registry.byId("DojoTableAlerts").setStore(store);
														console.log(" >>>>> ADDED ALERT item : "+ JsonAlerts.items[i].date);
													}
												}
											});
											
										}catch(e){
											//console.log(">>>>>>>>>>>>>>>> "+e+" >>>>> adding ALERT item");
											store.revert();
											store.newItem(JsonAlerts.items[i]); 
											store.revert();
											//registry.byId("DojoTableAlerts").setStore(store);
											console.log(" >>>>> ADDED ALERT item : "+ JsonAlerts.items[i].date)
										}
									}
									
								}else{
									
									var data = {
										identifier: 'id',
										items: []
									};
										
									// définir le contenu de la store avec les premiers éléments connus 
									var lastAlertAcquiredId = 0;
									for(var i=0; i<JsonAlerts.items.length; i++){
										data.items.push(JsonAlerts.items[i]);
										lastAlertAcquiredId = JsonAlerts.items[i].id;
									}
										
									// compléter le contenu de la store avec les éléments inconnus 
									//oealert(lastAlertAcquiredId);
									while(lastAlertAcquiredId >= 2){
										lastAlertAcquiredId --;
										data.items.push({"id": lastAlertAcquiredId, "date": "", "ip": "", "hostname": "", "msg": "", "n": ""});
									}
									
									//alert(lastAlertAcquiredId);
									
									
									var store = new ItemFileWriteStore({data: data});

									/*var sortAttributes = [{ attribute: "id", descending: false}];
									
									function error(errData, request){
										console.log("Failed in sorting data.");
									}

									// Invoke the fetch.
									store.fetch({onError: error, sort: sortAttributes});*/
			
									
									//set up layout
									var layout = [
										{"name" : "Date", 'field': 'date', "width" : "auto"},
										{"name" : "Message", 'field': 'msg', "width" : "auto"},
										{"name" : "Localhost", 'field': 'ip', "width" : "auto"},
										{ "name": "Detail", "field": "_item", 'width': 'auto',  formatter: function(item){ 
																				//alert(localhostAlreadyOpened(item.ip));
																					try{
																						console.log("XXXXXXXXXXXXX=========> "+item.id);
																						return new Button({ label: "Show more", onClick:function(){
																													this.setAttribute("value", item.id);
																													this.setAttribute("date", item.date);
																													this.setAttribute("localhost", item.ip);
																													this.setAttribute("msg", item.msg);
																											
																													if(item.msg.indexOf("SMTP") != -1)
																														this.setAttribute('alertType',"SMTP");
																													else
																													if(item.msg.indexOf("SUSPICIOUS") != -1)
																														this.setAttribute('alertType',"SUSPICIOUS");
																													else
																													if(item.msg.indexOf("MULTIPLE") != -1)
																														this.setAttribute('alertType',"MULTIPLESCAN");
																													else
																													if(item.msg.indexOf("SCAN") != -1)
																														this.setAttribute('alertType',"SCAN");
																													else
																													if(item.msg.indexOf("MANY") != -1)
																														this.setAttribute('alertType',"MANYRECIPIENTS");
																															
																													clickOnAlert(this);
																													//addNewIpTab(item.ip);
																													//require(["dojo/ready", "dijit/registry"], function(ready, registry){
																													//	ready(function(){
																													//		registry.byId("LocalhostsTabContainer").resize();
																													//	});
																													//});
																												}
																										}); 
																					}catch(e){
																						return null;
																					}
																			}
										}
									];								
										
			
									
									
									//function myStyleRow(row){
									//	//The row object has 4 parameters, and you can set two others to provide your own styling
									//	//These parameters are :
									//	//-- index : the row index
									//	//-- selected: whether or not the row is selected
									//	//-- over : whether or not the mouse is over this row
									//	//-- odd : whether or not this row index is odd. 
									//	var item = grid.getItem(row.index);
									//	if(item.cyc != last_Cycle){
									//			last_Cycle = item.cyc;
									//			//row.customStyles += "display:none";
									//	}
									//	grid.focus.styleRow(row);
									//	grid.edit.styleRow(row);
									//}

									
									
									// modify existing grid or create new grid
									if(registry.byId('DojoTableAlerts')){
										//registry.byId('DojoTableAlerts').setStore(store);
										
										var divAlertCurrentDisplay = document.getElementById('DivAlerts').style.display;
										document.getElementById('DivAlerts').style.display = "block";
										//registry.byId('DojoTableAlerts').startup();
										document.getElementById('DivAlerts').style.display = divAlertCurrentDisplay;
									}else{
										//create a new grid:			
										var grid = new EnhancedGrid({
											id: 'DojoTableAlerts',
											store: store,
											structure: layout,
											//onShow: function(){alert("OS"); last_Cycle = null;},
											//onMouseMove: function(){alert("MM"); last_Cycle = null;},
											//onStyleRow: function(){alert("SR"); last_Cycle = null;},
											//onApplyEdit: function(){alert("AE"); last_Cycle = null;},
											//rowSelector: "20px",
											//selectionMode: "multiple",
											editable: false,
											loadingMessage: "Loading data... Please wait.",
											noDataMessage:  "No data found...",
											selectable: true,
											plugins: {
												pagination: {
													nestedSorting: true,
													pageSizes: [],
													defaultPageSize: 100,
													description: true,
													sizeSwitch: true,
													pageStepper: true,
													gotoButton: true,
													//page step to be displayed
													maxPageStep: 5,
													//position of the pagination bar
													position: "bottom"
												},
												nestedSorting: true,
												filter: {
													// Show the closeFilterbarButton at the filter bar
													closeFilterbarButton: false,
													// Set the maximum rule count to 5
													ruleCount: 5,
													// Set the name of the items
													itemsName: "Alerts"
												}
											}},
										document.getElementById("TabAlertsDiv"));
											

				
										grid.pagination.plugin.gotoPage = function(page){
											console.log("gotoPage : ");
										};
										
											
											//alert(grid.pagination.plugin.currentPage());
										
										aspect.before(grid.pagination.plugin, 'currentPage', function(newPage){
											if(newPage){
												rechargerAlerts(newPage);
												//alert(">>>>>>>>>>>>>>>>>>>>>> aye aye sir : "+newPage);
											}
										});
					
											
										/*grid.pagination.plugin.currentPage = function(page){
											console.log("currentPage : "+this.currentPage());
											console.log("got to : "+page);
											//alert(this.currentPage());
											//return this.currentPage();
										};*/
				
										/*grid.pagination.plugin.nextPage = function(){
											alert("nextPage ");
										};
				
										grid.pagination.plugin.prevPage = function(){
											alert("prevPage ");
										};*/
											
											
										//Call startup() to render the grid
										var divAlertCurrentDisplay = document.getElementById('DivAlerts').style.display;
										document.getElementById('DivAlerts').style.display = "block";
										grid.startup();
										document.getElementById('DivAlerts').style.display = divAlertCurrentDisplay;
										//grid.resize();
											
											
									}
								}
							});
								
						});
						
						
						/*if(!document.cookie)
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
							
							
							// Empty, Create and fill TabAlertsHeaders Content						
							//if (  document.getElementById('TabHeadersAlerts').hasChildNodes() ){
							//	while ( document.getElementById('TabHeadersAlerts').childNodes.length >= 1 ){
							//		document.getElementById('TabHeadersAlerts').removeChild( document.getElementById('TabHeadersAlerts').firstChild );   	
							//	} 
							//}
							
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

								//if(JsonAlerts.items[i].msg.indexOf("SMTP") != -1)
								//	Ntr.setAttribute('SMTP', "true");
								//else
								//	Ntr.setAttribute('SMTP', "false");
								//if(JsonAlerts.items[i].msg.indexOf("SUSPICIOUS") != -1)
								//	Ntr.setAttribute('SUSPICIOUS', "true");
								//else
								//	Ntr.setAttribute('SUSPICIOUS', "false");

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
								
								
								
									//Ntd = document.createElement("td");
									//text = document.createTextNode(JsonAlerts.items[i].date);
									//if( JsonAlerts.items[i].id > lastAlertIndex ){
									//	img = document.createElement("img");
									//	img.setAttribute("type", "image");
									//	img.setAttribute("src", "images/alertIcon.gif");
									//	img.setAttribute("style", "display: block;");
									//	Ntd.appendChild(img);
									//}
									//Ntd.appendChild(text);
									//Ntr.appendChild(Ntd);
								
								///////////////////////////////////////////////////////////////////////////////////////////////////////////
								
									//Ntd = document.createElement("td");
								
									//tab = document.createElement("table");
									//tb = document.createElement("tbody");
									//tab.appendChild(tb);
									//tr = document.createElement("tr")
									//tb.appendChild(tr);
									//td = document.createElement("td")
									//tr.appendChild(td);
									
									//if( JsonAlerts.items[i].id > lastAlertIndex ){
									//	img = document.createElement("img");
									//	img.setAttribute("type", "image");
									//	img.setAttribute("src", "images/alertIcon.gif");
									//	img.setAttribute("style", "display: block;");
									//	td.appendChild(img);
									//}
									
									//td = document.createElement("td")
									//tr.appendChild(td);
									
									//text = document.createTextNode(JsonAlerts.items[i].date);
									//td.appendChild(text);
									
									//Ntd.appendChild(tab);
									//Ntr.appendChild(Ntd);
								
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
									Ntd.setAttribute('onclick',"loading('TabAlertsDiv'); setTimeout('chargerAlerts()', 500);");
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
									Ntd.setAttribute('onclick',"loading('TabAlertsDiv'); setTimeout('chargerAlerts()', 500);");
									Ntd.innerHTML = i;
									TBody.appendChild(Ntd);	
								}
								
								//le dernier bouton : 'last page'
								if (borneSup < JsonAlerts.nbPages) {
									Ntd = document.createElement("button");
									Ntd.setAttribute('onclick',"loading('TabAlertsDiv'); setTimeout('chargerAlerts()', 500);");
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
							
						}*/
						
						
						
						
					}catch(e){ 
						alert(e+" ::=:: "+e.lineNumber)
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
				//unLoading();
				
			}
		}
		
		xhr.send(null);
		
	}catch(e){
		alert(e);
	}
	
	//alert("OUT");
	//unLoading();
	
}




	
	
function rechargerAlerts(page){
	
	try{
		
		
		var xhr = createXhrObject();
		
		
		xhr.open("GET", askWhere + "getAlertList.json?"+document.getElementById("Alerts").getAttribute('params')+"&page="+page, false);
	
	
		xhr.onreadystatechange=function() 
		{
		
			if (xhr.readyState == 4) 
			{
				if (xhr.status == 200) 
				{
						
						var JsonAlerts = jsonFormModifier(eval("(" + xhr.responseText + ")"));
					
					try{	
						
						require(["dojo/ready", "dijit/registry", "dojo/data/ItemFileWriteStore"], function(ready, registry, ItemFileWriteStore){
							ready(function(){
								
									
									console.log("======="+JsonAlerts.items.length+"========> tab ALERTS ALREADY existing ===> refreshing store ::::::: scroll position : "+registry.byId("DojoTableAlerts"));
									
									var store = registry.byId("DojoTableAlerts").store;
								
									if(store._arrayOfAllItems.length != JsonAlerts.nbResults){
										alert(" store : "+store._arrayOfAllItems.length+"\n nb alertes : "+JsonAlerts.nbResults);
										//for(var i= store._arrayOfAllItems.length)
									}
									
									for(var i =0; i< JsonAlerts.items.length; i++){
										//alert(JsonAlerts.items[i].id);
										try{
											store.fetchItemByIdentity({ 'identity' : JsonAlerts.items[i].id,  onItem :  function (item ) {
							
																			for(var j=0; j< JsonAlerts.content.length; j++){
																				switch (JsonAlerts.content[j]+""){
																					case "id":
																						//store.setValue(item, "id", Json.items[i].id);
																					break;
																					case "ip":
																						store.setValue(item, "ip", JsonAlerts.items[i].ip);
																					break;
																					case "date":
																						store.setValue(item, "date", JsonAlerts.items[i].date);
																					break;
																					case "hostname":
																						store.setValue(item, "hostname", JsonAlerts.items[i].hostname);
																					break;
																					case "msg":
																						store.setValue(item, "msg", JsonAlerts.items[i].msg);
																					break;
																					case "n":
																						//var lastseen = store.getValue(item, 'lastSeen');
																						store.setValue(item, "n", JsonAlerts.items[i].n);
																					break;
																					default:
																						console.log("alertsTabCompletion : new layout content :"+ JsonAlerts.content[i]+":");
																					break;	
																				}
																				
																				
																			}
																			
																	}
											});
											
											//alert("done : "+JsonAlerts.items[i].id);
										}catch(e){
											console.log(">>>>>>>>>>>>>>>> "+e+" >>>>> error in alert store completion (ongletCreation.js) at line: "+e.lineNumber);
										}
									}
									
							});
								
						});
						
						
						
					}catch(e){ 
						alert(e+" ::=:: "+e.lineNumber)
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
				//unLoading();
				
			}
		}
		
		xhr.send(null);
		
	}catch(e){
		alert(e);
	}
	
	//alert("OUT");
	//unLoading();
	
}



function chargerAlertsFIXEDHEADER(page){
	
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
			xhr.open("GET",  askWhere + "getAlertList.json?"+document.getElementById("Alerts").getAttribute('params'), false);
		else{
			if(document.getElementById("Alerts").getAttribute('params') == "" || document.getElementById("Alerts").getAttribute('params') == null)
				xhr.open("GET", askWhere + "getAlertList.json?page="+page, false);
			else
				xhr.open("GET", askWhere + "getAlertList.json?"+document.getElementById("Alerts").getAttribute('params')+"&page="+page, false);
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
							Ntr = Ntd;
							
							
							Ntd = document.createElement("th");
							Ntd.setAttribute('id', "alertsHeaderDates"); 
							//Ntd.setAttribute('width', "29%"); 
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
							Ntd.setAttribute('id', "alertsHeaderMessages"); 
							//Ntd.setAttribute('width', "40%"); 
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
							Ntd.setAttribute('id', "alertsHeaderLocalhosts"); 
							//Ntd.setAttribute('width', "30%"); 
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
							
							
							Ntd = document.createElement("th");
							Ntd.setAttribute('style', "width: 16px !important;"); 
							Ntr.appendChild(Ntd);

							
							
							
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
								//alert(document.getElementById("alertsHeaderDates").offsetWidth); 
								//Ntd.setAttribute('width', document.getElementById("alertsHeaderDates").offsetWidth+"px"); 
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
									//Ntd.setAttribute('width', document.getElementById("alertsHeaderMessages").offsetWidth+"px"); 
									if( JsonAlerts.items[i].n == "new"  &&  document.cookie.indexOf(":"+JsonAlerts.items[i].id+":") == -1)
										Ntd.innerHTML = "<div style='font-weight: bold;'>"+JsonAlerts.items[i].msg+"</div>";
									else
										Ntd.innerHTML = "<div style='font-weight: normal;'>"+JsonAlerts.items[i].msg+"</div>";
									Ntr.appendChild(Ntd);
									
									Ntd = document.createElement("td");
									//Ntd.setAttribute('width', document.getElementById("alertsHeaderLocalhosts").offsetWidth+"px"); 
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




function chargerAlertsHTML(page){
	
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
			xhr.open("GET",   askWhere +  "getAlertList.json?"+document.getElementById("Alerts").getAttribute('params'), false);
		else{
			if(document.getElementById("Alerts").getAttribute('params') == "" || document.getElementById("Alerts").getAttribute('params') == null)
				xhr.open("GET",  askWhere + "getAlertList.json?page="+page, false);
			else
				xhr.open("GET",  askWhere + "getAlertList.json?"+document.getElementById("Alerts").getAttribute('params')+"&page="+page, false);
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
			if(ongletActif().indexOf("Result")>=0){
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

		xhr.open("GET", askWhere +"getNetworkList.json", false);
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
				
				//setTabOngletHeight();

				
			}else {
				//document.getElementById('TabLogsDiv').innerHTML = "getLogs.json" + " not found";
			}
		}
		
}


function localhostsTabCompletion(Json){
	
	require(["dojo/ready", "dijit/registry", "dojox/grid/EnhancedGrid", "dojox/grid/enhanced/plugins/Pagination", "dojox/grid/enhanced/plugins/Menu", "dojox/grid/enhanced/plugins/NestedSorting", "dojox/grid/enhanced/plugins/Filter", "dojox/grid/enhanced/plugins/Selector", "dojo/data/ItemFileWriteStore","dijit/form/Button", "dojo/aspect"], function(ready, registry, EnhancedGrid, Pagination, Menu, NestedSorting, Filter, Selector, ItemFileWriteStore, Button, aspect){
		ready(function(){
			
			/*set up data store*/		
			var data = {
				identifier: 'ip',//'id',
				items: []
			};
					
			for(var i=0; i<Json.items.length; i++){
				//if(Json.items[i].mac == "00:00:00:00:00:00") Json.items[i].mac = "unknown" ;
				//Json.items[i].mac = Json.items[i].name;
				data.items.push(/*dojo.mixin({ id: i+1 },*/ Json.items[i]);//);
		
			}		
				
					
			var store = new ItemFileWriteStore({data: data});
				
			store.comparatorMap = {};
			
			//store.comparatorMap["name"] = function(a, b){
			//	return compareItems(a, b, '.:');
			//}
			//store.comparatorMap["lastSeen"] = function(a, b){
			//	return compareItems(a, b, '.:');
			//}
			//store.comparatorMap["network"] = function(a, b){
			//	return compareItems(a, b, '.:');
			//}
			store.comparatorMap["mac"] = function(a, b){
				return compareItems(a, b, '.:');
			}
			store.comparatorMap["ip"] = function(a, b){
				return compareItems(a, b, '.:');
			}
			
			//store.comparatorMap["osName"] = function(a, b){
			//	//alert(a);
			//	return compareItems(a, b, '.:');
			//}
			
			
			if(registry.byId("localhostsDojoTable")){
				
				
				
				//registry.byId("localhostsDojoTable").setStore(store);
				
				//registry.byId("localhostsDojoTable").update();
				
				console.log("===============> tab LOCALHOSTS ALREADY existing ===> refreshing store ::::::: scroll position : "+registry.byId("localhostsDojoTable"));
				
				var store = registry.byId("localhostsDojoTable").store;
				
				for(var i =0; i< Json.items.length; i++){
					try{
						store.fetchItemByIdentity({ 'identity' : Json.items[i].ip,  onItem :  function (item ) {
							
																			for(var j=0; j< Json.content.length; j++){
																				switch (Json.content[j]+""){
																					case "ip":
																						//store.setValue(item, "ip", Json.items[i].ip);
																					break;
																					case "name":
																						store.setValue(item, "name", Json.items[i].name);
																					break;
																					case "osName":
																						store.setValue(item, "osName", Json.items[i].osName);
																					break;
																					case "mac":
																						store.setValue(item, "mac", Json.items[i].mac);
																					break;
																					case "lastSeen":
																						//var lastseen = store.getValue(item, 'lastSeen');
																						store.setValue(item, "lastSeen", Json.items[i].lastSeen);
																					break;
																					case "network":
																						store.setValue(item, "network", Json.items[i].network);
																					break;
																					case "arch64":
																						store.setValue(item, "arch64", Json.items[i].arch64);
																					break;
																					case "mobile":
																						store.setValue(item, "mobile", Json.items[i].mobile);
																					break;
																					default:
																						console.log("localhostsTabCompletion : new layout content :"+ Json.content[i]+":");
																					break;	
																				}
																				
																				
																			}
																			
																	}
						});
					}catch(e){
						//console.log(">>>>>>>>>>>>>>>> "+e+" >>>>> adding LOCALHOST item");
						store.newItem(Json.items[i]); 
						//registry.byId("localhostsDojoTable").setStore(store);
						console.log(" >>>>> ADDED LOCALHOST item : "+ JsonAlerts.items[i].ip)
					}
				}
				/*if(store === grid.store) { 
				       dojo.place('<p>store and grid.store reference the exact same object</p>', 'info', 'first');
				}
				       
				var modifyPlanet = function modifyPlanet() {       
					store.fetch({query : {planet : 'Zoron'},
						onItem : function (item ) {
							var humans = store.getValue(item, 'humanPop');
							humans += 200;
							store.setValue(item, 'humanPop', humans);
						}
					});
				}
					
				var deletePlanet = function deletePlanet() {
					store.fetchItemByIdentity({ 'identity' : 'Gaxula',  onItem :  function (item ) {
						if(item == null) {
						     dojo.place ('<p>You already deleted Gaxula, the idendifier could not be found so onItem was called with null which means the item does not exist. This only works when you call fetchItemByIdentity </p>', 'info', 'first')
						} else {
						    store.deleteItem(item);
						}
					}});
				}
					
				var addPlanet = function() {
					try {
					store.newItem({planet: 'Endron', humanPop : 40000, alienPop : 9000}); } catch (e) { dojo.place ('<p>You already added Endron, and since the identifier in the store is set to planet, each planet name must be unique and this causes an exception when you try to add it again.</p>', 'info', 'first')}
					
				}*/
    
			
			}else{
			
				console.log("===============> tab NOT existing ===> creating grid");
				
				
				
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

				
				/*set up layout*/
				var layout = [];
				
				for(var i=0; i<Json.content.length; i++){
					switch (Json.content[i]+""){
						case "ip":
							layout.push({'name': 'Ip Address', 'field': 'ip', 'width': 'auto'});
						break;
						case "name":
							layout.push({'name': 'Name', 'field': 'name', 'width': 'auto'});
						break;
						case "osName":
							layout.push({'name': 'OS Name', 'field': 'osName', 'width': 'auto',  formatter: function(osName, rowId){ 
															//alert(item.osName);
															var item = this.grid.getItem(rowId);
															var retour = "<table cellspacing=0 ><tr><td> <font size = '2'> "+item.osName+" </font> </td>";
															if(item.arch64 == "t") retour +=  "<td> <img src='images/64b.png'  title='64 bits'></img> </td>";
															if(item.mobile == "t") retour +=  "<td> <img src='images/mobile2.png' height='20' width='14' title='Mobile'></img> </td>";
															retour +=  "</tr></table>";
															/*var retour = "<font size='2' valign='middle'>"+item.osName+"</font>";
															if(item.arch64 == "t") retour +=  " &nbsp <img valign='middle' src='images/mobile.png' title='64 bits' height='20' width='13'/>";
															if(item.mobile == "t") retour +=  " &nbsp <img valign='middle' src='images/mobile.png' t='Mobile' height='20' width='13'/>";*/
															return retour;
														}
										});
						break;
						case "mac":
							if(Json.showMacAddresses)
								layout.push({'name': 'Mac Address', 'field': 'mac', 'width': 'auto',  formatter: function(mac){ 
															var retour = "<font size = '2' onmouseover = 'if(!this.title)this.title = resolveMacAddress(this.innerHTML); '>"+mac+"</font>";
															return retour;
														}
											});
						break;
						case "lastSeen":
							layout.push({'name': 'Last Activity', 'field': 'lastSeen', 'width': 'auto',  formatter: function(lastseen){ 
																					if(lastseen<60) return "< 1 minute";
																					var text = "";
																					var nbMonths = Math.floor(lastseen/(3600*24*7*30));
																					var nbWeeks = Math.floor((lastseen%(3600*24*7*30))/(3600*24*7));
																					var nbDays = Math.floor(((lastseen%(3600*24*7*30))%(3600*24*7))/(3600*24));
																					var nbHours = Math.floor((((lastseen%(3600*24*7*30))%(3600*24*7))%(3600*24))/(3600));
																					var nbMins = Math.floor(((((lastseen%(3600*24*7*30))%(3600*24*7))%(3600*24))%(3600))/60);
																					var retour = "> ";
																					if(nbMonths) retour+= nbMonths+" Month"+pluriel(nbMonths)+" ";
																					if(nbWeeks) retour+= nbWeeks+" week"+pluriel(nbWeeks)+" ";
																					if(nbDays) retour+= nbDays+" day"+pluriel(nbDays)+" ";
																					if(nbHours) retour+= nbHours+" hour"+pluriel(nbHours)+" ";
																					if(nbMins) retour+= nbMins+" minute"+pluriel(nbMins)+" ";
																					return retour;
																		}});
						break;
						case "network":
							layout.push({'name': 'Network', 'field': 'network', 'width': 'auto'});
						break;
						case "arch64":
							//layout.push({'name': 'Arch64', 'field': 'arch64', 'width': 'auto'});
						break;
						case "mobile":
							//layout.push({'name': 'Mobile', 'field': 'mobile', 'width': 'auto'});
						break;
						default:
							alert("localhostsTabCompletion : new layout content :"+ Json.content[i]+":");
						break;	
					}
				}
					
				/*layout.push({ name: "Action", field: "_item", 'width': 'auto',  formatter: function(item){ 
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
				});*/
				
				
				    /*programmatic menus*/
				     var menusObject = {
					 //headerMenu: new dijit.Menu(),
					 rowMenu: new dijit.Menu(),
					 rightClickedItem: null,
					 //cellMenu: new dijit.Menu(),
					 //selectedRegionMenu: new dijit.Menu()
				     };
				     //menusObject.headerMenu.addChild(new dijit.MenuItem({label: "Header Menu Item 1"}));
				     //menusObject.headerMenu.addChild(new dijit.MenuItem({label: "Header Menu Item 2"}));
				     //menusObject.headerMenu.addChild(new dijit.MenuItem({label: "Header Menu Item 3"}));
				     //menusObject.headerMenu.addChild(new dijit.MenuItem({label: "Header Menu Item 4"}));
				     //menusObject.headerMenu.startup();

				     
				     menusObject.rowMenu.addChild(new dijit.MenuItem({
																label: "Open clicked localhost",
																onClick: function(e){
																	addNewIpTab(menusObject.rightClickedItem.ip);
																	require(["dojo/ready", "dijit/registry"], function(ready, registry){
																		ready(function(){
																			registry.byId("LocalhostsTabContainer").resize();
																		});
																	});
																}}));
				     menusObject.rowMenu.addChild(new dijit.MenuItem({
																label: "Open selected localhost(s)",
																onClick: function(e){
																	var selectedRow = grid.selection.getSelected();
																	//alert(menusObject.selectedRow);
																	for(var i = 0; i< selectedRow.length; i++){
																		addNewIpTab(selectedRow[i].ip);
																	}
																	require(["dojo/ready", "dijit/registry"], function(ready, registry){
																		ready(function(){
																			registry.byId("LocalhostsTabContainer").resize();
																		});
																	});
																}
															}));
				     //menusObject.rowMenu.addChild(new dijit.MenuItem({label: "Row Menu Item 3"}));
				     //menusObject.rowMenu.addChild(new dijit.MenuItem({label: "Row Menu Item 4"}));
				     menusObject.rowMenu.startup();

				     //menusObject.cellMenu.addChild(new dijit.MenuItem({label: "Cell Menu Item 1"}));
				     //menusObject.cellMenu.addChild(new dijit.MenuItem({label: "Cell Menu Item 2"}));
				     //menusObject.cellMenu.addChild(new dijit.MenuItem({label: "Cell Menu Item 3"}));
				     //menusObject.cellMenu.addChild(new dijit.MenuItem({label: "Cell Menu Item 4"}));
				     //menusObject.cellMenu.startup();

				     //menusObject.selectedRegionMenu.addChild(new dijit.MenuItem({label: "Action 1 for Selected Region"}));
				     //menusObject.selectedRegionMenu.addChild(new dijit.MenuItem({label: "Action 2 for Selected Region"}));
				     //menusObject.selectedRegionMenu.addChild(new dijit.MenuItem({label: "Action 3 for Selected Region"}));
				     //menusObject.selectedRegionMenu.addChild(new dijit.MenuItem({label: "Action 4 for Selected Region"}));
				     //menusObject.selectedRegionMenu.startup();


					
				// modify existing grid or create new grid
				if(registry.byId('localhostsDojoTable')){
					//registry.byId('localhostsDojoTable').setStore(store);
					//registry.byId('localhostsDojoTable').startup();
				}else{
					/*create a new grid:*/			
					var grid = new EnhancedGrid({
						id: 'localhostsDojoTable',
						store: store,
						structure: layout,
						//onStyleRow: function(row){alert(row);},
						//rowSelector: "20px",
						//selectionMode: "extended",
						//onShow: function(){alert("OS"); },
						onDblClick: function(evt){
							var selectedRowIndex = this.selection.getSelected();
							for(var i = 0; i< selectedRowIndex.length; i++){
								//alert(selectedRow[i].ip);
								addNewIpTab(selectedRowIndex[i].ip);
							}
							require(["dojo/ready", "dijit/registry"], function(ready, registry){
								ready(function(){
									registry.byId("LocalhostsTabContainer").resize();
								});
							});
						},
						//onCellClick: function(e){alert("hi");},
						//onMouseEnter: function(e){alert("oME");},
						//onMouseLeave: function(e){alert("oML");},
						//onRowContextMenu: function(e){alert("jiiiii");},
						editable: false,
						loadingMessage: "Loading data... Please wait.",
						noDataMessage:  "No data found... ",
						selectable: true,
										sortFields: [{attribute: 'network', descending: false}, {attribute: 'ip', descending: false}],
						plugins: {
							/*pagination: {
								nestedSorting: true,
								pageSizes: ["100", "200","500","1000", "All"],
								defaultPageSize: 100,
								defaultSize: "50",
								description: true,
								sizeSwitch: true,
								pageStepper: true,
								gotoButton: true,
								//page step to be displayed
								maxPageStep: 5,
								//position of the pagination bar
								position: "bottom"
							},*/
							filter: {
								// Show the closeFilterbarButton at the filter bar
								closeFilterbarButton: false,
								// Set the maximum rule count to 5
								ruleCount: 5,
								// Set the name of the items
								itemsName: "Localhosts"
							},
							selector: {row: "multi", col: "disabled",cell: "disabled"},
							menus: menusObject
						}},
					document.getElementById('localhostsTableDiv'));
						
					aspect.before(grid, 'onRowContextMenu', function(e){
						var rowIndex = e.rowIndex;
						var colIndex = e.cellIndex;
						menusObject.rightClickedItem = grid.getItem(rowIndex);
						//if(menusObject.rightClickedItem == null || menusObject.rightClickedItem.length==0) grid.plugin('menus').option.rowMenu.getChildren()[1].disabled = true;
						//else grid.plugin('menus').option.rowMenu.getChildren()[1].disabled = false;
						if(grid.selection.getSelected().length == 0)
							grid.plugin('menus').option.rowMenu.getChildren()[1].attr("disabled", true);
						else
							grid.plugin('menus').option.rowMenu.getChildren()[1].attr("disabled", false);
						
					});
					
					
					/*Call startup() to render the grid*/
					grid.startup();
					
					
				}
			}
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



//function localhostsTreeFlowsCompletion(){
	/*
			var xhr = createXhrObject();
			
			xhr.open("GET", askWhere + "browseCurrFlowByLocalHost.json", false);
	
			xhr.send(null);
				
				if (xhr.readyState == 4) 
				{
					
					if (xhr.status == 200) 
					{
						try{
							var JsonTreeFlows = jsonFormModifier(eval("(" + xhr.responseText + ")"));
						}catch(e){
							alert(e);
						}
						
						try{
							
							require([ "dojo/store/Memory", "dojo/store/Observable", "dijit/tree/ObjectStoreModel", "dijit/Tree", "dojo/parser", "dijit/registry", "dojo/data/ItemFileWriteStore", "dijit/tree/ForestStoreModel", "dijit/Tree", "dojo/aspect", "dojo/domReady!"], function(Memory, Observable, ObjectStoreModel, Tree, parser, registry, ItemFileWriteStore, ForestStoreModel, Tree, aspect){
								
								var data = new Array();
								data.push({ id: 'localhosts', name:'Localhosts', type:'root', population: JsonTreeFlows.items.length});
								
								for(var i=0; i<JsonTreeFlows.items.length; i++){
									data.push({ id: JsonTreeFlows.items[i].ip, name: JsonTreeFlows.items[i].ip, type: 'localhost', parent: 'localhosts' });
								}
							
								// Create test store, adding a getChildren() method needed by the model
								myStore = new Memory({
									data: data,
									getChildren: function(object){
										// Add a getChildren() method to store for the data model where
										// children objects point to their parent (aka relational model)
										return this.query({parent: object.id});
									}
								});

								// Wrap the store in Observable so that updates to the store are reflected to the Tree
								myStore = new Observable(myStore);

								var myModel = new ObjectStoreModel({
									store: myStore,
									query: { id: "localhosts" }
								});

								parser.parse();
								
								// Create the Tree.
								var tree = new Tree({
									id : "localhostsFlowsTree",
									//showRoot: false, 	
									model: myModel
								});
								
								
								aspect.before(tree, "onOpen", function(item, node){
									switch(item.type+""){
										case "localhost":
											if(node.hasChildren()){
												modifyTreeOfLocalhost(item, node);
											}else{
												addTreeToLocalhost(item, node);
											}
										break;
										case "externalhost":
											if(node.hasChildren()){
												modifyTreeOfExternalhost(item, node);
											}else{
												addTreeToExternalhost(item, node);
											}
										break;
										default:
											alert("ChargerLogs : new severity :"+ JsonData.legend[i]+":");
										break;	
									}
								});

								
								registry.byId("DivDataPlusTree").addChild(tree);
								
								registry.byId("DivDataPlusTree").startup();
							});
							
							
							
						}catch(e){
							if(JsonTreeFlows.errMsg){
								dialogAlert.domNode.getElementsByTagName("textarea")[0] += "\ngetLogs.json Bug Report: "+JsonTreeFlows.errMsg;
								
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
							}else{
								alert(e);
							}
						}
					
					}else{
						dialogAlert.show();
					}
				}else if (xhr.readyState == 0) 
				{
					//alert("Non initialisé");
				}else if (xhr.readyState == 1) 
				{
					//alert("Ouvert");
				}else if (xhr.readyState == 2) 
				{
				}else if (xhr.readyState == 3) 
				{
				}
	*/	
		
//}


/*
function modifyTreeOfLocalhost(item, node){
												alert("localhost has children: "+item.id);
	
}



function addTreeToLocalhost(item, node){
												alert("localhost no children: "+item.id);
	
			var xhr = createXhrObject();
			
			xhr.open("GET", askWhere + "browseCurrFlowByExtHost.json?ip="+item.id, false);
	
			xhr.send(null);
				
				if (xhr.readyState == 4) 
				{
					
					if (xhr.status == 200) 
					{
						try{
							var JsonTreeFlows = jsonFormModifier(eval("(" + xhr.responseText + ")"));
						}catch(e){
							alert(e);
						}
						
						try{
							
							require([ "dojo/store/Memory", "dojo/store/Observable", "dijit/tree/ObjectStoreModel", "dijit/Tree", "dojo/parser", "dijit/registry", "dojo/data/ItemFileWriteStore", "dijit/tree/ForestStoreModel", "dijit/Tree", "dojo/aspect", "dojo/domReady!"], function(Memory, Observable, ObjectStoreModel, Tree, parser, registry, ItemFileWriteStore, ForestStoreModel, Tree, aspect){
							
								for(var i=0; i<JsonTreeFlows.items.length; i++){
									alert(JsonTreeFlows.items[i].ipExtern);
									myStore.add({ id: item.id+"TO"+JsonTreeFlows.items[i].ipExtern, name: JsonTreeFlows.items[i].ipExtern, type: 'externalhost', parent: item.id });	
								}
							
								var data = new Array();
								data.push({ id: 'localhosts', name:'Localhosts', type:'root', population: JsonTreeFlows.items.length});
								
								for(var i=0; i<JsonTreeFlows.items.length; i++){
									data.push({ id: JsonTreeFlows.items[i].ip, name: JsonTreeFlows.items[i].ip, type: 'localhost', parent: 'localhosts' });
								}
							
								// Create test store, adding a getChildren() method needed by the model
								myStore = new Memory({
									data: data,
									getChildren: function(object){
										// Add a getChildren() method to store for the data model where
										// children objects point to their parent (aka relational model)
										return this.query({parent: object.id});
									}
								});

								// Wrap the store in Observable so that updates to the store are reflected to the Tree
								myStore = new Observable(myStore);

								var myModel = new ObjectStoreModel({
									store: myStore,
									query: { id: "localhosts" }
								});

								parser.parse();
								
								// Create the Tree.
								var tree = new Tree({
									id : "localhostsFlowsTree",
									//showRoot: false, 	
									model: myModel
								});
								
								
								aspect.before(tree, "onOpen", function(item, node){
									if(node.hasChildren()){
										alert("no children");
										modifyTreeOfLocalhost(item, node);
									}else{
										alert("has children");
										addTreeToLocalhost(item, node);
									}
								});
								
								
								
								registry.byId("DivDataPlusTree").addChild(tree);
								
								registry.byId("DivDataPlusTree").startup();
							
							
								//registry.byId("localhostsFlowsTree").startup();
								
							});
							
							
							
						}catch(e){
							if(JsonTreeFlows.errMsg){
								dialogAlert.domNode.getElementsByTagName("textarea")[0] += "\ngetLogs.json Bug Report: "+JsonTreeFlows.errMsg;
								
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
							}else{
								alert(e);
							}
						}
					
					}else{
						dialogAlert.show();
					}
				}else if (xhr.readyState == 0) 
				{
					//alert("Non initialisé");
				}else if (xhr.readyState == 1) 
				{
					//alert("Ouvert");
				}else if (xhr.readyState == 2) 
				{
				}else if (xhr.readyState == 3) 
				{
				}
		
}



function modifyTreeOfExternalhost(item, node){
												alert("externalhost has children: "+item.id);
}



function addTreeToExternalhost(item, node){
												alert("externalhost no children: "+item.id);
	
			var ipLoc = item.id.split("TO")[0];
			var ipExt = item.id.split("TO")[1];
	
	
			var xhr = createXhrObject();
			//browseCurrFlowByProtoPorts.json?iploc=134.158.40.158&ipext=6.6.6.6
			xhr.open("GET", askWhere + "browseCurrFlowByProtoPorts.json?iploc="+ipLoc+"&ipext="+ipExt, false);
	
			xhr.send(null);
				
				if (xhr.readyState == 4) 
				{
					
					if (xhr.status == 200) 
					{
						try{
							var JsonTreeFlows = jsonFormModifier(eval("(" + xhr.responseText + ")"));
						}catch(e){
							alert(e);
						}
						
						try{
							
							require([ "dojo/store/Memory", "dojo/store/Observable", "dijit/tree/ObjectStoreModel", "dijit/Tree", "dojo/parser", "dijit/registry", "dojo/data/ItemFileWriteStore", "dijit/tree/ForestStoreModel", "dijit/Tree", "dojo/aspect", "dojo/domReady!"], function(Memory, Observable, ObjectStoreModel, Tree, parser, registry, ItemFileWriteStore, ForestStoreModel, Tree, aspect){
							
								for(var i=0; i<JsonTreeFlows.items.length; i++){
									alert(JsonTreeFlows.items[i].portLoc);
									myStore.add({ id: item.id+"-"+JsonTreeFlows.items[i].portLoc, name: "Proto: "+JsonTreeFlows.items[i].ipProto+" - PortLoc: "+JsonTreeFlows.items[i].portLoc+" - PortExt: "+JsonTreeFlows.items[i].portExt, type: 'portLocal', parent: item.id });	
								}
							
								var data = new Array();
								data.push({ id: 'localhosts', name:'Localhosts', type:'root', population: JsonTreeFlows.items.length});
								
								for(var i=0; i<JsonTreeFlows.items.length; i++){
									data.push({ id: JsonTreeFlows.items[i].ip, name: JsonTreeFlows.items[i].ip, type: 'localhost', parent: 'localhosts' });
								}
							
								// Create test store, adding a getChildren() method needed by the model
								myStore = new Memory({
									data: data,
									getChildren: function(object){
										// Add a getChildren() method to store for the data model where
										// children objects point to their parent (aka relational model)
										return this.query({parent: object.id});
									}
								});

								// Wrap the store in Observable so that updates to the store are reflected to the Tree
								myStore = new Observable(myStore);

								var myModel = new ObjectStoreModel({
									store: myStore,
									query: { id: "localhosts" }
								});

								parser.parse();
								
								// Create the Tree.
								var tree = new Tree({
									id : "localhostsFlowsTree",
									//showRoot: false, 	
									model: myModel
								});
								
								
								aspect.before(tree, "onOpen", function(item, node){
									if(node.hasChildren()){
										alert("no children");
										modifyTreeOfLocalhost(item, node);
									}else{
										alert("has children");
										addTreeToLocalhost(item, node);
									}
								});
								
								
								
								registry.byId("DivDataPlusTree").addChild(tree);
								
								registry.byId("DivDataPlusTree").startup();
							
							
								//registry.byId("localhostsFlowsTree").startup();
								
							});
							
							
							
						}catch(e){
							if(JsonTreeFlows.errMsg){
								dialogAlert.domNode.getElementsByTagName("textarea")[0] += "\ngetLogs.json Bug Report: "+JsonTreeFlows.errMsg;
								
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
							}else{
								alert(e);
							}
						}
					
					}else{
						dialogAlert.show();
					}
				}else if (xhr.readyState == 0) 
				{
					//alert("Non initialisé");
				}else if (xhr.readyState == 1) 
				{
					//alert("Ouvert");
				}else if (xhr.readyState == 2) 
				{
				}else if (xhr.readyState == 3) 
				{
				}
		
}
*/