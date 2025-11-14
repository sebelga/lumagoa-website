export const googleMap = () => {
  // Define the initMap function (make it globally accessible for the callback)
  (window as any).initMap = function () {
    const mapEl = document.getElementById("map");
    if (!mapEl) {
      console.info("Map element not found");
      return;
    }

    // Define the map options
    const mapOptions = {
      center: { lat: 15.0128486, lng: 74.0201883 },
      zoom: 14, // Zoom level: 14 shows a local area view
      mapTypeId: "satellite", // Optional: 'roadmap' (default), 'satellite', 'hybrid', or 'terrain'
      mapId: "luma-goa-map", // Optional: Custom map ID for styling
    };

    // Create the map and attach it to the <div id="map">
    const map = new google.maps.Map(mapEl, mapOptions);

    // Optional: Add a marker for your resort location
    const marker = new google.maps.marker.AdvancedMarkerElement({
      position: { lat: 15.0128486, lng: 74.0201883 },
      map: map,
      title: "Luma Goa", // Tooltip on hover
    });

    const infoWindow = new google.maps.InfoWindow({
      content: `
        <div style="text-align: center; padding: 0;">
          <h1 style="font-size: 1.2em; margin-bottom: 5px;">Luma Goa</h1>
          <p style="margin-bottom: 10px;">+91 808 772 34 55</p>
          <a href="https://www.google.com/travel/hotels/s/qk9G3treNLRK1RYt8" target="_blank">
            <button style="background-color: #c66f54; color: white; padding: 8px 12px; border: none; border-radius: 4px; cursor: pointer;">Leave us a review!</button>
          </a>
        </div>
      `,
    });

    // Add click listener to open the InfoWindow
    marker.addListener("click", () => {
      infoWindow.open({ anchor: marker, map });
    });
  };

  // Dynamically create and append the Google Maps script tag
  const script = document.createElement("script");
  script.src = script.src =
    "https://maps.googleapis.com/maps/api/js?key=AIzaSyAMs_QCrAi4FicxfDdEX6m-rsp-ItkqVH4&loading=async&libraries=marker&callback=initMap";
  script.async = true;
  script.defer = true;
  document.head.appendChild(script);
};
