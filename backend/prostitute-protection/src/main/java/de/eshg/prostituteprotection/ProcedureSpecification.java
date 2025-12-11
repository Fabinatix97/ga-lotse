/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.prostituteprotection;

import de.eshg.api.commons.SortDirection;
import de.eshg.lib.procedure.domain.model.ProcedureStatus;
import de.eshg.persistence.SpecificationUtil;
import de.eshg.prostituteprotection.api.ProstituteProtectionProcedurePaginationAndSortParameters;
import de.eshg.prostituteprotection.api.ProstitutionProtectionProcedureSortKey;
import de.eshg.prostituteprotection.domain.model.PersonalData_;
import de.eshg.prostituteprotection.domain.model.ProstituteProtectionProcedure;
import de.eshg.prostituteprotection.domain.model.ProstituteProtectionProcedure_;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Expression;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Order;
import jakarta.persistence.criteria.Path;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import java.io.Serial;
import java.time.Instant;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import org.springframework.data.jpa.domain.Specification;

class ProcedureSpecification implements Specification<ProstituteProtectionProcedure> {

  @Serial private static final long serialVersionUID = 1L;

  private final SortDirection sortDirection;
  private final ProstitutionProtectionProcedureSortKey sortKey;

  public ProcedureSpecification(
      ProstituteProtectionProcedurePaginationAndSortParameters paginationAndSortParameters) {
    sortKey = paginationAndSortParameters.sortKey();
    sortDirection = paginationAndSortParameters.sortDirection();
  }

  @Override
  public Predicate toPredicate(
      Root<ProstituteProtectionProcedure> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
    Set<Order> orders = new LinkedHashSet<>();
    orders.add(SpecificationUtil.getOrder(sortDirection, cb, mapToSortPath(root, cb)));
    if (!Objects.equals(sortKey, ProstitutionProtectionProcedureSortKey.ALIAS)) {
      orders.add(
          SpecificationUtil.getOrder(
              sortDirection,
              cb,
              root.join(ProstituteProtectionProcedure_.PERSONAL_DATA, JoinType.LEFT)
                  .get(PersonalData_.ALIAS)));
    }
    orders.add(
        SpecificationUtil.getOrder(sortDirection, cb, root.get(ProstituteProtectionProcedure_.id)));

    List<Predicate> conjunctions = new ArrayList<>();

    conjunctions.add(
        cb.equal(root.get(ProstituteProtectionProcedure_.procedureStatus), ProcedureStatus.OPEN));

    query.orderBy(orders.stream().toList());

    return cb.and(conjunctions.toArray(Predicate[]::new));
  }

  private Expression<?> mapToSortPath(
      Root<ProstituteProtectionProcedure> root, CriteriaBuilder cb) {
    return switch (sortKey) {
      case ID -> root.get(ProstituteProtectionProcedure_.id);
      case ALIAS ->
          nullsLastString(
              root.join(ProstituteProtectionProcedure_.personalData, JoinType.LEFT)
                  .get(PersonalData_.ALIAS),
              cb);
      case APPOINTMENT_START ->
          nullsLastInstant(root.get(ProstituteProtectionProcedure_.appointmentStart), cb);
    };
  }

  private Expression<String> nullsLastString(Path<String> instantPath, CriteriaBuilder cb) {
    String valueWhenNull =
        switch (sortDirection) {
          case ASC -> null;
          case DESC -> "";
        };
    return SpecificationUtil.nullsLast(instantPath, cb, valueWhenNull);
  }

  private Expression<Instant> nullsLastInstant(Path<Instant> instantPath, CriteriaBuilder cb) {
    Instant valueWhenNull =
        switch (sortDirection) {
          case ASC -> Instant.parse("9999-01-01T00:00:00Z");
          case DESC -> Instant.parse("0000-01-01T00:00:00Z");
        };
    return SpecificationUtil.nullsLast(instantPath, cb, valueWhenNull);
  }
}
