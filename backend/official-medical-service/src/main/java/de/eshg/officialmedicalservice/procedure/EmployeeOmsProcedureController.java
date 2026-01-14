/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.officialmedicalservice.procedure;

import static org.springframework.http.MediaType.MULTIPART_FORM_DATA_VALUE;

import de.eshg.api.commons.InlineParameterObject;
import de.eshg.lib.procedure.api.ProcedureSearchParameters;
import de.eshg.officialmedicalservice.anamnesis.api.GetAnamnesisResponse;
import de.eshg.officialmedicalservice.anamnesis.api.UpdateAnamnesisRequest;
import de.eshg.officialmedicalservice.appointment.OmsAppointmentService;
import de.eshg.officialmedicalservice.appointment.api.PostOmsAppointmentRequest;
import de.eshg.officialmedicalservice.document.OmsDocumentService;
import de.eshg.officialmedicalservice.document.api.GetDocumentsResponse;
import de.eshg.officialmedicalservice.document.api.PostDocumentRequest;
import de.eshg.officialmedicalservice.procedure.api.AcceptDraftProcedureResponse;
import de.eshg.officialmedicalservice.procedure.api.EmployeeOmsProcedureDetailsDto;
import de.eshg.officialmedicalservice.procedure.api.EmployeeOmsProcedureHeaderDto;
import de.eshg.officialmedicalservice.procedure.api.EmployeeOmsProcedurePaginationAndSortParameters;
import de.eshg.officialmedicalservice.procedure.api.EmployeePagedOmsProcedures;
import de.eshg.officialmedicalservice.procedure.api.GetEmployeeOmsProcedureOverviewResponse;
import de.eshg.officialmedicalservice.procedure.api.GetOmsProceduresFilterOptionsDto;
import de.eshg.officialmedicalservice.procedure.api.HumanReadablePersonIdSearchParameters;
import de.eshg.officialmedicalservice.procedure.api.MergeAffectedPersonRequest;
import de.eshg.officialmedicalservice.procedure.api.PatchAcceptDraftProcedureRequest;
import de.eshg.officialmedicalservice.procedure.api.PatchAdditionalInfoRequest;
import de.eshg.officialmedicalservice.procedure.api.PatchAffectedPersonRequest;
import de.eshg.officialmedicalservice.procedure.api.PatchEmployeeOmsProcedureFacilityRequest;
import de.eshg.officialmedicalservice.procedure.api.PatchMedicalOpinionStatusRequest;
import de.eshg.officialmedicalservice.procedure.api.PostEmployeeOmsProcedureFacilityRequest;
import de.eshg.officialmedicalservice.procedure.api.PostEmployeeOmsProcedureRequest;
import de.eshg.officialmedicalservice.procedure.api.ProcedureLabCodeSearchParameters;
import de.eshg.officialmedicalservice.procedure.api.SyncAffectedPersonRequest;
import de.eshg.officialmedicalservice.procedure.api.SyncFacilityRequest;
import de.eshg.officialmedicalservice.waitingroom.WaitingRoomService;
import de.eshg.officialmedicalservice.waitingroom.api.WaitingRoomDto;
import de.eshg.rest.service.security.config.BaseUrls;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping(
    path = EmployeeOmsProcedureController.BASE_URL,
    produces = MediaType.APPLICATION_JSON_VALUE)
@Tag(name = "EmployeeOmsProcedure")
public class EmployeeOmsProcedureController {
  public static final String BASE_URL = BaseUrls.OfficialMedicalService.EMPLOYEE_API;
  public static final String PROCEDURES_URL = "/procedures";
  public static final String AFFECTED_PERSON_URL = "/affected-person";
  public static final String SYNC_AFFECTED_PERSON_URL = "/sync-affected-person";
  public static final String SYNC_FACILITY_URL = "/sync-facility";
  public static final String ADDITIONAL_INFO_URL = "/additional-info";
  public static final String ACCEPT_DRAFT_URL = "/accept-draft";
  public static final String CLOSE_PROCEDURE_URL = "/close";
  public static final String APPOINTMENT_URL = "/appointment";
  public static final String DOCUMENT_URL = "/document";
  public static final String MEDICAL_OPINION_STATUS_URL = "/medical-opinion-status";
  public static final String WAITING_ROOM_URL = "/waiting-room";
  public static final String ANAMNESIS_URL = "/anamnesis";
  public static final String CUTOFF_DATE_URL = "/cut-off-date";
  public static final String MERGE_AFFECTED_PERSON_URL = "/merge-affected-person";

  private final EmployeeOmsProcedureService employeeOmsProcedureService;
  private final OmsAppointmentService omsAppointmentService;
  private final OmsDocumentService omsDocumentService;
  private final WaitingRoomService waitingRoomService;

  public EmployeeOmsProcedureController(
      EmployeeOmsProcedureService employeeOmsProcedureService,
      OmsAppointmentService omsAppointmentService,
      OmsDocumentService omsDocumentService,
      WaitingRoomService waitingRoomService) {
    this.employeeOmsProcedureService = employeeOmsProcedureService;
    this.omsAppointmentService = omsAppointmentService;
    this.omsDocumentService = omsDocumentService;
    this.waitingRoomService = waitingRoomService;
  }

  @PostMapping(path = PROCEDURES_URL)
  @Operation(summary = "Save a new employee oms procedure")
  public UUID postEmployeeProcedure(@RequestBody @Valid PostEmployeeOmsProcedureRequest request) {
    return employeeOmsProcedureService.createEmployeeProcedure(request);
  }

  @GetMapping(path = PROCEDURES_URL + "/{id}/header")
  @Operation(summary = "Get details of an oms procedure")
  public EmployeeOmsProcedureHeaderDto getEmployeeProcedureHeader(
      @PathVariable("id") UUID externalId) {
    return employeeOmsProcedureService.getEmployeeProcedureHeader(externalId);
  }

  @GetMapping(path = PROCEDURES_URL + "/{id}/details")
  @Operation(summary = "Get details of an oms procedure")
  public EmployeeOmsProcedureDetailsDto getEmployeeProcedureDetails(
      @PathVariable("id") UUID externalId) {
    return employeeOmsProcedureService.getEmployeeProcedureDetails(externalId);
  }

  @GetMapping(path = PROCEDURES_URL)
  @Operation(summary = "Get all oms procedures")
  public GetEmployeeOmsProcedureOverviewResponse getAllEmployeeProcedures(
      @InlineParameterObject @ParameterObject @Valid GetOmsProceduresFilterOptionsDto filters,
      @InlineParameterObject @ParameterObject @Valid
          EmployeeOmsProcedurePaginationAndSortParameters paginationAndSortParameters,
      @InlineParameterObject @ParameterObject @Valid ProcedureSearchParameters searchParameters,
      @InlineParameterObject @ParameterObject @Valid
          ProcedureLabCodeSearchParameters labCodeSearchParameters,
      @InlineParameterObject @ParameterObject @Valid
          HumanReadablePersonIdSearchParameters humanReadablePersonIdSearchParameters) {
    EmployeePagedOmsProcedures pagedOmsProcedures =
        employeeOmsProcedureService.getEmployeeProceduresOverview(
            filters,
            paginationAndSortParameters,
            searchParameters,
            labCodeSearchParameters,
            humanReadablePersonIdSearchParameters);
    int medicalOpinionLeadTime = employeeOmsProcedureService.getCutOffDateLeadTime();
    return new GetEmployeeOmsProcedureOverviewResponse(
        pagedOmsProcedures.proceduresPage(),
        pagedOmsProcedures.totalNumberOfProcedures(),
        medicalOpinionLeadTime);
  }

  @PatchMapping(path = PROCEDURES_URL + "/{procedureId}" + AFFECTED_PERSON_URL)
  @Operation(summary = "Update affected person in an oms procedure")
  public void updateAffectedPerson(
      @PathVariable("procedureId") UUID externalId,
      @RequestBody @Valid PatchAffectedPersonRequest patchAffectedPersonRequest) {
    employeeOmsProcedureService.updateAffectedPerson(externalId, patchAffectedPersonRequest);
  }

  @PutMapping(path = PROCEDURES_URL + "/{procedureId}" + SYNC_AFFECTED_PERSON_URL)
  @Operation(summary = "Synchronize affected person data")
  public void syncAffectedPerson(
      @PathVariable("procedureId") UUID procedureId,
      @Valid @RequestBody SyncAffectedPersonRequest request) {
    employeeOmsProcedureService.syncAffectedPerson(procedureId, request);
  }

  @PostMapping(path = PROCEDURES_URL + "/{id}/facility")
  @Operation(summary = "Add facility to a draft oms procedure")
  public UUID postFacility(
      @PathVariable("id") UUID id,
      @Valid @RequestBody PostEmployeeOmsProcedureFacilityRequest request) {
    return employeeOmsProcedureService.addFacility(id, request);
  }

  @PatchMapping(path = PROCEDURES_URL + "/{id}/facility")
  @Operation(summary = "Updates a facility")
  public void patchFacility(
      @PathVariable("id") UUID externalId,
      @Valid @RequestBody PatchEmployeeOmsProcedureFacilityRequest request) {
    employeeOmsProcedureService.updateFacility(externalId, request);
  }

  @PutMapping(path = PROCEDURES_URL + "/{id}" + SYNC_FACILITY_URL)
  @Operation(summary = "Synchronize facility data")
  public void syncFacilityData(
      @PathVariable("id") UUID procedureId, @Valid @RequestBody SyncFacilityRequest request) {
    employeeOmsProcedureService.syncFacilityData(procedureId, request);
  }

  @DeleteMapping(path = PROCEDURES_URL + "/{id}")
  @Operation(summary = "Abort draft oms procedure")
  public void abortDraftProcedure(@PathVariable("id") UUID externalId) {
    employeeOmsProcedureService.abortDraftProcedure(externalId);
  }

  @PatchMapping(path = PROCEDURES_URL + "/{id}" + ADDITIONAL_INFO_URL)
  @Operation(summary = "Update additional info of an oms procedure")
  public void updateAdditionalInfo(
      @PathVariable("id") UUID externalId, @Valid @RequestBody PatchAdditionalInfoRequest request) {
    employeeOmsProcedureService.updateAdditionalInfo(externalId, request);
  }

  @PatchMapping(path = PROCEDURES_URL + "/{id}" + ACCEPT_DRAFT_URL)
  @Operation(summary = "Accept draft oms procedure")
  public AcceptDraftProcedureResponse acceptDraftProcedure(
      @PathVariable("id") UUID procedureId,
      @Valid @RequestBody PatchAcceptDraftProcedureRequest request) {
    return employeeOmsProcedureService.acceptDraftProcedure(procedureId, request);
  }

  @PatchMapping(path = PROCEDURES_URL + "/{id}" + CLOSE_PROCEDURE_URL)
  @Operation(summary = "Close open oms procedure")
  public void closeOpenProcedure(@PathVariable("id") UUID procedureId) {
    employeeOmsProcedureService.closeOpenProcedure(procedureId);
  }

  @PostMapping(path = PROCEDURES_URL + "/{id}" + APPOINTMENT_URL)
  @Operation(summary = "Create a new appointment")
  public UUID postAppointment(
      @PathVariable("id") UUID procedureId, @Valid @RequestBody PostOmsAppointmentRequest request) {
    return omsAppointmentService.addAppointmentEmployee(procedureId, request);
  }

  @PostMapping(path = PROCEDURES_URL + "/{id}" + DOCUMENT_URL, consumes = MULTIPART_FORM_DATA_VALUE)
  @Operation(summary = "Add a document to an oms procedure")
  public UUID postDocument(
      @PathVariable("id") UUID id,
      @RequestPart("postDocumentRequest") @Valid PostDocumentRequest request,
      @RequestPart(value = "files", required = false) List<MultipartFile> files,
      @RequestPart(value = "note", required = false) String note) {
    return omsDocumentService.addDocumentEmployee(
        id, request, Optional.ofNullable(files).orElse(Collections.emptyList()), note);
  }

  @GetMapping(path = PROCEDURES_URL + "/{id}" + DOCUMENT_URL)
  @Operation(summary = "Get all documents for one oms procedure")
  public GetDocumentsResponse getAllDocuments(@PathVariable("id") UUID id) {
    return employeeOmsProcedureService.getAllDocuments(id);
  }

  @PatchMapping(path = PROCEDURES_URL + "/{id}" + MEDICAL_OPINION_STATUS_URL)
  @Operation(summary = "Updates the medical opinion status of a oms procedure")
  public void patchMedicalOpinionStatus(
      @PathVariable("id") UUID externalId,
      @Valid @RequestBody PatchMedicalOpinionStatusRequest request) {
    employeeOmsProcedureService.updateMedicalOpinionStatus(externalId, request);
  }

  @PatchMapping(path = PROCEDURES_URL + "/{id}" + WAITING_ROOM_URL)
  @Operation(summary = "Update waiting room details for a procedure")
  public void patchWaitingRoom(
      @PathVariable("id") UUID id, @Valid @RequestBody WaitingRoomDto request) {
    waitingRoomService.updateWaitingRoom(id, request);
  }

  @PatchMapping(path = PROCEDURES_URL + "/{id}" + ANAMNESIS_URL)
  @Operation(summary = "Update anamnesis")
  public void patchAnamnesis(
      @PathVariable("id") UUID id, @Valid @RequestBody UpdateAnamnesisRequest request) {
    employeeOmsProcedureService.updateAnamnesis(id, request);
  }

  @GetMapping(path = PROCEDURES_URL + "/{id}" + ANAMNESIS_URL)
  @Operation(summary = "Get anamnesis")
  public GetAnamnesisResponse getAnamnesis(@PathVariable("id") UUID id) {
    return employeeOmsProcedureService.getAnamnesis(id);
  }

  @PatchMapping(path = PROCEDURES_URL + "/{id}" + MERGE_AFFECTED_PERSON_URL)
  @Operation(summary = "Merge external affected person with existing person accept it as a new one")
  public void mergeAffectedPerson(
      @PathVariable("id") UUID id, @Valid @RequestBody MergeAffectedPersonRequest request) {
    employeeOmsProcedureService.mergeAffectedPerson(id, request);
  }
}
