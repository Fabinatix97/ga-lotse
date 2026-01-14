/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.dental;

import de.eshg.api.commons.PaginationParameters;
import de.eshg.api.commons.SortDirection;
import de.eshg.dental.api.ProphylaxisSessionPaginationAndSortParameters;
import de.eshg.dental.api.ProphylaxisSessionSortKey;
import de.eshg.dental.domain.model.ProphylaxisSession;
import de.eshg.dental.domain.model.ProphylaxisSession_;
import de.eshg.dental.domain.model.ProphylaxisStatus;
import de.eshg.dental.domain.model.ProphylaxisType;
import de.eshg.persistence.SpecificationUtil;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Expression;
import jakarta.persistence.criteria.Order;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import java.io.Serial;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.ZonedDateTime;
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
  private final Integer yearFilter;
  private final ProphylaxisStatus statusFilter;
  private final ZoneId zoneId;

  public ProphylaxisSessionSpecification(
      ProphylaxisSessionPaginationAndSortParameters paginationAndSortParameters,
      UUID institutionIdFilter,
      Integer yearFilter,
      ProphylaxisType typeFilter,
      ProphylaxisStatus statusFilter,
      ZoneId zoneId) {
    sortKey = paginationAndSortParameters.sortKeyOrFallback(ProphylaxisSessionSortKey.ID);
    sortDirection = paginationAndSortParameters.sortDirectionOrFallback(SortDirection.ASC);
    this.typeFilter = typeFilter;
    this.institutionIdFilter = institutionIdFilter;
    this.yearFilter = yearFilter;
    this.statusFilter = statusFilter;
    this.zoneId = zoneId;
  }

  static Pageable toPageSpec(PaginationParameters paginationParameters) {
    return PageRequest.of(
        paginationParameters.pageNumberOrFallback(0), paginationParameters.pageSizeOrFallback(10));
  }

  @Override
  public Predicate toPredicate(
      Root<ProphylaxisSession> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
    Set<Order> orders = new LinkedHashSet<>();

    orders.add(SpecificationUtil.getOrder(sortDirection, cb, mapToSortPath(root, cb)));

    if (Objects.equals(sortKey, ProphylaxisSessionSortKey.GROUP_NAME)) {
      orders.add(
          SpecificationUtil.getOrder(sortDirection, cb, root.get(ProphylaxisSession_.GROUP_NAME)));
    }
    orders.add(SpecificationUtil.getOrder(sortDirection, cb, root.get(ProphylaxisSession_.id)));

    query.orderBy(orders.stream().toList());

    List<Predicate> conjunctions = new ArrayList<>();

    if (typeFilter != null) {
      conjunctions.add(cb.equal(root.get(ProphylaxisSession_.type), typeFilter));
    }
    if (institutionIdFilter != null) {
      conjunctions.add(cb.equal(root.get(ProphylaxisSession_.institutionId), institutionIdFilter));
    }
    if (yearFilter != null) {
      Instant start = getStartOfFirstDayOfYear(yearFilter).toInstant();
      Instant end = getStartOfFirstDayOfYear(yearFilter + 1).minusSeconds(1).toInstant();
      conjunctions.add(cb.between(root.get(ProphylaxisSession_.dateAndTime), start, end));
    }
    if (statusFilter != null) {
      conjunctions.add(cb.equal(root.get(ProphylaxisSession_.status), statusFilter));
    }

    return cb.and(conjunctions.toArray(Predicate[]::new));
  }

  private ZonedDateTime getStartOfFirstDayOfYear(Integer year) {
    return LocalDate.of(year, 1, 1).atStartOfDay(zoneId);
  }

  private Expression<?> mapToSortPath(Root<ProphylaxisSession> root, CriteriaBuilder cb) {
    return switch (sortKey) {
      case ID -> root.get(ProphylaxisSession_.id);
      case TYPE -> root.get(ProphylaxisSession_.type);
      case GROUP_NAME -> DentalSpecificationUtil.leadingNumbersInGroupName(root, cb);
      case DATE_AND_TIME -> root.get(ProphylaxisSession_.dateAndTime);
      case IS_SCREENING -> root.get(ProphylaxisSession_.isScreening);
      case FLUORIDATION_VARNISH -> root.get(ProphylaxisSession_.fluoridationVarnish);
      case STATUS -> root.get(ProphylaxisSession_.status);
    };
  }
}
