/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.logging;

import ch.qos.logback.classic.spi.ILoggingEvent;

@FunctionalInterface
public interface EventFilter {

  boolean shouldCapture(ILoggingEvent loggingEvent);

  static EventFilter all() {
    return event -> true;
  }

  default EventFilter and(EventFilter otherEventFilter) {
    return event -> shouldCapture(event) && otherEventFilter.shouldCapture(event);
  }
}
