/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.aggregation;

import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;

import de.eshg.rest.service.security.config.BaseUrls;
import de.eshg.statistics.api.AddAnalysisRequest;
import de.eshg.statistics.api.AddDiagramRequest;
import de.eshg.statistics.api.AnalysisDto;
import de.eshg.statistics.api.AnalysisWithDiagrams;
import de.eshg.statistics.api.UpdateAnalysisRequest;
import de.eshg.statistics.api.diagram.DiagramDto;
import de.eshg.statistics.api.diagram.UpdateDiagramRequest;
import de.eshg.statistics.diagramcreation.DiagramCreationService;
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
@Tag(name = "Analysis")
public class AnalysisController {
  private final EvaluationService evaluationService;
  private final AnalysisService analysisService;
  private final DiagramCreationService diagramCreationService;

  public AnalysisController(
      EvaluationService evaluationService,
      AnalysisService analysisService,
      DiagramCreationService diagramCreationService) {
    this.evaluationService = evaluationService;
    this.analysisService = analysisService;
    this.diagramCreationService = diagramCreationService;
  }

  @PostExchange(value = BaseUrls.Statistics.ANALYSIS_URL, accept = APPLICATION_JSON_VALUE)
  @ApiResponse(responseCode = "200", description = "The added analysis")
  @Operation(summary = "Add an analysis")
  public AnalysisDto addAnalysis(@RequestBody @Valid AddAnalysisRequest addAnalysisRequest) {
    evaluationService.checkPermissionForEvaluation(addAnalysisRequest.evaluationId());
    return analysisService.addAnalysis(addAnalysisRequest);
  }

  @GetExchange(
      value = BaseUrls.Statistics.ANALYSIS_URL + "/{analysisId}",
      accept = APPLICATION_JSON_VALUE)
  @ApiResponse(responseCode = "200", description = "The requested analysis")
  @Operation(summary = "Get an analysis by id")
  public AnalysisWithDiagrams getAnalysis(@PathVariable(name = "analysisId") UUID analysisId) {
    analysisService.checkPermissionForAnalysis(analysisId);
    return analysisService.getAnalysis(analysisId);
  }

  @PatchExchange(
      value = BaseUrls.Statistics.ANALYSIS_URL + "/{analysisId}",
      accept = APPLICATION_JSON_VALUE)
  @ApiResponse(responseCode = "200", description = "The patched analysis")
  @Operation(summary = "Change the name of an analysis")
  public AnalysisDto updateAnalysis(
      @PathVariable(name = "analysisId") UUID analysisId,
      @RequestBody @Valid UpdateAnalysisRequest updateAnalysisRequest) {
    analysisService.checkPermissionForAnalysis(analysisId);
    return analysisService.updateAnalysis(analysisId, updateAnalysisRequest);
  }

  @DeleteExchange(
      value = BaseUrls.Statistics.ANALYSIS_URL + "/{analysisId}",
      accept = APPLICATION_JSON_VALUE)
  @ApiResponse(responseCode = "200", description = "Returned when the analysis is deleted")
  @Operation(summary = "Delete an analysis")
  public void deleteAnalysis(@PathVariable(name = "analysisId") UUID analysisId) {
    analysisService.checkPermissionForAnalysis(analysisId);
    analysisService.deleteAnalysis(analysisId);
  }

  @PostExchange(
      value = BaseUrls.Statistics.ANALYSIS_URL + "/{analysisId}",
      accept = APPLICATION_JSON_VALUE)
  @ApiResponse(responseCode = "200", description = "The id of the diagram")
  @Operation(summary = "Add a diagram to the analysis")
  public UUID addDiagram(
      @PathVariable(name = "analysisId") UUID analysisId,
      @RequestBody @Valid AddDiagramRequest addDiagramRequest) {
    analysisService.checkPermissionForAnalysis(analysisId);
    AnalysisDto analysis = analysisService.getAnalysisDto(analysisId);
    return diagramCreationService.createDiagram(analysis, addDiagramRequest);
  }

  @PatchExchange(
      value = BaseUrls.Statistics.ANALYSIS_URL + "/diagram/{diagramId}",
      accept = APPLICATION_JSON_VALUE)
  @ApiResponse(responseCode = "200", description = "The patched diagram")
  @Operation(summary = "Change title and description of a diagram")
  public DiagramDto updateDiagram(
      @PathVariable(name = "diagramId") UUID diagramId,
      @RequestBody @Valid UpdateDiagramRequest updateDiagramRequest) {
    analysisService.checkPermissionForDiagram(diagramId);
    return analysisService.updateDiagram(diagramId, updateDiagramRequest);
  }

  @DeleteExchange(
      value = BaseUrls.Statistics.ANALYSIS_URL + "/diagram/{diagramId}",
      accept = APPLICATION_JSON_VALUE)
  @ApiResponse(responseCode = "200", description = "Returned when the diagram is deleted")
  @Operation(summary = "Delete a diagram")
  public void deleteDiagram(@PathVariable(name = "diagramId") UUID diagramId) {
    analysisService.checkPermissionForDiagram(diagramId);
    analysisService.deleteDiagram(diagramId);
  }
}
