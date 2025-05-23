-- Views for common queries

-- Essential Oil Details View
CREATE OR REPLACE VIEW "public"."essential_oil_details" AS
SELECT 
    eo.id,
    eo.name_english,
    eo.name_scientific,
    eo.name_portuguese,
    eo.botanical_family,
    eo.description_english,
    eo.description_portuguese,
    eo.safety_notes_english,
    eo.safety_notes_portuguese,
    eo.contraindications_english,
    eo.contraindications_portuguese,
    eo.dilution_recommendation_id,
    dr.name AS dilution_recommendation,
    eo.internal_use_status_id,
    ius.name AS internal_use_status,
    eo.phototoxicity_status_id,
    ps.name AS phototoxicity_status,
    eo.embedding,
    (
        SELECT json_agg(json_build_object(
            'id', cc.id,
            'name', cc.name,
            'min_percentage', ecc.min_percentage,
            'max_percentage', ecc.max_percentage,
            'typical_percentage', ecc.typical_percentage,
            'notes', ecc.notes
        ))
        FROM "public"."essential_oil_chemical_compounds" ecc
        JOIN "public"."chemical_compounds" cc ON ecc.chemical_compound_id = cc.id
        WHERE ecc.essential_oil_id = eo.id
    ) AS chemical_compounds,
    (
        SELECT json_agg(json_build_object('id', eap.id, 'name', eap.name))
        FROM "public"."essential_oil_application_methods" eam
        JOIN "public"."eo_application_methods" eap ON eam.application_method_id = eap.id
        WHERE eam.essential_oil_id = eo.id
    ) AS application_methods,
    (
        SELECT json_agg(json_build_object('id', an.id, 'note_name', an.note_name))
        FROM "public"."essential_oil_aroma_notes" ean
        JOIN "public"."eo_aroma_notes" an ON ean.aroma_note_id = an.id
        WHERE ean.essential_oil_id = eo.id
    ) AS aroma_notes,
    (
        SELECT json_agg(json_build_object('id', c.id, 'chakra_name', c.chakra_name))
        FROM "public"."essential_oil_chakra_association" eca
        JOIN "public"."eo_chakras" c ON eca.chakra_id = c.id
        WHERE eca.essential_oil_id = eo.id
    ) AS chakras,
    (
        SELECT json_agg(json_build_object(
            'id', cs.id, 
            'range_description', cs.range_description,
            'safety_notes', eocs.safety_notes
        ))
        FROM "public"."essential_oil_child_safety" eocs
        JOIN "public"."eo_child_safety_age_ranges" cs ON eocs.age_range_id = cs.id
        WHERE eocs.essential_oil_id = eo.id
    ) AS child_safety,
    (
        SELECT json_agg(json_build_object('id', c.id, 'country_name', c.country_name, 'country_code', c.country_code))
        FROM "public"."essential_oil_extraction_countries" eec
        JOIN "public"."eo_countries" c ON eec.country_id = c.id
        WHERE eec.essential_oil_id = eo.id
    ) AS extraction_countries,
    (
        SELECT json_agg(json_build_object('id', em.id, 'method_name', em.method_name))
        FROM "public"."essential_oil_extraction_methods" eem
        JOIN "public"."eo_extraction_methods" em ON eem.extraction_method_id = em.id
        WHERE eem.essential_oil_id = eo.id
    ) AS extraction_methods,
    (
        SELECT json_agg(json_build_object('id', hb.id, 'benefit_name', hb.benefit_name))
        FROM "public"."essential_oil_health_benefits" eohb
        JOIN "public"."eo_health_benefits" hb ON eohb.health_benefit_id = hb.id
        WHERE eohb.essential_oil_id = eo.id
    ) AS health_benefits,
    (
        SELECT json_agg(json_build_object('id', p.id, 'plant_part', p.part_name))
        FROM "public"."essential_oil_plant_parts" eopp
        JOIN "public"."eo_plant_parts" p ON eopp.plant_part_id = p.id
        WHERE eopp.essential_oil_id = eo.id
    ) AS plant_parts,
    (
        SELECT json_agg(json_build_object('id', tp.id, 'property_name', tp.property_name, 'description', tp.description))
        FROM "public"."essential_oil_therapeutic_properties" eotp
        JOIN "public"."eo_therapeutic_properties" tp ON eotp.property_id = tp.id
        WHERE eotp.essential_oil_id = eo.id
    ) AS therapeutic_properties
FROM "public"."essential_oils" eo
LEFT JOIN "public"."eo_dilution_recommendations" dr ON eo.dilution_recommendation_id = dr.id
LEFT JOIN "public"."eo_internal_use_statuses" ius ON eo.internal_use_status_id = ius.id
LEFT JOIN "public"."eo_phototoxicity_statuses" ps ON eo.phototoxicity_status_id = ps.id;

-- Essential Oil Search View
CREATE OR REPLACE VIEW "public"."essential_oil_search" AS
SELECT 
    eo.id,
    eo.name_english,
    eo.name_scientific,
    eo.name_portuguese,
    eo.botanical_family,
    eo.embedding,
    (
        SELECT string_agg(cc.name, ', ')
        FROM "public"."essential_oil_chemical_compounds" ecc
        JOIN "public"."chemical_compounds" cc ON ecc.chemical_compound_id = cc.id
        WHERE ecc.essential_oil_id = eo.id
    ) AS chemical_compounds,
    (
        SELECT string_agg(tp.property_name, ', ')
        FROM "public"."essential_oil_therapeutic_properties" eotp
        JOIN "public"."eo_therapeutic_properties" tp ON eotp.property_id = tp.id
        WHERE eotp.essential_oil_id = eo.id
    ) AS therapeutic_properties,
    (
        SELECT string_agg(hb.benefit_name, ', ')
        FROM "public"."essential_oil_health_benefits" eohb
        JOIN "public"."eo_health_benefits" hb ON eohb.health_benefit_id = hb.id
        WHERE eohb.essential_oil_id = eo.id
    ) AS health_benefits,
    (
        SELECT string_agg(an.note_name, ', ')
        FROM "public"."essential_oil_aroma_notes" ean
        JOIN "public"."eo_aroma_notes" an ON ean.aroma_note_id = an.id
        WHERE ean.essential_oil_id = eo.id
    ) AS aroma_notes
FROM "public"."essential_oils" eo;

-- Set view ownership
ALTER VIEW "public"."essential_oil_details" OWNER TO "postgres";
ALTER VIEW "public"."essential_oil_search" OWNER TO "postgres";
