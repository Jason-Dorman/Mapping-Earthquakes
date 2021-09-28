// create tilelayers

var apiKey = "pk.eyJ1IjoiamRvcm1hbjE1IiwiYSI6ImNrdTQ1MDN2dTRuZmIyd3BxcDYxZjJrbWIifQ.JKNZcQO5HHyCD3XULGTQtw";

var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution:  '© <a href="https://www.mapbox.com/about/maps/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> <strong><a href="https://www.mapbox.com/map-feedback/" target="_blank">Improve this map</a></strong>',
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/dark-v10",
  accessToken: apiKey
});

// var satellitemap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
//   attribution: "Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors, <a href='https://creativecommons.org/licenses/by-sa/2.0/'>CC-BY-SA</a>, Imagery © <a href='https://www.mapbox.com/'>Mapbox</a>",
//   maxZoom: 18,
//   id: "mapbox.streets-satellite",
//   accessToken: apiKey
// });

// var outdoors = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
//   attribution: "Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors, <a href='https://creativecommons.org/licenses/by-sa/2.0/'>CC-BY-SA</a>, Imagery © <a href='https://www.mapbox.com/'>Mapbox</a>",
//   maxZoom: 18,
//   id: "mapbox.outdoors",
//   accessToken: apiKey
// });

// create map object
var map = L.map("mapid", {
  center: [
    40.7, -94.5
  ],
  zoom: 3,
  layers: [darkmap] //satellitemap, outdoors]
});

// Adding 'graymap' tile layer to the map.
darkmap.addTo(map);

// create the layers for two different sets of data [earthquakes and tectonicplates]

var tectonicplates = new L.LayerGroup();
var earthquakes = new L.LayerGroup();

// object that contains all map choices
var baseMaps = {
  // Satellite: satellitemap,
  Dark: darkmap
  // Outdoors: outdoors
};

// define an object that contains all overlays
var overlays = {
  "Tectonic Plates": tectonicplates,
  Earthquakes: earthquakes
};

// add a control to the map that will allow the user to change layers
L
  .control
  .layers(baseMaps, overlays)
  .addTo(map);

// get the USGIS earthquake data for last seven days
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson", function(data) {

  // return the style data for each earthquake.
  // pass the magnitude of the earthquake into two separate functions
  // to calculate the color and radius
  function styleInfo(feature) {
    return {
      opacity: 1,
      fillOpacity: 1,
      fillColor: getColor(feature.properties.mag),
      color: "#000000",
      radius: getRadius(feature.properties.mag),
      stroke: true,
      weight: 0.5
    };
  }

  // Determines the color of the marker based on the magnitude of the earthquake.
  function getColor(magnitude) {
    switch (true) {
    case magnitude > 5:
      return "#ea2c2c";
    case magnitude > 4:
      return "#ea822c";
    case magnitude > 3:
      return "#ee9c00";
    case magnitude > 2:
      return "#eecc00";
    case magnitude > 1:
      return "#d4ee00";
    default:
      return "#98ee00";
    }
  }

  // function for the radius of the earthquake marker based on its magnitude.
  function getRadius(magnitude) {
    if (magnitude === 0) {
      return 1;
    }

    return magnitude * 4;
  }

  // add a GeoJSON layer to the map once the file is loaded.
  L.geoJson(data, {
    // turn each feature into a circleMarker on the map.
    pointToLayer: function(feature, latlng) {
      return L.circleMarker(latlng);
    },
    // set the style for each circleMarker using styleInfo function.
    style: styleInfo,
    // create a popup for each marker to display the magnitude and location of
    // the earthquake after the marker has been created and styled
    onEachFeature: function(feature, layer) {
      layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);
    }
    // add the data to the earthquake layer instead of directly to the map.
  }).addTo(earthquakes);

  // add the earthquake layer to map.
  earthquakes.addTo(map);

  // create a legend control object.
  var legend = L.control({
    position: "bottomright"
  });

  // add all the details for our legend
  legend.onAdd = function() {
    var div = L
      .DomUtil
      .create("div", "info legend");

    var grades = [0, 1, 2, 3, 4, 5];
    var colors = [
      "#98ee00",
      "#d4ee00",
      "#eecc00",
      "#ee9c00",
      "#ea822c",
      "#ea2c2c"
    ];

    // Loop through intervals and generate a label with a colored square for each interval.
    for (var i = 0; i < grades.length; i++) {
      div.innerHTML += "<i style='background: " + colors[i] + "'></i> " +
        grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
    }
    return div;
  };

  // add legend to the map.
  legend.addTo(map);

  // get the Tectonic Plate data.
  d3.json("https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json",
    function(platedata) {
      // Adding geoJSON data, along with style information, to the tectonicplates
      // layer.
      L.geoJson(platedata, {
        color: "orange",
        weight: 2
      })
      .addTo(tectonicplates);

      // add the tectonicplates layer to the map.
      tectonicplates.addTo(map);
    });
});