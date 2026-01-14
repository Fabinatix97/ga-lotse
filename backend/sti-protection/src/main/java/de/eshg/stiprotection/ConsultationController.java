/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection;

import de.eshg.lib.procedure.domain.model.TriggerType;
import de.eshg.rest.service.security.config.BaseUrls;
import de.eshg.stiprotection.api.consultation.ConsultationDto;
import de.eshg.stiprotection.mapper.consultation.ConsultationMapper;
import de.eshg.stiprotection.persistence.db.StiProtectionSystemProgressEntryType;
import de.eshg.stiprotection.persistence.db.consultation.Consultation;
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
@RequestMapping(value = ConsultationController.BASE_URL)
@Tag(name = "Consultation")
public class ConsultationController {
  public static final String BASE_URL =
      BaseUrls.StiProtection.PROCEDURE_CONTROLLER + "/{procedureId}/consultation";

  private final ConsultationService consultationService;
  private final ProgressEntryUtil progressEntryUtil;

  public ConsultationController(
      ConsultationService consultationService, ProgressEntryUtil progressEntryUtil) {
    this.consultationService = consultationService;
    this.progressEntryUtil = progressEntryUtil;
  }

  @GetMapping
  @Operation(summary = "Get consultation documentation.")
  @Transactional(readOnly = true)
  public ConsultationDto getConsultation(@PathVariable("procedureId") UUID procedureId) {
    return ConsultationMapper.toInterfaceType(consultationService.getConsultation(procedureId));
  }

  @PutMapping
  @Operation(summary = "Upsert consultation documentation for a STI protection procedure.")
  @Transactional
  public void updateConsultation(
      @PathVariable("procedureId") UUID procedureId,
      @Valid @RequestBody ConsultationDto consultationDto) {
    Consultation consultation = consultationService.getOrCreateConsultation(procedureId);
    ConsultationMapper.update(consultationDto, consultation);
    progressEntryUtil.addProgressEntry(
        procedureId,
        StiProtectionSystemProgressEntryType.CONSULTATION_UPDATED,
        TriggerType.EMPLOYEE);
  }
}
