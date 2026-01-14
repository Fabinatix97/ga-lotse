/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.audit;

import de.eshg.mapper.AuditMapper;
import de.eshg.mapper.RevisionEntry;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import java.util.List;
import org.hibernate.envers.AuditReader;
import org.hibernate.envers.AuditReaderFactory;
import org.hibernate.envers.query.AuditEntity;
import org.hibernate.envers.query.AuditQuery;
import org.springframework.stereotype.Service;

@Service
public class AuditService {

  private final EntityManager entityManager;

  public AuditService(EntityManager entityManager) {
    this.entityManager = entityManager;
  }

  @Transactional
  public <T> List<RevisionEntry<T>> getRevisionsOfEntity(Class<T> returnClass, long id) {
    AuditReader reader = AuditReaderFactory.get(entityManager);
    AuditQuery query =
        reader
            .createQuery()
            .forRevisionsOfEntity(returnClass, false, true)
            .add(AuditEntity.id().eq(id));

    return AuditMapper.mapToRevisionEntryList(returnClass, query.getResultList());
  }
}
