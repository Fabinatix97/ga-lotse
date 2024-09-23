/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.domain.model;

import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.MappedSuperclass;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;

@MappedSuperclass
public non-sealed class GloballyUniqueEntityBase extends GenericEntity<UUID>
    implements EntityWithExternalId {

  @DataSensitivity(SensitivityLevel.PROTECTED)
  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  @NotNull
  protected UUID id;

  @Override
  public UUID getId() {
    return id;
  }

  @Override
  public UUID getExternalId() {
    return getId();
  }
}
