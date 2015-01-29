$(document).ready(function() {
//Loads the beer list and friends list into the DB at the first page visited
var me = this;
$.ajax({
url: "http://webapps.figleaf.com/ftxdknew/data/beer.cfc?method=getBeerList&callback=",
failure: function() {
console.log('fail');
},
success: function(data) {
data = data.substring(data.indexOf('(')+1, data.indexOf(')') ); //The ajax call returns a string, so this prepares it for JSON parsing
data = $.parseJSON(data);
FriendsWithBeerDB.importTable('beer',data);
          me.beers = data;

}
});

});