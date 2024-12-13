/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.dental.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Schema(name = "ProphylaxisSessionDetails")
public record ProphylaxisSessionDetailsDto(
    @NotNull UUID id,
    @NotNull Instant dateAndTime,
    @NotNull @Valid InstitutionDto institution,
    @NotBlank String groupName,
    @NotNull ProphylaxisTypeDto type,
    @NotNull @Valid List<ChildResult> participants) {}
