/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.centralfile.api.facility;

import de.eshg.base.centralfile.api.DiffDto;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

@Schema(name = "FacilityContactPersonDiff")
public record FacilityContactPersonDiffDto(
    @NotNull @Valid DiffDto<FacilityContactPersonDto> facilityContactPersonDtoDiffDto) {}
