import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import "./GlobalMap.css";
import api from "../api";

export default function GlobalMap() {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);

  const [routes, setRoutes] = useState([]);

  //
  // 1. Fetch ALL routes stored in backend
  //
  useEffect(() => {
    api.get("/api/globalmap").then((res) => {
      console.log("Fetched global routes:", res.data.routes);
      setRoutes(res.data.routes || []);
    });
  }, []);

  //
  // 2. Initialize map
  //
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    mapRef.current = new maplibregl.Map({
      container: mapContainerRef.current,
      style: "https://demotiles.maplibre.org/style.json",
      center: [0, 0],
      zoom: 2,
    });

    mapRef.current.addControl(new maplibregl.NavigationControl(), "top-right");
  }, []);

  //
  // 3. Plot all routes
  //
  useEffect(() => {
    if (!mapRef.current || routes.length === 0) return;

    const addRoutes = () => {
      const bounds = new maplibregl.LngLatBounds();

      routes.forEach((route, index) => {
        const sourceId = `route-${index}`;

        // Convert each route to GeoJSON
        const geojson = {
          type: "FeatureCollection",
          features: route.map((coord) => ({
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [coord[1], coord[0]], // lng, lat
            },
          })),
        };

        // Expand the bounds to include this route
        route.forEach((coord) => bounds.extend([coord[1], coord[0]]));

        // Prevent duplicates on hot reload
        if (!mapRef.current.getSource(sourceId)) {
          mapRef.current.addSource(sourceId, {
            type: "geojson",
            data: geojson,
          });

          mapRef.current.addLayer({
            id: sourceId,
            type: "circle",
            source: sourceId,
            paint: {
              "circle-radius": 3,
              "circle-color": "#ff0000",
              "circle-opacity": 0.8,
            },
          });
        }
      });

      // Fit map to all routes
      if (!bounds.isEmpty()) {
        mapRef.current.fitBounds(bounds, { padding: 30 });
      }
    };

    if (mapRef.current.loaded()) addRoutes();
    else mapRef.current.on("load", addRoutes);

  }, [routes]);

  return (
    <div ref={mapContainerRef} className="global-map-container" />
  );
}
