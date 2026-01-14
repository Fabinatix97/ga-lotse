/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.config;

public class StiProtectionAppointmentStandardDurationMapper {

  private StiProtectionAppointmentStandardDurationMapper() {}

  public static GetSexWorkAppointmentStandardDurationsResponse
      mapToGetSexWorkAppointmentStandardDurationsResponse(
          StiProtectionAppointmentStandardDuration domain) {
    return new GetSexWorkAppointmentStandardDurationsResponse(
        domain.isSexWorkConsultationInitialized()
            ? mapToSexWorkAppointmentStandardDurationsDto(domain)
            : null);
  }

  public static GetHivStiConsultationAppointmentStandardDurationsResponse
      mapToGetHivStiConsultationAppointmentStandardDurationsResponse(
          StiProtectionAppointmentStandardDuration domain) {
    return new GetHivStiConsultationAppointmentStandardDurationsResponse(
        domain.isHivStiConsultationInitialized()
            ? mapToHivStiConsultationAppointmentStandardDurationsDto(domain)
            : null);
  }

  public static SexWorkAppointmentStandardDurationsDto mapToSexWorkAppointmentStandardDurationsDto(
      StiProtectionAppointmentStandardDuration domain) {
    return new SexWorkAppointmentStandardDurationsDto(
        domain.getResultsReview(), domain.getSexWorkConsultation());
  }

  public static HivStiConsultationAppointmentStandardDurationsDto
      mapToHivStiConsultationAppointmentStandardDurationsDto(
          StiProtectionAppointmentStandardDuration domain) {
    return new HivStiConsultationAppointmentStandardDurationsDto(
        domain.getResultsReview(), domain.getHivStiConsultation());
  }
}
