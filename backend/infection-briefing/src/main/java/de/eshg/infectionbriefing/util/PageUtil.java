/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.infectionbriefing.util;

import de.eshg.api.commons.PaginationParameters;
import java.util.stream.Stream;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

public class PageUtil {
  private PageUtil() {}

  public static Pageable toPageSpec(PaginationParameters paginationParameters) {
    return PageRequest.of(
        paginationParameters.pageNumberOrFallback(0), paginationParameters.pageSizeOrFallback(10));
  }

  public static <T> Stream<T> applyPagination(
      Stream<T> stream, PaginationParameters paginationParameters) {
    if (paginationParameters != null && paginationParameters.pageSize() != null) {
      return stream
          .skip(
              (long) paginationParameters.pageNumberOrFallback(0) * paginationParameters.pageSize())
          .limit(paginationParameters.pageSize());
    } else {
      return stream;
    }
  }
}
