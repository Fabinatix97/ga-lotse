/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.schoolentry.api.configuration;

import de.eshg.lib.appointmentblock.api.LocationSelectionMode;
import de.eshg.schoolentry.api.DocumentTypes;
import de.eshg.validation.constraints.HexColor;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import java.util.Set;

@Schema(name = "SchoolEntryConfig")
public record SchoolEntryConfigDto(
    @NotNull LocationSelectionMode locationSelectionMode,
    @NotNull boolean locationSelectionModeReadOnly,
    @NotNull boolean directProcedureTypeAssignmentOnImport,
    @NotNull @HexColor String pdfDocumentAccentColor,
    Set<DocumentTypes> documentsWithEmployeeInfo,
    @NotNull boolean invitationIncludePerson,
    @NotNull boolean invitationIncludeRoom) {}
