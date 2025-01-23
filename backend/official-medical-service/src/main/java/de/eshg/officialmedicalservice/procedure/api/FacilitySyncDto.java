/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.officialmedicalservice.procedure.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;

@Schema(name = "FacilitySync")
public record FacilitySyncDto(
    @NotNull UUID fileStateId, @NotNull long version, @NotNull boolean outdated) {}
