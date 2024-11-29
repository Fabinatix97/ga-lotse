/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.api.medicalhistory;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.PastOrPresent;
import java.time.LocalDate;
import java.util.Set;

@Schema(name = "SexWorkRiskContact")
public record SexWorkRiskContactDto(
    @PastOrPresent LocalDate startInSexWorkDate, Set<SexWorkLocationDto> sexWorkLocations) {}
