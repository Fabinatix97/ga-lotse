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
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.lang.NonNull;

public class MedsAbroadProcedureSpecification implements Specification<MedsAbroadProcedure> {

  @Serial private static final long serialVersionUID = 1L;

  private final Instant creationDateFilter;
  private final transient Set<ProcedureStatus> procedureStatusFilter;

  public MedsAbroadProcedureSpecification(
      Instant creationDateFilter, Set<ProcedureStatus> procedureStatusFilter) {
    this.creationDateFilter = creationDateFilter;
    this.procedureStatusFilter = procedureStatusFilter;
  }

  @Override
  public Predicate toPredicate(
      @NonNull Root<MedsAbroadProcedure> root,
      CriteriaQuery<?> query,
      @NonNull CriteriaBuilder criteriaBuilder) {
    List<Predicate> conjunctions = new ArrayList<>();

    if (creationDateFilter != null) {
      conjunctions.add(
          criteriaBuilder.between(
              root.get(Procedure_.createdAt),
              creationDateFilter,
              creationDateFilter.plus(1, ChronoUnit.DAYS)));
    }

    if (procedureStatusFilter != null) {
      conjunctions.add(root.get(Procedure_.procedureStatus).in(procedureStatusFilter));
    }

    return criteriaBuilder.and(conjunctions.toArray(Predicate[]::new));
  }
}
