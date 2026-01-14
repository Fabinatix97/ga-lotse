/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.appointmentblock.mapper;

import de.eshg.lib.appointmentblock.persistence.entity.AppointmentBlockAvailabilityConfig;
import java.util.LinkedHashMap;
import java.util.SequencedMap;

public class AuditLogMapper {

  private AuditLogMapper() {
    /* static mapper class */
  }

  public static SequencedMap<String, String> getRelevantFieldsForLogging(
      AppointmentBlockAvailabilityConfig config) {
    LinkedHashMap<String, String> relevantFields = new LinkedHashMap<>();
    relevantFields.put("availableForCitizen", String.valueOf(config.getAvailableForCitizen()));
    relevantFields.put(
        "availableForBulkBooking", String.valueOf(config.getAvailableForBulkBooking()));
    relevantFields.put(
        "bulkCreateAppointmentsMinLeadTime",
        String.valueOf(config.getBulkCreateAppointmentsMinLeadTime()));
    relevantFields.put(
        "citizenFreeAppointmentsMinLeadTime",
        String.valueOf(config.getCitizenFreeAppointmentsMinLeadTime()));
    relevantFields.put(
        "citizenFreeAppointmentsMaxLeadTime",
        String.valueOf(config.getCitizenFreeAppointmentsMaxLeadTime()));
    return relevantFields;
  }
}
