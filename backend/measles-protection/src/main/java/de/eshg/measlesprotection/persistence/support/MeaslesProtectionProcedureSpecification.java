/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.measlesprotection.persistence.support;

import de.eshg.lib.procedure.domain.model.PersonType;
import de.eshg.lib.procedure.domain.model.ProcedureStatus;
import de.eshg.lib.procedure.domain.model.Procedure_;
import de.eshg.lib.procedure.domain.model.RelatedPerson_;
import de.eshg.measlesprotection.api.MeasureDto;
import de.eshg.measlesprotection.api.ProofRequestSentDto;
import de.eshg.measlesprotection.persistence.db.AccessRestriction;
import de.eshg.measlesprotection.persistence.db.AccessRestriction_;
import de.eshg.measlesprotection.persistence.db.CaseStatus;
import de.eshg.measlesprotection.persistence.db.Facility_;
import de.eshg.measlesprotection.persistence.db.LetterType;
import de.eshg.measlesprotection.persistence.db.MPFacilityType;
import de.eshg.measlesprotection.persistence.db.MeaslesProtectionProcedure;
import de.eshg.measlesprotection.persistence.db.MeaslesProtectionProcedure_;
import de.eshg.measlesprotection.persistence.db.MonetaryFine;
import de.eshg.measlesprotection.persistence.db.MonetaryFine_;
import de.eshg.measlesprotection.persistence.db.Person_;
import de.eshg.measlesprotection.persistence.db.ProofRequestLetter;
import de.eshg.measlesprotection.persistence.db.ProofRequestLetter_;
import de.eshg.measlesprotection.persistence.db.ProofSubmission;
import de.eshg.measlesprotection.persistence.db.ProofSubmission_;
import de.eshg.measlesprotection.persistence.db.RoleStatus;
import de.eshg.measlesprotection.persistence.db.SubmissionResult;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import jakarta.persistence.criteria.Subquery;
import java.io.Serial;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import org.springframework.data.jpa.domain.Specification;

public class MeaslesProtectionProcedureSpecification
    implements Specification<MeaslesProtectionProcedure> {

  @Serial private static final long serialVersionUID = 1L;

  private final Instant creationDateFilter;
  private final transient Set<MPFacilityType> facilityTypeFilter;
  private final transient Set<CaseStatus> caseStatusFilter;
  private final transient Set<ProcedureStatus> procedureStatusFilter;
  private final transient Set<RoleStatus> roleStatusFilter;
  private final Boolean hasAppointmentFilter;
  private final transient Set<MeasureDto> measureFilter;
  private final transient Set<ProofRequestSentDto> proofRequestSent;
  private final transient Set<SubmissionResult> proofSubmissionResultFilter;

  public MeaslesProtectionProcedureSpecification(
      Instant creationDateFilter,
      Set<MPFacilityType> facilityTypeFilter,
      Set<CaseStatus> caseStatusFilter,
      Set<ProcedureStatus> procedureStatusFilter,
      Set<RoleStatus> roleStatusFilter,
      Boolean hasAppointmentFilter,
      Set<MeasureDto> measureFilter,
      Set<ProofRequestSentDto> proofRequestSent,
      Set<SubmissionResult> proofSubmissionResultFilter) {
    this.creationDateFilter = creationDateFilter;
    this.facilityTypeFilter = facilityTypeFilter;
    this.caseStatusFilter = caseStatusFilter;
    this.procedureStatusFilter = procedureStatusFilter;
    this.roleStatusFilter = roleStatusFilter;
    this.hasAppointmentFilter = hasAppointmentFilter;
    this.measureFilter = measureFilter;
    this.proofRequestSent = proofRequestSent;
    this.proofSubmissionResultFilter = proofSubmissionResultFilter;
  }

  @Override
  public Predicate toPredicate(
      Root<MeaslesProtectionProcedure> root,
      CriteriaQuery<?> query,
      CriteriaBuilder criteriaBuilder) {
    List<Predicate> conjunctions = new ArrayList<>();

    if (creationDateFilter != null) {
      conjunctions.add(
          criteriaBuilder.between(
              root.get(Procedure_.createdAt),
              creationDateFilter,
              creationDateFilter.plus(1, ChronoUnit.DAYS)));
    }

    if (facilityTypeFilter != null) {
      conjunctions.add(
          root.join(Procedure_.relatedFacilities)
              .get(Facility_.MP_FACILITY_TYPE)
              .in(facilityTypeFilter));
    }

    if (caseStatusFilter != null) {
      conjunctions.add(root.get(MeaslesProtectionProcedure_.caseStatus).in(caseStatusFilter));
    }

    if (procedureStatusFilter != null) {
      conjunctions.add(root.get(Procedure_.procedureStatus).in(procedureStatusFilter));
    }

    if (roleStatusFilter != null) {
      Join<Object, Object> procedureAndPersons =
          root.join(Procedure_.RELATED_PERSONS, JoinType.INNER);
      conjunctions.add(
          criteriaBuilder.and(
              procedureAndPersons.get(RelatedPerson_.PERSON_TYPE).in(Set.of(PersonType.PATIENT)),
              procedureAndPersons.get(Person_.ROLE_STATUS).in(roleStatusFilter)));
    }

    if (hasAppointmentFilter != null) {
      if (Boolean.TRUE.equals(hasAppointmentFilter)) {
        conjunctions.add(
            criteriaBuilder.isNotNull(root.get(MeaslesProtectionProcedure_.appointment)));
      } else {
        conjunctions.add(criteriaBuilder.isNull(root.get(MeaslesProtectionProcedure_.appointment)));
      }
    }

    if (measureFilter != null) {
      List<Predicate> disjunction = new ArrayList<>();

      if (measureFilter.contains(MeasureDto.ACCESS_RESTRICTION)) {
        Subquery<Integer> subquery = query.subquery(Integer.class);
        Root<AccessRestriction> accessRestriction = subquery.from(AccessRestriction.class);
        subquery
            .select(criteriaBuilder.literal(1))
            .where(
                criteriaBuilder.equal(accessRestriction.get(AccessRestriction_.PROCEDURE), root));
        disjunction.add(criteriaBuilder.exists(subquery));
      }

      if (measureFilter.contains(MeasureDto.MONETARY_FINE)) {
        Subquery<Integer> subquery = query.subquery(Integer.class);
        Root<MonetaryFine> monetaryFine = subquery.from(MonetaryFine.class);
        subquery
            .select(criteriaBuilder.literal(1))
            .where(criteriaBuilder.equal(monetaryFine.get(MonetaryFine_.PROCEDURE), root));
        disjunction.add(criteriaBuilder.exists(subquery));
      }

      conjunctions.add(criteriaBuilder.or(disjunction.toArray(Predicate[]::new)));
    }

    if (proofRequestSent != null) {
      Subquery<Long> subquery = query.subquery(Long.class);
      Root<ProofRequestLetter> proofRequestLetter = subquery.from(ProofRequestLetter.class);
      subquery.select(proofRequestLetter.get(ProofRequestLetter_.PROCEDURE));
      subquery.where(
          criteriaBuilder.equal(
              proofRequestLetter.get(ProofRequestLetter_.LETTER_TYPE),
              LetterType.LETTER_TO_PATIENT));
      subquery.groupBy(proofRequestLetter.get(ProofRequestLetter_.PROCEDURE));

      if (proofRequestSent.contains(ProofRequestSentDto.FIRST_LETTER)
          && proofRequestSent.contains(ProofRequestSentDto.FOLLOW_UP_LETTER)) {
        subquery.having(criteriaBuilder.greaterThan(criteriaBuilder.count(proofRequestLetter), 0L));
      } else if (proofRequestSent.contains(ProofRequestSentDto.FIRST_LETTER)) {
        subquery.having(criteriaBuilder.equal(criteriaBuilder.count(proofRequestLetter), 1L));
      } else if (proofRequestSent.contains(ProofRequestSentDto.FOLLOW_UP_LETTER)) {
        subquery.having(criteriaBuilder.greaterThan(criteriaBuilder.count(proofRequestLetter), 1L));
      }
      conjunctions.add(root.get(MeaslesProtectionProcedure_.id).in(subquery));
    }

    if (proofSubmissionResultFilter != null) {
      Join<MeaslesProtectionProcedure, ProofSubmission> join =
          root.join(MeaslesProtectionProcedure_.PROOF_SUBMISSIONS);
      conjunctions.add(join.get(ProofSubmission_.submissionResult).in(proofSubmissionResultFilter));
    }

    return criteriaBuilder.and(conjunctions.toArray(Predicate[]::new));
  }
}
