/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.statistics.util;

import de.eshg.lib.statistics.api.ValueOptionInternal;
import de.eshg.lib.statistics.api.ValueType;
import java.util.List;

public interface AttributeInfo {
  String getName();

  String getCode();

  boolean isAccessibleForCountyOffice();

  ValueType getType();

  String getUnit();

  List<ValueOptionInternal> getValueOptions();

  String getCategory();

  boolean isMandatory();
}
