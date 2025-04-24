/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection;

import de.eshg.lib.procedure.domain.model.TriggerType;
import de.eshg.rest.service.security.config.BaseUrls;
import de.eshg.stiprotection.api.medicalhistory.CreateMedicalHistoryRequest;
import de.eshg.stiprotection.api.medicalhistory.MedicalHistoryDto;
import de.eshg.stiprotection.mapper.medicalhistory.MedicalHistoryMapper;
import de.eshg.stiprotection.persistence.db.StiProtectionSystemProgressEntryType;
import de.eshg.stiprotection.persistence.db.medicalhistory.MedicalHistory;
import de.eshg.stiprotection.util.ProgressEntryUtil;
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
@RequestMapping(value = MedicalHistoryController.BASE_URL)
@Tag(name = "MedicalHistory")
public class MedicalHistoryController {
  public static final String BASE_URL =
      BaseUrls.StiProtection.PROCEDURE_CONTROLLER + "/{procedureId}/medical-history";

  private final MedicalHistoryService medicalHistoryService;
  private final ProgressEntryUtil progressEntryUtil;

  public MedicalHistoryController(
      MedicalHistoryService medicalHistoryService, ProgressEntryUtil progressEntryUtil) {
    this.medicalHistoryService = medicalHistoryService;
    this.progressEntryUtil = progressEntryUtil;
  }

  @GetMapping
  @Operation(summary = "Get medical history.")
  @Transactional(readOnly = true)
  public MedicalHistoryDto getMedicalHistory(@PathVariable("procedureId") UUID procedureId) {
    return MedicalHistoryMapper.toInterfaceType(
        medicalHistoryService.getMedicalHistory(procedureId));
  }

  @PutMapping
  @Operation(summary = "Update or insert medical history of STI protection procedure.")
  @Transactional
  public void updateMedicalHistory(
      @PathVariable("procedureId") UUID procedureId,
      @Valid @RequestBody CreateMedicalHistoryRequest request) {
    MedicalHistory medicalHistory = medicalHistoryService.getOrCreateMedicalHistory(procedureId);
    MedicalHistoryMapper.update(request.medicalHistory(), medicalHistory);
    progressEntryUtil.addProgressEntry(
        procedureId,
        StiProtectionSystemProgressEntryType.MEDICAL_HISTORY_UPDATED,
        TriggerType.EMPLOYEE);
  }
}
