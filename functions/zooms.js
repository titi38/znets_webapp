
var chart$=null;
var divIdNum$ = null;
var json$=null;


function chargeZoomVar(chart,  idNum, json) {
	chart$ = chart;
	divIdNum$ = idNum;
	json$ = json;
	
}



function zoomYAxis(id){

	try{
		var scale = dijit.byId(id).value
		chart$.zoomIn("y",scale);
		chart$.zoomIn("autre y",scale);
		mySetTheme(chart$);
		chart$.zoomIn("y",scale);
		chart$.zoomIn("autre y",scale);
		mySetTheme(chart$);
		changeAxes(chart$, divIdNum$, json$);
		
		setCursor(chart$.node.id, "rect");
	}catch(e){
	}
}


function initZoom(numGraphe, Onglet){
	/*
	if(document.getElementById(Onglet).isClosable){
		if(numGraphe == 2) {try{dijit.byId('zoomProto'+Onglet).setAttribute('value', 1);}catch(e){};}
		else if(numGraphe == 3) {try{dijit.byId('zoomLoc'+Onglet).setAttribute('value', 1);}catch(e){};}
		else if(numGraphe == 4) {try{dijit.byId('zoomExt'+Onglet).setAttribute('value', 1);}catch(e){};}
		else {}
	}else{
		if(numGraphe == 1) {try{dijit.byId("zoomTraffic"+Onglet).setAttribute('value', 1);}catch(e){};}
		else if(numGraphe == 2) {try{dijit.byId("zoomPackets"+Onglet).setAttribute('value', 1);}catch(e){};}
		else if(numGraphe == 3) {try{dijit.byId("zoomLoc"+Onglet).setAttribute('value', 1);}catch(e){};}
		else if(numGraphe == 4) {try{dijit.byId("zoomExt"+Onglet).setAttribute('value', 1);}catch(e){};}
		else if(numGraphe == 5) {try{dijit.byId('zoomNb'+Onglet).setAttribute('value', 1);}catch(e){};}
		else {}
	}
	*/
}



function initAllZooms(Onglet){
	if(document.getElementById(Onglet).isClosable){
		try{dijit.byId('zoomProto'+Onglet).setAttribute('value', 1);}catch(e){};
		try{dijit.byId('zoomLoc'+Onglet).setAttribute('value', 1);}catch(e){};
		try{dijit.byId('zoomExt'+Onglet).setAttribute('value', 1);}catch(e){};
	}else{
		try{dijit.byId("zoomTraffic"+Onglet).setAttribute('value', 1);}catch(e){};
		try{dijit.byId("zoomPackets"+Onglet).setAttribute('value', 1);}catch(e){};
		try{dijit.byId("zoomLoc"+Onglet).setAttribute('value', 1);}catch(e){};
		try{dijit.byId("zoomExt"+Onglet).setAttribute('value', 1);}catch(e){};
		try{dijit.byId('zoomNb'+Onglet).setAttribute('value', 1);}catch(e){};
	}
}


function initZoomVar(onglet){
	
	Chart12[onglet] = "";
	Chart13[onglet] = "";
	Chart14[onglet] = "";
	JsonObj12[onglet] = "";
	JsonObj13[onglet] = "";
	JsonObj14[onglet] = "";
	
}

function initZoomVarNetwork(onglet){
	
	Chart1[onglet] = "";
	Chart2[onglet] = "";
	Chart3[onglet] = "";
	Chart4[onglet] = "";
	Chart5[onglet] = "";
	JsonObj1[onglet] = "";
	JsonObj2[onglet] = "";
	JsonObj3[onglet] = "";
	JsonObj4[onglet] = "";
	JsonObj5[onglet] = "";
	
}


function deleteZoomVar(onglet){
	
	// destroying zooms which are dijit elements
	try{
		dijit.byId('zoomProto'+onglet).destroy();
		dijit.byId('zoomLoc'+onglet).destroy();
		dijit.byId('zoomExt'+onglet).destroy();
	}catch(e){
	}
	
	
	// destroying saved zooms variables 
	delete Chart12.onglet;
	delete Chart13.onglet;
	delete Chart14.onglet;
	delete JsonObj12.onglet;
	delete JsonObj13.onglet;
	delete JsonObj14.onglet;
	
}




	
		