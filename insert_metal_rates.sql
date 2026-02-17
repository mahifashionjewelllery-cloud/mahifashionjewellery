-- Insert default metal rates for gold and silver
-- Run this in Supabase SQL Editor

-- Delete existing rates (if any)
DELETE FROM public.metal_rates;

-- Insert gold rate
INSERT INTO public.metal_rates (metal_type, rate_per_gram)
VALUES ('gold', 7250.00);

-- Insert silver rate
INSERT INTO public.metal_rates (metal_type, rate_per_gram)
VALUES ('silver', 88.00);
