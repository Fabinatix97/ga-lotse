/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.user;

import de.eshg.rest.service.error.RateLimitReachedException;
import de.eshg.rest.service.security.CurrentUserHelper;
import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.TimeMeter;
import java.time.Clock;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;
import org.springframework.stereotype.Component;

@Component
public class UserControllerRateLimiter {
  private final RateLimitProperties properties;
  private final ConcurrentMap<UUID, Bucket> suggestUserBuckets = new ConcurrentHashMap<>();
  private final TimeMeter clockAwareTimeMeter;

  public UserControllerRateLimiter(RateLimitProperties properties, Clock clock) {
    this.properties = properties;
    this.clockAwareTimeMeter = new ClockAwareTimeMeter(clock);
  }

  public void reset() {
    suggestUserBuckets.clear();
  }

  public void suggestUser() {
    Bucket bucket = getSuggestUserBucket();
    checkRateLimit(bucket);
  }

  private Bandwidth getSuggestUserBandwidth() {
    return Bandwidth.builder()
        .capacity(properties.suggestUsers().capacity())
        .refillIntervally(
            properties.suggestUsers().capacity(), properties.suggestUsers().resetInterval())
        .build();
  }

  private Bucket getSuggestUserBucket() {
    UUID userId = CurrentUserHelper.getCurrentUserId();
    return suggestUserBuckets.computeIfAbsent(
        userId,
        (key) ->
            Bucket.builder()
                .addLimit(getSuggestUserBandwidth())
                .withCustomTimePrecision(this.clockAwareTimeMeter)
                .build());
  }

  private static void checkRateLimit(Bucket bucket) {
    if (isRateLimitReached(bucket)) {
      throw new RateLimitReachedException("Rate limit reached");
    }
  }

  private static boolean isRateLimitReached(Bucket bucket) {
    return !bucket.tryConsume(1);
  }

  private record ClockAwareTimeMeter(Clock clock) implements TimeMeter {

    @Override
    public long currentTimeNanos() {
      return clock.millis() * 1_000_000;
    }

    @Override
    public boolean isWallClockBased() {
      return true;
    }
  }
}
