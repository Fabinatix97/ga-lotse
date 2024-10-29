/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection;

import de.eshg.rest.service.security.config.BaseUrls;
import de.eshg.stiprotection.api.medicalhistory.CreateMedicalHistoryRequest;
import de.eshg.stiprotection.api.medicalhistory.MedicalHistoryDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.UUID;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
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

  public MedicalHistoryController(MedicalHistoryService medicalHistoryService) {
    this.medicalHistoryService = medicalHistoryService;
  }

  @PostMapping
  @Operation(summary = "Add medical history item to STI protection procedure.")
  public MedicalHistoryDto createMedicalHistory(
      @PathVariable("procedureId") UUID procedureId,
      @Valid @RequestBody CreateMedicalHistoryRequest request) {
    return medicalHistoryService.createMedicalHistory(procedureId, request);
  }

  @GetMapping
  @Operation(summary = "Get medical history item.")
  public MedicalHistoryDto getMedicalHistory(@PathVariable("procedureId") UUID procedureId) {
    return medicalHistoryService.getMedicalHistory(procedureId);
  }
}
