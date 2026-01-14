/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.util;

public enum WaitingRoomSortKey {
  ID(false),
  DATE_OF_BIRTH(true),
  FIRSTNAME(true),
  LASTNAME(true),
  INFO(false),
  STATUS(false),
  MODIFIED_AT(false);

  private final boolean personAttribute;

  WaitingRoomSortKey(boolean personAttribute) {
    this.personAttribute = personAttribute;
  }

  public boolean isPersonAttribute() {
    return personAttribute;
  }
}
