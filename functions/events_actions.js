function mouseOverTitre(numGraphe , Onglet){

	var input = document.getElementById("BoutonGraphe"+numGraphe+Onglet);
	var src = input.src;
	if(src.indexOf(".png",0)>=0){
		src = src.substr(0, src.indexOf(".png",0));
		input.setAttribute('src', src.concat("Over.png"));
	}
	
}
	
function mouseOutTitre(numGraphe, Onglet){

	var input = document.getElementById("BoutonGraphe"+numGraphe+Onglet);
	var src = input.src;
			
	if(src.indexOf("Over.png",0)>=0){
		src = src.substr(0, src.indexOf("Over.png",0));
		input.setAttribute('src', src.concat(".png"));
	}
	
}

		
function clickApply(Onglet){
	
	if(Onglet != 'Plus' && Onglet != 'PlusData'){
		document.getElementById('Apply'+Onglet).disabled = true;
		document.getElementById('Apply'+Onglet).style.cursor = "default";
	}
	
	if(Onglet == "Plus"){
			
		if( dijit.byId("SelectIp").value == ""){
			
			if(!document.getElementById('ApplyPlus').disabled)
				alert("Please enter a valid Ip Adress or Host Name ");
			
		}else{
			
			if( estMachine(dijit.byId("SelectIp").value) ){
				var i = 0;
				while(TabIP[i] != dijit.byId("SelectIp").value && i<TabIP.length) i++;
				
				if(i == TabIP.length){
					i = 0;
					while(TabNAME[i] != dijit.byId("SelectIp").value && i<TabNAME.length) i++;
					if(i == TabNAME.length){
						alert("Host not found");
					}else{
						addNewIpTab(TabNAME[i]);	
					}
				}else{
					if(TabNAME[i]=="") addNewIpTab(dijit.byId("SelectIp").value);
					else addNewIpTab(TabNAME[i]);
				}
			}else{
				alert("Host not found");
			}
		}
	
	}else if(Onglet == "PlusData"){
		
		var O = addNewDataTab();
		
		dataPage='&page=1';
		
		setTimeout('ChargerData("'+O+'", "false"); ', 500);
		
	}else{
		
		document.getElementById("presetsApplied"+Onglet).setAttribute('value', document.getElementById("presets"+Onglet).value ) ;
		document.getElementById("presetsApplied"+Onglet).value = document.getElementById("presets"+Onglet).value ;
			
		if(document.getElementById("dateFin"+Onglet).value == ""){
			
			var now = new Date();
			var m = "";
			var d = "";
			var h = "";
			if( now.getMonth()+1 <10)m = "0";
			if( now.getDate() <10)d = "0";
			if( now.getHours() <10)h = "0";
			
			if(document.getElementById("presetsApplied"+Onglet).value == 1)
				document.getElementById("dateFinApplied"+Onglet).setAttribute('value', now.getFullYear()+"-"+m+(now.getMonth()+1)+"-"+d+now.getDate()+" "+"00"+":"+"00");
			else if(document.getElementById("presetsApplied"+Onglet).value == 2)
				document.getElementById("dateFinApplied"+Onglet).setAttribute('value', now.getFullYear()+"-"+m+(now.getMonth()+1)+"-"+d+now.getDate()+" "+h+now.getHours()+":"+"00");
			else alert("error in function.js' line 175");
			
		}else
			document.getElementById("dateFinApplied"+Onglet).setAttribute('value', document.getElementById("dateFin"+Onglet).value ) ;
		 
		if(document.getElementById("dateDeb"+Onglet).value == ""){
			document.getElementById("dateDebApplied"+Onglet).setAttribute('value', decalerDateP( document.getElementById("dateFinApplied"+Onglet).value, document.getElementById("presetsApplied"+Onglet).value, 0 ));
		}else
			document.getElementById("dateDebApplied"+Onglet).setAttribute('value', document.getElementById("dateDeb"+Onglet).value ) ;
			
		initAllZooms(Onglet);
		
		// on a 4 ou 6 fenetres de graphes suivant l'onglet
		var nbFenetres = 4; // 4 fenetres dans les autres onglet que le global
		
		if (document.getElementById(Onglet).isClosable){
			try{dojo.empty("chart1"+Onglet);}catch(e){}
			try{dojo.empty("chart2"+Onglet);}catch(e){}
			try{dojo.empty("chart3"+Onglet);}catch(e){}
			try{dojo.empty("chart4"+Onglet);}catch(e){}
		}else{ // 6 fenetres ds le global
			nbFenetres = 7;
			try{dojo.empty("chart1"+Onglet);}catch(e){}
			try{dojo.empty("chart2"+Onglet);}catch(e){}
			try{dojo.empty("chart3"+Onglet);}catch(e){}
			try{dojo.empty("chart4"+Onglet);}catch(e){}
			try{dojo.empty("chart5"+Onglet);}catch(e){}
			try{dojo.empty("chart6"+Onglet);}catch(e){}
			try{dojo.empty("chart7"+Onglet);}catch(e){}
		}
		
		try{
			for( var i=1 ; i<=nbFenetres; i++){
				var div = document.getElementById("DivGraphe"+i+Onglet);
				var bouton = document.getElementById("BoutonGraphe"+i+Onglet);
				//var boutonActu = document.getElementById("BoutonActu"+i+Onglet);
				
				//boutonActu.style.visibility = 'hidden';
				div.style.display = 'none';
				getParent(bouton, "div").setAttribute('style', 'margin-top: 25px; border: 3px solid #1CC48B;');
				bouton.setAttribute("src", "/images/smallGreenButtonDown.png");
			}
		}catch(e){
		}
			
		try{
			// modification de l'affichage de l'interval de temps
			document.getElementById("timeSpace"+Onglet).innerHTML = document.getElementById("dateDebApplied"+Onglet).value 
															+"<img src='/images/arrow_right.png' style='margin-left: 15px; margin-right: 15px;'>"
															+ document.getElementById("dateFinApplied"+Onglet).value;
			document.getElementById("timeSpaceChange"+Onglet).innerHTML = "";
		}catch(e){}
	}
	
}


		
function clickTitre(numGraphe, Onglet){
	
	// Faire un "mini-Apply" () avant toute action
	
	effacerNone( numGraphe, Onglet );
	
	//setParameters($('formulaire'+Onglet).serialize());
		
	var div = document.getElementById("DivGraphe"+numGraphe+Onglet);
	var bouton = document.getElementById("BoutonGraphe"+numGraphe+Onglet);
	
	
	// setting size of div when opened
	if( div.getDimensions().height != 0 && div.getAttribute('openedHeight') ==0 ){
		div.setAttribute('openedHeight', div.getDimensions().height+30);
	}else if( div.getDimensions().height == 0 && div.getAttribute('openedHeight') ==0 ){
		div.setAttribute('openedHeight', 530);
	}
			
	
	
	if( div.style.display == 'none' ){
		
		div.style.height='0px';
		
		div.style.display = 'block';		
		
		// animate opening of the div
		dojo.animateProperty({
			node: div,
			properties: { height: div.getAttribute('openedHeight') },
			onEnd: function(){
				drawChart(numGraphe, Onglet);
			}
		}).play();
		
		
		getParent(bouton, "div").setAttribute('class', 'graphWinOpened');
		bouton.setAttribute("src", "/images/smallGreenButtonUp.png");
		
		
	}else if( div.style.display == 'block' ){
		
		// animate opening of the div
		dojo.animateProperty({
			node: div,
			properties: { height: 0 },
			onEnd: function(){ 
				emptyChart(numGraphe, Onglet);
				div.style.display = 'none'; 
			}
		}).play();
		
		
		getParent(bouton, "div").setAttribute('class', 'graphWinClosed');
		bouton.setAttribute("src", "/images/smallGreenButtonDown.png");
	}else{
		alert("ERR2 : in function 'clickTitre'");
	}
			
	initZoom(numGraphe, Onglet);
}



		
/*function clickActu(numGraphe, Onglet){
	
	if(Onglet=="Logs"){			
		
		lastScrollTop = document.getElementById('TabLogsDiv').scrollHeight;
		ChargerLogs();
				
	}else {
			
		setParameters($('formulaire'+Onglet).serialize());
		initZoom(numGraphe, Onglet);	
		
		if(Onglet=="Global"){			
			if(numGraphe == 1){	
				dojo.empty("chart1");
				dojo.addOnLoad(makeChart1); 	
			}
			else if(numGraphe == 2){	
				dojo.empty("chart2");
				dojo.addOnLoad(makeChart2);	
			}
			else if(numGraphe == 3){	
				dojo.empty("chart3");
				dojo.addOnLoad(makeChart3);	
			}
			else if(numGraphe == 4){	
				dojo.empty("chart4");
				dojo.addOnLoad(makeChart4);	
				}
			else if(numGraphe == 5){	
				dojo.empty("chart5a");
				dojo.empty("chart5b");
				dojo.addOnLoad(makeChart5a);
				dojo.addOnLoad(makeChart5b);	
			}
			else if(numGraphe == 6){	
				dojo.empty("chart6a");	
				dojo.empty("chart6b");
				dojo.addOnLoad(makeChart6a);	
				dojo.addOnLoad(makeChart6b);	
			}
			else {	alert("ERR1 : in function 'clickTitre'");	}
		}else{
		
			if(numGraphe == 1){	
				dojo.empty("chart"+numGraphe+Onglet);
				dojo.addOnLoad(makeChart11); 	
			}
			else if(numGraphe == 2){	
				dojo.empty("chart"+numGraphe+Onglet);
				dojo.addOnLoad(makeChart12);	
			}
			else if(numGraphe == 3){	
				dojo.empty("chart"+numGraphe+Onglet);
				dojo.addOnLoad(makeChart13);	
			}
			else if(numGraphe == 4){	
				dojo.empty("chart"+numGraphe+"a"+Onglet);
				dojo.empty("chart"+numGraphe+"b"+Onglet);
				dojo.addOnLoad(makeChart14a);	
				dojo.addOnLoad(makeChart14b);	
				}
			else if(numGraphe == 5){	
				dojo.empty("chart"+numGraphe+"a"+Onglet);
				dojo.empty("chart"+numGraphe+"b"+Onglet);
				dojo.addOnLoad(makeChart15a);	
				dojo.addOnLoad(makeChart15b);	
			}
			else if(numGraphe == 6){	
				ChargerData(Onglet);
			}
			else {	alert("ERR1 : in function 'clickActu'");	}
			
		}
	}
	
	

}

*/		
		
