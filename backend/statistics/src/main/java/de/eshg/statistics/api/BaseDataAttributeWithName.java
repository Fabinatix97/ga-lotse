/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.api;

import jakarta.validation.constraints.NotNull;

public record BaseDataAttributeWithName(@NotNull String code, @NotNull String name) {}
