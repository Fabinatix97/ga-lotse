/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.officialmedicalservice.procedure;

import de.eshg.base.PaginationParameters;
import de.eshg.base.SortDirection;
import de.eshg.officialmedicalservice.procedure.api.EmployeeOmsProcedurePaginationAndSortParameters;
import de.eshg.officialmedicalservice.procedure.api.EmployeeOmsProcedureSortKey;
import de.eshg.officialmedicalservice.procedure.persistence.entity.OmsProcedure;
import de.eshg.officialmedicalservice.procedure.persistence.entity.OmsProcedure_;
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

public class EmployeeOmsProcedureSpecification implements Specification<OmsProcedure> {

  @Serial private static final long serialVersionUID = 1L;

  private final SortDirection sortDirection;
  private final EmployeeOmsProcedureSortKey sortKey;

  public EmployeeOmsProcedureSpecification(
      EmployeeOmsProcedurePaginationAndSortParameters paginationAndSortParameters) {
    sortKey = paginationAndSortParameters.sortKeyOrFallback(EmployeeOmsProcedureSortKey.ID);
    sortDirection = paginationAndSortParameters.sortDirectionOrFallback(SortDirection.ASC);
  }

  static Pageable toPageSpec(PaginationParameters paginationParameters) {
    return PageRequest.of(
        paginationParameters.pageNumberOrFallback(0), paginationParameters.pageSizeOrFallback(10));
  }

  @Override
  public Predicate toPredicate(
      Root<OmsProcedure> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
    query.orderBy(
        Stream.of(getPrimarySortOrder(cb, root), cb.asc(root.get(OmsProcedure_.id)))
            .distinct()
            .toList());

    return cb.and();
  }

  private Order getPrimarySortOrder(CriteriaBuilder cb, Root<OmsProcedure> root) {
    Path<?> sortPath = mapToSortPath(root);
    return switch (sortDirection) {
      case ASC -> cb.asc(sortPath);
      case DESC -> cb.desc(sortPath);
    };
  }

  private Path<?> mapToSortPath(Root<OmsProcedure> root) {
    return switch (sortKey) {
      case ID -> root.get(OmsProcedure_.id);
    };
  }
}
