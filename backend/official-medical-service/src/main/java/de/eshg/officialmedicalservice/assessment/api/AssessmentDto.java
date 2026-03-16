/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.officialmedicalservice.assessment.api;

import de.eshg.lib.assessment.domain.model.Assessment;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

/**
 * @see Assessment
 */
@Schema(name = "OmsAssessment")
public record AssessmentDto(
    @NotNull UUID id,
    @NotNull @Size(min = 1, max = 60) String title,
    AssessmentResultDto assessmentResult,
    @NotNull AssessmentTypeDto assessmentType,
    @NotNull AssessmentStatusDto assessmentStatus,
    @NotNull @Valid OmsUserDto editor,
    @NotNull Instant created,
    Instant finished,
    @NotNull @Valid List<OmsUserDto> previewReader) {}
