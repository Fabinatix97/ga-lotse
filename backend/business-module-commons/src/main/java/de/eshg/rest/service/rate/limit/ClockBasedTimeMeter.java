/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.rest.service.rate.limit;

import io.github.bucket4j.TimeMeter;
import io.github.bucket4j.local.LocalBucketBuilder;
import java.time.Clock;
import java.util.concurrent.TimeUnit;
import org.springframework.boot.autoconfigure.AutoConfiguration;
import org.springframework.boot.autoconfigure.condition.ConditionalOnClass;

/**
 * This class is only loaded as bean when {@code com.bucket4j:bucket4j-core} is loaded as runtime
 * dependency. Via {@link ClockBasedTimeMeter} the {@link Clock} from the application context is
 * used as a ground for bandwidth refills, ... on {@link io.github.bucket4j.Bucket}s. Use it during
 * initialization of your {@link io.github.bucket4j.Bucket} by calling {@link
 * LocalBucketBuilder#withCustomTimePrecision(TimeMeter)} to avoid flaky tests due to unexpected
 * refills of bandwiths.
 */
@AutoConfiguration
@ConditionalOnClass(TimeMeter.class)
class ClockBasedTimeMeter implements TimeMeter {

  private final Clock clock;

  public ClockBasedTimeMeter(Clock clock) {
    this.clock = clock;
  }

  @Override
  public long currentTimeNanos() {
    return TimeUnit.MILLISECONDS.toNanos(clock.millis());
  }

  @Override
  public boolean isWallClockBased() {
    return true;
  }
}
