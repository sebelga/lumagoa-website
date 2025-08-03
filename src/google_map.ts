export const googleMap = () => {
  // Define the initMap function (make it globally accessible for the callback)
  (window as any).initMap = function () {
    // Define the map options
    const mapOptions = {
      center: { lat: 15.0128486, lng: 74.0201883 },
      zoom: 14, // Zoom level: 14 shows a local area view
      mapTypeId: "satellite", // Optional: 'roadmap' (default), 'satellite', 'hybrid', or 'terrain'
    };

    const mapEl = document.getElementById("map");
    if (!mapEl) {
      console.error("Map element not found");
      return;
    }

    // Create the map and attach it to the <div id="map">
    const map = new google.maps.Map(mapEl, mapOptions);

    // Optional: Add a marker for your resort location
    new google.maps.Marker({
      position: { lat: 15.0128486, lng: 74.0201883 },
      map: map,
      title: "Luma Goa", // Tooltip on hover
    });
  };

  // Dynamically create and append the Google Maps script tag
  const script = document.createElement("script");
  script.src =
    "https://maps.googleapis.com/maps/api/js?key=AIzaSyAMs_QCrAi4FicxfDdEX6m-rsp-ItkqVH4&callback=initMap";
  script.async = true;
  script.defer = true;
  document.head.appendChild(script);
};
