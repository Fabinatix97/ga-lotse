/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.medicalhistorytemplate;

import de.eshg.rest.service.security.config.BaseUrls;
import de.eshg.travelmedicine.medicalhistorytemplate.api.GetMedicalHistoryTemplatesResponse;
import de.eshg.travelmedicine.medicalhistorytemplate.api.MedicalHistoryTemplateDto;
import de.eshg.travelmedicine.medicalhistorytemplate.api.PatchMedicalHistoryTemplateFlagRequest;
import de.eshg.travelmedicine.medicalhistorytemplate.api.PostPutMedicalHistoryTemplateRequest;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.UUID;
import org.springframework.http.MediaType;
import org.springframework.transaction.annotation.Transactional;
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
@RequestMapping(
    path = MedicalHistoryTemplateController.BASE_URL,
    produces = MediaType.APPLICATION_JSON_VALUE)
@Tag(name = "MedicalHistoryTemplate")
public class MedicalHistoryTemplateController {

  public static final String BASE_URL = BaseUrls.TravelMedicine.MEDICAL_HISTORY_TEMPLATE_CONTROLLER;

  private final MedicalHistoryTemplateService medicalHistoryTemplateService;

  public MedicalHistoryTemplateController(
      MedicalHistoryTemplateService medicalHistoryTemplateService) {
    this.medicalHistoryTemplateService = medicalHistoryTemplateService;
  }

  @GetMapping
  @Operation(summary = "Gets all MedicalHistoryTemplates")
  @Transactional(readOnly = true)
  public GetMedicalHistoryTemplatesResponse getAllMedicalHistoryTemplates() {
    return medicalHistoryTemplateService.readAllMedicalHistoryTemplates();
  }

  @GetMapping("/{id}")
  @Operation(summary = "Gets one MedicalHistoryTemplate by ID")
  @Transactional(readOnly = true)
  public MedicalHistoryTemplateDto getOneMedicalHistoryTemplate(@PathVariable("id") UUID id) {
    return medicalHistoryTemplateService.readOneMedicalHistoryTemplate(id);
  }

  @PostMapping
  @Operation(summary = "Adds a new MedicalHistoryTemplate")
  @Transactional
  public MedicalHistoryTemplateDto postMedicalHistoryTemplate(
      @Valid @RequestBody PostPutMedicalHistoryTemplateRequest request) {
    return medicalHistoryTemplateService.createMedicalHistoryTemplate(request);
  }

  @PutMapping(path = "/{id}")
  @Operation(summary = "Modifies an existing MedicalHistoryTemplate (unless it's FINAL)")
  @Transactional
  public MedicalHistoryTemplateDto putMedicalHistoryTemplate(
      @PathVariable("id") UUID id,
      @Valid @RequestBody PostPutMedicalHistoryTemplateRequest request) {
    return medicalHistoryTemplateService.updateMedicalHistoryTemplate(id, request);
  }

  @DeleteMapping("/{id}")
  @Operation(summary = "Deletes MedicalHistoryTemplate by ID")
  @Transactional
  public void deleteMedicalHistoryTemplateById(@PathVariable("id") UUID id) {
    medicalHistoryTemplateService.deleteMedicalHistoryTemplate(id);
  }

  @PatchMapping(path = "/{id}/main-flag")
  @Operation(summary = "Update main flag of MedicalHistoryTemplate (only on FINAL)")
  @Transactional
  public MedicalHistoryTemplateDto patchMedicalHistoryTemplateMainFlag(
      @PathVariable("id") UUID id,
      @Valid @RequestBody PatchMedicalHistoryTemplateFlagRequest request) {
    return medicalHistoryTemplateService.updateMedicalHistoryTemplateMainFlag(id, request);
  }

  @PatchMapping(path = "/{id}/follow-up-flag")
  @Operation(summary = "Update follow up flag of MedicalHistoryTemplate (only on FINAL)")
  @Transactional
  public MedicalHistoryTemplateDto patchMedicalHistoryTemplateFollowUpFlag(
      @PathVariable("id") UUID id,
      @Valid @RequestBody PatchMedicalHistoryTemplateFlagRequest request) {
    return medicalHistoryTemplateService.updateMedicalHistoryTemplateFollowUpFlag(id, request);
  }
}
