/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.util;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

public class PaginationUtil {

  public record PageSpec(Integer pageNumber, Integer pageSize, Sort.Order order) {}

  public static Pageable getPageable(PageSpec pageSpec, String fallbackField) {
    Sort sortBy = getSortByWithFallback(pageSpec.order(), fallbackField);
    return PageRequest.of(pageSpec.pageNumber(), pageSpec.pageSize(), sortBy);
  }

  public static Sort getSortByWithFallback(Sort.Order order, String fallbackField) {
    return Sort.by(order.getDirection(), order.getProperty(), fallbackField);
  }
}
