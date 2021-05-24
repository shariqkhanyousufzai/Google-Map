var currentTab = 0; // Current tab is set to be the first tab (0)
showTab(currentTab); // Display the current tab

function showTab(n) {
  // This function will display the specified tab of the form...
  var x = document.getElementsByClassName("tab");
  x[n].style.display = "block";
  //... and fix the Previous/Next buttons:
  if (n == 0) {
    document.getElementById("prevBtn").style.display = "none";
  } else {
    document.getElementById("prevBtn").style.display = "inline";
  }
  if (n == (x.length - 1)) {
    document.getElementById("nextBtn").innerHTML = "Submit";
  } else {
    document.getElementById("nextBtn").innerHTML = "Next";
  }
  //... and run a function that will display the correct step indicator:
  fixStepIndicator(n)
}

function nextPrev(n) {
  // This function will figure out which tab to display
  var x = document.getElementsByClassName("tab");
  // Exit the function if any field in the current tab is invalid:
  if (n == 1 && !validateForm()) return false;
  // Hide the current tab:
  x[currentTab].style.display = "none";
  // Increase or decrease the current tab by 1:
  currentTab = currentTab + n;
  // if you have reached the end of the form...
  if (currentTab >= x.length) {
    // ... the form gets submitted:
    document.getElementById("regForm").submit();
    return false;
  }
  // Otherwise, display the correct tab:
  showTab(currentTab);
}

function validateForm() {
  // This function deals with validation of the form fields
  var x, y, i, valid = true;
  x = document.getElementsByClassName("tab");
  y = x[currentTab].getElementsByTagName("input");
  // A loop that checks every input field in the current tab:
  for (i = 0; i < y.length; i++) {
    // If a field is empty...
    if (y[i].value == "") {
      // add an "invalid" class to the field:
      y[i].className += " invalid";
      // and set the current valid status to false
      valid = false;
    }
  }
  // If the valid status is true, mark the step as finished and valid:
  if (valid) {
    document.getElementsByClassName("step")[currentTab].className += " finish";
  }
  return valid; // return the valid status
}

function fixStepIndicator(n) {
  // This function removes the "active" class of all steps...
  var i, x = document.getElementsByClassName("step");
  for (i = 0; i < x.length; i++) {
    x[i].className = x[i].className.replace(" active", "");
  }
  //... and adds the "active" class on the current step:
  x[n].className += " active";
}

$(document).ready(function(){
  $(document).on('click','.map_options',function(){
    console.log($(this).val());
    if($(this).val() == 'battery'){
      $('.map_price').html('$ 25.00');
    }else if($(this).val() == 'tire'){
      $('.map_price').html('$ 50.00');
    }else if($(this).val() == 'tow'){
      $('.map_price').html('$ 10.00');
    }
  })
})


  // <!-- this is for the find by address -->
      var  geocoder = '';
      var map = '';
      // This example requires the Places library. Include the libraries=places
      // parameter when you first load the API. For example:
      // <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">
      function initMap() {
        const myLatLng = { lat: 40.439077355854494, lng: -3.716280302777911 };
        map = new google.maps.Map(document.getElementById("map"), {
          center: myLatLng,
          zoom: 13,
        });
        new google.maps.Marker({
              map: map,
              position: myLatLng,
            });
        const card = document.getElementById("pac-card");
        const input = document.getElementById("pac-input");
        map.controls[google.maps.ControlPosition.TOP_RIGHT].push(card);
        const autocomplete = new google.maps.places.Autocomplete(input);
        autocomplete.setComponentRestrictions({
          country: ["es"],
        });
        // Bind the map's bounds (viewport) property to the autocomplete object,
        // so that the autocomplete requests use the current map bounds for the
        // bounds option in the request.
        autocomplete.bindTo("bounds", map);
        // Set the data fields to return when the user selects a place.
        autocomplete.setFields([
          "address_components",
          "geometry",
          "icon",
          "name",
        ]);
        const infowindow = new google.maps.InfoWindow();
        const infowindowContent = document.getElementById("infowindow-content");
        infowindow.setContent(infowindowContent);
        const marker = new google.maps.Marker({
          map,
          anchorPoint: new google.maps.Point(0, -29),
        });
        autocomplete.addListener("place_changed", () => {
          infowindow.close();
          marker.setVisible(false);
          const place = autocomplete.getPlace();

          if (!place.geometry) {
            // User entered the name of a Place that was not suggested and
            // pressed the Enter key, or the Place Details request failed.
            window.alert(
              "No details available for input: '" + place.name + "'"
            );
            return;
          }

          geocoder = new google.maps.Geocoder();


          let address = "";

          if (place.address_components) {
            address = [
              (place.address_components[0] &&
                place.address_components[0].short_name) ||
                "",
              (place.address_components[1] &&
                place.address_components[1].short_name) ||
                "",
              (place.address_components[2] &&
                place.address_components[2].short_name) ||
                "",
            ].join(" ");
          }
          infowindowContent.children["place-icon"].src = place.icon;
          infowindowContent.children["place-name"].textContent = place.name;
          infowindowContent.children["place-address"].textContent = address;
          infowindow.open(map, marker);
        });
      }

     
        

        $(document).delegate('#submit','click',function(){
           $('#map').show();
           geocodeAddress(geocoder, map);
        });



      var i=0;

      function geocodeAddress(geocoder, resultsMap) {
        const address = document.getElementById("pac-input").value;
        geocoder.geocode({ address: address }, (results, status) => {
         // console.log(status);
          if (status === "OK") {
            resultsMap.setCenter(results[0].geometry.location);
            new google.maps.Marker({
              map: resultsMap,
              position: results[0].geometry.location,
            });
            console.log(results);
            i = 0;
          } else {
              // console.log("times: "+i);
          // geocodeAddress()
              if(i == 2){
                  alert("Geocode was not successful for the following reason: " + status);
                  i= 0;
                  
              }else{
                  geocodeAddress(geocoder, resultsMap);
                  i++;  
              }
          }
        });
        console.log("At the end "+i);
      }
    // <!-- this is for the find by address end-->
    // <!-- this is for the locate me option -->
    //first parameter is what you want to add in popup of marker.

    $(document).on('click','.locateme',function(){
      $.get("https://ipinfo.io", function(response) {
        var splitLoc = response.loc;
        var splitAdd = splitLoc.split(',');
        console.log(splitAdd)
        map = new google.maps.Map(document.getElementById('map'), {
          zoom: 10,
          center: new google.maps.LatLng(splitAdd[0],splitAdd[1]),
          mapTypeId: google.maps.MapTypeId.ROADMAP
        });
        marker = new google.maps.Marker({
          position: new google.maps.LatLng(splitAdd[0],splitAdd[1]),
          map: map
        });
        $('#map').show();
      }, "jsonp");

    })
// <!-- this is for the locate me option end-->