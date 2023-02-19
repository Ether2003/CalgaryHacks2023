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
