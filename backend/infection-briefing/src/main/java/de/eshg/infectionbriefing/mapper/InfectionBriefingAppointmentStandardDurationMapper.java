/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.infectionbriefing.mapper;

import de.eshg.infectionbriefing.api.GetInfectionBriefingAppointmentStandardDurationsResponse;
import de.eshg.infectionbriefing.api.InfectionBriefingAppointmentStandardDurationsDto;
import de.eshg.infectionbriefing.domain.model.InfectionBriefingAppointmentStandardDuration;

public class InfectionBriefingAppointmentStandardDurationMapper {

  private InfectionBriefingAppointmentStandardDurationMapper() {}

  public static GetInfectionBriefingAppointmentStandardDurationsResponse mapToDto(
      InfectionBriefingAppointmentStandardDuration domain) {
    return new GetInfectionBriefingAppointmentStandardDurationsResponse(
        domain.isInitialized()
            ? mapToInfectionBriefingAppointmentStandardDurationsDto(domain)
            : null);
  }

  public static InfectionBriefingAppointmentStandardDuration mapToDomain(
      InfectionBriefingAppointmentStandardDurationsDto dto) {
    InfectionBriefingAppointmentStandardDuration domain =
        new InfectionBriefingAppointmentStandardDuration();
    domain.setInfectionBriefingNew(dto.infectionBriefingNew());
    domain.setInfectionBriefingReplacement(dto.infectionBriefingReplacement());
    return domain;
  }

  public static InfectionBriefingAppointmentStandardDurationsDto
      mapToInfectionBriefingAppointmentStandardDurationsDto(
          InfectionBriefingAppointmentStandardDuration domain) {
    return new InfectionBriefingAppointmentStandardDurationsDto(
        domain.getInfectionBriefingNew(), domain.getInfectionBriefingReplacement());
  }
}
