/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.persistence.db.waitingroom;

import de.eshg.lib.procedure.domain.model.ProcedureStatus;
import de.eshg.lib.procedure.domain.model.Procedure_;
import de.eshg.stiprotection.api.waitingroom.WaitingRoomSortKey;
import de.eshg.stiprotection.persistence.db.Person_;
import de.eshg.stiprotection.persistence.db.StiProtectionProcedure;
import de.eshg.stiprotection.persistence.db.StiProtectionProcedure_;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Expression;
import jakarta.persistence.criteria.Order;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import java.io.Serial;
import java.util.ArrayList;
import java.util.List;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;

public class WaitingRoomSpecification implements Specification<StiProtectionProcedure> {

  @Serial private static final long serialVersionUID = 1L;

  private final WaitingRoomSortKey sortKey;
  private final Sort.Direction sortDirection;

  public WaitingRoomSpecification(WaitingRoomSortKey sortKey, Sort.Direction sortDirection) {
    this.sortKey = sortKey;
    this.sortDirection = sortDirection;
  }

  @Override
  public Predicate toPredicate(
      Root<StiProtectionProcedure> root, CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder) {
    List<Predicate> conjunctions = defaultProcedureFilters(root, criteriaBuilder);

    query.orderBy(getSortOrder(root, criteriaBuilder));
    return criteriaBuilder.and(conjunctions.toArray(Predicate[]::new));
  }

  private List<Predicate> defaultProcedureFilters(
      Root<StiProtectionProcedure> root, CriteriaBuilder criteriaBuilder) {
    List<Predicate> defaultFilter = new ArrayList<>();

    defaultFilter.add(
        criteriaBuilder.equal(root.get(Procedure_.procedureStatus), ProcedureStatus.OPEN));
    defaultFilter.add(
        criteriaBuilder.isNotNull(
            root.get(StiProtectionProcedure_.waitingRoom).get(WaitingRoom_.status)));
    defaultFilter.add(
        criteriaBuilder.not(
            root.get(StiProtectionProcedure_.waitingRoom)
                .get(WaitingRoom_.status)
                .in(WaitingStatus.DONE, WaitingStatus.CANCELLED)));

    return defaultFilter;
  }

  private Order getSortOrder(Root<StiProtectionProcedure> root, CriteriaBuilder criteriaBuilder) {
    Expression<?> sortOrder =
        switch (sortKey) {
          case ID -> root.get(StiProtectionProcedure_.id);
          case YEAR_OF_BIRTH -> root.join(Procedure_.relatedPersons).get(Person_.YEAR_OF_BIRTH);
          case GENDER -> root.join(Procedure_.relatedPersons).get(Person_.GENDER);
          case STATUS -> root.get(StiProtectionProcedure_.waitingRoom).get(WaitingRoom_.status);
          case INFO -> root.get(StiProtectionProcedure_.waitingRoom).get(WaitingRoom_.info);
          case MODIFIED_AT ->
              root.get(StiProtectionProcedure_.waitingRoom).get(WaitingRoom_.modifiedAt);
        };
    return switch (sortDirection) {
      case ASC -> criteriaBuilder.asc(sortOrder);
      case DESC -> criteriaBuilder.desc(sortOrder);
    };
  }
}
