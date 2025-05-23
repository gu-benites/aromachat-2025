-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE "public"."chemical_compounds" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."essential_oils" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."profiles" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."usage_instructions" ENABLE ROW LEVEL SECURITY;

-- Reference tables (read-only for authenticated users)
ALTER TABLE "public"."eo_application_methods" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."eo_aroma_notes" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."eo_aroma_scents" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."eo_chakras" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."eo_child_safety_age_ranges" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."eo_countries" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."eo_dilution_recommendations" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."eo_energetic_emotional_properties" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."eo_extraction_methods" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."eo_health_benefits" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."eo_internal_use_statuses" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."eo_pets" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."eo_phototoxicity_statuses" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."eo_plant_parts" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."eo_pregnancy_nursing_statuses" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."eo_therapeutic_properties" ENABLE ROW LEVEL SECURITY;

-- Junction tables
ALTER TABLE "public"."essential_oil_application_methods" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."essential_oil_aroma_notes" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."essential_oil_aroma_scents" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."essential_oil_chakra_association" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."essential_oil_chemical_compounds" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."essential_oil_child_safety" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."essential_oil_energetic_emotional_properties" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."essential_oil_extraction_countries" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."essential_oil_extraction_methods" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."essential_oil_health_benefits" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."essential_oil_pet_safety" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."essential_oil_plant_parts" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."essential_oil_pregnancy_nursing_safety" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."essential_oil_therapeutic_properties" ENABLE ROW LEVEL SECURITY;

-- Policies for chemical_compounds
CREATE POLICY "Enable read access for all users" ON "public"."chemical_compounds"
    FOR SELECT
    TO public
    USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON "public"."chemical_compounds"
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users only" ON "public"."chemical_compounds"
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Policies for essential_oils
CREATE POLICY "Enable read access for all users" ON "public"."essential_oils"
    FOR SELECT
    TO public
    USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON "public"."essential_oils"
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users only" ON "public"."essential_oils"
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Policies for profiles
CREATE POLICY "Users can view their own profile only" ON "public"."profiles"
    FOR SELECT
    TO authenticated
    USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON "public"."profiles"
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON "public"."profiles"
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Policies for usage_instructions
CREATE POLICY "Enable read access for all users" ON "public"."usage_instructions"
    FOR SELECT
    TO public
    USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON "public"."usage_instructions"
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users only" ON "public"."usage_instructions"
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Policies for reference tables (read-only for authenticated users)
CREATE POLICY "Enable read access for all users" ON "public"."eo_application_methods"
    FOR SELECT
    TO public
    USING (true);

CREATE POLICY "Enable read access for all users" ON "public"."eo_aroma_notes"
    FOR SELECT
    TO public
    USING (true);

CREATE POLICY "Enable read access for all users" ON "public"."eo_aroma_scents"
    FOR SELECT
    TO public
    USING (true);

-- Continue with other reference tables...

-- Policies for junction tables
CREATE POLICY "Enable read access for all users" ON "public"."essential_oil_chemical_compounds"
    FOR SELECT
    TO public
    USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON "public"."essential_oil_chemical_compounds"
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users only" ON "public"."essential_oil_chemical_compounds"
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Similar policies for other junction tables...

-- Policies for views
CREATE POLICY "Enable read access for all users" ON "public"."essential_oil_details"
    FOR SELECT
    TO public
    USING (true);

CREATE POLICY "Enable read access for all users" ON "public"."essential_oil_search"
    FOR SELECT
    TO public
    USING (true);

-- Grant permissions to the anon and authenticated roles
GRANTANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON ROUTINES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;
