/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.gdpr;

import de.eshg.base.gdpr.persistence.repository.GdprProcedureRepository;
import de.eshg.lib.rest.oauth.client.commons.ModuleClientAuthenticator;
import de.eshg.persistence.TransactionHelper;
import java.time.Clock;
import java.time.Instant;
import java.time.Period;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.UUID;
import net.javacrumbs.shedlock.core.LockAssert;
import net.javacrumbs.shedlock.spring.annotation.SchedulerLock;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.PageRequest;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
public class GdprCleanupJob {
  private static final Logger log = LoggerFactory.getLogger(GdprCleanupJob.class);

  private final ModuleClientAuthenticator moduleClientAuthenticator;
  private final GdprProcedureRepository gdprProcedureRepository;
  private final TransactionHelper transactionHelper;
  private final GdprProcedureService gdprProcedureService;
  private final Clock clock;
  private final int batchSize;

  public GdprCleanupJob(
      ModuleClientAuthenticator moduleClientAuthenticator,
      GdprProcedureRepository gdprProcedureRepository,
      TransactionHelper transactionHelper,
      GdprProcedureService gdprProcedureService,
      Clock clock,
      @Value("${eshg.gdpr.cleanup.batch-size:500}") int batchSize) {
    this.moduleClientAuthenticator = moduleClientAuthenticator;
    this.gdprProcedureRepository = gdprProcedureRepository;
    this.transactionHelper = transactionHelper;
    this.gdprProcedureService = gdprProcedureService;
    this.clock = clock;
    this.batchSize = batchSize;
  }

  @Scheduled(cron = "${eshg.gdpr.cleanup.cron}")
  @SchedulerLock(name = "GdprCleanupJob", lockAtMostFor = "1h", lockAtLeastFor = "1m")
  public void executeScheduledCleanup() {
    LockAssert.assertLocked();
    performGdprCleanup();
  }

  public void performGdprCleanup() {
    log.info("Starting GDPR cleanup job...");
    deleteGdprProceduresSafely(findExpiredGdprProcedureIds());
    log.info("GDPR cleanup job completed.");
  }

  private void deleteGdprProceduresSafely(List<UUID> procedureIds) {
    int total = procedureIds.size();
    int failed = 0;
    log.info("Selected {} GDPR procedure(s) for deletion.", total);

    for (UUID id : procedureIds) {
      try {
        moduleClientAuthenticator.doWithModuleClientAuthentication(
            () ->
                transactionHelper.executeInNewTransaction(
                    () -> gdprProcedureService.deleteProcedure(id)));
      } catch (Exception e) {
        failed++;
        log.error("Failed to clean up GDPR procedure with ID: {}.", id, e);
      }
    }
    log.info("GDPR cleanup job processed {} procedures. {} failed.", total, failed);
  }

  private List<UUID> findExpiredGdprProcedureIds() {
    ZonedDateTime now = ZonedDateTime.now(clock);
    ZonedDateTime cutoffZdt = now.minus(Period.ofDays(30));
    Instant cutOffDate = cutoffZdt.toInstant();
    log.debug("Cut-off date: {}", cutOffDate);
    return gdprProcedureRepository.findIdsOfYoungestExpiredProcedures(cutOffDate, maxResults());
  }

  private PageRequest maxResults() {
    return PageRequest.of(0, batchSize);
  }
}
