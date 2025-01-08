/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.otherservicetemplate;

import de.eshg.rest.service.security.config.BaseUrls;
import de.eshg.travelmedicine.otherservicetemplate.api.GetOtherServiceTemplatesResponse;
import de.eshg.travelmedicine.otherservicetemplate.api.OtherServiceTemplateDto;
import de.eshg.travelmedicine.otherservicetemplate.api.PostPutOtherServiceTemplateRequest;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.UUID;
import org.springframework.http.MediaType;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(
    path = OtherServiceTemplateController.BASE_URL,
    produces = MediaType.APPLICATION_JSON_VALUE)
@Tag(name = "OtherServiceTemplate")
public class OtherServiceTemplateController {

  public static final String BASE_URL = BaseUrls.TravelMedicine.OTHER_SERVICE_TEMPLATE_CONTROLLER;

  private final OtherServiceTemplateService otherServiceTemplateService;

  public OtherServiceTemplateController(OtherServiceTemplateService otherServiceTemplateService) {
    this.otherServiceTemplateService = otherServiceTemplateService;
  }

  @GetMapping
  @Operation(summary = "Get all other service templates")
  @Transactional(readOnly = true)
  public GetOtherServiceTemplatesResponse getOtherServiceTemplates() {
    return otherServiceTemplateService.getOtherServiceTemplatesResponse();
  }

  @PostMapping
  @Operation(summary = "Create an other service templates")
  @Transactional
  public OtherServiceTemplateDto createOtherServiceTemplate(
      @Valid @RequestBody PostPutOtherServiceTemplateRequest request) {
    return otherServiceTemplateService.createOtherServiceTemplate(request);
  }

  @PutMapping("/{id}")
  @Operation(summary = "Update an other service templates")
  @Transactional
  public OtherServiceTemplateDto updateOtherServiceTemplate(
      @PathVariable("id") UUID id, @Valid @RequestBody PostPutOtherServiceTemplateRequest request) {
    return otherServiceTemplateService.updateOtherServiceTemplate(id, request);
  }

  @DeleteMapping("/{id}")
  @Operation(summary = "Delete all other service templates")
  @Transactional
  public void deleteOtherServiceTemplate(@PathVariable("id") UUID id) {
    otherServiceTemplateService.deleteOtherServiceTemplate(id);
  }
}
