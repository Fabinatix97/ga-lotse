/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.servicedirectory.logging;

import static de.eshg.lib.servicedirectory.ServiceDirectoryApi.GET_TRUSTED_ACTORS_FULL_PATH;

import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicInteger;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@EnableScheduling
public class GetTrustedActorsStatistics {

  private static final Logger logger = LoggerFactory.getLogger(GetTrustedActorsStatistics.class);

  AtomicInteger numberOfCalls = new AtomicInteger(0);

  public void increment() {
    numberOfCalls.incrementAndGet();
  }

  @Scheduled(fixedRate = 1, initialDelay = 1, timeUnit = TimeUnit.MINUTES)
  public void log() {
    int currentCount = numberOfCalls.getAndSet(0);
    logger.info(
        "GET {} called {} times in the last minute", GET_TRUSTED_ACTORS_FULL_PATH, currentCount);
  }
}
