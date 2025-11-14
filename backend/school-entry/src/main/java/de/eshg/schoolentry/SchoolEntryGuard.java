/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry;

import de.eshg.rest.service.error.RateLimitReachedException;
import de.eshg.schoolentry.config.SchoolEntryProperties;
import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.TimeMeter;
import org.springframework.stereotype.Component;

@Component
public class SchoolEntryGuard {

  private final Bucket vaccinationCheckBucket;

  public SchoolEntryGuard(SchoolEntryProperties schoolEntryProperties, TimeMeter timeMeter) {

    Bandwidth bandwidth =
        Bandwidth.builder()
            .capacity(schoolEntryProperties.getVaccinationCheckRateLimitCapacity())
            .refillIntervally(
                schoolEntryProperties.getVaccinationCheckRateLimitCapacity(),
                schoolEntryProperties.getVaccinationCheckRateLimitIntervalMinutes())
            .build();

    vaccinationCheckBucket =
        Bucket.builder().withCustomTimePrecision(timeMeter).addLimit(bandwidth).build();
  }

  public void guardVaccinationCheck() {
    if (!vaccinationCheckBucket.tryConsume(1)) {
      throw new RateLimitReachedException("Vaccination check rate limit reached!");
    }
  }

  public void resetRateLimits() {
    vaccinationCheckBucket.reset();
  }
}
