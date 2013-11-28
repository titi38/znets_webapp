/*function decalerDate(date, an, mois, jour, heure){
	alert("hi");
	return decalerDate(date, an, mois, jour, heure, 0);
	
}*/

function decalerDate(date, an, mois, jour, heure, minute){
	//alert(an+" "+mois+" "+jour);
	
	var date_heure = date.split(" ");
	
	var CHARannee_mois_jour = date_heure[0].split("-");
	var CHARheure_minute = date_heure[1].split(":");
	
	var annee_mois_jour = []  ;
	var heure_minute = [];
	
	annee_mois_jour[0] = parseInt(CHARannee_mois_jour[0],10);
	annee_mois_jour[1] = parseInt(CHARannee_mois_jour[1],10);
	annee_mois_jour[2] = parseInt(CHARannee_mois_jour[2],10);
	heure_minute[0] = parseInt(CHARheure_minute[0],10);
	heure_minute[1] = parseInt(CHARheure_minute[1],10);
	
	heure_minute[1] += minute;
	
	while (heure_minute[1] >= 60){
		heure_minute[1] += -60;
		heure ++;
	}
	
	while (heure_minute[1] <0 ){
		heure_minute[1] += 60;
		heure --;
	}
	
	heure_minute[0] += heure;
	
	while (heure_minute[0] >= 24){
		heure_minute[0] += -24;
		jour ++;
	}
	
	while (heure_minute[0] <0 ){
		heure_minute[0] += 24;
		jour --;
	}
	
	annee_mois_jour[2] += jour;
	
	while ( (annee_mois_jour[2] > 31 && annee_mois_jour[1] == 1) ||
			(annee_mois_jour[2] > 28 && annee_mois_jour[1] == 2 && annee_mois_jour[0]%4 != 0) ||
			(annee_mois_jour[2] > 29 && annee_mois_jour[1] == 2 && annee_mois_jour[0]%4 == 0) ||
			(annee_mois_jour[2] > 31 && annee_mois_jour[1] == 3) ||
			(annee_mois_jour[2] > 30 && annee_mois_jour[1] == 4) ||
			(annee_mois_jour[2] > 31 && annee_mois_jour[1] == 5) ||
			(annee_mois_jour[2] > 30 && annee_mois_jour[1] == 6) ||
			(annee_mois_jour[2] > 31 && annee_mois_jour[1] == 7) ||
			(annee_mois_jour[2] > 31 && annee_mois_jour[1] == 8) ||
			(annee_mois_jour[2] > 30 && annee_mois_jour[1] == 9) ||
			(annee_mois_jour[2] > 31 && annee_mois_jour[1] == 10) ||
			(annee_mois_jour[2] > 30 && annee_mois_jour[1] == 11) ||
			(annee_mois_jour[2] > 31 && annee_mois_jour[1] == 12) )
	{	
		
		if ( annee_mois_jour[1] == 4 || annee_mois_jour[1] == 6 || annee_mois_jour[1] == 9 || annee_mois_jour[1] == 11){
			annee_mois_jour[2]+= -30;
		}else if ( annee_mois_jour[1] == 2 && annee_mois_jour[0]%4 != 0){
			//alert("1!=");
			annee_mois_jour[2]+= -28;
		}else if ( annee_mois_jour[1] == 2 && annee_mois_jour[0]%4 == 0){
			//alert("1==");
			annee_mois_jour[2]+= -29;
		}else {
			annee_mois_jour[2]+= -31;
		}
		
		mois++;
		
	}
	//alert("moisAV: "+mois);
	while (annee_mois_jour[2] <=0)
	{
		
		if ( annee_mois_jour[1]-1 == 4 || annee_mois_jour[1]-1 == 6 || annee_mois_jour[1]-1 == 9 || annee_mois_jour[1]-1 == 11){
			annee_mois_jour[2] += 30;
		}else if ( annee_mois_jour[1]-1 == 2 && (annee_mois_jour[0]-1)%4 != 0){
			//alert("2!=");
			annee_mois_jour[2]+= 28;
		}else if ( annee_mois_jour[1]-1 == 2 && (annee_mois_jour[0]-1)%4 == 0){
			//alert("2==");
			annee_mois_jour[2] += 29;
		}else {
			annee_mois_jour[2] += 31;
		}
		
		mois --;
	}
	//alert("moisAP: "+mois);
	
	annee_mois_jour[1] += mois;
	
	while( annee_mois_jour[1] <= 0){
		annee_mois_jour[1] += 12
		an-- ;
	}
		
	while( annee_mois_jour[1] > 12){
		annee_mois_jour[1] += -12
		an++ ;
	}
	//alert(jour);
	if ( annee_mois_jour[1] == 4 || annee_mois_jour[1] == 6 || annee_mois_jour[1] == 9 || annee_mois_jour[1] == 11){
			if(annee_mois_jour[2]> 30) annee_mois_jour[2]= 30;
	}else if ( annee_mois_jour[1] == 2 && annee_mois_jour[0]%4 != 0){
			//alert("3!=");
			if(annee_mois_jour[2]> 28) annee_mois_jour[2]= 28;
	}else if ( annee_mois_jour[1] == 2 && annee_mois_jour[0]%4 == 0){
			//alert("3==");
			if(annee_mois_jour[2]>29 || (mois == -1 && jour == -1 && annee_mois_jour[2]<29)) annee_mois_jour[2]= 29;
			//alert(annee_mois_jour[2]);
	}else {
			if(annee_mois_jour[2]> 31) annee_mois_jour[2]= 31;
	}

	annee_mois_jour[0] += an ;	
	
	CHARannee_mois_jour[0] = annee_mois_jour[0];
	
	if( annee_mois_jour[1]<10)
	CHARannee_mois_jour[1] = "0"+annee_mois_jour[1];
	else	
	CHARannee_mois_jour[1] = annee_mois_jour[1];
	
	if( annee_mois_jour[2]<10)
	CHARannee_mois_jour[2] = "0"+annee_mois_jour[2];
	else	
	CHARannee_mois_jour[2] = annee_mois_jour[2];
	
	if( heure_minute[0]<10)
	CHARheure_minute[0] ="0"+heure_minute[0];
	else	
	CHARheure_minute[0] =heure_minute[0];
	
	if( heure_minute[1]<10)
	CHARheure_minute[1] = "0"+heure_minute[1];
	else
	CHARheure_minute[1] = heure_minute[1];
	
	return CHARannee_mois_jour[0]+"-"+CHARannee_mois_jour[1]+"-"+CHARannee_mois_jour[2]+" "+CHARheure_minute[0]+":"+CHARheure_minute[1]
}

function decalerDateP(date, presets, plus){
	
	if(presets == "2"){
		if(plus)
			return decalerDate(date, 0,0,1,0,0);
		else
			return decalerDate(date, 0,0,-1,0,0);
	}else if(presets == "1"){
		if(plus)
			return decalerDate(date, 0,1,0,0,0);
		else
			return decalerDate(date, 0,-1,0,0,0);
		
	}else if(presets == "LD"){
		if(plus)
			return decalerDate(date, 0,0,1,0,0);
		else
			return decalerDate(date, 0,0,-1,0,0);
		
	}else if(presets == "1 Year"){
		if(plus)
			return decalerDate(date,1, 0,0,0,0);
		else
			return decalerDate(date,-1, 0,0,0,0);
		
	}else{
		alert("ERROR : in 'cal.js' function 'decalerDateP' ");
		return null;
	}
	
}