/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.schoolentry.api;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

public record HearingTestInitializationResponse(
    @NotNull @Pattern(regexp = "^[A-Za-z0-9]{6}$") String correlationId,
    @NotBlank String firstNameAlias,
    @NotBlank String lastNameAlias) {}
