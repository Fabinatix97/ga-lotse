/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.statistics.attributes;

import de.eshg.lib.statistics.api.ValueOptionInternal;

public final class TextAttribute extends AttributeData {
  public TextAttribute(String name, String code, String category, boolean mandatory) {
    this(name, code, null, category, mandatory);
  }

  public TextAttribute(
      String name,
      String code,
      ValueOptionInternal valueOption,
      String category,
      boolean mandatory) {
    super(name, code, valueOption, category, mandatory);
  }
}
