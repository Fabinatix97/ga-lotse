/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.procedures;

import de.eshg.lib.procedure.domain.model.PersonType;
import de.eshg.lib.procedure.domain.model.Procedure;
import de.eshg.lib.procedure.domain.model.Procedure_;
import de.eshg.lib.procedure.domain.model.RelatedPerson;
import de.eshg.lib.procedure.domain.model.RelatedPerson_;
import jakarta.persistence.EntityManager;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Root;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;

@Component
public class ProcedureQuery {

  private final EntityManager entityManager;

  public ProcedureQuery(EntityManager entityManager) {
    this.entityManager = entityManager;
  }

  public <
          ProcedureT extends Procedure<ProcedureT, ?, RelatedPersonT, ?>,
          RelatedPersonT extends RelatedPerson<ProcedureT>>
      List<UUID> findAllRelatedPersonFileStateIds(
          Specification<ProcedureT> procedureSpecification,
          Class<ProcedureT> procedureClass,
          PersonType personType) {
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<UUID> query = criteriaBuilder.createQuery(UUID.class);
    Root<ProcedureT> root = query.from(procedureClass);

    Join<ProcedureT, ? extends RelatedPerson<?>> relatedPersonsJoin =
        root.join(Procedure_.relatedPersons);
    Join<ProcedureT, ? extends RelatedPerson<?>> childJoin =
        relatedPersonsJoin.on(
            criteriaBuilder.equal(relatedPersonsJoin.get(RelatedPerson_.personType), personType));

    query.select(childJoin.get(RelatedPerson_.centralFileStateId));

    query.where(procedureSpecification.toPredicate(root, query, criteriaBuilder));

    return entityManager.createQuery(query).getResultList();
  }
}
