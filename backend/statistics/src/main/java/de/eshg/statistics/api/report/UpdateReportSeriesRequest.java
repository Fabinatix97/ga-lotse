/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.api.report;

import jakarta.validation.constraints.NotBlank;

public record UpdateReportSeriesRequest(@NotBlank String name, String description) {}
