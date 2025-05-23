-- Junction/Many-to-Many Tables

-- Essential Oil Application Methods
CREATE TABLE IF NOT EXISTS "public"."essential_oil_application_methods" (
    "essential_oil_id" "uuid" NOT NULL,
    "application_method_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "essential_oil_application_methods_pkey" PRIMARY KEY ("essential_oil_id", "application_method_id"),
    CONSTRAINT "essential_oil_application_methods_application_method_id_fkey" 
        FOREIGN KEY ("application_method_id") REFERENCES "public"."eo_application_methods"("id") ON DELETE CASCADE,
    CONSTRAINT "essential_oil_application_methods_essential_oil_id_fkey" 
        FOREIGN KEY ("essential_oil_id") REFERENCES "public"."essential_oils"("id") ON DELETE CASCADE
);

-- Essential Oil Aroma Notes
CREATE TABLE IF NOT EXISTS "public"."essential_oil_aroma_notes" (
    "essential_oil_id" "uuid" NOT NULL,
    "aroma_note_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "essential_oil_aroma_notes_pkey" PRIMARY KEY ("essential_oil_id", "aroma_note_id"),
    CONSTRAINT "essential_oil_aroma_notes_aroma_note_id_fkey" 
        FOREIGN KEY ("aroma_note_id") REFERENCES "public"."eo_aroma_notes"("id") ON DELETE CASCADE,
    CONSTRAINT "essential_oil_aroma_notes_essential_oil_id_fkey" 
        FOREIGN KEY ("essential_oil_id") REFERENCES "public"."essential_oils"("id") ON DELETE CASCADE
);

-- Essential Oil Aroma Scents
CREATE TABLE IF NOT EXISTS "public"."essential_oil_aroma_scents" (
    "essential_oil_id" "uuid" NOT NULL,
    "scent_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "essential_oil_aroma_scents_pkey" PRIMARY KEY ("essential_oil_id", "scent_id"),
    CONSTRAINT "essential_oil_aroma_scents_scent_id_fkey" 
        FOREIGN KEY ("scent_id") REFERENCES "public"."eo_aroma_scents"("id") ON DELETE CASCADE,
    CONSTRAINT "essential_oil_aroma_scents_essential_oil_id_fkey" 
        FOREIGN KEY ("essential_oil_id") REFERENCES "public"."essential_oils"("id") ON DELETE CASCADE
);

-- Essential Oil Chakra Association
CREATE TABLE IF NOT EXISTS "public"."essential_oil_chakra_association" (
    "essential_oil_id" "uuid" NOT NULL,
    "chakra_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "essential_oil_chakra_association_pkey" PRIMARY KEY ("essential_oil_id", "chakra_id"),
    CONSTRAINT "essential_oil_chakra_association_chakra_id_fkey" 
        FOREIGN KEY ("chakra_id") REFERENCES "public"."eo_chakras"("id") ON DELETE CASCADE,
    CONSTRAINT "essential_oil_chakra_association_essential_oil_id_fkey" 
        FOREIGN KEY ("essential_oil_id") REFERENCES "public"."essential_oils"("id") ON DELETE CASCADE
);

-- Essential Oil Chemical Compounds
CREATE TABLE IF NOT EXISTS "public"."essential_oil_chemical_compounds" (
    "essential_oil_id" "uuid" NOT NULL,
    "chemical_compound_id" "uuid" NOT NULL,
    "min_percentage" numeric,
    "max_percentage" numeric,
    "typical_percentage" numeric,
    "notes" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "percentage_range" "numrange",
    "bubble_id" "text",
    CONSTRAINT "essential_oil_chemical_compounds_pkey" PRIMARY KEY ("essential_oil_id", "chemical_compound_id"),
    CONSTRAINT "chk_max_percentage_range" CHECK (( ("max_percentage" IS NULL) OR (("max_percentage" >= (0)::numeric) AND ("max_percentage" <= (1)::numeric)) )),
    CONSTRAINT "chk_min_max_percentage" CHECK (( ("min_percentage" IS NULL) OR ("max_percentage" IS NULL) OR ("min_percentage" <= "max_percentage") )),
    CONSTRAINT "chk_min_percentage_range" CHECK (( ("min_percentage" IS NULL) OR (("min_percentage" >= (0)::numeric) AND ("min_percentage" <= (1)::numeric)) )),
    CONSTRAINT "chk_percentage_range" CHECK (( ("percentage_range" IS NULL) OR (("lower"("percentage_range") >= (0)::numeric) AND ("upper"("percentage_range") <= (1)::numeric) AND ("lower"("percentage_range") <= "upper"("percentage_range")) ))),
    CONSTRAINT "chk_typical_percentage_range" CHECK (( ("typical_percentage" IS NULL) OR (("typical_percentage" >= (0)::numeric) AND ("typical_percentage" <= (1)::numeric)) )),
    CONSTRAINT "essential_oil_chemical_compounds_chemical_compound_id_fkey" 
        FOREIGN KEY ("chemical_compound_id") REFERENCES "public"."chemical_compounds"("id") ON DELETE CASCADE,
    CONSTRAINT "essential_oil_chemical_compounds_essential_oil_id_fkey" 
        FOREIGN KEY ("essential_oil_id") REFERENCES "public"."essential_oils"("id") ON DELETE CASCADE
);

-- Essential Oil Child Safety
CREATE TABLE IF NOT EXISTS "public"."essential_oil_child_safety" (
    "essential_oil_id" "uuid" NOT NULL,
    "age_range_id" "uuid" NOT NULL,
    "safety_notes" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "essential_oil_child_safety_pkey" PRIMARY KEY ("essential_oil_id", "age_range_id"),
    CONSTRAINT "essential_oil_child_safety_age_range_id_fkey" 
        FOREIGN KEY ("age_range_id") REFERENCES "public"."eo_child_safety_age_ranges"("id") ON DELETE CASCADE,
    CONSTRAINT "essential_oil_child_safety_essential_oil_id_fkey" 
        FOREIGN KEY ("essential_oil_id") REFERENCES "public"."essential_oils"("id") ON DELETE CASCADE
);

-- Essential Oil Energetic Emotional Properties
CREATE TABLE IF NOT EXISTS "public"."essential_oil_energetic_emotional_properties" (
    "essential_oil_id" "uuid" NOT NULL,
    "energetic_property_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "essential_oil_energetic_emotional_properties_pkey" PRIMARY KEY ("essential_oil_id", "energetic_property_id"),
    CONSTRAINT "essential_oil_energetic_emotional_properties_energetic_property_id_fkey" 
        FOREIGN KEY ("energetic_property_id") REFERENCES "public"."eo_energetic_emotional_properties"("id") ON DELETE CASCADE,
    CONSTRAINT "essential_oil_energetic_emotional_properties_essential_oil_id_fkey" 
        FOREIGN KEY ("essential_oil_id") REFERENCES "public"."essential_oils"("id") ON DELETE CASCADE
);

-- Essential Oil Extraction Countries
CREATE TABLE IF NOT EXISTS "public"."essential_oil_extraction_countries" (
    "essential_oil_id" "uuid" NOT NULL,
    "country_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "essential_oil_extraction_countries_pkey" PRIMARY KEY ("essential_oil_id", "country_id"),
    CONSTRAINT "essential_oil_extraction_countries_country_id_fkey" 
        FOREIGN KEY ("country_id") REFERENCES "public"."eo_countries"("id") ON DELETE CASCADE,
    CONSTRAINT "essential_oil_extraction_countries_essential_oil_id_fkey" 
        FOREIGN KEY ("essential_oil_id") REFERENCES "public"."essential_oils"("id") ON DELETE CASCADE
);

-- Essential Oil Extraction Methods
CREATE TABLE IF NOT EXISTS "public"."essential_oil_extraction_methods" (
    "essential_oil_id" "uuid" NOT NULL,
    "extraction_method_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "essential_oil_extraction_methods_pkey" PRIMARY KEY ("essential_oil_id", "extraction_method_id"),
    CONSTRAINT "essential_oil_extraction_methods_extraction_method_id_fkey" 
        FOREIGN KEY ("extraction_method_id") REFERENCES "public"."eo_extraction_methods"("id") ON DELETE CASCADE,
    CONSTRAINT "essential_oil_extraction_methods_essential_oil_id_fkey" 
        FOREIGN KEY ("essential_oil_id") REFERENCES "public"."essential_oils"("id") ON DELETE CASCADE
);

-- Essential Oil Health Benefits
CREATE TABLE IF NOT EXISTS "public"."essential_oil_health_benefits" (
    "essential_oil_id" "uuid" NOT NULL,
    "health_benefit_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "essential_oil_health_benefits_pkey" PRIMARY KEY ("essential_oil_id", "health_benefit_id"),
    CONSTRAINT "essential_oil_health_benefits_health_benefit_id_fkey" 
        FOREIGN KEY ("health_benefit_id") REFERENCES "public"."eo_health_benefits"("id") ON DELETE CASCADE,
    CONSTRAINT "essential_oil_health_benefits_essential_oil_id_fkey" 
        FOREIGN KEY ("essential_oil_id") REFERENCES "public"."essential_oils"("id") ON DELETE CASCADE
);

-- Essential Oil Pet Safety
CREATE TABLE IF NOT EXISTS "public"."essential_oil_pet_safety" (
    "essential_oil_id" "uuid" NOT NULL,
    "pet_id" "uuid" NOT NULL,
    "safety_notes" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "essential_oil_pet_safety_pkey" PRIMARY KEY ("essential_oil_id", "pet_id"),
    CONSTRAINT "essential_oil_pet_safety_essential_oil_id_fkey" 
        FOREIGN KEY ("essential_oil_id") REFERENCES "public"."essential_oils"("id") ON DELETE CASCADE,
    CONSTRAINT "essential_oil_pet_safety_pet_id_fkey" 
        FOREIGN KEY ("pet_id") REFERENCES "public"."eo_pets"("id") ON DELETE CASCADE
);

-- Essential Oil Plant Parts
CREATE TABLE IF NOT EXISTS "public"."essential_oil_plant_parts" (
    "essential_oil_id" "uuid" NOT NULL,
    "plant_part_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "essential_oil_plant_parts_pkey" PRIMARY KEY ("essential_oil_id", "plant_part_id"),
    CONSTRAINT "essential_oil_plant_parts_essential_oil_id_fkey" 
        FOREIGN KEY ("essential_oil_id") REFERENCES "public"."essential_oils"("id") ON DELETE CASCADE,
    CONSTRAINT "essential_oil_plant_parts_plant_part_id_fkey" 
        FOREIGN KEY ("plant_part_id") REFERENCES "public"."eo_plant_parts"("id") ON DELETE CASCADE
);

-- Essential Oil Pregnancy Nursing Safety
CREATE TABLE IF NOT EXISTS "public"."essential_oil_pregnancy_nursing_safety" (
    "essential_oil_id" "uuid" NOT NULL,
    "pregnancy_nursing_status_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "essential_oil_pregnancy_nursing_safety_pkey" PRIMARY KEY ("essential_oil_id", "pregnancy_nursing_status_id"),
    CONSTRAINT "essential_oil_pregnancy_nursing_safety_essential_oil_id_fkey" 
        FOREIGN KEY ("essential_oil_id") REFERENCES "public"."essential_oils"("id") ON DELETE CASCADE,
    CONSTRAINT "essential_oil_pregnancy_nursing_safety_pregnancy_nursing_status_id_fkey" 
        FOREIGN KEY ("pregnancy_nursing_status_id") REFERENCES "public"."eo_pregnancy_nursing_statuses"("id") ON DELETE CASCADE
);

-- Essential Oil Therapeutic Properties
CREATE TABLE IF NOT EXISTS "public"."essential_oil_therapeutic_properties" (
    "essential_oil_id" "uuid" NOT NULL,
    "property_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "essential_oil_therapeutic_properties_pkey" PRIMARY KEY ("essential_oil_id", "property_id"),
    CONSTRAINT "essential_oil_therapeutic_properties_essential_oil_id_fkey" 
        FOREIGN KEY ("essential_oil_id") REFERENCES "public"."essential_oils"("id") ON DELETE CASCADE,
    CONSTRAINT "essential_oil_therapeutic_properties_property_id_fkey" 
        FOREIGN KEY ("property_id") REFERENCES "public"."eo_therapeutic_properties"("id") ON DELETE CASCADE
);

-- Set table ownership
ALTER TABLE "public"."essential_oil_application_methods" OWNER TO "postgres";
ALTER TABLE "public"."essential_oil_aroma_notes" OWNER TO "postgres";
ALTER TABLE "public"."essential_oil_aroma_scents" OWNER TO "postgres";
ALTER TABLE "public"."essential_oil_chakra_association" OWNER TO "postgres";
ALTER TABLE "public"."essential_oil_chemical_compounds" OWNER TO "postgres";
ALTER TABLE "public"."essential_oil_child_safety" OWNER TO "postgres";
ALTER TABLE "public"."essential_oil_energetic_emotional_properties" OWNER TO "postgres";
ALTER TABLE "public"."essential_oil_extraction_countries" OWNER TO "postgres";
ALTER TABLE "public"."essential_oil_extraction_methods" OWNER TO "postgres";
ALTER TABLE "public"."essential_oil_health_benefits" OWNER TO "postgres";
ALTER TABLE "public"."essential_oil_pet_safety" OWNER TO "postgres";
ALTER TABLE "public"."essential_oil_plant_parts" OWNER TO "postgres";
ALTER TABLE "public"."essential_oil_pregnancy_nursing_safety" OWNER TO "postgres";
ALTER TABLE "public"."essential_oil_therapeutic_properties" OWNER TO "postgres";
