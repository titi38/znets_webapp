	
dojo.require("dojox.widget.Calendar");
makeCalendar = function(){
	
	// create a new instance of calendar
	
	dojo.extend(dojo.NodeList, {
		
		addPicker: function(args){
			
			this.forEach(function(n){
				
				var O;
				if(n.id.split("Deb")[1]) O=n.id.split("Deb")[1];
				else O=n.id.split("Fin")[1];
				
				// add an image after the input
				var img;
				if(dojo.hasClass(n, "hasIcon")){
					
					var id = n.id;
					img = dojo.query("img[for='" + id + "']")[0]; 
					
				}else{
					
					// create and place the image. no class="hasIcon" ok. 
					img = dojo.doc.createElement('img');
					
					if( O != "Data")
						dojo.attr(img, {
							src:"/images/calendarDisabled_icon.png", 
							alt:"calendar",
							style:{ cursor:"default" }
						});
					else
						dojo.attr(img, {
							src:"/images/calendar_icon.png", 
							alt:"calendar",
							style:{ cursor:"pointer" }
						});
					
					dojo.place(img, n, "after");
					dojo.attr(n, {Class : "hasIcon"});
					
				}
				
				dojo.connect(img, "onclick", function(e){
					if(!document.getElementById(n.id).disabled){
						
						var O;
						if(n.id.split("Deb")[1]) O=n.id.split("Deb")[1];
						else O=n.id.split("Fin")[1];
							
						if(O != "Data"){
							calendarDisplay(false,document.getElementById("presets"+O).value==2,n.id);
						}else{
							calendarDisplay(true,true,n.id);
						}
						dijit.byId("dialogCalendar").show();
						
					}
				})
				
			});
			return this; 
		}
	});
	
	dojo.query(".datePicker").addPicker();
	
}

dojo.addOnLoad(makeCalendar);

