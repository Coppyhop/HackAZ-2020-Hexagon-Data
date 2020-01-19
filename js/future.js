/**
 * Future.js
 * Authors:
 * Marko Kreso and Coppy (Kyle) Bredenkamp
 * 
 * Handles the functionality of the current debt (estimation) page
 */
//Variables for holding data
var theData;
var xmlhttp = new XMLHttpRequest();
var presData;
var xmlhttp2 = new XMLHttpRequest();
//HTTP Requests
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
xmlhttp.open("GET", "https://www.transparency.treasury.gov/services/api/fiscal_service/v1/accounting/od/debt_to_penny?sort=-data_date&page[number]=1&page[size]=720", true);
xmlhttp.send(); 
//Called once the HTTP requests are finished
function done(){
  var currentDebt = +theData[0].tot_pub_debt_out_amt;
  var changeOfDebt = 0;
	for(i = 0; i < theData.length-1; i++){
    var current = +theData[i].tot_pub_debt_out_amt;
    var prev = +theData[i+1].tot_pub_debt_out_amt;
    changeOfDebt += (current - prev);
  }
  var avgChangeOfDebt = changeOfDebt/720;
  avgChangeOfDebt = avgChangeOfDebt/86400;
  avgChangeOfDebt = avgChangeOfDebt/20;
  var millisecondsToWait = 50;
  window.setInterval(function() {
  currentDebt += avgChangeOfDebt;
  document.getElementById("debt").innerHTML = "$" + Math.round(currentDebt).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");;
  }, millisecondsToWait);
}