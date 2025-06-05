/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.mapper;

import de.eshg.schoolentry.api.configuration.GetSchoolEntryAppointmentStandardDurationsResponse;
import de.eshg.schoolentry.api.configuration.SchoolEntryAppointmentStandardDurationsDto;
import de.eshg.schoolentry.config.SchoolEntryAppointmentStandardDuration;

public class SchoolEntryAppointmentStandardDurationMapper {

  private SchoolEntryAppointmentStandardDurationMapper() {}

  public static GetSchoolEntryAppointmentStandardDurationsResponse mapToDto(
      SchoolEntryAppointmentStandardDuration domain) {
    return new GetSchoolEntryAppointmentStandardDurationsResponse(
        domain.isInitialized() ? mapToSchoolEntryAppointmentStandardDurationsDto(domain) : null);
  }

  public static SchoolEntryAppointmentStandardDuration mapToDomain(
      SchoolEntryAppointmentStandardDurationsDto dto) {
    SchoolEntryAppointmentStandardDuration domain = new SchoolEntryAppointmentStandardDuration();
    domain.setCanChild(dto.canChild());
    domain.setEntryLevel(dto.entryLevel());
    domain.setRegularExamination(dto.regularExamination());
    domain.setSpecialNeeds(dto.specialNeeds());
    return domain;
  }

  private static SchoolEntryAppointmentStandardDurationsDto
      mapToSchoolEntryAppointmentStandardDurationsDto(
          SchoolEntryAppointmentStandardDuration domain) {
    return new SchoolEntryAppointmentStandardDurationsDto(
        domain.getCanChild(),
        domain.getEntryLevel(),
        domain.getRegularExamination(),
        domain.getSpecialNeeds());
  }
}
