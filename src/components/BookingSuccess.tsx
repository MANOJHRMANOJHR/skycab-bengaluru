import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Clock, Plane } from "lucide-react";

interface BookingSuccessProps {
  isOpen: boolean;
  onClose: () => void;
  bookingId: number;
}

const BookingSuccess = ({ isOpen, onClose, bookingId }: BookingSuccessProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <div className="text-center py-6">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse" />
              <div className="relative flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary to-sky-cyan rounded-full">
                <CheckCircle2 className="w-10 h-10 text-white" />
              </div>
            </div>
          </div>

          <h2 className="text-3xl font-bold mb-2">Booking Confirmed!</h2>
          <p className="text-muted-foreground mb-8">
            Your flying taxi is on its way
          </p>

          <div className="space-y-4 mb-8">
            <div className="flex items-center gap-3 p-4 bg-secondary rounded-lg">
              <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-full">
                <Plane className="w-5 h-5 text-primary" />
              </div>
              <div className="text-left flex-1">
                <div className="text-sm text-muted-foreground">Booking ID</div>
                <div className="font-mono font-semibold">#{bookingId}</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-secondary rounded-lg">
              <div className="flex items-center justify-center w-10 h-10 bg-accent/10 rounded-full">
                <Clock className="w-5 h-5 text-accent" />
              </div>
              <div className="text-left flex-1">
                <div className="text-sm text-muted-foreground">Estimated Pickup</div>
                <div className="font-semibold">5-7 minutes</div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-primary/5 via-sky-cyan/5 to-accent/5 rounded-lg p-4 mb-6 border border-primary/10">
            <p className="text-sm text-muted-foreground">
              Your taxi will arrive at the pickup location shortly. 
              Please be ready at the designated spot.
            </p>
          </div>

          <Button
            onClick={onClose}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            size="lg"
          >
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookingSuccess;
