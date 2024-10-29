/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.api.medicalhistory;

import de.eshg.base.GenderDto;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.PositiveOrZero;
import java.util.Set;

@Schema(name = "RiskContact")
public record RiskContactDto(
    SexualOrientationDto sexualOrientation,
    @PositiveOrZero Integer numberOfSexualPartnersLast12Months,
    Set<GenderDto> sexualContacts,
    Set<PartnerRiskFactorDto> partnerRiskFactors) {}
