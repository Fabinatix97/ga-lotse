/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.prostituteprotection.mapper;

import de.eshg.prostituteprotection.api.GetProstituteProtectionAppointmentStandardDurationsResponse;
import de.eshg.prostituteprotection.api.ProstituteProtectionAppointmentStandardDurationsDto;
import de.eshg.prostituteprotection.domain.model.ProstituteProtectionAppointmentStandardDuration;

public class ProstituteProtectionAppointmentStandardDurationMapper {

  private ProstituteProtectionAppointmentStandardDurationMapper() {}

  public static GetProstituteProtectionAppointmentStandardDurationsResponse mapToDto(
      ProstituteProtectionAppointmentStandardDuration domain) {
    return new GetProstituteProtectionAppointmentStandardDurationsResponse(
        domain.isInitialized()
            ? mapToProstituteProtectionAppointmentStandardDurationsDto(domain)
            : null);
  }

  public static ProstituteProtectionAppointmentStandardDuration mapToDomain(
      ProstituteProtectionAppointmentStandardDurationsDto dto) {
    ProstituteProtectionAppointmentStandardDuration domain =
        new ProstituteProtectionAppointmentStandardDuration();
    domain.setConsultation(dto.consultation());
    return domain;
  }

  public static ProstituteProtectionAppointmentStandardDurationsDto
      mapToProstituteProtectionAppointmentStandardDurationsDto(
          ProstituteProtectionAppointmentStandardDuration domain) {
    return new ProstituteProtectionAppointmentStandardDurationsDto(domain.getConsultation());
  }
}
