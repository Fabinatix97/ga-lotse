/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.schoolentry.api.configuration;

import de.eshg.lib.appointmentblock.api.LocationSelectionMode;
import de.eshg.schoolentry.api.DocumentTypes;
import de.eshg.validation.constraints.HexColor;
import jakarta.validation.constraints.NotNull;
import java.util.LinkedHashSet;

public record UpdateSchoolEntryConfigRequest(
    @NotNull LocationSelectionMode locationSelectionMode,
    @NotNull boolean directProcedureTypeAssignmentOnImport,
    @NotNull @HexColor String pdfDocumentAccentColor,
    LinkedHashSet<DocumentTypes> documentsWithEmployeeInfo,
    @NotNull boolean invitationIncludePerson,
    @NotNull boolean invitationIncludeRoom) {}
