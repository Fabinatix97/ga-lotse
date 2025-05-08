/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.dental.api;

import de.eshg.base.GenderDto;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.util.UUID;

@Schema(name = "ChildForTransition")
public record ChildForTransitionDto(
    @NotNull UUID id,
    @NotNull String firstName,
    @NotNull String lastName,
    GenderDto gender,
    String groupName,
    @NotNull LocalDate dateOfBirth) {}
