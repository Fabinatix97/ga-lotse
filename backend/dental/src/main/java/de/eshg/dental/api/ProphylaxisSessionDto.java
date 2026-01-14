/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
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
    @NotNull long version,
    @NotNull Instant dateAndTime,
    @NotNull @Valid InstitutionDto institution,
    String groupName,
    ProphylaxisTypeDto type,
    @NotNull boolean isScreening,
    FluoridationVarnishDto fluoridationVarnish,
    @NotNull ProphylaxisStatusDto status,
    @NotNull boolean isDeletable) {}
