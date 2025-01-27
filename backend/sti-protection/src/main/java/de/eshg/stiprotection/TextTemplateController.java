/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection;

import static de.eshg.lib.procedure.MapperHelper.mapEnumSet;

import de.eshg.api.commons.InlineParameterObject;
import de.eshg.rest.service.security.config.BaseUrls;
import de.eshg.stiprotection.api.texttemplate.CreateTextTemplateRequest;
import de.eshg.stiprotection.api.texttemplate.CreateTextTemplateResponse;
import de.eshg.stiprotection.api.texttemplate.GetTextTemplatesFilterOptions;
import de.eshg.stiprotection.api.texttemplate.GetTextTemplatesResponse;
import de.eshg.stiprotection.api.texttemplate.TextTemplateDto;
import de.eshg.stiprotection.mapper.texttemplate.TextTemplateContextMapper;
import de.eshg.stiprotection.mapper.texttemplate.TextTemplateMapper;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.UUID;
import org.springdoc.core.annotations.ParameterObject;
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
@RequestMapping(value = TextTemplateController.BASE_URL)
@Tag(name = "TextTemplate")
public class TextTemplateController {
  public static final String BASE_URL =
      BaseUrls.StiProtection.PROCEDURE_CONTROLLER + "/text-templates";

  private final TextTemplateService textTemplateService;

  public TextTemplateController(TextTemplateService textTemplateService) {
    this.textTemplateService = textTemplateService;
  }

  @PostMapping
  @Operation(summary = "Create a new text template")
  @Transactional
  public CreateTextTemplateResponse createTextTemplate(
      @Valid @RequestBody CreateTextTemplateRequest request) {
    return TextTemplateMapper.toInterface(
        textTemplateService.createTextTemplate(TextTemplateMapper.toDatabase(request)));
  }

  @GetMapping("/{textTemplateId}")
  @Operation(summary = "Get an existing text template")
  @Transactional(readOnly = true)
  public TextTemplateDto getTextTemplate(@PathVariable("textTemplateId") UUID textTemplateId) {
    return TextTemplateMapper.toInterfaceType(textTemplateService.getTextTemplate(textTemplateId));
  }

  @GetMapping
  @Operation(summary = "Get a list of text templates")
  @Transactional(readOnly = true)
  public GetTextTemplatesResponse getTextTemplates(
      @Valid @ParameterObject @InlineParameterObject GetTextTemplatesFilterOptions filterOptions) {
    return TextTemplateMapper.toInterfaceType(
        textTemplateService.getTextTemplates(
            mapEnumSet(filterOptions.context(), TextTemplateContextMapper::toDatabaseType)));
  }

  @PutMapping("/{textTemplateId}")
  @Operation(summary = "Update an existing text template")
  @Transactional
  public void updateTextTemplate(
      @PathVariable("textTemplateId") UUID textTemplateId,
      @Valid @RequestBody TextTemplateDto textTemplateDto) {
    textTemplateService.updateTextTemplate(
        textTemplateId, TextTemplateMapper.toDatabaseType(textTemplateDto));
  }

  @DeleteMapping("/{textTemplateId}")
  @Operation(summary = "Delete an existing text template")
  @Transactional
  public void deleteTextTemplate(@PathVariable("textTemplateId") UUID textTemplateId) {
    textTemplateService.deleteTextTemplate(textTemplateId);
  }
}
