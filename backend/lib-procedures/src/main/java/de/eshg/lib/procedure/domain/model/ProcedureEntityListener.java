/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.domain.model;

import jakarta.persistence.PrePersist;
import java.time.Clock;
import java.time.Instant;
import org.springframework.beans.factory.annotation.Configurable;

@Configurable
public class ProcedureEntityListener {

  private final Clock clock;

  public ProcedureEntityListener(Clock clock) {
    this.clock = clock;
  }

  @PrePersist
  private void beforeInsert(Procedure<?, ?, ?, ?> procedure) {
    Instant now = Instant.now(clock);
    if (procedure.getCreatedAt() == null) {
      procedure.setCreatedAt(now);
    }
  }
}
