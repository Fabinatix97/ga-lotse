/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.medicalregistry.domain.model;

import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import de.eshg.lib.procedure.domain.model.TriggerType;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.OneToOne;

@Entity
public class MedicalRegistryEntry extends MedicalRegistryProcedure {

  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  @Column(nullable = false)
  private boolean employeesEmployed;

  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  @OneToOne(
      orphanRemoval = true,
      cascade = CascadeType.PERSIST,
      optional = false,
      fetch = FetchType.LAZY)
  private ProfessionInformation professionInformation;

  public MedicalRegistryEntry() {}

  public MedicalRegistryEntry(TriggerType triggerType) {
    super(triggerType);
  }

  public boolean isEmployeesEmployed() {
    return employeesEmployed;
  }

  public void setEmployeesEmployed(boolean employeesEmployed) {
    this.employeesEmployed = employeesEmployed;
  }

  public ProfessionInformation getProfessionInformation() {
    return professionInformation;
  }

  public void setProfessionInformation(ProfessionInformation professionInformation) {
    this.professionInformation = professionInformation;
  }
}
