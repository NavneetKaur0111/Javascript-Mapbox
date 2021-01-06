// get the current location
// const geo = navigator.geolocation;
// get location by geo.getcurrentposition

//https://api.mapbox.com/geocoding/v5/mapbox.places/winnipeg.json?access_token=pk.eyJ1IjoibmF2bmVldGthdXIxMTAxMDIiLCJhIjoiY2tqbGx6MXJ2NHFvbDJycDkzZTJtcnBldCJ9._8bFHYShajMmYkmTvZn-Ng&limit=10
//get 10 related results for the query location.
//https://api.mapbox.com/geocoding/v5/mapbox.places/gas.json?access_token=pk.eyJ1IjoibmF2bmVldGthdXIxMTAxMDIiLCJhIjoiY2tqbGx6MXJ2NHFvbDJycDkzZTJtcnBldCJ9._8bFHYShajMmYkmTvZn-Ng&limit=10&proximity=-97.169907,49.785175
//get 10 nearby results

//https://api.mapbox.com/directions/v5/mapbox/cycling/-97.169907,49.785175;-97.156394,49.781655?access_token=pk.eyJ1IjoibmF2bmVldGthdXIxMTAxMDIiLCJhIjoiY2tqbGx6MXJ2NHFvbDJycDkzZTJtcnBldCJ9._8bFHYShajMmYkmTvZn-Ng
//get routing distance between two coordinates

//remove a marker
//var marker = new mapboxgl.Marker().addTo(map);
// marker.remove();

//fly to a new center
// document.getElementById('fly').addEventListener('click', function () {
//   // Fly to a random location by offsetting the point -74.50, 40
//   // by up to 5 degrees.
//   map.flyTo({
//   center: [
//   -74.5 + (Math.random() - 0.5) * 10,
//   40 + (Math.random() - 0.5) * 10
//   ],
//   essential: true // this animation is considered essential with respect to prefers-reduced-motion
//   });
//   });

const apikey =
  "pk.eyJ1IjoibmF2bmVldGthdXIxMTAxMDIiLCJhIjoiY2tqbGx6MXJ2NHFvbDJycDkzZTJtcnBldCJ9._8bFHYShajMmYkmTvZn-Ng";
const geo = navigator.geolocation;
const ul = document.querySelector('.points-of-interest');
const form = document.querySelector('form');
const li = document.querySelectorAll('.poi');


function drawMapForCurrentLocation() {
  geo.getCurrentPosition(
    (location) => {
      displayMap(location.coords.longitude, location.coords.latitude);
    },
    (error) => {
      console.log(error);
    }
  );
}

function displayMap(long, lat) {
  mapboxgl.accessToken = "pk.eyJ1IjoibmF2bmVldGthdXIxMTAxMDIiLCJhIjoiY2tqbGx6MXJ2NHFvbDJycDkzZTJtcnBldCJ9._8bFHYShajMmYkmTvZn-Ng";
  let map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/streets-v11",
    center: [long, lat],
    zoom: 10,
  });
  let marker = new mapboxgl.Marker()
    .setLngLat([long, lat])
    .addTo(map);
}

drawMapForCurrentLocation();

function forwardGeocode(placeName, long, lat) {
  fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${placeName}.json?access_token=${apikey}&limit=10&proximity=${long},${lat}`)
    .then(response => response.json())
    .then(data => {
      const places = data["features"];
      ul.innerHTML = "";
      for (let place in places) {
        printplaces(places[place], long, lat)
      }
    })
    .catch((error) => {
      console.log(error);
    });
}

function printplaces(place, long, lat) {
  const distance = calculateDistance(place.center[0], place.center[1], long, lat).toFixed(2);
  ul.insertAdjacentHTML('beforeend',
    `<li class="poi" data-long="${place.center[0]}" data-lat="${place.center[1]}">
  <ul>
    <li class="name">${place.text}</li>
    <li class="street-address">${place.properties.address}</li>
    <li class="distance">${distance} Km</li>
  </ul>
</li>`)
}

function calculateDistance(long2, lat2, long1, lat1) {
  const R = 6371;
  const dLat = deg2rad(lat2 - lat1);
  const dLong = deg2rad(long2 - long1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLong / 2) * Math.sin(dLong / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return d;
}
function deg2rad(deg) {
  return deg * (Math.PI / 180)
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  if (event.target.nodeName === 'INPUT' || event.target.nodeName === 'FORM') {
    let inputValue = event.target.firstElementChild.value;
    event.target.firstElementChild.value = "";
    geo.getCurrentPosition(
      (location) => {
        forwardGeocode(inputValue, location.coords.longitude, location.coords.latitude);
      },
      (error) => {
        console.log(error);
      }
    );
  }
})

ul.addEventListener('click', (event) => {
  let target;
  if (event.target.classList[0] === 'poi') {
    target = event.target;
  } else if (event.target.parentElement.parentElement.classList[0] === 'poi') {
    target = (event.target.parentElement.parentElement);
  }
  console.log(target.dataset.long);
  console.log(target.dataset.lat);
  displayMap(target.dataset.long, target.dataset.lat)
  map.flyTo({
    center: [
      -74.5 + (Math.random() - 0.5) * 10,
      40 + (Math.random() - 0.5) * 10
    ],
    essential: true
  })
})