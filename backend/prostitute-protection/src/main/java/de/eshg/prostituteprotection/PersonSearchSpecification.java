/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.prostituteprotection;

import de.eshg.prostituteprotection.api.ProstituteProtectionProcedurePaginationAndSortParameters;
import de.eshg.prostituteprotection.domain.model.EncryptedPersonalData;
import de.eshg.prostituteprotection.domain.model.EncryptedPersonalData_;
import de.eshg.prostituteprotection.domain.model.ProstituteProtectionProcedure;
import de.eshg.prostituteprotection.domain.model.ProstituteProtectionProcedure_;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Order;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import java.io.Serial;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import org.springframework.data.jpa.domain.Specification;

class PersonSearchSpecification extends AbstractSpecification
    implements Specification<ProstituteProtectionProcedure> {

  @Serial private static final long serialVersionUID = 1L;

  private final byte[] hash;

  public PersonSearchSpecification(
      ProstituteProtectionProcedurePaginationAndSortParameters paginationAndSortParameters,
      byte[] hash) {
    super(paginationAndSortParameters.sortDirection(), paginationAndSortParameters.sortKey());
    this.hash = hash;
  }

  @Override
  public Predicate toPredicate(
      Root<ProstituteProtectionProcedure> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
    Set<Order> orders = getOrderSet(root, cb);

    List<Predicate> conjunctions = new ArrayList<>();

    Join<ProstituteProtectionProcedure, EncryptedPersonalData> join =
        root.join(ProstituteProtectionProcedure_.encryptedPersonalData, JoinType.LEFT);
    conjunctions.add(cb.equal(join.get(EncryptedPersonalData_.HASHED_PERSON_IDENTIFIER), hash));

    query.orderBy(orders.stream().toList());
    return cb.and(conjunctions.toArray(Predicate[]::new));
  }
}
