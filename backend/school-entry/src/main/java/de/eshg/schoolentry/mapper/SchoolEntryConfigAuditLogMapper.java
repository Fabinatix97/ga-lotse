/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.mapper;

import de.eshg.schoolentry.api.configuration.UpdateSchoolEntryMeasurementDeviceRequest;
import de.eshg.schoolentry.domain.model.MeasuringDevice;
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

  public static SequencedMap<String, String> getRelevantDeviceFieldsForLogging(
      MeasuringDevice measuringDevice) {
    LinkedHashMap<String, String> relevantFields = new LinkedHashMap<>();
    if (measuringDevice != null) {
      relevantFields.put("measuringDeviceType", measuringDevice.getMeasuringDeviceType().name());
      relevantFields.put("name", measuringDevice.getName());
      relevantFields.put("equipmentSelector", measuringDevice.getEquipmentSelector());
      relevantFields.put("driver", measuringDevice.getDriver().name());
    }
    return relevantFields;
  }

  public static SequencedMap<String, String> getRelevantDeviceFieldsForLoggingOfRequest(
      UpdateSchoolEntryMeasurementDeviceRequest request) {
    LinkedHashMap<String, String> relevantFields = new LinkedHashMap<>();
    relevantFields.put("measuringDeviceType", request.deviceType().name());
    relevantFields.put("name", request.name());
    relevantFields.put("equipmentSelector", request.equipmentSelector());
    relevantFields.put("driver", request.gdtDriver().name());
    return relevantFields;
  }
}
