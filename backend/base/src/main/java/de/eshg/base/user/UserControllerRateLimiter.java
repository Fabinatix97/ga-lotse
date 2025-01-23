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
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;
import org.springframework.stereotype.Component;

@Component
public class UserControllerRateLimiter {
  private final RateLimitProperties properties;
  private final ConcurrentMap<UUID, Bucket> suggestUserBuckets = new ConcurrentHashMap<>();
  private final TimeMeter timeMeter;

  public UserControllerRateLimiter(RateLimitProperties properties, TimeMeter timeMeter) {
    this.properties = properties;
    this.timeMeter = timeMeter;
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
                .withCustomTimePrecision(timeMeter)
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
}
