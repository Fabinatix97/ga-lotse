/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.measlesprotection.validation;

import jakarta.validation.ClockProvider;
import java.time.Clock;
import org.springframework.stereotype.Component;

@Component
public class InjectableClockProvider implements ClockProvider {

  private final Clock clock;

  public InjectableClockProvider(Clock clock) {
    this.clock = clock;
  }

  @Override
  public Clock getClock() {
    return clock;
  }
}
