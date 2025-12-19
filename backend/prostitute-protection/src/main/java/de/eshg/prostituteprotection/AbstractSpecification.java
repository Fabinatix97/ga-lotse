/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.prostituteprotection;

import de.eshg.api.commons.SortDirection;
import de.eshg.persistence.SpecificationUtil;
import de.eshg.prostituteprotection.api.ProstitutionProtectionProcedureSortKey;
import de.eshg.prostituteprotection.domain.model.PersonalData_;
import de.eshg.prostituteprotection.domain.model.ProstituteProtectionProcedure;
import de.eshg.prostituteprotection.domain.model.ProstituteProtectionProcedure_;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.Expression;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Order;
import jakarta.persistence.criteria.Path;
import jakarta.persistence.criteria.Root;
import java.time.Instant;
import java.util.LinkedHashSet;
import java.util.Objects;
import java.util.Set;

abstract class AbstractSpecification {
  private final SortDirection sortDirection;
  private final ProstitutionProtectionProcedureSortKey sortKey;

  public AbstractSpecification(
      SortDirection sortDirection, ProstitutionProtectionProcedureSortKey sortKey) {
    this.sortDirection = sortDirection;
    this.sortKey = sortKey;
  }

  public SortDirection getSortDirection() {
    return sortDirection;
  }

  public ProstitutionProtectionProcedureSortKey getSortKey() {
    return sortKey;
  }

  protected Set<Order> getOrderSet(Root<ProstituteProtectionProcedure> root, CriteriaBuilder cb) {
    Set<Order> orders = new LinkedHashSet<>();
    orders.add(SpecificationUtil.getOrder(getSortDirection(), cb, mapToSortPath(root, cb)));
    if (!Objects.equals(getSortKey(), ProstitutionProtectionProcedureSortKey.ALIAS)) {
      orders.add(
          SpecificationUtil.getOrder(
              getSortDirection(),
              cb,
              root.join(ProstituteProtectionProcedure_.PERSONAL_DATA, JoinType.LEFT)
                  .get(PersonalData_.ALIAS)));
    }
    orders.add(
        SpecificationUtil.getOrder(
            getSortDirection(), cb, root.get(ProstituteProtectionProcedure_.id)));

    return orders;
  }

  protected Expression<?> mapToSortPath(
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

  protected Expression<String> nullsLastString(Path<String> instantPath, CriteriaBuilder cb) {
    String valueWhenNull =
        switch (sortDirection) {
          case ASC -> null;
          case DESC -> "";
        };
    return SpecificationUtil.nullsLast(instantPath, cb, valueWhenNull);
  }

  protected Expression<Instant> nullsLastInstant(Path<Instant> instantPath, CriteriaBuilder cb) {
    Instant valueWhenNull =
        switch (sortDirection) {
          case ASC -> Instant.parse("9999-01-01T00:00:00Z");
          case DESC -> Instant.parse("0000-01-01T00:00:00Z");
        };
    return SpecificationUtil.nullsLast(instantPath, cb, valueWhenNull);
  }
}
