/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.teis.persistence;

import de.eshg.inspection.teis.persistence.interfaces.HasEinheit;
import de.eshg.inspection.teis.persistence.interfaces.HasParameter;
import de.eshg.inspection.teis.persistence.interfaces.HasParameterart;
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
@Table(
    indexes = {
      @Index(columnList = "untersuchungsumfang_zid"),
      @Index(columnList = "parameter_zid"),
      @Index(columnList = "einheit_zid"),
      @Index(columnList = "parameterart_zid")
    })
public class TeisUntersuchungsparameter extends TeisEntity
    implements HasEinheit, HasParameter, HasParameterart, HasStichwort {

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "untersuchungsumfang_zid")
  @DataSensitivity(SensitivityLevel.PUBLIC)
  TeisUntersuchungsumfang untersuchungsumfang;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "parameter_zid")
  @DataSensitivity(SensitivityLevel.PUBLIC)
  TeisParameter parameter;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "einheit_zid")
  @DataSensitivity(SensitivityLevel.PUBLIC)
  TeisEinheit einheit;

  @Column
  @DataSensitivity(SensitivityLevel.PUBLIC)
  Integer position;

  @Column
  @DataSensitivity(SensitivityLevel.PUBLIC)
  Double obgrenzwert;

  @Column
  @DataSensitivity(SensitivityLevel.PUBLIC)
  Double untgrenzwert;

  @Column
  @DataSensitivity(SensitivityLevel.PUBLIC)
  String grenzwertText;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "parameterart_zid")
  @DataSensitivity(SensitivityLevel.PUBLIC)
  TeisListe parameterart;

  @Column
  @DataSensitivity(SensitivityLevel.PUBLIC)
  String stichwort;

  public TeisUntersuchungsumfang getUntersuchungsumfang() {
    return untersuchungsumfang;
  }

  public void setUntersuchungsumfang(TeisUntersuchungsumfang untersuchungsumfang) {
    this.untersuchungsumfang = untersuchungsumfang;
  }

  public TeisParameter getParameter() {
    return parameter;
  }

  public void setParameter(TeisParameter parameter) {
    this.parameter = parameter;
  }

  public TeisEinheit getEinheit() {
    return einheit;
  }

  public void setEinheit(TeisEinheit einheit) {
    this.einheit = einheit;
  }

  public Integer getPosition() {
    return position;
  }

  public void setPosition(Integer position) {
    this.position = position;
  }

  public Double getObgrenzwert() {
    return obgrenzwert;
  }

  public void setObgrenzwert(Double obgrenzwert) {
    this.obgrenzwert = obgrenzwert;
  }

  public Double getUntgrenzwert() {
    return untgrenzwert;
  }

  public void setUntgrenzwert(Double untgrenzwert) {
    this.untgrenzwert = untgrenzwert;
  }

  public String getGrenzwertText() {
    return grenzwertText;
  }

  public void setGrenzwertText(String grenzwertText) {
    this.grenzwertText = grenzwertText;
  }

  public TeisListe getParameterart() {
    return parameterart;
  }

  public void setParameterart(TeisListe parameterart) {
    this.parameterart = parameterart;
  }

  @Override
  public String getStichwort() {
    return stichwort;
  }

  @Override
  public void setStichwort(String stichwort) {
    this.stichwort = stichwort;
  }
}
