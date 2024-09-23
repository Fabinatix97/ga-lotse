/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.aggregation;

import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;

import de.eshg.base.user.api.UserDto;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.error.NotFoundException;
import de.eshg.rest.service.security.config.BaseUrls;
import de.eshg.statistics.api.EvaluationDto;
import de.eshg.statistics.api.report.GetReportDetailPageResponse;
import de.eshg.statistics.config.StatisticsFeature;
import de.eshg.statistics.config.StatisticsFeatureToggle;
import de.eshg.statistics.mapper.EvaluationMapper;
import de.eshg.statistics.mapper.StatisticMapper;
import de.eshg.statistics.persistence.entity.AggregationResultState;
import de.eshg.statistics.persistence.entity.report.Report;
import de.eshg.statistics.persistence.repository.ReportRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.service.annotation.GetExchange;
import org.springframework.web.service.annotation.HttpExchange;

@RestController
@HttpExchange(BaseUrls.Statistics.REPORT_URL)
@Tag(name = "Report")
public class ReportController {
  private final StatisticsFeatureToggle statisticsFeatureToggle;
  private final ReportRepository reportRepository;
  private final StatisticService statisticService;

  public ReportController(
      StatisticsFeatureToggle statisticsFeatureToggle,
      ReportRepository reportRepository,
      StatisticService statisticService) {
    this.statisticsFeatureToggle = statisticsFeatureToggle;
    this.reportRepository = reportRepository;
    this.statisticService = statisticService;
  }

  @GetExchange(value = "/{reportId}", accept = APPLICATION_JSON_VALUE)
  @ApiResponse(responseCode = "200", description = "The information for the detail page")
  @Operation(summary = "Get the information for the detail page")
  @Transactional(readOnly = true)
  public GetReportDetailPageResponse getReportDetailPage(
      @PathVariable(name = "reportId") UUID reportId) {
    statisticsFeatureToggle.assertNewFeatureIsEnabled(StatisticsFeature.REPORTS);

    Report report = getReportInternal(reportId);
    validateReportCompleted(report);
    Map<UUID, UserDto> resolvedUsers =
        statisticService.getResolvedUsers(Set.of(report.getCreatedByUserId()));
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
}
