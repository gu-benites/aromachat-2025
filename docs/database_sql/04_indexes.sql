-- Indexes for better query performance

-- Essential Oils Indexes
CREATE INDEX IF NOT EXISTS "essential_oils_name_english_idx" ON "public"."essential_oils" ("name_english");
CREATE INDEX IF NOT EXISTS "essential_oils_embedding_idx" ON "public"."essential_oils" USING hnsw ("embedding" vector_cosine_ops);
CREATE INDEX IF NOT EXISTS "essential_oils_internal_use_status_id_idx" ON "public"."essential_oils" ("internal_use_status_id");
CREATE INDEX IF NOT EXISTS "essential_oils_dilution_recommendation_id_idx" ON "public"."essential_oils" ("dilution_recommendation_id");

-- Chemical Compounds Indexes
CREATE INDEX IF NOT EXISTS "chemical_compounds_name_idx" ON "public"."chemical_compounds" ("name");
CREATE INDEX IF NOT EXISTS "chemical_compounds_pubchem_compound_id_idx" ON "public"."chemical_compounds" ("pubchem_compound_id") WHERE ("pubchem_compound_id" IS NOT NULL);

-- Junction Tables Indexes (for reverse lookups)
CREATE INDEX IF NOT EXISTS "essential_oil_application_methods_application_method_id_idx" ON "public"."essential_oil_application_methods" ("application_method_id");
CREATE INDEX IF NOT EXISTS "essential_oil_aroma_notes_aroma_note_id_idx" ON "public"."essential_oil_aroma_notes" ("aroma_note_id");
CREATE INDEX IF NOT EXISTS "essential_oil_aroma_scents_scent_id_idx" ON "public"."essential_oil_aroma_scents" ("scent_id");
CREATE INDEX IF NOT EXISTS "essential_oil_chakra_association_chakra_id_idx" ON "public"."essential_oil_chakra_association" ("chakra_id");
CREATE INDEX IF NOT EXISTS "essential_oil_chemical_compounds_chemical_compound_id_idx" ON "public"."essential_oil_chemical_compounds" ("chemical_compound_id");
CREATE INDEX IF NOT EXISTS "essential_oil_child_safety_age_range_id_idx" ON "public"."essential_oil_child_safety" ("age_range_id");
CREATE INDEX IF NOT EXISTS "essential_oil_energetic_emotional_properties_energetic_property_id_idx" ON "public"."essential_oil_energetic_emotional_properties" ("energetic_property_id");
CREATE INDEX IF NOT EXISTS "essential_oil_extraction_countries_country_id_idx" ON "public"."essential_oil_extraction_countries" ("country_id");
CREATE INDEX IF NOT EXISTS "essential_oil_extraction_methods_extraction_method_id_idx" ON "public"."essential_oil_extraction_methods" ("extraction_method_id");
CREATE INDEX IF NOT EXISTS "essential_oil_health_benefits_health_benefit_id_idx" ON "public"."essential_oil_health_benefits" ("health_benefit_id");
CREATE INDEX IF NOT EXISTS "essential_oil_pet_safety_pet_id_idx" ON "public"."essential_oil_pet_safety" ("pet_id");
CREATE INDEX IF NOT EXISTS "essential_oil_plant_parts_plant_part_id_idx" ON "public"."essential_oil_plant_parts" ("plant_part_id");
CREATE INDEX IF NOT EXISTS "essential_oil_pregnancy_nursing_safety_pregnancy_nursing_status_id_idx" ON "public"."essential_oil_pregnancy_nursing_safety" ("pregnancy_nursing_status_id");
CREATE INDEX IF NOT EXISTS "essential_oil_therapeutic_properties_property_id_idx" ON "public"."essential_oil_therapeutic_properties" ("property_id");

-- Reference Tables Indexes
CREATE INDEX IF NOT EXISTS "eo_application_methods_name_idx" ON "public"."eo_application_methods" ("name");
CREATE INDEX IF NOT EXISTS "eo_aroma_notes_note_name_idx" ON "public"."eo_aroma_notes" ("note_name");
CREATE INDEX IF NOT EXISTS "eo_aroma_scents_scent_name_idx" ON "public"."eo_aroma_scents" ("scent_name");
CREATE INDEX IF NOT EXISTS "eo_chakras_chakra_name_idx" ON "public"."eo_chakras" ("chakra_name");
CREATE INDEX IF NOT EXISTS "eo_countries_country_name_idx" ON "public"."eo_countries" ("country_name");
CREATE INDEX IF NOT EXISTS "eo_countries_country_code_idx" ON "public"."eo_countries" ("country_code") WHERE ("country_code" IS NOT NULL);
CREATE INDEX IF NOT EXISTS "eo_dilution_recommendations_name_idx" ON "public"."eo_dilution_recommendations" ("name");
CREATE INDEX IF NOT EXISTS "eo_energetic_emotional_properties_property_name_idx" ON "public"."eo_energetic_emotional_properties" ("property_name");
CREATE INDEX IF NOT EXISTS "eo_extraction_methods_method_name_idx" ON "public"."eo_extraction_methods" ("method_name");
CREATE INDEX IF NOT EXISTS "eo_health_benefits_benefit_name_idx" ON "public"."eo_health_benefits" ("benefit_name");
CREATE INDEX IF NOT EXISTS "eo_internal_use_statuses_name_idx" ON "public"."eo_internal_use_statuses" ("name");
CREATE INDEX IF NOT EXISTS "eo_pets_animal_name_idx" ON "public"."eo_pets" ("animal_name");
CREATE INDEX IF NOT EXISTS "eo_phototoxicity_statuses_name_idx" ON "public"."eo_phototoxicity_statuses" ("name");
CREATE INDEX IF NOT EXISTS "eo_plant_parts_part_name_idx" ON "public"."eo_plant_parts" ("part_name");
CREATE INDEX IF NOT EXISTS "eo_therapeutic_properties_property_name_idx" ON "public"."eo_therapeutic_properties" ("property_name");

-- Usage Instructions Indexes
CREATE INDEX IF NOT EXISTS "usage_instructions_essential_oil_id_idx" ON "public"."usage_instructions" ("essential_oil_id");
CREATE INDEX IF NOT EXISTS "usage_instructions_health_benefit_id_idx" ON "public"."usage_instructions" ("health_benefit_id");
CREATE INDEX IF NOT EXISTS "usage_instructions_application_method_id_idx" ON "public"."usage_instructions" ("application_method_id");
