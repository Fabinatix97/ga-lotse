/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.rest.service.common;

import ch.qos.logback.classic.Level;
import de.cronn.assertions.validationfile.normalization.IdNormalizer;
import de.cronn.assertions.validationfile.normalization.IncrementingIdProvider;
import de.cronn.assertions.validationfile.normalization.SimpleRegexReplacement;
import de.cronn.assertions.validationfile.normalization.ValidationNormalizer;
import de.cronn.commons.lang.Action;
import de.eshg.base.logging.CapturedLoggingTraits;
import de.eshg.base.logging.EventFilter;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;
import org.zalando.logbook.Logbook;

public interface CapturedRequestLoggingTraits extends CapturedLoggingTraits {

  @Override
  default ValidationNormalizer defaultValidationNormalizer() {
    return ValidationNormalizer.combine(
        CapturedLoggingTraits.super.defaultValidationNormalizer(),
        getDateTimeNormalizer(),
        getMessageIdNormalizer(),
        getDurationNormalizer(),
        getUserAgentVersionNormalizer());
  }

  default void withCaptureRequestResponseConsoleLogging(Action action) throws Exception {
    // Waits for request and response to be logged.
    // Due to LoggingFilter to have the highest precedence the response may already be sent when it
    // is finished.
    CountDownLatch requestResponseCountDownLatch = new CountDownLatch(2);
    withCapturedConsoleLogging(
        () -> {
          action.execute();
          requestResponseCountDownLatch.await(1, TimeUnit.MINUTES);
        },
        countDownOnLogbookLogEventFilter(requestResponseCountDownLatch),
        Level.TRACE);
  }

  private EventFilter countDownOnLogbookLogEventFilter(CountDownLatch countDownLatch) {
    return (logEvent) -> {
      if (Logbook.class.getName().equals(logEvent.getLoggerName())) {
        countDownLatch.countDown();
      }
      return true;
    };
  }

  private ValidationNormalizer getDateTimeNormalizer() {
    return new SimpleRegexReplacement("Date: .+", "Date: MASKED-DATE");
  }

  private ValidationNormalizer getMessageIdNormalizer() {
    return new IdNormalizer(new IncrementingIdProvider(), "MASKED-MESSAGE-ID-", "([0-9a-f]{16})");
  }

  private ValidationNormalizer getDurationNormalizer() {
    return new SimpleRegexReplacement("Duration: \\d+ ms\n", "Duration: MASKED-DURATION ms\n");
  }

  private ValidationNormalizer getUserAgentVersionNormalizer() {
    return new SimpleRegexReplacement("user-agent: .*\n", "user-agent: MASKED-USER-AGENT\n");
  }
}
