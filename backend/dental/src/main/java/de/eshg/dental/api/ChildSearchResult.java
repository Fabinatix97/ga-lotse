/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.dental.api;

import de.eshg.base.GenderDto;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.util.UUID;

public record ChildSearchResult(
    @NotNull UUID id,
    @NotNull String firstName,
    @NotNull String lastName,
    @NotNull LocalDate dateOfBirth,
    String groupName,
    GenderDto gender) {}
