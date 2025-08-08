/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.officialmedicalservice.waitingroom;

import static de.eshg.officialmedicalservice.waitingroom.api.WaitingRoomSortKey.DATE_OF_BIRTH;
import static de.eshg.officialmedicalservice.waitingroom.api.WaitingRoomSortKey.FACILITY;
import static de.eshg.officialmedicalservice.waitingroom.api.WaitingRoomSortKey.FIRSTNAME;
import static de.eshg.officialmedicalservice.waitingroom.api.WaitingRoomSortKey.LASTNAME;
import static de.eshg.officialmedicalservice.waitingroom.api.WaitingRoomSortKey.PHYSICIAN;

import de.eshg.base.SortDirection;
import de.eshg.lib.procedure.domain.model.ProcedureStatus;
import de.eshg.officialmedicalservice.procedure.persistence.entity.OmsProcedure;
import de.eshg.officialmedicalservice.procedure.persistence.entity.OmsProcedure_;
import de.eshg.officialmedicalservice.waitingroom.api.WaitingRoomSortKey;
import de.eshg.officialmedicalservice.waitingroom.persistence.entity.WaitingRoom_;
import de.eshg.officialmedicalservice.waitingroom.persistence.entity.WaitingStatus;
import de.eshg.persistence.SpecificationUtil;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Expression;
import jakarta.persistence.criteria.Order;
import jakarta.persistence.criteria.Path;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import java.io.Serial;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;
import org.springframework.data.jpa.domain.Specification;

public class WaitingRoomSpecification implements Specification<OmsProcedure> {
  @Serial private static final long serialVersionUID = 1L;

  private final WaitingRoomSortKey sortKey;
  private final SortDirection sortDirection;

  public WaitingRoomSpecification(WaitingRoomSortKey sortKey, SortDirection sortDirection) {
    this.sortKey = sortKey;
    this.sortDirection = sortDirection;
  }

  @Override
  public Predicate toPredicate(
      Root<OmsProcedure> root, CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder) {
    List<Predicate> conjunctions = new ArrayList<>();
    conjunctions.add(
        criteriaBuilder.equal(root.get(OmsProcedure_.procedureStatus), ProcedureStatus.OPEN));
    conjunctions.add(
        criteriaBuilder.isNotNull(root.get(OmsProcedure_.waitingRoom).get(WaitingRoom_.status)));
    conjunctions.add(
        criteriaBuilder.not(
            root.get(OmsProcedure_.waitingRoom).get(WaitingRoom_.status).in(WaitingStatus.DONE)));

    Set<Order> orders = new LinkedHashSet<>();
    if (!List.of(FIRSTNAME, LASTNAME, DATE_OF_BIRTH, FACILITY, PHYSICIAN).contains(sortKey)) {
      orders.add(
          SpecificationUtil.getOrder(
              sortDirection, criteriaBuilder, mapToSortPath(root, criteriaBuilder)));
    }
    orders.add(
        SpecificationUtil.getOrder(sortDirection, criteriaBuilder, root.get(OmsProcedure_.id)));

    query.orderBy(orders.stream().toList());
    return criteriaBuilder.and(conjunctions.toArray(Predicate[]::new));
  }

  private Expression<?> mapToSortPath(Root<OmsProcedure> root, CriteriaBuilder criteriaBuilder) {
    return switch (sortKey) {
      case ID -> root.get(OmsProcedure_.id);
      case FIRSTNAME, LASTNAME, DATE_OF_BIRTH, FACILITY, PHYSICIAN ->
          throw new IllegalArgumentException("Unexpected sort key: " + sortKey);
      case STATUS -> root.get(OmsProcedure_.waitingRoom).get(WaitingRoom_.status);
      case INFO ->
          nullsLastString(
              root.get(OmsProcedure_.waitingRoom).get(WaitingRoom_.info), criteriaBuilder);
      case MODIFIED_AT -> root.get(OmsProcedure_.waitingRoom).get(WaitingRoom_.modifiedAt);
    };
  }

  private Expression<String> nullsLastString(Path<String> instantPath, CriteriaBuilder cb) {
    String valueWhenNull =
        switch (sortDirection) {
          case ASC -> null;
          case DESC -> "";
        };
    return SpecificationUtil.nullsLast(instantPath, cb, valueWhenNull);
  }
}
