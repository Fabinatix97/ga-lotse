/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.measlesprotection;

import de.eshg.api.commons.InlineParameterObject;
import de.eshg.base.centralfile.api.facility.PutFacilityRequest;
import de.eshg.base.feature.BaseFeature;
import de.eshg.base.feature.BaseFeatureTogglesApi;
import de.eshg.lib.auditlog.AuditLogger;
import de.eshg.measlesprotection.api.CaseStatusDto;
import de.eshg.measlesprotection.api.GetMeaslesProtectionProceduresFilterOptions;
import de.eshg.measlesprotection.api.GetMeaslesProtectionProceduresPaginationOptions;
import de.eshg.measlesprotection.api.GetMeaslesProtectionProceduresResponse;
import de.eshg.measlesprotection.api.GetMeaslesProtectionProceduresSortOptions;
import de.eshg.measlesprotection.api.GetProceduresForPersonResponse;
import de.eshg.measlesprotection.api.PatchAffectedPersonRequest;
import de.eshg.measlesprotection.api.PatchCustodianRequest;
import de.eshg.measlesprotection.api.ProtectionProcedureDto;
import de.eshg.measlesprotection.api.SyncAffectedPersonRequest;
import de.eshg.measlesprotection.api.SyncCustodianRequest;
import de.eshg.measlesprotection.api.SyncFacilityRequest;
import de.eshg.measlesprotection.api.UpdateProcedureRequest;
import de.eshg.measlesprotection.api.draft.AffectedPersonDetailsDto;
import de.eshg.measlesprotection.api.draft.CustodianDetailsDto;
import de.eshg.measlesprotection.api.draft.EditFacilityResponse;
import de.eshg.measlesprotection.mapper.GetProceduresForPersonMapper;
import de.eshg.measlesprotection.mapper.ToDtoMappers;
import de.eshg.measlesprotection.persistence.centralfile.ProcedureDetailsData;
import de.eshg.measlesprotection.persistence.db.MeaslesProtectionProcedure;
import de.eshg.measlesprotection.persistence.support.ResultPage;
import de.eshg.measlesprotection.validation.ProtectedProcedure;
import de.eshg.persistence.IntentionalWritingTransaction;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.security.CurrentUserHelper;
import de.eshg.rest.service.security.config.BaseUrls;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.web.bind.annotation.DeleteMapping;
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
  private final BaseFeatureTogglesApi baseFeatureTogglesApi;
  private final MeaslesProtectionProperties properties;

  public ProtectionProcedureController(
      MeaslesProtectionService measlesProtectionService,
      GetProceduresForPersonMapper getProceduresForPersonMapper,
      AuditLogger auditLogger,
      BaseFeatureTogglesApi baseFeatureTogglesApi,
      MeaslesProtectionProperties properties) {
    this.measlesProtectionService = measlesProtectionService;
    this.getProceduresForPersonMapper = getProceduresForPersonMapper;
    this.auditLogger = auditLogger;
    this.baseFeatureTogglesApi = baseFeatureTogglesApi;
    this.properties = properties;
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

  @PostMapping("/{id}/vaccination-check")
  public ProtectionProcedureDto requestVaccinationStatusUpdate(
      @PathVariable("id") @ProtectedProcedure UUID procedureId) {
    Set<BaseFeature> features = baseFeatureTogglesApi.getFeatureToggles().enabledNewFeatures();
    if (!features.contains(BaseFeature.VACCINATION_CHECK)) {
      throw new BadRequestException("New feature VACCINATION_CHECK is not enabled");
    }
    if (!properties.isPolytuneActive()) {
      throw new BadRequestException("POLYTUNE is not active");
    }
    return ToDtoMappers.toProcedureDetails(
        measlesProtectionService.requestVaccinationStatusUpdate(procedureId));
  }

  @GetMapping("/{id}")
  @Operation(summary = "Get measles protection procedure by id.")
  @IntentionalWritingTransaction(
      reason =
          "Writing is required in polytune mode when a new polytune result is obtained (which then has to be persisted in the database)")
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

  @GetMapping("/for-person/{id}")
  @Operation(summary = "Get all measles protection procedures for a given person.")
  public GetProceduresForPersonResponse getProceduresForPerson(@PathVariable("id") UUID id) {
    List<MeaslesProtectionProcedure> procedures =
        measlesProtectionService.getProceduresForPerson(id);
    return getProceduresForPersonMapper.map(procedures);
  }

  @DeleteMapping("/{id}")
  @Operation(summary = "Delete measles protection procedure by id.")
  public void deleteProcedure(@PathVariable("id") UUID id) {
    measlesProtectionService.deleteProcedure(id);
  }

  @PostMapping("{id}/facilities/edit")
  @Operation(summary = "Updates facility from a measles protection procedure.")
  public EditFacilityResponse editFacility(
      @PathVariable("id") UUID id, @Valid @RequestBody PutFacilityRequest request) {
    return measlesProtectionService.editFacility(id, request);
  }

  @PostMapping("{id}/facilities/sync")
  @Operation(summary = "Synchronize facility data.")
  public void syncFacility(
      @PathVariable("id") UUID id, @Valid @RequestBody SyncFacilityRequest request) {
    measlesProtectionService.syncFacility(id, request);
  }

  @PostMapping("{id}/affected-person/edit")
  @Operation(summary = "Updates affected person from a measles protection procedure.")
  public AffectedPersonDetailsDto editAffectedPerson(
      @PathVariable("id") UUID id, @Valid @RequestBody PatchAffectedPersonRequest request) {
    return measlesProtectionService.editAffectedPerson(id, request);
  }

  @PostMapping("{id}/affected-person/sync")
  @Operation(summary = "Synchronize affected person data.")
  public void syncAffectedPerson(
      @PathVariable("id") UUID id, @Valid @RequestBody SyncAffectedPersonRequest request) {
    measlesProtectionService.syncAffectedPerson(id, request);
  }

  @PostMapping("{procedureId}/custodian/{custodianId}/edit")
  @Operation(summary = "Updates custodian from a measles protection procedure.")
  public CustodianDetailsDto editCustodian(
      @PathVariable("procedureId") UUID procedureId,
      @PathVariable("custodianId") UUID custodianId,
      @Valid @RequestBody PatchCustodianRequest request) {
    return measlesProtectionService.editCustodian(procedureId, custodianId, request);
  }

  @PostMapping("{procedureId}/custodian/{custodianId}/sync")
  @Operation(summary = "Synchronize custodian data.")
  public void syncCustodian(
      @PathVariable("procedureId") UUID procedureId,
      @PathVariable("custodianId") UUID custodianId,
      @Valid @RequestBody SyncCustodianRequest request) {
    measlesProtectionService.syncCustodian(procedureId, custodianId, request);
  }
}
