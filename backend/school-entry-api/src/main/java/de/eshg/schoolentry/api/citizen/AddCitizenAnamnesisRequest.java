/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.schoolentry.api.citizen;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

@Schema(description = "Add an anamnesis of the child completed by the custodians.")
public record AddCitizenAnamnesisRequest(@NotNull @Valid CitizenAnamnesisDto anamnesis) {}
