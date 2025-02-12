/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.statistics.attributes;

import de.eshg.lib.statistics.api.ValueOptionInternal;
import java.util.List;

public final class ValueWithOptionsAttribute extends AttributeData {
  public ValueWithOptionsAttribute(
      String name,
      String code,
      List<ValueOptionInternal> valueOptions,
      String category,
      boolean mandatory) {
    super(name, code, null, valueOptions, category, mandatory, null);
  }
}
