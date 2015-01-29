$(document).ready(function() {
	var updateList = function() {

		var filterText = $("#beerSearch").val();
		//Our strategy is to continually destroy and recreate the table with the new filtering string
		$("#beerTable").empty(); 
		var colorToggle = false;
		//This creates the top row that will always be in the table
		$("#beerTable").add("<tr><th>Country</th><th>Beer</th></tr>").appendTo("#beerTable");
		FriendsWithBeerDB.runQuery('SELECT * from beer order by beer.country, beer.name', function(data) {
			for (var i in data) {
				//If we wanted to, we could just query for this in the sql statement
				if (data[i].country.lastIndexOf(filterText, filterText.length - 1) == 0 ||
					data[i].name.lastIndexOf(filterText, filterText.length - 1) == 0) {
					//For every beer that starts with the filter text, it creates an element for it, gives it a background
					//color, and adds it to the table 
					var elm = $("<tr><td>" + data[i].country + "</td><td>" + data[i].name + "</td></tr>");
					var color = colorToggle == true ? "#D18719" : "#FFCC00" //Each row gets an alternating color applied to its background
					elm.css("background-color", color);
					colorToggle = !colorToggle;
					$("#beerTable").add(elm).appendTo("#beerTable");
				}
			}
		});
	}
	var me = this;
	$("#beerSearch").bind("keyup", updateList); //Updates the list as the user types in the search field
	updateList();
});