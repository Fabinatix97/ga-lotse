/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.appointmentblock.persistence;

import de.eshg.api.commons.SortDirection;
import de.eshg.lib.appointmentblock.api.AppointmentBlockSortKey;
import de.eshg.lib.appointmentblock.persistence.entity.AppointmentBlock;
import de.eshg.lib.appointmentblock.persistence.entity.AppointmentBlockGroup;
import de.eshg.lib.appointmentblock.persistence.entity.AppointmentBlockGroup_;
import de.eshg.lib.appointmentblock.persistence.entity.AppointmentBlock_;
import de.eshg.persistence.SpecificationUtil;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Expression;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import jakarta.persistence.criteria.Subquery;
import java.io.Serial;
import java.time.Instant;
import org.springframework.data.jpa.domain.Specification;

public class AppointmentBlockGroupSpecification implements Specification<AppointmentBlockGroup> {

  @Serial private static final long serialVersionUID = 1L;

  private final Instant startSearchDate;
  private final AppointmentBlockSortKey sortKey;
  private final SortDirection sortDirection;

  public AppointmentBlockGroupSpecification(
      Instant startSearchDate, AppointmentBlockSortKey sortKey, SortDirection sortDirection) {
    this.startSearchDate = startSearchDate;
    this.sortKey = sortKey;
    this.sortDirection = sortDirection;
  }

  @Override
  public Predicate toPredicate(
      Root<AppointmentBlockGroup> root, CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder) {
    query.orderBy(
        SpecificationUtil.getOrder(
            sortDirection, criteriaBuilder, mapToSortPath(root, query, criteriaBuilder)),
        SpecificationUtil.getOrder(
            sortDirection, criteriaBuilder, root.get(AppointmentBlockGroup_.id)));

    Subquery<Instant> maxAppointmentBlockEndSubquery = query.subquery(Instant.class);
    Root<AppointmentBlock> allBlocks = maxAppointmentBlockEndSubquery.from(AppointmentBlock.class);
    maxAppointmentBlockEndSubquery
        .select(criteriaBuilder.greatest(allBlocks.get(AppointmentBlock_.appointmentBlockEnd)))
        .where(criteriaBuilder.equal(allBlocks.get(AppointmentBlock_.appointmentBlockGroup), root));

    return criteriaBuilder.greaterThanOrEqualTo(
        maxAppointmentBlockEndSubquery.getSelection(), startSearchDate);
  }

  private Expression<Instant> mapToSortPath(
      Root<AppointmentBlockGroup> root, CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder) {
    Subquery<Instant> subquery = query.subquery(Instant.class);
    Root<AppointmentBlock> subqueryRoot = subquery.from(AppointmentBlock.class);

    Expression<Instant> expression =
        switch (sortKey) {
          case START ->
              criteriaBuilder.least(subqueryRoot.get(AppointmentBlock_.appointmentBlockStart));
          case END ->
              criteriaBuilder.greatest(subqueryRoot.get(AppointmentBlock_.appointmentBlockEnd));
        };

    subquery
        .select(expression)
        .where(
            criteriaBuilder.equal(subqueryRoot.get(AppointmentBlock_.appointmentBlockGroup), root));

    return subquery.getSelection();
  }
}
