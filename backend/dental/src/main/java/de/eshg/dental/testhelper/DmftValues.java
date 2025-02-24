/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.dental.testhelper;

import jakarta.validation.constraints.NotNull;

public record DmftValues(@NotNull long dmftPrimary, @NotNull long dmftSecondary) {}
