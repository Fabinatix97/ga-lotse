/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.servicedirectory.audit;

import de.eshg.libservicedirectoryadminapi.api.audit.RevisionDto;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;
import java.time.Instant;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.transaction.annotation.Transactional;

@org.springframework.stereotype.Service
public class AuditService {

  private static final Logger logger = LoggerFactory.getLogger(AuditService.class);

  @PersistenceContext private EntityManager entityManager;

  @Transactional(readOnly = true)
  public List<String> getUsernames() {
    List<String> usernames;
    Query query =
        entityManager.createNativeQuery("SELECT DISTINCT author FROM revinfo", String.class);
    usernames = castToStringList(query.getResultList());

    logger.debug("got {} usernames from db", usernames.size());

    return usernames;
  }

  @Transactional(readOnly = true)
  public List<RevisionDto> getRevisions(
      Instant startInclusive, Instant endExclusive, String username) {
    RevisionAccumulator revisions;

    revisions = new RevisionAccumulator(entityManager, startInclusive, endExclusive, username);

    revisions.fetchRevisions();

    logger.debug("retrieved total of {} revisions", revisions.getRevisions().size());
    return List.copyOf(revisions.getRevisions());
  }

  @SuppressWarnings({"unchecked"})
  private static List<String> castToStringList(List<?> in) {
    assert in.stream().allMatch(String.class::isInstance);
    return (List<String>) in;
  }
}
