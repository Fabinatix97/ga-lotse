/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.aggregation;

import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.error.NotFoundException;
import de.eshg.statistics.GeoShapeService;
import de.eshg.statistics.api.AddAnalysisRequest;
import de.eshg.statistics.api.AnalysisDto;
import de.eshg.statistics.api.AnalysisWithDiagrams;
import de.eshg.statistics.api.UpdateAnalysisRequest;
import de.eshg.statistics.api.chart.AddChoroplethMapConfigurationDto;
import de.eshg.statistics.api.chart.BarChartConfigurationDto;
import de.eshg.statistics.api.chart.BinningModeDto;
import de.eshg.statistics.api.chart.ChartConfigurationDto;
import de.eshg.statistics.api.chart.ChoroplethMapConfigurationDto;
import de.eshg.statistics.api.chart.HistogramChartConfigurationDto;
import de.eshg.statistics.api.chart.LineChartConfigurationDto;
import de.eshg.statistics.api.chart.PieChartConfigurationDto;
import de.eshg.statistics.api.chart.PointBasedChartConfigurationDto;
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
import de.eshg.statistics.persistence.entity.ChartConfiguration;
import de.eshg.statistics.persistence.entity.Diagram;
import de.eshg.statistics.persistence.entity.Evaluation;
import de.eshg.statistics.persistence.entity.TableColumn;
import de.eshg.statistics.persistence.entity.TableColumnValueType;
import de.eshg.statistics.persistence.entity.TableRow;
import de.eshg.statistics.persistence.entity.chart.ChoroplethMapConfiguration;
import de.eshg.statistics.persistence.entity.chart.HistogramBin;
import de.eshg.statistics.persistence.entity.chart.HistogramChartConfiguration;
import de.eshg.statistics.persistence.entity.chart.LineChartConfiguration;
import de.eshg.statistics.persistence.entity.chart.PieChartConfiguration;
import de.eshg.statistics.persistence.entity.chart.ScatterChartConfiguration;
import de.eshg.statistics.persistence.entity.diagramdata.BarChartData;
import de.eshg.statistics.persistence.entity.diagramdata.ChoroplethMapData;
import de.eshg.statistics.persistence.entity.diagramdata.DiagramData;
import de.eshg.statistics.persistence.entity.diagramdata.HistogramChartData;
import de.eshg.statistics.persistence.entity.diagramdata.LineOrScatterChartData;
import de.eshg.statistics.persistence.entity.diagramdata.PieChartData;
import de.eshg.statistics.persistence.entity.evaluationtemplate.AnalysisTemplate;
import de.eshg.statistics.persistence.entity.evaluationtemplate.DiagramTemplate;
import de.eshg.statistics.persistence.entity.report.Report;
import de.eshg.statistics.persistence.repository.AnalysisRepository;
import de.eshg.statistics.persistence.repository.DiagramRepository;
import de.eshg.statistics.persistence.repository.TableRowRepository;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.UUID;
import org.hibernate.Hibernate;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AnalysisService {
  private static final String ANALYSIS_WITH_ID_NOT_FOUND = "Analysis with given id not found";
  private static final String DIAGRAM_WITH_ID_NOT_FOUND = "Diagram with given id not found";
  private static final String PRIMARY_ATTRIBUTE = "primaryAttribute";
  private static final String SECONDARY_ATTRIBUTE = "secondaryAttribute";
  private static final String ERROR_MESSAGE_ATTRIBUTE_TYPE =
      "'%s': %ss require an attribute of type BOOLEAN, TEXT or VALUE_WITH_OPTIONS as '%s'";

  private final EvaluationService evaluationService;
  private final GeoShapeService geoShapeService;
  private final AnalysisRepository analysisRepository;
  private final TableRowRepository tableRowRepository;
  private final DiagramRepository diagramRepository;

  public AnalysisService(
      EvaluationService evaluationService,
      GeoShapeService geoShapeService,
      AnalysisRepository analysisRepository,
      TableRowRepository tableRowRepository,
      DiagramRepository diagramRepository) {
    this.evaluationService = evaluationService;
    this.geoShapeService = geoShapeService;
    this.analysisRepository = analysisRepository;
    this.tableRowRepository = tableRowRepository;
    this.diagramRepository = diagramRepository;
  }

  @Transactional(readOnly = true)
  public void checkPermissionForAnalysis(UUID analysisId) {
    AbstractAggregationResult aggregationResult =
        getAnalysisInternal(analysisId).getAggregationResult();
    if (evaluationService.accessNotAllowed(aggregationResult)) {
      throw new NotFoundException(ANALYSIS_WITH_ID_NOT_FOUND);
    }
  }

  @Transactional(readOnly = true)
  public void checkPermissionForDiagram(UUID diagramId) {
    AbstractAggregationResult aggregationResult =
        getDiagramInternal(diagramId).getAnalysis().getAggregationResult();
    if (evaluationService.accessNotAllowed(aggregationResult)) {
      throw new NotFoundException(DIAGRAM_WITH_ID_NOT_FOUND);
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

    String configName = "BarChartConfiguration";
    validateTableColumBooleanTextOrValueOption(
        tableColumnPrimary,
        ERROR_MESSAGE_ATTRIBUTE_TYPE.formatted(name, configName, PRIMARY_ATTRIBUTE));

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
      validateTableColumBooleanTextOrValueOption(
          tableColumnSecondary,
          ERROR_MESSAGE_ATTRIBUTE_TYPE.formatted(name, configName, SECONDARY_ATTRIBUTE));
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

    String configName = "HistogramChartConfiguration";
    validateTableColumnDecimalOrInteger(
        tableColumnPrimary,
        "'%s': %ss require an attribute of type DECIMAL or INTEGER as '%s'"
            .formatted(name, configName, PRIMARY_ATTRIBUTE));

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
      validateTableColumBooleanTextOrValueOption(
          tableColumnSecondary,
          ERROR_MESSAGE_ATTRIBUTE_TYPE.formatted(name, configName, SECONDARY_ATTRIBUTE));

      if (histogramChartConfiguration.grouping() == null
          || histogramChartConfiguration.scaling() == null) {
        throw new BadRequestException(
            "'%s': Grouping and scaling are required for a secondary attribute".formatted(name));
      }
    }

    validateBinning(histogramChartConfiguration, name);
  }

  private static void validateBinning(
      HistogramChartConfigurationDto histogramChartConfiguration, String name) {
    if (histogramChartConfiguration.binningMode().equals(BinningModeDto.MANUAL)
        && (histogramChartConfiguration.numberOfBins() == null
            || histogramChartConfiguration.minBin() == null
            || histogramChartConfiguration.maxBin() == null)) {
      throw new BadRequestException(
          "'%s': numberOfBins, minBin & maxBin is required for binning mode '%s'"
              .formatted(name, BinningModeDto.MANUAL.name()));
    }

    if (histogramChartConfiguration.binningMode().equals(BinningModeDto.AUTO)
        && (histogramChartConfiguration.numberOfBins() != null
            || histogramChartConfiguration.minBin() != null
            || histogramChartConfiguration.maxBin() != null)) {
      throw new BadRequestException(
          "'%s': numberOfBins, minBin & maxBin must not be set for binning mode '%s'"
              .formatted(name, BinningModeDto.AUTO.name()));
    }

    if (histogramChartConfiguration.binningMode().equals(BinningModeDto.MANUAL)) {
      boolean maxIsNotGreaterThanMin =
          histogramChartConfiguration.maxBin().compareTo(histogramChartConfiguration.minBin()) <= 0;
      if (maxIsNotGreaterThanMin) {
        throw new BadRequestException(
            "'%s': value of maxBin must be greater than minBin".formatted(name));
      }
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
    BigDecimal minimum;
    BigDecimal maximum;
    if (histogramChartConfiguration.binningMode().equals(BinningModeDto.MANUAL)) {
      numberOfBins = histogramChartConfiguration.numberOfBins();
      maximum = histogramChartConfiguration.maxBin();
      minimum = histogramChartConfiguration.minBin();
    } else {
      numberOfBins = Math.clamp((int) Math.ceil(Math.sqrt(numberOfDataPoints)), 2, 50);

      if (tableColumnPrimary.getValueType().equals(TableColumnValueType.DECIMAL)) {
        minimum = tableColumnPrimary.getMinMaxNullUnknownValues().getMinDecimal();
        maximum = tableColumnPrimary.getMinMaxNullUnknownValues().getMaxDecimal();
      } else {
        minimum = new BigDecimal(tableColumnPrimary.getMinMaxNullUnknownValues().getMinInteger());
        maximum = new BigDecimal(tableColumnPrimary.getMinMaxNullUnknownValues().getMaxInteger());
      }
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
        TableRowSpecifications.tableRowOfAggregationOrderByTableRowId(aggregationResult));
    specifications.add(
        TableRowSpecifications.getNotNullAndNotUnknownSpecificationDecimalAndInteger(
            tableColumnPrimary));
    if (tableColumnSecondary != null) {
      specifications.add(TableRowSpecifications.getNotNullSpecification(tableColumnSecondary));
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

    validateTableColumBooleanTextOrValueOption(
        tableColumnPrimary,
        "'%s': PieChartConfigurations require an attribute of type BOOLEAN, TEXT or VALUE_WITH_OPTIONS"
            .formatted(name));
  }

  private static void validatePointBasedChartConfiguration(
      PointBasedChartConfigurationDto chartConfiguration,
      AbstractAggregationResult aggregationResult,
      String name,
      String configName) {

    String errorMessage = "'%s': %ss require an attribute of type %s or %s as '%s'";

    TableColumn tableColumnX =
        AggregationResultUtil.getTableColumn(chartConfiguration.xAttribute(), aggregationResult);
    validateTableColumnDecimalOrInteger(
        tableColumnX,
        errorMessage.formatted(
            name,
            configName,
            TableColumnValueType.DECIMAL,
            TableColumnValueType.INTEGER,
            "xAttribute"));

    TableColumn tableColumnY =
        AggregationResultUtil.getTableColumn(chartConfiguration.yAttribute(), aggregationResult);
    validateTableColumnDecimalOrInteger(
        tableColumnY,
        errorMessage.formatted(
            name,
            configName,
            TableColumnValueType.DECIMAL,
            TableColumnValueType.INTEGER,
            "yAttribute"));

    if (chartConfiguration.secondaryAttribute() != null) {
      TableColumn tableColumnSecondary =
          AggregationResultUtil.getTableColumn(
              chartConfiguration.secondaryAttribute(), aggregationResult);

      validateTableColumBooleanTextOrValueOption(
          tableColumnSecondary,
          ERROR_MESSAGE_ATTRIBUTE_TYPE.formatted(name, configName, SECONDARY_ATTRIBUTE));
    }
  }

  private static void validateThatTableColumnsAreDifferent(
      TableColumn tableColumnPrimary, TableColumn tableColumnSecondary, String name) {
    if (tableColumnPrimary.equals(tableColumnSecondary)) {
      throw new BadRequestException(
          "'%s': Primary and secondary attribute must be different".formatted(name));
    }
  }

  private static void validateTableColumBooleanTextOrValueOption(
      TableColumn tableColumn, String errorMessage) {
    if (!tableColumn.getValueType().equals(TableColumnValueType.TEXT)
        && !tableColumn.getValueType().equals(TableColumnValueType.VALUE_WITH_OPTIONS)
        && !tableColumn.getValueType().equals(TableColumnValueType.BOOLEAN)) {
      throw new BadRequestException(errorMessage);
    }
  }

  private static void validateTableColumnDecimalOrInteger(
      TableColumn tableColumn, String errorMessage) {
    if (!tableColumn.getValueType().equals(TableColumnValueType.DECIMAL)
        && !tableColumn.getValueType().equals(TableColumnValueType.INTEGER)) {
      throw new BadRequestException(errorMessage);
    }
  }

  private static void validateChoroplethPrimaryAttribute(TableColumn tableColumn) {
    if (!tableColumn.getValueType().equals(TableColumnValueType.VALUE_WITH_OPTIONS)
        && !tableColumn.getValueType().equals(TableColumnValueType.TEXT)) {
      throw new BadRequestException(
          "ChoroplethMapConfigurations require an attribute of type %s or %s as 'primaryAttribute'"
              .formatted(TableColumnValueType.VALUE_WITH_OPTIONS, TableColumnValueType.TEXT));
    }
  }

  private static void validateChoroplethSecondaryAttribute(TableColumn tableColumn) {
    if (!tableColumn.getValueType().equals(TableColumnValueType.BOOLEAN)
        && !tableColumn.getValueType().equals(TableColumnValueType.INTEGER)
        && !tableColumn.getValueType().equals(TableColumnValueType.DECIMAL)) {
      throw new BadRequestException(
          "ChoroplethMapConfigurations require an attribute of type %s or %s or %s as 'secondaryAttribute'"
              .formatted(
                  TableColumnValueType.BOOLEAN,
                  TableColumnValueType.INTEGER,
                  TableColumnValueType.DECIMAL));
    }
  }

  @Transactional(readOnly = true)
  public AnalysisWithDiagrams getAnalysis(UUID analysisId) {
    return AnalysisMapper.mapToAnalysisWithDiagrams(getAnalysisInternal(analysisId));
  }

  public Analysis getAnalysisInternal(UUID analysisId) {
    return analysisRepository
        .findByExternalId(analysisId)
        .orElseThrow(() -> new NotFoundException(ANALYSIS_WITH_ID_NOT_FOUND));
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
        .orElseThrow(() -> new NotFoundException(DIAGRAM_WITH_ID_NOT_FOUND));
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
