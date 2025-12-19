/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.dental.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

@Schema(name = "InstitutionForTransition")
public record InstitutionForTransitionDto(
    @NotNull @Valid InstitutionWithAddressDto institution,
    @NotNull int completedCount,
    @NotNull int totalCount,
    @NotNull SchoolYearTransitionStatusDto status) {}
