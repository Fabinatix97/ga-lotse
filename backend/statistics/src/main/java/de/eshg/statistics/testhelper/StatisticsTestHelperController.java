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
import java.util.List;
import java.util.UUID;
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
  private final StatisticsPopulator statisticsPopulator;

  public StatisticsTestHelperController(
      StatisticsFeatureToggle statisticsFeatureToggle,
      DefaultTestHelperService testHelperService,
      AuditLogTestHelperService auditLogTestHelperService,
      ReportExecution reportExecution,
      EnvironmentConfig environmentConfig,
      StatisticsExecutorService statisticsExecutorService,
      StatisticsPopulator statisticsPopulator) {
    super(testHelperService, environmentConfig);
    this.statisticsFeatureToggle = statisticsFeatureToggle;
    this.auditLogTestHelperService = auditLogTestHelperService;
    this.reportExecution = reportExecution;
    this.statisticsExecutorService = statisticsExecutorService;
    this.statisticsPopulator = statisticsPopulator;
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

  @PostExchange("/populate-create-evaluation")
  public UUID createEvaluation() {
    for (StatisticsFeature statisticsFeature :
        List.of(StatisticsFeature.REPORTS, StatisticsFeature.FAKE_ANONYMIZATION)) {
      if (!statisticsFeatureToggle.isNewFeatureEnabled(statisticsFeature)) {
        statisticsFeatureToggle.enableNewFeature(statisticsFeature);
      }
    }
    return statisticsPopulator.addEvaluationSchoolEntry();
  }

  @PostExchange("/populate-based-on-evaluation/{evaluationId}")
  public void createOtherEntities(@PathVariable("evaluationId") UUID evaluationId) {
    statisticsPopulator.createEntitiesForEvaluation(evaluationId);
  }

  @Override
  public void runArchivingJob() {
    auditLogTestHelperService.runArchivingJob();
  }
}
