/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.statistics;

import de.eshg.lib.statistics.api.ValueOptionInternal;
import de.eshg.lib.statistics.api.ValueType;
import java.util.List;
import javax.annotation.Nullable;

public enum AddressAttribute implements CommonAttribute {
  LAND("Land", "LAND", false, ValueType.TEXT, true),

  ORT("Ort", "ORT", false, ValueType.TEXT, true),

  PLZ("Postleitzahl", "PLZ", true, ValueType.TEXT, true),

  BEZ("Stadtteil", "BEZ", false, ValueType.TEXT, true),

  STADT_BEZ("Nummer Stadtbezirk", "STADT_BEZ", false, ValueType.TEXT, true),

  GEMEINDE_KEY("Gemeindeschlüssel", "GEMEINDE_KEY", false, ValueType.TEXT, true);

  private final String name;

  private final String code;

  private final boolean accessibleForCountyOffice;

  private final ValueType type;

  private final boolean mandatory;

  AddressAttribute(
      String name,
      String code,
      boolean accessibleForCountyOffice,
      ValueType type,
      boolean mandatory) {
    this.name = name;
    this.code = code;
    this.accessibleForCountyOffice = accessibleForCountyOffice;
    this.type = type;
    this.mandatory = mandatory;
  }

  @Override
  public String getName() {
    return name;
  }

  @Override
  public String getCode() {
    return code;
  }

  @Override
  public boolean isAccessibleForCountyOffice() {
    return accessibleForCountyOffice;
  }

  @Override
  public ValueType getType() {
    return type;
  }

  @Override
  @Nullable
  public List<ValueOptionInternal> getValueOptions() {
    return null;
  }

  @Override
  public boolean isMandatory() {
    return mandatory;
  }
}
