// Creating map object
var myMap = L.map("map", {
  center: [40, -97],
  zoom: 5
});

// Adding tile layer
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets",
  accessToken: API_KEY
}).addTo(myMap);

// Link to GeoJSON
var APILink = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

var geojson;

// Grab data with d3
d3.json(APILink, function(data) {
  //console.log(data.features[0].geometry.coordinates);
  //console.log(data.features.length);
  // Create a new choropleth layer
  //geojson = 
  // Create a new marker cluster group
  //var markers = L.circle();

  // Loop through data
  for (var i = 0; i < data.features.length; i++) {
    //console.log(data.features[i].geometry.coordinates);
    // Set the data location property to a variable
    var location = data.features[i].geometry;
    var magnitude = data.features[i].properties.mag;
    //var intensity = data.features[i].properties.cdi;
    //var depth = location.coordinates[2];

    // Check for location property
    if (location) {

      // Add a new marker to the cluster group and bind a pop-up
      /*markers.addLayer(L.circle([location.coordinates[1], location.coordinates[0]])
        .bindPopup(data.features[i].properties.title));*/
      var circle = L.circle([location.coordinates[1], location.coordinates[0]], {
          //color: 'red',
          //fillColor: '#f03',
          fillOpacity: 0.5,
          radius: magnitude*15000
      }).addTo(myMap);
      circle.bindPopup(data.features[i].properties.title);
    };
  };
    /*// Binding a pop-up to each layer
    onEachFeature: function(feature, layer) {
      layer.bindPopup(feature.properties.LOCALNAME + ", " + feature.properties.State + "<br>Median Household Income:<br>" +
        "$" + feature.properties.MHI);
    }*/
  // Add our marker cluster layer to the map
  //myMap.addLayer(markers);
/*
  // Set up the legend
  var legend = L.control({ position: "bottomright" });
  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");
    var limits = geojson.options.limits;
    var colors = geojson.options.colors;
    var labels = [];

    // Add min & max
    var legendInfo = "<h1>Median Income</h1>" +
      "<div class=\"labels\">" +
        "<div class=\"min\">" + limits[0] + "</div>" +
        "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
      "</div>";

    div.innerHTML = legendInfo;

    limits.forEach(function(limit, index) {
      labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
    });

    div.innerHTML += "<ul>" + labels.join("") + "</ul>";
    return div;
  };

  // Adding legend to the map
  legend.addTo(myMap);*/

});
