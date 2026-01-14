/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.teis.persistence;

import de.eshg.inspection.teis.persistence.interfaces.HasBezeichnung1;
import de.eshg.inspection.teis.persistence.interfaces.HasKurzbezeichnung;
import de.eshg.inspection.teis.persistence.interfaces.HasStichwort;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;

@Entity
public class TeisVerwaltungsbezirk extends TeisEntity
    implements HasBezeichnung1, HasKurzbezeichnung, HasStichwort {

  @Column
  @DataSensitivity(SensitivityLevel.PUBLIC)
  String kurzbezeichnung;

  @Column
  @DataSensitivity(SensitivityLevel.PUBLIC)
  String bezeichnung1;

  @Column
  @DataSensitivity(SensitivityLevel.PUBLIC)
  String stichwort;

  public String getKurzbezeichnung() {
    return kurzbezeichnung;
  }

  public void setKurzbezeichnung(String kurzbezeichnung) {
    this.kurzbezeichnung = kurzbezeichnung;
  }

  public String getBezeichnung1() {
    return bezeichnung1;
  }

  public void setBezeichnung1(String bezeichnung) {
    this.bezeichnung1 = bezeichnung;
  }

  public String getStichwort() {
    return stichwort;
  }

  public void setStichwort(String stichwort) {
    this.stichwort = stichwort;
  }
}
