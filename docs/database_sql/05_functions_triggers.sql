-- Functions and Triggers

-- Function to update updated_at timestamps
CREATE OR REPLACE FUNCTION "public"."update_updated_at_column"()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;   
END;
$$ LANGUAGE plpgsql;

-- Function to automatically set names_concatenated in essential_oils
CREATE OR REPLACE FUNCTION "public"."set_essential_oil_names_concatenated"()
RETURNS TRIGGER AS $$
BEGIN
    NEW.names_concatenated = 
        COALESCE(NEW.name_english, '') || ' | ' || 
        COALESCE(NEW.name_scientific, '') || ' | ' || 
        COALESCE(NEW.name_portuguese, '');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to validate percentage ranges in essential_oil_chemical_compounds
CREATE OR REPLACE FUNCTION "public"."validate_chemical_compound_percentages"()
RETURNS TRIGGER AS $$
BEGIN
    -- Ensure min_percentage <= max_percentage if both are set
    IF NEW.min_percentage IS NOT NULL AND NEW.max_percentage IS NOT NULL AND 
       NEW.min_percentage > NEW.max_percentage THEN
        RAISE EXCEPTION 'min_percentage must be less than or equal to max_percentage';
    END IF;
    
    -- Ensure typical_percentage is within min and max if set
    IF NEW.typical_percentage IS NOT NULL THEN
        IF (NEW.min_percentage IS NOT NULL AND NEW.typical_percentage < NEW.min_percentage) OR
           (NEW.max_percentage IS NOT NULL AND NEW.typical_percentage > NEW.max_percentage) THEN
            RAISE EXCEPTION 'typical_percentage must be between min_percentage and max_percentage';
        END IF;
    END IF;
    
    -- Sync with percentage_range if needed
    IF NEW.percentage_range IS NOT NULL THEN
        IF NEW.min_percentage IS NULL THEN
            NEW.min_percentage := lower(NEW.percentage_range);
        END IF;
        IF NEW.max_percentage IS NULL THEN
            NEW.max_percentage := upper(NEW.percentage_range);
        END IF;
    ELSEIF NEW.min_percentage IS NOT NULL OR NEW.max_percentage IS NOT NULL THEN
        NEW.percentage_range := numrange(
            COALESCE(NEW.min_percentage, 0)::numeric,
            COALESCE(NEW.max_percentage, 1)::numeric,
            '[]'
        );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply update_updated_at triggers to all tables with updated_at column
DO $$
DECLARE
    t record;
BEGIN
    FOR t IN 
        SELECT table_schema, table_name 
        FROM information_schema.columns 
        WHERE column_name = 'updated_at' 
        AND table_schema = 'public'
    LOOP
        EXECUTE format('DROP TRIGGER IF EXISTS update_%s_updated_at ON %I.%I', 
                      t.table_name, t.table_schema, t.table_name);
        EXECUTE format('CREATE TRIGGER update_%s_updated_at
                      BEFORE UPDATE ON %I.%I
                      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()',
                      t.table_name, t.table_schema, t.table_name);
    END LOOP;
END;
$$;

-- Trigger for names_concatenated in essential_oils
CREATE TRIGGER set_essential_oil_names_concatenated_trigger
BEFORE INSERT OR UPDATE OF name_english, name_scientific, name_portuguese
ON "public"."essential_oils"
FOR EACH ROW
EXECUTE FUNCTION set_essential_oil_names_concatenated();

-- Trigger for percentage validation in essential_oil_chemical_compounds
CREATE TRIGGER validate_chemical_compound_percentages_trigger
BEFORE INSERT OR UPDATE ON "public"."essential_oil_chemical_compounds"
FOR EACH ROW
EXECUTE FUNCTION validate_chemical_compound_percentages();
