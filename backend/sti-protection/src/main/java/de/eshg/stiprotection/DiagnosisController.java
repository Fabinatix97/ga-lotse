/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection;

import de.eshg.base.icd10.api.Icd10CodeDto;
import de.eshg.rest.service.security.config.BaseUrls;
import de.eshg.stiprotection.api.diagnosis.DiagnosisDto;
import de.eshg.stiprotection.mapper.diagnosis.DiagnosisMapper;
import de.eshg.stiprotection.persistence.db.StiProtectionSystemProgressEntryType;
import de.eshg.stiprotection.persistence.db.diagnosis.Diagnosis;
import de.eshg.stiprotection.util.ProgressEntryUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = DiagnosisController.BASE_URL)
@Tag(name = "Diagnosis")
public class DiagnosisController {
  public static final String BASE_URL =
      BaseUrls.StiProtection.PROCEDURE_CONTROLLER + "/{procedureId}/diagnosis";

  private final DiagnosisService diagnosisService;
  private final ProgressEntryUtil progressEntryUtil;

  public DiagnosisController(
      DiagnosisService diagnosisService, ProgressEntryUtil progressEntryUtil) {
    this.diagnosisService = diagnosisService;
    this.progressEntryUtil = progressEntryUtil;
  }

  @GetMapping
  @Operation(summary = "Get diagnosis.")
  @Transactional(readOnly = true)
  public DiagnosisDto getDiagnosis(@PathVariable("procedureId") UUID procedureId) {
    Diagnosis diagnosis = diagnosisService.getDiagnosis(procedureId);
    List<Icd10CodeDto> icd10Codes = diagnosisService.resolveIcd10Codes(diagnosis);
    return DiagnosisMapper.toInterfaceType(diagnosis, icd10Codes);
  }

  @PutMapping
  @Operation(summary = "Update or insert diagnosis data of STI protection procedure.")
  @Transactional
  public void updateDiagnosis(
      @PathVariable("procedureId") UUID procedureId,
      @Valid @RequestBody DiagnosisDto diagnosisDto) {
    Diagnosis diagnosis = diagnosisService.getOrCreateDiagnosis(procedureId);
    diagnosisService.updateDiagnosis(diagnosis, DiagnosisMapper.toDatabaseType(diagnosisDto));
    progressEntryUtil.addProgressEntry(
        procedureId, StiProtectionSystemProgressEntryType.DIAGNOSIS_UPDATED);
  }
}
