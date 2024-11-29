/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.dental;

import de.eshg.base.SortDirection;
import de.eshg.dental.api.ChildFilterParameters;
import de.eshg.dental.api.ChildPaginationAndSortParameters;
import de.eshg.dental.api.ChildSortKey;
import de.eshg.dental.domain.model.Child;
import de.eshg.dental.domain.model.Child_;
import de.eshg.dental.util.ChildPageSpec;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Order;
import jakarta.persistence.criteria.Path;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import java.io.Serial;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.Assert;

class ChildSpecification implements Specification<Child> {

  @Serial private static final long serialVersionUID = 1L;

  private final SortDirection sortDirection;
  private final ChildSortKey sortKey;
  private final Integer yearFilter;
  private final UUID institutionIdFilter;
  private final String groupNameFilter;

  public ChildSpecification(
      ChildFilterParameters filterParameters,
      ChildPaginationAndSortParameters paginationAndSortParameters) {
    yearFilter = filterParameters.yearFilter();
    institutionIdFilter = filterParameters.institutionIdFilter();
    groupNameFilter = filterParameters.groupNameFilter();
    sortKey = paginationAndSortParameters.sortKeyOrFallback(ChildSortKey.ID);
    sortDirection = paginationAndSortParameters.sortDirectionOrFallback(SortDirection.ASC);
  }

  static ChildPageSpec toPageSpec(
      ChildPaginationAndSortParameters childPaginationAndSortParameters) {
    return new ChildPageSpec(
        childPaginationAndSortParameters.pageNumberOrFallback(0),
        childPaginationAndSortParameters.pageSizeOrFallback(10),
        childPaginationAndSortParameters.sortKeyOrFallback(ChildSortKey.ID),
        childPaginationAndSortParameters.sortDirectionOrFallback(SortDirection.ASC));
  }

  @Override
  public Predicate toPredicate(Root<Child> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
    Set<Order> orders = new LinkedHashSet<>();
    if (!sortKey.isPersonAttribute()) {
      orders.add(getPrimarySortOrder(cb, root));
    }
    orders.add(
        switch (sortDirection) {
          case ASC -> cb.asc(root.get(Child_.id));
          case DESC -> cb.desc(root.get(Child_.id));
        });
    query.orderBy(orders.stream().toList());

    List<Predicate> conjunctions = new ArrayList<>();

    if (yearFilter != null) {
      conjunctions.add(cb.equal(root.get(Child_.year), yearFilter));
    }

    if (institutionIdFilter != null) {
      conjunctions.add(cb.equal(root.get(Child_.institutionId), institutionIdFilter));
    }

    if (groupNameFilter != null) {
      conjunctions.add(cb.equal(root.get(Child_.groupName), groupNameFilter));
    }

    return cb.and(conjunctions.toArray(Predicate[]::new));
  }

  private Order getPrimarySortOrder(CriteriaBuilder cb, Root<Child> root) {
    Path<?> sortPath = mapToSortPath(root);
    return switch (sortDirection) {
      case ASC -> cb.asc(sortPath);
      case DESC -> cb.desc(sortPath);
    };
  }

  private Path<?> mapToSortPath(Root<Child> root) {
    return switch (sortKey) {
      case ID -> root.get(Child_.id);
      case YEAR -> root.get(Child_.year);
      case GROUP_NAME -> root.get(Child_.groupName);
      case FIRST_NAME, LAST_NAME, DATE_OF_BIRTH -> {
        Assert.isTrue(
            sortKey.isPersonAttribute(),
            sortKey + " was expected to be a person attribute but it is not");
        throw new IllegalArgumentException("Unexpected sort key: " + sortKey);
      }
    };
  }
}
