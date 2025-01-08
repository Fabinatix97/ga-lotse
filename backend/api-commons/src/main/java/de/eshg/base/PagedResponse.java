/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base;

import java.util.List;

public interface PagedResponse<T> {
  List<T> elements();

  long totalNumberOfElements();
}
