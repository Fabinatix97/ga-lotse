/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.jpaauditing;

import java.time.Clock;
import java.time.Instant;
import java.time.temporal.TemporalAccessor;
import java.util.Optional;
import org.springframework.data.auditing.DateTimeProvider;
import org.springframework.stereotype.Component;

@Component(JpaAuditingAutoConfiguration.DATE_TIME_PROVIDER_BEAN_NAME)
class ClockAsDateTimeProvider implements DateTimeProvider {
  private final Clock clock;

  ClockAsDateTimeProvider(Clock clock) {
    this.clock = clock;
  }

  @Override
  public Optional<TemporalAccessor> getNow() {
    return Optional.of(Instant.now(clock));
  }
}
