/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.opendata.domain.repository;

import de.eshg.opendata.domain.model.Version;
import jakarta.persistence.LockModeType;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface VersionRepository
    extends JpaRepository<Version, Long>, JpaSpecificationExecutor<Version> {

  @Query("select v from Version v where v.externalId = ?1")
  @Lock(LockModeType.PESSIMISTIC_WRITE)
  Optional<Version> findByExternalIdForUpdate(UUID externalId);

  Optional<Version> findByExternalId(UUID externalId);
}
