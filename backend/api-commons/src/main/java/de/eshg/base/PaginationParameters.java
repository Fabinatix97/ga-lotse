/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base;

public interface PaginationParameters {
  Integer pageNumber();

  default int pageNumberOrFallback(int fallback) {
    return pageNumber() == null ? fallback : pageNumber();
  }

  Integer pageSize();

  default int pageSizeOrFallback(int fallback) {
    return pageSize() == null ? fallback : pageSize();
  }
}
