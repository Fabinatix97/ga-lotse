/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.api;

import jakarta.validation.constraints.NotBlank;

public record UpdateAnalysisRequest(@NotBlank String name) {}
