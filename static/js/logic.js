// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {

  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
  function onEachFeature(feature, layer) {
    // console.log (feature)
    layer.bindPopup("<h3>" + feature.properties.place +
      "<h3>" + " Magnitude " + feature.properties.mag +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
  }
  function styleinfo(feature){
    return { 
      fillOpacity: 1,
       fillColor: color(feature.properties.mag),
      // color:"black",
      weight: .5,
      radius: 3* feature.properties.mag
    }
  }
  function color (feature){
    console.log (feature)
    if (feature > 7){
      return '#b10026'; 

    } else if (feature > 6){
      return '#e31a1c';
    
    } else if (feature > 5){
      return '#fc4e2a';

    } else if (feature > 4){
      return '#fd8d3c';

    } else if (feature > 3){
      return '#feb24c';

    } else if (feature > 2){
      return '#fed976';

    } else if (feature > 1){
      return '#ffeda0';

    } else if (feature > 0){
      return '#ffffcc';

    } else if (feature <= 0){
      return '#ffffcc';
    }
  }


  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
    pointToLayer: function(features,latlong){
      return L.circleMarker (latlong)
    },
    style: styleinfo
  });

  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
}

function createMap(earthquakes) {

  // Define streetmap and darkmap layers
  var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
  });

  var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.dark",
    accessToken: API_KEY
  });

  var satellite = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.satellite",
    accessToken: API_KEY
  });
1
  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap,
    "Satellite Map": satellite,
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 2,
    layers: [streetmap, earthquakes]
  });

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
  legend.addTo(myMap);
}
//************************************************************************

//Adding Some Color 
function getColor(d) {
  return d > 7  ? '#b10026' :
	       d > 6  ? '#e31a1c' :
	       d > 5  ? '#fc4e2a' :
	       d > 4  ? '#fd8d3c' :
	       d > 3  ? '#feb24c' :
	       d > 2  ? '#fed976' :
	       d > 1  ? '#ffeda0' :
	                '#ffffcc' ;
}

var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

	var div = L.DomUtil.create('div', 'info legend'),
		grades = [0, 1, 2, 3, 4, 5, 6, 7],
		labels = [];

	// loop through our density intervals and generate a label with a colored square for each interval
	for (var i = 0; i < grades.length; i++) {
		div.innerHTML +=
			'<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
      grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+')
  // Need to stop the loop at 7 and exit out of it.
	}

	return div;
};

legend.addTo(myMap);