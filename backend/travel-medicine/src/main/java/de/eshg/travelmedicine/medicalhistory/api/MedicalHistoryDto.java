/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.medicalhistory.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;
import java.util.UUID;

@Schema(name = "MedicalHistory")
public record MedicalHistoryDto(
    @NotNull UUID id,
    @NotNull UUID procedureStepId,
    @NotNull Instant appointment,
    @NotNull boolean followUp,
    @NotNull @Valid MedicalHistoryContentDto medicalHistoryContent,
    @NotNull boolean isCompletelyAnswered,
    @NotNull boolean citizenHasAnswered,
    String note,
    @NotNull Instant createdAt,
    @NotNull Instant modifiedAt) {}
