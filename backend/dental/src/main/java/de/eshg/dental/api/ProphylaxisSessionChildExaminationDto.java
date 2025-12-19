/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.dental.api;

import de.eshg.base.GenderDto;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Schema(name = "ProphylaxisSessionChildExamination")
public record ProphylaxisSessionChildExaminationDto(
    @NotNull long examinationVersion,
    @NotNull UUID examinationId,
    @NotNull UUID childId,
    @NotNull long childVersion,
    @NotNull String firstName,
    @NotNull String lastName,
    @NotNull LocalDate dateOfBirth,
    @Valid @NotNull InstitutionDto institution,
    String groupName,
    GenderDto gender,
    @Valid @NotNull List<ProcedureLabelDto> procedureLabels,
    String note,
    DentitionTypeDto prophylaxisDentitionType,
    @Valid @NotNull List<FluoridationConsentDto> relevantFluoridationConsents,
    @Valid ExaminationResultDto result,
    @Valid @NotNull
        Map<Instant, ScreeningExaminationResultDto> previousScreeningExaminationResults) {}
