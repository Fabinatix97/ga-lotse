/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.opendata;

import jakarta.validation.constraints.NotNull;

public record GetFallbackLicenseUrlResponse(@NotNull String fallbackLicenseUrl) {}
