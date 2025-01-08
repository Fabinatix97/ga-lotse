/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.dental.api;

import de.eshg.base.centralfile.api.person.GetPersonsSortKey;

public enum ChildSortKey {
  ID(false),
  DATE_OF_BIRTH(true),
  FIRST_NAME(true),
  LAST_NAME(true),
  YEAR(false),
  GROUP_NAME(false);

  private final boolean personAttribute;

  ChildSortKey(boolean personAttribute) {
    this.personAttribute = personAttribute;
  }

  public boolean isPersonAttribute() {
    return personAttribute;
  }

  public GetPersonsSortKey asPersonsSortKey() {
    return switch (this) {
      case DATE_OF_BIRTH -> GetPersonsSortKey.DATE_OF_BIRTH;
      case FIRST_NAME -> GetPersonsSortKey.FIRST_NAME;
      case LAST_NAME -> GetPersonsSortKey.LAST_NAME;
      case ID, YEAR, GROUP_NAME -> {
        throw new IllegalArgumentException("only allowed for person attribute sort keys");
      }
    };
  }
}
