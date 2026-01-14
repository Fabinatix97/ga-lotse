/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.dental.api;

import de.eshg.base.centralfile.api.person.GetPersonsSortKey;

public enum ChildForTransitionSortKey {
  ID(false),
  FIRST_NAME(true),
  LAST_NAME(true),
  DATE_OF_BIRTH(true),
  GROUP_NAME(false);

  private final boolean personAttribute;

  ChildForTransitionSortKey(boolean personAttribute) {
    this.personAttribute = personAttribute;
  }

  public boolean isPersonAttribute() {
    return personAttribute;
  }

  public GetPersonsSortKey asPersonsSortKey() {
    return switch (this) {
      case FIRST_NAME -> GetPersonsSortKey.FIRST_NAME;
      case LAST_NAME -> GetPersonsSortKey.LAST_NAME;
      case DATE_OF_BIRTH -> GetPersonsSortKey.DATE_OF_BIRTH;
      case ID, GROUP_NAME -> {
        throw new IllegalArgumentException("only allowed for person attribute sort keys");
      }
    };
  }
}
