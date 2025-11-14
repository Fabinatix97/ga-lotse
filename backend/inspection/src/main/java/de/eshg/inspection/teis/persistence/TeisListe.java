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
public class TeisListe extends TeisEntity
    implements HasBezeichnung, HasKurzbezeichnung, HasStichwort {

  @Column
  @DataSensitivity(SensitivityLevel.PUBLIC)
  String liste;

  @Column
  @DataSensitivity(SensitivityLevel.PUBLIC)
  Integer nummer;

  @Column
  @DataSensitivity(SensitivityLevel.PUBLIC)
  String bezeichnung;

  @Column
  @DataSensitivity(SensitivityLevel.PUBLIC)
  String kurzbezeichnung;

  @Column
  @DataSensitivity(SensitivityLevel.PUBLIC)
  String Stichwort;

  public String getListe() {
    return liste;
  }

  public void setListe(String liste) {
    this.liste = liste;
  }

  public Integer getNummer() {
    return nummer;
  }

  public void setNummer(Integer nummer) {
    this.nummer = nummer;
  }

  @Override
  public String getBezeichnung() {
    return bezeichnung;
  }

  @Override
  public void setBezeichnung(String bezeichnung) {
    this.bezeichnung = bezeichnung;
  }

  public String getKurzbezeichnung() {
    return kurzbezeichnung;
  }

  public void setKurzbezeichnung(String kurzbezeichnung) {
    this.kurzbezeichnung = kurzbezeichnung;
  }

  @Override
  public String getStichwort() {
    return Stichwort;
  }

  @Override
  public void setStichwort(String stichwort) {
    Stichwort = stichwort;
  }
}
