/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.xlsximport.model;

import de.eshg.lib.xlsximport.api.ImportStatisticsDto;

public class ImportStatistics {
  private int created = 0;
  private int merged = 0;
  private int mergeFailed = 0;
  private int duplicated = 0;
  private int failed = 0;
  private int previouslyImported = 0;

  public void countCreated() {
    created++;
  }

  public void countMerged() {
    merged++;
  }

  public void countMergeFailed() {
    mergeFailed++;
  }

  public void countDuplicated() {
    duplicated++;
  }

  public void countFailed() {
    failed++;
  }

  public void countPreviouslyImported() {
    previouslyImported++;
  }

  public void correctMergeToFailed(int count) {
    if (merged < count) {
      throw new IllegalStateException("Count correction failed.");
    }
    merged -= count;
    mergeFailed += count;
  }

  public void correctCreatedToFailed(int count) {
    if (created < count) {
      throw new IllegalStateException("Count correction failed.");
    }
    created -= count;
    failed += count;
  }

  public ImportStatisticsDto mapToDto() {
    return new ImportStatisticsDto(
        created + merged + mergeFailed + duplicated + failed + previouslyImported,
        created,
        merged,
        mergeFailed,
        duplicated,
        failed);
  }
}
