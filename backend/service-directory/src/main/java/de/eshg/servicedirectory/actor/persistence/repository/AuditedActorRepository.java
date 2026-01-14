/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.servicedirectory.actor.persistence.repository;

import de.eshg.servicedirectory.actor.persistence.entity.AuditedActor;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface AuditedActorRepository extends JpaRepository<AuditedActor, UUID> {

  Optional<AuditedActor> findByCommonName(String commonName);

  Optional<AuditedActor> findByOrgUnitIdAndReadableName(UUID orgUnitId, String readableName);

  @Query(
      """
          SELECT a
          FROM AuditedActor a
          WHERE a.active = true
          AND a.orgUnit.active = true
          ORDER BY a.id
          """)
  List<AuditedActor> findAllActive();
}
