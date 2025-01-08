/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.domain.specification;

import de.eshg.lib.appointmentblock.persistence.entity.Appointment_;
import de.eshg.lib.procedure.domain.model.ProcedureStatus;
import de.eshg.lib.procedure.domain.model.ProcedureType;
import de.eshg.schoolentry.domain.model.Label;
import de.eshg.schoolentry.domain.model.Label_;
import de.eshg.schoolentry.domain.model.SchoolEntryProcedure;
import de.eshg.schoolentry.domain.model.SchoolEntryProcedure_;
import de.eshg.schoolentry.util.ProcedureSortKey;
import jakarta.persistence.criteria.*;
import java.io.Serial;
import java.time.Instant;
import java.time.Year;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.Assert;

public class SchoolEntryProcedureSpecification implements Specification<SchoolEntryProcedure> {

  @Serial private static final long serialVersionUID = 1L;

  private final ProcedureStatus procedureStatusFilter;
  private final ProcedureType procedureTypeFilter;
  private final UUID schoolIdFilter;
  private final Year schoolYearFilter;
  private final Instant dayOfAppointmentFilter;
  private final Boolean hasAppointmentFilter;
  private final ArrayList<UUID> labelFilter;
  private final Boolean isInvitationSentFilter;
  private final ProcedureSortKey sortKey;
  private final Sort.Direction sortDirection;

  public SchoolEntryProcedureSpecification(
      ProcedureStatus procedureStatusFilter,
      ProcedureType procedureTypeFilter,
      UUID schoolIdFilter,
      Year schoolYearFilter,
      Instant dayOfAppointmentFilter,
      Boolean hasAppointmentFilter,
      ArrayList<UUID> labelFilter,
      Boolean isInvitationSentFilter,
      ProcedureSortKey sortKey,
      Sort.Direction sortDirection) {
    this.procedureStatusFilter = procedureStatusFilter;
    this.procedureTypeFilter = procedureTypeFilter;
    this.schoolIdFilter = schoolIdFilter;
    this.schoolYearFilter = schoolYearFilter;
    this.dayOfAppointmentFilter = dayOfAppointmentFilter;
    this.hasAppointmentFilter = hasAppointmentFilter;
    this.labelFilter = labelFilter;
    this.isInvitationSentFilter = isInvitationSentFilter;
    this.sortKey = sortKey;
    this.sortDirection = sortDirection;
  }

  @Override
  public Predicate toPredicate(
      Root<SchoolEntryProcedure> root, CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder) {
    List<Predicate> conjunctions = new ArrayList<>();

    if (procedureStatusFilter != null) {
      conjunctions.add(
          criteriaBuilder.equal(
              root.get(SchoolEntryProcedure_.procedureStatus), procedureStatusFilter));
    }

    if (procedureTypeFilter != null) {
      conjunctions.add(
          criteriaBuilder.equal(
              root.get(SchoolEntryProcedure_.procedureType), procedureTypeFilter));
    }

    if (schoolIdFilter != null) {
      conjunctions.add(
          criteriaBuilder.equal(root.get(SchoolEntryProcedure_.schoolId), schoolIdFilter));
    }

    if (schoolYearFilter != null) {
      conjunctions.add(
          criteriaBuilder.equal(root.get(SchoolEntryProcedure_.schoolYear), schoolYearFilter));
    }

    if (dayOfAppointmentFilter != null) {
      conjunctions.add(
          criteriaBuilder.between(
              root.join(SchoolEntryProcedure_.appointment).get(Appointment_.appointmentStart),
              dayOfAppointmentFilter,
              dayOfAppointmentFilter.plus(1, ChronoUnit.DAYS)));
    }

    if (hasAppointmentFilter != null) {
      if (hasAppointmentFilter) {
        conjunctions.add(criteriaBuilder.isNotNull(root.get(SchoolEntryProcedure_.appointment)));
      } else {
        conjunctions.add(criteriaBuilder.isNull(root.get(SchoolEntryProcedure_.appointment)));
      }
    }

    if (labelFilter != null) {
      for (UUID labelId : labelFilter) {
        Subquery<SchoolEntryProcedure> subquery = query.subquery(SchoolEntryProcedure.class);
        Root<SchoolEntryProcedure> subqueryRoot = subquery.correlate(root);
        ListJoin<SchoolEntryProcedure, Label> labelJoin =
            subqueryRoot.join(SchoolEntryProcedure_.labels);
        subquery.where(criteriaBuilder.equal(labelJoin.get(Label_.externalId), labelId));
        conjunctions.add(criteriaBuilder.exists(subquery));
      }
    }

    if (isInvitationSentFilter != null) {
      conjunctions.add(
          criteriaBuilder.equal(
              root.get(SchoolEntryProcedure_.isInvitationSent), isInvitationSentFilter));
    }

    Set<Order> orders = new LinkedHashSet<>();
    if (!sortKey.isPersonAttribute()) {
      orders.add(getOrder(root, criteriaBuilder));
    }
    orders.add(getFallbackOrder(root, criteriaBuilder));

    query.orderBy(orders.stream().toList());

    return criteriaBuilder.and(conjunctions.toArray(Predicate[]::new));
  }

  private Order getFallbackOrder(Root<SchoolEntryProcedure> root, CriteriaBuilder criteriaBuilder) {
    Expression<?> fallbackOrderExpression = root.get(SchoolEntryProcedure_.id);
    return switch (sortDirection) {
      case ASC -> criteriaBuilder.asc(fallbackOrderExpression);
      case DESC -> criteriaBuilder.desc(fallbackOrderExpression);
    };
  }

  private Order getOrder(Root<SchoolEntryProcedure> root, CriteriaBuilder criteriaBuilder) {
    Expression<?> expression =
        switch (sortKey) {
          case ID -> root.get(SchoolEntryProcedure_.id);
          case PROCEDURE_TYPE -> root.get(SchoolEntryProcedure_.procedureType);
          case APPOINTMENT_START ->
              nullsLastInstant(
                  root.join(SchoolEntryProcedure_.appointment, JoinType.LEFT)
                      .get(Appointment_.appointmentStart),
                  criteriaBuilder);
          case CREATED_AT -> root.get(SchoolEntryProcedure_.createdAt);
          case MODIFIED_AT -> root.get(SchoolEntryProcedure_.modifiedAt);
          case SCHOOL_YEAR ->
              nullsLastYear(root.get(SchoolEntryProcedure_.schoolYear), criteriaBuilder);
          case DATE_OF_BIRTH, FIRSTNAME, LASTNAME -> {
            Assert.isTrue(
                sortKey.isPersonAttribute(),
                sortKey + " was expected to be a person attribute but it is not");
            throw new IllegalArgumentException("Unexpected sort key: " + sortKey);
          }
        };

    return switch (sortDirection) {
      case ASC -> criteriaBuilder.asc(expression);
      case DESC -> criteriaBuilder.desc(expression);
    };
  }

  private Expression<Instant> nullsLastInstant(Path<Instant> instantPath, CriteriaBuilder cb) {
    Instant valueWhenNull =
        switch (sortDirection) {
          case ASC -> Instant.parse("9999-01-01T00:00:00Z");
          case DESC -> Instant.parse("0000-01-01T00:00:00Z");
        };
    return nullsLast(instantPath, cb, valueWhenNull);
  }

  private Expression<Year> nullsLastYear(Path<Year> instantPath, CriteriaBuilder cb) {
    Year valueWhenNull =
        switch (sortDirection) {
          case ASC -> Year.of(Year.MAX_VALUE);
          case DESC -> Year.of(Year.MIN_VALUE);
        };
    return nullsLast(instantPath, cb, valueWhenNull);
  }

  // This is a workaround because the CriteriaBuilder currently does not support
  // generating SQL’s "NULLS LAST"
  // It’s supposed to be added in Java Persistence 3.2 / Hibernate 7.0
  private static <T> Expression<T> nullsLast(
      Path<T> instantPath, CriteriaBuilder cb, T valueWhenNull) {
    return cb.coalesce(instantPath, cb.literal(valueWhenNull));
  }
}
