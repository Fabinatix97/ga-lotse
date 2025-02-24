/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.diagramcreation;

import de.eshg.statistics.aggregation.AggregationResultUtil;
import de.eshg.statistics.aggregation.AnalysisService;
import de.eshg.statistics.aggregation.TableRowSpecifications;
import de.eshg.statistics.api.AddDiagramRequest;
import de.eshg.statistics.api.chart.PieChartConfigurationDto;
import de.eshg.statistics.api.filter.TableColumnFilterParameter;
import de.eshg.statistics.config.StatisticsConfig;
import de.eshg.statistics.mapper.AnalysisMapper;
import de.eshg.statistics.persistence.entity.AbstractAggregationResult;
import de.eshg.statistics.persistence.entity.Analysis;
import de.eshg.statistics.persistence.entity.Diagram;
import de.eshg.statistics.persistence.entity.TableColumn;
import de.eshg.statistics.persistence.entity.TableRow;
import de.eshg.statistics.persistence.entity.diagramdata.KeyToCount;
import de.eshg.statistics.persistence.entity.diagramdata.PieChartData;
import de.eshg.statistics.persistence.repository.AnalysisRepository;
import de.eshg.statistics.persistence.repository.TableRowRepository;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Stream;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PieChartDiagramCreationService
    extends AbstractChartDiagramCreationService<Map<String, Integer>, PieChartConfigurationDto> {
  public PieChartDiagramCreationService(
      AnalysisService analysisService,
      AnalysisRepository analysisRepository,
      TableRowRepository tableRowRepository,
      StatisticsConfig statisticsConfig) {
    super(analysisService, analysisRepository, tableRowRepository, statisticsConfig);
  }

  @Override
  Map<String, Integer> initializeChartDataHolder() {
    return new HashMap<>();
  }

  @Override
  @Transactional(readOnly = true)
  public int collectChartData(
      UUID analysisId,
      PieChartConfigurationDto pieChartConfigurationDto,
      List<TableColumnFilterParameter> filters,
      int page,
      Map<String, Integer> chartDataHolder) {
    Analysis analysis = analysisService.getAnalysisInternal(analysisId);
    AbstractAggregationResult aggregationResult = analysis.getAggregationResult();

    TableColumn tableColumn =
        AggregationResultUtil.getTableColumn(
            pieChartConfigurationDto.attribute(), aggregationResult);
    if (page == 0) {
      AggregationResultUtil.validateColumnFilters(filters, aggregationResult);
      initiallyFillPieChartMap(chartDataHolder, tableColumn);
    }

    Stream<Specification<TableRow>> notNullSpecifications =
        Stream.of(TableRowSpecifications.getNotNullSpecification(tableColumn));

    return collectDataForTablePageAndReturnMaxPage(
        page,
        notNullSpecifications,
        filters,
        aggregationResult,
        tableRow -> addTableRowToCollectedPieChartData(tableRow, chartDataHolder, tableColumn));
  }

  private static void initiallyFillPieChartMap(
      Map<String, Integer> chartDataHolder, TableColumn tableColumn) {
    Set<String> keys = getKeysForBooleanOrValueOption(tableColumn);
    keys.forEach(key -> chartDataHolder.put(key, 0));
  }

  private static void addTableRowToCollectedPieChartData(
      TableRow tableRow, Map<String, Integer> collectedChartData, TableColumn tableColumn) {
    String primaryKey =
        getKeyForCellEntryBooleanTextOrValueOption(getCellEntry(tableRow, tableColumn));
    if (primaryKey != null) {
      collectedChartData.compute(primaryKey, (key, count) -> (count == null) ? 1 : count + 1);
    }
  }

  @Override
  @Transactional
  public UUID addDiagram(
      UUID analysisId,
      PieChartConfigurationDto ignored,
      AddDiagramRequest addDiagramRequest,
      Map<String, Integer> chartDataHolder) {
    Analysis analysis = analysisService.getAnalysisInternal(analysisId);

    List<KeyToCount> keyToCounts = mapToSortedKeyToCountList(chartDataHolder);

    int evaluatedEntries = keyToCounts.stream().mapToInt(KeyToCount::getCount).sum();

    PieChartData pieChartData = new PieChartData();
    pieChartData.setEvaluatedDataAmount(evaluatedEntries);
    pieChartData.addKeyToCounts(keyToCounts);

    Diagram diagram = AnalysisMapper.mapToPersistence(addDiagramRequest, pieChartData, analysis);

    analysisRepository.flush();
    return diagram.getExternalId();
  }
}
