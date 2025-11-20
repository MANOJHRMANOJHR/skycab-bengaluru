import { Button } from "@/components/ui/button";
import { Plane } from "lucide-react";

interface HeroProps {
  onBookNowClick: () => void;
}

const Hero = ({ onBookNowClick }: HeroProps) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 gradient-hero opacity-90" />
      
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-sky-cyan rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary rounded-full blur-3xl animate-pulse delay-700" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="inline-flex items-center justify-center p-2 mb-6 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
          <Plane className="w-5 h-5 text-white mr-2 animate-pulse" />
          <span className="text-sm text-white font-medium">
            Launching in Bengaluru
          </span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
          Skip the Traffic,
          <br />
          <span className="bg-gradient-to-r from-white via-sky-cyan to-white bg-clip-text text-transparent">
            Take to the Skies
          </span>
        </h1>

        <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-2xl mx-auto leading-relaxed">
          Autonomous flying taxis that arrive at your doorstep. Travel across Bengaluru 
          in minutes, not hours.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            size="lg"
            onClick={onBookNowClick}
            className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-elevated text-lg px-8 py-6 rounded-full transition-bounce hover:scale-105"
          >
            Book Your Flight Now
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="bg-white/10 hover:bg-white/20 text-white border-white/30 text-lg px-8 py-6 rounded-full backdrop-blur-sm transition-smooth"
          >
            How It Works
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-8 mt-16 max-w-3xl mx-auto">
          <div className="text-center">
            <div className="text-4xl font-bold text-white mb-2">5-10x</div>
            <div className="text-sm text-white/80">Faster Travel</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-white mb-2">100%</div>
            <div className="text-sm text-white/80">Autonomous</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-white mb-2">24/7</div>
            <div className="text-sm text-white/80">Available</div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center p-2">
          <div className="w-1 h-3 bg-white/50 rounded-full" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
