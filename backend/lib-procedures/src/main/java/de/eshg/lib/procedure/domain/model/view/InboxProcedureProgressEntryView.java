/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.domain.model.view;

import de.eshg.lib.procedure.domain.model.InboxProcedure;
import java.util.UUID;

public record InboxProcedureProgressEntryView(Long id, UUID externalId) {

  public InboxProcedure asInboxProcedure() {
    return new InboxProcedure() {

      @Override
      public Long getId() {
        return id();
      }

      @Override
      public UUID getExternalId() {
        return externalId();
      }
    };
  }
}
