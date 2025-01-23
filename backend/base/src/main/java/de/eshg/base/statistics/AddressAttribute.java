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
  LAND("Land", "LAND", ValueType.TEXT, true),

  ORT("Ort", "ORT", ValueType.TEXT, true),

  PLZ("Postleitzahl", "PLZ", ValueType.TEXT, true),

  BEZ("Stadtteil", "BEZ", ValueType.TEXT, true),

  STADT_BEZ("Nummer Stadtbezirk", "STADT_BEZ", ValueType.TEXT, true),

  GEMEINDE_KEY("Gemeindeschlüssel", "GEMEINDE_KEY", ValueType.TEXT, true);

  private final String name;

  private final String code;

  private final ValueType type;

  private final boolean mandatory;

  AddressAttribute(String name, String code, ValueType type, boolean mandatory) {
    this.name = name;
    this.code = code;
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
