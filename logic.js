// Create the tile layer that will be the background of our map
var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.light",
  accessToken: API_KEY
});

// initialize layergroups
var layers = {
    Bucket_1: new L.LayerGroup(),
    Bucket_2: new L.LayerGroup(),
    Bucket_3: new L.LayerGroup(),
    Bucket_4: new L.LayerGroup(),
    Bucket_5: new L.LayerGroup(),
    Bucket_6: new L.LayerGroup(),
};

// create map
var map = L.map("map-id", {
    center: [37.0902, -95.7129],
    zoom: 4,
    layers: [
        layers.Bucket_1,
        layers.Bucket_2,
        layers.Bucket_3,
        layers.Bucket_4,
        layers.Bucket_5,
        layers.Bucket_6
    ]
});

// add lightmap tile layer
lightmap.addTo(map);

// create overlays onbject to add to layer controls
var overlays = {
    "0-1": layers.Bucket_1,
    "1-2": layers.Bucket_2,
    "2-3": layers.Bucket_3,
    "3-4": layers.Bucket_4,
    "4-5": layers.Bucket_5,
    "5 +": layers.Bucket_6
};

// create control for layers and add overlays to it
L.control.layers(null, overlays).addTo(map);

//create legend
var info = L.control({
    position: "bottomright"
});

// when layer control is added - insert div with class "legend"
info.onAdd = function() {
    var div = L.DomUtil.create("div", "legend")
    return div;
};

// add the info legend to the map
info.addTo(map);

// Initialize an object to create circles for each layer
var circles = {
    Bucket_1: L.circleMarker({
        radius: 8,
        fillColor: "#9ACD32",
        color: "black",
        weight: 3,
        opacity: 1,
        fillOpacity: 0.8
    }),
    Bucket_2: L.circleMarker({
        radius: 8,
        fillColor: "#EEF102",
        color: "black",
        weight: 3,
        opacity: 1,
        fillOpacity: 0.8
    }),
    Bucket_3: L.circleMarker({
        radius: 8,
        fillColor: "#ffd700",
        color: "black",
        weight: 3,
        opacity: 1,
        fillOpacity: 0.8
    }),
    Bucket_4: L.circleMarker({
        radius: 8,
        fillColor: "#eeb422",
        color: "black",
        weight: 3,
        opacity: 1,
        fillOpacity: 0.8
    }),
    Bucket_5: L.circleMarker({
        radius: 8,
        fillColor: "#ee9a00",
        color: "black",
        weight: 3,
        opacity: 1,
        fillOpacity: 0.8
    }),
    Bucket_6: L.circleMarker({
        radius: 8,
        fillColor: "#ee4000",
        color: "black",
        weight: 3,
        opacity: 1,
        fillOpacity: 0.8
    }),
};

// perform API call
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson"), function(data) {

    var buckets;

    // loop through the data
    for (var i = 0; i < data.length; i++) {

        var magnitude = data[i].mag;

        if (magnitude < 1) {
            buckets = "Bucket_1";
        }

        else if (magnitude > 1 && magnitude < 2) {
            buckets = "Bucket_2";
        }

        else if (magnitude > 2 && magnitude < 3) {
            buckets = "Bucket_3";
        }

        else if (magnitude > 3 && magnitude < 4) {
            buckets = "Bucket_4";
        }

        else if (magnitude > 4 && magnitude < 5) {
            buckets = "Bucket_5";
        }

        else {
            buckets = "Bucket_6"
        }

        circles.addLayer(L.circleMarker([data.coordinates[1], data.coordinates[0]]));

        // bind a popup
        circles.bindPopup(data.place + "<br> Magnitude: " + data.mag);
    }    
};




