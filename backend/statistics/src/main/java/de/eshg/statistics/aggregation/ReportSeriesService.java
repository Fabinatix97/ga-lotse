/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.aggregation;

import de.eshg.base.user.api.UserDto;
import de.eshg.domain.model.BaseEntity_;
import de.eshg.lib.keycloak.EmployeePermissionRole;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.error.NotFoundException;
import de.eshg.rest.service.security.CurrentUserHelper;
import de.eshg.statistics.api.report.AbstractAddReportSeriesRequest;
import de.eshg.statistics.api.report.AddAutoReportSeriesRequest;
import de.eshg.statistics.api.report.AddManualReportSeriesRequest;
import de.eshg.statistics.api.report.GetReportsRequest;
import de.eshg.statistics.api.report.GetReportsResponse;
import de.eshg.statistics.api.report.ReportSeriesDto;
import de.eshg.statistics.api.report.UpdateReportSeriesRequest;
import de.eshg.statistics.mapper.ReportMapper;
import de.eshg.statistics.mapper.StatisticMapper;
import de.eshg.statistics.persistence.entity.AggregationResultState;
import de.eshg.statistics.persistence.entity.Statistic;
import de.eshg.statistics.persistence.entity.report.Report;
import de.eshg.statistics.persistence.entity.report.ReportSeries;
import de.eshg.statistics.persistence.entity.report.ReportType;
import de.eshg.statistics.persistence.repository.ReportSeriesRepository;
import java.time.Clock;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ReportSeriesService {
  private final ReportSeriesRepository reportSeriesRepository;
  private final StatisticService statisticService;
  private final Clock clock;

  public ReportSeriesService(
      ReportSeriesRepository reportSeriesRepository,
      StatisticService statisticService,
      Clock clock) {
    this.reportSeriesRepository = reportSeriesRepository;
    this.statisticService = statisticService;
    this.clock = clock;
  }

  @Transactional
  public ReportSeriesDto addReportSeries(AbstractAddReportSeriesRequest addReportSeriesRequest) {
    Statistic statistic = statisticService.getStatistic(addReportSeriesRequest.statisticId());
    if (StatisticService.hasNoDiagrams(statistic)) {
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
        ReportService.createReport(
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
        ReportService.calculateStartDate(reportSeries.getPeriod(), executionAndEndDate);

    reportSeries.addReport(
        ReportService.createReport(
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

  private ReportSeries getReportSeriesInternal(UUID reportSeriesId) {
    return reportSeriesRepository
        .findByExternalId(reportSeriesId)
        .orElseThrow(
            () ->
                new NotFoundException(
                    "Report series with id '%s' not found".formatted(reportSeriesId)));
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
