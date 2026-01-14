/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.api.consultation;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(
    name = "ConsultationGeneralSection",
    description =
        "General patient details, including language proficiency, gender information and health insurance data.")
public record GeneralSectionDto(
    @Schema(
            description = "Primary reason for the patient's consultation.",
            example =
                "The patient is seeking a routine check-up to address mild abdominal discomfort.")
        String mainReason,
    @Schema(
            description = "Additional gender-related information.",
            example = "The patient identifies as non-binary and prefers the pronouns they/them.")
        String furtherGenderInfo,
    @Schema(description = "Indicates whether the patient has any form of health insurance.")
        Boolean hasHealthInsurance,
    @Schema(description = "Indicates whether the patient has German health insurance.")
        Boolean hasGermanHealthInsurance,
    @Schema(description = "Indicates whether the patient's residency status is insecure.")
        Boolean hasInsecureResidence,
    @Schema(description = "Indicates whether the patient has any symptoms.") Boolean hasSymptoms,
    @Schema(
            description = "Details the symptoms reported by the patient.",
            example = "The patient reports persistent headaches and dizziness over the past week.")
        String symptoms,
    @Schema(
            description = "Records the patient's drug use or consumption.",
            example = "The patient reports occasional consumption of alcohol.")
        String drugUse,
    @Schema(
            description = "Details any referral made to another department or specialist.",
            example = "The patient has been referred to the gynecology department.")
        String referral,
    @Schema(
            description =
                "Optional field for additional remarks or comments during the consultation.",
            example =
                "The patient was advised to follow up in two weeks for further monitoring of symptoms.")
        String notes) {}
