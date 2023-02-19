const helperFuncThatDoesSthHelpful = () => {
  console.log("i did sth helpful yay");
};

//map for safety page
function initMap() {
  var calgary = { lat: 51.0447, lng: -114.0719 };
  var map = new google.maps.Map(document.getElementById("map"), {
    zoom: 12,
    center: calgary,
  });

  var pins = [];
  map.addListener("click", function (event) {
    var pin = new google.maps.Marker({
      position: event.latLng,
      map: map,
    });

    pins.push(pin);
  });
}
