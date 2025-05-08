/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.api.configuration;

import de.eshg.lib.appointmentblock.LocationSelectionMode;
import de.eshg.validation.constraints.HexColor;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;

@Schema(name = "SchoolEntryConfig")
public record SchoolEntryConfigDto(
    @NotNull LocationSelectionMode locationSelectionMode,
    @NotNull boolean locationSelectionModeReadOnly,
    @NotNull boolean directProcedureTypeAssignmentOnImport,
    @NotNull boolean directProcedureTypeAssignmentOnImportReadOnly,
    @NotNull @HexColor String pdfDocumentAccentColor) {}
