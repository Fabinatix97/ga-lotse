/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
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
    @NotNull LocalDate dateOfBirth,
    @NotNull Long version) {}
