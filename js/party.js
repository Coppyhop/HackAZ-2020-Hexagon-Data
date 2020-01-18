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
var dem = 0;
var gop = 0;
var mis = 0;

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



function addRange(party, date1, date2){
	var day1;
	var day2;
	var i;
	for(i=0; i<theData.length;i++){
		if(theData[i].reporting_calendar_year == date1){
			day1= theData[i].debt_outstanding_amt;
		}
		if(theData[i].reporting_calendar_year == date2){
			day2= theData[i].debt_outstanding_amt;
		}
	}
	var total = day2 - day1;
	if(party==0){
		dem+=total;
	}
	if(party==1){
		gop+=total;
	}
	if(party==2){
		mis+=total;
	}
}


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
			var party = presData[i].party
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
					fillcolor: '#00ff19',
					opacity: 0.05,
					line: {
						width: 0
					}
			}
			var rect_line = {
					type: 'rect',
					xref: 'x',
					yref: 'paper',
					x0: startDate,
					y0: 0,
					x1: endDate,
					y1: 1,
					opacity: 0.25,
					line: {
						width: 1
					}
			}
			if(party == "Democratic"){
				rect.fillcolor = "#0051ff";
				addRange(0, startDate, endDate);
			}
			else if(party == "Republican"){
				rect.fillcolor = "#ff0000";
				addRange(1, startDate, endDate);
			}
			else if(party == "Democratic-Republican"){
				rect.fillcolor = "#ff0000";
				addRange(1, startDate, endDate);
			}
			else if(party == "Whig"){
				rect.fillcolor = "#f2d707";
				addRange(2, startDate, endDate);
			} else {
				//addRange(2, startDate, endDate);
			}
			
			allShapes.push(rect);
			allShapes.push(rect_line);
		}
		return allShapes;
	}
	
	var gd = [graphData];
	Plotly.newPlot('graph', gd, layout);
	
	var pdata = [{
		  values: [dem, gop, mis],
		  labels: ['Democratic', 'Republican', 'Other'],
		  type: 'pie',
		  marker: {colors: ['rgb(128, 128, 255)', 'rgb(255, 128, 128)', 'rgb(128, 255, 128)']}
		}];

		var playout = {
		  
		};

		Plotly.newPlot('pieChart', pdata, playout);

}