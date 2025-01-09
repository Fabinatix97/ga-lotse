/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection;

import de.eshg.rest.service.security.config.BaseUrls;
import de.eshg.stiprotection.api.examination.LaboratoryTestExaminationDto;
import de.eshg.stiprotection.api.examination.RapidTestExaminationDto;
import de.eshg.stiprotection.mapper.examination.LaboratoryExaminationMapper;
import de.eshg.stiprotection.mapper.examination.RapidTestExaminationMapper;
import de.eshg.stiprotection.persistence.db.StiProtectionSystemProgressEntryType;
import de.eshg.stiprotection.persistence.db.examination.LaboratoryTestExamination;
import de.eshg.stiprotection.persistence.db.examination.RapidTestExamination;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.UUID;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = ExaminationController.BASE_URL)
@Tag(name = "Examination")
public class ExaminationController {
  public static final String BASE_URL =
      BaseUrls.StiProtection.PROCEDURE_CONTROLLER + "/{procedureId}/examination";

  private final ExaminationService examinationService;
  private final StiProtectionProcedureService stiProtectionProcedureService;

  public ExaminationController(
      ExaminationService examinationService,
      StiProtectionProcedureService stiProtectionProcedureService) {
    this.examinationService = examinationService;
    this.stiProtectionProcedureService = stiProtectionProcedureService;
  }

  @GetMapping("/rapid-test")
  @Operation(summary = "Get rapid test examination.")
  @Transactional(readOnly = true)
  public RapidTestExaminationDto getRapidTestExamination(
      @PathVariable("procedureId") UUID procedureId) {
    return RapidTestExaminationMapper.toInterfaceType(
        examinationService.getRapidTestExamination(procedureId));
  }

  @PutMapping("/rapid-test")
  @Operation(summary = "Update rapid test examination of STI protection procedure.")
  @Transactional
  public void updateRapidTestExamination(
      @PathVariable("procedureId") UUID procedureId,
      @Valid @RequestBody RapidTestExaminationDto rapidTestExaminationDto) {
    RapidTestExamination rapidTestExamination =
        examinationService.getOrCreateRapidTestExamination(procedureId);
    RapidTestExaminationMapper.update(rapidTestExaminationDto, rapidTestExamination);
    stiProtectionProcedureService.addProgressEntry(
        procedureId, StiProtectionSystemProgressEntryType.RAPID_TEST_EXAMINATION_UPDATED);
  }

  @GetMapping("/laboratory-test")
  @Operation(summary = "Get all external laboratory tests within an examination.")
  @Transactional(readOnly = true)
  public LaboratoryTestExaminationDto getLaboratoryTestExamination(
      @PathVariable("procedureId") UUID procedureId) {
    return LaboratoryExaminationMapper.toInterfaceType(
        examinationService.getLaboratoryTestExamination(procedureId));
  }

  @PutMapping("/laboratory-test")
  @Operation(summary = "Update all external laboratory tests.")
  @Transactional
  public void updateLaboratoryTestExamination(
      @PathVariable("procedureId") UUID procedureId,
      @Valid @RequestBody LaboratoryTestExaminationDto laboratoryExaminationDto) {
    LaboratoryTestExamination laboratoryTestExamination =
        examinationService.getOrCreateLaboratoryTestExamination(procedureId);
    LaboratoryExaminationMapper.update(laboratoryExaminationDto, laboratoryTestExamination);
    stiProtectionProcedureService.addProgressEntry(
        procedureId, StiProtectionSystemProgressEntryType.LABORATORY_TEST_EXAMINATION_UPDATED);
  }
}
