


var mySetTheme = function(chart$){
		
	require(["dojox/charting/Theme", "dojox/gfx/gradutils"], function(Theme, gradutils){
		
		var tabes = document.getElementById(chart$.node.getAttribute('id')).getElementsByTagName('rect');
		//alert(tabes.length);
		var i = 0
		var element = null;
		while(i < tabes.length && element == null){
			if(tabes[i].getAttribute('width') == chart$.plotArea.width+2 && tabes[i].getAttribute('height') == chart$.plotArea.height+2){
				element = tabes[i];
				i = tabes.length;
			}else{
				i++;
			}
		}
		/*
				element = document.createElement("img");
				element.setAttribute('style', "width:600px; height:300px;");
				element.setAttribute('src', '/images/smallGreenButtonDown.png');
		*/
		
		/*var parent = getParent(element, "svg");
		var insertBefore = null;
		i=0;
		for( i=0; i< parent.childNodes.length; i++){
			if(parent.childNodes[i] == element) insertBefore = parent.childNodes[i+1];
		}

		E = document.createElement("img");
		E.setAttribute('style', "width:600px; height:300px;");
		E.setAttribute('src', '/images/smallGreenButtonDown.png');
		
		insertBefore.appendChild(E);*/
		
		
		
		
		
		var ord = ordXAxis(chart$);

		if(chart$.theme.plotArea){
			
			chart$.theme.plotarea.fill.y2 = ord;
			chart$.theme.plotarea.fill.y1 = ord-0.1;
			
			
		}else{
				
				var MT = null;
				
				defaultFill = {type: "linear", space: "shape", x1: 0, y1: 0, x2: 0, y2: 100};
				//alert(chart$.theme.axis.minorTick);
				if(chart$.getAxis("y").getScaler().bounds.from < 0 && chart$.getAxis("y").getScaler().bounds.to > 0){
					MT  = new Theme({
						plotarea: {
							fill:{
								type: "linear",
								x1: 0, x2: 0, y1: ord-0.1, y2: ord,
								colors: [
									{ offset: 0, color: "#ffffff" },
									{ offset: 1, color: "#eeeeee" }
								]
							}
						},
						axis:{
							majorTick: {color: "#777", width: .5, length: 6},
							minorTick: {color: "#777", width: .5, length: 3}
						}			
					});
				}else if( chart$.getAxis("y").getScaler().bounds.from >= 0 ){
					MT  = new Theme({
						plotarea:{
							stroke: null,
							fill: "#ffffff"
							//style: {backgroundColor: "red", backgroundImage: "/images/redButton.png", color: "inherit"}
						},
						axis:{
							majorTick: {color: "#777", width: .5, length: 6},
							minorTick: {color: "#777", width: .5, length: 3}
						}
					});
				}else{
					MT  = new Theme({
						plotarea:{
							stroke: null,
							fill: "#e5e5e5"
						},
						axis:{
							majorTick: {color: "#777", width: .5, length: 6},
							minorTick: {color: "#777", width: .5, length: 3}
						}
					});
				}
				
				
				MT.next = function(elementType, mixin, doPost){
					//ESSS = MT;
					var theme = Theme.prototype.next.apply(this, arguments);
					if(elementType == "line"){
						theme.marker.outline = {width: 2, color: "#fff"};
						theme.series.stroke.width = 3.5;
						theme.marker.stroke.width = 2;
					} else if (elementType == "candlestick"){
						theme.series.stroke.width = 1;
					} else {
						theme.series.stroke.color = "#fff";
					}
					return theme;
				};
			
						
				MT.post = function(theme, elementType){
					theme = Theme.prototype.post.apply(this, arguments);
					if((elementType == "slice" || elementType == "circle") && theme.series.fill && theme.series.fill.type == "radial"){
						theme.series.fill = dojox.gfx.gradutils.reverse(theme.series.fill);
					}
					return theme;
				};
				
				
				chart$ = chart$.setTheme(MT);
			
		}
		
		
		chart$.fullRender();

		
		addPlotIOLabels(chart$);
		
	});
	
}










var addVerticalAxis = function(chart$, down, up, unitL, unitR, factD){

	var from = 0;
	var to = 0;

	for(var i = 0; i< down.length; i++){
		if(down[i]<from)from = down[i];
	}
	for(var i = 0; i< up.length; i++){
		if(up[i]>to)to = up[i];
	}
		
	
	var myLabelFuncL = function(text, value, precision){
		return text+" "+unitL;
	};
	
	var myLabelFuncR = function(text, value, precision){
	   
		if(Math.abs(value * factD)>0 && Math.abs(value * factD)<10)
			return (value * factD).toFixed(3)+" "+unitR;
		else if(Math.abs(value * factD)>=10 && Math.abs(value * factD)<100)
			return (value * factD).toFixed(2)+" "+unitR;
		else if(Math.abs(value * factD)>=100 && Math.abs(value * factD)<1000)
			return (value * factD).toFixed(1)+" "+unitR;
		else
			return (value * factD).toFixed(0)+" "+unitR;
		
	};


	// ajout de l'axe y de gauche
	if(unitR)
		chart$.addAxis("y", {labelFunc: myLabelFuncR, min: from, max: to, vertical:true, fixLower: "minor", fixUpper: "minor", natural: true});
	else{
		if(unitL)
			chart$.addAxis("y", {labelFunc: myLabelFuncL, min: from, max: to, vertical:true, fixLower: "minor", fixUpper: "minor", natural: true, tick:{stroke: {color:"blue"}, width: 1}});
		else
			chart$.addAxis("y", {min: from, max: to, vertical:true, fixLower: "minor", fixUpper: "minor", natural: true, tick:{stroke: {color:"blue"}, width: 1}});
	}
			
	/*// ajout de l'axe y de droite
	if(unitR)
		chart$.addAxis("autre y", {labelFunc: myLabelFuncR, min: from, max: to, leftBottom: false, vertical:true, fixLower: "minor", fixUpper: "minor", natural: true});
	else
		chart$.addAxis("autre y", {min: from, max: to, leftBottom: false, vertical:true, fixLower: "minor", fixUpper: "minor", natural: true});
	
		
	chart$.addPlot("default1", {type: "Columns", hAxis: "x", vAxis: "autre y"});
	*/
	
}




var changeAxes = function(chart$, chartNum, json$){
	
	unit = json$.data[0].unit;
	factD = json$.data[0].factD;
	unitD = json$.data[0].unitD;
	
	// legende des ordonnées de gauche
	/*try{
		try{
		document.getElementById("unit"+chartNum+ongletActif()).removeChild( document.getElementById("unit"+chartNum+ongletActif()).firstChild ); 
		}catch(e){} 
		
		var text = document.createTextNode(unit);
		document.getElementById("unit"+chartNum+ongletActif()).appendChild(text);
	}catch(e){}  */
		
		
	// legende des ordonnées de droite
	/*try{
		try{
		document.getElementById("unitD"+chartNum+ongletActif()).removeChild( document.getElementById("unitD"+chartNum+ongletActif()).firstChild ); 
		}catch(e){} 
			
		var text = document.createTextNode(unitD);
		document.getElementById("unitD"+chartNum+ongletActif()).appendChild(text);
	}catch(e){}  */

	//  !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!	WARNING	!!!!!!!!!!!!!!!!!!! 	TODO	!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
	//  !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!	WARNING	!!!!!!!!!!!!!!!!!!!	TODO	!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
	//  !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!	WARNING	!!!!!!!!!!!!!!!!!!!	TODO	!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
	//  !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!	WARNING	!!!!!!!!!!!!!!!!!!!	TODO	!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
	//  !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!	WARNING	!!!!!!!!!!!!!!!!!!!	TODO	!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
	//  !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!	WARNING	!!!!!!!!!!!!!!!!!!!	TODO	!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
	//  !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!	WARNING	!!!!!!!!!!!!!!!!!!!	TODO	!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
	//  !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!	WARNING	!!!!!!!!!!!!!!!!!!!	TODO	!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
	//  !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!	WARNING	!!!!!!!!!!!!!!!!!!!	TODO	!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
	//  !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!	WARNING	!!!!!!down!!!!!!		TODO	!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
	// changement des labels de l'axe vertical de droite
	/*try{	
		line = document.getElementById("chart"+chartNum+ongletActif()).getElementsByTagName("line");
		
		if(line.length>0){
			rightestLineX = limitLineX("right", line);
			leftestLineX = limitLineX("left", line);
			
			var chartDivs = document.getElementById("chart"+chartNum+ongletActif()).getElementsByTagName("div");
			var neg = false;
			
			for(var i=0; i<chartDivs.length; i++){
				try{
					if(chartDivs[i].childNodes[0].innerHTML){
						if(rightestLineX < chartDivs[i].scrollWidth){
							
							//if(chartDivs[i].childNodes[0].innerHTML.replace(/,/g,'').indexOf("h")==-1 && chartDivs[i].childNodes[0].innerHTML.replace(/,/g,'').indexOf("/")==-1){ // on s'assure kan mm que ce n'est pas une legende de l'axe des abscisse (heures "h" ou jours "/")
								
								if(parseInt(chartDivs[i].childNodes[0].innerHTML.replace(/,/g,'')) < 0) chartDivs[i].childNodes[0].innerHTML = (chartDivs[i].childNodes[0].innerHTML.replace(/,/g,'') * (-1));
								
								if(parseInt(chartDivs[i].childNodes[0].innerHTML.replace(/,/g,'') * factD)!=(chartDivs[i].childNodes[0].innerHTML.replace(/,/g,'') * factD)){
									try{
										if(parseInt((chartDivs[i].childNodes[0].innerHTML.replace(/,/g,'') * factD))<10)
											chartDivs[i].childNodes[0].innerHTML = (chartDivs[i].childNodes[0].innerHTML.replace(/,/g,'') * factD).toFixed(3);
										else if(parseInt((chartDivs[i].childNodes[0].innerHTML.replace(/,/g,'') * factD))>=10 && parseInt((chartDivs[i].childNodes[0].innerHTML.replace(/,/g,'') * factD))<100)
											chartDivs[i].childNodes[0].innerHTML = (chartDivs[i].childNodes[0].innerHTML.replace(/,/g,'') * factD).toFixed(2);
										else if(parseInt((chartDivs[i].childNodes[0].innerHTML.replace(/,/g,'') * factD))>=100 && parseInt((chartDivs[i].childNodes[0].innerHTML.replace(/,/g,'') * factD))<1000)
											chartDivs[i].childNodes[0].innerHTML = (chartDivs[i].childNodes[0].innerHTML.replace(/,/g,'') * factD).toFixed(1);
										else
											chartDivs[i].childNodes[0].innerHTML = parseInt(chartDivs[i].childNodes[0].innerHTML.replace(/,/g,'') * factD);
									}catch(e){
									}
								}else{
									chartDivs[i].childNodes[0].innerHTML = parseInt(chartDivs[i].childNodes[0].innerHTML.replace(/,/g,'') * factD);
								}
								
							//}
							
						}
						if(chartDivs[i].scrollWidth < leftestLineX){
							
							if(parseInt(chartDivs[i].childNodes[0].innerHTML.replace(/,/g,'')) < 0) {
								chartDivs[i].childNodes[0].innerHTML = (chartDivs[i].childNodes[0].innerHTML.replace(/,/g,'') * (-1));
								neg = true;
							}
						}
					}
				}catch(e){}
				
			}
		}
		
	}catch(e){}*/

		
	// changing axis X stroke to white
	addWhiteAxisX(chart$);

}


function addWhiteAxisX(chart){

	//  !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!	WARNING	!!!!!!!!!!!!!!!!!!! 	TODO	!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
	//  !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!	WARNING	!!!!!!!!!!!!!!!!!!!	TODO	!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
	//  !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!	WARNING	!!!!!!!!!!!!!!!!!!!	TODO	!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
	//  !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!	WARNING	!!!!!!!!!!!!!!!!!!!	TODO	!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
	//  !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!	WARNING	!!!!!!!!!!!!!!!!!!!	TODO	!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
	//  !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!	WARNING	!!!!!!!!!!!!!!!!!!!	TODO	!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
	//  !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!	WARNING	!!!!!!!!!!!!!!!!!!!	TODO	!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
	//  !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!	WARNING	!!!!!!!!!!!!!!!!!!!	TODO	!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
	//  !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!	WARNING	!!!!!!!!!!!!!!!!!!!	TODO	!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
	//  !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!	WARNING	!!!!!!down!!!!!!		TODO	!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
	
	try{
	
		/*var ord = ordXAxis(chart);
		var chartLines = chart.node.getElementsByTagName("line");
		
		for(var i = 0; i < chartLines.length; i++){
			if( parseFloat(chartLines[i].getAttribute("y1")).toFixed(3) == ord.toFixed(3) 
							&& chart.plotArea.width == (parseFloat(chartLines[i].getAttribute("x2"))-parseFloat(chartLines[i].getAttribute("x1"))) ){
				chartLines[i].setAttribute("stroke", "rgb(255, 255, 255)");
			}
		}*/
		/*aff = "";
		for(var i=0; i<getParent(chart.node, 'td').childNodes.length; i++){
			aff += i+" : "+getParent(chart.node, 'td').childNodes[i]+"\n";
		}
		alert(aff);*/
		
		
		
		
		//////////////////////////////////////addWhiteAxisX Starts here/////////////////////////////////////////////////
		
		/*var ord = ordXAxis(chart);
		var td = getParent(chart.node, 'td');
		
		if(td.childNodes.length >1 && td.lastChild.tagName == "DIV")
			td.removeChild(td.lastChild);
			
		if( (ord-26) <= (chart.plotArea.height-12)){
			
			line = chart.node.getElementsByTagName("line");
			if(line.length>0){
				rightestLineX = limitLineX("right", line);
				leftestLineX = limitLineX("left", line);
				width = rightestLineX - leftestLineX;
				
				var ord = ordXAxis(chart);
				var E;
				var E1 = document.createElement("div");
				//E1.setAttribute('style', "");
				td.appendChild(E1);
			
				if( (ord-parseInt(ord)) > 0.5) 
					ord = (ord-2).toFixed(0);
				else
					ord = (ord-1).toFixed(0);
				E = document.createElement("div");
				E.setAttribute('style', "position: absolute; background: white; height:3px; width:"+(width-2)+"; margin-left:"+(leftestLineX+2)+"px; margin-top:"+ord+"px;");
				E1.appendChild(E);
				
				E1 = document.createElement("div");
				E1.setAttribute('style', "background: black; height:1px; width:"+(width-2)+"; margin-top: 1px; position: absolute;");
				E.appendChild(E1);
			}
			
		}*/
		
	}catch(e){
		alert(e+" in graph_drawing.js at line "+e.lineNumber)
	}
}


function addZoomZero(chart){
	
	try{
		
			
		if(getParent(getParent(chart.node, 'td'), 'tr').childNodes.length >3)
			var td = getParent(getParent(chart.node, 'td'), 'tr').childNodes[3];
		else
			var td = getParent(getParent(chart.node, 'td'), 'tr').childNodes[1];
		
		if(td.childNodes.length >1 && td.lastChild.tagName == "DIV")
			td.removeChild(td.lastChild);

		
		var ord = ordXAxis(chart);
		var E;
		var E1 = document.createElement("div");
		E1.setAttribute('style', "position: absolute");
		td.appendChild(E1);
		
		if( (ord-26) > 15){
			E = document.createElement("img");
			E.setAttribute('src', '/images/maxUp.png');
			E.setAttribute('style', "position: absolute; margin-top: -2;");
			E1.appendChild(E);
		}
		
		E = document.createElement("img");
		E.setAttribute('src', '/images/zero.png');
		if( (ord-26) <= (chart.plotArea.height-12))
			E.setAttribute('style', "position: absolute; margin-top: "+(ord-26)+";");
		else
			E.setAttribute('style', "position: absolute; margin-top: "+(ord-36)+";");
		E1.appendChild(E);
		
		if( (ord-26) < (chart.plotArea.height-12-15)){
			E = document.createElement("img");
			E.setAttribute('src', '/images/maxDown.png');
			E.setAttribute('style', "position: absolute; margin-top: "+(chart.plotArea.height-12)+";");
			E1.appendChild(E);
		}
		
	
		
	}catch(e){
		alert(e+" in graph_drawing.js at line "+e.lineNumber)
	}
}



function limitLineX(side, line){
	try{
		if(side == "right"){
			rightestLineX = 0;
			for(var i=0; i<line.length; i++){
				if(line[i].x1.baseVal.value == line[i].x2.baseVal.value &&  rightestLineX < line[i].x1.baseVal.value)
					rightestLineX = line[i].x1.baseVal.value;
			}
			return rightestLineX;
		}else if(side == "left"){
			leftestLineX = 0;
			leftestLineX = line[0].x1.baseVal.value;
			for(var i=0; i<line.length; i++){
				if(line[i].x1.baseVal.value == line[i].x2.baseVal.value &&  leftestLineX > line[i].x1.baseVal.value)
					leftestLineX = line[i].x1.baseVal.value;
			}
			return leftestLineX;
		}else
			return null;
	}catch(e){
		alert(e+" :: "+e.lineNo);
	}
}




function addPlotIOLabels(chart){
	
	var ord = ordXAxis(chart);
	
	if( (ord-26) <= (chart.plotArea.height-12)){
		
		var tabes = document.getElementById(chart.node.getAttribute('id')).getElementsByTagName('g');
		
		var newG = document.createElementNS(svgNS,"g");
		newG.setAttribute('transform', 'translate(310, 45)');
		tabes[0].appendChild(newG);
	      
	      
		var newText = document.createElementNS(svgNS,"text");
		newText.setAttributeNS(null,"font-size",30);		
		newText.setAttributeNS(null,"font-family","Verdana");
		newText.setAttributeNS(null,"style", "stroke: #e5e5e5; fill: #e5e5e5 ");
		var textNode = document.createTextNode("OUTGOING");
		newText.appendChild(textNode);
		newG.appendChild(newText);
		
		newG = document.createElementNS(svgNS,"g");
		newG.setAttribute('transform', 'translate(310, 445)');
		tabes[0].appendChild(newG);
	      
	      
		newText = document.createElementNS(svgNS,"text");
		newText.setAttributeNS(null,"font-size",30);		
		newText.setAttributeNS(null,"font-family","Verdana");
		newText.setAttributeNS(null,"style", "stroke: #ffffff; fill: #ffffff ");
		textNode = document.createTextNode("INCOMING");
		newText.appendChild(textNode);
		newG.appendChild(newText);
		
	}
	
}




function drawChart(numGraphe, Onglet, isAccurate){
	
	//alert(numGraphe+" : "+Onglet+" : "+isAccurate);
	
	//alert(document.getElementById(Onglet).getAttribute("isClosable"));

	
	if(document.getElementById(Onglet).getAttribute("isClosable") == "true"){	// onglet machine (de 1 à 4) ou data (6)
			//alert("f");
			if(numGraphe == "2"){
			
				if(jsonNameFromTreePath(Onglet).indexOf("Protocole")!=-1){
					document.getElementById("Button"+numGraphe+Onglet).setAttribute("style", "display: block;"); 
				}else{
					document.getElementById("Button"+numGraphe+Onglet).setAttribute("style", "display: none;");
				}
			
			}	
			
			//alert("f1");
			if(numGraphe == 1){	
				
				if(!isAccurate){
					dojo.empty("chart1"+Onglet);
					loading("chart1"+Onglet);
					setTimeout('dojo.addOnLoad(makeChart11); ', 50);
				}else{
					dojo.empty("chart1"+Onglet+"Accurate");
					loading("chart1"+Onglet+"Accurate");
					setTimeout('dojo.addOnLoad(makeChartLocalhostsNbHostsAccurate("chart1'+Onglet+'Accurate"));', 50);
				}
			}
			else if(numGraphe == 2){	
				if(!isAccurate){
					dojo.empty("chart2"+Onglet);
					loading("chart2"+Onglet);
					setTimeout('dojo.addOnLoad(makeChart12); ', 50);
				}else{
					dojo.empty("chart2"+Onglet+"Accurate");
					loading("chart2"+Onglet+"Accurate");
					setTimeout('dojo.addOnLoad(makeChartProtoAccurate("chart2'+Onglet+'Accurate"));', 50);
				}
			}
			else if(numGraphe == 3){	
				if(!isAccurate){
					dojo.empty("chart3"+Onglet);
					loading("chart3"+Onglet);
					setTimeout('dojo.addOnLoad(makeChart13); ', 50);
				}else{
					dojo.empty("chart3"+Onglet+"Accurate");
					loading("chart3"+Onglet+"Accurate");
					setTimeout('dojo.addOnLoad(makeChartProtoAccurate("chart3'+Onglet+'Accurate"));', 50);
				}
			}
			else if(numGraphe == 4){
				if(!isAccurate){
					dojo.empty("chart4"+Onglet);
					loading("chart4"+Onglet);
					setTimeout('dojo.addOnLoad(makeChart14); ', 50);
				}else{
					dojo.empty("chart4"+Onglet+"Accurate");
					loading("chart4"+Onglet+"Accurate");
					setTimeout('dojo.addOnLoad(makeChartProtoAccurate("chart4'+Onglet+'Accurate"));', 50);
				}
			}
			else if(numGraphe == 5){
				alert("error: found a 5");				
			}
			else if(numGraphe == 6){	
				ChargerData(Onglet, "false");
			}
			else {	alert("ERR1 : in function 'clickTitre'");	}
		//alert("f2");
			
		}else { // onglet global ou reseau
			
			//alert("t1");
			if(numGraphe == "1" || numGraphe == "2"){
			
				if(jsonNameFromTreePath(Onglet).indexOf("Protocole")!=-1){
					document.getElementById("Button"+numGraphe+Onglet).setAttribute("style", "display: block;"); 
				}else{
					document.getElementById("Button"+numGraphe+Onglet).setAttribute("style", "display: none;");
				}
			
			}	
			
			
			if(numGraphe == 1){	
				
				if(!isAccurate){
					dojo.empty("chart1"+Onglet);
					loading("chart1"+Onglet);
					setTimeout('dojo.addOnLoad(makeChart1);', 50);
				}else{
					dojo.empty("chart1"+Onglet+"Accurate");
					loading("chart1"+Onglet+"Accurate");
					setTimeout('dojo.addOnLoad(makeChartProtoAccurate("chart1'+Onglet+'Accurate"));', 50);
				}
				
			}
			else if(numGraphe == 2){	
				
				if(!isAccurate){
					dojo.empty("chart2"+Onglet);
					loading("chart2"+Onglet);
					setTimeout('dojo.addOnLoad(makeChart2); ', 50);
				}else{
					dojo.empty("chart2"+Onglet+"Accurate");
					loading("chart2"+Onglet+"Accurate");
					setTimeout('dojo.addOnLoad(makeChartProtoAccurate("chart2'+Onglet+'Accurate"));', 50);
				}
				
			}
			else if(numGraphe == 3){	
				dojo.empty("chart3"+Onglet);
				loading("chart3"+Onglet);
				setTimeout('dojo.addOnLoad(makeChart3); ', 50);
			}
			else if(numGraphe == 4){
				dojo.empty("chart4"+Onglet);
				loading("chart4"+Onglet);
				setTimeout('dojo.addOnLoad(makeChart4); ', 50);
			}
			else if(numGraphe == 5){	
				dojo.empty("chart5"+Onglet);
				loading("chart5"+Onglet);
				setTimeout('dojo.addOnLoad(makeChart5); ', 50);
			}
			else if(numGraphe == 6){	
				
				if(!isAccurate){
					dojo.empty("chart6"+Onglet);	
					loading("chart6"+Onglet);
					setTimeout('dojo.addOnLoad(makeChart6); ', 50);
				}else{
					dojo.empty("chart6"+Onglet+"Accurate");
					loading("chart6"+Onglet+"Accurate");
					setTimeout('dojo.addOnLoad(makeChartNetworkNbHostsAccurate("chart6'+Onglet+'Accurate"));', 50);
				}
				
			}
			else if(numGraphe == 7){	
				
				if(!isAccurate){
					dojo.empty("chart7"+Onglet);	
					loading("chart7"+Onglet);
					setTimeout('dojo.addOnLoad(makeChart7); ', 50);
				}else{
					dojo.empty("chart7"+Onglet+"Accurate");
					loading("chart7"+Onglet+"Accurate");
					setTimeout('dojo.addOnLoad(makeChartNetworkNbHostsAccurate("chart7'+Onglet+'Accurate"));', 50);
				}
				
			}
			else {	alert("ERR1 : in function 'clickTitre'");	}
			
			
		}
		//alert("out");
		
}



function emptyChart(numGraphe, Onglet){
	
	
		if(document.getElementById(Onglet).isClosable){	// onglet machine (de 1 à 4) ou data (6)
			if(numGraphe == 1){
				unLoading();
				dojo.empty("chart1"+Onglet);	
				dojo.empty("chart1"+Onglet);	
			}else if(numGraphe == 2){
				unLoading();
				dojo.empty("chart2"+Onglet);
			}else if(numGraphe == 3){
				unLoading();
				dojo.empty("chart3"+Onglet);
			}else if(numGraphe == 4){
				unLoading();
				dojo.empty("chart4"+Onglet);	
			}else if(numGraphe == 5)alert("error: found a 5");		
			else if(numGraphe == 6){}
			else {	alert("ERR1 : in function 'clickTitre'");	}
		}else { // onglet global ou reseau
			if(numGraphe == 1){
				unLoading();
				dojo.empty("chart1"+Onglet);
				dojo.empty("chart1"+Onglet+"Accurate");
			}else if(numGraphe == 2){
				unLoading();
				dojo.empty("chart2"+Onglet);
				dojo.empty("chart2"+Onglet+"Accurate");
			}else if(numGraphe == 3){
				unLoading();
				dojo.empty("chart3"+Onglet);
			}else if(numGraphe == 4){
				unLoading();
				dojo.empty("chart4"+Onglet);
			}else if(numGraphe == 5){
				unLoading();
				dojo.empty("chart5"+Onglet);
			}else if(numGraphe == 6){
				unLoading();
				dojo.empty("chart6"+Onglet);		
				dojo.empty("chart6"+Onglet+"Accurate");
			}else if(numGraphe == 7){
				unLoading();
				dojo.empty("chart7"+Onglet);	
				dojo.empty("chart7"+Onglet+"Accurate");	
			}else {	alert("ERR1 : in function 'clickTitre'");	}
		}
		
		
}


function setZoomBar(zoomBar, chart){
	
	//var zoomRuleLabel = zoomBar.getChildren()[0];
	//zoomBar.setAttribute("minimum", chart.getAxis("y").scaler.bounds.lower);
	//zoomBar.setAttribute("maximum", chart.getAxis("y").scaler.bounds.upper);
	zoomBar.setAttribute("value", 0);
	
	//zoomBar.setAttribute("value", [chart.getAxis("y").scaler.bounds.lower, chart.getAxis("y").scaler.bounds.upper]);
		
	/*
	zoomRuleLabel.setAttribute("minimum", chart.getAxis("y").scaler.bounds.lower);
	zoomRuleLabel.setAttribute("maximum", chart.getAxis("y").scaler.bounds.upper);
	zoomRuleLabel.setAttribute("count", 20);
	zoomRuleLabel.setAttribute("labels", [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]);
	
	zoomRuleLabel.startup();
	
	
	zoomRuleLabel.setAttribute("labels", ["1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20"]);
	*/
	//alert("done");
	
}