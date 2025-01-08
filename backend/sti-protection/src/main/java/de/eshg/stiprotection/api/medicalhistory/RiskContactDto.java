/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.api.medicalhistory;

import de.eshg.base.GenderDto;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.PositiveOrZero;
import java.util.Set;

@Schema(name = "RiskContact")
public record RiskContactDto(
    @Schema(
            description =
                "Represents the gender of the patient's sexual contacts over the specified period.",
            example = "BISEXUAL")
        SexualOrientationDto sexualOrientation,
    @PositiveOrZero
        @Schema(
            description =
                "Indicates the total number of sexual partners the patient has had within the last 12 months.",
            example = "2")
        Integer numberOfSexualPartnersLast12Months,
    @Schema(
            description =
                "Represents the gender of the patient's sexual contacts over the specified period.",
            example = "['FEMALE','DIVERSE']")
        Set<GenderDto> sexualContacts,
    @Schema(
            description = "Details any know risk factors associated the patient's sexual partners.",
            example = "['SEX_WORKER','STI_POSITIVE','INJECTED_DRUGS']")
        Set<PartnerRiskFactorDto> partnerRiskFactors) {}
