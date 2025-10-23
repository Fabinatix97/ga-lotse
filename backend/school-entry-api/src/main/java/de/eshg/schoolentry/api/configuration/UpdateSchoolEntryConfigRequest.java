/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.schoolentry.api.configuration;

import de.eshg.lib.appointmentblock.api.LocationSelectionMode;
import de.eshg.validation.constraints.HexColor;
import jakarta.validation.constraints.NotNull;

public record UpdateSchoolEntryConfigRequest(
    @NotNull LocationSelectionMode locationSelectionMode,
    @NotNull boolean directProcedureTypeAssignmentOnImport,
    @NotNull @HexColor String pdfDocumentAccentColor) {}
