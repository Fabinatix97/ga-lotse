/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.persistence;

import de.eshg.base.SortDirection;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.Expression;
import jakarta.persistence.criteria.Order;
import jakarta.persistence.criteria.Path;

public class SpecificationUtil {
  private SpecificationUtil() {}

  // This is a workaround because the CriteriaBuilder currently does not support
  // generating SQL’s "NULLS LAST"
  // It’s supposed to be added in Java Persistence 3.2 / Hibernate 7.0
  public static <T> Expression<T> nullsLast(
      Path<T> instantPath, CriteriaBuilder cb, T valueWhenNull) {
    return cb.coalesce(instantPath, cb.literal(valueWhenNull));
  }

  public static Order getOrder(
      SortDirection sortDirection, CriteriaBuilder cb, Expression<?> expression) {
    return switch (sortDirection) {
      case ASC -> cb.asc(expression);
      case DESC -> cb.desc(expression);
    };
  }
}
