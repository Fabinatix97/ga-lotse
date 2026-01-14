/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.disease.api;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;

public record PostPutDiseaseRequest(
    @NotBlank @Size(max = 200) String diseaseName,
    @Min(0) @Max(999999) BigDecimal estimatedFee,
    @NotNull boolean visibleToCitizenPortal) {}
