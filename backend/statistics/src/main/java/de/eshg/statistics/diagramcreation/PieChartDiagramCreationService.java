/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.diagramcreation;

import de.eshg.statistics.aggregation.AggregationResultUtil;
import de.eshg.statistics.aggregation.AnalysisService;
import de.eshg.statistics.aggregation.TableRowSpecifications;
import de.eshg.statistics.api.filter.TableColumnFilterParameter;
import de.eshg.statistics.config.StatisticsConfig;
import de.eshg.statistics.mapper.AnalysisMapper;
import de.eshg.statistics.mapper.FilterParameterMapper;
import de.eshg.statistics.persistence.entity.AbstractAggregationResult;
import de.eshg.statistics.persistence.entity.Analysis;
import de.eshg.statistics.persistence.entity.Diagram;
import de.eshg.statistics.persistence.entity.TableColumn;
import de.eshg.statistics.persistence.entity.TableColumnValueType;
import de.eshg.statistics.persistence.entity.TableRow;
import de.eshg.statistics.persistence.entity.chart.PieChartConfiguration;
import de.eshg.statistics.persistence.entity.diagramdata.KeyToCount;
import de.eshg.statistics.persistence.entity.diagramdata.PieChartData;
import de.eshg.statistics.persistence.repository.TableRowRepository;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Stream;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PieChartDiagramCreationService
    extends AbstractChartDiagramCreationService<Map<Object, Integer>> {
  public PieChartDiagramCreationService(
      AnalysisService analysisService,
      TableRowRepository tableRowRepository,
      StatisticsConfig statisticsConfig) {
    super(analysisService, tableRowRepository, statisticsConfig);
  }

  @Override
  @Transactional(readOnly = true)
  public Map<Object, Integer> initializeChartDataHolder(UUID diagramId) {
    Analysis analysis = analysisService.getDiagramInternal(diagramId).getAnalysis();
    AbstractAggregationResult aggregationResult = analysis.getAggregationResult();

    TableColumn tableColumn =
        AggregationResultUtil.getTableColumn(
            getPieChartConfiguration(analysis).getAttributeSelection(), aggregationResult);

    return createCountingMap(tableColumn);
  }

  private static PieChartConfiguration getPieChartConfiguration(Analysis analysis) {
    return (PieChartConfiguration) AnalysisMapper.getChartConfiguration(analysis);
  }

  @Override
  @Transactional(readOnly = true)
  public int collectChartData(UUID diagramId, int page, Map<Object, Integer> chartDataHolder) {
    Diagram diagram = analysisService.getDiagramInternal(diagramId);
    AbstractAggregationResult aggregationResult = diagram.getAnalysis().getAggregationResult();
    PieChartConfiguration pieChartConfiguration = getPieChartConfiguration(diagram.getAnalysis());

    TableColumn tableColumn =
        AggregationResultUtil.getTableColumn(
            pieChartConfiguration.getAttributeSelection(), aggregationResult);
    Stream<Specification<TableRow>> notNullSpecifications =
        Stream.of(TableRowSpecifications.getNotNullSpecification(tableColumn));

    List<TableColumnFilterParameter> filters = FilterParameterMapper.mapToApi(diagram.getFilters());
    return collectDataForTablePageAndReturnMaxPage(
        page,
        notNullSpecifications,
        filters,
        aggregationResult,
        tableRow -> addTableRowToCollectedPieChartData(tableRow, chartDataHolder, tableColumn));
  }

  private static void addTableRowToCollectedPieChartData(
      TableRow tableRow, Map<Object, Integer> collectedChartData, TableColumn tableColumn) {
    Object primaryKey =
        getKeyForCellEntryBooleanIntegerIntervalTextDateOrValueOption(
            getCellEntry(tableRow, tableColumn));
    if (primaryKey != null) {
      collectedChartData.compute(primaryKey, (key, count) -> (count == null) ? 1 : count + 1);
    }
  }

  @Override
  @Transactional
  public void fillDiagramData(UUID diagramId, Map<Object, Integer> chartDataHolder) {
    Diagram diagram = analysisService.getDiagramInternal(diagramId);

    TableColumn tableColumn =
        AggregationResultUtil.getTableColumn(
            getPieChartConfiguration(diagram.getAnalysis()).getAttributeSelection(),
            diagram.getAnalysis().getAggregationResult());

    if (!tableColumn.getValueType().equals(TableColumnValueType.BOOLEAN)) {
      List<Object> keysToRemove =
          chartDataHolder.entrySet().stream()
              .filter(entry -> noRelevantValue(entry.getValue()))
              .map(Map.Entry::getKey)
              .toList();
      keysToRemove.forEach(chartDataHolder::remove);
    }

    List<KeyToCount> keyToCounts = mapToKeyToCounts(chartDataHolder);

    int evaluatedEntries = keyToCounts.stream().mapToInt(KeyToCount::getCount).sum();

    PieChartData pieChartData = (PieChartData) diagram.getDiagramData();
    pieChartData.setEvaluatedDataAmount(evaluatedEntries);
    pieChartData.addKeyToCounts(keyToCounts);
    diagram.setDiagramDataEmpty(false);
  }
}
