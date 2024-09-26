/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.model;

import jakarta.validation.constraints.NotNull;
import java.time.Instant;
import java.util.UUID;

public class AbstractHistoryDto {

  @NotNull private UUID changedBy;
  @NotNull private Instant changedAt;

  public void setChangedAt(Instant changedAt) {
    this.changedAt = changedAt;
  }

  public void setChangedBy(UUID changedBy) {
    this.changedBy = changedBy;
  }

  public UUID getChangedBy() {
    return changedBy;
  }

  public Instant getChangedAt() {
    return changedAt;
  }
}
