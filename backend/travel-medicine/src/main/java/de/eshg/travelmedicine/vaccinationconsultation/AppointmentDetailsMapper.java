/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.vaccinationconsultation;

import de.eshg.travelmedicine.vaccinationconsultation.api.AppointmentSummaryDto;
import de.eshg.travelmedicine.vaccinationconsultation.api.GetAppointmentDetailsResponse;
import de.eshg.travelmedicine.vaccinationconsultation.api.InformationStatementSummaryDto;
import de.eshg.travelmedicine.vaccinationconsultation.api.PatientDto;
import de.eshg.travelmedicine.vaccinationconsultation.persistence.entity.ProcedureStep;
import de.eshg.travelmedicine.vaccinationconsultation.persistence.entity.VcService;
import java.time.LocalDate;
import java.util.List;

public class AppointmentDetailsMapper {
  private AppointmentDetailsMapper() {}

  public static GetAppointmentDetailsResponse mapToDetails(
      AppointmentSummaryDto appointmentSummary,
      PatientDto patientDto,
      ProcedureStep procedureStep,
      List<InformationStatementSummaryDto> informationStatementSummaries) {
    String lastName = patientDto.lastName();
    String firstName = patientDto.firstName();
    LocalDate dateOfBirth = patientDto.dateOfBirth();
    boolean isMedicalHistoryCompletelyAnswered =
        procedureStep.getMedicalHistory().isCompletelyAnswered();
    boolean citizenHasAnswered = procedureStep.getMedicalHistory().isCitizenHasAnswered();
    boolean hasAccomplishedService =
        procedureStep.getServices().stream().anyMatch(VcService::isAccomplished);
    int bookingsRemaining = procedureStep.getBookingsRemaining();

    return new GetAppointmentDetailsResponse(
        appointmentSummary,
        hasAccomplishedService,
        bookingsRemaining,
        lastName,
        firstName,
        dateOfBirth,
        isMedicalHistoryCompletelyAnswered,
        citizenHasAnswered,
        informationStatementSummaries);
  }
}
