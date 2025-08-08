/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.dental;

import de.eshg.base.SortDirection;
import de.eshg.dental.api.ChildForTransitionSortKey;
import de.eshg.dental.api.ChildrenForTransitionSortParameters;
import de.eshg.dental.domain.model.Child;
import de.eshg.dental.domain.model.Child_;
import de.eshg.dental.util.ChildForTransitionPageSpec;
import de.eshg.lib.procedure.domain.model.ProcedureStatus;
import de.eshg.persistence.SpecificationUtil;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Expression;
import jakarta.persistence.criteria.Order;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import java.io.Serial;
import java.time.Year;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.UUID;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.Assert;

class ChildForTransitionSpecification implements Specification<Child> {

  @Serial private static final long serialVersionUID = 1L;

  private final SortDirection sortDirection;
  private final ChildForTransitionSortKey sortKey;
  private final Year year;
  private final UUID institutionId;

  public ChildForTransitionSpecification(
      ChildrenForTransitionSortParameters sortParameters, Year year, UUID institutionId) {
    sortKey = sortParameters.sortKeyOrFallback(ChildForTransitionSortKey.ID);
    sortDirection = sortParameters.sortDirectionOrFallback(SortDirection.ASC);
    this.year = year;
    this.institutionId = institutionId;
  }

  static ChildForTransitionPageSpec toPageSpec(ChildrenForTransitionSortParameters sortParameters) {
    return new ChildForTransitionPageSpec(
        sortParameters.sortKeyOrFallback(ChildForTransitionSortKey.ID),
        sortParameters.sortDirectionOrFallback(SortDirection.ASC));
  }

  @Override
  public Predicate toPredicate(Root<Child> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
    Set<Order> orders = new LinkedHashSet<>();
    if (!sortKey.isPersonAttribute()) {
      orders.add(SpecificationUtil.getOrder(sortDirection, cb, mapToSortPath(cb, root)));
    }

    if (Objects.equals(sortKey, ChildForTransitionSortKey.GROUP_NAME)) {
      orders.add(SpecificationUtil.getOrder(sortDirection, cb, root.get(Child_.GROUP_NAME)));
    }

    orders.add(SpecificationUtil.getOrder(sortDirection, cb, root.get(Child_.id)));
    query.orderBy(orders.stream().toList());

    List<Predicate> conjunctions = new ArrayList<>();
    conjunctions.add(cb.equal(root.get(Child_.year), year.getValue()));
    conjunctions.add(cb.equal(root.get(Child_.procedureStatus), ProcedureStatus.OPEN));
    conjunctions.add(cb.equal(root.get(Child_.institutionId), institutionId));

    return cb.and(conjunctions.toArray(Predicate[]::new));
  }

  private Expression<?> mapToSortPath(CriteriaBuilder cb, Root<Child> root) {
    return switch (sortKey) {
      case ID -> root.get(Child_.id);
      case GROUP_NAME -> DentalSpecificationUtil.leadingNumbersInGroupName(root, cb);
      case FIRST_NAME, LAST_NAME, DATE_OF_BIRTH -> {
        Assert.isTrue(
            sortKey.isPersonAttribute(),
            sortKey + " was expected to be a person attribute but it is not");
        throw new IllegalArgumentException("Unexpected sort key: " + sortKey);
      }
    };
  }
}
