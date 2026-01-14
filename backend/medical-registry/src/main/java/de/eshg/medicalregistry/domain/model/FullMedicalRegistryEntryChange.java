/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.medicalregistry.domain.model;

import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import de.eshg.lib.procedure.domain.model.TriggerType;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.OneToOne;
import jakarta.validation.constraints.NotNull;
import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.PostgreSQLEnumJdbcType;

@Entity
public non-sealed class FullMedicalRegistryEntryChange extends MedicalRegistryEntryChange {

  @OneToOne(
      orphanRemoval = true,
      cascade = CascadeType.PERSIST,
      optional = false,
      fetch = FetchType.LAZY)
  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  private ProfessionInformation professionInformation;

  @NotNull
  @JdbcType(PostgreSQLEnumJdbcType.class)
  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  private TypeOfFullMedicalRegistryEntryChange typeOfFullChange;

  public FullMedicalRegistryEntryChange() {}

  public FullMedicalRegistryEntryChange(TriggerType triggerType) {
    super(triggerType);
  }

  @Override
  public TypeOfChange getTypeOfChange() {
    return typeOfFullChange.getTypeOfChange();
  }

  public ProfessionInformation getProfessionInformation() {
    return professionInformation;
  }

  public void setProfessionInformation(ProfessionInformation professionInformation) {
    this.professionInformation = professionInformation;
  }

  public void setTypeOfFullChange(TypeOfFullMedicalRegistryEntryChange typeOfFullProcedureChange) {
    this.typeOfFullChange = typeOfFullProcedureChange;
  }
}
