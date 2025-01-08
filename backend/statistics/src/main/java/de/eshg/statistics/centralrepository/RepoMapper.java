/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.centralrepository;

import de.eshg.lib.centralrepository.api.MetadataListResponseDto;
import de.eshg.lib.centralrepository.api.MetadataRequestDto;
import de.eshg.lib.centralrepository.api.MetadataResponseDto;
import de.eshg.statistics.api.AttributeSelectionDto;
import de.eshg.statistics.api.RepositoryMetaInfo;
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
import de.eshg.statistics.api.datasource.BusinessDataAttribute;
import de.eshg.statistics.api.datasource.DataSourceDto;
import de.eshg.statistics.api.evaluationtemplate.AnalysisInfo;
import de.eshg.statistics.api.evaluationtemplate.BaseDataAttributeWithName;
import de.eshg.statistics.api.evaluationtemplate.BusinessDataAttributeWithName;
import de.eshg.statistics.api.evaluationtemplate.DataSourceWithAttributeNames;
import de.eshg.statistics.api.evaluationtemplate.EvaluationTemplateDetailsFromRepository;
import de.eshg.statistics.api.evaluationtemplate.EvaluationTemplateFromRepository;
import de.eshg.statistics.api.evaluationtemplate.GetEvaluationTemplatesFromRepositoryResponse;
import de.eshg.statistics.api.filter.BooleanFilterParameterDto;
import de.eshg.statistics.api.filter.DecimalRangeFilterParameterDto;
import de.eshg.statistics.api.filter.DecimalValueFilterParameterDto;
import de.eshg.statistics.api.filter.IntegerRangeFilterParameterDto;
import de.eshg.statistics.api.filter.IntegerValueFilterParameterDto;
import de.eshg.statistics.api.filter.NullFilterParameterDto;
import de.eshg.statistics.api.filter.NumericComparisonDto;
import de.eshg.statistics.api.filter.TableColumnFilterParameter;
import de.eshg.statistics.api.filter.TextFilterParameterDto;
import de.eshg.statistics.api.filter.ValueOptionFilterParameterDto;
import de.eshg.statistics.centralrepository.dto.RepoAttributeSelection;
import de.eshg.statistics.centralrepository.dto.chartconfiguration.RepoBarChart;
import de.eshg.statistics.centralrepository.dto.chartconfiguration.RepoChartConfiguration;
import de.eshg.statistics.centralrepository.dto.chartconfiguration.RepoChoroplethMap;
import de.eshg.statistics.centralrepository.dto.chartconfiguration.RepoHistogramChart;
import de.eshg.statistics.centralrepository.dto.chartconfiguration.RepoLineChart;
import de.eshg.statistics.centralrepository.dto.chartconfiguration.RepoPieChart;
import de.eshg.statistics.centralrepository.dto.chartconfiguration.RepoScatterChart;
import de.eshg.statistics.centralrepository.dto.evaluationtemplate.RepoAnalysisTemplate;
import de.eshg.statistics.centralrepository.dto.evaluationtemplate.RepoBaseDataAttribute;
import de.eshg.statistics.centralrepository.dto.evaluationtemplate.RepoBusinessDataAttribute;
import de.eshg.statistics.centralrepository.dto.evaluationtemplate.RepoDataSource;
import de.eshg.statistics.centralrepository.dto.evaluationtemplate.RepoDiagramTemplate;
import de.eshg.statistics.centralrepository.dto.evaluationtemplate.RepoEvaluationTemplate;
import de.eshg.statistics.centralrepository.dto.filter.RepoBooleanFilter;
import de.eshg.statistics.centralrepository.dto.filter.RepoDecimalRangeFilter;
import de.eshg.statistics.centralrepository.dto.filter.RepoDecimalValueFilter;
import de.eshg.statistics.centralrepository.dto.filter.RepoFilter;
import de.eshg.statistics.centralrepository.dto.filter.RepoIntegerRangeFilter;
import de.eshg.statistics.centralrepository.dto.filter.RepoIntegerValueFilter;
import de.eshg.statistics.centralrepository.dto.filter.RepoNullFilter;
import de.eshg.statistics.centralrepository.dto.filter.RepoNumericComparison;
import de.eshg.statistics.centralrepository.dto.filter.RepoTextFilter;
import de.eshg.statistics.centralrepository.dto.filter.RepoValueOptionFilter;
import de.eshg.statistics.datatransfer.AnalysisTemplateData;
import de.eshg.statistics.datatransfer.DiagramTemplateData;
import de.eshg.statistics.datatransfer.EvaluationTemplateData;
import de.eshg.statistics.mapper.EvaluationMapper;
import de.eshg.statistics.persistence.entity.AbstractFilterParameter;
import de.eshg.statistics.persistence.entity.AttributeSelection;
import de.eshg.statistics.persistence.entity.ChartConfiguration;
import de.eshg.statistics.persistence.entity.chart.BarChartConfiguration;
import de.eshg.statistics.persistence.entity.chart.ChoroplethMapConfiguration;
import de.eshg.statistics.persistence.entity.chart.HistogramChartConfiguration;
import de.eshg.statistics.persistence.entity.chart.LineChartConfiguration;
import de.eshg.statistics.persistence.entity.chart.PieChartConfiguration;
import de.eshg.statistics.persistence.entity.chart.ScatterChartConfiguration;
import de.eshg.statistics.persistence.entity.evaluationtemplate.AnalysisTemplate;
import de.eshg.statistics.persistence.entity.evaluationtemplate.DataAttribute;
import de.eshg.statistics.persistence.entity.evaluationtemplate.DataSource;
import de.eshg.statistics.persistence.entity.evaluationtemplate.DiagramTemplate;
import de.eshg.statistics.persistence.entity.evaluationtemplate.EvaluationTemplate;
import de.eshg.statistics.persistence.entity.filter.BooleanFilterParameter;
import de.eshg.statistics.persistence.entity.filter.DecimalRangeFilterParameter;
import de.eshg.statistics.persistence.entity.filter.DecimalValueFilterParameter;
import de.eshg.statistics.persistence.entity.filter.IntegerRangeFilterParameter;
import de.eshg.statistics.persistence.entity.filter.IntegerValueFilterParameter;
import de.eshg.statistics.persistence.entity.filter.NullFilterParameter;
import de.eshg.statistics.persistence.entity.filter.NumericComparison;
import de.eshg.statistics.persistence.entity.filter.TextFilterParameter;
import de.eshg.statistics.persistence.entity.filter.ValueOptionFilterParameter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Objects;
import java.util.stream.Collectors;
import org.hibernate.Hibernate;

public class RepoMapper {
  private RepoMapper() {}

  public static MetadataRequestDto mapToMetaData(
      RepoEvaluationTemplate evaluationTemplate, String changelog, String contact) {
    return new MetadataRequestDto(
        evaluationTemplate.dataSources().stream()
            .map(RepoDataSource::dataSourceName)
            .sorted()
            .collect(Collectors.joining(",")),
        evaluationTemplate.name(),
        Collections.emptyList(),
        evaluationTemplate.description(),
        changelog,
        contact);
  }

  public static GetEvaluationTemplatesFromRepositoryResponse mapFromMetaData(
      MetadataListResponseDto metadataListResponseDto) {
    return new GetEvaluationTemplatesFromRepositoryResponse(
        metadataListResponseDto.items().stream().map(RepoMapper::mapFromMetaData).toList());
  }

  public static EvaluationTemplateFromRepository mapFromMetaData(
      MetadataResponseDto metadataResponseDto) {
    return new EvaluationTemplateFromRepository(
        new RepositoryMetaInfo(
            metadataResponseDto.id(),
            metadataResponseDto.version(),
            metadataResponseDto.name(),
            metadataResponseDto.description(),
            metadataResponseDto.changeLog(),
            metadataResponseDto.contact(),
            metadataResponseDto.createdBy(),
            metadataResponseDto.createdAt()),
        metadataResponseDto.category());
  }

  public static RepoEvaluationTemplate mapToRepo(
      EvaluationTemplate evaluationTemplate, String name, String description) {
    return new RepoEvaluationTemplate(
        evaluationTemplate.getExternalId(),
        name,
        description,
        evaluationTemplate.getDataSources().stream().map(RepoMapper::mapToRepo).toList(),
        evaluationTemplate.getAnalysisTemplates().stream().map(RepoMapper::mapToRepo).toList());
  }

  private static RepoDataSource mapToRepo(DataSource dataSource) {
    return new RepoDataSource(
        dataSource.getBusinessModuleName(),
        dataSource.getExternalDataSourceId(),
        dataSource.getDataSourceName(),
        dataSource.getAttributes().stream().map(RepoMapper::mapToRepo).toList());
  }

  private static RepoBusinessDataAttribute mapToRepo(DataAttribute attribute) {
    return new RepoBusinessDataAttribute(
        attribute.getCode(),
        attribute.getName(),
        attribute.getBaseAttributes().stream()
            .map(
                baseDataAttribute ->
                    new RepoBaseDataAttribute(
                        baseDataAttribute.getCode(), baseDataAttribute.getName()))
            .toList());
  }

  private static RepoAnalysisTemplate mapToRepo(AnalysisTemplate analysisTemplate) {
    return new RepoAnalysisTemplate(
        analysisTemplate.getName(),
        mapToRepo(
            Hibernate.unproxy(analysisTemplate.getChartConfiguration(), ChartConfiguration.class)),
        analysisTemplate.getDiagramTemplates().stream().map(RepoMapper::mapToRepo).toList());
  }

  private static RepoChartConfiguration mapToRepo(ChartConfiguration chartConfiguration) {
    return switch (chartConfiguration) {
      case BarChartConfiguration barChartConfiguration -> mapToRepoBarChart(barChartConfiguration);
      case ChoroplethMapConfiguration choroplethMapConfiguration ->
          mapToRepoChoroplethMap(choroplethMapConfiguration);
      case HistogramChartConfiguration histogramChartConfiguration ->
          mapToRepoHistogramChart(histogramChartConfiguration);
      case LineChartConfiguration lineChartConfiguration ->
          mapToRepoLineChart(lineChartConfiguration);
      case PieChartConfiguration pieChartConfiguration -> mapToRepoPieChart(pieChartConfiguration);
      case ScatterChartConfiguration scatterChartConfiguration ->
          mapToRepoScatterChart(scatterChartConfiguration);
      default -> throw new IllegalStateException("Unexpected value: " + chartConfiguration);
    };
  }

  private static RepoBarChart mapToRepoBarChart(BarChartConfiguration barChartConfiguration) {
    return new RepoBarChart(
        mapToRepo(barChartConfiguration.getPrimaryAttributeSelection(), true),
        mapToRepo(barChartConfiguration.getSecondaryAttributeSelection(), false),
        getEnumString(barChartConfiguration.getScaling()),
        getEnumString(barChartConfiguration.getGrouping()),
        getEnumString(barChartConfiguration.getOrientation()));
  }

  private static RepoChoroplethMap mapToRepoChoroplethMap(
      ChoroplethMapConfiguration choroplethMapConfiguration) {
    return new RepoChoroplethMap(
        mapToRepo(choroplethMapConfiguration.getPrimaryAttributeSelection(), true),
        mapToRepo(choroplethMapConfiguration.getSecondaryAttributeSelection(), false),
        getEnumString(choroplethMapConfiguration.getCalculation()),
        choroplethMapConfiguration.getGeoJson(),
        choroplethMapConfiguration.getColorScheme());
  }

  private static RepoHistogramChart mapToRepoHistogramChart(
      HistogramChartConfiguration histogramChartConfiguration) {
    return new RepoHistogramChart(
        mapToRepo(histogramChartConfiguration.getPrimaryAttributeSelection(), true),
        mapToRepo(histogramChartConfiguration.getSecondaryAttributeSelection(), false),
        getEnumString(histogramChartConfiguration.getScaling()),
        getEnumString(histogramChartConfiguration.getGrouping()),
        getEnumString(histogramChartConfiguration.getBinningMode()),
        histogramChartConfiguration.getNumberOfBins());
  }

  private static RepoLineChart mapToRepoLineChart(LineChartConfiguration lineChartConfiguration) {
    return new RepoLineChart(
        mapToRepo(lineChartConfiguration.getXAttributeSelection(), true),
        mapToRepo(lineChartConfiguration.getYAttributeSelection(), true),
        mapToRepo(lineChartConfiguration.getSecondaryAttributeSelection(), false),
        getEnumString(lineChartConfiguration.getRange()));
  }

  private static RepoPieChart mapToRepoPieChart(PieChartConfiguration pieChartConfiguration) {
    return new RepoPieChart(mapToRepo(pieChartConfiguration.getAttributeSelection(), true));
  }

  private static RepoScatterChart mapToRepoScatterChart(
      ScatterChartConfiguration scatterChartConfiguration) {
    return new RepoScatterChart(
        mapToRepo(scatterChartConfiguration.getXAttributeSelection(), true),
        mapToRepo(scatterChartConfiguration.getYAttributeSelection(), true),
        mapToRepo(scatterChartConfiguration.getSecondaryAttributeSelection(), false),
        getEnumString(scatterChartConfiguration.getRange()),
        scatterChartConfiguration.showTrendLine());
  }

  private static RepoDiagramTemplate mapToRepo(DiagramTemplate diagramTemplate) {
    return new RepoDiagramTemplate(
        diagramTemplate.getTitle(),
        diagramTemplate.getDescription(),
        diagramTemplate.getFilters().stream().map(RepoMapper::mapToRepo).toList());
  }

  private static RepoFilter mapToRepo(AbstractFilterParameter abstractFilterParameter) {
    RepoAttributeSelection attribute =
        mapToRepo(abstractFilterParameter.getAttributeSelection(), true);
    return switch (abstractFilterParameter) {
      case BooleanFilterParameter filterParameter ->
          new RepoBooleanFilter(
              attribute,
              filterParameter.isSearchForTrue(),
              filterParameter.isSearchForFalse(),
              filterParameter.isSearchForNull());
      case DecimalRangeFilterParameter filterParameter ->
          new RepoDecimalRangeFilter(
              attribute,
              filterParameter.getMinValueInclusive(),
              filterParameter.getMaxValueInclusive(),
              filterParameter.isWithNullValues());
      case DecimalValueFilterParameter filterParameter ->
          new RepoDecimalValueFilter(
              attribute,
              filterParameter.getValue(),
              mapToRepoNumericComparison(filterParameter.getNumericComparison()),
              filterParameter.isWithNullValues());
      case IntegerRangeFilterParameter filterParameter ->
          new RepoIntegerRangeFilter(
              attribute,
              filterParameter.getMinValueInclusive(),
              filterParameter.getMaxValueInclusive(),
              filterParameter.isWithNullValues());
      case IntegerValueFilterParameter filterParameter ->
          new RepoIntegerValueFilter(
              attribute,
              filterParameter.getValue(),
              mapToRepoNumericComparison(filterParameter.getNumericComparison()),
              filterParameter.isWithNullValues());
      case NullFilterParameter ignored -> new RepoNullFilter(attribute);
      case TextFilterParameter filterParameter ->
          new RepoTextFilter(attribute, filterParameter.getValue());
      case ValueOptionFilterParameter filterParameter ->
          new RepoValueOptionFilter(
              attribute,
              new ArrayList<>(filterParameter.getSearchValues()),
              filterParameter.isSearchForNull());
      default -> throw new IllegalStateException("Unexpected value: " + abstractFilterParameter);
    };
  }

  private static String getEnumString(Enum<?> enumValue) {
    return enumValue == null ? null : enumValue.toString();
  }

  private static RepoNumericComparison mapToRepoNumericComparison(
      NumericComparison numericComparison) {
    return RepoNumericComparison.valueOf(numericComparison.name());
  }

  private static RepoAttributeSelection mapToRepo(
      AttributeSelection attributeSelection, boolean mandatory) {
    if (mandatory) {
      Objects.requireNonNull(attributeSelection);
    }
    if (attributeSelection == null) {
      return null;
    }
    return new RepoAttributeSelection(
        attributeSelection.getBusinessModuleName(),
        attributeSelection.getDataSourceId(),
        attributeSelection.getBusinessModuleAttributeCode(),
        attributeSelection.getBaseModuleAttributeCode());
  }

  public static EvaluationTemplateDetailsFromRepository mapToDetails(
      MetadataResponseDto metadataResponseDto, RepoEvaluationTemplate repoEvaluationTemplate) {
    return new EvaluationTemplateDetailsFromRepository(
        new RepositoryMetaInfo(
            metadataResponseDto.id(),
            metadataResponseDto.version(),
            repoEvaluationTemplate.name(),
            repoEvaluationTemplate.description(),
            metadataResponseDto.changeLog(),
            metadataResponseDto.contact(),
            metadataResponseDto.createdBy(),
            metadataResponseDto.createdAt()),
        repoEvaluationTemplate.dataSources().stream()
            .map(RepoMapper::mapToDataSourceWithAttributeNames)
            .toList(),
        repoEvaluationTemplate.analyses().stream().map(RepoMapper::mapToAnalysisInfo).toList());
  }

  private static DataSourceWithAttributeNames mapToDataSourceWithAttributeNames(
      RepoDataSource dataSource) {
    return new DataSourceWithAttributeNames(
        dataSource.businessModuleName(),
        dataSource.dataSourceId(),
        dataSource.dataSourceName(),
        dataSource.dataAttributes().stream()
            .map(RepoMapper::mapToBusinessDataAttributeWithName)
            .toList());
  }

  private static BusinessDataAttributeWithName mapToBusinessDataAttributeWithName(
      RepoBusinessDataAttribute attribute) {
    return new BusinessDataAttributeWithName(
        attribute.code(),
        attribute.name(),
        attribute.baseDataAttributes().stream()
            .map(
                baseAttribute ->
                    new BaseDataAttributeWithName(
                        baseAttribute.code(),
                        EvaluationMapper.getAttributeDisplayName(
                            attribute.name(), baseAttribute.name())))
            .toList());
  }

  private static AnalysisInfo mapToAnalysisInfo(RepoAnalysisTemplate analysis) {
    return new AnalysisInfo(
        analysis.name(),
        analysis.diagrams().stream().map(RepoDiagramTemplate::title).toList(),
        analysis.chartConfiguration().type());
  }

  public static EvaluationTemplateData mapToEvaluationTemplateData(
      RepoEvaluationTemplate repoEvaluationTemplate) {
    return new EvaluationTemplateData(
        repoEvaluationTemplate.dataSources().stream().map(RepoMapper::mapToDataSourceDto).toList(),
        repoEvaluationTemplate.analyses().stream()
            .map(RepoMapper::mapToAnalysisTemplateData)
            .toList());
  }

  private static DataSourceDto mapToDataSourceDto(RepoDataSource repoDataSource) {
    return new DataSourceDto(
        repoDataSource.businessModuleName(),
        repoDataSource.dataSourceId(),
        repoDataSource.dataAttributes().stream()
            .map(RepoMapper::mapToBusinessDataAttribute)
            .toList());
  }

  private static BusinessDataAttribute mapToBusinessDataAttribute(
      RepoBusinessDataAttribute repoBusinessDataAttribute) {
    return new BusinessDataAttribute(
        repoBusinessDataAttribute.code(),
        repoBusinessDataAttribute.baseDataAttributes().stream()
            .map(RepoBaseDataAttribute::code)
            .toList());
  }

  private static AnalysisTemplateData mapToAnalysisTemplateData(
      RepoAnalysisTemplate repoAnalysisTemplate) {
    return new AnalysisTemplateData(
        repoAnalysisTemplate.name(),
        mapToChartConfigurationDto(repoAnalysisTemplate.chartConfiguration()),
        repoAnalysisTemplate.diagrams().stream()
            .map(RepoMapper::mapToDiagramTemplateData)
            .toList());
  }

  private static ChartConfigurationDto mapToChartConfigurationDto(
      RepoChartConfiguration repoChartConfiguration) {
    return switch (repoChartConfiguration) {
      case RepoBarChart repoBarChart -> mapToBarChartConfiguration(repoBarChart);
      case RepoChoroplethMap repoChoroplethMap ->
          mapToChoroplethMapConfiguration(repoChoroplethMap);
      case RepoHistogramChart repoHistogramChart ->
          mapToHistogramChartConfiguration(repoHistogramChart);
      case RepoLineChart repoLineChart -> mapToLineChartConfiguration(repoLineChart);
      case RepoPieChart repoPieChart -> mapToPieChartConfiguration(repoPieChart);
      case RepoScatterChart repoScatterChart -> mapToScatterChartConfiguration(repoScatterChart);
    };
  }

  private static BarChartConfigurationDto mapToBarChartConfiguration(RepoBarChart repoBarChart) {
    return new BarChartConfigurationDto(
        mapToAttributeSelection(repoBarChart.primaryAttribute(), true),
        mapToAttributeSelection(repoBarChart.secondaryAttribute(), false),
        mapToScaling(repoBarChart.scaling()),
        mapToGrouping(repoBarChart.grouping()),
        mapToOrientation(repoBarChart.orientation()));
  }

  private static ChoroplethMapConfigurationDto mapToChoroplethMapConfiguration(
      RepoChoroplethMap repoChoroplethMap) {
    return new ChoroplethMapConfigurationDto(
        mapToAttributeSelection(repoChoroplethMap.primaryAttribute(), true),
        mapToAttributeSelection(repoChoroplethMap.secondaryAttribute(), false),
        mapToCalculation(repoChoroplethMap.calculation()),
        repoChoroplethMap.geoJson(),
        repoChoroplethMap.colorScheme());
  }

  private static HistogramChartConfigurationDto mapToHistogramChartConfiguration(
      RepoHistogramChart repoHistogramChart) {
    return new HistogramChartConfigurationDto(
        mapToAttributeSelection(repoHistogramChart.primaryAttribute(), true),
        mapToAttributeSelection(repoHistogramChart.secondaryAttribute(), false),
        mapToScaling(repoHistogramChart.scaling()),
        mapToGrouping(repoHistogramChart.grouping()),
        mapToBinning(repoHistogramChart.binningMode()),
        repoHistogramChart.numberOfBins());
  }

  private static LineChartConfigurationDto mapToLineChartConfiguration(
      RepoLineChart repoLineChart) {
    return new LineChartConfigurationDto(
        mapToAttributeSelection(repoLineChart.xAttribute(), true),
        mapToAttributeSelection(repoLineChart.yAttribute(), true),
        mapToAttributeSelection(repoLineChart.secondaryAttribute(), false),
        mapToRange(repoLineChart.range()));
  }

  private static PieChartConfigurationDto mapToPieChartConfiguration(RepoPieChart repoPieChart) {
    return new PieChartConfigurationDto(mapToAttributeSelection(repoPieChart.attribute(), true));
  }

  private static ScatterChartConfigurationDto mapToScatterChartConfiguration(
      RepoScatterChart repoScatterChart) {
    return new ScatterChartConfigurationDto(
        mapToAttributeSelection(repoScatterChart.xAttribute(), true),
        mapToAttributeSelection(repoScatterChart.yAttribute(), true),
        mapToAttributeSelection(repoScatterChart.secondaryAttribute(), false),
        mapToRange(repoScatterChart.range()),
        repoScatterChart.trendLine());
  }

  private static ScalingDto mapToScaling(String scaling) {
    return mapToEnum(scaling, ScalingDto.values(), ScalingDto.ABSOLUTE);
  }

  private static GroupingDto mapToGrouping(String grouping) {
    return mapToEnum(grouping, GroupingDto.values(), GroupingDto.GROUPED);
  }

  private static OrientationDto mapToOrientation(String orientation) {
    return Objects.requireNonNull(
        mapToEnum(orientation, OrientationDto.values(), OrientationDto.VERTICAL));
  }

  private static CalculationDto mapToCalculation(String calculation) {
    return mapToEnum(calculation, CalculationDto.values(), CalculationDto.MEAN);
  }

  private static BinningModeDto mapToBinning(String binning) {
    return Objects.requireNonNull(mapToEnum(binning, BinningModeDto.values(), BinningModeDto.AUTO));
  }

  private static RangeDto mapToRange(String range) {
    return Objects.requireNonNull(mapToEnum(range, RangeDto.values(), RangeDto.ORIGIN));
  }

  private static <T> T mapToEnum(String value, T[] enumValues, T defaultValue) {
    if (value == null) {
      return null;
    }
    return Arrays.stream(enumValues)
        .filter(enumValue -> value.equals(enumValue.toString()))
        .findFirst()
        .orElse(defaultValue);
  }

  private static DiagramTemplateData mapToDiagramTemplateData(
      RepoDiagramTemplate repoDiagramTemplate) {
    return new DiagramTemplateData(
        repoDiagramTemplate.title(),
        repoDiagramTemplate.description(),
        repoDiagramTemplate.filters().stream().map(RepoMapper::mapToTableColumnFilter).toList());
  }

  private static TableColumnFilterParameter mapToTableColumnFilter(RepoFilter filter) {
    return switch (filter) {
      case RepoBooleanFilter repoBooleanFilter -> mapToBooleanFilterParameter(repoBooleanFilter);
      case RepoDecimalRangeFilter repoDecimalRangeFilter ->
          mapToDecimalRangeFilterParameter(repoDecimalRangeFilter);
      case RepoDecimalValueFilter repoDecimalValueFilter ->
          mapToDecimalValueFilterParameter(repoDecimalValueFilter);
      case RepoIntegerRangeFilter repoIntegerRangeFilter ->
          mapToIntegerRangeFilterParameter(repoIntegerRangeFilter);
      case RepoIntegerValueFilter repoIntegerValueFilter ->
          mapToIntegerValueFilterParameter(repoIntegerValueFilter);
      case RepoNullFilter repoNullFilter -> mapToNullFilterParameter(repoNullFilter);
      case RepoTextFilter repoTextFilter -> mapToTextFilterParameter(repoTextFilter);
      case RepoValueOptionFilter repoValueOptionFilter ->
          mapToValueOptionFilterParameter(repoValueOptionFilter);
    };
  }

  private static BooleanFilterParameterDto mapToBooleanFilterParameter(
      RepoBooleanFilter repoBooleanFilter) {
    return new BooleanFilterParameterDto(
        mapToAttributeSelection(repoBooleanFilter.attribute(), true),
        repoBooleanFilter.searchForTrue(),
        repoBooleanFilter.searchForFalse(),
        repoBooleanFilter.searchForNull());
  }

  private static DecimalRangeFilterParameterDto mapToDecimalRangeFilterParameter(
      RepoDecimalRangeFilter repoDecimalRangeFilter) {
    return new DecimalRangeFilterParameterDto(
        mapToAttributeSelection(repoDecimalRangeFilter.attribute(), true),
        repoDecimalRangeFilter.minValueInclusive(),
        repoDecimalRangeFilter.maxValueInclusive(),
        repoDecimalRangeFilter.withNullValues());
  }

  private static DecimalValueFilterParameterDto mapToDecimalValueFilterParameter(
      RepoDecimalValueFilter repoDecimalValueFilter) {
    return new DecimalValueFilterParameterDto(
        mapToAttributeSelection(repoDecimalValueFilter.attribute(), true),
        repoDecimalValueFilter.value(),
        mapToNumericComparison(repoDecimalValueFilter.numericComparison()),
        repoDecimalValueFilter.withNullValues());
  }

  private static IntegerRangeFilterParameterDto mapToIntegerRangeFilterParameter(
      RepoIntegerRangeFilter repoIntegerRangeFilter) {
    return new IntegerRangeFilterParameterDto(
        mapToAttributeSelection(repoIntegerRangeFilter.attribute(), true),
        repoIntegerRangeFilter.minValueInclusive(),
        repoIntegerRangeFilter.maxValueInclusive(),
        repoIntegerRangeFilter.withNullValues());
  }

  private static IntegerValueFilterParameterDto mapToIntegerValueFilterParameter(
      RepoIntegerValueFilter repoIntegerValueFilter) {
    return new IntegerValueFilterParameterDto(
        mapToAttributeSelection(repoIntegerValueFilter.attribute(), true),
        repoIntegerValueFilter.value(),
        mapToNumericComparison(repoIntegerValueFilter.numericComparison()),
        repoIntegerValueFilter.withNullValues());
  }

  private static NullFilterParameterDto mapToNullFilterParameter(RepoNullFilter repoNullFilter) {
    return new NullFilterParameterDto(mapToAttributeSelection(repoNullFilter.attribute(), true));
  }

  private static TextFilterParameterDto mapToTextFilterParameter(RepoTextFilter repoTextFilter) {
    return new TextFilterParameterDto(
        mapToAttributeSelection(repoTextFilter.attribute(), true), repoTextFilter.text());
  }

  private static ValueOptionFilterParameterDto mapToValueOptionFilterParameter(
      RepoValueOptionFilter repoValueOptionFilter) {
    return new ValueOptionFilterParameterDto(
        mapToAttributeSelection(repoValueOptionFilter.attribute(), true),
        repoValueOptionFilter.searchValues(),
        repoValueOptionFilter.searchForNull());
  }

  private static NumericComparisonDto mapToNumericComparison(
      RepoNumericComparison numericComparison) {
    return NumericComparisonDto.valueOf(numericComparison.name());
  }

  private static AttributeSelectionDto mapToAttributeSelection(
      RepoAttributeSelection repoAttributeSelection, boolean mandatory) {
    if (mandatory) {
      Objects.requireNonNull(repoAttributeSelection);
    }
    if (repoAttributeSelection == null) {
      return null;
    }
    return new AttributeSelectionDto(
        repoAttributeSelection.businessModuleName(),
        repoAttributeSelection.dataSourceId(),
        repoAttributeSelection.businessModuleAttributeCode(),
        repoAttributeSelection.baseModuleAttributeCode());
  }
}
