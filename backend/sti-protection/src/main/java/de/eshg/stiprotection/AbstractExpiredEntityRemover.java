/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection;

import de.eshg.stiprotection.persistence.Pageables;
import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public abstract class AbstractExpiredEntityRemover<T> {

  protected final Logger log = LoggerFactory.getLogger(this.getClass());

  protected final Clock clock;
  protected final Duration expireAfter;
  protected final int pageSize;

  protected AbstractExpiredEntityRemover(Clock clock, Duration expireAfter, int pageSize) {
    this.clock = clock;
    this.expireAfter = expireAfter;
    this.pageSize = pageSize;
  }

  protected void run() {
    log.info("Starting removal process...");
    Instant retentionTime = Instant.now(clock).minus(expireAfter);
    log.debug(
        "expireAfter = {}, retentionTime = {}, pageSize = {}",
        expireAfter,
        retentionTime,
        pageSize);

    Pageable pageable = Pageable.ofSize(pageSize);
    Page<T> expiredPage;

    do {
      expiredPage = fetchExpiredEntities(retentionTime, pageable);
      List<T> expiredEntities = expiredPage.getContent();
      log.debug("Found {} expired entities in batch", expiredEntities.size());

      for (T entity : expiredEntities) {
        processEntity(entity);
      }

      pageable = Pageables.nextOrUnpaged(expiredPage);
    } while (!expiredPage.isLast());
    log.info("Removal process completed.");
  }

  protected abstract Page<T> fetchExpiredEntities(Instant retentionTime, Pageable pageable);

  protected abstract void processEntity(T entity);

  public Duration getExpireAfter() {
    return expireAfter;
  }
}
