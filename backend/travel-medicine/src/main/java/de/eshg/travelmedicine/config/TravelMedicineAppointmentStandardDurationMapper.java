/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.config;

public class TravelMedicineAppointmentStandardDurationMapper {

  private TravelMedicineAppointmentStandardDurationMapper() {}

  public static GetTravelMedicineAppointmentStandardDurationsResponse mapToDto(
      TravelMedicineAppointmentStandardDuration domain) {
    return new GetTravelMedicineAppointmentStandardDurationsResponse(
        domain.isInitialized() ? mapToTravelMedicineAppointmentStandardDurationsDto(domain) : null);
  }

  public static TravelMedicineAppointmentStandardDuration mapToDomain(
      TravelMedicineAppointmentStandardDurationsDto dto) {
    TravelMedicineAppointmentStandardDuration domain =
        new TravelMedicineAppointmentStandardDuration();
    domain.setConsultation(dto.consultation());
    domain.setVaccination(dto.vaccination());
    return domain;
  }

  public static TravelMedicineAppointmentStandardDurationsDto
      mapToTravelMedicineAppointmentStandardDurationsDto(
          TravelMedicineAppointmentStandardDuration domain) {
    return new TravelMedicineAppointmentStandardDurationsDto(
        domain.getConsultation(), domain.getVaccination());
  }
}
