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
