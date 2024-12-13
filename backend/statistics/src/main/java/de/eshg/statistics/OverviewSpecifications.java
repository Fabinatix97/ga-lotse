/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics;

import de.eshg.statistics.api.DateSpan;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.query.EscapeCharacter;
import org.springframework.util.StringUtils;

public class OverviewSpecifications {
  private OverviewSpecifications() {}

  public static <T> Optional<Specification<T>> nameSpecification(String name, String fieldPath) {
    return Optional.ofNullable(name)
        .filter(StringUtils::hasText)
        .map(
            n ->
                (root, query, criteriaBuilder) ->
                    criteriaBuilder.like(
                        criteriaBuilder.lower(root.get(fieldPath)),
                        "%" + EscapeCharacter.DEFAULT.escape(n.toLowerCase()) + "%",
                        EscapeCharacter.DEFAULT.getEscapeCharacter()));
  }

  public static <T> void addDateSpecification(
      List<Specification<T>> specifications, DateSpan dateSpan, String fieldPath) {
    if (dateSpan == null) {
      return;
    }

    if (dateSpan.lowerBoundary() != null) {
      specifications.add(
          (root, query, criteriaBuilder) ->
              criteriaBuilder.greaterThanOrEqualTo(root.get(fieldPath), dateSpan.lowerBoundary()));
    }

    if (dateSpan.upperBoundary() != null) {
      specifications.add(
          (root, query, criteriaBuilder) ->
              criteriaBuilder.lessThan(root.get(fieldPath), dateSpan.upperBoundary()));
    }
  }
}
