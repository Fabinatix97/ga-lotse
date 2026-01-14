/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.teis.persistence;

import de.eshg.inspection.teis.persistence.interfaces.HasBezeichnung;
import de.eshg.inspection.teis.persistence.interfaces.HasCasnummer;
import de.eshg.inspection.teis.persistence.interfaces.HasEinheit;
import de.eshg.inspection.teis.persistence.interfaces.HasFilterkuerzel;
import de.eshg.inspection.teis.persistence.interfaces.HasKurzbezeichnung;
import de.eshg.inspection.teis.persistence.interfaces.HasParameter;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(indexes = {@Index(columnList = "einheit_zid"), @Index(columnList = "parameter_zid")})
public class TeisEuParameter extends TeisEntity
    implements HasBezeichnung,
        HasEinheit,
        HasCasnummer,
        HasParameter,
        HasKurzbezeichnung,
        HasFilterkuerzel {

  @Column
  @DataSensitivity(SensitivityLevel.PUBLIC)
  Integer pruefung;

  @Column
  @DataSensitivity(SensitivityLevel.PUBLIC)
  String filterkuerzel;

  @Column
  @DataSensitivity(SensitivityLevel.PUBLIC)
  String casnummer;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "parameter_zid")
  @DataSensitivity(SensitivityLevel.PUBLIC)
  TeisParameter parameter;

  @Column
  @DataSensitivity(SensitivityLevel.PUBLIC)
  String kurzbezeichnung;

  @Column
  @DataSensitivity(SensitivityLevel.PUBLIC)
  String bezeichnung;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "einheit_zid")
  @DataSensitivity(SensitivityLevel.PUBLIC)
  TeisEinheit einheit;

  public Integer getPruefung() {
    return pruefung;
  }

  public void setPruefung(Integer pruefung) {
    this.pruefung = pruefung;
  }

  public String getFilterkuerzel() {
    return filterkuerzel;
  }

  public void setFilterkuerzel(String filterkuerzel) {
    this.filterkuerzel = filterkuerzel;
  }

  public String getCasnummer() {
    return casnummer;
  }

  public void setCasnummer(String casnummer) {
    this.casnummer = casnummer;
  }

  public TeisParameter getParameter() {
    return parameter;
  }

  public void setParameter(TeisParameter parameter) {
    this.parameter = parameter;
  }

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

  public TeisEinheit getEinheit() {
    return einheit;
  }

  public void setEinheit(TeisEinheit einheit) {
    this.einheit = einheit;
  }
}
