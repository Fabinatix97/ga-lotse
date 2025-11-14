/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.teis.persistence;

import de.eshg.inspection.teis.persistence.interfaces.HasBezeichnung;
import de.eshg.inspection.teis.persistence.interfaces.HasKurzbezeichnung;
import de.eshg.inspection.teis.persistence.interfaces.HasStichwort;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;

@Entity
public class TeisUntersuchungsumfang extends TeisEntity
    implements HasBezeichnung, HasKurzbezeichnung, HasStichwort {

  @Column
  @DataSensitivity(SensitivityLevel.PUBLIC)
  String kurzbezeichnung;

  @Column
  @DataSensitivity(SensitivityLevel.PUBLIC)
  String bezeichnung;

  @Column
  @DataSensitivity(SensitivityLevel.PUBLIC)
  String notiz;

  @Column
  @DataSensitivity(SensitivityLevel.PUBLIC)
  String stichwort;

  public String getKurzbezeichnung() {
    return kurzbezeichnung;
  }

  public void setKurzbezeichnung(String kurzbezeichnung) {
    this.kurzbezeichnung = kurzbezeichnung;
  }

  public String getBezeichnung() {
    return bezeichnung;
  }

  public void setBezeichnung(String bezeichnung) {
    this.bezeichnung = bezeichnung;
  }

  public String getNotiz() {
    return notiz;
  }

  public void setNotiz(String notiz) {
    this.notiz = notiz;
  }

  public String getStichwort() {
    return stichwort;
  }

  public void setStichwort(String stichwort) {
    this.stichwort = stichwort;
  }
}
