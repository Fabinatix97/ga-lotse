/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.facility.websearch;

import static de.eshg.inspection.facility.websearch.SecurityHelper.runWithSecurityContextOfUser;
import static de.eshg.inspection.facility.websearch.persistence.WebSearchStatus.*;

import de.eshg.inspection.facility.websearch.persistence.WebSearch;
import de.eshg.inspection.facility.websearch.persistence.WebSearchRepository;
import java.util.List;
import java.util.UUID;
import net.javacrumbs.shedlock.core.LockAssert;
import net.javacrumbs.shedlock.spring.annotation.SchedulerLock;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class WebSearchJob {

  private static final Logger log = LoggerFactory.getLogger(WebSearchJob.class);

  private final WebSearchService webSearchService;
  private final WebSearchRepository webSearchRepository;

  public WebSearchJob(WebSearchService webSearchService, WebSearchRepository webSearchRepository) {
    this.webSearchService = webSearchService;
    this.webSearchRepository = webSearchRepository;
  }

  @Scheduled(cron = "${eshg.inspection.scheduling.job.websearch.cron}")
  @SchedulerLock(name = "scheduledTaskName")
  public void runJob() {
    LockAssert.assertLocked();
    log.info("job {} starts...", getClass().getSimpleName());
    try {
      List<WebSearch> websearches = webSearchRepository.findAllByStatusIn(NEW, IDLE, ERRONEOUS);
      for (WebSearch webSearch : websearches) {
        runWebSearch(webSearch);
      }
    } finally {
      log.info("job {} finished.", getClass().getSimpleName());
    }
  }

  private void runWebSearch(WebSearch webSearch) {
    UUID userId = webSearch.getCreatedBy();
    runWithSecurityContextOfUser(
        userId,
        () -> {
          webSearchService.setRunningState(webSearch.getId());
          webSearchService.executeWebSearch(webSearch.getId(), "automatic");
        });
  }
}
