/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.template.informationstatementtemplate;

import de.eshg.rest.service.security.config.BaseUrls;
import de.eshg.travelmedicine.template.informationstatementtemplate.api.GetInformationStatementTemplatesResponse;
import de.eshg.travelmedicine.template.informationstatementtemplate.api.InformationStatementTemplateDto;
import de.eshg.travelmedicine.template.informationstatementtemplate.api.InformationStatementTemplateRequest;
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
    path = InformationStatementTemplateController.BASE_URL,
    produces = MediaType.APPLICATION_JSON_VALUE)
@Tag(name = "InformationStatementTemplate")
public class InformationStatementTemplateController {

  public static final String BASE_URL =
      BaseUrls.TravelMedicine.INFORMATION_STATEMENT_TEMPLATE_CONTROLLER;

  private final InformationStatementTemplateService informationStatementTemplateService;

  public InformationStatementTemplateController(
      InformationStatementTemplateService informationStatementTemplateService) {
    this.informationStatementTemplateService = informationStatementTemplateService;
  }

  @GetMapping
  @Operation(summary = "Gets all InformationStatementTemplates")
  @Transactional(readOnly = true)
  public GetInformationStatementTemplatesResponse getAllInformationStatementTemplates() {
    return informationStatementTemplateService.readAllInformationStatementTemplates();
  }

  @GetMapping("/{id}")
  @Operation(summary = "Gets one InformationStatementTemplate by ID")
  @Transactional(readOnly = true)
  public InformationStatementTemplateDto getOneInformationStatementTemplate(
      @PathVariable("id") UUID id) {
    return informationStatementTemplateService.readOneInformationStatementTemplate(id);
  }

  @PostMapping
  @Operation(summary = "Adds a new InformationStatementTemplate")
  @Transactional
  public InformationStatementTemplateDto postInformationStatementTemplate(
      @Valid @RequestBody InformationStatementTemplateRequest request) {
    return informationStatementTemplateService.createInformationStatementTemplate(request);
  }

  @PutMapping(path = "/{id}")
  @Operation(summary = "Modifies an existing InformationStatementTemplate (unless it's FINAL)")
  @Transactional
  public InformationStatementTemplateDto putInformationStatementTemplate(
      @PathVariable("id") UUID id,
      @Valid @RequestBody InformationStatementTemplateRequest request) {
    return informationStatementTemplateService.updateInformationStatementTemplate(id, request);
  }

  @DeleteMapping("/{id}")
  @Operation(summary = "Deletes InformationStatementTemplate by ID")
  @Transactional
  public void deleteInformationStatementTemplateById(@PathVariable("id") UUID id) {
    informationStatementTemplateService.deleteInformationStatementTemplate(id);
  }
}
