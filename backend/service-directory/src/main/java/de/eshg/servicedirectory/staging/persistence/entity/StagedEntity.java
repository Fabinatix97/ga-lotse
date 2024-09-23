/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.servicedirectory.staging.persistence.entity;

import de.eshg.domain.model.GloballyUniqueEntityBase;
import java.util.Optional;
import java.util.UUID;

public interface StagedEntity<T extends GloballyUniqueEntityBase> {

  UUID getId();

  StagingInfo<T> getStagingInfo();

  default boolean isPreserved() {
    return getStagingInfo().getStagedEntityType() != StagedEntityType.DEL;
  }

  default boolean isDeleted() {
    return getStagingInfo().getStagedEntityType() == StagedEntityType.DEL;
  }

  default StagedEntityType getStagedEntityType() {
    return getStagingInfo().getStagedEntityType();
  }

  default void setStagedEntityType(StagedEntityType stagedEntityType) {
    getStagingInfo().setStagedEntityType(stagedEntityType);
  }

  default T getAuditedEntity() {
    return getStagingInfo().getAuditedEntity();
  }

  default void setAuditedEntity(T auditedEntity) {
    getStagingInfo().setAuditedEntity(auditedEntity);
  }

  default UUID getAuditedEntityIdOrNull() {
    return Optional.of(getStagingInfo())
        .map(StagingInfo::getAuditedEntity)
        .map(GloballyUniqueEntityBase::getId)
        .orElse(null);
  }

  default String getCreatedBy() {
    return getStagingInfo().getCreatedBy();
  }

  default void setCreatedBy(String createdBy) {
    getStagingInfo().setCreatedBy(createdBy);
  }

  default StagingStatus getStagingStatus() {
    return getStagingInfo().getStagingStatus();
  }

  default void setStagingStatus(StagingStatus stagingStatus) {
    getStagingInfo().setStagingStatus(stagingStatus);
  }
}
