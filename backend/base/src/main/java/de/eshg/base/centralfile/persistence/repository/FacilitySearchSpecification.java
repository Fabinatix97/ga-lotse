/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.centralfile.persistence.repository;

import static de.eshg.base.util.SearchSpecificationUtil.similarity;

import de.eshg.base.centralfile.persistence.entity.DataOrigin;
import de.eshg.base.centralfile.persistence.entity.Facility;
import de.eshg.base.centralfile.persistence.entity.Facility_;
import de.eshg.base.util.SearchSpecificationUtil;
import jakarta.persistence.criteria.*;
import java.io.Serial;
import java.util.ArrayList;
import java.util.List;
import org.springframework.data.jpa.domain.Specification;

public class FacilitySearchSpecification implements Specification<Facility> {

  @Serial private static final long serialVersionUID = 103990L;

  private final String nameQuery;

  public FacilitySearchSpecification(String nameQuery) {
    this.nameQuery = nameQuery;
  }

  @Override
  public Predicate toPredicate(
      Root<Facility> root, CriteriaQuery<?> query, CriteriaBuilder builder) {
    List<Predicate> conjunctions = new ArrayList<>();
    conjunctions.add(
        builder.notEqual(
            root.get(Facility_.dataOrigin), builder.literal(DataOrigin.EXTERNAL.name())));

    List<Predicate> conjunctionsNameQuery = getNamePredicates(root, builder);
    conjunctions.add(builder.and(conjunctionsNameQuery.toArray(Predicate[]::new)));

    Predicate noFileStatePredicate = createNoFileStatePredicate(root, builder);
    conjunctions.add(noFileStatePredicate);

    query.orderBy(getSortingExpression(root, builder));

    return builder.and(conjunctions.toArray(Predicate[]::new));
  }

  private Order getSortingExpression(Root<Facility> root, CriteriaBuilder builder) {
    return builder.desc(similarity(builder, nameQuery, root.get(Facility_.name)));
  }

  private List<Predicate> getNamePredicates(Root<Facility> root, CriteriaBuilder builder) {
    List<Predicate> disjunctionsNameQueryWords = new ArrayList<>();
    disjunctionsNameQueryWords.add(
        builder.isTrue(
            SearchSpecificationUtil.isSimilar(
                builder, root.get(Facility_.name), builder.literal(nameQuery))));
    Expression<Integer> nameLength = builder.length(root.get(Facility_.name));
    disjunctionsNameQueryWords.add(builder.le(nameLength, 3 * nameQuery.length()));
    return disjunctionsNameQueryWords;
  }

  private Predicate createNoFileStatePredicate(Root<Facility> root, CriteriaBuilder builder) {
    return builder.isNull(root.get(Facility_.referenceFacility));
  }
}
