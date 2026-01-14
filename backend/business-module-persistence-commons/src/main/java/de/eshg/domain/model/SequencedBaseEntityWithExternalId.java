/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.domain.model;

import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.Column;
import jakarta.persistence.MappedSuperclass;
import java.util.UUID;
import org.hibernate.envers.Audited;

@MappedSuperclass
@Audited
public abstract non-sealed class SequencedBaseEntityWithExternalId extends SequencedBaseEntity
    implements EntityWithExternalId {

  @DataSensitivity(SensitivityLevel.PROTECTED)
  @Column(nullable = false, unique = true)
  private final UUID externalId = UUID.randomUUID();

  @Override
  public UUID getExternalId() {
    return externalId;
  }
}
