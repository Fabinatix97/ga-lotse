/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.api.citizen;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

@Schema(description = "Add an anamnesis of the child completed by the custodians.")
public record AddCitizenAnamnesisRequest(@NotNull @Valid CitizenAnamnesisDto anamnesis) {}
