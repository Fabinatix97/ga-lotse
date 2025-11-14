/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.teis.persistence;

import de.eshg.inspection.teis.persistence.interfaces.HasFilterkuerzel;
import de.eshg.inspection.teis.persistence.interfaces.HasKurzbezeichnung;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.validation.constraints.NotNull;

@Entity
public class TeisEinheit extends TeisEntity implements HasKurzbezeichnung, HasFilterkuerzel {
  @Column
  @DataSensitivity(SensitivityLevel.PUBLIC)
  String filterkuerzel;

  @Column(nullable = false)
  @NotNull
  @DataSensitivity(SensitivityLevel.PUBLIC)
  String kurzbezeichnung;

  public String getFilterkuerzel() {
    return filterkuerzel;
  }

  public void setFilterkuerzel(String filterkuerzel) {
    this.filterkuerzel = filterkuerzel;
  }

  public String getKurzbezeichnung() {
    return kurzbezeichnung;
  }

  public void setKurzbezeichnung(String kurzbezeichnung) {
    this.kurzbezeichnung = kurzbezeichnung;
  }
}
