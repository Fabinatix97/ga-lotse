/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.teis.persistence;

import de.eshg.inspection.teis.persistence.interfaces.HasBezeichnung1;
import de.eshg.inspection.teis.persistence.interfaces.HasBezeichnung2;
import de.eshg.inspection.teis.persistence.interfaces.HasKurzbezeichnung;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;

@Entity
public class TeisAufbereitungsverfahren extends TeisEntity
    implements HasKurzbezeichnung, HasBezeichnung1, HasBezeichnung2 {
  @Column
  @DataSensitivity(SensitivityLevel.PUBLIC)
  String kurzbezeichnung;

  @Column
  @DataSensitivity(SensitivityLevel.PUBLIC)
  String bezeichnung1;

  @Column
  @DataSensitivity(SensitivityLevel.PUBLIC)
  String bezeichnung2;

  public String getKurzbezeichnung() {
    return kurzbezeichnung;
  }

  public void setKurzbezeichnung(String kurzbezeichnung) {
    this.kurzbezeichnung = kurzbezeichnung;
  }

  public String getBezeichnung1() {
    return bezeichnung1;
  }

  public void setBezeichnung1(String bezeichnung1) {
    this.bezeichnung1 = bezeichnung1;
  }

  public String getBezeichnung2() {
    return bezeichnung2;
  }

  public void setBezeichnung2(String bezeichnung2) {
    this.bezeichnung2 = bezeichnung2;
  }
}
