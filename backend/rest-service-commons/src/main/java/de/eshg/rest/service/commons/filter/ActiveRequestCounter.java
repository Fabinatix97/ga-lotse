/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.rest.service.commons.filter;

import de.eshg.testhelper.ConditionalOnTestHelperEnabled;
import java.time.Duration;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicLong;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.util.Assert;

@Component
@ConditionalOnTestHelperEnabled
public class ActiveRequestCounter {

  private static final Logger log = LoggerFactory.getLogger(ActiveRequestCounter.class);

  public static final Duration DEFAULT_TIMEOUT = Duration.ofSeconds(30);

  private final AtomicLong counter = new AtomicLong();
  private final List<CountDownLatch> latches = new ArrayList<>();

  public void start() {
    counter.incrementAndGet();
  }

  public void finish() {
    synchronized (latches) {
      long activeRequests = counter.decrementAndGet();
      if (activeRequests == 0) {
        if (!latches.isEmpty()) {
          log.trace("Last active request finished. Notifying {} latches.", latches.size());
        }
        latches.forEach(CountDownLatch::countDown);
        latches.clear();
      }
    }
  }

  public void waitUntilAllActiveRequestsFinished() throws InterruptedException {
    waitUntilAllActiveRequestsFinished(DEFAULT_TIMEOUT);
  }

  public void waitUntilAllActiveRequestsFinished(Duration timeout) throws InterruptedException {
    CountDownLatch latch = new CountDownLatch(1);
    synchronized (latches) {
      long activeRequests = counter.get();
      if (activeRequests == 0) {
        log.trace("No active requests");
        return;
      }
      log.trace("Waiting for {} active request(s) to finish", activeRequests);
      latches.add(latch);
    }
    boolean success = latch.await(timeout.toNanos(), TimeUnit.NANOSECONDS);
    Assert.isTrue(success, "Failed to wait for " + latch);
  }
}
