/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.medicalregistry.config;

import jakarta.validation.constraints.Positive;
import java.time.Duration;
import java.time.temporal.ChronoUnit;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.convert.DurationUnit;

@ConfigurationProperties(prefix = "de.eshg.medical-registry")
public class MedicalRegistryProperties {

  @Positive
  @DurationUnit(ChronoUnit.MINUTES)
  private Duration rateLimitIntervalMinutes = Duration.ofMinutes(60);

  @Positive private int rateLimitCapacity = 60;

  @Positive private int draftEntryLimit = 1000;

  @Positive private int maxNumberOfImportRows = 4_005;

  @Positive private int maxImageSideLength = 5_000;

  public Duration getRateLimitIntervalMinutes() {
    return rateLimitIntervalMinutes;
  }

  public void setRateLimitIntervalMinutes(Duration rateLimitIntervalMinutes) {
    this.rateLimitIntervalMinutes = rateLimitIntervalMinutes;
  }

  public int getRateLimitCapacity() {
    return rateLimitCapacity;
  }

  public void setRateLimitCapacity(int rateLimitCapacity) {
    this.rateLimitCapacity = rateLimitCapacity;
  }

  public int getDraftEntryLimit() {
    return draftEntryLimit;
  }

  public void setDraftEntryLimit(int draftEntryLimit) {
    this.draftEntryLimit = draftEntryLimit;
  }

  public int getMaxNumberOfImportRows() {
    return maxNumberOfImportRows;
  }

  public void setMaxNumberOfImportRows(int maxNumberOfImportRows) {
    this.maxNumberOfImportRows = maxNumberOfImportRows;
  }

  public int getMaxImageSideLength() {
    return maxImageSideLength;
  }

  public void setMaxImageSideLength(int maxImageSideLength) {
    this.maxImageSideLength = maxImageSideLength;
  }
}
