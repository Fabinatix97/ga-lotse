/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.aggregation;

import static de.eshg.statistics.persistence.entity.AggregationResultPendingState.DATA_AGGREGATION;
import static de.eshg.statistics.persistence.entity.AggregationResultPendingState.DIAGRAM_CREATION;
import static de.eshg.statistics.persistence.entity.AggregationResultPendingState.EVALUATION_CONDUCTION;
import static de.eshg.statistics.persistence.entity.AggregationResultPendingState.MIN_MAX_DETERMINATION;

import de.eshg.base.user.api.UserDto;
import de.eshg.domain.model.BaseEntity_;
import de.eshg.lib.keycloak.EmployeePermissionRole;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.error.NotFoundException;
import de.eshg.rest.service.security.CurrentUserHelper;
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
import de.eshg.statistics.api.report.AbstractAddReportSeriesRequest;
import de.eshg.statistics.api.report.AddAutoReportSeriesRequest;
import de.eshg.statistics.api.report.AddManualReportSeriesRequest;
import de.eshg.statistics.api.report.GetReportsRequest;
import de.eshg.statistics.api.report.GetReportsResponse;
import de.eshg.statistics.api.report.ReportSeriesDto;
import de.eshg.statistics.api.report.ReportingPeriodDto;
import de.eshg.statistics.api.report.UpdateReportSeriesRequest;
import de.eshg.statistics.mapper.EvaluationMapper;
import de.eshg.statistics.mapper.FilterParameterMapper;
import de.eshg.statistics.mapper.ReportMapper;
import de.eshg.statistics.mapper.StatisticMapper;
import de.eshg.statistics.persistence.entity.AggregationResultPendingState;
import de.eshg.statistics.persistence.entity.AggregationResultState;
import de.eshg.statistics.persistence.entity.ChartConfiguration;
import de.eshg.statistics.persistence.entity.Diagram;
import de.eshg.statistics.persistence.entity.Evaluation;
import de.eshg.statistics.persistence.entity.Statistic;
import de.eshg.statistics.persistence.entity.chart.HistogramChartConfiguration;
import de.eshg.statistics.persistence.entity.report.Report;
import de.eshg.statistics.persistence.entity.report.ReportSeries;
import de.eshg.statistics.persistence.entity.report.ReportType;
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
import java.util.stream.Collectors;
import java.util.stream.Stream;
import org.hibernate.Hibernate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ReportSeriesService {
  private final ReportSeriesRepository reportSeriesRepository;
  private final StatisticService statisticService;
  private final DataAggregationService dataAggregationService;
  private final EvaluationService evaluationService;
  private final Clock clock;

  private static final Logger log = LoggerFactory.getLogger(ReportSeriesService.class);

  public ReportSeriesService(
      ReportSeriesRepository reportSeriesRepository,
      StatisticService statisticService,
      DataAggregationService dataAggregationService,
      EvaluationService evaluationService,
      Clock clock) {
    this.reportSeriesRepository = reportSeriesRepository;
    this.statisticService = statisticService;
    this.dataAggregationService = dataAggregationService;
    this.evaluationService = evaluationService;
    this.clock = clock;
  }

  @Transactional
  public ReportSeriesDto addReportSeries(AbstractAddReportSeriesRequest addReportSeriesRequest) {
    Statistic statistic = statisticService.getStatistic(addReportSeriesRequest.statisticId());
    if (hasNoDiagrams(statistic)) {
      throw new BadRequestException("Report creation is only possible with existing diagrams");
    }

    ReportSeries reportSeries =
        switch (addReportSeriesRequest) {
          case AddManualReportSeriesRequest addManualReportSeriesRequest ->
              createManualReportSeries(statistic, addManualReportSeriesRequest);
          case AddAutoReportSeriesRequest addAutoReportSeriesRequest ->
              createAutoReportSeries(statistic, addAutoReportSeriesRequest);
        };

    statistic.addReportSeries(reportSeries);

    reportSeriesRepository.flush();
    return ReportMapper.mapToApi(reportSeries);
  }

  private static boolean hasNoDiagrams(Statistic statistic) {
    return statistic.getEvaluations().isEmpty()
        || statistic.getEvaluations().stream()
            .allMatch(evaluation -> evaluation.getDiagrams().isEmpty());
  }

  private static ReportSeries createManualReportSeries(
      Statistic statistic, AddManualReportSeriesRequest addManualReportSeriesRequest) {
    AggregationResultUtil.validateTimeRange(
        addManualReportSeriesRequest.timeRangeStart(), addManualReportSeriesRequest.timeRangeEnd());

    ReportSeries reportSeries = new ReportSeries();
    reportSeries.setName(addManualReportSeriesRequest.name());
    reportSeries.setDescription(addManualReportSeriesRequest.description());
    reportSeries.setReportType(ReportType.MANUAL);
    reportSeries.setTimeRangeStart(addManualReportSeriesRequest.timeRangeStart());
    reportSeries.setTimeRangeEnd(addManualReportSeriesRequest.timeRangeEnd());

    reportSeries.addReport(
        createReport(
            addManualReportSeriesRequest.name(),
            addManualReportSeriesRequest.timeRangeStart(),
            addManualReportSeriesRequest.timeRangeEnd(),
            AggregationResultState.PENDING,
            null,
            statistic));

    return reportSeries;
  }

  private ReportSeries createAutoReportSeries(
      Statistic statistic, AddAutoReportSeriesRequest addAutoReportSeriesRequest) {
    ReportSeries reportSeries = new ReportSeries();
    reportSeries.setActive(true);
    reportSeries.setName(addAutoReportSeriesRequest.name());
    reportSeries.setDescription(addAutoReportSeriesRequest.description());
    reportSeries.setReportType(ReportType.AUTO);
    reportSeries.setStartMonth(addAutoReportSeriesRequest.startMonth());
    reportSeries.setFrequency(ReportMapper.mapToFrequency(addAutoReportSeriesRequest.frequency()));
    reportSeries.setPeriod(
        ReportMapper.mapToReportingPeriod(addAutoReportSeriesRequest.reportingPeriod()));

    LocalDate executionAndEndDate = calculateExecutionDate(addAutoReportSeriesRequest.startMonth());
    LocalDate dateStart =
        calculateStartDate(addAutoReportSeriesRequest.reportingPeriod(), executionAndEndDate);

    reportSeries.addReport(
        createReport(
            "1",
            dateStart.atStartOfDay(clock.getZone()).toInstant(),
            executionAndEndDate.atStartOfDay(clock.getZone()).toInstant(),
            AggregationResultState.PLANNED,
            executionAndEndDate,
            statistic));

    return reportSeries;
  }

  private LocalDate calculateExecutionDate(int startMonth) {
    LocalDate now = LocalDate.now(clock);
    int startYear;
    if (now.getMonth().getValue() >= startMonth) {
      startYear = now.getYear() + 1;
    } else {
      startYear = now.getYear();
    }

    return LocalDate.of(startYear, startMonth, 1);
  }

  private static LocalDate calculateStartDate(
      ReportingPeriodDto reportingPeriodDto, LocalDate executionDate) {
    return switch (reportingPeriodDto) {
      case MONTH -> executionDate.minusMonths(1);
      case THREE_MONTHS -> executionDate.minusMonths(3);
      case HALF_YEAR -> executionDate.minusMonths(6);
      case YEAR -> executionDate.minusMonths(12);
    };
  }

  private static Report createReport(
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
    report.setPendingState(state.equals(AggregationResultState.PENDING) ? DATA_AGGREGATION : null);
    report.setExecutionDate(executionDate);

    report.addTableColumns(
        statistic.getTableColumns().stream()
            .map(StatisticCopyService::copyTableColumnWithoutCellEntriesWithoutMinMaxValues)
            .toList());
    return report;
  }

  @Transactional(readOnly = true)
  public ReportStateInformation getReportStateInformationManualSeries(UUID reportSeriesId) {
    Report report = getReportSeriesInternal(reportSeriesId).getReports().getFirst();
    return new ReportStateInformation(report.getState(), report.getPendingState());
  }

  private ReportSeries getReportSeriesInternal(UUID reportSeriesId) {
    return reportSeriesRepository
        .findByExternalId(reportSeriesId)
        .orElseThrow(
            () ->
                new NotFoundException(
                    "Report series with id '%s' not found".formatted(reportSeriesId)));
  }

  @Transactional
  public void aggregateDataManualReportSeries(UUID reportSeriesId) {
    ReportSeries reportSeries = getReportSeriesInternal(reportSeriesId);
    Report report = reportSeries.getReports().getFirst();
    if (wrongConstellationForMethod(
        reportSeries, report, DATA_AGGREGATION, "aggregateDataManualReportSeries")) {
      return;
    }

    try {
      dataAggregationService.collectTableRows(report);
    } catch (Exception exception) {
      log.error("Error while collecting table rows", exception);
      report.setState(AggregationResultState.FAILED);
    }
  }

  private static boolean wrongConstellationForMethod(
      ReportSeries reportSeries,
      Report report,
      AggregationResultPendingState expectedPendingState,
      String method) {
    if (!report.getState().equals(AggregationResultState.PENDING)
        || !reportSeries.getReportType().equals(ReportType.MANUAL)
        || !report.getPendingState().equals(expectedPendingState)) {

      log.error(
          "'{}' called for wrong constellation {} {} {}",
          method,
          report.getState(),
          reportSeries.getReportType(),
          report.getPendingState());
      report.setState(AggregationResultState.FAILED);
      return true;
    }
    return false;
  }

  @Transactional
  public void minMaxDeterminationManualReportSeries(UUID reportSeriesId) {
    ReportSeries reportSeries = getReportSeriesInternal(reportSeriesId);
    Report report = reportSeries.getReports().getFirst();
    if (wrongConstellationForMethod(
        reportSeries, report, MIN_MAX_DETERMINATION, "minMaxDeterminationManualReportSeries")) {
      return;
    }

    dataAggregationService.determineMinMaxNullUnknownValues(report);
    report.setPendingState(EVALUATION_CONDUCTION);
  }

  @Transactional
  public void evaluationConductionManualReportSeries(UUID reportSeriesId) {
    ReportSeries reportSeries = getReportSeriesInternal(reportSeriesId);
    Report report = reportSeries.getReports().getFirst();
    if (wrongConstellationForMethod(
        reportSeries, report, EVALUATION_CONDUCTION, "evaluationConductionManualReportSeries")) {
      return;
    }

    Statistic statistic = reportSeries.getStatistic();
    if (hasNoDiagrams(statistic)) {
      finishReport(report);
    } else {
      copyEvaluationsWithoutDiagrams(report, statistic);
      report.setPendingState(DIAGRAM_CREATION);
    }
  }

  private static void finishReport(Report report) {
    report.setPendingState(null);
    report.setState(AggregationResultState.COMPLETED);
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
  public Map<EvaluationDto, AddDiagramRequest> findMissingDiagramOrCompleteManualReportSeries(
      UUID reportSeriesId) {
    ReportSeries reportSeries = getReportSeriesInternal(reportSeriesId);
    Report report = reportSeries.getReports().getFirst();
    if (wrongConstellationForMethod(
        reportSeries, report, DIAGRAM_CREATION, "findMissingDiagramsOrCompleteReport")) {
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

  @Transactional
  public ReportSeriesDto updateReportSeries(
      UUID reportSeriesId, UpdateReportSeriesRequest updateReportSeriesRequest) {
    ReportSeries reportSeries = getReportSeriesInternal(reportSeriesId);
    validateNotPendingManualReport(reportSeries);
    reportSeries.setName(updateReportSeriesRequest.name());
    reportSeries.setDescription(updateReportSeriesRequest.description());
    if (reportSeries.getReportType().equals(ReportType.MANUAL)) {
      reportSeries.getReports().getFirst().setName(updateReportSeriesRequest.name());
    }

    return ReportMapper.mapToApi(reportSeries);
  }

  private void validateNotPendingManualReport(ReportSeries reportSeries) {
    if (reportSeries.getReportType().equals(ReportType.MANUAL)
        && reportSeries.getReports().getFirst().getState().equals(AggregationResultState.PENDING)) {
      throw new BadRequestException(
          "Report series %s has a pending report".formatted(reportSeries.getExternalId()));
    }
  }

  @Transactional
  public void deleteReportSeries(UUID reportSeriesId) {
    ReportSeries reportSeries = getReportSeriesInternal(reportSeriesId);
    validateBelongsToCurrentUserOrIsAdmin(reportSeries);
    reportSeriesRepository.delete(reportSeries);
  }

  private void validateBelongsToCurrentUserOrIsAdmin(ReportSeries reportSeries) {
    UUID userId = CurrentUserHelper.getCurrentUserId();
    if (!userId.equals(reportSeries.getCreatedByUserId())
        && CurrentUserHelper.currentUserHasNoRole(
            EmployeePermissionRole.STATISTICS_STATISTICS_ADMIN)) {
      throw new BadRequestException(
          "Report series with id '%s' does not belong to current user"
              .formatted(reportSeries.getExternalId()));
    }
  }

  @Transactional(readOnly = true)
  public GetReportsResponse getReportSeriesEntriesForOverview(GetReportsRequest getReportsRequest) {
    PageRequest pageRequest =
        PageRequest.of(
            getReportsRequest.page(),
            getReportsRequest.pageSize(),
            Sort.by(
                StatisticMapper.mapSortDirection(getReportsRequest.sortDirection()),
                BaseEntity_.ID));

    Page<ReportSeries> relevantReportSeriesPage;
    if (getReportsRequest.reportTypeFilter() == null) {
      relevantReportSeriesPage =
          reportSeriesRepository.findAllWithAtLeastOneCompletedReport(pageRequest);
    } else {
      relevantReportSeriesPage =
          reportSeriesRepository.findAllWithAtLeastOneCompletedReportAndType(
              ReportMapper.mapToReportType(getReportsRequest.reportTypeFilter()), pageRequest);
    }
    List<ReportSeriesDto> reportSeriesDtos =
        relevantReportSeriesPage
            .get()
            .map(ReportSeriesService::mapReportSeriesForOverview)
            .toList();

    Map<UUID, UserDto> resolvedUsers =
        statisticService.getResolvedUsers(
            reportSeriesDtos.stream().map(ReportSeriesDto::userId).collect(Collectors.toSet()));

    return new GetReportsResponse(
        reportSeriesDtos, resolvedUsers, relevantReportSeriesPage.getTotalElements());
  }

  private static ReportSeriesDto mapReportSeriesForOverview(ReportSeries reportSeries) {
    Stream<Report> reportStream =
        reportSeries.getReports().stream()
            .filter(report -> report.getState().equals(AggregationResultState.COMPLETED));
    return ReportMapper.mapToApi(reportSeries, reportStream);
  }
}
