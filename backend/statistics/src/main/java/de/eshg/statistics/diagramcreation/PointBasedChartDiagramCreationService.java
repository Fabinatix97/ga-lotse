/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.diagramcreation;

import de.eshg.statistics.aggregation.AggregationResultUtil;
import de.eshg.statistics.aggregation.AnalysisService;
import de.eshg.statistics.aggregation.TableRowSpecifications;
import de.eshg.statistics.api.AddDiagramRequest;
import de.eshg.statistics.api.chart.PointBasedChartConfigurationDto;
import de.eshg.statistics.api.chart.ScatterChartConfigurationDto;
import de.eshg.statistics.api.filter.TableColumnFilterParameter;
import de.eshg.statistics.config.StatisticsConfig;
import de.eshg.statistics.mapper.AnalysisMapper;
import de.eshg.statistics.persistence.entity.AbstractAggregationResult;
import de.eshg.statistics.persistence.entity.Analysis;
import de.eshg.statistics.persistence.entity.CellEntry;
import de.eshg.statistics.persistence.entity.Diagram;
import de.eshg.statistics.persistence.entity.TableColumn;
import de.eshg.statistics.persistence.entity.TableRow;
import de.eshg.statistics.persistence.entity.diagramdata.DataPoint;
import de.eshg.statistics.persistence.entity.diagramdata.DataPointGroup;
import de.eshg.statistics.persistence.entity.diagramdata.LineOrScatterChartData;
import de.eshg.statistics.persistence.entity.diagramdata.TrendLine;
import de.eshg.statistics.persistence.repository.AnalysisRepository;
import de.eshg.statistics.persistence.repository.TableRowRepository;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.function.Function;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PointBasedChartDiagramCreationService
    extends AbstractChartDiagramCreationService<
        Map<Object, List<DataPointHolder>>, PointBasedChartConfigurationDto> {

  private static final String EMPTY_KEY = "";

  public PointBasedChartDiagramCreationService(
      AnalysisService analysisService,
      AnalysisRepository analysisRepository,
      TableRowRepository tableRowRepository,
      StatisticsConfig statisticsConfig) {
    super(analysisService, analysisRepository, tableRowRepository, statisticsConfig);
  }

  @Override
  @Transactional(readOnly = true)
  public Map<Object, List<DataPointHolder>> initializeChartDataHolder(
      UUID analysisId,
      PointBasedChartConfigurationDto pointBasedChartConfiguration,
      List<TableColumnFilterParameter> filters) {
    Analysis analysis = analysisService.getAnalysisInternal(analysisId);
    AbstractAggregationResult aggregationResult = analysis.getAggregationResult();

    AggregationResultUtil.validateColumnFilters(filters, aggregationResult);

    TableColumn secondaryTableColumn =
        AggregationResultUtil.getTableColumn(
            pointBasedChartConfiguration.secondaryAttribute(), aggregationResult);

    Map<Object, List<DataPointHolder>> chartDataHolder =
        createChartDataHolderMap(secondaryTableColumn);
    getKeysForSecondaryTableColumn(secondaryTableColumn)
        .forEach(key -> chartDataHolder.put(key, new ArrayList<>()));

    return chartDataHolder;
  }

  private static Map<Object, List<DataPointHolder>> createChartDataHolderMap(
      TableColumn secondaryTableColumn) {
    if (secondaryTableColumn == null) {
      return new LinkedHashMap<>();
    } else {
      return switch (secondaryTableColumn.getValueType()) {
        case BOOLEAN, VALUE_WITH_OPTIONS -> new LinkedHashMap<>();
        default -> new TreeMap<>();
      };
    }
  }

  private static List<String> getKeysForSecondaryTableColumn(TableColumn secondaryTableColumn) {
    if (secondaryTableColumn == null) {
      return List.of(EMPTY_KEY);
    } else {
      return getKeysForBooleanOrValueOptionsList(secondaryTableColumn);
    }
  }

  @Override
  @Transactional(readOnly = true)
  public int collectChartData(
      UUID analysisId,
      PointBasedChartConfigurationDto pointBasedChartConfiguration,
      List<TableColumnFilterParameter> filters,
      int page,
      Map<Object, List<DataPointHolder>> chartDataHolder) {
    Analysis analysis = analysisService.getAnalysisInternal(analysisId);
    AbstractAggregationResult aggregationResult = analysis.getAggregationResult();

    TableColumn secondaryTableColumn =
        AggregationResultUtil.getTableColumn(
            pointBasedChartConfiguration.secondaryAttribute(), aggregationResult);

    TableColumn xTableColumn =
        AggregationResultUtil.getTableColumn(
            pointBasedChartConfiguration.xAttribute(), aggregationResult);
    TableColumn yTableColumn =
        AggregationResultUtil.getTableColumn(
            pointBasedChartConfiguration.yAttribute(), aggregationResult);

    List<Specification<TableRow>> notNullSpecifications =
        getNotNullSpecificationsForDataPointCharts(
            xTableColumn, yTableColumn, secondaryTableColumn);

    return collectDataForTablePageAndReturnMaxPage(
        page,
        notNullSpecifications.stream(),
        filters,
        aggregationResult,
        tableRow ->
            addTableRowToCollectedPointBasedChartData(
                tableRow, chartDataHolder, xTableColumn, yTableColumn, secondaryTableColumn));
  }

  private static List<Specification<TableRow>> getNotNullSpecificationsForDataPointCharts(
      TableColumn xTableColumn, TableColumn yTableColumn, TableColumn secondaryTableColumn) {
    List<Specification<TableRow>> notNullSpecifications = new ArrayList<>();
    notNullSpecifications.add(
        TableRowSpecifications.getNotNullAndNotUnknownSpecificationDecimalAndInteger(xTableColumn));
    notNullSpecifications.add(
        TableRowSpecifications.getNotNullAndNotUnknownSpecificationDecimalAndInteger(yTableColumn));

    if (secondaryTableColumn != null) {
      notNullSpecifications.add(
          TableRowSpecifications.getNotNullSpecification(secondaryTableColumn));
    }

    return notNullSpecifications;
  }

  private static void addTableRowToCollectedPointBasedChartData(
      TableRow tableRow,
      Map<Object, List<DataPointHolder>> chartDataHolder,
      TableColumn xTableColumn,
      TableColumn yTableColumn,
      TableColumn secondaryTableColumn) {

    BigDecimal xValue =
        getValueAsBigDecimal(xTableColumn.getValueType(), getCellEntry(tableRow, xTableColumn));
    BigDecimal yValue =
        getValueAsBigDecimal(yTableColumn.getValueType(), getCellEntry(tableRow, yTableColumn));

    if (secondaryTableColumn == null) {
      chartDataHolder.get(EMPTY_KEY).add(new DataPointHolder(tableRow.getId(), xValue, yValue));
    } else {
      CellEntry secondaryCellEntry = getCellEntry(tableRow, secondaryTableColumn);
      Object secondaryKey = getKeyForCellEntryBooleanIntegerTextOrValueOption(secondaryCellEntry);
      if (secondaryKey != null) {
        chartDataHolder
            .computeIfAbsent(secondaryKey, key -> new ArrayList<>())
            .add(new DataPointHolder(tableRow.getId(), xValue, yValue));
      }
    }
  }

  @Override
  @Transactional
  public UUID addDiagram(
      UUID analysisId,
      PointBasedChartConfigurationDto pointBasedChartConfiguration,
      AddDiagramRequest addDiagramRequest,
      Map<Object, List<DataPointHolder>> chartDataHolder) {
    Analysis analysis = analysisService.getAnalysisInternal(analysisId);

    Comparator<DataPointHolder> comparator =
        Comparator.comparing(DataPointHolder::xCoordinate)
            .thenComparing(DataPointHolder::yCoordinate)
            .thenComparing(DataPointHolder::rowId);
    Function<DataPointHolder, DataPoint> mapFunction =
        dataPointHolder ->
            getDataPoint(dataPointHolder.xCoordinate(), dataPointHolder.yCoordinate());

    AtomicInteger evaluatedDataAmount = new AtomicInteger(0);
    List<DataPointGroup> dataPointGroups = new ArrayList<>();
    if (pointBasedChartConfiguration.secondaryAttribute() == null) {
      List<DataPoint> dataPoints =
          chartDataHolder.get(EMPTY_KEY).stream().sorted(comparator).map(mapFunction).toList();
      DataPointGroup dataPointGroup = new DataPointGroup();
      dataPointGroup.addDataPoints(dataPoints);
      dataPointGroups.add(dataPointGroup);
      evaluatedDataAmount.addAndGet(dataPoints.size());
    } else {
      chartDataHolder
          .keySet()
          .forEach(
              key -> {
                List<DataPoint> dataPoints =
                    chartDataHolder.get(key).stream().sorted(comparator).map(mapFunction).toList();
                DataPointGroup dataPointGroup = new DataPointGroup();
                dataPointGroup.setKey(String.valueOf(key));
                dataPointGroup.addDataPoints(dataPoints);
                dataPointGroups.add(dataPointGroup);
                evaluatedDataAmount.addAndGet(dataPoints.size());
              });
    }

    if (pointBasedChartConfiguration instanceof ScatterChartConfigurationDto) {
      dataPointGroups.forEach(
          dataPointGroup -> dataPointGroup.setTrendLine(determineTrendLine(dataPointGroup)));
    }

    LineOrScatterChartData lineOrScatterChartData = new LineOrScatterChartData();
    lineOrScatterChartData.addDataPointGroups(dataPointGroups);
    lineOrScatterChartData.setEvaluatedDataAmount(evaluatedDataAmount.get());

    Diagram diagram =
        AnalysisMapper.mapToPersistence(addDiagramRequest, lineOrScatterChartData, analysis);

    analysisRepository.flush();
    return diagram.getExternalId();
  }

  private static DataPoint getDataPoint(BigDecimal xCoordinate, BigDecimal yCoordinate) {
    DataPoint dataPoint = new DataPoint();
    dataPoint.setXCoordinate(xCoordinate);
    dataPoint.setYCoordinate(yCoordinate);
    return dataPoint;
  }

  private static TrendLine determineTrendLine(DataPointGroup dataPointGroup) {
    if (dataPointGroup.getDataPoints().size() < 2) {
      return null;
    }

    BigDecimal averageX =
        calculateAverageOfDataPointCoordinate(dataPointGroup, DataPoint::getXCoordinate);
    BigDecimal averageY =
        calculateAverageOfDataPointCoordinate(dataPointGroup, DataPoint::getYCoordinate);

    BigDecimal numerator =
        dataPointGroup.getDataPoints().stream()
            .map(
                dataPoint ->
                    dataPoint
                        .getXCoordinate()
                        .subtract(averageX)
                        .multiply(dataPoint.getYCoordinate().subtract(averageY)))
            .reduce(BigDecimal::add)
            .orElseThrow();
    BigDecimal denominator =
        dataPointGroup.getDataPoints().stream()
            .map(dataPoint -> dataPoint.getXCoordinate().subtract(averageX).pow(2))
            .reduce(BigDecimal::add)
            .orElseThrow();

    if (denominator.setScale(4, RoundingMode.HALF_UP).compareTo(BigDecimal.ZERO) == 0) {
      return null;
    }

    BigDecimal lineSlope = numerator.divide(denominator, RoundingMode.HALF_UP);
    BigDecimal lineOffset = averageY.subtract(lineSlope.multiply(averageX));

    TrendLine trendLine = new TrendLine();
    trendLine.setLineSlope(lineSlope.setScale(4, RoundingMode.HALF_UP));
    trendLine.setLineOffset(lineOffset.setScale(4, RoundingMode.HALF_UP));
    return trendLine;
  }

  private static BigDecimal calculateAverageOfDataPointCoordinate(
      DataPointGroup dataPointGroup, Function<DataPoint, BigDecimal> coordinateFunction) {
    return dataPointGroup.getDataPoints().stream()
        .map(coordinateFunction)
        .reduce(BigDecimal::add)
        .orElseThrow()
        .setScale(8, RoundingMode.HALF_UP)
        .divide(BigDecimal.valueOf(dataPointGroup.getDataPoints().size()), RoundingMode.HALF_UP);
  }
}
