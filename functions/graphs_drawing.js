


var mySetTheme = function(chart$){
	
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
		var dc = dojox.charting, themes = dc.themes, Theme = dc.Theme, g = Theme.generateGradient,
		defaultFill = {type: "linear", space: "shape", x1: 0, y1: 0, x2: 0, y2: 100};
		//alert(chart$.theme.axis.minorTick);
		if(chart$.getAxis("y").getScaler().bounds.from < 0 && chart$.getAxis("y").getScaler().bounds.to > 0){
			MT = dojox.charting.themes.Mytheme = new dojox.charting.Theme({
				plotarea: {
					fill:{
						type: "linear",
						x1: 0, x2: 0, y1: ord-0.1, y2: ord,
						colors: [
							{ offset: 0, color: "#ffffff" },
							{ offset: 1, color: "#e5e5e5" }
						]
					}
				},
				axis:{
					majorTick: {color: "#777", width: .5, length: 6},
					minorTick: {color: "#777", width: .5, length: 3}
				}			
			});
		}else if( chart$.getAxis("y").getScaler().bounds.from >= 0 ){
			MT = dojox.charting.themes.Mytheme = new dojox.charting.Theme({
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
			MT = dojox.charting.themes.Mytheme = new dojox.charting.Theme({
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
			var theme = dc.Theme.prototype.next.apply(this, arguments);
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
	
	
	addPlotIOLabels(chart$);
	
}










var addVerticalRightAxis = function(chart$, down, up){

	var from = 0;
	var to = 0;

	for(var i = 0; i< down.length; i++){
		if(down[i]<from)from = down[i];
	}
	for(var i = 0; i< up.length; i++){
		if(up[i]>to)to = up[i];
	}
	
	chart$.addAxis("autre y", {min: from, max: to, leftBottom: false, vertical:true, fixLower: "minor", fixUpper: "minor", natural: true});
	
	chart$.addPlot("default1", {type: "Columns", hAxis: "x", vAxis: "autre y"});

	
}




var changeAxes = function(chart$, chartNum, json$){
	
	unit = json$.data[0].unit;
	factD = json$.data[0].factD;
	unitD = json$.data[0].unitD;
	
	// legende des ordonnées de gauche
	try{
		try{
		document.getElementById("unit"+chartNum+ongletActif()).removeChild( document.getElementById("unit"+chartNum+ongletActif()).firstChild ); 
		}catch(e){} 
		
		var text = document.createTextNode(unit);
		document.getElementById("unit"+chartNum+ongletActif()).appendChild(text);
	}catch(e){}  
		
		
	// legende des ordonnées de droite
	try{
		try{
		document.getElementById("unitD"+chartNum+ongletActif()).removeChild( document.getElementById("unitD"+chartNum+ongletActif()).firstChild ); 
		}catch(e){} 
			
		var text = document.createTextNode(unitD);
		document.getElementById("unitD"+chartNum+ongletActif()).appendChild(text);
	}catch(e){}  

	
	// changement des labels de l'axe vertical de droite
	try{	
		line = document.getElementById("chart"+chartNum+ongletActif()).getElementsByTagName("line");
		
		if(line.length>0){
			rightestLineX = limitLineX("right", line);
			leftestLineX = limitLineX("left", line);
			
			var chartDivs = document.getElementById("chart"+chartNum+ongletActif()).getElementsByTagName("text");
				var neg = false;
			for(var i=0; i<chartDivs.length; i++){
				try{
					if(rightestLineX < chartDivs[i].x.baseVal[0].value){
						
						//if(chartDivs[i].textContent.replace(/,/g,'').indexOf("h")==-1 && chartDivs[i].textContent.replace(/,/g,'').indexOf("/")==-1){ // on s'assure kan mm que ce n'est pas une legende de l'axe des abscisse (heures "h" ou jours "/")
							
							if(parseInt(chartDivs[i].textContent.replace(/,/g,'')) < 0) chartDivs[i].textContent = (chartDivs[i].textContent.replace(/,/g,'') * (-1));
							
							if(parseInt(chartDivs[i].textContent.replace(/,/g,'') * factD)!=(chartDivs[i].textContent.replace(/,/g,'') * factD)){
								try{
									if(parseInt((chartDivs[i].textContent.replace(/,/g,'') * factD))<10)
										chartDivs[i].textContent = (chartDivs[i].textContent.replace(/,/g,'') * factD).toFixed(3);
									else if(parseInt((chartDivs[i].textContent.replace(/,/g,'') * factD))>=10 && parseInt((chartDivs[i].textContent.replace(/,/g,'') * factD))<100)
										chartDivs[i].textContent = (chartDivs[i].textContent.replace(/,/g,'') * factD).toFixed(2);
									else if(parseInt((chartDivs[i].textContent.replace(/,/g,'') * factD))>=100 && parseInt((chartDivs[i].textContent.replace(/,/g,'') * factD))<1000)
										chartDivs[i].textContent = (chartDivs[i].textContent.replace(/,/g,'') * factD).toFixed(1);
									else
										chartDivs[i].textContent = parseInt(chartDivs[i].textContent.replace(/,/g,'') * factD);
								}catch(e){
								}
							}else{
								chartDivs[i].textContent = parseInt(chartDivs[i].textContent.replace(/,/g,'') * factD);
							}
							
						//}
						
					}
					if(chartDivs[i].x.baseVal[0].value < leftestLineX){
						
						if(parseInt(chartDivs[i].textContent.replace(/,/g,'')) < 0) {
							chartDivs[i].textContent = (chartDivs[i].textContent.replace(/,/g,'') * (-1));
							neg = true;
						}
					}
				}catch(e){}
				
			}
		}
		
	}catch(e){}

		
	// changing axis X stroke to white
	addWhiteAxisX(chart$);

}


function addWhiteAxisX(chart){
	
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
		
		var ord = ordXAxis(chart);
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
			
		}
		
	}catch(e){
		alert(e+" : "+e.lineNo);
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
		alert(e+" : "+e.lineNo);
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




function drawChart(numGraphe, Onglet){
	
	if(document.getElementById(Onglet).isClosable){	// onglet machine (de 1 à 4) ou data (6)
			
			if(numGraphe == 1){	
				dojo.empty("chart1"+Onglet);
				loading("chart1"+Onglet);
				setTimeout('dojo.addOnLoad(makeChart11); ', 50);
			}
			else if(numGraphe == 2){	
				dojo.empty("chart2"+Onglet);
				loading("chart2"+Onglet);
				setTimeout('dojo.addOnLoad(makeChart12); ', 50);
			}
			else if(numGraphe == 3){	
				dojo.empty("chart3"+Onglet);
				loading("chart3"+Onglet);
				setTimeout('dojo.addOnLoad(makeChart13); ', 50);
			}
			else if(numGraphe == 4){
				dojo.empty("chart4"+Onglet);
				loading("chart4"+Onglet);
				setTimeout('dojo.addOnLoad(makeChart14); ', 50);
			}
			else if(numGraphe == 5){
				alert("error: found a 5");				
			}
			else if(numGraphe == 6){	
				ChargerData(Onglet, "false");
			}
			else {	alert("ERR1 : in function 'clickTitre'");	}
		
			
		}else { // onglet global ou reseau
			
			if(numGraphe == 1){	
				dojo.empty("chart1"+Onglet);
				loading("chart1"+Onglet);
				setTimeout('dojo.addOnLoad(makeChart1); ', 50);
			}
			else if(numGraphe == 2){	
				dojo.empty("chart2"+Onglet);
				loading("chart2"+Onglet);
				setTimeout('dojo.addOnLoad(makeChart2); ', 50);
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
				dojo.empty("chart6"+Onglet);	
				loading("chart6"+Onglet);
				setTimeout('dojo.addOnLoad(makeChart6); ', 50);
			}
			else if(numGraphe == 7){	
				dojo.empty("chart7"+Onglet);	
				loading("chart7"+Onglet);
				setTimeout('dojo.addOnLoad(makeChart7); ', 50);
			}
			else {	alert("ERR1 : in function 'clickTitre'");	}
			
			
		}
		
}



function emptyChart(numGraphe, Onglet){
	
	
		if(document.getElementById(Onglet).isClosable){	// onglet machine (de 1 à 4) ou data (6)
			if(numGraphe == 1){
				unLoading();
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
			}else if(numGraphe == 2){
				unLoading();
				dojo.empty("chart2"+Onglet);
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
			}else if(numGraphe == 7){
				unLoading();
				dojo.empty("chart7"+Onglet);		
			}else {	alert("ERR1 : in function 'clickTitre'");	}
		}
		
		
}