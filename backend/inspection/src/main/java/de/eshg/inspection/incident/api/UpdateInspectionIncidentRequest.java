/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.incident.api;

import jakarta.validation.constraints.NotBlank;

public record UpdateInspectionIncidentRequest(String title, @NotBlank String description) {}
