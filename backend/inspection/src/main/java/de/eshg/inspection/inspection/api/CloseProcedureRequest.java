/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.inspection.api;

import jakarta.validation.constraints.NotBlank;

public record CloseProcedureRequest(@NotBlank String note) {}
