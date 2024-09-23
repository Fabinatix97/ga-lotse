/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.medicalhistory;

import de.eshg.rest.service.security.config.BaseUrls;
import de.eshg.travelmedicine.medicalhistory.api.PatchMedicalHistoryRequest;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.UUID;
import org.springframework.http.MediaType;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(
    path = MedicalHistoryController.BASE_URL,
    produces = MediaType.APPLICATION_JSON_VALUE)
@Tag(name = "MedicalHistory")
public class MedicalHistoryController {
  public static final String BASE_URL = BaseUrls.TravelMedicine.MEDICAL_HISTORY_CONTROLLER;

  private final MedicalHistoryService medicalHistoryService;

  public MedicalHistoryController(MedicalHistoryService medicalHistoryService) {
    this.medicalHistoryService = medicalHistoryService;
  }

  @PatchMapping(path = "/{id}")
  @Operation(summary = "Updates medical history content")
  @Transactional()
  public void patchMedicalHistory(
      @PathVariable("id") UUID id,
      @RequestBody @Valid PatchMedicalHistoryRequest patchMedicalHistoryRequest) {
    medicalHistoryService.patchMedicalHistory(id, patchMedicalHistoryRequest);
  }
}
