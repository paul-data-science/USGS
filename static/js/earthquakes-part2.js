function getColor(d) {
  return d > 5 ? '#FF0000' :
         d > 4 ? '#FF6600' :
         d > 3 ? '#FF9900' :
         d > 2 ? '#FFCC00' :
         d > 1 ? '#FFFF00' :
                 '#00FF00';
};

// Adding initial tile layer by combining MAPBOX satellite map with ESRI image labels 
var satellite = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.satellite",
  accessToken: API_KEY
});
//var esr1 = L.esri.basemapLayer('Imagery');
var esr2 = L.esri.basemapLayer('ImageryLabels');
var sat_imageLabels = L.layerGroup([satellite, esr2]);


// Set up earthquakes layer
var earthquakes = new L.layerGroup();
// Set up faultline layer
var faultlines = new L.layerGroup();
// Creating map object
var myMap = L.map("map", {
  center: [40, -97],
  zoom: 4,
  layers: [sat_imageLabels, earthquakes, faultlines]
});
// Link to faultlines data from <https://github.com/fraxen/tectonicplates>
//"https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_plates.json"
var jsonLink = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json";
// Grab faultlines GeoJSON data from json link
d3.json(jsonLink, function(data) {
  for (var i = 0; i < data.features.length; i++) {
    var faultloc = data.features[i].geometry;
    if (faultloc) { 
      L.geoJSON(faultloc, {fillOpacity: 0, color: "orange", weight: 1}).addTo(faultlines);
    };
  };
});
// Link to USGS geoJSON earthquakes data
var APILink = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
// Set up the legend
var legend = L.control({ position: "bottomright" });
// Grab earthquakes GeoJSON data with d3
d3.json(APILink, function(data) {
  // Loop through data for location coordinates and magnitudes
  for (var i = 0; i < data.features.length; i++) {
    // Set the data location geometry and magnitude properties to a variable
    var location = data.features[i].geometry;
    var magnitude = data.features[i].properties.mag;
    //var intensity = data.features[i].properties.cdi;
    //var depth = location.coordinates[2];
    // Check for location property
    if (location) {
      // Add a new marker to the circles cluster group, bind a pop-up and finally add to layer
      // earthquake_circles =
      L.circle([location.coordinates[1], location.coordinates[0]], {
          color: getColor(magnitude),
          fillColor: getColor(magnitude),
          fillOpacity: 0.75,
          radius: magnitude*25000
      }).bindPopup(data.features[i].properties.title).addTo(earthquakes);
    };
  };
  // Create Legend
  legend.onAdd = function () {
    // Create div tag with class legend
    var div = L.DomUtil.create('div', 'legend');
    mag_scale = [0, 1, 2, 3, 4, 5];
    // Add legend description
    div.innerHTML = '<strong>MAG SCALE</strong><br>';
    // loop through our magnitude intervals and generate a label with a colored square for each interval
    for (var i = 0; i < mag_scale.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(mag_scale[i] + 1) + '"></i> ' +
            mag_scale[i] + (mag_scale[i + 1] ? '&ndash;' + mag_scale[i + 1] + '<br>' : '+');
    };
    return div;
  };
  legend.addTo(myMap);
});



// Adding more tile layers
var streets = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets",
  accessToken: API_KEY
});

var outdoors = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.outdoors",
  accessToken: API_KEY
});

var grayscale = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.light",
  accessToken: API_KEY
});

var dark = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.dark",
  accessToken: API_KEY
});

var baseMaps = {
  "Satellite": sat_imageLabels,
  "Streets": streets,
  "Outdoors": outdoors,
  "Grayscale": grayscale,
  "Dark": dark
};

var overlayMaps = {
  "Earthquakes": earthquakes,
  "Faultlines": faultlines
};
// Finally adding layer control panel
L.control.layers(baseMaps, overlayMaps).addTo(myMap);

var header = L.control();
header.onAdd = function() {
  var div = L.DomUtil.create('div', 'header-panel');
  div.innerHTML = '<h4>United States Geological Survey<br>Earthquake Magnitudes with Faultlines<br>Past 7 days<br>Updated every 5 minutes (hit refresh)</h4>';
  return div;
};
header.addTo(myMap);



