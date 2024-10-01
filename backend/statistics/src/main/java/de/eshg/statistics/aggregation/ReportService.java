/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.aggregation;

import de.eshg.base.user.api.UserDto;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.error.NotFoundException;
import de.eshg.statistics.api.AddDiagramRequest;
import de.eshg.statistics.api.EvaluationDto;
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
import de.eshg.statistics.mapper.EvaluationMapper;
import de.eshg.statistics.mapper.FilterParameterMapper;
import de.eshg.statistics.mapper.StatisticMapper;
import de.eshg.statistics.persistence.entity.AggregationResultPendingState;
import de.eshg.statistics.persistence.entity.AggregationResultState;
import de.eshg.statistics.persistence.entity.ChartConfiguration;
import de.eshg.statistics.persistence.entity.Diagram;
import de.eshg.statistics.persistence.entity.Evaluation;
import de.eshg.statistics.persistence.entity.Statistic;
import de.eshg.statistics.persistence.entity.chart.HistogramChartConfiguration;
import de.eshg.statistics.persistence.entity.report.Frequency;
import de.eshg.statistics.persistence.entity.report.Report;
import de.eshg.statistics.persistence.entity.report.ReportSeries;
import de.eshg.statistics.persistence.entity.report.ReportType;
import de.eshg.statistics.persistence.entity.report.ReportingPeriod;
import de.eshg.statistics.persistence.repository.ReportRepository;
import de.eshg.statistics.persistence.repository.ReportSeriesRepository;
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
public class ReportService {
  private final ReportRepository reportRepository;
  private final ReportSeriesRepository reportSeriesRepository;
  private final StatisticService statisticService;
  private final Clock clock;
  private final DataAggregationService dataAggregationService;
  private final EvaluationService evaluationService;

  private static final Logger log = LoggerFactory.getLogger(ReportService.class);

  public ReportService(
      ReportRepository reportRepository,
      ReportSeriesRepository reportSeriesRepository,
      StatisticService statisticService,
      Clock clock,
      DataAggregationService dataAggregationService,
      EvaluationService evaluationService) {
    this.reportRepository = reportRepository;
    this.reportSeriesRepository = reportSeriesRepository;
    this.statisticService = statisticService;
    this.clock = clock;
    this.dataAggregationService = dataAggregationService;
    this.evaluationService = evaluationService;
  }

  static Report createReport(
      String name,
      Instant timeRangeStart,
      Instant timeRangeEnd,
      AggregationResultState state,
      LocalDate executionDate,
      Statistic statistic) {
    Report report = new Report();
    report.setName(name);
    report.setTimeRangeStart(timeRangeStart);
    report.setTimeRangeEnd(timeRangeEnd);
    report.setNumberOfTableRows(0);
    report.setState(state);
    report.setPendingState(
        state.equals(AggregationResultState.PENDING)
            ? AggregationResultPendingState.DATA_AGGREGATION
            : null);
    report.setExecutionDate(executionDate);

    report.addTableColumns(
        statistic.getTableColumns().stream()
            .map(StatisticCopyService::copyTableColumnWithoutCellEntriesWithoutMinMaxValues)
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
    Map<UUID, UserDto> resolvedUsers = statisticService.getResolvedUsers(userIds);
    List<EvaluationDto> evaluations = EvaluationMapper.getEvaluations(report.getEvaluations());

    return new GetReportDetailPageResponse(
        report.getExternalId(),
        report.getReportSeries().getExternalId(),
        report.getName(),
        report.getReportSeries().getDescription(),
        report.getReportSeries().getReports().size(),
        report.getTimeRangeStart(),
        report.getTimeRangeEnd(),
        report.getCreatedAt(),
        StatisticMapper.mapToApi(report.getTableColumns()),
        report.getNumberOfTableRows(),
        resolvedUsers.get(reportSeriesUserId),
        resolvedUsers.get(report.getCreatedByUserId()),
        evaluations);
  }

  private Report getReportInternal(UUID reportId) {
    return reportRepository
        .findByExternalId(reportId)
        .orElseThrow(
            () -> new NotFoundException("Report with id '%s' not found".formatted(reportId)));
  }

  private void validateReportCompleted(Report report) {
    if (!report.getState().equals(AggregationResultState.COMPLETED)) {
      throw new BadRequestException(
          "Report %s is not in state COMPLETED".formatted(report.getExternalId()));
    }
  }

  @Transactional
  public UUID getPlannedReportToExecuteSetToPending() {
    LocalDate now = LocalDate.now(clock);

    Optional<Report> reportOptional =
        reportRepository.findByExecutionDateLessThanEqualAndState(
            now, AggregationResultState.PLANNED);
    if (reportOptional.isPresent()) {
      Report report = reportOptional.get();
      report.setState(AggregationResultState.PENDING);
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
            executionAndEndDate,
            reportSeries.getStatistic()));

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

  int findNextNumberInReports(List<Report> reports) {
    int currentHighest = 0;
    for (Report report : reports) {
      Optional<Integer> numberOfReport = getNumberOfReport(report);
      if (numberOfReport.isEmpty()) {
        return reports.size() + 1;
      } else if (numberOfReport.get() > currentHighest) {
        currentHighest = numberOfReport.get();
      }
    }
    return currentHighest + 1;
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

  @Transactional(readOnly = true)
  public ReportStateInformation getReportStateInformation(UUID reportId) {
    Report report = getReportInternal(reportId);
    return new ReportStateInformation(report.getState(), report.getPendingState());
  }

  @Transactional
  public void aggregateData(UUID reportId) {
    Report report = getReportInternal(reportId);
    if (wrongConstellationForMethod(
        report, AggregationResultPendingState.DATA_AGGREGATION, "aggregateData")) {
      return;
    }

    try {
      dataAggregationService.collectTableRows(report);
    } catch (Exception exception) {
      log.error("Error while collecting table rows", exception);
      report.setState(AggregationResultState.FAILED);
    }
  }

  @Transactional
  public void minMaxDetermination(UUID reportId) {
    Report report = getReportInternal(reportId);
    if (wrongConstellationForMethod(
        report, AggregationResultPendingState.MIN_MAX_DETERMINATION, "minMaxDetermination")) {
      return;
    }

    dataAggregationService.determineMinMaxNullUnknownValues(report);
    report.setPendingState(AggregationResultPendingState.EVALUATION_CONDUCTION);
  }

  @Transactional
  public void evaluationConduction(UUID reportId) {
    Report report = getReportInternal(reportId);
    if (wrongConstellationForMethod(
        report, AggregationResultPendingState.EVALUATION_CONDUCTION, "evaluationConduction")) {
      return;
    }

    Statistic statistic = report.getReportSeries().getStatistic();
    if (StatisticService.hasNoDiagrams(statistic)) {
      finishReport(report);
    } else {
      copyEvaluationsWithoutDiagrams(report, statistic);
      report.setPendingState(AggregationResultPendingState.DIAGRAM_CREATION);
    }
  }

  private void copyEvaluationsWithoutDiagrams(Report report, Statistic statistic) {
    statistic.getEvaluations().stream()
        .filter(evaluation -> !evaluation.getDiagrams().isEmpty())
        .forEach(
            evaluation -> report.addEvaluation(copyEvaluationWithoutDiagrams(evaluation, report)));
  }

  private Evaluation copyEvaluationWithoutDiagrams(Evaluation original, Report report) {
    ChartConfiguration originalChartConfiguration =
        Hibernate.unproxy(original.getChartConfiguration(), ChartConfiguration.class);
    ChartConfiguration chartConfiguration =
        StatisticCopyService.copyChartConfiguration(originalChartConfiguration, false);

    if (chartConfiguration instanceof HistogramChartConfiguration histogramChartConfiguration) {
      HistogramChartConfigurationDto chartConfigurationDto =
          EvaluationMapper.mapToHistogramChartConfigurationDto(histogramChartConfiguration);
      histogramChartConfiguration.addBins(
          evaluationService.calculateHistogramBins(chartConfigurationDto, report));
    }

    Evaluation evaluation = new Evaluation();
    evaluation.setOriginalEvaluationId(original.getExternalId());
    evaluation.setName(original.getName());
    evaluation.setChartConfiguration(chartConfiguration);
    return evaluation;
  }

  @Transactional
  public Map<EvaluationDto, AddDiagramRequest> findMissingDiagramOrCompleteAutoReport(
      UUID reportId) {
    Report report = getReportInternal(reportId);
    return findMissingDiagramOrComplete(report);
  }

  Map<EvaluationDto, AddDiagramRequest> findMissingDiagramOrComplete(Report report) {
    if (wrongConstellationForMethod(
        report, AggregationResultPendingState.DIAGRAM_CREATION, "findMissingDiagramOrComplete")) {
      return Collections.emptyMap();
    }

    Optional<Evaluation> firstUnfinishedEvaluation =
        report.getEvaluations().stream()
            .filter(evaluation -> evaluation.getOriginalEvaluationId() != null)
            .findFirst();
    if (firstUnfinishedEvaluation.isEmpty()) {
      finishReport(report);
      return Collections.emptyMap();
    }

    Evaluation evaluationToComplete = firstUnfinishedEvaluation.get();

    Optional<Diagram> diagramToCopyOptional = Optional.empty();
    try {
      Evaluation originalEvaluation =
          evaluationService.getEvaluationInternal(evaluationToComplete.getOriginalEvaluationId());
      diagramToCopyOptional =
          originalEvaluation.getDiagrams().stream()
              .filter(diagram -> notAlreadyCopied(evaluationToComplete, diagram))
              .findFirst();
    } catch (NotFoundException e) {
      // Evaluation deleted
      log.warn(
          "Could not finish diagrams for report %s, evaluation %s: %s"
              .formatted(
                  report.getExternalId(), evaluationToComplete.getExternalId(), e.getMessage()));
    }
    if (diagramToCopyOptional.isEmpty()) {
      evaluationToComplete.setOriginalEvaluationId(null);
      return Collections.emptyMap();
    }

    Diagram diagramToCopy = diagramToCopyOptional.get();
    return Map.of(
        EvaluationMapper.mapToApi(evaluationToComplete, true),
        new AddDiagramRequest(
            diagramToCopy.getTitle(),
            diagramToCopy.getDescription(),
            FilterParameterMapper.mapToApi(diagramToCopy.getFilters())));
  }

  private boolean notAlreadyCopied(Evaluation evaluationToComplete, Diagram diagram) {
    return evaluationToComplete.getDiagrams().stream()
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

  private static boolean wrongConstellationForMethod(
      Report report, AggregationResultPendingState expectedPendingState, String method) {
    if (!report.getState().equals(AggregationResultState.PENDING)
        || !report.getPendingState().equals(expectedPendingState)) {

      log.error(
          "'{}' called for wrong constellation {} {}",
          method,
          report.getState(),
          report.getPendingState());
      report.setState(AggregationResultState.FAILED);
      return true;
    }
    return false;
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
  public void setStateToFailed(UUID reportId) {
    Report report = getReportInternal(reportId);
    if (!report.getState().equals(AggregationResultState.FAILED)) {
      report.setState(AggregationResultState.FAILED);
    }
  }

  @Transactional
  public void deleteReport(UUID reportId) {
    Report report = getReportInternal(reportId);
    ReportSeries reportSeries = report.getReportSeries();
    ReportSeriesService.validateBelongsToCurrentUserOrIsAdmin(reportSeries);
    if (report.getState().equals(AggregationResultState.PLANNED)) {
      throw new BadRequestException(
          "Report is in state 'PLANNED', deactivate report series to remove this report");
    }
    if (reportSeries.getReportType().equals(ReportType.MANUAL)) {
      reportSeriesRepository.delete(reportSeries);
    } else {
      reportRepository.delete(report);
    }
  }
}
