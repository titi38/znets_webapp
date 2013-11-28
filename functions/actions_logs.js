function fadeNewLogs(){
	
	setTimeout("fadeLogs()",3000);
	
}


function fadeLogs(){
	
	var tabTR = document.getElementById('TabLogs').getElementsByTagName("tr");
	
	for( var i=0; i< tabTR.length; i++){
		
		if( tabTR[i].getAttribute("style") =="background: #EEFFEE;")
			tabTR[i].setAttribute("style","background: white;");
	
	}
	
}




