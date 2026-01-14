/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.api.attributes;

import jakarta.validation.constraints.NotBlank;

public record ValueOption(@NotBlank String value, @NotBlank String meaning) {}
