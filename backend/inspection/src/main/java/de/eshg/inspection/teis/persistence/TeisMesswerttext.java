/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.teis.persistence;

import de.eshg.inspection.teis.persistence.interfaces.HasFilterkuerzel;
import de.eshg.inspection.teis.persistence.interfaces.HasKurzbezeichnung;
import de.eshg.inspection.teis.persistence.interfaces.HasWert;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;

@Entity
public class TeisMesswerttext extends TeisEntity
    implements HasKurzbezeichnung, HasWert, HasFilterkuerzel {

  @Column
  @DataSensitivity(SensitivityLevel.PUBLIC)
  String kurzbezeichnung;

  @Column
  @DataSensitivity(SensitivityLevel.PUBLIC)
  Integer wert;

  @Column
  @DataSensitivity(SensitivityLevel.PUBLIC)
  String filterkuerzel;

  public String getKurzbezeichnung() {
    return kurzbezeichnung;
  }

  public void setKurzbezeichnung(String kurzbezeichnung) {
    this.kurzbezeichnung = kurzbezeichnung;
  }

  public Integer getWert() {
    return wert;
  }

  public void setWert(Integer wert) {
    this.wert = wert;
  }

  public String getFilterkuerzel() {
    return filterkuerzel;
  }

  public void setFilterkuerzel(String filterkuerzel) {
    this.filterkuerzel = filterkuerzel;
  }
}
