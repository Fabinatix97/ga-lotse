/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.testhelper;

import de.eshg.statistics.EvaluationTemplateController;
import de.eshg.statistics.FilterTemplateController;
import de.eshg.statistics.aggregation.AnalysisController;
import de.eshg.statistics.aggregation.EvaluationController;
import de.eshg.statistics.aggregation.ReportSeriesController;
import de.eshg.statistics.api.AddAnalysisRequest;
import de.eshg.statistics.api.AddDiagramRequest;
import de.eshg.statistics.api.AnalysisDto;
import de.eshg.statistics.api.AttributeSelectionDto;
import de.eshg.statistics.api.GetDetailPageInformationResponse;
import de.eshg.statistics.api.TableColumnHeader;
import de.eshg.statistics.api.attributes.AbstractTableColumnHeaderAttribute;
import de.eshg.statistics.api.attributes.BooleanAttribute;
import de.eshg.statistics.api.attributes.CentralFileIdAttribute;
import de.eshg.statistics.api.attributes.DecimalAttribute;
import de.eshg.statistics.api.attributes.IntegerAttribute;
import de.eshg.statistics.api.attributes.ValueWithOptionsAttribute;
import de.eshg.statistics.api.chart.BarChartConfigurationDto;
import de.eshg.statistics.api.chart.BinningModeDto;
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
import de.eshg.statistics.api.evaluation.AddEvaluationWithDataSourcesRequest;
import de.eshg.statistics.api.evaluation.GetEvaluationsRequest;
import de.eshg.statistics.api.evaluationtemplate.AddEvaluationTemplateFromEvaluationRequest;
import de.eshg.statistics.api.filter.BooleanFilterParameterDto;
import de.eshg.statistics.api.filter.DecimalRangeFilterParameterDto;
import de.eshg.statistics.api.filter.DecimalValueFilterParameterDto;
import de.eshg.statistics.api.filter.IntegerRangeFilterParameterDto;
import de.eshg.statistics.api.filter.IntegerValueFilterParameterDto;
import de.eshg.statistics.api.filter.NumericComparisonDto;
import de.eshg.statistics.api.filter.TableColumnFilterParameter;
import de.eshg.statistics.api.filter.ValueOptionFilterParameterDto;
import de.eshg.statistics.api.filtertemplate.AddFilterTemplateRequest;
import de.eshg.statistics.api.report.AddAutoReportSeriesRequest;
import de.eshg.statistics.api.report.AddManualReportSeriesRequest;
import de.eshg.statistics.api.report.FrequencyDto;
import de.eshg.statistics.api.report.ReportingPeriodDto;
import de.eshg.testhelper.ConditionalOnTestHelperEnabled;
import de.eshg.testhelper.TestHelperClock;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import org.springframework.stereotype.Component;

@Component
@ConditionalOnTestHelperEnabled
public class StatisticsPopulator {
  private static final String BOOLEAN_ATTRIBUTE = "boolean";
  private static final String FIRST_DECIMAL_ATTRIBUTE = "first double";
  private static final String SECOND_DECIMAL_ATTRIBUTE = "second double";
  private static final String FIRST_INTEGER_ATTRIBUTE = "first int";
  private static final String SECOND_INTEGER_ATTRIBUTE = "second int";
  private static final String FIRST_OPTION_ATTRIBUTE = "first option";
  private static final String SECOND_OPTION_ATTRIBUTE = "second option";

  private final EvaluationController evaluationController;
  private final AnalysisController analysisController;
  private final ReportSeriesController reportSeriesController;
  private final EvaluationTemplateController evaluationTemplateController;
  private final FilterTemplateController filterTemplateController;
  private final Optional<TestHelperClock> optionalTestHelperClock;

  public StatisticsPopulator(
      EvaluationController evaluationController,
      AnalysisController analysisController,
      ReportSeriesController reportSeriesController,
      EvaluationTemplateController evaluationTemplateController,
      FilterTemplateController filterTemplateController,
      Optional<TestHelperClock> optionalTestHelperClock) {
    this.evaluationController = evaluationController;
    this.analysisController = analysisController;
    this.reportSeriesController = reportSeriesController;
    this.evaluationTemplateController = evaluationTemplateController;
    this.filterTemplateController = filterTemplateController;
    this.optionalTestHelperClock = optionalTestHelperClock;
  }

  public UUID addEvaluationSchoolEntry(boolean anonymized) {
    AddEvaluationWithDataSourcesRequest request =
        new AddEvaluationWithDataSourcesRequest(
            "2023 Auswertung ESU",
            Instant.parse("2022-12-31T23:00:00.000Z"),
            Instant.parse("2023-12-31T23:00:00.000Z"),
            List.of(
                new DataSourceDto(
                    "SCHOOL_ENTRY",
                    UUID.fromString("5bee6747-9cbc-423c-a192-ad978d45970c"),
                    List.of(
                        new BusinessDataAttribute("PROCEDURE_ID", null),
                        new BusinessDataAttribute(
                            "CHILD_CENTRAL_FILE_ID",
                            List.of("Geburtsmonat", "Geburtsjahr", "Geschl", "ORT")),
                        new BusinessDataAttribute("U4E", null),
                        new BusinessDataAttribute("KIND", null),
                        new BusinessDataAttribute("GROE", null),
                        new BusinessDataAttribute("GEWI", null),
                        new BusinessDataAttribute("VISCH", null),
                        new BusinessDataAttribute("MENG", null),
                        new BusinessDataAttribute("MENG1", null),
                        new BusinessDataAttribute("UntersDat", null)))),
            anonymized);
    return evaluationController.addEvaluation(request);
  }

  public void createEntitiesForEvaluation(UUID evaluationId) {
    GetDetailPageInformationResponse detailPageInformation =
        evaluationController.getDetailPageInformation(evaluationId);
    String businessModule = detailPageInformation.tableColumnHeaders().getFirst().businessModule();
    UUID dataSourceId = detailPageInformation.tableColumnHeaders().getFirst().dataSourceId();
    Map<String, AbstractTableColumnHeaderAttribute> attributeMap =
        getAttributeMap(detailPageInformation.tableColumnHeaders());

    addFilterTemplate(
        evaluationId,
        evaluationController
            .getEvaluations(new GetEvaluationsRequest(null, null, null, null, null))
            .totalNumberOfElements(),
        attributeMap,
        businessModule,
        dataSourceId);
    addAnalysesWithDiagrams(evaluationId, attributeMap, businessModule, dataSourceId);

    evaluationTemplateController.addEvaluationTemplate(
        new AddEvaluationTemplateFromEvaluationRequest(
            "%s Template".formatted(detailPageInformation.evaluationInfo().name()),
            "populated template",
            evaluationId));

    optionalTestHelperClock.ifPresent(
        testHelperClock -> testHelperClock.changeToDate(LocalDate.of(2023, 12, 1)));
    reportSeriesController.addReportSeries(
        new AddAutoReportSeriesRequest(
            evaluationId,
            "auto report",
            "automated report",
            1,
            FrequencyDto.PER_MONTH,
            ReportingPeriodDto.MONTH));
    optionalTestHelperClock.ifPresent(
        testHelperClock -> testHelperClock.changeToDate(LocalDate.of(2024, 1, 1)));
    reportSeriesController.addReportSeries(
        new AddManualReportSeriesRequest(
            evaluationId,
            "manual report",
            "execute directly",
            Instant.parse("2024-01-31T23:00:00.000Z"),
            Instant.parse("2024-06-30T23:00:00.000Z")));
  }

  public UUID addEvaluationInspection(boolean anonymized) {
    AddEvaluationWithDataSourcesRequest request =
        new AddEvaluationWithDataSourcesRequest(
            "Auswertung Begehung",
            Instant.parse("2024-01-31T23:00:00.000Z"),
            Instant.parse("2024-06-30T23:00:00.000Z"),
            List.of(
                new DataSourceDto(
                    "INSPECTION",
                    UUID.fromString("f0ac7a7b-dfa7-4a1a-9409-a7588da26531"),
                    List.of(
                        new BusinessDataAttribute("PROCEDURE_ID", null),
                        new BusinessDataAttribute(
                            "FACILITY_CENTRAL_FILE_ID", List.of("LAND", "ORT", "PLZ", "BEZ")),
                        new BusinessDataAttribute("YEAR_OF_INSPECTION", null),
                        new BusinessDataAttribute("OBJECT_TYPE", null),
                        new BusinessDataAttribute("RESULT", null),
                        new BusinessDataAttribute("NUMBER_OF_INCIDENTS", null),
                        new BusinessDataAttribute("DURATION", null)))),
            anonymized);
    return evaluationController.addEvaluation(request);
  }

  private Map<String, AbstractTableColumnHeaderAttribute> getAttributeMap(
      List<TableColumnHeader> tableColumnHeaders) {
    Map<String, AbstractTableColumnHeaderAttribute> attributeMap = new HashMap<>();
    for (TableColumnHeader header : tableColumnHeaders) {
      if (header.attribute() instanceof BooleanAttribute
          && attributeMap.get(BOOLEAN_ATTRIBUTE) == null) {
        attributeMap.put(BOOLEAN_ATTRIBUTE, header.attribute());
      }
      if (header.attribute() instanceof DecimalAttribute) {
        addToAttributeMap(
            attributeMap, header.attribute(), FIRST_DECIMAL_ATTRIBUTE, SECOND_DECIMAL_ATTRIBUTE);
      }
      if (header.attribute() instanceof IntegerAttribute) {
        addToAttributeMap(
            attributeMap, header.attribute(), FIRST_INTEGER_ATTRIBUTE, SECOND_INTEGER_ATTRIBUTE);
      }
      if (header.attribute() instanceof ValueWithOptionsAttribute) {
        addToAttributeMap(
            attributeMap, header.attribute(), FIRST_OPTION_ATTRIBUTE, SECOND_OPTION_ATTRIBUTE);
      }
    }
    return attributeMap;
  }

  private void addToAttributeMap(
      Map<String, AbstractTableColumnHeaderAttribute> attributeMap,
      AbstractTableColumnHeaderAttribute attribute,
      String firstKey,
      String secondKey) {
    if (attributeMap.get(firstKey) == null) {
      attributeMap.put(firstKey, attribute);
    } else {
      attributeMap.computeIfAbsent(secondKey, k -> attribute);
    }
  }

  private void addFilterTemplate(
      UUID evaluationId,
      long numberOfEvaluations,
      Map<String, AbstractTableColumnHeaderAttribute> attributeMap,
      String businessModuleName,
      UUID dataSourceId) {
    if (!filterTemplateController
        .findFilterTemplatesForEvaluation(evaluationId)
        .filterTemplateIdAndNames()
        .isEmpty()) {
      return;
    }
    List<TableColumnFilterParameter> filterParameters = new ArrayList<>();
    addBooleanFilter(
        filterParameters, attributeMap.get(BOOLEAN_ATTRIBUTE), businessModuleName, dataSourceId);
    addDecimalRangeFilter(
        filterParameters,
        attributeMap.get(FIRST_DECIMAL_ATTRIBUTE),
        businessModuleName,
        dataSourceId);
    addDecimalValueFilter(
        filterParameters,
        attributeMap.get(SECOND_DECIMAL_ATTRIBUTE),
        businessModuleName,
        dataSourceId);
    addIntegerRangeFilter(
        filterParameters,
        attributeMap.get(FIRST_INTEGER_ATTRIBUTE),
        businessModuleName,
        dataSourceId);
    addIntegerValueFilter(
        filterParameters,
        attributeMap.get(SECOND_INTEGER_ATTRIBUTE),
        businessModuleName,
        dataSourceId);
    addValueOptionFilter(
        filterParameters,
        attributeMap.get(FIRST_OPTION_ATTRIBUTE),
        businessModuleName,
        dataSourceId);
    filterTemplateController.addFilterTemplate(
        new AddFilterTemplateRequest(
            "Meine Filter %s".formatted(numberOfEvaluations), filterParameters));
  }

  private void addBooleanFilter(
      List<TableColumnFilterParameter> filterParameters,
      AbstractTableColumnHeaderAttribute attribute,
      String businessModuleName,
      UUID dataSourceId) {
    if (attribute != null) {
      filterParameters.add(
          new BooleanFilterParameterDto(
              getAttributeSelectionDto(attribute, businessModuleName, dataSourceId),
              true,
              false,
              false));
    }
  }

  private static void addDecimalRangeFilter(
      List<TableColumnFilterParameter> filterParameters,
      AbstractTableColumnHeaderAttribute attribute,
      String businessModuleName,
      UUID dataSourceId) {
    if (attribute != null) {
      filterParameters.add(
          new DecimalRangeFilterParameterDto(
              getAttributeSelectionDto(attribute, businessModuleName, dataSourceId),
              BigDecimal.valueOf(3.5),
              BigDecimal.valueOf(90.2),
              true));
    }
  }

  private static void addDecimalValueFilter(
      List<TableColumnFilterParameter> filterParameters,
      AbstractTableColumnHeaderAttribute attribute,
      String businessModuleName,
      UUID dataSourceId) {
    if (attribute != null) {
      filterParameters.add(
          new DecimalValueFilterParameterDto(
              getAttributeSelectionDto(attribute, businessModuleName, dataSourceId),
              BigDecimal.valueOf(2.2),
              NumericComparisonDto.GREATER_EQUAL,
              false));
    }
  }

  private static void addIntegerRangeFilter(
      List<TableColumnFilterParameter> filterParameters,
      AbstractTableColumnHeaderAttribute attribute,
      String businessModuleName,
      UUID dataSourceId) {
    if (attribute != null) {
      filterParameters.add(
          new IntegerRangeFilterParameterDto(
              getAttributeSelectionDto(attribute, businessModuleName, dataSourceId), 2, 93, false));
    }
  }

  private static void addIntegerValueFilter(
      List<TableColumnFilterParameter> filterParameters,
      AbstractTableColumnHeaderAttribute attribute,
      String businessModuleName,
      UUID dataSourceId) {
    if (attribute != null) {
      filterParameters.add(
          new IntegerValueFilterParameterDto(
              getAttributeSelectionDto(attribute, businessModuleName, dataSourceId),
              93,
              NumericComparisonDto.LESS_THAN,
              true));
    }
  }

  private void addAnalysesWithDiagrams(
      UUID evaluationId,
      Map<String, AbstractTableColumnHeaderAttribute> attributeMap,
      String businessModule,
      UUID dataSourceId) {
    addBarDiagram(
        evaluationId, attributeMap.get(FIRST_OPTION_ATTRIBUTE), null, businessModule, dataSourceId);
    if (attributeMap.get(BOOLEAN_ATTRIBUTE) != null) {
      addBarDiagram(
          evaluationId,
          attributeMap.get(FIRST_OPTION_ATTRIBUTE),
          attributeMap.get(BOOLEAN_ATTRIBUTE),
          businessModule,
          dataSourceId);
    }

    addHistogram(
        evaluationId,
        attributeMap.get(FIRST_INTEGER_ATTRIBUTE),
        null,
        businessModule,
        dataSourceId);
    addHistogram(
        evaluationId,
        attributeMap.get(FIRST_DECIMAL_ATTRIBUTE),
        attributeMap.get(FIRST_OPTION_ATTRIBUTE),
        businessModule,
        dataSourceId);

    addPieDiagram(
        evaluationId,
        attributeMap.get(FIRST_OPTION_ATTRIBUTE),
        "value option pie",
        businessModule,
        dataSourceId,
        attributeMap.get(SECOND_OPTION_ATTRIBUTE));
    addPieDiagram(
        evaluationId,
        attributeMap.get(BOOLEAN_ATTRIBUTE),
        "boolean pie",
        businessModule,
        dataSourceId,
        null);

    addLineDiagram(
        evaluationId,
        attributeMap.get(FIRST_DECIMAL_ATTRIBUTE),
        attributeMap.get(SECOND_DECIMAL_ATTRIBUTE),
        null,
        businessModule,
        dataSourceId);
    if (attributeMap.get(SECOND_OPTION_ATTRIBUTE) != null) {
      addLineDiagram(
          evaluationId,
          attributeMap.get(FIRST_DECIMAL_ATTRIBUTE),
          attributeMap.get(SECOND_DECIMAL_ATTRIBUTE),
          attributeMap.get(SECOND_OPTION_ATTRIBUTE),
          businessModule,
          dataSourceId);
    }

    addScatterDiagram(
        evaluationId,
        attributeMap.get(FIRST_INTEGER_ATTRIBUTE),
        attributeMap.get(SECOND_DECIMAL_ATTRIBUTE),
        null,
        businessModule,
        dataSourceId);
    if (attributeMap.get(FIRST_OPTION_ATTRIBUTE) != null) {
      addScatterDiagram(
          evaluationId,
          attributeMap.get(FIRST_INTEGER_ATTRIBUTE),
          attributeMap.get(SECOND_DECIMAL_ATTRIBUTE),
          attributeMap.get(FIRST_OPTION_ATTRIBUTE),
          businessModule,
          dataSourceId);
    }
  }

  private void addBarDiagram(
      UUID evaluationId,
      AbstractTableColumnHeaderAttribute attribute,
      AbstractTableColumnHeaderAttribute secondAttribute,
      String businessModule,
      UUID dataSourceId) {
    if (attribute == null) {
      return;
    }
    String name = "bar simple";
    AttributeSelectionDto secondDto = null;
    ScalingDto scaling = null;
    GroupingDto grouping = null;
    OrientationDto orientation = OrientationDto.HORIZONTAL;
    if (secondAttribute != null) {
      name = "bar with second";
      secondDto = getAttributeSelectionDto(secondAttribute, businessModule, dataSourceId);
      scaling = ScalingDto.ABSOLUTE;
      grouping = GroupingDto.GROUPED;
      orientation = OrientationDto.VERTICAL;
    }
    AnalysisDto analysisDto =
        analysisController.addAnalysis(
            new AddAnalysisRequest(
                evaluationId,
                name,
                new BarChartConfigurationDto(
                    getAttributeSelectionDto(attribute, businessModule, dataSourceId),
                    secondDto,
                    scaling,
                    grouping,
                    orientation)));
    addDiagramWithoutFilters(analysisDto);
  }

  private void addHistogram(
      UUID evaluationId,
      AbstractTableColumnHeaderAttribute attribute,
      AbstractTableColumnHeaderAttribute secondAttribute,
      String businessModule,
      UUID dataSourceId) {
    if (attribute == null) {
      return;
    }
    String name = "histo simple";
    AttributeSelectionDto secondDto = null;
    ScalingDto scaling = null;
    GroupingDto grouping = null;
    BinningModeDto binning = BinningModeDto.AUTO;
    Integer numberBins = null;
    if (secondAttribute != null) {
      name = "histo with second";
      secondDto = getAttributeSelectionDto(secondAttribute, businessModule, dataSourceId);
      scaling = ScalingDto.RELATIVE;
      grouping = GroupingDto.STACKED;
      binning = BinningModeDto.MANUAL;
      numberBins = 4;
    }
    AnalysisDto analysisDto =
        analysisController.addAnalysis(
            new AddAnalysisRequest(
                evaluationId,
                name,
                new HistogramChartConfigurationDto(
                    getAttributeSelectionDto(attribute, businessModule, dataSourceId),
                    secondDto,
                    scaling,
                    grouping,
                    binning,
                    numberBins)));
    addDiagramWithoutFilters(analysisDto);
  }

  private void addPieDiagram(
      UUID evaluationId,
      AbstractTableColumnHeaderAttribute attribute,
      String name,
      String businessModule,
      UUID dataSourceId,
      AbstractTableColumnHeaderAttribute valueOptionAttribute) {
    if (attribute == null) {
      return;
    }
    AnalysisDto analysisDto =
        analysisController.addAnalysis(
            new AddAnalysisRequest(
                evaluationId,
                name,
                new PieChartConfigurationDto(
                    getAttributeSelectionDto(attribute, businessModule, dataSourceId))));
    addDiagramWithoutFilters(analysisDto);
    List<TableColumnFilterParameter> filterParameters = new ArrayList<>();
    addValueOptionFilter(filterParameters, valueOptionAttribute, businessModule, dataSourceId);
    if (!filterParameters.isEmpty()) {
      analysisController.addDiagram(
          analysisDto.id(),
          new AddDiagramRequest("with filters", "filtered data", filterParameters));
    }
  }

  private void addLineDiagram(
      UUID evaluationId,
      AbstractTableColumnHeaderAttribute xAttribute,
      AbstractTableColumnHeaderAttribute yAttribute,
      AbstractTableColumnHeaderAttribute secondAttribute,
      String businessModule,
      UUID dataSourceId) {
    if (xAttribute == null || yAttribute == null) {
      return;
    }
    String name = "line simple";
    AttributeSelectionDto secondDto = null;
    if (secondAttribute != null) {
      name = "line with second";
      secondDto = getAttributeSelectionDto(secondAttribute, businessModule, dataSourceId);
    }
    AnalysisDto analysisDto =
        analysisController.addAnalysis(
            new AddAnalysisRequest(
                evaluationId,
                name,
                new LineChartConfigurationDto(
                    getAttributeSelectionDto(xAttribute, businessModule, dataSourceId),
                    getAttributeSelectionDto(yAttribute, businessModule, dataSourceId),
                    secondDto,
                    RangeDto.ADAPTED)));
    addDiagramWithoutFilters(analysisDto);
  }

  private void addScatterDiagram(
      UUID evaluationId,
      AbstractTableColumnHeaderAttribute xAttribute,
      AbstractTableColumnHeaderAttribute yAttribute,
      AbstractTableColumnHeaderAttribute secondAttribute,
      String businessModule,
      UUID dataSourceId) {
    if (xAttribute == null || yAttribute == null) {
      return;
    }
    String name = "scatter simple";
    AttributeSelectionDto secondDto = null;
    if (secondAttribute != null) {
      name = "scatter with second";
      secondDto = getAttributeSelectionDto(secondAttribute, businessModule, dataSourceId);
    }
    AnalysisDto analysisDto =
        analysisController.addAnalysis(
            new AddAnalysisRequest(
                evaluationId,
                name,
                new ScatterChartConfigurationDto(
                    getAttributeSelectionDto(xAttribute, businessModule, dataSourceId),
                    getAttributeSelectionDto(yAttribute, businessModule, dataSourceId),
                    secondDto,
                    RangeDto.ORIGIN,
                    true)));
    addDiagramWithoutFilters(analysisDto);
  }

  private void addDiagramWithoutFilters(AnalysisDto analysisDto) {
    analysisController.addDiagram(
        analysisDto.id(), new AddDiagramRequest("no filters", "all data", Collections.emptyList()));
  }

  private static void addValueOptionFilter(
      List<TableColumnFilterParameter> filterParameters,
      AbstractTableColumnHeaderAttribute attribute,
      String businessModuleName,
      UUID dataSourceId) {
    if (attribute instanceof ValueWithOptionsAttribute voa) {
      List<String> values;
      if (voa.valueOptions().size() > 1) {
        values =
            List.of(voa.valueOptions().getFirst().value(), voa.valueOptions().getLast().value());
      } else {
        values = List.of(voa.valueOptions().getFirst().value());
      }
      filterParameters.add(
          new ValueOptionFilterParameterDto(
              getAttributeSelectionDto(attribute, businessModuleName, dataSourceId), values, true));
    }
  }

  private static AttributeSelectionDto getAttributeSelectionDto(
      AbstractTableColumnHeaderAttribute attribute, String businessModuleName, UUID dataSourceId) {
    String baseCode =
        attribute instanceof CentralFileIdAttribute cf ? cf.baseAttribute().code() : null;
    return new AttributeSelectionDto(businessModuleName, dataSourceId, attribute.code(), baseCode);
  }
}
