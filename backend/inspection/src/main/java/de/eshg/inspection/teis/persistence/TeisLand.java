/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.teis.persistence;

import de.eshg.inspection.teis.persistence.interfaces.HasBezeichnung;
import de.eshg.inspection.teis.persistence.interfaces.HasKurzbezeichnung;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;

@Entity
public class TeisLand extends TeisEntity implements HasBezeichnung, HasKurzbezeichnung {

  @Column
  @DataSensitivity(SensitivityLevel.PUBLIC)
  String kurzbezeichnung;

  @Column
  @DataSensitivity(SensitivityLevel.PUBLIC)
  String bezeichnung;

  public String getKurzbezeichnung() {
    return kurzbezeichnung;
  }

  public void setKurzbezeichnung(String kurzbezeichnung) {
    this.kurzbezeichnung = kurzbezeichnung;
  }

  @Override
  public String getBezeichnung() {
    return bezeichnung;
  }

  @Override
  public void setBezeichnung(String bezeichnung) {
    this.bezeichnung = bezeichnung;
  }
}
