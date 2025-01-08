/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.persistence.entity.entry;

import static de.eshg.lib.common.SensitivityLevel.SENSITIVE;

import de.eshg.lib.common.DataSensitivity;
import de.eshg.statistics.persistence.entity.CellEntry;
import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import java.time.LocalDate;

@DataSensitivity(SENSITIVE)
@Entity
@DiscriminatorValue("DATE_ENTRY")
public class DateEntry extends CellEntry {
  @Column private LocalDate dateValue;

  public LocalDate getDateValue() {
    return dateValue;
  }

  public void setDateValue(LocalDate dateValue) {
    this.dateValue = dateValue;
  }

  @Override
  public Object getValue() {
    return getDateValue() == null ? null : getDateValue().toString();
  }
}
