/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.statistics.api;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record ValueOptionInternal(
    @NotBlank String value, @NotBlank String meaning, @NotNull boolean isUnknownValue) {}
