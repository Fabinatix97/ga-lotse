/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.dental;

import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.Expression;
import jakarta.persistence.criteria.Root;

public class DentalSpecificationUtil {

  private DentalSpecificationUtil() {}

  public static Expression<Integer> leadingNumbersInGroupName(Root<?> root, CriteriaBuilder cb) {

    Expression<String> leadingNumbersInGroup =
        cb.function(
            "regexp_replace",
            String.class,
            root.get("groupName"),
            cb.literal("[^0-9].*$"),
            cb.literal(""));

    Expression<String> nullIfEmptyString =
        cb.function("nullif", String.class, leadingNumbersInGroup, cb.literal(""));

    return cb.function("to_number", Integer.class, nullIfEmptyString, cb.literal("999999"));
  }
}
