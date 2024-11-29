/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.dental;

import de.eshg.base.PaginationParameters;
import de.eshg.base.SortDirection;
import de.eshg.dental.api.ProphylaxisSessionPaginationAndSortParameters;
import de.eshg.dental.api.ProphylaxisSessionSortKey;
import de.eshg.dental.domain.model.ProphylaxisSession;
import de.eshg.dental.domain.model.ProphylaxisSession_;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Order;
import jakarta.persistence.criteria.Path;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import java.io.Serial;
import java.util.stream.Stream;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

class ProphylaxisSessionSpecification implements Specification<ProphylaxisSession> {

  @Serial private static final long serialVersionUID = 1L;

  private final SortDirection sortDirection;
  private final ProphylaxisSessionSortKey sortKey;

  public ProphylaxisSessionSpecification(
      ProphylaxisSessionPaginationAndSortParameters paginationAndSortParameters) {
    sortKey = paginationAndSortParameters.sortKeyOrFallback(ProphylaxisSessionSortKey.ID);
    sortDirection = paginationAndSortParameters.sortDirectionOrFallback(SortDirection.ASC);
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
    return cb.and();
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
    };
  }
}
