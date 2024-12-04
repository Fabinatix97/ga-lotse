/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.dental.api;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;
import java.util.UUID;

public record CreateProphylaxisSessionRequest(
    @NotNull Instant dateAndTime,
    @NotNull UUID institutionId,
    @NotBlank String groupName,
    @NotNull ProphylaxisTypeDto type) {}
