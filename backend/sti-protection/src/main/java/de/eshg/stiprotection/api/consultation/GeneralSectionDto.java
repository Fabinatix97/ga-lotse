/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.api.consultation;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "ConsultationGeneralSection")
public record GeneralSectionDto(
    String mainReason,
    String furtherGenderInfo,
    Boolean hasSufficientGermanLanguageSkills,
    Boolean isIlliterate,
    String otherKnownLanguages,
    Boolean hasHealthInsurance,
    Boolean hasGermanHealthInsurance,
    Boolean hasInsecureResidence,
    Boolean hasSymptoms,
    String symptoms,
    String drugUse,
    String referral,
    String notes) {}
