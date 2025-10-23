/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.schoolentry.api;

import de.eshg.lib.appointmentblock.api.LocationSelectionMode;
import jakarta.validation.constraints.NotNull;

public record GetSchoolEntryConfigResponse(
    @NotNull LocationSelectionMode locationSelectionMode,
    @NotNull boolean isDirectProcedureTypeAssignmentOnImport) {}
