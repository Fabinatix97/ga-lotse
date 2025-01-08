/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.domain.repository;

import de.eshg.schoolentry.domain.model.DevelopmentScreening;
import jakarta.persistence.LockModeType;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;

public interface DevelopmentScreeningResultRepository
    extends JpaRepository<DevelopmentScreening, Long> {

  @Lock(LockModeType.PESSIMISTIC_WRITE)
  @Query(
      "select r from DevelopmentScreening r where r.id = (select p.id from SchoolEntryProcedure p where p.externalId = :procedureId)")
  Optional<DevelopmentScreening> findByProcedureExternalIdForUpdate(UUID procedureId);

  Optional<DevelopmentScreening> findByProcedureExternalId(UUID externalId);
}
