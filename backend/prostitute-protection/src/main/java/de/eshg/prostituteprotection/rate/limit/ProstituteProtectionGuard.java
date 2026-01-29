/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.prostituteprotection.rate.limit;

import de.eshg.prostituteprotection.config.ProstituteProtectionProperties;
import de.eshg.rest.service.error.RateLimitReachedException;
import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.TimeMeter;
import org.springframework.stereotype.Component;

@Component
public class ProstituteProtectionGuard {

  private final Bucket bucket;

  public ProstituteProtectionGuard(ProstituteProtectionProperties properties, TimeMeter timeMeter) {

    Bandwidth bandwidth =
        Bandwidth.builder()
            .capacity(properties.getRateLimitCapacity())
            .refillIntervally(
                properties.getRateLimitCapacity(), properties.getRateLimitIntervalMinutes())
            .build();

    bucket = Bucket.builder().withCustomTimePrecision(timeMeter).addLimit(bandwidth).build();
  }

  public void guard() {
    if (isRateLimitReached()) {
      throw new RateLimitReachedException("Rate limit reached");
    }
  }

  private boolean isRateLimitReached() {
    return !bucket.tryConsume(1);
  }

  public void resetRateLimit() {
    bucket.reset();
  }
}
