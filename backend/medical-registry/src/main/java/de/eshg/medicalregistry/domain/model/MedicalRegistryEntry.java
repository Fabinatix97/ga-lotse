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
import java.util.List;
import java.util.stream.Collectors;

@Entity
public class MedicalRegistryEntry extends MedicalRegistryProcedure {

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

  @Override
  public List<Employee> getEmployees() {
    return super.getEmployees().stream()
        .filter(Employee.class::isInstance)
        .map(Employee.class::cast)
        .collect(Collectors.toList());
  }

  public ProfessionInformation getProfessionInformation() {
    return professionInformation;
  }

  public void setProfessionInformation(ProfessionInformation professionInformation) {
    this.professionInformation = professionInformation;
  }
}
