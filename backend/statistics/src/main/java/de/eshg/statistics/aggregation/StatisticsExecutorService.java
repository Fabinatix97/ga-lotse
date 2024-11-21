/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.aggregation;

import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicBoolean;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.concurrent.CustomizableThreadFactory;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;

@Service
public class StatisticsExecutorService {
  private static final Logger log = LoggerFactory.getLogger(StatisticsExecutorService.class);
  private static final String EXECUTOR_SERVICE_NAME =
      StatisticsExecutorService.class.getSimpleName();
  private static final int TIMEOUT_MILLIS = 1000;

  private ExecutorService executorService;
  private final AtomicBoolean isStarted = new AtomicBoolean(false);

  @PostConstruct
  public void start() {
    if (isStarted.compareAndSet(false, true)) {
      executorService =
          Executors.newFixedThreadPool(
              8, new CustomizableThreadFactory(EXECUTOR_SERVICE_NAME + "-"));
    }
  }

  @PreDestroy
  public void stop() throws InterruptedException {
    if (isStarted.compareAndSet(true, false)) {
      executorService.shutdown();
      clearQueue(executorService);
      boolean success = executorService.awaitTermination(TIMEOUT_MILLIS, TimeUnit.MILLISECONDS);
      if (success) {
        log.info("Finished shutdown of '{}'", EXECUTOR_SERVICE_NAME);
      } else if (executorService instanceof ThreadPoolExecutor threadPoolExecutor) {
        log.warn(
            "Shutdown of '{}' timed out after {} ms. Active tasks: {}",
            EXECUTOR_SERVICE_NAME,
            TIMEOUT_MILLIS,
            threadPoolExecutor.getActiveCount());
      } else {
        log.warn("Shutdown of '{}' timed out after {} ms.", EXECUTOR_SERVICE_NAME, TIMEOUT_MILLIS);
      }
      executorService = null;
    }
  }

  private static void clearQueue(ExecutorService executorService) {
    if (executorService instanceof ThreadPoolExecutor threadPoolExecutor) {
      BlockingQueue<Runnable> queue = threadPoolExecutor.getQueue();
      if (!queue.isEmpty()) {
        int queueSize = queue.size();
        log.warn(
            "Clearing approximately {} elements from queue of '{}'",
            queueSize,
            EXECUTOR_SERVICE_NAME);
        queue.clear();
      }
    }
  }

  public void submit(Runnable runnable) {
    Assert.isTrue(isStarted.get(), "Executor service must be started");
    executorService.submit(runnable);
  }
}
