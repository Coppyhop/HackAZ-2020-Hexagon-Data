/**
 * Pres.js
 * 
 * Authors:
 * Marko Kreso and Coppy (Kyle) Bredenkamp
 * 
 * Handles the hover, graph, and misc functionality of the presidents page
 */
//Variables for the data we need
var theData;
var presMoney = [];
var presNames = [];
var xmlhttp = new XMLHttpRequest();
var presData;
var xmlhttp2 = new XMLHttpRequest();
//Adds the range of dates to the president money list
function addRange(date1, date2){
	var day1;
	var day2;
	var i;
	for(i=0; i<theData.length;i++){
		if(theData[i].record_calendar_year == date1){
			day1= theData[i].debt_outstanding_amt;
		}
		if(theData[i].record_calendar_year == date2-1){
			day2= theData[i].debt_outstanding_amt;
		}
	}
	var total = day2 - day1;
	console.log(date1 + " to " + date2 + ": " + total + "(" + day2 + " - " + day1 + ")");
	presMoney.push(total);
}
//Http requests
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
xmlhttp.open("GET", "https://api.fiscaldata.treasury.gov/services/api/fiscal_service/v2/accounting/od/debt_outstanding?sort=-record_date&page[number]=1&page[size]=720", true);
xmlhttp.send(); 
//Attaches a listener to update the position of the label for the name
window.onload = function(){
    var bsDiv = document.getElementById("hoverInfo");
    var x, y;
    window.addEventListener('mousemove', function(event){
        x = event.clientX;
        y = event.clientY;                    
        if ( typeof x !== 'undefined' ){
            bsDiv.style.left = (x+10) + "px";
            bsDiv.style.top = y + "px";
        }
    }, false);
}
//Returns the president in the given year
function getPres(year){
	for(i = 0; i < presData.length; i++){
		var startDate = presData[i].took_office.substring(0,4);
		var endDate = presData[i].left_office;
		if(endDate == null){
				endDate = '2022';
		}
		else{
			endDate = endDate.substring(0,4)
		}
		if( +year >= +startDate && +year <= +endDate){
			return presData[i].president
		}
	}
}
//Called when the HTTP requests are finished
function done(){
	var i;
	var graphData = {
			  x: [],
			  y: [],
			  president:[],
			  type: 'Scatter',
			  line: {
				    color: 'rgb(255, 128, 128)',
				    width: 4
				  }
			};
	for (i = 0; i < theData.length; i++) {
		graphData.x.push(theData[i].record_calendar_year);
		graphData.president.push(getPres(theData[i].record_calendar_year));
		graphData.y.push(theData[i].debt_outstanding_amt);
	} 
	var layout = {
			showLegend: true,
			title:'Total Debt of the United States 1790-Today',
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
				endDate = "2022";
			}
			else{
				endDate = endDate.substring(0,4)
			}
			addRange(startDate, endDate);
			presNames.push(presData[i].president);
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
	var myPlot = document.getElementById('graph');
	var hoverInfo = document.getElementById('hoverInfo')
	myPlot.on('plotly_hover', function(data){
		hoverInfo.style.visibility='visible';
		var infotext = data.points.map(function(d){
		  return (d.data.president[d.pointIndex]+', '+d.x);
		});
		hoverInfo.innerHTML = infotext.join('<br/>');
	})
	 .on('plotly_unhover', function(data){
		hoverInfo.innerHTML = '';
		hoverInfo.style.visibility='hidden';
	});
	var pdata = [{
		  values: presMoney,
		  labels:presNames,
		  type: 'pie',
		  textinfo:"none"  
		}];
		Plotly.newPlot('pieChart', pdata);
}