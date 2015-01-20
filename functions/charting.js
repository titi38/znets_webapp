///////////////////////////////////////////////////////////////////////////////////////////////////////  FONCTION DE CONSTRUCTION DU GRAPHE 1  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



 makeChart1= function(){
	 
	//alert(jsonNameFromTreePath(ongletActif()));

	var xhr = createXhrObject();
	 
	
	xhr.open("GET", askWhere +  jsonNameFromTreePath(ongletActif())+document.getElementById(ongletActif()).getAttribute('params') , true);
	xhr.onreadystatechange=function() 
	{
		if (xhr.readyState == 4) 
		{
			if (xhr.status == 200) 
			{
				
				JsonObjNetwork[1][ongletActif()] = eval("(" + xhr.responseText + ")");
				JsonObjNetwork[1][ongletActif()] = jsonChartingModifier( JsonObjNetwork[1][ongletActif()] );
				
				try{
					
					require([ "dijit/registry", "dojox/charting/Chart2D", "dojox/charting/action2d/Tooltip", "dojo/dom", "dojox/form/RangeSlider"], function(registry, Chart2D, Tooltip, dom){
						ChartNetwork[1][ongletActif()] = new Chart2D("chart1"+ongletActif());
						//Chart1[ongletActif()].setAttribute("toJson", JsonObjNetwork[1][ongletActif()])
					
						
						var up = new Array();
						var down = new Array();
						
						/*try{// ajout automatique des s�ries
							curTab = JsonObjNetwork[1][ongletActif()].data[2].tab;
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
						alert( JsonObjNetwork[1][ongletActif()].data[2].tab.length+" ::: "+down.length+" ::: "+up.length)
						*/
						
						// ajout automatique des s�ries
						if(jsonNameFromTreePath(ongletActif()).indexOf("Protocole") == -1){
							var i = 2;
							
							/*var testtt= "";
							var modifiedJson = JsonObjNetwork[1][ongletActif()];
							//alert(curTab[2].name+"-"+curTab[2].type);
							
							for(var j = 0; j < modifiedJson.data.length; j++){
								//var curj = curTab.length-(1+j);
								testtt += "\n"+modifiedJson.data[j].name+"-"+modifiedJson.data[j].type;
								//modifiedJson.data[j] = JsonObjNetwork[1][ongletActif()].data[curj]
								
							}
							alert(testtt);
								testtt= "";
							for(var j = 0; j < JsonObjNetwork[1][ongletActif()].data.length; j++){
								//var curj = curTab.length-(1+j);
								testtt += "\n"+ JsonObjNetwork[1][ongletActif()].data[j].name+"-"+ JsonObjNetwork[1][ongletActif()].data[j].type;
								//modifiedJson.data[j] = JsonObjNetwork[1][ongletActif()].data[curj]
								
							}
							alert(testtt);
								testtt= "";
							for(var j = 2; j < modifiedJson.data.length-2; j++){
								var curj = modifiedJson.data.length-(1+j);
								testtt += "\n"+"j = "+j+" ::::::::::: "+j+" : "+curj+" ::::::::::: "+modifiedJson.data[j].name+"-"+modifiedJson.data[j].type+" <==== "+JsonObjNetwork[1][ongletActif()].data[curj].name+"-"+JsonObjNetwork[1][ongletActif()].data[curj].type;
								//JsonObjNetwork[1][ongletActif()].data[j] = curTab[curj];
								modifiedJson.data[j] = JsonObjNetwork[1][ongletActif()].data[curj];
							}
							alert(testtt);*/
							
							while(JsonObjNetwork[1][ongletActif()].data[i] != null){
								if( JsonObjNetwork[1][ongletActif()].data[i].type ==="IN"){
									curTab = JsonObjNetwork[1][ongletActif()].data[i].tab;
									for(var j = 0; j < curTab.length; j++){
										curTab[j].y = -curTab[j].y;
										if(down[j] != null)curTab[j].y += down[j];
										down[j] = curTab[j].y ;
									}
									ChartNetwork[1][ongletActif()].addSeries(JsonObjNetwork[1][ongletActif()].data[i].name+JsonObjNetwork[1][ongletActif()].data[i].type, curTab, {plot : "default"});
									i++;
								}else{
									curTab = JsonObjNetwork[1][ongletActif()].data[i].tab;
									for(var j = 0; j < curTab.length; j++){
										if(up[j] != null)curTab[j].y += up[j];
										up[j] = curTab[j].y ;
									}
									ChartNetwork[1][ongletActif()].addSeries(JsonObjNetwork[1][ongletActif()].data[i].name+JsonObjNetwork[1][ongletActif()].data[i].type, curTab, {plot : "default"});
									i++;
								}
							};
							
						}else{
							try{// ajout automatique des s�ries et des couleurs pr�d�finies
									
								var ordre = ["OTHERS", "UDP", "TCP"];
									
								for(var k=0 ; k< ordre.length ; k++){
									
									var i = 2;
									
									while(JsonObjNetwork[1][ongletActif()].data[i] != null){
										
										if(JsonObjNetwork[1][ongletActif()].data[i].name == ordre[k]){
											switch(JsonObjNetwork[1][ongletActif()].data[i].name){
												case"OTHERS":
													var CouleurSerie = Vcolor[0];
												break;
												case"UDP":
													var CouleurSerie = Vcolor[1];
												break;
												case"TCP":
													var CouleurSerie = Vcolor[2];
												break;
												default:
													alert("charting.js : unknown protocole json data name")
												break;
											}
											
											/*if(2<=i && i<=3)var CouleurSerie = Vcolor[0];
											else if(4<=i && i<=5)var CouleurSerie = Vcolor[1];
											else var CouleurSerie = Vcolor[2];*/
											
											if( JsonObjNetwork[1][ongletActif()].data[i].type ==="IN"){
												curTab = JsonObjNetwork[1][ongletActif()].data[i].tab;
												for(var j = 0; j < curTab.length; j++){
													curTab[j].y = -curTab[j].y;
													if(down[j] != null)curTab[j].y += down[j];
													down[j] = curTab[j].y ;
												}
												ChartNetwork[1][ongletActif()].addSeries(JsonObjNetwork[1][ongletActif()].data[i].name+JsonObjNetwork[1][ongletActif()].data[i].type, curTab, {plot : "default", stroke: "black", fill: CouleurSerie});
												
											}else{
												curTab = JsonObjNetwork[1][ongletActif()].data[i].tab;
												for(var j = 0; j < curTab.length; j++){
													if(up[j] != null)curTab[j].y += up[j];
													up[j] = curTab[j].y ;
												}
												ChartNetwork[1][ongletActif()].addSeries(JsonObjNetwork[1][ongletActif()].data[i].name+JsonObjNetwork[1][ongletActif()].data[i].type, curTab, {plot : "default", stroke: "black", fill: CouleurSerie});
												
											}
										}
										i++;
									}
									
								}
							}catch(e){console.log("error : "+e+"\n in 'charting.js' function ! Alert raised at line :"+new Error().lineNumber);}
						}

					
						if(JsonObjNetwork[1][ongletActif()].data[1].legend.length>24){
							// ajout de l'axe x
							ChartNetwork[1][ongletActif()].addAxis("x", {
								labels: JsonObjNetwork[1][ongletActif()].data[1].legend,
								majorTickStep:	2

							});
						}else{
							// ajout de l'axe x
							ChartNetwork[1][ongletActif()].addAxis("x", {
								labels: JsonObjNetwork[1][ongletActif()].data[1].legend,
								majorTickStep:	2
							});					
						}
						

						
						// ajout des axes verticaux gauche et droite
						addVerticalAxis(ChartNetwork[1][ongletActif()], down, up, JsonObjNetwork[1][ongletActif()].data[0].unit, JsonObjNetwork[1][ongletActif()].data[0].unitD, JsonObjNetwork[1][ongletActif()].data[0].factD);
						
						
						// définition des graphes affichés
						ChartNetwork[1][ongletActif()].addPlot("default", {type: "Columns", gap:80/JsonObjNetwork[1][ongletActif()].data[1].legend.length, hAxis: "x", vAxis: "y"});
						
						

						// ajout du quadrillage
						ChartNetwork[1][ongletActif()].addPlot("grid", {type: "Grid",
							hAxis: "x",
							vAxis: "y",
							vMajorLines: false,
							vMinorLines:false,
							hMajorLines: false,
							hMinorLines:false
						});
						
						
						
						var anim_cE = new Tooltip(ChartNetwork[1][ongletActif()], "default");


					
						// dessin du graphe
						ChartNetwork[1][ongletActif()].render();


						// Setting zoom-bar	
						setZoomBar( registry.byId("zoomTraffic"+ongletActif()), ChartNetwork[1][ongletActif()] );
						
						
						
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
						//addZoomZero(ChartNetwork[1][ongletActif()]);

						//alert('ri');
						mySetTheme(ChartNetwork[1][ongletActif()]);
						//ChartNetwork[1][ongletActif()].theme.plotarea.fill.y2;
						
						
						// definir le type de curseur quand l'utilisateur pointe sur un 'clickable'
						setCursors("chart1"+ongletActif(), "rect");
						
						
		
						// Cr�ation manuelle de la legende
						if(jsonNameFromTreePath(ongletActif()).indexOf("Protocole") != -1){
							// Cr�ation manuelle de la legende des protocoles
							creerLegendeProtocole(JsonObjNetwork[1][ongletActif()], "1", ongletActif(), Vcolor);
						}else{
							// Cr�ation manuelle de la legende
							creerLegende(JsonObjNetwork[1][ongletActif()], "1", ongletActif(), 17);
						}
						
		
						document.getElementById("zoomTraffic"+ongletActif()).style.visibility="visible";
						document.getElementById("legend1"+ongletActif()).style.visibility="visible";
						
						
						
						///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
						// definition des evens click et passage sur graphe
						
										//colors = [];
														
										if(jsonNameFromTreePath(ongletActif()).indexOf("Hosts") != -1){
											ChartNetwork[1][ongletActif()].connectToPlot( "default", function(evt){
												if(evt.type === "onclick"){
													if(evt.run.data[evt.index].y<0) var sens = "inc";
													else var sens = "out";
													clickToPie(ChartNetwork[1][ongletActif()].axes.x.labels[evt.index].text, evt.run.data[evt.index].item, "", "", "", sens, false, "netExtHostsTop10HostsTraffic.json", "", "", "");
												};
											});
											setTimeout(function(){ChartNetwork[1][ongletActif()].connectToPlot( "default",  function(evt){ eventMouse(evt, "1", ongletActif());});},500);
										}else if(jsonNameFromTreePath(ongletActif()).indexOf("Protocoles") != -1){
											ChartNetwork[1][ongletActif()].connectToPlot( "default", function(evt){
												if(evt.type === "onclick"){
													if(evt.run.data[evt.index].y<0) var sens = "inc";
													else var sens = "out";
													clickToPie(ChartNetwork[1][ongletActif()].axes.x.labels[evt.index].text, "", "", evt.run.name.slice(0,3), "", sens, true, "netLocHostsProtoTraffic.json", "", "", "");
												};
											})
										}
										
										
									//	netExtHostsTop10appTraffic.json
									//	netExtHostsTop10appPackets.json
									
									//	netLocHostsTop10appPackets.json
										
										else if(jsonNameFromTreePath(ongletActif()).indexOf("Country") != -1){
											ChartNetwork[1][ongletActif()].connectToPlot( "default", function(evt){
												if(evt.type === "onclick"){
													if(evt.run.data[evt.index].y<0) var sens = "inc";
													else var sens = "out";
													clickToPie(ChartNetwork[1][ongletActif()].axes.x.labels[evt.index].text, "", "", "", "", sens, true, "netLocHostsTop10CountryTraffic.json", "", evt.run.data[evt.index].item.split("(")[0], "");
													dijit.byId("SelectCountry").setAttribute( 'value' , evt.run.data[evt.index].item.split("(")[0] );
												};
											});
											setTimeout(function(){ChartNetwork[1][ongletActif()].connectToPlot( "default",  function(evt){ eventMouse(evt, "1", ongletActif());});},500);
										}
										
										
										else if(jsonNameFromTreePath(ongletActif()).indexOf("as") != -1){
											ChartNetwork[1][ongletActif()].connectToPlot( "default", function(evt){
												if(evt.type === "onclick"){
													if(evt.run.data[evt.index].y<0) var sens = "inc";
													else var sens = "out";
													clickToPie(ChartNetwork[1][ongletActif()].axes.x.labels[evt.index].text, "", "", "", "", sens, true, "netLocHostsTop10asTraffic.json", "", "", evt.run.data[evt.index].item.split("(")[1].split(")")[0]);
													dijit.byId("SelectCountry").setAttribute( 'value' , evt.run.data[evt.index].item.split("(")[0] );
												};
											});
											setTimeout(function(){ChartNetwork[1][ongletActif()].connectToPlot( "default",  function(evt){ eventMouse(evt, "1", ongletActif());});},500);
										}
										
										
										
										else if(jsonNameFromTreePath(ongletActif()).indexOf("app") != -1){
											ChartNetwork[1][ongletActif()].connectToPlot( "default", function(evt){
												if(evt.type === "onclick"){
													if(evt.run.data[evt.index].y<0) var sens = "inc";
													else var sens = "out";
													
													clickToPie(ChartNetwork[1][ongletActif()].axes.x.labels[evt.index].text, "", "", "", "", sens, true, "netLocHostsTop10appTraffic.json", "", "", evt.run.data[evt.index].item.split("(")[1].split(")")[0],true);
													dijit.byId("SelectCountry").setAttribute( 'value' , evt.run.data[evt.index].item.split("(")[0] );
												};
											});
											setTimeout(function(){ChartNetwork[1][ongletActif()].connectToPlot( "default",  function(evt){ eventMouse(evt, "1", ongletActif());});},500);
										}
										
										
										
										else {}
														
						
									///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
						// refresh tab containers for a proper view of elements/widgets
						presenteContainerProperly();
						
						unLoading();
						
					});
					
				}catch(e){
					console.log("error : "+e+"\n in 'charting.js' function ! Alert raised at line :"+new Error().lineNumber);
					
					if(JsonObjNetwork[1][ongletActif()].errMsg)alert("Json Bug Report: "+JsonObjNetwork[1][ongletActif()].errMsg);	
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
			
			//unLoading();
			
		}
		
	}
	xhr.send(null);

	//unLoading();
	
	
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////  FIN DE FONCTION GRAPHE 1  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////////////////////////////////////////////////  FONCTION DE CONSTRUCTION DU GRAPHE 2  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



makeChart2 = function(){

	var xhr = createXhrObject();

	
	xhr.open("GET", askWhere +  jsonNameFromTreePath(ongletActif())+document.getElementById(ongletActif()).getAttribute('params'), true);
	xhr.onreadystatechange=function() 
	{
		if (xhr.readyState == 4) 
		{
			if (xhr.status == 200)
			{
					
				JsonObjNetwork[2][ongletActif()] = eval("(" + xhr.responseText + ")");
				JsonObjNetwork[2][ongletActif()] = jsonChartingModifier( JsonObjNetwork[2][ongletActif()] );
			
				try{
					
					require([ "dijit/registry", "dojox/charting/Chart2D", "dojox/charting/action2d/Tooltip", "dojo/dom", "dojox/form/RangeSlider"], function(registry, Chart2D, Tooltip, dom){
						ChartNetwork[2][ongletActif()] = new Chart2D("chart2"+ongletActif());
							
										
						var up = new Array();
						var down = new Array();
						
						// ajout automatique des s�ries
						if(jsonNameFromTreePath(ongletActif()).indexOf("Protocole") == -1){
							var i = 2;
							while(JsonObjNetwork[2][ongletActif()].data[i] != null){
								if( JsonObjNetwork[2][ongletActif()].data[i].type ==="IN"){
									curTab = JsonObjNetwork[2][ongletActif()].data[i].tab;
									for(var j = 0; j < curTab.length; j++){
										curTab[j].y = -curTab[j].y;
										if(down[j] != null)curTab[j].y += down[j];
										down[j] = curTab[j].y ;
									}
									ChartNetwork[2][ongletActif()].addSeries(JsonObjNetwork[2][ongletActif()].data[i].name+JsonObjNetwork[2][ongletActif()].data[i].type, curTab, {plot : "default"});
									i++;
								}else{
									curTab = JsonObjNetwork[2][ongletActif()].data[i].tab;
									for(var j = 0; j < curTab.length; j++){
										if(up[j] != null)curTab[j].y += up[j];
										up[j] = curTab[j].y ;
									}
									ChartNetwork[2][ongletActif()].addSeries(JsonObjNetwork[2][ongletActif()].data[i].name+JsonObjNetwork[2][ongletActif()].data[i].type, curTab, {plot : "default"});
									i++;
								}
							};
							
						}else{
							try{// ajout automatique des s�ries et des couleurs pr�d�finies
								
								var ordre = ["OTHERS", "UDP", "TCP"];
									
								for(var k=0 ; k< ordre.length ; k++){
									
									var i = 2;
									
									while(JsonObjNetwork[2][ongletActif()].data[i] != null){
										
										if(JsonObjNetwork[2][ongletActif()].data[i].name == ordre[k]){
											switch(JsonObjNetwork[2][ongletActif()].data[i].name){
												case"OTHERS":
													var CouleurSerie = Vcolor[0];
												break;
												case"UDP":
													var CouleurSerie = Vcolor[1];
												break;
												case"TCP":
													var CouleurSerie = Vcolor[2];
												break;
												default:
													alert("charting.js : unknown protocole json data name")
												break;
											}
											
											/*if(2<=i && i<=3)var CouleurSerie = Vcolor[0];
											else if(4<=i && i<=5)var CouleurSerie = Vcolor[1];
											else var CouleurSerie = Vcolor[2];*/
											
											if( JsonObjNetwork[2][ongletActif()].data[i].type ==="IN"){
												curTab = JsonObjNetwork[2][ongletActif()].data[i].tab;
												for(var j = 0; j < curTab.length; j++){
													curTab[j].y = -curTab[j].y;
													if(down[j] != null)curTab[j].y += down[j];
													down[j] = curTab[j].y ;
												}
												ChartNetwork[2][ongletActif()].addSeries(JsonObjNetwork[2][ongletActif()].data[i].name+JsonObjNetwork[2][ongletActif()].data[i].type, curTab, {plot : "default", stroke: "black", fill: CouleurSerie});
												
											}else{
												curTab = JsonObjNetwork[2][ongletActif()].data[i].tab;
												for(var j = 0; j < curTab.length; j++){
													if(up[j] != null)curTab[j].y += up[j];
													up[j] = curTab[j].y ;
												}
												ChartNetwork[2][ongletActif()].addSeries(JsonObjNetwork[2][ongletActif()].data[i].name+JsonObjNetwork[2][ongletActif()].data[i].type, curTab, {plot : "default", stroke: "black", fill: CouleurSerie});
												
											}
										}
										i++;
									}
								}
							}catch(e){console.log("error : "+e+"\n in 'charting.js' function ! Alert raised at line :"+new Error().lineNumber);}
						}
						
						
						if(JsonObjNetwork[2][ongletActif()].data[1].legend.length>24){
							// ajout de l'axe x
							ChartNetwork[2][ongletActif()].addAxis("x", { 
								labels: JsonObjNetwork[2][ongletActif()].data[1].legend,
								majorTickStep:	2

							});
						}else{
							// ajout de l'axe x
							ChartNetwork[2][ongletActif()].addAxis("x", { 
								labels: JsonObjNetwork[2][ongletActif()].data[1].legend
								majorTickStep:	2

							});						
						}
			
						

						// définition des graphes affichés
						ChartNetwork[2][ongletActif()].addPlot("default", {type: "Columns", gap:80/JsonObjNetwork[2][ongletActif()].data[1].legend.length, hAxis: "x", vAxis: "y"});
						

						// ajouter l'axe vertical de droite
						addVerticalAxis(ChartNetwork[2][ongletActif()], down, up, JsonObjNetwork[2][ongletActif()].data[0].unit, JsonObjNetwork[2][ongletActif()].data[0].unitD, JsonObjNetwork[2][ongletActif()].data[0].factD);
						
						
						// ajout du quadrillage
						ChartNetwork[2][ongletActif()].addPlot("grid", {type: "Grid",
							hAxis: "x",
							vAxis: "y",
							vMajorLines: false,
							vMinorLines:false,
							hMajorLines: false,
							hMinorLines:false
						});
						
							
						
						var anim_cE = new Tooltip(ChartNetwork[2][ongletActif()], "default");
			
						
						
						// dessin du graphe
						ChartNetwork[2][ongletActif()].render();
						
						
						// graduation minimale du zoom
						//addZoomZero(ChartNetwork[2][ongletActif()]);

						
						mySetTheme(ChartNetwork[2][ongletActif()]);
						//ChartNetwork[1][ongletActif()].theme.plotarea.fill.y2;

						// Setting zoom-bar	
						setZoomBar( registry.byId("zoomPackets"+ongletActif()) , ChartNetwork[2][ongletActif()] );
						
						
						// definir le type de curseur quand l'utilisateur pointe sur un 'clickable'
						setCursors("chart2"+ongletActif(), "rect");
						
						
						
						
						// Cr�ation manuelle de la legende
						if(jsonNameFromTreePath(ongletActif()).indexOf("Protocole") != -1){
							// Cr�ation manuelle de la legende des protocoles
							creerLegendeProtocole(JsonObjNetwork[2][ongletActif()], "2", ongletActif(), Vcolor);
						}else{
							// Cr�ation manuelle de la legende
							creerLegende(JsonObjNetwork[2][ongletActif()], "2", ongletActif(), 17);
						}
						
						document.getElementById("zoomPackets"+ongletActif()).style.visibility="visible";
						document.getElementById("legend2"+ongletActif()).style.visibility="visible";
						
						
						
						
						///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
						// definition des evens click et passage sur graphe
						
										//colors = [];
										
										if(jsonNameFromTreePath(ongletActif()).indexOf("Hosts") != -1){
											ChartNetwork[2][ongletActif()].connectToPlot( "default", function(evt){
												if(evt.type === "onclick"){
													if(evt.run.data[evt.index].y<0) var sens = "inc";
													else var sens = "out";
													clickToPie(ChartNetwork[2][ongletActif()].axes.x.labels[evt.index].text, evt.run.data[evt.index].item, "", "", "", sens, false, "netExtHostsTop10HostsPackets.json", "", "", "");
												};
											});
											setTimeout(function(){ChartNetwork[2][ongletActif()].connectToPlot( "default",  function(evt){ eventMouse(evt, "2", ongletActif());});},500);
										}else if(jsonNameFromTreePath(ongletActif()).indexOf("Protocoles") != -1){
											ChartNetwork[2][ongletActif()].connectToPlot( "default", function(evt){
												if(evt.type === "onclick"){
													if(evt.run.data[evt.index].y<0) var sens = "inc";
													else var sens = "out";
													clickToPie(ChartNetwork[2][ongletActif()].axes.x.labels[evt.index].text, "", "", evt.run.name.slice(0,3), "", sens, true, "netLocHostsProtoPackets.json", "", "", "");
												};
											})
										}
										
										else if(jsonNameFromTreePath(ongletActif()).indexOf("Country") != -1){
											ChartNetwork[2][ongletActif()].connectToPlot( "default", function(evt){
												if(evt.type === "onclick"){
													if(evt.run.data[evt.index].y<0) var sens = "inc";
													else var sens = "out";
													clickToPie(ChartNetwork[2][ongletActif()].axes.x.labels[evt.index].text, "", "", "", "", sens, true, "netLocHostsTop10CountryPackets.json", "", evt.run.data[evt.index].item.split("(")[0], "");
													dijit.byId("SelectCountry").setAttribute( 'value' , evt.run.data[evt.index].item.split("(")[0] );
												};
											});
											setTimeout(function(){ChartNetwork[2][ongletActif()].connectToPlot( "default",  function(evt){ eventMouse(evt, "2", ongletActif());});},500);
										}
										
										else if(jsonNameFromTreePath(ongletActif()).indexOf("as") != -1){
											ChartNetwork[2][ongletActif()].connectToPlot( "default", function(evt){
												if(evt.type === "onclick"){
													if(evt.run.data[evt.index].y<0) var sens = "inc";
													else var sens = "out";
													clickToPie(ChartNetwork[2][ongletActif()].axes.x.labels[evt.index].text, "", "", "", "", sens, true, "netLocHostsTop10asPackets.json", "", "", evt.run.data[evt.index].item.split("(")[1].split(")")[0]);
													dijit.byId("SelectCountry").setAttribute( 'value' , evt.run.data[evt.index].item.split("(")[0] );
												};
											});
											setTimeout(function(){ChartNetwork[2][ongletActif()].connectToPlot( "default",  function(evt){ eventMouse(evt, "2", ongletActif());});},500);
										}
										
										else if(jsonNameFromTreePath(ongletActif()).indexOf("app") != -1){
											ChartNetwork[2][ongletActif()].connectToPlot( "default", function(evt){
												if(evt.type === "onclick"){
													if(evt.run.data[evt.index].y<0) var sens = "inc";
													else var sens = "out";
													clickToPie(ChartNetwork[2][ongletActif()].axes.x.labels[evt.index].text, "", "", "", "", sens, true, "netLocHostsTop10appPackets.json", "", "", evt.run.data[evt.index].item.split("(")[1].split(")")[0],true);
													dijit.byId("SelectCountry").setAttribute( 'value' , evt.run.data[evt.index].item.split("(")[0]);
												};
											});
											setTimeout(function(){ChartNetwork[2][ongletActif()].connectToPlot( "default",  function(evt){ eventMouse(evt, "2", ongletActif());});},500);
										}
										
										
										else {}
											
						
			
						///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
						// refresh tab containers for a proper view of elements/widgets
						presenteContainerProperly();
						
						unLoading();
					});
						
						
				}catch(e){
					console.log("error : "+e+"\n in 'charting.js' function ! Alert raised at line :"+new Error().lineNumber);
					
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
				if(JsonObjNetwork[2][ongletActif()].errMsg)alert("Json Bug Report: "+JsonObjNetwork[2][ongletActif()].errMsg);	
				unLoading();
				var element = document.getElementById("chart2"+ongletActif());
				if ( element.hasChildNodes() ){
					while ( element.childNodes.length >= 1 ){
						element.removeChild( element.firstChild );       
					} 
				}
				document.getElementById("chart2"+ongletActif()).innerHTML =  "ERROR: no data received ! (Bug report)" ;
			}
			
		
			//unLoading();
		
		}
		
	}
	xhr.send(null);

	//unLoading();

};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////  FIN DE FONCTION GRAPHE 2  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	

///////////////////////////////////////////////////////////////////////////////////////////////////////  FONCTION DE CONSTRUCTION DU GRAPHE 3  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

makeChart3 = function(){

	var xhr = createXhrObject();

	
	xhr.open("GET", askWhere +  jsonNameFromTreePath(ongletActif())+document.getElementById(ongletActif()).getAttribute('params')+"&service=loc", true);
	xhr.onreadystatechange=function() 
	{
		if (xhr.readyState == 4) 
		{
			if (xhr.status == 200) 
			{
					
				JsonObjNetwork[3][ongletActif()] = eval("(" + xhr.responseText + ")");
				JsonObjNetwork[3][ongletActif()] = jsonChartingModifier( JsonObjNetwork[3][ongletActif()] );
			
				try{
					
					require([ "dijit/registry", "dojox/charting/Chart2D", "dojox/charting/action2d/Tooltip", "dojo/dom", "dojox/form/RangeSlider"], function(registry, Chart2D, Tooltip, dom){
						ChartNetwork[3][ongletActif()] = new Chart2D("chart3"+ongletActif());
					
					
					
						var up = new Array();
						var down = new Array();
						
						
						// ajout automatique des s�ries
						try{
							var i = 2;
							while(JsonObjNetwork[3][ongletActif()].data[i] != null){
								if( JsonObjNetwork[3][ongletActif()].data[i].type ==="IN"){
									curTab = JsonObjNetwork[3][ongletActif()].data[i].tab;
									for(var j = 0; j < curTab.length; j++){
										curTab[j].y = -curTab[j].y;
										if(down[j] != null)curTab[j].y += down[j];
										down[j] = curTab[j].y ;
									}
									ChartNetwork[3][ongletActif()].addSeries(JsonObjNetwork[3][ongletActif()].data[i].name+JsonObjNetwork[3][ongletActif()].data[i].type, curTab, {plot : "default"});
									i++;
								}else{
									curTab = JsonObjNetwork[3][ongletActif()].data[i].tab;
									for(var j = 0; j < curTab.length; j++){
										if(up[j] != null)curTab[j].y += up[j];
										up[j] = curTab[j].y ;
									}
									ChartNetwork[3][ongletActif()].addSeries(JsonObjNetwork[3][ongletActif()].data[i].name+JsonObjNetwork[3][ongletActif()].data[i].type, curTab, {plot : "default"});
									i++;
								}
							};
							
						}catch(e){console.log("error : "+e+"\n in 'charting.js' function ! Alert raised at line :"+new Error().lineNumber);}
						
						
						if(JsonObjNetwork[3][ongletActif()].data[1].legend.length>24){
							// ajout de l'axe x
							ChartNetwork[3][ongletActif()].addAxis("x", { 
								labels: JsonObjNetwork[3][ongletActif()].data[1].legend,
								majorTickStep:	2

							});
						}else{
							// ajout de l'axe x
							ChartNetwork[3][ongletActif()].addAxis("x", { 
								labels: JsonObjNetwork[3][ongletActif()].data[1].legend
								majorTickStep:	2

							});						
						}
			
						
						// définition des graphes affichés
						ChartNetwork[3][ongletActif()].addPlot("default", {type: "Columns", gap:80/JsonObjNetwork[3][ongletActif()].data[1].legend.length, hAxis: "x", vAxis: "y"});
					

						// ajouter l'axe vertical de droite
						addVerticalAxis(ChartNetwork[3][ongletActif()], down, up, JsonObjNetwork[3][ongletActif()].data[0].unit, JsonObjNetwork[3][ongletActif()].data[0].unitD, JsonObjNetwork[3][ongletActif()].data[0].factD);

						
						// ajout du quadrillage
						ChartNetwork[3][ongletActif()].addPlot("grid", {type: "Grid",
							hAxis: "x",
							vAxis: "y",
							vMajorLines: false,
							vMinorLines:false,
							hMajorLines: false,
							hMinorLines:false
						});
						

										
						var anim_cE = new Tooltip(ChartNetwork[3][ongletActif()], "default");
			
						

						
						
						// dessin du graphe
						ChartNetwork[3][ongletActif()].render();
						
						
						// graduation minimale du zoom
						//addZoomZero(ChartNetwork[3][ongletActif()]);

						
						mySetTheme(ChartNetwork[3][ongletActif()]);
						//ChartNetwork[1][ongletActif()].theme.plotarea.fill.y2;
						

						// Setting zoom-bar	
						setZoomBar( registry.byId("zoomLoc"+ongletActif()) , ChartNetwork[3][ongletActif()] );
						
						
						// definir le type de curseur quand l'utilisateur pointe sur un 'clickable'
						setCursors("chart3"+ongletActif(), "rect");
						
						
						
			
						// Cr�ation manuelle de la legende
						if(jsonNameFromTreePath(ongletActif()).indexOf("Protocole") != -1){
							// Cr�ation manuelle de la legende des protocoles
							creerLegendeProtocole(JsonObjNetwork[3][ongletActif()], "3", ongletActif(), Vcolor);
						}else{
							// Cr�ation manuelle de la legende
							creerLegende(JsonObjNetwork[3][ongletActif()], "3", ongletActif(), 17);
						}
						
						document.getElementById("zoomLoc"+ongletActif()).style.visibility="visible";
						document.getElementById("legend3"+ongletActif()).style.visibility="visible";
						
						
						
						
						///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
						// definition des evens click et passage sur graphe
								
										//definition du type du graphe des services : "packets" ou "traffic"
										var PACorTRAF = "";
										if(jsonNameFromTreePath(ongletActif()).indexOf("Packets") != -1) PACorTRAF = "Packets";
										else if(jsonNameFromTreePath(ongletActif()).indexOf("Traffic") != -1) PACorTRAF = "Traffic";
										else alert( "can't find string 'Packets' or 'Traffic'" );
										
										//colors = [];
										if(jsonNameFromTreePath(ongletActif()).indexOf("Protocole") == -1){
											if(jsonNameFromTreePath(ongletActif()).indexOf("Country") == -1){
												ChartNetwork[3][ongletActif()].connectToPlot( "default", function(evt){
													// click
													if(evt.type === "onclick"){
														if(evt.run.data[evt.index].y<0) var sens = "inc";
														else var sens = "out";
														//setPlusTab(chart1.axes.x.labels[evt.index].text,evt.run.data[evt.index].item);
														//setPlusTabProto(chart1.axes.x.labels[evt.index].text, "");
														if(evt.run.data[evt.index].tooltip.split("(").length == 3)
															clickToPie(ChartNetwork[3][ongletActif()].axes.x.labels[evt.index].text, "", parseInt(evt.run.data[evt.index].item), evt.run.data[evt.index].item.split("/")[1].slice(0,3), "<", sens, true, "netLocHostsService"+PACorTRAF+".json", "loc", "", "");
														else if(evt.run.data[evt.index].tooltip.split("(").length == 2)
															clickToPie(ChartNetwork[3][ongletActif()].axes.x.labels[evt.index].text, "", parseInt(evt.run.data[evt.index].item), evt.run.data[evt.index].item.split("/")[1].slice(0,3), "<", sens, true, "netLocHostsService"+PACorTRAF+".json", "loc", "", "");
														else alert("errata in index.js line: 247");
														
														//ChangerOnglet("Plus");
														//ChangerDiv("DivPlus");
													};
												})
											}else{
												ChartNetwork[3][ongletActif()].connectToPlot( "default", function(evt){
													// click
													if(evt.type === "onclick"){
														dijit.byId("SelectCountry").setAttribute( 'value' , evt.run.data[evt.index].item.split("(")[0] );
														
														animatePlusTab();
														
													};
												})
											}
											setTimeout(function(){ChartNetwork[3][ongletActif()].connectToPlot( "default",  function(evt){ eventMouse(evt, "3", ongletActif());});},500);
										}
											
										
							
						///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
						// refresh tab containers for a proper view of elements/widgets
						presenteContainerProperly();
						
						unLoading();
					});					
										
					
					
					
					
				}catch(e){
					console.log("error : "+e+"\n in 'charting.js' function ! Alert raised at line :"+new Error().lineNumber);
					
					if(JsonObjNetwork[3][ongletActif()].errMsg)alert("Json Bug Report: "+JsonObjNetwork[3][ongletActif()].errMsg);	
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
			
			//unLoading();
		
		}
		
	}
	xhr.send(null);

	//unLoading();

};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////  FIN DE FONCTION GRAPHE 3  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	

///////////////////////////////////////////////////////////////////////////////////////////////////////  FONCTION DE CONSTRUCTION DU GRAPHE 4  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

makeChart4 = function(){

	var xhr = createXhrObject();
	
	
	xhr.open("GET", askWhere +  jsonNameFromTreePath(ongletActif())+document.getElementById(ongletActif()).getAttribute('params')+"&service=ext", true);
	xhr.onreadystatechange=function() 
	{
		if (xhr.readyState == 4) 
		{
			if (xhr.status == 200) 
			{
					
				JsonObjNetwork[4][ongletActif()] = eval("(" + xhr.responseText + ")");
				JsonObjNetwork[4][ongletActif()] = jsonChartingModifier( JsonObjNetwork[4][ongletActif()] );
				
				try{
					
					require([ "dijit/registry", "dojox/charting/Chart2D", "dojox/charting/action2d/Tooltip", "dojo/dom", "dojox/form/RangeSlider"], function(registry, Chart2D, Tooltip, dom){
						ChartNetwork[4][ongletActif()] = new Chart2D("chart4"+ongletActif());
					
							
						var up = new Array();
						var down = new Array();
						
							
						try{
							var i = 2;
							while(JsonObjNetwork[4][ongletActif()].data[i] != null){
								if( JsonObjNetwork[4][ongletActif()].data[i].type ==="IN"){
									curTab = JsonObjNetwork[4][ongletActif()].data[i].tab;
									for(var j = 0; j < curTab.length; j++){
										curTab[j].y = -curTab[j].y;
										if(down[j] != null)curTab[j].y += down[j];
										down[j] = curTab[j].y ;
									}
									ChartNetwork[4][ongletActif()].addSeries(JsonObjNetwork[4][ongletActif()].data[i].name+JsonObjNetwork[4][ongletActif()].data[i].type, curTab, {plot : "default"});
									i++;
								}else{
									curTab = JsonObjNetwork[4][ongletActif()].data[i].tab;
									for(var j = 0; j < curTab.length; j++){
										if(up[j] != null)curTab[j].y += up[j];
										up[j] = curTab[j].y ;
									}
									ChartNetwork[4][ongletActif()].addSeries(JsonObjNetwork[4][ongletActif()].data[i].name+JsonObjNetwork[4][ongletActif()].data[i].type, curTab, {plot : "default"});
									i++;
								}
							}
						}catch(e){console.log("error : "+e+"\n in 'charting.js' function ! Alert raised at line :"+new Error().lineNumber);}
						
						
						if(JsonObjNetwork[4][ongletActif()].data[1].legend.length>24){
							// ajout de l'axe x
							ChartNetwork[4][ongletActif()].addAxis("x", { 
								labels: JsonObjNetwork[4][ongletActif()].data[1].legend,
								majorTickStep:	2

							});
						}else{
							// ajout de l'axe x
							ChartNetwork[4][ongletActif()].addAxis("x", { 
								labels: JsonObjNetwork[4][ongletActif()].data[1].legend
								majorTickStep:	2

							});						
						}
			
						

						// définition des graphes affichés
						ChartNetwork[4][ongletActif()].addPlot("default", {type: "Columns", gap:80/JsonObjNetwork[4][ongletActif()].data[1].legend.length, hAxis: "x", vAxis: "y"});
					

						// ajouter l'axe vertical de droite
						addVerticalAxis(ChartNetwork[4][ongletActif()], down, up, JsonObjNetwork[4][ongletActif()].data[0].unit, JsonObjNetwork[4][ongletActif()].data[0].unitD, JsonObjNetwork[4][ongletActif()].data[0].factD);

						
						// ajout du quadrillage
						ChartNetwork[4][ongletActif()].addPlot("grid", {type: "Grid",
							hAxis: "x",
							vAxis: "y",
							vMajorLines: false,
							vMinorLines:false,
							hMajorLines: false,
							hMinorLines:false
						});
						
						
						
						var anim_cE = new Tooltip(ChartNetwork[4][ongletActif()], "default");
						
			
						

						
						// dessin du graphe
						ChartNetwork[4][ongletActif()].render();
						
						
						// graduation minimale du zoom
						//addZoomZero(ChartNetwork[4][ongletActif()]);

						
						mySetTheme(ChartNetwork[4][ongletActif()]);
						//ChartNetwork[1][ongletActif()].theme.plotarea.fill.y2;
						

						// Setting zoom-bar	
						setZoomBar( registry.byId("zoomExt"+ongletActif()) , ChartNetwork[4][ongletActif()] );
						
						
						// definir le type de curseur quand l'utilisateur pointe sur un 'clickable'
						setCursors("chart4"+ongletActif(), "rect");
						
						
			
						// Cr�ation manuelle de la legende
						if(jsonNameFromTreePath(ongletActif()).indexOf("Protocole") != -1){
							// Cr�ation manuelle de la legende des protocoles
							creerLegendeProtocole(JsonObjNetwork[4][ongletActif()], "4", ongletActif(), Vcolor);
						}else{
							// Cr�ation manuelle de la legende
							creerLegende(JsonObjNetwork[4][ongletActif()], "4", ongletActif(), 17);
						}
						
						document.getElementById("zoomExt"+ongletActif()).style.visibility="visible";
						document.getElementById("legend4"+ongletActif()).style.visibility="visible";
						
						
						
						///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
						// definition des evens click et passage sur graphe
								
										//definition du type du graphe des services : "packets" ou "traffic"
										var PACorTRAF = "";
										if(jsonNameFromTreePath(ongletActif()).indexOf("Packets") != -1) PACorTRAF = "Packets";
										else if(jsonNameFromTreePath(ongletActif()).indexOf("Traffic") != -1) PACorTRAF = "Traffic";
										else alert( "can't find string 'Packets' or 'Traffic'" );
														
										//colors = [];
										if(jsonNameFromTreePath(ongletActif()).indexOf("Protocole") == -1){
											if(jsonNameFromTreePath(ongletActif()).indexOf("Country") == -1){
												ChartNetwork[4][ongletActif()].connectToPlot( "default", function(evt){
													// click
													if(evt.type === "onclick"){
														if(evt.run.data[evt.index].y<0) var sens = "inc";
														else var sens = "out";
														//setPlusTab(chart1.axes.x.labels[evt.index].text,evt.run.data[evt.index].item);
														//setPlusTabProto(chart1.axes.x.labels[evt.index].text, "");
														if(evt.run.data[evt.index].tooltip.split("(").length == 3)
															clickToPie(ChartNetwork[4][ongletActif()].axes.x.labels[evt.index].text, "", parseInt(evt.run.data[evt.index].item), evt.run.data[evt.index].item.split("/")[1].slice(0,3), ">", sens, true, "netLocHostsService"+PACorTRAF+".json", "ext", "", "");
														else if(evt.run.data[evt.index].tooltip.split("(").length == 2)
															clickToPie(ChartNetwork[4][ongletActif()].axes.x.labels[evt.index].text, "", parseInt(evt.run.data[evt.index].item), evt.run.data[evt.index].item.split("/")[1].slice(0,3), ">", sens, true, "netLocHostsService"+PACorTRAF+".json", "ext", "", "");
														else alert("errata in index.js line: 247");
														
														//ChangerOnglet("Plus");
														//ChangerDiv("DivPlus");
													};
												})
											}else{
												ChartNetwork[4][ongletActif()].connectToPlot( "default", function(evt){
													// click
													if(evt.type === "onclick"){
														dijit.byId("SelectCountry").setAttribute( 'value' , evt.run.data[evt.index].item.split("(")[0] );
														
														animatePlusTab();
													};
												})
											}
											setTimeout(function(){ChartNetwork[4][ongletActif()].connectToPlot( "default",  function(evt){ eventMouse(evt, "4", ongletActif());});},500);
										}
											
						///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
						// refresh tab containers for a proper view of elements/widgets
						presenteContainerProperly();
						
						unLoading();
					});					
						
					
					
					
					
				}catch(e){
					console.log("error : "+e+"\n in 'charting.js' function ! Alert raised at line :"+new Error().lineNumber);
					
					if(JsonObjNetwork[4][ongletActif()].errMsg)alert("Json Bug Report: "+JsonObjNetwork[4][ongletActif()].errMsg);	
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
			
			//unLoading();
		
		}
		
	}
	xhr.send(null);

	//unLoading();

};



////////////////////////////////////////////////////////////////////////////////////////////////////////////////  FIN DE FONCTION GRAPHE 4  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	

///////////////////////////////////////////////////////////////////////////////////////////////////////  FONCTION DE CONSTRUCTION DU GRAPHE 5  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////




makeChart5 = function(){

	var xhr = createXhrObject();

	
	xhr.open("GET", askWhere +   jsonNameFromTreePath(ongletActif())+document.getElementById(ongletActif()).getAttribute('params'), true);//"netTop10NbExtHosts.json?"+
	xhr.onreadystatechange=function() 
	{
		if (xhr.readyState == 4) 
		{
			if (xhr.status == 200) 
			{
					
				JsonObjNetwork[5][ongletActif()] = eval("(" + xhr.responseText + ")");
				
				var TabDeDonnees = new Array();
	
				for(var j = 0; j < JsonObjNetwork[5][ongletActif()].data.length; j++){
					TabDeDonnees[j] = JsonObjNetwork[5][ongletActif()].data[j];							
				}
				for(var j = 2; j < TabDeDonnees.length; j++){
					JsonObjNetwork[5][ongletActif()].data[j] = TabDeDonnees[TabDeDonnees.length-(j-1)];							
				}
				
				try{
					
					
					require([ "dijit/registry", "dojox/charting/Chart2D", "dojox/charting/action2d/Tooltip", "dojo/dom", "dojox/form/RangeSlider"], function(registry, Chart2D, Tooltip, dom){
						ChartNetwork[5][ongletActif()] = new Chart2D("chart5"+ongletActif());
					
						ChartNetwork[5][ongletActif()].setTheme( new dojox.charting.Theme({
											axis:{
												majorTick: {color: "#777", width: .5, length: 6},
												minorTick: {color: "#777", width: .5, length: 3}
											}	
										})
						);
					
						// définition des graphes affichés
						ChartNetwork[5][ongletActif()].addPlot("default", {type: "Columns", gap:80/JsonObjNetwork[5][ongletActif()].data[1].legend.length});
						
						
						// ajout de l'axe x
						if(JsonObjNetwork[5][ongletActif()].data[1].legend.length>24){
							ChartNetwork[5][ongletActif()].addAxis("x", { 
								labels: JsonObjNetwork[5][ongletActif()].data[1].legend,
								majorTickStep:	2

							});
						}else{
							ChartNetwork[5][ongletActif()].addAxis("x", { 
								labels: JsonObjNetwork[5][ongletActif()].data[1].legend
								majorTickStep:	2

							});
						}
						
						// ajout de l'axe y
						ChartNetwork[5][ongletActif()].addAxis("y", {vertical:true, fixLower: "minor", fixUpper: "minor", natural: true});

							
						// ajout du quadrillage
						ChartNetwork[5][ongletActif()].addPlot("grid", {type: "Grid",
							hAxis: "x",
							vAxis: "y",
							vMajorLines: false,
							vMinorLines:false,
							hMajorLines: false,
							hMinorLines:false
						});
						
						
						
						// ajout automatique des s�ries	
						var up = new Array();
						
							
						try{
							var i = 2;
							while(JsonObjNetwork[5][ongletActif()].data[i] != null){
									curTab = JsonObjNetwork[5][ongletActif()].data[i].tab;
									for(var j = 0; j < curTab.length; j++){
										if(up[j] != null)curTab[j].y += up[j];
										up[j] = curTab[j].y ;
									}
									ChartNetwork[5][ongletActif()].addSeries(JsonObjNetwork[5][ongletActif()].data[i].name+JsonObjNetwork[5][ongletActif()].data[i].type, curTab, {plot : "default"});
									i++;
							}
						}catch(e){console.log("error : "+e+"\n in 'charting.js' function ! Alert raised at line :"+new Error().lineNumber);}
						
						
						
						// ajout automatique des s�ries
						var i = 2;
						while(JsonObjNetwork[5][ongletActif()].data[i] != null){
							ChartNetwork[5][ongletActif()].addSeries(JsonObjNetwork[5][ongletActif()].data[i].name,  JsonObjNetwork[5][ongletActif()].data[i].tab,{plot : "default"});
							i++;
						};
						
						
						
						var anim_c = new Tooltip(ChartNetwork[5][ongletActif()], "default");
						

						
						
						// dessin du graphe
						ChartNetwork[5][ongletActif()].render();
						
						
						
						// graduation minimale du zoom
						//addZoomZero(ChartNetwork[5][ongletActif()]);

						
						// Setting zoom-bar	
						setZoomBar( registry.byId("zoomNb"+ongletActif()) , ChartNetwork[5][ongletActif()] );
						
						
						
						// definir le type de curseur quand l'utilisateur pointe sur un 'clickable'
						setCursors("chart5"+ongletActif(), "rect");
						
						// legende des ordonn�es
						/*try{
							document.getElementById("unit5"+ongletActif()).removeChild( document.getElementById("unit5"+ongletActif()).firstChild );     
						}catch(e){console.log("error : "+e+"\n in 'charting.js' function ! Alert raised at line :"+new Error().lineNumber);}  
						
						if(JsonObjNetwork[5][ongletActif()].data[0].unit){
						var text = document.createTextNode(JsonObjNetwork[5][ongletActif()].data[0].unit);
						document.getElementById("unit5"+ongletActif()).appendChild(text);
						}*/
			
						
						
						// Cr�ation manuelle de la legende
						creerLegende(JsonObjNetwork[5][ongletActif()], "5", ongletActif(), 17);
						
						
						document.getElementById("zoomNb"+ongletActif()).style.visibility="visible";
						document.getElementById("legend5"+ongletActif()).style.visibility="visible";
						
						
						
										///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
										// definition des evens click et passage sur graphe
										ChartNetwork[5][ongletActif()].connectToPlot( "default", function(evt){
													// click
													if(evt.type === "onclick"){
														setPlusTab(ChartNetwork[5][ongletActif()].axes.x.labels[evt.index].text, "", ongletActif());
														setPlusTabProto(ChartNetwork[5][ongletActif()].axes.x.labels[evt.index].text, "");
														//document.getElementById("ipext").value = ipFrom(evt.run.data[evt.index].item);
														//alert(ipFrom(evt.run.data[evt.index].item));
														//dijit.byId("SelectIp").setAttribute( 'value' , ipFrom(evt.run.data[evt.index].item));
														/*dijit.byId("SelectIp").value = ipFrom(evt.run.data[evt.index].item) ;
														dijit.byId("SelectIp").onChange();*/
														
														animatePlusTab();
													};
												});
										setTimeout(function(){ChartNetwork[5][ongletActif()].connectToPlot( "default",  function(evt){ eventMouse(evt, "5", ongletActif());});},500);
						
						// refresh tab containers for a proper view of elements/widgets
						presenteContainerProperly();
						
						unLoading();
					});		

					
					
				}catch(e){
					console.log("error : "+e+"\n in 'charting.js' function ! Alert raised at line :"+new Error().lineNumber);

					if(JsonObjNetwork[5][ongletActif()].errMsg)alert("Json Bug Report: "+JsonObjNetwork[5][ongletActif()].errMsg);	
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
			
			//unLoading();
		
		}
		
	}
	xhr.send(null);

	//unLoading();
	
}




////////////////////////////////////////////////////////////////////////////////////////////////////////////////  FIN DE FONCTION GRAPHE 5  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////////////////////////////////////////////////  FONCTION DE CONSTRUCTION DU GRAPHE 6  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


makeChart6 = function(){

	var xhr = createXhrObject();

	
	xhr.open("GET", askWhere +   jsonNameFromTreePath(ongletActif())+document.getElementById(ongletActif()).getAttribute('params'), true);//"netNbExternalHosts.json?"+
	xhr.onreadystatechange=function() 
	{
		if (xhr.readyState == 4) 
		{
			if (xhr.status == 200) 
			{
					
				JsonObjNetwork[6] = eval("(" + xhr.responseText + ")");
				
				try{
					
					require(["dijit/registry", "dojox/charting/Chart2D", "dojox/charting/themes/PlotKit/green", "dojox/charting/action2d/Magnify", "dojox/charting/action2d/Tooltip"], function(registry, Chart2D, green, Magnify, Tooltip){
						chart6 = new Chart2D("chart6"+ongletActif());
					
							green.chart.fill = green.plotarea.fill = "#fff";
							green.axis.stroke.color = "#999";
							green.axis.majorTick.color = "#777";
							green.axis.minorTick.color = "#777";
							chart6.setTheme(green);
			
						chart6.addPlot("default", {type: "Default", lines: true, markers: true, tension:3});
						if(JsonObjNetwork[6].data[1].legend.length>24){
							chart6.addAxis("x", { labels: JsonObjNetwork[6].data[1].legend, majorTickStep:2, majorTick: {stroke: "black", length: 3}, minorTick: {stroke: "gray", length: 3}});
						}else{
							chart6.addAxis("x", { labels: JsonObjNetwork[6].data[1].legend, majorTick: {stroke: "black", length: 3}, minorTick: {stroke: "gray", length: 3}});
						}	
						chart6.addAxis("y", {vertical: true, majorTick: {stroke: "black", length: 3}, minorTick: {stroke: "gray", length: 3}, min: 0, max: ( JsonObjNetwork[6].data[0].max*1.05 )});
						chart6.addSeries(JsonObjNetwork[6].data[2].name,  JsonObjNetwork[6].data[2].tab);
						//chart6.addSeries(JsonObjNetwork[6].data[3].type,  JsonObjNetwork[6].data[3].tab);

						var anim_aE = new Magnify(chart6, "default");
						var anim_cE = new Tooltip(chart6, "default");
						
						
						chart6.render();

						
						// legende des ordonn�es
						try{
							document.getElementById("unit6"+ongletActif()).removeChild( document.getElementById("unit6"+ongletActif()).firstChild );  
						}catch(e){console.log("error : "+e+"\n in 'charting.js' function ! Alert raised at line :"+new Error().lineNumber);}
						
						if(JsonObjNetwork[6].data[0].unit){
						var text = document.createTextNode(JsonObjNetwork[6].data[0].unit);
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
						
						// refresh tab containers for a proper view of elements/widgets
						presenteContainerProperly();		
						
						unLoading();				
					});
					
				}catch(e){
					console.log("error : "+e+"\n in 'charting.js' function ! Alert raised at line :"+new Error().lineNumber);
					
					if(JsonObjNetwork[6].errMsg)alert("Json Bug Report: "+JsonObjNetwork[6].errMsg);	
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
			
			//unLoading();
		
		}
		
	}
	xhr.send(null);

	//unLoading();
	
}




////////////////////////////////////////////////////////////////////////////////////////////////////////////////  FIN DE FONCTION GRAPHE 6  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////////////////////////////////////////////////  FONCTION DE CONSTRUCTION DU GRAPHE 7  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


makeChart7 = function(){

	var xhr = createXhrObject();
	
	
	xhr.open("GET", askWhere + jsonNameFromTreePath(ongletActif())+document.getElementById(ongletActif()).getAttribute('params'), true);//  "netNbLocalHosts.json?"+
	xhr.onreadystatechange=function() 
	{
		if (xhr.readyState == 4) 
		{
			if (xhr.status == 200) 
			{
					
				JsonObjNetwork[7] = eval("(" + xhr.responseText + ")");
				
				try{
					
					
					require(["dijit/registry", "dojox/charting/Chart2D", "dojox/charting/themes/PlotKit/green", "dojox/charting/action2d/Magnify", "dojox/charting/action2d/Tooltip"], function(registry, Chart2D, green, Magnify, Tooltip){
						chart7 = new Chart2D("chart7"+ongletActif());
					
						
						
							green.chart.fill = green.plotarea.fill = "#fff";
							green.axis.stroke.color = "#999";
							green.axis.majorTick.color = "#777";
							green.axis.minorTick.color = "#777";
							green.axis.tick.fontColor = "#000";
							chart7.setTheme(green);
						
						
			
						chart7.addPlot("default", {type: "Default", lines: true, markers: true, tension:3});
						if(JsonObjNetwork[7].data[1].legend.length>24){
							chart7.addAxis("x", { labels: JsonObjNetwork[7].data[1].legend, majorTickStep:2, majorTick: {stroke: "black", length: 3}, minorTick: {stroke: "gray", length: 3}});
						}else{
							chart7.addAxis("x", { labels: JsonObjNetwork[7].data[1].legend, majorTick: {stroke: "black", length: 3}, minorTick: {stroke: "gray", length: 3}});
						}	
						chart7.addAxis("y", {vertical: true, majorTick: {stroke: "black", length: 3}, minorTick: {stroke: "gray", length: 3}, min: 0, max: ( JsonObjNetwork[7].data[0].max*1.05 )});
						chart7.addSeries(JsonObjNetwork[7].data[2].name,  JsonObjNetwork[7].data[2].tab);
						//chart7.addSeries(JsonObjNetwork[7].data[3].type,  JsonObjNetwork[7].data[3].tab);

						var anim_aE = new Magnify(chart7, "default");
						var anim_cE = new Tooltip(chart7, "default");
						
						
						chart7.render();
						
						
						// legende des ordonn�es
						try{
							document.getElementById("unit7"+ongletActif()).removeChild( document.getElementById("unit7"+ongletActif()).firstChild );  
						}catch(e){console.log("error : "+e+"\n in 'charting.js' function ! Alert raised at line :"+new Error().lineNumber);}
						
						if(JsonObjNetwork[7].data[0].unit){
						var text = document.createTextNode(JsonObjNetwork[7].data[0].unit);
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
					
						// refresh tab containers for a proper view of elements/widgets
						presenteContainerProperly();
						
						unLoading();
					});	
					
				}catch(e){
					console.log("error : "+e+"\n in 'charting.js' function ! Alert raised at line :"+new Error().lineNumber);
					
					if(JsonObjNetwork[7].errMsg)alert("Json Bug Report: "+JsonObjNetwork[7].errMsg);	
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
			
			//unLoading();
		
		}
		
	}
	xhr.send(null);

	//unLoading();
	
};






////////////////////////////////////////////////////////////////////////////////////////////////////////////////  FIN DE FONCTION GRAPHE 7  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////





///////////////////////////////////////////////////////////////////////////////////////////////////////  FONCTION DE CONSTRUCTION DES GRAPHES ONGLET  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

makeChart11 = function(){

	var xhr = createXhrObject();

	
	xhr.open("GET", askWhere +   jsonNameFromTreePath(ongletActif())+document.getElementById(ongletActif()).getAttribute('params'), true);
	xhr.onreadystatechange=function() 
	{
		if (xhr.readyState == 4) 
		{
			if (xhr.status == 200) 
			{
				
				JsonObjLocalhost[1] = eval("(" + xhr.responseText + ")");
				
				try{
					
					require(["dijit/registry", "dojox/charting/Chart2D", "dojox/charting/themes/PlotKit/green", "dojox/charting/action2d/Magnify", "dojox/charting/action2d/Tooltip"], function(registry, Chart2D, green, Magnify, Tooltip){
						ChartLocalhost[1][ongletActif()] = new Chart2D("chart1"+ongletActif());
						
							green.chart.fill = green.plotarea.fill = "#fff";
							green.axis.stroke.color = "#999";
							green.axis.majorTick.color = "#777";
							green.axis.minorTick.color = "#777";
							green.axis.tick.fontColor = "#000";
							green.axis.tick.fontColor = "#000";
							ChartLocalhost[1][ongletActif()].setTheme(green);
						
				
						ChartLocalhost[1][ongletActif()].addPlot("default", {type: "Default", lines: true, markers: true, tension:3});
						if(JsonObjLocalhost[1].data[1].legend.length>24){
							ChartLocalhost[1][ongletActif()].addAxis("x", { labels: JsonObjLocalhost[1].data[1].legend, majorTickStep:2, majorTick: {stroke: "black", length: 3}, minorTick: {stroke: "gray", length: 3}});
						}else{
							ChartLocalhost[1][ongletActif()].addAxis("x", { labels: JsonObjLocalhost[1].data[1].legend, majorTick: {stroke: "black", length: 3}, minorTick: {stroke: "gray", length: 3}});	
						}
						ChartLocalhost[1][ongletActif()].addAxis("y", {vertical: true, majorTick: {stroke: "black", length: 3}, minorTick: {stroke: "gray", length: 3}, min: 0, max: ( JsonObjLocalhost[1].data[0].max*1.05 )});
						
						ChartLocalhost[1][ongletActif()].addSeries(JsonObjLocalhost[1].data[2].type,  JsonObjLocalhost[1].data[2].tab);
						ChartLocalhost[1][ongletActif()].addSeries(JsonObjLocalhost[1].data[3].type,  JsonObjLocalhost[1].data[3].tab);

					
						var anim_aE = new Magnify(ChartLocalhost[1][ongletActif()], "default");
						var anim_cE = new Tooltip(ChartLocalhost[1][ongletActif()], "default");
						
						

						
						// dessin du graphe
						ChartLocalhost[1][ongletActif()].render();
						
						// legende des ordonn�es
						try{
							document.getElementById("unit1"+ongletActif()).removeChild( document.getElementById("unit1"+ongletActif()).firstChild );  
						}catch(e){console.log("error : "+e+"\n in 'charting.js' function ! Alert raised at line :"+new Error().lineNumber);}
						
						if(JsonObjLocalhost[1].data[0].unit){
						var text = document.createTextNode(JsonObjLocalhost[1].data[0].unit);
						document.getElementById("unit1"+ongletActif()).appendChild(text);
						}
						
						
						
						//Legende
						try{
							var legend11 = new dojox.charting.widget.Legend({chart: ChartLocalhost[1][ongletActif()], horizontal: false}, "legend1Tab"+ongletActif());
						}catch(e){console.log("error : "+e+"\n in 'charting.js' function ! Alert raised at line :"+new Error().lineNumber);}
						
						
						document.getElementById("legend1"+ongletActif()).style.visibility="visible";
							
							
						///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
						// definition des evens click et passage sur graphe
						ChartLocalhost[1][ongletActif()].connectToPlot( "default", function(evt){
							// click
							if(evt.type === "onclick"){
								setPlusTab(ChartLocalhost[1][ongletActif()].axes.x.labels[evt.index].text, "", ongletActif());
								setPlusTabProto(ChartLocalhost[1][ongletActif()].axes.x.labels[evt.index].text, "");
								animatePlusTab();
							};
						});
					
						// refresh tab containers for a proper view of elements/widgets
						presenteContainerProperly();
						
						unLoading();
					});
					
				}catch(e){
					console.log("error : "+e+"\n in 'charting.js' function ! Alert raised at line :"+new Error().lineNumber);
					
					if(JsonObjLocalhost[1].errMsg)alert("Json Bug Report: "+JsonObjLocalhost[1].errMsg);	
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
			
			//unLoading();
		
		}
		
	}
	xhr.send(null);

	//unLoading();

};

makeChart12 = function(){


	var xhr = createXhrObject();

	
	xhr.open("GET", askWhere +   jsonNameFromTreePath(ongletActif())+document.getElementById(ongletActif()).getAttribute('params'), true);
	xhr.onreadystatechange=function() 
	{
		if (xhr.readyState == 4) 
		{
			if (xhr.status == 200) 
			{
						
				JsonObjLocalhost[2][ongletActif()] = eval("(" + xhr.responseText + ")");
				JsonObjLocalhost[2][ongletActif()] = jsonChartingModifier( JsonObjLocalhost[2][ongletActif()] );
				
				try{
					
					require(["dijit/registry", "dojox/charting/Chart2D", "dojox/charting/themes/PlotKit/green", "dojox/charting/action2d/Magnify", "dojox/charting/action2d/Tooltip", "dojo/dom"], function(registry, Chart2D, green, Magnify, Tooltip, dom){
						ChartLocalhost[2][ongletActif()] = new Chart2D("chart2"+ongletActif());
					
							
										
						var up = new Array();
						var down = new Array();
						
						// ajout automatique des s�ries
					
						try{// ajout automatique des s�ries et des couleurs pr�d�finies
							
							var ordre = ["OTHERS", "UDP", "TCP"];
							
							for(var k=0 ; k< ordre.length ; k++){
							
								var i = 2;
							
								while(JsonObjLocalhost[2][ongletActif()].data[i] != null){
									
									if(JsonObjLocalhost[2][ongletActif()].data[i].name == ordre[k]){
										switch(JsonObjLocalhost[2][ongletActif()].data[i].name){
											case"OTHERS":
												var CouleurSerie = Vcolor[0];
											break;
											case"UDP":
												var CouleurSerie = Vcolor[1];
											break;
											case"TCP":
												var CouleurSerie = Vcolor[2];
											break;
											default:
												alert("charting.js : unknown protocole json data name")
											break;
										}
										
										/*if(2<=i && i<=3)var CouleurSerie = Vcolor[0];
										else if(4<=i && i<=5)var CouleurSerie = Vcolor[1];
										else var CouleurSerie = Vcolor[2];*/
										
										if( JsonObjLocalhost[2][ongletActif()].data[i].type ==="IN"){
											curTab = JsonObjLocalhost[2][ongletActif()].data[i].tab;
											for(var j = 0; j < curTab.length; j++){
												curTab[j].y = -curTab[j].y;
												if(down[j] != null)curTab[j].y += down[j];
												down[j] = curTab[j].y ;
											}
											ChartLocalhost[2][ongletActif()].addSeries(JsonObjLocalhost[2][ongletActif()].data[i].name+JsonObjLocalhost[2][ongletActif()].data[i].type, curTab, {plot : "default", stroke: "black", fill: CouleurSerie});
											
										}else{
											curTab = JsonObjLocalhost[2][ongletActif()].data[i].tab;
											for(var j = 0; j < curTab.length; j++){
												if(up[j] != null)curTab[j].y += up[j];
												up[j] = curTab[j].y ;
											}
											ChartLocalhost[2][ongletActif()].addSeries(JsonObjLocalhost[2][ongletActif()].data[i].name+JsonObjLocalhost[2][ongletActif()].data[i].type, curTab, {plot : "default", stroke: "black", fill: CouleurSerie});
											
										}
									}
									i++;
								}
							}
						}catch(e){console.log("error : "+e+"\n in 'charting.js' function ! Alert raised at line :"+new Error().lineNumber);}
						

						
						if(JsonObjLocalhost[2][ongletActif()].data[1].legend.length>24){
							// ajout de l'axe x
							ChartLocalhost[2][ongletActif()].addAxis("x", { 
								labels: JsonObjLocalhost[2][ongletActif()].data[1].legend,
								majorTickStep:	2

							});
						}else{
							// ajout de l'axe x
							ChartLocalhost[2][ongletActif()].addAxis("x", { 
								labels: JsonObjLocalhost[2][ongletActif()].data[1].legend
								majorTickStep:	2
							});							
						}
			
						
			
						// définition des graphes affichés
						ChartLocalhost[2][ongletActif()].addPlot("default", {type: "Columns", gap:80/JsonObjLocalhost[2][ongletActif()].data[1].legend.length, hAxis: "x", vAxis: "y"});
						

						// ajouter l'axe vertical de droite
						addVerticalAxis(ChartLocalhost[2][ongletActif()], down, up, JsonObjLocalhost[2][ongletActif()].data[0].unit, JsonObjLocalhost[2][ongletActif()].data[0].unitD, JsonObjLocalhost[2][ongletActif()].data[0].factD);

						
						// ajout du quadrillage
						ChartLocalhost[2][ongletActif()].addPlot("grid", {type: "Grid",
							hAxis: "x",
							vAxis: "y",
							vMajorLines: false,
							vMinorLines:false,
							hMajorLines: false,
							hMinorLines:false
						});
						
						
						
						
						// dessin du graphe
						ChartLocalhost[2][ongletActif()].render();		
						
										
						var anim_cE = new Tooltip(ChartLocalhost[2][ongletActif()], "default");
						
						
						
						// graduation minimale du zoom
						//addZoomZero(ChartLocalhost[2][ongletActif()]);

						
						mySetTheme(ChartLocalhost[2][ongletActif()]);
						//Chart1[ongletActif()].theme.plotarea.fill.y2;
						

						// Setting zoom-bar	
						setZoomBar( registry.byId("zoomProto"+ongletActif()) , ChartLocalhost[2][ongletActif()] );
						
						
						
						// changer les labels de l'axe de droite et ajouter les unites au dessus
						//try{
						//	document.getElementById("unit2"+ongletActif()).removeChild( document.getElementById("unit2"+ongletActif()).firstChild ); 
						//}catch(e){console.log("error : "+e+"\n in 'charting.js' function ! Alert raised at line :"+new Error().lineNumber);} 
						
						//var text = document.createTextNode(JsonObjLocalhost[2][ongletActif()].data[0].unit);
						//document.getElementById("unit2"+ongletActif()).appendChild(text);
		
						// definir le type de curseur quand l'utilisateur pointe sur un 'clickable'
						setCursors("chart2"+ongletActif(), "rect");
						
						
						
			
						// Cr�ation manuelle de la legende
						if(jsonNameFromTreePath(ongletActif()).indexOf("Protocole") != -1){
							// Cr�ation manuelle de la legende des protocoles
							creerLegendeProtocole(JsonObjLocalhost[2][ongletActif()], "2", ongletActif(), Vcolor);
						}else{
							// Cr�ation manuelle de la legende
							creerLegende(JsonObjLocalhost[2][ongletActif()], "2", ongletActif(), 17);
						}
						
						document.getElementById("zoomProto"+ongletActif()).style.visibility="visible";
						document.getElementById("legend2"+ongletActif()).style.visibility="visible";
						
						
						
						

						///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
						// definition des evens click et passage sur graphe
						
						// event click
						if(jsonNameFromTreePath(ongletActif()).indexOf("Traffic") != -1){
								
							ChartLocalhost[2][ongletActif()].connectToPlot( "default", function(evt){
								// click
								if(evt.type === "onclick"){
									if(evt.run.data[evt.index].y<0) var sens = "inc";
									else var sens = "out";
									clickToPie(ChartLocalhost[2][ongletActif()].axes.x.labels[evt.index].text, ongletActif(), "", evt.run.name.slice(0,3), "", sens, false, "hostExtHostsProtocolesTraffic.json", "", "", "");
								};
							})
							
						}else{
								
							ChartLocalhost[2][ongletActif()].connectToPlot( "default", function(evt){
								// click
								if(evt.type === "onclick"){
									if(evt.run.data[evt.index].y<0) var sens = "inc";
									else var sens = "out";
									clickToPie(ChartLocalhost[2][ongletActif()].axes.x.labels[evt.index].text, ongletActif(), "", evt.run.name.slice(0,3), "", sens, false, "hostExtHostsProtocolesPackets.json", "", "", "");
								};
							})
							
						}	

			
						
						
						// dessin du graphe
						ChartLocalhost[2][ongletActif()].render();					
			
						
						// refresh tab containers for a proper view of elements/widgets
						presenteContainerProperly();
						
						unLoading();
					});
					
					
				}catch(e){
					console.log("error : "+e+"\n in 'charting.js' function ! Alert raised at line :"+new Error().lineNumber);
					
					if(JsonObjLocalhost[2][ongletActif()].errMsg)alert("Json Bug Report: "+JsonObjLocalhost[2][ongletActif()].errMsg);	
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
			
			//unLoading();
		
		}
		
	}
	xhr.send(null);

	//unLoading();

};



makeChart13 = function(){


	var xhr = createXhrObject();

	
	xhr.open("GET", askWhere +   jsonNameFromTreePath(ongletActif())+document.getElementById(ongletActif()).getAttribute('params')+"&service=loc", true);
	xhr.onreadystatechange=function() 
	{
		if (xhr.readyState == 4) 
		{
			if (xhr.status == 200) 
			{
						
				JsonObjLocalhost[3][ongletActif()] = eval("(" + xhr.responseText + ")");
				JsonObjLocalhost[3][ongletActif()] = jsonChartingModifier( JsonObjLocalhost[3][ongletActif()] );
				
				try{
					
					require(["dijit/registry", "dojox/charting/Chart2D", "dojox/charting/themes/PlotKit/green", "dojox/charting/action2d/Magnify", "dojox/charting/action2d/Tooltip", "dojo/dom"], function(registry, Chart2D, green, Magnify, Tooltip, dom){
						ChartLocalhost[3][ongletActif()] = new Chart2D("chart3"+ongletActif());
					
					
					
										
						var up = new Array();
						var down = new Array();
						
						// ajout automatique des s�ries
						var i = 2;
						while(JsonObjLocalhost[3][ongletActif()].data[i] != null){
							if( JsonObjLocalhost[3][ongletActif()].data[i].type ==="IN"){
								curTab = JsonObjLocalhost[3][ongletActif()].data[i].tab;
								for(var j = 0; j < curTab.length; j++){
									curTab[j].y = -curTab[j].y;
									if(down[j] != null)curTab[j].y += down[j];
									down[j] = curTab[j].y ;
								}
								ChartLocalhost[3][ongletActif()].addSeries(JsonObjLocalhost[3][ongletActif()].data[i].name+JsonObjLocalhost[3][ongletActif()].data[i].type, curTab, {plot : "default"});
								i++;
							}else{
								curTab = JsonObjLocalhost[3][ongletActif()].data[i].tab;
								for(var j = 0; j < curTab.length; j++){
									if(up[j] != null)curTab[j].y += up[j];
									up[j] = curTab[j].y ;
								}
								ChartLocalhost[3][ongletActif()].addSeries(JsonObjLocalhost[3][ongletActif()].data[i].name+JsonObjLocalhost[3][ongletActif()].data[i].type, curTab, {plot : "default"});
								i++;
							}
						};

						
						if(JsonObjLocalhost[3][ongletActif()].data[1].legend.length>24){
							// ajout de l'axe x
							ChartLocalhost[3][ongletActif()].addAxis("x", { 
								labels: JsonObjLocalhost[3][ongletActif()].data[1].legend,
								majorTickStep:	2

							});
						}else{
							// ajout de l'axe x
							ChartLocalhost[3][ongletActif()].addAxis("x", { 
								labels: JsonObjLocalhost[3][ongletActif()].data[1].legend
								majorTickStep:	2
							});						
						}
			
						

						// définition des graphes affichés
						ChartLocalhost[3][ongletActif()].addPlot("default", {type: "Columns", gap:80/JsonObjLocalhost[3][ongletActif()].data[1].legend.length, hAxis: "x", vAxis: "y"});
						

						// ajouter l'axe vertical de droite
						addVerticalAxis(ChartLocalhost[3][ongletActif()], down, up, JsonObjLocalhost[3][ongletActif()].data[0].unit, JsonObjLocalhost[3][ongletActif()].data[0].unitD, JsonObjLocalhost[3][ongletActif()].data[0].factD);

						
						// ajout du quadrillage
						ChartLocalhost[3][ongletActif()].addPlot("grid", {type: "Grid",
							hAxis: "x",
							vAxis: "y",
							vMajorLines: false,
							vMinorLines:false,
							hMajorLines: false,
							hMinorLines:false
						});
						
						
										
						var anim_cE = new Tooltip(ChartLocalhost[3][ongletActif()], "default");
						


						
						// dessin du graphe
						ChartLocalhost[3][ongletActif()].render();
						
						
						// graduation minimale du zoom
						//addZoomZero(ChartLocalhost[3][ongletActif()]);

						
						mySetTheme(ChartLocalhost[3][ongletActif()]);
						//Chart1[ongletActif()].theme.plotarea.fill.y2;
						

						// Setting zoom-bar	
						setZoomBar( registry.byId("zoomLoc"+ongletActif()) , ChartLocalhost[3][ongletActif()] );
						
						
						// definir le type de curseur quand l'utilisateur pointe sur un 'clickable'
						setCursors("chart3"+ongletActif(), "rect");
						
						
						
			
						// Cr�ation manuelle de la legende
						if(jsonNameFromTreePath(ongletActif()).indexOf("Protocole") != -1){
							// Cr�ation manuelle de la legende des protocoles
							creerLegendeProtocole(JsonObjLocalhost[3][ongletActif()], "3", ongletActif(), Vcolor);
						}else{
							// Cr�ation manuelle de la legende
							creerLegende(JsonObjLocalhost[3][ongletActif()], "3", ongletActif(), 17);
						}
						
						document.getElementById("zoomLoc"+ongletActif()).style.visibility="visible";
						document.getElementById("legend3"+ongletActif()).style.visibility="visible";
						
						
						
						
						///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
						// definition des evens click et passage sur graphe
							
										//definition du type du graphe des services : "packets" ou "traffic"
										var PACorTRAF = "";
										if(jsonNameFromTreePath(ongletActif()).indexOf("Packets") != -1) PACorTRAF = "Packets";
										else if(jsonNameFromTreePath(ongletActif()).indexOf("Traffic") != -1) PACorTRAF = "Traffic";
										else alert( "can't find string 'Packets' or 'Traffic'" );
													
										//colors = [];
										if(jsonNameFromTreePath(ongletActif()).indexOf("Protocole") == -1){
											if(jsonNameFromTreePath(ongletActif()).indexOf("Country") == -1){
												ChartLocalhost[3][ongletActif()].connectToPlot( "default", function(evt){
													// click
													if(evt.type === "onclick"){
														if(evt.run.data[evt.index].y<0) var sens = "inc";
														else var sens = "out";
														//dijit.byId("SelectIp").setAttribute( 'value' , ipFrom(ongletActif()) );
														/*dijit.byId("SelectIp").value = ipFrom(ongletActif()) ;
														dijit.byId("SelectIp").onChange();*/
														
														//setPlusTab(chart1.axes.x.labels[evt.index].text,evt.run.data[evt.index].item);
														//setPlusTabProto(chart1.axes.x.labels[evt.index].text, "");
														if(evt.run.data[evt.index].tooltip.split("(").length == 3)
															clickToPie(ChartLocalhost[3][ongletActif()].axes.x.labels[evt.index].text, ongletActif(), parseInt(evt.run.data[evt.index].item), evt.run.data[evt.index].item.split("/")[1].slice(0,3), "<", sens, false, "hostExtHostsService"+PACorTRAF+".json", "loc", "", "");
														else if(evt.run.data[evt.index].tooltip.split("(").length == 2)
															clickToPie(ChartLocalhost[3][ongletActif()].axes.x.labels[evt.index].text, ongletActif(), parseInt(evt.run.data[evt.index].item), evt.run.data[evt.index].item.split("/")[1].slice(0,3), "<", sens, false, "hostExtHostsService"+PACorTRAF+".json", "loc", "", "");
														else alert("errata in index.js line: 247");
														
														//ChangerOnglet("Plus");
														//ChangerDiv("DivPlus");
													};
												})
											}else{
												ChartLocalhost[3][ongletActif()].connectToPlot( "default", function(evt){
													// click
													if(evt.type === "onclick"){
														//dijit.byId("SelectIp").setAttribute( 'value' , ipFrom(ongletActif()) );
														/*dijit.byId("SelectIp").value = ipFrom(ongletActif()) ;
														dijit.byId("SelectIp").onChange();*/
														dijit.byId("SelectCountry").setAttribute( 'value' , evt.run.data[evt.index].item.split("(")[0] );
														
														animatePlusTab();
													};
												})
											}
											setTimeout(function(){ChartLocalhost[3][ongletActif()].connectToPlot( "default",  function(evt){ eventMouse(evt, "3", ongletActif());});},500);
										}
											
						///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
					
						// refresh tab containers for a proper view of elements/widgets
						presenteContainerProperly();
						
						unLoading();
					});					
					
					
					
					
				}catch(e){
					console.log("error : "+e+"\n in 'charting.js' function ! Alert raised at line :"+new Error().lineNumber);
					
					if(JsonObjLocalhost[3][ongletActif()].errMsg)alert("Json Bug Report: "+JsonObjLocalhost[3][ongletActif()].errMsg);	
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
			
			//unLoading();
		
		}
		
	}
	xhr.send(null);

	//unLoading();

};



makeChart14 = function(){



	var xhr = createXhrObject();
	

	
	xhr.open("GET", askWhere +   jsonNameFromTreePath(ongletActif())+document.getElementById(ongletActif()).getAttribute('params')+"&service=ext", true);
	xhr.onreadystatechange=function() 
	{
		if (xhr.readyState == 4) 
		{
			if (xhr.status == 200) 
			{

				JsonObjLocalhost[4][ongletActif()] = eval("(" + xhr.responseText + ")");
				JsonObjLocalhost[4][ongletActif()] = jsonChartingModifier( JsonObjLocalhost[4][ongletActif()] );
				
				try{
					
					require([ "dijit/registry", "dojox/charting/Chart2D", "dojox/charting/action2d/Tooltip", "dojo/dom", "dojox/form/RangeSlider"], function(registry, Chart2D, Tooltip, dom){
						ChartLocalhost[4][ongletActif()] = new Chart2D("chart4"+ongletActif());
					
										
						var up = new Array();
						var down = new Array();
						
						// ajout automatique des s�ries
						var i = 2;
						while(JsonObjLocalhost[4][ongletActif()].data[i] != null){
							if( JsonObjLocalhost[4][ongletActif()].data[i].type ==="IN"){
								curTab = JsonObjLocalhost[4][ongletActif()].data[i].tab;
								for(var j = 0; j < curTab.length; j++){
									curTab[j].y = -curTab[j].y;
									if(down[j] != null)curTab[j].y += down[j];
									down[j] = curTab[j].y ;
								}
								ChartLocalhost[4][ongletActif()].addSeries(JsonObjLocalhost[4][ongletActif()].data[i].name+JsonObjLocalhost[4][ongletActif()].data[i].type, curTab, {plot : "default"});
								i++;
							}else{
								curTab = JsonObjLocalhost[4][ongletActif()].data[i].tab;
								for(var j = 0; j < curTab.length; j++){
									if(up[j] != null)curTab[j].y += up[j];
									up[j] = curTab[j].y ;
								}
								ChartLocalhost[4][ongletActif()].addSeries(JsonObjLocalhost[4][ongletActif()].data[i].name+JsonObjLocalhost[4][ongletActif()].data[i].type, curTab, {plot : "default"});
								i++;
							}
						};
							
						

						if(JsonObjLocalhost[4][ongletActif()].data[1].legend.length>24){
							// ajout de l'axe x
							ChartLocalhost[4][ongletActif()].addAxis("x", { 
								labels: JsonObjLocalhost[4][ongletActif()].data[1].legend,
								majorTickStep:	2


							});
						}else{
							// ajout de l'axe x
							ChartLocalhost[4][ongletActif()].addAxis("x", { 
								labels: JsonObjLocalhost[4][ongletActif()].data[1].legend
								majorTickStep:	2
							});						
						}
			
						

						// définition des graphes affichés
						ChartLocalhost[4][ongletActif()].addPlot("default", {type: "Columns", gap:80/JsonObjLocalhost[4][ongletActif()].data[1].legend.length, hAxis: "x", vAxis: "y"});
						

						// ajouter l'axe vertical de droite
						addVerticalAxis(ChartLocalhost[4][ongletActif()], down, up, JsonObjLocalhost[4][ongletActif()].data[0].unit, JsonObjLocalhost[4][ongletActif()].data[0].unitD, JsonObjLocalhost[4][ongletActif()].data[0].factD);

						
						// ajout du quadrillage
						ChartLocalhost[4][ongletActif()].addPlot("grid", {type: "Grid",
							hAxis: "x",
							vAxis: "y",
							vMajorLines: false,
							vMinorLines:false,
							hMajorLines: false,
							hMinorLines:false
						});
						
						
										
						var anim_cE = new Tooltip(ChartLocalhost[4][ongletActif()], "default");
						
			


						
						// dessin du graphe
						ChartLocalhost[4][ongletActif()].render();
						
						
						// graduation minimale du zoom
						//addZoomZero(ChartLocalhost[4][ongletActif()]);

						
						mySetTheme(ChartLocalhost[4][ongletActif()]);
						//Chart1[ongletActif()].theme.plotarea.fill.y2;
						

						// Setting zoom-bar	
						setZoomBar( registry.byId("zoomExt"+ongletActif()) , ChartLocalhost[4][ongletActif()] );
						
						
						// definir le type de curseur quand l'utilisateur pointe sur un 'clickable'
						setCursors("chart4"+ongletActif(), "rect");
						
						
						
			
						// Cr�ation manuelle de la legende
						if(jsonNameFromTreePath(ongletActif()).indexOf("Protocole") != -1){
							// Cr�ation manuelle de la legende des protocoles
							creerLegendeProtocole(JsonObjLocalhost[4][ongletActif()], "4", ongletActif(), Vcolor);
						}else{
							// Cr�ation manuelle de la legende
							creerLegende(JsonObjLocalhost[4][ongletActif()], "4", ongletActif(), 17);
						}
						
						document.getElementById("zoomExt"+ongletActif()).style.visibility="visible";
						document.getElementById("legend4"+ongletActif()).style.visibility="visible";
						
						
						
						
						///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
						// definition des evens click et passage sur graphe
																			
										//definition du type du graphe des services : "packets" ou "traffic"
										var PACorTRAF = "";
										if(jsonNameFromTreePath(ongletActif()).indexOf("Packets") != -1) PACorTRAF = "Packets";
										else if(jsonNameFromTreePath(ongletActif()).indexOf("Traffic") != -1) PACorTRAF = "Traffic";
										else alert( "can't find string 'Packets' or 'Traffic'" );
													
										
										//colors = [];
										if(jsonNameFromTreePath(ongletActif()).indexOf("Protocole") == -1){
											if(jsonNameFromTreePath(ongletActif()).indexOf("Country") == -1){
												ChartLocalhost[4][ongletActif()].connectToPlot( "default", function(evt){
													// click
													if(evt.type === "onclick"){
														
														if(evt.run.data[evt.index].y<0) var sens = "inc";
														else var sens = "out";
														
														//dijit.byId("SelectIp").setAttribute( 'value' , ipFrom(ongletActif()) );
														/*dijit.byId("SelectIp").value = ipFrom(ongletActif()) ;
														dijit.byId("SelectIp").onChange();*/
														
														//setPlusTab(chart1.axes.x.labels[evt.index].text,evt.run.data[evt.index].item);
														//setPlusTabProto(chart1.axes.x.labels[evt.index].text, "");
														if(evt.run.data[evt.index].tooltip.split("(").length == 3)
															clickToPie(ChartLocalhost[4][ongletActif()].axes.x.labels[evt.index].text, ongletActif(), parseInt(evt.run.data[evt.index].item), evt.run.data[evt.index].item.split("/")[1].slice(0,3), ">", sens, false, "hostExtHostsService"+PACorTRAF+".json", "ext", "", "");
														else if(evt.run.data[evt.index].tooltip.split("(").length == 2)
															clickToPie(ChartLocalhost[4][ongletActif()].axes.x.labels[evt.index].text, ongletActif(), parseInt(evt.run.data[evt.index].item), evt.run.data[evt.index].item.split("/")[1].slice(0,3), ">", sens, false, "hostExtHostsService"+PACorTRAF+".json", "ext", "", "");
														else alert("errata in index.js line: 247");
														
														//ChangerOnglet("Plus");
														//ChangerDiv("DivPlus");
													};
												})
											}else{
												ChartLocalhost[4][ongletActif()].connectToPlot( "default", function(evt){
													// click
													if(evt.type === "onclick"){
														//dijit.byId("SelectIp").setAttribute( 'value' , ipFrom(ongletActif()) );
														/*dijit.byId("SelectIp").value = ipFrom(ongletActif()) ;
														dijit.byId("SelectIp").onChange();*/
														dijit.byId("SelectCountry").setAttribute( 'value' , evt.run.data[evt.index].item.split("(")[0] );
														
														animatePlusTab();
													};
												})
											}
											setTimeout(function(){ChartLocalhost[4][ongletActif()].connectToPlot( "default",  function(evt){ eventMouse(evt, "4", ongletActif());})},500);
										}
											
						///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
					
						// refresh tab containers for a proper view of elements/widgets
						presenteContainerProperly();
						
						unLoading();
					});			
					
					
				}catch(e){
					console.log("error : "+e+"\n in 'charting.js' function ! Alert raised at line :"+new Error().lineNumber);
					
					if(JsonObjLocalhost[4][ongletActif()].errMsg)alert("Json Bug Report: "+JsonObjLocalhost[4][ongletActif()].errMsg);	
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
			
			//unLoading();
		
		}
		
	}
	xhr.send(null);

	//unLoading();
}





makeChart16a = function(){


	var xhr = createXhrObject();
	//alert(JsonName+"?"+parameters);
	
	xhr.open("GET", askWhere +   JsonName+"?"+parameters, true);
	
	xhr.onreadystatechange=function() 
	{
		if (xhr.readyState == 4) 
		{
			if (xhr.status == 200) 
			{
				if( xhr.responseText == "") document.getElementById("camembert1").innerHTML = "No results";
				else{
						
					JsonObjLocalhost[6] = eval("(" + xhr.responseText + ")");
					
					try{
						
						creerTooltip(JsonObjLocalhost[6]);
						
						require(["dojox/charting/Chart2D", "dojox/charting/themes/Harmony", "dojox/charting/action2d/Magnify", "dojox/charting/action2d/MoveSlice", "dojox/charting/action2d/Tooltip"], function(Chart2D, Harmony, Magnify, MoveSlice, Tooltip){
							chart16a = new Chart2D("camembert1");
			
							// définition des graphes affichés
							chart16a.addPlot("default", {type: "Pie", radius: 100,  labelOffset: -20});


							// ajout de l'axe y
							chart16a.addSeries("IN",  JsonObjLocalhost[6].data, {plot : "default"});
							
							// theme
							chart16a.setTheme(Harmony);
							
				
							var anim_aE = new Magnify(chart16a, "default");
							var anim_aE = new MoveSlice(chart16a, "default");
							var anim_cE = new Tooltip(chart16a, "default");
							
							
							
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
										//dijit.byId("SelectIp").setAttribute( 'value' , evt.run.data[evt.index].ip );
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
							// On remplace les valeurs des legendes du camemberts par celles donn�es dans le Json
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
						});
						unLoading();
						
					}catch(e){
						console.log("error : "+e+"\n in 'charting.js' function ! Alert raised at line :"+new Error().lineNumber);
						
						if(JsonObjLocalhost[6].errMsg)alert("Json Bug Report: "+JsonObjLocalhost[6].errMsg);	
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
			
			//unLoading();
		
		}
		
	}
	xhr.send(null);

	//unLoading();

};



makeChart16b = function(){


	var xhr = createXhrObject();
	
	
	xhr.open("GET", askWhere +   JsonName+"?"+parameters, true);
	
	xhr.onreadystatechange=function() 
	{
		if (xhr.readyState == 4) 
		{
			if (xhr.status == 200) 
			{
				if( xhr.responseText == "") document.getElementById("camembert2").innerHTML = "No results";
				else{
						
					JsonObjLocalhost[7] = eval("(" + xhr.responseText + ")");
					
					try{
						
						creerTooltip(JsonObjLocalhost[7]);
						
						
						require(["dojox/charting/Chart2D", "dojox/charting/themes/Harmony", "dojox/charting/action2d/Magnify", "dojox/charting/action2d/MoveSlice", "dojox/charting/action2d/Tooltip"], function(Chart2D, Harmony, Magnify, MoveSlice, Tooltip){
							chart16b = new Chart2D("camembert2");							
			
							// définition des graphes affichés
							chart16b.addPlot("default", {type: "Pie", radius: 100,  labelOffset: -20});


							// ajout de l'axe y
							chart16b.addSeries("IN",  JsonObjLocalhost[7].data, {plot : "default"});
							
							// theme
								chart16b.setTheme(Harmony);
							
				
							var anim_aE = new Magnify(chart16b, "default");
							var anim_aE = new MoveSlice(chart16b, "default");
							var anim_cE = new Tooltip(chart16b, "default");
							
							
							
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
							// On remplace les valeurs des legendes du camemberts par celles donn�es dans le Json
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
						});
						unLoading();
							
					}catch(e){
						console.log("error : "+e+"\n in 'charting.js' function ! Alert raised at line :"+new Error().lineNumber);
						
						if(JsonObjLocalhost[7].errMsg)alert("Json Bug Report: "+JsonObjLocalhost[7].errMsg);	
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
			
			//unLoading();
		
		}
		
		
	}
	xhr.send(null);

	//unLoading();

};





makeChartProtoAccurate = function(divID){
	
	//alert("makeChartProtoAccurate");
	// jsonNameFromTreePath(ongletActif())+document.getElementById(ongletActif()).getAttribute('params')+"&service=ext", true
	
	//alert(jsonNameFromTreePath(ongletActif()));
	
	var xhr = createXhrObject();
	
	xhr.open("GET", askWhere + jsonNameFromTreePath(ongletActif())+document.getElementById(ongletActif()).getAttribute('params')+((document.getElementById("Button"+graphIndexFromTreePath(ongletActif())+ongletActif())) ?  "&accurate=true&": ""), true);
	//xhr.open("GET", "netProtocolesTrafficAccurate.json" , true);
	
	xhr.onreadystatechange=function() 
	{
		if (xhr.readyState == 4) 
		{
			if (xhr.status == 200) 
			{
				if( xhr.responseText == "") document.getElementById(divID).innerHTML = "No results";
				else{
						
					var JsonAccurate = eval("(" + xhr.responseText + ")");
					
					try{
						
						require(["dojox/gfx/matrix", "dojox/charting/Chart", "dojox/charting/axis2d/Default", "dojox/charting/plot2d/StackedAreas", "dojox/charting/themes/Wetland", "dojox/charting/action2d/Magnify", "dojox/charting/action2d/MoveSlice", "dojox/charting/action2d/Tooltip", "dojo/ready"], function(matrix, Chart, Default, StackedAreas, Wetland, Magnify, MoveSlice, Tooltip, ready){
							ready(function(){
								
								var others_out = new Array();
								var others_in = new Array();
								var tcp_out = new Array();
								var tcp_in = new Array();
								var udp_out = new Array();
								var udp_in = new Array();
								
								for(var i = 0; i < JsonAccurate.data.length; i++){
									try{
										if(JsonAccurate.data[i].type){
											switch(JsonAccurate.data[i].name){
												case "OTHERS":
													switch(JsonAccurate.data[i].type){
														case "IN":
															for(var j = 0; j < JsonAccurate.data[i].tab.length; j++){
																if(JsonAccurate.data[i].tab[j].y.length == 0)console.log("champ y VIDE !!! ===> remplissage automatique � 0");
																if(JsonAccurate.data[i].tab[j].y.length == 0)JsonAccurate.data[i].tab[j].y=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
																for(var k = 0; k < JsonAccurate.data[i].tab[j].y.length; k++){
																	others_in.push(JsonAccurate.data[i].tab[j].y[k]*-1); 
																}
															}
														break;
														case "OUT":
															for(var j = 0; j < JsonAccurate.data[i].tab.length; j++){
																if(JsonAccurate.data[i].tab[j].y.length == 0)console.log("champ y VIDE !!! ===> remplissage automatique � 0");
																if(JsonAccurate.data[i].tab[j].y.length == 0)JsonAccurate.data[i].tab[j].y=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
																for(var k = 0; k < JsonAccurate.data[i].tab[j].y.length; k++){
																	others_out.push(JsonAccurate.data[i].tab[j].y[k]); 
																}
															}
														break;
														default:
															alert('charting.js : no type : ' +JsonAccurate.data[i].type);
														break;
													}
												break;
												case "TCP":
													switch(JsonAccurate.data[i].type){
														case "IN":
															for(var j = 0; j < JsonAccurate.data[i].tab.length; j++){
																if(JsonAccurate.data[i].tab[j].y.length == 0)console.log("champ y VIDE !!! ===> remplissage automatique � 0");
																if(JsonAccurate.data[i].tab[j].y.length == 0)JsonAccurate.data[i].tab[j].y=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
																for(var k = 0; k < JsonAccurate.data[i].tab[j].y.length; k++){
																	tcp_in.push(JsonAccurate.data[i].tab[j].y[k]*-1); 
																}
															}
														break;
														case "OUT":
															for(var j = 0; j < JsonAccurate.data[i].tab.length; j++){
																if(JsonAccurate.data[i].tab[j].y.length == 0)console.log("champ y VIDE !!! ===> remplissage automatique � 0");
																if(JsonAccurate.data[i].tab[j].y.length == 0)JsonAccurate.data[i].tab[j].y=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
																for(var k = 0; k < JsonAccurate.data[i].tab[j].y.length; k++){
																	tcp_out.push(JsonAccurate.data[i].tab[j].y[k]); 
																}
															}
														break;
														default:
															alert('charting.js : no type : ' +JsonAccurate.data[i].type);
														break;
													}
												break;
												case "UDP":
													switch(JsonAccurate.data[i].type){
														case "IN":
															for(var j = 0; j < JsonAccurate.data[i].tab.length; j++){
																if(JsonAccurate.data[i].tab[j].y.length == 0)console.log("champ y VIDE !!! ===> remplissage automatique � 0");
																if(JsonAccurate.data[i].tab[j].y.length == 0)JsonAccurate.data[i].tab[j].y=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
																for(var k = 0; k < JsonAccurate.data[i].tab[j].y.length; k++){
																	udp_in.push(JsonAccurate.data[i].tab[j].y[k]*-1); 
																}
															}
														break;
														case "OUT":
															for(var j = 0; j < JsonAccurate.data[i].tab.length; j++){
																if(JsonAccurate.data[i].tab[j].y.length == 0)JsonAccurate.data[i].tab[j].y=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
																for(var k = 0; k < JsonAccurate.data[i].tab[j].y.length; k++){
																	udp_out.push(JsonAccurate.data[i].tab[j].y[k]); 
																}
															}
														break;
														default:
															alert('charting.js : no type : ' +JsonAccurate.data[i].type);
														break;
													}
												break;
												default:
													alert('charting.js : no name : ' +JsonAccurate.data[i].name);
												break;
											}
										}
										unLoading();
									}catch(e){console.log("error : "+e+"\n in 'charting.js' function ! Alert raised at line :"+new Error().lineNumber);}
									
								}
								
								
								
								var c = new Chart(divID);
								
								
								
								c.addPlot("default1", {type: StackedAreas});
								c.addPlot("default2", {type: StackedAreas});
								c.addPlot("default3", {type: StackedAreas});
								c.addPlot("default4", {type: StackedAreas});
								c.addPlot("default", {type: StackedAreas});
								c.setTheme(Wetland);
						
							
								
								var serie_cumul_all = [];
								var serie_cumul_others_udp = [];
								var serie_others = [];
								var serieBG = [];
								
								for(var i = 0; i<others_out.length; i++){
									serie_others.push(others_in[i]);
									serie_cumul_others_udp.push(others_in[i]+udp_in[i]);
									serie_cumul_all.push(others_in[i]+udp_in[i]+tcp_in[i]);
									/*// serie test pr bien vopir les couleurs
									serie_others.push(i*-10000000, tooltip:i});
									serie_cumul_others_udp.push(i*-20000000, tooltip:i});
									serie_cumul_all.push(i*-30000000, tooltip:i});*/
									serieBG.push(0);
								}
								
								
								//tcp : blue
								//udp : green
								//others : red
								/*
								green1: 54eb48
								green2: 2cbc4d, 24bc18
								blue1: 48c3eb
								blue2: 218abf
								yellow1: ebd648
								yellow2: c1b122, b6a818
								red1: e9644a
								red2: b83318
								purple1: 7648eb
								purple2: 4c1fbd
								*/
								//[  '#FFC8A3' , '#61F554' , '#A3C6FF' ];
								
								var green_Color = "#b0faaa"
								var blue_Color ="#d1e3ff"
								var red_Color ="#ffe4d1"
								var green_Color_Stroke = "#2cbc4d"
								var blue_Color_Stroke ="#218abf"
								var red_Color_Stroke ="#c1b122"
								
								c.addSeries("serie_cumul_all", serie_cumul_all, {plot: "default1", stroke: {color: blue_Color_Stroke}, fill: "white"});
								c.addSeries("serie_cumul_others_udp", serie_cumul_others_udp, {plot: "default2", stroke: {color: green_Color_Stroke}, fill: blue_Color});
								c.addSeries("serie_others", serie_others, {plot: "default3", stroke: {color: red_Color_Stroke}, fill: green_Color});
								c.addSeries("serieBG", serieBG, {plot: "default4", stroke: {color: red_Color}, fill: red_Color});
								
								c.addSeries("others", others_out, {plot: "default", stroke: {color: red_Color_Stroke}, fill: red_Color});
								c.addSeries("udp", udp_out, {plot: "default", stroke: {color: green_Color_Stroke}, fill: green_Color});
								c.addSeries("tcp", tcp_out, {plot: "default", stroke: {color: blue_Color_Stroke}, fill: blue_Color});
								
								
								// Ajout des axes X et Y (abscisse et ordonn�e)
								
								/*c.addAxis("x", {fixLower: "major", fixUpper: "major"});*/
								var labels = new Array();
																
								if(JsonAccurate.data[1].legend.length>24){
									// ajout de l'axe x
									c.addAxis("x", {
										//labels: JsonAccurate.data[1].legend,
										labels: labels,
										majorTickStep:	30

									});
								}else{
									labels = createLabels("hours", JsonAccurate.data[1].legend);
									
									//alert(labels.length);
									/*for(var k = 0; k <tcp_in.length; k++){
										JsonAccurate.data[1].legend
										labels.push({value:k+1 , text: k+"test"}); 
									}*/
									
									// ajout de l'axe x
									c.addAxis("x", {
										//labels: JsonAccurate.data[1].legend
										labels: labels,
										majorTickStep:	30
									});					
								}
								
								
								// ajouter l'axe des ordonn�es et ajuster les unites au dessus
								addVerticalAxisAccurate(c, serie_cumul_all, tcp_out, JsonAccurate);
								//c.addAxis("y", {vertical: true, fixLower: "minor", fixUpper: "minor", natural: true, includeZero: true});
							
								
								// Ajout des animations
								var anim_aE = new Magnify(c, "default");
								var anim_aE = new MoveSlice(c, "default");
								var anim_cE = new Tooltip(c, "default");
									
								var anim_aE1 = new Magnify(c, "default1");
								var anim_aE1 = new MoveSlice(c, "default1");
								var anim_cE1 = new Tooltip(c, "default1");
									
								var anim_aE2 = new Magnify(c, "default2");
								var anim_aE2 = new MoveSlice(c, "default2");
								var anim_cE2 = new Tooltip(c, "default2");
									
								var anim_aE3 = new Magnify(c, "default3");
								var anim_aE3 = new MoveSlice(c, "default3");
								var anim_cE3 = new Tooltip(c, "default3");
									
								var anim_aE4 = new Magnify(c, "default4");
								var anim_aE4 = new MoveSlice(c, "default4");
								var anim_cE4 = new Tooltip(c, "default4");
								
								c.render();
						
								// refresh tab containers for a proper view of elements/widgets
								presenteContainerProperly();
						
								unLoading();
							});
						});
						
					}catch(e){
						console.log("error : "+e+"\n in 'charting.js' function ! Alert raised at line :"+new Error().lineNumber);
						
						if(JsonAccurate.errMsg)alert("Json Bug Report: "+JsonObjLocalhost[7].errMsg);	
						unLoading();
						var image = document.createElement("img");
						//image.setAttribute( 'style', "height: 300px; width: 800px;" );
						image.setAttribute( 'class', "photo" );
						image.setAttribute( 'src', "images/nodataC.png" );
						var div = document.createElement("div");
						div.setAttribute( 'style', "position: absolute;");
						div.appendChild(image);
						var element = document.getElementById(divID);
						element.insertBefore(div, element.firstChild);
						
					}
					
				}
			} else {
				document.getElementById(divID).innerHTML =  "ERROR: no data received ! (Bug report)" ;
			}
			
			//unLoading();
		
		}
		
		
	}
	xhr.send(null);

	//unLoading();


};







makeChartNetworkNbHostsAccurate = function(divID){
	
	
	//alert("makeChartNetworkNbHostsAccurate");
	// jsonNameFromTreePath(ongletActif())+document.getElementById(ongletActif()).getAttribute('params')+"&service=ext", true
	
	//alert(jsonNameFromTreePath(ongletActif()));
	
	var xhr = createXhrObject();
	
	xhr.open("GET", askWhere + jsonNameFromTreePath(ongletActif())+document.getElementById(ongletActif()).getAttribute('params')+"&accurate=true&", true);
	//xhr.open("GET", "netProtocolesTrafficAccurate.json" , true);
	
	xhr.onreadystatechange=function() 
	{
		if (xhr.readyState == 4) 
		{
			if (xhr.status == 200) 
			{
				if( xhr.responseText == "") document.getElementById(divID).innerHTML = "No results";
				else{
						
					var JsonAccurate = eval("(" + xhr.responseText + ")");
					
					try{
						
						require(["dojox/gfx/matrix", "dojox/charting/Chart", "dojox/charting/axis2d/Default", "dojox/charting/plot2d/Lines", "dojox/charting/themes/Wetland", "dojox/charting/action2d/Magnify", "dojox/charting/action2d/MoveSlice", "dojox/charting/action2d/Tooltip", "dojo/ready"], function(matrix, Chart, Default, Lines, Wetland, Magnify, MoveSlice, Tooltip, ready){
							ready(function(){
								var nbHosts = new Array();
								
								for(var i = 0; i < JsonAccurate.data.length; i++){
									try{
										if(JsonAccurate.data[i].name){
															for(var j = 0; j < JsonAccurate.data[i].tab.length; j++){
																if(JsonAccurate.data[i].tab[j].y.length == 0)console.log("champ y VIDE !!! ===> remplissage automatique � 0");
																if(JsonAccurate.data[i].tab[j].y.length == 0)JsonAccurate.data[i].tab[j].y=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
																for(var k = 0; k < JsonAccurate.data[i].tab[j].y.length; k++){
																	nbHosts.push(JsonAccurate.data[i].tab[j].y[k]); 
																}
															}
										}
										
									}catch(e){console.log("error : "+e+"\n in 'charting.js' function ! Alert raised at line :"+new Error().lineNumber);}
									
								}
								
								
								
								var c = new Chart(divID);
								
								c.addAxis("x", {fixLower: "major", fixUpper: "major"});
								c.addAxis("y", {vertical: true, fixLower: "minor", fixUpper: "minor", natural: true, includeZero: true});
								c.addPlot("default", {type: Lines});
								c.setTheme(Wetland);
								
								
								c.addSeries("nbHosts", nbHosts, {plot: "default"});
								
							
								var anim_aE = new Magnify(c, "default");
								var anim_aE = new MoveSlice(c, "default");
								var anim_cE = new Tooltip(c, "default");
								
								c.render();
								
								// refresh tab containers for a proper view of elements/widgets
								presenteContainerProperly();
						
								unLoading();
								
							});
						});
						
					}catch(e){
						console.log("error : "+e+"\n in 'charting.js' function ! Alert raised at line :"+new Error().lineNumber);
						
						if(JsonAccurate.errMsg)alert("Json Bug Report: "+JsonObjLocalhost[7].errMsg);	
						unLoading();
						var image = document.createElement("img");
						//image.setAttribute( 'style', "height: 300px; width: 800px;" );
						image.setAttribute( 'class', "photo" );
						image.setAttribute( 'src', "images/nodataC.png" );
						var div = document.createElement("div");
						div.setAttribute( 'style', "position: absolute;");
						div.appendChild(image);
						var element = document.getElementById(divID);
						element.insertBefore(div, element.firstChild);
						
					}
					
				}
			} else {
				document.getElementById(divID).innerHTML =  "ERROR: no data received ! (Bug report)" ;
			}
			
			//unLoading();
		
		}
		
		
	}
	xhr.send(null);

	//unLoading();

};





makeChartLocalhostsNbHostsAccurate = function(divID){
	
	//alert("makeChartLocalhostsNbHostsAccurate");
	
	// jsonNameFromTreePath(ongletActif())+document.getElementById(ongletActif()).getAttribute('params')+"&service=ext", true
	
	//alert(jsonNameFromTreePath(ongletActif()));
	
	var xhr = createXhrObject();
	
	xhr.open("GET", askWhere + jsonNameFromTreePath(ongletActif())+document.getElementById(ongletActif()).getAttribute('params')+"&accurate=true&", true);
	//xhr.open("GET", "netProtocolesTrafficAccurate.json" , true);
	
	xhr.onreadystatechange=function() 
	{
		if (xhr.readyState == 4) 
		{
			if (xhr.status == 200) 
			{
				if( xhr.responseText == "") document.getElementById(divID).innerHTML = "No results";
				else{
						
					var JsonAccurate = eval("(" + xhr.responseText + ")");
					
					try{
						
						require(["dojox/gfx/matrix", "dojox/charting/Chart", "dojox/charting/axis2d/Default", "dojox/charting/plot2d/Lines", "dojox/charting/themes/Wetland", "dojox/charting/action2d/Magnify", "dojox/charting/action2d/MoveSlice", "dojox/charting/action2d/Tooltip", "dojo/ready"], function(matrix, Chart, Default, Lines, Wetland, Magnify, MoveSlice, Tooltip, ready){
							ready(function(){
								var nbHosts_inc = new Array();
								var nbHosts_out = new Array();
								
								for(var i = 0; i < JsonAccurate.data.length; i++){
									try{
										if(JsonAccurate.data[i].name){
											switch(JsonAccurate.data[i].name){
												case "NBDIFFHOSTSINC":
															for(var j = 0; j < JsonAccurate.data[i].tab.length; j++){
																if(JsonAccurate.data[i].tab[j].y.length == 0)console.log("champ y VIDE !!! ===> remplissage automatique � 0");
																if(JsonAccurate.data[i].tab[j].y.length == 0)JsonAccurate.data[i].tab[j].y=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
																for(var k = 0; k < JsonAccurate.data[i].tab[j].y.length; k++){
																	nbHosts_inc.push(JsonAccurate.data[i].tab[j].y[k]*-1); 
																}
															}
												break;
												case "NBDIFFHOSTSOUT":
															for(var j = 0; j < JsonAccurate.data[i].tab.length; j++){
																if(JsonAccurate.data[i].tab[j].y.length == 0)console.log("champ y VIDE !!! ===> remplissage automatique � 0");
																if(JsonAccurate.data[i].tab[j].y.length == 0)JsonAccurate.data[i].tab[j].y=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
																for(var k = 0; k < JsonAccurate.data[i].tab[j].y.length; k++){
																	nbHosts_out.push(JsonAccurate.data[i].tab[j].y[k]); 
																}
															}
												break;
												default:
													alert("unknow data name in 'charting.js' function ! Alert raised at line :"+new Error().lineNumber);
												break;
											}
										}
										
									}catch(e){console.log("error : "+e+"\n in 'charting.js' function ! Alert raised at line :"+new Error().lineNumber);}
									
								}
								
								
								
								var c = new Chart(divID);
								
								c.addAxis("x", {fixLower: "major", fixUpper: "major"});
								c.addAxis("y", {vertical: true, fixLower: "minor", fixUpper: "minor", natural: true, includeZero: true});
								c.addPlot("default", {type: Lines});
								c.setTheme(Wetland);
								
								
								c.addSeries("nbHosts_inc", nbHosts_inc, {plot: "default"});
								c.addSeries("nbHosts_out", nbHosts_out, {plot: "default"});
								
							
								var anim_aE = new Magnify(c, "default");
								var anim_aE = new MoveSlice(c, "default");
								var anim_cE = new Tooltip(c, "default");
								
								c.render();
								
								// refresh tab containers for a proper view of elements/widgets
								presenteContainerProperly();
						
								unLoading();
							});
						});
						
					}catch(e){
						console.log("error : "+e+"\n in 'charting.js' function ! Alert raised at line :"+new Error().lineNumber);
						
						if(JsonAccurate.errMsg)alert("Json Bug Report: "+JsonObjLocalhost[7].errMsg);	
						unLoading();
						var image = document.createElement("img");
						//image.setAttribute( 'style', "height: 300px; width: 800px;" );
						image.setAttribute( 'class', "photo" );
						image.setAttribute( 'src', "images/nodataC.png" );
						var div = document.createElement("div");
						div.setAttribute( 'style', "position: absolute;");
						div.appendChild(image);
						var element = document.getElementById(divID);
						element.insertBefore(div, element.firstChild);
						
					}
					
				}
			} else {
				document.getElementById(divID).innerHTML =  "ERROR: no data received ! (Bug report)" ;
			}
			
			//unLoading();
		
		}
		
		
	}
	xhr.send(null);

	//unLoading();

};



function createLabels(timestamp, legend){
	
	var labels = new Array();
	
	switch(timestamp){
		
		case"hours":
			for(var i = 0; i < legend.length; i++){
				for(var j = 0; j < 30; j++){
					if(j*2<10)m="0";
					else m="";
					//alert(legend[i].text+m+j*2+"m");
					labels.push({value:i*30+j , text: legend[i].text+m+j*2}); 
				}
			}
		break;
				
		case"days":
			for(var i = 0; i < 30; i++){
				for(var j = 0; j < 30; j++){
					if(j*2<10)m="0";
					else m="";
					labels.push({value:i*30+j , text: legend[i].text+m+j*2}); 
				}
			}
		break;
		
		default:
			alert("Unknow timestamp in 'createLabels' function. alert raised at "+new Error().lineNumber);
		break;
		

	}
	
	return labels;
	
}
