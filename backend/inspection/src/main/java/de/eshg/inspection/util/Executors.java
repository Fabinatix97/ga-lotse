/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.util;

import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.concurrent.TimeUnit;

public interface Executors {
  static ThreadPoolExecutor createQueueingExecutor(String threadNamePrefix, int capacity) {
    return new ThreadPoolExecutor(
        Runtime.getRuntime().availableProcessors(),
        Runtime.getRuntime().availableProcessors(),
        1,
        TimeUnit.MINUTES,
        new ArrayBlockingQueue<>(capacity),
        new NamedThreadFactory(threadNamePrefix),
        new ThreadPoolExecutor.AbortPolicy());
  }
}
