/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.gdpr.persistence.repository;

import de.eshg.base.gdpr.persistence.GdprProcedure;
import jakarta.persistence.LockModeType;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface GdprProcedureRepository
    extends JpaRepository<GdprProcedure, Long>, JpaSpecificationExecutor<GdprProcedure> {
  Optional<GdprProcedure> findByExternalId(UUID externalId);

  @Lock(LockModeType.PESSIMISTIC_WRITE)
  @Query("select p from GdprProcedure p where p.externalId =:externalId")
  Optional<GdprProcedure> findByExternalIdForUpdate(@Param("externalId") UUID externalId);
}
