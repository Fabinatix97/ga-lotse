/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.measlesprotection.api.citizenportal;

import de.eshg.measlesprotection.api.ReportDataDto;
import de.eshg.measlesprotection.api.RoleStatusDto;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;

@Schema(
    name = AffectedPersonSupplementalDataDto.SCHEMA_NAME,
    description =
        "Used to include reporting data and role status with draft procedures submitted via the citizen portal measles reporting form.")
public record AffectedPersonSupplementalDataDto(
    RoleStatusDto roleStatus, @Valid ReportDataDto reportData) {
  public static final String SCHEMA_NAME = "AffectedPersonSupplementalData";
}
