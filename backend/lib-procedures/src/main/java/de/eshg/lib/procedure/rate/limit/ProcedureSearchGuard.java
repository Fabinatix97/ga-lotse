/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.rate.limit;

import de.eshg.rest.service.error.RateLimitReachedException;
import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.TimeMeter;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@EnableConfigurationProperties(ProcedureSearchGuardProperties.class)
public class ProcedureSearchGuard {

  private final boolean enabled;
  private final Bucket bucket;

  public ProcedureSearchGuard(
      ProcedureSearchGuardProperties procedureSearchProperties, TimeMeter timeMeter) {
    this.enabled = procedureSearchProperties.isEnabled();

    Bandwidth bandwidth =
        Bandwidth.builder()
            .capacity(procedureSearchProperties.getCapacity())
            .refillIntervally(
                procedureSearchProperties.getCapacity(),
                procedureSearchProperties.getIntervalInMinutes())
            .build();

    bucket = Bucket.builder().withCustomTimePrecision(timeMeter).addLimit(bandwidth).build();
  }

  public void guard() {
    if (enabled && !isAllowed()) {
      throw new RateLimitReachedException("Rate limit reached");
    }
  }

  public boolean isAllowed() {
    return bucket.tryConsume(1);
  }

  public void resetRateLimit() {
    bucket.reset();
  }
}
