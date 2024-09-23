/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.persistence.entity.entry;

import static de.eshg.lib.common.SensitivityLevel.PUBLIC;

import de.eshg.lib.common.DataSensitivity;
import de.eshg.statistics.persistence.entity.CellEntry;
import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import java.util.UUID;

@DataSensitivity(PUBLIC)
@Entity
@DiscriminatorValue("UUID_ENTRY")
public class UuidEntry extends CellEntry {
  @Column private UUID uuidValue;

  public UUID getUuidValue() {
    return uuidValue;
  }

  public void setUuidValue(UUID uuidValue) {
    this.uuidValue = uuidValue;
  }

  @Override
  public Object getValue() {
    return getUuidValue();
  }
}
