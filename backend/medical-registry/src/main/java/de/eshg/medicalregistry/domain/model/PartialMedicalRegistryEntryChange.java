/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.medicalregistry.domain.model;

import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import de.eshg.lib.procedure.domain.model.TriggerType;
import jakarta.persistence.Entity;
import jakarta.validation.constraints.NotNull;
import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.PostgreSQLEnumJdbcType;

@Entity
public non-sealed class PartialMedicalRegistryEntryChange extends MedicalRegistryEntryChange {

  @NotNull
  @JdbcType(PostgreSQLEnumJdbcType.class)
  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  private TypeOfPartialMedicalRegistryEntryChange typeOfPartialChange;

  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  private Boolean employeesEmployed;

  protected PartialMedicalRegistryEntryChange() {
    super();
  }

  public PartialMedicalRegistryEntryChange(TriggerType triggerType) {
    super(triggerType);
  }

  @Override
  public TypeOfChange getTypeOfChange() {
    return typeOfPartialChange.getTypeOfChange();
  }

  public void setTypeOfPartialChange(TypeOfPartialMedicalRegistryEntryChange typeOfChange) {
    this.typeOfPartialChange = typeOfChange;
  }

  public Boolean getEmployeesEmployed() {
    return employeesEmployed;
  }

  public void setEmployeesEmployed(Boolean employeesEmployed) {
    this.employeesEmployed = employeesEmployed;
  }
}
