/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.dental.domain.repository;

import de.eshg.dental.domain.model.ProphylaxisSession;
import jakarta.persistence.LockModeType;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ProphylaxisSessionRepository
    extends JpaRepository<ProphylaxisSession, Long>, JpaSpecificationExecutor<ProphylaxisSession> {

  @Modifying
  @Query(
      "update ProphylaxisSession s set s.institutionId = :newInstitutionId where s.institutionId = :oldInstitutionId")
  int replaceInstitutionId(
      @Param("oldInstitutionId") UUID oldInstitutionId,
      @Param("newInstitutionId") UUID newInstitutionId);

  Optional<ProphylaxisSession> findByExternalId(UUID externalId);

  @Lock(LockModeType.PESSIMISTIC_WRITE)
  @Query("from ProphylaxisSession ps where ps.externalId = :externalId")
  Optional<ProphylaxisSession> findByExternalIdForUpdate(UUID externalId);
}
