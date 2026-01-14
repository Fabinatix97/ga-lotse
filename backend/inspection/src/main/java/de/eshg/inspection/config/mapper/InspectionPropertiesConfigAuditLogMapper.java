/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.config.mapper;

import de.eshg.inspection.config.persistence.InspectionPropertiesConfigurationProvider;
import java.util.LinkedHashMap;

public class InspectionPropertiesConfigAuditLogMapper {

  private InspectionPropertiesConfigAuditLogMapper() {}

  public static LinkedHashMap<String, String> getRelevantFieldsForLogging(
      InspectionPropertiesConfigurationProvider config) {
    LinkedHashMap<String, String> relevantFields = new LinkedHashMap<>();

    relevantFields.put("facilityNumberMethod", config.getFacilityFileNumberMethod().name());

    return relevantFields;
  }
}
