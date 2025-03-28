/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.dental.domain.repository;

import de.eshg.dental.domain.model.ProcedureLabel;
import jakarta.persistence.LockModeType;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ProcedureLabelRepository extends JpaRepository<ProcedureLabel, Long> {

  List<ProcedureLabel> findAllByOrderById();

  List<ProcedureLabel> findAllByExternalIdInOrderById(List<UUID> externalIds);

  boolean existsByName(String name);

  Optional<ProcedureLabel> findByExternalId(UUID externalId);

  @Lock(LockModeType.PESSIMISTIC_WRITE)
  @Query("FROM #{#entityName} p WHERE p.externalId = :externalId")
  Optional<ProcedureLabel> findByExternalIdForUpdate(@Param("externalId") UUID externalId);
}
