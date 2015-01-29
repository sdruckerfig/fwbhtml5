$(document).ready(function() {
getParameterByName = function(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

//Sets up geocoding for the address & zipcode field, giving us LatLng values
geoCode = function() {
     var geocoder = new google.maps.Geocoder();
     geocoder.geocode({
        address: $('#address').val() + " " +  $('#zipcode').val()
      },
      function(results,status) {
         if (status != google.maps.GeocoderStatus.OK) {
           alert("Address not found");
           $("#lat").val('');
           $("#lng").val('');  
         } else {
           $("#lat").val(
            results[0].geometry.location.lat()
           );
           $("#lng").val(
           results[0].geometry.location.lng()
           );   
         }
      }
     );
   }

   //Tells the address and zipcode fields to update the lat/lng should their value change
 $("#address").bind("change",geoCode);
 $("#zipcode").bind("change",geoCode);

 //Populate the select field
 var me = this;
 FriendsWithBeerDB.runQuery('select * from beer', 
  function(data){console.log(data);
    var sel = document.getElementById('beerId');
for(var i = 0; i < data.length; i++) {
    var opt = document.createElement('option');
    
    opt.innerHTML = data[i].name;
    opt.value = data[i].id;
    sel.appendChild(opt);
}
  });

/*Checks if we were sent to this page by the edit button on the detail page. If so, then we'll be
modifying an existing record in the db instead of creating a new one. */
var edit = (getParameterByName('edit') === "true");
var editId = getParameterByName('id');

if (edit) {
  //Populates the form fields with the data from the given friend
  FriendsWithBeerDB.runQuery('select * from friend where id=' + editId, function(data) {
      $("#firstName").val(data[0].firstName);
      $("#lastName").val(data[0].lastName);
      $("#address").val(data[0].address);
      $("#zipcode").val(data[0].zipcode);
      $("#email").val(data[0].email);
      $("#lat").val(data[0].lat);
      $("#lng").val(data[0].lng);
      $("#phone").val(data[0].phone);
      $("#beerId").val(data[0].beerId);
  });
}

//Adds a custom validator check for the beer select field
$.validator.addMethod("beerRequired", function(value, element) {
  return (value !== "Select a Beer");
}, "This field is required");



//Defines the back button
$("#buttonback").click(function(arg) {
  
  //If we're editing, the back button points to contactdetail
var newpage = edit ? 'contactdetail.html?id='+editId : this.getAttribute('location');
console.log(newpage);
window.location = newpage;
});
$("#buttonsubmit").click(function(arg) {
//Validates data, insert data from fields into db, then return to friends list
var form = $("form");
   var validator = form.validate({
        rules: {
           lastName: {
             required: true,
             rangelength: [2,20]
           },
           firstName: {
             required: true   
           },
           address: {
             required: true   
           }, 
           zipcode: {
             required: true,
             digits: true
           },
           beerId: {
            beerRequired: true
           }
            
        }
     });

    validator.form();
    console.log(validator.numberOfInvalids());
    if (validator.numberOfInvalids() == 0) {
      //If we're editing, we update the existing record instead of creating a new one
      if (edit) {
        var queryString = 'update friend set firstName=\"' + $("#firstName").val() + '\", ';
        queryString +=  'lastName=\"' + $("#lastName").val() + '\", ';
        queryString +=  'phone=\"' + $("#phone").val() + '\", ';
        queryString +=  'zipcode=\"' + $("#zipcode").val() + '\", ';
        queryString +=  'address=\"' + $("#address").val() + '\", ';
        queryString +=  'beerId=\"' + $("#beerId").val() + '\", ';
        queryString +=  'email=\"' + $("#email").val() + '\", ';
        queryString +=  'lat=\"' + $("#lat").val() + '\", ';
        queryString +=  'lng=\"' + $("#lng").val() + '\" ';
        queryString +=  'where id=' + editId;
        console.log(queryString);
        FriendsWithBeerDB.runQuery(queryString, function() {
          alert("Record modified");
          window.location = "contactdetail.html?id="+editId;
        });
      }
      else { 
      //Write friend to DB and pass it back to friends list
      this.friendId = null; //Needed in order for writeRecord to work
      var fields = form.serializeArray();
        fields.push({
          name: 'lat',
          value: $('#lat').val()
        });
        
        fields.push({
          name: 'lng',
          value: $('#lng').val()
        });
         
        FriendsWithBeerDB.writeRecord(
          'friend',
          this.friendId,
          fields,
          function() {
            alert("Record Saved");
            window.location = "friends.html"
          }
        );
    
    
}
}
else {
      alert("Invalid input. Please correct your data input");
    }


});
});

