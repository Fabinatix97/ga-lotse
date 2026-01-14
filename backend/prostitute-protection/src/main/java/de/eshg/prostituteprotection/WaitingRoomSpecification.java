/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.prostituteprotection;

import de.eshg.api.commons.SortDirection;
import de.eshg.lib.procedure.domain.model.ProcedureStatus;
import de.eshg.persistence.SpecificationUtil;
import de.eshg.prostituteprotection.api.WaitingRoomSortKey;
import de.eshg.prostituteprotection.domain.model.PersonalData_;
import de.eshg.prostituteprotection.domain.model.ProstituteProtectionProcedure;
import de.eshg.prostituteprotection.domain.model.ProstituteProtectionProcedure_;
import de.eshg.prostituteprotection.domain.model.WaitingRoom_;
import de.eshg.prostituteprotection.domain.model.WaitingStatus;
import jakarta.persistence.criteria.*;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Expression;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Order;
import jakarta.persistence.criteria.Path;
import jakarta.persistence.criteria.Root;
import java.io.Serial;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;
import org.springframework.data.jpa.domain.Specification;

public class WaitingRoomSpecification implements Specification<ProstituteProtectionProcedure> {

  @Serial private static final long serialVersionUID = 1L;

  private final WaitingRoomSortKey sortKey;
  private final SortDirection sortDirection;

  public WaitingRoomSpecification(WaitingRoomSortKey sortKey, SortDirection sortDirection) {
    this.sortKey = sortKey;
    this.sortDirection = sortDirection;
  }

  @Override
  public Predicate toPredicate(
      Root<ProstituteProtectionProcedure> root,
      CriteriaQuery<?> query,
      CriteriaBuilder criteriaBuilder) {
    List<Predicate> conjunctions = new ArrayList<>();
    conjunctions.add(
        criteriaBuilder.equal(
            root.get(ProstituteProtectionProcedure_.procedureStatus), ProcedureStatus.OPEN));
    conjunctions.add(
        criteriaBuilder.isNotNull(
            root.get(ProstituteProtectionProcedure_.waitingRoom).get(WaitingRoom_.status)));
    conjunctions.add(
        criteriaBuilder.not(
            root.get(ProstituteProtectionProcedure_.waitingRoom)
                .get(WaitingRoom_.status)
                .in(WaitingStatus.DONE)));

    Set<Order> orders = new LinkedHashSet<>();
    SortDirection localSortDirection =
        sortKey == WaitingRoomSortKey.MODIFIED_AT
            ? switch (sortDirection) {
              case ASC -> SortDirection.DESC;
              case DESC -> SortDirection.ASC;
            }
            : sortDirection;
    orders.add(
        SpecificationUtil.getOrder(
            localSortDirection, criteriaBuilder, mapToSortPath(root, criteriaBuilder)));

    orders.add(
        SpecificationUtil.getOrder(
            sortDirection, criteriaBuilder, root.get(ProstituteProtectionProcedure_.id)));

    query.orderBy(orders.stream().toList());
    return criteriaBuilder.and(conjunctions.toArray(Predicate[]::new));
  }

  private Expression<?> mapToSortPath(
      Root<ProstituteProtectionProcedure> root, CriteriaBuilder criteriaBuilder) {
    return switch (sortKey) {
      case ID -> root.get(ProstituteProtectionProcedure_.id);
      case ALIAS ->
          root.join(ProstituteProtectionProcedure_.personalData, JoinType.LEFT)
              .get(PersonalData_.alias);
      case INFO ->
          nullsLastString(
              root.get(ProstituteProtectionProcedure_.waitingRoom).get(WaitingRoom_.description),
              criteriaBuilder);
      case MODIFIED_AT ->
          root.get(ProstituteProtectionProcedure_.waitingRoom).get(WaitingRoom_.modifiedAt);
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
