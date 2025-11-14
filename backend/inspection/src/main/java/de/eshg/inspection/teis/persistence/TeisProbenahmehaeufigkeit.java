/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.teis.persistence;

import de.eshg.inspection.teis.persistence.interfaces.HasParameterart;
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
@Table(indexes = {@Index(columnList = "verordnung_zid"), @Index(columnList = "parameterart_zid")})
public class TeisProbenahmehaeufigkeit extends TeisEntity implements HasParameterart {

  @Column
  @DataSensitivity(SensitivityLevel.PUBLIC)
  Integer wasserVolumenMin;

  @Column
  @DataSensitivity(SensitivityLevel.PUBLIC)
  Integer wasserVolumenMax;

  @Column
  @DataSensitivity(SensitivityLevel.PUBLIC)
  String operatorMin;

  @Column
  @DataSensitivity(SensitivityLevel.PUBLIC)
  String operatorMax;

  @Column
  @DataSensitivity(SensitivityLevel.PUBLIC)
  Integer fixanzahl;

  @Column
  @DataSensitivity(SensitivityLevel.PUBLIC)
  Integer fixbasis;

  @Column
  @DataSensitivity(SensitivityLevel.PUBLIC)
  Integer varanzahl;

  @Column
  @DataSensitivity(SensitivityLevel.PUBLIC)
  Integer varbasis;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "verordnung_zid")
  @DataSensitivity(SensitivityLevel.PUBLIC)
  TeisListe verordnung;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "parameterart_zid")
  @DataSensitivity(SensitivityLevel.PUBLIC)
  TeisListe parameterart;

  public Integer getWasserVolumenMin() {
    return wasserVolumenMin;
  }

  public void setWasserVolumenMin(Integer wasserVolumenMin) {
    this.wasserVolumenMin = wasserVolumenMin;
  }

  public Integer getWasserVolumenMax() {
    return wasserVolumenMax;
  }

  public void setWasserVolumenMax(Integer wasserVolumenMax) {
    this.wasserVolumenMax = wasserVolumenMax;
  }

  public String getOperatorMin() {
    return operatorMin;
  }

  public void setOperatorMin(String operatorMin) {
    this.operatorMin = operatorMin;
  }

  public String getOperatorMax() {
    return operatorMax;
  }

  public void setOperatorMax(String operatorMax) {
    this.operatorMax = operatorMax;
  }

  public Integer getFixanzahl() {
    return fixanzahl;
  }

  public void setFixanzahl(Integer fixanzahl) {
    this.fixanzahl = fixanzahl;
  }

  public Integer getFixbasis() {
    return fixbasis;
  }

  public void setFixbasis(Integer fixbasis) {
    this.fixbasis = fixbasis;
  }

  public Integer getVaranzahl() {
    return varanzahl;
  }

  public void setVaranzahl(Integer varanzahl) {
    this.varanzahl = varanzahl;
  }

  public Integer getVarbasis() {
    return varbasis;
  }

  public void setVarbasis(Integer varbasis) {
    this.varbasis = varbasis;
  }

  public TeisListe getVerordnung() {
    return verordnung;
  }

  public void setVerordnung(TeisListe verordnung) {
    this.verordnung = verordnung;
  }

  public TeisListe getParameterart() {
    return parameterart;
  }

  public void setParameterart(TeisListe parameterart) {
    this.parameterart = parameterart;
  }
}
