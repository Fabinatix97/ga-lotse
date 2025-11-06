/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.measlesprotection.api;

import de.eshg.schoolentry.api.vaccination.MeaslesVaccinationDto;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

@Schema(name = "MeaslesVaccinationStatus")
public record MeaslesVaccinationStatusDto(
    @Valid MeaslesVaccinationDto vaccination,
    LocalDateTime lastUpdated,
    @NotNull MeaslesVaccinationStatusUpdateModeDto update) {}
