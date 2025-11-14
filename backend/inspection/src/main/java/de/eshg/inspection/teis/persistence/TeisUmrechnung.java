/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.teis.persistence;

import de.eshg.inspection.teis.persistence.interfaces.HasWert;
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
@Table(indexes = {@Index(columnList = "einheit_von_zid"), @Index(columnList = "einheit_nach_zid")})
public class TeisUmrechnung extends TeisEntity implements HasWert {
  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "einheit_von_zid")
  @DataSensitivity(SensitivityLevel.PUBLIC)
  TeisEinheit einheitVon;

  @Column
  @DataSensitivity(SensitivityLevel.PUBLIC)
  Double wert;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "einheit_nach_zid")
  @DataSensitivity(SensitivityLevel.PUBLIC)
  TeisEinheit einheitNach;

  public TeisEinheit getEinheitVon() {
    return einheitVon;
  }

  public void setEinheitVon(TeisEinheit einheitVon) {
    this.einheitVon = einheitVon;
  }

  public Double getWert() {
    return wert;
  }

  public void setWert(Double wert) {
    this.wert = wert;
  }

  public TeisEinheit getEinheitNach() {
    return einheitNach;
  }

  public void setEinheitNach(TeisEinheit einheitNach) {
    this.einheitNach = einheitNach;
  }
}
