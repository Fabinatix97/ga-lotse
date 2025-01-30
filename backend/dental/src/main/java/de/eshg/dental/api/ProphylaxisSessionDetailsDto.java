/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.dental.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Schema(name = "ProphylaxisSessionDetails")
public record ProphylaxisSessionDetailsDto(
    @NotNull long version,
    @NotNull UUID id,
    @NotNull Instant dateAndTime,
    @NotNull @Valid InstitutionDto institution,
    @NotBlank String groupName,
    @NotNull ProphylaxisTypeDto type,
    @NotNull boolean isScreening,
    FluoridationVarnishDto fluoridationVarnish,
    @NotNull @Valid List<ProphylaxisSessionChildExaminationDto> participants,
    @NotEmpty @Valid List<? extends PerformingPersonDto> dentists,
    @NotEmpty @Valid List<? extends PerformingPersonDto> zfas) {}
