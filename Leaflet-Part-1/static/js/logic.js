// Creating the map object
let myMap = L.map("map", {
    center: [27.96044, -82.30695],
    zoom: 3
  });
  
  // Adding the tile layer
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(myMap);
  
  // Load the GeoJSON data.
  let geoData = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
  
  // Get the data with d3.
  d3.json(geoData).then(function(data) {
  
    // return color based on value
    function getValue(x) {
        return x > 90 ? "#F06A6A" :
            x > 70 ? "##F0A76A" :
            x > 50 ? "#F3B94C" :
            x > 30 ? "#F3DB4C" :
            x > 10 ? "#E1F34C" :
                "#B6F34C";
    }



    //  style function 
    function style(feature) {
        return {
            stroke: true,  
            weight: 1,
            fillOpacity: 0.8,
            radius: feature.properties.mag*3    ,
            fillColor: getValue(feature.geometry.coordinates[2]),
            color: "black",
            weight: 0.5,
            opacity: 0.5,
        
        };
    }

// adding data from geojson file using style
    var dat = L.geoJson(data, {
        pointToLayer: function (feature, latlng) {
		return L.circleMarker(latlng, style(feature));
	},
  
      // Binding a popup to each layer
      onEachFeature: function(feature, layer) {
        layer.bindPopup("<strong>" + feature.properties.place + "</strong><br /><br />Magnitude: " +
          feature.properties.mag + "<br /><br />Depth:" + feature.geometry.coordinates[2]);
      }
    }).addTo(myMap);
  
    // Set up the legend.
    let legend = L.control({ position: "bottomright" });
    legend.onAdd = function() {
      let div = L.DomUtil.create("div", "info legend");
      let limits = [-10,10,30,50,70,90];
      let colors = ['#B6F34C', '#E1F34C', '#F3DB4C', '#F3B94C', '#F0A76A','#F06A6A'];

      for (let i = 0; i < limits.length; i++) {
        div.innerHTML += "<i style='background: " + colors[i] + "'></i> "
          + limits[i] + (limits[i + 1] ? "&ndash;" + limits[i + 1] + "<br>" : "+");
      }
      return div;
    };
    
    // Adding the legend to the map
    legend.addTo(myMap);
  
  });
  