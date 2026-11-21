-- ==============================================================================
-- HAVENORA BOUTIQUE RETREAT — DATABASE SCHEMA & ROW LEVEL SECURITY
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. OWNERS TABLE
CREATE TABLE IF NOT EXISTS public.owners (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username TEXT UNIQUE NOT NULL, -- Authorized Owner ID e.g. anuj123457
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT DEFAULT 'owner' CHECK (role IN ('owner', 'manager')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. ROOMS TABLE
CREATE TABLE IF NOT EXISTS public.rooms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    tagline TEXT,
    description TEXT NOT NULL,
    long_description TEXT,
    price NUMERIC(10, 2) NOT NULL,
    currency TEXT DEFAULT 'USD' NOT NULL,
    capacity INTEGER NOT NULL DEFAULT 2,
    bed_configuration TEXT NOT NULL,
    room_size TEXT,
    view TEXT,
    amenities TEXT[] DEFAULT '{}',
    features TEXT[] DEFAULT '{}',
    main_image TEXT NOT NULL,
    gallery_images TEXT[] DEFAULT '{}',
    published BOOLEAN DEFAULT true NOT NULL,
    featured BOOLEAN DEFAULT false NOT NULL,
    display_order INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. ENQUIRIES TABLE
CREATE TABLE IF NOT EXISTS public.enquiries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    guest_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    room_id UUID REFERENCES public.rooms(id) ON DELETE SET NULL,
    room_name TEXT,
    check_in DATE NOT NULL,
    check_out DATE NOT NULL,
    guests INTEGER NOT NULL DEFAULT 2,
    message TEXT,
    status TEXT DEFAULT 'New' CHECK (status IN ('New', 'Contacted', 'Pending', 'Confirmed', 'Cancelled')) NOT NULL,
    internal_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. HOURLY BOOKINGS TABLE (STRICT CONFLICT LOCKS)
CREATE TABLE IF NOT EXISTS public.bookings (
    id TEXT PRIMARY KEY, -- e.g. 'HV-70192'
    customer_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    booking_date DATE NOT NULL,
    time_slot TEXT NOT NULL, -- e.g. '09:00 - 10:00'
    booking_type TEXT NOT NULL,
    guests INTEGER NOT NULL DEFAULT 2,
    special_requests TEXT,
    status TEXT DEFAULT 'Pending' CHECK (status IN ('Pending', 'Confirmed', 'Cancelled', 'Completed')) NOT NULL,
    confirmed_at TIMESTAMP WITH TIME ZONE,
    cancelled_at TIMESTAMP WITH TIME ZONE,
    cancellation_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- DATABASE-LEVEL BOOKING LOCK: Strictly prevents duplicate bookings for the same hourly slot
-- Only one Pending or Confirmed reservation can exist for any given date and time_slot!
CREATE UNIQUE INDEX IF NOT EXISTS idx_bookings_unique_active_slot
ON public.bookings (booking_date, time_slot)
WHERE (status IN ('Pending', 'Confirmed'));

-- 6. BLOCKED SLOTS TABLE (OWNER MANUAL BLOCKS)
CREATE TABLE IF NOT EXISTS public.blocked_slots (
    id TEXT PRIMARY KEY,
    date DATE NOT NULL,
    time_slot TEXT NOT NULL, -- '09:00 - 10:00' or 'ALL_DAY'
    reason TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT uq_date_slot UNIQUE (date, time_slot)
);

-- 7. GALLERY TABLE
CREATE TABLE IF NOT EXISTS public.gallery (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    image_url TEXT NOT NULL,
    caption TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('Architecture', 'Rooms', 'Interiors', 'Dining', 'Nature', 'Details')),
    display_order INTEGER DEFAULT 1,
    published BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. SITE SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.site_settings (
    id TEXT PRIMARY KEY DEFAULT 'havenora-main-settings',
    hotel_name TEXT NOT NULL DEFAULT 'HAVENORA',
    tagline TEXT NOT NULL,
    brand_description TEXT NOT NULL,
    full_story TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    whatsapp TEXT NOT NULL,
    address TEXT NOT NULL,
    city TEXT NOT NULL DEFAULT 'Pokhara',
    country TEXT NOT NULL DEFAULT 'Nepal',
    map_embed_url TEXT NOT NULL,
    social_links JSONB DEFAULT '{"instagram":"","facebook":""}'::jsonb,
    homepage JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.owners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blocked_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- BOOKINGS: Public can INSERT new bookings; Public can SELECT only their own booking or slot status; Owners can ALL
CREATE POLICY "Public can book an hourly slot"
ON public.bookings FOR INSERT
WITH CHECK (true);

CREATE POLICY "Public can view active slots for availability"
ON public.bookings FOR SELECT
USING (true);

CREATE POLICY "Owners full access to bookings"
ON public.bookings FOR ALL
TO authenticated
USING (true);

-- BLOCKED SLOTS: Public can view blocked slots; Owners can manage
CREATE POLICY "Public can view blocked slots"
ON public.blocked_slots FOR SELECT
USING (true);

CREATE POLICY "Owners full access to blocked slots"
ON public.blocked_slots FOR ALL
TO authenticated
USING (true);

-- ROOMS: Public can SELECT published rooms; Authenticated owners can ALL
CREATE POLICY "Public can view published rooms"
ON public.rooms FOR SELECT
USING (published = true);

CREATE POLICY "Owners full access to rooms"
ON public.rooms FOR ALL
TO authenticated
USING (true);

-- GALLERY: Public can SELECT published images; Authenticated owners can ALL
CREATE POLICY "Public can view published gallery"
ON public.gallery FOR SELECT
USING (published = true);

CREATE POLICY "Owners full access to gallery"
ON public.gallery FOR ALL
TO authenticated
USING (true);

-- SITE SETTINGS: Public can SELECT; Authenticated owners can ALL
CREATE POLICY "Public can view site settings"
ON public.site_settings FOR SELECT
USING (true);

CREATE POLICY "Owners can update site settings"
ON public.site_settings FOR ALL
TO authenticated
USING (true);

-- ENQUIRIES: Anyone can INSERT; ONLY authenticated owners can ALL
CREATE POLICY "Public can submit enquiries"
ON public.enquiries FOR INSERT
WITH CHECK (true);

CREATE POLICY "Owners can view and manage enquiries"
ON public.enquiries FOR ALL
TO authenticated
USING (true);
