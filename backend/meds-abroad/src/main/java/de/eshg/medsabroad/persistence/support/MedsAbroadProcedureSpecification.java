/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.medsabroad.persistence.support;

import de.eshg.lib.procedure.domain.model.ProcedureStatus;
import de.eshg.lib.procedure.domain.model.Procedure_;
import de.eshg.medsabroad.persistence.database.MedsAbroadProcedure;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import java.io.Serial;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.lang.NonNull;

public class MedsAbroadProcedureSpecification implements Specification<MedsAbroadProcedure> {

  @Serial private static final long serialVersionUID = 1L;

  private final Instant creationDateStart;
  private final Instant creationDateEnd;
  private final transient Set<ProcedureStatus> procedureStatusFilter;

  public MedsAbroadProcedureSpecification(
      Instant creationDateStart,
      Instant creationDateEnd,
      Set<ProcedureStatus> procedureStatusFilter) {
    this.creationDateStart = creationDateStart;
    this.creationDateEnd = creationDateEnd;
    this.procedureStatusFilter = procedureStatusFilter;
  }

  @Override
  public Predicate toPredicate(
      @NonNull Root<MedsAbroadProcedure> root,
      CriteriaQuery<?> query,
      @NonNull CriteriaBuilder criteriaBuilder) {
    List<Predicate> conjunctions = new ArrayList<>();

    if (creationDateStart != null && creationDateEnd != null) {
      conjunctions.add(
          criteriaBuilder.between(
              root.get(Procedure_.createdAt), creationDateStart, creationDateEnd));
    } else if (creationDateStart != null) {
      conjunctions.add(
          criteriaBuilder.greaterThanOrEqualTo(root.get(Procedure_.createdAt), creationDateStart));
    } else if (creationDateEnd != null) {
      conjunctions.add(
          criteriaBuilder.lessThanOrEqualTo(root.get(Procedure_.createdAt), creationDateEnd));
    }

    if (procedureStatusFilter != null) {
      conjunctions.add(root.get(Procedure_.procedureStatus).in(procedureStatusFilter));
    }

    return criteriaBuilder.and(conjunctions.toArray(Predicate[]::new));
  }
}
