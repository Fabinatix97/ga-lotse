/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.citizenauth;

import de.eshg.lib.appointmentblock.api.AppointmentDto;
import de.eshg.rest.service.security.config.BaseUrls;
import de.eshg.travelmedicine.featuretoggle.TravelMedicineFeature;
import de.eshg.travelmedicine.featuretoggle.TravelMedicineFeatureToggle;
import de.eshg.travelmedicine.medicalhistory.api.MedicalHistoryContentDto;
import de.eshg.travelmedicine.vaccinationconsultation.VaccinationConsultationService;
import de.eshg.travelmedicine.vaccinationconsultation.api.GetAppointmentDetailsResponse;
import de.eshg.travelmedicine.vaccinationconsultation.api.GetCitizenAppointmentOverviewResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.UUID;
import org.springframework.http.MediaType;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(path = CitizenAuthController.BASE_URL, produces = MediaType.APPLICATION_JSON_VALUE)
@Tag(name = "CitizenAuth")
public class CitizenAuthController {

  public static final String BASE_URL = BaseUrls.TravelMedicine.CITIZEN_AUTH_CONTROLLER;

  public static final String PROCEDURE_APPOINTMENTS_URL = "/procedure-appointments";
  public static final String APPOINTMENTS_URL = "/appointments";
  public static final String VACCINATION_CONSULTATION_URL = "/vaccination-consultations";
  public static final String PROCEDURE_STEP_URL = "/procedure-steps";
  public static final String MEDICAL_HISTORY_URL = "/medical-history";

  private final TravelMedicineFeatureToggle featureToggle;
  private final VaccinationConsultationService vaccinationConsultationService;

  public CitizenAuthController(
      TravelMedicineFeatureToggle featureToggle,
      VaccinationConsultationService vaccinationConsultationService) {
    this.featureToggle = featureToggle;
    this.vaccinationConsultationService = vaccinationConsultationService;
  }

  // Test
  @GetMapping(PROCEDURE_APPOINTMENTS_URL)
  @Operation(summary = "Gets all procedure appointments")
  @Transactional(readOnly = true)
  public GetCitizenAppointmentOverviewResponse getProcedureAppointments(
      @AuthenticationPrincipal Jwt principal) {
    featureToggle.assertNewFeatureIsEnabled(TravelMedicineFeature.CITIZEN_PORTAL_PROCEDURE);
    return vaccinationConsultationService.getProcedureStepAppointments(getCitizenUserId(principal));
  }

  @GetMapping(
      VACCINATION_CONSULTATION_URL + "/{procedureId}" + PROCEDURE_STEP_URL + "/{procedureStepId}")
  @Operation(summary = "Gets details for a procedure step appointment")
  @Transactional(readOnly = true)
  public GetAppointmentDetailsResponse getProcedureStepAppointmentDetails(
      @AuthenticationPrincipal Jwt principal,
      @PathVariable("procedureId") UUID procedureId,
      @PathVariable("procedureStepId") UUID procedureStepId) {
    featureToggle.assertNewFeatureIsEnabled(TravelMedicineFeature.CITIZEN_PORTAL_PROCEDURE);
    return vaccinationConsultationService.getAppointmentDetails(
        getCitizenUserId(principal), procedureId, procedureStepId);
  }

  @DeleteMapping(
      VACCINATION_CONSULTATION_URL
          + "/{procedureId}"
          + PROCEDURE_STEP_URL
          + "/{procedureStepId}/appointment")
  @Operation(summary = "Cancel an appointment.")
  @Transactional
  public void deleteAppointment(
      @AuthenticationPrincipal Jwt principal,
      @PathVariable("procedureId") UUID procedureId,
      @PathVariable("procedureStepId") UUID procedureStepId) {
    featureToggle.assertNewFeatureIsEnabled(TravelMedicineFeature.CITIZEN_PORTAL_PROCEDURE);
    vaccinationConsultationService.deleteAppointment(
        getCitizenUserId(principal), procedureId, procedureStepId);
  }

  @GetMapping(
      VACCINATION_CONSULTATION_URL
          + "/{procedureId}"
          + PROCEDURE_STEP_URL
          + "/{procedureStepId}"
          + MEDICAL_HISTORY_URL)
  @Operation(summary = "Gets medical history for a procedure step appointment")
  @Transactional(readOnly = true)
  public MedicalHistoryContentDto getMedicalHistory(
      @AuthenticationPrincipal Jwt principal,
      @PathVariable("procedureId") UUID procedureId,
      @PathVariable("procedureStepId") UUID procedureStepId) {
    featureToggle.assertNewFeatureIsEnabled(TravelMedicineFeature.CITIZEN_PORTAL_PROCEDURE);
    return vaccinationConsultationService.getMedicalHistory(
        getCitizenUserId(principal), procedureId, procedureStepId);
  }

  @PatchMapping(
      VACCINATION_CONSULTATION_URL
          + "/{procedureId}"
          + PROCEDURE_STEP_URL
          + "/{procedureStepId}"
          + MEDICAL_HISTORY_URL)
  @Operation(summary = "Updates medical history content")
  @Transactional()
  public void patchCitizenMedicalHistory(
      @AuthenticationPrincipal Jwt principal,
      @PathVariable("procedureId") UUID procedureId,
      @PathVariable("procedureStepId") UUID procedureStepId,
      @RequestBody @Valid MedicalHistoryContentDto patchMedicalHistoryContent) {
    featureToggle.assertNewFeatureIsEnabled(TravelMedicineFeature.CITIZEN_PORTAL_PROCEDURE);
    vaccinationConsultationService.patchMedicalHistory(
        getCitizenUserId(principal), procedureId, procedureStepId, patchMedicalHistoryContent);
  }

  @PutMapping(
      VACCINATION_CONSULTATION_URL
          + "/{procedureId}"
          + PROCEDURE_STEP_URL
          + "/{procedureStepId}"
          + APPOINTMENTS_URL)
  @Operation(summary = "Book or rebook an appointment")
  @Transactional()
  public void putAppointment(
      @AuthenticationPrincipal Jwt principal,
      @PathVariable("procedureId") UUID procedureId,
      @PathVariable("procedureStepId") UUID procedureStepId,
      @RequestBody @Valid AppointmentDto appointmentDto) {
    featureToggle.assertNewFeatureIsEnabled(TravelMedicineFeature.CITIZEN_PORTAL_PROCEDURE);
    vaccinationConsultationService.bookCitizenAppointment(
        getCitizenUserId(principal), procedureId, procedureStepId, appointmentDto);
  }

  private UUID getCitizenUserId(Jwt principal) {
    return UUID.fromString(principal.getSubject());
  }
}
