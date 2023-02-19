const helperFuncThatDoesSthHelpful = () => {
  console.log("i did sth helpful yay");
};

// Set your access token
mapboxgl.accessToken =
  "pk.eyJ1IjoiYWtoYWxpbDk1IiwiYSI6ImNsZWFyYmt3ZjBqMG4zdGxlN2NzNWh4MnEifQ.WkwRn5cI_HAVDtKC65GYlg";

// Create a mapboxgl map
const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/streets-v11",
  center: [-114.0719, 51.0447],
  zoom: 11,
});

// Define an array of pre-defined markers
const preDefinedMarkers = [
  { lat: 51.05011, lng: -114.08529, description: "Unsafe area 1" },
  { lat: 51.04861, lng: -114.07084, description: "Unsafe area 2" },
  { lat: 51.04238, lng: -114.06856, description: "Unsafe area 3" },
];

// Add the pre-defined markers to the map
preDefinedMarkers.forEach((marker) => {
  const popup = new mapboxgl.Popup().setHTML(`<p>${marker.description}</p>`);
  new mapboxgl.Marker()
    .setLngLat([marker.lng, marker.lat])
    .setPopup(popup)
    .addTo(map);
});

// Get the stored markers from local storage
const storedMarkers = JSON.parse(localStorage.getItem("markers")) || [];

// Add the stored markers to the map
storedMarkers.forEach((marker) => {
  const popup = new mapboxgl.Popup().setHTML(`<p>${marker.description}</p>`);
  new mapboxgl.Marker()
    .setLngLat([marker.lng, marker.lat])
    .setPopup(popup)
    .addTo(map);
});

// Add a click event listener to the map
map.on("click", (e) => {
  const lat = e.lngLat.lat;
  const lng = e.lngLat.lng;
  const description = prompt("Please enter a description for this location:");

  if (description) {
    const popup = new mapboxgl.Popup().setHTML(`<p>${description}</p>`);
    new mapboxgl.Marker().setLngLat([lng, lat]).setPopup(popup).addTo(map);

    // Store the marker in local storage
    storedMarkers.push({ lat, lng, description });
    localStorage.setItem("markers", JSON.stringify(storedMarkers));
  }
});

//function to display the popup on hover

function displayPopup(e) {
  var features = map.queryRenderedFeatures(e.point, { layers: ["markers"] });
  if (!features.length) {
    return;
  }
  var feature = features[0];
  var popup = new mapboxgl.Popup({ offset: 25 })
    .setLngLat(feature.geometry.coordinates)
    .setHTML(
      "<h3>" +
        feature.properties.title +
        "</h3><p>" +
        feature.properties.description +
        "</p>"
    )
    .addTo(map);
  map.on("mouseout", function () {
    popup.remove();
  });
}

// Add a listener to display the popup on hover
map.on("mousemove", function (e) {
  displayPopup(e);
});
