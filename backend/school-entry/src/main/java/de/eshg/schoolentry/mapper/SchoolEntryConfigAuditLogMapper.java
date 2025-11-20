/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.mapper;

import de.eshg.schoolentry.domain.model.SchoolEntryConfig;
import java.util.LinkedHashMap;
import java.util.SequencedMap;

public class SchoolEntryConfigAuditLogMapper {

  private SchoolEntryConfigAuditLogMapper() {}

  public static SequencedMap<String, String> getRelevantFieldsForLogging(
      SchoolEntryConfig schoolEntryConfig) {
    LinkedHashMap<String, String> relevantFields = new LinkedHashMap<>();
    if (schoolEntryConfig != null) {
      relevantFields.put(
          "locationSelectionMode", schoolEntryConfig.getLocationSelectionMode().name());
      relevantFields.put(
          "directProcedureTypeAssignmentOnImport",
          Boolean.toString(schoolEntryConfig.isDirectProcedureTypeAssignmentOnImport()));
      relevantFields.put("pdfDocumentAccentColor", schoolEntryConfig.getPdfDocumentAccentColor());
      relevantFields.put(
          "invitationIncludePerson",
          Boolean.toString(schoolEntryConfig.isInvitationIncludePerson()));
      relevantFields.put(
          "invitationIncludeRoom", Boolean.toString(schoolEntryConfig.isInvitationIncludeRoom()));
    }
    return relevantFields;
  }
}
