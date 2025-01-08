/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.mapper;

import de.eshg.statistics.api.report.FrequencyDto;
import de.eshg.statistics.api.report.ReportDataSensitivity;
import de.eshg.statistics.api.report.ReportInfoDto;
import de.eshg.statistics.api.report.ReportSeriesDto;
import de.eshg.statistics.api.report.ReportStateDto;
import de.eshg.statistics.api.report.ReportTypeDto;
import de.eshg.statistics.api.report.ReportingPeriodDto;
import de.eshg.statistics.persistence.entity.AggregationResultState;
import de.eshg.statistics.persistence.entity.StatisticsDataSensitivity;
import de.eshg.statistics.persistence.entity.report.Frequency;
import de.eshg.statistics.persistence.entity.report.Report;
import de.eshg.statistics.persistence.entity.report.ReportSeries;
import de.eshg.statistics.persistence.entity.report.ReportType;
import de.eshg.statistics.persistence.entity.report.ReportingPeriod;
import java.util.Optional;
import java.util.function.Predicate;
import java.util.stream.Stream;

public class ReportMapper {
  private ReportMapper() {}

  public static ReportSeriesDto mapToApi(
      ReportSeries reportSeries, Predicate<Report> isTooMuchDataForExportPredicate) {
    return mapToApi(
        reportSeries, reportSeries.getReports().stream(), isTooMuchDataForExportPredicate);
  }

  public static ReportSeriesDto mapToApi(
      ReportSeries reportSeries,
      Stream<Report> reportStream,
      Predicate<Report> isTooMuchDataForExportPredicate) {
    return new ReportSeriesDto(
        reportSeries.getExternalId(),
        reportSeries.getCreatedByUserId(),
        reportSeries.getName(),
        reportSeries.getDescription(),
        reportSeries.getTimeRangeStart(),
        reportSeries.getTimeRangeEnd(),
        reportSeries.getEvaluation().getExternalId(),
        mapToReportTypeDto(reportSeries.getReportType()),
        reportSeries.getReportType().equals(ReportType.AUTO) ? reportSeries.isActive() : null,
        reportSeries.getReportType().equals(ReportType.AUTO) ? reportSeries.getStartMonth() : null,
        mapToFrequencyDto(reportSeries.getFrequency()),
        mapToReportingPeriodDto(reportSeries.getPeriod()),
        EvaluationMapper.getDataSourceNames(reportSeries.getEvaluation()),
        reportStream
            .map(report -> mapToReportInfoDto(report, isTooMuchDataForExportPredicate.test(report)))
            .toList());
  }

  public static ReportTypeDto mapToReportTypeDto(ReportType reportType) {
    return ReportTypeDto.valueOf(reportType.name());
  }

  private static FrequencyDto mapToFrequencyDto(Frequency frequency) {
    return Optional.ofNullable(frequency).map(f -> FrequencyDto.valueOf(f.name())).orElse(null);
  }

  private static ReportingPeriodDto mapToReportingPeriodDto(ReportingPeriod reportingPeriod) {
    return Optional.ofNullable(reportingPeriod)
        .map(r -> ReportingPeriodDto.valueOf(r.name()))
        .orElse(null);
  }

  private static ReportInfoDto mapToReportInfoDto(Report report, boolean isTooMuchDataForExport) {
    return new ReportInfoDto(
        report.getExternalId(),
        report.getName(),
        report.getTimeRangeStart(),
        report.getTimeRangeEnd(),
        mapToReportStateDto(report.getState()),
        report.getExecutionDate(),
        report.getState().equals(AggregationResultState.COMPLETED)
            ? report.getNumberOfTableRows()
            : null,
        isTooMuchDataForExport,
        ReportMapper.mapToApi(report.getDataSensitivity()));
  }

  private static ReportStateDto mapToReportStateDto(AggregationResultState state) {
    return ReportStateDto.valueOf(state.name());
  }

  public static ReportType mapToReportType(ReportTypeDto reportType) {
    return ReportType.valueOf(reportType.name());
  }

  public static Frequency mapToFrequency(FrequencyDto frequency) {
    return Frequency.valueOf(frequency.name());
  }

  public static ReportingPeriod mapToReportingPeriod(ReportingPeriodDto reportingPeriod) {
    return ReportingPeriod.valueOf(reportingPeriod.name());
  }

  public static StatisticsDataSensitivity mapToPersistence(ReportDataSensitivity dataSensitivity) {
    return StatisticsDataSensitivity.valueOf(dataSensitivity.name());
  }

  public static ReportDataSensitivity mapToApi(StatisticsDataSensitivity dataSensitivity) {
    return ReportDataSensitivity.valueOf(dataSensitivity.name());
  }
}
