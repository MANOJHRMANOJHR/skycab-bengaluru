import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Navigation, DollarSign, Plane, X, Plus } from "lucide-react";

interface Location {
  lat: number;
  lng: number;
  name: string;
}

interface TaxiTier {
  id: number;
  name: string;
  cost_per_km: number;
  description: string | null;
}

interface BookingPanelProps {
  startLocation: Location | null;
  endLocation: Location | null;
  stops: Location[];
  selectedTier: TaxiTier | null;
  distance: number;
  fare: number;
  onBook: () => void;
}

const BookingPanel = ({
  startLocation,
  endLocation,
  stops,
  selectedTier,
  distance,
  fare,
  onBook,
}: BookingPanelProps) => {
  const isComplete = startLocation && endLocation && selectedTier;

  return (
    <Card className="p-6 shadow-card sticky top-4">
      <h2 className="text-2xl font-bold mb-6">Your Ride Details</h2>

      <div className="space-y-4 mb-6">
        <div className="flex items-start gap-3">
          <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-full">
            <MapPin className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1">
            <div className="text-sm text-muted-foreground mb-1">Pickup</div>
            <div className="font-medium">
              {startLocation ? startLocation.name : "Select start location"}
            </div>
          </div>
        </div>

        {/* Stops */}
        {stops.map((stop, index) => (
          <div key={index} className="flex items-start gap-3 pl-5">
             <div className="flex items-center justify-center w-10 h-10 bg-secondary/10 rounded-full">
                <MapPin className="w-5 h-5 text-secondary" />
            </div>
            <div className="flex-1">
              <div className="text-sm text-muted-foreground mb-1">{`Stop ${index + 1}`}</div>
              <div className="font-medium">{stop.name}</div>
            </div>
          </div>
        ))}

        <div className="flex items-start gap-3">
          <div className="flex items-center justify-center w-10 h-10 bg-accent/10 rounded-full">
            <Navigation className="w-5 h-5 text-accent" />
          </div>
          <div className="flex-1">
            <div className="text-sm text-muted-foreground mb-1">Destination</div>
            <div className="font-medium">
              {endLocation ? endLocation.name : "Select destination"}
            </div>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="flex items-center justify-center w-10 h-10 bg-sky-cyan/10 rounded-full">
            <Plane className="w-5 h-5 text-sky-cyan" />
          </div>
          <div className="flex-1">
            <div className="text-sm text-muted-foreground mb-1">Taxi Tier</div>
            <div className="font-medium">
              {selectedTier ? selectedTier.name : "Choose tier below"}
            </div>
          </div>
        </div>
      </div>

      {isComplete && (
        <div className="bg-gradient-to-br from-primary/5 to-sky-cyan/5 rounded-xl p-4 mb-6 border border-primary/10">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-muted-foreground">Distance</span>
            <span className="font-semibold">{distance.toFixed(2)} km</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Rate</span>
            <span className="font-semibold">₹{selectedTier?.cost_per_km}/km</span>
          </div>
          <div className="border-t border-primary/10 my-3" />
          <div className="flex justify-between items-center">
            <span className="text-lg font-bold">Total Fare</span>
            <span className="text-2xl font-bold text-primary">₹{fare.toFixed(2)}</span>
          </div>
        </div>
      )}

      <Button
        onClick={onBook}
        disabled={!isComplete}
        className="w-full bg-accent hover:bg-accent/90 text-accent-foreground shadow-glow transition-bounce hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        size="lg"
      >
        {isComplete ? "Book Your Ride" : "Complete Details to Book"}
      </Button>

      {isComplete && (
        <p className="text-xs text-center text-muted-foreground mt-4">
          Estimated pickup time: 5-7 minutes
        </p>
      )}
    </Card>
  );
};

export default BookingPanel;
