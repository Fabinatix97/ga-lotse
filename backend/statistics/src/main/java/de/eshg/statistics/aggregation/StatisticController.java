/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.aggregation;

import static de.eshg.statistics.aggregation.StatisticController.BASE_URL;
import static de.eshg.statistics.config.StatisticsFeature.CLONE_STATISTIC;
import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;

import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.security.config.BaseUrls;
import de.eshg.statistics.api.AbstractAddStatisticRequest;
import de.eshg.statistics.api.AbstractUpdateStatisticRequest;
import de.eshg.statistics.api.CloneStatisticRequest;
import de.eshg.statistics.api.GetDetailPageInformationResponse;
import de.eshg.statistics.api.GetStatisticRequest;
import de.eshg.statistics.api.GetStatisticResponse;
import de.eshg.statistics.api.GetStatisticsRequest;
import de.eshg.statistics.api.GetStatisticsResponse;
import de.eshg.statistics.api.UpdateStatisticTimeRangeRequest;
import de.eshg.statistics.api.completeness.GetCompletenessDataResponse;
import de.eshg.statistics.api.report.GetReportSeriesEntriesOfStatisticResponse;
import de.eshg.statistics.config.StatisticsFeature;
import de.eshg.statistics.config.StatisticsFeatureToggle;
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
import org.springframework.web.service.annotation.PatchExchange;
import org.springframework.web.service.annotation.PostExchange;

@RestController
@HttpExchange(BASE_URL)
@Tag(name = "Statistic")
public class StatisticController {
  public static final String BASE_URL = BaseUrls.Statistics.STATISTIC_CONTROLLER;

  private final StatisticService statisticService;
  private final StatisticExecutorService statisticExecutorService;
  private final StatisticExecution statisticExecution;
  private final StatisticCopyService statisticCopyService;
  private final StatisticsFeatureToggle featureToggle;

  public StatisticController(
      StatisticService statisticService,
      StatisticExecutorService statisticExecutorService,
      StatisticExecution statisticExecution,
      StatisticCopyService statisticCopyService,
      StatisticsFeatureToggle featureToggle) {
    this.statisticService = statisticService;
    this.statisticExecutorService = statisticExecutorService;
    this.statisticExecution = statisticExecution;
    this.statisticCopyService = statisticCopyService;
    this.featureToggle = featureToggle;
  }

  @PostExchange(accept = APPLICATION_JSON_VALUE)
  @ApiResponse(responseCode = "200", description = "The UUID of the statistic")
  @Operation(summary = "Add statistic")
  public UUID addStatistic(@Valid @RequestBody AbstractAddStatisticRequest addStatisticRequest) {
    if (!featureToggle.isNewFeatureEnabled(StatisticsFeature.FAKE_ANONYMIZATION)
        && addStatisticRequest.anonymized()) {
      throw new BadRequestException("Only allowed without anonymization");
    }
    UUID statisticId = statisticService.addStatistic(addStatisticRequest);
    statisticExecutorService.submit(() -> statisticExecution.addStatistic(statisticId));
    return statisticId;
  }

  @PatchExchange(value = "/{statisticId}", accept = APPLICATION_JSON_VALUE)
  @Operation(summary = "Update statistic")
  public void updateStatistic(
      @PathVariable(name = "statisticId") UUID statisticId,
      @Valid @RequestBody AbstractUpdateStatisticRequest updateStatisticRequest) {
    statisticService.checkPermissionForStatistic(statisticId);
    statisticService.updateStatistic(statisticId, updateStatisticRequest);
    if (updateStatisticRequest instanceof UpdateStatisticTimeRangeRequest) {
      statisticExecutorService.submit(() -> statisticExecution.updateStatistic(statisticId));
    }
  }

  @PostExchange(value = "/clone", accept = APPLICATION_JSON_VALUE)
  @ApiResponse(responseCode = "200", description = "The UUID of the cloned statistic")
  @Operation(summary = "Clone a statistic")
  public UUID cloneStatistic(@Valid @RequestBody CloneStatisticRequest cloneStatisticRequest) {
    featureToggle.assertNewFeatureIsEnabled(CLONE_STATISTIC);
    statisticService.checkPermissionForStatistic(cloneStatisticRequest.originalStatisticId());
    UUID originalId = cloneStatisticRequest.originalStatisticId();
    UUID copyId = statisticCopyService.addCopy(cloneStatisticRequest);

    statisticExecutorService.submit(() -> statisticExecution.cloneStatistic(originalId, copyId));

    return copyId;
  }

  @PostExchange(value = "/overview", accept = APPLICATION_JSON_VALUE)
  @ApiResponse(responseCode = "200", description = "All statistics")
  @Operation(summary = "Get all statistics")
  public GetStatisticsResponse getStatistics(
      @RequestBody @Valid GetStatisticsRequest getStatisticsRequest) {
    return statisticService.getStatistics(getStatisticsRequest);
  }

  @GetExchange(value = "/{statisticId}", accept = APPLICATION_JSON_VALUE)
  @ApiResponse(responseCode = "200", description = "The information for the detail page")
  @Operation(summary = "Get the information for the detail page")
  public GetDetailPageInformationResponse getDetailPageInformation(
      @PathVariable(name = "statisticId") UUID statisticId) {
    statisticService.checkPermissionForStatistic(statisticId);
    return statisticService.getDetailPageInformation(statisticId);
  }

  @DeleteExchange(value = "/{statisticId}", accept = APPLICATION_JSON_VALUE)
  @ApiResponse(responseCode = "200", description = "Returned when the statistic is deleted")
  @Operation(summary = "Delete a statistic")
  public void deleteStatistic(@PathVariable(name = "statisticId") UUID statisticId) {
    statisticService.checkPermissionForStatistic(statisticId);
    statisticService.prepareStatisticForDeletion(statisticId);
    statisticExecutorService.submit(() -> statisticExecution.deleteStatistic(statisticId));
  }

  @PostExchange(
      value = BaseUrls.Statistics.RETRIEVE_DATA_URL + "/{statisticId}",
      accept = APPLICATION_JSON_VALUE)
  @ApiResponse(responseCode = "200", description = "Statistic with data")
  @Operation(summary = "Get data from one statistic")
  public GetStatisticResponse getStatistic(
      @PathVariable(name = "statisticId") UUID statisticId,
      @RequestBody @Valid GetStatisticRequest getStatisticRequest) {
    statisticService.checkPermissionForStatistic(statisticId);
    return statisticService.getStatistic(statisticId, getStatisticRequest);
  }

  @GetExchange(value = "/completeness/{statisticId}", accept = APPLICATION_JSON_VALUE)
  @ApiResponse(responseCode = "200", description = "Completeness of a statistic")
  @Operation(summary = "Get information about the completeness of the statistic data")
  public GetCompletenessDataResponse getCompletenessInformation(
      @PathVariable(name = "statisticId") UUID statisticId) {
    statisticService.checkPermissionForStatistic(statisticId);
    return statisticService.getCompletenessInformation(statisticId);
  }

  @GetExchange(value = "/{statisticId}/report-series", accept = APPLICATION_JSON_VALUE)
  @ApiResponse(responseCode = "200", description = "Report series entries for the statistic")
  @Operation(summary = "Get report series entries for the statistic")
  public GetReportSeriesEntriesOfStatisticResponse getReportSeriesEntriesOfStatistic(
      @PathVariable(name = "statisticId") UUID statisticId) {
    featureToggle.assertNewFeatureIsEnabled(StatisticsFeature.REPORTS);
    statisticService.checkPermissionForStatistic(statisticId);
    return statisticService.getReportSeriesEntriesOfStatistic(statisticId);
  }
}
