/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.aggregation;

import de.eshg.base.user.api.UserDto;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.error.NotFoundException;
import de.eshg.statistics.StatisticsUserService;
import de.eshg.statistics.api.AddDiagramRequest;
import de.eshg.statistics.api.AnalysisDto;
import de.eshg.statistics.api.chart.HistogramChartConfigurationDto;
import de.eshg.statistics.api.filter.BooleanFilterParameterDto;
import de.eshg.statistics.api.filter.DecimalRangeFilterParameterDto;
import de.eshg.statistics.api.filter.DecimalValueFilterParameterDto;
import de.eshg.statistics.api.filter.IntegerRangeFilterParameterDto;
import de.eshg.statistics.api.filter.IntegerValueFilterParameterDto;
import de.eshg.statistics.api.filter.NullFilterParameterDto;
import de.eshg.statistics.api.filter.TableColumnFilterParameter;
import de.eshg.statistics.api.filter.TextFilterParameterDto;
import de.eshg.statistics.api.filter.ValueOptionFilterParameterDto;
import de.eshg.statistics.api.report.GetReportDetailPageResponse;
import de.eshg.statistics.config.StatisticsConfig;
import de.eshg.statistics.config.StatisticsFeatureToggle;
import de.eshg.statistics.mapper.AnalysisMapper;
import de.eshg.statistics.mapper.EvaluationMapper;
import de.eshg.statistics.mapper.FilterParameterMapper;
import de.eshg.statistics.mapper.ReportMapper;
import de.eshg.statistics.persistence.entity.AbstractAggregationResult;
import de.eshg.statistics.persistence.entity.AggregationResultPendingState;
import de.eshg.statistics.persistence.entity.AggregationResultState;
import de.eshg.statistics.persistence.entity.Analysis;
import de.eshg.statistics.persistence.entity.ChartConfiguration;
import de.eshg.statistics.persistence.entity.Diagram;
import de.eshg.statistics.persistence.entity.Evaluation;
import de.eshg.statistics.persistence.entity.chart.HistogramChartConfiguration;
import de.eshg.statistics.persistence.entity.report.Frequency;
import de.eshg.statistics.persistence.entity.report.Report;
import de.eshg.statistics.persistence.entity.report.ReportSeries;
import de.eshg.statistics.persistence.entity.report.ReportType;
import de.eshg.statistics.persistence.entity.report.ReportingPeriod;
import de.eshg.statistics.persistence.repository.ReportRepository;
import de.eshg.statistics.persistence.repository.ReportSeriesRepository;
import de.eshg.statistics.persistence.repository.TableRowRepository;
import java.time.Clock;
import java.time.Instant;
import java.time.LocalDate;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import org.hibernate.Hibernate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ReportService extends AbstractAggregationResultService {
  private final ReportRepository reportRepository;
  private final ReportSeriesRepository reportSeriesRepository;
  private final StatisticsUserService userService;
  private final Clock clock;
  private final AnalysisService analysisService;

  private static final Logger log = LoggerFactory.getLogger(ReportService.class);

  public ReportService(
      DataSourceValidator dataSourceValidator,
      DataAggregationService dataAggregationService,
      TableRowRepository tableRowRepository,
      StatisticsConfig statisticsConfig,
      ReportRepository reportRepository,
      ReportSeriesRepository reportSeriesRepository,
      StatisticsUserService userService,
      Clock clock,
      AnalysisService analysisService,
      StatisticsFeatureToggle featureToggle) {
    super(
        dataSourceValidator,
        dataAggregationService,
        tableRowRepository,
        featureToggle,
        statisticsConfig);
    this.reportRepository = reportRepository;
    this.reportSeriesRepository = reportSeriesRepository;
    this.userService = userService;
    this.clock = clock;
    this.analysisService = analysisService;
  }

  @Override
  public AbstractAggregationResult getAbstractAggregationResultInternal(UUID id) {
    return getReportInternal(id);
  }

  public Report getReportInternal(UUID reportId) {
    return reportRepository
        .findByExternalId(reportId)
        .orElseThrow(() -> new NotFoundException("Report with given id not found"));
  }

  static Report createReport(
      String name,
      Instant timeRangeStart,
      Instant timeRangeEnd,
      AggregationResultState state,
      Long uniquePlanned,
      LocalDate executionDate,
      Evaluation evaluation) {
    Report report = new Report();
    report.setName(name);
    report.setTimeRangeStart(timeRangeStart);
    report.setTimeRangeEnd(timeRangeEnd);
    report.setNumberOfTableRows(0);
    if (uniquePlanned != null) {
      report.setPlanned(uniquePlanned);
    }
    report.setState(state);
    report.setPendingState(
        state.equals(AggregationResultState.CREATING)
            ? AggregationResultPendingState.DATA_AGGREGATION
            : null);
    report.setExecutionDate(executionDate);
    report.setDataSensitivity(evaluation.getDataSensitivity());

    report.addTableColumns(
        evaluation.getTableColumns().stream()
            .map(
                tableColumn ->
                    EvaluationCopyService
                        .copyTableColumnWithoutCellEntriesAndMinMaxValuesAndAnonymization(
                            tableColumn, false))
            .toList());
    return report;
  }

  @Transactional(readOnly = true)
  public GetReportDetailPageResponse getReportDetailPage(UUID reportId) {
    Report report = getReportInternal(reportId);
    validateReportCompleted(report);
    UUID reportSeriesUserId = report.getReportSeries().getCreatedByUserId();
    Set<UUID> userIds = new HashSet<>();
    userIds.add(reportSeriesUserId);
    userIds.add(report.getCreatedByUserId());
    Map<UUID, UserDto> resolvedUsers = userService.getResolvedUsers(userIds);
    List<AnalysisDto> analyses = AnalysisMapper.getAnalyses(report.getAnalyses());

    return new GetReportDetailPageResponse(
        report.getExternalId(),
        report.getReportSeries().getExternalId(),
        report.getName(),
        report.getReportSeries().getName(),
        report.getReportSeries().getDescription(),
        report.getReportSeries().getReports().size(),
        report.getTimeRangeStart(),
        report.getTimeRangeEnd(),
        report.getExecutionDate(),
        EvaluationMapper.mapToApi(report.getTableColumns()),
        report.getNumberOfTableRows(),
        isTooMuchDataForExportFunction().apply(report),
        resolvedUsers.get(reportSeriesUserId),
        resolvedUsers.get(report.getCreatedByUserId()),
        analyses,
        ReportMapper.mapToReportTypeDto(report.getReportSeries().getReportType()),
        ReportMapper.mapToApi(report.getDataSensitivity()));
  }

  public static void validateReportCompleted(Report report) {
    if (!report.getState().equals(AggregationResultState.COMPLETED)) {
      throw new BadRequestException(
          "Report %s is not in state COMPLETED".formatted(report.getExternalId()));
    }
  }

  @Transactional
  public UUID getPlannedReportToExecuteSetToPending() {
    LocalDate now = LocalDate.now(clock);
    Optional<Report> reportOptional =
        reportRepository.findFirstByExecutionDateLessThanEqualAndStateOrderByIdAsc(
            now, AggregationResultState.PLANNED);
    if (reportOptional.isPresent()) {
      Report report = reportOptional.get();
      report.setState(AggregationResultState.CREATING);
      report.setPendingState(AggregationResultPendingState.DATA_AGGREGATION);
      return report.getExternalId();
    } else {
      return null;
    }
  }

  @Transactional
  public void createNewPlannedReportInSeries(UUID reportId) {
    Report report = getReportInternal(reportId);
    ReportSeries reportSeries = report.getReportSeries();
    if (!reportSeries.isActive()) {
      return;
    }
    int nextNumber = getNextNumber(report);

    LocalDate executionAndEndDate =
        calculateNextExecutionDate(report.getExecutionDate(), reportSeries.getFrequency());
    LocalDate dateStart = calculateStartDate(reportSeries.getPeriod(), executionAndEndDate);

    reportSeries.addReport(
        createReport(
            String.valueOf(nextNumber),
            dateStart.atStartOfDay(clock.getZone()).toInstant(),
            executionAndEndDate.atStartOfDay(clock.getZone()).toInstant(),
            AggregationResultState.PLANNED,
            reportSeries.getId(),
            executionAndEndDate,
            reportSeries.getEvaluation()));

    report.setExecutionDate(LocalDate.now(clock));
  }

  static LocalDate calculateStartDate(ReportingPeriod reportingPeriod, LocalDate executionDate) {
    return switch (reportingPeriod) {
      case MONTH -> executionDate.minusMonths(1);
      case THREE_MONTHS -> executionDate.minusMonths(3);
      case HALF_YEAR -> executionDate.minusMonths(6);
      case YEAR -> executionDate.minusMonths(12);
    };
  }

  private static LocalDate calculateNextExecutionDate(
      LocalDate currentExecutionDate, Frequency frequency) {
    return switch (frequency) {
      case PER_MONTH -> currentExecutionDate.plusMonths(1);
      case PER_THREE_MONTHS -> currentExecutionDate.plusMonths(3);
      case PER_HALF_YEAR -> currentExecutionDate.plusMonths(6);
      case PER_YEAR -> currentExecutionDate.plusMonths(12);
    };
  }

  private int getNextNumber(Report report) {
    return getNumberOfReport(report).orElse(report.getReportSeries().getReports().size()) + 1;
  }

  private Optional<Integer> getNumberOfReport(Report report) {
    try {
      return Optional.of(Integer.parseInt(report.getName()));
    } catch (NumberFormatException e) {
      log.error(
          "Report {} has name '{}' which is not a number",
          report.getExternalId(),
          report.getName());
      return Optional.empty();
    }
  }

  @Transactional
  public void analysisConduction(UUID reportId) {
    Report report = getReportInternal(reportId);

    Evaluation evaluation = report.getReportSeries().getEvaluation();
    if (EvaluationService.hasNoDiagrams(evaluation)) {
      finishReport(report);
    } else {
      copyAnalysesWithoutDiagrams(report, evaluation);
      report.setPendingState(AggregationResultPendingState.DIAGRAM_CREATION);
    }
  }

  private void copyAnalysesWithoutDiagrams(Report report, Evaluation evaluation) {
    evaluation.getAnalyses().stream()
        .filter(analysis -> !analysis.getDiagrams().isEmpty())
        .forEach(analysis -> report.addAnalysis(copyAnalysisWithoutDiagrams(analysis, report)));
  }

  private Analysis copyAnalysisWithoutDiagrams(Analysis original, Report report) {
    ChartConfiguration originalChartConfiguration =
        Hibernate.unproxy(original.getChartConfiguration(), ChartConfiguration.class);
    ChartConfiguration chartConfiguration =
        EvaluationCopyService.copyChartConfiguration(originalChartConfiguration, false);

    if (chartConfiguration instanceof HistogramChartConfiguration histogramChartConfiguration) {
      HistogramChartConfigurationDto chartConfigurationDto =
          AnalysisMapper.mapToHistogramChartConfigurationDto(histogramChartConfiguration);
      histogramChartConfiguration.addBins(
          analysisService.calculateHistogramBins(chartConfigurationDto, report));
    }

    Analysis analysis = new Analysis();
    analysis.setOriginalAnalysisId(original.getExternalId());
    analysis.setName(original.getName());
    analysis.setChartConfiguration(chartConfiguration);
    return analysis;
  }

  @Transactional
  public Map<AnalysisDto, AddDiagramRequest> findMissingDiagramOrCompleteAutoReport(UUID reportId) {
    Report report = getReportInternal(reportId);
    return findMissingDiagramOrComplete(report);
  }

  private Map<AnalysisDto, AddDiagramRequest> findMissingDiagramOrComplete(Report report) {
    Optional<Analysis> firstUnfinishedAnalysis =
        report.getAnalyses().stream()
            .filter(analysis -> analysis.getOriginalAnalysisId() != null)
            .findFirst();
    if (firstUnfinishedAnalysis.isEmpty()) {
      finishReport(report);
      return Collections.emptyMap();
    }

    Analysis analysisToComplete = firstUnfinishedAnalysis.get();

    Optional<Diagram> diagramToCopyOptional = Optional.empty();
    try {
      Analysis originalAnalysis =
          analysisService.getAnalysisInternal(analysisToComplete.getOriginalAnalysisId());
      diagramToCopyOptional =
          originalAnalysis.getDiagrams().stream()
              .filter(diagram -> notAlreadyCopied(analysisToComplete, diagram))
              .findFirst();
    } catch (NotFoundException e) {
      // Analysis deleted
      log.warn(
          "Could not finish diagrams for report %s, analysis %s: %s"
              .formatted(
                  report.getExternalId(), analysisToComplete.getExternalId(), e.getMessage()));
    }
    if (diagramToCopyOptional.isEmpty()) {
      analysisToComplete.setOriginalAnalysisId(null);
      return Collections.emptyMap();
    }

    Diagram diagramToCopy = diagramToCopyOptional.get();
    return Map.of(
        AnalysisMapper.mapToApi(analysisToComplete, true),
        new AddDiagramRequest(
            diagramToCopy.getTitle(),
            diagramToCopy.getDescription(),
            FilterParameterMapper.mapToApi(diagramToCopy.getFilters())));
  }

  private boolean notAlreadyCopied(Analysis analysisToComplete, Diagram diagram) {
    return analysisToComplete.getDiagrams().stream()
        .noneMatch(copiedDiagram -> isIdentical(copiedDiagram, diagram));
  }

  private boolean isIdentical(Diagram copiedDiagram, Diagram originalDiagram) {
    return copiedDiagram.getTitle().equals(originalDiagram.getTitle())
        && Objects.equals(copiedDiagram.getDescription(), originalDiagram.getDescription())
        && identicalFilters(
            FilterParameterMapper.mapToApi(copiedDiagram.getFilters()),
            FilterParameterMapper.mapToApi(originalDiagram.getFilters()));
  }

  private boolean identicalFilters(
      List<TableColumnFilterParameter> copiedColumnFilters,
      List<TableColumnFilterParameter> originalTableColumnFilters) {
    if (copiedColumnFilters.size() != originalTableColumnFilters.size()) {
      return false;
    }

    return copiedColumnFilters.stream()
            .allMatch(
                columnFilter ->
                    identicalColumnFilterPresent(columnFilter, originalTableColumnFilters))
        && originalTableColumnFilters.stream()
            .allMatch(
                columnFilter -> identicalColumnFilterPresent(columnFilter, copiedColumnFilters));
  }

  private boolean identicalColumnFilterPresent(
      TableColumnFilterParameter columnFilterToFind, List<TableColumnFilterParameter> filters) {
    return filters.stream().anyMatch(filter -> isIdentical(filter, columnFilterToFind));
  }

  private boolean isIdentical(
      TableColumnFilterParameter filter, TableColumnFilterParameter columnFilterToFind) {
    if (!filter.type().equals(columnFilterToFind.type())
        || !filter
            .attribute()
            .businessModuleName()
            .equals(columnFilterToFind.attribute().businessModuleName())
        || !filter.attribute().dataSourceId().equals(columnFilterToFind.attribute().dataSourceId())
        || !filter
            .attribute()
            .businessModuleAttributeCode()
            .equals(columnFilterToFind.attribute().businessModuleAttributeCode())
        || !Objects.equals(
            filter.attribute().baseModuleAttributeCode(),
            columnFilterToFind.attribute().baseModuleAttributeCode())) {
      return false;
    }
    return switch (filter) {
      case BooleanFilterParameterDto booleanFilter:
        {
          BooleanFilterParameterDto otherFilter = (BooleanFilterParameterDto) columnFilterToFind;
          yield booleanFilter.searchForTrue() == otherFilter.searchForTrue()
              && booleanFilter.searchForFalse() == otherFilter.searchForFalse()
              && booleanFilter.searchForNull() == otherFilter.searchForNull();
        }
      case DecimalRangeFilterParameterDto decimalRangeFilter:
        {
          DecimalRangeFilterParameterDto otherFilter =
              (DecimalRangeFilterParameterDto) columnFilterToFind;
          yield decimalRangeFilter.minValueInclusive().compareTo(otherFilter.minValueInclusive())
                  == 0
              && decimalRangeFilter.maxValueInclusive().compareTo(otherFilter.maxValueInclusive())
                  == 0
              && decimalRangeFilter.withNullValues() == otherFilter.withNullValues();
        }
      case DecimalValueFilterParameterDto decimalValueFilter:
        {
          DecimalValueFilterParameterDto otherFilter =
              (DecimalValueFilterParameterDto) columnFilterToFind;
          yield decimalValueFilter.value().compareTo(otherFilter.value()) == 0
              && decimalValueFilter.numericComparison().equals(otherFilter.numericComparison())
              && decimalValueFilter.withNullValues() == otherFilter.withNullValues();
        }
      case IntegerRangeFilterParameterDto integerRangeFilter:
        {
          IntegerRangeFilterParameterDto otherFilter =
              (IntegerRangeFilterParameterDto) columnFilterToFind;
          yield integerRangeFilter.minValueInclusive().equals(otherFilter.minValueInclusive())
              && integerRangeFilter.maxValueInclusive().equals(otherFilter.maxValueInclusive())
              && integerRangeFilter.withNullValues() == otherFilter.withNullValues();
        }
      case IntegerValueFilterParameterDto integerValueFilter:
        {
          IntegerValueFilterParameterDto otherFilter =
              (IntegerValueFilterParameterDto) columnFilterToFind;
          yield integerValueFilter.value().equals(otherFilter.value())
              && integerValueFilter.numericComparison().equals(otherFilter.numericComparison())
              && integerValueFilter.withNullValues() == otherFilter.withNullValues();
        }
      case NullFilterParameterDto ignored:
        {
          yield true;
        }
      case TextFilterParameterDto textFilter:
        {
          yield textFilter.text().equals(((TextFilterParameterDto) columnFilterToFind).text());
        }
      case ValueOptionFilterParameterDto valueOptionFilter:
        {
          ValueOptionFilterParameterDto otherFilter =
              (ValueOptionFilterParameterDto) columnFilterToFind;
          Set<String> searchValueSet = new HashSet<>(valueOptionFilter.searchValues());
          Set<String> otherSearchValueSet = new HashSet<>(otherFilter.searchValues());
          yield searchValueSet.containsAll(otherFilter.searchValues())
              && otherSearchValueSet.containsAll(valueOptionFilter.searchValues())
              && valueOptionFilter.searchForNull() == otherFilter.searchForNull();
        }
    };
  }

  private static void finishReport(Report report) {
    report.setPendingState(null);
    report.setState(AggregationResultState.COMPLETED);
    ReportSeries reportSeries = report.getReportSeries();
    if (reportSeries.getReportType().equals(ReportType.AUTO)) {
      reportSeries.setTimeRangeStart(report.getTimeRangeStart());
      reportSeries.setTimeRangeEnd(report.getTimeRangeEnd());
    }
  }

  @Transactional
  public void flagReportForDeletion(UUID reportId) {
    Report report = getReportInternal(reportId);
    ReportSeries reportSeries = report.getReportSeries();
    ReportSeriesService.validateBelongsToCurrentUserOrIsAdmin(reportSeries);
    if (report.getState().equals(AggregationResultState.PLANNED)) {
      throw new BadRequestException(
          "Report is in state 'PLANNED', deactivate report series to remove this report");
    } else if (report.getState().equals(AggregationResultState.DELETING)) {
      throw new BadRequestException("Report is already in the process of being deleted");
    }

    report.setState(AggregationResultState.DELETING);
  }

  @Transactional
  public boolean deleteReport(UUID reportId) {
    Report report = getReportInternal(reportId);

    if (countTableRows(report) <= 0) {
      ReportSeries reportSeries = report.getReportSeries();
      if (reportSeries.getReports().size() <= 1) {
        reportSeriesRepository.delete(reportSeries);
      } else {
        reportSeries.removeReport(report);
      }
      return true;
    } else {
      removeTableRows(report);
      return false;
    }
  }
}
