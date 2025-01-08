/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.appointmentblock.persistence;

import de.eshg.lib.appointmentblock.api.AppointmentBlockSortKey;
import de.eshg.lib.appointmentblock.persistence.entity.AppointmentBlock;
import de.eshg.lib.appointmentblock.persistence.entity.AppointmentBlockGroup;
import de.eshg.lib.appointmentblock.persistence.entity.AppointmentBlockGroup_;
import de.eshg.lib.appointmentblock.persistence.entity.AppointmentBlock_;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Expression;
import jakarta.persistence.criteria.Order;
import jakarta.persistence.criteria.Path;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import jakarta.persistence.criteria.Subquery;
import java.io.Serial;
import java.time.Instant;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;

public class AppointmentBlockGroupSpecification implements Specification<AppointmentBlockGroup> {

  @Serial private static final long serialVersionUID = 1L;

  private final Instant startSearchDate;
  private final AppointmentBlockSortKey sortKey;
  private final Sort.Direction sortDirection;

  public AppointmentBlockGroupSpecification(
      Instant startSearchDate, AppointmentBlockSortKey sortKey, Sort.Direction sortDirection) {
    this.startSearchDate = startSearchDate;
    this.sortKey = sortKey;
    this.sortDirection = sortDirection;
  }

  @Override
  public Predicate toPredicate(
      Root<AppointmentBlockGroup> root, CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder) {
    query.orderBy(
        getPrimarySortOrder(root, query, criteriaBuilder),
        getFallbackSortOrder(root, criteriaBuilder));

    Subquery<Instant> maxAppointmentBlockEndSubquery = query.subquery(Instant.class);
    Root<AppointmentBlock> allBlocks = maxAppointmentBlockEndSubquery.from(AppointmentBlock.class);
    maxAppointmentBlockEndSubquery
        .select(criteriaBuilder.greatest(allBlocks.get(AppointmentBlock_.appointmentBlockEnd)))
        .where(criteriaBuilder.equal(allBlocks.get(AppointmentBlock_.appointmentBlockGroup), root));

    return criteriaBuilder.greaterThanOrEqualTo(
        maxAppointmentBlockEndSubquery.getSelection(), startSearchDate);
  }

  private Order getPrimarySortOrder(
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

    Expression<Instant> selection = subquery.getSelection();
    return switch (sortDirection) {
      case ASC -> criteriaBuilder.asc(selection);
      case DESC -> criteriaBuilder.desc(selection);
    };
  }

  private Order getFallbackSortOrder(
      Root<AppointmentBlockGroup> root, CriteriaBuilder criteriaBuilder) {
    Path<Long> idPath = root.get(AppointmentBlockGroup_.id);
    return switch (sortDirection) {
      case ASC -> criteriaBuilder.asc(idPath);
      case DESC -> criteriaBuilder.desc(idPath);
    };
  }
}
