import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapPin } from "lucide-react";

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

interface MapProps {
  onLocationSelect: (type: "start" | "end", location: { lat: number; lng: number; name: string }) => void;
  startLocation: { lat: number; lng: number; name: string } | null;
  endLocation: { lat: number; lng: number; name: string } | null;
}

const Map = ({ onLocationSelect, startLocation, endLocation }: MapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const [selectionMode, setSelectionMode] = useState<"start" | "end">("start");
  const startMarker = useRef<L.Marker | null>(null);
  const endMarker = useRef<L.Marker | null>(null);
  const routeLine = useRef<L.Polyline | null>(null);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    // Initialize map centered on Bengaluru
    map.current = L.map(mapContainer.current).setView([12.9716, 77.5946], 12);

    // Add tile layer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '© OpenStreetMap contributors',
    }).addTo(map.current);

    // Handle map clicks
    map.current.on("click", async (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      
      // Reverse geocoding to get location name (simplified - using coordinates as name for MVP)
      const name = `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
      
      onLocationSelect(selectionMode, { lat, lng, name });
    });

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Update markers and route when locations change
  useEffect(() => {
    if (!map.current) return;

    // Update start marker
    if (startLocation) {
      if (startMarker.current) {
        startMarker.current.setLatLng([startLocation.lat, startLocation.lng]);
      } else {
        const customIcon = L.divIcon({
          html: `<div class="flex items-center justify-center w-10 h-10 bg-primary rounded-full shadow-glow border-2 border-white">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="10" r="3"/><path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 6.9 8 11.7z"/></svg>
          </div>`,
          className: "custom-marker",
          iconSize: [40, 40],
          iconAnchor: [20, 40],
        });
        
        startMarker.current = L.marker([startLocation.lat, startLocation.lng], { icon: customIcon })
          .addTo(map.current)
          .bindPopup(`<b>Start:</b> ${startLocation.name}`);
      }
    }

    // Update end marker
    if (endLocation) {
      if (endMarker.current) {
        endMarker.current.setLatLng([endLocation.lat, endLocation.lng]);
      } else {
        const customIcon = L.divIcon({
          html: `<div class="flex items-center justify-center w-10 h-10 bg-accent rounded-full shadow-glow border-2 border-white">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="10" r="3"/><path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 6.9 8 11.7z"/></svg>
          </div>`,
          className: "custom-marker",
          iconSize: [40, 40],
          iconAnchor: [20, 40],
        });
        
        endMarker.current = L.marker([endLocation.lat, endLocation.lng], { icon: customIcon })
          .addTo(map.current)
          .bindPopup(`<b>Destination:</b> ${endLocation.name}`);
      }
    }

    // Draw route line
    if (startLocation && endLocation) {
      if (routeLine.current) {
        routeLine.current.setLatLngs([
          [startLocation.lat, startLocation.lng],
          [endLocation.lat, endLocation.lng],
        ]);
      } else {
        routeLine.current = L.polyline(
          [
            [startLocation.lat, startLocation.lng],
            [endLocation.lat, endLocation.lng],
          ],
          {
            color: "hsl(var(--primary))",
            weight: 3,
            opacity: 0.7,
            dashArray: "10, 10",
          }
        ).addTo(map.current);
      }

      // Fit bounds to show both markers
      const bounds = L.latLngBounds(
        [startLocation.lat, startLocation.lng],
        [endLocation.lat, endLocation.lng]
      );
      map.current.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [startLocation, endLocation]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="absolute inset-0 rounded-2xl overflow-hidden shadow-card" />
      
      {/* Selection Mode Toggle */}
      <div className="absolute top-4 left-4 z-[1000] flex gap-2">
        <button
          onClick={() => setSelectionMode("start")}
          className={`px-4 py-2 rounded-full font-medium transition-smooth shadow-card ${
            selectionMode === "start"
              ? "bg-primary text-primary-foreground"
              : "bg-white text-foreground hover:bg-secondary"
          }`}
        >
          <MapPin className="w-4 h-4 inline mr-2" />
          Set Start
        </button>
        <button
          onClick={() => setSelectionMode("end")}
          className={`px-4 py-2 rounded-full font-medium transition-smooth shadow-card ${
            selectionMode === "end"
              ? "bg-accent text-accent-foreground"
              : "bg-white text-foreground hover:bg-secondary"
          }`}
        >
          <MapPin className="w-4 h-4 inline mr-2" />
          Set Destination
        </button>
      </div>
    </div>
  );
};

export default Map;
