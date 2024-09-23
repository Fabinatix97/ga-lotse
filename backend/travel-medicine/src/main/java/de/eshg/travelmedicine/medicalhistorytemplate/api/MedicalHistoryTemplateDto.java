/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.medicalhistorytemplate.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.Instant;
import java.util.UUID;

@Schema(name = "MedicalHistoryTemplate")
public record MedicalHistoryTemplateDto(
    @NotNull UUID id,
    @NotNull @Size(max = 200) String title,
    @NotNull MedicalHistoryTemplateStateDto state,
    @NotNull @Valid MedicalHistoryTemplateContentDto content,
    @NotNull boolean mainFlag,
    @NotNull boolean followUpFlag,
    @NotNull Instant createdAt,
    Instant modifiedAt) {}
