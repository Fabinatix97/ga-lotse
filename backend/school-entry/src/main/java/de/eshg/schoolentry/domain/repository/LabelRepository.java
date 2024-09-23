/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.domain.repository;

import de.eshg.schoolentry.domain.model.Label;
import jakarta.persistence.LockModeType;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface LabelRepository extends JpaRepository<Label, Long> {

  List<Label> findAllByOrderById();

  List<Label> findAllByExternalIdInOrderById(List<UUID> externalIds);

  boolean existsByNameAndExternalIdIn(String name, List<UUID> externalIds);

  boolean existsByName(String name);

  Optional<Label> findByName(String name);

  Optional<Label> findByExternalId(UUID externalId);

  @Lock(LockModeType.PESSIMISTIC_WRITE)
  @Query("FROM #{#entityName} p WHERE p.externalId = :externalId")
  Optional<Label> findByExternalIdForUpdate(@Param("externalId") UUID externalId);
}
