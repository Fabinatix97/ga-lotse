/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.medicalregistry.domain.model;

import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.Entity;
import jakarta.validation.constraints.NotNull;
import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.PostgreSQLEnumJdbcType;

@Entity
public class MedicalRegistryEntryChange extends MedicalRegistryEntry {

  @NotNull
  @JdbcType(PostgreSQLEnumJdbcType.class)
  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  private TypeOfChange typeOfChange;

  public TypeOfChange getTypeOfChange() {
    return typeOfChange;
  }

  public void setTypeOfChange(TypeOfChange typeOfChange) {
    this.typeOfChange = typeOfChange;
  }
}
