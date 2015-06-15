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

	
	xhr.open("GET",   "dynamic/globalTop10NbExtHosts.json?"+document.getElementById(ongletActif()).getAttribute('params'), true);
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

	
	xhr.open("GET",   "dynamic/globalNbExternalHosts.json?"+document.getElementById(ongletActif()).getAttribute('params'), true);
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
	
	
	xhr.open("GET",   "dynamic/globalNbLocalHosts.json?"+document.getElementById(ongletActif()).getAttribute('params'), true);
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

	
	xhr.open("GET",   "dynamic/hostNbDiffHosts.json?"+document.getElementById(ongletActif()).getAttribute('params'), true);
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
														clickToPie(Chart13[ongletActif()].axes.x.labels[evt.index].text, ongletActif(), parseInt(evt.run.data[evt.index].item), evt.run.data[evt.index].item.split("/")[1].slice(0,3), "<", sens, false, "dynamic/hostExtHostsService"+PACorTRAF+".json", "loc", "", "");
													else if(evt.run.data[evt.index].tooltip.split("(").length == 2)
														clickToPie(Chart13[ongletActif()].axes.x.labels[evt.index].text, ongletActif(), parseInt(evt.run.data[evt.index].item), evt.run.data[evt.index].item.split("/")[1].slice(0,3), "<", sens, false, "dynamic/hostExtHostsService"+PACorTRAF+".json", "loc", "", "");
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
														clickToPie(Chart14[ongletActif()].axes.x.labels[evt.index].text, ongletActif(), parseInt(evt.run.data[evt.index].item), evt.run.data[evt.index].item.split("/")[1].slice(0,3), ">", sens, false, "dynamic/hostExtHostsService"+PACorTRAF+".json", "ext", "", "");
													else if(evt.run.data[evt.index].tooltip.split("(").length == 2)
														clickToPie(Chart14[ongletActif()].axes.x.labels[evt.index].text, ongletActif(), parseInt(evt.run.data[evt.index].item), evt.run.data[evt.index].item.split("/")[1].slice(0,3), ">", sens, false, "dynamic/hostExtHostsService"+PACorTRAF+".json", "ext", "", "");
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

