/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.vaccinationconsultation;

import de.eshg.travelmedicine.medicalhistory.persistence.entity.MedicalHistory;
import de.eshg.travelmedicine.vaccinationconsultation.api.AppointmentSummaryDto;
import de.eshg.travelmedicine.vaccinationconsultation.api.GetAppointmentDetailsResponse;
import de.eshg.travelmedicine.vaccinationconsultation.api.PatientDto;
import java.time.LocalDate;

public class AppointmentDetailsMapper {
  private AppointmentDetailsMapper() {}

  public static GetAppointmentDetailsResponse mapToDetails(
      AppointmentSummaryDto appointmentSummary,
      boolean hasAccomplishedService,
      PatientDto patientDto,
      MedicalHistory medicalHistory) {
    String lastName = patientDto.lastName();
    String firstName = patientDto.firstName();
    LocalDate dateOfBirth = patientDto.dateOfBirth();
    boolean isMedicalHistoryCompletelyAnswered = medicalHistory.isCompletelyAnswered();
    boolean citizenHasAnswered = medicalHistory.isCitizenHasAnswered();

    return new GetAppointmentDetailsResponse(
        appointmentSummary,
        hasAccomplishedService,
        lastName,
        firstName,
        dateOfBirth,
        isMedicalHistoryCompletelyAnswered,
        citizenHasAnswered);
  }
}
