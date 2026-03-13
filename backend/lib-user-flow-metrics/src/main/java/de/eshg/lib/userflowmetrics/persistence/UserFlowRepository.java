/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.userflowmetrics.persistence;

import java.time.Instant;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Stream;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface UserFlowRepository extends JpaRepository<UserFlow, Long> {
  Optional<UserFlow> findByExternalId(UUID id);

  @Query(
      """
        SELECT DISTINCT uf.userFlowType FROM UserFlow uf
    """)
  Set<UserFlowType> findDistinctUserFlowTypes();

  Stream<UserFlow> findByUserFlowTypeAndFlowStartBetween(
      UserFlowType userFlowType, Instant timeRangeStart, Instant timeRangeEnd);
}
