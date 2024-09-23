/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.aggregation;

import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;

import de.eshg.rest.service.security.config.BaseUrls;
import de.eshg.statistics.api.AddDiagramRequest;
import de.eshg.statistics.api.AddEvaluationRequest;
import de.eshg.statistics.api.EvaluationDto;
import de.eshg.statistics.api.EvaluationWithDiagrams;
import de.eshg.statistics.api.UpdateEvaluationRequest;
import de.eshg.statistics.api.diagram.DiagramDto;
import de.eshg.statistics.api.diagram.UpdateDiagramRequest;
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
import org.springframework.web.service.annotation.PatchExchange;
import org.springframework.web.service.annotation.PostExchange;

@RestController
@Tag(name = "Evaluation")
public class EvaluationController {
  private final EvaluationService evaluationService;
  private final DiagramCreationService diagramCreationService;

  public EvaluationController(
      EvaluationService evaluationService, DiagramCreationService diagramCreationService) {
    this.evaluationService = evaluationService;
    this.diagramCreationService = diagramCreationService;
  }

  @PostExchange(value = BaseUrls.Statistics.EVALUATION_URL, accept = APPLICATION_JSON_VALUE)
  @ApiResponse(responseCode = "200", description = "The added evaluation")
  @Operation(summary = "Add an evaluation")
  public EvaluationDto addEvaluation(
      @RequestBody @Valid AddEvaluationRequest addEvaluationRequest) {
    return evaluationService.addEvaluation(addEvaluationRequest);
  }

  @GetExchange(
      value = BaseUrls.Statistics.EVALUATION_URL + "/{evaluationId}",
      accept = APPLICATION_JSON_VALUE)
  @ApiResponse(responseCode = "200", description = "The requested evaluation")
  @Operation(summary = "Get an evaluation by id")
  public EvaluationWithDiagrams getEvaluation(
      @PathVariable(name = "evaluationId") UUID evaluationId) {
    return evaluationService.getEvaluation(evaluationId);
  }

  @PatchExchange(
      value = BaseUrls.Statistics.EVALUATION_URL + "/{evaluationId}",
      accept = APPLICATION_JSON_VALUE)
  @ApiResponse(responseCode = "200", description = "The patched evaluation")
  @Operation(summary = "Change the name of an evaluation")
  public EvaluationDto updateEvaluation(
      @PathVariable(name = "evaluationId") UUID evaluationId,
      @RequestBody @Valid UpdateEvaluationRequest updateEvaluationRequest) {
    return evaluationService.updateEvaluation(evaluationId, updateEvaluationRequest);
  }

  @DeleteExchange(
      value = BaseUrls.Statistics.EVALUATION_URL + "/{evaluationId}",
      accept = APPLICATION_JSON_VALUE)
  @ApiResponse(responseCode = "200", description = "Returned when the evaluation is deleted")
  @Operation(summary = "Delete an evaluation")
  public void deleteEvaluation(@PathVariable(name = "evaluationId") UUID evaluationId) {
    evaluationService.deleteEvaluation(evaluationId);
  }

  @PostExchange(
      value = BaseUrls.Statistics.EVALUATION_URL + "/{evaluationId}",
      accept = APPLICATION_JSON_VALUE)
  @ApiResponse(responseCode = "200", description = "The id of the diagram")
  @Operation(summary = "Add a diagram to the evaluation")
  public UUID addDiagram(
      @PathVariable(name = "evaluationId") UUID evaluationId,
      @RequestBody @Valid AddDiagramRequest addDiagramRequest) {
    EvaluationDto evaluation = evaluationService.getEvaluationDto(evaluationId);
    return diagramCreationService.createDiagram(evaluation, addDiagramRequest);
  }

  @PatchExchange(
      value = BaseUrls.Statistics.EVALUATION_URL + "/diagram/{diagramId}",
      accept = APPLICATION_JSON_VALUE)
  @ApiResponse(responseCode = "200", description = "The patched diagram")
  @Operation(summary = "Change title and description of a diagram")
  public DiagramDto updateDiagram(
      @PathVariable(name = "diagramId") UUID diagramId,
      @RequestBody @Valid UpdateDiagramRequest updateDiagramRequest) {
    return evaluationService.updateDiagram(diagramId, updateDiagramRequest);
  }

  @DeleteExchange(
      value = BaseUrls.Statistics.EVALUATION_URL + "/diagram/{diagramId}",
      accept = APPLICATION_JSON_VALUE)
  @ApiResponse(responseCode = "200", description = "Returned when the diagram is deleted")
  @Operation(summary = "Delete a diagram")
  public void deleteDiagram(@PathVariable(name = "diagramId") UUID diagramId) {
    evaluationService.deleteDiagram(diagramId);
  }
}
