/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.prostituteprotection;

import de.eshg.lib.procedure.domain.model.ProcedureStatus;
import de.eshg.prostituteprotection.api.ProstituteProtectionProcedurePaginationAndSortParameters;
import de.eshg.prostituteprotection.domain.model.PersonalData_;
import de.eshg.prostituteprotection.domain.model.ProstituteProtectionProcedure;
import de.eshg.prostituteprotection.domain.model.ProstituteProtectionProcedure_;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Expression;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Order;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import java.io.Serial;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import org.springframework.data.jpa.domain.Specification;

class ProcedureSpecification extends AbstractSpecification
    implements Specification<ProstituteProtectionProcedure> {

  @Serial private static final long serialVersionUID = 1L;
  private final String aliasSearchParameter;

  public ProcedureSpecification(
      ProstituteProtectionProcedurePaginationAndSortParameters paginationAndSortParameters,
      String aliasSearchParameters) {
    super(paginationAndSortParameters.sortDirection(), paginationAndSortParameters.sortKey());
    this.aliasSearchParameter = aliasSearchParameters;
  }

  @Override
  public Predicate toPredicate(
      Root<ProstituteProtectionProcedure> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
    Set<Order> orders = getOrderSet(root, cb);

    List<Predicate> conjunctions = new ArrayList<>();

    conjunctions.add(
        cb.equal(root.get(ProstituteProtectionProcedure_.procedureStatus), ProcedureStatus.OPEN));

    if (aliasSearchParameter != null) {
      Expression<String> aliasExpression =
          root.join(ProstituteProtectionProcedure_.personalData, JoinType.LEFT)
              .get(PersonalData_.alias);
      Expression<String> literal = cb.literal(aliasSearchParameter);
      conjunctions.add(cb.isTrue(isSimilar(cb, aliasExpression, literal)));
    }

    query.orderBy(orders.stream().toList());
    return cb.and(conjunctions.toArray(Predicate[]::new));
  }

  public static Expression<Boolean> isSimilar(
      CriteriaBuilder cb, Expression<String> lhs, Expression<String> rhs) {
    return cb.function(
        "sql", Boolean.class, cb.literal("? % ?"), normalizeText(cb, lhs), normalizeText(cb, rhs));
  }

  public static Expression<String> normalizeText(CriteriaBuilder cb, Expression<String> input) {
    return cb.function("normalize_text", String.class, input);
  }
}
