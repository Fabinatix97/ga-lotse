/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.infectionbriefing.mapper;

import de.eshg.infectionbriefing.api.InfectionBriefingAppointTypeDto;
import de.eshg.lib.appointmentblock.persistence.AppointmentType;

public class InfectionBriefingAppointmentTypeMapper {
  private InfectionBriefingAppointmentTypeMapper() {}

  public static AppointmentType toDomainType(InfectionBriefingAppointTypeDto appointType) {
    return switch (appointType) {
      case INFECTION_BRIEFING_NEW -> AppointmentType.INFECTION_BRIEFING_NEW;
      case INFECTION_BRIEFING_REPLACEMENT -> AppointmentType.INFECTION_BRIEFING_REPLACEMENT;
      case null -> null;
    };
  }
}
