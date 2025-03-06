/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.api.filter;

public interface RangeFilterParameterDto<N extends Comparable<? super N>> {
  N minValueInclusive();

  N maxValueInclusive();

  boolean withNullValues();
}
