/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.vaccinationconsultation.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.UUID;

@Schema(name = "InformationStatementSummary")
public record InformationStatementSummaryDto(
    @NotNull UUID id,
    @NotNull @Size(max = 200) String title,
    @NotNull boolean citizenHasAnswered) {}
