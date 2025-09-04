/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.appointmentblock.mapper;

import de.eshg.lib.appointmentblock.persistence.entity.AppointmentBlockDefaultAvailabilityConfig;
import java.util.LinkedHashMap;
import java.util.SequencedMap;

public class AuditLogMapper {

  private AuditLogMapper() {
    /* static mapper class */
  }

  public static SequencedMap<String, String> getRelevantFieldsForLogging(
      AppointmentBlockDefaultAvailabilityConfig config) {
    LinkedHashMap<String, String> relevantFields = new LinkedHashMap<>();
    relevantFields.put("availableForCitizen", String.valueOf(config.getAvailableForCitizen()));
    relevantFields.put(
        "availableForBulkBooking", String.valueOf(config.getAvailableForBulkBooking()));
    return relevantFields;
  }
}
