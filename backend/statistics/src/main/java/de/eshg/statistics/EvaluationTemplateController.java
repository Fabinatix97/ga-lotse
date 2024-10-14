/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics;

import static de.eshg.statistics.EvaluationTemplateController.BASE_URL;
import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;

import de.eshg.rest.service.security.config.BaseUrls;
import de.eshg.statistics.aggregation.DataSourceValidator;
import de.eshg.statistics.api.evaluationtemplate.AddEvaluationTemplateRequest;
import de.eshg.statistics.api.evaluationtemplate.EvaluationTemplateDto;
import de.eshg.statistics.api.evaluationtemplate.GetEvaluationTemplatesResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.UUID;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.service.annotation.DeleteExchange;
import org.springframework.web.service.annotation.GetExchange;
import org.springframework.web.service.annotation.HttpExchange;
import org.springframework.web.service.annotation.PostExchange;

@RestController
@HttpExchange(value = BASE_URL)
@Tag(name = "EvaluationTemplate")
public class EvaluationTemplateController {
  public static final String BASE_URL = BaseUrls.Statistics.EVALUATION_TEMPLATE_CONTROLLER;

  private final EvaluationTemplateService evaluationTemplateService;
  private final DataSourceValidator dataSourceValidator;

  public EvaluationTemplateController(
      EvaluationTemplateService evaluationTemplateService,
      DataSourceValidator dataSourceValidator) {
    this.evaluationTemplateService = evaluationTemplateService;
    this.dataSourceValidator = dataSourceValidator;
  }

  @PostExchange(accept = APPLICATION_JSON_VALUE)
  @ApiResponse(responseCode = "200", description = "The added evaluation template")
  @Operation(summary = "Add an evaluation template")
  public EvaluationTemplateDto addEvaluationTemplate(
      @Valid @RequestBody AddEvaluationTemplateRequest addEvaluationTemplateRequest) {
    dataSourceValidator.validateDataSources(addEvaluationTemplateRequest.dataSources());
    return evaluationTemplateService.addEvaluationTemplate(addEvaluationTemplateRequest);
  }

  @GetExchange(accept = APPLICATION_JSON_VALUE)
  @ApiResponse(responseCode = "200", description = "All evaluation templates")
  @Operation(summary = "Get all evaluation templates")
  public GetEvaluationTemplatesResponse getEvaluationTemplates() {
    return new GetEvaluationTemplatesResponse(
        evaluationTemplateService.getAllEvaluationTemplates());
  }

  @GetExchange(value = "/{templateId}", accept = APPLICATION_JSON_VALUE)
  @ApiResponse(responseCode = "200", description = "The evaluation template")
  @Operation(summary = "Get an evaluation template")
  public EvaluationTemplateDto getEvaluationTemplate(
      @PathVariable(name = "templateId") UUID templateId) {
    return evaluationTemplateService.getEvaluationTemplate(templateId);
  }

  @DeleteExchange(value = "/{templateId}", accept = APPLICATION_JSON_VALUE)
  @ApiResponse(
      responseCode = "200",
      description = "Returned when the evaluation template is deleted")
  @Operation(summary = "Delete an evaluation template")
  public void deleteEvaluationTemplate(@PathVariable(name = "templateId") UUID templateId) {
    evaluationTemplateService.deleteEvaluationTemplate(templateId);
  }
}
