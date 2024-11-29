/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.measlesprotection;

import de.eshg.api.commons.InlineParameterObject;
import de.eshg.base.centralfile.api.person.AddPersonFileStateRequest;
import de.eshg.lib.auditlog.AuditLogger;
import de.eshg.measlesprotection.api.CaseStatusDto;
import de.eshg.measlesprotection.api.GetMeaslesProtectionProceduresFilterOptions;
import de.eshg.measlesprotection.api.GetMeaslesProtectionProceduresPaginationOptions;
import de.eshg.measlesprotection.api.GetMeaslesProtectionProceduresResponse;
import de.eshg.measlesprotection.api.GetMeaslesProtectionProceduresSortOptions;
import de.eshg.measlesprotection.api.GetProceduresForPersonRequest;
import de.eshg.measlesprotection.api.GetProceduresForPersonResponse;
import de.eshg.measlesprotection.api.ProtectionProcedureDto;
import de.eshg.measlesprotection.api.UpdateProcedureRequest;
import de.eshg.measlesprotection.mapper.GetProceduresForPersonMapper;
import de.eshg.measlesprotection.mapper.ToDtoMappers;
import de.eshg.measlesprotection.persistence.centralfile.ProcedureDetailsData;
import de.eshg.measlesprotection.persistence.db.MeaslesProtectionProcedure;
import de.eshg.measlesprotection.persistence.support.ResultPage;
import de.eshg.measlesprotection.validation.ProtectedProcedure;
import de.eshg.rest.service.security.CurrentUserHelper;
import de.eshg.rest.service.security.config.BaseUrls;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = ProtectionProcedureController.BASE_URL)
@Tag(name = "ProtectionProcedure")
public class ProtectionProcedureController {

  public static final String BASE_URL = BaseUrls.MeaslesProtection.PROCEDURE_CONTROLLER;

  private final MeaslesProtectionService measlesProtectionService;
  private final GetProceduresForPersonMapper getProceduresForPersonMapper;
  private final AuditLogger auditLogger;

  public ProtectionProcedureController(
      MeaslesProtectionService measlesProtectionService,
      GetProceduresForPersonMapper getProceduresForPersonMapper,
      AuditLogger auditLogger) {
    this.measlesProtectionService = measlesProtectionService;
    this.getProceduresForPersonMapper = getProceduresForPersonMapper;
    this.auditLogger = auditLogger;
  }

  @PutMapping("/{id}")
  @Operation(summary = "Update a measles protection procedure.")
  public ProtectionProcedureDto updateProcedure(
      @PathVariable("id") @ProtectedProcedure UUID id,
      @Valid @RequestBody UpdateProcedureRequest request) {
    ProcedureDetailsData procedureDetails = measlesProtectionService.updateProcedure(id, request);
    return ToDtoMappers.toProcedureDetails(procedureDetails);
  }

  @PatchMapping("/{id}/case-status")
  @Operation(summary = "Update the case status of a measles protection procedure.")
  public ProtectionProcedureDto updateCaseStatus(
      @PathVariable("id") @ProtectedProcedure UUID id, @Valid @RequestBody CaseStatusDto request) {
    ProcedureDetailsData procedureDetails = measlesProtectionService.updateCaseStatus(id, request);
    return ToDtoMappers.toProcedureDetails(procedureDetails);
  }

  @GetMapping("/{id}")
  @Operation(summary = "Get measles protection procedure by id.")
  public ProtectionProcedureDto getProcedure(@PathVariable("id") UUID id) {
    ProcedureDetailsData procedureDetails =
        measlesProtectionService.findAndAugmentProcedureByExternalId(id);
    auditLogger.log(
        "Vorgangsbearbeitung",
        "Abfrage Vorgangs-Details",
        Map.of(
            "ID des Vorgangs",
            id.toString(),
            "durch Benutzer",
            CurrentUserHelper.getCurrentUserId().toString()));
    return ToDtoMappers.toProcedureDetails(procedureDetails);
  }

  @GetMapping
  @Operation(summary = "Get all open measles protection procedures.")
  public GetMeaslesProtectionProceduresResponse getProcedures(
      @Valid @ParameterObject @InlineParameterObject
          GetMeaslesProtectionProceduresPaginationOptions paginationOptions,
      @Valid @ParameterObject @InlineParameterObject
          GetMeaslesProtectionProceduresSortOptions sortOptions,
      @Valid @ParameterObject @InlineParameterObject
          GetMeaslesProtectionProceduresFilterOptions filterOptions) {
    ResultPage<ProcedureDetailsData> detailsDataPage =
        measlesProtectionService.getProcedures(paginationOptions, sortOptions, filterOptions);
    List<ProtectionProcedureDto> procedures =
        detailsDataPage.elements().stream().map(ToDtoMappers::toProcedureDetails).toList();
    return new GetMeaslesProtectionProceduresResponse(
        detailsDataPage.totalPages(), detailsDataPage.totalElements(), procedures);
  }

  @PostMapping("/for-person")
  @Operation(summary = "Get all measles protection procedures for a given person.")
  public GetProceduresForPersonResponse getProceduresForPerson(
      @Valid @RequestBody GetProceduresForPersonRequest request) {
    AddPersonFileStateRequest person = request.person();
    List<MeaslesProtectionProcedure> procedures =
        measlesProtectionService.getProceduresForPerson(
            person.firstName(), person.lastName(), person.dateOfBirth());
    return getProceduresForPersonMapper.map(procedures);
  }
}
