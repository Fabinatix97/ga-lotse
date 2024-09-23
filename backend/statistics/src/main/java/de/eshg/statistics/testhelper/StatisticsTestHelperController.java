/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.testhelper;

import de.eshg.auditlog.AuditLogTestHelperApi;
import de.eshg.lib.auditlog.AuditLogTestHelperService;
import de.eshg.statistics.config.StatisticsFeature;
import de.eshg.statistics.config.StatisticsFeatureToggle;
import de.eshg.testhelper.ConditionalOnTestHelperEnabled;
import de.eshg.testhelper.DefaultTestHelperService;
import de.eshg.testhelper.TestHelperController;
import java.io.IOException;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.service.annotation.PostExchange;

@RestController
@ConditionalOnTestHelperEnabled
public class StatisticsTestHelperController extends TestHelperController
    implements AuditLogTestHelperApi {

  private final StatisticsFeatureToggle statisticsFeatureToggle;
  private final AuditLogTestHelperService auditLogTestHelperService;

  public StatisticsTestHelperController(
      StatisticsFeatureToggle statisticsFeatureToggle,
      DefaultTestHelperService testHelperService,
      AuditLogTestHelperService auditLogTestHelperService) {
    super(testHelperService);
    this.statisticsFeatureToggle = statisticsFeatureToggle;
    this.auditLogTestHelperService = auditLogTestHelperService;
  }

  @PostExchange("/enabled-new-features/{featureToEnable}")
  public void enableNewFeature(@PathVariable("featureToEnable") StatisticsFeature featureToEnable) {
    statisticsFeatureToggle.enableNewFeature(featureToEnable);
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
