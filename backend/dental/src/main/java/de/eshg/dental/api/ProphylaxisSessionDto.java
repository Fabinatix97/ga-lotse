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

@Schema(name = "ProphylaxisSession")
public record ProphylaxisSessionDto(
    @NotNull UUID id,
    @NotNull Instant dateAndTime,
    @NotNull @Valid InstitutionDto institution,
    String groupName,
    ProphylaxisTypeDto type,
    @NotNull boolean isScreening,
    FluoridationVarnishDto fluoridationVarnish,
    @NotNull ProphylaxisStatusDto status) {}
