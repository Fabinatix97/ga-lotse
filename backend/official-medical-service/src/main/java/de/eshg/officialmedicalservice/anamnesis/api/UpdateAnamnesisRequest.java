/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.officialmedicalservice.anamnesis.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

@Schema(name = "UpdateAnamnesisRequest")
public record UpdateAnamnesisRequest(@NotNull @Valid AnamnesisDto anamnesis) {}
