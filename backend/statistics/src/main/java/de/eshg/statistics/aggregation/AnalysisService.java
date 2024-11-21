/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.aggregation;

import de.eshg.domain.model.BaseEntity;
import de.eshg.lib.statistics.api.ValueType;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.error.NotFoundException;
import de.eshg.statistics.GeoJsonHandler;
import de.eshg.statistics.GeoShapeService;
import de.eshg.statistics.api.AddAnalysisRequest;
import de.eshg.statistics.api.AddDiagramRequest;
import de.eshg.statistics.api.AnalysisDto;
import de.eshg.statistics.api.AnalysisWithDiagrams;
import de.eshg.statistics.api.UpdateAnalysisRequest;
import de.eshg.statistics.api.chart.AddChoroplethMapConfigurationDto;
import de.eshg.statistics.api.chart.BarChartConfigurationDto;
import de.eshg.statistics.api.chart.BinningModeDto;
import de.eshg.statistics.api.chart.CalculationDto;
import de.eshg.statistics.api.chart.ChartConfigurationDto;
import de.eshg.statistics.api.chart.ChoroplethMapConfigurationDto;
import de.eshg.statistics.api.chart.HistogramChartConfigurationDto;
import de.eshg.statistics.api.chart.LineChartConfigurationDto;
import de.eshg.statistics.api.chart.PieChartConfigurationDto;
import de.eshg.statistics.api.chart.PointBasedChartConfiguration;
import de.eshg.statistics.api.chart.ScatterChartConfigurationDto;
import de.eshg.statistics.api.diagram.DiagramDto;
import de.eshg.statistics.api.diagram.UpdateDiagramRequest;
import de.eshg.statistics.api.filter.TableColumnFilterParameter;
import de.eshg.statistics.mapper.AnalysisMapper;
import de.eshg.statistics.mapper.FilterParameterMapper;
import de.eshg.statistics.persistence.entity.AbstractAggregationResult;
import de.eshg.statistics.persistence.entity.AggregationResultPendingState;
import de.eshg.statistics.persistence.entity.AggregationResultState;
import de.eshg.statistics.persistence.entity.Analysis;
import de.eshg.statistics.persistence.entity.CellEntry;
import de.eshg.statistics.persistence.entity.ChartConfiguration;
import de.eshg.statistics.persistence.entity.Diagram;
import de.eshg.statistics.persistence.entity.Evaluation;
import de.eshg.statistics.persistence.entity.TableColumn;
import de.eshg.statistics.persistence.entity.TableRow;
import de.eshg.statistics.persistence.entity.ValueToMeaning;
import de.eshg.statistics.persistence.entity.chart.ChoroplethMapConfiguration;
import de.eshg.statistics.persistence.entity.chart.HistogramBin;
import de.eshg.statistics.persistence.entity.chart.HistogramChartConfiguration;
import de.eshg.statistics.persistence.entity.chart.LineChartConfiguration;
import de.eshg.statistics.persistence.entity.chart.PieChartConfiguration;
import de.eshg.statistics.persistence.entity.chart.ScatterChartConfiguration;
import de.eshg.statistics.persistence.entity.diagramdata.BarChartData;
import de.eshg.statistics.persistence.entity.diagramdata.BarGroupData;
import de.eshg.statistics.persistence.entity.diagramdata.ChoroplethMapData;
import de.eshg.statistics.persistence.entity.diagramdata.DataPoint;
import de.eshg.statistics.persistence.entity.diagramdata.DataPointGroup;
import de.eshg.statistics.persistence.entity.diagramdata.DiagramData;
import de.eshg.statistics.persistence.entity.diagramdata.HistogramChartData;
import de.eshg.statistics.persistence.entity.diagramdata.HistogramGroupData;
import de.eshg.statistics.persistence.entity.diagramdata.KeyToCount;
import de.eshg.statistics.persistence.entity.diagramdata.KeyToValue;
import de.eshg.statistics.persistence.entity.diagramdata.LineOrScatterChartData;
import de.eshg.statistics.persistence.entity.diagramdata.PieChartData;
import de.eshg.statistics.persistence.entity.diagramdata.TrendLine;
import de.eshg.statistics.persistence.entity.entry.BooleanEntry;
import de.eshg.statistics.persistence.entity.entry.DecimalEntry;
import de.eshg.statistics.persistence.entity.entry.IntegerEntry;
import de.eshg.statistics.persistence.entity.evaluationtemplate.AnalysisTemplate;
import de.eshg.statistics.persistence.entity.evaluationtemplate.DiagramTemplate;
import de.eshg.statistics.persistence.entity.report.Report;
import de.eshg.statistics.persistence.repository.AnalysisRepository;
import de.eshg.statistics.persistence.repository.DiagramRepository;
import de.eshg.statistics.persistence.repository.TableRowRepository;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.function.Consumer;
import java.util.function.Function;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import org.apache.commons.lang3.StringUtils;
import org.hibernate.Hibernate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;

@Service
public class AnalysisService {
  private static final String ANALYSIS_WITH_ID_NOT_FOUND = "Analysis with id '%s' not found";
  private static final String DIAGRAM_WITH_ID_NOT_FOUND = "Diagram with id '%s' not found";
  private static final String PRIMARY_ATTRIBUTE = "primaryAttribute";
  private static final String SECONDARY_ATTRIBUTE = "secondaryAttribute";

  private final EvaluationService evaluationService;
  private final GeoShapeService geoShapeService;
  private final AnalysisRepository analysisRepository;
  private final TableRowRepository tableRowRepository;
  private final DiagramRepository diagramRepository;

  private final int pageSizeForCollectionDiagramData;

  public AnalysisService(
      EvaluationService evaluationService,
      GeoShapeService geoShapeService,
      AnalysisRepository analysisRepository,
      TableRowRepository tableRowRepository,
      DiagramRepository diagramRepository,
      @Value("${eshg.statistics.diagramdata.pagesize:500}") int pageSizeForCollectionDiagramData) {
    this.evaluationService = evaluationService;
    this.geoShapeService = geoShapeService;
    this.analysisRepository = analysisRepository;
    this.tableRowRepository = tableRowRepository;
    this.diagramRepository = diagramRepository;
    this.pageSizeForCollectionDiagramData = pageSizeForCollectionDiagramData;
    if (this.pageSizeForCollectionDiagramData <= 0) {
      throw new IllegalArgumentException(
          "'eshg.statistics.diagramdata.pagesize' must be greater than 0");
    }
  }

  @Transactional(readOnly = true)
  public void checkPermissionForAnalysis(UUID analysisId) {
    AbstractAggregationResult aggregationResult =
        getAnalysisInternal(analysisId).getAggregationResult();
    if (evaluationService.accessNotAllowed(aggregationResult)) {
      throw new NotFoundException(ANALYSIS_WITH_ID_NOT_FOUND.formatted(analysisId));
    }
  }

  @Transactional(readOnly = true)
  public void checkPermissionForDiagram(UUID diagramId) {
    AbstractAggregationResult aggregationResult =
        getDiagramInternal(diagramId).getAnalysis().getAggregationResult();
    if (evaluationService.accessNotAllowed(aggregationResult)) {
      throw new NotFoundException(DIAGRAM_WITH_ID_NOT_FOUND.formatted(diagramId));
    }
  }

  public static void addAnalysisAndDiagramsWithoutData(
      Evaluation evaluation, AnalysisTemplate analysisTemplate) {
    String analysisName = analysisTemplate.getName();
    ChartConfigurationDto chartConfigurationDto =
        AnalysisMapper.mapToChartConfigurationDto(
            Hibernate.unproxy(analysisTemplate.getChartConfiguration(), ChartConfiguration.class),
            true);
    switch (chartConfigurationDto) {
      case BarChartConfigurationDto barChartConfigurationDto ->
          validateBarChartConfiguration(barChartConfigurationDto, evaluation, analysisName);
      case ChoroplethMapConfigurationDto choroplethMapConfigurationDto ->
          validateChoroplethMapConfiguration(
              AnalysisMapper.mapToAddChoroplethMapConfigurationDto(choroplethMapConfigurationDto),
              evaluation,
              analysisName);
      case HistogramChartConfigurationDto histogramChartConfigurationDto ->
          validateHistogramChartConfiguration(
              histogramChartConfigurationDto, evaluation, analysisName);
      case LineChartConfigurationDto lineChartConfigurationDto ->
          validatePointBasedChartConfiguration(
              lineChartConfigurationDto, evaluation, analysisName, "LineChartConfiguration");
      case PieChartConfigurationDto pieChartConfigurationDto ->
          validatePieChartConfiguration(pieChartConfigurationDto, evaluation, analysisName);
      case ScatterChartConfigurationDto scatterChartConfigurationDto ->
          validatePointBasedChartConfiguration(
              scatterChartConfigurationDto, evaluation, analysisName, "ScatterChartConfiguration");
    }

    ChartConfiguration chartConfiguration = AnalysisMapper.mapToPersistence(chartConfigurationDto);
    Analysis analysis = new Analysis();
    evaluation.addAnalysis(analysis);
    analysis.setName(analysisName);
    analysis.setChartConfiguration(chartConfiguration);

    analysisTemplate
        .getDiagramTemplates()
        .forEach(diagramTemplate -> addEmptyDiagram(diagramTemplate, analysis));
  }

  private static void addEmptyDiagram(DiagramTemplate diagramTemplate, Analysis analysis) {
    List<TableColumnFilterParameter> filters =
        FilterParameterMapper.mapToApi(diagramTemplate.getFilters());
    try {
      AggregationResultUtil.validateColumnFilters(filters, analysis.getAggregationResult());
    } catch (BadRequestException badRequestException) {
      throw new BadRequestException(
          "'%s' - '%s': %s"
              .formatted(
                  analysis.getName(),
                  diagramTemplate.getTitle(),
                  badRequestException.getMessage()));
    }

    DiagramData diagramData = getEmptyDiagramData(analysis);

    AnalysisMapper.mapToPersistence(
        diagramTemplate.getTitle(),
        diagramTemplate.getDescription(),
        filters,
        diagramData,
        analysis);
  }

  private static DiagramData getEmptyDiagramData(Analysis analysis) {
    DiagramData diagramData =
        switch (analysis.getChartConfiguration()) {
          case ChoroplethMapConfiguration ignored -> new ChoroplethMapData();
          case HistogramChartConfiguration ignored -> new HistogramChartData();
          case LineChartConfiguration ignored -> new LineOrScatterChartData();
          case PieChartConfiguration ignored -> new PieChartData();
          case ScatterChartConfiguration ignored -> new LineOrScatterChartData();
          default -> new BarChartData();
        };
    diagramData.setEvaluatedDataAmount(0);
    return diagramData;
  }

  @Transactional
  public AnalysisDto addAnalysis(AddAnalysisRequest addAnalysisRequest) {
    Evaluation evaluation =
        evaluationService.getEvaluationInternal(addAnalysisRequest.evaluationId());
    EvaluationService.validateEvaluationCompleted(evaluation);

    String name = addAnalysisRequest.name();
    String geoJson = null;
    List<HistogramBin> histogramBins = null;
    switch (addAnalysisRequest.chartConfiguration()) {
      case BarChartConfigurationDto barChartConfiguration ->
          validateBarChartConfiguration(barChartConfiguration, evaluation, name);
      case AddChoroplethMapConfigurationDto choroplethMapConfiguration -> {
        validateChoroplethMapConfiguration(choroplethMapConfiguration, evaluation, name);
        geoJson = geoShapeService.getGeoShape(choroplethMapConfiguration.geoShapeId()).geoJson();
      }
      case HistogramChartConfigurationDto histogramChartConfiguration -> {
        validateHistogramChartConfiguration(histogramChartConfiguration, evaluation, name);
        histogramBins = calculateHistogramBins(histogramChartConfiguration, evaluation);
      }
      case LineChartConfigurationDto lineChartConfigurationDto ->
          validatePointBasedChartConfiguration(
              lineChartConfigurationDto, evaluation, name, "LineChartConfiguration");
      case PieChartConfigurationDto pieChartConfiguration ->
          validatePieChartConfiguration(pieChartConfiguration, evaluation, name);
      case ScatterChartConfigurationDto scatterChartConfigurationDto ->
          validatePointBasedChartConfiguration(
              scatterChartConfigurationDto, evaluation, name, "ScatterChartConfiguration");
    }

    Analysis analysis =
        AnalysisMapper.mapToPersistence(evaluation, addAnalysisRequest, geoJson, histogramBins);
    analysisRepository.flush();
    return AnalysisMapper.mapToApi(analysis);
  }

  private static void validateBarChartConfiguration(
      BarChartConfigurationDto barChartConfiguration,
      AbstractAggregationResult aggregationResult,
      String name) {
    TableColumn tableColumnPrimary =
        AggregationResultUtil.getTableColumn(
            barChartConfiguration.primaryAttribute(), aggregationResult);

    String errorMessage =
        "'%s': BarChartConfigurations require an attribute of type %s or %s as '%s'";
    validateTableColumValueOptionOrBoolean(
        tableColumnPrimary,
        errorMessage.formatted(
            name, ValueType.BOOLEAN, ValueType.VALUE_WITH_OPTIONS, PRIMARY_ATTRIBUTE));

    if (barChartConfiguration.secondaryAttribute() == null) {
      if (barChartConfiguration.grouping() != null || barChartConfiguration.scaling() != null) {
        throw new BadRequestException(
            "'%s': Grouping and scaling not allowed without secondary attribute given"
                .formatted(name));
      }
    } else {
      TableColumn tableColumnSecondary =
          AggregationResultUtil.getTableColumn(
              barChartConfiguration.secondaryAttribute(), aggregationResult);
      validateTableColumValueOptionOrBoolean(
          tableColumnSecondary,
          errorMessage.formatted(
              name, ValueType.BOOLEAN, ValueType.VALUE_WITH_OPTIONS, SECONDARY_ATTRIBUTE));
      validateThatTableColumnsAreDifferent(tableColumnPrimary, tableColumnSecondary, name);

      if (barChartConfiguration.grouping() == null || barChartConfiguration.scaling() == null) {
        throw new BadRequestException(
            "'%s': Grouping and scaling are required for a secondary attribute".formatted(name));
      }
    }
  }

  private static void validateChoroplethMapConfiguration(
      AddChoroplethMapConfigurationDto choroplethMapConfiguration,
      AbstractAggregationResult aggregationResult,
      String name) {
    TableColumn tableColumnPrimary =
        AggregationResultUtil.getTableColumn(
            choroplethMapConfiguration.primaryAttribute(), aggregationResult);

    validateChoroplethPrimaryAttribute(tableColumnPrimary);

    if (choroplethMapConfiguration.secondaryAttribute() == null) {
      if (choroplethMapConfiguration.calculation() != null) {
        throw new BadRequestException(
            "'%s': Calculation mode not allowed without secondary attribute given".formatted(name));
      }
    } else {
      TableColumn tableColumnSecondary =
          AggregationResultUtil.getTableColumn(
              choroplethMapConfiguration.secondaryAttribute(), aggregationResult);
      validateChoroplethSecondaryAttribute(tableColumnSecondary);

      if (choroplethMapConfiguration.calculation() == null) {
        throw new BadRequestException(
            "'%s': Calculation mode required for a secondary attribute".formatted(name));
      }
    }
  }

  private static void validateHistogramChartConfiguration(
      HistogramChartConfigurationDto histogramChartConfiguration,
      AbstractAggregationResult aggregationResult,
      String name) {
    TableColumn tableColumnPrimary =
        AggregationResultUtil.getTableColumn(
            histogramChartConfiguration.primaryAttribute(), aggregationResult);

    String errorMessage =
        "'%s': HistogramChartConfigurations require an attribute of type %s or %s as '%s'";
    validateTableColumnDecimalOrInteger(
        tableColumnPrimary,
        errorMessage.formatted(name, ValueType.DECIMAL, ValueType.INTEGER, PRIMARY_ATTRIBUTE));

    if (histogramChartConfiguration.secondaryAttribute() == null) {
      if (histogramChartConfiguration.grouping() != null
          || histogramChartConfiguration.scaling() != null) {
        throw new BadRequestException(
            "'%s': Grouping and scaling not allowed without secondary attribute given"
                .formatted(name));
      }
    } else {
      TableColumn tableColumnSecondary =
          AggregationResultUtil.getTableColumn(
              histogramChartConfiguration.secondaryAttribute(), aggregationResult);
      validateTableColumValueOptionOrBoolean(
          tableColumnSecondary,
          errorMessage.formatted(
              name, ValueType.BOOLEAN, ValueType.VALUE_WITH_OPTIONS, SECONDARY_ATTRIBUTE));

      if (histogramChartConfiguration.grouping() == null
          || histogramChartConfiguration.scaling() == null) {
        throw new BadRequestException(
            "'%s': Grouping and scaling are required for a secondary attribute".formatted(name));
      }
    }

    if (histogramChartConfiguration.binningMode().equals(BinningModeDto.MANUAL)
        && histogramChartConfiguration.numberOfBins() == null) {
      throw new BadRequestException(
          "'%s': numberOfBins is required for binning mode '%s'"
              .formatted(name, BinningModeDto.MANUAL.name()));
    }

    if (histogramChartConfiguration.binningMode().equals(BinningModeDto.AUTO)
        && histogramChartConfiguration.numberOfBins() != null) {
      throw new BadRequestException(
          "'%s': numberOfBins must not be set for binning mode '%s'"
              .formatted(name, BinningModeDto.AUTO.name()));
    }
  }

  public List<HistogramBin> calculateHistogramBins(
      HistogramChartConfigurationDto histogramChartConfiguration,
      AbstractAggregationResult aggregationResult) {
    TableColumn tableColumnPrimary =
        AggregationResultUtil.getTableColumn(
            histogramChartConfiguration.primaryAttribute(), aggregationResult);

    long numberOfDataPoints =
        getNumberOfHistogramDataPoints(
            aggregationResult,
            tableColumnPrimary,
            AggregationResultUtil.getTableColumn(
                histogramChartConfiguration.secondaryAttribute(), aggregationResult));
    if (numberOfDataPoints == 0) {
      return Collections.emptyList();
    }

    int numberOfBins;
    if (histogramChartConfiguration.binningMode().equals(BinningModeDto.MANUAL)) {
      numberOfBins = histogramChartConfiguration.numberOfBins();
    } else {
      numberOfBins = Math.clamp((int) Math.ceil(Math.sqrt(numberOfDataPoints)), 2, 50);
    }

    BigDecimal minimum;
    BigDecimal maximum;
    if (tableColumnPrimary.getValueType().equals(ValueType.DECIMAL)) {
      minimum = tableColumnPrimary.getMinMaxNullUnknownValues().getMinDecimal();
      maximum = tableColumnPrimary.getMinMaxNullUnknownValues().getMaxDecimal();
    } else {
      minimum = new BigDecimal(tableColumnPrimary.getMinMaxNullUnknownValues().getMinInteger());
      maximum = new BigDecimal(tableColumnPrimary.getMinMaxNullUnknownValues().getMaxInteger());
    }

    BigDecimal binWidth = calculateBinWidth(maximum, minimum, numberOfBins);
    if (binWidth == null) {
      return Collections.emptyList();
    }

    List<HistogramBin> histogramBins = new ArrayList<>();
    for (int i = 0; i < numberOfBins; i++) {
      HistogramBin histogramBin = new HistogramBin();
      histogramBin.setLowerBound(
          BigDecimal.valueOf(i - 0.5)
              .multiply(binWidth)
              .add(minimum)
              .setScale(4, RoundingMode.HALF_UP));
      histogramBin.setUpperBound(
          BigDecimal.valueOf(i + 0.5)
              .multiply(binWidth)
              .add(minimum)
              .subtract(BigDecimal.valueOf(0.0001))
              .setScale(4, RoundingMode.HALF_UP));
      histogramBins.add(histogramBin);
    }

    return histogramBins;
  }

  private long getNumberOfHistogramDataPoints(
      AbstractAggregationResult aggregationResult,
      TableColumn tableColumnPrimary,
      TableColumn tableColumnSecondary) {
    List<Specification<TableRow>> specifications = new ArrayList<>();
    specifications.add(
        AggregationResultSpecifications.tableRowOfAggregationOrderByTableRowId(aggregationResult));
    specifications.add(
        AggregationResultSpecifications.getNotNullAndNotUnknownSpecificationDecimalAndInteger(
            tableColumnPrimary));
    if (tableColumnSecondary != null) {
      specifications.add(
          AggregationResultSpecifications.getNotNullSpecification(tableColumnSecondary));
    }
    return tableRowRepository.count(Specification.allOf(specifications));
  }

  private static BigDecimal calculateBinWidth(
      BigDecimal maximum, BigDecimal minimum, int numberOfBins) {
    BigDecimal minMaxDifference = maximum.subtract(minimum).setScale(4, RoundingMode.HALF_UP);
    BigDecimal minimalDifferenceNeeded =
        BigDecimal.valueOf(0.0001).multiply(BigDecimal.valueOf(numberOfBins));
    if (minMaxDifference.compareTo(BigDecimal.ZERO) == 0
        || minMaxDifference.compareTo(minimalDifferenceNeeded) < 0) {
      return null;
    }

    return minMaxDifference
        .setScale(8, RoundingMode.HALF_UP)
        .divide(new BigDecimal(numberOfBins - 1), RoundingMode.HALF_UP);
  }

  private static void validatePieChartConfiguration(
      PieChartConfigurationDto pieChartConfigurationDto,
      AbstractAggregationResult aggregationResult,
      String name) {
    TableColumn tableColumnPrimary =
        AggregationResultUtil.getTableColumn(
            pieChartConfigurationDto.attribute(), aggregationResult);

    String errorMessage = "'%s': PieChartConfigurations require an attribute of type %s or %s";
    validateTableColumValueOptionOrBoolean(
        tableColumnPrimary,
        errorMessage.formatted(name, ValueType.BOOLEAN, ValueType.VALUE_WITH_OPTIONS));
  }

  private static void validatePointBasedChartConfiguration(
      PointBasedChartConfiguration chartConfiguration,
      AbstractAggregationResult aggregationResult,
      String name,
      String configName) {

    String errorMessage = "'%s': %ss require an attribute of type %s or %s as '%s'";

    TableColumn tableColumnX =
        AggregationResultUtil.getTableColumn(chartConfiguration.xAttribute(), aggregationResult);
    validateTableColumnDecimalOrInteger(
        tableColumnX,
        errorMessage.formatted(
            name, configName, ValueType.DECIMAL, ValueType.INTEGER, "xAttribute"));

    TableColumn tableColumnY =
        AggregationResultUtil.getTableColumn(chartConfiguration.yAttribute(), aggregationResult);
    validateTableColumnDecimalOrInteger(
        tableColumnY,
        errorMessage.formatted(
            name, configName, ValueType.DECIMAL, ValueType.INTEGER, "yAttribute"));

    if (chartConfiguration.secondaryAttribute() != null) {
      TableColumn tableColumnSecondary =
          AggregationResultUtil.getTableColumn(
              chartConfiguration.secondaryAttribute(), aggregationResult);

      validateTableColumValueOptionOrBoolean(
          tableColumnSecondary,
          errorMessage.formatted(
              name,
              configName,
              ValueType.BOOLEAN,
              ValueType.VALUE_WITH_OPTIONS,
              SECONDARY_ATTRIBUTE));
    }
  }

  private static void validateThatTableColumnsAreDifferent(
      TableColumn tableColumnPrimary, TableColumn tableColumnSecondary, String name) {
    if (tableColumnPrimary.equals(tableColumnSecondary)) {
      throw new BadRequestException(
          "'%s': Primary and secondary attribute must be different".formatted(name));
    }
  }

  private static void validateTableColumValueOptionOrBoolean(
      TableColumn tableColumn, String errorMessage) {
    if (!tableColumn.getValueType().equals(ValueType.VALUE_WITH_OPTIONS)
        && !tableColumn.getValueType().equals(ValueType.BOOLEAN)) {
      throw new BadRequestException(errorMessage);
    }
  }

  private static void validateTableColumnDecimalOrInteger(
      TableColumn tableColumn, String errorMessage) {
    if (!tableColumn.getValueType().equals(ValueType.DECIMAL)
        && !tableColumn.getValueType().equals(ValueType.INTEGER)) {
      throw new BadRequestException(errorMessage);
    }
  }

  private static void validateChoroplethPrimaryAttribute(TableColumn tableColumn) {
    if (!tableColumn.getValueType().equals(ValueType.VALUE_WITH_OPTIONS)
        && !tableColumn.getValueType().equals(ValueType.TEXT)) {
      throw new BadRequestException(
          "ChoroplethMapConfigurations require an attribute of type %s or %s as 'primaryAttribute'"
              .formatted(ValueType.VALUE_WITH_OPTIONS, ValueType.TEXT));
    }
  }

  private static void validateChoroplethSecondaryAttribute(TableColumn tableColumn) {
    if (!tableColumn.getValueType().equals(ValueType.BOOLEAN)
        && !tableColumn.getValueType().equals(ValueType.INTEGER)
        && !tableColumn.getValueType().equals(ValueType.DECIMAL)) {
      throw new BadRequestException(
          "ChoroplethMapConfigurations require an attribute of type %s or %s or %s as 'secondaryAttribute'"
              .formatted(ValueType.BOOLEAN, ValueType.INTEGER, ValueType.DECIMAL));
    }
  }

  @Transactional(readOnly = true)
  public AnalysisWithDiagrams getAnalysis(UUID analysisId) {
    return AnalysisMapper.mapToAnalysisWithDiagrams(getAnalysisInternal(analysisId));
  }

  public Analysis getAnalysisInternal(UUID analysisId) {
    return analysisRepository
        .findByExternalId(analysisId)
        .orElseThrow(() -> new NotFoundException(ANALYSIS_WITH_ID_NOT_FOUND.formatted(analysisId)));
  }

  @Transactional
  public AnalysisDto updateAnalysis(UUID analysisId, UpdateAnalysisRequest updateAnalysisRequest) {
    Analysis analysis = getAnalysisInternal(analysisId);
    validateAnalysisNotInReport(analysis);
    analysis.setName(updateAnalysisRequest.name());

    return AnalysisMapper.mapToApi(analysis);
  }

  private void validateAnalysisNotInReport(Analysis analysis) {
    if (Hibernate.unproxy(analysis.getAggregationResult(), AbstractAggregationResult.class)
        instanceof Report) {
      throw new BadRequestException("Analyses of reports can not be changed");
    }
  }

  @Transactional
  public void deleteAnalysis(UUID analysisId) {
    Analysis analysis = getAnalysisInternal(analysisId);
    validateAnalysisNotInReport(analysis);
    analysisRepository.delete(analysis);
  }

  @Transactional(readOnly = true)
  public AnalysisDto getAnalysisDto(UUID analysisId) {
    Analysis analysis = getAnalysisInternal(analysisId);
    validateAnalysisNotInReport(analysis);
    return AnalysisMapper.mapToApi(analysis, true);
  }

  @Transactional(readOnly = true)
  public int collectBarChartData(
      Map<String, Map<String, Integer>> collectedChartData,
      int page,
      UUID analysisId,
      List<TableColumnFilterParameter> filters,
      BarChartConfigurationDto barChartConfigurationDto) {
    Analysis analysis = getAnalysisInternal(analysisId);
    AbstractAggregationResult aggregationResult = analysis.getAggregationResult();

    TableColumn primaryTableColumn =
        AggregationResultUtil.getTableColumn(
            barChartConfigurationDto.primaryAttribute(), aggregationResult);
    TableColumn secondaryTableColumn =
        AggregationResultUtil.getTableColumn(
            barChartConfigurationDto.secondaryAttribute(), aggregationResult);
    if (page == 0) {
      AggregationResultUtil.validateColumnFilters(filters, aggregationResult);
      initiallyFillBarChartMap(collectedChartData, primaryTableColumn, secondaryTableColumn);
    }

    Stream<Specification<TableRow>> notNullSpecifications;
    if (secondaryTableColumn == null) {
      notNullSpecifications =
          Stream.of(AggregationResultSpecifications.getNotNullSpecification(primaryTableColumn));
    } else {
      notNullSpecifications =
          Stream.of(
              AggregationResultSpecifications.getNotNullSpecification(primaryTableColumn),
              AggregationResultSpecifications.getNotNullSpecification(secondaryTableColumn));
    }

    return collectDataForTablePageAndReturnMaxPage(
        page,
        notNullSpecifications,
        filters,
        aggregationResult,
        tableRow ->
            addTableRowToCollectedBarChartData(
                tableRow, collectedChartData, primaryTableColumn, secondaryTableColumn));
  }

  private static void initiallyFillBarChartMap(
      Map<String, Map<String, Integer>> collectedChartData,
      TableColumn primaryTableColumn,
      TableColumn secondaryTableColumn) {
    List<String> primaryKeys =
        Objects.requireNonNull(getKeysForValueOptionOrBooleanColumn(primaryTableColumn));
    List<String> secondaryKeys = getKeysForValueOptionOrBooleanColumn(secondaryTableColumn);

    if (secondaryKeys == null) {
      primaryKeys.forEach(
          primaryKey -> {
            Map<String, Integer> secondaryMap = new HashMap<>();
            secondaryMap.put(primaryKey, 0);
            collectedChartData.put(primaryKey, secondaryMap);
          });
    } else {
      primaryKeys.forEach(
          primaryKey -> {
            Map<String, Integer> secondaryMap =
                secondaryKeys.stream().collect(Collectors.toMap(Function.identity(), key -> 0));
            collectedChartData.put(primaryKey, secondaryMap);
          });
    }
  }

  @SuppressWarnings("java:S1168")
  private static List<String> getKeysForValueOptionOrBooleanColumn(TableColumn tableColumn) {
    if (tableColumn == null) {
      return null;
    }
    List<String> keys;
    if (tableColumn.getValueType().equals(ValueType.BOOLEAN)) {
      keys = List.of("Ja", "Nein");
    } else {
      keys = getValueToMeaningKeys(tableColumn);
    }
    return keys;
  }

  private static List<String> getValueToMeaningKeys(TableColumn tableColumn) {
    return tableColumn.getValueToMeanings().stream().map(ValueToMeaning::getValue).toList();
  }

  private int collectDataForTablePageAndReturnMaxPage(
      int page,
      Stream<Specification<TableRow>> attributeSpecificationStream,
      List<TableColumnFilterParameter> filters,
      AbstractAggregationResult aggregationResult,
      Consumer<TableRow> tableRowDataCollector) {

    Stream<Specification<TableRow>> attributePlusFilters =
        Stream.concat(
            attributeSpecificationStream, getFilterSpecificationStream(filters, aggregationResult));

    Specification<TableRow> specification =
        Specification.allOf(
            Stream.concat(
                    Stream.of(
                        AggregationResultSpecifications.tableRowOfAggregationOrderByTableRowId(
                            aggregationResult)),
                    attributePlusFilters)
                .toList());

    Page<TableRow> tableRowPage =
        tableRowRepository.findAll(
            specification, PageRequest.of(page, pageSizeForCollectionDiagramData));

    tableRowPage.get().forEach(tableRowDataCollector);

    long totalElements = tableRowPage.getTotalElements();
    if (totalElements % pageSizeForCollectionDiagramData == 0) {
      return ((int) totalElements / pageSizeForCollectionDiagramData) - 1;
    } else {
      return (int) totalElements / pageSizeForCollectionDiagramData;
    }
  }

  private static Stream<Specification<TableRow>> getFilterSpecificationStream(
      List<TableColumnFilterParameter> filters, AbstractAggregationResult aggregationResult) {
    if (CollectionUtils.isEmpty(filters)) {
      return Stream.empty();
    }
    return filters.stream()
        .map(
            filter ->
                AggregationResultSpecifications.createFilterSpecification(
                    filter, aggregationResult));
  }

  private void addTableRowToCollectedBarChartData(
      TableRow tableRow,
      Map<String, Map<String, Integer>> collectedChartData,
      TableColumn primaryTableColumn,
      TableColumn secondaryTableColumn) {
    String primaryKey =
        getKeyForCellEntryValueOptionOrBoolean(getCellEntry(tableRow, primaryTableColumn));

    String secondaryKey;
    if (secondaryTableColumn == null) {
      secondaryKey = primaryKey;
    } else {
      secondaryKey =
          getKeyForCellEntryValueOptionOrBoolean(getCellEntry(tableRow, secondaryTableColumn));
    }

    if (primaryKey == null || secondaryKey == null) {
      return;
    }

    collectedChartData
        .get(primaryKey)
        .compute(secondaryKey, (k, count) -> Objects.requireNonNull(count) + 1);
  }

  private CellEntry getCellEntry(TableRow tableRow, TableColumn tableColumn) {
    return tableRow.getCellEntries().stream()
        .filter(cellEntry -> cellEntry.getTableColumn().getId().equals(tableColumn.getId()))
        .findFirst()
        .orElseThrow();
  }

  private String getKeyForCellEntryValueOptionOrBoolean(CellEntry cellEntry) {
    if (cellEntry.getValue() == null) {
      return null;
    }
    if (cellEntry.getTableColumn().getValueType().equals(ValueType.BOOLEAN)) {
      return Boolean.TRUE.equals(cellEntry.getValue()) ? "Ja" : "Nein";
    }
    String stringValue = cellEntry.getValue().toString();
    if (getValueToMeaningKeys(cellEntry.getTableColumn()).contains(stringValue)) {
      return stringValue;
    } else {
      return null;
    }
  }

  @Transactional
  public UUID addBarChartDiagram(
      UUID analysisId,
      AddDiagramRequest addDiagramRequest,
      Map<String, Map<String, Integer>> chartDataHolder,
      BarChartConfigurationDto barChartConfigurationDto) {
    Analysis analysis = getAnalysisInternal(analysisId);
    AbstractAggregationResult aggregationResult = analysis.getAggregationResult();

    List<BarGroupData> groupDataList =
        getBarGroupDataList(chartDataHolder, barChartConfigurationDto, aggregationResult);

    int evaluatedEntries =
        groupDataList.stream()
            .map(BarGroupData::getKeyToCounts)
            .flatMap(Collection::stream)
            .mapToInt(KeyToCount::getCount)
            .sum();

    BarChartData barChartData = new BarChartData();
    barChartData.setEvaluatedDataAmount(evaluatedEntries);
    barChartData.addBarGroupDatas(groupDataList);

    Diagram diagram = AnalysisMapper.mapToPersistence(addDiagramRequest, barChartData, analysis);

    analysisRepository.flush();
    return diagram.getExternalId();
  }

  private static List<BarGroupData> getBarGroupDataList(
      Map<String, Map<String, Integer>> chartDataHolder,
      BarChartConfigurationDto barChartConfigurationDto,
      AbstractAggregationResult aggregationResult) {
    TableColumn secondaryTableColumn =
        AggregationResultUtil.getTableColumn(
            barChartConfigurationDto.secondaryAttribute(), aggregationResult);

    Map<String, BarGroupData> groupDataMap =
        chartDataHolder.entrySet().stream()
            .map(entry -> mapToBarGroupData(entry.getKey(), entry.getValue(), secondaryTableColumn))
            .collect(Collectors.toMap(BarGroupData::getKey, Function.identity()));

    List<String> primaryKeys =
        Objects.requireNonNull(
            getKeysForValueOptionOrBooleanColumn(
                AggregationResultUtil.getTableColumn(
                    barChartConfigurationDto.primaryAttribute(), aggregationResult)));
    return primaryKeys.stream().map(groupDataMap::get).toList();
  }

  private static BarGroupData mapToBarGroupData(
      String key,
      Map<String, Integer> keyToCountStringIntegerMap,
      TableColumn secondaryTableColumn) {
    Map<String, KeyToCount> keyToCountMap =
        keyToCountStringIntegerMap.entrySet().stream()
            .map(AnalysisService::getKeyToCount)
            .collect(Collectors.toMap(KeyToCount::getKey, Function.identity()));

    List<String> secondaryKeys = getKeysForValueOptionOrBooleanColumn(secondaryTableColumn);
    if (secondaryKeys == null) {
      secondaryKeys = keyToCountMap.keySet().stream().toList();
    }

    List<KeyToCount> keyToCounts = secondaryKeys.stream().map(keyToCountMap::get).toList();

    BarGroupData barGroupData = new BarGroupData();
    barGroupData.setKey(key);
    barGroupData.addKeyToCounts(keyToCounts);
    return barGroupData;
  }

  private static KeyToCount getKeyToCount(Map.Entry<String, Integer> entry) {
    KeyToCount keyToCount = new KeyToCount();
    keyToCount.setKey(entry.getKey());
    keyToCount.setCount(entry.getValue());
    return keyToCount;
  }

  @Transactional(readOnly = true)
  public Integer collectChoroplethMapData(
      Map<String, List<BigDecimal>> collectedChartData,
      Integer page,
      UUID analysisId,
      List<TableColumnFilterParameter> filters,
      ChoroplethMapConfigurationDto choroplethMapConfigurationDto) {
    Analysis analysis = getAnalysisInternal(analysisId);
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
      initializeChoroplethMapData(collectedChartData, geoKeys);
    }

    List<Specification<TableRow>> specifications =
        getNotNullSpecificationsForChoroplethMap(primaryTableColumn, secondaryTableColumn);

    specifications.add(
        AggregationResultSpecifications.getValueOptionFilterSpecification(
            primaryTableColumn, geoKeys, false));

    return collectDataForTablePageAndReturnMaxPage(
        page,
        specifications.stream(),
        filters,
        aggregationResult,
        tableRow ->
            addTableRowToCollectedChoroplethMapData(
                tableRow, collectedChartData, primaryTableColumn, secondaryTableColumn));
  }

  private void initializeChoroplethMapData(
      Map<String, List<BigDecimal>> collectedChartData, List<String> geoKeys) {
    geoKeys.forEach(geoKey -> collectedChartData.computeIfAbsent(geoKey, key -> new ArrayList<>()));
  }

  private List<Specification<TableRow>> getNotNullSpecificationsForChoroplethMap(
      TableColumn primaryTableColumn, TableColumn secondaryTableColumn) {
    List<Specification<TableRow>> notNullSpecifications = new ArrayList<>();
    notNullSpecifications.add(
        AggregationResultSpecifications.getNotNullSpecification(primaryTableColumn));
    if (secondaryTableColumn != null) {
      switch (secondaryTableColumn.getValueType()) {
        case ValueType.BOOLEAN ->
            notNullSpecifications.add(
                AggregationResultSpecifications.getNotNullSpecification(secondaryTableColumn));
        case ValueType.DECIMAL, ValueType.INTEGER ->
            notNullSpecifications.add(
                AggregationResultSpecifications
                    .getNotNullAndNotUnknownSpecificationDecimalAndInteger(secondaryTableColumn));
        default ->
            throw new IllegalStateException(
                "Unexpected value type: " + secondaryTableColumn.getValueType());
      }
    }
    return notNullSpecifications;
  }

  private void addTableRowToCollectedChoroplethMapData(
      TableRow tableRow,
      Map<String, List<BigDecimal>> collectedChartData,
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

    collectedChartData.computeIfAbsent(primaryKey, key -> new ArrayList<>()).add(value);
  }

  private String getKeyForTextOrValueOption(CellEntry cellEntry) {
    if (cellEntry.getValue() == null) {
      return null;
    }

    String stringValue = cellEntry.getValue().toString();
    return switch (cellEntry.getTableColumn().getValueType()) {
      case ValueType.TEXT -> stringValue;
      case ValueType.VALUE_WITH_OPTIONS -> {
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

  @Transactional
  public UUID addChoroplethMapDiagram(
      UUID analysisId,
      AddDiagramRequest addDiagramRequest,
      Map<String, List<BigDecimal>> data,
      ChoroplethMapConfigurationDto choroplethMapConfigurationDto) {
    Analysis analysis = getAnalysisInternal(analysisId);

    List<KeyToValue> keyToValues = new ArrayList<>();
    AtomicInteger evaluatedDataAmount = new AtomicInteger(0);
    data.forEach(
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

  @Transactional(readOnly = true)
  public int collectHistogramChartData(
      Map<Long, Map<String, Integer>> collectedChartData,
      int page,
      UUID analysisId,
      List<TableColumnFilterParameter> filters,
      HistogramChartConfigurationDto histogramChartConfigurationDto) {
    Analysis analysis = getAnalysisInternal(analysisId);
    AbstractAggregationResult aggregationResult = analysis.getAggregationResult();
    HistogramChartConfiguration chartConfiguration =
        (HistogramChartConfiguration)
            Hibernate.unproxy(analysis.getChartConfiguration(), ChartConfiguration.class);

    if (chartConfiguration.getBins().isEmpty()) {
      return 0;
    }

    TableColumn primaryTableColumn =
        AggregationResultUtil.getTableColumn(
            histogramChartConfigurationDto.primaryAttribute(), aggregationResult);
    TableColumn secondaryTableColumn =
        AggregationResultUtil.getTableColumn(
            histogramChartConfigurationDto.secondaryAttribute(), aggregationResult);
    if (page == 0) {
      AggregationResultUtil.validateColumnFilters(filters, aggregationResult);
      initiallyFillHistogramChartMap(
          collectedChartData, chartConfiguration.getBins(), secondaryTableColumn);
    }

    Specification<TableRow> notNullNotUnknownSpecification =
        AggregationResultSpecifications.getNotNullAndNotUnknownSpecificationDecimalAndInteger(
            primaryTableColumn);

    Stream<Specification<TableRow>> specificationStream;
    if (secondaryTableColumn == null) {
      specificationStream = Stream.of(notNullNotUnknownSpecification);
    } else {
      specificationStream =
          Stream.of(
              notNullNotUnknownSpecification,
              AggregationResultSpecifications.getNotNullSpecification(secondaryTableColumn));
    }

    return collectDataForTablePageAndReturnMaxPage(
        page,
        specificationStream,
        filters,
        aggregationResult,
        tableRow ->
            addTableRowToCollectedHistogramChartData(
                tableRow,
                collectedChartData,
                chartConfiguration.getBins(),
                primaryTableColumn,
                secondaryTableColumn));
  }

  private void initiallyFillHistogramChartMap(
      Map<Long, Map<String, Integer>> collectedChartData,
      List<HistogramBin> bins,
      TableColumn secondaryTableColumn) {
    List<String> secondaryKeys = getKeysForValueOptionOrBooleanColumn(secondaryTableColumn);

    if (secondaryKeys == null) {
      bins.forEach(
          bin -> {
            Map<String, Integer> secondaryMap = new HashMap<>();
            secondaryMap.put(String.valueOf(bin.getId()), 0);
            collectedChartData.put(bin.getId(), secondaryMap);
          });
    } else {
      bins.forEach(
          bin -> {
            Map<String, Integer> secondaryMap =
                secondaryKeys.stream().collect(Collectors.toMap(Function.identity(), key -> 0));
            collectedChartData.put(bin.getId(), secondaryMap);
          });
    }
  }

  private void addTableRowToCollectedHistogramChartData(
      TableRow tableRow,
      Map<Long, Map<String, Integer>> collectedChartData,
      List<HistogramBin> bins,
      TableColumn primaryTableColumn,
      TableColumn secondaryTableColumn) {
    BigDecimal value =
        getValueAsBigDecimal(
            primaryTableColumn.getValueType(), getCellEntry(tableRow, primaryTableColumn));

    Long primaryKey =
        bins.stream()
            .filter(
                bin ->
                    (bin.getLowerBound().compareTo(value) <= 0)
                        && (bin.getUpperBound().compareTo(value) >= 0))
            .findFirst()
            .map(BaseEntity::getId)
            .orElse(null);

    String secondaryKey;
    if (secondaryTableColumn == null) {
      secondaryKey = String.valueOf(primaryKey);
    } else {
      secondaryKey =
          getKeyForCellEntryValueOptionOrBoolean(getCellEntry(tableRow, secondaryTableColumn));
    }

    if (primaryKey == null || secondaryKey == null) {
      return;
    }

    collectedChartData
        .get(primaryKey)
        .compute(secondaryKey, (k, count) -> Objects.requireNonNull(count) + 1);
  }

  private BigDecimal getValueAsBigDecimal(ValueType valueType, CellEntry cellEntry) {
    return switch (valueType) {
      case ValueType.BOOLEAN ->
          Boolean.TRUE.equals(((BooleanEntry) cellEntry).getBoolValue())
              ? BigDecimal.ONE
              : BigDecimal.ZERO;
      case ValueType.DECIMAL -> ((DecimalEntry) cellEntry).getBigDecimalValue();
      case ValueType.INTEGER -> new BigDecimal(((IntegerEntry) cellEntry).getIntegerValue());
      default -> throw new IllegalStateException("Unexpected value: " + valueType);
    };
  }

  @Transactional
  public UUID addHistogramChartDiagram(
      UUID analysisId,
      AddDiagramRequest addDiagramRequest,
      Map<Long, Map<String, Integer>> chartDataHolder,
      HistogramChartConfigurationDto histogramChartConfigurationDto) {
    Analysis analysis = getAnalysisInternal(analysisId);
    HistogramChartConfiguration chartConfiguration =
        (HistogramChartConfiguration)
            Hibernate.unproxy(analysis.getChartConfiguration(), ChartConfiguration.class);

    List<HistogramGroupData> histogramGroupDatas =
        chartConfiguration.getBins().stream()
            .map(
                bin ->
                    mapToHistogramGroupData(
                        bin,
                        chartDataHolder,
                        histogramChartConfigurationDto.secondaryAttribute() != null))
            .toList();

    int evaluatedEntries =
        histogramGroupDatas.stream()
            .map(
                groupData -> {
                  if (groupData.getCount() == null) {
                    return groupData.getKeyToCounts().stream().mapToInt(KeyToCount::getCount).sum();
                  } else {
                    return groupData.getCount();
                  }
                })
            .mapToInt(groupDataCount -> groupDataCount)
            .sum();

    HistogramChartData histogramChartData = new HistogramChartData();
    histogramChartData.setEvaluatedDataAmount(evaluatedEntries);
    histogramChartData.addHistogramGroupDatas(histogramGroupDatas);

    Diagram diagram =
        AnalysisMapper.mapToPersistence(addDiagramRequest, histogramChartData, analysis);

    analysisRepository.flush();
    return diagram.getExternalId();
  }

  private HistogramGroupData mapToHistogramGroupData(
      HistogramBin bin,
      Map<Long, Map<String, Integer>> chartDataHolder,
      boolean withSecondaryAttribute) {
    HistogramGroupData histogramGroupData = new HistogramGroupData();
    bin.addHistogramGroupData(histogramGroupData);

    Map<String, Integer> dataForBin = chartDataHolder.get(bin.getId());
    if (withSecondaryAttribute) {
      histogramGroupData.addKeyToCounts(
          dataForBin.entrySet().stream().map(AnalysisService::getKeyToCount).toList());
    } else {
      histogramGroupData.setCount(dataForBin.values().stream().mapToInt(count -> count).sum());
    }
    return histogramGroupData;
  }

  @Transactional(readOnly = true)
  public int collectPieChartData(
      Map<String, Integer> collectedChartData,
      int page,
      UUID analysisId,
      List<TableColumnFilterParameter> filters,
      PieChartConfigurationDto pieChartConfigurationDto) {
    Analysis analysis = getAnalysisInternal(analysisId);
    AbstractAggregationResult aggregationResult = analysis.getAggregationResult();

    TableColumn tableColumn =
        AggregationResultUtil.getTableColumn(
            pieChartConfigurationDto.attribute(), aggregationResult);
    if (page == 0) {
      AggregationResultUtil.validateColumnFilters(filters, aggregationResult);
      initiallyFillPieChartMap(collectedChartData, tableColumn);
    }

    Stream<Specification<TableRow>> notNullSpecifications =
        Stream.of(AggregationResultSpecifications.getNotNullSpecification(tableColumn));

    return collectDataForTablePageAndReturnMaxPage(
        page,
        notNullSpecifications,
        filters,
        aggregationResult,
        tableRow -> addTableRowToCollectedPieChartData(tableRow, collectedChartData, tableColumn));
  }

  private void initiallyFillPieChartMap(
      Map<String, Integer> collectedChartData, TableColumn tableColumn) {
    List<String> keys = Objects.requireNonNull(getKeysForValueOptionOrBooleanColumn(tableColumn));
    keys.forEach(key -> collectedChartData.put(key, 0));
  }

  private void addTableRowToCollectedPieChartData(
      TableRow tableRow, Map<String, Integer> collectedChartData, TableColumn tableColumn) {
    String key = getKeyForCellEntryValueOptionOrBoolean(getCellEntry(tableRow, tableColumn));
    if (key != null) {
      collectedChartData.put(key, collectedChartData.get(key) + 1);
    }
  }

  @Transactional
  public UUID addPieChartDiagram(
      UUID analysisId,
      AddDiagramRequest addDiagramRequest,
      Map<String, Integer> chartDataHolder,
      PieChartConfigurationDto pieChartConfigurationDto) {
    Analysis analysis = getAnalysisInternal(analysisId);

    Map<String, KeyToCount> keyToCountMap =
        chartDataHolder.entrySet().stream()
            .map(AnalysisService::getKeyToCount)
            .collect(Collectors.toMap(KeyToCount::getKey, Function.identity()));

    List<String> primaryKeys =
        Objects.requireNonNull(
            getKeysForValueOptionOrBooleanColumn(
                AggregationResultUtil.getTableColumn(
                    pieChartConfigurationDto.attribute(), analysis.getAggregationResult())));
    List<KeyToCount> keyToCounts = primaryKeys.stream().map(keyToCountMap::get).toList();

    int evaluatedEntries = keyToCounts.stream().mapToInt(KeyToCount::getCount).sum();

    PieChartData pieChartData = new PieChartData();
    pieChartData.setEvaluatedDataAmount(evaluatedEntries);
    pieChartData.addKeyToCounts(keyToCounts);

    Diagram diagram = AnalysisMapper.mapToPersistence(addDiagramRequest, pieChartData, analysis);

    analysisRepository.flush();
    return diagram.getExternalId();
  }

  @Transactional(readOnly = true)
  public Integer collectPointBasedChartData(
      List<DataPointHolder> collectedChartData,
      Integer page,
      UUID analysisId,
      List<TableColumnFilterParameter> filters,
      PointBasedChartConfiguration pointBasedChartConfiguration) {
    Analysis analysis = getAnalysisInternal(analysisId);
    AbstractAggregationResult aggregationResult = analysis.getAggregationResult();

    if (page == 0) {
      AggregationResultUtil.validateColumnFilters(filters, aggregationResult);
    }

    TableColumn xTableColumn =
        AggregationResultUtil.getTableColumn(
            pointBasedChartConfiguration.xAttribute(), aggregationResult);
    TableColumn yTableColumn =
        AggregationResultUtil.getTableColumn(
            pointBasedChartConfiguration.yAttribute(), aggregationResult);
    TableColumn secondaryTableColumn =
        AggregationResultUtil.getTableColumn(
            pointBasedChartConfiguration.secondaryAttribute(), aggregationResult);

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
                tableRow, collectedChartData, xTableColumn, yTableColumn, secondaryTableColumn));
  }

  private List<Specification<TableRow>> getNotNullSpecificationsForDataPointCharts(
      TableColumn xTableColumn, TableColumn yTableColumn, TableColumn secondaryTableColumn) {
    List<Specification<TableRow>> notNullSpecifications = new ArrayList<>();
    notNullSpecifications.add(
        AggregationResultSpecifications.getNotNullAndNotUnknownSpecificationDecimalAndInteger(
            xTableColumn));
    notNullSpecifications.add(
        AggregationResultSpecifications.getNotNullAndNotUnknownSpecificationDecimalAndInteger(
            yTableColumn));

    if (secondaryTableColumn != null) {
      notNullSpecifications.add(
          AggregationResultSpecifications.getNotNullSpecification(secondaryTableColumn));
    }

    return notNullSpecifications;
  }

  private void addTableRowToCollectedPointBasedChartData(
      TableRow tableRow,
      List<DataPointHolder> collectedChartData,
      TableColumn xTableColumn,
      TableColumn yTableColumn,
      TableColumn secondaryTableColumn) {

    BigDecimal xValue =
        getValueAsBigDecimal(xTableColumn.getValueType(), getCellEntry(tableRow, xTableColumn));
    BigDecimal yValue =
        getValueAsBigDecimal(yTableColumn.getValueType(), getCellEntry(tableRow, yTableColumn));

    if (secondaryTableColumn == null) {
      collectedChartData.add(new DataPointHolder(tableRow.getId(), xValue, yValue, null));
    } else {
      CellEntry secondaryCellEntry = getCellEntry(tableRow, secondaryTableColumn);
      String secondaryKey = getKeyForCellEntryValueOptionOrBoolean(secondaryCellEntry);
      if (secondaryKey != null) {
        collectedChartData.add(new DataPointHolder(tableRow.getId(), xValue, yValue, secondaryKey));
      }
    }
  }

  @Transactional
  public UUID addPointBasedChartDiagram(
      UUID analysisId,
      AddDiagramRequest addDiagramRequest,
      List<DataPointHolder> data,
      PointBasedChartConfiguration pointBasedChartConfiguration) {
    Analysis analysis = getAnalysisInternal(analysisId);

    Comparator<DataPointHolder> comparator =
        Comparator.comparing(DataPointHolder::xCoordinate)
            .thenComparing(DataPointHolder::yCoordinate)
            .thenComparing(DataPointHolder::rowId);
    Function<DataPointHolder, DataPoint> mapFunction =
        dataPointHolder ->
            AnalysisService.getDataPoint(
                dataPointHolder.xCoordinate(), dataPointHolder.yCoordinate());

    AtomicInteger evaluatedDataAmount = new AtomicInteger(0);
    List<DataPointGroup> dataPointGroups = new ArrayList<>();
    if (pointBasedChartConfiguration.secondaryAttribute() == null) {
      List<DataPoint> dataPoints = data.stream().sorted(comparator).map(mapFunction).toList();
      DataPointGroup dataPointGroup = new DataPointGroup();
      dataPointGroup.addDataPoints(dataPoints);
      dataPointGroups.add(dataPointGroup);
      evaluatedDataAmount.addAndGet(dataPoints.size());
    } else {
      Map<String, List<DataPointHolder>> dataPointMap = new HashMap<>();
      data.stream()
          .sorted(comparator)
          .forEach(
              dataPointHolder ->
                  dataPointMap
                      .computeIfAbsent(dataPointHolder.secondaryKey(), key -> new ArrayList<>())
                      .add(dataPointHolder));

      List<String> keys =
          Objects.requireNonNull(
              getKeysForValueOptionOrBooleanColumn(
                  AggregationResultUtil.getTableColumn(
                      pointBasedChartConfiguration.secondaryAttribute(),
                      analysis.getAggregationResult())));

      keys.forEach(
          key -> {
            List<DataPoint> dataPoints =
                dataPointMap.getOrDefault(key, Collections.emptyList()).stream()
                    .sorted(comparator)
                    .map(mapFunction)
                    .toList();
            DataPointGroup dataPointGroup = new DataPointGroup();
            dataPointGroup.setKey(key);
            dataPointGroup.addDataPoints(dataPoints);
            dataPointGroups.add(dataPointGroup);
            evaluatedDataAmount.addAndGet(dataPoints.size());
          });
    }

    if (pointBasedChartConfiguration
            instanceof ScatterChartConfigurationDto scatterChartConfigurationDto
        && scatterChartConfigurationDto.trendLine()) {
      dataPointGroups.forEach(
          dataPointGroup -> dataPointGroup.setTrendLine(determineTrendLine(dataPointGroup)));
    }

    LineOrScatterChartData lineOrScatterChartData = new LineOrScatterChartData();
    lineOrScatterChartData.setLineChart(
        pointBasedChartConfiguration instanceof LineChartConfigurationDto);
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

  @Transactional
  public DiagramDto updateDiagram(UUID diagramId, UpdateDiagramRequest updateDiagramRequest) {
    Diagram diagram = getDiagramInternal(diagramId);
    validateAnalysisNotInReport(diagram.getAnalysis());
    diagram.setTitle(updateDiagramRequest.title());
    diagram.setDescription(updateDiagramRequest.description());

    return AnalysisMapper.mapToApi(diagram);
  }

  public Diagram getDiagramInternal(UUID diagramId) {
    return diagramRepository
        .findByExternalId(diagramId)
        .orElseThrow(() -> new NotFoundException(DIAGRAM_WITH_ID_NOT_FOUND.formatted(diagramId)));
  }

  @Transactional
  public void deleteDiagram(UUID diagramId) {
    Diagram diagram = getDiagramInternal(diagramId);
    validateAnalysisNotInReport(diagram.getAnalysis());
    diagramRepository.delete(diagram);
  }

  @Transactional
  public void analysisConduction(UUID evaluationId) {
    Evaluation evaluation = evaluationService.getEvaluationInternal(evaluationId);
    if (evaluation.getAnalyses().isEmpty()) {
      evaluation.setPendingState(null);
      evaluation.setState(AggregationResultState.COMPLETED);
    } else {
      recalculateHistogramBins(evaluation);
      evaluation.setPendingState(AggregationResultPendingState.DIAGRAM_CREATION);
    }
  }

  private void recalculateHistogramBins(Evaluation evaluation) {
    evaluation
        .getAnalyses()
        .forEach(
            analysis -> {
              ChartConfiguration chartConfiguration =
                  Hibernate.unproxy(analysis.getChartConfiguration(), ChartConfiguration.class);
              if (chartConfiguration
                  instanceof HistogramChartConfiguration histogramChartConfiguration) {
                histogramChartConfiguration.removeBins();
                histogramChartConfiguration.addBins(
                    calculateHistogramBins(
                        AnalysisMapper.mapToHistogramChartConfigurationDto(
                            histogramChartConfiguration),
                        evaluation));
              }
            });
  }
}
