/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.inspection.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;
import java.util.UUID;

@Schema(name = "InspectionForDuplicateReview")
public record InspectionForDuplicateReviewDto(
    @NotNull UUID externalId,
    @NotNull String title,
    @NotNull InspectionType type,
    @NotNull InspectionResult result,
    @NotNull Instant executedTime,
    @NotNull int numberOfIncidents) {}
