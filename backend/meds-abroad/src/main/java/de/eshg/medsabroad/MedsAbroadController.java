/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.medsabroad;

import de.eshg.api.commons.InlineParameterObject;
import de.eshg.lib.auditlog.AuditLogger;
import de.eshg.lib.procedure.domain.model.TriggerType;
import de.eshg.medsabroad.api.CreateMedsAbroadProcedureRequest;
import de.eshg.medsabroad.api.CreateMedsAbroadProcedureResponse;
import de.eshg.medsabroad.api.GetMedsAbroadProcedureResponse;
import de.eshg.medsabroad.api.GetMedsAbroadProceduresFilterOptions;
import de.eshg.medsabroad.api.GetMedsAbroadProceduresPaginationOptions;
import de.eshg.medsabroad.api.GetMedsAbroadProceduresResponse;
import de.eshg.medsabroad.api.GetMedsAbroadProceduresSortOptions;
import de.eshg.medsabroad.api.MedsAbroadProcedureDto;
import de.eshg.medsabroad.api.UpdateCertificatePaidRequest;
import de.eshg.medsabroad.api.UpdatePersonRequest;
import de.eshg.medsabroad.aspect.ProcedureStatusTransition;
import de.eshg.medsabroad.mapper.MedsAbroadProcedureMapper;
import de.eshg.medsabroad.mapper.MedsAbroadProcedureSpecificationMapper;
import de.eshg.medsabroad.persistence.centralfile.MedsAbroadProcedureDetails;
import de.eshg.medsabroad.persistence.centralfile.PersonClient;
import de.eshg.medsabroad.persistence.database.MedsAbroadProcedure;
import de.eshg.medsabroad.persistence.database.MedsAbroadSystemProgressEntryType;
import de.eshg.medsabroad.persistence.support.MedsAbroadProcedureSpecification;
import de.eshg.medsabroad.util.ProgressEntryUtil;
import de.eshg.persistence.IntentionalWritingTransaction;
import de.eshg.rest.service.security.CurrentUserHelper;
import de.eshg.rest.service.security.config.BaseUrls.MedsAbroad;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(MedsAbroadController.BASE_URL)
@Tag(name = "MedsAbroad")
public class MedsAbroadController {
  public static final String BASE_URL = MedsAbroad.PROCEDURE_CONTROLLER;

  public final MedsAbroadService medsAbroadService;
  public final AppointmentService appointmentService;
  private final PersonClient personClient;
  private final AuditLogger auditLogger;
  private final ProgressEntryUtil progressEntryUtil;

  public MedsAbroadController(
      MedsAbroadService medsAbroadService,
      AppointmentService appointmentService,
      PersonClient personClient,
      AuditLogger auditLogger,
      ProgressEntryUtil progressEntryUtil) {
    this.medsAbroadService = medsAbroadService;
    this.appointmentService = appointmentService;
    this.personClient = personClient;
    this.auditLogger = auditLogger;
    this.progressEntryUtil = progressEntryUtil;
  }

  @PostMapping
  @Operation(summary = "Create a new meds abroad procedure.")
  @Transactional
  @IntentionalWritingTransaction(reason = "Audit logging")
  public CreateMedsAbroadProcedureResponse createMedsAbroadProcedure(
      @Valid @RequestBody CreateMedsAbroadProcedureRequest request) {
    auditLogger.log(
        "Vorgangserstellung",
        "Erstellung eines Vorgangs",
        Map.of("durch Benutzer", CurrentUserHelper.getCurrentUserId().toString()));
    MedsAbroadProcedure procedure = medsAbroadService.createProcedure();
    UUID centralFilePersonId = personClient.createPersonInCentralFile(request.person());
    medsAbroadService.addPerson(procedure, centralFilePersonId);
    appointmentService.bookAppointment(
        procedure, request.appointmentStart(), request.durationInMinutes());
    return new CreateMedsAbroadProcedureResponse(procedure.getExternalId());
  }

  @GetMapping("/{id}")
  @Operation(summary = "Get meds abroad procedure by id.")
  @Transactional
  @IntentionalWritingTransaction(reason = "Audit logging")
  public GetMedsAbroadProcedureResponse getMedsAbroadProcedure(
      @PathVariable("id") UUID procedureId) {
    auditLogger.log(
        "Vorgangsabfrage",
        "Abfrage Vorgangs-Details",
        Map.of(
            "ID des Vorgangs",
            procedureId.toString(),
            "durch Benutzer",
            CurrentUserHelper.getCurrentUserId().toString()));
    MedsAbroadProcedure procedure = medsAbroadService.findProcedureByExternalId(procedureId);
    MedsAbroadProcedureDetails procedureDetails =
        personClient.augmentProcedureWithPersonDetails(procedure);
    return MedsAbroadProcedureMapper.toInterfaceType(procedureDetails);
  }

  @GetMapping
  @Operation(summary = "Get filtered and sorted meds abroad procedures.")
  @Transactional
  @IntentionalWritingTransaction(reason = "Audit logging")
  public GetMedsAbroadProceduresResponse getMedsAbroadProcedures(
      @Valid @ParameterObject @InlineParameterObject
          GetMedsAbroadProceduresPaginationOptions paginationOptions,
      @Valid @ParameterObject @InlineParameterObject GetMedsAbroadProceduresSortOptions sortOptions,
      @Valid @ParameterObject @InlineParameterObject
          GetMedsAbroadProceduresFilterOptions filterOptions) {
    auditLogger.log(
        "Vorgangsabfrage",
        "Abfrage von Vorgänge nach Filter / Sortierung",
        Map.of(
            "Filterkriterien",
            filterOptions.toString(),
            "Sortierkriterien",
            sortOptions.toString(),
            "durch Benutzer",
            CurrentUserHelper.getCurrentUserId().toString()));

    MedsAbroadProcedureSpecification specification =
        MedsAbroadProcedureSpecificationMapper.toSpecification(filterOptions);
    PageRequest pageRequest =
        PageRequest.of(
            paginationOptions.pageNumber(),
            paginationOptions.pageSize(),
            MedsAbroadProcedureSpecificationMapper.toSortDirection(sortOptions),
            MedsAbroadProcedureSpecificationMapper.toSortProperty(sortOptions));

    Page<MedsAbroadProcedure> pageResult =
        medsAbroadService.findProcedures(specification, pageRequest);
    List<MedsAbroadProcedureDto> medsAbroadProcedureDetails =
        personClient
            .augmentProceduresWithPersonDetails(pageResult.getContent(), sortOptions)
            .map(MedsAbroadProcedureMapper::toOverviewType)
            .toList();

    return new GetMedsAbroadProceduresResponse(
        pageResult.getTotalPages(), pageResult.getTotalElements(), medsAbroadProcedureDetails);
  }

  @PutMapping("/{id}/close")
  @Operation(summary = "Close a meds abroad procedure.")
  @Transactional
  @ProcedureStatusTransition
  public void closeProcedure(@PathVariable("id") UUID procedureId) {
    MedsAbroadProcedure procedure = medsAbroadService.findProcedureByExternalId(procedureId);
    medsAbroadService.closeProcedure(procedure);
    progressEntryUtil.addProgressEntry(
        procedure, MedsAbroadSystemProgressEntryType.PROCEDURE_CLOSED, TriggerType.EMPLOYEE);
  }

  @PutMapping("/{id}/cancel")
  @Operation(summary = "Cancel a meds abroad procedure.")
  @Transactional
  @ProcedureStatusTransition
  public void cancelProcedure(@PathVariable("id") UUID procedureId) {
    MedsAbroadProcedure procedure = medsAbroadService.findProcedureByExternalId(procedureId);
    medsAbroadService.cancelProcedure(procedure);
    appointmentService.cancelAppointment(procedure);
    progressEntryUtil.addProgressEntry(
        procedure, MedsAbroadSystemProgressEntryType.PROCEDURE_CANCELED, TriggerType.EMPLOYEE);
  }

  @PutMapping("/{id}/reopen")
  @Operation(summary = "Reopen a meds abroad procedure.")
  @Transactional
  @ProcedureStatusTransition
  public void reopenProcedure(@PathVariable("id") UUID procedureId) {
    MedsAbroadProcedure procedure = medsAbroadService.findProcedureByExternalId(procedureId);
    medsAbroadService.reopenProcedure(procedure);
    progressEntryUtil.addProgressEntry(
        procedure, MedsAbroadSystemProgressEntryType.PROCEDURE_REOPENED, TriggerType.EMPLOYEE);
  }

  @PutMapping("/{id}/person")
  @Operation(summary = "Updates person of a meds abroad procedure.")
  @Transactional
  public void updatePerson(
      @PathVariable("id") UUID procedureId, @Valid @RequestBody UpdatePersonRequest request) {
    MedsAbroadProcedure procedure = medsAbroadService.findProcedureByExternalId(procedureId);
    personClient.updatePersonInCentralFile(request, procedure);
    progressEntryUtil.addProgressEntry(
        procedure, MedsAbroadSystemProgressEntryType.PERSON_DETAILS_UPDATED, TriggerType.EMPLOYEE);
  }

  @PutMapping("/{id}/certificate-paid")
  @Operation(summary = "Updates certificate paid data of a meds abroad procedure.")
  @Transactional
  public void updateCertificatePaid(
      @PathVariable("id") UUID procedureId,
      @Valid @RequestBody UpdateCertificatePaidRequest request) {
    MedsAbroadProcedure procedure = medsAbroadService.findProcedureByExternalId(procedureId);
    procedure.setCertificatePaid(request.certificatePaid());
  }
}
