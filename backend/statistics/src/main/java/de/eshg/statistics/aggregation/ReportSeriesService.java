/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.aggregation;

import de.eshg.base.user.api.UserDto;
import de.eshg.domain.model.BaseEntity_;
import de.eshg.lib.keycloak.EmployeePermissionRole;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.error.NotFoundException;
import de.eshg.rest.service.security.CurrentUserHelper;
import de.eshg.statistics.OverviewSpecifications;
import de.eshg.statistics.StatisticsUserService;
import de.eshg.statistics.api.report.AbstractAddReportSeriesRequest;
import de.eshg.statistics.api.report.AddAutoReportSeriesRequest;
import de.eshg.statistics.api.report.AddManualReportSeriesRequest;
import de.eshg.statistics.api.report.GetReportsFilterOptions;
import de.eshg.statistics.api.report.GetReportsRequest;
import de.eshg.statistics.api.report.GetReportsResponse;
import de.eshg.statistics.api.report.ReportDataSensitivity;
import de.eshg.statistics.api.report.ReportSeriesDto;
import de.eshg.statistics.api.report.ReportTypeDto;
import de.eshg.statistics.api.report.UpdateReportSeriesRequest;
import de.eshg.statistics.mapper.EvaluationMapper;
import de.eshg.statistics.mapper.ReportMapper;
import de.eshg.statistics.persistence.entity.AbstractAggregationResult_;
import de.eshg.statistics.persistence.entity.AggregationResultState;
import de.eshg.statistics.persistence.entity.Evaluation;
import de.eshg.statistics.persistence.entity.StatisticsDataSensitivity;
import de.eshg.statistics.persistence.entity.TableColumn;
import de.eshg.statistics.persistence.entity.TableColumn_;
import de.eshg.statistics.persistence.entity.report.Report;
import de.eshg.statistics.persistence.entity.report.ReportSeries;
import de.eshg.statistics.persistence.entity.report.ReportSeries_;
import de.eshg.statistics.persistence.entity.report.ReportType;
import de.eshg.statistics.persistence.entity.report.Report_;
import de.eshg.statistics.persistence.repository.ReportSeriesRepository;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Expression;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import jakarta.persistence.criteria.Subquery;
import java.time.Clock;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Assert;
import org.springframework.util.CollectionUtils;

@Service
public class ReportSeriesService {
  private final ReportSeriesRepository reportSeriesRepository;
  private final EvaluationService evaluationService;
  private final DataSourceValidator dataSourceValidator;
  private final StatisticsUserService userService;
  private final Clock clock;

  public ReportSeriesService(
      ReportSeriesRepository reportSeriesRepository,
      EvaluationService evaluationService,
      DataSourceValidator dataSourceValidator,
      StatisticsUserService userService,
      Clock clock) {
    this.reportSeriesRepository = reportSeriesRepository;
    this.evaluationService = evaluationService;
    this.dataSourceValidator = dataSourceValidator;
    this.userService = userService;
    this.clock = clock;
  }

  @Transactional(readOnly = true)
  public boolean hasActiveReportSeries(UUID evaluationId) {
    return evaluationService.getEvaluationInternal(evaluationId).getReportSeriesList().stream()
        .anyMatch(ReportSeries::isActive);
  }

  @Transactional
  public ReportSeriesDto addReportSeries(AbstractAddReportSeriesRequest addReportSeriesRequest) {
    Evaluation evaluation =
        evaluationService.getEvaluationInternal(addReportSeriesRequest.evaluationId());
    if (evaluation.getDataSensitivity().equals(StatisticsDataSensitivity.SENSITIVE)) {
      throw new BadRequestException("Reports are only allowed for non-sensitive evaluations");
    }
    EvaluationService.validateEvaluationCompleted(evaluation);
    AggregationResultUtil.validateSameSensitivityPossible(
        evaluation, dataSourceValidator.getAllAvailableDataSources());

    ReportSeries reportSeries =
        switch (addReportSeriesRequest) {
          case AddManualReportSeriesRequest addManualReportSeriesRequest ->
              createManualReportSeries(evaluation, addManualReportSeriesRequest);
          case AddAutoReportSeriesRequest addAutoReportSeriesRequest ->
              createAutoReportSeries(evaluation, addAutoReportSeriesRequest);
        };

    evaluation.addReportSeries(reportSeries);

    reportSeriesRepository.flush();
    return ReportMapper.mapToApi(
        reportSeries,
        report -> AbstractAggregationResultService.isTooMuchDataForExportFunction().apply(report));
  }

  private ReportSeries createManualReportSeries(
      Evaluation evaluation, AddManualReportSeriesRequest addManualReportSeriesRequest) {
    AggregationResultUtil.validateTimeRange(
        addManualReportSeriesRequest.timeRangeStart(), addManualReportSeriesRequest.timeRangeEnd());

    ReportSeries reportSeries = new ReportSeries();
    reportSeries.setName(addManualReportSeriesRequest.name());
    reportSeries.setDescription(addManualReportSeriesRequest.description());
    reportSeries.setReportType(ReportType.MANUAL);
    reportSeries.setTimeRangeStart(addManualReportSeriesRequest.timeRangeStart());
    reportSeries.setTimeRangeEnd(addManualReportSeriesRequest.timeRangeEnd());

    reportSeries.addReport(
        ReportService.createReport(
            addManualReportSeriesRequest.name(),
            addManualReportSeriesRequest.timeRangeStart(),
            addManualReportSeriesRequest.timeRangeEnd(),
            AggregationResultState.CREATING,
            null,
            LocalDate.now(clock),
            evaluation));

    return reportSeries;
  }

  private ReportSeries createAutoReportSeries(
      Evaluation evaluation, AddAutoReportSeriesRequest addAutoReportSeriesRequest) {
    ReportSeries reportSeries = new ReportSeries();
    reportSeries.setActive(evaluation.getId());
    reportSeries.setName(addAutoReportSeriesRequest.name());
    reportSeries.setDescription(addAutoReportSeriesRequest.description());
    reportSeries.setReportType(ReportType.AUTO);
    reportSeries.setStartMonth(addAutoReportSeriesRequest.startMonth());
    reportSeries.setFrequency(ReportMapper.mapToFrequency(addAutoReportSeriesRequest.frequency()));
    reportSeries.setPeriod(
        ReportMapper.mapToReportingPeriod(addAutoReportSeriesRequest.reportingPeriod()));

    addInitialPlannedReportToSeries(
        reportSeries, addAutoReportSeriesRequest.startMonth(), evaluation);

    return reportSeries;
  }

  private void addInitialPlannedReportToSeries(
      ReportSeries reportSeries, int startMonth, Evaluation evaluation) {
    LocalDate executionAndEndDate = calculateExecutionDate(startMonth);
    LocalDate dateStart =
        ReportService.calculateStartDate(reportSeries.getPeriod(), executionAndEndDate);

    reportSeries.addReport(
        ReportService.createReport(
            "1",
            dateStart.atStartOfDay(clock.getZone()).toInstant(),
            executionAndEndDate.atStartOfDay(clock.getZone()).toInstant(),
            AggregationResultState.PLANNED,
            null,
            executionAndEndDate,
            evaluation));
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

  private ReportSeries getReportSeriesInternal(UUID reportSeriesId) {
    return reportSeriesRepository
        .findByExternalId(reportSeriesId)
        .orElseThrow(() -> new NotFoundException("Report series with given id not found"));
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

    return ReportMapper.mapToApi(
        reportSeries,
        report -> AbstractAggregationResultService.isTooMuchDataForExportFunction().apply(report));
  }

  private static void validateNotPendingManualReport(ReportSeries reportSeries) {
    AggregationResultState reportState = reportSeries.getReports().getFirst().getState();
    if (isManualReportSeries(reportSeries)
        && (reportState.equals(AggregationResultState.CREATING)
            || reportState.equals(AggregationResultState.DELETING))) {
      throw new BadRequestException(
          "Report series %s has a pending report".formatted(reportSeries.getExternalId()));
    }
  }

  @Transactional
  public void deactivateOrDeleteReportSeries(UUID reportSeriesId) {
    ReportSeries reportSeries = getReportSeriesInternal(reportSeriesId);

    deactivateOrDeleteReportSeries(reportSeries);
  }

  private boolean deactivateOrDeleteReportSeries(ReportSeries reportSeries) {
    validateIsAutoReportSeries(reportSeries);

    if (reportSeries.isActive()) {
      if (hasOnlyPlannedReport(reportSeries)) {
        reportSeriesRepository.delete(reportSeries);
        return true;
      } else {
        reportSeries.deactivate();
        Report plannedReport = getPlannedReport(reportSeries);
        if (plannedReport != null) {
          reportSeries.removeReport(plannedReport);
        }
      }
    }

    return false;
  }

  private static void validateIsAutoReportSeries(ReportSeries reportSeries) {
    if (isManualReportSeries(reportSeries)) {
      throw new BadRequestException(
          "Report series %s is not of type 'AUTO'".formatted(reportSeries.getExternalId()));
    }
  }

  private static boolean hasOnlyPlannedReport(ReportSeries reportSeries) {
    return reportSeries.getReports().stream()
        .allMatch(report -> report.getState().equals(AggregationResultState.PLANNED));
  }

  private static Report getPlannedReport(ReportSeries reportSeries) {
    return reportSeries.getReports().stream()
        .filter(report -> report.getState().equals(AggregationResultState.PLANNED))
        .findFirst()
        .orElse(null);
  }

  @Transactional
  public boolean deactivateAndDeleteOrFlagReportsForDeletion(UUID reportSeriesId) {
    ReportSeries reportSeries = getReportSeriesInternal(reportSeriesId);
    validateBelongsToCurrentUserOrIsAdmin(reportSeries);

    if (!isManualReportSeries(reportSeries) && deactivateOrDeleteReportSeries(reportSeries)) {
      return true;
    }

    reportSeries.getReports().forEach(report -> report.setState(AggregationResultState.DELETING));

    return false;
  }

  static void validateBelongsToCurrentUserOrIsAdmin(ReportSeries reportSeries) {
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
    List<Specification<ReportSeries>> specifications = new ArrayList<>();
    addAtLeastOneCompletedReportSpecification(specifications);

    GetReportsFilterOptions filterOptions = getReportsRequest.filterOptions();
    List<ReportDataSensitivity> dataSensitivities =
        Optional.ofNullable(getReportsRequest.filterOptions())
            .map(GetReportsFilterOptions::dataSensitivities)
            .orElse(Collections.emptyList());
    if (filterOptions != null) {
      addReportTypeSpecification(specifications, filterOptions.reportType());
      addDataSourcesSpecification(specifications, filterOptions.dataSourceIds());
      OverviewSpecifications.addDateSpecification(
          specifications, filterOptions.start(), AbstractAggregationResult_.TIME_RANGE_START);
      OverviewSpecifications.addDateSpecification(
          specifications, filterOptions.end(), AbstractAggregationResult_.TIME_RANGE_END);
      OverviewSpecifications.<ReportSeries>nameSpecification(
              filterOptions.name(), AbstractAggregationResult_.NAME)
          .ifPresent(specifications::add);
      addAtLeastOneDataSensitivityMatchSpecification(specifications, dataSensitivities);
    }

    Page<ReportSeries> relevantReportSeriesPage =
        reportSeriesRepository.findAll(
            Specification.allOf(specifications),
            PageRequest.of(
                getReportsRequest.page(),
                getReportsRequest.pageSize(),
                Sort.by(
                    EvaluationMapper.mapSortDirection(getReportsRequest.sortDirection()),
                    BaseEntity_.ID)));

    List<ReportSeriesDto> reportSeriesDtos =
        relevantReportSeriesPage
            .get()
            .map(reportSeries -> mapReportSeriesForOverview(reportSeries, dataSensitivities))
            .toList();

    Map<UUID, UserDto> resolvedUsers =
        userService.getResolvedUsers(
            reportSeriesDtos.stream().map(ReportSeriesDto::userId).collect(Collectors.toSet()));

    return new GetReportsResponse(
        reportSeriesDtos, resolvedUsers, relevantReportSeriesPage.getTotalElements());
  }

  private static void addAtLeastOneCompletedReportSpecification(
      List<Specification<ReportSeries>> specifications) {

    specifications.add(
        (root, query, criteriaBuilder) -> {
          assertQuery(query);
          Subquery<Report> subquery = query.subquery(Report.class);
          Root<Report> reportRoot = subquery.from(Report.class);

          subquery.select(reportRoot);
          subquery.where(
              criteriaBuilder.and(
                  criteriaBuilder.equal(
                      reportRoot.get(AbstractAggregationResult_.STATE),
                      AggregationResultState.COMPLETED),
                  criteriaBuilder.equal(reportRoot.get(Report_.REPORT_SERIES), root)));

          return criteriaBuilder.exists(subquery);
        });
  }

  private static void assertQuery(CriteriaQuery<?> query) {
    Assert.notNull(query, "CriteriaQuery must not be null");
  }

  private void addReportTypeSpecification(
      List<Specification<ReportSeries>> specifications, ReportTypeDto reportType) {
    if (reportType == null) {
      return;
    }

    specifications.add(
        (root, query, criteriaBuilder) ->
            criteriaBuilder.equal(
                root.get(ReportSeries_.REPORT_TYPE), ReportMapper.mapToReportType(reportType)));
  }

  private void addDataSourcesSpecification(
      List<Specification<ReportSeries>> specifications, List<UUID> dataSourceIds) {
    if (CollectionUtils.isEmpty(dataSourceIds)) {
      return;
    }
    specifications.add(
        (root, query, criteriaBuilder) -> {
          assertQuery(query);
          Join<ReportSeries, Evaluation> evaluationJoin = root.join(ReportSeries_.EVALUATION);

          Subquery<TableColumn> subquery = query.subquery(TableColumn.class);
          Root<TableColumn> tableColumnRoot = subquery.from(TableColumn.class);
          subquery.select(tableColumnRoot);

          Expression<Collection<TableColumn>> tableColumnsExpression =
              evaluationJoin.get(AbstractAggregationResult_.TABLE_COLUMNS);
          Predicate tableColumnMemberPredicate =
              criteriaBuilder.isMember(tableColumnRoot, tableColumnsExpression);

          Predicate dataSourcePredicate =
              tableColumnRoot.get(TableColumn_.DATA_SOURCE_ID).in(dataSourceIds);

          subquery.where(criteriaBuilder.and(tableColumnMemberPredicate, dataSourcePredicate));
          return criteriaBuilder.exists(subquery);
        });
  }

  private void addAtLeastOneDataSensitivityMatchSpecification(
      List<Specification<ReportSeries>> specifications,
      List<ReportDataSensitivity> dataSensitivities) {
    if (CollectionUtils.isEmpty(dataSensitivities)) {
      return;
    }
    specifications.add(
        (root, query, criteriaBuilder) -> {
          assertQuery(query);
          Subquery<Report> subquery = query.subquery(Report.class);
          Root<Report> reportRoot = subquery.from(Report.class);

          subquery.select(reportRoot);
          subquery.where(
              criteriaBuilder.and(
                  reportRoot
                      .get(AbstractAggregationResult_.DATA_SENSITIVITY)
                      .in(dataSensitivities.stream().map(ReportMapper::mapToPersistence).toList()),
                  criteriaBuilder.equal(reportRoot.get(Report_.REPORT_SERIES), root)));

          return criteriaBuilder.exists(subquery);
        });
  }

  private ReportSeriesDto mapReportSeriesForOverview(
      ReportSeries reportSeries, List<ReportDataSensitivity> dataSensitivities) {
    Stream<Report> reportStream =
        reportSeries.getReports().stream()
            .filter(report -> report.getState().equals(AggregationResultState.COMPLETED));

    if (!dataSensitivities.isEmpty()) {
      reportStream =
          reportStream.filter(
              report ->
                  dataSensitivities.contains(ReportMapper.mapToApi(report.getDataSensitivity())));
    }

    return ReportMapper.mapToApi(
        reportSeries,
        reportStream,
        report -> AbstractAggregationResultService.isTooMuchDataForExportFunction().apply(report));
  }

  @Transactional(readOnly = true)
  public Set<UUID> getReportIds(UUID reportSeriesId) {
    return getReportSeriesInternal(reportSeriesId).getReports().stream()
        .map(Report::getExternalId)
        .collect(Collectors.toSet());
  }

  private static boolean isManualReportSeries(ReportSeries reportSeries) {
    return reportSeries.getReportType().equals(ReportType.MANUAL);
  }
}
