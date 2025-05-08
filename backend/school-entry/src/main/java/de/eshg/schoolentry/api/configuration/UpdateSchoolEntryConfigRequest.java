/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.api.configuration;

import de.eshg.lib.appointmentblock.LocationSelectionMode;
import de.eshg.validation.constraints.HexColor;
import jakarta.validation.constraints.NotNull;

public record UpdateSchoolEntryConfigRequest(
    @NotNull LocationSelectionMode locationSelectionMode,
    @NotNull boolean directProcedureTypeAssignmentOnImport,
    @NotNull @HexColor String pdfDocumentAccentColor) {}
