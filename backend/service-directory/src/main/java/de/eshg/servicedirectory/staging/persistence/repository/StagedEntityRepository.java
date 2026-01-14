/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.servicedirectory.staging.persistence.repository;

import de.eshg.servicedirectory.staging.persistence.entity.StagedEntity;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.NoRepositoryBean;

@NoRepositoryBean
public interface StagedEntityRepository<T extends StagedEntity<?>> extends JpaRepository<T, UUID> {
  Optional<T> findByIdOrStagingInfo_AuditedEntityId(UUID id1, UUID id2);

  List<T> findAllByStagingInfo_CreatedBy(String createdBy);

  List<T> findAllByStagingInfo_CreatedByAndIdIn(String createdBy, List<UUID> ids);

  List<T> findAllByIdIn(List<UUID> ids);
}
