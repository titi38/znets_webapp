function animatePlusTab(){
	document.getElementById("body").scrollTop = 0;
	// code pour faire clignoter l'onglet plus
	if(!compteur){
		compteur = 6;
		lancerAnimation();
	}
	
	// code pour passer directement a l'onglet plus
	//ChangerDiv("DivPlus");
	//ChangerOnglet("Plus");
}


function lancerAnimation(){
	
	if(compteur == 0) {
		clearTimeout(setTOAnim);
	}else{
		setTOAnim = setTimeout("animation(document.getElementById('Plus')); lancerAnimation()",500);
	}
	
}

function animation(element){
	
	switch(element.className){
		case "bipping":
			element.className = "inactive";
			break;

		case "inactive":
			element.className = "bipping";
			break;

		default:
			break;
	}
	
		compteur--;
	
	
}

function loading(divId){
	
	// pour eviter tout conflit et perte de la div de chargement, on decharge la div
	unLoading();
	
	try{
		
		if(divId != null && divId != "") document.getElementById(divId).appendChild(document.getElementById("divdiv"));
		
		// redimensionement du tableau pr center la gif de chargement
		document.getElementById("divdiv").setAttribute("height", document.getElementById(divId).getHeight());
		document.getElementById("divdiv").getElementsByTagName('tr')[0].setAttribute("height", document.getElementById(divId).getHeight());
		document.getElementById("divdiv").setAttribute("width", document.getElementById(divId).getWidth());
		document.getElementById("divdiv").getElementsByTagName('td')[0].setAttribute("width", document.getElementById(divId).getWidth());
	}catch(e){
		
		// redimensionement du tableau pr center la gif de chargement
		document.getElementById("divdiv").setAttribute("height", document.body.getHeight());
		document.getElementById("divdiv").getElementsByTagName('tr')[0].setAttribute("height", document.body.getHeight());
		document.getElementById("divdiv").setAttribute("width", document.body.getWidth());
		document.getElementById("divdiv").getElementsByTagName('td')[0].setAttribute("width", document.body.getWidth());
	}
		
	document.getElementById("divdiv").style.display = "block";
		
}

function unLoading(){
	
	document.body.appendChild(document.getElementById("divdiv"));
	
	document.getElementById("divdiv").style.display = "none";
	
}

