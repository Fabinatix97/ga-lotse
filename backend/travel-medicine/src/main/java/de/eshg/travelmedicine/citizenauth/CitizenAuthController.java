/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.citizenauth;

import de.eshg.lib.appointmentblock.api.AppointmentDto;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.security.config.BaseUrls;
import de.eshg.travelmedicine.citizenauth.api.PatchInformationStatementRequest;
import de.eshg.travelmedicine.document.api.DocumentContentDto;
import de.eshg.travelmedicine.document.informationstatement.InformationStatementService;
import de.eshg.travelmedicine.document.medicalhistory.MedicalHistoryService;
import de.eshg.travelmedicine.featuretoggle.TravelMedicineFeature;
import de.eshg.travelmedicine.featuretoggle.TravelMedicineFeatureToggle;
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
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

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
  public static final String INFORMATION_STATEMENT_URL = "/information-statements";

  private static final long MAX_SIGNATURE_SIZE = 1024L * 1024L;

  private final TravelMedicineFeatureToggle featureToggle;
  private final VaccinationConsultationService vaccinationConsultationService;
  private final InformationStatementService informationStatementService;

  private final MedicalHistoryService medicalHistoryService;

  public CitizenAuthController(
      TravelMedicineFeatureToggle featureToggle,
      VaccinationConsultationService vaccinationConsultationService,
      InformationStatementService informationStatementService,
      MedicalHistoryService medicalHistoryService) {
    this.featureToggle = featureToggle;
    this.vaccinationConsultationService = vaccinationConsultationService;
    this.informationStatementService = informationStatementService;
    this.medicalHistoryService = medicalHistoryService;
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
  @Operation(summary = "Cancel an appointment from citizen portal.")
  @Transactional
  public void deleteAppointmentCp(
      @AuthenticationPrincipal Jwt principal,
      @PathVariable("procedureId") UUID procedureId,
      @PathVariable("procedureStepId") UUID procedureStepId) {
    featureToggle.assertNewFeatureIsEnabled(TravelMedicineFeature.CITIZEN_PORTAL_PROCEDURE);
    vaccinationConsultationService.cancelAppointmentByCitizen(
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
  public DocumentContentDto getMedicalHistory(
      @AuthenticationPrincipal Jwt principal,
      @PathVariable("procedureId") UUID procedureId,
      @PathVariable("procedureStepId") UUID procedureStepId) {
    featureToggle.assertNewFeatureIsEnabled(TravelMedicineFeature.CITIZEN_PORTAL_PROCEDURE);
    return medicalHistoryService.getMedicalHistoryForCitizenPortal(
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
      @RequestBody @Valid DocumentContentDto patchMedicalHistoryContent) {
    featureToggle.assertNewFeatureIsEnabled(TravelMedicineFeature.CITIZEN_PORTAL_PROCEDURE);
    medicalHistoryService.patchMedicalHistoryForCitizenPortal(
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
    vaccinationConsultationService.bookCitizenAppointmentByCitizen(
        getCitizenUserId(principal), procedureId, procedureStepId, appointmentDto);
  }

  @GetMapping(INFORMATION_STATEMENT_URL + "/{informationStatementId}")
  @Operation(summary = "Gets information statement by id")
  @Transactional(readOnly = true)
  public DocumentContentDto getCitizenInformationStatement(
      @AuthenticationPrincipal Jwt principal,
      @PathVariable("informationStatementId") UUID informationStatementId) {
    featureToggle.assertNewFeatureIsEnabled(
        TravelMedicineFeature.CITIZEN_PORTAL_INFORMATION_STATEMENT);
    return informationStatementService.getInformationStatementForCitizenPortal(
        getCitizenUserId(principal), informationStatementId);
  }

  @PatchMapping(
      path = INFORMATION_STATEMENT_URL + "/{informationStatementId}",
      consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  @Operation(summary = "Updates information statement content")
  @Transactional()
  public void patchCitizenInformationStatement(
      @AuthenticationPrincipal Jwt principal,
      @PathVariable("informationStatementId") UUID informationStatementId,
      @RequestPart("patchInformationStatementContent") @Valid
          PatchInformationStatementRequest patchInformationStatementContent,
      @RequestPart(name = "signature") MultipartFile signature) {
    featureToggle.assertNewFeatureIsEnabled(
        TravelMedicineFeature.CITIZEN_PORTAL_INFORMATION_STATEMENT);
    if (signature != null && signature.getSize() > MAX_SIGNATURE_SIZE) {
      throw new BadRequestException("Size of signature image too large.");
    }
    informationStatementService.patchInformationStatementForCitizenPortal(
        getCitizenUserId(principal),
        informationStatementId,
        patchInformationStatementContent,
        signature);
  }

  private UUID getCitizenUserId(Jwt principal) {
    return UUID.fromString(principal.getSubject());
  }
}
