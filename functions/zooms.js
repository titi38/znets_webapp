
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
		
		var min = chart$.getAxis("y").getScaler().bounds.lower;
		var max = chart$.getAxis("y").getScaler().bounds.upper;
		
		
		if(scale == 0){
			
			chart$.zoomIn("y", [min, max]);
			chart$.zoomIn("autre y", [min, max]);
			mySetTheme(chart$);
			
		}else{
			
			if(min == 0){
				
				while(scale > 0){
					max = max/2.0;
					scale--;
				}
			
			}else{
				
				max = Math.min(Math.abs(min), Math.abs(max));
				scale--;
				
				while(scale > 0){
					max = max/2.0;
					scale--;
				}
				
				min = max*-1;
				
			}
			
			chart$.zoomIn("y", [min, max]);
			chart$.zoomIn("autre y",  [min, max]);
			mySetTheme(chart$);
		}
		
		changeAxes(chart$, divIdNum$, json$);
		
		setCursors(chart$.node.id, "rect");
		
	}catch(e){
		//alert("errr :\n"+e+" \n alert raised in zooms.js at line "+e.lineNumber);
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
	require(["dojo/ready", "dijit/registry"], function(ready, registry){
		ready(function(){
			//alert(registry.byId("Div"+Onglet).get("closable"));
			if(registry.byId("Div"+Onglet).get("closable")){
				try{registry.byId('zoomProto'+Onglet).setAttribute('value', 1);}catch(e){};
				try{registry.byId('zoomLoc'+Onglet).setAttribute('value', 1);}catch(e){};
				try{registry.byId('zoomExt'+Onglet).setAttribute('value', 1);}catch(e){};
			}else{
				try{registry.byId("zoomTraffic"+Onglet).setAttribute('value', 1);}catch(e){};
				try{registry.byId("zoomPackets"+Onglet).setAttribute('value', 1);}catch(e){};
				try{registry.byId("zoomLoc"+Onglet).setAttribute('value', 1);}catch(e){};
				try{registry.byId("zoomExt"+Onglet).setAttribute('value', 1);}catch(e){};
				try{registry.byId('zoomNb'+Onglet).setAttribute('value', 1);}catch(e){};
			}
		});
	});
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
	
	try{Chart1[onglet] = "";}catch(e){alert(e);}
	try{Chart2[onglet] = "";}catch(e){alert(e);}
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




	
		