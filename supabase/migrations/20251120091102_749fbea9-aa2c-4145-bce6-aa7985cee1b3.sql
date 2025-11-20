-- Create taxi_tiers table to store the three tier options
CREATE TABLE public.taxi_tiers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  rate_per_km DECIMAL(10,2) NOT NULL,
  description TEXT,
  max_passengers INTEGER DEFAULT 4,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create bookings table to store user bookings
CREATE TABLE public.bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  start_location JSONB NOT NULL,
  end_location JSONB NOT NULL,
  distance DECIMAL(10,2) NOT NULL,
  tier_id UUID NOT NULL REFERENCES public.taxi_tiers(id),
  fare DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'confirmed',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.taxi_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Create policies for taxi_tiers (public read access)
CREATE POLICY "Anyone can view taxi tiers"
ON public.taxi_tiers
FOR SELECT
USING (true);

-- Create policies for bookings (public access for MVP - no auth)
CREATE POLICY "Anyone can create bookings"
ON public.bookings
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can view bookings"
ON public.bookings
FOR SELECT
USING (true);

-- Insert the three taxi tiers
INSERT INTO public.taxi_tiers (name, rate_per_km, description, max_passengers)
VALUES 
  ('Standard', 50.00, 'Affordable, efficient flying taxi', 4),
  ('Premium', 85.00, 'Faster with enhanced comfort', 4),
  ('Executive', 150.00, 'Fastest premium experience', 2);

-- Create index for better query performance
CREATE INDEX idx_bookings_created_at ON public.bookings(created_at DESC);
CREATE INDEX idx_bookings_tier_id ON public.bookings(tier_id);