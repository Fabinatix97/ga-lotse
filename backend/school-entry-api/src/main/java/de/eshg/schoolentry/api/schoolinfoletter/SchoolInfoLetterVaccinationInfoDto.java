/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.schoolentry.api.schoolinfoletter;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

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
        : measlesContraIndicationUntil.format(DateTimeFormatter.ofPattern("dd.MM.yyyy"));
  }
}
