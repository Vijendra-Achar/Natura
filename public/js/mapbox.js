// import { MAPBOX_ACCESS_TOKEN } from './environment';

const locations = JSON.parse(document.getElementById('map').dataset.locations);

mapboxgl.accessToken =
  'pk.eyJ1IjoidmlqZW5kcmFjaGFyIiwiYSI6ImNraDcyaWUxdzBoeDUycG56ano5bHR5Z2kifQ.ccHbOExocP4G_2cJabutbg';

var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/vijendrachar/ckh73mey508g119osvq52plg1',
  scrollZoom: false,
});

const bounds = new mapboxgl.LngLatBounds();

locations.forEach((loc) => {
  // Create a HTML Marker
  const el = document.createElement('div');
  el.className = 'marker';

  // Insert the marker on the map
  new mapboxgl.Marker({
    element: el,
    anchor: 'bottom',
  })
    .setLngLat(loc.coordinates)
    .addTo(map);

  // Insert Popup
  new mapboxgl.Popup({
    offset: 30,
  })
    .setLngLat(loc.coordinates)
    .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
    .addTo(map);

  // Extend the bounds of the map
  bounds.extend(loc.coordinates);
});

map.fitBounds(bounds, {
  padding: {
    top: 200,
    bottom: 100,
    left: 100,
    right: 100,
  },
});
