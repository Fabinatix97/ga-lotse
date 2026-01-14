/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.testhelper;

import java.time.Clock;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

@ConditionalOnTestHelperEnabled
@Component
@Order(30)
public class TestHelperClockResetAction implements TestHelperServiceResetAction {

  private static final Logger log = LoggerFactory.getLogger(TestHelperClockResetAction.class);

  private final Clock clock;

  public TestHelperClockResetAction(Clock clock) {
    this.clock = clock;
  }

  @Override
  public void reset() {
    if (clock instanceof TestHelperClock testHelperClock) {
      testHelperClock.reset();
    } else {
      log.warn("Test clock is disabled");
    }
  }
}
