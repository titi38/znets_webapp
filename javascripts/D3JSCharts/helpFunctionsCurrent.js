/**
 * Utility function to get the current date.
 * @param svg {Object} D3 selection
 */

function setStartDate(svg){

  svg.startDate = (typeof serverDate === "string"?new Date(serverDate):serverDate);
  svg.startDate = new Date(svg.startDate.getTime() - (svg.startDate.getTimezoneOffset() + 59 )*60000);
  console.log(svg.startDate);
  
}


