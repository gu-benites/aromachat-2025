-- Core Tables

-- Chemical Compounds
CREATE TABLE IF NOT EXISTS "public"."chemical_compounds" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "name" "text" NOT NULL,
    "description" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "bubble_uid" "text",
    "pubchem_compound_id" "text",
    "carbon_structure" "text",
    CONSTRAINT "chemical_compounds_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "chemical_compounds_name_key" UNIQUE ("name")
);

-- Essential Oils
CREATE TABLE IF NOT EXISTS "public"."essential_oils" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "name_english" "text" NOT NULL,
    "name_scientific" "text",
    "name_portuguese" "text",
    "general_description" "text",
    "embedding" "vector"(1536),
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "bubble_uid" "text",
    "names_concatenated" "text",
    "image_url" "text",
    "internal_use_status_id" "uuid",
    "dilution_recommendation_id" "uuid",
    "phototoxicity_status_id" "uuid",
    CONSTRAINT "essential_oils_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "essential_oils_dilution_recommendation_id_fkey" FOREIGN KEY ("dilution_recommendation_id") REFERENCES "public"."eo_dilution_recommendations"("id") ON DELETE SET NULL,
    CONSTRAINT "essential_oils_internal_use_status_id_fkey" FOREIGN KEY ("internal_use_status_id") REFERENCES "public"."eo_internal_use_statuses"("id") ON DELETE SET NULL,
    CONSTRAINT "essential_oils_phototoxicity_status_id_fkey" FOREIGN KEY ("phototoxicity_status_id") REFERENCES "public"."eo_phototoxicity_statuses"("id") ON DELETE SET NULL
);

-- Profiles
CREATE TABLE IF NOT EXISTS "public"."profiles" (
    "id" "uuid" NOT NULL,
    "first_name" "text",
    "last_name" "text",
    "gender" "text",
    "age_category" "text",
    "specific_age" integer,
    "language" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "avatar_url" "text",
    "role" "text",
    "stripe_customer_id" "text",
    "subscription_status" "text",
    "subscription_tier" "text",
    "subscription_period" "text",
    "subscription_start_date" timestamp with time zone,
    "subscription_end_date" timestamp with time zone,
    CONSTRAINT "profiles_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "profiles_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE CASCADE
);

-- Usage Instructions
CREATE TABLE IF NOT EXISTS "public"."usage_instructions" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "essential_oil_id" "uuid" NOT NULL,
    "health_concern_id" "uuid" NOT NULL,
    "application_method_id" "uuid" NOT NULL,
    "instruction_text" "text" NOT NULL,
    "dilution_details" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "usage_instructions_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "usage_instructions_essential_oil_id_fkey" FOREIGN KEY ("essential_oil_id") REFERENCES "public"."essential_oils"("id") ON DELETE CASCADE,
    CONSTRAINT "usage_instructions_health_concern_id_fkey" FOREIGN KEY ("health_concern_id") REFERENCES "public"."eo_health_concerns"("id") ON DELETE CASCADE,
    CONSTRAINT "usage_instructions_application_method_id_fkey" FOREIGN KEY ("application_method_id") REFERENCES "public"."eo_application_methods"("id") ON DELETE CASCADE
);

-- Set table ownership
ALTER TABLE "public"."chemical_compounds" OWNER TO "postgres";
ALTER TABLE "public"."essential_oils" OWNER TO "postgres";
ALTER TABLE "public"."profiles" OWNER TO "postgres";
ALTER TABLE "public"."usage_instructions" OWNER TO "postgres";

-- Add comments
COMMENT ON TABLE "public"."essential_oils" IS 'Essential oils table. Multiple entries with the same scientific name are allowed to represent different extraction methods, parts of the plant, or specific variants.';
