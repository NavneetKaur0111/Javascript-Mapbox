const apikey =
  "pk.eyJ1IjoibmF2bmVldGthdXIxMTAxMDIiLCJhIjoiY2tqbGx6MXJ2NHFvbDJycDkzZTJtcnBldCJ9._8bFHYShajMmYkmTvZn-Ng";
const ul = document.querySelector(".points-of-interest");
const form = document.querySelector("form");
const li = document.querySelectorAll(".poi");

function getCurrentPosition() {
  return new Promise((resolve, reject) => {
    const geo = navigator.geolocation;
    if (geo) {
      geo.getCurrentPosition((location) => {
        resolve({
          lat: location.coords.latitude,
          long: location.coords.longitude,
        });
      });
    } else {
      reject("Error: location is not available");
    }
  });
}

function drawMap(lat, long) {
  mapboxgl.accessToken =
    "pk.eyJ1IjoibmF2bmVldGthdXIxMTAxMDIiLCJhIjoiY2tqbGx6MXJ2NHFvbDJycDkzZTJtcnBldCJ9._8bFHYShajMmYkmTvZn-Ng";
  let map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/streets-v11",
    center: [long, lat],
    zoom: 10,
  });

  return map;
}

function forwardGeocode(placeName, long, lat) {
  fetch(
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${placeName}.json?access_token=${apikey}&limit=10&proximity=${long},${lat}`
  )
    .then((response) => response.json())
    .then((placesList) => {
      const places = placesList["features"];
      ul.innerHTML = "";
      for (let place in places) {
        printplaces(places[place], long, lat);
      }
    })
    .catch((error) => {
      console.log(error);
    });
}

function printplaces(place, long, lat) {
  const distance = calculateDistance(
    place.center[0],
    place.center[1],
    long,
    lat
  ).toFixed(2);
  ul.insertAdjacentHTML(
    "beforeend",
    `<li class="poi" data-long="${place.center[0]}" data-lat="${place.center[1]}">
  <ul>
    <li class="name">${place.text}</li>
    <li class="street-address">${place.properties.address}</li>
    <li class="distance">${distance} Km</li>
  </ul>
</li>`
  );
}

function calculateDistance(long2, lat2, long1, lat1) {
  const R = 6371;
  const dLat = deg2rad(lat2 - lat1);
  const dLong = deg2rad(long2 - long1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLong / 2) *
      Math.sin(dLong / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

getCurrentPosition()
  .then((location) => {
    const map = drawMap(location.lat, location.long);
    return [map, location];
  })
  .then((array) => {
    let marker = new mapboxgl.Marker()
      .setLngLat([array[1].long, array[1].lat])
      .addTo(array[0]);
    return [array[0], array[1], marker];
  })
  .then((array) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (
        event.target.nodeName === "INPUT" ||
        event.target.nodeName === "FORM"
      ) {
        let inputValue = event.target.firstElementChild.value;
        event.target.firstElementChild.value = "";
        forwardGeocode(inputValue, array[1].long, array[1].lat);
      }
    });
    return array;
  })
  .then((array) => {
    const map = array[0];
    let marker1;
    ul.addEventListener("click", (event) => {
      let target;
      if (event.target.classList[0] === "poi") {
        target = event.target;
      } else if (
        event.target.parentElement.parentElement.classList[0] === "poi"
      ) {
        target = event.target.parentElement.parentElement;
      }
      map.flyTo({
        center: [target.dataset.long, target.dataset.lat],
        essential: true,
      });
      if (marker1) {
        marker1.remove();
      }
      array[2].remove();
      marker1 = new mapboxgl.Marker()
        .setLngLat([target.dataset.long, target.dataset.lat])
        .addTo(map);
    });
  });
