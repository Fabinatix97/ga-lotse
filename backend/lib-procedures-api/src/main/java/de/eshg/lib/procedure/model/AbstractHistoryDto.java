/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.model;

import jakarta.validation.constraints.NotNull;
import java.time.Instant;

public class AbstractHistoryDto {

  @NotNull private Instant changedAt;

  public void setChangedAt(Instant changedAt) {
    this.changedAt = changedAt;
  }

  public Instant getChangedAt() {
    return changedAt;
  }
}
