let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform get request to query URL 
d3.json(queryUrl).then(function(data) {

    //log data retrieved to console
    console.log(data);

    // once response received, send data.features to createFeatures function
    createFeatures(data.features);

});


function createFeatures(earthquakeData) {
    function onEachFeature(feature, layer) {
        layer.bindPopup(`<h3>Location: ${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p><h3>Magnitude: ${feature.properties.mag}</h3><hr><p>`);
    }

    let earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature,
        pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng, {
                radius: markerSize(feature.properties.mag),
                fillColor: markerColor(feature.geometry.coordinates[2]),
                color: "#000",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            });
        }

    });

    createMap(earthquakes);
    

}

function markerSize(magnitude) {
    return magnitude * 3 

};

function markerColor(depth) {
    if (depth < 10) {
        return "#00FF00"; // Green
      } else if (depth < 20) {
        return "#FFFF00"; // Yellow
      } else if (depth < 40) {
        return "#FF5733"; // Orange
      }else {
        return "#FF0000"; // Red
      }

};

function createMap(earthquakes) {
    // Create the base layers.
    let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
      });

    // Create a baseMaps object.
    let baseMaps = {
        "Street Map": street,
        "Topographic Map": topo
    };

    // Create an overlay object to hold our overlay.
    let overlayMaps = {
        Earthquakes: earthquakes
    };

    // Create our map, giving it the streetmap and earthquakes layers to display on load.
    let myMap = L.map("map", {
        center: [39.82, -98.57],
        zoom: 5,
        layers: [street, earthquakes]
    });

    // create legend for depth map
    let legend = L.control({position: "bottomright"});

legend.onAdd = function(map) {
    let div = L.DomUtil.create("div", "legend");
    let depths = [10, 20, 40];
    let labels = [];
    let legendInfo = "<h4>Earthquake Depth</h4>";

    div.innerHTML = legendInfo;


    for (let i = 0; i < depths.length; i++) {
        // div.innerHTML +=
        //     '<i style="background-color:' + markerColor(depths[i] + 1) + '"></i> ' +
        //     depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + '<br>' : '+');

        div.innerHTML += 
            labels.push(
                '<i class="circle" style="background:' + markerColor(depths[i]) + '"></i> ' +
            (depths[i] ? depths[i] : '+'));
    }

    // div.innerHTML += "<ul>" + labels.join("") + "</ul>";
        div.innerHTML = labels.join('<br')
    return div;
};

      // Add the legend to the map.
      legend.addTo(myMap);
    
      // Create a layer control.
      L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
      }).addTo(myMap);
    }