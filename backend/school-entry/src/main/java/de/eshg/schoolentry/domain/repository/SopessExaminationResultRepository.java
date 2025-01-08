/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.domain.repository;

import de.eshg.schoolentry.domain.model.SopessExaminationResult;
import jakarta.persistence.LockModeType;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;

public interface SopessExaminationResultRepository
    extends JpaRepository<SopessExaminationResult, Long> {

  @Lock(LockModeType.PESSIMISTIC_WRITE)
  @Query(
      "select r from SopessExaminationResult r where r.id = (select p.id from SchoolEntryProcedure p where p.externalId = :procedureId)")
  Optional<SopessExaminationResult> findByProcedureExternalIdForUpdate(UUID procedureId);

  Optional<SopessExaminationResult> findByProcedureExternalId(UUID externalId);
}
