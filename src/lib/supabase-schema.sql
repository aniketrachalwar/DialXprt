-- ====================================================================
-- DialXprt - Supabase PostgreSQL + PostGIS Schema & RPC Function
-- Hyper-Local Service Directory Engine for Hyderabad, India
-- ====================================================================

-- 1. Enable PostGIS Extension for fast spatial queries
CREATE EXTENSION IF NOT EXISTS postgis;

-- 2. Create Categories Table
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    icon_name TEXT NOT NULL DEFAULT 'Wrench',
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create Vendors Table with PostGIS Geography Point
CREATE TABLE IF NOT EXISTS public.vendors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    category_slug TEXT NOT NULL,
    owner_name TEXT NOT NULL,
    phone VARCHAR(20) NOT NULL,
    whatsapp VARCHAR(20) NOT NULL,
    address TEXT NOT NULL,
    neighborhood VARCHAR(100) NOT NULL DEFAULT 'Madhapur',
    city VARCHAR(50) NOT NULL DEFAULT 'Hyderabad',
    pincode VARCHAR(10) NOT NULL,
    lat DOUBLE PRECISION NOT NULL,
    lng DOUBLE PRECISION NOT NULL,
    -- PostGIS spatial point (SRID 4326 for WGS84 coordinates)
    location GEOGRAPHY(POINT, 4326) GENERATED ALWAYS AS (
        ST_SetSRID(ST_MakePoint(lng, lat), 4326)::geography
    ) STORED,
    image_url TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('approved', 'pending', 'rejected')),
    rating NUMERIC(2,1) DEFAULT 4.8,
    reviews_count INT DEFAULT 12,
    description TEXT,
    views_count INT DEFAULT 0,
    calls_count INT DEFAULT 0,
    whatsapp_clicks_count INT DEFAULT 0,
    volunteer_verified_by TEXT,
    volunteer_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create Spatial GIST Index for Ultra-Fast Radius Queries
CREATE INDEX IF NOT EXISTS idx_vendors_location ON public.vendors USING GIST (location);
CREATE INDEX IF NOT EXISTS idx_vendors_category ON public.vendors (category_slug);
CREATE INDEX IF NOT EXISTS idx_vendors_status ON public.vendors (status);

-- 5. Create Analytics & Leads Log Table
CREATE TABLE IF NOT EXISTS public.lead_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vendor_id UUID REFERENCES public.vendors(id) ON DELETE CASCADE,
    event_type VARCHAR(50) NOT NULL CHECK (event_type IN ('call', 'whatsapp', 'view')),
    user_neighborhood VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. RPC Function for High-Concurrency Geolocation Search (ST_Distance)
CREATE OR REPLACE FUNCTION public.get_nearby_vendors(
    user_lat DOUBLE PRECISION,
    user_lng DOUBLE PRECISION,
    radius_km DOUBLE PRECISION DEFAULT 25.0,
    cat_filter TEXT DEFAULT NULL,
    search_query TEXT DEFAULT NULL,
    only_approved BOOLEAN DEFAULT TRUE
)
RETURNS TABLE (
    id UUID,
    slug TEXT,
    name TEXT,
    category_slug TEXT,
    owner_name TEXT,
    phone VARCHAR(20),
    whatsapp VARCHAR(20),
    address TEXT,
    neighborhood VARCHAR(100),
    city VARCHAR(50),
    pincode VARCHAR(10),
    lat DOUBLE PRECISION,
    lng DOUBLE PRECISION,
    image_url TEXT,
    is_verified BOOLEAN,
    status VARCHAR(20),
    rating NUMERIC(2,1),
    reviews_count INT,
    description TEXT,
    views_count INT,
    calls_count INT,
    whatsapp_clicks_count INT,
    created_at TIMESTAMPTZ,
    distance_km DOUBLE PRECISION
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        v.id,
        v.slug,
        v.name,
        v.category_slug,
        v.owner_name,
        v.phone,
        v.whatsapp,
        v.address,
        v.neighborhood,
        v.city,
        v.pincode,
        v.lat,
        v.lng,
        v.image_url,
        v.is_verified,
        v.status,
        v.rating,
        v.reviews_count,
        v.description,
        v.views_count,
        v.calls_count,
        v.whatsapp_clicks_count,
        v.created_at,
        ROUND(
            (ST_Distance(
                v.location, 
                ST_SetSRID(ST_MakePoint(user_lng, user_lat), 4326)::geography
            ) / 1000.0)::numeric, 2
        )::DOUBLE PRECISION AS distance_km
    FROM public.vendors v
    WHERE 
        (only_approved = FALSE OR v.status = 'approved')
        AND (
            radius_km IS NULL OR 
            ST_DWithin(
                v.location, 
                ST_SetSRID(ST_MakePoint(user_lng, user_lat), 4326)::geography, 
                radius_km * 1000
            )
        )
        AND (
            cat_filter IS NULL OR cat_filter = '' OR LOWER(cat_filter) = 'all' OR 
            v.category_slug = LOWER(cat_filter)
        )
        AND (
            search_query IS NULL OR search_query = '' OR
            v.name ILIKE '%' || search_query || '%' OR
            v.category_slug ILIKE '%' || search_query || '%' OR
            v.neighborhood ILIKE '%' || search_query || '%' OR
            v.description ILIKE '%' || search_query || '%'
        )
    ORDER BY distance_km ASC;
END;
$$;

-- 7. Enable Row Level Security (RLS)
ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY;

-- Public can read approved vendors
CREATE POLICY "Public can view approved vendors"
    ON public.vendors FOR SELECT
    USING (status = 'approved');

-- Anyone can submit a vendor profile for offline volunteer verification
CREATE POLICY "Public can insert pending vendors"
    ON public.vendors FOR INSERT
    WITH CHECK (status = 'pending');

-- Seed Initial Hyderabad Categories
INSERT INTO public.categories (name, slug, icon_name, description) VALUES
('Electrician', 'electrician', 'Zap', 'Fan wiring, switchboard repair, MCB fitting & home wiring'),
('Plumber', 'plumber', 'Wrench', 'Tap leaks, pipe fitting, water tank cleaning & bathroom repairs'),
('Kirana / Grocery', 'kirana', 'ShoppingBag', 'Daily groceries, rice, oil, pulses & home delivery Kirana stores'),
('AC Repair & Service', 'ac-repair', 'Wind', 'AC gas filling, filter cleaning, installation & copper pipe fitting'),
('Mechanic & Garage', 'mechanic', 'Car', 'Two-wheeler & four-wheeler repair, puncture shop & battery service'),
('Veg Cook / Catering', 'veg-cook', 'Utensils', 'Experienced pure veg cooks for daily homes, weddings & events'),
('Non-Veg Cook', 'non-veg-cook', 'Flame', 'Authentic Hyderabadi biryani experts & non-veg event caterers'),
('Carpenter', 'carpenter', 'Hammer', 'Furniture repair, modular kitchen, door locks & woodwork'),
('Painter & Polish', 'painter', 'Paintbrush', 'Home wall painting, waterproof coating & wood polish'),
('Home Tutor', 'home-tutor', 'BookOpen', 'Class 1-10 & Intermediate tutors for math, science & English'),
('Barber & Salon', 'barber', 'Scissors', 'Men & women home salon service, haircut & grooming'),
('Taxi / Auto Driver', 'taxi-auto', 'Navigation', 'Local auto auto-rickshaw, cab driver & outstation taxi services')
ON CONFLICT (slug) DO NOTHING;
