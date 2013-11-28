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
	//alert(divId);
	// pour eviter tout conflit et perte de la div de chargement, on decharge la div
	unLoading();
	//alert("loading secure unloding done");
	
	
	if(divId != null && divId != "") document.getElementById(divId).appendChild(document.getElementById("divLoading"));
	
	/*try{
		
		
		// redimensionement du tableau pr center la gif de chargement
		document.getElementById("divLoading").setAttribute("height", document.getElementById(divId).getHeight());
		document.getElementById("divLoading").getElementsByTagName('tr')[0].setAttribute("height", document.getElementById(divId).getHeight());
		document.getElementById("divLoading").setAttribute("width", document.getElementById(divId).getWidth());
		document.getElementById("divLoading").getElementsByTagName('td')[0].setAttribute("width", document.getElementById(divId).getWidth());
	}catch(e){
		
		// redimensionement du tableau pr center la gif de chargement
		document.getElementById("divLoading").setAttribute("height", document.body.getHeight());
		document.getElementById("divLoading").getElementsByTagName('tr')[0].setAttribute("height", document.body.getHeight());
		document.getElementById("divLoading").setAttribute("width", document.body.getWidth());
		document.getElementById("divLoading").getElementsByTagName('td')[0].setAttribute("width", document.body.getWidth());
	}*/
		
	document.getElementById("divLoading").style.display = "block";
		
}

function unLoading(){
	
	
	require(["dojo/ready", "dojo/domReady!"], function(ready){
		ready(function(){	
			
			//alert("unloading");
			try{
				//alert(document.getElementById("divLoading"));
			document.body.appendChild(document.getElementById("divLoading"));
			
			document.getElementById("divLoading").style.display = "none";
			}catch(e){
				alert(e);
			}
			//alert("unloading done");
		});
	});
	
}

