/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.filejockey;

import de.eshg.filejockey.config.FileJockeyProperties;
import de.eshg.rest.service.error.RateLimitReachedException;
import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.TimeMeter;
import java.util.EnumMap;
import java.util.Map;
import org.springframework.stereotype.Component;

@Component
public class FileIoRateLimiter {

  public enum Endpoint {
    PUT_INPUT_FILE,
    GET_OUTPUT_FILE,
    DELETE_FILES
  }

  private final Map<Endpoint, Bucket> buckets;

  public FileIoRateLimiter(FileJockeyProperties properties, TimeMeter timeMeter) {
    FileJockeyProperties.RateLimit rateLimit = properties.rateLimit;
    buckets = new EnumMap<>(Endpoint.class);
    for (Endpoint endpoint : Endpoint.values()) {
      Bandwidth bandwidth =
          Bandwidth.builder()
              .capacity(rateLimit.capacity())
              .refillIntervally(rateLimit.capacity(), rateLimit.intervalInMinutes())
              .build();
      buckets.put(
          endpoint,
          Bucket.builder().addLimit(bandwidth).withCustomTimePrecision(timeMeter).build());
    }
  }

  public void checkRateLimit(Endpoint endpoint) {
    if (!buckets.get(endpoint).tryConsume(1)) {
      throw new RateLimitReachedException("Rate limit reached");
    }
  }

  public void reset() {
    buckets.values().forEach(Bucket::reset);
  }
}
