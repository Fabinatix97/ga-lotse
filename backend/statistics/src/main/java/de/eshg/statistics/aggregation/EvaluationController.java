/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.aggregation;

import static de.eshg.statistics.aggregation.EvaluationController.BASE_URL;
import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;

import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.security.config.BaseUrls;
import de.eshg.statistics.api.GetDetailPageInformationResponse;
import de.eshg.statistics.api.completeness.GetCompletenessDataResponse;
import de.eshg.statistics.api.evaluation.AbstractAddEvaluationRequest;
import de.eshg.statistics.api.evaluation.AbstractUpdateEvaluationRequest;
import de.eshg.statistics.api.evaluation.CloneEvaluationRequest;
import de.eshg.statistics.api.evaluation.GetEvaluationRequest;
import de.eshg.statistics.api.evaluation.GetEvaluationResponse;
import de.eshg.statistics.api.evaluation.GetEvaluationsRequest;
import de.eshg.statistics.api.evaluation.GetEvaluationsResponse;
import de.eshg.statistics.api.evaluation.UpdateEvaluationTimeRangeRequest;
import de.eshg.statistics.api.report.GetReportSeriesEntriesOfEvaluationResponse;
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
@Tag(name = "Evaluation")
public class EvaluationController {
  public static final String BASE_URL = BaseUrls.Statistics.EVALUATION_CONTROLLER;

  private final EvaluationService evaluationService;
  private final StatisticsExecutorService statisticsExecutorService;
  private final EvaluationExecution evaluationExecution;
  private final EvaluationCopyService evaluationCopyService;
  private final StatisticsFeatureToggle featureToggle;

  public EvaluationController(
      EvaluationService evaluationService,
      StatisticsExecutorService statisticsExecutorService,
      EvaluationExecution evaluationExecution,
      EvaluationCopyService evaluationCopyService,
      StatisticsFeatureToggle featureToggle) {
    this.evaluationService = evaluationService;
    this.statisticsExecutorService = statisticsExecutorService;
    this.evaluationExecution = evaluationExecution;
    this.evaluationCopyService = evaluationCopyService;
    this.featureToggle = featureToggle;
  }

  @PostExchange(accept = APPLICATION_JSON_VALUE)
  @ApiResponse(responseCode = "200", description = "The UUID of the evaluation")
  @Operation(summary = "Add evaluation")
  public UUID addEvaluation(@Valid @RequestBody AbstractAddEvaluationRequest addEvaluationRequest) {
    if (!featureToggle.isNewFeatureEnabled(StatisticsFeature.FAKE_ANONYMIZATION)
        && addEvaluationRequest.anonymized()) {
      throw new BadRequestException("Only allowed without anonymization");
    }
    UUID evaluationId = evaluationService.addEvaluation(addEvaluationRequest);
    statisticsExecutorService.submit(() -> evaluationExecution.addEvaluation(evaluationId));
    return evaluationId;
  }

  @PatchExchange(value = "/{evaluationId}", accept = APPLICATION_JSON_VALUE)
  @Operation(summary = "Update evaluation")
  public void updateEvaluation(
      @PathVariable(name = "evaluationId") UUID evaluationId,
      @Valid @RequestBody AbstractUpdateEvaluationRequest updateEvaluationRequest) {
    evaluationService.checkPermissionForEvaluation(evaluationId);
    evaluationService.updateEvaluation(evaluationId, updateEvaluationRequest);
    if (updateEvaluationRequest instanceof UpdateEvaluationTimeRangeRequest) {
      statisticsExecutorService.submit(() -> evaluationExecution.updateEvaluation(evaluationId));
    }
  }

  @PostExchange(value = "/clone", accept = APPLICATION_JSON_VALUE)
  @ApiResponse(responseCode = "200", description = "The UUID of the cloned evaluation")
  @Operation(summary = "Clone an evaluation")
  public UUID cloneEvaluation(@Valid @RequestBody CloneEvaluationRequest cloneEvaluationRequest) {
    evaluationService.checkPermissionForEvaluation(cloneEvaluationRequest.originalEvaluationId());
    UUID originalId = cloneEvaluationRequest.originalEvaluationId();
    UUID copyId = evaluationCopyService.addCopy(cloneEvaluationRequest);

    statisticsExecutorService.submit(() -> evaluationExecution.cloneEvaluation(originalId, copyId));

    return copyId;
  }

  @PostExchange(value = "/overview", accept = APPLICATION_JSON_VALUE)
  @ApiResponse(responseCode = "200", description = "All evaluations")
  @Operation(summary = "Get all evaluations")
  public GetEvaluationsResponse getEvaluations(
      @RequestBody @Valid GetEvaluationsRequest getEvaluationsRequest) {
    return evaluationService.getEvaluations(getEvaluationsRequest);
  }

  @GetExchange(value = "/{evaluationId}", accept = APPLICATION_JSON_VALUE)
  @ApiResponse(responseCode = "200", description = "The information for the detail page")
  @Operation(summary = "Get the information for the detail page")
  public GetDetailPageInformationResponse getDetailPageInformation(
      @PathVariable(name = "evaluationId") UUID evaluationId) {
    evaluationService.checkPermissionForEvaluation(evaluationId);
    return evaluationService.getDetailPageInformation(evaluationId);
  }

  @DeleteExchange(value = "/{evaluationId}", accept = APPLICATION_JSON_VALUE)
  @ApiResponse(responseCode = "200", description = "Returned when the evaluation is deleted")
  @Operation(summary = "Delete an evaluation")
  public void deleteEvaluation(@PathVariable(name = "evaluationId") UUID evaluationId) {
    evaluationService.checkPermissionForEvaluation(evaluationId);
    evaluationService.prepareEvaluationForDeletion(evaluationId);
    statisticsExecutorService.submit(() -> evaluationExecution.deleteEvaluation(evaluationId));
  }

  @PostExchange(
      value = BaseUrls.Statistics.RETRIEVE_DATA_URL + "/{evaluationId}",
      accept = APPLICATION_JSON_VALUE)
  @ApiResponse(responseCode = "200", description = "Evaluation with data")
  @Operation(summary = "Get data from one evaluation")
  public GetEvaluationResponse getEvaluation(
      @PathVariable(name = "evaluationId") UUID evaluationId,
      @RequestBody @Valid GetEvaluationRequest getEvaluationRequest) {
    evaluationService.checkPermissionForEvaluation(evaluationId);
    return evaluationService.getEvaluation(evaluationId, getEvaluationRequest);
  }

  @GetExchange(value = "/completeness/{evaluationId}", accept = APPLICATION_JSON_VALUE)
  @ApiResponse(responseCode = "200", description = "Completeness of an evaluation")
  @Operation(summary = "Get information about the completeness of the evaluation data")
  public GetCompletenessDataResponse getCompletenessInformation(
      @PathVariable(name = "evaluationId") UUID evaluationId) {
    evaluationService.checkPermissionForEvaluation(evaluationId);
    return evaluationService.getCompletenessInformation(evaluationId);
  }

  @GetExchange(value = "/{evaluationId}/report-series", accept = APPLICATION_JSON_VALUE)
  @ApiResponse(responseCode = "200", description = "Report series entries for the evaluation")
  @Operation(summary = "Get report series entries for the evaluation")
  public GetReportSeriesEntriesOfEvaluationResponse getReportSeriesEntriesOfEvaluation(
      @PathVariable(name = "evaluationId") UUID evaluationId) {
    featureToggle.assertNewFeatureIsEnabled(StatisticsFeature.REPORTS);
    evaluationService.checkPermissionForEvaluation(evaluationId);
    return evaluationService.getReportSeriesEntriesOfEvaluation(evaluationId);
  }
}
