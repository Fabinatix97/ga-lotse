/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.mapper;

import de.eshg.base.SortDirection;
import org.springframework.data.domain.Sort;

public class RestMappingUtil {

  private RestMappingUtil() {}

  public static Sort.Direction mapDirection(SortDirection sortDirection) {
    return switch (sortDirection) {
      case null -> Sort.Direction.ASC;
      case SortDirection.ASC -> Sort.Direction.ASC;
      case SortDirection.DESC -> Sort.Direction.DESC;
    };
  }
}
