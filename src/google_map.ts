export const googleMap = () => {
  if ((window as any).initMap === undefined) {
    // Define the initMap function (make it globally accessible for the callback)
    (window as any).initMap = function () {
      const mapEl = document.getElementById("map");
      if (!mapEl) {
        console.info("Map element not found");
        return;
      }

      const lumaPosition = { lat: 15.0126252, lng: 74.0210419 };
      const primaryBrandColor = "#c66f54";

      // Define the map options
      const mapOptions = {
        center: lumaPosition,
        zoom: 16,
        mapTypeId: "roadmap",
        mapId: "luma-goa-map", // Use this in Google Console to set muted colors
        disableDefaultUI: true,
        zoomControl: true,
        zoomControlOptions: {
          position: google.maps.ControlPosition.RIGHT_BOTTOM,
        },
      };

      // Create the map and attach it to the <div id="map">
      const map = new google.maps.Map(mapEl, mapOptions);

      const pinElement = new google.maps.marker.PinElement({
        background: primaryBrandColor,
        borderColor: "#ffffff",
        glyphColor: "#ffffff",
        scale: 1.2,
      });

      const marker = new google.maps.marker.AdvancedMarkerElement({
        position: lumaPosition,
        map: map,
        content: pinElement.element,
        title: "Luma Goa Sanctuary",
      });

      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div style="text-align: center; padding: 12px; font-family: serif;">
            <h2 style="font-size: 1.25rem; color: #1c1917; margin: 0 0 4px 0;">LUMA Goa</h2>
            <p style="font-size: 0.75rem; color: #78716c; margin: 0 0 16px 0; letter-spacing: 0.1em; text-transform: uppercase;">Sanctuary of Rest</p>
            
            <div style="display: flex; flex-direction: column; gap: 8px;">
              <a href="https://search.google.com/local/writereview?placeid=ChIJLQjFN7dFvjsR8yezomPB5ao" 
                target="_blank" 
                style="background-color: ${primaryBrandColor}; color: white; padding: 10px 20px; text-decoration: none; border-radius: 50px; font-size: 0.8rem; font-weight: 600; font-family: sans-serif;">
                Leave a Review
              </a>
              <a href="https://www.google.com/maps/dir/?api=1&destination=15.0126252,74.0210419" 
                target="_blank" 
                style="color: ${primaryBrandColor}; font-size: 0.75rem; text-decoration: underline; font-family: sans-serif; font-weight: 600;">
                Get Directions
              </a>
            </div>
          </div>
        `,
      });

      // Add click listener to open the InfoWindow
      marker.addListener("click", () => {
        infoWindow.open({ anchor: marker, map });
      });
    };
  }

  // Dynamically create and append the Google Maps script tag
  const script = document.createElement("script");
  script.src = script.src =
    "https://maps.googleapis.com/maps/api/js?key=AIzaSyAMs_QCrAi4FicxfDdEX6m-rsp-ItkqVH4&loading=async&libraries=marker&callback=initMap";
  script.async = true;
  script.defer = true;
  document.head.appendChild(script);
};
