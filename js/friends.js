$(document).ready(function() {
var updateList = function() {

	var filterText = $("#friendSearch").val();
	//Same strategy here as in the beer table
	$("#friendList").empty();
	var topRow = $("<tr></tr>");
	topRow.append( $("<th><b>Last Name</b></th>") )
	topRow.append( $("<th><b>First Name</b></th>") )
	topRow.append( $("<th><b>View Detail</b></th>") )
	$("#friendList").append(topRow);
	FriendsWithBeerDB.runQuery('SELECT * from friend order by friend.lastName', function(data) { 
		var colorToggle = false; //Flips between false and true for alternating colors
		for (var i in data) {
			//If we wanted to, we could just query for this in the sql statement
			if (data[i].firstName.indexOf(filterText) != -1  || 
				data[i].lastName.indexOf(filterText) != -1  ) {
				//For every friend that contains the search text, it creates an element and adds it to the table
			var lnameChar = data[i].lastName[0].toLowerCase();
			
			var currRow = $("<tr></tr>");
			var lnameTd = $("<td>" + data[i].lastName + "</td>");
			var fnameTd = $("<td>" + data[i].firstName + "</td>");
			var vdTd =    $("<td></td>");
			var viewDetail = jQuery('<a>', {
				id: data[i].id,
				text: 'Click to View Detail',
				href: 'contactdetail.html?id=' + data[i].id,
				click: function() {
					console.log('Clicked friendId=', this.id)
				}
			});
			vdTd.append(viewDetail);
			currRow.append(lnameTd);
			currRow.append(fnameTd);
			currRow.append(vdTd);
			var color = colorToggle == true ? "#D18719" : "#FFCC00"
			currRow.css("background-color", color);
			colorToggle = !colorToggle;//Flips the color bit
			currRow.appendTo("#friendList");
			
				}
		}
	});
}

updateList();
$("#friendSearch").bind("keyup",updateList);
});
