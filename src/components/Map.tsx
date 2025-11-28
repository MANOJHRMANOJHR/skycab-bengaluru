import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapPin, Plus, X } from "lucide-react";

// Fix for default marker icons
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface Location {
  lat: number;
  lng: number;
  name: string;
}

interface MapProps {
  onLocationSelect: (type: "start" | "end", location: Location) => void;
  startLocation: Location | null;
  endLocation: Location | null;
  stops: Location[];
  onAddStop: (location: Location) => void;
  onRemoveStop: (index: number) => void;
}

const Map = ({ onLocationSelect, startLocation, endLocation, stops, onAddStop, onRemoveStop }: MapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const [selectionMode, setSelectionMode] = useState<"start" | "end" | "stop">("start");
  const startMarker = useRef<L.Marker | null>(null);
  const endMarker = useRef<L.Marker | null>(null);
  const stopMarkers = useRef<L.Marker[]>([]);
  const routeLine = useRef<L.Polyline | null>(null);

  useEffect(() => {
    if (mapContainer.current && !map.current) {
      map.current = L.map(mapContainer.current).setView([12.9716, 77.5946], 12);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(map.current);
    }
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!map.current) return;
    const handleClick = (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      const name = `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
      if (selectionMode === "stop") {
        onAddStop({ lat, lng, name });
      } else {
        onLocationSelect(selectionMode, { lat, lng, name });
      }
    };
    map.current.on("click", handleClick);
    return () => {
      if (map.current) {
        map.current.off("click", handleClick);
      }
    };
  }, [selectionMode, onLocationSelect, onAddStop]);

  useEffect(() => {
    if (!map.current) return;

    const createMarkerIcon = (color: string) => L.divIcon({
      html: `<div class="flex items-center justify-center w-10 h-10 bg-${color} rounded-full shadow-glow border-2 border-white"><MapPin class="w-5 h-5 text-white" /></div>`,
      className: "custom-marker",
      iconSize: [40, 40],
      iconAnchor: [20, 40],
    });

    if (startLocation) {
      if (startMarker.current) startMarker.current.setLatLng([startLocation.lat, startLocation.lng]);
      else {
        startMarker.current = L.marker([startLocation.lat, startLocation.lng], { icon: createMarkerIcon("primary") })
          .addTo(map.current)
          .bindPopup(`<b>Start:</b> ${startLocation.name}`);
      }
    } else if (startMarker.current) {
      startMarker.current.remove();
      startMarker.current = null;
    }

    if (endLocation) {
      if (endMarker.current) endMarker.current.setLatLng([endLocation.lat, endLocation.lng]);
      else {
        endMarker.current = L.marker([endLocation.lat, endLocation.lng], { icon: createMarkerIcon("accent") })
          .addTo(map.current)
          .bindPopup(`<b>Destination:</b> ${endLocation.name}`);
      }
    } else if (endMarker.current) {
      endMarker.current.remove();
      endMarker.current = null;
    }

    // Handle stops
    stopMarkers.current.forEach(marker => marker.remove());
    stopMarkers.current = [];
    stops.forEach((stop, index) => {
      const stopIcon = L.divIcon({
        html: `<div class="flex items-center justify-center w-8 h-8 bg-secondary rounded-full shadow-md border-2 border-white text-secondary-foreground font-bold">${index + 1}</div>`,
        className: "custom-marker",
        iconSize: [32, 32],
        iconAnchor: [16, 32],
      });
      const marker = L.marker([stop.lat, stop.lng], { icon: stopIcon })
        .addTo(map.current!)
        .bindPopup(`<b>Stop ${index + 1}:</b> ${stop.name}`);
      marker.on('click', () => onRemoveStop(index));
      stopMarkers.current.push(marker);
    });

    const locations = [startLocation, ...stops, endLocation].filter(Boolean) as Location[];
    if (locations.length > 1) {
      const latlngs: L.LatLngExpression[] = locations.map(loc => [loc.lat, loc.lng] as L.LatLngTuple);
      if (routeLine.current) routeLine.current.setLatLngs(latlngs);
      else {
        routeLine.current = L.polyline(latlngs, {
          color: "hsl(var(--primary))",
          weight: 4,
          opacity: 0.8,
        }).addTo(map.current);

        routeLine.current.on('click', (e) => {
          if (selectionMode === 'stop') {
            const { lat, lng } = e.latlng;
            const name = `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
            onAddStop({ lat, lng, name });
          }
        });

      }
      const bounds = L.latLngBounds(latlngs);
      map.current.fitBounds(bounds, { padding: [50, 50] });
    } else if (routeLine.current) {
      routeLine.current.remove();
      routeLine.current = null;
    }
  }, [startLocation, endLocation, stops, onRemoveStop]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="absolute inset-0 rounded-2xl overflow-hidden shadow-card" />
      <div className="absolute top-4 left-4 z-[1000] flex gap-2">
        <button
          onClick={() => setSelectionMode("start")}
          className={`px-4 py-2 rounded-full font-medium transition-smooth shadow-card ${selectionMode === "start" ? "bg-primary text-primary-foreground" : "bg-white text-foreground hover:bg-secondary"}`}>
          <MapPin className="w-4 h-4 inline mr-2" /> Set Start
        </button>
        <button
          onClick={() => setSelectionMode("end")}
          className={`px-4 py-2 rounded-full font-medium transition-smooth shadow-card ${selectionMode === "end" ? "bg-accent text-accent-foreground" : "bg-white text-foreground hover:bg-secondary"}`}>
          <MapPin className="w-4 h-4 inline mr-2" /> Set Destination
        </button>
        <button
          onClick={() => setSelectionMode("stop")}
          className={`px-4 py-2 rounded-full font-medium transition-smooth shadow-card ${selectionMode === "stop" ? "bg-secondary text-secondary-foreground" : "bg-white text-foreground hover:bg-secondary"}`}>
          <Plus className="w-4 h-4 inline mr-2" /> Add Stop
        </button>
      </div>
    </div>
  );
};

export default Map;
