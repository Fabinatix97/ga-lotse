/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.dental.testhelper;

import jakarta.validation.constraints.NotNull;

public record DmftValues(@NotNull long dmftPrimary, @NotNull long dmftSecondary) {}
