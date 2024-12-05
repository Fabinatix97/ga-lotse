/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.testhelper;

import de.eshg.auditlog.SharedAuditLogTestHelperApi;
import de.eshg.lib.auditlog.AuditLogTestHelperService;
import de.eshg.statistics.aggregation.ReportExecution;
import de.eshg.statistics.aggregation.StatisticsExecutorService;
import de.eshg.statistics.config.StatisticsFeature;
import de.eshg.statistics.config.StatisticsFeatureToggle;
import de.eshg.testhelper.ConditionalOnTestHelperEnabled;
import de.eshg.testhelper.DefaultTestHelperService;
import de.eshg.testhelper.TestHelperController;
import de.eshg.testhelper.environment.EnvironmentConfig;
import java.io.IOException;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.service.annotation.PostExchange;

@RestController
@ConditionalOnTestHelperEnabled
public class StatisticsTestHelperController extends TestHelperController
    implements SharedAuditLogTestHelperApi {

  private final StatisticsFeatureToggle statisticsFeatureToggle;
  private final AuditLogTestHelperService auditLogTestHelperService;
  private final StatisticsExecutorService statisticsExecutorService;
  private final ReportExecution reportExecution;

  public StatisticsTestHelperController(
      StatisticsFeatureToggle statisticsFeatureToggle,
      DefaultTestHelperService testHelperService,
      AuditLogTestHelperService auditLogTestHelperService,
      ReportExecution reportExecution,
      EnvironmentConfig environmentConfig,
      StatisticsExecutorService statisticsExecutorService) {
    super(testHelperService, environmentConfig);
    this.statisticsFeatureToggle = statisticsFeatureToggle;
    this.auditLogTestHelperService = auditLogTestHelperService;
    this.reportExecution = reportExecution;
    this.statisticsExecutorService = statisticsExecutorService;
  }

  @PostExchange("/enabled-new-features/{featureToEnable}")
  public void enableNewFeature(@PathVariable("featureToEnable") StatisticsFeature featureToEnable) {
    statisticsFeatureToggle.enableNewFeature(featureToEnable);
  }

  @PostExchange("/finish-auto-reports")
  public void finishAutoReports() {
    statisticsExecutorService.submit(reportExecution::handlePlannedReportsInternal);
  }

  @Override
  public void clearAuditLogStorageDirectory() throws IOException {
    auditLogTestHelperService.clearAuditLogStorageDirectory();
  }

  @Override
  public void runArchivingJob() {
    auditLogTestHelperService.runArchivingJob();
  }
}
