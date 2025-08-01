/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.servicedirectory.logging;

import static de.eshg.lib.servicedirectory.ServiceDirectoryApi.GET_TRUSTED_ACTORS_FULL_PATH;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
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

  Map<String, AtomicInteger> numberOfCalls = new ConcurrentHashMap<>();

  public void increment(String eTag) {
    numberOfCalls.computeIfAbsent(eTag, k -> new AtomicInteger()).incrementAndGet();
  }

  @Scheduled(fixedRate = 15, initialDelay = 1, timeUnit = TimeUnit.MINUTES)
  public void log() {
    logger.info(
        "GET {} requests in the last 15 minutes by response ETag: {}",
        GET_TRUSTED_ACTORS_FULL_PATH,
        numberOfCalls);
    numberOfCalls.clear();
  }
}
