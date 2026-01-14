/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.statistics;

import de.eshg.lib.statistics.api.ValueOptionInternal;
import de.eshg.lib.statistics.api.ValueType;
import de.eshg.lib.statistics.api.interval.IntervalConfiguration;
import java.util.List;

public interface CommonAttribute {

  String getName();

  String getCode();

  ValueType getType();

  List<ValueOptionInternal> getValueOptions();

  boolean isMandatory();

  IntervalConfiguration getIntervalConfiguration();
}
