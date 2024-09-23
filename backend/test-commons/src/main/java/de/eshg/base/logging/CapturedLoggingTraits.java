/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.logging;

import ch.qos.logback.classic.Level;
import ch.qos.logback.classic.spi.ILoggingEvent;
import de.cronn.assertions.validationfile.junit5.JUnit5ValidationFileAssertions;
import de.cronn.assertions.validationfile.normalization.ValidationNormalizer;
import de.cronn.commons.lang.Action;
import java.util.concurrent.Callable;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.springframework.web.servlet.DispatcherServlet;

public interface CapturedLoggingTraits extends JUnit5ValidationFileAssertions {

  Level DEFAULT_LOG_LEVEL = Level.DEBUG;

  default ValidationNormalizer defaultValidationNormalizer() {
    return ValidationNormalizer.doNothing();
  }

  default void withCapturedConsoleLogging(Action action) throws Exception {
    withCapturedConsoleLogging(action, EventFilter.all(), defaultValidationNormalizer());
  }

  default void withCapturedConsoleLogging(Action action, ValidationNormalizer validationNormalizer)
      throws Exception {
    withCapturedConsoleLogging(action, EventFilter.all(), validationNormalizer);
  }

  default void withCapturedConsoleLogging(Action action, EventFilter eventFilter, Level logLevel)
      throws Exception {
    withCapturedConsoleLogging(action, eventFilter, logLevel, defaultValidationNormalizer());
  }

  default void withCapturedConsoleLogging(
      Action action, EventFilter eventFilter, ValidationNormalizer validationNormalizer)
      throws Exception {
    withCapturedConsoleLogging(action, eventFilter, DEFAULT_LOG_LEVEL, validationNormalizer);
  }

  default void withCapturedConsoleLogging(
      Action action,
      EventFilter eventFilter,
      Level logLevel,
      ValidationNormalizer validationNormalizer)
      throws Exception {
    withCapturedConsoleLogging(
        action.toCallable(), "logging", logLevel, eventFilter, validationNormalizer);
  }

  default void withCapturedConsoleLogging(Action action, String suffix) throws Exception {
    withCapturedConsoleLogging(action.toCallable(), suffix);
  }

  default <T> T withCapturedConsoleLogging(Callable<T> callable) throws Exception {
    return withCapturedConsoleLogging(callable, "logging");
  }

  default <T> T withCapturedConsoleLogging(Callable<T> callable, String suffix) throws Exception {
    return withCapturedConsoleLogging(callable, suffix, EventFilter.all());
  }

  default <T> T withCapturedConsoleLogging(Callable<T> callable, EventFilter additionalFilter)
      throws Exception {
    return withCapturedConsoleLogging(callable, additionalFilter, defaultValidationNormalizer());
  }

  default <T> T withCapturedConsoleLogging(
      Callable<T> callable, EventFilter additionalFilter, ValidationNormalizer validationNormalizer)
      throws Exception {
    return withCapturedConsoleLogging(
        callable, "logging", DEFAULT_LOG_LEVEL, additionalFilter, validationNormalizer);
  }

  default <T> T withCapturedConsoleLogging(
      Callable<T> callable, String suffix, EventFilter additionalFilter) throws Exception {
    return withCapturedConsoleLogging(
        callable, suffix, DEFAULT_LOG_LEVEL, additionalFilter, defaultValidationNormalizer());
  }

  default <T> T withCapturedConsoleLogging(
      Callable<T> callable,
      String suffix,
      Level logLevel,
      EventFilter additionalFilter,
      ValidationNormalizer validationNormalizer)
      throws Exception {
    RenderingOptions renderingOptions = new RenderingOptions(true, 40, true);

    // Spring’s DispatcherServlet logs some messages when it is lazily initialized upon receiving
    // the first REST call.
    // Unfortunately, this results in non-deterministic log outputs in our validation files.
    // Therefore, we filter it out by default.
    EventFilter defaultEventFilter =
        event ->
            !isDispatcherServletInitializationLogging(event)
                && !event
                    .getFormattedMessage()
                    .contains(
                        "Reached the maximum number of URI tags for 'http.client.requests'. Are you using 'uriVariables'?");

    EventFilter eventFilter = defaultEventFilter.and(additionalFilter);

    try (CapturingAppender appender =
        CapturingAppender.create(
            Logger.ROOT_LOGGER_NAME, renderingOptions, eventFilter, logLevel)) {
      try {
        return callable.call();
      } finally {
        String events = appender.renderEvents().collect(Collectors.joining("\n"));
        assertWithFileWithSuffix(events, validationNormalizer, suffix);
      }
    }
  }

  private static boolean isDispatcherServletInitializationLogging(ILoggingEvent event) {
    String formattedMessage = event.getFormattedMessage();
    if (formattedMessage.contains("Initializing Spring DispatcherServlet")) {
      return true;
    }
    if (event.getLoggerName().equals(DispatcherServlet.class.getName())
        && event.getLevel().equals(Level.INFO)) {
      return formattedMessage.contains("Initializing Servlet")
          || formattedMessage.contains("Completed initialization");
    }
    return false;
  }
}
