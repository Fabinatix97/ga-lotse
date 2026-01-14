/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.aggregation;

import de.eshg.logging.LoggingConstants;
import java.util.concurrent.Executor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;

public class CorrelationIdAwareExecutor implements Executor {

  private static final Logger log = LoggerFactory.getLogger(CorrelationIdAwareExecutor.class);

  private final Executor executor;

  public CorrelationIdAwareExecutor(Executor executor) {
    this.executor = executor;
  }

  @Override
  public final void execute(Runnable task) {
    this.executor.execute(wrap(task));
  }

  private static Runnable wrap(Runnable task) {
    String correlationId = MDC.get(LoggingConstants.CORRELATION_ID_MDC_KEY);
    if (correlationId == null) {
      return task;
    }
    return () -> {
      try (MDC.MDCCloseable mdcCloseable =
          MDC.putCloseable(LoggingConstants.CORRELATION_ID_MDC_KEY, correlationId)) {
        log.trace("{}", mdcCloseable);
        task.run();
      }
    };
  }
}
