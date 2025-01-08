/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.centralrepository;

import static de.eshg.rest.service.security.config.BaseUrls.Statistics.CENTRAL_REPOSITORY_CONTROLLER;
import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;

import de.eshg.statistics.EvaluationTemplateService;
import de.eshg.statistics.aggregation.DataSourceValidator;
import de.eshg.statistics.api.datasource.AvailableDataSource;
import de.eshg.statistics.api.evaluationtemplate.AddEvaluationTemplateToRepositoryRequest;
import de.eshg.statistics.api.evaluationtemplate.EvaluationTemplateDetailsFromRepository;
import de.eshg.statistics.api.evaluationtemplate.EvaluationTemplateFromRepository;
import de.eshg.statistics.api.evaluationtemplate.GetEvaluationTemplatesFromRepositoryResponse;
import de.eshg.statistics.centralrepository.dto.evaluationtemplate.RepoEvaluationTemplate;
import de.eshg.statistics.datatransfer.EvaluationTemplateData;
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
import org.springframework.web.service.annotation.PostExchange;

@RestController
@HttpExchange(value = CENTRAL_REPOSITORY_CONTROLLER)
@Tag(name = "StatisticsCentralRepository")
public class StatisticsCentralRepositoryController {
  private final StatisticsCentralRepositoryService statisticsCentralRepositoryService;
  private final EvaluationTemplateService evaluationTemplateService;
  private final DataSourceValidator dataSourceValidator;

  public StatisticsCentralRepositoryController(
      StatisticsCentralRepositoryService statisticsCentralRepositoryService,
      EvaluationTemplateService evaluationTemplateService,
      DataSourceValidator dataSourceValidator) {
    this.statisticsCentralRepositoryService = statisticsCentralRepositoryService;
    this.evaluationTemplateService = evaluationTemplateService;
    this.dataSourceValidator = dataSourceValidator;
  }

  @PostExchange(value = "/evaluation-template", accept = APPLICATION_JSON_VALUE)
  @ApiResponse(
      responseCode = "200",
      description = "Returns the information about the uploaded evaluation template")
  @Operation(summary = "Upload an evaluation template to the central repository")
  public EvaluationTemplateFromRepository uploadEvaluationTemplateToRepository(
      @Valid @RequestBody AddEvaluationTemplateToRepositoryRequest request) {
    return statisticsCentralRepositoryService.uploadEvaluationTemplateToRepository(request);
  }

  @GetExchange(value = "/evaluation-template", accept = APPLICATION_JSON_VALUE)
  @ApiResponse(responseCode = "200", description = "Get meta data of uploaded evaluation templates")
  @Operation(summary = "Meta data of uploaded evaluation templates")
  public GetEvaluationTemplatesFromRepositoryResponse getEvaluationTemplatesFromRepository() {
    return statisticsCentralRepositoryService.getEvaluationTemplatesFromRepository();
  }

  @GetExchange(value = "/evaluation-template/{id}/{version}", accept = APPLICATION_JSON_VALUE)
  @ApiResponse(
      responseCode = "200",
      description = "Get information about an uploaded evaluation template")
  @Operation(summary = "Information about an uploaded evaluation template")
  public EvaluationTemplateDetailsFromRepository getEvaluationTemplateFromRepository(
      @PathVariable("id") long id, @PathVariable("version") int version) {
    return statisticsCentralRepositoryService.getEvaluationTemplateFromRepository(id, version);
  }

  @PostExchange(value = "/evaluation-template/{id}/{version}", accept = APPLICATION_JSON_VALUE)
  @ApiResponse(
      responseCode = "200",
      description = "The id of the locally stored evaluation template")
  @Operation(summary = "Download an evaluation template from the central repository")
  public UUID downloadEvaluationTemplateFromRepository(
      @PathVariable("id") long id, @PathVariable("version") int version) {
    RepoEvaluationTemplate repoEvaluationTemplate =
        statisticsCentralRepositoryService.getRepoEvaluationTemplate(id, version);

    EvaluationTemplateData evaluationTemplateData =
        RepoMapper.mapToEvaluationTemplateData(repoEvaluationTemplate);
    List<AvailableDataSource> relevantAvailableDataSources =
        dataSourceValidator.validateDataSourcesAndGetRelevantAvailableDataSources(
            evaluationTemplateData.dataSources());

    return evaluationTemplateService
        .addEvaluationTemplate(
            repoEvaluationTemplate.name(),
            repoEvaluationTemplate.description(),
            evaluationTemplateData,
            relevantAvailableDataSources)
        .id();
  }

  @DeleteExchange(value = "/evaluation-template/{id}/{version}", accept = APPLICATION_JSON_VALUE)
  @ApiResponse(
      responseCode = "200",
      description = "Returned when the evaluation template was deleted")
  @Operation(summary = "Delete an evaluation template from the central repository")
  public void deleteEvaluationTemplateFromRepository(
      @PathVariable("id") long id, @PathVariable("version") int version) {
    statisticsCentralRepositoryService.deleteEvaluationTemplateFromRepository(id, version);
  }
}
