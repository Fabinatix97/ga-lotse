/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.officialmedicalservice.assessment.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.UUID;

@Schema(name = "OmsCreateAssessment")
public record CreateAssessmentDto(
    @NotNull UUID procedureExternalId,
    @NotNull @Size(min = 1, max = 60) String title,
    @NotNull AssessmentTypeDto assessmentType,
    RecipientTypeDto recipientType) {}
