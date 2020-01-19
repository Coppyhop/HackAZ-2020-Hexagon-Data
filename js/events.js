/**
 * Events.js
 * Author:
 * Coppy (Kyle) Bredenkamp
 * 
 * Handles the data for the page with specific graphs for timelines
 */
var theData;
var theData2;
var theData3;
var theData4;
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
			  line: {
				    color: 'rgb(255, 128, 128)',
				    width: 4
				  }
			};
	var graphData2 = {
			  x: [],
			  y: [],
			  type: 'Scatter',
			  line: {
				    color: 'rgb(255, 128, 128)',
				    width: 4
				  }
			};
	var graphData3 = {
			  x: [],
			  y: [],
			  type: 'Scatter',
			  line: {
				    color: 'rgb(255, 128, 128)',
				    width: 4
				  }
			};
	var graphData4 = {
			  x: [],
			  y: [],
			  type: 'Scatter',
			  line: {
				    color: 'rgb(255, 128, 128)',
				    width: 4
				  }
			};
	for (i = 0; i < theData.length; i++) {
		if(Number(theData[i].reporting_calendar_year)<=1860){
			graphData.x.push(theData[i].reporting_calendar_year);
			graphData.y.push(theData[i].debt_outstanding_amt);
		} else if(Number(theData[i].reporting_calendar_year)<=1940){
			graphData2.x.push(theData[i].reporting_calendar_year);
			graphData2.y.push(theData[i].debt_outstanding_amt);
		} else if(Number(theData[i].reporting_calendar_year)<=1980){
			graphData3.x.push(theData[i].reporting_calendar_year);
			graphData3.y.push(theData[i].debt_outstanding_amt);
		} else {
			graphData4.x.push(theData[i].reporting_calendar_year);
			graphData4.y.push(theData[i].debt_outstanding_amt);
		}
	} 
	var layout = {
			showLegend: true,
			title:'Total Debt of the United States 1790-1860',
			xaxis: {
				title: 'Year'
			},
			yaxis: {
				title: 'Debt in $'
			},
			autosize: true,
			  margin: {
			    l: 5,
			    r: 5,
			    b: 50,
			    t: 50,
			    pad: 4
			  }
	};
	var layout2 = {
			showLegend: true,
			title:'Total Debt of the United States 1860-1940',
			xaxis: {
				title: 'Year'
			},
			yaxis: {
				title: 'Debt in $'
			},
			autosize: true,
			  margin: {
			    l: 5,
			    r: 5,
			    b: 50,
			    t: 50,
			    pad: 4
			  }
	};
	var layout3 = {
			showLegend: true,
			title:'Total Debt of the United States 1940-1980',
			xaxis: {
				title: 'Year'
			},
			yaxis: {
				title: 'Debt in $'
			},
			autosize: true,
			  margin: {
			    l: 5,
			    r: 5,
			    b: 50,
			    t: 50,
			    pad: 4
			  }
	};
	var layout4 = {
			showLegend: true,
			title:'Total Debt of the United States 1980-Today',
			xaxis: {
				title: 'Year'
			},
			yaxis: {
				title: 'Debt in $'
			},
			autosize: true,
			  margin: {
			    l: 5,
			    r: 5,
			    b: 50,
			    t: 50,
			    pad: 4
			  }
	};
	var gd = [graphData];
	var gd2 = [graphData2];
	var gd3 = [graphData3];
	var gd4 = [graphData4];
	Plotly.newPlot('graph', gd, layout);
	Plotly.newPlot('graph2', gd2, layout2);
	Plotly.newPlot('graph3', gd3, layout3);
	Plotly.newPlot('graph4', gd4, layout4);
}