/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.mapper;

import de.eshg.domain.model.BaseEntity;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.statistics.api.AddDiagramRequest;
import de.eshg.statistics.api.AddEvaluationRequest;
import de.eshg.statistics.api.EvaluationDto;
import de.eshg.statistics.api.EvaluationWithDiagrams;
import de.eshg.statistics.api.chart.AddChartConfigurationDto;
import de.eshg.statistics.api.chart.AddChoroplethMapConfigurationDto;
import de.eshg.statistics.api.chart.BarChartConfigurationDto;
import de.eshg.statistics.api.chart.BinningModeDto;
import de.eshg.statistics.api.chart.CalculationDto;
import de.eshg.statistics.api.chart.ChartConfigurationDto;
import de.eshg.statistics.api.chart.ChoroplethMapConfigurationDto;
import de.eshg.statistics.api.chart.GroupingDto;
import de.eshg.statistics.api.chart.HistogramChartConfigurationDto;
import de.eshg.statistics.api.chart.LineChartConfigurationDto;
import de.eshg.statistics.api.chart.OrientationDto;
import de.eshg.statistics.api.chart.PieChartConfigurationDto;
import de.eshg.statistics.api.chart.RangeDto;
import de.eshg.statistics.api.chart.ScalingDto;
import de.eshg.statistics.api.chart.ScatterChartConfigurationDto;
import de.eshg.statistics.api.diagram.BarChartDataDto;
import de.eshg.statistics.api.diagram.BarGroupDataDto;
import de.eshg.statistics.api.diagram.ChoroplethMapDataDto;
import de.eshg.statistics.api.diagram.DataPointDto;
import de.eshg.statistics.api.diagram.DataPointGroupDto;
import de.eshg.statistics.api.diagram.DiagramDataDto;
import de.eshg.statistics.api.diagram.DiagramDto;
import de.eshg.statistics.api.diagram.HistogramBinDto;
import de.eshg.statistics.api.diagram.HistogramChartDataCategorizedDto;
import de.eshg.statistics.api.diagram.HistogramChartDataSimpleDto;
import de.eshg.statistics.api.diagram.HistogramGroupDataCategorizedDto;
import de.eshg.statistics.api.diagram.HistogramGroupDataSimpleDto;
import de.eshg.statistics.api.diagram.KeyToCountDto;
import de.eshg.statistics.api.diagram.KeyToValueDto;
import de.eshg.statistics.api.diagram.LineChartDataCategorizedDto;
import de.eshg.statistics.api.diagram.LineChartDataSimpleDto;
import de.eshg.statistics.api.diagram.PieChartDataDto;
import de.eshg.statistics.api.diagram.ScatterChartDataCategorizedDto;
import de.eshg.statistics.api.diagram.ScatterChartDataSimpleDto;
import de.eshg.statistics.api.diagram.TrendLineDto;
import de.eshg.statistics.persistence.entity.AbstractAggregationResult;
import de.eshg.statistics.persistence.entity.AbstractFilterParameter;
import de.eshg.statistics.persistence.entity.ChartConfiguration;
import de.eshg.statistics.persistence.entity.Diagram;
import de.eshg.statistics.persistence.entity.Evaluation;
import de.eshg.statistics.persistence.entity.chart.BarChartConfiguration;
import de.eshg.statistics.persistence.entity.chart.BinningMode;
import de.eshg.statistics.persistence.entity.chart.Calculation;
import de.eshg.statistics.persistence.entity.chart.ChoroplethMapConfiguration;
import de.eshg.statistics.persistence.entity.chart.GroupingType;
import de.eshg.statistics.persistence.entity.chart.HistogramBin;
import de.eshg.statistics.persistence.entity.chart.HistogramChartConfiguration;
import de.eshg.statistics.persistence.entity.chart.LineChartConfiguration;
import de.eshg.statistics.persistence.entity.chart.Orientation;
import de.eshg.statistics.persistence.entity.chart.PieChartConfiguration;
import de.eshg.statistics.persistence.entity.chart.Range;
import de.eshg.statistics.persistence.entity.chart.Scaling;
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
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import org.hibernate.Hibernate;

public class EvaluationMapper {

  private EvaluationMapper() {}

  public static Evaluation mapToPersistence(
      AbstractAggregationResult aggregationResult,
      AddEvaluationRequest addEvaluationRequest,
      String geoJson,
      List<HistogramBin> histogramBins) {
    Evaluation evaluation = new Evaluation();
    aggregationResult.addEvaluation(evaluation);
    evaluation.setName(addEvaluationRequest.name());
    evaluation.setChartConfiguration(
        mapToPersistence(addEvaluationRequest.chartConfiguration(), geoJson, histogramBins));
    return evaluation;
  }

  private static ChartConfiguration mapToPersistence(
      AddChartConfigurationDto chartConfiguration,
      String geoJson,
      List<HistogramBin> histogramBins) {
    return switch (chartConfiguration) {
      case BarChartConfigurationDto barChartConfigurationDto ->
          mapToBarChartConfiguration(barChartConfigurationDto);
      case AddChoroplethMapConfigurationDto choroplethMapConfigurationDto ->
          mapToChoroplethMapConfiguration(choroplethMapConfigurationDto, geoJson);
      case HistogramChartConfigurationDto histogramChartConfigurationDto ->
          mapToHistogramChartConfiguration(histogramChartConfigurationDto, histogramBins);
      case LineChartConfigurationDto lineChartConfigurationDto ->
          mapToLineChartConfiguration(lineChartConfigurationDto);
      case PieChartConfigurationDto pieChartConfigurationDto ->
          mapToPieChartConfiguration(pieChartConfigurationDto);
      case ScatterChartConfigurationDto scatterChartConfigurationDto ->
          mapToScatterChartConfiguration(scatterChartConfigurationDto);
    };
  }

  private static BarChartConfiguration mapToBarChartConfiguration(
      BarChartConfigurationDto barChartConfigurationDto) {
    BarChartConfiguration barChartConfiguration = new BarChartConfiguration();
    barChartConfiguration.setPrimaryAttributeSelection(
        AttributeSelectionMapper.mapToPersistence(barChartConfigurationDto.primaryAttribute()));
    barChartConfiguration.setSecondaryAttributeSelection(
        AttributeSelectionMapper.mapToPersistence(barChartConfigurationDto.secondaryAttribute()));
    barChartConfiguration.setScaling(mapToScaling(barChartConfigurationDto.scaling()));
    barChartConfiguration.setOrientation(mapToOrientation(barChartConfigurationDto.orientation()));
    barChartConfiguration.setGrouping(mapToGrouping(barChartConfigurationDto.grouping()));
    return barChartConfiguration;
  }

  private static ChartConfiguration mapToChoroplethMapConfiguration(
      AddChoroplethMapConfigurationDto choroplethMapConfigurationDto, String geoJson) {
    ChoroplethMapConfiguration choroplethMapConfiguration = new ChoroplethMapConfiguration();
    choroplethMapConfiguration.setPrimaryAttributeSelection(
        AttributeSelectionMapper.mapToPersistence(
            choroplethMapConfigurationDto.primaryAttribute()));
    choroplethMapConfiguration.setSecondaryAttributeSelection(
        AttributeSelectionMapper.mapToPersistence(
            choroplethMapConfigurationDto.secondaryAttribute()));
    choroplethMapConfiguration.setCalculation(
        mapToCalculation(choroplethMapConfigurationDto.calculation()));
    choroplethMapConfiguration.setGeoJson(geoJson);
    choroplethMapConfiguration.setColorScheme(choroplethMapConfigurationDto.colorScheme());
    return choroplethMapConfiguration;
  }

  private static HistogramChartConfiguration mapToHistogramChartConfiguration(
      HistogramChartConfigurationDto histogramChartConfigurationDto,
      List<HistogramBin> histogramBins) {
    HistogramChartConfiguration histogramChartConfiguration = new HistogramChartConfiguration();
    histogramChartConfiguration.setPrimaryAttributeSelection(
        AttributeSelectionMapper.mapToPersistence(
            histogramChartConfigurationDto.primaryAttribute()));
    histogramChartConfiguration.setSecondaryAttributeSelection(
        AttributeSelectionMapper.mapToPersistence(
            histogramChartConfigurationDto.secondaryAttribute()));
    histogramChartConfiguration.setGrouping(
        mapToGrouping(histogramChartConfigurationDto.grouping()));
    histogramChartConfiguration.setScaling(mapToScaling(histogramChartConfigurationDto.scaling()));
    histogramChartConfiguration.setBinningMode(
        mapToBinningMode(histogramChartConfigurationDto.binningMode()));
    histogramChartConfiguration.setNumberOfBins(histogramChartConfigurationDto.numberOfBins());
    histogramChartConfiguration.addBins(histogramBins);
    return histogramChartConfiguration;
  }

  private static LineChartConfiguration mapToLineChartConfiguration(
      LineChartConfigurationDto lineChartConfigurationDto) {
    LineChartConfiguration lineChartConfiguration = new LineChartConfiguration();
    lineChartConfiguration.setXAttributeSelection(
        AttributeSelectionMapper.mapToPersistence(lineChartConfigurationDto.xAttribute()));
    lineChartConfiguration.setYAttributeSelection(
        AttributeSelectionMapper.mapToPersistence(lineChartConfigurationDto.yAttribute()));
    lineChartConfiguration.setSecondaryAttributeSelection(
        AttributeSelectionMapper.mapToPersistence(lineChartConfigurationDto.secondaryAttribute()));
    lineChartConfiguration.setRange(mapToRange(lineChartConfigurationDto.range()));
    return lineChartConfiguration;
  }

  private static PieChartConfiguration mapToPieChartConfiguration(
      PieChartConfigurationDto pieChartConfigurationDto) {
    PieChartConfiguration pieChartConfiguration = new PieChartConfiguration();
    pieChartConfiguration.setAttributeSelection(
        AttributeSelectionMapper.mapToPersistence(pieChartConfigurationDto.attribute()));
    return pieChartConfiguration;
  }

  private static ScatterChartConfiguration mapToScatterChartConfiguration(
      ScatterChartConfigurationDto scatterChartConfigurationDto) {
    ScatterChartConfiguration scatterChartConfiguration = new ScatterChartConfiguration();
    scatterChartConfiguration.setXAttributeSelection(
        AttributeSelectionMapper.mapToPersistence(scatterChartConfigurationDto.xAttribute()));
    scatterChartConfiguration.setYAttributeSelection(
        AttributeSelectionMapper.mapToPersistence(scatterChartConfigurationDto.yAttribute()));
    scatterChartConfiguration.setSecondaryAttributeSelection(
        AttributeSelectionMapper.mapToPersistence(
            scatterChartConfigurationDto.secondaryAttribute()));
    scatterChartConfiguration.setRange(mapToRange(scatterChartConfigurationDto.range()));
    scatterChartConfiguration.setTrendLine(scatterChartConfigurationDto.trendLine());
    return scatterChartConfiguration;
  }

  private static Scaling mapToScaling(ScalingDto scaling) {
    return Optional.ofNullable(scaling).map(s -> Scaling.valueOf(s.name())).orElse(null);
  }

  private static GroupingType mapToGrouping(GroupingDto grouping) {
    return Optional.ofNullable(grouping).map(g -> GroupingType.valueOf(g.name())).orElse(null);
  }

  private static Orientation mapToOrientation(OrientationDto orientation) {
    return Orientation.valueOf(orientation.name());
  }

  private static Range mapToRange(RangeDto range) {
    return Range.valueOf(range.name());
  }

  private static BinningMode mapToBinningMode(BinningModeDto binningMode) {
    return BinningMode.valueOf(binningMode.name());
  }

  private static Calculation mapToCalculation(CalculationDto calculation) {
    return Optional.ofNullable(calculation).map(c -> Calculation.valueOf(c.name())).orElse(null);
  }

  public static Diagram mapToPersistence(
      AddDiagramRequest addDiagramRequest, DiagramData diagramData, Evaluation evaluation) {
    Diagram diagram = new Diagram();
    diagram.setDiagramData(diagramData);
    evaluation.addDiagram(diagram);
    diagram.setTitle(addDiagramRequest.title());
    diagram.setDescription(addDiagramRequest.description());
    if (addDiagramRequest.filters() != null) {
      List<AbstractFilterParameter> filterParameters =
          addDiagramRequest.filters().stream()
              .map(FilterParameterMapper::mapToPersistence)
              .toList();
      diagram.addFilters(filterParameters);
    }
    return diagram;
  }

  public static List<EvaluationDto> getEvaluations(List<Evaluation> evaluations) {
    return evaluations.stream()
        .sorted(
            Comparator.comparing(Evaluation::getCreatedAt)
                .reversed()
                .thenComparing(Evaluation::getName))
        .map(EvaluationMapper::mapToApi)
        .toList();
  }

  public static EvaluationDto mapToApi(Evaluation evaluation) {
    return mapToApi(evaluation, false);
  }

  public static EvaluationDto mapToApi(Evaluation evaluation, boolean withJson) {
    return new EvaluationDto(
        evaluation.getExternalId(),
        evaluation.getName(),
        evaluation.getDiagrams().size(),
        evaluation.getCreatedAt(),
        mapToChartConfigurationDto(
            Hibernate.unproxy(evaluation.getChartConfiguration(), ChartConfiguration.class),
            withJson));
  }

  public static EvaluationWithDiagrams mapToEvaluationWithDiagrams(Evaluation evaluation) {
    ChartConfiguration chartConfiguration =
        Hibernate.unproxy(evaluation.getChartConfiguration(), ChartConfiguration.class);
    return new EvaluationWithDiagrams(
        evaluation.getExternalId(),
        evaluation.getName(),
        evaluation.getCreatedAt(),
        mapToChartConfigurationDto(chartConfiguration, true),
        evaluation.getDiagrams().stream()
            .sorted(Comparator.comparing(BaseEntity::getId))
            .map(diagram -> EvaluationMapper.mapToApi(diagram, chartConfiguration))
            .toList());
  }

  private static ChartConfigurationDto mapToChartConfigurationDto(
      ChartConfiguration chartConfiguration, boolean withJson) {
    return switch (chartConfiguration) {
      case BarChartConfiguration barChartConfiguration ->
          mapToBarChartConfigurationDto(barChartConfiguration);
      case ChoroplethMapConfiguration choroplethMapConfiguration ->
          mapToChoroplethMapConfigurationDto(choroplethMapConfiguration, withJson);
      case HistogramChartConfiguration histogramChartConfiguration ->
          mapToHistogramChartConfigurationDto(histogramChartConfiguration);
      case LineChartConfiguration lineChartConfiguration ->
          mapToLineChartConfigurationDto(lineChartConfiguration);
      case PieChartConfiguration pieChartConfiguration ->
          mapToPieChartConfigurationDto(pieChartConfiguration);
      case ScatterChartConfiguration scatterChartConfiguration ->
          mapToScatterChartConfigurationDto(scatterChartConfiguration);
      default -> throw new IllegalStateException("Unexpected value: " + chartConfiguration);
    };
  }

  private static BarChartConfigurationDto mapToBarChartConfigurationDto(
      BarChartConfiguration barChartConfiguration) {
    return new BarChartConfigurationDto(
        AttributeSelectionMapper.mapToApi(
            barChartConfiguration.getPrimaryAttributeSelection(), true),
        AttributeSelectionMapper.mapToApi(
            barChartConfiguration.getSecondaryAttributeSelection(), false),
        mapToScalingDto(barChartConfiguration.getScaling()),
        mapToGroupingDto(barChartConfiguration.getGrouping()),
        mapToOrientationDto(barChartConfiguration.getOrientation()));
  }

  private static LineChartConfigurationDto mapToLineChartConfigurationDto(
      LineChartConfiguration lineChartConfiguration) {
    return new LineChartConfigurationDto(
        AttributeSelectionMapper.mapToApi(lineChartConfiguration.getXAttributeSelection(), true),
        AttributeSelectionMapper.mapToApi(lineChartConfiguration.getYAttributeSelection(), true),
        AttributeSelectionMapper.mapToApi(
            lineChartConfiguration.getSecondaryAttributeSelection(), false),
        mapToRangeDto(lineChartConfiguration.getRange()));
  }

  private static ScatterChartConfigurationDto mapToScatterChartConfigurationDto(
      ScatterChartConfiguration scatterChartConfiguration) {
    return new ScatterChartConfigurationDto(
        AttributeSelectionMapper.mapToApi(scatterChartConfiguration.getXAttributeSelection(), true),
        AttributeSelectionMapper.mapToApi(scatterChartConfiguration.getYAttributeSelection(), true),
        AttributeSelectionMapper.mapToApi(
            scatterChartConfiguration.getSecondaryAttributeSelection(), false),
        mapToRangeDto(scatterChartConfiguration.getRange()),
        scatterChartConfiguration.showTrendLine());
  }

  private static PieChartConfigurationDto mapToPieChartConfigurationDto(
      PieChartConfiguration pieChartConfiguration) {
    return new PieChartConfigurationDto(
        AttributeSelectionMapper.mapToApi(pieChartConfiguration.getAttributeSelection(), true));
  }

  public static HistogramChartConfigurationDto mapToHistogramChartConfigurationDto(
      HistogramChartConfiguration histogramChartConfiguration) {
    return new HistogramChartConfigurationDto(
        AttributeSelectionMapper.mapToApi(
            histogramChartConfiguration.getPrimaryAttributeSelection(), true),
        AttributeSelectionMapper.mapToApi(
            histogramChartConfiguration.getSecondaryAttributeSelection(), false),
        mapToScalingDto(histogramChartConfiguration.getScaling()),
        mapToGroupingDto(histogramChartConfiguration.getGrouping()),
        mapToBinningModeDto(histogramChartConfiguration.getBinningMode()),
        histogramChartConfiguration.getNumberOfBins());
  }

  private static ChartConfigurationDto mapToChoroplethMapConfigurationDto(
      ChoroplethMapConfiguration choroplethMapConfiguration, boolean withJson) {
    return new ChoroplethMapConfigurationDto(
        AttributeSelectionMapper.mapToApi(
            choroplethMapConfiguration.getPrimaryAttributeSelection(), true),
        AttributeSelectionMapper.mapToApi(
            choroplethMapConfiguration.getSecondaryAttributeSelection(), false),
        mapToCalculationDto(choroplethMapConfiguration.getCalculation()),
        withJson ? choroplethMapConfiguration.getGeoJson() : null,
        choroplethMapConfiguration.getColorScheme());
  }

  private static ScalingDto mapToScalingDto(Scaling scaling) {
    return Optional.ofNullable(scaling).map(s -> ScalingDto.valueOf(s.name())).orElse(null);
  }

  private static GroupingDto mapToGroupingDto(GroupingType grouping) {
    return Optional.ofNullable(grouping).map(g -> GroupingDto.valueOf(g.name())).orElse(null);
  }

  private static OrientationDto mapToOrientationDto(Orientation orientation) {
    return OrientationDto.valueOf(orientation.name());
  }

  private static RangeDto mapToRangeDto(Range range) {
    return RangeDto.valueOf(range.name());
  }

  private static BinningModeDto mapToBinningModeDto(BinningMode binningMode) {
    return BinningModeDto.valueOf(binningMode.name());
  }

  private static CalculationDto mapToCalculationDto(Calculation calculation) {
    return Optional.ofNullable(calculation).map(c -> CalculationDto.valueOf(c.name())).orElse(null);
  }

  public static DiagramDto mapToApi(Diagram diagram) {
    ChartConfiguration chartConfiguration =
        Hibernate.unproxy(
            diagram.getEvaluation().getChartConfiguration(), ChartConfiguration.class);
    return mapToApi(diagram, chartConfiguration);
  }

  private static DiagramDto mapToApi(Diagram diagram, ChartConfiguration chartConfiguration) {
    DiagramData diagramData = Hibernate.unproxy(diagram.getDiagramData(), DiagramData.class);
    DiagramDataDto diagramDataDto =
        switch (diagramData) {
          case BarChartData barChartData -> mapToApi(barChartData);
          case ChoroplethMapData choroplethMapData -> mapToApi(choroplethMapData);
          case HistogramChartData histogramChartData ->
              mapToApi(histogramChartData, chartConfiguration);
          case LineOrScatterChartData lineOrScatterChartData -> mapToApi(lineOrScatterChartData);
          case PieChartData pieChartData -> mapToApi(pieChartData);
          default -> throw new BadRequestException("Unexpected class");
        };

    return new DiagramDto(
        diagram.getExternalId(),
        diagram.getTitle(),
        diagram.getDescription(),
        diagram.getDiagramData().getEvaluatedDataAmount(),
        FilterParameterMapper.mapToApi(diagram.getFilters()),
        diagramDataDto);
  }

  private static DiagramDataDto mapToApi(BarChartData barChartData) {
    return new BarChartDataDto(
        barChartData.getBarGroupDatas().stream().map(EvaluationMapper::mapToApi).toList());
  }

  private static BarGroupDataDto mapToApi(BarGroupData barGroupData) {
    return new BarGroupDataDto(
        barGroupData.getKey(),
        barGroupData.getKeyToCounts().stream().map(EvaluationMapper::mapToApi).toList());
  }

  private static ChoroplethMapDataDto mapToApi(ChoroplethMapData choroplethMapData) {
    return new ChoroplethMapDataDto(
        choroplethMapData.getKeyToValues().stream().map(EvaluationMapper::mapToApi).toList());
  }

  private static KeyToValueDto mapToApi(KeyToValue keyToValue) {
    return new KeyToValueDto(keyToValue.getKey(), keyToValue.getValue());
  }

  private static DiagramDataDto mapToApi(
      HistogramChartData histogramChartData, ChartConfiguration chartConfiguration) {
    boolean isSimple =
        ((HistogramChartConfiguration) chartConfiguration).getSecondaryAttributeSelection() == null;
    if (isSimple) {
      return new HistogramChartDataSimpleDto(
          histogramChartData.getHistogramGroupDatas().stream()
              .map(EvaluationMapper::mapToApiSimple)
              .toList());
    } else {
      return new HistogramChartDataCategorizedDto(
          histogramChartData.getHistogramGroupDatas().stream()
              .map(EvaluationMapper::mapToApiCategorized)
              .toList());
    }
  }

  private static HistogramGroupDataSimpleDto mapToApiSimple(HistogramGroupData histogramGroupData) {
    return new HistogramGroupDataSimpleDto(
        new HistogramBinDto(
            histogramGroupData.getHistogramBin().getLowerBound(),
            histogramGroupData.getHistogramBin().getUpperBound()),
        histogramGroupData.getCount());
  }

  private static HistogramGroupDataCategorizedDto mapToApiCategorized(
      HistogramGroupData histogramGroupData) {
    return new HistogramGroupDataCategorizedDto(
        new HistogramBinDto(
            histogramGroupData.getHistogramBin().getLowerBound(),
            histogramGroupData.getHistogramBin().getUpperBound()),
        histogramGroupData.getKeyToCounts().stream().map(EvaluationMapper::mapToApi).toList());
  }

  private static DiagramDataDto mapToApi(LineOrScatterChartData lineOrScatterChartData) {
    boolean isSimple = lineOrScatterChartData.getDataPointGroups().getFirst().getKey() == null;
    if (lineOrScatterChartData.isLineChart()) {
      if (isSimple) {
        return new LineChartDataSimpleDto(
            mapToDataPoints(lineOrScatterChartData.getDataPointGroups().getFirst()));
      } else {
        return new LineChartDataCategorizedDto(
            lineOrScatterChartData.getDataPointGroups().stream()
                .map(EvaluationMapper::mapToApi)
                .toList());
      }
    } else {
      if (isSimple) {
        DataPointGroup dataPointGroup = lineOrScatterChartData.getDataPointGroups().getFirst();
        return new ScatterChartDataSimpleDto(
            mapToDataPoints(dataPointGroup), mapToApi(dataPointGroup.getTrendLine()));
      } else {
        return new ScatterChartDataCategorizedDto(
            lineOrScatterChartData.getDataPointGroups().stream()
                .map(EvaluationMapper::mapToApi)
                .toList());
      }
    }
  }

  private static List<DataPointDto> mapToDataPoints(DataPointGroup dataPointGroup) {
    return dataPointGroup.getDataPoints().stream().map(EvaluationMapper::mapToApi).toList();
  }

  private static DataPointDto mapToApi(DataPoint dataPoint) {
    return new DataPointDto(dataPoint.getXCoordinate(), dataPoint.getYCoordinate());
  }

  private static TrendLineDto mapToApi(TrendLine trendLine) {
    return trendLine == null
        ? null
        : new TrendLineDto(trendLine.getLineSlope(), trendLine.getLineOffset());
  }

  private static DataPointGroupDto mapToApi(DataPointGroup dataPointGroup) {
    return new DataPointGroupDto(
        dataPointGroup.getKey(),
        dataPointGroup.getDataPoints().stream().map(EvaluationMapper::mapToApi).toList(),
        mapToApi(dataPointGroup.getTrendLine()));
  }

  private static DiagramDataDto mapToApi(PieChartData pieChartData) {
    return new PieChartDataDto(
        pieChartData.getKeyToCounts().stream().map(EvaluationMapper::mapToApi).toList());
  }

  private static KeyToCountDto mapToApi(KeyToCount keyToCount) {
    return new KeyToCountDto(keyToCount.getKey(), keyToCount.getCount());
  }
}
