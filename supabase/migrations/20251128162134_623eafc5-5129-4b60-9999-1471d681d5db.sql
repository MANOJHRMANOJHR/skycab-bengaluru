-- Insert default taxi tiers
INSERT INTO public.taxi_tiers (name, cost_per_km, description) VALUES
  ('Standard', 25, 'Comfortable flying taxi for everyday travel'),
  ('Premium', 45, 'Enhanced comfort with premium amenities'),
  ('Executive', 75, 'Luxury experience with top-tier service')
ON CONFLICT DO NOTHING;