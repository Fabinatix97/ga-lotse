/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.teis.persistence;

import de.eshg.inspection.teis.persistence.interfaces.HasBezeichnung;
import de.eshg.inspection.teis.persistence.interfaces.HasCasnummer;
import de.eshg.inspection.teis.persistence.interfaces.HasEinheit;
import de.eshg.inspection.teis.persistence.interfaces.HasFilterkuerzel;
import de.eshg.inspection.teis.persistence.interfaces.HasKurzbezeichnung;
import de.eshg.inspection.teis.persistence.interfaces.HasStichwort;
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
@Table(indexes = @Index(columnList = "einheit_zid"))
public class TeisParameter extends TeisEntity
    implements HasBezeichnung,
        HasEinheit,
        HasCasnummer,
        HasKurzbezeichnung,
        HasStichwort,
        HasFilterkuerzel {

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

  @Column
  @DataSensitivity(SensitivityLevel.PUBLIC)
  String histkurzbezeichnung;

  @Column
  @DataSensitivity(SensitivityLevel.PUBLIC)
  String hygrisnummer;

  @Column
  @DataSensitivity(SensitivityLevel.PUBLIC)
  String casnummer;

  @Column
  @DataSensitivity(SensitivityLevel.PUBLIC)
  String synonym1;

  @Column
  @DataSensitivity(SensitivityLevel.PUBLIC)
  String synonym2;

  @Column
  @DataSensitivity(SensitivityLevel.PUBLIC)
  String synonym3;

  @Column
  @DataSensitivity(SensitivityLevel.PUBLIC)
  String synonym4;

  @Column
  @DataSensitivity(SensitivityLevel.PUBLIC)
  String synonym5;

  @Column
  @DataSensitivity(SensitivityLevel.PUBLIC)
  Integer pzsumme;

  @Column
  @DataSensitivity(SensitivityLevel.PUBLIC)
  String stichwort;

  @Column
  @DataSensitivity(SensitivityLevel.PUBLIC)
  String filterkuerzel;

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

  public String getHistkurzbezeichnung() {
    return histkurzbezeichnung;
  }

  public void setHistkurzbezeichnung(String histkurzbezeichnung) {
    this.histkurzbezeichnung = histkurzbezeichnung;
  }

  public String getHygrisnummer() {
    return hygrisnummer;
  }

  public void setHygrisnummer(String hygrisnummer) {
    this.hygrisnummer = hygrisnummer;
  }

  public String getCasnummer() {
    return casnummer;
  }

  public void setCasnummer(String casnummer) {
    this.casnummer = casnummer;
  }

  public String getSynonym1() {
    return synonym1;
  }

  public void setSynonym1(String synonym1) {
    this.synonym1 = synonym1;
  }

  public String getSynonym2() {
    return synonym2;
  }

  public void setSynonym2(String synonym2) {
    this.synonym2 = synonym2;
  }

  public String getSynonym3() {
    return synonym3;
  }

  public void setSynonym3(String synonym3) {
    this.synonym3 = synonym3;
  }

  public String getSynonym4() {
    return synonym4;
  }

  public void setSynonym4(String synonym4) {
    this.synonym4 = synonym4;
  }

  public String getSynonym5() {
    return synonym5;
  }

  public void setSynonym5(String synonym5) {
    this.synonym5 = synonym5;
  }

  public Integer getPzsumme() {
    return pzsumme;
  }

  public void setPzsumme(Integer pzsumme) {
    this.pzsumme = pzsumme;
  }

  public String getStichwort() {
    return stichwort;
  }

  public void setStichwort(String stichwort) {
    this.stichwort = stichwort;
  }

  public String getFilterkuerzel() {
    return filterkuerzel;
  }

  public void setFilterkuerzel(String filterkuerzel) {
    this.filterkuerzel = filterkuerzel;
  }
}
