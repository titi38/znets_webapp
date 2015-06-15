
var date=0;
var dateNow=0;
var calendarWithHours=true;
var calendarWithMinutes=false;
var fieldId='';


/***********************************************************************/

function calendarTheEnd()
{
	var newDate = "";
	var m = "";
	var d = "";
	var h = "";
	var mn = "";
	
	if( date.getMonth()+1 <10)m = "0";
	if( date.getDate() <10)d = "0";
	if( date.getHours() <10)h = "0";
	if( date.getMinutes() <10)mn = "0";
	
	newDate = date.getFullYear()+"-"+m+(date.getMonth()+1)+"-"+d+date.getDate()+" "+h+date.getHours()+":"+mn+date.getMinutes();
	
	document.getElementById(fieldId).value = newDate;
	document.getElementById(fieldId).onchange();
	
	dijit.byId("dialogCalendar").hide();
	
}

/***********************************************************************/

function calendarClickDate()
{
  if (!calendarWithHours)
		calendarTheEnd();
}

/***********************************************************************/

function calendarFill(date)
{
        var cur_month = date.getMonth();
        var cur_year = date.getYear();
				var isCurrentMonth=false;
				
        cur_year += 1900;
        
        months = new Array ('Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec');
        nbJours = new Array(31,28,31,30,31,30,31,31,30,31,30,31);
        if(cur_year%4 == 0)
        {
                nbJours[1]=29;
        }
        total = nbJours[cur_month];

        var dep_j = new Date(date);
        dep_j.setDate(1);
	
        if(dep_j.getDate()==2)
        {
                dep_j=setDate(0);
        }
        dep_j = dep_j.getDay();
	
	sem = 0;
	nbLigne = 0;

        var selection = '<select onchange="calendarSelectChangeMonth(this.value);">';
        for (i=0; i<12; i++)
        {
        	if(dateNow.getMonth() >= i && dateNow.getYear()+1900==cur_year || dateNow.getYear()+1900!=cur_year)
        	{
            selection += '<option value="'+i+'"';
            if (cur_month == i) selection +=' selected="true"';
            selection += '>' + months[i] +'</option>';
          }
        }
        selection += "</select> ";

				selection += '<select onchange="calendarSelectChangeYear(this.value);">';
				for (i=dateNow.getYear()+1900; i>cur_year-20; i--)
        {
          selection += '<option value="'+i+'"';
          if (cur_year == i) selection +=' selected="true"';
          selection += '>' + i +'</option>';
        }
        selection += "</select>";

				var htmlCalendar = '<tbody id="cal_body"><tr><th><img src="images/leftCalendar.gif" onclick="calendarUpdatePrevMonth()"></th><th colspan="5">'+selection+'</th><th id="nextMonthImg"></th></tr>';
        htmlCalendar += '<tr class="cal_j_semaines"><th>Sun</th><th>Mon</th><th>Tue</th><th>Wed</th><th>Thu</th><th>Fri</th><th>Sat</th></tr>';  

			  if (dep_j)
				  htmlCalendar += '<tr>';

        for(i=1;i<=dep_j;i++)
        {
        				var prev_year=cur_year;
        			  prev_month=cur_month-1; if (prev_month < 0) { prev_month = 11; prev_year=prev_year-1 };
        			  
                htmlCalendar += '<td class="cal_jours_av_ap"  >'+(nbJours[prev_month]-dep_j+i)+'</td>'; //
                sem++;
        }
        for(i=1;i<=total;i++)
        {
                if(sem==0)
                {
                        htmlCalendar += '<tr>';
                }
                if(dateNow.getDate()==i && dateNow.getMonth()==cur_month && dateNow.getYear()+1900==cur_year)
                {
                        htmlCalendar += '<td class="hoverOn" ondblclick="calendarTheEnd();" onclick="calendarToggleCells(this); date.setDate('+i+'); calendarClickDate();">'+i+'</td>';
                        isCurrentMonth=true;
                }
                else
                {
                	if (!isCurrentMonth)
			{
                          htmlCalendar += '<td class="hoverOn ';
			
			  if (date.getDate()==i && date.getMonth()==cur_month && date.getYear()+1900==cur_year)  {	htmlCalendar += 'selection';  }
			  htmlCalendar += '"  ondblclick="calendarTheEnd();" onclick="calendarToggleCells(this); date.setDate('+i+'); calendarClickDate();">'+i+'</td>'; 
				
			}
                  else  htmlCalendar += '<td class="cal_jours_av_ap"  >'+i+'</td>';
                }
                sem++;
                if(sem==7)
                {
                      	htmlCalendar += '</tr>';
                        nbLigne++;

                        sem=0;
                }
        }
        var next_month = cur_month + 1;
        var next_year = cur_year;
        if (next_month > 11) { next_month = 0; next_year ++; }

        for(i=1;sem!=0 || nbLigne<6;i++)
        {
        		    if (!isCurrentMonth)
                  htmlCalendar += '<td class="cal_jours_av_ap"  >'+i+'</td>';
                else
                	htmlCalendar += '<td class="cal_jours_av_ap">'+i+'</td>';
                sem++;
                if(sem==7)
                {
                       htmlCalendar += '</tr>';
                			 nbLigne++;
                       sem=0;
                }
        }

        if (calendarWithHours)
        {
        	htmlCalendar += '<tr><th colspan="6"><select onchange="date.setHours(parseInt(this.value,10)+12*parseInt(document.getElementById(\'selAMPMId\').value,10));">'; 
        	for (i=1; i<=12; i++)
          {
            htmlCalendar += '<option value="'+i+'"';
            if (date.getHours() == i || date.getHours() == i+12) htmlCalendar +=' selected="true"';
            htmlCalendar += '>' + i +'</option>';
          }
          htmlCalendar += '</select>:';
          var minutes="";
          if (date.getMinutes() >= 10)
            minutes=date.getMinutes();
          else minutes="0"+date.getMinutes();
        	if (!calendarWithMinutes)
        	  htmlCalendar+= '<input type="text" value="'+minutes+'" size="2" maxlength="2" disabled/> ';
        	else
        		htmlCalendar+= '<input type="text" value="'+minutes+'" size="2" maxlength="2" onchange="date.setMinutes(this.value);" /> ';

        		
        	htmlCalendar += '<select  id="selAMPMId" onchange="calendarSelectChangeAMPM(this.value);">';
        	htmlCalendar += '<option value="0"';
        	if (date.getHours() <= 11) htmlCalendar +=' selected="true"';
        	htmlCalendar += '>AM</option>';
        	htmlCalendar += '<option value="1"';
       	  if (date.getHours() > 11) htmlCalendar +=' selected="true"';
        	htmlCalendar += '>PM</option>';       	
        	htmlCalendar += '</select>';
        	
        	htmlCalendar += '</th><th>';
        	htmlCalendar += '<input type="image" src="images/ok.gif" onclick="calendarTheEnd()";>';
        	htmlCalendar += '</th></tr>';
        	
        }
      
        document.getElementById('theCalendar').innerHTML = htmlCalendar;
        
        if (!isCurrentMonth)
        	document.getElementById('nextMonthImg').innerHTML= '<img src="images/rightCalendar.gif" onclick="calendarUpdateNextMonth()">';
        	
        	
}

/***********************************************************************/

function calendarToggleCells(el)
{
  rCells=document.getElementById('theCalendar').getElementsByTagName('td');
  for (i = 0; i < rCells.length; i++)
  {
  	var pos=rCells[i].className.indexOf('selection');
    if (pos != -1)
      rCells[i].className=rCells[i].className.substring(0, pos-1);
  }
  el.className+=' selection'
}

/***********************************************************************/

function calendarUpdatePrevMonth()
{
  var newMonth= date.getMonth()-1;
  if (newMonth < 0)
  {
    newMonth=11; 
  	var newYear = date.getYear() - 1 ; 
  	date.setYear( 1900+newYear ); 
  }
  date.setMonth(newMonth);
  calendarFill(date);
}

/***********************************************************************/

function calendarUpdateNextMonth()
{
 if ( ( dateNow.getYear() - date.getYear() >0 ) || (( dateNow.getYear() - date.getYear() == 0) && ( dateNow.getMonth() - date.getMonth() ) > 0))
 {
 	 var newMonth= date.getMonth()+1;
   if (newMonth > 11) { newMonth=0; date.setYear(1900+date.getYear()+1); };
   date.setMonth(newMonth);
   calendarFill(date);
 }
}

/***********************************************************************/

function calendarSelectChangeAMPM(value)
{
	if (value == 0 && date.getHours() > 11)
	  date.setHours(date.getHours()-12)
	if (value == 1 && date.getHours() <= 11)
		  date.setHours(date.getHours()+12)
}

/***********************************************************************/

function calendarSelectChangeMonth(value)
{
	date.setMonth(value);
	calendarFill(date);
}


/***********************************************************************/

function calendarSelectChangeYear(value)
{
	date.setYear(value);
	if (date.getMonth() >= dateNow.getMonth()) date.setMonth(dateNow.getMonth());
	calendarFill(date);
}

/***********************************************************************/

function calendarDisplay(withMinutes,withHours, id)
{
  //alert(id);l
  fieldId = id;
  dateNow = new Date();
  date = new Date();
	
  if( document.getElementById(fieldId).value ){
	
	var val = document.getElementById(fieldId).value;	
	  
	date.setFullYear( parseInt(extractDate(val,'y'),10) );
	date.setMonth( parseInt(extractDate(val,'m'),10) -1);
	date.setDate( parseInt(extractDate(val,'d'),10) );
	date.setHours( parseInt(extractDate(val,'h'),10) );
	date.setMinutes( parseInt(extractDate(val,'mn'),10) );
  }
  
  calendarWithMinutes=withMinutes;
  calendarWithHours=withHours;
	
  date.setSeconds(0);
	if (!calendarWithMinutes)
	  date.setMinutes(0);
	if (!calendarWithHours)
	  date.setHours(0);
	
  var table = document.createElement("table");
  table.setAttribute("cellspacing", 0);
  table.setAttribute("border", 0);
  table.setAttribute("cellspacing", 0);
  table.setAttribute("class", "cal_calendar");
  table.setAttribute("id", "theCalendar");
  document.getElementById('calendarWindow').appendChild(table);

  var tbody = document.createElement("tbody");
  table.appendChild(tbody);


 	calendarFill(date);

  return true;
}

/***********************************************************************/
