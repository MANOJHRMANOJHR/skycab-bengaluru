import { Card } from "@/components/ui/card";
import { Check, Zap, Crown, Circle } from "lucide-react";

interface TaxiTier {
  id: string;
  name: string;
  rate_per_km: number;
  description: string;
  max_passengers: number;
}

interface TierSelectorProps {
  tiers: TaxiTier[];
  selectedTier: TaxiTier | null;
  onSelectTier: (tier: TaxiTier) => void;
}

const TierSelector = ({ tiers, selectedTier, onSelectTier }: TierSelectorProps) => {
  const getTierIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case "standard":
        return Circle;
      case "premium":
        return Zap;
      case "executive":
        return Crown;
      default:
        return Circle;
    }
  };

  const getTierColor = (name: string) => {
    switch (name.toLowerCase()) {
      case "standard":
        return "from-primary/20 to-primary/10";
      case "premium":
        return "from-sky-cyan/20 to-sky-cyan/10";
      case "executive":
        return "from-accent/20 to-accent/10";
      default:
        return "from-primary/20 to-primary/10";
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {tiers.map((tier) => {
        const Icon = getTierIcon(tier.name);
        const isSelected = selectedTier?.id === tier.id;
        
        return (
          <Card
            key={tier.id}
            onClick={() => onSelectTier(tier)}
            className={`relative p-6 cursor-pointer transition-bounce hover:scale-105 ${
              isSelected
                ? "ring-2 ring-primary shadow-glow"
                : "hover:shadow-card"
            }`}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${getTierColor(tier.name)} rounded-lg opacity-50`} />
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className={`p-2 rounded-full ${
                    tier.name.toLowerCase() === "standard" ? "bg-primary/20" :
                    tier.name.toLowerCase() === "premium" ? "bg-sky-cyan/20" :
                    "bg-accent/20"
                  }`}>
                    <Icon className={`w-5 h-5 ${
                      tier.name.toLowerCase() === "standard" ? "text-primary" :
                      tier.name.toLowerCase() === "premium" ? "text-sky-cyan" :
                      "text-accent"
                    }`} />
                  </div>
                  <h3 className="text-xl font-bold">{tier.name}</h3>
                </div>
                {isSelected && (
                  <div className="flex items-center justify-center w-6 h-6 bg-primary rounded-full">
                    <Check className="w-4 h-4 text-primary-foreground" />
                  </div>
                )}
              </div>
              
              <p className="text-muted-foreground text-sm mb-4">
                {tier.description}
              </p>
              
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold">₹{tier.rate_per_km}</span>
                <span className="text-muted-foreground">/km</span>
              </div>
              
              <div className="mt-4 pt-4 border-t border-border">
                <div className="text-sm text-muted-foreground">
                  Up to {tier.max_passengers} passengers
                </div>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default TierSelector;
