/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.schoolentry.api.vaccination;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

@Schema(name = "MeaslesVaccination")
public record MeaslesVaccinationDto(
    @NotNull boolean complete,
    Integer mmr,
    Boolean vaccinationPassPresented,
    Boolean measlesContraIndication,
    Boolean measlesContraIndicationIsPermanent,
    LocalDate measlesContraIndicationUntil) {}
