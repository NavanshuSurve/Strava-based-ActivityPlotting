import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

export default function Map({ latlng }) {
  const mapContainer = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current) {
      mapRef.current = new maplibregl.Map({
        container: mapContainer.current,
        style: `https://api.maptiler.com/maps/streets-v2/style.json?key=rs0Hhpyy77r5uZ7FxM3Q`,
        center: [0, 0],
        zoom: 12,
        interactive:false,
      });
    }

    const map = mapRef.current;

    if (!latlng || latlng.length < 2) return;

    const coordinates = latlng.map(([lat, lng]) => [lng, lat]);

    const geojson = {
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates
      }
    };

    // WAIT for map to be ready before touching sources/layers
    map.on("load", () => {
      // 🔥 ADD SOURCE ONLY ONCE
      if (!map.getSource("route")) {
        map.addSource("route", {
          type: "geojson",
          data: geojson,
        });
      } else {
        // UPDATE geojson gracefully
        map.getSource("route").setData(geojson);
      }

      // 🔥 ADD LAYER ONLY ONCE
      if (!map.getLayer("route-line")) {
        map.addLayer({
          id: "route-line",
          type: "line",
          source: "route",
          paint: {
            "line-color": "#ff6600",
            "line-width": 4,
          },
        });
      }
    });

    // Fit bounds safely AFTER route exists
    const bounds = new maplibregl.LngLatBounds();
    coordinates.forEach(c => bounds.extend(c));

    map.fitBounds(bounds, {
      padding: 30,
      maxZoom: 17,
      duration: 300,
    });

  }, [latlng]);

  return (<>
  <div
      ref={mapContainer}
      style={{
        height: "400px",
        width: "100%",
        borderRadius: "10px"
      }}
    />
  </>
    
  );
}
