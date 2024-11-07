/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.aggregation;

import de.eshg.statistics.exception.IncompleteDeletionException;
import java.util.Set;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component
public class ReportSeriesExecution {
  private final ReportExecution reportExecution;
  private final ReportSeriesService reportSeriesService;

  private static final Logger log = LoggerFactory.getLogger(ReportSeriesExecution.class);

  public ReportSeriesExecution(
      ReportExecution reportExecution, ReportSeriesService reportSeriesService) {
    this.reportExecution = reportExecution;
    this.reportSeriesService = reportSeriesService;
  }

  public boolean deleteReportSeries(UUID reportSeriesId) {
    try {
      deleteReports(reportSeriesId);
      return true;
    } catch (Exception e) {
      log.error("Could not delete report series {}", reportSeriesId, e);
    }

    return false;
  }

  private void deleteReports(UUID reportSeriesId) {
    Set<UUID> reportIds = reportSeriesService.getReportIds(reportSeriesId);
    reportIds.forEach(
        reportId -> {
          if (!reportExecution.deleteReport(reportId)) {
            throw new IncompleteDeletionException();
          }
        });
  }
}
