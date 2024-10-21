/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection;

import de.eshg.api.commons.InlineParameterObject;
import de.eshg.rest.service.security.config.BaseUrls;
import de.eshg.stiprotection.annotations.ProcedureStatusTransition;
import de.eshg.stiprotection.api.CreateProcedureRequest;
import de.eshg.stiprotection.api.CreateProcedureResponse;
import de.eshg.stiprotection.api.GetStiProtectionProceduresPaginationOptions;
import de.eshg.stiprotection.api.GetStiProtectionProceduresResponse;
import de.eshg.stiprotection.api.GetStiProtectionProceduresSortOptions;
import de.eshg.stiprotection.api.StiProtectionProcedureDto;
import de.eshg.stiprotection.api.medicalhistory.CreateMedicalHistoryRequest;
import de.eshg.stiprotection.api.medicalhistory.CreateMedicalHistoryResponse;
import de.eshg.stiprotection.api.medicalhistory.GetMedicalHistoryResponse;
import de.eshg.stiprotection.api.medicalhistory.MedicalHistoryDto;
import de.eshg.stiprotection.mapper.StiProtectionProcedureMapper;
import de.eshg.stiprotection.mapper.medicalhistory.MedicalHistoryMapper;
import de.eshg.stiprotection.persistence.data.ResultPage;
import de.eshg.stiprotection.persistence.data.StiProtectionProcedureData;
import de.eshg.stiprotection.persistence.db.medicalhistory.MedicalHistory;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.UUID;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = StiProtectionProcedureController.BASE_URL)
@Tag(name = "StiProtectionProcedure")
public class StiProtectionProcedureController {

  public static final String BASE_URL = BaseUrls.StiProtection.PROCEDURE_CONTROLLER;

  private final StiProtectionProcedureService stiProtectionService;

  public StiProtectionProcedureController(StiProtectionProcedureService stiProtectionService) {
    this.stiProtectionService = stiProtectionService;
  }

  @PostMapping
  @Transactional
  public CreateProcedureResponse createProcedure(
      @Valid @RequestBody CreateProcedureRequest request) {
    return StiProtectionProcedureMapper.toInterfaceType(
        stiProtectionService.createProcedure(request));
  }

  @GetMapping("/{id}")
  @Operation(summary = "Get STI protection procedure by id.")
  @Transactional(readOnly = true)
  public StiProtectionProcedureDto getStiProcedure(@PathVariable("id") UUID procedureId) {
    return StiProtectionProcedureMapper.toInterfaceType(
        stiProtectionService.getProcedure(procedureId));
  }

  @GetMapping
  @Transactional
  @Operation(summary = "Get sorted and paginated STI procedures.")
  public GetStiProtectionProceduresResponse getStiProcedures(
      @Valid @ParameterObject @InlineParameterObject
          GetStiProtectionProceduresSortOptions sortOptions,
      @Valid @ParameterObject @InlineParameterObject
          GetStiProtectionProceduresPaginationOptions paginationOptions) {

    ResultPage<StiProtectionProcedureData> procedures =
        stiProtectionService.getProcedures(sortOptions, paginationOptions);

    return new GetStiProtectionProceduresResponse(
        procedures.totalPages(),
        procedures.totalElements(),
        procedures.elements().stream().map(StiProtectionProcedureMapper::toOverviewType).toList());
  }

  @PostMapping("/{id}/medical-history")
  @Operation(summary = "Add medical history item to STI protection procedure.")
  @Transactional
  public CreateMedicalHistoryResponse createMedicalHistory(
      @PathVariable("id") UUID procedureId,
      @Valid @RequestBody CreateMedicalHistoryRequest request) {
    MedicalHistory databaseType = MedicalHistoryMapper.toDatabaseType(request.medicalHistory());
    MedicalHistory medicalHistory =
        stiProtectionService.createMedicalHistory(procedureId, databaseType);
    MedicalHistoryDto interfaceType = MedicalHistoryMapper.toInterfaceType(medicalHistory);
    return new CreateMedicalHistoryResponse(interfaceType);
  }

  @GetMapping("/{id}/medical-history")
  @Operation(summary = "Get medical history item.")
  @Transactional
  public GetMedicalHistoryResponse getMedicalHistory(@PathVariable("id") UUID procedureId) {
    MedicalHistory medicalHistory = stiProtectionService.getMedicalHistory(procedureId);
    MedicalHistoryDto interfaceType = MedicalHistoryMapper.toInterfaceType(medicalHistory);
    return new GetMedicalHistoryResponse(interfaceType);
  }

  @PutMapping("/{id}/close")
  @Operation(summary = "Close an STI procedure.")
  @Transactional
  @ProcedureStatusTransition
  public StiProtectionProcedureDto closeProcedure(@PathVariable("id") UUID procedureId) {
    stiProtectionService.closeProcedure(procedureId);
    return StiProtectionProcedureMapper.toInterfaceType(
        stiProtectionService.getProcedure(procedureId));
  }

  @PutMapping("/{id}/reopen")
  @Operation(summary = "Re-open an STI procedure.")
  @Transactional
  @ProcedureStatusTransition
  public StiProtectionProcedureDto reopenProcedure(@PathVariable("id") UUID procedureId) {
    stiProtectionService.reopenProcedure(procedureId);
    return StiProtectionProcedureMapper.toInterfaceType(
        stiProtectionService.getProcedure(procedureId));
  }
}
