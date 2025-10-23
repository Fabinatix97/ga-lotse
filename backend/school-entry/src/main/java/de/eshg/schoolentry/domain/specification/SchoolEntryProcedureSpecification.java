/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.domain.specification;

import de.eshg.api.commons.SortDirection;
import de.eshg.lib.appointmentblock.persistence.entity.Appointment_;
import de.eshg.lib.procedure.domain.model.ProcedureStatus;
import de.eshg.lib.procedure.domain.model.ProcedureType;
import de.eshg.lib.procedure.domain.model.ProgressEntry;
import de.eshg.lib.procedure.domain.model.SystemProgressEntry;
import de.eshg.lib.procedure.domain.model.SystemProgressEntry_;
import de.eshg.persistence.SpecificationUtil;
import de.eshg.schoolentry.domain.model.ProcedureLabel;
import de.eshg.schoolentry.domain.model.ProcedureLabel_;
import de.eshg.schoolentry.domain.model.SchoolEntryProcedure;
import de.eshg.schoolentry.domain.model.SchoolEntryProcedure_;
import de.eshg.schoolentry.util.ProcedureSortKey;
import de.eshg.schoolentry.util.SchoolEntrySystemProgressEntryType;
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
  private final ArrayList<UUID> excludedLabelFilter;
  private final Boolean isInvitationSentFilter;
  private final Boolean hasExaminationEditsFilter;
  private final ProcedureSortKey sortKey;
  private final SortDirection sortDirection;

  public SchoolEntryProcedureSpecification(
      ProcedureStatus procedureStatusFilter,
      ProcedureType procedureTypeFilter,
      UUID schoolIdFilter,
      Year schoolYearFilter,
      Instant dayOfAppointmentFilter,
      Boolean hasAppointmentFilter,
      ArrayList<UUID> labelFilter,
      ArrayList<UUID> excludedLabelFilter,
      Boolean isInvitationSentFilter,
      Boolean hasExaminationEditsFilter,
      ProcedureSortKey sortKey,
      SortDirection sortDirection) {
    this.procedureStatusFilter = procedureStatusFilter;
    this.procedureTypeFilter = procedureTypeFilter;
    this.schoolIdFilter = schoolIdFilter;
    this.schoolYearFilter = schoolYearFilter;
    this.dayOfAppointmentFilter = dayOfAppointmentFilter;
    this.hasAppointmentFilter = hasAppointmentFilter;
    this.labelFilter = labelFilter;
    this.excludedLabelFilter = excludedLabelFilter;
    this.isInvitationSentFilter = isInvitationSentFilter;
    this.hasExaminationEditsFilter = hasExaminationEditsFilter;
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
        ListJoin<SchoolEntryProcedure, ProcedureLabel> labelJoin =
            subqueryRoot.join(SchoolEntryProcedure_.labels);
        subquery.where(criteriaBuilder.equal(labelJoin.get(ProcedureLabel_.externalId), labelId));
        conjunctions.add(criteriaBuilder.exists(subquery));
      }
    }

    if (excludedLabelFilter != null) {
      for (UUID excludedLabelId : excludedLabelFilter) {
        Subquery<SchoolEntryProcedure> subquery = query.subquery(SchoolEntryProcedure.class);
        Root<SchoolEntryProcedure> subqueryRoot = subquery.correlate(root);
        ListJoin<SchoolEntryProcedure, ProcedureLabel> labelJoin =
            subqueryRoot.join(SchoolEntryProcedure_.labels);
        subquery.where(
            criteriaBuilder.equal(labelJoin.get(ProcedureLabel_.externalId), excludedLabelId));
        conjunctions.add(criteriaBuilder.not(criteriaBuilder.exists(subquery)));
      }
    }

    if (isInvitationSentFilter != null) {
      conjunctions.add(
          criteriaBuilder.equal(
              root.get(SchoolEntryProcedure_.isInvitationSent), isInvitationSentFilter));
    }

    if (hasExaminationEditsFilter != null) {
      Subquery<SchoolEntryProcedure> subquery = query.subquery(SchoolEntryProcedure.class);
      Root<SchoolEntryProcedure> subqueryRoot = subquery.correlate(root);
      ListJoin<SchoolEntryProcedure, ProgressEntry> progressEntryJoin =
          subqueryRoot.join(SchoolEntryProcedure_.progressEntries);
      ListJoin<SchoolEntryProcedure, SystemProgressEntry> systemProgressEntryJoin =
          criteriaBuilder.treat(progressEntryJoin, SystemProgressEntry.class);
      List<String> examinationProgressEntryTypes =
          List.of(
              SchoolEntrySystemProgressEntryType.EYE_EXAMINATION_MODIFIED.toString(),
              SchoolEntrySystemProgressEntryType.HEARING_TEST_MODIFIED.toString(),
              SchoolEntrySystemProgressEntryType.SOPESS_EXAMINATION_MODIFIED.toString(),
              SchoolEntrySystemProgressEntryType.DEVELOPMENT_SCREENING_MODIFIED.toString());

      Predicate predicate =
          systemProgressEntryJoin
              .get(SystemProgressEntry_.SYSTEM_PROGRESS_ENTRY_TYPE)
              .in(examinationProgressEntryTypes);
      subquery.where(predicate);
      if (hasExaminationEditsFilter) {
        conjunctions.add(criteriaBuilder.exists(subquery));
      } else {
        conjunctions.add(criteriaBuilder.exists(subquery).not());
      }
    }

    Set<Order> orders = new LinkedHashSet<>();
    if (!sortKey.isPersonAttribute()) {
      orders.add(
          SpecificationUtil.getOrder(
              sortDirection, criteriaBuilder, mapToSortPath(root, criteriaBuilder)));
    }
    orders.add(
        SpecificationUtil.getOrder(
            sortDirection, criteriaBuilder, root.get(SchoolEntryProcedure_.id)));

    query.orderBy(orders.stream().toList());

    return criteriaBuilder.and(conjunctions.toArray(Predicate[]::new));
  }

  private Expression<?> mapToSortPath(
      Root<SchoolEntryProcedure> root, CriteriaBuilder criteriaBuilder) {
    return switch (sortKey) {
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
  }

  private Expression<Instant> nullsLastInstant(Path<Instant> instantPath, CriteriaBuilder cb) {
    Instant valueWhenNull =
        switch (sortDirection) {
          case ASC -> Instant.parse("9999-01-01T00:00:00Z");
          case DESC -> Instant.parse("0000-01-01T00:00:00Z");
        };
    return SpecificationUtil.nullsLast(instantPath, cb, valueWhenNull);
  }

  private Expression<Year> nullsLastYear(Path<Year> instantPath, CriteriaBuilder cb) {
    Year valueWhenNull =
        switch (sortDirection) {
          case ASC -> Year.of(Year.MAX_VALUE);
          case DESC -> Year.of(Year.MIN_VALUE);
        };
    return SpecificationUtil.nullsLast(instantPath, cb, valueWhenNull);
  }
}
