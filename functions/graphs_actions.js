// definition des evens click et passage sur graphe

function overLegende(chart, couleur){

	var red = parseInt(""+couleur.charAt(1)+couleur.charAt(2), 16);
	var green = parseInt(""+couleur.charAt(3)+couleur.charAt(4), 16);
	var blue = parseInt(""+couleur.charAt(5)+couleur.charAt(6), 16);
		
	if(red != green || red != blue ){

		colors[1] =  "rgb("+red+", "+green+", "+blue+")";
	
		tabRect = document.getElementById(chart).getElementsByTagName("rect");
	
		clignote();
		clignoteGraph();
		
	}

}

function outLegende(chart){

	TR = tabRect;
	tabRect = null;
	//tabRect = document.getElementById(chart).getElementsByTagName("rect");
	try{
		for( var i=0; i<TR.length; i++){
			try{
				var text = ""+ TR[i].getAttribute('fill');
				if(text == colors[2]){
					TR[i].setAttribute('fill', colors[1]);
					TR[i].setAttribute('stroke', "rgb(0, 0 ,0)");
					TR[i].setAttribute('stroke-width', "1");
				}
			}catch(e){}
		}
	}catch(e){}
	//setTOClign=null;
	clearTimeout(setTOClign);
	
	
}



function clickLegende(id){

	try{
		// intialisation de l'onglet plus
		initPlusData();
		
		//alert(ongletActif());
		copyPreset(ongletActif(), "Plus");
		
		var tabFont = document.getElementById(id).getElementsByTagName("font");
		
		if(tabFont[0].innerHTML.split("/")[1] != null){ // ports
			try{
				setPlusTabProto("", tabFont[0].innerHTML.split("/")[1].slice(0,3));
				document.getElementById("portLoc").value = tabFont[0].innerHTML.split("/")[0];		
			}catch(e){
			}				
		}else if(tabFont[0].innerHTML.split("(")[1] != null){ // country or AS
			//alert(isNaN(tabFont[0].innerHTML.split("(")[1].split(")")[0]))
			try{
				if(isNaN(tabFont[0].innerHTML.split("(")[1].split(")")[0]))
					SelectCountry.setAttribute( 'value' , tabFont[0].innerHTML.split("(")[0] );		
				else{					
					document.getElementById("AS").setAttribute("value", tabFont[0].innerHTML.split("(")[1].split(")")[0]);
					document.getElementById("AS").value = tabFont[0].innerHTML.split("(")[1].split(")")[0];
					
					//document.getElementById("AS").onchange();
				}
			}catch(e){
			}			
		/*}else if(tabFont[0].innerHTML == "TCP" || "UDP" || "OTHERS"){
			alert("hi");*/
		}else{// machine (ip ou name)
			//SelectIp.setAttribute( 'value' , ipFrom(tabFont[0].innerHTML));
		}
		
		animatePlusTab();
		
	}catch(e){
		
	}
	
}


function clignoteGraph(){
	
	setTOClign = setTimeout("clignote();clignoteGraph()",500);
	
}


function clignote(){
	
	try{
		for( var i=0; i<tabRect.length; i++){
			
			var colorText = ""+ tabRect[i].getAttribute('fill');
			
			switch(colorText){
				case colors[1]:
					try{
						tabRect[i].setAttribute('fill', colors[2]);
						tabRect[i].setAttribute('stroke', "rgb(255, 0 ,0)");
						tabRect[i].setAttribute('stroke-width', "2");
					}catch(e){alert(e);}
					break;

				case colors[2]:
					try{
							tabRect[i].setAttribute('fill', colors[1]);
							tabRect[i].setAttribute('stroke', "rgb(0, 0 ,0)");
							tabRect[i].setAttribute('stroke-width', "1");
					}catch(e){alert(e);}
				break;

				default:
					break;
			}
				
		}
	}catch(e){
	}
	
}

function clickToPie(label, name, port, proto, dir, direction, multiplePie, JN, service, country, as,isApp){
	
	//alert(name+" : "+ipFrom(name));
	//alert("label : "+label+"\n name : "+name+"("+ipFrom(name)+")"+"\n port : "+port+"\n proto : "+proto+"\n dir : "+dir+"\n direction : "+direction+"\n multiplePie : "+multiplePie+"\n JN : "+JN+"\n service : "+service+"\n country : "+country+"\n as : "+as)
	
	try{
	
	// initialisation du formulaire
	initPlusData();
		
	
	// remplissage des champs de l'onglet plus (1er partie)
	
	setPlusTab(label, name, ongletActif());
		
	
	// check de la valeur de dRDTD egale a celle du champ "disabledRecordDataflowToDatabase" du fichier de conf
	// si dRDTD == false ( !dRDTD == true ) alors affichage des camemberts; sinon, non
	if(!dRDTD && name != " Remainder " && port != " Remainder " && proto != "OTH" && country != " Remainder "){
		
		
		// sauvegarde du nom du json a utiliser pour le camembert
		JsonName = JN;
		
		
		// pretraitement du parametre proto
		switch(proto){
			case 'TCP':
				proto = 'tcp';
				break;
			case 'UDP':
				proto = 'udp';
				break;
			case 'OTH':
				proto = 'others';
				break;
			default :
				break;
			}
		
		
		// remplissage des champs de l'onglet plus (2eme partie)
		setPlusTabProto(label, proto);
			
		
			
		try{
			document.getElementById("dir").value = dir;
		}catch(e){
			document.getElementById("dir").value = "";
		}
		
		
		
		if(port != ""){
			if(dir == "<"){
				document.getElementById("portLoc").value = port;
			}else if(dir == ">"){
				document.getElementById("portExt").value =port;	
			}else {
				//document.getElementById("dir").value = "";
			}
		} 
		
		dialogCamemberts.show();
		document.getElementById("divC2").style.display='none';
		
		if(multiplePie){
			document.getElementById("buttonDialog").style.visibility= "visible";
			document.getElementById("buttonDialog").innerHTML = "Display Ext. Chart";	
			document.getElementById("buttonDialog").innerHTML = "Display Ext. Chart";	
			document.getElementById("camembert1Sub").innerHTML = "Local";
			
		}else{
			document.getElementById("buttonDialog").style.visibility= "hidden";
			document.getElementById("camembert1Sub").innerHTML = "External";
		}
		
		
		// defintion et ecriture des parametres
		// determination de la valeur du preset
		var psetValue;
		if(ongletActif().split('Onglet')[1]){
			psetValue = document.getElementById("presetsApplied"+ongletActif().split('Onglet')[1]).value ;
		}else{
			psetValue = document.getElementById("presetsApplied"+ongletActif()).value ;
		}
		
		// definition des df et dd
		var DD = document.getElementById("dateDebData").value;
		DD = DD.replace(/ /, "%20");
		DD = DD.replace(/:/,"%3A");
		var DF = document.getElementById("dateFinData").value;
		DF = DF.replace(/ /, "%20");
		DF = DF.replace(/:/,"%3A");
		//alert("in");
		
		// ecriture :
		setParameters( null, "dd="+DD+"&df="+DF );
		addToParameters( null, "&dh="+document.getElementById("dh").value+"&pset="+psetValue );
		if(proto!="") addToParameters( null, "&proto="+proto );
		if(port!="") addToParameters( null, "&port="+port );
		if(direction!="") addToParameters( null, "&type="+direction );
		if(service!="") addToParameters( null, "&service="+service );
		if(name!="") addToParameters( null, "&ip="+ipFrom(name) );
		if(country!=""){
			if(country == "All" || country == "N/A"){
				//addToParameters( "&c=" );
			}else{
				if(TabCOUNTRY[country])
					addToParameters( null, "&c="+TabCOUNTRY[country] );
			}
		}
		if(as!=""){
			document.getElementById("AS").setAttribute("value", as);
			document.getElementById("AS").value = as;
			//document.getElementById("AS").onchange();
			//alert(label);
			if(isApp)
				{
				addToParameters( null, "&app="+as );
				}
			else
				{
				addToParameters( null, "&as="+as );
				}
			
		}
		if(ongletActif() != "Global" && !document.getElementById(ongletActif()).isClosable) addToParameters( null, "&net="+ongletActif() );
		
		// ajout des parametres compl�mentaire "type" et "ip si nous sommes dans les cas d'un click sur non-port
		// if(port == "") addToParameters( "&type="+direction+"&ip="+ipFrom(name) );
		
		datesTitle = "<br>"+document.getElementById("dateDebData").value+"<img style='margin-left: 15px; margin-right: 15px;' src='/images/arrow_right.png'>"+document.getElementById("dateFinData").value;
		if(name != "" && proto =="") dialogCamemberts.setAttribute('title', "<center>Traffic of "+name+datesTitle+"<center>");
		else if(country != "") dialogCamemberts.setAttribute('title', "<center>Traffic in "+country+datesTitle+"<center>");
		else if(as != "") dialogCamemberts.setAttribute('title', "<center>Traffic of ASN "+as+": "+ resolveASNum(as)+datesTitle+"<center>" );
		else if(port != "") {
			if(name != "") dialogCamemberts.setAttribute('title', "<center>Traffic of "+name+" using port "+port+"/"+proto+datesTitle+"<center>");
			else dialogCamemberts.setAttribute('title', "<center>Using port "+port+"/"+proto+datesTitle+"<center>");
		}
		else if(proto != "") {
			if(name != "") dialogCamemberts.setAttribute('title', "<center>Traffic of "+name+" using protocole "+proto+datesTitle+"<center>");
			else dialogCamemberts.setAttribute('title', "<center>Using protocole "+proto+datesTitle+"<center>"); 
		}
		else dialogCamemberts.setAttribute('title', "<center>"+datesTitle+"<center>");
		
		
		dialogCamemberts.setAttribute('alt', "");
		//document.getElementById("dialogCamemberts").setAttribute('alt', "");
		
		// Resizing dialog widget if necessary
		if(dialogCamemberts.title.length > 200){
			dialogCamemberts.setAttribute('dimensions', [400, 240+dialogCamemberts.title.length]);
			dialogCamemberts.layout();
		}else{
			dialogCamemberts.setAttribute('dimensions', [400, 430]);
			dialogCamemberts.layout();
		}
		
		
		// dessin du graphe par dojo
		dojo.empty("camembert1");
		loading("camembert1");
		setTimeout('dojo.addOnLoad(makeChart16a); ', 50);
	}else{
		animatePlusTab();
	}
}catch(e){alert(e+" : "+e.lineNumber);}
	
}



function clickMore(){
	if(dialogCamemberts.dimensions[0] == 800){
		clickMoreAction();
		dialogCamemberts.set('dimensions', [400, dialogCamemberts.get('dimensions')[1]]); 
		dialogCamemberts.startup();
		dialogCamemberts.layout();
		dialogCamemberts.resize();
		//setTimeout("dialogCamemberts.layout()", 6000);
	}else{
		clickMoreAction();
		dialogCamemberts.set('dimensions', [800, dialogCamemberts.get('dimensions')[1]]); 
		dialogCamemberts.startup();
		dialogCamemberts.layout();
		dialogCamemberts.resize();
		//setTimeout("dialogCamemberts.layout()", 6000);
	}
	
}


function clickMoreAction(){
	
	JsonName = JsonName.replace(/Loc/, "Ext");//globalExtHostsServiceTraffic.json";
	
	var button = document.getElementById("buttonDialog");
	
	if(button.innerHTML == "Display Ext. Chart"){

		button.innerHTML = "Hide Ext. Chart";
		document.getElementById("divC2").style.display='block';
		dojo.empty("camembert2");
		loading("camembert2");
		setTimeout('dojo.addOnLoad(makeChart16b); ', 50);
		//JsonName ="";
		//dojo.addOnLoad(makeChart16b); 
	}
	else if(button.innerHTML == "Hide Ext. Chart"){ 
				
		button.innerHTML = "Display Ext. Chart";
		document.getElementById("divC2").style.display='none';
	}
	else alert("eror");
	
	
}


function eventMouse(evt, suffixe1, suffixe2){
	
	// souris dessus
	if(evt.type === "onmouseover"){
		
		var couleur = evt.run.data[evt.index].color; 	// element comparateur de couleur (graphe)
		var item = evt.run.data[evt.index].item;		// element comparateur de nom (legende)

		/*var red = myParseInt(""+couleur.charAt(1)+couleur.charAt(2), 16);
		var green = myParseInt(""+couleur.charAt(3)+couleur.charAt(4), 16);
		var blue = myParseInt(""+couleur.charAt(5)+couleur.charAt(6), 16);
		
		
		if(red != green || red != blue){
			colors[1] = "rgb("+red+", "+green+", "+blue+")";
			colors[2] = "rgb(254, 254, 254)";
									
			// modif. graphe
			var element = document.getElementById( "chart"+suffixe1+suffixe2);
			var tabRect = element.getElementsByTagName("rect");
											
			for( var i=0; i<tabRect.length; i++){
				try{
					var text = ""+ tabRect[i].getAttribute('fill');
					if(text == colors[1]){
						tabRect[i].setAttribute('fill', colors[2]);
						tabRect[i].setAttribute('stroke', "rgb(255, 0 ,0)");
						tabRect[i].setAttribute('stroke-width', "2");
					}
				}catch(e){}
			}*/
			overLegende("chart"+suffixe1+suffixe2, couleur);
									
			// modif legende
			document.getElementById( "legend"+suffixe1+suffixe2+item).setAttribute('style','border:  1px solid black');	
			//document.getElementById( "legend"+suffixe1+"Tab"+suffixe2).scrollTo(document.getElementById( "legend"+suffixe1+suffixe2+item).parentNode);
			//document.getElementById( "legend"+suffixe1+"Tab"+suffixe2).scrollTo(document.getElementById( "legend"+suffixe1+suffixe2+item).parentElement);
			
			// scroll legend to element
			document.getElementById( "legend"+suffixe1+suffixe2).scrollTop = document.getElementById( "legend"+suffixe1+suffixe2+item).offsetTop;
		
	}
	
	
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////	
	// souris d�pointe		
	if(evt.type === "onmouseout" || evt.type === "onclick"){
		//alert('hi');
		var couleur = evt.run.data[evt.index].color; 	// element comparateur de couleur (graphe)
		var item = evt.run.data[evt.index].item;		// element comparateur de nom (legende)
		
		//alert("chart"+suffixe1+suffixe2);			
		// modif. graphe
		/*var element = document.getElementById( "chart"+suffixe1+suffixe2);
		var tabRect = element.getElementsByTagName("rect");
		
		
		for( var i=0; i<tabRect.length; i++){
			try{
				var text = ""+ tabRect[i].getAttribute('fill');
				if(text == colors[2]){
					tabRect[i].setAttribute('fill', colors[1]);
					tabRect[i].setAttribute('stroke', "rgb(0, 0 ,0)");
					tabRect[i].setAttribute('stroke-width', "1");
				}
				
			}catch(e){}
		}*/
		outLegende("chart"+suffixe1+suffixe2);
		
		// modif legende
		document.getElementById( "legend"+suffixe1+suffixe2+item).setAttribute('style','border:  1px solid white');	
	
	}
	
}



