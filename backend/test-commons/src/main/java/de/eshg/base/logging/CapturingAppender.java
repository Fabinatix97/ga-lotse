/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.logging;

import ch.qos.logback.classic.Level;
import ch.qos.logback.classic.spi.ILoggingEvent;
import ch.qos.logback.core.AppenderBase;
import java.util.Deque;
import java.util.concurrent.ConcurrentLinkedDeque;
import java.util.stream.Stream;
import org.slf4j.LoggerFactory;

class CapturingAppender extends AppenderBase<ILoggingEvent> implements AutoCloseable {

  private final ch.qos.logback.classic.Logger logger;
  private final Level previousLoggerLevel;

  private final Deque<RenderingLoggingEvent> events = new ConcurrentLinkedDeque<>();

  private final Level threshold;
  private final RenderingOptions renderingOptions;
  private final EventFilter loggingFilter;

  static CapturingAppender create(
      String loggerName,
      RenderingOptions renderingOptions,
      EventFilter loggingFilter,
      Level logLevel) {
    CapturingAppender capturingAppender =
        new CapturingAppender(loggerName, renderingOptions, loggingFilter, logLevel);
    capturingAppender.start();
    return capturingAppender;
  }

  private CapturingAppender(
      String loggerName,
      RenderingOptions renderingOptions,
      EventFilter loggingFilter,
      Level logLevel) {
    this.renderingOptions = renderingOptions;
    this.loggingFilter = loggingFilter;
    this.threshold = logLevel;
    this.logger = (ch.qos.logback.classic.Logger) LoggerFactory.getLogger(loggerName);
    this.previousLoggerLevel = logger.getLevel();
    this.logger.addAppender(this);
  }

  @Override
  public void close() {
    if (logger != null) {
      logger.detachAppender(this);
      logger.setLevel(previousLoggerLevel);
    }
  }

  @Override
  protected void append(ILoggingEvent loggingEvent) {
    synchronized (events) {
      if (loggingEvent.getLevel().isGreaterOrEqual(threshold)
          && loggingFilter.shouldCapture(loggingEvent)) {
        events.add(new RenderingLoggingEvent(loggingEvent, renderingOptions));
      }
    }
  }

  private int getMaxPrefixLength() {
    return events.stream().mapToInt(RenderingLoggingEvent::getPrefixLength).max().orElse(0);
  }

  Stream<String> renderEvents() {
    synchronized (events) {
      int maxPrefixLength = getMaxPrefixLength();
      return events.stream().map(event -> event.render(maxPrefixLength));
    }
  }
}
