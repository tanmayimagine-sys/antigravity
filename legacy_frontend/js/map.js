/**
 * map.js — Map Integration Stub
 * Currently a placeholder. Replace initMap() body with
 * Google Maps API initialization once the key is available.
 *
 * [MAP-READY] Integration steps:
 *   1. Add <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_KEY&callback=initMap" async defer></script>
 *   2. Replace the body below with actual Google Maps code.
 *   3. Create markers for each place using addMarker().
 */

const MAP_CONFIG = {
  defaultCenter: { lat: 26.9124, lng: 75.7873 }, // Jaipur, India
  defaultZoom: 12,
};

window.initMap = function () {
  // [MAP-READY] — Uncomment and configure once Google Maps API key is available:
  //
  // const mapEl = document.getElementById('map-container');
  // if (!mapEl) return;
  //
  // const map = new google.maps.Map(mapEl, {
  //   center: MAP_CONFIG.defaultCenter,
  //   zoom: MAP_CONFIG.defaultZoom,
  //   styles: mapStyles,  // Custom style array for premium look
  //   disableDefaultUI: false,
  // });
  //
  // window._map = map;
  // loadMarkersFromItinerary(map);

  console.info('[TravelPlanner] Map stub loaded. Connect Google Maps API to activate.');
};

window.addMarker = function (placeName, lat, lng) {
  // [MAP-READY] — Add marker to Google Maps:
  // const marker = new google.maps.Marker({ position: { lat, lng }, map: window._map, title: placeName });
  console.info(`[Map] Marker stub: "${placeName}" at (${lat}, ${lng})`);
};

// Custom Google Maps style for premium dark/light look
const mapStyles = [
  { elementType: 'geometry', stylers: [{ color: '#f5f7fa' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#c9d6ea' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#ffffff' }] },
  { featureType: 'poi', stylers: [{ visibility: 'simplified' }] },
];
