/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.api.schoolinfoletter;

import de.eshg.schoolentry.SchoolInfoLetterService;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

@Schema(name = "SchoolInfoLetterVaccinationInfo")
public record SchoolInfoLetterVaccinationInfoDto(
    Boolean measlesProtectionComplete,
    @NotNull boolean vaccinationPassNotPresented,
    @NotNull boolean measlesContraIndication,
    SchoolInfoLetterMeaslesContraIndicationDurationDto measlesContraIndicationDuration,
    LocalDate measlesContraIndicationUntil) {

  public String formattedMeaslesContraIndicationUntil() {
    return measlesContraIndicationUntil == null
        ? null
        : measlesContraIndicationUntil.format(SchoolInfoLetterService.DATE_FORMATTER);
  }
}
