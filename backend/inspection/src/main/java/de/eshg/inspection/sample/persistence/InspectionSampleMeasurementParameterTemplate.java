/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.sample.persistence;

import de.eshg.domain.model.BaseEntity;
import de.eshg.inspection.teis.persistence.TeisParameter;
import de.eshg.inspection.teis.persistence.TeisUntersuchungsparameter;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(
    indexes = {
      @Index(columnList = "teis_parameter_zid"),
      @Index(columnList = "teis_untersuchungsparameter_zid")
    })
public class InspectionSampleMeasurementParameterTemplate extends BaseEntity {

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @NotNull
  @JoinColumn(name = "teis_parameter_zid")
  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  TeisParameter teisParameter;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "teis_untersuchungsparameter_zid")
  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  TeisUntersuchungsparameter teisUntersuchungsparameter;

  @Column
  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  String parameterGroup;

  public String getParameterGroup() {
    return parameterGroup;
  }

  public void setParameterGroup(String parameterGroup) {
    this.parameterGroup = parameterGroup;
  }

  public @NotNull TeisParameter getTeisParameter() {
    return teisParameter;
  }

  public void setTeisParameter(@NotNull TeisParameter teisParameter) {
    this.teisParameter = teisParameter;
  }

  public TeisUntersuchungsparameter getTeisUntersuchungsparameter() {
    return teisUntersuchungsparameter;
  }

  public void setTeisUntersuchungsparameter(TeisUntersuchungsparameter teisUntersuchungsparameter) {
    this.teisUntersuchungsparameter = teisUntersuchungsparameter;
  }
}
