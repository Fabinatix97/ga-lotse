/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.dental.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;
import java.util.UUID;

@Schema(name = "Examination")
public record ExaminationDto(
    @NotNull UUID id,
    @NotNull long version,
    @NotNull Instant dateAndTime,
    @NotNull ProphylaxisTypeDto prophylaxisType,
    @NotNull boolean screening,
    @NotNull boolean fluoridation,
    String note,
    @Valid ExaminationResultDto result) {}
