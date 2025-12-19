/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
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
}
