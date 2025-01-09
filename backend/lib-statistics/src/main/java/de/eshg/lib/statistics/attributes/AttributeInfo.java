/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.statistics.attributes;

import de.eshg.lib.statistics.api.ValueOptionInternal;
import java.util.List;

public interface AttributeInfo {
  AttributeData getAttributeData();

  default String getCode() {
    return getAttributeData().getCode();
  }

  default List<ValueOptionInternal> getValueOptions() {
    return getAttributeData().getValueOptions();
  }
}
