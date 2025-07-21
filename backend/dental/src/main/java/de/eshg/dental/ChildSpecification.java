/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.dental;

import de.eshg.base.SortDirection;
import de.eshg.dental.api.ChildFilterParameters;
import de.eshg.dental.api.ChildPaginationAndSortParameters;
import de.eshg.dental.api.ChildSortKey;
import de.eshg.dental.domain.model.Child;
import de.eshg.dental.domain.model.Child_;
import de.eshg.dental.domain.model.ProcedureLabel;
import de.eshg.dental.domain.model.ProcedureLabel_;
import de.eshg.dental.util.ChildPageSpec;
import de.eshg.lib.procedure.domain.model.ProcedureStatus;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Expression;
import jakarta.persistence.criteria.ListJoin;
import jakarta.persistence.criteria.Order;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import jakarta.persistence.criteria.Subquery;
import java.io.Serial;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Objects;
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
  private final Boolean noGroupFilter;
  private final ArrayList<UUID> procedureLabelFilter;

  public ChildSpecification(
      ChildFilterParameters filterParameters,
      ChildPaginationAndSortParameters paginationAndSortParameters) {
    yearFilter = filterParameters.yearFilter();
    institutionIdFilter = filterParameters.institutionIdFilter();
    groupNameFilter = filterParameters.groupNameFilter();
    noGroupFilter = filterParameters.noGroupFilter();
    sortKey = paginationAndSortParameters.sortKeyOrFallback(ChildSortKey.ID);
    sortDirection = paginationAndSortParameters.sortDirectionOrFallback(SortDirection.ASC);
    procedureLabelFilter = (ArrayList<UUID>) filterParameters.procedureLabelsFilter();
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
    if (Objects.equals(sortKey, ChildSortKey.GROUP_NAME)) {
      orders.add(
          switch (sortDirection) {
            case ASC -> cb.asc(root.get(Child_.GROUP_NAME));
            case DESC -> cb.desc(root.get(Child_.GROUP_NAME));
          });
    }
    orders.add(
        switch (sortDirection) {
          case ASC -> cb.asc(root.get(Child_.id));
          case DESC -> cb.desc(root.get(Child_.id));
        });
    query.orderBy(orders.stream().toList());

    List<Predicate> conjunctions = new ArrayList<>();

    if (institutionIdFilter != null) {
      conjunctions.add(cb.equal(root.get(Child_.institutionId), institutionIdFilter));
    }

    if (groupNameFilter != null) {
      conjunctions.add(cb.equal(root.get(Child_.groupName), groupNameFilter));
    } else if (Boolean.TRUE.equals(noGroupFilter)) {
      conjunctions.add(cb.isNull(root.get(Child_.groupName)));
    }

    if (yearFilter != null) {
      conjunctions.add(cb.equal(root.get(Child_.year), yearFilter));
    } else {
      conjunctions.add(cb.equal(root.get(Child_.procedureStatus), ProcedureStatus.OPEN));
    }

    if (procedureLabelFilter != null) {
      for (UUID procedureLabel : procedureLabelFilter) {
        Subquery<Child> subquery = query.subquery(Child.class);
        Root<Child> subqueryRoot = subquery.correlate(root);
        ListJoin<Child, ProcedureLabel> procedureLabelJoin =
            subqueryRoot.join(Child_.procedureLabels);
        subquery.where(
            cb.equal(procedureLabelJoin.get(ProcedureLabel_.externalId), procedureLabel));
        conjunctions.add(cb.exists(subquery));
      }
    }

    return cb.and(conjunctions.toArray(Predicate[]::new));
  }

  private Order getPrimarySortOrder(CriteriaBuilder cb, Root<Child> root) {
    Expression<?> sortPath = mapToSortPath(root, cb);

    return switch (sortDirection) {
      case ASC -> cb.asc(sortPath);
      case DESC -> cb.desc(sortPath);
    };
  }

  private Expression<?> mapToSortPath(Root<Child> root, CriteriaBuilder cb) {
    return switch (sortKey) {
      case ID -> root.get(Child_.id);
      case YEAR -> root.get(Child_.year);
      case GROUP_NAME -> SpecificationUtil.leadingNumbersInGroupName(root, cb);
      case FIRST_NAME, LAST_NAME, DATE_OF_BIRTH -> {
        Assert.isTrue(
            sortKey.isPersonAttribute(),
            sortKey + " was expected to be a person attribute but it is not");
        throw new IllegalArgumentException("Unexpected sort key: " + sortKey);
      }
    };
  }
}
