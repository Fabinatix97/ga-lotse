/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.centralfile.rate.limit;

import com.github.benmanes.caffeine.cache.Cache;
import com.github.benmanes.caffeine.cache.Caffeine;
import com.google.common.annotations.VisibleForTesting;
import de.eshg.rest.service.error.RateLimitReachedException;
import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.TimeMeter;
import java.util.concurrent.TimeUnit;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@EnableConfigurationProperties(PartialPersonSearchGuardProperties.class)
public class PartialPersonSearchGuard {

  public static final String DEFAULT_BUCKET = "default";

  private final Cache<String, Bucket> buckets;
  private final TimeMeter timeMeter;
  private final PartialPersonSearchGuardProperties properties;

  public PartialPersonSearchGuard(
      PartialPersonSearchGuardProperties partialPersonSearchGuardProperties, TimeMeter timeMeter) {
    this.properties = partialPersonSearchGuardProperties;
    this.timeMeter = timeMeter;

    this.buckets =
        Caffeine.newBuilder().expireAfterAccess(10, TimeUnit.MINUTES).maximumSize(200).build();
  }

  private Bucket createBucket(String cacheKey) {
    Bandwidth bandwidth =
        Bandwidth.builder()
            .capacity(properties.getCapacity())
            .refillIntervally(properties.getCapacity(), properties.getIntervalInMinutes())
            .build();

    return Bucket.builder().withCustomTimePrecision(timeMeter).addLimit(bandwidth).build();
  }

  public void guard(String caller) {
    if (properties.isEnabled() && !isAllowed(caller)) {
      throw new RateLimitReachedException("Rate limit reached");
    }
  }

  public synchronized boolean isAllowed(String caller) {
    Bucket bucket = buckets.get(caller, this::createBucket);
    return bucket.tryConsume(1);
  }

  public synchronized void resetRateLimit() {
    buckets.invalidateAll();
  }

  @VisibleForTesting
  public void consumeTokens(int amount) {
    buckets.get(DEFAULT_BUCKET, this::createBucket).tryConsume(amount);
  }
}
