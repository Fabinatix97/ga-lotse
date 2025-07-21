/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.dental;

import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.Expression;
import jakarta.persistence.criteria.Root;

public class SpecificationUtil {

  private SpecificationUtil() {}

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
