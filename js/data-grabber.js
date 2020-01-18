/**
 * 
 */
/**
 * 
 */
var theData;
var xmlhttp = new XMLHttpRequest();
var presData;
var xmlhttp2 = new XMLHttpRequest();
xmlhttp2.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {
    var presVar = JSON.parse(this.responseText);
    presData= presVar;
    done();
  }
 
};
xmlhttp.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {
    var myArr = JSON.parse(this.responseText);
   theData=myArr.data;
   xmlhttp2.open("GET", "https://raw.githubusercontent.com/hitch17/sample-data/master/presidents.json", true);
   xmlhttp2.send(); 
  }
};
xmlhttp.open("GET", "https://www.transparency.treasury.gov/services/api/fiscal_service/v1/accounting/od/debt_outstanding?sort=-data_date&page[number]=1&page[size]=300", true);
xmlhttp.send(); 






function done(){
	console.log(presData);
	var i;
	var graphData = {
			  x: [],
			  y: [],
			  type: 'Scatter',
			};
	for (i = 0; i < theData.length; i++) {
		graphData.x.push(theData[i].reporting_calendar_year);
		graphData.y.push(theData[i].debt_outstanding_amt);
	} 
	
	var layout = {
			showLegend: true,
			title:'Total Debt of the United States 1790-2019',
			xaxis: {
				title: 'Year'
			},
			yaxis: {
				title: 'Debt in $'
			},
			shapes: presStart(),
			autosize: true,
			  margin: {
			    l: 5,
			    r: 5,
			    b: 50,
			    t: 50,
			    pad: 4
			  }
	};
	
	function presStart(){
		var allShapes = [];
		for(i = 0; i < presData.length; i++){
			var startDate = presData[i].took_office.substring(0,4);
			var endDate = presData[i].left_office;
			if(endDate == null){
				endDate = graphData.x[0];
			}
			else{
				endDate = endDate.substring(0,4)
			}
			var rect = {
					type: 'rect',
					xref: 'x',
					yref: 'paper',
					x0: startDate,
					y0: 0,
					x1: endDate,
					y1: 1,
					fillcolor: '#D3D3D3',
					opacity: 0.1,
					line: {
						width: 1
					}
			}
			allShapes[i] = rect;
		}
		console.log(allShapes);
		return allShapes;
	}
	
	var gd = [graphData];
	Plotly.newPlot('graph', gd, layout);

}