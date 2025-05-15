/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.mapper;

import de.eshg.schoolentry.api.configuration.UpdateSchoolEntryConfigRequest;
import de.eshg.schoolentry.domain.model.SchoolEntryConfig;

public class SchoolEntryConfigMapper {

  private SchoolEntryConfigMapper() {}

  public static SchoolEntryConfig mapToDomain(UpdateSchoolEntryConfigRequest request) {
    SchoolEntryConfig schoolEntryConfig = new SchoolEntryConfig();
    schoolEntryConfig.setDirectProcedureTypeAssignmentOnImport(
        request.directProcedureTypeAssignmentOnImport());
    schoolEntryConfig.setLocationSelectionMode(request.locationSelectionMode());
    schoolEntryConfig.setPdfDocumentAccentColor(request.pdfDocumentAccentColor());
    return schoolEntryConfig;
  }
}
