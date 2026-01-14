/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.api.commons;

public interface SortParameters<E extends Enum<E>> {
  E sortKey();

  default E sortKeyOrFallback(E fallback) {
    return sortKey() == null ? fallback : sortKey();
  }

  SortDirection sortDirection();

  default SortDirection sortDirectionOrFallback(SortDirection fallback) {
    return sortDirection() == null ? fallback : sortDirection();
  }
}
