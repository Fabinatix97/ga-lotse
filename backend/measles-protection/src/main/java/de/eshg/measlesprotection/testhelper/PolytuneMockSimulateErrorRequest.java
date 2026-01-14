/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.measlesprotection.testhelper;

import jakarta.validation.constraints.NotNull;

public record PolytuneMockSimulateErrorRequest(
    @NotNull PolytuneMockHttpErrorStatus errorType, @NotNull String errorMessage) {}
