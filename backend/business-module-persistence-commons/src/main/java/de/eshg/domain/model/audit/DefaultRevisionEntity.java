/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.domain.model.audit;

import de.eshg.domain.model.BaseRevisionEntity;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import java.util.UUID;
import org.hibernate.envers.RevisionEntity;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@Entity
@RevisionEntity
@EntityListeners(AuditingEntityListener.class)
public class DefaultRevisionEntity extends BaseRevisionEntity {

  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  @CreatedBy
  private UUID createdBy;

  public UUID getCreatedBy() {
    return createdBy;
  }
}
