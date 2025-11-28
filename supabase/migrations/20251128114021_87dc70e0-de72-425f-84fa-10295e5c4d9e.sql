-- Drop existing tables to recreate with new schema
DROP TABLE IF EXISTS public.bookings;
DROP TABLE IF EXISTS public.taxi_tiers;

-- Create taxi_tiers table with INT id
CREATE TABLE public.taxi_tiers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  cost_per_km DECIMAL(10, 2) NOT NULL,
  description VARCHAR(255)
);

-- Create bookings table with separate lat/lng columns
CREATE TABLE public.bookings (
  id SERIAL PRIMARY KEY,
  start_lat DECIMAL(10, 6) NOT NULL,
  start_lng DECIMAL(10, 6) NOT NULL,
  dest_lat DECIMAL(10, 6) NOT NULL,
  dest_lng DECIMAL(10, 6) NOT NULL,
  distance_km DECIMAL(10, 2) NOT NULL,
  tier_id INT NOT NULL REFERENCES public.taxi_tiers(id),
  fare_amount DECIMAL(10, 2) NOT NULL,
  taxi_identifier VARCHAR(20) NOT NULL,
  booking_timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status VARCHAR(20) NOT NULL DEFAULT 'CONFIRMED'
);

-- Enable Row Level Security
ALTER TABLE public.taxi_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Public read access for taxi_tiers
CREATE POLICY "Anyone can view taxi tiers"
ON public.taxi_tiers
FOR SELECT
USING (true);

-- Public insert and read access for bookings (MVP - no auth)
CREATE POLICY "Anyone can create bookings"
ON public.bookings
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can view bookings"
ON public.bookings
FOR SELECT
USING (true);

-- Insert initial tier data
INSERT INTO public.taxi_tiers (name, cost_per_km, description) VALUES
  ('Standard', 15.00, 'Affordable and reliable flying taxi'),
  ('Premium', 25.00, 'Faster routes with priority boarding'),
  ('Executive', 45.00, 'Luxury experience with maximum speed');