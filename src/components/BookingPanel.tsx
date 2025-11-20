import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Navigation, DollarSign, Plane } from "lucide-react";

interface Location {
  lat: number;
  lng: number;
  name: string;
}

interface TaxiTier {
  id: string;
  name: string;
  rate_per_km: number;
  description: string;
  max_passengers: number;
}

interface BookingPanelProps {
  startLocation: Location | null;
  endLocation: Location | null;
  selectedTier: TaxiTier | null;
  distance: number;
  fare: number;
  onBook: () => void;
}

const BookingPanel = ({
  startLocation,
  endLocation,
  selectedTier,
  distance,
  fare,
  onBook,
}: BookingPanelProps) => {
  const isComplete = startLocation && endLocation && selectedTier;

  return (
    <Card className="p-6 shadow-card sticky top-4">
      <h2 className="text-2xl font-bold mb-6">Your Flight Details</h2>

      <div className="space-y-4 mb-6">
        {/* Start Location */}
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

        {/* End Location */}
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

        {/* Tier Selection */}
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

      {/* Distance & Fare */}
      {isComplete && (
        <div className="bg-gradient-to-br from-primary/5 to-sky-cyan/5 rounded-xl p-4 mb-6 border border-primary/10">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-muted-foreground">Distance</span>
            <span className="font-semibold">{distance.toFixed(2)} km</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Rate</span>
            <span className="font-semibold">₹{selectedTier?.rate_per_km}/km</span>
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
        {isComplete ? "Book Flying Taxi" : "Complete Details to Book"}
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
