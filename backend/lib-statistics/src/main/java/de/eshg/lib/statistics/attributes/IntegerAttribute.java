/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.statistics.attributes;

import de.eshg.lib.statistics.api.ValueOptionInternal;

public final class IntegerAttribute extends AttributeData {
  public IntegerAttribute(String name, String code, String category, boolean mandatory) {
    this(name, code, null, category, mandatory);
  }

  public IntegerAttribute(
      String name,
      String code,
      ValueOptionInternal valueOption,
      String category,
      boolean mandatory) {
    this(name, code, null, valueOption, category, mandatory);
  }

  public IntegerAttribute(
      String name,
      String code,
      String unit,
      ValueOptionInternal valueOption,
      String category,
      boolean mandatory) {
    super(name, code, unit, valueOption, category, mandatory);
  }
}
