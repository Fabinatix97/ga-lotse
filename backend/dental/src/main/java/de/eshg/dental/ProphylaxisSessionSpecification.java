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
import de.eshg.dental.domain.model.ProphylaxisType;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Order;
import jakarta.persistence.criteria.Path;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import java.io.Serial;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Stream;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

class ProphylaxisSessionSpecification implements Specification<ProphylaxisSession> {

  @Serial private static final long serialVersionUID = 1L;

  private final SortDirection sortDirection;
  private final ProphylaxisSessionSortKey sortKey;
  private final ProphylaxisType typeFilter;
  private final UUID institutionIdFilter;

  public ProphylaxisSessionSpecification(
      ProphylaxisSessionPaginationAndSortParameters paginationAndSortParameters,
      UUID institutionIdFilter,
      ProphylaxisType typeFilter) {
    sortKey = paginationAndSortParameters.sortKeyOrFallback(ProphylaxisSessionSortKey.ID);
    sortDirection = paginationAndSortParameters.sortDirectionOrFallback(SortDirection.ASC);
    this.typeFilter = typeFilter;
    this.institutionIdFilter = institutionIdFilter;
  }

  static Pageable toPageSpec(PaginationParameters paginationParameters) {
    return PageRequest.of(
        paginationParameters.pageNumberOrFallback(0), paginationParameters.pageSizeOrFallback(10));
  }

  @Override
  public Predicate toPredicate(
      Root<ProphylaxisSession> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
    query.orderBy(
        Stream.of(getPrimarySortOrder(cb, root), cb.asc(root.get(ProphylaxisSession_.id)))
            .distinct()
            .toList());

    List<Predicate> conjunctions = new ArrayList<>();

    if (typeFilter != null) {
      conjunctions.add(cb.equal(root.get(ProphylaxisSession_.type), typeFilter));
    }
    if (institutionIdFilter != null) {
      conjunctions.add(cb.equal(root.get(ProphylaxisSession_.institutionId), institutionIdFilter));
    }

    return cb.and(conjunctions.toArray(Predicate[]::new));
  }

  private Order getPrimarySortOrder(CriteriaBuilder cb, Root<ProphylaxisSession> root) {
    Path<?> sortPath = mapToSortPath(root);
    return switch (sortDirection) {
      case ASC -> cb.asc(sortPath);
      case DESC -> cb.desc(sortPath);
    };
  }

  private Path<?> mapToSortPath(Root<ProphylaxisSession> root) {
    return switch (sortKey) {
      case ID -> root.get(ProphylaxisSession_.id);
      case TYPE -> root.get(ProphylaxisSession_.type);
      case GROUP_NAME -> root.get(ProphylaxisSession_.groupName);
      case DATE_AND_TIME -> root.get(ProphylaxisSession_.dateAndTime);
      case IS_SCREENING -> root.get(ProphylaxisSession_.isScreening);
      case FLUORIDATION_VARNISH -> root.get(ProphylaxisSession_.fluoridationVarnish);
    };
  }
}
