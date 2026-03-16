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
@Schema(name = "OmsAssessmentDetails")
public record AssessmentDetailsDto(
    @NotNull UUID id,
    @NotNull @Size(min = 1, max = 60) String title,
    @NotNull String summary,
    @NotNull String jsonContent,
    @NotNull String htmlContent,
    AssessmentResultDto assessmentResult,
    @NotNull AssessmentTypeDto assessmentType,
    @NotNull AssessmentStatusDto assessmentStatus,
    RecipientTypeDto recipientType,
    @NotNull @Valid OmsUserDto editor,
    @NotNull Instant created,
    Instant finished,
    @NotNull @Valid List<SourceDto> sources,
    @NotNull @Valid List<LegalBasisDto> legalBases,
    @NotNull @Valid List<OmsUserDto> previewReader) {}
