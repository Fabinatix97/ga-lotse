/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.util;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

@Service
public class FuzzySearchHelper {
  @PersistenceContext private EntityManager entityManager;

  @SuppressWarnings("SqlSourceToSinkFlow") // safe sql string with validated number parameter
  @Transactional(propagation = Propagation.MANDATORY)
  public void setSimilarityThreshold(double threshold) {
    if (!Double.isFinite(threshold)) {
      throw new IllegalArgumentException("Threshold must be finite. Provided: " + threshold);
    }
    if (threshold <= 0 || threshold > 1) {
      throw new IllegalArgumentException(
          "Threshold must be between 0 and 1. Provided: " + threshold);
    }

    entityManager
        .createNativeQuery("set local pg_trgm.similarity_threshold=" + threshold)
        .executeUpdate();
  }
}
