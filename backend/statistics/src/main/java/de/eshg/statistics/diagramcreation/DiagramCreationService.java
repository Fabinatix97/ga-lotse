/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.diagramcreation;

import de.eshg.statistics.aggregation.AnalysisService;
import de.eshg.statistics.api.chart.BarChartConfigurationDto;
import de.eshg.statistics.api.chart.ChartConfigurationDto;
import de.eshg.statistics.api.chart.ChoroplethMapConfigurationDto;
import de.eshg.statistics.api.chart.HistogramChartConfigurationDto;
import de.eshg.statistics.api.chart.LineChartConfigurationDto;
import de.eshg.statistics.api.chart.PieChartConfigurationDto;
import de.eshg.statistics.api.chart.ScatterChartConfigurationDto;
import java.util.UUID;
import org.springframework.stereotype.Service;

@Service
public class DiagramCreationService {
  private final BarChartDiagramCreationService barChartDiagramCreationService;
  private final ChoroplethMapDiagramCreationService choroplethMapDiagramCreationService;
  private final HistogramChartDiagramCreationService histogramChartDiagramCreationService;
  private final PieChartDiagramCreationService pieChartDiagramCreationService;
  private final PointBasedChartDiagramCreationService pointBasedChartDiagramCreationService;
  private final AnalysisService analysisService;

  public DiagramCreationService(
      BarChartDiagramCreationService barChartDiagramCreationService,
      ChoroplethMapDiagramCreationService choroplethMapDiagramCreationService,
      HistogramChartDiagramCreationService histogramChartDiagramCreationService,
      PieChartDiagramCreationService pieChartDiagramCreationService,
      PointBasedChartDiagramCreationService pointBasedChartDiagramCreationService,
      AnalysisService analysisService) {
    this.barChartDiagramCreationService = barChartDiagramCreationService;
    this.choroplethMapDiagramCreationService = choroplethMapDiagramCreationService;
    this.histogramChartDiagramCreationService = histogramChartDiagramCreationService;
    this.pieChartDiagramCreationService = pieChartDiagramCreationService;
    this.pointBasedChartDiagramCreationService = pointBasedChartDiagramCreationService;
    this.analysisService = analysisService;
  }

  public void fillDiagramData(UUID diagramId) {
    ChartConfigurationDto chartConfiguration = analysisService.getChartConfiguration(diagramId);

    switch (chartConfiguration) {
      case BarChartConfigurationDto ignored ->
          fillDiagramWithData(barChartDiagramCreationService, diagramId);
      case ChoroplethMapConfigurationDto ignored ->
          fillDiagramWithData(choroplethMapDiagramCreationService, diagramId);
      case HistogramChartConfigurationDto ignored ->
          fillDiagramWithData(histogramChartDiagramCreationService, diagramId);
      case LineChartConfigurationDto ignored ->
          fillDiagramWithData(pointBasedChartDiagramCreationService, diagramId);
      case PieChartConfigurationDto ignored ->
          fillDiagramWithData(pieChartDiagramCreationService, diagramId);
      case ScatterChartConfigurationDto ignored ->
          fillDiagramWithData(pointBasedChartDiagramCreationService, diagramId);
    }
  }

  private static <D> void fillDiagramWithData(
      AbstractChartDiagramCreationService<D> service, UUID diagramId) {
    D chartDataHolder = service.initializeChartDataHolder(diagramId);
    collectData(service, diagramId, chartDataHolder);
    service.fillDiagramData(diagramId, chartDataHolder);
  }

  private static <D> void collectData(
      AbstractChartDiagramCreationService<D> service, UUID diagramId, D chartDataHolder) {
    int page = 0;
    int maxPage;
    while (true) {
      maxPage = service.collectChartData(diagramId, page, chartDataHolder);
      if (page >= maxPage) {
        break;
      }
      page++;
    }
  }
}
