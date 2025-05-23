-- Reference/Lookup Tables

-- Application Methods
CREATE TABLE "public"."eo_application_methods" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "name" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "eo_application_methods_pkey" PRIMARY KEY ("id")
);

-- Aroma Notes
CREATE TABLE "public"."eo_aroma_notes" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "note_name" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "eo_aroma_notes_pkey" PRIMARY KEY ("id")
);

-- Aroma Scents
CREATE TABLE "public"."eo_aroma_scents" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "scent_name" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "eo_aroma_scents_pkey" PRIMARY KEY ("id")
);

-- Chakras
CREATE TABLE "public"."eo_chakras" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "chakra_name" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "eo_chakras_pkey" PRIMARY KEY ("id")
);

-- Child Safety Age Ranges
CREATE TABLE "public"."eo_child_safety_age_ranges" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "range_description" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "eo_child_safety_age_ranges_pkey" PRIMARY KEY ("id")
);

-- Countries
CREATE TABLE "public"."eo_countries" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "country_name" "text" NOT NULL,
    "country_code" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "eo_countries_pkey" PRIMARY KEY ("id")
);

-- Dilution Recommendations
CREATE TABLE "public"."eo_dilution_recommendations" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "name" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "eo_dilution_recommendations_pkey" PRIMARY KEY ("id")
);

-- Energetic Emotional Properties
CREATE TABLE "public"."eo_energetic_emotional_properties" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "property_name" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "eo_energetic_emotional_properties_pkey" PRIMARY KEY ("id")
);

-- Extraction Methods
CREATE TABLE "public"."eo_extraction_methods" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "method_name" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "eo_extraction_methods_pkey" PRIMARY KEY ("id")
);

-- Health Benefits
CREATE TABLE "public"."eo_health_benefits" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "benefit_name" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "eo_health_benefits_pkey" PRIMARY KEY ("id")
);

-- Internal Use Statuses
CREATE TABLE "public"."eo_internal_use_statuses" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "name" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "eo_internal_use_statuses_pkey" PRIMARY KEY ("id")
);

-- Pets
CREATE TABLE "public"."eo_pets" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "animal_name" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "eo_pets_pkey" PRIMARY KEY ("id")
);

-- Phototoxicity Statuses
CREATE TABLE "public"."eo_phototoxicity_statuses" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "name" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "eo_phototoxicity_statuses_pkey" PRIMARY KEY ("id")
);

-- Plant Parts
CREATE TABLE "public"."eo_plant_parts" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "part_name" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "eo_plant_parts_pkey" PRIMARY KEY ("id")
);

-- Pregnancy Nursing Statuses
CREATE TABLE "public"."eo_pregnancy_nursing_statuses" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "status_description" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "eo_pregnancy_nursing_statuses_pkey" PRIMARY KEY ("id")
);

-- Therapeutic Properties
CREATE TABLE "public"."eo_therapeutic_properties" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "property_name" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "property_name_portuguese" "text",
    "description_portuguese" "text",
    "description" "text",
    CONSTRAINT "eo_therapeutic_properties_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "eo_therapeutic_properties_property_name_key" UNIQUE ("property_name")
);

-- Set table ownership
ALTER TABLE "public"."eo_application_methods" OWNER TO "postgres";
ALTER TABLE "public"."eo_aroma_notes" OWNER TO "postgres";
ALTER TABLE "public"."eo_aroma_scents" OWNER TO "postgres";
ALTER TABLE "public"."eo_chakras" OWNER TO "postgres";
ALTER TABLE "public"."eo_child_safety_age_ranges" OWNER TO "postgres";
ALTER TABLE "public"."eo_countries" OWNER TO "postgres";
ALTER TABLE "public"."eo_dilution_recommendations" OWNER TO "postgres";
ALTER TABLE "public"."eo_energetic_emotional_properties" OWNER TO "postgres";
ALTER TABLE "public"."eo_extraction_methods" OWNER TO "postgres";
ALTER TABLE "public"."eo_health_benefits" OWNER TO "postgres";
ALTER TABLE "public"."eo_internal_use_statuses" OWNER TO "postgres";
ALTER TABLE "public"."eo_pets" OWNER TO "postgres";
ALTER TABLE "public"."eo_phototoxicity_statuses" OWNER TO "postgres";
ALTER TABLE "public"."eo_plant_parts" OWNER TO "postgres";
ALTER TABLE "public"."eo_pregnancy_nursing_statuses" OWNER TO "postgres";
ALTER TABLE "public"."eo_therapeutic_properties" OWNER TO "postgres";
