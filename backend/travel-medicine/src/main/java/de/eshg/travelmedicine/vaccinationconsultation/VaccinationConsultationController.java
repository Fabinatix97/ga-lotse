/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.vaccinationconsultation;

import de.eshg.lib.procedure.model.ProcedureStatusDto;
import de.eshg.rest.service.security.config.BaseUrls;
import de.eshg.travelmedicine.certificate.CertificateService;
import de.eshg.travelmedicine.certificate.api.GetCertificatesResponse;
import de.eshg.travelmedicine.certificate.api.PostPutCertificateRequest;
import de.eshg.travelmedicine.featuretoggle.TravelMedicineFeature;
import de.eshg.travelmedicine.featuretoggle.TravelMedicineFeatureToggle;
import de.eshg.travelmedicine.vaccinationconsultation.api.GetAppointmentOverviewResponse;
import de.eshg.travelmedicine.vaccinationconsultation.api.GetAssignableServicesResponse;
import de.eshg.travelmedicine.vaccinationconsultation.api.GetAvailableAppointmentsResponse;
import de.eshg.travelmedicine.vaccinationconsultation.api.GetMedicalHistoriesResponse;
import de.eshg.travelmedicine.vaccinationconsultation.api.GetStepsWithAppliedServicesResponse;
import de.eshg.travelmedicine.vaccinationconsultation.api.GetVaccinationConsultationDetailsResponse;
import de.eshg.travelmedicine.vaccinationconsultation.api.PatchOtherServiceRequest;
import de.eshg.travelmedicine.vaccinationconsultation.api.PatchServiceAssignmentRequest;
import de.eshg.travelmedicine.vaccinationconsultation.api.PatchVaccinationConsultationPatientRequest;
import de.eshg.travelmedicine.vaccinationconsultation.api.PatchVaccinationConsultationTravelDetailsRequest;
import de.eshg.travelmedicine.vaccinationconsultation.api.PatchVaccinationRequest;
import de.eshg.travelmedicine.vaccinationconsultation.api.PostInformationStatementsRequest;
import de.eshg.travelmedicine.vaccinationconsultation.api.PostProcedureStepRequest;
import de.eshg.travelmedicine.vaccinationconsultation.api.PostServicesRequest;
import de.eshg.travelmedicine.vaccinationconsultation.api.PostVaccinationConsultationRequest;
import de.eshg.travelmedicine.vaccinationconsultation.api.SearchVaccinationConsultationResponse;
import de.eshg.travelmedicine.vaccinationconsultation.api.SyncPersonRequest;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.time.LocalDate;
import java.util.UUID;
import org.apache.commons.lang3.StringUtils;
import org.springframework.http.MediaType;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(
    path = VaccinationConsultationController.BASE_URL,
    produces = MediaType.APPLICATION_JSON_VALUE)
@Tag(name = "VaccinationConsultation")
public class VaccinationConsultationController {
  public static final String BASE_URL = BaseUrls.TravelMedicine.VACCINATION_CONSULTATION_CONTROLLER;
  public static final String PROCEDURE_STEP_URL = "/procedure-steps";
  public static final String APPOINTMENT_OVERVIEW = "/appointment-overview";
  public static final String PATIENT_URL = "/patient";
  public static final String TRAVEL_DETAILS_URL = "/travel-details";
  public static final String SERVICE_URL = "/services";
  public static final String OTHER_SERVICE_URL = "/other-services";
  public static final String VACCINATION_URL = "/vaccinations";
  public static final String DETAILS_URL = "/details";
  public static final String AVAILABLE_APPOINTMENTS_URL = "/available-appointments";
  public static final String ASSIGNABLE_SERVICES_URL = "/assignable-services";
  public static final String ASSIGN_STEP_URL = "/assign-step";
  public static final String UNASSIGN_STEP_URL = "/unassign-step";
  public static final String CERTIFICATES_URL = "/certificates";
  public static final String MEDICAL_HISTORY_URL = "/medical-histories";
  public static final String STEPS_WITH_APPLIED_SERVICES = "/stepsWithAppliedServices";
  public static final String STATUS = "/status";
  public static final String INFORMATION_STATEMENT_URL = "/information-statements";
  public static final String SYNC_PERSON_URL = "/sync-person";
  private final TravelMedicineFeatureToggle featureToggle;
  private final VaccinationConsultationService vaccinationConsultationService;
  private final ProcedureStepService procedureStepService;
  private final CertificateService certificateService;

  public VaccinationConsultationController(
      VaccinationConsultationService vaccinationConsultationService,
      ProcedureStepService procedureStepService,
      CertificateService certificateService,
      TravelMedicineFeatureToggle featureToggle) {
    this.vaccinationConsultationService = vaccinationConsultationService;
    this.procedureStepService = procedureStepService;
    this.certificateService = certificateService;
    this.featureToggle = featureToggle;
  }

  @GetMapping(path = APPOINTMENT_OVERVIEW)
  @Operation(
      summary =
          "Get list of all procedure appointment summaries in a time range, sorted by appointment date")
  @Transactional(readOnly = true)
  public GetAppointmentOverviewResponse getAllProcedureAppointmentSummaries(
      @RequestParam(name = "dateRangeStart") LocalDate dateRangeStart,
      @RequestParam(name = "dateRangeEnd") LocalDate dateRangeEnd) {
    return vaccinationConsultationService.getAllProcedureAppointmentSummaries(
        dateRangeStart, dateRangeEnd);
  }

  @PostMapping()
  @Operation(summary = "Save a new vaccination consultation")
  @Transactional
  public UUID postVaccinationConsultation(
      @RequestBody @Valid PostVaccinationConsultationRequest postVaccinationConsultationRequest) {
    return vaccinationConsultationService.createProcedure(postVaccinationConsultationRequest);
  }

  @PatchMapping(path = "/{procedureId}" + PATIENT_URL)
  @Operation(summary = "Update patient in a vaccination consultation")
  @Transactional
  public void updatePatient(
      @PathVariable("procedureId") UUID externalId,
      @RequestBody @Valid PatchVaccinationConsultationPatientRequest patientRequest) {
    vaccinationConsultationService.updatePatient(externalId, patientRequest);
  }

  @PatchMapping(path = "/{procedureId}" + TRAVEL_DETAILS_URL)
  @Operation(summary = "Update travel details in a vaccination consultation")
  @Transactional
  public void updateTravelDetails(
      @PathVariable("procedureId") UUID externalId,
      @RequestBody @Valid PatchVaccinationConsultationTravelDetailsRequest patchRequest) {
    vaccinationConsultationService.updateTravelDetails(externalId, patchRequest);
  }

  @PostMapping(path = "/{id}" + PROCEDURE_STEP_URL)
  @Operation(summary = "Add procedure step to vaccination consultation with given id")
  @Transactional
  public UUID addProcedureStep(
      @PathVariable("id") UUID externalId,
      @RequestBody @Valid PostProcedureStepRequest procedureStepRequest) {
    return procedureStepService.createProcedureStep(externalId, procedureStepRequest);
  }

  @GetMapping(path = "/{procedureId}" + DETAILS_URL)
  @Operation(summary = "Get vaccination consultation details")
  @Transactional(readOnly = true)
  public GetVaccinationConsultationDetailsResponse getVaccinationConsultationDetails(
      @PathVariable("procedureId") UUID procedureId) {
    return vaccinationConsultationService.getVaccinationConsultationDetails(procedureId);
  }

  @Operation(summary = "Search VaccinationConsultation, max. 50 results.")
  @GetMapping("")
  @Transactional(readOnly = true)
  public SearchVaccinationConsultationResponse searchVaccinationConsultation(
      @RequestParam(name = "firstName", required = false) String firstName,
      @RequestParam(name = "lastName", required = false) String lastName,
      @RequestParam(name = "dateOfBirth", required = false) LocalDate dateOfBirth,
      @RequestParam(name = "procedureStatus", required = false)
          ProcedureStatusDto procedureStatus) {
    return vaccinationConsultationService.searchVaccinationConsultation(
        StringUtils.trimToNull(firstName),
        StringUtils.trimToNull(lastName),
        dateOfBirth,
        procedureStatus);
  }

  @GetMapping(path = "/{procedureId}" + AVAILABLE_APPOINTMENTS_URL)
  @Operation(summary = "Get list of all appointments which are available to assign services")
  @Transactional(readOnly = true)
  public GetAvailableAppointmentsResponse getAllAvailableAppointments(
      @PathVariable("procedureId") UUID procedureId) {
    return vaccinationConsultationService.getAllAvailableAppointments(procedureId);
  }

  @PatchMapping(path = "/{procedureId}" + SERVICE_URL + "/{serviceId}" + ASSIGN_STEP_URL)
  @Operation(summary = "Assign a procedure step to a service (vaccination/other service)")
  @Transactional
  public void assignStepToService(
      @PathVariable("procedureId") UUID procedureId,
      @PathVariable("serviceId") UUID serviceId,
      @Valid @RequestBody PatchServiceAssignmentRequest request) {
    vaccinationConsultationService.assignProcedureStepToService(
        procedureId, request.procedureStepId(), serviceId);
  }

  @PatchMapping(path = "/{procedureId}" + SERVICE_URL + "/{serviceId}" + UNASSIGN_STEP_URL)
  @Operation(summary = "Unassign a procedure step from a service (vaccination/other service)")
  @Transactional
  public void unassignStepToService(
      @PathVariable("procedureId") UUID procedureId, @PathVariable("serviceId") UUID serviceId) {
    vaccinationConsultationService.unassignProcedureStepFromService(procedureId, serviceId);
  }

  @GetMapping(path = "/{procedureId}" + ASSIGNABLE_SERVICES_URL)
  @Operation(
      summary = "Get list of all assignable services, which can be assigned to a procedure step")
  @Transactional(readOnly = true)
  public GetAssignableServicesResponse getAllAssignableServices(
      @PathVariable("procedureId") UUID procedureId) {

    return vaccinationConsultationService.getAllAssignableServices(procedureId);
  }

  @PostMapping(path = "/{procedureId}" + SERVICE_URL)
  @Operation(summary = "Add a list of vaccinations and other services to a procedure")
  @Transactional
  public void postServices(
      @PathVariable("procedureId") UUID procedureId,
      @RequestBody @Valid PostServicesRequest request) {
    vaccinationConsultationService.createServices(
        procedureId,
        request.procedureStepId(),
        request.postVaccinationRequests(),
        request.postOtherServiceRequests());
  }

  @DeleteMapping(path = "/{procedureId}" + SERVICE_URL + "/{serviceId}")
  @Operation(summary = "Remove a service from a procedure")
  @Transactional
  public void deleteService(
      @PathVariable("procedureId") UUID procedureId, @PathVariable("serviceId") UUID serviceId) {
    vaccinationConsultationService.deleteService(procedureId, serviceId);
  }

  @PatchMapping(path = "/{procedureId}" + OTHER_SERVICE_URL + "/{serviceId}")
  @Operation(summary = "Modifies an other service for a procedure step")
  @Transactional
  public void patchOtherService(
      @PathVariable("procedureId") UUID procedureId,
      @PathVariable("serviceId") UUID serviceId,
      @RequestBody @Valid PatchOtherServiceRequest patchOtherServiceRequest) {
    vaccinationConsultationService.updateOtherService(
        procedureId, serviceId, patchOtherServiceRequest);
  }

  @PatchMapping(path = "/{procedureId}" + VACCINATION_URL + "/{serviceId}")
  @Operation(summary = "Adds vaccination date and batch identifier to a vaccination")
  @Transactional
  public void patchVaccination(
      @PathVariable("procedureId") UUID procedureId,
      @PathVariable("serviceId") UUID serviceId,
      @RequestBody @Valid PatchVaccinationRequest patchVaccinationRequest) {
    vaccinationConsultationService.updateVaccination(
        procedureId, serviceId, patchVaccinationRequest);
  }

  @GetMapping(path = "/{procedureId}" + CERTIFICATES_URL)
  @Operation(summary = "Gets all certificates of a vaccination consultation")
  @Transactional(readOnly = true)
  public GetCertificatesResponse getCertificates(@PathVariable("procedureId") UUID procedureId) {
    return certificateService.getCertificates(procedureId);
  }

  @PostMapping(path = "/{procedureId}" + CERTIFICATES_URL)
  @Operation(summary = "Adds a new certificate")
  @Transactional
  public void postCertificate(
      @PathVariable("procedureId") UUID procedureId,
      @Valid @RequestBody PostPutCertificateRequest request) {
    certificateService.createCertificate(procedureId, request);
  }

  @GetMapping(path = "/{procedureId}" + MEDICAL_HISTORY_URL)
  @Operation(summary = "Get medical histories for this VaccinationConsultation.")
  @Transactional
  public GetMedicalHistoriesResponse getMedicalHistories(
      @PathVariable("procedureId") UUID procedureId) {
    return vaccinationConsultationService.getMedicalHistories(procedureId);
  }

  @GetMapping(path = "/{procedureId}" + STEPS_WITH_APPLIED_SERVICES)
  @Operation(
      summary =
          "Collect all services which have been applied to any of (and grouped by) the VaccinationConsultation's steps.")
  @Transactional
  public GetStepsWithAppliedServicesResponse getStepsWithAppliedServices(
      @PathVariable("procedureId") UUID procedureId) {
    return vaccinationConsultationService.getStepsWithAppliedServices(procedureId);
  }

  @GetMapping(path = "/{procedureId}" + STATUS)
  @Operation(summary = "Retrieve the current state of the procedure.")
  @Transactional
  public ProcedureStatusDto getStatus(@PathVariable("procedureId") UUID procedureId) {
    return vaccinationConsultationService.getProcedureStatus(procedureId);
  }

  @PatchMapping(path = "/{procedureId}" + STATUS)
  @Operation(summary = "Change the current state of the procedure.")
  @Transactional
  public void patchStatus(
      @PathVariable("procedureId") UUID procedureId,
      @Valid @RequestBody ProcedureStatusDto request) {
    vaccinationConsultationService.updateProcedureStatus(procedureId, request);
  }

  @PostMapping(path = "/{procedureId}" + INFORMATION_STATEMENT_URL)
  @Operation(summary = "Add information statements to a procedure")
  @Transactional
  public void postInformationStatements(
      @PathVariable("procedureId") UUID procedureId,
      @Valid @RequestBody PostInformationStatementsRequest request) {
    featureToggle.assertNewFeatureIsEnabled(
        TravelMedicineFeature.CITIZEN_PORTAL_INFORMATION_STATEMENT);
    vaccinationConsultationService.addInformationStatements(procedureId, request);
  }

  @DeleteMapping(path = "/{procedureId}" + INFORMATION_STATEMENT_URL + "/{informationStatementId}")
  @Operation(summary = "Remove an information statement from the procedure and delete it")
  @Transactional
  public void deleteInformationStatement(
      @PathVariable("procedureId") UUID procedureId,
      @PathVariable("informationStatementId") UUID informationStatementId) {
    featureToggle.assertNewFeatureIsEnabled(
        TravelMedicineFeature.CITIZEN_PORTAL_INFORMATION_STATEMENT);
    vaccinationConsultationService.deleteInformationStatement(procedureId, informationStatementId);
  }

  @PutMapping("/{procedureId}" + SYNC_PERSON_URL)
  @Operation(summary = "Synchronize patient (person) data")
  @Transactional
  public void syncPersonData(
      @PathVariable("procedureId") UUID procedureId,
      @Valid @RequestBody SyncPersonRequest request) {
    vaccinationConsultationService.syncPersonData(procedureId, request);
  }
}
