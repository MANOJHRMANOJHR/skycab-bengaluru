import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import Hero from "@/components/Hero";
import Map from "@/components/Map";
import TierSelector from "@/components/TierSelector";
import BookingPanel from "@/components/BookingPanel";
import BookingSuccess from "@/components/BookingSuccess";

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

const Index = () => {
  const [startLocation, setStartLocation] = useState<Location | null>(null);
  const [endLocation, setEndLocation] = useState<Location | null>(null);
  const [stops, setStops] = useState<Location[]>([]);
  const [selectedTier, setSelectedTier] = useState<TaxiTier | null>(null);
  const [tiers, setTiers] = useState<TaxiTier[]>([]);
  const [distance, setDistance] = useState(0);
  const [fare, setFare] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [bookingId, setBookingId] = useState("");
  const bookingSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchTiers();
  }, []);

  const fetchTiers = async () => {
    const { data, error } = await supabase
      .from("taxi_tiers")
      .select("*")
      .order("rate_per_km", { ascending: true });

    if (error) {
      console.error("Error fetching tiers:", error);
      toast.error("Failed to load taxi tiers");
      return;
    }

    if (data) {
      setTiers(data);
    }
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Radius of the Earth in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  useEffect(() => {
    if (startLocation && endLocation) {
      const points = [startLocation, ...stops, endLocation];
      let totalDistance = 0;
      for (let i = 0; i < points.length - 1; i++) {
        totalDistance += calculateDistance(
          points[i].lat,
          points[i].lng,
          points[i + 1].lat,
          points[i + 1].lng
        );
      }
      setDistance(totalDistance);
    } else {
      setDistance(0);
    }
  }, [startLocation, endLocation, stops]);

  useEffect(() => {
    if (distance > 0 && selectedTier) {
      const calculatedFare = distance * selectedTier.rate_per_km;
      setFare(calculatedFare);
    } else {
      setFare(0);
    }
  }, [distance, selectedTier]);

  const handleLocationSelect = (type: "start" | "end", location: Location) => {
    if (type === "start") {
      setStartLocation(location);
      toast.success("Pickup location set");
    } else {
      setEndLocation(location);
      toast.success("Destination set");
    }
  };

  const addStop = (location: Location) => {
    setStops([...stops, location]);
    toast.success("Stop added");
  };

  const removeStop = (index: number) => {
    setStops(stops.filter((_, i) => i !== index));
    toast.info("Stop removed");
  };

  const handleBooking = async () => {
    if (!startLocation || !endLocation || !selectedTier) {
      toast.error("Please complete all booking details");
      return;
    }

    try {
      const { data, error } = await supabase
        .from("bookings")
        .insert({
          start_location: { lat: startLocation.lat, lng: startLocation.lng, name: startLocation.name },
          end_location: { lat: endLocation.lat, lng: endLocation.lng, name: endLocation.name },
          // Stops are not saved in the database as per user request
          distance: Number(distance.toFixed(2)),
          tier_id: selectedTier.id,
          fare: Number(fare.toFixed(2)),
          status: "confirmed",
        })
        .select()
        .single();

      if (error) throw error;

      if (data) {
        setBookingId(data.id);
        setShowSuccess(true);
        toast.success("Booking confirmed!");
      }
    } catch (error) {
      console.error("Error creating booking:", error);
      toast.error("Failed to create booking. Please try again.");
    }
  };

  const handleBookNowClick = () => {
    bookingSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const resetBooking = () => {
    setStartLocation(null);
    setEndLocation(null);
    setStops([]);
    setSelectedTier(null);
    setDistance(0);
    setFare(0);
    setShowSuccess(false);
    setBookingId("");
  };

  return (
    <div className="min-h-screen">
      <Hero onBookNowClick={handleBookNowClick} />

      <section ref={bookingSectionRef} className="py-16 px-4 bg-background">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Book Your Ride</h2>
            <p className="text-xl text-muted-foreground">
              Select your locations, add stops, and choose your preferred tier
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div className="h-[500px] rounded-2xl overflow-hidden shadow-card">
                <Map
                  onLocationSelect={handleLocationSelect}
                  startLocation={startLocation}
                  endLocation={endLocation}
                  stops={stops}
                  onAddStop={addStop}
                  onRemoveStop={removeStop}
                />
              </div>

              <div>
                <h3 className="text-2xl font-bold mb-6">Choose Your Tier</h3>
                <TierSelector
                  tiers={tiers}
                  selectedTier={selectedTier}
                  onSelectTier={setSelectedTier}
                />
              </div>
            </div>

            <div className="lg:col-span-1">
              <BookingPanel
                startLocation={startLocation}
                endLocation={endLocation}
                stops={stops}
                selectedTier={selectedTier}
                distance={distance}
                fare={fare}
                onBook={handleBooking}
              />
            </div>
          </div>
        </div>
      </section>

      <BookingSuccess
        isOpen={showSuccess}
        onClose={resetBooking}
        bookingId={bookingId}
      />
    </div>
  );
};

export default Index;
