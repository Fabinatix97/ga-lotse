/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.api.diagram;

import jakarta.validation.constraints.NotBlank;

public record UpdateDiagramRequest(@NotBlank String title, String description) {}
