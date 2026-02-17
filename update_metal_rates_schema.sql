-- 1. Add purity column
ALTER TABLE public.metal_rates 
ADD COLUMN IF NOT EXISTS purity text;

-- 2. Remove the existing unique constraint on metal_type
-- We need to find the name of the constraint first, usually it's metal_rates_metal_type_key
ALTER TABLE public.metal_rates 
DROP CONSTRAINT IF EXISTS metal_rates_metal_type_key;

-- 3. Clear existing invalid data to avoid constraint violations when adding new unique constraint
TRUNCATE TABLE public.metal_rates;

-- 4. Add new unique constraint on (metal_type, purity)
ALTER TABLE public.metal_rates 
ADD CONSTRAINT metal_rates_type_purity_key UNIQUE (metal_type, purity);

-- 5. Insert the standard rates
INSERT INTO public.metal_rates (metal_type, purity, rate_per_gram) VALUES
('gold', '24K', 7200),
('gold', '22K', 6800),
('gold', '18K', 5600),
('silver', '92.5', 85),
('silver', 'pure', 90);
