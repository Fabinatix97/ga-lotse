/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.calendar.lib.api;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;

public record EventWithMetaData(
    @NotNull UUID eventId,
    @NotBlank String subject,
    String description,
    String location,
    UUID procedureId) {}
