// TODO
// 1. add sort funciton to each column. ALso make it so that columns are highlighter based on which table is sorted
// https://codepen.io/FelixRilling/pen/qzfoc

console.log("leaderboard.js script loaded")
// Initialize Firebase
var config = {
apiKey: "AIzaSyBFKii-FXsmdHfGhhjn0dnigNVi1ab7GWU",
authDomain: "op4webapp.firebaseapp.com",
databaseURL: "https://op4webapp.firebaseio.com",
projectId: "op4webapp",
storageBucket: "op4webapp.appspot.com",
messagingSenderId: "647593248716"
};
firebase.initializeApp(config);
console.log("firebase db initialised");


/*
 * tableProperties (Object)
 * headerText = The text that appears in the table headers
 * headerID = id of the table headers . NOTE: keep column id exactly same as valuePaths
 * headerClass = The class for each header column in table
 * columnClass = The class for each cell data column in table
 * valuePaths = Since firebase returns an object. We need the "path" to the object porperties
 * custom = used to specify any custom html string to wrap around cell value
 * func = custom function to be done raw cell data  
 */

var tableProperties =  {
	"headerText" : ["Rank" , "Enemies Defeated", "Waves Cleared", "End Gold"],
	"headerID" :   ["rank" , "kills"  		   , "waves"        , "gold"],
	"headerClass" : ["no-sort two wide center aligned", "", "", ""],
	"columnClass" : ["center algined", "", "", ""],
	"valuePaths" : ["rank", "kills", "waves", "gold"],
	"custom" : [ 
				[
				 ['<h3 class="ui center aligned">'],
				 ['</h3>']
				], 
				 "",
				 "",
				 ""],
	"func": [
			 null,
			 null, 
			 null, 
			 function (num){
			 	return num.toLocaleString('en');
			 }
			]
}

var obj_to_array = function (scores) {

	var new_scores = [];	
	for (var property in scores) {
	    if (scores.hasOwnProperty(property)) {
	    		new_scores.push(scores[property]);
	    }
	}	

	return new_scores;
}

window.onload = function () {

	$('.dimmer').dimmer('hide');
	console.log("page has loaded");
	var db = firebase.database();
	var scoresDB = db.ref('score');
	var scores;
	scoresDB.on('value', function (scoreData){
		$('.loading-overlay .dimmer').dimmer('show');		
		//scores get stored and table gets created once data is retrieved
		//TODO: Add Time-out
		scores = scoreData.val();

		//because this function runs everytime there is a chnage in the database
		//we need to delete old table everytime we create a new one 

		addTableToDOM(scores, "gold", "desc");
		$('.loading-overlay.dimmer').dimmer('hide');


	});
}

//gets object property including nested properties
//specific object
//specify propertyPath in format of "property1.property2.property3" 
var getObjectProperty = function (object, propertyPath) {
	propertyPathArray = propertyPath.split("."); //split property path based on array
	var propertyFunc = function (object,property) {
		if (propertyPathArray.length > 0) {
			object = object[property];
			//console.log(object);
			propertyPathArray.splice(0,1)
			return propertyFunc(object,propertyPathArray[0]);
		} else {
			return object;
		}
	} 
	return propertyFunc(object,propertyPathArray[0]);
}


//Function for sorting table elements
//data = object data from firebase
// property = properties of data object that you want to sort e.g. socre, name
function sortData (data, property, type) {
	temp = data; //temporary buffer
	function compare_ASC(a,b) {
	  if (a[property] < b[property])
	    return -1;
	  if (a[property] > b[property])
	    return 1;
	  return 0;
	}

	function compare_DESC(a,b) {
	  if (a[property] > b[property])
	    return -1;
	  if (a[property] < b[property])
	    return 1;
	  return 0;
	}

	try {
		if (type == "asc") {
			return data.sort(compare_ASC);
		} else if (type == "desc") {
			return data.sort(compare_DESC);
		}
	} catch (err) {
		//TODO: make this a pop-up error
		console.log("ERROR, sort function: " + err)
		return temp;
	}

}

var createTable = function (data, tableProperties, sortKey, sortType) {

	//by default sort data in score
	data = sortData(data, sortKey, sortType);

	//add ranks to dataset
	for (var z = 0; z < data.length -1; z++) {
		data[z].rank = z + 1;
	}

	//console.log("Create table function called");
	
	//create table object
	var _table = document.createElement('table');

	//add id to table element
	_table.setAttribute("id", "leaderboard_tbl");
	//add classes to table for styling
	_table.className += "ui very padded celled table";

	//determines number of columns in table
	var tableWidth = tableProperties.headerText.length;
	
	//add headers
	var header = _table.appendChild(document.createElement('thead'));
	var headerRow = header.appendChild(document.createElement('tr'));
	for (var c = 0; c < tableWidth; c++) {
		var headerCell = document.createElement('th');
		headerCell.innerHTML = tableProperties.headerText[c];
		headerCell.className += tableProperties.headerClass[c];
		headerCell.setAttribute("id", tableProperties.headerID[c]);
		if (tableProperties.headerClass[c].indexOf("no-sort") == -1){
			var header_html = '<i class="sort icon"></i>';
			headerCell.insertAdjacentHTML('beforeend', header_html);
		}
		headerRow.appendChild(headerCell);
	}

	//add tbody to table ofr adding content
	_table.appendChild(document.createElement('tbody'));

	//console.log(_table);

	if (data.length > 1) {
		//console.log("adding rows");
		for (var row_cnt = 0; row_cnt < data.length - 1; row_cnt++) {

			//create row inside tbody tag
			var row = _table.getElementsByTagName('tbody')[0].insertRow(-1);

			for  (var col_cnt = 0; col_cnt < tableWidth; col_cnt++) {
				var cell = row.insertCell(-1);
				var cellData = getObjectProperty(data[row_cnt], tableProperties.valuePaths[col_cnt]);
				if (tableProperties.func[col_cnt] != null) {
					cellData = tableProperties.func[col_cnt](cellData);
				} 

				//wraps the cell data based on whatever is set in custom property
				if (tableProperties.custom[col_cnt] != "") {
					var str = tableProperties.custom[col_cnt][0] + cellData + tableProperties.custom[col_cnt][1];
					cellData = str;
				} 

				//add data to cell
				cell.className += tableProperties.columnClass[col_cnt];
				cell.innerHTML = cellData;

			}

		}
	}
	return _table;
} 


var sortTable = function (scores) {

	this.$table = $('table');
	this.$thead = this.$table.find('thead');
	//this.settings = $.extend({}, $.tablesort.defaults, settings);

	//the click event function will only trigger for the headers that DO NOT have "no-sort" class
	this.$sortCells = this.$thead.length > 0 ? this.$thead.find('th:not(.no-sort)') : this.$table.find('th:not(.no-sort)');
	this.$sortCells.on('click', function(e) {
		var selectedElement = e.currentTarget;

		//Because we add sort icon to some of the headers, the selected element
		//will contain the html string for the icon, not just raw header text
		//so we need to split the string
		var temp = selectedElement.innerHTML.split('<');
		selectedElement = temp[0];

		//get the text in the clicked header. use that to find the header key value
		for (x = 0; x <= tableProperties.headerText.length; x++) {
			if (selectedElement == tableProperties.headerText[x]) {
				columnKey = tableProperties.valuePaths[x];
			}
		}

		sortType = "desc";

		addTableToDOM(scores, columnKey, sortType);
		return; //exit once sorted                                                            
	});
	this.index = null;
	this.$th = null;
	this.direction = null;

}

var addTableToDOM =  function (scores, columnKey, sortType) {
	var new_scores = obj_to_array(scores);
	$('.loading-overlay').dimmer('show');
	if (document.getElementById("leaderboard_tbl") != null) {
		document.getElementById("leaderboard_tbl").remove();
	}
	var table = createTable(new_scores, tableProperties, columnKey, sortType);
	document.getElementById("leaderboardTable").appendChild(table);

	document.getElementById(columnKey).className += " ui active-header";

	$('.loading-overlay').dimmer('hide');
	sortTable(new_scores);		

}