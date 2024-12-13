/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.medicalregistry;

import de.eshg.medicalregistry.config.MedicalRegistryProperties;
import de.eshg.medicalregistry.domain.repository.MedicalRegistryProcedureRepository;
import de.eshg.rest.service.error.RateLimitReachedException;
import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import org.springframework.stereotype.Component;

@Component
public class MedicalRegistryGuard {

  private final Bucket bucket;
  private final MedicalRegistryProperties medicalRegistryProperties;
  private final MedicalRegistryProcedureRepository medicalRegistryProcedureRepository;

  public MedicalRegistryGuard(
      MedicalRegistryProperties medicalRegistryProperties,
      MedicalRegistryProcedureRepository medicalRegistryProcedureRepository) {
    this.medicalRegistryProperties = medicalRegistryProperties;
    this.medicalRegistryProcedureRepository = medicalRegistryProcedureRepository;

    Bandwidth bandwidth =
        Bandwidth.builder()
            .capacity(medicalRegistryProperties.getRateLimitCapacity())
            .refillIntervally(
                medicalRegistryProperties.getRateLimitCapacity(),
                medicalRegistryProperties.getRateLimitIntervalMinutes())
            .build();

    bucket = Bucket.builder().addLimit(bandwidth).build();
  }

  public void guard() {
    if (isRateLimitReached()) {
      throw new RateLimitReachedException("Rate limit reached");
    }

    if (isCitizenDraftEntryLimitReached()) {
      throw new RateLimitReachedException("Draft entry limit reached");
    }
  }

  private boolean isRateLimitReached() {
    return !bucket.tryConsume(1);
  }

  private boolean isCitizenDraftEntryLimitReached() {
    return medicalRegistryProcedureRepository.numberOfCitizenDraftEntries()
        >= medicalRegistryProperties.getDraftEntryLimit();
  }

  public void resetRateLimit() {
    bucket.reset();
  }
}
