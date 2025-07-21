/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.dental;

import de.eshg.base.PaginationParameters;
import de.eshg.base.SortDirection;
import de.eshg.dental.api.ProphylaxisSessionPaginationAndSortParameters;
import de.eshg.dental.api.ProphylaxisSessionSortKey;
import de.eshg.dental.domain.model.ProphylaxisSession;
import de.eshg.dental.domain.model.ProphylaxisSession_;
import de.eshg.dental.domain.model.ProphylaxisStatus;
import de.eshg.dental.domain.model.ProphylaxisType;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Expression;
import jakarta.persistence.criteria.Order;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import java.io.Serial;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.UUID;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

class ProphylaxisSessionSpecification implements Specification<ProphylaxisSession> {

  @Serial private static final long serialVersionUID = 1L;

  private final SortDirection sortDirection;
  private final ProphylaxisSessionSortKey sortKey;
  private final ProphylaxisType typeFilter;
  private final UUID institutionIdFilter;
  private final ProphylaxisStatus statusFilter;

  public ProphylaxisSessionSpecification(
      ProphylaxisSessionPaginationAndSortParameters paginationAndSortParameters,
      UUID institutionIdFilter,
      ProphylaxisType typeFilter,
      ProphylaxisStatus statusFilter) {
    sortKey = paginationAndSortParameters.sortKeyOrFallback(ProphylaxisSessionSortKey.ID);
    sortDirection = paginationAndSortParameters.sortDirectionOrFallback(SortDirection.ASC);
    this.typeFilter = typeFilter;
    this.institutionIdFilter = institutionIdFilter;
    this.statusFilter = statusFilter;
  }

  static Pageable toPageSpec(PaginationParameters paginationParameters) {
    return PageRequest.of(
        paginationParameters.pageNumberOrFallback(0), paginationParameters.pageSizeOrFallback(10));
  }

  @Override
  public Predicate toPredicate(
      Root<ProphylaxisSession> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
    Set<Order> orders = new LinkedHashSet<>();

    orders.add(getPrimarySortOrder(cb, root));

    if (Objects.equals(sortKey, ProphylaxisSessionSortKey.GROUP_NAME)) {
      orders.add(
          switch (sortDirection) {
            case ASC -> cb.asc(root.get(ProphylaxisSession_.GROUP_NAME));
            case DESC -> cb.desc(root.get(ProphylaxisSession_.GROUP_NAME));
          });
    }
    orders.add(
        switch (sortDirection) {
          case ASC -> cb.asc(root.get(ProphylaxisSession_.id));
          case DESC -> cb.desc(root.get(ProphylaxisSession_.id));
        });

    query.orderBy(orders.stream().toList());

    List<Predicate> conjunctions = new ArrayList<>();

    if (typeFilter != null) {
      conjunctions.add(cb.equal(root.get(ProphylaxisSession_.type), typeFilter));
    }
    if (institutionIdFilter != null) {
      conjunctions.add(cb.equal(root.get(ProphylaxisSession_.institutionId), institutionIdFilter));
    }
    if (statusFilter != null) {
      conjunctions.add(cb.equal(root.get(ProphylaxisSession_.status), statusFilter));
    }

    return cb.and(conjunctions.toArray(Predicate[]::new));
  }

  private Order getPrimarySortOrder(CriteriaBuilder cb, Root<ProphylaxisSession> root) {
    Expression<?> sortPath = mapToSortPath(root, cb);
    return switch (sortDirection) {
      case ASC -> cb.asc(sortPath);
      case DESC -> cb.desc(sortPath);
    };
  }

  private Expression<?> mapToSortPath(Root<ProphylaxisSession> root, CriteriaBuilder cb) {
    return switch (sortKey) {
      case ID -> root.get(ProphylaxisSession_.id);
      case TYPE -> root.get(ProphylaxisSession_.type);
      case GROUP_NAME -> SpecificationUtil.leadingNumbersInGroupName(root, cb);
      case DATE_AND_TIME -> root.get(ProphylaxisSession_.dateAndTime);
      case IS_SCREENING -> root.get(ProphylaxisSession_.isScreening);
      case FLUORIDATION_VARNISH -> root.get(ProphylaxisSession_.fluoridationVarnish);
      case STATUS -> root.get(ProphylaxisSession_.status);
    };
  }
}
