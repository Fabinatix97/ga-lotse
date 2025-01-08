/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base;

import java.util.List;

public interface OffsetPagedResponse<T> {
  List<T> elements();

  boolean hasNext();
}
