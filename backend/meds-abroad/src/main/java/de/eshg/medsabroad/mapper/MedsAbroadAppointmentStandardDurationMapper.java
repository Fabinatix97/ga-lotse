/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.medsabroad.mapper;

import de.eshg.medsabroad.api.GetMedsAbroadAppointmentStandardDurationsResponse;
import de.eshg.medsabroad.api.MedsAbroadAppointmentStandardDurationsDto;
import de.eshg.medsabroad.persistence.database.MedsAbroadAppointmentStandardDuration;

public class MedsAbroadAppointmentStandardDurationMapper {

  private MedsAbroadAppointmentStandardDurationMapper() {}

  public static GetMedsAbroadAppointmentStandardDurationsResponse mapToDto(
      MedsAbroadAppointmentStandardDuration domain) {
    return new GetMedsAbroadAppointmentStandardDurationsResponse(
        domain.isInitialized() ? mapToMedsAbroadAppointmentStandardDurationsDto(domain) : null);
  }

  public static MedsAbroadAppointmentStandardDuration mapToDomain(
      MedsAbroadAppointmentStandardDurationsDto dto) {
    MedsAbroadAppointmentStandardDuration domain = new MedsAbroadAppointmentStandardDuration();
    domain.setCertification(dto.certification());
    return domain;
  }

  private static MedsAbroadAppointmentStandardDurationsDto
      mapToMedsAbroadAppointmentStandardDurationsDto(MedsAbroadAppointmentStandardDuration domain) {
    return new MedsAbroadAppointmentStandardDurationsDto(domain.getCertification());
  }
}
