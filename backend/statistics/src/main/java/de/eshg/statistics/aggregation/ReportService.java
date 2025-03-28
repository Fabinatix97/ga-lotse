/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.aggregation;

import de.eshg.base.user.api.UserDto;
import de.eshg.domain.model.BaseEntityWithExternalId;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.error.NotFoundException;
import de.eshg.statistics.StatisticsUserService;
import de.eshg.statistics.api.AnalysisDto;
import de.eshg.statistics.api.chart.HistogramChartConfigurationDto;
import de.eshg.statistics.api.evaluation.GetAttributesInformationResponse;
import de.eshg.statistics.api.report.GetReportDetailPageResponse;
import de.eshg.statistics.config.StatisticsConfig;
import de.eshg.statistics.mapper.AnalysisMapper;
import de.eshg.statistics.mapper.EvaluationMapper;
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
import java.util.HashSet;
import java.util.List;
import java.util.Map;
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
      AnalysisService analysisService) {
    super(dataSourceValidator, dataAggregationService, tableRowRepository, statisticsConfig);
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
      copyAnalysesWithEmptyDiagrams(report, evaluation);
      report.setPendingState(AggregationResultPendingState.DIAGRAM_CREATION);
    }
  }

  private void copyAnalysesWithEmptyDiagrams(Report report, Evaluation evaluation) {
    evaluation.getAnalyses().stream()
        .filter(analysis -> !analysis.getDiagrams().isEmpty())
        .forEach(analysis -> report.addAnalysis(copyAnalysisWithEmptyDiagrams(analysis, report)));
  }

  private Analysis copyAnalysisWithEmptyDiagrams(Analysis original, Report report) {
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
    analysis.setName(original.getName());
    analysis.setChartConfiguration(chartConfiguration);
    analysis.addDiagrams(
        EvaluationCopyService.copyDiagramsWithEmptyData(
            original.getDiagrams(), originalChartConfiguration));
    return analysis;
  }

  @Transactional
  public Optional<UUID> findDiagramWithEmptyDataOrCompleteReport(UUID reportId) {
    Report report = getReportInternal(reportId);
    Optional<UUID> diagramIdWithEmptyData =
        AnalysisService.findDiagram(report, Diagram::isDiagramDataEmpty)
            .map(BaseEntityWithExternalId::getExternalId);
    if (diagramIdWithEmptyData.isEmpty()) {
      finishReport(report);
    }
    return diagramIdWithEmptyData;
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

  @Transactional(readOnly = true)
  public GetAttributesInformationResponse getAttributesInformation(UUID reportId) {
    Report report = getReportInternal(reportId);
    return EvaluationMapper.getAttributesInformation(report);
  }
}
