function creerLegende( jsonObj, suffixe1, suffixe2, nbMaxLines){
	
	// Cr�ation manuelle de la legende
	var LTab = document.getElementById("legend"+suffixe1+"Tab"+suffixe2);
						
		
	// Clear Table's children if they was created previously
	if ( LTab.hasChildNodes() ){
		while ( LTab.childNodes.length >= 1 ){
			LTab.removeChild( LTab.firstChild );   	
		} 
	}
	
						
	var TBody = document.createElement("tbody");
						
	LTab.appendChild(TBody);
	LTab.insertBefore(TBody, LTab.firstChild);
					
	var x=0;
	var y=0;
	var j=0;
	var colonne = 1;
	//var tableau = new Array(jsonObj.data[0].nbItems);
	var tableau = new Array();	
	
	//for( var i = 0; i< tableau.length; i++) tableau[i] = new Array(4);
	
	var Ntr = document.createElement("tr");
	
	while(jsonObj.data[2+x] != null){
		while(jsonObj.data[2+x].tab[y] !=null){
			if(jsonObj.data[2+x].tab[y].item != null){
				var existant = false;
				
				for( var i = 0; i< tableau.length; i++) {
					if (tableau[i][0] == jsonObj.data[2+x].tab[y].item)
						existant = true;
				};
				
				if(!existant){
					tableau[i] = new Array(4)
					//if(j>=61)alert(">=");
					tableau[j][0] = jsonObj.data[2+x].tab[y].item;
					tableau[j][1] = jsonObj.data[2+x].tab[y].color;
					if(jsonObj.data[2+x].tab[y].c){ if(x==0 && y ==0) alert('hi'); tableau[j][2] = jsonObj.data[2+x].tab[y].c.toLowerCase();}
					if(jsonObj.data[2+x].tab[y].tooltip) tableau[j][3] = jsonObj.data[2+x].tab[y].tooltip.split("(")[0];
					j++;
				}
			}
			y++;
		}
		y=0;
		x++;
	}
	x=0;
	
	
	tableau.sort(compareLegendArray);
	
	
	var nbColonne = tableau.length / nbMaxLines;
	
 
	for (var l = nbMaxLines -1 ; l >= 0 ; l--){
		var position = TBody.firstChild;
		var Ntr = document.createElement("tr");
		TBody.appendChild(Ntr);
		TBody.insertBefore(Ntr, position);
 
		for (var c = 0; c < nbColonne; c++){
			var i = nbMaxLines * c + l;
			if (i < tableau.length && tableau[i][0] != null){
				var Ntd = document.createElement("td");
				Ntd.setAttribute('id','legend'+suffixe1+suffixe2+tableau[i][0]);
				Ntd.setAttribute('title',tableau[i][3]);
				Ntd.setAttribute('onmouseover', ' overLegende("chart'+suffixe1+suffixe2+'", "' +tableau[i][1]+ ' " ); this.setAttribute("style" ,"border: 1px solid black; cursor: pointer;"); ');
				Ntd.setAttribute('onmouseout', ' outLegende("chart'+suffixe1+suffixe2+'"); this.setAttribute("style","border: 1px solid white; cursor: pointer;"); ');
				Ntd.setAttribute('onclick', ' clickLegende(this.id); ');
				Ntd.setAttribute('style','cursor: pointer; border: 1px solid white');
				Ntr.appendChild(Ntd);
 
				var TABLE = document.createElement("table");
				Ntd.appendChild(TABLE);
				
				var TR = document.createElement("tr");
				TABLE.appendChild(TR);
 
				var TD = document.createElement("td");
				TR.appendChild(TD);
 
				var NDiv = document.createElement("div");
				NDiv.setAttribute('style', "width:10px; height:10px; background:"+tableau[i][1]);
				NDiv.setAttribute('align', 'left');
				TD.appendChild(NDiv);
				
				TD = document.createElement("td");
				TD.setAttribute('style','white-space: nowrap');
				TR.appendChild(TD);
				
				var font = document.createElement("font");
				font.setAttribute('size', 1);
				font.setAttribute('id', 'font'+suffixe1+suffixe2+tableau[i][0]);
				TD.appendChild(font);
 
				var text = document.createTextNode(tableau[i][0]);
				font.appendChild(text);
				
				
				if(tableau[i][2]){
					var img = document.createElement("img");
					img.setAttribute('style', 'margin-left: 5px');
					if(tableau[i][2]=="--") img.setAttribute('src', '/images/flags/unknown.png');
					else img.setAttribute('src', '/images/flags/'+tableau[i][2]+'.png');
					TD.appendChild(img);
				}
				
			}
		}
	}
	
}




function creerLegendeProtocole(JsonObj, index, onglet, Vcolor){

	//Legende
	var LTab = document.getElementById("legend"+index+"Tab"+onglet);
							
	// Clear Table's children if they was created previously
	if ( LTab.hasChildNodes() ){
		while ( LTab.childNodes.length >= 1 ){
			LTab.removeChild( LTab.firstChild );       
		} 
	}
	
	var TBody = document.createElement("tbody");
	
	LTab.appendChild(TBody);
	LTab.insertBefore(TBody, LTab.firstChild);
	
	var x=0;
	var Ntr = document.createElement("tr");
	try{
		while(JsonObj.data[2+x] != null){
			if(JsonObj.data[2+x].name != null){
				if(document.getElementById('legend'+index+JsonObj.data[2+x].name+onglet) == null){
					
					var position = TBody.firstChild;
					
					var Ntr = document.createElement("tr");
					TBody.appendChild(Ntr);
					TBody.insertBefore(Ntr, position);
						
					var Ntd = document.createElement("td");
					Ntd.setAttribute('id', 'legend'+index+JsonObj.data[2+x].name+onglet);
					Ntd.setAttribute('style','border: 1px solid white');
					Ntr.appendChild(Ntd);
					Ntr.insertBefore(Ntd, Ntr.firstChild);
					
					var NDiv = document.createElement("div");
					NDiv.setAttribute('style', "width:10px; height:10px; background: "+Vcolor[x/2]);
					NDiv.setAttribute('align', 'left');
					Ntd.appendChild(NDiv);
					
					var text = document.createTextNode(JsonObj.data[2+x].name);
					Ntr.appendChild(text);	
				}
			
			}
			x++;
		}
		x=0;
	}catch(e){
	}	

}


function purgerLegende( suffixe1, suffixe2 ){
	
	var LTab = document.getElementById("legend"+suffixe1+"Tab"+suffixe2);
						
	// Clear Table's children if they was created previously
	if ( LTab.hasChildNodes() ){
		while ( LTab.childNodes.length >= 1 ){
			LTab.removeChild( LTab.firstChild );   		
		} 
	}

}

