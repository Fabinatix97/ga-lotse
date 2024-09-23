/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.domain.repository;

import de.eshg.schoolentry.domain.model.HearingTestResult;
import jakarta.persistence.LockModeType;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;

public interface HearingTestResultRepository extends JpaRepository<HearingTestResult, Long> {

  @Lock(LockModeType.PESSIMISTIC_WRITE)
  @Query(
      "select r from HearingTestResult r where r.id = (select p.id from SchoolEntryProcedure p where p.externalId = :procedureId)")
  Optional<HearingTestResult> findByProcedureExternalIdForUpdate(UUID procedureId);

  Optional<HearingTestResult> findByProcedureExternalId(UUID externalId);
}
