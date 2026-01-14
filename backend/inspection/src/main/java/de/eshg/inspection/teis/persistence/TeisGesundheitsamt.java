/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.teis.persistence;

import de.eshg.inspection.teis.persistence.interfaces.HasBezeichnung1;
import de.eshg.inspection.teis.persistence.interfaces.HasKurzbezeichnung;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;

@Entity
public class TeisGesundheitsamt extends TeisEntity implements HasKurzbezeichnung, HasBezeichnung1 {

  @Column
  @DataSensitivity(SensitivityLevel.PUBLIC)
  String kurzbezeichnung;

  @Column
  @DataSensitivity(SensitivityLevel.PUBLIC)
  String bezeichnung1;

  @Column
  @DataSensitivity(SensitivityLevel.PUBLIC)
  String strasse;

  @Column
  @DataSensitivity(SensitivityLevel.PUBLIC)
  String plz;

  @Column
  @DataSensitivity(SensitivityLevel.PUBLIC)
  String ort;

  @Override
  public String getKurzbezeichnung() {
    return kurzbezeichnung;
  }

  @Override
  public void setKurzbezeichnung(String kurzbezeichnung) {
    this.kurzbezeichnung = kurzbezeichnung;
  }

  @Override
  public String getBezeichnung1() {
    return bezeichnung1;
  }

  @Override
  public void setBezeichnung1(String bezeichnung1) {
    this.bezeichnung1 = bezeichnung1;
  }

  public String getStrasse() {
    return strasse;
  }

  public void setStrasse(String strasse) {
    this.strasse = strasse;
  }

  public String getPlz() {
    return plz;
  }

  public void setPlz(String plz) {
    this.plz = plz;
  }

  public String getOrt() {
    return ort;
  }

  public void setOrt(String ort) {
    this.ort = ort;
  }
}
