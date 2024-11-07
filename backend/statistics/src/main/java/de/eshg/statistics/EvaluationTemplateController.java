/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics;

import static de.eshg.statistics.EvaluationTemplateController.BASE_URL;
import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;

import de.eshg.rest.service.security.config.BaseUrls;
import de.eshg.statistics.aggregation.DataSourceValidator;
import de.eshg.statistics.aggregation.StatisticService;
import de.eshg.statistics.api.datasource.AvailableDataSource;
import de.eshg.statistics.api.evaluationtemplate.AbstractAddEvaluationTemplateRequest;
import de.eshg.statistics.api.evaluationtemplate.AddEvaluationTemplateFromEvaluationRequest;
import de.eshg.statistics.api.evaluationtemplate.AddEvaluationTemplateWithDataSourcesRequest;
import de.eshg.statistics.api.evaluationtemplate.EvaluationTemplateDto;
import de.eshg.statistics.api.evaluationtemplate.ExpectedEvaluationTemplateDto;
import de.eshg.statistics.api.evaluationtemplate.GetAllEvaluationTemplatesResponse;
import de.eshg.statistics.api.evaluationtemplate.GetEvaluationTemplatesRequest;
import de.eshg.statistics.api.evaluationtemplate.GetEvaluationTemplatesResponse;
import de.eshg.statistics.api.evaluationtemplate.UpdateEvaluationTemplateRequest;
import de.eshg.statistics.datatransfer.EvaluationTemplateData;
import de.eshg.statistics.mapper.EvaluationTemplateMapper;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.service.annotation.DeleteExchange;
import org.springframework.web.service.annotation.GetExchange;
import org.springframework.web.service.annotation.HttpExchange;
import org.springframework.web.service.annotation.PatchExchange;
import org.springframework.web.service.annotation.PostExchange;

@RestController
@HttpExchange(value = BASE_URL)
@Tag(name = "EvaluationTemplate")
public class EvaluationTemplateController {
  public static final String BASE_URL = BaseUrls.Statistics.EVALUATION_TEMPLATE_CONTROLLER;

  private final EvaluationTemplateService evaluationTemplateService;
  private final StatisticService statisticService;
  private final DataSourceValidator dataSourceValidator;

  public EvaluationTemplateController(
      EvaluationTemplateService evaluationTemplateService,
      StatisticService statisticService,
      DataSourceValidator dataSourceValidator) {
    this.evaluationTemplateService = evaluationTemplateService;
    this.statisticService = statisticService;
    this.dataSourceValidator = dataSourceValidator;
  }

  @PostExchange(accept = APPLICATION_JSON_VALUE)
  @ApiResponse(responseCode = "200", description = "The added evaluation template")
  @Operation(summary = "Add an evaluation template")
  public EvaluationTemplateDto addEvaluationTemplate(
      @Valid @RequestBody AbstractAddEvaluationTemplateRequest addEvaluationTemplateRequest) {
    return switch (addEvaluationTemplateRequest) {
      case AddEvaluationTemplateFromEvaluationRequest
              addEvaluationTemplateFromEvaluationRequest -> {
        UUID evaluationId = addEvaluationTemplateFromEvaluationRequest.evaluationId();
        EvaluationTemplateData evaluationTemplateData =
            statisticService.getEvaluationTemplateData(evaluationId);
        List<AvailableDataSource> relevantAvailableDataSources =
            dataSourceValidator.validateDataSourcesAndGetRelevantAvailableDataSources(
                evaluationTemplateData.dataSources());
        yield evaluationTemplateService.addEvaluationTemplate(
            addEvaluationTemplateFromEvaluationRequest,
            evaluationTemplateData,
            relevantAvailableDataSources);
      }
      case AddEvaluationTemplateWithDataSourcesRequest
              addEvaluationTemplateWithDataSourcesRequest -> {
        List<AvailableDataSource> relevantAvailableDataSources =
            dataSourceValidator.validateDataSourcesAndGetRelevantAvailableDataSources(
                addEvaluationTemplateWithDataSourcesRequest.dataSources());
        yield evaluationTemplateService.addEvaluationTemplate(
            addEvaluationTemplateWithDataSourcesRequest, relevantAvailableDataSources);
      }
    };
  }

  @PatchExchange(value = "/{templateId}", accept = APPLICATION_JSON_VALUE)
  @ApiResponse(responseCode = "200", description = "The patched evaluation template")
  @Operation(summary = "Change name and description of an evaluation template")
  public EvaluationTemplateDto updateEvaluationTemplate(
      @PathVariable(name = "templateId") UUID templateId,
      @RequestBody @Valid UpdateEvaluationTemplateRequest updateEvaluationTemplateRequest) {
    return evaluationTemplateService.updateEvaluationTemplate(
        templateId, updateEvaluationTemplateRequest);
  }

  @GetExchange(accept = APPLICATION_JSON_VALUE)
  @ApiResponse(responseCode = "200", description = "All evaluation templates")
  @Operation(summary = "Get all evaluation templates")
  public GetAllEvaluationTemplatesResponse getEvaluationTemplates() {
    return evaluationTemplateService.getAllEvaluationTemplates();
  }

  @PostExchange(value = "/overview", accept = APPLICATION_JSON_VALUE)
  @ApiResponse(responseCode = "200", description = "Evaluation template overview page")
  @Operation(summary = "Get evaluation template entries for the overview page")
  public GetEvaluationTemplatesResponse getEvaluationTemplateOverview(
      @RequestBody @Valid GetEvaluationTemplatesRequest getEvaluationTemplatesRequest) {
    return evaluationTemplateService.getEvaluationTemplates(getEvaluationTemplatesRequest);
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

  @GetExchange(value = "/expected-template/{statisticId}", accept = APPLICATION_JSON_VALUE)
  @ApiResponse(
      responseCode = "200",
      description = "The information for a template based on this statistic")
  @Operation(summary = "Get the information for the expected template")
  public ExpectedEvaluationTemplateDto getTemplateInformation(
      @PathVariable(name = "statisticId") UUID statisticId) {
    statisticService.checkPermissionForStatistic(statisticId);
    EvaluationTemplateData evaluationTemplateData =
        statisticService.getEvaluationTemplateData(statisticId);
    List<AvailableDataSource> relevantAvailableDataSources =
        dataSourceValidator.validateDataSourcesAndGetRelevantAvailableDataSources(
            evaluationTemplateData.dataSources());
    return EvaluationTemplateMapper.mapToExpectedEvaluationTemplate(
        evaluationTemplateData, relevantAvailableDataSources);
  }
}
