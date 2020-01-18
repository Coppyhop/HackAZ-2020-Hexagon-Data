/**
 * 
 */
var theData;
var xmlhttp = new XMLHttpRequest();
xmlhttp.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {
    var myArr = JSON.parse(this.responseText);
   theData=myArr.data
   done();

  }
};
xmlhttp.open("GET", "https://www.transparency.treasury.gov/services/api/fiscal_service/v1/accounting/od/debt_outstanding?sort=-data_date&page[number]=1&page[size]=300", true);
xmlhttp.send(); 


function done(){
	var table = "<tr><th>Year of Census</th><th>Total Debt amount</th></tr>";
	var i;
	var graphData = {
			  x: [],
			  y: [],
			  type: 'scatter'
			};
	for (i = 0; i < theData.length; i++) {
		graphData.x.push(theData[i].reporting_calendar_year);
		graphData.y.push(theData[i].debt_outstanding_amt);
		table = table +"<tr><td>"+theData[i].reporting_calendar_year+"</td>";
		table = table +"<td>"+theData[i].debt_outstanding_amt+"</td></tr>";
	} 
	document.getElementById("table").innerHTML=table;

	var gd = [graphData];
	Plotly.newPlot('graph', gd);

}