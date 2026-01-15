import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import api from "../api";
import "./GlobalMap.css";
export default function GlobalMap() {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const [routes, setRoutes] = useState([]);

  // 1. Fetch data correctly
  useEffect(() => {
    api.get("/api/globalmap").then((res) => {
      // Based on your JSON, the array is res.data.routes
      setRoutes(res.data.routes || []);
    });
  }, []);

  // 2. Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    mapRef.current = new maplibregl.Map({
      container: mapContainerRef.current,
      style: `https://api.maptiler.com/maps/streets-v2/style.json?key=rs0Hhpyy77r5uZ7FxM3Q`,
      center: [77.96, 30.41], // Centered near your data (Doonga)
      zoom: 12,
    });

    mapRef.current.addControl(new maplibregl.NavigationControl(), "top-right");
  }, []);

  // 3. Plot all routes as Lines
  useEffect(() => {
    if (!mapRef.current || routes.length === 0) return;

    const map = mapRef.current;

    const addRoutesToMap = () => {
      const bounds = new maplibregl.LngLatBounds();

      routes.forEach((routeObj, index) => {
        const sourceId = `route-source-${index}`;
        const layerId = `route-layer-${index}`;

        // IMPORTANT: Swap [lat, lng] to [lng, lat] for MapLibre
        const lngLatCoords = routeObj.data.map((coord) => [coord[1], coord[0]]);

        // Extend bounds so all routes are visible
        lngLatCoords.forEach((c) => bounds.extend(c));

        if (!map.getSource(sourceId)) {
          map.addSource(sourceId, {
            type: "geojson",
            data: {
              type: "Feature",
              properties: { name: routeObj.key },
              geometry: {
                type: "LineString",
                coordinates: lngLatCoords,
              },
            },
          });

          map.addLayer({
            id: layerId,
            type: "line",
            source: sourceId,
            layout: { "line-join": "round", "line-cap": "round" },
            paint: {
              "line-color": "#ff4d4d",
              "line-width": 4,
              "line-opacity": 0.7,
            },
          });
        }
      });

      if (!bounds.isEmpty()) {
        map.fitBounds(bounds, { padding: 50 });
      }
    };

    if (map.loaded()) addRoutesToMap();
    else map.on("load", addRoutesToMap);
  }, [routes]);

  return <div ref={mapContainerRef} style={{ width: "100vh", height: "100vh" }} />;
}