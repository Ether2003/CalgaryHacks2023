const helperFuncThatDoesSthHelpful = () => {
  console.log("i did sth helpful yay");
};

// initialize the map
mapboxgl.accessToken =
  "pk.eyJ1IjoiYWtoYWxpbDk1IiwiYSI6ImNsZWFyYmt3ZjBqMG4zdGxlN2NzNWh4MnEifQ.WkwRn5cI_HAVDtKC65GYlg";
var map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/streets-v11",
  center: [-114.0708, 51.0486],
  zoom: 10,
});

// create a layer group for the markers
//var markers = new mapboxgl.Marker();

// add a marker when the map is clicked
map.on("click", function (e) {
  var marker = new mapboxgl.Marker().setLngLat(e.lngLat).addTo(map);

  var popup = new mapboxgl.Popup()
    .setLngLat(e.lngLat)
    .setHTML(
      '<form><textarea placeholder="Enter a comment or description"></textarea><button type="submit">Save</button></form>'
    )
    .addTo(map);

  popup.on("open", function () {
    var form = popup.getContent().querySelector("form");
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var comment = form.querySelector("textarea").value;

      // TODO: Store the marker location and comment in a database
    });
  });
});

fetch("/markers")
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    data.forEach(function (marker) {
      var el = document.createElement("div");
      el.className = "marker";
      el.style.backgroundImage = "url(marker-icon.png)";
      el.style.width = "50px";
      el.style.height = "50px";

      var popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
        "<p>" + marker.comment + "</p>"
      );

      new mapboxgl.Marker(el)
        .setLngLat(marker.location)
        .setPopup(popup)
        .addTo(map);
    });
  });

var markers = [
  {
    coordinates: [-114.0719, 51.0447],
    description: "Unsafe park at night",
  },
  {
    coordinates: [-114.0609, 51.0542],
    description: "Unsafe area near downtown",
  },
  {
    coordinates: [-114.0677, 51.0458],
    description: "Unsafe alleyway with poor lighting",
  },
];

// add markers to the map
markers.forEach(function (marker) {
  var el = document.createElement("div");
  el.className = "marker";

  new mapboxgl.Marker(el)
    .setLngLat(marker.coordinates)
    .setPopup(
      new mapboxgl.Popup({ offset: 25 }) // add popups
        .setHTML("<h3>" + marker.description + "</h3>")
    )
    .addTo(map);
});

var markers = [
  {
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [-114.0719, 51.0447],
    },
    properties: {
      description: "Unsafe area near downtown",
    },
  },
  {
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [-114.0609, 51.0542],
    },
    properties: {
      description: "Unsafe park at night",
    },
  },
  {
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [-114.0677, 51.0458],
    },
    properties: {
      description: "Unsafe alleyway with poor lighting",
    },
  },
];

// add markers to map
markers.forEach(function (marker) {
  // create a HTML element for each feature
  var el = document.createElement("div");
  el.className = "marker";

  // make a marker for each feature and add to the map
  new mapboxgl.Marker(el)
    .setLngLat(marker.geometry.coordinates)
    .setPopup(
      new mapboxgl.Popup({ offset: 25 }) // add popups
        .setHTML("<h3>" + marker.properties.description + "</h3>")
    )
    .addTo(map);
});
