/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.util;

import jakarta.validation.constraints.NotNull;
import java.io.Serial;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.concurrent.CustomizableThreadFactory;

public class NamedThreadFactory extends CustomizableThreadFactory {
  @Serial private static final long serialVersionUID = 1L;
  private static final Logger log = LoggerFactory.getLogger(NamedThreadFactory.class);

  public NamedThreadFactory(String threadNamePrefix) {
    super(threadNamePrefix);
  }

  @Override
  @NotNull
  public Thread createThread(@NotNull Runnable runnable) {
    Thread thread = super.createThread(runnable);
    thread.setUncaughtExceptionHandler((t, ex) -> log.error("unhandled exception in {}", t, ex));
    return thread;
  }
}
