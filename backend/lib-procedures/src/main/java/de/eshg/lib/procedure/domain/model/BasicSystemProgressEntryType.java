/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.domain.model;

public enum BasicSystemProgressEntryType {
  CREATED(true),
  CREATED_FROM_INBOX_PROCEDURE(true),
  CLOSED(false),
  REOPENED(false);

  private final boolean created;

  BasicSystemProgressEntryType(boolean created) {
    this.created = created;
  }

  public boolean isCreated() {
    return created;
  }
}
