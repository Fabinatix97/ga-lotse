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
import jakarta.persistence.criteria.Path;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import java.io.Serial;
import java.time.Instant;
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

    query.orderBy(getSortOrder(root, criteriaBuilder), createdAt(root, criteriaBuilder));
    return criteriaBuilder.and(conjunctions.toArray(Predicate[]::new));
  }

  private Order createdAt(Root<StiProtectionProcedure> root, CriteriaBuilder criteriaBuilder) {
    Path<Instant> createdAt = root.get(Procedure_.createdAt);
    return switch (sortDirection) {
      case ASC -> criteriaBuilder.asc(createdAt);
      case DESC -> criteriaBuilder.desc(createdAt);
    };
  }

  private List<Predicate> defaultProcedureFilters(
      Root<StiProtectionProcedure> root, CriteriaBuilder criteriaBuilder) {
    Path<WaitingStatus> waitingRoomStatus =
        root.get(StiProtectionProcedure_.waitingRoom).get(WaitingRoom_.status);
    Predicate isOpenProcedure =
        criteriaBuilder.equal(root.get(Procedure_.procedureStatus), ProcedureStatus.OPEN);
    Predicate hasWaitingRoomStatus = criteriaBuilder.isNotNull(waitingRoomStatus);
    Predicate isNotFinalStatus =
        criteriaBuilder.not(waitingRoomStatus.in(WaitingStatus.DONE, WaitingStatus.CANCELLED));
    return List.of(isOpenProcedure, hasWaitingRoomStatus, isNotFinalStatus);
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
