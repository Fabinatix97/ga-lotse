/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.diagramcreation;

import de.eshg.statistics.GeoJsonHandler;
import de.eshg.statistics.aggregation.AggregationResultUtil;
import de.eshg.statistics.aggregation.AnalysisService;
import de.eshg.statistics.aggregation.TableRowSpecifications;
import de.eshg.statistics.api.AddDiagramRequest;
import de.eshg.statistics.api.chart.CalculationDto;
import de.eshg.statistics.api.chart.ChoroplethMapConfigurationDto;
import de.eshg.statistics.api.filter.TableColumnFilterParameter;
import de.eshg.statistics.config.StatisticsConfig;
import de.eshg.statistics.mapper.AnalysisMapper;
import de.eshg.statistics.persistence.entity.AbstractAggregationResult;
import de.eshg.statistics.persistence.entity.Analysis;
import de.eshg.statistics.persistence.entity.CellEntry;
import de.eshg.statistics.persistence.entity.Diagram;
import de.eshg.statistics.persistence.entity.TableColumn;
import de.eshg.statistics.persistence.entity.TableColumnValueType;
import de.eshg.statistics.persistence.entity.TableRow;
import de.eshg.statistics.persistence.entity.diagramdata.ChoroplethMapData;
import de.eshg.statistics.persistence.entity.diagramdata.KeyToValue;
import de.eshg.statistics.persistence.repository.AnalysisRepository;
import de.eshg.statistics.persistence.repository.TableRowRepository;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;
import org.apache.commons.lang3.StringUtils;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ChoroplethMapDiagramCreationService
    extends AbstractChartDiagramCreationService<
        Map<String, List<BigDecimal>>, ChoroplethMapConfigurationDto> {
  public ChoroplethMapDiagramCreationService(
      AnalysisService analysisService,
      AnalysisRepository analysisRepository,
      TableRowRepository tableRowRepository,
      StatisticsConfig statisticsConfig) {
    super(analysisService, analysisRepository, tableRowRepository, statisticsConfig);
  }

  @Override
  Map<String, List<BigDecimal>> initializeChartDataHolder() {
    return new TreeMap<>();
  }

  @Override
  @Transactional(readOnly = true)
  public int collectChartData(
      UUID analysisId,
      ChoroplethMapConfigurationDto choroplethMapConfigurationDto,
      List<TableColumnFilterParameter> filters,
      int page,
      Map<String, List<BigDecimal>> chartDataHolder) {
    Analysis analysis = analysisService.getAnalysisInternal(analysisId);
    AbstractAggregationResult aggregationResult = analysis.getAggregationResult();

    TableColumn primaryTableColumn =
        AggregationResultUtil.getTableColumn(
            choroplethMapConfigurationDto.primaryAttribute(), aggregationResult);
    TableColumn secondaryTableColumn =
        AggregationResultUtil.getTableColumn(
            choroplethMapConfigurationDto.secondaryAttribute(), aggregationResult);
    List<String> geoKeys = GeoJsonHandler.getGeoKeys(choroplethMapConfigurationDto.geoJson());

    if (page == 0) {
      AggregationResultUtil.validateColumnFilters(filters, aggregationResult);
      initializeChoroplethMapData(chartDataHolder, geoKeys);
    }

    List<Specification<TableRow>> specifications =
        getNotNullSpecificationsForChoroplethMap(primaryTableColumn, secondaryTableColumn);

    specifications.add(
        TableRowSpecifications.getValueOptionFilterSpecification(
            primaryTableColumn, geoKeys, false));

    return collectDataForTablePageAndReturnMaxPage(
        page,
        specifications.stream(),
        filters,
        aggregationResult,
        tableRow ->
            addTableRowToCollectedChoroplethMapData(
                tableRow, chartDataHolder, primaryTableColumn, secondaryTableColumn));
  }

  private static void initializeChoroplethMapData(
      Map<String, List<BigDecimal>> chartDataHolder, List<String> geoKeys) {
    geoKeys.forEach(geoKey -> chartDataHolder.computeIfAbsent(geoKey, key -> new ArrayList<>()));
  }

  private static List<Specification<TableRow>> getNotNullSpecificationsForChoroplethMap(
      TableColumn primaryTableColumn, TableColumn secondaryTableColumn) {
    List<Specification<TableRow>> notNullSpecifications = new ArrayList<>();
    notNullSpecifications.add(TableRowSpecifications.getNotNullSpecification(primaryTableColumn));
    if (secondaryTableColumn != null) {
      switch (secondaryTableColumn.getValueType()) {
        case TableColumnValueType.BOOLEAN ->
            notNullSpecifications.add(
                TableRowSpecifications.getNotNullSpecification(secondaryTableColumn));
        case TableColumnValueType.DECIMAL, TableColumnValueType.INTEGER ->
            notNullSpecifications.add(
                TableRowSpecifications.getNotNullAndNotUnknownSpecificationDecimalAndInteger(
                    secondaryTableColumn));
        default ->
            throw new IllegalStateException(
                "Unexpected value type: " + secondaryTableColumn.getValueType());
      }
    }
    return notNullSpecifications;
  }

  private static void addTableRowToCollectedChoroplethMapData(
      TableRow tableRow,
      Map<String, List<BigDecimal>> chartDataHolder,
      TableColumn primaryTableColumn,
      TableColumn secondaryTableColumn) {
    String primaryKey = getKeyForTextOrValueOption(getCellEntry(tableRow, primaryTableColumn));

    if (StringUtils.isBlank(primaryKey)) {
      return;
    }
    BigDecimal value;
    if (secondaryTableColumn == null) {
      value = BigDecimal.ONE;
    } else {
      CellEntry cellEntry = getCellEntry(tableRow, secondaryTableColumn);
      value = getValueAsBigDecimal(secondaryTableColumn.getValueType(), cellEntry);
    }

    chartDataHolder.computeIfAbsent(primaryKey, key -> new ArrayList<>()).add(value);
  }

  private static String getKeyForTextOrValueOption(CellEntry cellEntry) {
    if (cellEntry.getValue() == null) {
      return null;
    }

    String stringValue = cellEntry.getValue().toString();
    return switch (cellEntry.getTableColumn().getValueType()) {
      case TableColumnValueType.TEXT -> stringValue;
      case TableColumnValueType.VALUE_WITH_OPTIONS -> {
        if (getValueToMeaningKeys(cellEntry.getTableColumn()).contains(stringValue)) {
          yield stringValue;
        } else {
          yield null;
        }
      }
      default ->
          throw new IllegalStateException(
              "Unexpected value type: " + cellEntry.getTableColumn().getValueType());
    };
  }

  @Override
  @Transactional
  public UUID addDiagram(
      UUID analysisId,
      ChoroplethMapConfigurationDto choroplethMapConfigurationDto,
      AddDiagramRequest addDiagramRequest,
      Map<String, List<BigDecimal>> chartDataHolder) {
    Analysis analysis = analysisService.getAnalysisInternal(analysisId);

    List<KeyToValue> keyToValues = new ArrayList<>();
    AtomicInteger evaluatedDataAmount = new AtomicInteger(0);
    chartDataHolder.forEach(
        (key, value) -> {
          KeyToValue keyToValue = new KeyToValue();
          keyToValue.setKey(key);
          BigDecimal sum = value.stream().reduce(BigDecimal.ZERO, BigDecimal::add);
          if (CalculationDto.MEAN.equals(choroplethMapConfigurationDto.calculation())) {
            BigDecimal mean =
                value.isEmpty()
                    ? null
                    : sum.divide(new BigDecimal(value.size()), 4, RoundingMode.HALF_UP);
            keyToValue.setValue(mean);
          } else {
            keyToValue.setValue(sum);
          }
          keyToValues.add(keyToValue);
          evaluatedDataAmount.addAndGet(value.size());
        });

    ChoroplethMapData choroplethMapData = new ChoroplethMapData();
    choroplethMapData.addKeyToValues(keyToValues);
    choroplethMapData.setEvaluatedDataAmount(evaluatedDataAmount.get());

    Diagram diagram =
        AnalysisMapper.mapToPersistence(addDiagramRequest, choroplethMapData, analysis);

    analysisRepository.flush();
    return diagram.getExternalId();
  }
}
