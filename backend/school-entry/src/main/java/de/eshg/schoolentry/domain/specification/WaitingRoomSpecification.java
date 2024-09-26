/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.domain.specification;

import static java.util.Comparator.nullsLast;

import de.eshg.lib.procedure.domain.model.ProcedureStatus;
import de.eshg.schoolentry.domain.model.SchoolEntryProcedure;
import de.eshg.schoolentry.domain.model.SchoolEntryProcedure_;
import de.eshg.schoolentry.domain.model.WaitingRoom_;
import de.eshg.schoolentry.domain.model.WaitingStatus;
import de.eshg.schoolentry.util.WaitingRoomSortKey;
import jakarta.persistence.criteria.*;
import java.io.Serial;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.Assert;

public class WaitingRoomSpecification implements Specification<SchoolEntryProcedure> {

  @Serial private static final long serialVersionUID = 1L;

  private final WaitingRoomSortKey sortKey;
  private final Sort.Direction sortDirection;

  public WaitingRoomSpecification(WaitingRoomSortKey sortKey, Sort.Direction sortDirection) {
    this.sortKey = sortKey;
    this.sortDirection = sortDirection;
  }

  @Override
  public Predicate toPredicate(
      Root<SchoolEntryProcedure> root, CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder) {
    List<Predicate> conjunctions = new ArrayList<>();
    conjunctions.add(
        criteriaBuilder.equal(
            root.get(SchoolEntryProcedure_.procedureStatus), ProcedureStatus.OPEN));
    conjunctions.add(
        criteriaBuilder.isNotNull(
            root.get(SchoolEntryProcedure_.waitingRoom).get(WaitingRoom_.status)));
    conjunctions.add(
        criteriaBuilder.not(
            root.get(SchoolEntryProcedure_.waitingRoom)
                .get(WaitingRoom_.status)
                .in(WaitingStatus.DONE, WaitingStatus.CANCELLED)));

    Set<Order> orders = new LinkedHashSet<>();
    if (!sortKey.isPersonAttribute()) {
      orders.add(getOrder(root, criteriaBuilder));
    }
    orders.add(getFallbackOrder(root, criteriaBuilder));

    query.orderBy(orders.stream().toList());
    return criteriaBuilder.and(conjunctions.toArray(Predicate[]::new));
  }

  private Order getFallbackOrder(Root<SchoolEntryProcedure> root, CriteriaBuilder criteriaBuilder) {
    Expression<?> fallbackOrderExpression = root.get(SchoolEntryProcedure_.id);
    return switch (sortDirection) {
      case ASC -> criteriaBuilder.asc(fallbackOrderExpression);
      case DESC -> criteriaBuilder.desc(fallbackOrderExpression);
    };
  }

  private Order getOrder(Root<SchoolEntryProcedure> root, CriteriaBuilder criteriaBuilder) {
    Expression<?> expression =
        switch (sortKey) {
          case ID -> root.get(SchoolEntryProcedure_.id);
          case DATE_OF_BIRTH, FIRSTNAME, LASTNAME -> {
            Assert.isTrue(
                sortKey.isPersonAttribute(),
                sortKey + " was expected to be a person attribute but it is not");
            throw new IllegalArgumentException("Unexpected sort key: " + sortKey);
          }
          case INFO ->
              nullsLastString(
                  root.get(SchoolEntryProcedure_.waitingRoom).get(WaitingRoom_.description),
                  criteriaBuilder);
          case STATUS -> root.get(SchoolEntryProcedure_.waitingRoom).get(WaitingRoom_.status);
          case MODIFIED_AT ->
              root.get(SchoolEntryProcedure_.waitingRoom).get(WaitingRoom_.modifiedAt);
        };

    return switch (sortDirection) {
      case ASC -> criteriaBuilder.asc(expression);
      case DESC -> criteriaBuilder.desc(expression);
    };
  }

  private Expression<String> nullsLastString(Path<String> instantPath, CriteriaBuilder cb) {
    String valueWhenNull =
        switch (sortDirection) {
          case ASC -> null;
          case DESC -> "";
        };
    return nullsLast(instantPath, cb, valueWhenNull);
  }

  // This is a workaround because the CriteriaBuilder currently does not support
  // generating SQL’s "NULLS LAST"
  // It’s supposed to be added in Java Persistence 3.2 / Hibernate 7.0
  private static <T> Expression<T> nullsLast(
      Path<T> instantPath, CriteriaBuilder cb, T valueWhenNull) {
    return cb.coalesce(instantPath, cb.literal(valueWhenNull));
  }
}
