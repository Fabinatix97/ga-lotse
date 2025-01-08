/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.measlesprotection.api.citizenportal;

import de.eshg.measlesprotection.api.draft.AffectedPersonDetailsDto;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

@Schema(
    name = "ReportPerson",
    description = "Represents the all data to an individual the facility reports from the portal.")
public record ReportPersonDto(
    @NotNull @Valid AffectedPersonDetailsDto affectedPersonDetails,
    @NotNull @Valid AffectedPersonSupplementalDataDto affectedPersonSupplementalData) {}
