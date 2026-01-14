/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.officialmedicalservice.config;

import de.eshg.officialmedicalservice.appointment.persistence.entity.OmsAppointmentStandardDuration;
import de.eshg.officialmedicalservice.config.api.GetOmsAppointmentStandardDurationsResponse;
import de.eshg.officialmedicalservice.config.api.OmsAppointmentStandardDurationsDto;

public class OmsAppointmentStandardDurationMapper {

  private OmsAppointmentStandardDurationMapper() {}

  public static GetOmsAppointmentStandardDurationsResponse mapToDto(
      OmsAppointmentStandardDuration domain) {

    return new GetOmsAppointmentStandardDurationsResponse(
        domain.isInitialized() ? mapToOmsAppointmentStandardDurationsDto(domain) : null);
  }

  static OmsAppointmentStandardDuration mapToDomain(OmsAppointmentStandardDurationsDto dto) {
    OmsAppointmentStandardDuration domain = new OmsAppointmentStandardDuration();
    domain.setOfficialMedicalServiceShort(dto.officialMedicalServiceShort());
    domain.setOfficialMedicalServiceLong(dto.officialMedicalServiceLong());
    return domain;
  }

  public static OmsAppointmentStandardDurationsDto mapToOmsAppointmentStandardDurationsDto(
      OmsAppointmentStandardDuration domain) {
    return new OmsAppointmentStandardDurationsDto(
        domain.getOfficialMedicalServiceShort(), domain.getOfficialMedicalServiceLong());
  }
}
