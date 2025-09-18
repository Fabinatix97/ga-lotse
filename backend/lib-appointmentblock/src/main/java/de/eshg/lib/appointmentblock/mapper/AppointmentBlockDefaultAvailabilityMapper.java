/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.appointmentblock.mapper;

import de.eshg.lib.appointmentblock.api.UpdateAppointmentBlockAvailabilityRequest;
import de.eshg.lib.appointmentblock.persistence.entity.AppointmentBlockAvailabilityConfig;

public class AppointmentBlockDefaultAvailabilityMapper {

  private AppointmentBlockDefaultAvailabilityMapper() {
    /* static mapper class */
  }

  public static AppointmentBlockAvailabilityConfig mapToDomain(
      UpdateAppointmentBlockAvailabilityRequest dto) {
    AppointmentBlockAvailabilityConfig domain = new AppointmentBlockAvailabilityConfig();
    domain.setAvailableForCitizen(dto.defaultFlags().availableForCitizen());
    domain.setAvailableForBulkBooking(dto.defaultFlags().availableForBulkBooking());
    domain.setBulkCreateAppointmentsMinLeadTime(
        dto.leadTimes().bulkCreateAppointmentsMinLeadTime());
    domain.setCitizenFreeAppointmentsMinLeadTime(
        dto.leadTimes().citizenFreeAppointmentsMinLeadTime());
    domain.setCitizenFreeAppointmentsMaxLeadTime(
        dto.leadTimes().citizenFreeAppointmentsMaxLeadTime());
    return domain;
  }
}
